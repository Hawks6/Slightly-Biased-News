import { fetchNews } from "./src/lib/agents/01_news_fetcher.js";
import { normalizeArticles } from "./src/lib/agents/02_article_normalizer.js";

async function debug() {
  console.log("--- DEBUG NEWS FETCH ---");
  const topic = "politics";
  try {
    const { articles, source } = await fetchNews(topic);
    console.log(`Source used: ${source}`);
    console.log(`Raw articles found: ${articles?.length || 0}`);
    
    if (articles && articles.length > 0) {
      console.log("First article title:", articles[0].title);
      const normalized = normalizeArticles(articles);
      console.log(`Normalized articles: ${normalized.length}`);
      
      // Look for overlapping titles for clustering test
      const titles = normalized.map(a => a.title);
      console.log("Sample titles:", titles.slice(0, 5));
    }
  } catch (e) {
    console.error("Fetch failed:", e);
  }
}

debug();
