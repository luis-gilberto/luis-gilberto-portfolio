from pathlib import Path
import shutil
import re

root = Path(__file__).resolve().parent
deploy = root / "deploy"

(deploy / "option-a").mkdir(parents=True, exist_ok=True)
(deploy / "option-b").mkdir(parents=True, exist_ok=True)
(deploy / "documents").mkdir(parents=True, exist_ok=True)

def resolve_option_index(label):
    dirs = [
        root / "Projects" / "TextSelect" / f"Option-{label}",
        root / "Projects" / "TextSelect" / f"option-{label.lower()}",
        root / f"Option-{label}",
        root / f"option-{label.lower()}",
    ]
    for d in dirs:
        idx = d / "index.html"
        if idx.exists():
            return idx
    files = [
        root / f"Option-{label}.html",
        root / f"Option {label}.html",
        root / f"option-{label.lower()}.html",
        root / f"option {label.lower()}.html",
    ]
    for f in files:
        if f.exists():
            return f
    return None

def write_placeholder(path, label):
    html = f"""<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>{label}</title><style>body{{margin:0;background:#0a0a0a;color:#e5e5e5;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;display:flex;align-items:center;justify-content:center;height:100vh}}.box{{background:#151515;border:1px solid #262626;border-radius:14px;padding:28px;max-width:540px;text-align:center}}h1{{margin:0 0 8px;font-size:22px}}p{{margin:0 0 14px;color:#9ca3af}}a{{color:#64ffda;text-decoration:none}}</style></head><body><div class=\"box\"><h1>{label}</h1><p>Source file not found. This is a placeholder.</p><a href=\"../\">Back to Staging Hub</a></div></body></html>"""
    path.write_text(html, encoding="utf-8")

src_a = resolve_option_index("A")
dst_a = deploy / "option-a" / "index.html"
if src_a:
    shutil.copyfile(src_a, dst_a)
else:
    write_placeholder(dst_a, "Concept A: The Ecosystem")

src_b = resolve_option_index("B")
dst_b = deploy / "option-b" / "index.html"
if src_b:
    shutil.copyfile(src_b, dst_b)
else:
    write_placeholder(dst_b, "Concept B: The Utility")

index_html = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Client Staging</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="preload" as="image" href="../assets/images/logo-lockup.png">
<link rel="preload" as="image" href="../assets/images/logo-lockup-dark_3.png">
<style>
:root {
  --bg-light: #F3EFE0;
  --card-light: #FFFFFF;
  --text-light: #1a1a1a;
  --muted-light: #6b6b6b;
  --border-light: rgba(0,0,0,0.08);
  --shadow-light: rgba(0,0,0,0.06);
  --bg-dark: #0a0a0a;
  --card-dark: #151515;
  --text-dark: #e5e5e5;
  --muted-dark: #9ca3af;
  --border-dark: #262626;
  --shadow-dark: rgba(0,0,0,0.35);
  --coral: #FF6B6B;
  --teal: #64ffda;
  --bg: var(--bg-light);
  --card: var(--card-light);
  --text: var(--text-light);
  --muted: var(--muted-light);
  --border: var(--border-light);
  --shadow: var(--shadow-light);
}

[data-theme="dark"] {
  --bg: var(--bg-dark);
  --card: var(--card-dark);
  --text: var(--text-dark);
  --muted: var(--muted-dark);
  --border: var(--border-dark);
  --shadow: var(--shadow-dark);
}

*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--text);font-family:'Inter',system-ui,-apple-system,sans-serif;transition:background-color .4s cubic-bezier(.4,0,.2,1),color .4s cubic-bezier(.4,0,.2,1);min-height:100vh}
.container{max-width:1100px;margin:0 auto;padding:40px 24px}
.header{display:flex;justify-content:space-between;align-items:center;margin-bottom:32px}
.title-section{display:flex;flex-direction:column;gap:16px}
.logo-img{height:39px;width:auto;max-width:360px;object-fit:contain;transition:opacity .3s ease}
.page-title{font-family:'Playfair Display',serif;font-size:32px;letter-spacing:.2px;color:var(--coral)}
.header-actions{display:flex;align-items:center;gap:12px}
.badge{padding:6px 10px;border:1px solid var(--border);border-radius:8px;color:var(--muted);font-size:12px;background:var(--card)}
.theme-toggle{width:56px;height:56px;border-radius:50%;border:1px solid var(--border);background:var(--card);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .3s cubic-bezier(.4,0,.2,1);position:relative;overflow:hidden}
.theme-toggle:hover{border-color:var(--coral);transform:scale(1.05)}
.theme-toggle::before{content:'☀️';font-size:24px;position:absolute;transition:all .4s cubic-bezier(.4,0,.2,1)}
[data-theme="dark"] .theme-toggle::before{content:'🌙'}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px}
.card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:24px;transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease}
.card:hover{transform:translateY(-2px);border-color:var(--coral);box-shadow:0 12px 30px var(--shadow)}
.card h2{margin:0 0 10px;font-size:20px;font-family:'Playfair Display',serif}
.card p{margin:0;color:var(--muted);line-height:1.6}
.cta{margin-top:16px;display:inline-flex;align-items:center;gap:8px;padding:10px 14px;border-radius:10px;background:transparent;border:1px solid var(--border);color:var(--text);text-decoration:none;font-weight:600}
.cta:hover{border-color:var(--coral);color:var(--coral)}
.footer{margin-top:36px;color:var(--muted);font-size:12px;text-align:center}
</style>
</head>
<body>
<div class="container">
<div class="header">
  <div class="title-section">
    <img class="logo-img" src="../assets/images/logo-lockup.png" alt="Luis Gilberto">
    <h1 class="page-title">Client Staging</h1>
  </div>
  <div class="header-actions">
    <div class="badge">Staging Hub</div>
    <button class="theme-toggle" aria-label="Toggle theme"></button>
  </div>
</div>
<div class="grid">
<div class="card">
<h2>The Ecosystem</h2>
<p>High-fidelity, immersive, brand-focused approach. Perfect for storytelling and creating emotional connections with your audience.</p>
<a class="cta" href="./option-a/">Explore Concept A</a>
</div>
<div class="card">
<h2>The Utility</h2>
<p>Clean, developer-centric, conversion-focused approach. Best for clarity and fast comprehension across different roles.</p>
<a class="cta" href="./option-b/">Explore Concept B</a>
</div>
<div class="card">
<h2>Documents</h2>
<p>Final PDFs and deliverables for review.</p>
<a class="cta" href="./documents/">Open Documents</a>
</div>
</div>
<div class="footer">© 2025 Luis Gilberto • Designed with intention</div>
</div>
</div>
<script>
// Theme toggle and dynamic logo switching
const themeToggle = document.querySelector('.theme-toggle');
const htmlEl = document.documentElement;
const logoEl = document.querySelector('.logo-img');
const media = window.matchMedia('(prefers-color-scheme: dark)');
const darkSrc = '../assets/images/logo-lockup.png';
const lightSrc = '../assets/images/logo-lockup-dark_3.png';

function updateLogo(theme) {
  const nextSrc = theme === 'dark' ? darkSrc : lightSrc;
  if (logoEl && !logoEl.src.endsWith(nextSrc)) {
    logoEl.style.opacity = '0';
    const img = new Image();
    img.onload = () => { logoEl.src = nextSrc; logoEl.style.opacity = '1'; };
    img.onerror = () => { logoEl.src = darkSrc; logoEl.style.opacity = '1'; };
    img.src = nextSrc;
  }
}

// preload both logos for smooth switching
new Image().src = darkSrc;
new Image().src = lightSrc;

const saved = localStorage.getItem('theme');
const currentTheme = saved ? saved : (media.matches ? 'dark' : 'light');
htmlEl.setAttribute('data-theme', currentTheme);
updateLogo(currentTheme);

themeToggle.addEventListener('click', () => {
  const next = htmlEl.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  htmlEl.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateLogo(next);
});

// respond to system/browser preference changes when no explicit theme saved
media.addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    const next = e.matches ? 'dark' : 'light';
    htmlEl.setAttribute('data-theme', next);
    updateLogo(next);
  }
});
</script>
</body>
</html>
"""

(deploy / "index.html").write_text(index_html, encoding="utf-8")

# Documents library generation
docs_src = root / "assets" / "docs"
docs_src.mkdir(parents=True, exist_ok=True)
pdfs = sorted(docs_src.glob("*.pdf"))
cards = []

def label_for(name: str) -> str:
    n = name.lower()
    if "invoice" in n: return "INVOICE"
    if "msa" in n or "contract" in n: return "CONTRACT"
    if "report" in n: return "REPORT"
    if "deck" in n or "strategy" in n or "deliverable" in n: return "DELIVERABLE"
    return "DOCUMENT"

for p in pdfs:
    dst = deploy / "documents" / p.name
    try:
        shutil.copyfile(p, dst)
    except Exception:
        continue
    size = dst.stat().st_size
    mtime = dst.stat().st_mtime
    from datetime import datetime
    dstr = datetime.fromtimestamp(mtime).strftime("%b %d, %Y")
    size_mb = size / (1024*1024)
    size_str = (f"{size_mb:.1f} MB" if size_mb >= 0.1 else f"{int(size/1024)} KB")
    cards.append({
        "name": p.name,
        "label": label_for(p.name),
        "date": dstr,
        "size": size_str,
    })

doc_index = """<!doctype html>
<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n<title>Asset Library / Documents</title>\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap\" rel=\"stylesheet\">\n<link href=\"https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@400;600;700&display=swap\" rel=\"stylesheet\">\n<style>\n :root{--bg:#0a0a0a;--card:#151515;--text:#e5e5e5;--muted:#9ca3af;--accent:#64ffda;--border:#262626}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif}.wrap{max-width:1100px;margin:0 auto;padding:40px 24px}.head{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}.title{font-size:calc(16px + 4pt);font-family:'Big Shoulders Display',system-ui,sans-serif;font-weight:700;letter-spacing:.3px;color:#FF6B6B}.subtitle{color:var(--muted)}.upload{padding:6px 10px;border-radius:8px;background:#0f0f0f;border:1px solid var(--border);color:var(--muted);text-decoration:none;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-weight:400;font-size:12px;letter-spacing:normal}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px}.card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:18px;transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease}.card:hover{transform:translateY(-2px);border-color:#333;box-shadow:0 12px 30px rgba(0,0,0,.35)}.label{display:inline-block;margin-bottom:12px;padding:6px 10px;border:1px solid var(--border);border-radius:999px;color:#9ca3af;font-size:12px;background:#0f0f0f}.name{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-weight:400;font-size:calc(16px - 2pt);margin-bottom:8px}.meta{color:var(--muted);font-size:12px}.request{border:2px dashed var(--border);display:flex;align-items:center;justify-content:center;min-height:140px;color:#9ca3af}a.card{text-decoration:none;color:inherit}.logo-img{height:39px;width:auto;max-width:360px;object-fit:contain}.title-text{text-transform:uppercase}\n</style>\n</head>\n<body>\n<div class=\"wrap\">\n<div class=\"head\"><div class=\"title\"><img class=\"logo-img\" src=\"../assets/images/logo-lockup.png\" alt=\"Luis Gilberto logo\"><span class=\"title-text\">/ DOCUMENTS</span></div><a class=\"upload\" href=\"#\">UPLOAD NEW FILE</a></div>\n<div class=\"grid\">\n"""
doc_index = doc_index.replace('<img class=\\"logo-img\\" src=\\"../assets/images/logo-lockup.png\\" alt=\\"Luis Gilberto logo\\">', '')
doc_index = doc_index.replace('.name{', '.name{text-transform:none;')
doc_index = doc_index.replace('<div class=\\"head\\"><div class=\\"title\\">', '<div class=\\"head\\"><div class=\\"title\\">')

doc_index = f"""<!doctype html>
<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n<title>Asset Library / Documents</title>\n<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap\" rel=\"stylesheet\">\n<style>\n:root{{--bg-light:#F3EFE0;--card-light:#FFFFFF;--text-light:#1a1a1a;--muted-light:#6b6b6b;--border-light:rgba(0,0,0,0.08);--shadow-light:rgba(0,0,0,0.06);--bg-dark:#0a0a0a;--card-dark:#151515;--text-dark:#e5e5e5;--muted-dark:#9ca3af;--border-dark:#262626;--shadow-dark:rgba(0,0,0,0.35);--coral:#FF6B6B;--teal:#64ffda;--bg:var(--bg-light);--card:var(--card-light);--text:var(--text-light);--muted:var(--muted-light);--border:var(--border-light);--shadow:var(--shadow-light}}[data-theme=\"dark\"]{{--bg:var(--bg-dark);--card:var(--card-dark);--text:var(--text-dark);--muted:var(--muted-dark);--border:var(--border-dark);--shadow:var(--shadow-dark)}}*{{box-sizing:border-box;margin:0;padding:0}}body{{background:var(--bg);color:var(--text);font-family:'Inter',system-ui,-apple-system,sans-serif;transition:background-color .4s cubic-bezier(.4,0,.2,1),color .4s cubic-bezier(.4,0,.2,1);min-height:100vh}}.wrap{{max-width:1100px;margin:0 auto;padding:40px 24px}}.head{{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}}.title-section{{display:flex;align-items:center;gap:14px}}.logo-img{{height:39px;width:auto;max-width:360px;object-fit:contain}}.page-title{{font-family:'Playfair Display',serif;font-size:32px;letter-spacing:.2px;color:var(--text)}}.header-actions{{display:flex;align-items:center;gap:12px}}.upload{{padding:6px 10px;border-radius:8px;background:var(--card);border:1px solid var(--border);color:var(--muted);text-decoration:none;font-family:'Inter',system-ui,-apple-system,sans-serif;font-weight:400;font-size:12px}}.theme-toggle{{width:36px;height:36px;border-radius:50%;border:1px solid var(--border);background:var(--card);cursor:pointer}}.stats{{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:16px}}.stat{{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:14px;text-align:center}}.stat-value{{font-family:'Playfair Display',serif;font-size:22px}}.stat-label{{color:var(--muted);font-size:12px}}.grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px}}.card{{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:18px;transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease}}a.card{{text-decoration:none;color:inherit}}.card:hover{{transform:translateY(-2px);border-color:var(--coral);box-shadow:0 12px 30px var(--shadow)}}.label{{display:inline-block;margin-bottom:12px;padding:6px 10px;border:1px solid var(--border);border-radius:999px;color:var(--muted);font-size:12px;background:var(--card)}}.name{{font-family:'Inter',system-ui,-apple-system,sans-serif;font-weight:400;font-size:calc(16px - 2pt);margin-bottom:8px}}.meta{{color:var(--muted);font-size:12px}}.footer{{margin-top:36px;color:var(--muted);font-size:12px;text-align:center}}\n</style>\n</head>\n<body>\n<div class=\"wrap\">\n<div class=\"head\">\n  <div class=\"title-section\">\n    <img class=\"logo-img\" src=\"../assets/images/logo-lockup.png\" alt=\"Luis Gilberto\">\n    <h1 class=\"page-title\">Documents</h1>\n  </div>\n  <div class=\"header-actions\">\n    <a class=\"upload\" href=\"#\">Upload New File</a>\n    <button class=\"theme-toggle\" aria-label=\"Toggle theme\"></button>\n  </div>\n</div>\n<div class=\"stats\">\n  <div class=\"stat\"><div class=\"stat-value\">{len(pdfs)}</div><div class=\"stat-label\">Total Files</div></div>\n  <div class=\"stat\"><div class=\"stat-value\">{(sum((deploy / 'documents' / p.name).stat().st_size for p in pdfs)/1024/1024) if pdfs else 0:.1f}</div><div class=\"stat-label\">MB Total</div></div>\n  <div class=\"stat\"><div class=\"stat-value\">{(__import__('datetime').datetime.fromtimestamp(max((deploy / 'documents' / p.name).stat().st_mtime for p in pdfs)).strftime('%b %d')) if pdfs else __import__('datetime').datetime.now().strftime('%b %d')}</div><div class=\"stat-label\">Last Updated</div></div>\n</div>\n<div class=\"grid\">\n"""

for c in cards:
    doc_index += f"<a class=\"card\" href=\"./{c['name']}\"><div class=\"label\">{c['label']}</div><div class=\"name\">{c['name']}</div><div class=\"meta\">{c['date']} • {c['size']}</div></a>\n"

if not cards:
    doc_index += "<div class=\"card request\">No documents yet — add your PDF to assets/docs and rebuild.</div>\n"

doc_index += "</div><div class=\"footer\">© 2025 Luis Gilberto • Designed with intention</div>\n<script>const t=document.querySelector('.theme-toggle'),h=document.documentElement,c=localStorage.getItem('theme')||'light';h.setAttribute('data-theme',c);t.addEventListener('click',()=>{const n=h.getAttribute('data-theme')==='light'?'dark':'light';h.setAttribute('data-theme',n);localStorage.setItem('theme',n);});</script></div></body></html>"

(deploy / "documents" / "index.html").write_text(doc_index, encoding="utf-8")
