/**
 * Agent 10: Payload Builder
 * Stitches all agent outputs together into the strict UI_PAYLOAD_SCHEMA.
 */

export function buildPayload({
  query,
  articles,
  summary,
  realityScore,
  perspectives,
  timeline,
  diffs,
  fetchSource,
}) {
  // Compute bias distribution for the chart
  const biasDistribution = {};
  articles.forEach((a) => {
    const bias = a.bias || "center";
    biasDistribution[bias] = (biasDistribution[bias] || 0) + 1;
  });

  const biasChartData = Object.entries(biasDistribution).map(([name, count]) => ({
    name: name.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    count,
    fullName: {
      "left": "Left",
      "center-left": "Center Left",
      "center": "Center",
      "center-right": "Center Right",
      "right": "Right",
    }[name] || name,
  }));

  // Sort bias chart data from left to right
  const biasOrder = ["left", "center-left", "center", "center-right", "right"];
  biasChartData.sort(
    (a, b) =>
      biasOrder.indexOf(a.name.toLowerCase().replace(" ", "-")) -
      biasOrder.indexOf(b.name.toLowerCase().replace(" ", "-"))
  );

  // Build source cards with all enriched data
  const sourceCards = articles.map((a) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    source: a.source.name,
    sourceId: a.source.id,
    author: a.author,
    url: a.url,
    imageUrl: a.imageUrl,
    publishedAt: a.publishedAt,
    readTime: a.readTime,
    contentLength: a.contentLength,
    bias: a.bias,
    historicalBias: a.historicalBias,
    detectedBias: a.detectedBias,
    biasScore: a.biasScore,
    reliability: a.reliability,
    ownership: a.ownership,
    framing: a.framing,
    valence: a.valence,
  }));

  // Compute framing distribution and primary frame
  const framingDistribution = {};
  articles.forEach((a) => {
    if (a.framing && a.framing.label !== "Neutral") {
      framingDistribution[a.framing.label] = (framingDistribution[a.framing.label] || 0) + 1;
    }
  });

  const sortedFrames = Object.entries(framingDistribution).sort((a, b) => b[1] - a[1]);
  const primaryFraming = sortedFrames.length > 0 ? sortedFrames[0][0] : "Neutral";

  // Compute coverage health metrics
  const totalSources = articles.length;
  const biasCategories = Object.keys(biasDistribution).length;
  const hasBothSides = biasDistribution["left"] || biasDistribution["center-left"]
    ? biasDistribution["right"] || biasDistribution["center-right"]
      ? true : false
    : false;

  const coverageHealth = {
    totalSources,
    biasCategories,
    hasBothSides,
    primaryFraming,
    diversityRating:
      biasCategories >= 4 ? "Excellent" :
      biasCategories >= 3 ? "Good" :
      biasCategories >= 2 ? "Fair" : "Poor",
    averageReliability: Math.round(
      articles.reduce((s, a) => s + (a.reliability || 60), 0) / Math.max(1, articles.length)
    ),
  };

  return {
    meta: {
      query,
      timestamp: new Date().toISOString(),
      fetchSource,
      articleCount: articles.length,
      processingAgents: [
        "news_fetcher",
        "article_normalizer",
        "bias_classifier",
        "ownership_resolver",
        "framing_detector",
        "valence_analyzer",
        "ai_summarizer",
        "reality_scorer",
        "perspective_builder",
        "timeline_builder",
        "diff_highlighter",
        "payload_builder",
      ],
    },
    summary,
    realityScore,
    biasChart: biasChartData,
    perspectives,
    timeline,
    diffs,
    sourceCards,
    coverageHealth,
  };
}
