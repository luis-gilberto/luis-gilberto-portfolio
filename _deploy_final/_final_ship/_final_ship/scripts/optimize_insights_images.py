from PIL import Image
import os

def optimize_png(path: str):
    try:
        im = Image.open(path)
        print(f"Optimizing: {path} | mode={im.mode} size={im.size}")
        # Preserve alpha if present; otherwise just save optimized PNG
        if im.mode not in ("RGB", "RGBA"):
            im = im.convert("RGBA") if "A" in im.getbands() else im.convert("RGB")
        im.save(path, optimize=True, compress_level=9)
        print("Saved optimized PNG.")
    except Exception as e:
        print(f"Failed to optimize {path}: {e}")

if __name__ == "__main__":
    root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    targets = [
        os.path.join(root, 'insights', 'assets', 'images', 'Teams_Launch_Hero_Image.png'),
        os.path.join(root, 'insights', 'assets', 'images', '03_Browse_AI.png'),
    ]
    for t in targets:
        if os.path.exists(t):
            optimize_png(t)
        else:
            print("Not found:", t)
