/**
 * Capture LG Studio intake screenshots (desktop + mobile).
 * Usage: node studio/intake/_preview-intake.mjs
 */
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');
const outDir = path.join(root, 'studio/_previews');
fs.mkdirSync(outDir, { recursive: true });

const chromePaths = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Google\\Chrome\\Application\\chrome.exe'),
].filter(Boolean);

const puppeteer = require('puppeteer');
const executablePath = chromePaths.find((p) => p && fs.existsSync(p));
const base = process.env.INTAKE_URL || 'http://localhost:4173/studio/intake/';

const browser = await puppeteer.launch({
  headless: 'new',
  executablePath,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

async function save(page, name) {
  const file = path.join(outDir, name);
  await page.screenshot({ path: file, fullPage: false });
  console.log('wrote', file);
}

try {
  const page = await browser.newPage();

  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(base, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.waitForSelector('.lg-intake');
  await page.evaluate(() => document.activeElement && document.activeElement.blur());
  await save(page, 'intake-desktop-intro.png');

  await page.click('[data-action="start"]');
  await page.waitForSelector('[data-panel="1"].is-active');
  await page.evaluate(() => document.activeElement && document.activeElement.blur());
  await new Promise((r) => setTimeout(r, 300));
  await save(page, 'intake-desktop-step1.png');

  await page.type('#full_name', 'Alex Rivera');
  await page.type('#email', 'alex@example.com');
  await page.click('[data-action="continue"]');
  await page.waitForSelector('[data-panel="2"].is-active');
  await page.evaluate(() => document.activeElement && document.activeElement.blur());
  await new Promise((r) => setTimeout(r, 300));
  await save(page, 'intake-desktop-step2.png');

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.goto(base, { waitUntil: 'networkidle0', timeout: 60000 });
  await page.evaluate(() => document.activeElement && document.activeElement.blur());
  await save(page, 'intake-mobile-intro.png');

  await page.click('[data-action="start"]');
  await page.waitForSelector('[data-panel="1"].is-active');
  await page.evaluate(() => document.activeElement && document.activeElement.blur());
  await new Promise((r) => setTimeout(r, 300));
  await save(page, 'intake-mobile-step1.png');

  await page.type('#full_name', 'Alex Rivera');
  await page.type('#email', 'alex@example.com');
  await page.click('[data-action="continue"]');
  await page.waitForSelector('[data-panel="2"].is-active');
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    if (document.activeElement) document.activeElement.blur();
  });
  await new Promise((r) => setTimeout(r, 300));
  await save(page, 'intake-mobile-step2.png');
} finally {
  await browser.close();
}
