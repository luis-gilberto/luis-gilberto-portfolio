const assert = require('assert');
const puppeteer = require('puppeteer');

// Configure which server to test against
const HOST = process.env.TEST_HOST || 'http://localhost:8080';

async function open(page, path) {
  const url = `${HOST}${path}`;
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
  } catch (err) {
    throw new Error(`Failed to open ${url}: ${err.message}`);
  }
}

async function getTheme(page) {
  return page.evaluate(() => document.documentElement.getAttribute('data-theme'));
}

async function clearStoredTheme(page) {
  await page.evaluate(() => localStorage.removeItem('theme'));
}

async function clickToggle(page) {
  const exists = await page.$('#themeToggle');
  if (!exists) {
    // Component auto-injects a button if none exists; wait briefly
    await page.waitForSelector('#themeToggle', { timeout: 5000 });
  }
  await page.click('#themeToggle');
}

async function getStoredTheme(page) {
  return page.evaluate(() => localStorage.getItem('theme'));
}

async function testPage(page, path) {
  // Emulate system light preference for deterministic baseline
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);

  // Navigate first, then clear storage and reload to ensure a clean start
  await open(page, path);
  await clearStoredTheme(page);
  await page.reload({ waitUntil: 'load' });

  // Initial theme should follow system (light) if no stored preference
  let theme = await getTheme(page);
  assert.strictEqual(theme, 'light', `Expected initial theme to be 'light' on ${path}, got '${theme}'`);

  // Toggle to dark
  await clickToggle(page);
  theme = await getTheme(page);
  assert.strictEqual(theme, 'dark', `Expected theme to be 'dark' after toggle on ${path}, got '${theme}'`);

  // Check persistence
  let stored = await getStoredTheme(page);
  assert.strictEqual(stored, 'dark', `Expected localStorage 'theme' to be 'dark' after toggle on ${path}, got '${stored}'`);

  // Reload and ensure persisted theme remains
  await page.reload({ waitUntil: 'load' });
  theme = await getTheme(page);
  assert.strictEqual(theme, 'dark', `Expected theme to persist as 'dark' after reload on ${path}, got '${theme}'`);

  // Toggle back to light
  await clickToggle(page);
  theme = await getTheme(page);
  assert.strictEqual(theme, 'light', `Expected theme to be 'light' after second toggle on ${path}, got '${theme}'`);

  stored = await getStoredTheme(page);
  assert.strictEqual(stored, 'light', `Expected localStorage 'theme' to be 'light' after second toggle on ${path}, got '${stored}'`);
}

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  try {
    console.log(`Testing theme toggle on HOST=${HOST}`);

    // Insights landing page
    await testPage(page, '/insights/index.html');
    console.log('✅ Insights landing page theme toggle passed');

    // Building Insights article page
    await testPage(page, '/insights/building-insights/index.html');
    console.log('✅ Building Insights article theme toggle passed');

    // Home page
    await testPage(page, '/index.html');
    console.log('✅ Home page theme toggle passed');

    // Accessibility quick checks
    await open(page, '/index.html');
    const ariaPressed = await page.$eval('#themeToggle', el => el.getAttribute('aria-pressed'));
    assert.ok(ariaPressed === 'true' || ariaPressed === 'false', `Expected aria-pressed to be 'true' or 'false', got '${ariaPressed}'`);
    const ariaLabel = await page.$eval('#themeToggle', el => el.getAttribute('aria-label'));
    assert.ok(ariaLabel && ariaLabel.length > 0, 'Expected aria-label to be present and non-empty');
    console.log('✅ Accessibility attributes present');

    console.log('🎉 All theme toggle tests passed');
  } catch (err) {
    console.error('❌ Theme toggle tests failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
