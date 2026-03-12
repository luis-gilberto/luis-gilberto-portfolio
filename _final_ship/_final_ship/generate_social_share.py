from PIL import Image, ImageOps, ImageDraw, ImageFont
from pathlib import Path

root = Path(__file__).resolve().parent
bg_path = root / 'deploy' / 'assets' / 'images' / 'og-preview.jpg'
if not bg_path.exists():
    alt = root / 'assets' / 'images' / 'og-preview.jpg'
    if alt.exists():
        bg_path = alt
logo_path = root / 'deploy' / 'assets' / 'images' / 'logo-lockup.png'
out_path = root / 'deploy' / 'assets' / 'images' / 'social-share.jpg'

if bg_path.exists():
    bg = Image.open(bg_path).convert('RGB')
    bg = ImageOps.fit(bg, (1200, 630), method=Image.LANCZOS, centering=(0.5, 0.5))
else:
    bg = Image.new('RGB', (1200, 630), (10, 10, 10))

logo = Image.open(logo_path).convert('RGBA')
lw = 200
lh = int(logo.height * (lw / logo.width))
logo = logo.resize((lw, lh), Image.LANCZOS)
bg.paste(logo, (40, 40), mask=logo)

draw = ImageDraw.Draw(bg)

def load_font(pref_names, size):
    for name in pref_names:
        try:
            return ImageFont.truetype(name, size)
        except Exception:
            continue
    return ImageFont.load_default()

white = (255, 255, 255)
coral = (255, 107, 107)

title_font = load_font([
    'C:/Windows/Fonts/arialbd.ttf',
    'C:/Windows/Fonts/Arial Bold.ttf',
    'C:/Windows/Fonts/segoeuib.ttf'
], 80)
sub_font = load_font([
    'C:/Windows/Fonts/arial.ttf',
    'C:/Windows/Fonts/Segoe UI.ttf'
], 40)

main_text = 'Review for Alex'
sub_text = 'TextSelect Staging Hub'

W, H = bg.size
tw, th = draw.textbbox((0,0), main_text, font=title_font)[2:]
sw, sh = draw.textbbox((0,0), sub_text, font=sub_font)[2:]

main_x = (W - tw) // 2
main_y = (H - (th + sh + 10)) // 2
sub_x = (W - sw) // 2
sub_y = main_y + th + 10

draw.text((main_x, main_y), main_text, fill=white, font=title_font)
draw.text((sub_x, sub_y), sub_text, fill=coral, font=sub_font)

out_path.parent.mkdir(parents=True, exist_ok=True)
bg.save(out_path, format='JPEG', quality=92)
