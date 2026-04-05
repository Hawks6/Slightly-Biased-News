# System Design: *Slightly* Biased News

This document provides a detailed technical specification for the *Slightly* Biased News platform. It serves as the primary reference for the system architecture, data models, and agent-driven analysis pipeline.

## 1. Architecture Overview

The platform implements a **Multi-Agent Pipeline** architecture optimized for real-time synthesis of unstructured news. It follows a **3-Level Editorial Stack** to guide users from broad categories to deep analysis.

```mermaid
graph TD
    subgraph Client [Presentation Layer - React/Next.js]
        TS[Topic Selector] -->|GET /api/events| EF[Event Feed]
        EF -->|POST /api/analyze| AD[Analysis Dashboard]
    end

    subgraph Server [Logic Layer - Next.js App Router]
        API_E[/api/events] -->|Agent 11| EC[Event Clusterer]
        API_A[/api/analyze] -->|Agents 01-13| AP[Analysis Pipeline]
    end

    subgraph Intelligence [Agent Layer - src/lib/agents/]
        EC -->|Groq Llama 3| L3[Llama 3.3 70B]
        AP -->|A3: Bias/Ownership| DB[(Internal DB)]
        AP -->|A4: Summary| L3
        AP -->|A12: Framing| L3
        AP -->|A13: Valence| L3
    end

    subgraph Infrastructure
        Cache[(Upstash Redis)]
        Sources[NewsAPI / GNews / RSS]
    end

    API_E --- Cache
    API_A --- Cache
    EC --- Sources
```

## 2. The 3-Level Editorial Stack

### Level 1: Semantic Topic Selector
- **Component**: `TopicSelector.jsx`
- **Responsibility**: User intent capture and category-based news initialization.
- **State**: Tracks `activeTopic` (e.g., `world`, `politics`, `technology`).

### Level 2: Clustered Event Feed
- **Component**: `EventFeed.jsx`
- **Route**: `GET /api/events?topic={id}`
- **Logic**: 
    1. Fetch ~60 raw articles via **Agent 01**.
    2. Cluster related stories using **Agent 11 (Event Clusterer)**.
    3. Output 8-10 high-relevance "News Events".
- **UX**: Displays events as broadsheet "cards" with source counts and bias indicators.

### Level 3: Perspective Analysis Dashboard
- **Component**: `SlightlyBiasedApp.jsx`
- **Route**: `POST /api/analyze` 
- **Logic**: Full 10+ agent enrichment pipeline on a specific event's article pool.
- **UX**: Visualizes internal bias distributions, framing contrasts, and narrative summaries.

## 3. The Agent Pipeline (`src/lib/agents/`)

| Order | Agent | Logic | Purpose |
| :--- | :--- | :--- | :--- |
| **01** | **News Fetcher** | 4-source fallback chain | Reliable article acquisition. |
| **02** | **Normalizer** | Schema mapping | Unifying disparate API outputs. |
| **11** | **Clusterer** | Groq Llama 3 + Jaccard | Grouping articles into real-world events. |
| **03** | **Intelligence** | Static lookup tables | Bias classification and ownership resolution. |
| **04** | **Summarizer** | Groq-powered synthesis | Multi-perspective neutral summary. |
| **05** | **Metrics** | Semantic scoring | Reality distance and timeline construction. |
| **12** | **Framing** | LLM Zero-shot classification | Identifying narrative "lenses" (e.g., Economic). |
| **13** | **Valence** | Tone analysis (-1.0 to 1.0) | Measuring emotional intensity. |
| **10** | **Builder** | JSON Aggregator | Final API payload construction. |

## 4. Data Models

### Article Schema
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string",
  "content": "string (sanitized)",
  "url": "url",
  "publishedAt": "ISO8601",
  "source": { "id": "string", "name": "string" },
  "bias": "number (-100 to 100)",
  "ownership": "string",
  "framing": "string (Economic/Conflict/etc.)",
  "valence": "number (-1.0 to 1.0)"
}
```

### Event Schema
```json
{
  "id": "event-{id}",
  "title": "string (Synthesized)",
  "sourceCount": "number",
  "publishedAt": "ISO8601",
  "articles": ["Article[]"]
}
```

### Analysis Payload
```json
{
  "summary": "string",
  "narrative": "string",
  "takeaways": "string[]",
  "realityScore": "number",
  "perspectives": ["Object"],
  "timeline": ["Object"],
  "diffs": ["Object"]
}
```

## 5. API Reference

### `GET /api/events`
- **Query Params**: `topic` (string)
- **Response**: `Event[]`
- **Caching**: 15 minutes TTL via Upstash.

### `POST /api/analyze`
- **Body**: `{ query: string, articles: Article[] }`
- **Response**: Combined Analysis + Enriched Articles.
- **Caching**: 60 minutes TTL.

### `GET /api/news`
- **Query Params**: `topic` (string)
- **Response**: Raw articles (no clustering or deep analysis).
- **Purpose**: Diagnostic and lightweight feed fallback.

## 6. Infrastructure

- **Frontend**: Next.js 15 (App Router), Tailwind CSS v4, Recharts.
- **Compute**: Vercel Edge/Serverless functions.
- **Cache**: Upstash Redis (Serverless).
- **AI Layers**:
    - **Groq**: Llama 3.3 70B (Primary clustering/summarization).
    - **Anthropic (Optional)**: Claude 3.5 Sonnet (Fallback deep synthesis).
- **Data Suppliers**: NewsAPI, GNews, MediaCloud (RSS).

## 7. Performance & Constraints

1.  **AI Budget**: Clustering must prioritize Groq free tier to maintain zero operational cost.
2.  **Latency**: `/api/events` target < 1.5s; `/api/analyze` target < 3s (parallel agent execution).
3.  **Rate Limits**: NewsAPI (100 daily requests) handled via aggressive Redis caching.
