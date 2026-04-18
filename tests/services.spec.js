import { test, expect } from '@playwright/test';

// ═══════════════════════════════════════
// SERVICES PAGE — services.html
// ═══════════════════════════════════════

test.describe('Services Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/services.html');
    await page.waitForLoadState('networkidle');
  });

  test('loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Services.*Gloxx/);
  });

  test('has no console errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.reload();
    await page.waitForLoadState('networkidle');
    expect(errors).toHaveLength(0);
  });

  test('hero H1 positions service tiers', async ({ page }) => {
    await expect(page.locator('.svc-hero h1')).toContainText('Four productized engagements');
  });

  test('lead-rule quote frames the Audit as entry point', async ({ page }) => {
    await expect(page.locator('.svc-lead-rule')).toContainText('Every engagement starts with the AI-Native QA Readiness Audit');
  });

  test('has exactly 4 service tier cards', async ({ page }) => {
    await expect(page.locator('.service-card')).toHaveCount(4);
  });

  test('tier 1 is the AI-Native QA Readiness Audit at $12-15k', async ({ page }) => {
    const card = page.locator('.service-card').nth(0);
    await expect(card.locator('h2')).toContainText('AI-Native QA Readiness Audit');
    await expect(card.locator('.sc-meta')).toContainText('$12,000');
  });

  test('tier 2 is Eval Suite Build', async ({ page }) => {
    const card = page.locator('.service-card').nth(1);
    await expect(card.locator('h2')).toContainText('Eval Suite Build');
    await expect(card.locator('.sc-meta')).toContainText('$25,000');
  });

  test('tier 3 is Fractional Head of AI QA', async ({ page }) => {
    const card = page.locator('.service-card').nth(2);
    await expect(card.locator('h2')).toContainText('Fractional Head of AI QA');
  });

  test('tier 4 is Pre-Launch AI War Room', async ({ page }) => {
    const card = page.locator('.service-card').nth(3);
    await expect(card.locator('h2')).toContainText('Pre-Launch AI War Room');
    await expect(card.locator('.sc-meta')).toContainText('$15,000');
  });

  test('Sentinel card is a bolt-on teaser', async ({ page }) => {
    const sentinel = page.locator('.sentinel-card');
    await expect(sentinel).toBeVisible();
    await expect(sentinel).toContainText('Sentinel');
    await expect(sentinel).toContainText('$2,000');
  });

  test('every tier card exposes a scope list', async ({ page }) => {
    const cards = page.locator('.service-card');
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      const items = cards.nth(i).locator('.sc-scope li');
      expect(await items.count()).toBeGreaterThan(0);
    }
  });

  test('CTA at bottom links to Cal.com booking', async ({ page }) => {
    const cta = page.locator('.cta-section .cta-btn');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', 'https://cal.com/gloxx/30min');
    await expect(cta).toHaveAttribute('target', '_blank');
  });

  test('nav services link has aria-current', async ({ page }) => {
    const activeLink = page.locator('.nav-links a[aria-current="page"]');
    await expect(activeLink).toHaveText('Services');
  });

  test('nav logo links to home', async ({ page }) => {
    await expect(page.locator('.nav-logo')).toHaveAttribute('href', 'index.html');
  });

  test('footer preserves Wisdom engineered tagline', async ({ page }) => {
    await expect(page.locator('.footer-tag')).toContainText('Wisdom engineered.');
  });

  test('no horizontal overflow', async ({ page }) => {
    const overflows = await page.evaluate(() => {
      return document.documentElement.scrollWidth <= window.innerWidth;
    });
    expect(overflows).toBe(true);
  });
});
