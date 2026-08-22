#!/usr/bin/env python3
"""Patch operations ops-tile manifest entries to mockup Cloudinary sources."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MANIFEST = ROOT / "csc-case-study-image-manifest.json"

OPS = {
    "operations__ops-tile__41": {
        "asset": "Rhyth_landscape_gbxcnk.png",
        "url": "https://res.cloudinary.com/dogtoagya/image/upload/v1787144089/Rhyth_landscape_gbxcnk.png",
        "document": "StrategyIQ operating mockup · Rhythm (landscape)",
        "alt": "Operating rhythm and publishing cadence behind the public surface",
        "intrinsic": {"width": 1672, "height": 941, "ratio": 1.7768},
    },
    "operations__ops-tile__44": {
        "asset": "governance_pm2qti.png",
        "url": "https://res.cloudinary.com/dogtoagya/image/upload/v1787141054/governance_pm2qti.png",
        "document": "StrategyIQ operating mockup · Governance",
        "alt": "Ownership and governance · who owns what, and which rules keep the system coherent",
        "intrinsic": {"width": 1536, "height": 1024, "ratio": 1.5},
    },
    "operations__ops-tile__46": {
        "asset": "CSC_workspace_evi1vq.png",
        "url": "https://res.cloudinary.com/dogtoagya/image/upload/v1787141053/CSC_workspace_evi1vq.png",
        "document": "StrategyIQ operating mockup · Client workspace",
        "alt": "Client workspace · context, active work, priorities, and continuity in one environment",
        "intrinsic": {"width": 906, "height": 870, "ratio": 1.0414},
    },
    "operations__ops-tile__43": {
        "asset": "Roadmap_mberfg.png",
        "url": "https://res.cloudinary.com/dogtoagya/image/upload/v1787141056/Roadmap_mberfg.png",
        "document": "StrategyIQ operating mockup · Production roadmap",
        "alt": "Production journey map · how work moves from signal to shipped support",
        "intrinsic": {"width": 1672, "height": 941, "ratio": 1.7768},
    },
    "operations__ops-tile__45": {
        "asset": "protected_access_ziohwh.png",
        "url": "https://res.cloudinary.com/dogtoagya/image/upload/v1787141055/protected_access_ziohwh.png",
        "document": "StrategyIQ operating mockup · Protected access",
        "alt": "Protected access · north star for secure client entry and operating continuity",
        "intrinsic": {"width": 1672, "height": 941, "ratio": 1.7768},
    },
    "operations__ops-tile__42": {
        "asset": "CSC_Report_sizlxo.png",
        "url": "https://res.cloudinary.com/dogtoagya/image/upload/v1787141058/CSC_Report_sizlxo.png",
        "document": "StrategyIQ operating mockup · Measurement report",
        "alt": "Measurement · structured reporting and signal reading as operating practice",
        "intrinsic": {"width": 1672, "height": 941, "ratio": 1.7768},
    },
}

NEUTRAL_CROPS = {
    "desktop": {"fit": "contain", "x": 50, "y": 50, "zoom": 1, "scaleX": 1, "scaleY": 1},
    "tablet": {"fit": "contain", "x": 50, "y": 50, "zoom": 1, "scaleX": 1, "scaleY": 1},
    "mobile": {"fit": "contain", "x": 50, "y": 50, "zoom": 1, "scaleX": 1, "scaleY": 1},
}


def cloudinary_source(meta):
    url = meta["url"]
    fn = meta["asset"]
    base = {
        "path": None,
        "remoteUrl": url,
        "originalPath": None,
        "document": meta["document"],
        "url": url,
        "family": "StrategyIQ operating mockup",
        "type": "cloudinary",
        "filename": fn,
    }
    return base


def patch_instance(inst, meta):
    src = cloudinary_source(meta)
    inst["asset"] = meta["asset"]
    inst["source"] = {k: src[k] for k in ("path", "remoteUrl", "originalPath", "document", "url", "family")}
    inst["usage"]["alt"] = meta["alt"]
    inst["classification"] = "STRATEGYIQ EVIDENCE"
    inst["intrinsic"] = meta["intrinsic"]
    inst["render"] = {
        "objectFit": "contain",
        "objectPosition": "center center",
        "mask": None,
        "aspectRatios": {"desktop": "16/10", "tablet": "16/10", "mobile": "16/10"},
        "compositionSensitive": True,
        "renderMode": "directed-contain",
    }
    inst["status"] = "UNREVIEWED"
    inst["crops"] = dict(NEUTRAL_CROPS)
    inst["approved"] = False
    inst["originalSelection"] = src.copy()
    inst["approvedSource"] = src.copy()
    inst["workingSource"] = src.copy()
    inst["renderMode"] = "directed-contain"
    inst["directed"] = True
    inst["sourceLocked"] = True
    inst["cropsBySource"] = {meta["url"]: dict(NEUTRAL_CROPS)}
    hist = inst.get("sourceHistory") or []
    hist.append({"at": "ops-mockup-cloudinary", "role": "approvedSource", "source": src.copy()})
    inst["sourceHistory"] = hist


def main():
    data = json.loads(MANIFEST.read_text(encoding="utf-8"))
    by_id = {i["id"]: i for i in data["instances"]}
    for iid, meta in OPS.items():
        if iid not in by_id:
            raise SystemExit(f"Missing instance {iid}")
        patch_instance(by_id[iid], meta)
    MANIFEST.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("patched", len(OPS), "operations instances")


if __name__ == "__main__":
    main()
