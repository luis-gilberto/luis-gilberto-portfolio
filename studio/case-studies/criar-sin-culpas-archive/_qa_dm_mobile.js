const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const http = require("http");

const OUT = path.join(__dirname, "_qa-dm-mobile");
fs.mkdirSync(OUT, { recursive: true });

function waitServer() {
  return new Promise((resolve, reject) => {
    let n = 0;
    const tick = () => {
      http
        .get(
          {
            hostname: "localhost",
            port: 4173,
            path: "/studio/case-studies/criar-sin-culpas/",
            timeout: 2000,
          },
          (res) => {
            res.resume();
            resolve();
          }
        )
        .on("error", () => {
          if (++n > 40) reject(new Error("no server"));
          else setTimeout(tick, 250);
        });
    };
    tick();
  });
}

(async () => {
  await waitServer();
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(
    "http://localhost:4173/studio/case-studies/criar-sin-culpas/?t=" + Date.now(),
    { waitUntil: "networkidle2", timeout: 90000 }
  );
  await page.waitForSelector("#starting-point .dm-artifact");
  await page.evaluate(() => {
    document.querySelector("#starting-point .evidence-brief")?.scrollIntoView({
      block: "start",
    });
  });
  await new Promise((r) => setTimeout(r, 300));

  const metrics = await page.evaluate(() => {
    const photo = document.querySelector("#starting-point .evidence-brief__photo");
    const art = document.querySelector("#starting-point .dm-artifact");
    const side = document.querySelector("#starting-point .evidence-brief__side");
    const lead = document.querySelector("#starting-point .evidence-brief__lead");
    const pr = photo.getBoundingClientRect();
    const ar = art.getBoundingClientRect();
    const sr = side.getBoundingClientRect();
    const lr = lead ? lead.getBoundingClientRect() : null;
    const overlapLead =
      lr &&
      !(ar.bottom <= lr.top + 2 || ar.top >= lr.bottom - 2) &&
      Math.abs(ar.left - lr.left) < 40;
    return {
      photoH: Math.round(pr.height),
      artH: Math.round(ar.height),
      artBottom: Math.round(ar.bottom),
      sideTop: Math.round(sr.top),
      gap: Math.round(sr.top - ar.bottom),
      overlapLead: !!overlapLead,
      aspect: getComputedStyle(photo).aspectRatio,
    };
  });

  const el = await page.$("#starting-point .evidence-brief");
  await el.screenshot({ path: path.join(OUT, "mobile-390.png") });
  fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(metrics, null, 2));
  console.log(metrics);
  await browser.close();
  if (metrics.gap < 8 || metrics.overlapLead) {
    console.error("FAIL overlap");
    process.exit(1);
  }
  console.log("PASS dm-artifact mobile");
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
