# Architecture

Slightly Biased News implements a "Multi-Agent Pipeline" architecture designed for deterministic processing of unstructured news data combined with high-reasoning AI synthesis.

## System Pattern: 3-Level Editorial Stack

The application operates on a triple-view state machine to provide a broadsheet-style exploration experience:

1.  **Level 1: Semantic Topic Selector**
    - **Component:** `TopicSelector.jsx`
    - **Logic:** High-level categorization of news (Politics, Tech, etc.).
    - **API:** Initializes context for the event feed.

2.  **Level 2: Clustered Event Feed**
    - **Component:** `EventFeed.jsx`
    - **Route:** `GET /api/events?topic={topic}`
    - **Logic:** Fetches ~60 articles and uses the **11_event_clusterer** (Groq Llama 3.3) to group stories covering the same real-world event.
    - **Goal:** Unify disparate framing into a single "News Event" card.

3.  **Level 3: Perspective Analysis Dashboard**
    - **Component:** `SlightlyBiasedApp.jsx`
    - **Route:** `POST /api/analyze` 
    - **Logic:** Receives the clustered articles and runs the full 10-agent enrichment pipeline (Bias tagging, Ownership resolution, AI Framing Analysis, Reality Scoring).
    - **Goal:** Contrast how different publications frame the same facts.

## The Agent Pipeline (`src/lib/agents/`)

Each agent is a pure function (input -> output) executing in a deterministic sequence:

| Order | Agent | Function |
| :--- | :--- | :--- |
| 01 | **News Fetcher** | Multi-source fallback fetching (NewsAPI -> GNews -> RSS). |
| 02 | **Article Normalizer** | Schema unification into the `SlightlyBiasedNews` internal spec. |
| 11 | **Event Clusterer** | Groq-powered zero-shot clustering of raw articles. |
| 03 | **Base Intelligence** | Lookup-based Bias Classification and Ownership Resolution. |
| 04 | **AI Summarizer** | Claude/Anthropic synthesis of neutral summaries and framing contrasts. |
| 05 | **Derived Metrics** | Reality scoring, Timeline construction, and Perspective building. |
| 10 | **Payload Builder** | Final JSON construction for the React dashboard. |

## Data Flow Diagram

```mermaid
graph TD
    UI[React Web App] -->|GET| EVENTS_API[/api/events]
    EVENTS_API -->|A1_Fetch| NF[News Fetcher]
    NF -->|A11_Cluster| EC[Event Clusterer]
    EC -->|Events JSON| UI
    
    UI -->|POST Articles| ANALYZE_API[/api/analyze]
    ANALYZE_API -->|A3_Enrich| BI[Base Intelligence]
    BI -->|A4_Summarize| AS[AI Summarizer]
    AS -->|A5_Metrics| DM[Derived Metrics]
    DM -->|A10_Build| UI
```

## Caching Strategy
- **Layer:** Server-side Redis (Upstash) via `src/lib/redis.js`.
- **TTL:** 15 minutes for Events, 1 hour for Deep Analysis.
- **Goal:** Minimize Groq/Anthropic usage and NewsAPI rate limit exhaustion.
