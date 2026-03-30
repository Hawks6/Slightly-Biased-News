/**
 * Orchestrator API Route: /api/analyze
 *
 * Receives a search query and runs the 10-agent pipeline:
 *   Wave 1: News Fetcher
 *   Wave 2: Article Normalizer
 *   Wave 3: Bias Classifier + Ownership Resolver (parallel)
 *   Wave 4: AI Summarizer + Reality Scorer + Perspective Builder + Timeline Builder (parallel)
 *   Wave 5: Diff Highlighter (needs perspectives)
 *   Wave 6: Payload Builder
 */

import { fetchNews } from "@/lib/agents/01_news_fetcher";
import { normalizeArticles } from "@/lib/agents/02_article_normalizer";
import { classifyBias, resolveOwnership } from "@/lib/agents/03_base_intelligence";
import { summarizeArticles } from "@/lib/agents/04_ai_summarizer";
import {
  computeRealityScore,
  buildPerspectives,
  buildTimeline,
  highlightDiffs,
} from "@/lib/agents/05_derived_metrics";
import { buildPayload } from "@/lib/agents/10_payload_builder";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.trim().length === 0) {
    return Response.json(
      { error: "Missing required parameter: q (search query)" },
      { status: 400 }
    );
  }

  try {
    // === Wave 1: Fetch ===
    const { articles: rawArticles, source: fetchSource } = await fetchNews(query);

    // === Wave 2: Normalize ===
    const normalized = normalizeArticles(rawArticles);

    if (normalized.length === 0) {
      return Response.json(
        { error: "No valid articles found for this query." },
        { status: 404 }
      );
    }

    // === Wave 3: Classify Bias + Resolve Ownership (parallel) ===
    const biased = classifyBias(normalized);
    const enriched = resolveOwnership(biased);

    // === Wave 4: Summarize + Score + Perspectives + Timeline (parallel) ===
    const [summary, realityScore, perspectives, timeline] = await Promise.all([
      summarizeArticles(enriched, query),
      Promise.resolve(computeRealityScore(enriched)),
      Promise.resolve(buildPerspectives(enriched)),
      Promise.resolve(buildTimeline(enriched)),
    ]);

    // === Wave 5: Diff Highlighter ===
    const diffs = highlightDiffs(enriched, perspectives);

    // === Wave 6: Payload Builder ===
    const payload = buildPayload({
      query,
      articles: enriched,
      summary,
      realityScore,
      perspectives,
      timeline,
      diffs,
      fetchSource,
    });

    return Response.json(payload);
  } catch (error) {
    console.error("[Orchestrator] Pipeline error:", error);
    return Response.json(
      { error: "Analysis pipeline failed. Please try again." },
      { status: 500 }
    );
  }
}
