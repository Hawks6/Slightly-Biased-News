# External Integrations

Slightly Biased News relies on a multi-layered integration strategy to ensure high event density and accurate bias analysis, even when primary APIs are unavailable.

## Data Sources (News)
The system uses a sequential fallback chain implemented in `src/lib/agents/01_news_fetcher.js`:

1. **NewsAPI.org (Primary):** Fetches up to 60 articles per query using the `/v2/everything` endpoint.
2. **GNews.io (Secondary):** Used when NewsAPI limits are reached or for regional diversity.
3. **Google News RSS Scraper (Tertiary):** A dynamic fallback that scrapes RSS feeds and uses `@extractus/article-extractor` to retrieve full-text content.
4. **Static Fallback:** A hardcoded dataset of 9 diverse articles used for development or when all external services fail.

## AI & Machine Learning
- **Groq Cloud (Llama 3.3 70B):**
    - Used in `11_event_clusterer.js` for zero-shot article clustering.
    - Optimized for low-latency (<2s) JSON responses using the `llama-3.3-70b-versatile` model.
- **Anthropic (Claude 3.x):**
    - Used in `04_ai_summarizer.js` for synthesizing framing analysis and neutral event summaries.
    - Handles complex multi-perspective synthesis that requires high reasoning capability.

## Intelligence Databases
Internal lookup tables located in `src/lib/agents/03_base_intelligence.js`:
- **Bias Database:** Maps ~30 major news sources (CNN, Fox, Reuters, etc.) to political lean (left, center, right) and reliability scores based on AllSides and Ad Fontes Media methodologies.
- **Ownership Resolver:** Maps sources to parent companies (e.g., CNN -> Warner Bros. Discovery) and ownership types (publicly traded, state-funded, etc.).

## Infrastructure & Storage
- **Upstash Redis:** 
    - Integrated via `ioredis` for caching full-pipeline analysis results.
    - Cache keys are generated based on query/topic and timestamp to ensure data freshness while reducing API costs.
- **Unsplash API (via Image URLs):** Used for generating relevant placeholder and header images for news events when original source images are missing or low-quality.
