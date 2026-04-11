import * as cheerio from "cheerio";
import { extract } from "@extractus/article-extractor";
import FALLBACK_ARTICLES from "./fallback_articles.js";

/**
 * Agent 01: News Fetcher
 * Fetches articles from NewsAPI → GNews → Dynamic RSS Scraper → Fallback mock data.
 * 
 * Supports two modes:
 *   - { lightweight: false } (default) — full-text extraction for analysis pipeline
 *   - { lightweight: true }  — RSS metadata only (title/description), 10-20× faster for clustering
 */

/**
 * Lightweight RSS fetch — returns title + description only, no full-text extraction.
 * Used by the events/clustering route for speed.
 */
async function fetchFromRSSLightweight(query) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
    const res = await fetch(rssUrl, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return null;
    
    const xml = await res.text();
    const $ = cheerio.load(xml, { xmlMode: true });
    const articles = [];
    
    $("item").each((i, el) => {
      if (i >= 20) return;
      const rawDesc = $(el).find("description").text();
      let cleanDesc = rawDesc;
      if (rawDesc) {
        cleanDesc = cheerio.load(rawDesc).text().trim().replace(/\s\s+/g, " ");
      }
      
      const pubDate = $(el).find("pubDate").text();
      articles.push({
        source: { id: null, name: $(el).find("source").text() || "Google News" },
        author: $(el).find("source").text() || "Google News",
        title: $(el).find("title").text(),
        description: cleanDesc,
        url: $(el).find("link").text(),
        urlToImage: null,
        publishedAt: pubDate ? new Date(pubDate).toISOString() : new Date().toISOString(),
        content: cleanDesc, // description-only for clustering
      });
    });

    if (articles.length > 0) {
      console.log(`[NewsFetcher] RSS Lightweight: ${articles.length} articles (no full-text extraction)`);
      return { articles, source: "rss_lightweight" };
    }
  } catch (e) {
    if (e.name === "AbortError") {
      console.warn("[NewsFetcher] RSS Lightweight: timed out after 8s");
    } else {
      console.warn("[NewsFetcher] RSS Lightweight failed:", e.message);
    }
  }
  return null;
}

/**
 * Full RSS fetch with article-extractor for full-text content.
 * Used by the analysis pipeline.
 */
async function fetchFromRSS(query) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
    const res = await fetch(rssUrl, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return null;
    
    const xml = await res.text();
    const $ = cheerio.load(xml, { xmlMode: true });
    const items = [];
    
    $("item").each((i, el) => {
      if (i >= 20) return;
      const rawDesc = $(el).find("description").text();
      let cleanDesc = rawDesc;
      if (rawDesc) {
        cleanDesc = cheerio.load(rawDesc).text().trim().replace(/\s\s+/g, " ");
      }
      
      items.push({
        title: $(el).find("title").text(),
        link: $(el).find("link").text(),
        pubDate: $(el).find("pubDate").text(),
        description: cleanDesc,
        sourceName: $(el).find("source").text() || "Google News",
      });
    });

    if (items.length === 0) return null;

    console.log(`[NewsFetcher] RSS Scraper found ${items.length} links, extracting full text for top 20 articles...`);

    // Extract full text with per-article timeout (5s each)
    const articles = await Promise.all(
      items.slice(0, 20).map(async (item) => {
        try {
          const extractController = new AbortController();
          const extractTimeout = setTimeout(() => extractController.abort(), 5000);

          const extracted = await extract(item.link);
          clearTimeout(extractTimeout);
          
          // Strip HTML tags from content to provide clean text to AI agents
          let cleanContent = item.description;
          if (extracted?.content) {
            const $c = cheerio.load(extracted.content);
            cleanContent = $c.text().trim().replace(/\s\s+/g, ' ');
          }

          return {
            source: { id: null, name: item.sourceName },
            author: extracted?.author || item.sourceName,
            title: extracted?.title || item.title,
            description: extracted?.description || item.description,
            url: item.link,
            urlToImage: extracted?.image || `https://images.unsplash.com/photo-1585829365234-781fca5dd931?w=800&q=80&news=${encodeURIComponent(query)}`,
            publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
            content: cleanContent,
          };
        } catch (err) {
          console.warn(`[NewsFetcher] Failed to extract from ${item.link}:`, err.message);
          return {
            source: { id: null, name: item.sourceName },
            author: item.sourceName,
            title: item.title,
            description: item.description,
            url: item.link,
            urlToImage: `https://images.unsplash.com/photo-1585829365234-781fca5dd931?w=800&q=80&news=${encodeURIComponent(query)}`,
            publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
            content: item.description,
          };
        }
      })
    );
    
    if (articles.length > 0) {
      return { articles, source: "rss_full_text" };
    }
  } catch (e) {
    if (e.name === "AbortError") {
      console.warn("[NewsFetcher] RSS fetch timed out after 8s");
    } else {
      console.warn("[NewsFetcher] RSS Scraper failed:", e.message);
    }
  }
  return null;
}

/**
 * Main fetch function.
 * @param {string} query - Search query
 * @param {Object} options - { lightweight: true } to skip full-text extraction
 */
export async function fetchNews(query, options = {}) {
  const { lightweight = false } = options;
  const newsApiKey = process.env.NEWSAPI_KEY;
  const gnewsKey = process.env.GNEWS_KEY;

  // Attempt 1: NewsAPI
  if (newsApiKey) {
    try {
      const res = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=60&language=en&apiKey=${newsApiKey}`,
        { next: { revalidate: 300 } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
          return { articles: data.articles, source: "newsapi" };
        }
      }
    } catch (e) {
      console.warn("[NewsFetcher] NewsAPI failed:", e.message);
    }
  }

  // Attempt 2: GNews
  if (gnewsKey) {
    try {
      const res = await fetch(
        `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=10&token=${gnewsKey}`,
        { next: { revalidate: 300 } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
          const normalized = data.articles.map((a) => ({
            source: { id: null, name: a.source.name },
            author: a.source.name,
            title: a.title,
            description: a.description,
            url: a.url,
            urlToImage: a.image,
            publishedAt: a.publishedAt,
            content: a.content,
          }));
          return { articles: normalized, source: "gnews" };
        }
      }
    } catch (e) {
      console.warn("[NewsFetcher] GNews failed:", e.message);
    }
  }

  // Attempt 3: RSS — use lightweight mode when clustering only needs metadata
  if (lightweight) {
    const rssData = await fetchFromRSSLightweight(query);
    if (rssData) return rssData;
  } else {
    const rssData = await fetchFromRSS(query);
    if (rssData) return rssData;
  }

  // Attempt 4: Static Fallback (Last resort)
  console.log("[NewsFetcher] Using static fallback dataset for query:", query);
  return { articles: FALLBACK_ARTICLES, source: "fallback" };
}
