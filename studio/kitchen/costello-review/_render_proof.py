from pathlib import Path
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
OUT = HERE / "Costello_Referral_Letter_PROOF.pdf"
URL = "http://127.0.0.1:8765/kitchen/costello-review/letter-proof.html"

print("cambria.ttc", Path(r"C:\Windows\Fonts\cambria.ttc").exists())

with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome")
    page = browser.new_page()
    page.goto(URL, wait_until="networkidle")
    page.wait_for_function("document.fonts.status === 'loaded'")
    page.wait_for_timeout(400)
    print(
        "computed",
        page.evaluate(
            """() => ({
              body: getComputedStyle(document.querySelector('.body p')).fontFamily,
              contact: getComputedStyle(document.querySelector('.contact')).fontFamily
            })"""
        ),
    )
    page.pdf(
        path=str(OUT),
        print_background=True,
        prefer_css_page_size=True,
        margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
    )
    browser.close()

print("wrote", OUT, OUT.stat().st_size)
