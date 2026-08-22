"""Force contain fit on composition-sensitive instances; regenerate applied CSS."""
from __future__ import annotations

import json
from pathlib import Path

CASE = Path("studio/case-studies/criar-sin-culpas")
MANIFEST = CASE / "csc-case-study-image-manifest.json"
APPLIED = CASE / "csc-crops-applied.css"

m = json.loads(MANIFEST.read_text(encoding="utf-8"))
fixed = 0
for i in m["instances"]:
    mode = i.get("renderMode") or ""
    if mode in ("directed-contain", "intrinsic"):
        for _bp, c in (i.get("crops") or {}).items():
            if c.get("fit") != "contain":
                c["fit"] = "contain"
                fixed += 1
        i.setdefault("render", {})["objectFit"] = "contain"
        i["render"]["compositionSensitive"] = True
    if mode == "circular":
        i.setdefault("render", {})["mask"] = "circle"

MANIFEST.write_text(json.dumps(m, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

lines = [
    "/* Auto-generated — directed instance seeds / synced crops */",
    "/* Runtime binder reads the manifest; this is the no-JS fallback. */",
    "",
]
for inst in m["instances"]:
    if inst.get("directed") is False or inst.get("renderMode") == "non-directed":
        continue
    crops = inst.get("crops") or {}
    sel = f'[data-csc-img="{inst["id"]}"]'
    d = crops.get("desktop") or {"fit": "cover", "x": 50, "y": 50, "zoom": 1, "scaleX": 1, "scaleY": 1}
    t = crops.get("tablet") or d
    mob = crops.get("mobile") or d
    lines.append(f"{sel} {{")
    for bp, c in (("desktop", d), ("tablet", t), ("mobile", mob)):
        lines.append(f"  --crop-fit-{bp}: {c['fit']};")
        lines.append(f"  --crop-x-{bp}: {float(c['x']):.2f}%;")
        lines.append(f"  --crop-y-{bp}: {float(c['y']):.2f}%;")
        lines.append(f"  --crop-zoom-{bp}: {float(c['zoom']):.4f};")
        lines.append(f"  --crop-sx-{bp}: {float(c.get('scaleX', 1)):.4f};")
        lines.append(f"  --crop-sy-{bp}: {float(c.get('scaleY', 1)):.4f};")
    lines.append("}")
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

APPLIED.write_text("\n".join(lines), encoding="utf-8")
print("fit_fixes", fixed)
print("wrote", APPLIED)
