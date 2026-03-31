import { fetchNews } from "@/lib/agents/01_news_fetcher";
import { normalizeArticles } from "@/lib/agents/02_article_normalizer";

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
  const rawTopic = searchParams.get("topic") || searchParams.get("q"); // Support both
  // Prompt 1 says default page = 1
  const page = parseInt(searchParams.get("page") || "1", 10);

  if (!rawTopic || rawTopic.trim().length === 0) {
    return Response.json(
      { error: "bad_request", message: "Missing required parameter: topic" },
      { status: 400 }
    );
  }

  const query = TOPIC_MAP[rawTopic.toLowerCase()] || rawTopic;

  try {
    const { articles: rawArticles, source: fetchSource } = await fetchNews(query);
    
    if (!rawArticles || rawArticles.length === 0) {
      return Response.json(
        { error: "upstream_error", message: "No valid articles found for this query." },
        { status: 502 }
      );
    }

    const normalized = normalizeArticles(rawArticles);

    // Apply basic pagination from the memory list (Prompt says pageSize=9, handle it here if array)
    // Though fetchNews handles pagination mostly for 1 page right now.
    const startObj = (page - 1) * 9;
    const paginated = normalized.slice(startObj, startObj + 9);

    return Response.json({
      articles: paginated,
      totalResults: normalized.length,
      topic: rawTopic,
      fetchSource
    });
  } catch (error) {
    console.error("[News API Error]", error);
    return Response.json(
      { error: "upstream_error", message: "Error fetching news from sources." },
      { status: 502 }
    );
  }
}
