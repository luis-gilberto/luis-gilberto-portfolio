const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const OUT = path.join(__dirname, "_qa-social-restructure");

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(
    "http://localhost:4173/studio/case-studies/criar-sin-culpas/#support",
    { waitUntil: "networkidle2", timeout: 90000 }
  );
  await page.evaluate(() => {
    document.querySelectorAll("#support img").forEach((img) => {
      img.loading = "eager";
      img.removeAttribute("loading");
    });
  });
  await page.waitForFunction(() => {
    const imgs = [...document.querySelectorAll("#support .owned-beat img")];
    return imgs.every((i) => i.complete && i.naturalWidth > 0);
  });
  await new Promise((r) => setTimeout(r, 800));

  const info = await page.evaluate(() =>
    [...document.querySelectorAll("#support .owned-beat img")].map((img) => ({
      id: img.getAttribute("data-csc-img"),
      src: img.currentSrc || img.src,
      nw: img.naturalWidth,
      nh: img.naturalHeight,
      of: getComputedStyle(img).objectFit,
      mediaBg: getComputedStyle(img.parentElement).backgroundColor,
      mediaH: Math.round(img.parentElement.getBoundingClientRect().height),
    }))
  );
  console.log(JSON.stringify(info, null, 2));

  for (const sel of [
    ".owned-beat--moment .owned-beat__figure",
    ".owned-beat--learning .owned-beat__figure",
  ]) {
    const el = await page.$(`#support ${sel}`);
    const name = sel.includes("moment") ? "clip-moment" : "clip-learn";
    if (el) await el.screenshot({ path: path.join(OUT, `${name}.png`) });
  }

  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
