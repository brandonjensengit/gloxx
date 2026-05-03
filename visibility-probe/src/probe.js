// Gloxx Visibility Probe — main runner.
//
// Reads prompts.yml, invokes one or more answer engines for each
// (prompt × engine) pair, runs extraction, writes the week's JSON.
//
// Usage:
//   node src/probe.js              # full run, requires API keys
//   node src/probe.js --dry-run    # mock engines, no API calls
//
// Output: data/YYYY-WW.json

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { extractFindings } from './extract.js';
import * as mockEngine from './engines/mock.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has('--dry-run');

main().catch((err) => {
  console.error('[probe] fatal:', err);
  process.exit(1);
});

async function main() {
  const promptsPath = resolve(ROOT, 'prompts.yml');
  const config = parseYaml(readFileSync(promptsPath, 'utf8'));

  console.log(`[probe] config v${config.version} dated ${config.date}`);
  console.log(`[probe] mode: ${DRY_RUN ? 'DRY-RUN (mock engines)' : 'live API calls'}`);

  const engines = await loadEngines(config.engines, DRY_RUN);
  console.log(`[probe] engines loaded: ${engines.map((e) => e.id).join(', ')}`);

  const allPrompts = config.clusters.flatMap((c) =>
    c.prompts.map((p) => ({ ...p, clusterId: c.id, clusterName: c.name }))
  );
  console.log(`[probe] prompts: ${allPrompts.length}`);

  const runStart = new Date().toISOString();
  const results = [];

  for (const engine of engines) {
    for (const prompt of allPrompts) {
      const t0 = Date.now();
      let result;
      try {
        const { responseText, citationUrls, raw } = await engine.call({ prompt: prompt.text });
        const findings = extractFindings(responseText, citationUrls);
        result = {
          engine: engine.id,
          model: engine.model,
          clusterId: prompt.clusterId,
          promptId: prompt.id,
          promptText: prompt.text,
          mentioned: findings.mentioned,
          cited: findings.cited,
          sentiment: findings.sentiment,
          competitors: findings.competitors,
          gloxxUrls: findings.gloxxUrls,
          responseText,
          citationUrls,
          latencyMs: Date.now() - t0,
          error: null,
          raw,
        };
      } catch (err) {
        result = {
          engine: engine.id,
          model: engine.model,
          clusterId: prompt.clusterId,
          promptId: prompt.id,
          promptText: prompt.text,
          mentioned: false,
          cited: false,
          sentiment: 'absent',
          competitors: [],
          gloxxUrls: [],
          responseText: null,
          citationUrls: [],
          latencyMs: Date.now() - t0,
          error: String(err.message || err),
          raw: null,
        };
      }
      results.push(result);
      const flag = result.mentioned ? '✓' : '·';
      const c = result.cited ? '★' : ' ';
      process.stdout.write(`[probe] ${engine.id.padEnd(11)} ${prompt.clusterId}${prompt.id.padEnd(3)} ${flag}${c} ${result.error ? 'ERR' : `${result.latencyMs}ms`}\n`);
    }
  }

  const week = isoWeek(new Date());
  const out = {
    schema: 'gloxx-visibility-probe-v1',
    version: config.version,
    runStartUtc: runStart,
    runEndUtc: new Date().toISOString(),
    isoWeek: week,
    dryRun: DRY_RUN,
    promptCount: allPrompts.length,
    engineCount: engines.length,
    results,
  };

  const dataDir = resolve(ROOT, 'data');
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
  const outPath = resolve(dataDir, `${week}${DRY_RUN ? '-dry' : ''}.json`);
  writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(`\n[probe] wrote ${outPath}`);

  // Summary
  const byEngine = {};
  for (const r of results) {
    if (!byEngine[r.engine]) byEngine[r.engine] = { total: 0, mentioned: 0, cited: 0 };
    byEngine[r.engine].total++;
    if (r.mentioned) byEngine[r.engine].mentioned++;
    if (r.cited) byEngine[r.engine].cited++;
  }
  console.log('\n[probe] summary');
  for (const [eng, s] of Object.entries(byEngine)) {
    const visPct = ((s.mentioned / s.total) * 100).toFixed(1);
    const citePct = ((s.cited / s.total) * 100).toFixed(1);
    console.log(`  ${eng.padEnd(11)} visibility ${visPct}% (${s.mentioned}/${s.total})  citation ${citePct}%`);
  }
}

async function loadEngines(engineConfigs, dryRun) {
  const out = [];
  for (const cfg of engineConfigs) {
    if (dryRun) {
      out.push({ id: cfg.id, model: 'mock', call: mockEngine.call });
      continue;
    }
    // Real engine adapters land in src/engines/<id>.js. Until they
    // ship, fall back to the mock so the orchestration is testable.
    const adapterPath = resolve(__dirname, 'engines', `${cfg.id}.js`);
    if (!existsSync(adapterPath)) {
      console.warn(`[probe] no adapter for ${cfg.id} (expected ${adapterPath}); using mock`);
      out.push({ id: cfg.id, model: 'mock', call: mockEngine.call });
      continue;
    }
    const adapter = await import(adapterPath);
    out.push({ id: cfg.id, model: cfg.model, call: adapter.call });
  }
  return out;
}

function isoWeek(date) {
  // ISO 8601 week: YYYY-Www
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNum = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}
