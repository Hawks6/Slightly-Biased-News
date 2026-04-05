# Testing Strategy

Slightly Biased News currently relies on a manual/ad-hoc verification strategy centered around specialized debug scripts for backend logic and browser-based UAT for frontend components.

## Automated Testing (N/A)
> [!WARNING]
> No formal automated test suite (Jest, Vitest, Playwright) is implemented. This is identified as a critical technical debt area for the project.

## Manual Verification Scripts
The project uses specialized Node.js scripts in the root directory for verifying backend agent logic:

- `test_keywords.mjs`: Validates Jaccard similarity and tokenization logic for the `11_event_clusterer`.
- `debug_cluster.mjs`: Tests the Groq-powered event clustering with a live (or cached) article pool.
- `debug_fetch.mjs`: Verifies the sequential fallback chain (NewsAPI -> GNews -> RSS) for article retrieval.
- `debug_sources.mjs`: Audits the `03_base_intelligence` bias and ownership databases for specific news publishers.

## UI Verification (UAT Protos)
Frontend components are verified manually by navigating the application state machine:
- **Topic Selection:** Verifying that category tiles trigger the correct `/api/events` call.
- **Event Grid:** Checking that event cards correctly render source counts and recency.
- **Analysis View:** Ensuring that Recharts and PerspectivesPanel handle the pipeline payload without layout shifts or data type errors.

## API Verification
Endpoints can be verified using `curl` or Postman:
- `GET /api/events?topic=politics`: Checks clustering performance and JSON schema.
- `POST /api/analyze`: Verifies the full pipeline with a provided JSON article array.
- `GET /api/cache/status`: Checks Redis connectivity and TTL status (if available).
