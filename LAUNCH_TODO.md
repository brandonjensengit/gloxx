# Gloxx launch TODO

Everything outstanding before the site goes live at **gloxx.ai**. Grouped by blast radius.

> Test suite is green at 420 tests. All audits (accessibility, link-check, heading hierarchy, unique titles/metas) are automated in CI — so as you check these off, the tests will tell you if you broke anything.

---

## 1. Assets to create + upload to repo root

- [x] **Favicon pack** — `favicon.ico` + `favicon-16x16.png` + `favicon-32x32.png` + `apple-touch-icon.png` + `android-chrome-192x192.png` + `android-chrome-512x512.png` + `site.webmanifest`. Generated from favicon.io (Space Grotesk "G" in brand green on brand black). All 6 HTML files now link the full set, with `theme-color: #08080a` so mobile home-screen splash matches the site background.
- [x] **`og-image.jpg`** — 1200×1200 (square, 342 KB JPEG re-encode of the original 2.4 MB PNG). Wired to all 5 Gloxx pages + archive portfolio with explicit `og:image:width`/`height` so crawlers don't mis-crop. Works as-is on LinkedIn / Slack / X; X will render it centered in a 1.91:1 feed crop. The file rename `.png`→`.jpg` also auto-busts any CDN that cached the old URL.

## 2. Content placeholders to fill in

- [x] **`about.html` — shipped-list bullets filled in with real QA wins**: Safemoon ($4B-peak token), LuminousDap (led QA at a blockchain dev agency), Proofpoint (senior QA at the enterprise security firm), ATF (government contractor, sensitive-data applications). Founder portrait (`bran.jpg`, 800×800 JPG, 126 KB) added to the hero. An HTML comment next to the Safemoon bullet contains an anonymized fallback ("a top-trending 2021 crypto token…") you can drop in with one edit if the name feels off in conversation with buyers.

## 3. Backend integrations to wire up

- [x] **Cal.com** — every "Book a call" / "Book the call" / "Book a 30-min QA assessment" CTA across the site now routes to `https://cal.com/gloxx/30min` with `target="_blank" rel="noopener"`. Link-out pattern; no embed.
- [x] **Legacy 7-step survey retired** — the entire survey modal (HTML + ~259 lines of CSS + ~152 lines of JS) has been deleted from `index.html`. The stale `SHEETS_URL = 'PASTE_YOUR_APPS_SCRIPT_URL_HERE'` placeholder went with it.
- [x] **Google Apps Script URL for the `contact.html` intake form** — wired to fetch POST with mailto fallback on failure. Payload: `name, company, email, what-building, current-qa, when-shipping, war-room`.
- [x] **Mail: `hello@gloxx.ai`** — MX records + forwarding configured.
- [x] **Footer social links** — LinkedIn wired to company page, GitHub wired to `gloxxai/gloxx-web`, X removed (not ready yet).

## 4. DNS + canonical-URL migration to `gloxx.ai`

- [x] **Canonical + OG URLs** on all 6 HTMLs + `archive/portfolio.html` swapped to `https://gloxx.ai/…`.
- [x] **`sitemap.xml`** — all 5 `<loc>` URLs point to `gloxx.ai`.
- [x] **`robots.txt`** — Sitemap directive points to `gloxx.ai/sitemap.xml`.
- [x] **`CNAME` file** at repo root contains `gloxx.ai` — GH Pages auto-detects on push.
- [x] **DNS records at GoDaddy** — apex A records + `www` CNAME configured.
- [x] **GitHub Pages settings** — custom domain `gloxx.ai` confirmed, Enforce HTTPS enabled.

## 5. Nice-to-have polish before announcing

- [ ] **Bust OG image caches (optional)** — the `.png`→`.jpg` filename change auto-invalidates CDN caches for any previously-scraped preview, so crawlers will fetch the new image on next visit. If you want faster propagation, paste `https://gloxx.ai` into [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) and [X Card Validator](https://cards-dev.twitter.com/validator).
- [ ] **Add analytics snippet** — skipped for now. Revisit post-launch; Plausible or Fathom recommended (no cookie banner needed).
- [x] **Archive decision** — keeping `/archive/` as-is (`noindex`, `Disallow`). Revisit in Q3 2026; delete entirely if the demos add no value by then.

## 6. Repo migrated to Gloxx GitHub org

Repo now lives at **`github.com/gloxxai/gloxx-web`** (was `brandonjensengit/gloxx`).

- [x] **Org created**: `gloxxai`. Matches the LinkedIn company slug.
- [x] **Repo transferred** via Settings → Transfer ownership — GitHub preserves commit history, Pages config, custom domain, HTTPS cert, and sets up permanent URL redirects from the old `brandonjensengit/gloxx` path.
- [x] **Code updates**: badge URL in `README.md`, footer dogfood link in all 6 HTMLs (`index, services, approach, about, contact, 404`), deployment note in `CLAUDE.md`, local git remote all point to `gloxxai/gloxx-web`.
- [x] **GoDaddy DNS**: `www` CNAME flipped from `brandonjensengit.github.io.` → `gloxxai.github.io.`.
- [x] **Verify on GitHub Pages settings**: custom domain + HTTPS confirmed post-transfer.
- [x] **Wire the home-footer GitHub link** — now points to `https://github.com/gloxxai/gloxx-web`.

## 7. Legal + business formation (pre-first-client)

These unblock signing the MSA template in the Gloxx vault's `Engagement Checklists/Templates/MSA.md`. A Retainer or Sentinel client will expect to see a real legal entity before signing — Audits and War Rooms can be SOW-only under a sole proprietorship, but the umbrella MSA needs an entity.

- [ ] **Choose entity type** — LLC is the default for a one-person consultancy. S-Corp election after ~$80k net profit is a common next step; worth a 30-min call with an accountant before signing the LLC.
- [ ] **Choose state of formation** — Delaware (classic, high filing fees, requires registered agent) vs. home-state LLC (cheaper, simpler, no dual-state tax filing). Default home-state unless a future investor explicitly wants Delaware.
- [ ] **File articles of organization** — file via state SOS website directly, skip LegalZoom. Filing fees: $50–$500 depending on state.
- [ ] **EIN from IRS** — free, 10 minutes online at irs.gov. Needed for bank account and client W-9s.
- [ ] **Operating agreement** — single-member LLC still needs one. Template via CorporateDirect or similar; review before signing.
- [ ] **Business bank account** — Mercury, Relay, or local credit union. Keep personal and business finances strictly separated (piercing-the-veil risk).
- [ ] **Professional liability insurance (E&O)** — $800–1,500/yr for a solo tech consultancy. Hiscox, Next Insurance, and Vouch quote online. Required by some clients; referenced in MSA Section 12.
- [ ] **General liability insurance** — bundled with E&O at most insurers.
- [ ] **Lawyer review of MSA + SOW templates** — $500–1,500 one-off. Don't ship to first Retainer client without this. Find a transactional attorney via your state bar's lawyer referral service.
- [ ] **Register "Gloxx" as DBA / fictitious business name** (if needed) — most states require DBA registration if your LLC's legal name differs from the brand name (e.g. "Jensen Consulting LLC" doing business as "Gloxx").
- [ ] **Domain registration under entity** — transfer `gloxx.ai` registration to the LLC once the entity exists (not urgent, but clean up within 90 days post-formation).

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
