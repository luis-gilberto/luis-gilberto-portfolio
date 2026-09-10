import re
from pathlib import Path
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
PDF = HERE / "Costello_Referral_Letter_PROOF.pdf"
SHOTS = HERE.parent.parent / "_previews"
SHOTS.mkdir(exist_ok=True)

data = PDF.read_bytes()
print("Count", re.findall(rb"/Type\s*/Pages.*?/Count\s+(\d+)", data, re.S)[:5])
print("MediaBox", re.findall(rb"/MediaBox\s*\[([^\]]+)\]", data)[:5])

with sync_playwright() as p:
    browser = p.chromium.launch(channel="chrome")
    page = browser.new_page(viewport={"width": 816, "height": 1056})
    page.goto("http://127.0.0.1:8765/kitchen/costello-review/letter-proof.html", wait_until="networkidle")
    page.wait_for_timeout(400)
    page.screenshot(path=str(SHOTS / "letter-proof-print.png"), full_page=True)
    page.close()

    page = browser.new_page(viewport={"width": 1440, "height": 1100})
    page.goto("http://127.0.0.1:8765/kitchen/costello-review/", wait_until="networkidle")
    page.wait_for_timeout(400)
    page.locator(".sheet").screenshot(path=str(SHOTS / "kitchen-letter-onscreen.png"))
    print(
        "kitchen body",
        page.evaluate("() => getComputedStyle(document.querySelector('.sheet .body p')).fontFamily"),
    )
    print(
        "kitchen fonts",
        page.evaluate("() => document.querySelector('link[rel=stylesheet][href*=fonts]').href"),
    )
    browser.close()

print("shots ok")
