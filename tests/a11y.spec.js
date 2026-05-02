import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ═══════════════════════════════════════
// ACCESSIBILITY SMOKE — axe-core on every Gloxx-branded page
// Fails on any WCAG 2.0/2.1 A + AA violation.
// ═══════════════════════════════════════

const GLOXX_PAGES = [
  { path: '/',                            name: 'home' },
  { path: '/services.html',               name: 'services' },
  { path: '/approach.html',               name: 'approach' },
  { path: '/about.html',                  name: 'about' },
  { path: '/contact.html',                name: 'contact' },
  { path: '/bench/',                      name: 'bench-landing' },
  { path: '/bench/maturity-model.html',   name: 'bench-maturity-model' },
  { path: '/bench/assessment.html',       name: 'bench-assessment' },
  { path: '/bench/essays/',               name: 'bench-essays' },
  { path: '/bench/tools/',                name: 'bench-tools' },
  { path: '/bench/reports/',              name: 'bench-reports' },
];

test.describe('Accessibility (axe-core)', () => {
  for (const { path, name } of GLOXX_PAGES) {
    test(`${name} page has no axe violations`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      // Give GSAP hero reveal ~1.5s to finish before axe scans — otherwise it can
      // flag the hero title's translate(110%) intermediate state as "not visible."
      await page.waitForTimeout(1500);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
    });
  }
});
