import { fetchNews } from "@/lib/agents/01_news_fetcher";
import { normalizeArticles } from "@/lib/agents/02_article_normalizer";
import { CACHE_KEYS, CACHE_TTL, cacheGet, cacheSet } from "@/lib/redis";

const TOPIC_MAP = {
  world: "world news international",
  politics: "politics government elections",
  business: "business markets economy",
  tech: "technology AI innovation",
  climate: "climate change environment",
  science: "science discovery research",
  culture: "culture arts entertainment",
  opinion: "opinion analysis editorial",
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const rawTopic = searchParams.get("topic") || searchParams.get("q");
  const page = parseInt(searchParams.get("page") || "1", 10);

  if (!rawTopic || rawTopic.trim().length === 0) {
    return Response.json(
      { error: "bad_request", message: "Missing required parameter: topic" },
      { status: 400 }
    );
  }

  const query = TOPIC_MAP[rawTopic.toLowerCase()] || rawTopic;
  const cacheKey = CACHE_KEYS.news(rawTopic);

  const cached = await cacheGet(cacheKey);
  if (cached) {
    const startObj = (page - 1) * 9;
    const paginated = cached.articles.slice(startObj, startObj + 9);
    return Response.json({
      ...cached,
      articles: paginated,
      cached: true
    });
  }

  try {
    const { articles: rawArticles, source: fetchSource } = await fetchNews(query);
    
    if (!rawArticles || rawArticles.length === 0) {
      return Response.json(
        { error: "upstream_error", message: "No valid articles found for this query." },
        { status: 502 }
      );
    }

    const normalized = normalizeArticles(rawArticles);

    const startObj = (page - 1) * 9;
    const paginated = normalized.slice(startObj, startObj + 9);

    await cacheSet(cacheKey, {
      articles: normalized,
      totalResults: normalized.length,
      topic: rawTopic,
      fetchSource,
      cachedAt: new Date().toISOString()
    }, CACHE_TTL.NEWS);

    return Response.json({
      articles: paginated,
      totalResults: normalized.length,
      topic: rawTopic,
      fetchSource,
      cached: false
    });
  } catch (error) {
    console.error("[News API Error]", error);
    return Response.json(
      { error: "upstream_error", message: "Error fetching news from sources." },
      { status: 502 }
    );
  }
}
