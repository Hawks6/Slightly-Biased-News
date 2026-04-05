# Technical Concerns & Debt

A deep mapping of Slightly Biased News has identified several critical areas where the current architecture may be fragile or limited.

## Architectural Debt
- **Static Intelligence Database:** The bias and ownership classifications in `src/lib/agents/03_base_intelligence.js` are hardcoded in-memory objects. This makes the system inflexible for updates and impossible to scale for unknown or emerging publications. (Target: Phase 4: ML-Powered Bias Analyzer)
- **Monolithic App Orchestration:** `SlightlyBiasedApp.jsx` serves as a complex state machine for multiple views (selector, feed, dashboard). This leads to "prop-drilling" and a lack of isolated view logic. (Target: Phase 3 Refactoring)
- **Sequential Pipeline Latency:** While the orchestrator uses `Promise.all` for AI calls, the overall pipeline has multiple sequential dependencies (Fetch -> Normalize -> Bias Tag -> Summarize -> Payload). Substantial network latency accumulates.

## Operational Risks
- **Groq Free Tier Dependency:** The `11_event_clusterer` relies entirely on Groq's free tier. Any service outage or rate-limiting will break the core "Event-First" experience. A secondary clustering fallback (Jaccard Keywords) exists but provides significantly lower quality events.
- **Full-Text Extraction Fragility:** `@extractus/article-extractor` and the custom RSS scraping logic are prone to failures due to paywalls, JavaScript-heavy pages, or dynamic layouts of news publishers.

## Quality & Security
- **Missing Test Inventory:** The total lack of automated unit, integration, and E2E tests presents a high risk for regressions as the feature set grows.
- **Secret Management:** Currently relies on `.env.local`. Ensure that `gsd-tools` commits do not include these locally sensitive files.
- **Implicit Schemas:** While Zod is used for AI responses, internal agent data flows lack explicit TypeScript-like interface enforcement, relying on manual adherence to the "SlightlyBiasedSpec."

## Current Refactoring Focus
- Transitioning from a search-first to an **event-first UI**.
- Normalizing the backend pipeline to accept article payloads via `POST` requests.
- Implementation of the intelligent bias analyzer fallback for unknown sources.
