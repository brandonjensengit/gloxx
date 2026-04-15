# Gloxx — AI-Augmented QA for Blockchain Teams

## Project Overview

Gloxx is an AI-augmented QA consultancy serving blockchain protocols and crypto-native fintech teams. This repo is the public website + lead-gen funnel. All pages are static HTML with inline CSS/JS — no frameworks, no build tools in production.

**Current state (2026-04-14):** Repositioning in progress on branch `gloxx-repositioning`. The site is mid-migration from the prior "Premium AI Development Studio" framing. See `Obisidan-Bran/…` vault or `/Users/brando/obsidian/Gloxx/90-Day Launch Plan.md` for full launch plan.

## Migration status (resume here)

**Branch:** `gloxx-repositioning` (not merged, not pushed). All 10 repositioning Prompts complete. Working tree clean. 420 Playwright tests green (includes axe-core a11y smoke + polish audit: title/meta uniqueness, heading hierarchy, decorative-SVG a11y, internal-link resolution). Pre-launch punch list lives in `LAUNCH_TODO.md`.

### Prompts done (committed)

| Prompt | Commit | Summary |
| --- | --- | --- |
| 2 | `ca086fb` | Brand tokens + global meta (title/OG/canonical/favicon) |
| 3 | `d8a07e9` | Rewrite home: "Ship blockchain code you can sleep through." Hybrid green palette, new 3-section structure (What we do / Who we work with / Why Gloxx), new nav linking to pages |
| 4 | `097fbf3` | `services.html` — 4 tier cards + Sentinel teaser |
| 5 | `278114d` | `approach.html` — 6-section content moat with sticky TOC, Solidity code block, six-principle Claude Code protocol, test pyramid, 12-item release-gate checklist |
| 6 | `9d5c0be` | `about.html` — founder note (has `[TODO]` shipped-list placeholders Brandon still needs to fill) |
| 7 | `9798916` | `contact.html` — new field schema, `mailto:hello@gloxx.ai` fallback (swap to Apps Script URL when wired — TODO comment in the inline JS marks the spot) |
| 8 | `9be32d4` | Footer dogfood line on all 5 pages, `404.html`, move 10 portfolio HTMLs + `portfolio.html` to `/archive/` with `noindex`, `sitemap.xml`, `robots.txt`, `.gitignore` |
| 9 | `9f4304b` | `.github/workflows/tests.yml` (Playwright + artifact upload, dogfood comment), `@axe-core/playwright` smoke spec for 5 Gloxx pages (WCAG 2.0+2.1 A/AA), `README.md` with tests badge. Fixed real a11y violations surfaced by axe: `--text-3` lifted from `#555` to `#8a8f98` (6:1 on `#08080a`), `--accent-3` brightened from `#6366f1` to `#818cf8` (6.4:1 on `#0f0f12`), removed `opacity:.5` on `.footer-tag`. |
| 10 | `b1ed38f` | `tests/polish.spec.js` — 42 automated assertions covering unique `<title>` / meta description across pages, exactly-one-H1 + no-skipped-levels per page, decorative SVGs hidden from AT, every internal link returns <400. All passed on first run. `LAUNCH_TODO.md` inventories everything Brandon still needs before DNS flip (favicon, og-image, about.html `[TODO]` bullets, Apps Script wiring, `hello@gloxx.ai` mailbox, Cal.com URL, canonical/sitemap/robots swap to `gloxx.ai`). |

### Prompts remaining

All 10 Prompts committed. Pre-launch work is in `LAUNCH_TODO.md` — it's content + infra (assets, mailbox, DNS, filling two `[TODO]` bullets in `about.html`), not code.

### Running locally

Server already handled by Playwright's `webServer` config (`python3 -m http.server 8080`). Suite:

```bash
npx playwright test
```

### Open decisions (already made in prior session)

- Email: `hello@gloxx.ai` (everywhere)
- Portfolio files: **archived** at `/archive/`, not deleted
- Footer tagline: "Wisdom engineered." stays; "Built and tested with the same stack we sell." added as a secondary dogfood line underneath
- Palette approach: **hybrid** — flat accents swap to green `#7cf9b5`, but `.gradient-text` retains the linear-gradient shimmer (hue-shifted to green/teal/indigo family)
- Apps Script URL: **not available yet** — `contact.html` uses `mailto:hello@gloxx.ai` fallback; swap when the URL is wired
- Commit cadence: one commit per Prompt (clean `git bisect` trail)

## Positioning

- **Target audience:** CTOs and founders of DeFi protocols, L2s, wallets, crypto-native fintech, and TradFi teams building tokenization/stablecoin products.
- **Core offer:** QA Readiness Audits ($8k / 2 weeks), Test Suite Rebuilds ($18–35k), Fractional QA Leadership retainers ($4–8k/mo), Pre-Upgrade War Rooms ($12k), and Gloxx Sentinel subscription (Q3 2026 soft-launch via Claude Code Routines).
- **Differentiation:** 15 years QA leadership × blockchain specialization × AI-assisted test workflows (Slither, Mythril, Aderyn, Foundry, Halmos, Echidna + Claude Code).

## File Structure

```
/                       — Root (all production HTML files)
├── index.html          — Main Gloxx site (hero, about, services, work, process, CTA, survey)
├── portfolio.html      — Legacy portfolio page (will move to /archive/ in a later step)
├── services.html       — [TODO: create in Prompt 4] four service tiers
├── approach.html       — [TODO: create in Prompt 5] six-principle Claude Code operating protocol + QA methodology
├── about.html          — [TODO: create in Prompt 6] founder story
├── contact.html        — [TODO: create in Prompt 7] intake form + email fallback
├── 404.html            — [TODO: create in Prompt 8]
├── archive/            — [TODO: move 10 portfolio HTMLs here in a later step]
│   ├── vantage.html    — Vantage AI (SaaS analytics, dark mode)
│   ├── lumen.html      — Lumen Goods (e-commerce, light mode, serif)
│   ├── orbis.html      — Orbis Capital (fintech, ultra-minimal dark)
│   ├── forma.html      — Forma Studio (architecture, white, editorial)
│   ├── clarity.html    — Clarity Health (telehealth, light mode, teal)
│   ├── thebrief.html   — The Brief (media, newspaper editorial)
│   ├── apex.html       — Apex Robotics (industrial, dark, amber)
│   ├── noma.html       — Noma Wines (luxury, burgundy/gold)
│   ├── vertex.html     — Vertex Labs (cybersecurity, terminal green-on-black)
│   └── solara.html     — Solara Energy (solar, sunrise gradients, light)
├── tests/              — Playwright test suite
├── playwright.config.js
├── package.json
└── CLAUDE.md           — This file
```

Currently the 10 archive-bound HTMLs still live at repo root. They will be moved together in the archive step (not in Prompt 2).

## Tech Stack

- **HTML + CSS + vanilla JS** — All inline per file, no external stylesheets
- **Google Fonts** — Space Grotesk (display) + Inter (body) across all Gloxx-branded pages; archived portfolio sites retain their distinct fonts
- **GSAP 3.12.5** + **ScrollTrigger** — animation engine, loaded from CDN
- **Google Apps Script** — backend for the intake form (post to Google Sheets). Endpoint placeholder until wired.
- No build tools required for production. `vite.config.js` exists for local dev only.

## Design System

### Brand tokens (2026-04-14 — introduced in Prompt 2 of the repositioning)

Every page's `<style>` block declares these at `:root`:

```css
--gloxx-bg: #0b0d10;           /* near-black canvas */
--gloxx-fg: #f2f3f5;           /* primary text */
--gloxx-muted: #8a8f98;        /* secondary text */
--gloxx-border: #1b1f24;       /* subtle dividers */
--gloxx-accent: #7cf9b5;       /* subtle green — trust + crypto-adjacent without being loud */
--gloxx-accent-ink: #0b0d10;   /* text color that sits on accent */
```

The existing indigo/violet/pink accent vars (`--accent-1`, `--accent-2`, `--accent-3`) are retained on the home page for Prompt-2 visual continuity. The full accent re-skin to green happens in Prompt 3 when the home-page copy is rewritten.

### Typography
- **Headings:** Space Grotesk 400/500/600/700
- **Body:** Inter 300/400/500/600

## Key Features

- **Intake form** — 7-step wizard on `index.html` (will migrate to a dedicated `contact.html` in Prompt 7 with a new blockchain-QA field schema). Currently posts to a Google Apps Script URL that is still a placeholder (`PASTE_YOUR_APPS_SCRIPT_URL_HERE` — submits will silently fail until wired).
- **Portfolio previews** — Live iframe embeds on `portfolio.html` at 25% scale. Legacy; will move to `/archive/` before launch.
- **Custom cursor** — Dot + ring with `mix-blend-mode`, magnetic buttons, trail dots.
- **Responsive** — Breakpoints at 1024 / 768 / 600 / 480 px + landscape-phone handling.
- **Accessibility** — `focus-visible` styles, `prefers-reduced-motion` support, semantic HTML.
- **Film grain** — SVG `feTurbulence` overlay at 1.8% opacity with `mix-blend-mode: overlay`.

## Running Locally

```bash
python3 -m http.server 8080
# OR
npx serve .
```

## Testing

```bash
npx playwright test           # full suite, desktop + mobile projects
npx playwright test --ui      # interactive UI
```

Tests cover: page loads, hero rendering, navigation, scroll behavior, intake-form flow (full 7-step), responsive layout, horizontal-overflow regressions, portfolio page structure.

## Deployment

GitHub Pages at `https://gloxx.ai` (custom domain configured via `CNAME` file at repo root). DNS records live at GoDaddy: 4 apex A records → GitHub Pages IPs, `www` CNAME → `brandonjensengit.github.io.`. Every push to `main` triggers an auto-rebuild.

```bash
git push origin main
```

## Google Sheets Integration (intake form)

1. Replace `PASTE_YOUR_APPS_SCRIPT_URL_HERE` in the form-submit JS with the deployed Apps Script URL.
2. The old script expects fields: `step_0` … `step_6`, `details`, `name`, `company`, `email`, `role`, `website`.
3. **Field schema changes in Prompt 7** — new `contact.html` form will use: `name`, `company` (or protocol), `what-building`, `current-qa`, `when-shipping`, `email`, `war-room` flag. The Apps Script will need its column headers updated when this lands.

During the gap where no Apps Script URL is live, `contact.html` falls back to a structured `mailto:hello@gloxx.ai` submission so no leads are lost.

## Architectural Rules

1. Each page is a single self-contained HTML file — keep it that way.
2. All CSS and JS must be inline (no external stylesheets or script files).
3. No Lorem ipsum — every line of copy must be real and compelling.
4. Every Gloxx-branded page declares the `--gloxx-*` tokens at `:root` (added in Prompt 2).
5. Test after changes: `npx playwright test`.
6. Don't commit `node_modules`, `test-results`, or `.env`.
