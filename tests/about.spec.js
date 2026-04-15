import { test, expect } from '@playwright/test';

test.describe('About Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about.html');
    await page.waitForLoadState('networkidle');
  });

  test('loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/About.*Gloxx/);
  });

  test('hero introduces founder Bran', async ({ page }) => {
    await expect(page.locator('.ab-hero h1')).toContainText('Bran');
    await expect(page.locator('.ab-hero h1')).toContainText('Founder, Gloxx');
  });

  test('subtitle mentions 15 years of QA', async ({ page }) => {
    await expect(page.locator('.ab-hero .subtitle')).toContainText('15 years');
  });

  test('body names the core tool stack', async ({ page }) => {
    const body = page.locator('.ab-body');
    await expect(body).toContainText('Slither');
    await expect(body).toContainText('Claude Code');
    await expect(body).toContainText('Foundry');
  });

  test('shipped-list has at least 3 TODO-able items', async ({ page }) => {
    const items = page.locator('.shipped-list li');
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('CTA links to contact', async ({ page }) => {
    const cta = page.locator('.cta-section .cta-btn');
    await expect(cta).toHaveAttribute('href', 'contact.html');
  });

  test('nav about link has aria-current', async ({ page }) => {
    const activeLink = page.locator('.nav-links a[aria-current="page"]');
    await expect(activeLink).toHaveText('About');
  });

  test('footer tagline preserved', async ({ page }) => {
    await expect(page.locator('.footer-tag')).toContainText('Wisdom engineered.');
  });

  test('no horizontal overflow', async ({ page }) => {
    const ok = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    expect(ok).toBe(true);
  });
});
