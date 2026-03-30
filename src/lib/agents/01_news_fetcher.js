import * as cheerio from "cheerio";
import { extract } from "@extractus/article-extractor";

/**
 * Agent 01: News Fetcher
 * Fetches articles from NewsAPI → GNews → Dynamic RSS Scraper (Full Text) → Fallback mock data.
 * Returns an array of raw article objects.
 */

const FALLBACK_ARTICLES = [
  {
    source: { id: "reuters", name: "Reuters" },
    author: "Reuters Staff",
    title: "Global markets rally as central banks signal rate cuts ahead",
    description: "Stock markets across the globe surged on Wednesday after several central banks indicated they would begin easing monetary policy in the coming months, boosting investor confidence.",
    url: "https://reuters.com/markets/global-rally",
    urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
    publishedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    content: "Markets surged globally as the Federal Reserve and European Central Bank both signaled potential rate cuts. The S&P 500 jumped 2.1% while European indices saw similar gains. Analysts noted this represents a significant shift in monetary policy stance, with inflation data showing signs of cooling. Critics argue the celebrations are premature, pointing to persistent core inflation in services sectors."
  },
  {
    source: { id: "bbc-news", name: "BBC News" },
    author: "Laura Kuenssberg",
    title: "Central banks offer cautious optimism on rate reductions",
    description: "Central banking authorities have expressed measured confidence in the economic outlook, suggesting a careful approach to potential interest rate adjustments.",
    url: "https://bbc.com/news/business/rates",
    urlToImage: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800",
    publishedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    content: "The Bank of England's latest minutes reveal a committee divided on the pace of rate reductions. While some members favor immediate action to stimulate growth, others warn of reigniting inflation. The cautious approach reflects uncertainty about global economic conditions and the impact of ongoing geopolitical tensions on supply chains and energy prices."
  },
  {
    source: { id: "fox-news", name: "Fox News" },
    author: "Charles Payne",
    title: "Biden administration pressures Fed on rates as economy shows weakness",
    description: "Critics say the push for lower interest rates is politically motivated as the administration faces economic headwinds ahead of upcoming elections.",
    url: "https://foxnews.com/economy/rates-pressure",
    urlToImage: "https://images.unsplash.com/photo-1604594849809-dfedbc827105?w=800",
    publishedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    content: "The current administration has been quietly pushing for the Federal Reserve to lower interest rates faster, according to sources close to the White House. Economic advisors have signaled that consumer spending data shows concerning weakness. Republican lawmakers have criticized the approach as short-sighted, arguing that premature rate cuts could lead to a resurgence of inflation that would hurt everyday Americans."
  },
  {
    source: { id: "cnn", name: "CNN" },
    author: "Christine Romans",
    title: "Rate cut hopes uplift Wall Street while Main Street struggles",
    description: "While financial markets celebrate potential rate cuts, ordinary Americans continue to face high costs of living and stagnant wage growth.",
    url: "https://cnn.com/business/rates-wall-street",
    urlToImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
    publishedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    content: "The disconnect between Wall Street optimism and Main Street reality has never been more stark. While equity markets surge on rate-cut expectations, surveys show most Americans haven't benefited from the stock market rally. Housing affordability remains at historic lows, grocery prices have risen 25% since 2020, and real wages for the bottom quartile have barely budged. Economists debate whether rate cuts will trickle down to ordinary consumers."
  },
  {
    source: { id: "al-jazeera", name: "Al Jazeera" },
    author: "Faisal Islam",
    title: "Western central banks' rate decisions ripple through developing economies",
    description: "Monetary policy shifts in major economies create turbulence for emerging markets, raising concerns about capital flight and currency instability.",
    url: "https://aljazeera.com/economy/developing-impact",
    urlToImage: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800",
    publishedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    content: "While Western markets celebrate potential rate cuts, developing nations face a more complex picture. Capital flows could reverse as yield differentials narrow, potentially destabilizing currencies in countries that raised rates aggressively to maintain dollar parity. The IMF has warned that several African and South Asian economies are particularly vulnerable to rapid shifts in global monetary policy."
  },
  {
    source: { id: "the-wall-street-journal", name: "The Wall Street Journal" },
    author: "Nick Timiraos",
    title: "Fed officials weigh timing of first rate cut amid mixed economic signals",
    description: "Federal Reserve policymakers are debating whether the economy has cooled enough to justify the first interest rate reduction since the pandemic era tightening cycle.",
    url: "https://wsj.com/economy/fed-rate-cut-debate",
    urlToImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
    publishedAt: new Date(Date.now() - 7 * 3600000).toISOString(),
    content: "Minutes from the latest Federal Reserve meeting show officials remain divided. Doves on the committee argue that maintaining restrictive policy risks overtightening and causing a recession, while hawks point to sticky services inflation and robust employment data. Market pricing currently implies three cuts this year, but several governors have pushed back against that expectation."
  },
  {
    source: { id: "nyt", name: "The New York Times" },
    author: "Jeanna Smialek",
    title: "The great rate debate: When will the Fed finally cut?",
    description: "A deep analysis of the economic indicators that will determine the timing and pace of Federal Reserve interest rate reductions.",
    url: "https://nytimes.com/economy/rate-debate",
    urlToImage: "https://images.unsplash.com/photo-1554244933-d876deb6b2ff?w=800",
    publishedAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    content: "The Federal Reserve faces its most complex policy decision in years. Inflation has fallen from its 9% peak but remains above the 2% target. The labor market, once overheated, is showing signs of normalization with job openings declining. Housing remains the wildcard — shelter inflation stays elevated even as rents in new leases have dropped. The timing of the first cut could define the economic trajectory for years to come."
  },
  {
    source: { id: "msnbc", name: "MSNBC" },
    author: "Stephanie Ruhle",
    title: "Working families need rate relief now, economists argue",
    description: "Progressive economists are calling for immediate rate cuts, citing the disproportionate impact of high interest rates on working-class families and small businesses.",
    url: "https://msnbc.com/economy/rate-relief",
    urlToImage: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800",
    publishedAt: new Date(Date.now() - 9 * 3600000).toISOString(),
    content: "A coalition of economists has published an open letter urging the Federal Reserve to begin cutting rates immediately. They argue that the current high-rate environment disproportionately hurts small businesses, first-time homebuyers, and families with variable-rate debt. The letter points to declining inflation trends and argues that waiting risks unnecessary economic pain for the most vulnerable Americans."
  }
];

async function fetchFromRSS(query) {
  try {
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
    const res = await fetch(rssUrl);
    if (!res.ok) return null;
    
    const xml = await res.text();
    const $ = cheerio.load(xml, { xmlMode: true });
    const items = [];
    
    $("item").each((i, el) => {
      if (i >= 10) return;
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

    console.log(`[NewsFetcher] RSS Scraper found ${items.length} links, extracting full text for top 6 articles...`);

    // Extract full text for top 6 items in parallel
    const articles = await Promise.all(
      items.slice(0, 6).map(async (item) => {
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
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=10&language=en&apiKey=${newsApiKey}`,
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
