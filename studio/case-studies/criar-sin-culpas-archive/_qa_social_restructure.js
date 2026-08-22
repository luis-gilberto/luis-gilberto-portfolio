const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const OUT = path.join(__dirname, "_qa-social-restructure");
fs.mkdirSync(OUT, { recursive: true });
const URL =
  "http://localhost:4173/studio/case-studies/criar-sin-culpas/#support";

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });

  async function shoot(name, width, height) {
    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await page.goto(URL, { waitUntil: "networkidle2", timeout: 90000 });
    await page.evaluate(() => {
      document.querySelectorAll("#support img").forEach((img) => {
        img.loading = "eager";
        img.removeAttribute("loading");
      });
    });
    await page.waitForFunction(() => {
      const imgs = [...document.querySelectorAll("#support img")];
      return (
        imgs.length >= 3 &&
        imgs.every((img) => img.complete && img.naturalWidth > 0)
      );
    });
    await new Promise((r) => setTimeout(r, 500));

    const styles = await page.evaluate(() =>
      [...document.querySelectorAll("#support .owned-beat img")].map((img) => ({
        id: img.getAttribute("data-csc-img"),
        of: getComputedStyle(img).objectFit,
        tf: getComputedStyle(img).transform,
        w: Math.round(img.getBoundingClientRect().width),
        h: Math.round(img.getBoundingClientRect().height),
      }))
    );
    console.log(name, "owned imgs", JSON.stringify(styles));

    await page.evaluate(() => {
      document.querySelector("#support")?.scrollIntoView({ block: "start" });
    });
    await new Promise((r) => setTimeout(r, 250));
    await page.screenshot({
      path: path.join(OUT, `${name}__viewport-top.png`),
    });

    const section = await page.$("#support");
    if (section) {
      await section.screenshot({
        path: path.join(OUT, `${name}__full-section.png`),
      });
    }

    await page.evaluate(() => {
      document
        .querySelector("#support .social-signal")
        ?.scrollIntoView({ block: "center" });
    });
    await new Promise((r) => setTimeout(r, 250));
    await page.screenshot({ path: path.join(OUT, `${name}__signal.png`) });

    await page.evaluate(() => {
      document
        .querySelector("#support .owned-beat--moment")
        ?.scrollIntoView({ block: "center" });
    });
    await new Promise((r) => setTimeout(r, 250));
    await page.screenshot({ path: path.join(OUT, `${name}__moment.png`) });

    await page.evaluate(() => {
      document
        .querySelector("#support .owned-ladder")
        ?.scrollIntoView({ block: "start" });
    });
    await new Promise((r) => setTimeout(r, 250));
    await page.screenshot({ path: path.join(OUT, `${name}__ladder.png`) });

    await page.close();
  }

  await shoot("desktop-1440", 1440, 900);
  await shoot("mobile-390", 390, 844);
  await browser.close();
  console.log("done");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
