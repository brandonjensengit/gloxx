# Gloxx launch TODO

Everything outstanding before the site goes live at **gloxx.ai**. Grouped by blast radius.

> Test suite is green at 420 tests. All audits (accessibility, link-check, heading hierarchy, unique titles/metas) are automated in CI — so as you check these off, the tests will tell you if you broke anything.

---

## 1. Assets to create + upload to repo root

- [x] **Favicon pack** — `favicon.ico` + `favicon-16x16.png` + `favicon-32x32.png` + `apple-touch-icon.png` + `android-chrome-192x192.png` + `android-chrome-512x512.png` + `site.webmanifest`. Generated from favicon.io (Space Grotesk "G" in brand green on brand black). All 6 HTML files now link the full set, with `theme-color: #08080a` so mobile home-screen splash matches the site background.
- [ ] **`og-image.png`** — 1200×630 PNG, referenced by `<meta property="og:image">` on all 5 Gloxx pages + 404. This is what LinkedIn / X / Slack previews render when someone pastes a Gloxx URL. "Ship blockchain code you can sleep through." or "AI-augmented QA for blockchain teams" over the brand background is a fine v1.

## 2. Content placeholders to fill in

- [ ] **`about.html` — shipped-list bullets** (lines 231–232). Two `[TODO: fill in — …]` spans in the *"What I've shipped in 15 years of QA"* section:
  - First bullet: the fintech/trading-platform stint.
  - Second bullet: the DeFi team you led.
  - These wrap in a `.todo` span that's currently styled only visually — safe to search-and-replace the whole `<span class="todo">[TODO: …]</span>` with inline text.

## 3. Backend integrations to wire up

- [ ] **Google Apps Script URL for the intake form**
  - **`contact.html`** (line ~387) — a `TODO(backend)` comment marks where to swap `mailto:` for `fetch(APPS_SCRIPT_URL, ...)`. The new field schema is `name, company, what-building, current-qa, when-shipping, email, war-room` — make sure the Apps Script column headers match.
  - **`index.html`** (line 1750) — `const SHEETS_URL = 'PASTE_YOUR_APPS_SCRIPT_URL_HERE';` powers the legacy 7-step survey. If you're keeping the survey, replace with the live URL. If you're retiring it in favor of `contact.html`, remove the `data-survey="true"` triggers from the three "Book a call" links in the home nav/hero/CTA.
- [ ] **Mail: `hello@gloxx.ai`** — the entire site (mailto fallback, contact copy, footer-era SEO) assumes this inbox exists. Needs MX records + catch-all or forwarding set up on whatever provider you use.
- [ ] **Cal.com (or Calendly) booking URL** — every "Book the call" currently routes to `contact.html`. If you want a direct scheduler embed on `contact.html`, drop the embed snippet into the `.ct-form` section and the test assertions will need updating. Optional for launch — the email fallback works.
- [ ] **Footer social links** — `index.html` lines 1579–1581 have `<a href="#">LinkedIn</a>`, `<a href="#">X</a>`, `<a href="#">GitHub</a>`. Replace `#` with real profile URLs (or remove if you don't want them up yet).

## 4. DNS + canonical-URL migration to `gloxx.ai`

These all currently point at the GitHub Pages deploy and must be flipped in lockstep with the DNS cut-over.

- [ ] **Canonical + OG URLs** on all 6 HTMLs (index, services, approach, about, contact, 404): replace `https://brandonjensengit.github.io/gloxx/` with `https://gloxx.ai/`. Same for `archive/portfolio.html` if you want it indexable again later.
- [ ] **`sitemap.xml`** — all 5 `<loc>` URLs.
- [ ] **`robots.txt`** — the `Sitemap:` directive at the bottom.
- [ ] **DNS** — apex `gloxx.ai` → GitHub Pages IPs (185.199.108.153 / .109.153 / .110.153 / .111.153); `www.gloxx.ai` CNAME → `brandonjensengit.github.io.`. Add a `CNAME` file at repo root containing `gloxx.ai` so Pages picks it up.

Suggested mechanical approach:

```bash
# From repo root, dry run first:
grep -rn 'brandonjensengit.github.io/gloxx' --include='*.html' --include='*.xml' --include='*.txt'

# Then the replacement:
LC_ALL=C sed -i '' 's|brandonjensengit.github.io/gloxx|gloxx.ai|g' \
  index.html services.html approach.html about.html contact.html 404.html \
  sitemap.xml robots.txt archive/portfolio.html

# Commit, push, flip DNS, wait for propagation, re-run Playwright with a live URL spot-check.
```

## 5. Nice-to-have polish before announcing

- [ ] Regenerate `CNAME` / `og-image` cached previews by re-pasting URLs in LinkedIn Post Inspector + X Card Validator (CDNs cache old OG images aggressively).
- [ ] Add a Plausible / Fathom / GA4 snippet — whichever analytics you're standardizing on.
- [ ] Decide what goes in `archive/` long-term. Currently `noindex`, `Disallow: /archive/` in robots. Fine to leave, but after a quarter you may want to delete the portfolio demos entirely.

---

## What's *already_ done (no action needed)

- All 5 Gloxx pages + 404 have unique `<title>` and `<meta name="description">` ✓
- All pages have exactly one `<h1>` and no skipped heading levels ✓
- All internal links on all 5 pages resolve to `<400` ✓
- WCAG 2.0 + 2.1 A/AA passes on all 5 pages via axe-core ✓
- Playwright CI runs on every push, uploads HTML report as artifact ✓
- `/archive/` subtree is `noindex` and disallowed from robots ✓
- Footer dogfood line on all 5 pages links to the test directory ✓

If any of the above regresses, CI will page you.
