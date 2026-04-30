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

  test('hero H1 names the single retainer offer', async ({ page }) => {
    await expect(page.locator('.svc-hero h1')).toContainText('One offer');
    await expect(page.locator('.svc-hero h1')).toContainText('Gloxx Retainer');
  });

  test('hero subhead surfaces price and cancellation terms', async ({ page }) => {
    await expect(page.locator('.svc-hero-sub')).toContainText('$15,000/month');
    await expect(page.locator('.svc-hero-sub')).toContainText('month-to-month');
  });

  test('lead-rule quote frames the retainer commitments', async ({ page }) => {
    await expect(page.locator('.svc-lead-rule')).toContainText('One number');
    await expect(page.locator('.svc-lead-rule')).toContainText('One accountable lead');
  });

  test('has exactly 5 retainer-facet cards', async ({ page }) => {
    await expect(page.locator('.service-card')).toHaveCount(5);
  });

  test('card 1 is "What\'s included" with the $15k/mo meta', async ({ page }) => {
    const card = page.locator('.service-card').nth(0);
    await expect(card.locator('h2')).toContainText("What's included");
    await expect(card.locator('.sc-meta')).toContainText('$15,000/mo');
  });

  test('card 2 is "How it works" with the two-week ramp meta', async ({ page }) => {
    const card = page.locator('.service-card').nth(1);
    await expect(card.locator('h2')).toContainText('How it works');
    await expect(card.locator('.sc-meta')).toContainText('Two-week ramp');
  });

  test('card 3 is "The math" comparing $180k to $400-600k in-house', async ({ page }) => {
    const card = page.locator('.service-card').nth(2);
    await expect(card.locator('h2')).toContainText('The math');
    await expect(card.locator('.sc-desc')).toContainText('$400');
    await expect(card.locator('.sc-desc')).toContainText('$180');
  });

  test('card 4 is "Who staffs it" with founder-led framing', async ({ page }) => {
    const card = page.locator('.service-card').nth(3);
    await expect(card.locator('h2')).toContainText('Who staffs it');
    await expect(card.locator('.sc-meta')).toContainText('Founder-led');
  });

  test('card 5 is "What we don\'t do" — the refuse list', async ({ page }) => {
    const card = page.locator('.service-card').nth(4);
    await expect(card.locator('h2')).toContainText("What we don't do");
    await expect(card.locator('.sc-meta')).toContainText('refuse list');
  });

  test('every facet card exposes a scope list', async ({ page }) => {
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
