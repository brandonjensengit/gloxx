import { test, expect } from '@playwright/test';

test.describe('404 page', () => {
  test('renders with expected copy', async ({ page }) => {
    await page.goto('/404.html');
    await expect(page).toHaveTitle(/404.*Gloxx/);
    await expect(page.locator('h1')).toContainText('This page failed a test');
  });

  test('provides back-home CTA', async ({ page }) => {
    await page.goto('/404.html');
    const home = page.locator('.btn-primary');
    await expect(home).toHaveAttribute('href', 'index.html');
  });

  test('has noindex meta', async ({ page }) => {
    await page.goto('/404.html');
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveAttribute('content', 'noindex');
  });
});

test.describe('SEO assets', () => {
  test('sitemap.xml is served with all 5 URLs', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('https://gloxx.ai/');
    expect(body).toContain('services.html');
    expect(body).toContain('approach.html');
    expect(body).toContain('about.html');
    expect(body).toContain('contact.html');
  });

  test('robots.txt references sitemap and disallows /archive/', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('Sitemap:');
    expect(body).toContain('Disallow: /archive/');
  });
});

test.describe('Footer dogfood line', () => {
  const pages = ['/', '/services.html', '/approach.html', '/about.html', '/contact.html'];
  for (const path of pages) {
    test(`${path} shows "Built and tested" footer line`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      const dogfood = page.locator('.footer-dogfood');
      await expect(dogfood).toBeVisible();
      await expect(dogfood).toContainText('Built and');
      await expect(dogfood).toContainText('tested');
      await expect(dogfood).toContainText('same stack we sell');
    });
  }
});
