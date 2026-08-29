#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import puppeteer from "puppeteer";

const root = process.cwd();
const htmlPath = path.join(root, "assets/images/og/og-contact.html");
const outPath = path.join(root, "assets/images/og/og-contact.png");

if (!fs.existsSync(htmlPath)) {
  console.error(`Missing template: ${htmlPath}`);
  process.exit(1);
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle0", timeout: 60000 });
await page.evaluate(() => document.fonts.ready);
await page.waitForSelector("h1", { timeout: 15000 });
await page.screenshot({
  path: outPath,
  clip: { x: 0, y: 0, width: 1200, height: 630 },
  type: "png",
});
await browser.close();

console.log(`Wrote ${outPath}`);
