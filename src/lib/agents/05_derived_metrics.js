/**
 * Agent 05: Derived Metrics
 * Computes:
 *  - Reality Scorer (credibility composite)
 *  - Perspective Builder (left/center/right grouping)
 *  - Timeline Builder (chronological ordering)
 *  - Diff Highlighter (contradiction detection)
 */

/**
 * Reality Scorer: Composite credibility score based on
 * source reliability, cross-referencing, and content analysis.
 */
export function computeRealityScore(articles) {
  if (articles.length === 0) return { overall: 50, breakdown: {} };

  // Factor 1: Average source reliability
  const avgReliability =
    articles.reduce((sum, a) => sum + (a.reliability || 60), 0) / articles.length;

  // Factor 2: Source diversity (more diverse = more credible topic)
  const uniqueSources = new Set(articles.map((a) => a.source.id)).size;
  const diversityScore = Math.min(100, uniqueSources * 15);

  // Factor 3: Cross-reference agreement (do headlines agree?)
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

function cleanText(html) {
  if (!html) return "";
  let text = String(html).replace(/<[^>]*>?/gm, " ");
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&[a-zA-Z]+;/g, " ");
  return text.replace(/\s\s+/g, " ").trim();
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

  // Loaded language detection (opinionated/emotional words)
  const LOADED_WORDS = [
    "slammed", "blasted", "destroyed", "outraged", "shocking",
    "radical", "extremist", "crisis", "disaster", "unprecedented",
    "controversial", "propaganda", "scheme", "agenda", "regime",
    "crushed", "soaring", "plummeting", "bombshell", "explosive",
    "struggling", "suffering", "thriving", "booming", "collapsing",
    "pressures", "attacks", "defends", "warns", "fears",
  ];

  articles.forEach((article) => {
    const content = (article.title + " " + (article.content || "")).toLowerCase();
    const found = LOADED_WORDS.filter((word) => content.includes(word));

    if (found.length > 0) {
      loadedLanguage.push({
        articleId: article.id,
        source: article.source.name,
        bias: article.bias,
        words: found,
        intensity: Math.min(10, found.length * 2),
      });
    }
  });

  // Contradiction detection between left and right perspectives
  const leftArticles = articles.filter((a) => a.bias === "left" || a.bias === "center-left");
  const rightArticles = articles.filter((a) => a.bias === "right" || a.bias === "center-right");

  // Look for antonym pairs in framing
  const FRAMING_PAIRS = [
    { positive: ["rally", "surge", "growth", "recover", "gain"], negative: ["decline", "drop", "weakness", "loss", "fall"] },
    { positive: ["boost", "uplift", "benefit", "improve"], negative: ["hurt", "damage", "harm", "worsen"] },
    { positive: ["cautious", "measured", "careful"], negative: ["aggressive", "reckless", "hasty"] },
    { positive: ["confidence", "optimism", "hope"], negative: ["fear", "concern", "worry", "anxiety"] },
  ];

  leftArticles.forEach((leftArt) => {
    rightArticles.forEach((rightArt) => {
      const leftContent = (leftArt.title + " " + (leftArt.content || "")).toLowerCase();
      const rightContent = (rightArt.title + " " + (rightArt.content || "")).toLowerCase();

      FRAMING_PAIRS.forEach((pair) => {
        const leftHasPositive = pair.positive.some((w) => leftContent.includes(w));
        const rightHasNegative = pair.negative.some((w) => rightContent.includes(w));
        const leftHasNegative = pair.negative.some((w) => leftContent.includes(w));
        const rightHasPositive = pair.positive.some((w) => rightContent.includes(w));

        if ((leftHasPositive && rightHasNegative) || (leftHasNegative && rightHasPositive)) {
          const leftWord = pair.positive.find((w) => leftContent.includes(w)) || pair.negative.find((w) => leftContent.includes(w));
          const rightWord = pair.negative.find((w) => rightContent.includes(w)) || pair.positive.find((w) => rightContent.includes(w));

          contradictions.push({
            type: "framing_contrast",
            left: { source: leftArt.source.name, articleId: leftArt.id, keyword: leftWord },
            right: { source: rightArt.source.name, articleId: rightArt.id, keyword: rightWord },
            description: `"${leftArt.source.name}" uses "${leftWord}" while "${rightArt.source.name}" uses "${rightWord}" to describe the same events.`,
          });
        }
      });
    });
  });

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
