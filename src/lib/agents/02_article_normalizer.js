/**
 * Agent 02: Article Normalizer
 * Cleans, trims, enforces field constraints, and standardizes article objects.
 */

function truncate(str, maxLen) {
  if (!str) return "";
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1).trimEnd() + "…";
}

function estimateReadTime(content) {
  if (!content) return 1;
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function classifyLength(content) {
  if (!content) return "short";
  const words = content.split(/\s+/).length;
  if (words > 600) return "long";
  if (words > 250) return "medium";
  return "short";
}

const SOURCE_NAME_MAP = {
  "bbc-news": "BBC News",
  "cnn": "CNN",
  "fox-news": "Fox News",
  "reuters": "Reuters",
  "the-wall-street-journal": "The Wall Street Journal",
  "al-jazeera": "Al Jazeera",
  "nyt": "The New York Times",
  "msnbc": "MSNBC",
  "the-guardian": "The Guardian",
  "associated-press": "Associated Press",
  "bloomberg": "Bloomberg",
  "the-washington-post": "The Washington Post",
};

export function normalizeArticles(rawArticles) {
  return rawArticles
    .filter((a) => a.title && a.title !== "[Removed]")
    .map((article, index) => {
      const sourceName =
        SOURCE_NAME_MAP[article.source?.id] ||
        article.source?.name ||
        "Unknown Source";

      return {
        id: `article-${index}-${Date.now()}`,
        title: truncate(article.title, 200),
        description: truncate(article.description || article.content || "", 180),
        content: article.content || article.description || "",
        url: article.url || "#",
        imageUrl: article.urlToImage || null,
        publishedAt: article.publishedAt || new Date().toISOString(),
        author: article.author || sourceName,
        source: {
          id: article.source?.id || sourceName.toLowerCase().replace(/\s+/g, "-"),
          name: sourceName,
        },
        readTime: estimateReadTime(article.content),
        contentLength: classifyLength(article.content),
      };
    });
}
