import argparse
import json
import os
import sys
import time
import subprocess
from pathlib import Path

import numpy as np

try:
    import cv2
except Exception:
    cv2 = None

def read_config(path):
    if not path:
        return {}
    if not os.path.exists(path):
        return {}
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def detect_bars_gray(gray, threshold, min_run):
    h, w = gray.shape
    row_mean = gray.mean(axis=1)
    col_mean = gray.mean(axis=0)
    t = threshold
    top = 0
    for i in range(h):
        if row_mean[i] > t:
            break
        top += 1
    bottom = 0
    for i in range(h - 1, -1, -1):
        if row_mean[i] > t:
            break
        bottom += 1
    left = 0
    for i in range(w):
        if col_mean[i] > t:
            break
        left += 1
    right = 0
    for i in range(w - 1, -1, -1):
        if col_mean[i] > t:
            break
        right += 1
    if top < min_run:
        top = 0
    if bottom < min_run:
        bottom = 0
    if left < min_run:
        left = 0
    if right < min_run:
        right = 0
    return top, bottom, left, right

def make_gradient(length):
    if length <= 0:
        return None
    x = np.linspace(0.0, 1.0, length, dtype=np.float32)
    return x

def blend_vertical(frame, top_h, bottom_h, edge_h, sigma, intensity):
    h, w, _ = frame.shape
    out = frame.copy()
    if top_h > 0:
        src_start = top_h
        src_end = min(src_start + edge_h, h)
        strip = out[src_start:src_end, :, :]
        m = strip[::-1]
        b = cv2.GaussianBlur(m, (0, 0), sigma) if sigma > 0 else m
        g = make_gradient(top_h)
        if g is not None:
            g = g[:, None, None]
            g = np.clip(g * intensity, 0.0, 1.0)
            b_resized = cv2.resize(b, (w, top_h), interpolation=cv2.INTER_LINEAR)
            out[:top_h, :, :] = (b_resized * g + out[:top_h, :, :] * (1.0 - g)).astype(np.uint8)
        else:
            out[:top_h, :, :] = cv2.resize(b, (w, top_h), interpolation=cv2.INTER_LINEAR)
    if bottom_h > 0:
        src_end = h - bottom_h
        src_start = max(src_end - edge_h, 0)
        strip = out[src_start:src_end, :, :]
        m = strip[::-1]
        b = cv2.GaussianBlur(m, (0, 0), sigma) if sigma > 0 else m
        g = make_gradient(bottom_h)
        if g is not None:
            g = g[:, None, None]
            g = np.clip(g * intensity, 0.0, 1.0)
            b_resized = cv2.resize(b, (w, bottom_h), interpolation=cv2.INTER_LINEAR)
            blended = (b_resized * g + out[h - bottom_h:h, :, :] * (1.0 - g)).astype(np.uint8)
            out[h - bottom_h:h, :, :] = blended
        else:
            out[h - bottom_h:h, :, :] = cv2.resize(b, (w, bottom_h), interpolation=cv2.INTER_LINEAR)
    return out

def blend_horizontal(frame, left_w, right_w, edge_w, sigma, intensity):
    h, w, _ = frame.shape
    out = frame.copy()
    if left_w > 0:
        src_start = left_w
        src_end = min(src_start + edge_w, w)
        strip = out[:, src_start:src_end, :]
        m = strip[:, ::-1, :]
        b = cv2.GaussianBlur(m, (0, 0), sigma) if sigma > 0 else m
        g = make_gradient(left_w)
        if g is not None:
            g = g[None, :, None]
            g = np.clip(g * intensity, 0.0, 1.0)
            b_resized = cv2.resize(b, (left_w, h), interpolation=cv2.INTER_LINEAR)
            out[:, :left_w, :] = (b_resized * g + out[:, :left_w, :] * (1.0 - g)).astype(np.uint8)
        else:
            out[:, :left_w, :] = cv2.resize(b, (left_w, h), interpolation=cv2.INTER_LINEAR)
    if right_w > 0:
        src_end = w - right_w
        src_start = max(src_end - edge_w, 0)
        strip = out[:, src_start:src_end, :]
        m = strip[:, ::-1, :]
        b = cv2.GaussianBlur(m, (0, 0), sigma) if sigma > 0 else m
        g = make_gradient(right_w)
        if g is not None:
            g = g[None, :, None]
            g = np.clip(g * intensity, 0.0, 1.0)
            b_resized = cv2.resize(b, (right_w, h), interpolation=cv2.INTER_LINEAR)
            blended = (b_resized * g + out[:, w - right_w:w, :] * (1.0 - g)).astype(np.uint8)
            out[:, w - right_w:w, :] = blended
        else:
            out[:, w - right_w:w, :] = cv2.resize(b, (right_w, h), interpolation=cv2.INTER_LINEAR)
    return out

def process_video(input_path, output_path, fmt, cfg):
    if cv2 is None:
        raise RuntimeError('opencv-python is required')
    cap = cv2.VideoCapture(input_path)
    if not cap.isOpened():
        raise RuntimeError('failed to open input video')
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fourcc = cv2.VideoWriter_fourcc(*('mp4v' if fmt == 'mp4' else 'avc1'))
    tmp_out = str(Path(output_path).with_suffix('.tmp.mp4'))
    writer = cv2.VideoWriter(tmp_out, fourcc, fps, (w, h))
    start = time.time()
    ema_top = 0.0
    ema_bottom = 0.0
    ema_left = 0.0
    ema_right = 0.0
    alpha = float(cfg.get('temporal_smoothing', 0.6))
    threshold_factor = float(cfg.get('black_threshold_factor', 0.08))
    min_run = int(cfg.get('min_bar_thickness', 8))
    edge_h = int(cfg.get('edge_sample', 64))
    edge_w = int(cfg.get('edge_sample', 64))
    sigma = float(cfg.get('blur_sigma', 6.0))
    intensity = float(cfg.get('blend_intensity', 1.0))
    override = cfg.get('manual_override', None)
    fallback = cfg.get('fallback', 'original')
    frames = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        t = max(5.0, gray.mean() * threshold_factor)
        if override:
            top = int(override.get('top', 0))
            bottom = int(override.get('bottom', 0))
            left = int(override.get('left', 0))
            right = int(override.get('right', 0))
        else:
            top, bottom, left, right = detect_bars_gray(gray, t, min_run)
        ema_top = alpha * ema_top + (1 - alpha) * top
        ema_bottom = alpha * ema_bottom + (1 - alpha) * bottom
        ema_left = alpha * ema_left + (1 - alpha) * left
        ema_right = alpha * ema_right + (1 - alpha) * right
        top_i = int(round(ema_top))
        bottom_i = int(round(ema_bottom))
        left_i = int(round(ema_left))
        right_i = int(round(ema_right))
        try:
            if (top_i + bottom_i) >= (left_i + right_i):
                out = blend_vertical(frame, top_i, bottom_i, edge_h, sigma, intensity)
            else:
                out = blend_horizontal(frame, left_i, right_i, edge_w, sigma, intensity)
        except Exception:
            if fallback == 'blur':
                out = cv2.GaussianBlur(frame, (0, 0), sigma)
            elif fallback == 'color':
                bg = int(cfg.get('fallback_color', 0))
                out = np.full_like(frame, bg)
            else:
                out = frame
        writer.write(out)
        frames += 1
    writer.release()
    cap.release()
    elapsed = time.time() - start
    speed = frames / elapsed if elapsed > 0 else 0.0
    preserve = bool(cfg.get('preserve_metadata', True))
    final_out = output_path
    if preserve and shutil_available():
        copy_metadata(tmp_out, input_path, final_out, fmt)
        if os.path.exists(tmp_out):
            os.remove(tmp_out)
    else:
        os.replace(tmp_out, final_out)
    return {'frames': frames, 'elapsed_sec': elapsed, 'fps': speed}

def shutil_available():
    return True

def ffprobe_streams(path):
    try:
        cmd = ['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=pix_fmt,color_space,color_transfer,color_primaries,avg_frame_rate', '-of', 'json', path]
        out = subprocess.check_output(cmd, stderr=subprocess.STDOUT)
        data = json.loads(out.decode('utf-8'))
        return data
    except Exception:
        return {}

def copy_metadata(processed, original, output, fmt):
    meta = ffprobe_streams(original)
    args = ['ffmpeg', '-y', '-i', processed, '-i', original, '-map', '0', '-map_metadata', '1']
    if fmt == 'mov':
        args += ['-c:v', 'prores_ks']
    else:
        args += ['-c:v', 'copy', '-c:a', 'copy']
    if meta and 'streams' in meta and meta['streams']:
        s = meta['streams'][0]
        if s.get('color_space'):
            args += ['-colorspace', s['color_space']]
        if s.get('color_transfer'):
            args += ['-color_trc', s['color_transfer']]
        if s.get('color_primaries'):
            args += ['-color_primaries', s['color_primaries']]
    args += [output]
    try:
        subprocess.check_call(args)
    except Exception:
        os.replace(processed, output)

def make_qc_preview(input_path, output_path, cfg):
    if cv2 is None:
        raise RuntimeError('opencv-python is required')
    cap = cv2.VideoCapture(input_path)
    if not cap.isOpened():
        raise RuntimeError('failed to open input video')
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fourcc = cv2.VideoWriter_fourcc(*('mp4v'))
    writer = cv2.VideoWriter(output_path, fourcc, fps, (w * 2, h))
    edge_h = int(cfg.get('edge_sample', 64))
    edge_w = int(cfg.get('edge_sample', 64))
    sigma = float(cfg.get('blur_sigma', 6.0))
    intensity = float(cfg.get('blend_intensity', 1.0))
    threshold_factor = float(cfg.get('black_threshold_factor', 0.08))
    min_run = int(cfg.get('min_bar_thickness', 8))
    alpha = float(cfg.get('temporal_smoothing', 0.6))
    ema_top = ema_bottom = ema_left = ema_right = 0.0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        t = max(5.0, gray.mean() * threshold_factor)
        top, bottom, left, right = detect_bars_gray(gray, t, min_run)
        ema_top = alpha * ema_top + (1 - alpha) * top
        ema_bottom = alpha * ema_bottom + (1 - alpha) * bottom
        ema_left = alpha * ema_left + (1 - alpha) * left
        ema_right = alpha * ema_right + (1 - alpha) * right
        top_i = int(round(ema_top))
        bottom_i = int(round(ema_bottom))
        left_i = int(round(ema_left))
        right_i = int(round(ema_right))
        if (top_i + bottom_i) >= (left_i + right_i):
            out = blend_vertical(frame, top_i, bottom_i, edge_h, sigma, intensity)
        else:
            out = blend_horizontal(frame, left_i, right_i, edge_w, sigma, intensity)
        canvas = np.zeros((h, w * 2, 3), dtype=np.uint8)
        canvas[:, :w, :] = frame
        canvas[:, w:, :] = out
        writer.write(canvas)
    writer.release()
    cap.release()

def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument('--input', required=True)
    p.add_argument('--output', required=True)
    p.add_argument('--format', default='mp4')
    p.add_argument('--config', default='')
    p.add_argument('--qc_preview', default='')
    return p.parse_args()

def main():
    args = parse_args()
    cfg = read_config(args.config)
    metrics = process_video(args.input, args.output, args.format, cfg)
    if args.qc_preview:
        make_qc_preview(args.input, args.qc_preview, cfg)
    print(json.dumps({'output': args.output, 'metrics': metrics}))

if __name__ == '__main__':
    main()
