# External Integrations

## News Data Sources (Fallback Chain)

The news fetcher agent (`src/lib/agents/01_news_fetcher.js`) uses a priority-based fallback chain:

### 1. NewsAPI.org (Primary)
- **Endpoint:** `https://newsapi.org/v2/everything`
- **Auth:** API key via `NEWSAPI_KEY` env var, passed as `apiKey` query param
- **Parameters:** `q`, `sortBy=publishedAt`, `pageSize=10`, `language=en`
- **Caching:** Next.js `revalidate: 300` (5-minute cache)
- **Limitation:** Free tier only supports `publishedAt` sorting and English

### 2. GNews.io (Secondary)
- **Endpoint:** `https://gnews.io/api/v4/search`
- **Auth:** API key via `GNEWS_KEY` env var, passed as `token` query param
- **Parameters:** `q`, `lang=en`, `max=10`
- **Caching:** Next.js `revalidate: 300`
- **Note:** Response shape differs from NewsAPI; normalized in-fetcher

### 3. Google News RSS (Tertiary — Scraping)
- **Endpoint:** `https://news.google.com/rss/search?q=...&hl=en-US&gl=US&ceid=US:en`
- **Auth:** None (public RSS feed)
- **Processing:**
  - Parses XML with `cheerio` in XML mode
  - Extracts top 10 items from RSS, then runs `@extractus/article-extractor` on the top 6 links for full-text extraction
  - HTML content is stripped to clean text via cheerio
- **No API key required** — best free fallback for relevant content

### 4. Static Fallback (Last Resort)
- Hardcoded array of 8 mock articles in `01_news_fetcher.js` (lines 10-91)
- Covers Reuters, BBC, Fox News, CNN, Al Jazeera, WSJ, NYT, MSNBC
- Used when all live sources fail

## AI Services

### Anthropic Claude API
- **File:** `src/lib/agents/04_ai_summarizer.js`
- **Endpoint:** `https://api.anthropic.com/v1/messages`
- **Model:** `claude-3-5-sonnet-20241022`
- **Auth:** `ANTHROPIC_API_KEY` env var, sent as `x-api-key` header
- **API version:** `2023-06-01`
- **Max tokens:** 600
- **Purpose:** Generates neutral multi-perspective summaries with key takeaways
- **Fallback:** Extractive summarizer (rule-based sentence selection from diverse bias groups)
- **Response format:** JSON with `summary`, `takeaways[]`, `watchStatement`

## External Assets

### Google Fonts
- Loaded via `<link>` in `src/app/layout.js`
- Families: DM Sans, DM Serif Display, Newsreader
- Preconnects to `fonts.googleapis.com` and `fonts.gstatic.com`

### Unsplash (Image Placeholders)
- Used as fallback `urlToImage` when article images are missing
- Referenced as `https://images.unsplash.com/photo-...` in fallback articles

## Databases
- **None** — the application is stateless. All data is fetched on-demand per request.

## Authentication / Auth Providers
- **None** — no user authentication system. API keys are server-side only.
