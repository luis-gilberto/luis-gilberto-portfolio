#!/usr/bin/env python3
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
html = (ROOT / "index.html").read_text(encoding="utf-8")
dom = set(re.findall(r'data-csc-img="([^"]+)"', html))
manifest = json.loads((ROOT / "csc-case-study-image-manifest.json").read_text(encoding="utf-8"))

missing = []
for inst in manifest["instances"]:
    if inst.get("directed") is False or inst.get("renderMode") == "non-directed":
        continue
    if inst["id"] in dom:
        continue
    src = inst.get("approvedSource") or inst.get("source") or {}
    url = src.get("remoteUrl") or src.get("url")
    path = src.get("path")
    if path and not url:
        url = "/" + str(path).replace("\\", "/").lstrip("/")
    missing.append(
        {
            "id": inst["id"],
            "asset": inst.get("asset", ""),
            "section": inst["usage"]["section"],
            "module": inst["usage"]["module"],
            "alt": inst["usage"].get("alt", ""),
            "url": url or "",
        }
    )

print(json.dumps(missing, indent=2, ensure_ascii=False))
print(f"\n# total: {len(missing)}", file=__import__("sys").stderr)
