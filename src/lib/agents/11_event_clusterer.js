import Groq from "groq-sdk";
import { z } from "zod";

/**
 * Agent 11: Event Clusterer
 * Groups articles into news events using Groq AI with a keyword-based fallback.
 */

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY || "dummy_key_avoid_init_error" 
});

const EventClusterSchema = z.object({
  events: z.array(z.object({
    title: z.string().describe("Synthesized neutral headline for the cluster"),
    articleIds: z.array(z.string()).describe("List of exact IDs from the input list")
  }))
});

/**
 * Main orchestrator for article clustering.
 */
export async function clusterArticles(articles) {
  if (!articles || articles.length === 0) return [];

  // 1. Try Groq AI Clustering
  if (process.env.GROQ_API_KEY) {
    try {
      const clusters = await clusterWithGroq(articles);
      if (clusters && clusters.length > 0) {
        return filterAndSynthesize(clusters, articles);
      }
    } catch (error) {
      console.warn("[Event Clusterer] Groq failed, falling back to keywords:", error.message);
    }
  } else {
    console.warn("[Event Clusterer] Missing GROQ_API_KEY, using keyword fallback.");
  }

  // 2. Fallback to Keyword Clustering
  const fallbackClusters = clusterWithKeywords(articles);
  return filterAndSynthesize(fallbackClusters, articles);
}

/**
 * Uses Groq Llama 3.3 70B for zero-shot clustering.
 */
async function clusterWithGroq(articles) {
  const articleList = articles.map(a => `ID: ${a.id} | Title: ${a.title}`).join("\n");
  
  const systemPrompt = `
    You are a professional news editor. I will provide a list of news article IDs and Titles (up to 60 items).
    Your task is to group these into discrete "News Events" based on their core factual story.
    
    Rules:
    1. A "News Event" is a cluster of 2 or more articles covering the same specific real-world event.
    2. Write a single, neutral, objective headline for each event (MAX 10 words).
    3. Return ONLY valid JSON as an object with an "events" array. 
    4. Do NOT hallucinate article IDs. ONLY use IDs from the provided list.
    5. A single article cannot belong to multiple clusters. 
    6. If a story has 8-10 distinct events, return all of them.
  `;

  const userPrompt = `Articles:\n${articleList}`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(chatCompletion.choices[0].message.content);
    const parsed = EventClusterSchema.parse(result);
    return parsed.events;
  } catch (error) {
    throw error;
  }
}

/**
 * Jaccard-based keyword clustering fallback.
 */
function clusterWithKeywords(articles) {
  const THRESHOLD = 0.08; // Lowered from 0.15 to account for diverse news framing and noise in descriptions
  const stopWords = new Set(["this", "that", "with", "from", "their", "about", "would", "which", "according", "reportedly", "latest", "breaking", "news"]);
  
  const tokenize = (article) => {
    const text = `${article.title || ""} ${article.description || ""}`;
    return new Set(
      text.toLowerCase()
        .replace(/[^\w\s]/g, "")
        .split(/\s+/)
        .filter(w => w.length >= 3 && !stopWords.has(w))
    );
  };

  const articleDocs = articles.map(a => ({
    id: a.id,
    tokens: tokenize(a)
  }));

  const clusters = []; // Array of { title: string, articleIds: string[] }
  const visited = new Set();

  for (let i = 0; i < articleDocs.length; i++) {
    if (visited.has(articleDocs[i].id)) continue;

    const currentCluster = [articleDocs[i].id];
    visited.add(articleDocs[i].id);

    for (let j = i + 1; j < articleDocs.length; j++) {
      if (visited.has(articleDocs[j].id)) continue;

      const intersection = [...articleDocs[i].tokens].filter(x => articleDocs[j].tokens.has(x));
      const union = new Set([...articleDocs[i].tokens, ...articleDocs[j].tokens]);
      const similarity = intersection.length / union.size;

      if (similarity >= THRESHOLD) {
        currentCluster.push(articleDocs[j].id);
        visited.add(articleDocs[j].id);
      }
    }

    if (currentCluster.length >= 2) {
      clusters.push({
        title: articles.find(a => a.id === currentCluster[0]).title,
        articleIds: currentCluster
      });
    }
  }

  return clusters;
}

/**
 * Re-attaches full article data and filters by source count.
 */
function filterAndSynthesize(clusters, rawArticles) {
  const articleMap = new Map(rawArticles.map(a => [a.id, a]));

  return clusters.map(cluster => {
    const clusteredArticles = cluster.articleIds
      .map(id => articleMap.get(id))
      .filter(Boolean);

    // Ensure we have at least 2 distinct sources (or just articles, per user "2+ sources")
    // If the user meant "distinct publishers", we'd check source names.
    // For now, let's stick to 2+ articles as requested.
    if (clusteredArticles.length < 2) return null;

    // Determine recency
    const times = clusteredArticles.map(a => new Date(a.publishedAt).getTime());
    const latest = new Date(Math.max(...times)).toISOString();

    return {
      id: `event-${cluster.articleIds[0]}`,
      title: cluster.title,
      sourceCount: clusteredArticles.length,
      publishedAt: latest,
      articles: clusteredArticles
    };
  }).filter(Boolean);
}
