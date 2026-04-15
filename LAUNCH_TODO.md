# Gloxx launch TODO

Everything outstanding before the site goes live at **gloxx.ai**. Grouped by blast radius.

> Test suite is green at 420 tests. All audits (accessibility, link-check, heading hierarchy, unique titles/metas) are automated in CI — so as you check these off, the tests will tell you if you broke anything.

---

## 1. Assets to create + upload to repo root

- [x] **Favicon pack** — `favicon.ico` + `favicon-16x16.png` + `favicon-32x32.png` + `apple-touch-icon.png` + `android-chrome-192x192.png` + `android-chrome-512x512.png` + `site.webmanifest`. Generated from favicon.io (Space Grotesk "G" in brand green on brand black). All 6 HTML files now link the full set, with `theme-color: #08080a` so mobile home-screen splash matches the site background.
- [x] **`og-image.png`** — 1200×1200 (square, 2.4 MB), portrait of Bran in the Gloxx hat at the podcast mic. Wired to all 5 Gloxx pages with explicit `og:image:width`/`height` so crawlers don't mis-crop. Works as-is on LinkedIn / Slack / X; X will render it centered in a 1.91:1 feed crop.

## 2. Content placeholders to fill in

- [x] **`about.html` — shipped-list bullets filled in with real QA wins**: Safemoon ($4B-peak token), LuminousDap (led QA at a blockchain dev agency), Proofpoint (senior QA at the enterprise security firm), ATF (government contractor, sensitive-data applications). Founder portrait (`bran.jpg`, 800×800 JPG, 126 KB) added to the hero. An HTML comment next to the Safemoon bullet contains an anonymized fallback ("a top-trending 2021 crypto token…") you can drop in with one edit if the name feels off in conversation with buyers.

## 3. Backend integrations to wire up

- [x] **Cal.com** — every "Book a call" / "Book the call" / "Book a 30-min QA assessment" CTA across the site now routes to `https://cal.com/gloxx/30min` with `target="_blank" rel="noopener"`. Link-out pattern; no embed.
- [x] **Legacy 7-step survey retired** — the entire survey modal (HTML + ~259 lines of CSS + ~152 lines of JS) has been deleted from `index.html`. The stale `SHEETS_URL = 'PASTE_YOUR_APPS_SCRIPT_URL_HERE'` placeholder went with it.
- [ ] **Google Apps Script URL for the `contact.html` intake form** (line ~387) — a `TODO(backend)` comment marks where to swap `mailto:` for `fetch(APPS_SCRIPT_URL, ...)`. Field schema: `name, company, what-building, current-qa, when-shipping, email, war-room` — Apps Script column headers must match.
- [ ] **Mail: `hello@gloxx.ai`** — contact.html's mailto fallback and the footer copy all point here. Needs MX records + catch-all or forwarding set up on whatever provider you use.
- [ ] **Footer social links** — `index.html` home-page footer has `<a href="#">LinkedIn</a>`, `<a href="#">X</a>`, `<a href="#">GitHub</a>`. Replace `#` with real profile URLs (or delete if you're not ready to share them yet).

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
