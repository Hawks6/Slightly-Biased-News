import { fetchNews } from "./src/lib/agents/01_news_fetcher.js";
import { normalizeArticles } from "./src/lib/agents/02_article_normalizer.js";

const stopWords = new Set(["this", "that", "with", "from", "their", "about", "would", "which", "news", "reporting", "latest"]);
const tokenize = (text) => {
  return new Set(
    text.toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(w => w.length >= 3 && !stopWords.has(w))
  );
};

async function test_keywords() {
  const topic = "politics";
  const { articles } = await fetchNews(topic);
  const normalized = normalizeArticles(articles);
  
  const articleDocs = normalized.map(a => ({
    id: a.id,
    title: a.title,
    tokens: tokenize(a.title)
  }));

  console.log("--- Token Analysis ---");
  for (let i = 0; i < 5; i++) {
    console.log(`[${i}] ${articleDocs[i].title} => [${Array.from(articleDocs[i].tokens).join(", ")}]`);
  }

  console.log("--- Pairwise Similarity ---");
  for (let i = 0; i < 10; i++) {
    for (let j = i + 1; j < 10; j++) {
      const intersection = [...articleDocs[i].tokens].filter(x => articleDocs[j].tokens.has(x));
      const union = new Set([...articleDocs[i].tokens, ...articleDocs[j].tokens]);
      const similarity = intersection.length / union.size;
      
      if (similarity > 0) {
        console.log(`Sim( ${i}, ${j} ) = ${similarity.toFixed(2)} | Overlap: ${intersection.join(", ")}`);
      }
    }
  }
}

test_keywords();
