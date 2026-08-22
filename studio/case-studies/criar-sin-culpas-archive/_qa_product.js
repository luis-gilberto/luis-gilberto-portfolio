const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const OUT = path.join(__dirname, "_qa-product");
fs.mkdirSync(OUT, { recursive: true });
const URL =
  "http://localhost:4173/studio/case-studies/criar-sin-culpas/#product";

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });

  async function shoot(name, width, height) {
    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    await page.goto(URL, { waitUntil: "networkidle2", timeout: 90000 });

    await page.evaluate(() => {
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        el.classList.add("is-in");
      });
      document.querySelectorAll("#product img").forEach((img) => {
        img.loading = "eager";
        img.removeAttribute("loading");
      });
    });

    await page.waitForFunction(() => {
      const imgs = [...document.querySelectorAll("#product img")];
      return (
        imgs.length >= 2 &&
        imgs.every((img) => img.complete && img.naturalWidth > 0)
      );
    });
    await new Promise((r) => setTimeout(r, 400));

    const metrics = await page.evaluate(() => {
      const section = document.querySelector("#product");
      const note = !!document.querySelector("#product .product-evidence__note");
      const placeholderText = (section?.innerText || "").includes("ASSET NEEDED");
      const archImgs = [...document.querySelectorAll("#product img")].filter(
        (img) => (img.src || "").includes("product-arch")
      );
      return {
        sectionH: section?.offsetHeight || 0,
        placeholderText,
        note,
        archCount: archImgs.length,
        hasClose: !!document.querySelector("#product .product-close"),
        closeSeq: document
          .querySelector("#product .product-close__seq")
          ?.textContent?.trim(),
        infraK: document
          .querySelector("#product .product-infra__k")
          ?.textContent?.trim(),
        statuses: [...document.querySelectorAll("#product .status")].map((el) =>
          el.getAttribute("data-status")
        ),
      };
    });
    console.log(name, JSON.stringify(metrics, null, 2));

    // Full section via clip (more reliable than element screenshot with sticky nav)
    const box = await page.evaluate(() => {
      const el = document.querySelector("#product");
      const r = el.getBoundingClientRect();
      return {
        x: Math.max(0, r.left + window.scrollX),
        y: Math.max(0, r.top + window.scrollY),
        width: r.width,
        height: r.height,
      };
    });
    await page.screenshot({
      path: path.join(OUT, `${name}__full-section.png`),
      clip: {
        x: box.x,
        y: box.y,
        width: Math.min(box.width, width),
        height: box.height,
      },
      captureBeyondViewport: true,
    });

    await page.evaluate(() => {
      document.querySelector("#product")?.scrollIntoView({ block: "start" });
    });
    await new Promise((r) => setTimeout(r, 200));
    await page.screenshot({
      path: path.join(OUT, `${name}__viewport-top.png`),
    });

    await page.evaluate(() => {
      document
        .querySelector("#product .product-infra")
        ?.scrollIntoView({ block: "start" });
    });
    await new Promise((r) => setTimeout(r, 200));
    await page.screenshot({
      path: path.join(OUT, `${name}__infra.png`),
    });

    await page.evaluate(() => {
      document
        .querySelector("#product .product-state")
        ?.scrollIntoView({ block: "start" });
    });
    await new Promise((r) => setTimeout(r, 200));
    await page.screenshot({
      path: path.join(OUT, `${name}__state.png`),
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
