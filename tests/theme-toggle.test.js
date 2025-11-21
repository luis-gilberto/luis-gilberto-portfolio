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
  return page.evaluate(() => {
    const attr = document.documentElement.getAttribute('data-theme');
    return attr || 'light';
  });
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

async function getBreadcrumbLinks(page) {
  const classLinks = await page.$$eval('a.breadcrumb-link', els => els.map(e => ({ text: e.textContent.trim(), href: e.getAttribute('href') })));
  if (classLinks && classLinks.length) return classLinks;
  const simpleLinks = await page.$$eval('nav.breadcrumbs a', els => els.map(e => ({ text: e.textContent.trim(), href: e.getAttribute('href') })));
  return simpleLinks;
}

async function getBreadcrumbCurrent(page) {
  const el1 = await page.$('.breadcrumb-current');
  if (el1) return page.$eval('.breadcrumb-current', e => e.textContent.trim());
  const el2 = await page.$('nav.breadcrumbs .current');
  if (el2) return page.$eval('nav.breadcrumbs .current', e => e.textContent.trim());
  return null;
}

async function getNavLinks(page) {
  return page.$$eval('.lg-main-nav a.lg-nav-link', els => els.map(e => ({ text: e.textContent.trim(), href: e.getAttribute('href'), target: e.getAttribute('target') })));
}

async function testNavDestinations(page, path) {
  await open(page, path);
  const links = await getNavLinks(page);
  const byText = Object.fromEntries(links.map(l => [l.text.toLowerCase(), l]));
  assert.ok(byText['portfolio'], `Expected 'Portfolio' link on ${path}`);
  assert.ok(byText['about'], `Expected 'About' link on ${path}`);
  assert.ok(byText['contact'], `Expected 'Contact' link on ${path}`);
  assert.strictEqual(byText['portfolio'].href, 'https://luis-gilberto.com', `Unexpected Portfolio href on ${path}: ${byText['portfolio'].href}`);
  assert.strictEqual(byText['about'].href, 'https://luis-gilberto.com/about', `Unexpected About href on ${path}: ${byText['about'].href}`);
  assert.strictEqual(byText['contact'].href, 'https://luis-gilberto.com/contact', `Unexpected Contact href on ${path}: ${byText['contact'].href}`);
  assert.ok(!byText['portfolio'].target, `Expected Portfolio to open in same tab on ${path}`);
  assert.ok(!byText['about'].target, `Expected About to open in same tab on ${path}`);
  assert.ok(!byText['contact'].target, `Expected Contact to open in same tab on ${path}`);
}

async function testBreadcrumb(page, path, expectedCurrent, requireWork) {
  await open(page, path);
  const links = await getBreadcrumbLinks(page);
  const hasHome = links.some(l => l.text.toLowerCase() === 'home');
  assert.strictEqual(hasHome, false, `Expected no 'Home' link on ${path}`);
  const insights = links.find(l => l.text.toLowerCase() === 'insights');
  assert.ok(!!insights, `Expected 'Insights' link on ${path}`);
  if (requireWork) {
    const work = links.find(l => l.text.toLowerCase() === 'work that mattered');
    assert.ok(!!work, `Expected 'Work That Mattered' link on ${path}`);
    assert.strictEqual(work.href, '/insights#work-that-mattered', `Unexpected href for 'Work That Mattered' on ${path}: ${work.href}`);
  }
  const current = await getBreadcrumbCurrent(page);
  assert.strictEqual(current, expectedCurrent, `Unexpected current breadcrumb on ${path}: ${current}`);
  await page.goto(`${HOST}${insights.href}`, { waitUntil: 'load' });
  assert.ok(page.url().includes('/insights'), `Expected navigation to Insights from ${path}, got ${page.url()}`);
}

async function testInsightsPicture(page) {
  await open(page, '/insights/index.html');
  const picture = await page.$('picture.insights-still#heroStill');
  assert.ok(!!picture, 'Expected picture.insights-still#heroStill to exist');
  const webpSource = await page.$('picture.insights-still source[type="image/webp"]');
  assert.ok(!!webpSource, 'Expected a WebP source element in picture');
  const imgSrc = await page.$eval('picture.insights-still img', el => el.getAttribute('src'));
  assert.ok(imgSrc && imgSrc.endsWith('/insights/assets/images/Insights_still.jpg'), `Expected JPG fallback src to end with Insights_still.jpg, got '${imgSrc}'`);
}


async function testPage(page, path) {
  // Emulate system light preference for deterministic baseline
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);

  // Navigate first, then clear storage and reload to ensure a clean start
  await open(page, path);
  await clearStoredTheme(page);
  await page.reload({ waitUntil: 'load' });

  const toggleExists = await page.$('#themeToggle');
  if (!toggleExists) {
    return;
  }

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
    const toggleOnHome = await page.$('#themeToggle');
    if (toggleOnHome) {
      const ariaPressed = await page.$eval('#themeToggle', el => el.getAttribute('aria-pressed'));
      assert.ok(ariaPressed === 'true' || ariaPressed === 'false', `Expected aria-pressed to be 'true' or 'false', got '${ariaPressed}'`);
      const ariaLabel = await page.$eval('#themeToggle', el => el.getAttribute('aria-label'));
      assert.ok(ariaLabel && ariaLabel.length > 0, 'Expected aria-label to be present and non-empty');
      console.log('✅ Accessibility attributes present');
    }

    console.log('🎉 All theme toggle tests passed');

    // Verify nav link destinations match Insights landing page across article pages
    await testNavDestinations(page, '/insights/index.html');
    await testNavDestinations(page, '/insights/building-insights/index.html');
    await testNavDestinations(page, '/insights/building-the-hub/index.html');
    await testNavDestinations(page, '/insights/move-at-your-speed/index.html');
    await testNavDestinations(page, '/insights/proof-of-life/index.html');
    await testNavDestinations(page, '/insights/edge-ucational-series/index.html');
    await testNavDestinations(page, '/insights/edge-mobile-rebrand/index.html');
    await testNavDestinations(page, '/insights/teams-consumer-launch/index.html');
    await testNavDestinations(page, '/insights/family-safety-launch/index.html');
    await testNavDestinations(page, '/insights/free-to-be-free/index.html');
    await testNavDestinations(page, '/insights/transforming-browsing-ai/index.html');
    await testNavDestinations(page, '/insights/unlocking-the-blank-page/index.html');
    console.log('✅ Nav link destinations verified across pages');

    await testBreadcrumb(page, '/insights/building-insights/index.html', 'Building Insights', false);
    console.log('✅ Breadcrumbs passed: Building Insights');
    await testBreadcrumb(page, '/insights/building-the-hub/index.html', 'Building The Hub', false);
    console.log('✅ Breadcrumbs passed: Building The Hub');
    await testBreadcrumb(page, '/insights/move-at-your-speed/index.html', 'Move at the Speed of What Matters', false);
    console.log('✅ Breadcrumbs passed: Move at your Speed');
    await testBreadcrumb(page, '/insights/unlocking-the-blank-page/index.html', 'Unlocking the Blank Page', false);
    console.log('✅ Breadcrumbs passed: Unlocking the Blank Page');

    await testBreadcrumb(page, '/insights/proof-of-life/index.html', 'Proof of Life', false);
    console.log('✅ Breadcrumbs passed: Proof of Life');

    await testBreadcrumb(page, '/insights/edge-mobile-rebrand/index.html', 'Edge Mobile App Store Refresh', true);
    console.log('✅ Breadcrumbs passed: Edge Mobile Rebrand');
    await testBreadcrumb(page, '/insights/teams-consumer-launch/index.html', 'Teams Consumer Launch', true);
    console.log('✅ Breadcrumbs passed: Teams Consumer Launch');
    await testBreadcrumb(page, '/insights/family-safety-launch/index.html', 'Family Safety App Launch', true);
    console.log('✅ Breadcrumbs passed: Family Safety Launch');
    await testBreadcrumb(page, '/insights/edge-ucational-series/index.html', 'Edge-ucational Series', true);
    console.log('✅ Breadcrumbs passed: Edge-ucational Series');
    await testBreadcrumb(page, '/insights/free-to-be-free/index.html', 'Free to Be Free', true);
    console.log('✅ Breadcrumbs passed: Free to Be Free');
    await testBreadcrumb(page, '/insights/transforming-browsing-ai/index.html', 'Transforming Browsing with AI', true);
    console.log('✅ Breadcrumbs passed: Transforming Browsing with AI');

    console.log('🎉 All breadcrumb tests passed');

    await testInsightsPicture(page);
    console.log('✅ Insights hero picture fallback verified');
  } catch (err) {
    console.error('❌ Theme toggle tests failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
