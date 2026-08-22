"""Find embedded matte bands by row luminance."""
from __future__ import annotations

import io
import statistics
import urllib.request

URLS = {
    "A": "https://res.cloudinary.com/dogtoagya/image/upload/v1787069503/Generacion-A_blvrih.png",
    "B": "https://res.cloudinary.com/dogtoagya/image/upload/v1787069497/Generacion-B_v3scfv.png",
    "C": "https://res.cloudinary.com/dogtoagya/image/upload/v1787069578/Generacion-C_ldctxl.png",
    "D": "https://res.cloudinary.com/dogtoagya/image/upload/v1787069496/Generacion-D_quyjwy.png",
}


def row_luma(px, w, y):
    vals = []
    for x in range(0, w, max(1, w // 200)):
        r, g, b, _a = px[x, y]
        vals.append(0.2126 * r + 0.7152 * g + 0.0722 * b)
    return statistics.mean(vals)


def find_edges(px, w, h, thresh=18.0):
    top = 0
    for y in range(h):
        if row_luma(px, w, y) > thresh:
            top = y
            break
    bottom = h - 1
    for y in range(h - 1, -1, -1):
        if row_luma(px, w, y) > thresh:
            bottom = y
            break
    return top, bottom


def main():
    from PIL import Image

    for label, url in URLS.items():
        with urllib.request.urlopen(url, timeout=30) as resp:
            img = Image.open(io.BytesIO(resp.read())).convert("RGBA")
        w, h = img.size
        px = img.load()
        top, bottom = find_edges(px, w, h)
        print(
            label,
            f"{w}x{h}",
            f"top matte {top}px ({top/h*100:.1f}%)",
            f"bottom matte {h-1-bottom}px ({(h-1-bottom)/h*100:.1f}%)",
            f"content height {bottom-top+1}px",
        )


if __name__ == "__main__":
    main()
