"""Build CSC Image Director asset index from known project directories + manifest."""
from __future__ import annotations

import json
import re
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    Image = None

ROOT = Path(".")
CASE = ROOT / "studio/case-studies/criar-sin-culpas"
OUT = CASE / "csc-asset-index.json"
MANIFEST = CASE / "csc-case-study-image-manifest.json"

SCAN_DIRS = [
    "studio/lg-studio-portfolio/assets/criar-sin-culpas",
    "studio/case-studies/criar-sin-culpas/evidence",
    "nari-method-prod/assets/CSC_Brand_Assets",
    "nari-method-prod/assets/images",
    "studio/lg-studio-portfolio/assets/criar-sin-culpas/derived",
    "studio/lg-studio-portfolio/assets/criar-sin-culpas/photography",
    "studio/lg-studio-portfolio/assets/criar-sin-culpas/website-desktop",
    "studio/lg-studio-portfolio/assets/criar-sin-culpas/process-artifacts",
    "studio/lg-studio-portfolio/assets/criar-sin-culpas/Editorial",
    "studio/lg-studio-portfolio/assets/criar-sin-culpas/protocols",
]

IMG_EXT = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"}


def classify_path(rel: str) -> tuple[str, str, str]:
    s = rel.replace("\\", "/").lower()
    kind = "ORIGINAL"
    bucket = "UNKNOWN"
    family = None
    if "/evidence/" in s or s.startswith("studio/case-studies/criar-sin-culpas/evidence"):
        kind = "CASE-STUDY EXPORT" if "-crop" in s or s.endswith("-crop.png") else "DERIVATIVE"
        bucket = "SCREENSHOTS"
    if "/photography/" in s:
        bucket = "PHOTOGRAPHY"
        kind = "ORIGINAL"
        family = "Photography"
    if "/derived/visual-system/" in s or s.endswith(".svg"):
        bucket = "ILLUSTRATION"
        family = "Biblioteca Visual / illustrations"
        kind = "ORIGINAL" if s.endswith(".svg") and "-crop" not in s else ("DERIVATIVE" if "-crop" in s else "ORIGINAL")
    if "csc_brand_assets" in s or "/brand_book/" in s or "brandidentity" in s:
        bucket = "HISTORICAL"
        family = "Historical Brand Assets pack"
        kind = "ORIGINAL"
    if any(x in s for x in ["website-desktop", "website-tablet", "website-mobile", "/editorial/", "/protocols/"]):
        bucket = "SCREENSHOTS"
        kind = "ORIGINAL"
        family = family or "Current production CSC captures"
    if "process-artifacts" in s:
        bucket = "DOCUMENTS"
        family = "Process / reporting artifacts"
    if any(x in s for x in ["siq", "ecosystem-intel", "signal-framework", "product-arch", "hub-dashboard"]):
        bucket = "STRATEGYIQ / LG"
    if "-crop" in Path(s).name or s.endswith("_crop.png"):
        kind = "DERIVATIVE"
    if bucket == "UNKNOWN":
        if "/derived/" in s:
            bucket = "CURRENT CANONICAL"
            kind = "DERIVATIVE"
        else:
            bucket = "CURRENT CANONICAL"
    return bucket, kind, family or ""


def dims(path: Path):
    if not Image:
        return None, None
    try:
        if path.suffix.lower() == ".svg":
            t = path.read_text(encoding="utf-8", errors="ignore")
            vb = re.search(r'viewBox="([^"]+)"', t)
            if vb:
                parts = vb.group(1).split()
                if len(parts) == 4:
                    return float(parts[2]), float(parts[3])
            return None, None
        with Image.open(path) as im:
            return im.size
    except Exception:
        return None, None


assets = {}
# from filesystem
for d in SCAN_DIRS:
    base = ROOT / d
    if not base.exists():
        continue
    for p in base.rglob("*"):
        if not p.is_file() or p.suffix.lower() not in IMG_EXT:
            continue
        rel = str(p.relative_to(ROOT)).replace("\\", "/")
        if rel in assets:
            continue
        bucket, kind, family = classify_path(rel)
        w, h = dims(p)
        assets[rel] = {
            "id": rel,
            "filename": p.name,
            "path": rel,
            "remoteUrl": None,
            "originalPath": None,
            "document": None,
            "url": None,
            "family": family or None,
            "classification": bucket if bucket != "SCREENSHOTS" else "CURRENT CANONICAL",
            "pickerBucket": bucket,
            "kind": kind,
            "type": "local",
            "width": w,
            "height": h,
            "usedBy": [],
        }

# from manifest provenance
if MANIFEST.exists():
    m = json.loads(MANIFEST.read_text(encoding="utf-8"))
    for inst in m.get("instances", []):
        src = inst.get("source") or {}
        key = src.get("remoteUrl") or src.get("path")
        if not key:
            continue
        if key.startswith("http"):
            aid = key
            if aid not in assets:
                assets[aid] = {
                    "id": aid,
                    "filename": key.split("/")[-1].split("?")[0],
                    "path": None,
                    "remoteUrl": key,
                    "originalPath": src.get("originalPath"),
                    "document": src.get("document"),
                    "url": src.get("url") or key,
                    "family": src.get("family"),
                    "classification": inst.get("classification") or "CURRENT CANONICAL",
                    "pickerBucket": "PHOTOGRAPHY" if "cloudinary" in key else "UNKNOWN",
                    "kind": "ORIGINAL",
                    "type": "cloudinary" if "cloudinary" in key else "remote",
                    "width": (inst.get("intrinsic") or {}).get("width"),
                    "height": (inst.get("intrinsic") or {}).get("height"),
                    "usedBy": [],
                }
        else:
            rel = key.replace("\\", "/")
            if rel not in assets:
                bucket, kind, family = classify_path(rel)
                assets[rel] = {
                    "id": rel,
                    "filename": Path(rel).name,
                    "path": rel,
                    "remoteUrl": None,
                    "originalPath": src.get("originalPath"),
                    "document": src.get("document"),
                    "url": src.get("url"),
                    "family": src.get("family") or family or None,
                    "classification": inst.get("classification") or bucket,
                    "pickerBucket": bucket,
                    "kind": kind,
                    "type": "local",
                    "width": (inst.get("intrinsic") or {}).get("width"),
                    "height": (inst.get("intrinsic") or {}).get("height"),
                    "usedBy": [],
                }
            else:
                if src.get("originalPath"):
                    assets[rel]["originalPath"] = src["originalPath"]
                if src.get("document"):
                    assets[rel]["document"] = src["document"]
        # usage
        use_key = src.get("remoteUrl") or src.get("path")
        if use_key in assets:
            assets[use_key]["usedBy"].append(inst["id"])
        # also index originalPath as separate asset pointer
        op = src.get("originalPath")
        if op and op not in assets and not str(op).startswith("http"):
            fp = ROOT / op
            bucket, kind, family = classify_path(op)
            w, h = dims(fp) if fp.exists() else (None, None)
            assets[op] = {
                "id": op,
                "filename": Path(op).name,
                "path": op,
                "remoteUrl": None,
                "originalPath": None,
                "document": src.get("document"),
                "url": src.get("url"),
                "family": family or src.get("family"),
                "classification": "CURRENT CANONICAL",
                "pickerBucket": bucket,
                "kind": "ORIGINAL",
                "type": "local",
                "width": w,
                "height": h,
                "usedBy": [],
            }

# derivative → original links from known map
DERIV = {
    "studio/case-studies/criar-sin-culpas/evidence/gov-brand-crop.png": "studio/case-studies/criar-sin-culpas/evidence/brand-live-color-system.png",
    "studio/case-studies/criar-sin-culpas/evidence/brand-public.png": "studio/case-studies/criar-sin-culpas/evidence/brand-live-top.png",
    "studio/case-studies/criar-sin-culpas/evidence/gov-sor-crop.png": "studio/case-studies/criar-sin-culpas/evidence/sor-after-enter.png",
    "studio/case-studies/criar-sin-culpas/evidence/gen-purple-crop.png": "studio/case-studies/criar-sin-culpas/evidence/brand-book-top.png",
    "studio/case-studies/criar-sin-culpas/evidence/gen-dark-crop.png": "studio/case-studies/criar-sin-culpas/evidence/apoyo-emotional.png",
    "studio/case-studies/criar-sin-culpas/evidence/method-crop.png": "studio/case-studies/criar-sin-culpas/evidence/method-page.png",
    "studio/case-studies/criar-sin-culpas/evidence/read-framework-crop.png": "studio/case-studies/criar-sin-culpas/evidence/signal-framework.png",
    "studio/case-studies/criar-sin-culpas/evidence/product-arch-crop.png": "studio/case-studies/criar-sin-culpas/evidence/product-arch.png",
}
for deriv, orig in DERIV.items():
    if deriv in assets:
        assets[deriv]["originalPath"] = orig
        assets[deriv]["kind"] = "DERIVATIVE"

items = sorted(assets.values(), key=lambda a: (a.get("path") or a.get("remoteUrl") or ""))
payload = {
    "version": 1,
    "generatedFor": "csc-image-director",
    "count": len(items),
    "assets": items,
}
OUT.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print("assets", len(items), "->", OUT)
