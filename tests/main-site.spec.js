import { test, expect } from '@playwright/test';

// ═══════════════════════════════════════
// MAIN SITE — index.html
// ═══════════════════════════════════════

test.describe('Main Site', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  // ─── PAGE LOAD ───
  test('loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Gloxx/);
  });

  test('has no console errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.reload();
    await page.waitForLoadState('networkidle');
    expect(errors).toHaveLength(0);
  });

  // ─── HERO ───
  test('hero section is visible', async ({ page }) => {
    await expect(page.locator('#hero')).toBeVisible();
  });

  test('hero title renders "We build intelligence."', async ({ page }) => {
    const hero = page.locator('.hero-title');
    await expect(hero).toBeVisible();
    await expect(hero).toContainText('We build');
    await expect(hero).toContainText('intelligence.');
  });

  test('hero tagline is visible', async ({ page }) => {
    await expect(page.locator('.hero-tag')).toBeVisible();
    await expect(page.locator('.hero-tag')).toContainText('AI-Augmented QA for Blockchain Teams');
  });

  test('hero subtitle is visible', async ({ page }) => {
    await expect(page.locator('.hero-sub')).toBeVisible();
  });

  test('gradient text has correct styling', async ({ page }) => {
    const gradient = page.locator('.gradient-text').first();
    await expect(gradient).toBeVisible();
  });

  // ─── NAVIGATION ───
  test('nav is visible', async ({ page }) => {
    await expect(page.locator('.nav')).toBeVisible();
  });

  test('nav logo shows GLOXX', async ({ page }) => {
    await expect(page.locator('.nav-logo')).toHaveText('GLOXX');
  });

  test('nav links exist', async ({ page, viewport }) => {
    if (viewport.width > 768) {
      await expect(page.locator('.nav-links a')).toHaveCount(5);
    }
  });

  test('nav gets scrolled class on scroll', async ({ page }) => {
    const nav = page.locator('.nav');
    await expect(nav).not.toHaveClass(/scrolled/);
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(300);
    await expect(nav).toHaveClass(/scrolled/);
  });

  test('nav smooth scrolls to sections', async ({ page, viewport }) => {
    if (viewport.width <= 768) return;
    await page.click('.nav-links a[href="#about"]');
    await page.waitForTimeout(800);
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(100);
  });

  // ─── MOBILE NAV ───
  test('hamburger menu works on mobile', async ({ page, viewport }) => {
    if (viewport.width > 768) return;
    const ham = page.locator('#navHam');
    const mob = page.locator('#mobMenu');
    await expect(ham).toBeVisible();
    // Menu starts hidden (opacity 0, pointer-events none)
    await expect(mob).toHaveCSS('opacity', '0');
    await ham.click();
    await page.waitForTimeout(500);
    await expect(mob).toHaveCSS('opacity', '1');
    await ham.click();
    await page.waitForTimeout(500);
    await expect(mob).toHaveCSS('opacity', '0');
  });

  // ─── ABOUT ───
  test('about section has statement text', async ({ page }) => {
    await page.locator('#about').scrollIntoViewIfNeeded();
    await expect(page.locator('.about-statement')).toBeVisible();
    await expect(page.locator('.about-statement')).toContainText('engineers, researchers');
  });

  test('stats row shows 3 metrics', async ({ page }) => {
    await page.locator('.stats-row').scrollIntoViewIfNeeded();
    await expect(page.locator('.stat-item')).toHaveCount(3);
  });

  // ─── SERVICES ───
  test('services section has 4 rows', async ({ page }) => {
    await page.locator('#services').scrollIntoViewIfNeeded();
    await expect(page.locator('.svc-row')).toHaveCount(4);
  });

  test('service row hover reveals description', async ({ page, viewport }) => {
    if (viewport.width <= 1024) return;
    const row = page.locator('.svc-row').first();
    await row.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800); // wait for scroll animation
    await row.hover();
    await page.waitForTimeout(600);
    const desc = row.locator('.svc-desc');
    const opacity = await desc.evaluate(el => getComputedStyle(el).opacity);
    expect(parseFloat(opacity)).toBeGreaterThan(0);
  });

  // ─── WORK ───
  test('work section has 3 cards', async ({ page }) => {
    await page.locator('#work').scrollIntoViewIfNeeded();
    await expect(page.locator('.w-card')).toHaveCount(3);
  });

  test('web portfolio card links to portfolio.html', async ({ page }) => {
    const link = page.locator('a.w-card[href="portfolio.html"]');
    await expect(link).toHaveCount(1);
  });

  // ─── PROCESS ───
  test('process section has 4 items', async ({ page }) => {
    await page.locator('#process').scrollIntoViewIfNeeded();
    await expect(page.locator('.proc-item')).toHaveCount(4);
  });

  // ─── CTA ───
  test('CTA section has email and button', async ({ page }) => {
    await page.locator('#cta').scrollIntoViewIfNeeded();
    await expect(page.locator('.cta-email')).toBeVisible();
    await expect(page.locator('.btn-mag')).toBeVisible();
  });

  test('CTA email links to mailto', async ({ page }) => {
    const email = page.locator('.cta-email');
    await expect(email).toHaveAttribute('href', 'mailto:hello@gloxx.ai');
  });

  // ─── FOOTER ───
  test('footer shows copyright', async ({ page }) => {
    await expect(page.locator('.footer-copy')).toContainText('2026 Gloxx');
  });

  test('footer has social links', async ({ page }) => {
    await expect(page.locator('.footer-links a')).toHaveCount(3);
  });

  test('footer tagline shows', async ({ page }) => {
    await expect(page.locator('.footer-tag')).toContainText('Wisdom engineered.');
  });

  // ─── SURVEY ───
  test('start a project opens survey', async ({ page }) => {
    const overlay = page.locator('#survey');
    await expect(overlay).not.toHaveClass(/active/);
    await page.click('#ctaBtn');
    await page.waitForTimeout(300);
    await expect(overlay).toHaveClass(/active/);
  });

  test('survey shows first question', async ({ page }) => {
    await page.click('#ctaBtn');
    await page.waitForTimeout(300);
    const q = page.locator('.sv-step.active .sv-q');
    await expect(q).toContainText('What are you looking to build?');
  });

  test('survey card selection advances step', async ({ page }) => {
    await page.click('#ctaBtn');
    await page.waitForTimeout(300);
    await page.click('.sv-card[data-value="AI-Powered Product"]');
    await page.waitForTimeout(600);
    const q = page.locator('.sv-overlay.active .sv-step.active .sv-q');
    await expect(q).toContainText('Where are you in your journey?');
  });

  test('survey close button works', async ({ page }) => {
    await page.click('#ctaBtn');
    await page.waitForTimeout(300);
    await page.click('#svClose');
    await page.waitForTimeout(500);
    await expect(page.locator('#survey')).not.toHaveClass(/active/);
  });

  test('survey escape key closes', async ({ page }) => {
    await page.click('#ctaBtn');
    await page.waitForTimeout(300);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    await expect(page.locator('#survey')).not.toHaveClass(/active/);
  });

  test('survey keyboard shortcuts select cards', async ({ page }) => {
    await page.click('#ctaBtn');
    await page.waitForTimeout(300);
    await page.keyboard.press('1');
    await page.waitForTimeout(600);
    const q = page.locator('.sv-overlay.active .sv-step.active .sv-q');
    await expect(q).toContainText('Where are you in your journey?');
  });

  test('survey back button works', async ({ page }) => {
    await page.click('#ctaBtn');
    await page.waitForTimeout(300);
    await page.keyboard.press('1');
    await page.waitForTimeout(600);
    await page.click('#svBack');
    await page.waitForTimeout(400);
    const q = page.locator('.sv-overlay.active .sv-step.active .sv-q');
    await expect(q).toContainText('What are you looking to build?');
  });

  test('survey full flow reaches confirmation', async ({ page }) => {
    await page.click('#ctaBtn');
    await page.waitForTimeout(300);
    // Step 1: What to build
    await page.keyboard.press('1');
    await page.waitForTimeout(500);
    // Step 2: Journey
    await page.keyboard.press('2');
    await page.waitForTimeout(500);
    // Step 3: Budget
    await page.keyboard.press('3');
    await page.waitForTimeout(500);
    // Step 4: Timeline
    await page.keyboard.press('1');
    await page.waitForTimeout(500);
    // Step 5: Project details
    await page.fill('#svDetails', 'Test project description');
    await page.click('#svDetailsNext');
    await page.waitForTimeout(500);
    // Step 6: Contact
    await page.fill('#svName', 'Test User');
    await page.fill('#svEmail', 'test@example.com');
    await page.click('#svContactNext');
    await page.waitForTimeout(500);
    // Step 7: How found us
    await page.keyboard.press('1');
    await page.waitForTimeout(600);
    // Confirmation
    await expect(page.locator('.sv-confirm h2')).toContainText('Your project is in good hands');
  });

  // ─── ACCESSIBILITY ───
  test('all images have alt or aria-hidden', async ({ page }) => {
    const imgs = await page.locator('img:not([alt]):not([aria-hidden])').count();
    expect(imgs).toBe(0);
  });

  test('focus-visible styles exist', async ({ page }) => {
    const styles = await page.evaluate(() => {
      const rules = [...document.styleSheets].flatMap(s => {
        try { return [...s.cssRules]; } catch { return []; }
      });
      return rules.some(r => r.cssText?.includes('focus-visible'));
    });
    expect(styles).toBe(true);
  });

  // ─── RESPONSIVE ───
  test('no horizontal overflow', async ({ page }) => {
    const overflows = await page.evaluate(() => {
      return document.documentElement.scrollWidth <= window.innerWidth;
    });
    expect(overflows).toBe(true);
  });
});
