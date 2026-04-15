import { test, expect } from '@playwright/test';

// ═══════════════════════════════════════
// PORTFOLIO SITES — each site loads & renders
// ═══════════════════════════════════════

const sites = [
  { file: 'vantage.html', name: 'Vantage AI', hero: /See what your data/ },
  { file: 'lumen.html', name: 'Lumen Goods', hero: /Objects worth/ },
  { file: 'orbis.html', name: 'Orbis Capital', hero: /Precision|scale/ },
  { file: 'forma.html', name: 'Forma Studio', hero: /Space|considered/ },
  { file: 'clarity.html', name: 'Clarity Health', hero: /Healthcare that comes/ },
  { file: 'thebrief.html', name: 'The Brief', hero: /THE BRIEF|Stories that matter/ },
  { file: 'apex.html', name: 'Apex Robotics', hero: /Built to perform/ },
  { file: 'noma.html', name: 'Noma Wines', hero: /Terroir tells/ },
  { file: 'vertex.html', name: 'Vertex Labs', hero: /Trust nothing|Verify everything/ },
  { file: 'solara.html', name: 'Solara Energy', hero: /Power the future/ },
];

for (const site of sites) {
  test.describe(site.name, () => {

    test('page loads without errors', async ({ page }) => {
      const errors = [];
      page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
      const res = await page.goto(`/${site.file}`);
      expect(res.status()).toBe(200);
      await page.waitForLoadState('domcontentloaded');
      // Filter out non-critical errors (font loading, GSAP warnings)
      const critical = errors.filter(e => !e.includes('font') && !e.includes('Failed to load'));
      expect(critical).toHaveLength(0);
    });

    test('has a title', async ({ page }) => {
      await page.goto(`/${site.file}`);
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
    });

    test('hero text is visible', async ({ page }) => {
      await page.goto(`/${site.file}`);
      await page.waitForTimeout(3000); // wait for GSAP animations
      const body = await page.locator('body').innerText();
      expect(body).toMatch(site.hero);
    });

    test('has a navigation element', async ({ page }) => {
      await page.goto(`/${site.file}`);
      const nav = page.locator('nav, header, [class*="nav"]').first();
      await expect(nav).toBeVisible();
    });

    test('has a footer', async ({ page }) => {
      await page.goto(`/${site.file}`);
      const footer = page.locator('footer').first();
      await expect(footer).toBeVisible();
    });

    test('no horizontal overflow', async ({ page }) => {
      await page.goto(`/${site.file}`);
      await page.waitForLoadState('networkidle');
      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth - window.innerWidth
      );
      expect(overflow).toBeLessThanOrEqual(5);
    });

    test('page is scrollable (has content)', async ({ page }) => {
      await page.goto(`/${site.file}`);
      await page.waitForLoadState('networkidle');
      const height = await page.evaluate(() => document.body.scrollHeight);
      expect(height).toBeGreaterThan(800);
    });
  });
}
