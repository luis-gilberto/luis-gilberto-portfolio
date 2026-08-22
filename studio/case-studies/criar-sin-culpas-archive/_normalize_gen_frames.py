"""Normalize historical generation specimen crops + regenerate applied CSS."""
from __future__ import annotations

import json
from copy import deepcopy
from pathlib import Path

CASE = Path("studio/case-studies/criar-sin-culpas")
MANIFEST = CASE / "csc-case-study-image-manifest.json"
APPLIED = CASE / "csc-crops-applied.css"

# Fill-frame contain zooms derived from specimen aspect vs 238×180 module.
# C/D at 1.0 are the archival reference; A/B tuned to match perceived boundaries.
NORMALIZED = {
    "brand-lineage__gen-card__08": {
        "desktop": {"fit": "contain", "x": 50, "y": 50, "zoom": 1.16, "scaleX": 1, "scaleY": 1},
        "tablet": {"fit": "contain", "x": 50, "y": 50, "zoom": 1.16, "scaleX": 1, "scaleY": 1},
        "mobile": {"fit": "contain", "x": 50, "y": 50, "zoom": 1.14, "scaleX": 1, "scaleY": 1},
    },
    "brand-lineage__gen-card__09": {
        "desktop": {"fit": "contain", "x": 50, "y": 48, "zoom": 1.04, "scaleX": 1, "scaleY": 1},
        "tablet": {"fit": "contain", "x": 50, "y": 48, "zoom": 1.03, "scaleX": 1, "scaleY": 1},
        "mobile": {"fit": "contain", "x": 50, "y": 48, "zoom": 1.03, "scaleX": 1, "scaleY": 1},
    },
    "brand-lineage__gen-card__12": {
        "desktop": {"fit": "contain", "x": 50, "y": 50, "zoom": 1, "scaleX": 1, "scaleY": 1},
        "tablet": {"fit": "contain", "x": 50, "y": 50, "zoom": 1, "scaleX": 1, "scaleY": 1},
        "mobile": {"fit": "contain", "x": 50, "y": 50, "zoom": 1, "scaleX": 1, "scaleY": 1},
    },
    "brand-lineage__gen-card__10": {
        "desktop": {"fit": "contain", "x": 50, "y": 50, "zoom": 1, "scaleX": 1, "scaleY": 1},
        "tablet": {"fit": "contain", "x": 50, "y": 50, "zoom": 1, "scaleX": 1, "scaleY": 1},
        "mobile": {"fit": "contain", "x": 50, "y": 50, "zoom": 1, "scaleX": 1, "scaleY": 1},
    },
}


def source_key(ref: dict) -> str:
    return ref.get("remoteUrl") or ref.get("path") or ref.get("url") or ""


def regenerate_applied(manifest: dict) -> None:
    lines = [
        "/* Auto-generated — directed instance seeds / synced crops */",
        "/* Runtime binder reads the manifest; this is the no-JS fallback. */",
        "",
    ]
    for inst in manifest["instances"]:
        if inst.get("directed") is False or inst.get("renderMode") == "non-directed":
            continue
        crops = inst.get("crops") or {}
        sel = f'[data-csc-img="{inst["id"]}"]'
        d = crops.get("desktop") or {"fit": "cover", "x": 50, "y": 50, "zoom": 1, "scaleX": 1, "scaleY": 1}
        t = crops.get("tablet") or d
        mob = crops.get("mobile") or d

        def block(bp: str, c: dict) -> list[str]:
            return [
                f"  --crop-fit-{bp}: {c.get('fit', 'cover')};",
                f"  --crop-x-{bp}: {c.get('x', 50):.2f}%;",
                f"  --crop-y-{bp}: {c.get('y', 50):.2f}%;",
                f"  --crop-zoom-{bp}: {c.get('zoom', 1):.4f};",
                f"  --crop-sx-{bp}: {c.get('scaleX', 1):.4f};",
                f"  --crop-sy-{bp}: {c.get('scaleY', 1):.4f};",
            ]

        lines.append(f"{sel} {{")
        lines.extend(block("desktop", d))
        lines.extend(block("tablet", t))
        lines.extend(block("mobile", mob))
        lines.append("}")
        for bp, var in [("desktop", "desktop"), ("tablet", "tablet"), ("mobile", "mobile")]:
            pass
        lines.append(f"{sel} {{")
        lines.append("  object-fit: var(--crop-fit-desktop, cover) !important;")
        lines.append("  object-position: var(--crop-x-desktop, 50%) var(--crop-y-desktop, 50%) !important;")
        lines.append(
            "  transform: scale(calc(var(--crop-zoom-desktop, 1) * var(--crop-sx-desktop, 1)), "
            "calc(var(--crop-zoom-desktop, 1) * var(--crop-sy-desktop, 1))) !important;"
        )
        lines.append("  transform-origin: var(--crop-x-desktop, 50%) var(--crop-y-desktop, 50%) !important;")
        lines.append("}")
        lines.append("@media (max-width: 1100px) {")
        lines.append(f"  {sel} {{")
        lines.append("    object-fit: var(--crop-fit-tablet, var(--crop-fit-desktop, cover)) !important;")
        lines.append("    object-position: var(--crop-x-tablet, 50%) var(--crop-y-tablet, 50%) !important;")
        lines.append(
            "    transform: scale(calc(var(--crop-zoom-tablet, 1) * var(--crop-sx-tablet, 1)), "
            "calc(var(--crop-zoom-tablet, 1) * var(--crop-sy-tablet, 1))) !important;"
        )
        lines.append(
            "    transform-origin: var(--crop-x-tablet, 50%) var(--crop-y-tablet, 50%) !important;"
        )
        lines.append("  }")
        lines.append("}")
        lines.append("@media (max-width: 820px) {")
        lines.append(f"  {sel} {{")
        lines.append("    object-fit: var(--crop-fit-mobile, var(--crop-fit-desktop, cover)) !important;")
        lines.append("    object-position: var(--crop-x-mobile, 50%) var(--crop-y-mobile, 50%) !important;")
        lines.append(
            "    transform: scale(calc(var(--crop-zoom-mobile, 1) * var(--crop-sx-mobile, 1)), "
            "calc(var(--crop-zoom-mobile, 1) * var(--crop-sy-mobile, 1))) !important;"
        )
        lines.append(
            "    transform-origin: var(--crop-x-mobile, 50%) var(--crop-y-mobile, 50%) !important;"
        )
        lines.append("  }")
        lines.append("}")
        lines.append("")

    APPLIED.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    for inst in manifest["instances"]:
        iid = inst["id"]
        if iid not in NORMALIZED:
            continue
        crops = deepcopy(NORMALIZED[iid])
        inst["crops"] = crops
        key = source_key(inst.get("approvedSource") or inst.get("source") or {})
        if key:
            inst.setdefault("cropsBySource", {})[key] = deepcopy(crops)
        inst["status"] = "UNREVIEWED"
        inst["approved"] = False
        inst.setdefault("sourceHistory", []).append(
            {
                "at": "2026-08-18Tlineage-frame-normalize",
                "role": "cropNormalize",
                "note": "Archival frame normalization — trim outer matte only",
            }
        )

    MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    regenerate_applied(manifest)
    print("normalized", list(NORMALIZED.keys()))


if __name__ == "__main__":
    main()
