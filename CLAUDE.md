# Gloxx — Fractional Head of AI QA

## Project Overview

Gloxx is the fractional Head of AI QA for teams shipping AI features or rolling out Claude Code. This repo is the public website + lead-gen funnel at `gloxx.ai`. All pages are static HTML with inline CSS/JS — no frameworks, no build tools in production.

**Current state (2026-04-18):** Site is live at `gloxx.ai`. Repositioning from the prior blockchain-QA framing → AI-native QA for Series A/B SaaS completed in this session (see commit history on `main`). 420 Playwright tests green; working tree clean pending this session's edits.

## Positioning

- **Target audience:** CTOs and founders of Series A–B SaaS companies shipping AI features, scale-ups rolling out Claude Code or Cursor, AI-native startups approaching launch, regulated fintech/healthtech with AI in-product, and engineering orgs that know they have an eval problem.
- **Core offer:**
  - AI-Native QA Readiness Audit ($12–15k / 2 weeks) — entry point for every engagement
  - Eval Suite Build ($25–50k / 4–6 weeks) — golden sets, eval harness, prompt regression, CI release gates
  - Fractional Head of AI QA ($6–12k/mo / 10–20 hrs/wk) — bread-and-butter retainer
  - Pre-Launch AI War Room ($15–20k / 2 weeks flat) — date-anchored pre-launch intensive
  - Gloxx Sentinel (from $2k/mo bolt-on) — continuous eval monitoring via Claude Code Routines
- **Differentiation:** 15 years QA leadership × a real Claude Code operating protocol (6 principles) × eval discipline that treats AI output like any other untrusted input.

## File Structure

```
/                       — Root (all production HTML files)
├── index.html          — Home (hero, What we do, Who we work with, Why Gloxx, CTA)
├── services.html       — Four service tiers + Sentinel teaser
├── approach.html       — The content moat: tool stack, AI agent workflow, Claude Code operating protocol, test pyramid, release-gate checklist, refuse list
├── about.html          — Founder story + "What I've shipped" list
├── contact.html        — Intake form (posts to Google Apps Script; mailto fallback)
├── 404.html            — "This page failed a test."
├── archive/            — Prior portfolio work (10 design studies + hub page, all noindex)
├── tests/              — Playwright specs (desktop + mobile projects)
├── playwright.config.js
├── package.json
├── sitemap.xml
├── robots.txt
├── CNAME               — custom domain file for GitHub Pages (gloxx.ai)
└── CLAUDE.md           — this file
```

## Tech Stack

- **HTML + CSS + vanilla JS** — All inline per file, no external stylesheets.
- **Google Fonts** — Space Grotesk (display) + Inter (body) on all Gloxx-branded pages; JetBrains Mono on `approach.html` for code blocks. Archived portfolio sites retain their distinct fonts.
- **GSAP 3.12.5 + ScrollTrigger** — loaded from CDN on `index.html` for hero reveal + scroll animations.
- **Google Apps Script** — backend for the intake form; posts to a Google Sheet. Endpoint is live and wired on `contact.html`.
- No build tools required for production. `vite.config.js` exists for local dev only.

## Design System

### Brand tokens (declared at `:root` in every page's `<style>` block)

```css
--gloxx-bg: #0b0d10;           /* near-black canvas */
--gloxx-fg: #f2f3f5;           /* primary text */
--gloxx-muted: #8a8f98;        /* secondary text */
--gloxx-border: #1b1f24;       /* subtle dividers */
--gloxx-accent: #7cf9b5;       /* subtle green — trust + growth */
--gloxx-accent-ink: #0b0d10;   /* text color that sits on accent */
```

`.gradient-text` on `index.html` retains a linear-gradient shimmer across the green/teal/indigo family — deliberate stylistic signature, don't flatten it.

### Typography
- **Headings:** Space Grotesk 400/500/600/700
- **Body:** Inter 300/400/500/600
- **Code (on `approach.html`):** JetBrains Mono 400/500

## Intake form

`contact.html` posts a JSON payload to a Google Apps Script web endpoint. Fields: `name`, `company`, `email`, `what-building`, `current-qa`, `when-shipping`, `war-room`. On network failure, the form falls back to a structured `mailto:hello@gloxx.ai` so no leads are lost.

**Important:** the form field `name="current-qa"` was kept as-is during the AI-QA repositioning — only the *label* shown to the user changed ("What's your current QA situation?" → "Where is AI showing up, and how are you testing it today?"). This means the Google Sheet column headers do not need to be redeployed.

## Running locally

```bash
python3 -m http.server 8080
# OR
npx serve .
```

## Testing

```bash
npx playwright test           # full suite, desktop + mobile
npx playwright test --ui      # interactive UI
```

Covers: page loads, hero rendering, navigation, scroll behavior, contact-form submission (with Apps Script POST + mailto fallback), responsive layout, horizontal-overflow regressions, archive page structure, axe-core WCAG 2.0+2.1 A/AA smoke check, and a polish audit (unique `<title>`/meta, one H1 per page, no skipped heading levels, internal links resolve <400, decorative SVGs hidden from AT).

## Deployment

GitHub Pages at `https://gloxx.ai` (custom domain via `CNAME` at repo root). Repo: `github.com/gloxxai/gloxx-web`. DNS at GoDaddy: 4 apex A records → GitHub Pages IPs; `www` CNAME → `gloxxai.github.io.`. Every push to `main` triggers a rebuild. HTTPS enforced.

```bash
git push origin main
```

## Architectural Rules (non-negotiable)

1. Each page is a single self-contained HTML file — keep it that way.
2. All CSS and JS must be inline (no external stylesheets or script files).
3. No Lorem ipsum — every line of copy must be real and compelling.
4. Every Gloxx-branded page declares the `--gloxx-*` tokens at `:root`.
5. Run `npx playwright test` after any copy or structural change.
6. Don't commit `node_modules`, `test-results`, or `.env`.

## Writing voice (for any copy changes)

- Technical founder / CTO is the reader. Write like them, not at them.
- No marketing fluff. No "we empower," no "seamlessly," no "transform."
- Short sentences are load-bearing. Long sentences earn their length with specificity.
- Name the specific failure mode before naming the offer that fixes it.
- The six-principle Claude Code operating protocol on `/approach` is the credibility anchor — every page should be consistent with its opinions.
