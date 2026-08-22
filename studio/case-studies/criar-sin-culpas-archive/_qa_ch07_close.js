const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const OUT = path.join(__dirname, "_qa-ch07-close");
fs.mkdirSync(OUT, { recursive: true });
const URL =
  "http://localhost:4173/studio/case-studies/criar-sin-culpas/#reader-state";

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });

  async function shoot(name, width, height) {
    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await page.goto(URL, { waitUntil: "networkidle2", timeout: 90000 });
    await page.evaluate(() => {
      document.querySelectorAll("#reader-state img").forEach((img) => {
        img.loading = "eager";
        img.removeAttribute("loading");
      });
    });
    await page.waitForFunction(() => {
      const img = document.querySelector("#reader-state .protocol-signal__img");
      return img && img.complete && img.naturalWidth > 0;
    });
    await new Promise((r) => setTimeout(r, 700));

    const metrics = await page.evaluate(() => {
      const fr = (sel) => {
        const el = document.querySelector(sel);
        return el ? el.getBoundingClientRect() : null;
      };
      const gap = (a, b) => (a && b ? Math.round(b.top - a.bottom) : null);
      const scan = fr("#reader-state .scan-care__figure");
      const pivot = fr("#reader-state .signal-pivot");
      const logic = fr("#reader-state .signal-pivot__logic");
      const head = fr("#reader-state .protocol-signal__head");
      const art = fr("#reader-state .protocol-signal__artifact");
      const dec = fr("#reader-state .ps-decision");
      const shell = fr("#reader-state .shell");
      return {
        pivotW: pivot && Math.round(pivot.width),
        shellW: shell && Math.round(shell.width),
        pivotPct:
          pivot && shell
            ? Math.round((pivot.width / shell.width) * 100)
            : null,
        artW: art && Math.round(art.width),
        artH: art && Math.round(art.height),
        decW: dec && Math.round(dec.width),
        gapScanPivot: gap(scan, pivot),
        gapLogicHead: gap(logic, head),
        gapHeadArt: gap(head, art),
        gapArtDec: gap(art, dec),
        sideBySide:
          art && dec
            ? Math.abs(art.top - dec.top) < 80 ||
              (dec.left > art.left + art.width * 0.4 &&
                Math.abs(art.bottom - dec.bottom) < 120)
            : null,
        eyebrow: document
          .querySelector("#reader-state .protocol-signal__k")
          ?.textContent?.trim(),
        logic: document
          .querySelector("#reader-state .signal-pivot__logic")
          ?.textContent?.replace(/\s+/g, " ")
          .trim(),
      };
    });
    console.log(name, JSON.stringify(metrics, null, 2));

    const section = await page.$("#reader-state");
    if (section) {
      await section.screenshot({
        path: path.join(OUT, `${name}__full-section.png`),
      });
    }

    await page.evaluate(() => {
      document
        .querySelector("#reader-state .signal-pivot")
        ?.scrollIntoView({ block: "start" });
    });
    await new Promise((r) => setTimeout(r, 250));
    await page.screenshot({
      path: path.join(OUT, `${name}__close.png`),
      fullPage: false,
    });

    await page.evaluate(() => {
      document
        .querySelector("#reader-state .protocol-signal__pair")
        ?.scrollIntoView({ block: "center" });
    });
    await new Promise((r) => setTimeout(r, 250));
    await page.screenshot({
      path: path.join(OUT, `${name}__evidence-decision.png`),
    });

    await page.close();
  }

  await shoot("desktop-1440", 1440, 900);
  await shoot("tablet-768", 768, 1024);
  await shoot("mobile-390", 390, 844);

  await browser.close();
  console.log("wrote", OUT);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
