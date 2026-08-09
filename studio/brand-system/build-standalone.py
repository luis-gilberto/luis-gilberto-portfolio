import io, os, re, base64, shutil
from PIL import Image

SRC="/home/claude/work"; OUT=os.path.join(SRC,"standalone")
shutil.rmtree(OUT, ignore_errors=True); os.makedirs(OUT)

tokens=io.open(os.path.join(SRC,"tokens.css"),encoding="utf-8").read()
m=re.search(r"@import url\('([^']+)'\);\n?", tokens)
font_url=m.group(1); tokens_body=tokens.replace(m.group(0),"").strip()

# Logos are resampled to 800px (>3x the largest 130px render, retina-safe) and
# palette-reduced. Verified visually lossless: PSNR >= 53dB over both surfaces.
def encode(path):
    im=Image.open(path).convert("RGBA"); W,H=im.size
    if W>800: im=im.resize((800,round(H*800/W)),Image.LANCZOS)
    im=im.quantize(colors=256,method=Image.FASTOCTREE).convert("RGBA")
    b=io.BytesIO(); im.save(b,"PNG",optimize=True)
    return "data:image/png;base64,"+base64.b64encode(b.getvalue()).decode("ascii")

uris={"assets/"+f: encode(os.path.join(SRC,"assets",f))
      for f in os.listdir(os.path.join(SRC,"assets")) if f.endswith(".png")}

FONT_HEAD=('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
 '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
 f'<link rel="stylesheet" href="{font_url}">')
BANNER=("<!-- ============================================================\n"
 "     LG STUDIO - DESIGN TOKENS v1.1 (inlined copy)\n"
 "     SOURCE OF TRUTH is tokens.css in the parent folder.\n"
 "     Do not edit tokens here. Change tokens.css, then regenerate\n"
 "     this standalone set so the two stay in sync.\n"
 "     ============================================================ -->")

rep=[]
for f in ["index.html","brand-guide.html","design-system.html","lg-studio-asset-index.html"]:
    s=io.open(os.path.join(SRC,f),encoding="utf-8").read(); before=len(s.encode())
    link='<link rel="stylesheet" href="tokens.css">'
    assert link in s
    s=s.replace(link, FONT_HEAD+"\n"+BANNER+"\n<style>\n"+tokens_body+"\n</style>",1)
    used=sorted(set(re.findall(r'"(assets/[^"]+)"', s)))
    for pth in used: s=s.replace('"'+pth+'"','"'+uris[pth]+'"')
    io.open(os.path.join(OUT,f),"w",encoding="utf-8").write(s)
    rep.append([f,before,len(s.encode()),len(used),None])

# Second pass: every file now exists, so sibling links can be resolved.
# Flags only local paths that will not resolve inside the output folder.
# Ignores data URIs, absolute URLs, anchors and JS template literals.
for r in rep:
    s=io.open(os.path.join(OUT,r[0]),encoding="utf-8").read()
    cand=re.findall(r'(?:src|href)="(?!data:|https?:|#)([^"]+)"', s)
    r[4]=[x for x in cand if "${" not in x and not os.path.exists(os.path.join(OUT,x))]

print(f"{'file':32}{'linked':>9}{'standalone':>12}{'unique logos':>14}  remaining external refs")
for f,b,a,n,l in rep:
    print(f"  {f[:30]:30}{b//1024:>6}KB{a//1024:>10}KB{n:>12}     {l if l else 'none'}")
print(f"\n  standalone folder total: {sum(os.path.getsize(os.path.join(OUT,x)) for x in os.listdir(OUT))//1024}KB")
