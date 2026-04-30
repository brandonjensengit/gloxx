# Gloxx — Fractional QA team for software companies

## Project Overview

Gloxx is a fractional QA team for software companies. One $15k/month retainer gets a senior QA team embedded with the engineering org — test strategy, regression coverage, release gates, automation, exploratory testing, and AI-feature QA when it applies. This repo is the public website + lead-gen funnel at `gloxx.ai`. All pages are static HTML with inline CSS/JS — no frameworks, no build tools in production.

**Current state (2026-04-30):** Site is live at `gloxx.ai`. Repositioned from "Fractional Head of AI QA" → "Fractional QA team for software companies" in this session — the four-tier consulting menu (audit + eval suite + fractional + war room + sentinel) collapsed to a single $15k/mo flat retainer. AI-QA stays on the site as a specialty differentiator on `/approach` and in the third home-page card, but is no longer the headline. Working tree pending this session's edits.

## Positioning

- **Target audience:** CTOs and founders of software companies shipping every week without QA leadership, Series A–B SaaS past the "engineers test their own code" stage, scale-ups needing a regression safety net, regulated fintech/healthtech, and AI-native teams approaching launch.
- **Core offer:** **The Gloxx Retainer — $15,000/mo, month-to-month**, fractional QA team for software companies. Founder-led; specialist contractors (automation, AI eval, performance, security) staffed in as the work demands. Two-week ramp, weekly sync, monthly QA scorecard. AI-feature QA included at no surcharge when the roadmap calls for it. Cancel any month with 30 days' notice. No tiers, no paid audits, no project upsell, no monitoring add-ons.
- **Differentiation:** 15 years QA leadership × senior accountable founder × AI-native specialty when the buyer needs it × one flat number vs. an in-house team that costs 3–4x as much ($180k/yr Gloxx vs. $400–600k/yr fully loaded).

## File Structure

```
/                       — Root (all production HTML files)
├── index.html          — Home (hero, What we do, Who we work with, Why Gloxx, CTA)
├── services.html       — Single-offer deep dive on the $15k/mo Gloxx Retainer
├── approach.html       — The content moat: general QA primer (test pyramid, release gates), then the AI specialty layer — tool stack, agent workflow, Claude Code operating protocol, AI test pyramid, release-gate checklist, refuse list
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

**Important:** the form field `name=` attributes are stable across repositionings — only the visible label text changes. The label on `name="current-qa"` has been "What's your current QA situation?" → "Where is AI showing up, and how are you testing it today?" → and is now back to "What's your current QA situation?" The label on `name="war-room"` was repurposed from "WAR ROOM" to a generic "URGENT" pre-launch flag. The Google Sheet column headers stay valid through every repositioning because the field names never change. Apply the same discipline next time.

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
- `/approach` is the content moat: a general QA primer (test pyramid, release-gate baseline) followed by the AI specialty layer (six-principle Claude Code operating protocol, AI test pyramid, eval gate). Every other page should be consistent with its opinions.
- AI/Claude-Code QA is a **specialty differentiator**, not the headline. Lead with general QA value (cost, speed, accountability), surface AI-feature QA as the reason to pick Gloxx over a generic shop.
