/**
 * Agent 05: Derived Metrics
 * Computes:
 *  - Reality Scorer (credibility composite)
 *  - Perspective Builder (left/center/right grouping)
 *  - Timeline Builder (chronological ordering)
 *  - Diff Highlighter (contradiction detection)
 */

import { cleanText } from "@/lib/utils/text";

/**
 * Reality Scorer: Composite credibility score based on
 * source reliability, cross-referencing, and content analysis.
 */
export function computeRealityScore(articles) {
  if (articles.length === 0) return { overall: 50, breakdown: {} };

  const avgReliability =
    articles.reduce((sum, a) => sum + (a.reliability || 60), 0) / articles.length;

  const uniqueSources = new Set(articles.map((a) => a.source.id)).size;
  const diversityScore = Math.min(100, uniqueSources * 15);

  const titleWords = articles.map((a) =>
    new Set(a.title.toLowerCase().split(/\s+/).filter((w) => w.length > 4))
  );
  let agreementPairs = 0;
  let totalPairs = 0;
  for (let i = 0; i < titleWords.length; i++) {
    for (let j = i + 1; j < titleWords.length; j++) {
      totalPairs++;
      const intersection = [...titleWords[i]].filter((w) => titleWords[j].has(w));
      if (intersection.length >= 2) agreementPairs++;
    }
  }
  const agreementScore = totalPairs > 0 ? (agreementPairs / totalPairs) * 100 : 50;

  const overall = Math.round(
    avgReliability * 0.5 + diversityScore * 0.25 + agreementScore * 0.25
  );

  return {
    overall: Math.min(100, Math.max(0, overall)),
    breakdown: {
      sourceReliability: Math.round(avgReliability),
      sourceDiversity: Math.round(diversityScore),
      crossReferenceAgreement: Math.round(agreementScore),
    },
    label:
      overall >= 80 ? "High Confidence" :
      overall >= 60 ? "Moderate Confidence" :
      overall >= 40 ? "Mixed Signals" : "Low Confidence",
  };
}

/**
 * Perspective Builder: Groups articles into left/center/right perspectives
 * and extracts their core narratives.
 */
export function buildPerspectives(articles) {
  const groups = {
    left: [],
    center: [],
    right: [],
  };

  articles.forEach((a) => {
    const bias = a.bias || "center";
    if (bias === "left" || bias === "center-left") {
      groups.left.push(a);
    } else if (bias === "right" || bias === "center-right") {
      groups.right.push(a);
    } else {
      groups.center.push(a);
    }
  });

  const extractNarrative = (group, label) => {
    if (group.length === 0) {
      return { label, articles: [], narrative: "No coverage from this perspective.", themes: [] };
    }

    const themes = [];
    const contentWords = group
      .map((a) => cleanText(a.content || a.description || ""))
      .join(" ")
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 5 && !w.includes("http"));

    const wordFreq = {};
    contentWords.forEach((w) => {
      const clean = w.replace(/[^a-z]/g, "");
      if (clean.length > 5) wordFreq[clean] = (wordFreq[clean] || 0) + 1;
    });

    const sortedWords = Object.entries(wordFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);

    themes.push(...sortedWords);

    const narrative = group
      .slice(0, 2)
      .map((a) => {
        const textToProcess = cleanText(a.content || a.description || "");
        const sentences = textToProcess.split(/\.(?!\.)\s+/).filter(s => s.length > 40 && !s.includes("http"));
        
        let firstTwoSentences = "";
        if (sentences.length >= 2) {
          firstTwoSentences = sentences.slice(0, 2).map(s => s.trim()).join(". ");
        } else if (sentences.length === 1) {
          firstTwoSentences = sentences[0].trim();
        } else {
          firstTwoSentences = textToProcess.substring(0, 150).trim();
        }
        return firstTwoSentences + (firstTwoSentences.endsWith(".") ? "" : ".");
      })
      .join(" ");

    return {
      label,
      count: group.length,
      articles: group.map((a) => a.id),
      narrative: narrative.slice(0, 400),
      themes,
      sources: group.map((a) => a.source.name),
    };
  };

  return {
    left: extractNarrative(groups.left, "Left / Progressive"),
    center: extractNarrative(groups.center, "Center / Neutral"),
    right: extractNarrative(groups.right, "Right / Conservative"),
    balance: {
      left: groups.left.length,
      center: groups.center.length,
      right: groups.right.length,
      total: articles.length,
    },
  };
}

/**
 * Timeline Builder: Orders articles chronologically and identifies
 * publication patterns.
 */
export function buildTimeline(articles) {
  const sorted = [...articles].sort(
    (a, b) => new Date(a.publishedAt) - new Date(b.publishedAt)
  );

  const events = sorted.map((a, i) => {
    const date = new Date(a.publishedAt);
    const hoursAgo = Math.round((Date.now() - date.getTime()) / 3600000);

    return {
      id: a.id,
      position: i,
      source: a.source.name,
      title: a.title,
      bias: a.bias,
      publishedAt: a.publishedAt,
      hoursAgo,
      timeLabel: hoursAgo < 1 ? "Just now" : hoursAgo < 24 ? `${hoursAgo}h ago` : `${Math.round(hoursAgo / 24)}d ago`,
    };
  });

  // Detect which bias broke the story first
  const firstReporter = events[0];
  const biasOrder = events.map((e) => e.bias);

  return {
    events,
    firstReporter: firstReporter
      ? { source: firstReporter.source, bias: firstReporter.bias }
      : null,
    coverageSpanHours: events.length > 1
      ? Math.round(
          (new Date(events[events.length - 1].publishedAt) -
            new Date(events[0].publishedAt)) /
          3600000
        )
      : 0,
    biasPublicationOrder: biasOrder,
  };
}

/**
 * Diff Highlighter: Detects contradictions and loaded language across
 * articles from different bias perspectives.
 */
export function highlightDiffs(articles, perspectives) {
  const contradictions = [];
  const loadedLanguage = [];

  // Dynamic Charged language detection from Agent 13
  articles.forEach((article) => {
    if (article.valence?.chargedLanguage && article.valence.chargedLanguage.length > 0) {
      loadedLanguage.push({
        articleId: article.id,
        source: article.source.name,
        bias: article.bias,
        words: article.valence.chargedLanguage,
        intensity: article.valence.intensity || 5,
        tone: article.valence.toneLabel,
      });
    }
  });

  // Inclusive Contrast detection across all sources
  for (let i = 0; i < articles.length; i++) {
    for (let j = i + 1; j < articles.length; j++) {
      const a1 = articles[i];
      const a2 = articles[j];

      if (a1.framing?.label && a2.framing?.label && a1.framing.label !== a2.framing.label && a1.framing.label !== "Neutral" && a2.framing.label !== "Neutral") {
        // Only add if they are from different bias groups OR if their framing is fundamentally different
        const biasDiff = a1.bias !== a2.bias;
        
        contradictions.push({
          type: "narrative_contrast",
          left: { source: a1.source.name, articleId: a1.id, keyword: a1.framing.label, bias: a1.bias },
          right: { source: a2.source.name, articleId: a2.id, keyword: a2.framing.label, bias: a2.bias },
          biasDiff,
          description: `"${a1.source.name}" frames this as a ${a1.framing.label} issue, while "${a2.source.name}" focuses on ${a2.framing.label}.`,
        });
      }
    }
  }

  // Look for antonym pairs in framing (still useful for keyword level)
  const FRAMING_PAIRS = [
    { positive: ["rally", "surge", "growth", "recover", "gain"], negative: ["decline", "drop", "weakness", "loss", "fall"] },
    { positive: ["boost", "uplift", "benefit", "improve"], negative: ["hurt", "damage", "harm", "worsen"] },
    { positive: ["cautious", "measured", "careful"], negative: ["aggressive", "reckless", "hasty"] },
    { positive: ["confidence", "optimism", "hope"], negative: ["fear", "concern", "worry", "anxiety"] },
  ];

  for (let i = 0; i < articles.length; i++) {
    for (let j = i + 1; j < articles.length; j++) {
      const a1 = articles[i];
      const a2 = articles[j];
      const content1 = (a1.title + " " + (a1.description || "")).toLowerCase();
      const content2 = (a2.title + " " + (a2.description || "")).toLowerCase();

      FRAMING_PAIRS.forEach((pair) => {
        const hasPos1 = pair.positive.some((w) => content1.includes(w));
        const hasNeg2 = pair.negative.some((w) => content2.includes(w));
        const hasNeg1 = pair.negative.some((w) => content1.includes(w));
        const hasPos2 = pair.positive.some((w) => content2.includes(w));

        if ((hasPos1 && hasNeg2) || (hasNeg1 && hasPos2)) {
          const w1 = pair.positive.find((w) => content1.includes(w)) || pair.negative.find((w) => content1.includes(w));
          const w2 = pair.negative.find((w) => content2.includes(w)) || pair.positive.find((w) => content2.includes(w));

          contradictions.push({
            type: "framing_contrast",
            left: { source: a1.source.name, articleId: a1.id, keyword: w1 },
            right: { source: a2.source.name, articleId: a2.id, keyword: w2 },
            description: `"${a1.source.name}" uses "${w1}" while "${a2.source.name}" uses "${w2}" to describe the same events.`,
          });
        }
      });
    }
  }

  // De-duplicate contradictions
  const seen = new Set();
  const uniqueContradictions = contradictions.filter((c) => {
    const key = `${c.left.source}-${c.right.source}-${c.left.keyword}-${c.right.keyword}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return {
    contradictions: uniqueContradictions.slice(0, 6),
    loadedLanguage: loadedLanguage,
    overallFramingDivergence: uniqueContradictions.length > 4 ? "high" : uniqueContradictions.length > 1 ? "moderate" : "low",
  };
}
