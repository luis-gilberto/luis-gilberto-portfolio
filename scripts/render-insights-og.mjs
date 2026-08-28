#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import puppeteer from "puppeteer";

const slug = process.argv[2] || "what-i-built-after-microsoft";
const root = process.cwd();
const htmlPath = path.join(root, "insights/assets/images/og", `og-${slug}.html`);
const outPath = path.join(root, "insights/assets/images/og", `og-${slug}-en.png`);

if (!fs.existsSync(htmlPath)) {
  console.error(`Missing template: ${htmlPath}`);
  process.exit(1);
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });

const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle0", timeout: 60000 });
await page.evaluate(() => document.fonts.ready);
await page.waitForSelector("h1", { timeout: 15000 });
await page.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();

console.log(`Wrote ${outPath}`);
