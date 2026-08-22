const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const OUT = path.join(__dirname, "_qa-product-estudio");
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
        imgs.length >= 3 &&
        imgs.every((img) => img.complete && img.naturalWidth > 0)
      );
    });
    await new Promise((r) => setTimeout(r, 400));

    const metrics = await page.evaluate(() => {
      const section = document.querySelector("#product");
      const order = [
        ...section.querySelectorAll(
          ".product-infra, .product-member, .product-state, .product-close, #changed"
        ),
      ].map((el) => el.className.split(" ")[0] || el.id);
      const imgs = [...section.querySelectorAll("img")].map((img) => {
        const src = img.currentSrc || img.src;
        return {
          key: src.includes("CSC_EL-Estudio")
            ? "estudio"
            : src.includes("product-arch")
              ? "arch"
              : src.includes("protected-access")
                ? "access"
                : "other",
          nw: img.naturalWidth,
          nh: img.naturalHeight,
          w: img.clientWidth,
          h: img.clientHeight,
          fit: getComputedStyle(img).objectFit,
        };
      });
      const memberCap = section
        .querySelector(".product-member .cap")
        ?.textContent?.trim();
      const memberEv = section
        .querySelector(".product-member .ev")
        ?.textContent?.trim();
      const statuses = [...section.querySelectorAll(".status")].map((el) =>
        el.getAttribute("data-status")
      );
      const close = section
        .querySelector(".product-close__title")
        ?.textContent?.trim();
      const changed = !!document.querySelector("#changed");
      const placeholder = (section.innerText || "").includes("ASSET NEEDED");
      return {
        order,
        imgs,
        memberCap,
        memberEv,
        statuses,
        close,
        changed,
        placeholder,
      };
    });
    console.log(name, JSON.stringify(metrics, null, 2));

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
      document
        .querySelector("#product .product-member")
        ?.scrollIntoView({ block: "start" });
    });
    await new Promise((r) => setTimeout(r, 200));
    await page.screenshot({
      path: path.join(OUT, `${name}__member.png`),
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
