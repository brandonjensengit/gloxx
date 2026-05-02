import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ═══════════════════════════════════════
// ACCESSIBILITY SMOKE — axe-core on every Gloxx-branded page
// Fails on any WCAG 2.0/2.1 A + AA violation.
// ═══════════════════════════════════════

const GLOXX_PAGES = [
  { path: '/',                                          name: 'home' },
  { path: '/services.html',                             name: 'services' },
  { path: '/approach.html',                             name: 'approach' },
  { path: '/about.html',                                name: 'about' },
  { path: '/contact.html',                              name: 'contact' },
  { path: '/institute/',                                name: 'institute-landing' },
  { path: '/institute/about.html',                      name: 'institute-about' },
  { path: '/institute/maturity-model.html',             name: 'institute-maturity-model' },
  { path: '/institute/assessment.html',                 name: 'institute-assessment' },
  { path: '/institute/journal/',                        name: 'institute-journal' },
  { path: '/institute/tools/',                          name: 'institute-tools' },
  { path: '/institute/reports/',                        name: 'institute-reports' },
  { path: '/institute/workflows/',                      name: 'institute-workflows-index' },
  { path: '/institute/workflows/eval.html',             name: 'institute-workflow-eval' },
  { path: '/institute/workflows/release-gate.html',     name: 'institute-workflow-release-gate' },
  { path: '/institute/workflows/drift.html',            name: 'institute-workflow-drift' },
  { path: '/institute/workflows/failure-taxonomy.html', name: 'institute-workflow-failure-taxonomy' },
  { path: '/institute/workflows/feedback-loop.html',    name: 'institute-workflow-feedback-loop' },
  { path: '/institute/workflows/refuse-policy.html',    name: 'institute-workflow-refuse-policy' },
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
