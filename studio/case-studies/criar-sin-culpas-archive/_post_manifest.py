"""Post-process manifest + write inventory markdown."""
from __future__ import annotations

import json
from collections import Counter
from pathlib import Path

ROOT = Path(".")
MANIFEST = ROOT / "studio/case-studies/criar-sin-culpas/csc-case-study-image-manifest.json"
INV = ROOT / "studio/case-studies/criar-sin-culpas/csc-image-inventory.md"

m = json.loads(MANIFEST.read_text(encoding="utf-8"))

for inst in m["instances"]:
    if "csc-bilingual-en-micro" in (inst.get("asset") or ""):
        inst["source"]["family"] = "Current production CSC captures"
        inst["source"]["document"] = "Derived bilingual micro specimen"
        inst["classification"] = "CURRENT CANONICAL"
    if inst["id"] in m.get("pilots", []):
        inst["pilot"] = True

lines = [
    "# CSC Case Study Image Inventory",
    "",
    f"Instances: {m['stats']['instances']}",
    f"Unique assets: {m['stats']['uniqueAssets']}",
    "",
    "| ID | Asset | Section | Module | Class | Path |",
    "|---|---|---|---|---|---|",
]
for i in m["instances"]:
    path = i["source"].get("path") or i["source"].get("remoteUrl") or ""
    lines.append(
        f"| `{i['id']}` | {i['asset']} | {i['usage']['section']} | {i['usage']['module']} | {i['classification']} | `{path}` |"
    )

INV.write_text("\n".join(lines) + "\n", encoding="utf-8")
MANIFEST.write_text(json.dumps(m, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

print("classes", Counter(i["classification"] for i in m["instances"]))
print("pilots", m["pilots"])
print("wrote", INV)
