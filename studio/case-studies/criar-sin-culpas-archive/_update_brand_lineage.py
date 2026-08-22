"""Wire authored Cloudinary generation specimens into brand-lineage section."""
from __future__ import annotations

import json
import urllib.request
from copy import deepcopy
from pathlib import Path

CASE = Path("studio/case-studies/criar-sin-culpas")
MANIFEST = CASE / "csc-case-study-image-manifest.json"
APPLIED = CASE / "csc-crops-applied.css"

GENERATIONS = {
    "brand-lineage__gen-card__08": {
        "generation": "A",
        "label": "Purple Era",
        "url": "https://res.cloudinary.com/dogtoagya/image/upload/v1787069503/Generacion-A_blvrih.png",
        "filename": "Generacion-A_blvrih.png",
        "alt": "Generation A specimen · Purple Era early identity",
    },
    "brand-lineage__gen-card__09": {
        "generation": "B",
        "label": "Dark Guides",
        "url": "https://res.cloudinary.com/dogtoagya/image/upload/v1787069497/Generacion-B_v3scfv.png",
        "filename": "Generacion-B_v3scfv.png",
        "alt": "Generation B specimen · Dark Guides era",
    },
    "brand-lineage__gen-card__12": {
        "generation": "C",
        "label": "Navy v2",
        "url": "https://res.cloudinary.com/dogtoagya/image/upload/v1787069578/Generacion-C_ldctxl.png",
        "filename": "Generacion-C_ldctxl.png",
        "alt": "Generation C specimen · Navy v2 structural refinement",
    },
    "brand-lineage__gen-card__10": {
        "generation": "D",
        "label": "Published Brand Book",
        "url": "https://res.cloudinary.com/dogtoagya/image/upload/v1787069496/Generacion-D_quyjwy.png",
        "filename": "Generacion-D_quyjwy.png",
        "alt": "Generation D specimen · Published Brand Book formalization",
    },
}

CONTAIN_CROPS = {
    "desktop": {"fit": "contain", "x": 50, "y": 50, "zoom": 1, "scaleX": 1, "scaleY": 1},
    "tablet": {"fit": "contain", "x": 50, "y": 50, "zoom": 1, "scaleX": 1, "scaleY": 1},
    "mobile": {"fit": "contain", "x": 50, "y": 50, "zoom": 1, "scaleX": 1, "scaleY": 1},
}

GEN_CARD_RATIOS = {
    "desktop": "280/180",
    "tablet": "260/180",
    "mobile": "240/180",
}


def cloudinary_source(url: str, filename: str) -> dict:
    return {
        "path": None,
        "remoteUrl": url,
        "originalPath": None,
        "document": "Authored generation specimen · Cloudinary",
        "url": url,
        "family": "CSC visual generation lineage",
        "type": "cloudinary",
        "filename": filename,
    }


def fetch_intrinsic(url: str) -> dict:
    try:
        probe = url.replace("/upload/", "/upload/f_auto,q_auto/")
        with urllib.request.urlopen(probe, timeout=15) as resp:
            data = resp.read()
        # PNG/JPEG dimension sniff · sufficient for manifest metadata
        if data[:8] == b"\x89PNG\r\n\x1a\n" and len(data) > 24:
            w = int.from_bytes(data[16:20], "big")
            h = int.from_bytes(data[20:24], "big")
            return {"width": w, "height": h, "ratio": round(w / h, 4) if h else 1}
        if data[:2] == b"\xff\xd8":
            i = 2
            while i < len(data) - 8:
                if data[i] != 0xFF:
                    break
                marker = data[i + 1]
                if marker in (0xC0, 0xC1, 0xC2):
                    h = int.from_bytes(data[i + 5 : i + 7], "big")
                    w = int.from_bytes(data[i + 7 : i + 9], "big")
                    return {"width": w, "height": h, "ratio": round(w / h, 4) if h else 1}
                length = int.from_bytes(data[i + 2 : i + 4], "big")
                i += 2 + length
    except Exception:
        pass
    return {"width": 1280, "height": 720, "ratio": 1.7778}


def apply_generation(inst: dict, spec: dict) -> None:
    src = cloudinary_source(spec["url"], spec["filename"])
    key = spec["url"]
    crops = deepcopy(CONTAIN_CROPS)

    inst["asset"] = spec["filename"]
    inst["source"] = {k: src.get(k) for k in ("path", "remoteUrl", "originalPath", "document", "url", "family")}
    inst["classification"] = "HISTORICAL"
    inst["approved"] = False
    inst["status"] = "UNREVIEWED"
    inst["renderMode"] = "directed-contain"
    inst["directed"] = True
    inst["usage"]["alt"] = spec["alt"]
    inst["usage"]["generation"] = spec["generation"]
    inst["usage"]["generationLabel"] = spec["label"]
    inst["intrinsic"] = fetch_intrinsic(spec["url"])
    inst["render"] = {
        "objectFit": "contain",
        "objectPosition": "center center",
        "mask": None,
        "aspectRatios": GEN_CARD_RATIOS.copy(),
        "compositionSensitive": True,
        "renderMode": "directed-contain",
    }
    inst["crops"] = deepcopy(crops)
    inst["approvedSource"] = deepcopy(src)
    inst["workingSource"] = deepcopy(src)
    inst["cropsBySource"] = {key: deepcopy(crops)}
    inst.setdefault("sourceHistory", []).append(
        {"at": "2026-08-18Tbrand-lineage-specimens", "role": "approvedSource", "source": deepcopy(src)}
    )


def restore_reader_state(inst: dict) -> None:
    live = {
        "path": "studio/case-studies/criar-sin-culpas/evidence/live-apoyo-hub.png",
        "remoteUrl": None,
        "originalPath": None,
        "document": "Live CSC Guias / Apoyo hub",
        "url": "https://criarsinculpas.com/apoyo",
        "family": "Live production capture",
        "type": "local",
        "filename": "live-apoyo-hub.png",
    }
    key = live["path"]
    inst["asset"] = "live-apoyo-hub.png"
    inst["source"] = {k: live.get(k) for k in ("path", "remoteUrl", "originalPath", "document", "url", "family")}
    inst["approvedSource"] = deepcopy(live)
    inst["workingSource"] = deepcopy(live)
    inst["classification"] = "CURRENT CANONICAL"
    if inst.get("cropsBySource", {}).get(key):
        inst["crops"] = deepcopy(inst["cropsBySource"][key])
    inst.setdefault("sourceHistory", []).append(
        {"at": "2026-08-18Tbrand-lineage-specimens", "role": "approvedSource", "source": deepcopy(live)}
    )


def regenerate_applied(manifest: dict) -> None:
    lines = [
        "/* Auto-generated · directed instance seeds / synced crops */",
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
        lines.append(
            "    object-position: var(--crop-x-tablet, 50%) var(--crop-y-tablet, 50%) !important;"
        )
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
        lines.append(
            "    object-position: var(--crop-x-mobile, 50%) var(--crop-y-mobile, 50%) !important;"
        )
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
    by_id = {i["id"]: i for i in manifest["instances"]}

    for iid, spec in GENERATIONS.items():
        if iid == "brand-lineage__gen-card__12":
            continue
        apply_generation(by_id[iid], spec)

    # New Generation C instance
    gen_c = {
        "id": "brand-lineage__gen-card__12",
        "asset": GENERATIONS["brand-lineage__gen-card__12"]["filename"],
        "source": cloudinary_source(
            GENERATIONS["brand-lineage__gen-card__12"]["url"],
            GENERATIONS["brand-lineage__gen-card__12"]["filename"],
        ),
        "usage": {
            "section": "brand-lineage",
            "module": "gen-card",
            "instance": "brand-lineage__gen-card__12",
            "alt": GENERATIONS["brand-lineage__gen-card__12"]["alt"],
            "htmlIndex": 10,
            "occurrenceCount": 1,
            "independentArtDirection": False,
            "generation": "C",
            "generationLabel": "Navy v2",
        },
        "classification": "HISTORICAL",
        "intrinsic": fetch_intrinsic(GENERATIONS["brand-lineage__gen-card__12"]["url"]),
        "render": {
            "objectFit": "contain",
            "objectPosition": "center center",
            "mask": None,
            "aspectRatios": GEN_CARD_RATIOS.copy(),
            "compositionSensitive": True,
            "renderMode": "directed-contain",
        },
        "status": "UNREVIEWED",
        "crops": deepcopy(CONTAIN_CROPS),
        "approved": False,
        "originalSelection": cloudinary_source(
            GENERATIONS["brand-lineage__gen-card__12"]["url"],
            GENERATIONS["brand-lineage__gen-card__12"]["filename"],
        ),
        "approvedSource": cloudinary_source(
            GENERATIONS["brand-lineage__gen-card__12"]["url"],
            GENERATIONS["brand-lineage__gen-card__12"]["filename"],
        ),
        "workingSource": cloudinary_source(
            GENERATIONS["brand-lineage__gen-card__12"]["url"],
            GENERATIONS["brand-lineage__gen-card__12"]["filename"],
        ),
        "sourceHistory": [
            {
                "at": "2026-08-18Tbrand-lineage-specimens",
                "role": "originalSelection",
                "source": cloudinary_source(
                    GENERATIONS["brand-lineage__gen-card__12"]["url"],
                    GENERATIONS["brand-lineage__gen-card__12"]["filename"],
                ),
            }
        ],
        "cropsBySource": {
            GENERATIONS["brand-lineage__gen-card__12"]["url"]: deepcopy(CONTAIN_CROPS)
        },
        "renderMode": "directed-contain",
        "directed": True,
    }
    apply_generation(gen_c, GENERATIONS["brand-lineage__gen-card__12"])

    # Insert Gen C after Gen B in manifest list
    if "brand-lineage__gen-card__12" not in by_id:
        idx = next(i for i, x in enumerate(manifest["instances"]) if x["id"] == "brand-lineage__gen-card__09")
        manifest["instances"].insert(idx + 1, gen_c)
        by_id["brand-lineage__gen-card__12"] = gen_c

    restore_reader_state(by_id["reader-state__artifact__14"])

    manifest["stats"]["instances"] = len(manifest["instances"])
    manifest["version"] = manifest.get("version", 4) + 0.01

    MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    regenerate_applied(manifest)
    print("updated lineage instances:", list(GENERATIONS.keys()))
    print("added Gen C:", "brand-lineage__gen-card__12")
    print("restored reader-state__artifact__14")
    print("total instances:", len(manifest["instances"]))


if __name__ == "__main__":
    main()
