"""Re-verify crops with images loaded + section screenshots."""
from __future__ import annotations

import json
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(".").resolve()
CASE = "http://127.0.0.1:4173/studio/case-studies/criar-sin-culpas/"
PILOTS = [
    ("starting-point__start-portrait__01", "#starting-point"),
    ("reader-state__artifact__14", "#reader-state"),
    ("visual-languages__illustration-ladder__17", "#visual-languages"),
]
VIEWPORTS = {
    "desktop": {"width": 1440, "height": 900},
    "tablet": {"width": 900, "height": 1100},
    "mobile": {"width": 390, "height": 844},
}

manifest = json.loads(
    (ROOT / "studio/case-studies/criar-sin-culpas/csc-case-study-image-manifest.json").read_text(
        encoding="utf-8"
    )
)
by_id = {i["id"]: i for i in manifest["instances"]}
out_dir = ROOT / "studio/case-studies/criar-sin-culpas/evidence/_crop-verify"
out_dir.mkdir(parents=True, exist_ok=True)
failures = []

with sync_playwright() as p:
    browser = p.chromium.launch()
    for bp, vp in VIEWPORTS.items():
        page = browser.new_page(viewport=vp)
        page.goto(CASE, wait_until="networkidle", timeout=90000)
        page.wait_for_function("() => document.documentElement.dataset.cscCropsBound === '3'")

        for pid, section in PILOTS:
            expected = by_id[pid]["crops"][bp]
            sel = f'[data-csc-img="{pid}"]'
            page.locator(section).scroll_into_view_if_needed()
            page.wait_for_timeout(200)
            loc = page.locator(sel)
            loc.scroll_into_view_if_needed()
            page.wait_for_function(
                """(sel) => {
                  const el = document.querySelector(sel);
                  return el && el.complete && el.naturalWidth > 0;
                }""",
                arg=sel,
                timeout=20000,
            )
            styles = page.evaluate(
                """([sel, bpName]) => {
                  const el = document.querySelector(sel);
                  const cs = getComputedStyle(el);
                  return {
                    directed: el.dataset.cscDirected === '1',
                    naturalWidth: el.naturalWidth,
                    objectFit: cs.objectFit,
                    objectPosition: cs.objectPosition,
                    transform: cs.transform,
                    x: el.style.getPropertyValue('--crop-x-' + bpName).trim(),
                    y: el.style.getPropertyValue('--crop-y-' + bpName).trim(),
                    zoom: el.style.getPropertyValue('--crop-zoom-' + bpName).trim(),
                    fit: el.style.getPropertyValue('--crop-fit-' + bpName).trim(),
                  };
                }""",
                [sel, bp],
            )
            print(f"[{bp}] {pid} loaded={styles['naturalWidth']}px fit={styles['objectFit']} pos={styles['objectPosition']} zoom={styles['zoom']}")
            if styles["x"] != f"{expected['x']}%" or styles["zoom"] != str(expected["zoom"]):
                failures.append(f"{bp}:{pid}: vars mismatch {styles}")
            if not styles["directed"]:
                failures.append(f"{bp}:{pid}: not directed")
            if styles["naturalWidth"] < 1:
                failures.append(f"{bp}:{pid}: image not loaded")

            safe = pid.replace("__", "_")
            loc.screenshot(path=str(out_dir / f"{bp}__{safe}.png"))
            page.locator(section).screenshot(path=str(out_dir / f"{bp}__section__{safe}.png"))

        # refresh persistence once per bp on portrait
        page.reload(wait_until="networkidle")
        page.wait_for_function("() => document.documentElement.dataset.cscCropsBound === '3'")
        after = page.evaluate(
            """() => {
              const el = document.querySelector('[data-csc-img="starting-point__start-portrait__01"]');
              return {
                x: el.style.getPropertyValue('--crop-x-desktop').trim(),
                zoom: el.style.getPropertyValue('--crop-zoom-desktop').trim(),
                pos: getComputedStyle(el).objectPosition,
              };
            }"""
        )
        print(f"[{bp}] after refresh portrait", after)
        if bp == "desktop" and (after["x"] != "72%" or after["zoom"] != "1.35"):
            failures.append(f"refresh lost crops: {after}")
        page.close()
    browser.close()

print("failures", len(failures))
for f in failures:
    print(" FAIL", f)
sys.exit(1 if failures else 0)
