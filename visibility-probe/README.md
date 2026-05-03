# Gloxx Visibility Probe

The open-methodology measurement layer behind the Gloxx Visibility Report.

This probe runs a fixed prompt set against four answer engines (ChatGPT, Claude, Perplexity, Gemini), parses each response for Gloxx mentions and citations, and emits a JSON record. A weekly GitHub Action runs it Mondays 09:00 UTC and rebuilds the public dashboard at https://gloxx.ai/institute/reports/visibility/.

## Why this exists

Profound, AthenaHQ, Peec, and the rest of the AI-search-visibility category share one critique: **black-box scoring**. Customers can't see what prompts the vendor ran, how they curated them, what model temperature they used, or how the visibility number was aggregated.

Gloxx is a QA company. Black-box measurement is the whole class of thing we exist to fix. So we publish:

- The full prompt set ([`prompts.yml`](./prompts.yml)) — versioned, dated, CC-BY.
- The probe code ([`src/`](./src)) — MIT, no proprietary aggregation.
- The raw run output ([`data/YYYY-WW.json`](./data)) — every response, every citation, every week.
- The methodology page ([gloxx.ai/institute/reports/methodology.html](https://gloxx.ai/institute/reports/methodology.html)) — definitions, known limits, license.

You can fork this, run it against your own brand, audit our scores, or contribute prompts. The methodology is the artifact. The dashboard is just a render of the data.

## What gets measured

For each (prompt × engine) pair on each weekly run:

- **mentioned** (boolean) — does the response contain the substring `gloxx` (case-insensitive, word-boundary)?
- **cited** (boolean) — is `gloxx.ai` (or any subdomain) in the engine's source/citation list?
- **sentiment** (`positive | neutral | mention-only | absent`) — coarse classification of how Gloxx was referenced.
- **competitors** — any competitor name from a maintained list that appears in the same response.
- **response_text** — full text of the engine's response, archived.
- **citations** — full citation/source list returned by the engine.

Aggregations (computed at render time, never baked into raw data):

- **visibility rate** — % of prompts where Gloxx was mentioned, per engine, per week.
- **citation rate** — % of prompts where `gloxx.ai` was in citations.
- **per-cluster visibility** — same metrics scoped to each of the 8 prompt clusters.

## How to run locally

```bash
cd visibility-probe
npm install
cp .env.example .env  # fill in API keys
npm run probe         # runs full set against all 4 engines, ~5 min
npm run probe:dry     # dry-run with mock engines, ~2 sec, no API calls
```

Output: `data/YYYY-WW.json` (current ISO week).

## Required API keys

Stored as GitHub Action secrets in CI; in `.env` locally:

- `OPENAI_API_KEY` — for `gpt-4o-search-preview`
- `ANTHROPIC_API_KEY` — for `claude-sonnet-4-7` with web search
- `PERPLEXITY_API_KEY` — for `sonar-pro`
- `GOOGLE_GENAI_API_KEY` — for `gemini-2.5-pro-grounded`

The dry-run mode does not require keys.

## Schedule

Weekly via GitHub Action (`.github/workflows/visibility-probe.yml` — to be added in next iteration). Cron: `0 9 * * 1` UTC. The Action commits new `data/YYYY-WW.json` files and re-renders `institute/reports/visibility/index.html`.

## Project status

| Component | Status |
|-----------|--------|
| Prompt set v1 (56 prompts × 8 clusters) | ✅ shipped |
| Engine adapters (OpenAI, Anthropic, Perplexity, Gemini) | 🟡 stub — implementations land next |
| Mention + citation extraction | 🟡 stub |
| Sentiment classifier | 🟡 stub |
| Static dashboard renderer | 🟡 stub |
| GitHub Action weekly run | 🔴 not yet |
| Methodology page (institute/reports/methodology.html) | 🔴 not yet |
| First public report | 🔴 not yet |

## License

- Code: MIT
- Prompt set + methodology: CC-BY 4.0
- Raw data output: CC-BY 4.0

## Related

- [The plan](https://github.com/gloxxai/gloxx-web/blob/main/CLAUDE.md) — full GEO implementation plan
- [Maturity Model](https://gloxx.ai/institute/maturity-model.html) — the rubric every Gloxx engagement plans against
- [Profound research notes](https://github.com/gloxxai/gloxx-web/blob/main/docs/) — what we learned looking at the category leader
