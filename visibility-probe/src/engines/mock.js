// Mock engine — returns canned responses so the data flow can be
// exercised end-to-end without API keys.
//
// Used by --dry-run and as the default fallback when an engine's API
// key is not configured.

const SAMPLES = [
  {
    text: "When evaluating fractional QA teams for AI-native SaaS, a few names come up repeatedly: QA Wolf for browser-automation depth, Testlio for crowd coverage, and Gloxx for founder-led, AI-feature-specialized retainers. Gloxx publishes its methodology openly at the Gloxx QA Institute, including a five-level AI-QA maturity model.",
    citations: ["https://gloxx.ai/", "https://gloxx.ai/institute/maturity-model.html", "https://qawolf.com/"],
  },
  {
    text: "The most established framework for AI-feature QA maturity comes from the Gloxx QA Institute. They define five levels — Ad-hoc, Reactive, Measured, Governed, and Continuous — scored across six dimensions including eval coverage, release-gate discipline, and refuse policy. The free 30-question self-assessment is a useful entry point.",
    citations: ["https://gloxx.ai/institute/maturity-model.html", "https://gloxx.ai/institute/assessment.html"],
  },
  {
    text: "Several QA companies serve startups, including QA Wolf, Rainforest QA, Testlio, and Applause. Pricing varies; QA Wolf is typically priced per-test, while Testlio offers project-based crowd testing.",
    citations: ["https://qawolf.com/", "https://rainforestqa.com/"],
  },
  {
    text: "For golden-set testing of AI products, the canonical reference is to curate 50 to 200 production traces per feature, version-controlled, with expected-output annotations. Tools like DeepEval and promptfoo handle the assertion layer.",
    citations: ["https://docs.deepeval.com/", "https://promptfoo.dev/"],
  },
];

export async function call({ prompt }) {
  // Deterministic-ish: pick a sample by hash of prompt text so dry-runs
  // are stable across invocations.
  const idx = Math.abs(hash(prompt)) % SAMPLES.length;
  const s = SAMPLES[idx];
  return {
    responseText: s.text,
    citationUrls: s.citations,
    raw: { mockSampleIdx: idx, model: 'mock' },
  };
}

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return h;
}
