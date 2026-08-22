#!/usr/bin/env python3
"""Sync First Voice (brand-lineage__gen-card__08) approved source to index.html URL."""
import json
from pathlib import Path

MANIFEST = Path(__file__).resolve().parent / "csc-case-study-image-manifest.json"
NEW_URL = "https://res.cloudinary.com/dogtoagya/image/upload/v1787086240/CSC_original_Brand_system_mewvye.png"
OLD_URL = "https://res.cloudinary.com/dogtoagya/image/upload/v1787069503/Generacion-A_blvrih.png"
INST_ID = "brand-lineage__gen-card__08"


def patch_ref(ref: dict) -> dict:
    ref = dict(ref or {})
    ref["remoteUrl"] = NEW_URL
    ref["url"] = NEW_URL
    ref["filename"] = "CSC_original_Brand_system_mewvye.png"
    ref["type"] = "cloudinary"
    ref["document"] = ref.get("document") or "Authored generation specimen · Cloudinary"
    return ref


def main() -> None:
    data = json.loads(MANIFEST.read_text(encoding="utf-8"))
    inst = next(i for i in data["instances"] if i["id"] == INST_ID)
    inst["asset"] = "CSC_original_Brand_system_mewvye.png"
    inst["source"] = patch_ref(inst.get("source"))
    inst["approvedSource"] = patch_ref(inst.get("approvedSource"))
    inst["workingSource"] = patch_ref(inst.get("workingSource"))

    cbs = inst.get("cropsBySource") or {}
    if OLD_URL in cbs:
        cbs[NEW_URL] = cbs.pop(OLD_URL)
    inst["cropsBySource"] = cbs

    hist = inst.get("sourceHistory") or []
    hist.append(
        {
            "at": "first-voice-source-sync",
            "role": "approvedSource",
            "from": {"remoteUrl": OLD_URL, "filename": "Generacion-A_blvrih.png"},
            "source": patch_ref({"remoteUrl": NEW_URL}),
        }
    )
    inst["sourceHistory"] = hist

    MANIFEST.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Updated {INST_ID} -> {NEW_URL}")


if __name__ == "__main__":
    main()
