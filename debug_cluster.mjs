import { fetchNews } from "./src/lib/agents/01_news_fetcher.js";
import { normalizeArticles } from "./src/lib/agents/02_article_normalizer.js";
import { clusterArticles } from "./src/lib/agents/11_event_clusterer.js";

async function debug() {
  console.log("--- DEBUG CLUSTERING ---");
  const topic = "politics";
  try {
    const { articles } = await fetchNews(topic);
    if (!articles || articles.length === 0) return;
    
    const normalized = normalizeArticles(articles);
    console.log(`Normalized articles: ${normalized.length}`);
    
    const events = await clusterArticles(normalized);
    console.log(`Events returned: ${events.length}`);
    
    events.forEach((ev, i) => {
      console.log(`[${i}] Title: ${ev.title} | Sources: ${ev.sourceCount}`);
    });
    
  } catch (e) {
    console.error("Clustering failed:", e);
  }
}

debug();
