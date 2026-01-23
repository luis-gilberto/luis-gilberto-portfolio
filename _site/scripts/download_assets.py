"""
Download external (non-icon) image assets to local paths for offline usage.

This script is intentionally simple and uses only standard library modules.
Run:
  python scripts/download_assets.py

Outputs:
  - assets/images/og/personal-reset-hero.png
  - assets/images/og/editorial-reference-hero.png
  - assets/images/og/working-example-hero-bg.png
"""

import os
import urllib.request


ASSETS = {
    # Editorial hero image used in Personal Reset page
    "personal-reset-hero": (
        "https://page.gensparksite.com/v1/base64_upload/12b389b99f060aaeb1634ca5514263e2",
        os.path.join("assets", "images", "og", "personal-reset-hero.png"),
    ),
    # Same image referenced in editorial_reference_code.html for documentation
    "editorial-reference-hero": (
        "https://page.gensparksite.com/v1/base64_upload/12b389b99f060aaeb1634ca5514263e2",
        os.path.join("assets", "images", "og", "editorial-reference-hero.png"),
    ),
    # Background image example used in a working example component
    "working-example-hero-bg": (
        "https://page.gensparksite.com/v1/base64_upload/b758503bcc35fc15c359cdd12d069ce1",
        os.path.join("assets", "images", "og", "working-example-hero-bg.png"),
    ),
}


def ensure_dir(path: str) -> None:
    directory = os.path.dirname(path)
    if directory and not os.path.exists(directory):
        os.makedirs(directory, exist_ok=True)


def download(url: str, dest: str) -> None:
    ensure_dir(dest)
    print(f"[DOWNLOAD] {url} -> {dest}")
    try:
        # Use urlretrieve for simplicity and reliability
        urllib.request.urlretrieve(url, dest)
        size = os.path.getsize(dest)
        print(f"  ✅ Saved ({size} bytes)")
    except Exception as e:
        print(f"  ❌ Failed: {e}")


def main() -> None:
    print("\n== Download External Assets ==")
    for name, (url, dest) in ASSETS.items():
        print(f"\n- {name}")
        download(url, dest)
    print("\n[SUMMARY] Completed downloads.")


if __name__ == "__main__":
    main()

