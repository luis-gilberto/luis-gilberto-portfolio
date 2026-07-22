"""Generate CSC-only preview HTML from the main portfolio template."""
import re
from pathlib import Path

root = Path(__file__).parent
src = (root / "LG Studio Portfolio Template.html").read_text(encoding="utf-8")

style = re.search(r"<style>([\s\S]*?)</style>", src).group(1)

csc_section = re.search(
    r"(<!-- =+\s*\n\s*01 — CRIAR SIN CULPAS[\s\S]*?</section>)",
    src,
).group(1)

script = re.search(r"<script>\s*// Auto-scale plates[\s\S]*?</script>", src).group(0)

clean_css = """
body { background: var(--lg-ivory); padding: 32px; }
.gallery { max-width: 1600px; gap: 48px; }
.plate { box-shadow: 0 24px 64px rgba(0,0,0,0.12); }
.preview-head {
  max-width: 1600px;
  margin: 0 auto 32px;
  font-family: var(--font-cond);
  font-size: 11px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(23,34,59,0.55);
  text-align: center;
}
.preview-head em {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 300;
  color: var(--lg-terracotta);
  letter-spacing: 0;
  text-transform: none;
  font-size: 14px;
}
"""

html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Criar Sin Culpas · Portfolio Redesign · LG Studio</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;1,9..144,300;1,9..144,400&family=Barlow+Condensed:wght@300;400;500;600&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
{style}
{clean_css}
</style>
</head>
<body>
<p class="preview-head">Criar Sin Culpas · <em>Portfolio redesign</em> · Plate 01 + Plate 02</p>
<main class="gallery">
{csc_section.replace('class="group-label"', 'class="group-label" style="display:none;"', 1)}
</main>
{script}
</body>
</html>
"""

out = root / "LG-Studio-Portfolio-CSC-Redesign.html"
out.write_text(html, encoding="utf-8")
print("wrote", out.name)
