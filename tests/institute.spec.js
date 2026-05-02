import { test, expect } from '@playwright/test';

// ═══════════════════════════════════════
// GLOXX QA INSTITUTE — landing, maturity model, assessment, and the three section indexes.
// Covers structure, key copy, the assessment scoring/result flow, and the
// Apps Script POST + mailto fallback (mirrors the contact-form spec pattern).
// ═══════════════════════════════════════

test.describe('Institute landing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/institute/');
    await page.waitForLoadState('networkidle');
  });

  test('loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Gloxx QA Institute/);
  });

  test('hero H1 names the methodology', async ({ page }) => {
    await expect(page.locator('.bn-hero h1')).toContainText('published methodology');
  });

  test('featured anchor links to the assessment and the model', async ({ page }) => {
    await expect(page.locator('.featured-cta')).toHaveAttribute('href', '/institute/assessment.html');
    await expect(page.locator('.featured-secondary')).toHaveAttribute('href', '/institute/maturity-model.html');
  });

  test('six workflow cards link to the six workflow pages', async ({ page }) => {
    const cards = page.locator('.line-card');
    await expect(cards).toHaveCount(6);
    await expect(cards.nth(0)).toHaveAttribute('href', '/institute/workflows/eval.html');
    await expect(cards.nth(1)).toHaveAttribute('href', '/institute/workflows/release-gate.html');
    await expect(cards.nth(2)).toHaveAttribute('href', '/institute/workflows/drift.html');
    await expect(cards.nth(3)).toHaveAttribute('href', '/institute/workflows/failure-taxonomy.html');
    await expect(cards.nth(4)).toHaveAttribute('href', '/institute/workflows/feedback-loop.html');
    await expect(cards.nth(5)).toHaveAttribute('href', '/institute/workflows/refuse-policy.html');
  });

  test('nav Institute link has aria-current', async ({ page }) => {
    const activeLink = page.locator('.nav-links a[aria-current="page"]');
    await expect(activeLink).toHaveText('Institute');
  });

  test('no horizontal overflow', async ({ page }) => {
    const ok = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    expect(ok).toBe(true);
  });
});

test.describe('Maturity model', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/institute/maturity-model.html');
    await page.waitForLoadState('networkidle');
  });

  test('loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/AI-QA Maturity Model/);
  });

  test('hero H1 names the model', async ({ page }) => {
    await expect(page.locator('.mm-hero h1')).toContainText('Maturity Model');
  });

  test('all five level sections render with anchor IDs', async ({ page }) => {
    for (const lvl of ['l1', 'l2', 'l3', 'l4', 'l5']) {
      await expect(page.locator('#' + lvl)).toBeVisible();
    }
  });

  test('all six dimensions are listed', async ({ page }) => {
    const items = page.locator('.dims-grid li');
    await expect(items).toHaveCount(6);
  });

  test('CTA links to the assessment', async ({ page }) => {
    const cta = page.locator('.cta-btn').first();
    await expect(cta).toHaveAttribute('href', '/institute/assessment.html');
  });

  test('crumbs link back to the institute', async ({ page }) => {
    await expect(page.locator('.crumbs a')).toHaveAttribute('href', '/institute/');
  });
});

test.describe('Assessment', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/institute/assessment.html');
    await page.waitForLoadState('networkidle');
  });

  test('loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Self-Assessment/);
  });

  test('hero H1 invites a self-check', async ({ page }) => {
    await expect(page.locator('.as-hero h1')).toContainText('actually sit');
  });

  test('exposes 4 lead-capture inputs and 30 question groups', async ({ page }) => {
    await expect(page.locator('#f-name')).toBeVisible();
    await expect(page.locator('#f-email')).toBeVisible();
    await expect(page.locator('#f-company')).toBeVisible();
    await expect(page.locator('#f-role')).toBeVisible();

    const questions = page.locator('.question[data-q]');
    await expect(questions).toHaveCount(30);
  });

  test('every question offers yes / partial / no radios', async ({ page }) => {
    const radios = page.locator('input[type="radio"]');
    // 30 questions * 3 options = 90 radios
    await expect(radios).toHaveCount(90);
  });

  test('result panel hidden by default; error banner hidden by default', async ({ page }) => {
    await expect(page.locator('#as-result')).not.toHaveClass(/active/);
    await expect(page.locator('#as-error')).not.toHaveClass(/active/);
  });

  test('submit with empty form surfaces a validation error', async ({ page }) => {
    await page.click('#as-submit-btn');
    await expect(page.locator('#as-error')).toHaveClass(/active/);
  });

  test('submit posts to Apps Script with mailto fallback (script content check)', async ({ page }) => {
    const scriptText = await page.locator('script').last().innerText();
    expect(scriptText).toContain('script.google.com/macros');
    expect(scriptText).toContain('mailto:hello@gloxx.ai');
    // 'maturity-assessment' is the load-bearing source field — see CLAUDE.md
    expect(scriptText).toContain('maturity-assessment');
    expect(scriptText).toContain('result-overall-level');
  });

  test('Institute nav link has aria-current', async ({ page }) => {
    const activeLink = page.locator('.nav-links a[aria-current="page"]');
    await expect(activeLink).toHaveText('Institute');
  });

  test('end-to-end: filling all questions yes renders L5 result', async ({ page }) => {
    // Stub the network so the test doesn't depend on Apps Script + doesn't trigger mailto fallback
    await page.route('**/script.google.com/**', route => route.fulfill({ status: 200, body: 'OK' }));

    // Lead capture
    await page.fill('#f-name', 'Test User');
    await page.fill('#f-email', 'test@example.com');
    await page.fill('#f-company', 'Test Co');
    await page.fill('#f-role', 'CTO');

    // Answer every question yes — click the styled label rather than the visually-hidden radio
    for (let d = 1; d <= 6; d++) {
      for (let q = 1; q <= 5; q++) {
        await page.locator('label[for="d' + d + 'q' + q + '-yes"]').click();
      }
    }

    await page.click('#as-submit-btn');

    const result = page.locator('#as-result');
    await expect(result).toHaveClass(/active/);
    await expect(result.locator('.res-level-num')).toHaveText('L5');
    await expect(result.locator('.res-level-name')).toHaveText('Continuous');
  });

  test('end-to-end: filling all questions no renders L1 result', async ({ page }) => {
    await page.route('**/script.google.com/**', route => route.fulfill({ status: 200, body: 'OK' }));

    await page.fill('#f-name', 'Test User');
    await page.fill('#f-email', 'test@example.com');
    await page.fill('#f-company', 'Test Co');
    await page.fill('#f-role', 'Engineer');

    for (let d = 1; d <= 6; d++) {
      for (let q = 1; q <= 5; q++) {
        await page.locator('label[for="d' + d + 'q' + q + '-no"]').click();
      }
    }

    await page.click('#as-submit-btn');

    const result = page.locator('#as-result');
    await expect(result).toHaveClass(/active/);
    await expect(result.locator('.res-level-num')).toHaveText('L1');
    await expect(result.locator('.res-level-name')).toHaveText('Ad-hoc');
  });
});

test.describe('Institute section index pages', () => {
  for (const path of ['/institute/journal/', '/institute/tools/', '/institute/reports/']) {
    test(`${path} loads with a unique title and an H1`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title.toLowerCase()).toContain('gloxx');
      await expect(page.locator('h1')).toHaveCount(1);
    });
  }

  test('journal page surfaces the editorial calendar', async ({ page }) => {
    await page.goto('/institute/journal/');
    await expect(page.locator('.schedule li')).toHaveCount(4);
  });

  test('tools page lists at least one live tool and at least one upcoming', async ({ page }) => {
    await page.goto('/institute/tools/');
    await expect(page.locator('.tool-card.live')).not.toHaveCount(0);
    await expect(page.locator('.tool-card.upcoming')).not.toHaveCount(0);
  });

  test('reports page features the State of AI-Feature QA report', async ({ page }) => {
    await page.goto('/institute/reports/');
    await expect(page.locator('.featured h2')).toContainText('State of AI-Feature QA');
  });
});

test.describe('Cross-page nav', () => {
  for (const path of ['/', '/services.html', '/approach.html', '/about.html', '/contact.html']) {
    test(`${path} nav includes an Institute link`, async ({ page }) => {
      await page.goto(path);
      const instituteLink = page.locator('.nav-links a[href*="institute"]');
      await expect(instituteLink).toHaveText('Institute');
    });
  }
});

test.describe('Bench → Institute redirect stubs', () => {
  const redirects = [
    { from: '/bench/',                    to: '/institute/' },
    { from: '/bench/maturity-model.html', to: '/institute/maturity-model.html' },
    { from: '/bench/assessment.html',     to: '/institute/assessment.html' },
    { from: '/bench/essays/',             to: '/institute/journal/' },
    { from: '/bench/tools/',              to: '/institute/tools/' },
    { from: '/bench/reports/',            to: '/institute/reports/' },
  ];

  for (const { from, to } of redirects) {
    test(`${from} serves a meta-refresh stub pointing to ${to}`, async ({ request, baseURL }) => {
      // Use request.get() instead of page.goto() so we capture the stub HTML
      // before the client-side meta-refresh fires.
      const res = await request.get(`${baseURL}${from}`);
      expect(res.status()).toBeLessThan(400);
      const html = await res.text();
      expect(html).toMatch(new RegExp(`<meta\\s+http-equiv="refresh"\\s+content="0;\\s*url=${to.replace(/\//g, '\\/')}"`));
      expect(html).toMatch(new RegExp(`<link\\s+rel="canonical"\\s+href="https:\\/\\/gloxx\\.ai${to.replace(/\//g, '\\/')}"`));
      expect(html).toMatch(/<meta\s+name="robots"\s+content="noindex/);
    });
  }
});
