# Gloxx — Fractional QA team for software companies

## Project Overview

Gloxx is a fractional QA team for software companies. One $15k/month retainer gets a senior QA team embedded with the engineering org — test strategy, regression coverage, release gates, automation, exploratory testing, and AI-feature QA when it applies. This repo is the public website + lead-gen funnel at `gloxx.ai`. All pages are static HTML with inline CSS/JS — no frameworks, no build tools in production.

**Current state (2026-05-02):** Site is live at `gloxx.ai`. Positioned as a fractional QA team for software companies at $15k/mo. AI-QA is the specialty differentiator on `/approach` and on the home page. **Gloxx QA Institute** is the authority-driven inbound vehicle at `gloxx.ai/institute/` — six AI-QA workflows, the AI-QA Maturity Model rubric, a free 30-question Readiness Self-Assessment, an Institute Journal, an open-source tools catalog, and a quarterly Reports stream. Phase 1 ships the rename and IA from the previous Bench launch with placeholder workflow procedures; Phase 2 (~weeks 2–3) adds the methodology document, sample report, and the paid AI-QA Readiness Audit product page. The Institute supersedes the previous "Gloxx Bench" surface; six meta-refresh redirect stubs at `/bench/*` preserve SEO continuity.

## Positioning

- **Target audience:** CTOs and founders of software companies shipping every week without QA leadership, Series A–B SaaS past the "engineers test their own code" stage, scale-ups needing a regression safety net, regulated fintech/healthtech, and AI-native teams approaching launch.
- **Core offer:** **The Gloxx Retainer — $15,000/mo, month-to-month**, fractional QA team for software companies. Founder-led; specialist contractors (automation, AI eval, performance, security) staffed in as the work demands. Two-week ramp, weekly sync, monthly QA scorecard. AI-feature QA included at no surcharge when the roadmap calls for it. Cancel any month with 30 days' notice. No tiers, no paid audits, no project upsell, no monitoring add-ons.
- **Differentiation:** 15 years QA leadership × senior accountable founder × AI-native specialty when the buyer needs it × one flat number vs. an in-house team that costs 3–4x as much ($180k/yr Gloxx vs. $400–600k/yr fully loaded).

## File Structure

```
/                                 — Root (all production HTML files)
├── index.html                    — Home (hero, What we do, Who we work with, Why Gloxx, CTA)
├── services.html                 — Single-offer deep dive on the $15k/mo Gloxx Retainer
├── approach.html                 — The content moat: general QA primer + AI specialty layer. Cross-links into the Institute (maturity model + assessment)
├── about.html                    — Founder story + "What I've shipped" list
├── contact.html                  — Intake form (posts to Google Apps Script; mailto fallback)
├── institute/                    — Gloxx QA Institute — published methodology + readiness audit
│   ├── index.html                — Institute landing: free Self-Assessment featured + six workflow cards + cadence roadmap
│   ├── about.html                — What the Institute is and isn't, three-tier ladder, non-warranty boilerplate
│   ├── maturity-model.html       — Rubric: 5 levels × 6 dimensions of AI-QA maturity
│   ├── assessment.html           — Free-tier AI-QA Readiness Self-Assessment (30 questions). Pure-DOM result rendering — no innerHTML for dynamic data. Posts to the same Apps Script endpoint as contact.html with mailto fallback
│   ├── workflows/index.html      — Workflow catalog (6 cards)
│   ├── workflows/eval.html       — Workflow 1: Eval (suite design, golden sets, baselines)
│   ├── workflows/release-gate.html        — Workflow 2: Release-Gate (gate spec, threshold enforcement, override policy)
│   ├── workflows/drift.html      — Workflow 3: Drift Monitoring (sampling, online evals, paging)
│   ├── workflows/failure-taxonomy.html    — Workflow 4: Failure Taxonomy (tagged postmortems, named-failure-mode catalog)
│   ├── workflows/feedback-loop.html       — Workflow 5: Feedback Loops (user reports, triage queue, time-to-coverage SLO)
│   ├── workflows/refuse-policy.html       — Workflow 6: Refuse Policy (written list, system-prompt, refusal-correctness evals, dated compliance review)
│   ├── journal/index.html        — Editorial calendar placeholder for "Institute Journal" long-form
│   ├── tools/index.html          — Open-source tools catalog (gloxxai/* on GitHub)
│   └── reports/index.html        — Quarterly research; State of AI-Feature QA 2026 in field collection now
├── bench/                        — Six meta-refresh redirect stubs preserving SEO continuity from the previous Bench launch. Each is `<meta http-equiv="refresh">` + canonical pointing to its `/institute/*` counterpart, with `<meta name="robots" content="noindex, follow">`. Do NOT remove without setting up server-side 301s first
├── 404.html                      — "This page failed a test."
├── archive/                      — Prior portfolio work (10 design studies + hub page, all noindex)
├── tests/                        — Playwright specs (desktop + mobile projects); institute.spec.js covers the Institute + redirect stubs
├── playwright.config.js
├── package.json
├── sitemap.xml
├── robots.txt
├── gloxx-logo-white-transparent-o-cutout.png — White-on-transparent wordmark; primary nav logo on the dark site
├── gloxx-logo-transparent-o-cutout.png       — Dark-on-transparent variant; reserved for future light surfaces
├── CNAME                         — custom domain file for GitHub Pages (gloxx.ai)
└── CLAUDE.md                     — this file
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

**`institute/assessment.html`** — fields: `name`, `email`, `company`, `role`, `source` (always `maturity-assessment`), 30 question fields (`d1q1`…`d6q5`), and computed result fields (`result-overall-level`, `result-overall-level-name`, `result-weakest-dim`, `result-d{1..6}-level`). The `source` field distinguishes assessment submissions from contact-form ones in the Sheet. The visible label is "AI-QA Readiness Self-Assessment"; the field naming uses `maturity` for back-compatibility with Sheet column headers.

**Important:** form field `name=` attributes are stable across repositionings — only the visible label text changes. The label on `name="current-qa"` has been "What's your current QA situation?" → "Where is AI showing up, and how are you testing it today?" → and is now back to "What's your current QA situation?" The label on `name="war-room"` was repurposed from "WAR ROOM" to a generic "URGENT" pre-launch flag. The Sheet column headers stay valid through every repositioning because the field names never change. Apply the same discipline to the Institute assessment fields — the question stems can evolve, but `d1q1`…`d6q5`, `source: "maturity-assessment"`, and the `result-*` fields are load-bearing.

**Assessment XSS hygiene:** `institute/assessment.html` renders its result panel via pure DOM construction (`createElement` + `textContent`), not template-literal `innerHTML` interpolation. If you change the result rendering, keep that pattern — never put user-controlled values into `innerHTML`.

## Running locally

```bash
python3 -m http.server 8080
# OR
npx serve .
```

## Testing

```bash
npm test            # full suite, desktop + mobile (preferred)
npm run test:ui     # interactive UI
```

`npm test` runs the local `playwright` binary from `node_modules/.bin`, gated by a `pretest` check that fails fast with a clear message if `node_modules/@playwright/test` is missing. Avoid `npx playwright test` — `npx` silently downloads to a global cache when the local binary is missing, which produces a long opaque hang instead of a useful error.

Covers: page loads, hero rendering, navigation, scroll behavior, contact-form submission (with Apps Script POST + mailto fallback), responsive layout, horizontal-overflow regressions, archive page structure, axe-core WCAG 2.0+2.1 A/AA smoke check, and a polish audit (unique `<title>`/meta, one H1 per page, no skipped heading levels, internal links resolve <400, decorative SVGs hidden from AT).

### Fresh git worktrees

`.claude/worktrees/<name>/` checkouts start with no `node_modules` (it's gitignored). Before running anything in a fresh worktree:

```bash
npm install
lsof -i :8080    # if a stale http.server from another directory is bound here, kill it
```

The Playwright config has `webServer.reuseExistingServer: true`, so a stale server bound to 8080 from a different working directory will silently serve the wrong files to test workers — pages will not match expectations and tests can hang without flushing log output. Either kill the stale server or skip ahead and let Playwright start its own fresh one against the worktree path.

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

## Audit-not-certification rule (Institute permanent constraint)

A brand-voice and legal constraint that lives here permanently and survives any future repositioning of the Institute surface:

1. The word **"certification"** never appears as a Gloxx product name. Use "audit" or "readiness review."
2. The word **"certified"** never appears in client-facing copy. Use "audited" or "reviewed."
3. **No warranties** — implied or express. Every audit deliverable carries the standard non-warranty footer language present on `institute/about.html`: *"This audit is a methodology-based assessment of release readiness at a point in time. It is not a regulatory certification, compliance attestation, or warranty of any outcome. The Gloxx QA Institute is a publisher of methodology and a service provider; it is not a regulatory or standards body."*
4. Audit reports are dated, scoped to the artifacts reviewed, and explicit about what was NOT reviewed.
5. The non-warranty paragraph on `institute/about.html` is load-bearing. If it gets edited, the change must preserve all four constraints above.

## Writing voice (for any copy changes)

- Technical founder / CTO is the reader. Write like them, not at them.
- No marketing fluff. No "we empower," no "seamlessly," no "transform."
- Short sentences are load-bearing. Long sentences earn their length with specificity.
- Name the specific failure mode before naming the offer that fixes it.
- `/approach` is the content moat: a general QA primer (test pyramid, release-gate baseline) followed by the AI specialty layer (six-principle Claude Code operating protocol, AI test pyramid, eval gate). Every other page should be consistent with its opinions.
- AI/Claude-Code QA is a **specialty differentiator**, not the headline. Lead with general QA value (cost, speed, accountability), surface AI-feature QA as the reason to pick Gloxx over a generic shop.
- `/institute` is the published methodology behind the retainer — fresh-content vehicle for the maturity model rubric, the six workflow procedures, the Journal long-form, the open-source Tools catalog, and quarterly Reports. Keep `/approach` as the dense evergreen "what we believe" page; use `/institute` for the formal documented methodology and dated/ongoing publication. Cross-link aggressively. The maturity model is descriptive (what's actually true at each level), not aspirational — every level needs concrete observable signals before it ships.
- The Institute register is more measured than the rest of the site. Keep `/approach`, `/about`, the 404 page, and the home-page voice in founder mode. Reserve the formal register for the Institute methodology and audit pages. The `/contact` form's playful "URGENT" pre-launch flag and the founder-direct "I'll reply within one business day" copy stay as-is.
