# Concerns & Technical Debt

## Critical

### 1. Monolithic Frontend Component
- **File:** `src/components/NewsLensApp.jsx` (~1100 lines, 46KB)
- **Issue:** All 15+ sub-components (TopicSelector, BroadsheetFeed, SearchBar, BiasDistributionChart, etc.) are defined inline in a single file.
- **Impact:** Difficult to navigate, test, or maintain. Any change risks regressions across unrelated components.
- **Recommendation:** Extract each component to its own file under `src/components/`.

### 2. Duplicated `cleanText()` Function
- **Files:** `src/lib/agents/04_ai_summarizer.js` (line 62) and `src/lib/agents/05_derived_metrics.js` (line 58)
- **Issue:** Identical HTML-stripping utility function is copy-pasted in two agent files.
- **Recommendation:** Extract to a shared utility file (e.g., `src/lib/utils/text.js`).

### 3. `article-extractor` and `cheerio` in devDependencies
- **File:** `package.json` (lines 20-22)
- **Issue:** These packages are used at runtime by `01_news_fetcher.js` (server-side API route), but are listed under `devDependencies`. In production builds (`npm install --production`), they would be missing, causing the RSS scraper to fail.
- **Recommendation:** Move to `dependencies`.

## High

### 4. No Test Coverage
- **Issue:** Zero tests exist for any part of the application (see TESTING.md).
- **Impact:** Regressions go undetected. The complex agent pipeline logic (bias scoring, reality score computation, contradiction detection) is particularly risky without tests.

### 5. Hardcoded Claude Model Version
- **File:** `src/lib/agents/04_ai_summarizer.js` (line 39)
- **Issue:** Model `claude-3-5-sonnet-20241022` is hardcoded. The `agent-prompts.md` spec mentions `claude-haiku-4-5` for cost efficiency, but the implementation uses the more expensive Sonnet model.
- **Recommendation:** Make configurable via environment variable. Also note conflicting guidance between the spec and implementation.

### 6. No Rate Limiting on API Routes
- **Files:** `src/app/api/analyze/route.js`, `src/app/api/news/route.js`
- **Issue:** No rate limiting, authentication, or abuse protection on public API endpoints. The analyze route triggers external API calls (NewsAPI, Anthropic) per request.
- **Impact:** Vulnerable to abuse; could rapidly exhaust API quotas and incur costs.

### 7. Stale CSS References
- **File:** `src/app/globals.css`
- **Issue:** Some CSS references remnants of the old dark-mode design:
  - `.gradient-border::before` uses `rgba(99, 102, 241, ...)` (old indigo theme)
  - `.shimmer` references `var(--color-bg-tertiary)` which is not defined in the current `@theme`
  - `.quote-highlight` references `var(--color-accent-indigo)` which is not defined
- **Recommendation:** Audit and clean up or replace with current design token values.

## Medium

### 8. Static Bias & Ownership Databases
- **File:** `src/lib/agents/03_base_intelligence.js`
- **Issue:** Bias scores and ownership data are hardcoded JS objects. Adding or updating sources requires a code change and redeployment.
- **Recommendation:** Consider externalizing to a JSON config file or lightweight database.

### 9. No Loading/Error State for Trending Ticker
- **File:** `src/components/NewsLensApp.jsx` — `TrendingTicker` component
- **Issue:** The ticker calls `fetch("/api/news?q=world")` in a `useEffect`. If the fetch fails, it silently shows an empty ticker. No retry logic.

### 10. Topic Map Inconsistency
- **File:** `src/app/api/news/route.js` (lines 4-13) vs `NewsLensApp.jsx` TopicSelector topics
- **Issue:** The backend topic map and frontend topic list are defined independently. They can drift out of sync. For example, the frontend has "opinion" but the backend maps it to "opinion analysis editorial".
- **Recommendation:** Share a single source of truth for topic definitions.

### 11. No Pagination in Analyze Route
- **File:** `src/app/api/analyze/route.js`
- **Issue:** The analyze route always fetches and processes all articles. For large result sets, this could be slow. The news route has basic pagination, but the analyze route does not.

## Low

### 12. SEO Title Mismatch
- **File:** `src/app/layout.js` (line 4)
- **Issue:** Page title is "Slightly Biased — News Bias Analyzer" but the UI now brands itself as "NewsLens". Title should be updated for consistency.

### 13. Missing Agents 06-09
- **File:** `src/lib/agents/` directory
- **Issue:** Agent numbering jumps from `05` to `10`. The `agent-prompts.md` spec describes 10 agents, but agents 06 (Ownership Resolver), 07 (Perspective Builder), 08 (Timeline Builder), and 09 (Diff Highlighter) are consolidated into files `03` and `05`.
- **Impact:** Confusing numbering, but functionally correct. The spec's 10 agents are all implemented, just grouped differently.

### 14. Unsuppress Hydration Warning
- **File:** `src/components/NewsLensApp.jsx` — TopicSelector
- **Issue:** `suppressHydrationWarning` is used on the date display. While legitimate (Date differs server vs client), it masks potential hydration issues.
