import { test, expect } from '@playwright/test';

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact.html');
    await page.waitForLoadState('networkidle');
  });

  test('loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Contact.*Gloxx/);
  });

  test('hero H1 invites a QA conversation', async ({ page }) => {
    await expect(page.locator('.ct-hero h1')).toContainText("QA");
  });

  test('urgent hint routes to hello@gloxx.ai with URGENT subject', async ({ page }) => {
    const link = page.locator('.war-room-hint a[href*="mailto"]');
    await expect(link).toHaveAttribute('href', /mailto:hello@gloxx\.ai/);
    await expect(link).toHaveAttribute('href', /URGENT/);
  });

  test('form has 7 expected fields', async ({ page }) => {
    await expect(page.locator('#f-name')).toBeVisible();
    await expect(page.locator('#f-company')).toBeVisible();
    await expect(page.locator('#f-email')).toBeVisible();
    await expect(page.locator('#f-what')).toBeVisible();
    await expect(page.locator('#f-qa')).toBeVisible();
    await expect(page.locator('#f-when')).toBeVisible();
    await expect(page.locator('#f-war-room')).toBeAttached();
  });

  test('when-shipping select has 4 options + default', async ({ page }) => {
    const options = page.locator('#f-when option');
    await expect(options).toHaveCount(5);
  });

  test('submit button is visible', async ({ page }) => {
    await expect(page.locator('#submit-btn')).toBeVisible();
  });

  test('submit-note shows email option', async ({ page }) => {
    const note = page.locator('.submit-note');
    await expect(note).toContainText('hello@gloxx.ai');
  });

  test('confirmation state is hidden by default', async ({ page }) => {
    const confirm = page.locator('.ct-confirm');
    await expect(confirm).not.toHaveClass(/active/);
  });

  test('form JS posts to Apps Script with mailto fallback', async ({ page }) => {
    const scriptText = await page.locator('script').last().innerText();
    expect(scriptText).toContain("script.google.com/macros");
    expect(scriptText).toContain("mailto:hello@gloxx.ai");
    expect(scriptText).toContain("URGENT");
    expect(scriptText).toContain("contact-confirm");
  });

  test('nav contact link has aria-current', async ({ page }) => {
    const activeLink = page.locator('.nav-links a[aria-current="page"]');
    await expect(activeLink).toHaveText('Contact');
  });

  test('footer tagline preserved', async ({ page }) => {
    await expect(page.locator('.footer-tag')).toContainText('Wisdom engineered.');
  });

  test('no horizontal overflow', async ({ page }) => {
    const ok = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    expect(ok).toBe(true);
  });
});
