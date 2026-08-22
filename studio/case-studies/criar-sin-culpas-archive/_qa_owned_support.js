const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const OUT = path.join(__dirname, "_qa-owned-support");
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
      document.querySelectorAll("[data-reveal]").forEach((el) => {
        el.classList.add("is-in");
      });
      document.querySelectorAll(".owned-depth img").forEach((img) => {
        img.loading = "eager";
        img.removeAttribute("loading");
      });
    });
    await page.waitForFunction(() => {
      const imgs = [...document.querySelectorAll(".owned-depth img")];
      return (
        imgs.length >= 2 &&
        imgs.every((img) => img.complete && img.naturalWidth > 0)
      );
    });
    await new Promise((r) => setTimeout(r, 400));

    const metrics = await page.evaluate(() => {
      const root = document.querySelector(".owned-depth");
      const imgs = [...root.querySelectorAll("img")].map((img) => ({
        key: (img.src || "").includes("intervention")
          ? "protocol"
          : (img.src || "").includes("csc_learn")
            ? "learn"
            : "other",
        nw: img.naturalWidth,
        nh: img.naturalHeight,
        w: img.clientWidth,
        fit: getComputedStyle(img).objectFit,
      }));
      return {
        bridge: root.querySelector(".owned-bridge")?.textContent?.trim(),
        converge: !!root.querySelector(".owned-converge"),
        imgs,
        oldTablet: (root.innerHTML || "").includes("csc-tablet-protocol"),
      };
    });
    console.log(name, JSON.stringify(metrics, null, 2));

    await page.evaluate(() => {
      document.querySelector(".owned-depth")?.scrollIntoView({ block: "start" });
    });
    await new Promise((r) => setTimeout(r, 250));

    const box = await page.evaluate(() => {
      const el = document.querySelector(".owned-depth");
      const r = el.getBoundingClientRect();
      return {
        x: Math.max(0, r.left + window.scrollX),
        y: Math.max(0, r.top + window.scrollY),
        width: r.width,
        height: r.height,
      };
    });
    await page.screenshot({
      path: path.join(OUT, `${name}__owned-depth.png`),
      clip: {
        x: box.x,
        y: box.y,
        width: Math.min(box.width, width),
        height: box.height,
      },
      captureBeyondViewport: true,
    });

    await page.evaluate(() => {
      document
        .querySelector(".owned-beat--moment")
        ?.scrollIntoView({ block: "start" });
    });
    await new Promise((r) => setTimeout(r, 200));
    await page.screenshot({
      path: path.join(OUT, `${name}__beat01.png`),
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
