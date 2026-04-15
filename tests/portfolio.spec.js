import { test, expect } from '@playwright/test';

// ═══════════════════════════════════════
// PORTFOLIO PAGE — portfolio.html
// ═══════════════════════════════════════

test.describe('Portfolio Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/archive/portfolio.html');
    await page.waitForLoadState('networkidle');
  });

  test('loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Portfolio.*Gloxx/);
  });

  test('has hero section with title', async ({ page }) => {
    await expect(page.locator('.port-title')).toContainText("Sites we've shipped");
  });

  test('has 10 project cards', async ({ page }) => {
    await expect(page.locator('.p-card')).toHaveCount(10);
  });

  test('each card has an iframe preview', async ({ page }) => {
    const iframes = page.locator('.p-card-frame iframe');
    await expect(iframes).toHaveCount(10);
  });

  test('all cards link to valid HTML files', async ({ page }) => {
    const hrefs = await page.locator('.p-card').evaluateAll(cards =>
      cards.map(c => c.getAttribute('href'))
    );
    for (const href of hrefs) {
      expect(href).toMatch(/\.html$/);
    }
  });

  test('each card has title and description', async ({ page }) => {
    const cards = page.locator('.p-card');
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i).locator('h3')).not.toBeEmpty();
      await expect(cards.nth(i).locator('.p-card-desc')).not.toBeEmpty();
    }
  });

  test('each card has tags', async ({ page }) => {
    const cards = page.locator('.p-card');
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      const tags = cards.nth(i).locator('.p-tag');
      expect(await tags.count()).toBeGreaterThan(0);
    }
  });

  test('back to home link works', async ({ page }) => {
    const back = page.locator('.nav-back');
    await expect(back).toBeVisible();
    await expect(back).toContainText('Back to home');
  });

  test('nav logo links to index', async ({ page }) => {
    const logo = page.locator('.nav-logo');
    await expect(logo).toHaveAttribute('href', 'index.html');
  });

  test('card hover shows view project link', async ({ page, viewport }) => {
    if (viewport.width <= 768) return;
    const card = page.locator('.p-card').first();
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000); // wait for iframes and animations
    await card.hover();
    await page.waitForTimeout(600);
    const link = card.locator('.p-card-link');
    const opacity = await link.evaluate(el => getComputedStyle(el).opacity);
    expect(parseFloat(opacity)).toBeGreaterThan(0);
  });

  test('no horizontal overflow', async ({ page }) => {
    const ok = await page.evaluate(() =>
      document.documentElement.scrollWidth <= window.innerWidth
    );
    expect(ok).toBe(true);
  });

  test('footer shows copyright', async ({ page }) => {
    await expect(page.locator('.footer-copy')).toContainText('2026 Gloxx');
  });
});
