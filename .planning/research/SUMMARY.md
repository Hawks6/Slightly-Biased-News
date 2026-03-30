# Research Summary: Event-First News Platforms

**Date:** 2026-03-30
**Domain:** Adding AI-powered event clustering to the NewsLens analyzer

## Strategic Shift
The application will transition from an **article-based** feed to an **event-based** hierarchy. This requires adding a middle layer: Category -> Events -> News Analysis. 

## Key Findings

### Stack
- **Clustering engine:** Groq Llama 3.3 70B (via `groq-sdk`) due to free-tier generous limits and high speed zero-shot performance.
- **Validation:** Zod parsing on the output of Groq to ensure the returned clusters contain valid original article references.

### Table Stakes
- The AI must group related headlines from distinct publishers into unified events.
- Minimal event cards should display: synthesized neutral headline, source count, and recency.
- Clicking a card triggers the full bias pipeline (bias db, summarizer, timeline, diff metrics) ONLY on the clustered articles.

### Watch Out For
- **Prompt Hallucination:** You cannot let the model invent articles or return bad IDs. You must supply a numbered list of headlines and command it to group by ID.
- **Double-Fetching API Doom:** By default, `/api/analyze` fetches articles by query. We must refactor it. The client should POST the exact articles for the event back to `/api/analyze` to avoid re-triggering NewsAPI constraints.
- **Singleton Handling:** A robust rule is needed for how many distinct sources make an "event". Are 2 enough? 3?

## Recommendations
Introduce a new API endpoint: `/api/events` which aggregates NewsAPI/GNews/RSS results, feeds their titles to Groq, and returns the clustered event schema. Modify `/api/analyze` to accept an explicit `articles` array in its POST body rather than relying solely on a generic `q` parameter.
