#!/usr/bin/env node
/**
 * Permanent CSC locale runtime checks (requires local static server on :4173).
 * Usage: npx serve -l 4173 .   then   node scripts/qa-csc-locale.mjs
 */
import http from "node:http";
import puppeteer from "puppeteer";

const ORIGIN = "http://localhost:4173";

function waitForServer() {
  return new Promise((resolve, reject) => {
    let tries = 0;
    const tick = () => {
      const req = http.get(`${ORIGIN}/studio/case-studies/criar-sin-culpas/`, (res) => {
        res.resume();
        resolve();
      });
      req.on("error", () => {
        tries += 1;
        if (tries > 60) reject(new Error("server not up on :4173"));
        else setTimeout(tick, 400);
      });
    };
    tick();
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function fetchStatus(pathname) {
  return new Promise((resolve, reject) => {
    http
      .get(`${ORIGIN}${pathname}`, (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () =>
          resolve({ status: res.statusCode, body, headers: res.headers })
        );
      })
      .on("error", reject);
  });
}

const report = await (async () => {
  await waitForServer();

  const enClean = await fetchStatus("/studio/case-studies/criar-sin-culpas/");
  const esClean = await fetchStatus("/studio/case-studies/criar-sin-culpas/es/");

  const routeReport = {
    enCleanStatus: enClean.status,
    esCleanStatus: esClean.status,
    esCleanHasSpanishHero: esClean.body.includes("La confianza ya existía"),
    esCleanHasSpanishMeta: esClean.body.includes(
      "csc-case-study-og-1200x630_ES_uhncs1"
    ),
    esCleanLang: /<html[^>]*lang="es"/i.test(esClean.body),
    enCleanHasEnglishHero: enClean.body.includes("The trust was already there."),
    directoryIndexWorksWithoutRedirect:
      esClean.status === 200 &&
      esClean.body.includes("GENERATED FILE") &&
      esClean.body.includes("La confianza ya existía"),
  };

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });

  const pageNoJs = await browser.newPage();
  await pageNoJs.setJavaScriptEnabled(false);
  await pageNoJs.goto(`${ORIGIN}/studio/case-studies/criar-sin-culpas/es/`, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  const noJs = await pageNoJs.evaluate(() => ({
    lang: document.documentElement.lang,
    hero: document.querySelector(".hero__h1")?.textContent.trim() || "",
    cta:
      document.querySelector(".csc-close-cta__eyebrow")?.textContent.trim() ||
      "",
  }));
  await pageNoJs.close();

  const page = await browser.newPage();
  await page.goto(`${ORIGIN}/studio/case-studies/criar-sin-culpas/es/`, {
    waitUntil: "networkidle2",
    timeout: 90000,
  });
  await page.evaluate(() => localStorage.setItem("studio-lang", "en"));
  await page.reload({ waitUntil: "networkidle2" });
  await sleep(300);
  const afterConflict = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    hero: document.querySelector(".hero__h1")?.textContent.trim() || "",
    path: location.pathname,
  }));

  await page.evaluate(() => {
    const enBtn = [
      ...document.querySelectorAll(".ed-nav-lang-toggle button"),
    ].find((b) => b.dataset.lang === "en");
    if (enBtn) enBtn.click();
  });
  await page
    .waitForNavigation({ waitUntil: "networkidle2", timeout: 60000 })
    .catch(() => {});
  await sleep(400);
  const afterEnNav = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    hero: document.querySelector(".hero__h1")?.textContent.trim() || "",
    path: location.pathname,
  }));

  await page.evaluate(() => {
    const esBtn = [
      ...document.querySelectorAll(".ed-nav-lang-toggle button"),
    ].find((b) => b.dataset.lang === "es");
    if (esBtn) esBtn.click();
  });
  await page
    .waitForNavigation({ waitUntil: "networkidle2", timeout: 60000 })
    .catch(() => {});
  await sleep(400);
  const afterEsNav = await page.evaluate(() => ({
    lang: document.documentElement.lang,
    hero: document.querySelector(".hero__h1")?.textContent.trim() || "",
    path: location.pathname,
  }));

  const viewports = [
    { name: "desktop-1440", width: 1440, height: 900 },
    { name: "tablet-1024", width: 1024, height: 768 },
    { name: "tablet-768", width: 768, height: 1024 },
    { name: "mobile-390", width: 390, height: 844 },
    { name: "mobile-360", width: 360, height: 800 },
  ];
  const overflow = [];
  for (const vp of viewports) {
    await page.setViewport(vp);
    await page.goto(`${ORIGIN}/studio/case-studies/criar-sin-culpas/es/`, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
    const m = await page.evaluate(() => ({
      overflowX:
        Math.max(
          document.documentElement.scrollWidth,
          document.body.scrollWidth
        ) - document.documentElement.clientWidth,
      broken: [...document.images].filter(
        (i) => i.complete && i.naturalWidth === 0 && i.src
      ).length,
    }));
    overflow.push({
      viewport: vp.name,
      ...m,
      pass: m.overflowX <= 1 && m.broken === 0,
    });
  }

  await browser.close();

  return {
    routeReport,
    noJs,
    afterConflict,
    afterEnNav,
    afterEsNav,
    overflow,
  };
})();

console.log(JSON.stringify(report, null, 2));

const failures = [];
if (!report.routeReport.directoryIndexWorksWithoutRedirect) {
  failures.push("clean /es/ directory URL did not serve Spanish shell");
}
if (
  report.noJs.lang !== "es" ||
  !report.noJs.hero.includes("La confianza ya existía") ||
  report.noJs.cta !== "SIGUIENTE"
) {
  failures.push("JS-disabled Spanish initial content failed");
}
if (
  report.afterConflict.lang !== "es" ||
  !report.afterConflict.hero.includes("La confianza ya existía") ||
  !report.afterConflict.path.includes("/es")
) {
  failures.push("route did not override conflicting localStorage");
}
if (
  !report.afterEnNav.path.replace(/\/$/, "").endsWith("criar-sin-culpas") ||
  !report.afterEnNav.hero.includes("The trust was already there")
) {
  failures.push("toggle ES→EN navigation failed");
}
if (
  !report.afterEsNav.path.includes("/es") ||
  !report.afterEsNav.hero.includes("La confianza ya existía")
) {
  failures.push("toggle EN→ES navigation failed");
}
if (report.overflow.some((o) => !o.pass)) {
  failures.push("overflow or broken images on a viewport");
}

if (failures.length) {
  console.error("FAILURES:\n" + failures.map((f) => "- " + f).join("\n"));
  process.exit(1);
}
console.log("All locale runtime checks passed.");
