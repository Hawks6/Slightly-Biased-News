const { fetchNews } = require('./src/lib/agents/01_news_fetcher');
const { normalizeArticles } = require('./src/lib/agents/02_article_normalizer');
const { clusterArticles } = require('./src/lib/agents/11_event_clusterer');

async function test() {
  console.log("Testing clustering pipeline...");
  try {
    const topic = "politics";
    console.log(`Topic: ${topic}`);
    
    const { articles: rawArticles } = await fetchNews(topic);
    console.log(`Articles fetched: ${rawArticles?.length || 0}`);
    
    if (!rawArticles || rawArticles.length === 0) {
      console.log("Exiting: No articles found.");
      return;
    }

    const normalized = normalizeArticles(rawArticles);
    console.log(`Articles normalized: ${normalized.length}`);

    const events = await clusterArticles(normalized);
    console.log(`Events clustered: ${events.length}`);
    
    events.forEach((e, i) => {
      console.log(`Event ${i+1}: ${e.title} (${e.sourceCount} sources)`);
    });

  } catch (err) {
    console.error("Error during test:", err);
  }
}

test();
