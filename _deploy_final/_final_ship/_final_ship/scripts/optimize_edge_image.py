from PIL import Image
import os

def optimize_png_in_place(path: str):
    print(f"Loading: {path}")
    im = Image.open(path)
    print(f"Original mode: {im.mode} size: {im.size}")
    try:
        if im.mode == 'RGBA':
            # Preserve alpha channel; save optimized PNG
            im.save(path, optimize=True, compress_level=9)
            print("Saved optimized RGBA PNG in place.")
        else:
            # Quantize to reduce size while keeping acceptable visual quality
            q = im.convert('RGB').quantize(colors=256, method=Image.MEDIANCUT)
            q.save(path, optimize=True, compress_level=9)
            print("Saved optimized quantized PNG in place.")
    except Exception as e:
        print("Optimization error:", e)

if __name__ == "__main__":
    target = os.path.join(
        os.path.dirname(__file__),
        '..', 'insights', 'assets', 'images', 'Edge-mobile_hero_image_BG.png'
    )
    target = os.path.abspath(target)
    optimize_png_in_place(target)
