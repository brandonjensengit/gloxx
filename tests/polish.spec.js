import { test, expect } from '@playwright/test';

// ═══════════════════════════════════════
// POLISH AUDIT — automated Lighthouse-style checks
// Per-page: exactly one H1, no skipped heading levels,
//           decorative SVGs hidden from AT, every internal link resolves.
// Cross-page: unique <title> and <meta name="description">.
// ═══════════════════════════════════════

const GLOXX_PAGES = [
  '/',
  '/services.html',
  '/approach.html',
  '/about.html',
  '/contact.html',
  '/institute/',
  '/institute/about.html',
  '/institute/maturity-model.html',
  '/institute/assessment.html',
  '/institute/journal/',
  '/institute/tools/',
  '/institute/reports/',
  '/institute/workflows/',
  '/institute/workflows/eval.html',
  '/institute/workflows/release-gate.html',
  '/institute/workflows/drift.html',
  '/institute/workflows/failure-taxonomy.html',
  '/institute/workflows/feedback-loop.html',
  '/institute/workflows/refuse-policy.html',
];

test.describe('Polish', () => {
  test('titles and meta descriptions are unique across all Gloxx pages', async ({ page }) => {
    const titles = new Map();
    const descs = new Map();

    for (const path of GLOXX_PAGES) {
      await page.goto(path);
      const title = await page.title();
      const desc = await page.locator('meta[name="description"]').getAttribute('content');

      expect(title, `${path}: empty <title>`).toBeTruthy();
      expect(desc,  `${path}: empty meta description`).toBeTruthy();

      const prevTitle = titles.get(title);
      expect(prevTitle, `duplicate <title> "${title}" at ${path} (also on ${prevTitle})`).toBeUndefined();
      titles.set(title, path);

      const prevDesc = descs.get(desc);
      expect(prevDesc, `duplicate meta description at ${path} (also on ${prevDesc})`).toBeUndefined();
      descs.set(desc, path);
    }
  });

  for (const path of GLOXX_PAGES) {
    test.describe(`${path}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(path);
        await page.waitForLoadState('networkidle');
      });

      test('has exactly one <h1>', async ({ page }) => {
        await expect(page.locator('h1')).toHaveCount(1);
      });

      test('no skipped heading levels', async ({ page }) => {
        const levels = await page.$$eval('h1, h2, h3, h4, h5, h6', els =>
          els.map(e => Number(e.tagName[1]))
        );
        for (let i = 1; i < levels.length; i++) {
          const delta = levels[i] - levels[i - 1];
          expect(delta, `heading level jumped from h${levels[i - 1]} to h${levels[i]}`).toBeLessThanOrEqual(1);
        }
      });

      test('decorative SVGs are hidden from assistive tech', async ({ page }) => {
        const exposed = await page.$$eval('svg', svgs =>
          svgs
            .filter(svg =>
              !svg.hasAttribute('role') &&
              !svg.hasAttribute('aria-label') &&
              !svg.hasAttribute('aria-labelledby') &&
              !svg.querySelector('title')
            )
            .filter(svg => !svg.closest('[aria-hidden="true"]'))
            .map(svg => svg.outerHTML.slice(0, 160))
        );
        expect(exposed, 'decorative SVG missing aria-hidden ancestor').toEqual([]);
      });

      test('all internal links resolve (<400)', async ({ page, request, baseURL }) => {
        const hrefs = await page.$$eval('a[href]', as =>
          as.map(a => a.getAttribute('href'))
        );
        const internal = [...new Set(hrefs)].filter(h =>
          h && !/^(https?:|mailto:|tel:|#)/.test(h)
        );
        for (const href of internal) {
          const url = new URL(href, `${baseURL}${path}`).toString().split('#')[0];
          const res = await request.get(url);
          expect(res.status(), `${href} on ${path} returned ${res.status()}`).toBeLessThan(400);
        }
      });

      test('mobile hamburger toggles mobile menu', async ({ page }, testInfo) => {
        test.skip(testInfo.project.name !== 'mobile', 'mobile viewport only');
        const mob = page.locator('#mobMenu');
        await expect(mob).not.toHaveClass(/active/);
        await page.click('#navHam');
        await expect(mob).toHaveClass(/active/);
        await page.click('#navHam');
        await expect(mob).not.toHaveClass(/active/);
      });
    });
  }
});
