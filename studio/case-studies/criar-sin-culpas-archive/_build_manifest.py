"""Build CSC case-study image inventory + initial manifest."""
from __future__ import annotations

import json
import re
from pathlib import Path
from PIL import Image

ROOT = Path(".")
CASE = ROOT / "studio/case-studies/criar-sin-culpas"
HTML = CASE / "index.html"
CSS = CASE / "csc-case-v0.css"
OUT = CASE / "csc-case-study-image-manifest.json"

html = HTML.read_text(encoding="utf-8")
css = CSS.read_text(encoding="utf-8")

# Parse section boundaries
section_ids = []
for m in re.finditer(r"<(?:section|header)[^>]*\bid=\"([^\"]+)\"", html):
    section_ids.append((m.start(), m.group(1)))

def section_at(pos: int) -> str:
    sid = "?"
    for start, name in section_ids:
        if start <= pos:
            sid = name
        else:
            break
    return sid

# Detect module from surrounding class/context
def module_at(pos: int) -> str:
    before = html[max(0, pos - 800) : pos]
    patterns = [
        (r'class="start-portrait"', "start-portrait"),
        (r'class="start-portrait__frame"', "start-portrait"),
        (r'class="hero__visual"', "hero-visual"),
        (r'class="early-frag"', "early-frag"),
        (r'class="gen-card[^"]*"', "gen-card"),
        (r'class="gov-doc"', "gov-doc"),
        (r'class="ops-tile"', "ops-tile"),
        (r'class="artifact[^"]*"', "artifact"),
        (r'class="ladder"', "illustration-ladder"),
        (r'class="named-set"', "named-set"),
        (r'class="vis-col"', "vis-col"),
        (r'class="purpose"', "purpose"),
        (r'class="product-evidence"', "product-evidence"),
        (r'class="measure"', "measure"),
        (r'class="extract"', "extract"),
        (r'class="read-bridge"', "read-bridge"),
        (r'class="status"', "status"),
    ]
    for pat, name in patterns:
        if re.search(pat, before):
            return name
    return "unknown"

# Aspect ratios from CSS by module (from case CSS)
MODULE_RATIOS = {
    "hero-visual": {"desktop": "4/5", "tablet": "16/11", "mobile": "16/11"},
    "start-portrait": {"desktop": "1/1", "tablet": "1/1", "mobile": "1/1", "mask": "circle"},
    "early-frag": {"desktop": "1/1", "tablet": "1/1", "mobile": "1/1"},
    "gen-card": {"desktop": "16/10", "tablet": "16/10", "mobile": "16/10"},  # media 180px fixed height, width ~280
    "gov-doc": {"desktop": "16/10", "tablet": "16/10", "mobile": "16/10"},
    "artifact": {"desktop": "16/11", "tablet": "16/11", "mobile": "4/5"},  # artifact--screen vs cover varies
    "ops-tile": {"desktop": "16/10", "tablet": "16/10", "mobile": "16/10"},
    "illustration-ladder": {"desktop": "contain", "tablet": "contain", "mobile": "contain"},
    "named-set": {"desktop": "contain", "tablet": "contain", "mobile": "contain"},
    "vis-col": {"desktop": "4/5", "tablet": "4/5", "mobile": "4/5"},
    "purpose": {"desktop": "4/5", "tablet": "4/5", "mobile": "16/10"},
    "product-evidence": {"desktop": "16/11", "tablet": "16/11", "mobile": "16/11"},
    "measure": {"desktop": "16/11", "tablet": "16/11", "mobile": "16/11"},
    "extract": {"desktop": "16/11", "tablet": "16/11", "mobile": "16/11"},
    "read-bridge": {"desktop": "16/11", "tablet": "16/11", "mobile": "16/11"},
    "status": {"desktop": "16/10", "tablet": "16/10", "mobile": "16/10"},
    "unknown": {"desktop": "16/10", "tablet": "16/10", "mobile": "16/10"},
}

# Provenance helpers
def classify(src: str, section: str) -> str:
    s = src.lower()
    if "csc_brand_assets" in s or "gen-purple" in s or "gen-dark" in s or "brandidentityguidelines" in s:
        return "HISTORICAL"
    if "workspace-index" in s and section == "operations":
        return "HISTORICAL"  # labeled earlier surface
    if any(x in s for x in ["ecosystem-intel", "signal-framework", "product-arch", "hub-dashboard", "read-framework", "read-signal"]):
        return "LG STUDIO / STRATEGYIQ EVIDENCE"
    if any(x in s for x in ["brand-live", "brand-public", "gov-brand", "live-apoyo", "misty", "csc-", "method-crop", "gov-sor", "sor-", "ops-", "cloudinary"]):
        if "gen-" in s:
            return "HISTORICAL"
        return "CURRENT CANONICAL"
    if "/photography/" in s or "/derived/visual-system/" in s or "/website-" in s or "/Editorial/" in s or "/protocols/" in s:
        return "CURRENT CANONICAL"
    if "evidence/" in s:
        return "CURRENT CANONICAL"
    return "UNKNOWN"

def provenance(src: str) -> dict:
    # strip leading slash for path
    path = src.lstrip("/") if src.startswith("/") else src
    original = None
    document = None
    url = None
    family = None

    # derivative mapping
    deriv = {
        "studio/case-studies/criar-sin-culpas/evidence/brand-public.png": {
            "originalPath": "studio/case-studies/criar-sin-culpas/evidence/brand-live-top.png",
            "url": "https://criarsinculpas.com/brand",
            "document": "Live Brand System capture (top)",
        },
        "studio/case-studies/criar-sin-culpas/evidence/gov-brand-crop.png": {
            "originalPath": "studio/case-studies/criar-sin-culpas/evidence/brand-live-color-system.png",
            "url": "https://criarsinculpas.com/brand",
            "document": "Live Brand System · Color / Palette",
        },
        "studio/case-studies/criar-sin-culpas/evidence/gov-sor-crop.png": {
            "originalPath": "studio/case-studies/criar-sin-culpas/evidence/sor-after-enter.png",
            "document": "nari-method-prod/index.html · Espacio de Trabajo Privado / SoR",
            "url": None,
        },
        "studio/case-studies/criar-sin-culpas/evidence/gen-purple-crop.png": {
            "originalPath": "studio/case-studies/criar-sin-culpas/evidence/brand-book-top.png",
            "document": "nari-method-prod/.../CSC_BrandBook_Complete.html",
        },
        "studio/case-studies/criar-sin-culpas/evidence/gen-dark-crop.png": {
            "originalPath": "studio/case-studies/criar-sin-culpas/evidence/apoyo-emotional.png",
            "document": "nari-method-prod/apoyo/emotional-escalation.html",
        },
        "studio/case-studies/criar-sin-culpas/evidence/method-crop.png": {
            "originalPath": "studio/case-studies/criar-sin-culpas/evidence/method-page.png",
            "document": "nari-method-prod/method.html",
        },
        "studio/case-studies/criar-sin-culpas/evidence/read-framework-crop.png": {
            "originalPath": "studio/case-studies/criar-sin-culpas/evidence/signal-framework.png",
            "document": "nari-method-prod/files/SIQ_A03_ProtocolSignalFramework_CSC.html",
        },
        "studio/case-studies/criar-sin-culpas/evidence/product-arch-crop.png": {
            "originalPath": "studio/case-studies/criar-sin-culpas/evidence/product-arch.png",
            "document": "TheHub/clients/nari/files/SIQ-03_ProductArchitecture_CriarSinCulpas.html",
        },
        "studio/case-studies/criar-sin-culpas/evidence/ops-front.png": {
            "originalPath": "studio/lg-studio-portfolio/assets/criar-sin-culpas/process-artifacts/csc-progress-report-full-page.png",
            "document": "Progress report · process artifact",
        },
        "studio/case-studies/criar-sin-culpas/evidence/ops-mid-a.png": {
            "originalPath": "studio/lg-studio-portfolio/assets/criar-sin-culpas/process-artifacts/csc-progress-report-full-page.png",
            "document": "Progress report · process artifact",
        },
        "studio/case-studies/criar-sin-culpas/evidence/ops-mid-b.png": {
            "originalPath": "studio/lg-studio-portfolio/assets/criar-sin-culpas/process-artifacts/csc-progress-report-full-page.png",
            "document": "Progress report · process artifact",
        },
        "studio/case-studies/criar-sin-culpas/evidence/live-apoyo-hub.png": {
            "url": "https://criarsinculpas.com/apoyo",
            "document": "Live CSC Guías / Apoyo hub",
        },
        "studio/case-studies/criar-sin-culpas/evidence/brand-live-top.png": {
            "url": "https://criarsinculpas.com/brand",
            "document": "Live Brand System",
        },
        "studio/case-studies/criar-sin-culpas/evidence/brand-live-color-system.png": {
            "url": "https://criarsinculpas.com/brand",
            "document": "Live Brand System · Color",
        },
        "studio/case-studies/criar-sin-culpas/evidence/ecosystem-intel.png": {
            "document": "nari-method-prod/files/SIQ_A00_EcosystemIntelligence_CSC.html",
        },
        "studio/case-studies/criar-sin-culpas/evidence/signal-framework.png": {
            "document": "nari-method-prod/files/SIQ_A03_ProtocolSignalFramework_CSC.html",
        },
        "studio/case-studies/criar-sin-culpas/evidence/product-arch.png": {
            "document": "TheHub/clients/nari/files/SIQ-03_ProductArchitecture_CriarSinCulpas.html",
        },
        "studio/case-studies/criar-sin-culpas/evidence/hub-dashboard.png": {
            "document": "TheHub/clients/nari/dashboard.html",
        },
        "studio/case-studies/criar-sin-culpas/evidence/workspace-index.png": {
            "document": "nari-method-prod/index.html · entry gate",
        },
        "studio/case-studies/criar-sin-culpas/evidence/sor-inner-2.png": {
            "document": "nari-method-prod/index.html · workspace after enter",
        },
        "studio/case-studies/criar-sin-culpas/evidence/sor-after-enter.png": {
            "document": "nari-method-prod/index.html · SoR intro",
        },
    }

    if path in deriv:
        d = deriv[path]
        original = d.get("originalPath")
        document = d.get("document")
        url = d.get("url")

    if "cloudinary.com" in src:
        url = src
        document = document or "Cloudinary portrait asset"
        family = "Photography"
        path = src  # remote

    if "/derived/visual-system/" in path:
        family = "Biblioteca Visual / illustrations"
        document = document or "studio/lg-studio-portfolio/assets/criar-sin-culpas/derived/visual-system"
    elif "/photography/" in path:
        family = "Photography"
    elif "CSC_Brand_Assets" in path:
        family = "Historical Brand Assets pack"
        document = document or Path(path).name
    elif "/website-" in path or "/protocols/" in path or "/Editorial/" in path:
        family = "Current production CSC captures"
    elif "/process-artifacts/" in path:
        family = "Process / reporting artifacts"

    return {
        "path": path if not src.startswith("http") else None,
        "remoteUrl": src if src.startswith("http") else None,
        "originalPath": original,
        "document": document,
        "url": url,
        "family": family,
    }

# Collect img tags
instances = []
asset_counts: dict[str, int] = {}
for i, m in enumerate(re.finditer(r"<img\b([^>]*)>", html, re.I)):
    attrs = m.group(1)
    src_m = re.search(r'src="([^"]+)"', attrs)
    if not src_m:
        continue
    src = src_m.group(1)
    alt_m = re.search(r'alt="([^"]*)"', attrs)
    alt = alt_m.group(1) if alt_m else ""
    pos = m.start()
    section = section_at(pos)
    module = module_at(pos)
    asset_counts[src] = asset_counts.get(src, 0) + 1

    # refine artifact subtype
    before = html[max(0, pos - 400) : pos]
    artifact_mod = module
    if 'artifact--cover' in before:
        artifact_mod = "artifact-cover"
    elif 'artifact--screen' in before:
        artifact_mod = "artifact-screen"
    elif module == "artifact":
        artifact_mod = "artifact"

    ratios = MODULE_RATIOS.get(module, MODULE_RATIOS["unknown"]).copy()
    if artifact_mod == "artifact-cover":
        ratios = {"desktop": "4/3", "tablet": "4/3", "mobile": "4/3"}
    elif artifact_mod == "artifact-screen":
        ratios = {"desktop": "16/11", "tablet": "16/11", "mobile": "16/11"}
    if module == "purpose" and "purpose--wide" in before:
        ratios = {"desktop": "16/10", "tablet": "16/10", "mobile": "16/10"}

    # gen-card media is fixed 180px height; approximate from gen-rail card width
    if module == "gen-card":
        ratios = {"desktop": "280/180", "tablet": "260/180", "mobile": "240/180"}

    # early-frag thumbs
    if module == "early-frag":
        ratios = {"desktop": "1/1", "tablet": "1/1", "mobile": "1/1"}

    # composition sensitive
    sensitive = False
    fit = "cover"
    if module in ("illustration-ladder", "named-set") or src.endswith(".svg"):
        sensitive = True
        fit = "contain"
    if "BrandIdentityGuidelines" in src or "product-arch" in src or "signal-framework" in src:
        sensitive = True

    # object position defaults from CSS knowledge
    obj_pos = "center center"
    if module == "start-portrait":
        obj_pos = "center 18%"
    elif module in ("hero-visual", "gen-card", "gov-doc", "ops-tile", "artifact", "artifact-screen", "artifact-cover"):
        obj_pos = "top center"
    elif module == "vis-col" and "photography" not in src:
        obj_pos = "center center"

    prov = provenance(src)

    # intrinsic dims
    w = h = None
    local = None
    if src.startswith("http"):
        local = None
    else:
        local = ROOT / src.lstrip("/")
    if local and local.exists() and local.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp", ".gif"}:
        try:
            with Image.open(local) as im:
                w, h = im.size
        except Exception:
            pass
    elif local and local.exists() and local.suffix.lower() == ".svg":
        # try viewBox
        try:
            t = local.read_text(encoding="utf-8", errors="ignore")
            vb = re.search(r'viewBox="([^"]+)"', t)
            if vb:
                parts = vb.group(1).split()
                if len(parts) == 4:
                    w, h = float(parts[2]), float(parts[3])
        except Exception:
            pass

    # width/height attrs as fallback
    wa = re.search(r'width="(\d+)"', attrs)
    ha = re.search(r'height="(\d+)"', attrs)
    if w is None and wa:
        w = int(wa.group(1))
    if h is None and ha:
        h = int(ha.group(1))

    inst_id = f"{section}__{module}__{i:02d}"
    instances.append({
        "id": inst_id,
        "asset": Path(src.split("?")[0]).name if not src.startswith("http") else src.split("/")[-1].split("?")[0],
        "source": {
            "path": prov["path"],
            "remoteUrl": prov["remoteUrl"],
            "originalPath": prov["originalPath"],
            "document": prov["document"],
            "url": prov["url"],
            "family": prov["family"],
        },
        "usage": {
            "section": section,
            "module": artifact_mod if module == "artifact" else module,
            "instance": inst_id,
            "alt": alt,
            "htmlIndex": i,
        },
        "classification": classify(src, section),
        "intrinsic": {
            "width": w,
            "height": h,
            "ratio": round(w / h, 4) if w and h else None,
        },
        "render": {
            "objectFit": fit,
            "objectPosition": obj_pos,
            "mask": MODULE_RATIOS.get(module, {}).get("mask"),
            "aspectRatios": {
                "desktop": ratios.get("desktop"),
                "tablet": ratios.get("tablet"),
                "mobile": ratios.get("mobile"),
            },
            "compositionSensitive": sensitive,
        },
        "status": "UNREVIEWED",
        "crops": {
            "desktop": {"fit": fit, "x": 50, "y": 50 if "top" not in obj_pos else 18, "zoom": 1, "scaleX": 1, "scaleY": 1},
            "tablet": {"fit": fit, "x": 50, "y": 50 if "top" not in obj_pos else 18, "zoom": 1, "scaleX": 1, "scaleY": 1},
            "mobile": {"fit": fit, "x": 50, "y": 50 if "top" not in obj_pos else 18, "zoom": 1, "scaleX": 1, "scaleY": 1},
        },
        "approved": False,
    })

# mark multi-use
for inst in instances:
    key = inst["source"]["remoteUrl"] or inst["source"]["path"]
    # count by asset src from html - use asset name + path
    path = inst["source"]["path"] or inst["source"]["remoteUrl"]
    count = sum(1 for x in instances if (x["source"]["path"] or x["source"]["remoteUrl"]) == path)
    inst["usage"]["occurrenceCount"] = count
    inst["usage"]["independentArtDirection"] = count > 1

# Pilot selection
pilots = []
for inst in instances:
    if inst["usage"]["module"] == "start-portrait":
        pilots.append(inst["id"])
        break
for inst in instances:
    if "live-apoyo" in (inst["source"]["path"] or "") or inst["asset"].startswith("live-apoyo"):
        pilots.append(inst["id"])
        break
for inst in instances:
    if inst["render"]["compositionSensitive"] and inst["asset"].endswith(".svg") and "sleep-editorial" in inst["asset"]:
        pilots.append(inst["id"])
        break

manifest = {
    "version": 1,
    "caseStudy": "/studio/case-studies/criar-sin-culpas/",
    "generatedFrom": "studio/case-studies/criar-sin-culpas/index.html",
    "breakpoints": {
        "desktop": "(min-width: 1101px)",
        "tablet": "(min-width: 821px) and (max-width: 1100px)",
        "mobile": "(max-width: 820px)",
    },
    "pilots": pilots,
    "stats": {
        "instances": len(instances),
        "uniqueAssets": len({(i["source"]["path"] or i["source"]["remoteUrl"]) for i in instances}),
    },
    "instances": instances,
}

OUT.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
print("instances", len(instances))
print("unique", manifest["stats"]["uniqueAssets"])
print("pilots", pilots)
print("wrote", OUT)
