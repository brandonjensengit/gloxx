import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ═══════════════════════════════════════
// ACCESSIBILITY SMOKE — axe-core on every Gloxx-branded page
// Fails on any WCAG 2.0/2.1 A + AA violation.
// ═══════════════════════════════════════

const GLOXX_PAGES = [
  { path: '/',              name: 'home' },
  { path: '/services.html', name: 'services' },
  { path: '/approach.html', name: 'approach' },
  { path: '/about.html',    name: 'about' },
  { path: '/contact.html',  name: 'contact' },
];

test.describe('Accessibility (axe-core)', () => {
  for (const { path, name } of GLOXX_PAGES) {
    test(`${name} page has no axe violations`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
    });
  }
});
