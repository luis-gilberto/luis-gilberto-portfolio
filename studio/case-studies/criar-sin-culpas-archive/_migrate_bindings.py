"""Migrate all CSC case-study images onto Image Director bindings.

Preserves current look by seeding crops from existing CSS object-position/fit.
"""
from __future__ import annotations

import json
import re
from pathlib import Path
from collections import Counter

ROOT = Path(".")
CASE = ROOT / "studio/case-studies/criar-sin-culpas"
HTML_PATH = CASE / "index.html"
MANIFEST_PATH = CASE / "csc-case-study-image-manifest.json"
APPLIED_PATH = CASE / "csc-crops-applied.css"

html = HTML_PATH.read_text(encoding="utf-8")
manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))

# --- Module defaults from csc-case-v0.css (visual equivalence seeds) ---
MODULE_DEFAULTS = {
    "hero-visual": {
        "fit": "cover", "x": 50, "y": 20, "zoom": 1,
        "ratios": {"desktop": "4/5", "tablet": "16/11", "mobile": "16/11"},
        "renderMode": "directed-cover", "mask": None, "sensitive": False,
    },
    "start-portrait": {
        "fit": "cover", "x": 50, "y": 18, "zoom": 1,
        "ratios": {"desktop": "1/1", "tablet": "1/1", "mobile": "1/1"},
        "renderMode": "circular", "mask": "circle", "sensitive": False,
    },
    "early-frag": {
        "fit": "contain", "x": 50, "y": 50, "zoom": 1,
        "ratios": {"desktop": "1/1", "tablet": "1/1", "mobile": "1/1"},
        "renderMode": "directed-contain", "mask": None, "sensitive": True,
    },
    "gen-card": {
        "fit": "cover", "x": 50, "y": 0, "zoom": 1,  # top center
        "ratios": {"desktop": "280/180", "tablet": "260/180", "mobile": "240/180"},
        "renderMode": "directed-cover", "mask": None, "sensitive": False,
    },
    "artifact-cover": {
        "fit": "cover", "x": 50, "y": 0, "zoom": 1,
        "ratios": {"desktop": "4/3", "tablet": "4/3", "mobile": "4/3"},
        "renderMode": "directed-cover", "mask": None, "sensitive": False,
    },
    "artifact-screen": {
        "fit": "cover", "x": 50, "y": 0, "zoom": 1,
        "ratios": {"desktop": "16/11", "tablet": "16/11", "mobile": "16/11"},
        "renderMode": "directed-cover", "mask": None, "sensitive": False,
    },
    "artifact": {
        "fit": "cover", "x": 50, "y": 0, "zoom": 1,
        "ratios": {"desktop": "16/11", "tablet": "16/11", "mobile": "16/11"},
        "renderMode": "directed-cover", "mask": None, "sensitive": False,
    },
    "gov-doc": {
        "fit": "cover", "x": 50, "y": 0, "zoom": 1,
        "ratios": {"desktop": "16/10", "tablet": "16/10", "mobile": "16/10"},
        "renderMode": "directed-cover", "mask": None, "sensitive": False,
    },
    "ops-tile": {
        "fit": "cover", "x": 50, "y": 0, "zoom": 1,
        "ratios": {"desktop": "16/10", "tablet": "16/10", "mobile": "16/10"},
        "renderMode": "directed-cover", "mask": None, "sensitive": False,
    },
    "vis-col": {
        "fit": "cover", "x": 50, "y": 50, "zoom": 1,
        "ratios": {"desktop": "4/5", "tablet": "4/5", "mobile": "4/5"},
        "renderMode": "directed-cover", "mask": None, "sensitive": False,
    },
    "illustration-ladder": {
        "fit": "contain", "x": 50, "y": 50, "zoom": 1,
        "ratios": {"desktop": "5/4", "tablet": "5/4", "mobile": "4/3"},
        "renderMode": "directed-contain", "mask": None, "sensitive": True,
    },
    "named-set": {
        "fit": "contain", "x": 50, "y": 50, "zoom": 1,
        "ratios": {"desktop": "1/1", "tablet": "1/1", "mobile": "1/1"},
        "renderMode": "directed-contain", "mask": None, "sensitive": True,
    },
    "purpose": {
        "fit": "cover", "x": 50, "y": 0, "zoom": 1,
        "ratios": {"desktop": "4/5", "tablet": "4/5", "mobile": "4/5"},
        "renderMode": "directed-cover", "mask": None, "sensitive": False,
    },
    "purpose-wide": {
        "fit": "cover", "x": 50, "y": 0, "zoom": 1,
        "ratios": {"desktop": "16/10", "tablet": "16/10", "mobile": "16/10"},
        "renderMode": "directed-cover", "mask": None, "sensitive": False,
    },
    "product-evidence": {
        "fit": "cover", "x": 50, "y": 0, "zoom": 1,
        "ratios": {"desktop": "16/11", "tablet": "16/11", "mobile": "16/11"},
        "renderMode": "directed-cover", "mask": None, "sensitive": False,
    },
    "measure": {
        "fit": "cover", "x": 50, "y": 0, "zoom": 1,
        "ratios": {"desktop": "16/11", "tablet": "16/11", "mobile": "16/11"},
        "renderMode": "directed-cover", "mask": None, "sensitive": False,
    },
    "extract": {
        "fit": "cover", "x": 50, "y": 0, "zoom": 1,
        "ratios": {"desktop": "16/11", "tablet": "16/11", "mobile": "16/11"},
        "renderMode": "directed-cover", "mask": None, "sensitive": False,
    },
    "read-bridge": {
        "fit": "cover", "x": 50, "y": 0, "zoom": 1,
        "ratios": {"desktop": "16/11", "tablet": "16/11", "mobile": "16/11"},
        "renderMode": "directed-cover", "mask": None, "sensitive": False,
    },
    "unknown": {
        "fit": "cover", "x": 50, "y": 50, "zoom": 1,
        "ratios": {"desktop": "16/10", "tablet": "16/10", "mobile": "16/10"},
        "renderMode": "directed-cover", "mask": None, "sensitive": False,
    },
}

# Symbol SVGs in ladder/named-set that are tiny intrinsic marks → still directed-contain
# (user asked symbols may be non-directed if purely structural; ladder/named-set are editorial)

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


def detect_module(before: str) -> str:
    if re.search(r'class="[^"]*start-portrait', before) or "start-portrait__frame" in before:
        return "start-portrait"
    if "hero__visual" in before:
        return "hero-visual"
    if "early-frag" in before:
        return "early-frag"
    if "gen-card" in before:
        return "gen-card"
    if "artifact--cover" in before:
        return "artifact-cover"
    if "artifact--screen" in before:
        return "artifact-screen"
    if "gov-doc" in before and "artifact" in before:
        return "gov-doc"
    if "ops-tile" in before:
        return "ops-tile"
    if re.search(r'class="[^"]*\bladder\b', before) or ">ladder" in before or 'class="ladder"' in before:
        return "illustration-ladder"
    if "named-set" in before:
        return "named-set"
    if "vis-col" in before:
        return "vis-col"
    if "purpose--wide" in before:
        return "purpose-wide"
    if "purpose" in before and "artifact" in before:
        return "purpose"
    if "product-evidence" in before:
        return "product-evidence"
    if "measure" in before:
        return "measure"
    if "extract" in before:
        return "extract"
    if "read-bridge" in before or 'id="the-read"' in before:
        return "extract"
    if "artifact" in before:
        return "artifact"
    return "unknown"


def classify_render_mode(module: str, src: str, defaults: dict) -> tuple[str, bool]:
    """Return (renderMode, is_directed)."""
    name = Path(src.split("?")[0]).name.lower()
    # Tiny symbol grid items that are already contain + intrinsic-ish — still editorial
    if module in ("illustration-ladder", "named-set"):
        return "directed-contain", True
    if module == "early-frag":
        return "directed-contain", True
    if module == "start-portrait":
        return "circular", True
    if defaults.get("sensitive") or src.endswith(".svg"):
        # Document/diagram screenshots that are composition-sensitive
        if any(k in name for k in ("product-arch", "signal-framework", "brandidentity", "ecosystem-intel")):
            return "directed-contain", True
        if src.endswith(".svg"):
            return "directed-contain", True
    return defaults["renderMode"], True


# Parse imgs in document order
img_matches = list(re.finditer(r"<img\b([^>]*)>", html, re.I))
existing_by_index = {inst["usage"].get("htmlIndex"): inst for inst in manifest["instances"]}
existing_by_id = {inst["id"]: inst for inst in manifest["instances"]}

# Build ordered inventory matching HTML order
parsed = []
for i, mm in enumerate(img_matches):
    attrs = mm.group(1)
    src_m = re.search(r'src="([^"]+)"', attrs)
    if not src_m:
        continue
    src = src_m.group(1)
    if src.endswith(".js") or "plausible" in src:
        continue
    alt_m = re.search(r'alt="([^"]*)"', attrs)
    alt = alt_m.group(1) if alt_m else ""
    did_m = re.search(r'data-csc-img="([^"]+)"', attrs)
    existing_id = did_m.group(1) if did_m else None
    before = html[max(0, mm.start() - 900) : mm.start()]
    module = detect_module(before)
    section = section_at(mm.start())
    defaults = MODULE_DEFAULTS.get(module, MODULE_DEFAULTS["unknown"]).copy()
    # purpose-wide ratios
    if module == "purpose" and "purpose--wide" in before:
        module = "purpose-wide"
        defaults = MODULE_DEFAULTS["purpose-wide"].copy()
    render_mode, directed = classify_render_mode(module, src, defaults)

    # Prefer existing manifest id by data attr, else by htmlIndex, else create
    inst_id = existing_id
    if not inst_id and i in existing_by_index:
        inst_id = existing_by_index[i]["id"]
    if not inst_id:
        # try match by section+module+asset among unused
        asset = Path(src.split("?")[0]).name
        candidates = [
            inst
            for inst in manifest["instances"]
            if inst["usage"].get("htmlIndex") == i
            or (
                inst["usage"]["section"] == section
                and inst["asset"] == asset
                and inst["id"] not in {p["id"] for p in parsed if p.get("id")}
            )
        ]
        if candidates:
            inst_id = candidates[0]["id"]
    if not inst_id:
        inst_id = f"{section}__{module}__{i:02d}"

    parsed.append(
        {
            "htmlIndex": i,
            "match": mm,
            "src": src,
            "alt": alt,
            "existing_id": existing_id,
            "id": inst_id,
            "section": section,
            "module": module,
            "defaults": defaults,
            "renderMode": render_mode,
            "directed": directed,
        }
    )

# Preserve approved pilot crops; seed others from CSS defaults
PILOT_IDS = set(manifest.get("pilots") or [])
new_instances = []
id_counts = Counter()

for p in parsed:
    id_counts[p["id"]] += 1

# Ensure unique IDs if collision
seen = {}
for p in parsed:
    base = p["id"]
    if base in seen:
        p["id"] = f"{base}__dup{seen[base]}"
        seen[base] += 1
    else:
        seen[base] = 1

for p in parsed:
    old = existing_by_id.get(p["existing_id"] or p["id"]) or existing_by_id.get(p["id"])
    # also try htmlIndex
    if not old:
        old = existing_by_index.get(p["htmlIndex"])

    d = p["defaults"]
    seed_crop = {
        "fit": d["fit"],
        "x": d["x"],
        "y": d["y"],
        "zoom": 1,
        "scaleX": 1,
        "scaleY": 1,
    }
    crops = {
        "desktop": dict(seed_crop),
        "tablet": dict(seed_crop),
        "mobile": dict(seed_crop),
    }

    approved = False
    status = "UNREVIEWED"
    if old:
        # keep provenance + prior crops if present
        if old.get("approved") and old.get("id") in PILOT_IDS:
            approved = True
            status = "APPROVED"
            crops = old.get("crops") or crops
        elif old.get("approved") and old.get("crops"):
            # previously approved non-pilots: keep crops but reset to UNREVIEWED? User said existing pilot approvals may remain.
            # Keep other approved as approved if they had explicit metadata
            approved = True
            status = "APPROVED"
            crops = old.get("crops") or crops
        elif old.get("crops"):
            # If crops look like non-default human edits (status IN PROGRESS), keep them as UNREVIEWED with those crops
            # For migration: if crops differ from seed and were reviewed, keep values but UNREVIEWED unless approved
            crops = old.get("crops") or crops
            if old.get("status") == "APPROVED" and old.get("approved"):
                approved = True
                status = "APPROVED"
            else:
                status = "UNREVIEWED"
                approved = False

    # Build source from old or path
    src = p["src"]
    if old and old.get("source"):
        source = dict(old["source"])
    else:
        path = None if src.startswith("http") else src.lstrip("/")
        source = {
            "path": path,
            "remoteUrl": src if src.startswith("http") else None,
            "originalPath": None,
            "document": None,
            "url": src if src.startswith("http") else None,
            "family": None,
        }

    intrinsic = (old or {}).get("intrinsic") or {"width": None, "height": None, "ratio": None}

    classification = (old or {}).get("classification") or "UNKNOWN"
    # light classify
    s = src.lower()
    if classification == "UNKNOWN":
        if "csc_brand_assets" in s or "gen-purple" in s or "gen-dark" in s or "brandidentity" in s:
            classification = "HISTORICAL"
        elif any(x in s for x in ["ecosystem-intel", "signal-framework", "product-arch", "hub-dashboard", "read-framework"]):
            classification = "LG STUDIO / STRATEGYIQ EVIDENCE"
        else:
            classification = "CURRENT CANONICAL"

    inst = {
        "id": p["id"],
        "asset": Path(src.split("?")[0]).name,
        "source": source,
        "usage": {
            "section": p["section"],
            "module": p["module"],
            "instance": p["id"],
            "alt": p["alt"],
            "htmlIndex": p["htmlIndex"],
            "occurrenceCount": 1,
            "independentArtDirection": False,
        },
        "classification": classification,
        "intrinsic": intrinsic,
        "render": {
            "objectFit": d["fit"],
            "objectPosition": f"{d['x']}% {d['y']}%",
            "mask": d.get("mask"),
            "aspectRatios": d["ratios"],
            "compositionSensitive": bool(d.get("sensitive") or p["renderMode"] == "directed-contain"),
            "renderMode": p["renderMode"],
        },
        "renderMode": p["renderMode"],
        "status": status,
        "crops": crops,
        "approved": approved,
        "pilot": p["id"] in PILOT_IDS or bool((old or {}).get("pilot")),
        "directed": p["directed"],
    }
    new_instances.append(inst)
    p["final_id"] = p["id"]
    p["inst"] = inst

# occurrence counts
path_counts = Counter(
    (i["source"].get("path") or i["source"].get("remoteUrl")) for i in new_instances
)
for inst in new_instances:
    key = inst["source"].get("path") or inst["source"].get("remoteUrl")
    n = path_counts[key]
    inst["usage"]["occurrenceCount"] = n
    inst["usage"]["independentArtDirection"] = n > 1

# Rewrite HTML: add/update data-csc-img for directed instances
# Process matches from end to start to preserve offsets
pieces = []
# We'll rebuild by replacing each img tag
new_html = html
# Work from end
for p in reversed(parsed):
    mm = p["match"]
    attrs = mm.group(1)
    full = mm.group(0)
    inst_id = p["final_id"]
    if not p["directed"]:
        # strip data-csc-img if present
        new_attrs = re.sub(r'\s*data-csc-img="[^"]*"', "", attrs)
        new_tag = f"<img{new_attrs}>"
    else:
        if re.search(r'data-csc-img="', attrs):
            new_attrs = re.sub(r'data-csc-img="[^"]*"', f'data-csc-img="{inst_id}"', attrs)
        else:
            # insert after <img
            new_attrs = f' data-csc-img="{inst_id}"' + attrs
        new_tag = f"<img{new_attrs}>"
        # normalize <img data... vs <img  data
        new_tag = re.sub(r"<img\s+", "<img ", new_tag)
    new_html = new_html[: mm.start()] + new_tag + new_html[mm.end() :]

HTML_PATH.write_text(new_html, encoding="utf-8")

# Update manifest
manifest["version"] = max(int(manifest.get("version") or 1), 2) + 1  # bump
manifest["instances"] = new_instances
manifest["stats"] = {
    "instances": len(new_instances),
    "uniqueAssets": len({(i["source"].get("path") or i["source"].get("remoteUrl")) for i in new_instances}),
    "directed": sum(1 for i in new_instances if i.get("directed")),
    "nonDirected": sum(1 for i in new_instances if not i.get("directed")),
}
manifest["migration"] = {
    "note": "Full binding pass. Seeded crops match pre-migration CSS object-fit/position.",
    "renderModes": dict(Counter(i["renderMode"] for i in new_instances)),
}
MANIFEST_PATH.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

# Build applied CSS for ALL directed instances (visual equivalence without requiring APPROVED)
# Runtime binder will also apply all directed; CSS is fallback.


def emit_css(instances):
    lines = [
        "/* Auto-generated by CSC binding migration — directed instance seeds */",
        "/* Runtime binder reads the manifest; this is the no-JS fallback. */",
        "",
    ]
    for inst in instances:
        if not inst.get("directed"):
            continue
        if inst.get("renderMode") in ("non-directed", "intrinsic"):
            continue
        crops = inst.get("crops") or {}
        sel = f'[data-csc-img="{inst["id"]}"]'
        d = crops.get("desktop") or seed_crop
        t = crops.get("tablet") or d
        m = crops.get("mobile") or d
        lines.append(f"{sel} {{")
        for bp, c in (("desktop", d), ("tablet", t), ("mobile", m)):
            lines.append(f"  --crop-fit-{bp}: {c['fit']};")
            lines.append(f"  --crop-x-{bp}: {float(c['x']):.2f}%;")
            lines.append(f"  --crop-y-{bp}: {float(c['y']):.2f}%;")
            lines.append(f"  --crop-zoom-{bp}: {float(c['zoom']):.4f};")
            lines.append(f"  --crop-sx-{bp}: {float(c['scaleX']):.4f};")
            lines.append(f"  --crop-sy-{bp}: {float(c['scaleY']):.4f};")
        lines.append("}")
        # Direct rules so unreviewed bound images still match pre-migration look
        lines.append(f"{sel} {{")
        lines.append("  object-fit: var(--crop-fit-desktop, cover) !important;")
        lines.append("  object-position: var(--crop-x-desktop, 50%) var(--crop-y-desktop, 50%) !important;")
        lines.append(
            "  transform: scale(calc(var(--crop-zoom-desktop, 1) * var(--crop-sx-desktop, 1)), calc(var(--crop-zoom-desktop, 1) * var(--crop-sy-desktop, 1))) !important;"
        )
        lines.append("  transform-origin: var(--crop-x-desktop, 50%) var(--crop-y-desktop, 50%) !important;")
        lines.append("}")
        lines.append("@media (max-width: 1100px) {")
        lines.append(f"  {sel} {{")
        lines.append("    object-fit: var(--crop-fit-tablet, var(--crop-fit-desktop, cover)) !important;")
        lines.append("    object-position: var(--crop-x-tablet, 50%) var(--crop-y-tablet, 50%) !important;")
        lines.append(
            "    transform: scale(calc(var(--crop-zoom-tablet, 1) * var(--crop-sx-tablet, 1)), calc(var(--crop-zoom-tablet, 1) * var(--crop-sy-tablet, 1))) !important;"
        )
        lines.append("    transform-origin: var(--crop-x-tablet, 50%) var(--crop-y-tablet, 50%) !important;")
        lines.append("  }")
        lines.append("}")
        lines.append("@media (max-width: 820px) {")
        lines.append(f"  {sel} {{")
        lines.append("    object-fit: var(--crop-fit-mobile, var(--crop-fit-desktop, cover)) !important;")
        lines.append("    object-position: var(--crop-x-mobile, 50%) var(--crop-y-mobile, 50%) !important;")
        lines.append(
            "    transform: scale(calc(var(--crop-zoom-mobile, 1) * var(--crop-sx-mobile, 1)), calc(var(--crop-zoom-mobile, 1) * var(--crop-sy-mobile, 1))) !important;"
        )
        lines.append("    transform-origin: var(--crop-x-mobile, 50%) var(--crop-y-mobile, 50%) !important;")
        lines.append("  }")
        lines.append("}")
        lines.append("")
    return "\n".join(lines)


APPLIED_PATH.write_text(emit_css(new_instances), encoding="utf-8")

print("TOTAL", len(new_instances))
print("DIRECTED", sum(1 for i in new_instances if i["directed"]))
print("MODES", dict(Counter(i["renderMode"] for i in new_instances)))
print("APPROVED", sum(1 for i in new_instances if i["approved"]))
print("SECTIONS", dict(Counter(i["usage"]["section"] for i in new_instances)))
print("wrote", HTML_PATH)
print("wrote", MANIFEST_PATH)
print("wrote", APPLIED_PATH)
