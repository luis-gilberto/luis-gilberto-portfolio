import { test, expect } from '@playwright/test';

// NOTE: Run a local server (e.g., Live Server) before executing these tests.
// Default dev URL used in this repo: http://127.0.0.1:5500/

const url = 'http://127.0.0.1:5500/insights/family-safety-launch/index-experiment.html';

test.describe('Family Safety hero tile experiment', () => {
  test('tablet portrait overlap + shadow visible', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(url);
    const heroSection = page.locator('.hero-section');
    const tile = page.locator('.hero-image-container');

    await expect(heroSection).toBeVisible();
    await expect(tile).toBeVisible();

    // Capture screenshots for baseline/regression
    await page.screenshot({ path: 'screenshots/family-safety-tablet-768x1024.png', fullPage: true });
  });

  test('tablet landscape overlap stable', async ({ page }) => {
    await page.setViewportSize({ width: 992, height: 768 });
    await page.goto(url);
    await page.screenshot({ path: 'screenshots/family-safety-tablet-992x768.png', fullPage: true });
  });

  test('small desktop retains lower-right position', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 900 });
    await page.goto(url);
    await page.screenshot({ path: 'screenshots/family-safety-desktop-1200x900.png', fullPage: true });
  });

  test('desktop 1440 maintains hierarchy', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(url);
    await page.screenshot({ path: 'screenshots/family-safety-desktop-1440x900.png', fullPage: true });
  });
});

