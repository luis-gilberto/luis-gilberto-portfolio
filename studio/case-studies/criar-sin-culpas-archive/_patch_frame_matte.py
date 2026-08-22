#!/usr/bin/env python3
"""Set frameMatte defaults on manifest instances (illustration/SVG → paper)."""
from __future__ import annotations

import json
from pathlib import Path

MANIFEST = Path(__file__).resolve().parent / "csc-case-study-image-manifest.json"

ILLUSTRATION_MODULES = {"illustration-ladder", "named-set"}


def infer_frame_matte(inst: dict) -> str:
    asset = (inst.get("asset") or "").lower()
    usage = inst.get("usage") or {}
    module = usage.get("module") or ""
    src = inst.get("approvedSource") or inst.get("source") or {}
    path = (src.get("path") or src.get("remoteUrl") or "").lower()
    render = inst.get("render") or {}

    if asset.endswith(".svg"):
        return "paper"
    if "doodle" in asset or "symbol" in asset:
        return "paper"
    if module in ILLUSTRATION_MODULES:
        return "paper"
    if "visual-system" in path and render.get("compositionSensitive"):
        return "paper"
    return "match-section"


def main() -> None:
    data = json.loads(MANIFEST.read_text(encoding="utf-8"))
    counts = {"paper": 0, "match-section": 0, "explicit": 0}
    for inst in data["instances"]:
        if inst.get("directed") is False or inst.get("renderMode") == "non-directed":
            continue
        inst.setdefault("render", {})
        if inst["render"].get("frameMatte"):
            counts["explicit"] += 1
            continue
        matte = infer_frame_matte(inst)
        inst["render"]["frameMatte"] = matte
        counts[matte] = counts.get(matte, 0) + 1

    MANIFEST.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("frameMatte defaults:", counts)


if __name__ == "__main__":
    main()
