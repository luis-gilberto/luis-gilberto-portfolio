const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const OUT = path.join(__dirname, "_qa-social-hero");
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
      const hero = document.querySelector("#support .social-system__img");
      return hero && hero.complete && hero.naturalWidth > 0;
    });
    await new Promise((r) => setTimeout(r, 700));

    const metrics = await page.evaluate(() => {
      const fr = (sel) => {
        const el = document.querySelector(sel);
        return el ? el.getBoundingClientRect() : null;
      };
      const gap = (a, b) => (a && b ? Math.round(b.top - a.bottom) : null);
      const head = fr("#support .chap-head");
      const hero = fr("#support .social-system");
      const process = fr("#support .social-process");
      const listen = fr("#support .social-listen");
      const owned = fr("#support .owned-depth");
      const proof = fr("#support .social-proof");
      const heroImg = document.querySelector("#support .social-system__img");
      return {
        hero: hero && {
          w: Math.round(hero.width),
          h: Math.round(hero.height),
        },
        proof: proof && {
          w: Math.round(proof.width),
          h: Math.round(proof.height),
        },
        proofVsHeroPct:
          hero && proof
            ? Math.round((proof.width / hero.width) * 100)
            : null,
        heroNatural: heroImg && {
          w: heroImg.naturalWidth,
          h: heroImg.naturalHeight,
        },
        gapIntroHero: gap(head, hero),
        gapHeroProcess: gap(hero, process),
        gapProcessListen: gap(process, listen),
        gapListenOwned: gap(listen, owned),
      };
    });
    console.log(name, JSON.stringify(metrics, null, 2));

    await page.evaluate(() => {
      document.querySelector("#support")?.scrollIntoView({ block: "start" });
    });
    await new Promise((r) => setTimeout(r, 250));
    await page.screenshot({
      path: path.join(OUT, `${name}__viewport-top.png`),
    });

    await page.evaluate(() => {
      document
        .querySelector("#support .social-system")
        ?.scrollIntoView({ block: "start" });
    });
    await new Promise((r) => setTimeout(r, 250));
    await page.screenshot({ path: path.join(OUT, `${name}__hero.png`) });

    await page.evaluate(() => {
      document
        .querySelector("#support .social-listen")
        ?.scrollIntoView({ block: "start" });
    });
    await new Promise((r) => setTimeout(r, 250));
    await page.screenshot({ path: path.join(OUT, `${name}__listen.png`) });

    const section = await page.$("#support");
    if (section) {
      await section.screenshot({
        path: path.join(OUT, `${name}__full-section.png`),
      });
    }

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
