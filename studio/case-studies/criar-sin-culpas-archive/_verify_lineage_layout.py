"""Verify brand-lineage layout: no horizontal scroll, capstone width."""
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    for w, label in [(1440, "desktop"), (900, "tablet"), (390, "mobile")]:
        page = browser.new_page(viewport={"width": w, "height": 900})
        page.goto(
            "http://127.0.0.1:4173/studio/case-studies/criar-sin-culpas/#brand-lineage",
            wait_until="networkidle",
            timeout=90000,
        )
        r = page.evaluate(
            """() => {
          const section = document.getElementById('brand-lineage');
          const lineage = section?.querySelector('.gen-lineage');
          const history = section?.querySelector('.gen-lineage__history');
          const capstone = section?.querySelector('.gen-card--capstone');
          const histCard = history?.querySelector('.gen-card');
          const csLineage = lineage ? getComputedStyle(lineage) : null;
          const csHist = history ? getComputedStyle(history) : null;
          return {
            scrollX: csLineage?.overflowX,
            histCols: csHist?.gridTemplateColumns,
            capstoneW: capstone ? Math.round(capstone.getBoundingClientRect().width) : 0,
            histCardW: histCard ? Math.round(histCard.getBoundingClientRect().width) : 0,
            titles: [...section.querySelectorAll('.gen-card__name')].map((n) => n.textContent.trim()),
          };
        }"""
        )
        print(label, r)
    browser.close()
