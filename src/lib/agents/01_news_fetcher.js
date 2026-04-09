import * as cheerio from "cheerio";
import { extract } from "@extractus/article-extractor";
import FALLBACK_ARTICLES from "./fallback_articles.js";

/**
 * Agent 01: News Fetcher
 * Fetches articles from NewsAPI → GNews → Dynamic RSS Scraper (Full Text) → Fallback mock data.
 * Returns an array of raw article objects.
 */

async function fetchFromRSS(query) {
  try {
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
    const res = await fetch(rssUrl);
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

    // Extract full text for top 20 items in parallel to provide a richer clustering pool
    const articles = await Promise.all(
      items.slice(0, 20).map(async (item) => {
        try {
          // Use article-extractor to get clean text/metadata
          const extracted = await extract(item.link);
          
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
    console.warn("[NewsFetcher] RSS Scraper failed:", e.message);
  }
  return null;
}

export async function fetchNews(query) {
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

  // Attempt 3: Dynamic RSS Scraper (Best fallback for relevance)
  const rssData = await fetchFromRSS(query);
  if (rssData) {
    return rssData;
  }

  // Attempt 4: Static Fallback (Last resort)
  console.log("[NewsFetcher] Using static fallback dataset for query:", query);
  return { articles: FALLBACK_ARTICLES, source: "fallback" };
}
