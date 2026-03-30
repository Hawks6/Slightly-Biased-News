# Phase 1 Context: Event API & Clustering Logic

## Decisions

- **Event Filtering**: Only return clusters containing **2 or more sources**. Single articles that do not group with any other story will be filtered out to ensure the feed feels like "news events" rather than a raw article list.
- **Data Payload**: The `/api/events` response will include the **full normalized article objects** for every article within a cluster. This avoids redundant fetching in Phase 2 when these articles are passed to the analysis pipeline.
- **Fallback Strategy**: If the Groq AI clustering fails (due to rate limits, API error, or malformed JSON), the system will fall back to a **basic keyword-based clusterer** to ensure the UI remains functional.
- **Categories**: The API will be open to any search query but will prioritize a smooth experience for the initial 8 categories (World, Politics, etc.).

## Implementation Details

- **Tech Stack**:
  - Add `groq-sdk` for AI inference.
  - Add `zod` for strict schema validation of Groq outputs.
  - Use `Llama 3.3 70B` on Groq (free tier).
- **New Agent**: `src/lib/agents/11_event_clusterer.js`
  - Function `clusterArticles(articles)` which takes normalized articles and returns grouped events.
  - Prompts: Use a strict system prompt that maps article IDs to group labels.
- **New Route**: `src/app/api/events/route.js`
  - Handles `GET` with `topic` and `q` parameters.
  - Orchestrates fetching -> normalization -> clustering.

## Gray Areas Resolved
- All articles in a cluster will be returned in full.
- Singletons will be suppressed.
- Keyword clustering fallback will be implemented.

---
*Last updated: 2026-03-30*
