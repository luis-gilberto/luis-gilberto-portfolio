from pathlib import Path

import fitz
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
PDF = HERE / "Costello_Letter_1_APPROVED_CLEAN.pdf"
PNG = HERE / "Costello_Letter_1_APPROVED_CLEAN_1224x1584.png"
URL = "http://127.0.0.1:8765/kitchen/costello/documents/referral/production-prep/letter-approved-clean.html"

with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome")
    page = browser.new_page()
    page.goto(URL, wait_until="networkidle")
    page.wait_for_function("document.fonts.status === 'loaded'")
    page.wait_for_timeout(400)
    page.pdf(
        path=str(PDF),
        print_background=True,
        prefer_css_page_size=True,
        margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
    )
    browser.close()

doc = fitz.open(PDF)
page0 = doc[0]
pix = page0.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False)
if (pix.width, pix.height) != (1224, 1584):
    raise SystemExit(f"unexpected PNG size {pix.width}x{pix.height}")
pix.save(PNG)
doc.close()

print("wrote", PDF, PDF.stat().st_size)
print("wrote", PNG, PNG.stat().st_size, "size", pix.width, "x", pix.height)
