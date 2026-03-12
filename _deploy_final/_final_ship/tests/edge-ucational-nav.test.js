const assert = require('assert');
const puppeteer = require('puppeteer');

const HOST = process.env.TEST_HOST || 'http://localhost:3002';

async function open(page, path) {
  const url = `${HOST}${path}`;
  await page.goto(url, { waitUntil: 'load', timeout: 30000 });
}

async function isMobileControlsVisible(page) {
  return page.evaluate(() => {
    const el = document.querySelector('.mobile-controls');
    if (!el) return false;
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return style.display !== 'none' && rect.width > 0 && rect.height > 0;
  });
}

async function isDrawerOpen(page) {
  return page.evaluate(() => {
    const drawer = document.getElementById('mobileDrawer');
    if (!drawer) return false;
    return drawer.classList.contains('is-open');
  });
}

async function hasHorizontalScroll(page) {
  return page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth + 1;
  });
}

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  try {
    console.log(`Testing Edge-ucational navigation on HOST=${HOST}`);

    await page.setViewport({ width: 1280, height: 800 });
    await open(page, '/case-study-edge-ucational.html');

    const mobileVisibleDesktop = await isMobileControlsVisible(page);
    assert.strictEqual(mobileVisibleDesktop, false, 'Expected mobile controls to be hidden on desktop');

    const drawerInitiallyOpen = await isDrawerOpen(page);
    assert.strictEqual(drawerInitiallyOpen, false, 'Expected mobile drawer to be closed on initial desktop load');

    await page.setViewport({ width: 375, height: 812, isMobile: true });
    await open(page, '/case-study-edge-ucational.html');

    const mobileVisibleMobile = await isMobileControlsVisible(page);
    assert.strictEqual(mobileVisibleMobile, true, 'Expected mobile controls to be visible on mobile');

    await page.click('#mobileMenuBtn');
    // Wait for the animation/timeout to apply the class
    await page.waitForFunction(() => {
        const drawer = document.getElementById('mobileDrawer');
        return drawer && drawer.classList.contains('is-open');
    }, { timeout: 1000 });
    
    const drawerOpen = await isDrawerOpen(page);
    assert.strictEqual(drawerOpen, true, 'Expected mobile drawer to open after tapping hamburger');

    const horizontalScroll = await hasHorizontalScroll(page);
    assert.strictEqual(horizontalScroll, false, 'Expected no horizontal scrolling on mobile');

    console.log('🎉 Edge-ucational nav regression tests passed');
  } catch (err) {
    console.error('❌ Edge-ucational nav regression tests failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();

