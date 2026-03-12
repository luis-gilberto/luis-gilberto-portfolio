# Letterbox Concealer

## Run

```
python tools/video/letterbox_concealer.py --input <in> --output <out.mp4> --format mp4 --config tools/video/config_default.json --qc_preview <preview.mp4>
```

## Options

- `black_threshold_factor`: detection threshold factor
- `min_bar_thickness`: minimum pixels to treat as bars
- `edge_sample`: edge sampling thickness
- `blur_sigma`: Gaussian blur sigma
- `blend_intensity`: 0.0–1.0 blending strength
- `temporal_smoothing`: 0–1 exponential smoothing
- `preserve_metadata`: preserve metadata via ffmpeg if available
- `fallback`: `original|blur|color`
- `fallback_color`: grayscale value for color fallback

## Output Formats

- `mp4` (default), `mov` (ProRes), `mkv`, `webm`

## Quality Control

- `--qc_preview` produces a side-by-side preview

