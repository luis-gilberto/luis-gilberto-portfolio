const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const OUT = path.join(__dirname, "_qa-ch07-restructure");
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
      const imgs = [...document.querySelectorAll("#reader-state img")];
      return (
        imgs.length >= 2 &&
        imgs.every((img) => img.complete && img.naturalWidth > 0)
      );
    });
    await new Promise((r) => setTimeout(r, 600));

    const metrics = await page.evaluate(() => {
      const fr = (sel) => {
        const el = document.querySelector(sel);
        return el ? el.getBoundingClientRect() : null;
      };
      const gap = (a, b) =>
        a && b ? Math.round(b.top - a.bottom) : null;
      const plate = fr("#reader-state .read-plate");
      const pressure = fr("#reader-state .pressure-conditions");
      const scan = fr("#reader-state .scan-care");
      const scanFig = fr("#reader-state .scan-care__figure");
      const pivot = fr("#reader-state .signal-pivot");
      const signal = fr("#reader-state .protocol-signal");
      const artifact = fr("#reader-state .protocol-signal__artifact");
      const decision = fr("#reader-state .ps-decision");
      const plateImg = document.querySelector(
        "#reader-state .read-plate__frame img"
      );
      return {
        plate: plate && {
          w: Math.round(plate.width),
          h: Math.round(plate.height),
        },
        plateImgMax: plateImg && {
          mw: getComputedStyle(plateImg).maxWidth,
          mh: getComputedStyle(plateImg).maxHeight,
        },
        gapPlatePressure: gap(plate, pressure),
        gapPressureScan: gap(pressure, scan),
        gapScanPivot: gap(scanFig, pivot),
        gapPivotSignal: gap(pivot, signal),
        gapArtifactDecision: gap(artifact, decision),
        hingeCopy: document
          .querySelector("#reader-state .signal-pivot__k")
          ?.textContent?.trim(),
        signalBody: document
          .querySelector("#reader-state .protocol-signal__head .body")
          ?.textContent?.trim(),
      };
    });
    console.log(name, JSON.stringify(metrics, null, 2));

    await page.evaluate(() => {
      document
        .querySelector("#reader-state")
        ?.scrollIntoView({ block: "start" });
    });
    await new Promise((r) => setTimeout(r, 250));
    await page.screenshot({
      path: path.join(OUT, `${name}__viewport-top.png`),
    });

    const section = await page.$("#reader-state");
    if (section) {
      await section.screenshot({
        path: path.join(OUT, `${name}__full-section.png`),
      });
    }

    await page.evaluate(() => {
      document
        .querySelector("#reader-state .pressure-conditions")
        ?.scrollIntoView({ block: "center" });
    });
    await new Promise((r) => setTimeout(r, 250));
    await page.screenshot({
      path: path.join(OUT, `${name}__conditions.png`),
    });

    await page.evaluate(() => {
      document
        .querySelector("#reader-state .scan-care")
        ?.scrollIntoView({ block: "start" });
    });
    await new Promise((r) => setTimeout(r, 250));
    await page.screenshot({
      path: path.join(OUT, `${name}__scan.png`),
    });

    await page.evaluate(() => {
      document
        .querySelector("#reader-state .signal-pivot")
        ?.scrollIntoView({ block: "center" });
    });
    await new Promise((r) => setTimeout(r, 250));
    await page.screenshot({
      path: path.join(OUT, `${name}__hinge.png`),
    });

    await page.evaluate(() => {
      document
        .querySelector("#reader-state .ps-decision")
        ?.scrollIntoView({ block: "center" });
    });
    await new Promise((r) => setTimeout(r, 250));
    await page.screenshot({
      path: path.join(OUT, `${name}__decision.png`),
    });

    await page.close();
  }

  await shoot("desktop-1440", 1440, 900);
  await shoot("tablet-1024", 1024, 900);
  await shoot("tablet-768", 768, 1024);
  await shoot("mobile-390", 390, 844);

  await browser.close();
  console.log("wrote", OUT);
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
