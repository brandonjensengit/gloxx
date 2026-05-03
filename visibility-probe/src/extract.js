// Mention + citation + sentiment extraction.
// Pure functions, no I/O. Easy to unit-test.

const COMPETITORS = [
  'QA Wolf', 'Rainforest QA', 'Testlio', 'Applause',
  'Global App Testing', 'MuukTest', 'Digivante', 'uTest',
  'TestDevLab', 'Abstracta', 'XBOSoft', 'Cigniti',
  'Qualitest', 'Tricentis', 'Mabl', 'Functionize',
  'Testim', 'BrowserStack', 'LambdaTest', 'Applitools',
];

const POSITIVE_SIGNALS = [
  /\b(recommend|recommended|standout|best|leading|excellent|preferred|top choice)\b/i,
  /\b(notably|specifically|particularly|especially)[\s\S]{0,40}gloxx\b/i,
];

const NEGATIVE_SIGNALS = [
  /\b(avoid|avoid using|skip|do not use|not recommended)\b[\s\S]{0,40}gloxx\b/i,
  /\bgloxx\b[\s\S]{0,40}\b(unreliable|expensive|limited|risky)\b/i,
];

// Word-boundary case-insensitive match for "gloxx".
const GLOXX_RE = /\bgloxx\b/i;

// gloxx.ai or any subdomain.
const GLOXX_URL_RE = /(?:^|[^a-z0-9])((?:[a-z0-9-]+\.)*gloxx\.ai)(?:[\/?#]|$|[^a-z0-9.-])/i;

/**
 * Extract structured findings from one engine response.
 * @param {string} responseText
 * @param {string[]} citationUrls
 * @returns {{ mentioned: boolean, cited: boolean, sentiment: string, competitors: string[], gloxxUrls: string[] }}
 */
export function extractFindings(responseText, citationUrls = []) {
  const text = String(responseText || '');
  const mentioned = GLOXX_RE.test(text);

  const gloxxUrls = [];
  for (const url of citationUrls) {
    const m = String(url).match(GLOXX_URL_RE);
    if (m) gloxxUrls.push(m[1].toLowerCase());
  }
  // Also scan response body for inline gloxx.ai URLs even if not in
  // a structured citation list.
  const inlineMatches = text.matchAll(new RegExp(GLOXX_URL_RE.source, 'gi'));
  for (const m of inlineMatches) gloxxUrls.push(m[1].toLowerCase());
  const cited = gloxxUrls.length > 0;

  const competitors = [];
  for (const c of COMPETITORS) {
    const re = new RegExp('\\b' + c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
    if (re.test(text)) competitors.push(c);
  }

  let sentiment = 'absent';
  if (mentioned) {
    sentiment = 'mention-only';
    if (POSITIVE_SIGNALS.some((re) => re.test(text))) sentiment = 'positive';
    if (NEGATIVE_SIGNALS.some((re) => re.test(text))) sentiment = 'negative';
    if (sentiment === 'mention-only' && /\bgloxx\b/i.test(text) && text.length > 200) {
      sentiment = 'neutral';
    }
  }

  return {
    mentioned,
    cited,
    sentiment,
    competitors,
    gloxxUrls: [...new Set(gloxxUrls)],
  };
}

export const _internals = { COMPETITORS, GLOXX_RE, GLOXX_URL_RE };
