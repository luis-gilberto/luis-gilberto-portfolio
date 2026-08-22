"""Measure rendered matte bands in gen-card media frames."""
from playwright.sync_api import sync_playwright

IDS = [
    "brand-lineage__gen-card__08",
    "brand-lineage__gen-card__09",
    "brand-lineage__gen-card__12",
    "brand-lineage__gen-card__10",
]

JS = """
(ids) => ids.map((id) => {
  const img = document.querySelector('[data-csc-img="' + id + '"]');
  const frame = img?.closest('.gen-card__media');
  if (!img || !frame) return { id, error: 'missing' };
  const fr = frame.getBoundingClientRect();
  const ir = img.getBoundingClientRect();
  return {
    id,
    frame: [Math.round(fr.height), Math.round(fr.width)],
    imgBox: [Math.round(ir.height), Math.round(ir.width), Math.round(ir.top - fr.top), Math.round(fr.bottom - ir.bottom)],
    topGap: Math.round(ir.top - fr.top),
    bottomGap: Math.round(fr.bottom - ir.bottom),
    zoom: img.style.getPropertyValue('--crop-zoom-desktop'),
    fit: getComputedStyle(img).objectFit,
  };
})
"""

with sync_playwright() as p:
    page = p.chromium.launch().new_page(viewport={"width": 1440, "height": 900})
    page.goto(
        "http://127.0.0.1:4173/studio/case-studies/criar-sin-culpas/#brand-lineage",
        wait_until="networkidle",
        timeout=90000,
    )
    page.wait_for_function("() => !!document.documentElement.dataset.cscCropsBound")
    for vp in [(1440, "desktop"), (900, "tablet")]:
        page.set_viewport_size({"width": vp[0], "height": 900})
        page.wait_for_timeout(300)
        rows = page.evaluate(JS, IDS)
        print(vp[1])
        for r in rows:
            print(" ", r)
