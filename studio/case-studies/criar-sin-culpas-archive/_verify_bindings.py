"""Integrity check: DOM bindings vs manifest after migration."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from collections import Counter

from playwright.sync_api import sync_playwright

ROOT = Path(".")
CASE = ROOT / "studio/case-studies/criar-sin-culpas"
html = (CASE / "index.html").read_text(encoding="utf-8")
manifest = json.loads((CASE / "csc-case-study-image-manifest.json").read_text(encoding="utf-8"))

dom_ids = re.findall(r'data-csc-img="([^"]+)"', html)
img_count = len(re.findall(r"<img\b", html, re.I))
manifest_ids = [i["id"] for i in manifest["instances"]]
directed = [i for i in manifest["instances"] if i.get("directed") is not False and i.get("renderMode") != "non-directed"]

missing_dom = [i["id"] for i in directed if i["id"] not in set(dom_ids)]
orphan_dom = [d for d in dom_ids if d not in set(manifest_ids)]
dups = [i for i, c in Counter(dom_ids).items() if c > 1]
approved = [i for i in manifest["instances"] if i.get("approved")]
unreviewed = [i for i in manifest["instances"] if not i.get("approved")]

print("html_imgs", img_count)
print("dom_bound", len(dom_ids))
print("manifest", len(manifest_ids))
print("directed", len(directed))
print("approved", len(approved))
print("unreviewed", len(unreviewed))
print("modes", dict(Counter(i.get("renderMode") for i in manifest["instances"])))
print("missing_dom", missing_dom)
print("orphan_dom", orphan_dom)
print("dup_dom", dups)

# Live binder check
failures = []
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("http://127.0.0.1:4173/studio/case-studies/criar-sin-culpas/", wait_until="networkidle", timeout=90000)
    page.wait_for_function("() => !!document.documentElement.dataset.cscCropsBound")
    bound = page.evaluate("() => document.documentElement.dataset.cscCropsBound")
    audit_ok = page.evaluate("() => document.documentElement.dataset.cscAuditOk")
    sample = page.evaluate(
        """() => {
          const els = [...document.querySelectorAll('[data-csc-img]')];
          return {
            count: els.length,
            directed: els.filter(e => e.dataset.cscDirected === '1').length,
            sample: els.slice(0, 5).map(e => ({
              id: e.getAttribute('data-csc-img'),
              fit: getComputedStyle(e).objectFit,
              pos: getComputedStyle(e).objectPosition,
              mode: e.dataset.cscRenderMode,
            })),
          };
        }"""
    )
    print("live_bound", bound, "audit_ok", audit_ok, "sample", sample)
    if int(bound) != len(directed):
        failures.append(f"bound {bound} != directed {len(directed)}")
    if audit_ok != "true":
        failures.append("audit not ok")
    if missing_dom or orphan_dom or dups:
        failures.append("static integrity failed")
    browser.close()

print("failures", len(failures))
for f in failures:
    print(" FAIL", f)
sys.exit(1 if failures else 0)
