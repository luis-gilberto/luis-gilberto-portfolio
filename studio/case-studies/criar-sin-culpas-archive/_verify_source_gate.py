"""Verify source replacement gate: workingSource != approvedSource must not render live."""
from __future__ import annotations

import json
from pathlib import Path

from playwright.sync_api import sync_playwright

MANIFEST = Path("studio/case-studies/criar-sin-culpas/csc-case-study-image-manifest.json")
CASE = "http://127.0.0.1:4173/studio/case-studies/criar-sin-culpas/"

PILOTS = [
    "starting-point__start-portrait__01",
    "reader-state__artifact__14",
    "brand-lineage__gen-card__08",  # historical/evolution
]

m = json.loads(MANIFEST.read_text(encoding="utf-8"))
by_id = {i["id"]: i for i in m["instances"]}

# Set portrait workingSource to a different cloudinary URL WITHOUT approving
PORTRAIT = "starting-point__start-portrait__01"
inst = by_id[PORTRAIT]
approved_key = inst["approvedSource"].get("remoteUrl") or inst["approvedSource"].get("path")
candidate_url = "https://res.cloudinary.com/dogtoagya/image/upload/f_auto,q_auto/877ABFEF-099C-42E5-8E96-E79B5434E6E4_euklcc.png"
# If already same, use a fake different path for test
if inst["workingSource"].get("remoteUrl") == candidate_url:
    test_working = {
        **inst["workingSource"],
        "remoteUrl": candidate_url + "?test=1",
        "url": candidate_url + "?test=1",
        "filename": "test-candidate.png",
    }
else:
    test_working = {
        "path": None,
        "remoteUrl": candidate_url,
        "originalPath": None,
        "document": "Pilot candidate",
        "url": candidate_url,
        "family": "Photography",
        "type": "cloudinary",
        "filename": "877ABFEF-099C-42E5-8E96-E79B5434E6E4_euklcc.png",
    }

inst["workingSource"] = test_working
if candidate_url not in inst.get("cropsBySource", {}):
    inst.setdefault("cropsBySource", {})[candidate_url] = inst["crops"].copy()
# Do NOT change approvedSource
MANIFEST.write_text(json.dumps(m, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto(CASE + "#starting-point", wait_until="networkidle", timeout=90000)
    page.wait_for_function("() => document.documentElement.dataset.cscCropsBound === '52'")
    live_src = page.evaluate(
        """() => document.querySelector('[data-csc-img="starting-point__start-portrait__01"]')?.getAttribute('src')"""
    )
    approved_src = inst["approvedSource"].get("remoteUrl") or (
        "/" + inst["approvedSource"]["path"] if inst["approvedSource"].get("path") else None
    )
    print("live src:", live_src)
    print("approved:", approved_src)
    print("working (unapproved):", test_working.get("remoteUrl"))
    gate_ok = live_src == approved_src or (approved_src and approved_src in (live_src or ""))
    print("GATE_OK", gate_ok)
    browser.close()

exit(0 if gate_ok else 1)
