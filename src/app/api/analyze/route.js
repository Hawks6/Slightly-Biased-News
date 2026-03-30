/**
 * Orchestrator API Route: /api/analyze
 *
 * Receives a search query (GET) or pre-fetched articles (POST) and runs the 10-agent pipeline.
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

/**
 * Shared pipeline execution logic.
 */
async function runPipeline(articles, query, fetchSource) {
  // === Wave 2: Normalize ===
  // Always run normalization to ensure readTime, contentLength and ID constraints.
  const normalized = normalizeArticles(articles);

  if (normalized.length === 0) {
    throw new Error("no_valid_articles");
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
  return buildPayload({
    query,
    articles: enriched,
    summary,
    realityScore,
    perspectives,
    timeline,
    diffs,
    fetchSource,
  });
}

/**
 * GET: Traditional search-based analysis.
 */
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
    const { articles: rawArticles, source: fetchSource } = await fetchNews(query);
    const payload = await runPipeline(rawArticles, query, fetchSource);
    return Response.json(payload);
  } catch (error) {
    if (error.message === "no_valid_articles") {
      return Response.json({ error: "No valid articles found." }, { status: 404 });
    }
    console.error("[Orchestrator GET] Pipeline error:", error);
    return Response.json({ error: "Analysis pipeline failed." }, { status: 500 });
  }
}

/**
 * POST: Event-based analysis using provided articles.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { articles, query } = body;

    if (!articles || !Array.isArray(articles) || articles.length === 0) {
      return Response.json({ error: "Missing or invalid 'articles' array." }, { status: 400 });
    }

    if (!query) {
      return Response.json({ error: "Missing 'query' (Event Title)." }, { status: 400 });
    }

    // Limit to top 20 for analysis performance
    const articlesToProcess = articles.slice(0, 20);
    const payload = await runPipeline(articlesToProcess, query, "provided_payload");
    return Response.json(payload);

  } catch (error) {
    if (error.message === "no_valid_articles") {
      return Response.json({ error: "No valid articles found in payload." }, { status: 404 });
    }
    console.error("[Orchestrator POST] Pipeline error:", error);
    return Response.json({ error: "Analysis pipeline failed." }, { status: 500 });
  }
}
