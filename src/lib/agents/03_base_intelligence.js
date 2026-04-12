/**
 * Agent 03: Base Intelligence
 * Contains dataset-driven sub-agents:
 *   - bias_classifier: Maps sources to political lean
 *   - ownership_resolver: Maps sources to parent companies
 */

// Known bias ratings based on AllSides / Ad Fontes Media methodologies
const BIAS_DATABASE = {
  "reuters":                 { bias: "center",       score: 0,   reliability: 92 },
  "associated-press":        { bias: "center",       score: 0,   reliability: 90 },
  "bbc-news":                { bias: "center-left",  score: -12, reliability: 85 },
  "the-guardian":            { bias: "left",         score: -25, reliability: 78 },
  "the-new-york-times":      { bias: "center-left",  score: -15, reliability: 82 },
  "nyt":                     { bias: "center-left",  score: -15, reliability: 82 },
  "the-washington-post":     { bias: "center-left",  score: -14, reliability: 80 },
  "cnn":                     { bias: "left",         score: -22, reliability: 68 },
  "msnbc":                   { bias: "left",         score: -30, reliability: 62 },
  "fox-news":                { bias: "right",        score: 28,  reliability: 55 },
  "the-wall-street-journal": { bias: "center-right", score: 10,  reliability: 88 },
  "bloomberg":               { bias: "center",       score: -5,  reliability: 86 },
  "al-jazeera":              { bias: "center-left",  score: -18, reliability: 70 },
  "breitbart":               { bias: "right",        score: 35,  reliability: 40 },
  "the-daily-wire":          { bias: "right",        score: 30,  reliability: 48 },
  "huffpost":                { bias: "left",         score: -28, reliability: 58 },
  "npr":                     { bias: "center-left",  score: -10, reliability: 84 },
  "politico":                { bias: "center-left",  score: -8,  reliability: 83 },
  "abc-news":                { bias: "center-left",  score: -12, reliability: 76 },
  "cbs-news":                { bias: "center-left",  score: -10, reliability: 78 },
};

const OWNERSHIP_DATABASE = {
  "reuters":                 { owner: "Thomson Reuters", type: "publicly traded", country: "Canada/UK" },
  "associated-press":        { owner: "AP (Cooperative)", type: "non-profit cooperative", country: "USA" },
  "bbc-news":                { owner: "BBC (Public)", type: "public broadcaster", country: "UK" },
  "the-guardian":            { owner: "Scott Trust", type: "trust-owned", country: "UK" },
  "the-new-york-times":      { owner: "The New York Times Co.", type: "publicly traded", country: "USA" },
  "nyt":                     { owner: "The New York Times Co.", type: "publicly traded", country: "USA" },
  "the-washington-post":     { owner: "Nash Holdings (Jeff Bezos)", type: "privately held", country: "USA" },
  "cnn":                     { owner: "Warner Bros. Discovery", type: "publicly traded", country: "USA" },
  "msnbc":                   { owner: "NBCUniversal / Comcast", type: "publicly traded", country: "USA" },
  "fox-news":                { owner: "Fox Corporation (Murdoch)", type: "publicly traded", country: "USA" },
  "the-wall-street-journal": { owner: "News Corp (Murdoch)", type: "publicly traded", country: "USA" },
  "bloomberg":               { owner: "Bloomberg L.P. (Michael Bloomberg)", type: "privately held", country: "USA" },
  "al-jazeera":              { owner: "Al Jazeera Media Network", type: "state-funded", country: "Qatar" },
  "breitbart":               { owner: "Breitbart News Network", type: "privately held", country: "USA" },
  "huffpost":                { owner: "BuzzFeed, Inc.", type: "publicly traded", country: "USA" },
  "npr":                     { owner: "NPR (Public)", type: "non-profit", country: "USA" },
  "politico":                { owner: "Axel Springer SE", type: "privately held", country: "Germany/USA" },
};

export function classifyBias(articles) {
  return articles.map((article) => {
    const sourceId = article.source.id;
    const known = BIAS_DATABASE[sourceId];

    if (known) {
      return {
        ...article,
        historicalBias: known.bias,
        biasScore: known.score,
        reliability: known.reliability,
      };
    }

    // Heuristic fallback — unknown sources default to center
    return {
      ...article,
      historicalBias: "center",
      biasScore: 0,
      reliability: 60,
    };
  });
}

export function resolveOwnership(articles) {
  return articles.map((article) => {
    const sourceId = article.source.id;
    const known = OWNERSHIP_DATABASE[sourceId];

    return {
      ...article,
      ownership: known || {
        owner: article.source.name,
        type: "unknown",
        country: "Unknown",
      },
    };
  });
}
