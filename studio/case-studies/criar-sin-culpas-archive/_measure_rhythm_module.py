#!/usr/bin/env python3
"""Measure Rhythm module geometry at representative viewports (requires playwright)."""
from __future__ import annotations

import json
import sys

try:
    from playwright.sync_api import sync_playwright
except ImportError:
    print("playwright not installed — skip automated measure")
    sys.exit(0)

BASE = "http://127.0.0.1:4173/studio/case-studies/criar-sin-culpas/"
INSTANCE = "operations__ops-tile__41"
VIEWPORTS = [
    ("wide", 1440, 900),
    ("compact", 1024, 900),
    ("stacked", 390, 844),
]


def measure(page, state, w, h):
    url = f"{BASE}?directorPreview=1&instance={INSTANCE}&state={state}#operations"
    page.set_viewport_size({"width": w, "height": h})
    page.goto(url, wait_until="networkidle")
    page.wait_for_selector(f'[data-csc-img="{INSTANCE}"]', timeout=15000)
    data = page.evaluate(
        """(id) => {
      const img = document.querySelector(`[data-csc-img="${id}"]`);
      const mod = img.closest('.ops-tile');
      const media = img.closest('.ops-tile__media');
      const ir = img.getBoundingClientRect();
      const mr = mod.getBoundingClientRect();
      const fr = media.getBoundingClientRect();
      return {
        viewport: { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight },
        module: { width: Math.round(mr.width), height: Math.round(mr.height) },
        mediaFrame: { width: Math.round(fr.width), height: Math.round(fr.height) },
        imageFrame: { width: Math.round(ir.width), height: Math.round(ir.height) },
        aspectRatio: ir.height ? Number((ir.width / ir.height).toFixed(3)) : null,
      };
    }""",
        INSTANCE,
    )
    return {"state": state, "requestedViewport": {"width": w, "height": h}, **data}


def main() -> None:
    out = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        for state, w, h in VIEWPORTS:
            try:
                out.append(measure(page, state, w, h))
            except Exception as exc:
                out.append({"state": state, "error": str(exc)})
        browser.close()
    print(json.dumps(out, indent=2))


if __name__ == "__main__":
    main()
