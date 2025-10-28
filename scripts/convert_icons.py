"""
Download icon images and convert black backgrounds to transparent PNGs.

This script fetches remote icon assets referenced in the Insights article and
produces transparent-background PNGs saved under assets/images/icons/.

Assumptions:
- Background is near-black (RGB channels below a configurable threshold).
- Icons may contain black strokes; to avoid over-conversion, we only clear
  fully black or near-black pixels, which typically represent the flat backdrop.

Usage:
  python scripts/convert_icons.py

Requirements:
  pip install requests pillow
"""

import os
import sys
from io import BytesIO
from typing import Dict

try:
    import requests
    from PIL import Image
except Exception as e:
    print("[ERROR] Required packages not found. Please install with:\n  pip install requests pillow")
    sys.exit(1)


# Map of descriptive filenames to remote URLs (from the article)
ICON_SOURCES: Dict[str, str] = {
    # Page 1 hero + Page 6 margin
    "vision": "https://page.gensparksite.com/v1/base64_upload/194c643ba37a1deeb68b8f94d4349993",
    # Page 1 right margin, Page 4 hub-card StrategyIQ
    "connected-systems": "https://page.gensparksite.com/v1/base64_upload/b54c8f3398a738a4378f4ba1309e7a1a",
    # Page 2 hero
    "strategy": "https://page.gensparksite.com/v1/base64_upload/700d7579f5fd74efaef92a48858113af",
    # Page 2 right margin, Page 4 hub-card Advisory
    "navigation": "https://page.gensparksite.com/v1/base64_upload/677d525ee9a442677491ea0067b3b69f",
    # Page 3 left margin, Page 4 hub-card ScopeIQ
    "vision-tools": "https://page.gensparksite.com/v1/base64_upload/a008fc8f1d9289461262030b729842f6",
    # Page 3 hero, Page 4 right margin
    "tactical-execution": "https://page.gensparksite.com/v1/base64_upload/db75116cf5bfc53b0820b09f5fc1c260",
    # Page 3 right margin, Page 4 hub-card IMC Services
    "automation": "https://page.gensparksite.com/v1/base64_upload/65f92d0cc91405472c7aecb51c7b7845",
}


OUTPUT_DIR = os.path.join("assets", "images", "icons")


def ensure_output_dir() -> None:
    os.makedirs(OUTPUT_DIR, exist_ok=True)


def download_image(url: str) -> Image.Image:
    resp = requests.get(url, timeout=30)
    resp.raise_for_status()
    img = Image.open(BytesIO(resp.content))
    # Standardize to RGBA for alpha operations
    if img.mode != "RGBA":
        img = img.convert("RGBA")
    return img


def convert_black_to_transparent(img: Image.Image, threshold: int = 12) -> Image.Image:
    """
    Convert near-black pixels to fully transparent.
    threshold: max channel value to be considered black (0..255). Default 12.
    """
    datas = img.getdata()
    new_data = []
    for r, g, b, a in datas:
        if r <= threshold and g <= threshold and b <= threshold:
            # Treat as background; clear alpha
            new_data.append((r, g, b, 0))
        else:
            new_data.append((r, g, b, a))
    img.putdata(new_data)
    return img


def process_icon(name: str, url: str) -> str:
    print(f"[INFO] Processing {name} from {url}")
    img = download_image(url)
    converted = convert_black_to_transparent(img)
    out_path = os.path.join(OUTPUT_DIR, f"{name}.png")
    converted.save(out_path, format="PNG")
    print(f"[OK] Saved transparent PNG: {out_path} ({converted.size[0]}x{converted.size[1]})")
    return out_path


def main():
    ensure_output_dir()
    results = []
    for name, url in ICON_SOURCES.items():
        try:
            out = process_icon(name, url)
            results.append(out)
        except Exception as e:
            print(f"[ERROR] Failed to process {name}: {e}")
    print("\n[SUMMARY] Converted icons:")
    for path in results:
        print(f" - {path}")


if __name__ == "__main__":
    main()

