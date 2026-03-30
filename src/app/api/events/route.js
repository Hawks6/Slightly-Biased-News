import { fetchNews } from "@/lib/agents/01_news_fetcher";
import { normalizeArticles } from "@/lib/agents/02_article_normalizer";
import { clusterArticles } from "@/lib/agents/11_event_clusterer";

/**
 * GET /api/events?topic=<slug>
 * Fetches, normalizes, and clusters articles into news events.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get("topic") || searchParams.get("q") || "world";
  
  if (!topic || topic.trim().length === 0) {
    return Response.json(
      { error: "bad_request", message: "Missing required parameter: topic" },
      { status: 400 }
    );
  }

  try {
    // 1. Fetch raw news (limit to top 40 for clustering efficiency)
    const { articles: rawArticles, source: fetchSource } = await fetchNews(topic);
    
    if (!rawArticles || rawArticles.length === 0) {
      return Response.json(
        { events: [], message: "No articles found for this topic." },
        { status: 200 }
      );
    }

    // 2. Normalize 
    const normalized = normalizeArticles(rawArticles);

    // 3. Cluster into events (AI with Fallback)
    const events = await clusterArticles(normalized);

    return Response.json({
      topic,
      events,
      totalArticles: normalized.length,
      clusteredCount: events.reduce((sum, e) => sum + e.sourceCount, 0),
      fetchSource,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("[Events API Error]", error);
    return Response.json(
      { error: "upstream_error", message: "Failed to cluster news events." },
      { status: 502 }
    );
  }
}
