import { fetchNews } from "./src/lib/agents/01_news_fetcher.js";
import { normalizeArticles } from "./src/lib/agents/02_article_normalizer.js";

async function debug() {
  const topic = "politics";
  const { articles } = await fetchNews(topic);
  const normalized = normalizeArticles(articles);
  
  console.log(`--- Sources for ${normalized.length} articles ---`);
  const sources = new Map();
  normalized.forEach(a => {
    sources.set(a.source.name, (sources.get(a.source.name) || 0) + 1);
  });
  console.log(Object.fromEntries(sources));
}

debug();
