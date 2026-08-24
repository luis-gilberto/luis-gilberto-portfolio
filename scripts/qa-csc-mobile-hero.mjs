#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import puppeteer from "puppeteer";

const ORIGIN = "http://localhost:4173";
const OUT = "studio/case-studies/criar-sin-culpas/_qa-mobile-hero";

const shots = [
  { name: "en-390x844", url: "/studio/case-studies/criar-sin-culpas/", width: 390, height: 844 },
  { name: "es-390x844", url: "/studio/case-studies/criar-sin-culpas/es/", width: 390, height: 844 },
  { name: "es-390x844-nojs", url: "/studio/case-studies/criar-sin-culpas/es/", width: 390, height: 844, noJs: true },
  { name: "es-393x852", url: "/studio/case-studies/criar-sin-culpas/es/", width: 393, height: 852 },
  { name: "en-430x932", url: "/studio/case-studies/criar-sin-culpas/", width: 430, height: 932 },
  { name: "en-768x1024", url: "/studio/case-studies/criar-sin-culpas/", width: 768, height: 1024 },
  { name: "en-1440x1000", url: "/studio/case-studies/criar-sin-culpas/", width: 1440, height: 1000 },
];

function waitForServer() {
  return new Promise((resolve, reject) => {
    let tries = 0;
    const tick = () => {
      const req = http.get(`${ORIGIN}/`, (res) => {
        res.resume();
        resolve();
      });
      req.on("error", () => {
        tries += 1;
        if (tries > 60) reject(new Error("server not up"));
        else setTimeout(tick, 300);
      });
    };
    tick();
  });
}

await waitForServer();
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const report = [];

for (const shot of shots) {
  const page = await browser.newPage();
  if (shot.noJs) await page.setJavaScriptEnabled(false);
  await page.setViewport({ width: shot.width, height: shot.height, deviceScaleFactor: 2 });
  if (!shot.noJs) {
    await page.evaluateOnNewDocument(() => {
      try {
        localStorage.setItem("studio-lang", "en");
      } catch (e) {}
    });
  }
  await page.goto(`${ORIGIN}${shot.url}`, { waitUntil: "networkidle2", timeout: 90000 });
  await page.waitForSelector(".hero--cinematic", { timeout: 30000 });
  const metrics = await page.evaluate(() => {
    const navCta = document.querySelector(".nav-cta");
    const eco = document.querySelector(".lg-eco");
    const dek = document.querySelector(".hero__dek");
    const lede = document.querySelector(".hero__lede");
    const h1 = document.querySelector(".hero__h1");
    return {
      lang: document.documentElement.lang,
      navCta: navCta ? navCta.textContent.trim() : null,
      ecoVisible: eco ? getComputedStyle(eco).display !== "none" : false,
      dekVisible: dek ? getComputedStyle(dek).display !== "none" : false,
      h1: h1 ? h1.textContent.replace(/\s+/g, " ").trim() : null,
      ledeBelowHero: !!lede,
      overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    };
  });
  const file = path.join(OUT, `${shot.name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  report.push({ ...shot, file, metrics });
  await page.close();
}

await browser.close();
fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
