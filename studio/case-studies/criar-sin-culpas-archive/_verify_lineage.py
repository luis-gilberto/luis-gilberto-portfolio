"""Verify brand-lineage generation specimens render with contain."""
from playwright.sync_api import sync_playwright

IDS = [
    "brand-lineage__gen-card__08",
    "brand-lineage__gen-card__09",
    "brand-lineage__gen-card__12",
    "brand-lineage__gen-card__10",
    "brand-lineage__gen-card__11",
]
VIEWPORTS = [("desktop", 1440, 900), ("tablet", 900, 900), ("mobile", 390, 844)]

JS = """
(ids) => ids.map((id) => {
  const el = document.querySelector('[data-csc-img="' + id + '"]');
  if (!el) return { id, missing: true };
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  return {
    id,
    fit: cs.objectFit,
    mode: el.dataset.cscRenderMode || null,
    src: (el.currentSrc || el.src).split("/").pop(),
    visible: r.width > 0 && r.height > 0,
    box: [Math.round(r.width), Math.round(r.height)],
    natural: [el.naturalWidth, el.naturalHeight],
  };
})
"""

with sync_playwright() as p:
    browser = p.chromium.launch()
    ok = True
    for name, w, h in VIEWPORTS:
        page = browser.new_page(viewport={"width": w, "height": h})
        page.goto(
            "http://127.0.0.1:4173/studio/case-studies/criar-sin-culpas/#brand-lineage",
            wait_until="networkidle",
            timeout=90000,
        )
        page.wait_for_function("() => !!document.documentElement.dataset.cscCropsBound")
        rows = page.evaluate(JS, IDS)
        print(name.upper())
        for r in rows:
            print(" ", r)
            if r.get("missing"):
                ok = False
            elif r["id"] != "brand-lineage__gen-card__11":
                if r["fit"] != "contain":
                    ok = False
                if r["mode"] != "directed-contain":
                    ok = False
            else:
                if r["mode"] == "directed-contain":
                    ok = False
        page.close()

    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto(
        "http://127.0.0.1:4173/studio/case-studies/criar-sin-culpas/#reader-state",
        wait_until="networkidle",
    )
    page.wait_for_timeout(800)
    rs = page.evaluate(
        """() => {
      const el = document.querySelector('[data-csc-img="reader-state__artifact__14"]');
      return { src: el?.src || '', ok: (el?.src || '').includes('live-apoyo-hub') };
    }"""
    )
    print("READER14", rs)
    if not rs.get("ok"):
        ok = False
    browser.close()

print("PASS" if ok else "FAIL")
