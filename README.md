# Gloxx

[![tests](https://github.com/gloxxai/gloxx-web/actions/workflows/tests.yml/badge.svg)](https://github.com/gloxxai/gloxx-web/actions/workflows/tests.yml)

AI-augmented QA for blockchain teams. Public site + lead-gen funnel for [gloxx.ai](https://gloxx.ai).

Static HTML per page, inline CSS/JS, no build step in production. Every push is tested with Playwright + axe-core — the same tooling we sell.

## Pages

- `index.html` — home
- `services.html` — four tiers + Sentinel teaser
- `approach.html` — six-principle Claude Code protocol + QA methodology
- `about.html` — founder note
- `contact.html` — intake (Apps Script → `mailto:` fallback)
- `archive/` — prior portfolio demos, `noindex`

## Local development

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## Tests

```bash
npm ci
npx playwright install --with-deps chromium
npx playwright test           # full suite (desktop + mobile, a11y smoke)
npx playwright test --ui      # interactive
```

Playwright's `webServer` config spawns the Python server automatically, so `npx playwright test` works from a clean checkout without a separate server step.

## Stack

HTML + inline CSS + vanilla JS · Space Grotesk + Inter · GSAP 3.12 · Google Apps Script intake · GitHub Pages

See [`CLAUDE.md`](CLAUDE.md) for architecture notes and migration status.
