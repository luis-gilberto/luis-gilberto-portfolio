"""Restore top-level renderMode + directed after source-model migration."""
from __future__ import annotations

import json
from collections import Counter
from pathlib import Path

CASE = Path("studio/case-studies/criar-sin-culpas")
MANIFEST = CASE / "csc-case-study-image-manifest.json"

manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))

CONTAIN_MODULES = {"early-frag", "illustration-ladder", "named-set"}

for inst in manifest["instances"]:
    render = inst.get("render") or {}
    module = (inst.get("usage") or {}).get("module", "")
    src = (inst.get("approvedSource") or inst.get("source") or {}).get("path") or ""

    if render.get("mask") == "circle" or module == "start-portrait":
        mode = "circular"
    elif (
        render.get("compositionSensitive")
        or module in CONTAIN_MODULES
        or src.endswith(".svg")
    ):
        mode = "directed-contain"
    else:
        mode = "directed-cover"

    inst["renderMode"] = mode
    inst["directed"] = True
    render["renderMode"] = mode
    render["compositionSensitive"] = mode == "directed-contain"
    inst["render"] = render

manifest["version"] = max(manifest.get("version", 4), 4) + 0.001

MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

modes = Counter(i["renderMode"] for i in manifest["instances"])
print("restored modes", dict(modes))
print("directed", sum(1 for i in manifest["instances"] if i.get("directed")))
