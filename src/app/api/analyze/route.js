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
import { classifyArticles } from "@/lib/agents/14_combined_classifier";
import { buildPayload } from "@/lib/agents/10_payload_builder";
import { CACHE_KEYS, CACHE_TTL, cacheGet, cacheSet } from "@/lib/redis";

/**
 * Shared pipeline execution logic.
 */
async function runPipeline(articles, query, fetchSource) {
  const normalized = normalizeArticles(articles);

  if (normalized.length === 0) {
    throw new Error("no_valid_articles");
  }

  const biased = classifyBias(normalized);
  const enriched = resolveOwnership(biased);
  
  const [summary, realityScore, perspectives, timeline, classifiedArticles] = await Promise.all([
    summarizeArticles(enriched, query),
    Promise.resolve(computeRealityScore(enriched)),
    Promise.resolve(buildPerspectives(enriched)),
    Promise.resolve(buildTimeline(enriched)),
    classifyArticles(enriched), // Single Groq call for framing + valence
  ]);

  const fullyEnriched = classifiedArticles;

  const diffs = highlightDiffs(fullyEnriched, perspectives);

  return buildPayload({
    query,
    articles: fullyEnriched,
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

  const cacheKey = CACHE_KEYS.analyze(query);
  const cached = await cacheGet(cacheKey);
  if (cached) {
    return Response.json({ ...cached, cached: true });
  }

  try {
    const { articles: rawArticles, source: fetchSource } = await fetchNews(query);
    const payload = await runPipeline(rawArticles, query, fetchSource);
    
    await cacheSet(cacheKey, payload, CACHE_TTL.SUMMARY);
    return Response.json({ ...payload, cached: false });
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

    const cacheKey = CACHE_KEYS.analyze(query);
    const cached = await cacheGet(cacheKey);
    if (cached) {
      return Response.json({ ...cached, cached: true });
    }

    const articlesToProcess = articles.slice(0, 20);
    const payload = await runPipeline(articlesToProcess, query, "provided_payload");
    
    await cacheSet(cacheKey, payload, CACHE_TTL.SUMMARY);
    return Response.json({ ...payload, cached: false });

  } catch (error) {
    if (error.message === "no_valid_articles") {
      return Response.json({ error: "No valid articles found in payload." }, { status: 404 });
    }
    console.error("[Orchestrator POST] Pipeline error:", error);
    return Response.json({ error: "Analysis pipeline failed." }, { status: 500 });
  }
}
