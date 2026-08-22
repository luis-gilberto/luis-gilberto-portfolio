"""Migrate manifest instances to source-replacement model without changing crops."""
from __future__ import annotations

import copy
import json
from pathlib import Path

MANIFEST = Path("studio/case-studies/criar-sin-culpas/csc-case-study-image-manifest.json")

m = json.loads(MANIFEST.read_text(encoding="utf-8"))


def source_ref(src: dict) -> dict:
    path = src.get("path")
    remote = src.get("remoteUrl") or (src.get("url") if src.get("url") and str(src.get("url")).startswith("http") else None)
    return {
        "path": path,
        "remoteUrl": remote,
        "originalPath": src.get("originalPath"),
        "document": src.get("document"),
        "url": src.get("url") or remote,
        "family": src.get("family"),
        "type": "cloudinary" if remote and "cloudinary" in str(remote) else ("remote" if remote else "local"),
        "filename": Path((path or remote or "unknown").split("?")[0]).name,
    }


def source_key(ref: dict) -> str:
    return ref.get("remoteUrl") or ref.get("path") or ""


for inst in m["instances"]:
    src = inst.get("source") or {}
    ref = source_ref(src)
    key = source_key(ref)

    if not inst.get("originalSelection"):
        inst["originalSelection"] = copy.deepcopy(ref)

    if not inst.get("approvedSource"):
        inst["approvedSource"] = copy.deepcopy(ref)

    if not inst.get("workingSource"):
        inst["workingSource"] = copy.deepcopy(ref)

    if not inst.get("sourceHistory"):
        inst["sourceHistory"] = [
            {
                "at": "migration",
                "role": "originalSelection",
                "source": copy.deepcopy(ref),
            }
        ]

    if not inst.get("cropsBySource"):
        inst["cropsBySource"] = {}
    if key and key not in inst["cropsBySource"]:
        inst["cropsBySource"][key] = copy.deepcopy(inst.get("crops") or {})

    # keep legacy source mirror of approvedSource for older tools
    inst["source"] = {
        "path": inst["approvedSource"].get("path"),
        "remoteUrl": inst["approvedSource"].get("remoteUrl"),
        "originalPath": inst["approvedSource"].get("originalPath"),
        "document": inst["approvedSource"].get("document"),
        "url": inst["approvedSource"].get("url"),
        "family": inst["approvedSource"].get("family"),
    }

    # crops mirror approved source crops
    ak = source_key(inst["approvedSource"])
    if ak and ak in inst["cropsBySource"]:
        inst["crops"] = copy.deepcopy(inst["cropsBySource"][ak])

m["version"] = max(int(m.get("version") or 3), 3) + 1
m["features"] = {**(m.get("features") or {}), "sourceReplacement": True}
MANIFEST.write_text(json.dumps(m, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
print("migrated", len(m["instances"]), "version", m["version"])
