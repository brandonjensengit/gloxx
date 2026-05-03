# Cloudflare Cutover Runbook

Goal: front `gloxx.ai` with Cloudflare so we can see which AI bots (GPTBot, ClaudeBot, PerplexityBot, etc.) crawl which pages and how often. Feeds the AI-Discovery panel of the public Visibility Report.

**Reversible:** yes — flipping nameservers back to GoDaddy unwinds it in <10 min.
**Estimated time:** 30–45 min, of which ~24h is DNS propagation (you don't have to babysit).
**Risk:** low. GitHub Pages stays the origin; we only put Cloudflare in front of it.

---

## Pre-flight check

Confirm current DNS state:

```bash
dig gloxx.ai +short
dig www.gloxx.ai +short
dig gloxx.ai NS +short
```

Expect 4 GitHub Pages apex IPs (`185.199.108.153` / `109.153` / `110.153` / `111.153`), `www` → `gloxxai.github.io.`, and 2 GoDaddy nameservers (typically `ns*.domaincontrol.com`).

---

## Step 1 — Create Cloudflare account + add the site

1. Sign up or log in at https://dash.cloudflare.com.
2. **Add a Site** → enter `gloxx.ai` → choose **Free** plan.
3. Cloudflare auto-imports your existing DNS records from GoDaddy. **Verify** the imported records match:
   - 4 `A @` records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - 1 `CNAME www` → `gloxxai.github.io`
   - any TXT/MX/SPF you have for email
4. **Set every record to "Proxied" (orange cloud)** for `@` and `www`. Leave email-related records (MX, TXT/SPF, DKIM) **DNS-only (grey cloud)** — proxying email records breaks mail delivery.
5. Cloudflare will display two assigned nameservers, e.g. `nina.ns.cloudflare.com` + `kurt.ns.cloudflare.com`. Copy them.

## Step 2 — Update GoDaddy nameservers

1. Log into GoDaddy → Domain Portfolio → `gloxx.ai` → DNS → Nameservers → **Change**.
2. Choose **Custom** → paste the two Cloudflare nameservers from step 1.5 → Save.
3. Propagation typically takes 1–4 hours. Up to 24h worst case. Cloudflare emails you when it goes active.

## Step 3 — While waiting: configure Cloudflare

In the Cloudflare dashboard for `gloxx.ai`:

1. **SSL/TLS → Overview** → set encryption mode to **Full**. (GitHub Pages serves HTTPS, so we want end-to-end encryption.)
2. **SSL/TLS → Edge Certificates** → enable **Always Use HTTPS**, **Automatic HTTPS Rewrites**, and **Minimum TLS 1.2**.
3. **Speed → Optimization** → enable **Auto Minify** for HTML/CSS/JS only if you want it. (Optional. Our files are already small; defer.)
4. **Caching → Configuration** → leave default. Static-site cache hits are already strong.
5. **Security → Bots** → confirm **Bot Fight Mode** is **OFF** (default). It's tempting but it would block legitimate AI crawlers we explicitly want.
6. **Analytics → Web Analytics** → enable. Free, privacy-friendly, gives us page-view + referral data alongside the bot data.
7. **Analytics → Security → Bots** is where the AI-bot traffic shows up after activation. We can filter by user agent (GPTBot, ClaudeBot, PerplexityBot, etc.).

## Step 4 — Verify after propagation

When Cloudflare emails "active":

```bash
dig gloxx.ai NS +short            # should show *.ns.cloudflare.com
dig gloxx.ai +short               # should show Cloudflare-issued IPs (104.21.* / 172.67.*), not GitHub
curl -sI https://gloxx.ai/ | head -8   # response should include `server: cloudflare` and `cf-ray:` header
```

Hit the site in a browser. It should load identically. If it doesn't:
- 522 / 526 errors → SSL mismatch. Re-check **SSL/TLS** mode is **Full** (not Strict), then wait 5 min.
- Roll back: GoDaddy → Nameservers → switch back to GoDaddy default. Propagates same as forward direction.

## Step 5 — Wire up Bot Analytics export

Free tier shows aggregate bot data in the dashboard but does not push raw logs. Two paths:

- **Manual weekly check (free, immediate):** every Monday, screenshot the **Analytics → Security → Bots** view filtered to AI user agents. Drop the screenshot into the Visibility Report changelog.
- **Logpush to R2 (paid, ~$5/mo):** Workers Logs / Logpush requires Pro or higher OR a small Workers paid plan. Not worth it until the manual approach hits a friction point.

For now: stick with manual. Enough signal to validate the pipeline; we can upgrade once we know the data is useful.

---

## Acceptance

- [ ] `dig gloxx.ai NS +short` returns Cloudflare nameservers.
- [ ] `curl -sI https://gloxx.ai/` shows `cf-ray:` header.
- [ ] Site loads in browser, HTTPS valid.
- [ ] **Cloudflare Analytics → Security → Bots** shows traffic within 24h. (May take longer if our crawl rate is low — give it a week.)
- [ ] First manual screenshot in Visibility Report changelog within 7 days of cutover.

---

## Why this matters for GEO

- We currently can't see which AI bots discover gloxx.ai. We're flying blind on the supply side of the citation funnel.
- Cloudflare segments AI bots out of the box (their bot classifier is updated faster than our hand-rolled regex would be).
- The Visibility Report dashboard's **AI Discovery** panel reads from this data.
- It also unlocks page-level rate-limiting later, if a single bot starts hammering us.

Cloudflare is the cheapest, most reversible piece of the GEO measurement stack. Worth doing first.
