# Testing

## Current State: No Tests

The project currently has **zero test files**. There is no test framework configured, no test scripts in `package.json`, and no CI pipeline.

## What Should Be Tested

### High Priority — Agent Pipeline
The agent functions in `src/lib/agents/` are pure functions (except `04_ai_summarizer`) and are ideal candidates for unit testing:

| Agent | Functions | Testability |
|-------|-----------|-------------|
| `02_article_normalizer.js` | `normalizeArticles()` | ★★★ Pure, deterministic |
| `03_base_intelligence.js` | `classifyBias()`, `resolveOwnership()` | ★★★ Pure lookup |
| `05_derived_metrics.js` | `computeRealityScore()`, `buildPerspectives()`, `buildTimeline()`, `highlightDiffs()` | ★★★ Pure, complex logic |
| `10_payload_builder.js` | `buildPayload()` | ★★★ Pure assembly |
| `01_news_fetcher.js` | `fetchNews()` | ★★ Requires mocking fetch |
| `04_ai_summarizer.js` | `summarizeArticles()` | ★★ Requires mocking Anthropic API |

### Medium Priority — API Routes
- `src/app/api/analyze/route.js` — Integration test for the full pipeline
- `src/app/api/news/route.js` — Integration test for lightweight fetch

### Lower Priority — Frontend Components
- `src/components/NewsLensApp.jsx` — Component tests with React Testing Library
- View state transitions (selector → feed)
- Search submission behavior

## Recommended Test Setup
If tests are added, the natural choice would be:
- **Framework:** Vitest (aligns with Vite/Next.js ecosystem) or Jest
- **Component testing:** React Testing Library
- **API mocking:** `msw` (Mock Service Worker) for external API calls
- **Coverage:** Focus on agent functions first (highest value, easiest to test)

## Linting
- ESLint 9 is configured with `eslint-config-next`
- Run via `npm run lint`
- No custom rules or overrides observed
