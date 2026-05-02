# Gloxx — Fractional QA team for software companies

## Project Overview

Gloxx is a fractional QA team for software companies. One $15k/month retainer gets a senior QA team embedded with the engineering org — test strategy, regression coverage, release gates, automation, exploratory testing, and AI-feature QA when it applies. This repo is the public website + lead-gen funnel at `gloxx.ai`. All pages are static HTML with inline CSS/JS — no frameworks, no build tools in production.

**Current state (2026-05-01):** Site is live at `gloxx.ai`. Positioned as a fractional QA team for software companies at $15k/mo. AI-QA is the specialty differentiator on `/approach` and on the home page. **Gloxx Bench** launched as the authority-driven inbound vehicle at `gloxx.ai/bench/` — three product lines (essays, open-source tools, quarterly reports) anchored by the **AI-QA Maturity Model** and a 30-question self-assessment that doubles as the lead-conversion engine.

## Positioning

- **Target audience:** CTOs and founders of software companies shipping every week without QA leadership, Series A–B SaaS past the "engineers test their own code" stage, scale-ups needing a regression safety net, regulated fintech/healthtech, and AI-native teams approaching launch.
- **Core offer:** **The Gloxx Retainer — $15,000/mo, month-to-month**, fractional QA team for software companies. Founder-led; specialist contractors (automation, AI eval, performance, security) staffed in as the work demands. Two-week ramp, weekly sync, monthly QA scorecard. AI-feature QA included at no surcharge when the roadmap calls for it. Cancel any month with 30 days' notice. No tiers, no paid audits, no project upsell, no monitoring add-ons.
- **Differentiation:** 15 years QA leadership × senior accountable founder × AI-native specialty when the buyer needs it × one flat number vs. an in-house team that costs 3–4x as much ($180k/yr Gloxx vs. $400–600k/yr fully loaded).

## File Structure

```
/                            — Root (all production HTML files)
├── index.html               — Home (hero, What we do, Who we work with, Why Gloxx, CTA)
├── services.html            — Single-offer deep dive on the $15k/mo Gloxx Retainer
├── approach.html            — The content moat: general QA primer (test pyramid, release gates), then the AI specialty layer — tool stack, agent workflow, Claude Code operating protocol, AI test pyramid, release-gate checklist, refuse list. Cross-links into the Bench (maturity model + assessment)
├── about.html               — Founder story + "What I've shipped" list
├── contact.html             — Intake form (posts to Google Apps Script; mailto fallback)
├── bench/                   — Gloxx Bench — authority-driven inbound vehicle
│   ├── index.html           — Bench landing: featured Maturity Model + three product-line cards + roadmap
│   ├── maturity-model.html  — Flagship reference: 5 levels × 6 dimensions of AI-QA maturity, with observable signals and triggers per level
│   ├── assessment.html      — 30-question self-assessment (lead magnet). Pure-DOM result rendering — no innerHTML for dynamic data. Posts to the same Apps Script endpoint as contact.html with mailto fallback
│   ├── essays/index.html    — Editorial calendar placeholder; first essay ships week of May 5
│   ├── tools/index.html     — Open-source tools catalog (gloxxai/* on GitHub)
│   └── reports/index.html   — Quarterly research; State of AI-Feature QA 2026 in field collection now
├── 404.html                 — "This page failed a test."
├── archive/                 — Prior portfolio work (10 design studies + hub page, all noindex)
├── tests/                   — Playwright specs (desktop + mobile projects); bench.spec.js covers the Bench
├── playwright.config.js
├── package.json
├── sitemap.xml
├── robots.txt
├── CNAME                    — custom domain file for GitHub Pages (gloxx.ai)
└── CLAUDE.md                — this file
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

## Forms posting to Apps Script

Two forms post JSON to the same Google Apps Script web endpoint (`script.google.com/macros/s/AKfycbzi19...`); both fall back to a structured `mailto:hello@gloxx.ai` on network failure.

**`contact.html`** — fields: `name`, `company`, `email`, `what-building`, `current-qa`, `when-shipping`, `war-room`.

**`bench/assessment.html`** — fields: `name`, `email`, `company`, `role`, `source` (always `maturity-assessment`), 30 question fields (`d1q1`…`d6q5`), and computed result fields (`result-overall-level`, `result-overall-level-name`, `result-weakest-dim`, `result-d{1..6}-level`). The `source` field distinguishes assessment submissions from contact-form ones in the Sheet.

**Important:** form field `name=` attributes are stable across repositionings — only the visible label text changes. The label on `name="current-qa"` has been "What's your current QA situation?" → "Where is AI showing up, and how are you testing it today?" → and is now back to "What's your current QA situation?" The label on `name="war-room"` was repurposed from "WAR ROOM" to a generic "URGENT" pre-launch flag. The Sheet column headers stay valid through every repositioning because the field names never change. Apply the same discipline to the Bench assessment fields — the question stems can evolve, but `d1q1`…`d6q5` and the `result-*` fields are load-bearing.

**Assessment XSS hygiene:** `bench/assessment.html` renders its result panel via pure DOM construction (`createElement` + `textContent`), not template-literal `innerHTML` interpolation. If you change the result rendering, keep that pattern — never put user-controlled values into `innerHTML`.

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
- `/bench` is the production line behind the `/approach` discipline — fresh-content vehicle for essays, OSS, and reports. Keep `/approach` as the dense evergreen "what we believe" page; use `/bench` for dated, ongoing publication. Cross-link aggressively. The maturity model is descriptive (what's actually true at each level), not aspirational — every level needs concrete observable signals before it ships.
