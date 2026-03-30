# Architecture

## Pattern: Multi-Agent Pipeline with Monolithic Frontend

The application follows a **sequential multi-agent pipeline** architecture on the backend, feeding a **single monolithic React component** on the frontend.

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Client)                     │
│                                                         │
│  page.js → NewsLensApp.jsx (1109-line monolith)         │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │TopicSelector │→ │BroadsheetFeed│  │ Sidebar       │  │
│  │(View 1)     │  │(View 2 Main) │  │ (View 2 Side) │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
│         ↓ fetch(/api/analyze?q=...)                      │
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│                   BACKEND (Server)                       │
│                                                         │
│  src/app/api/analyze/route.js  (Orchestrator)           │
│  src/app/api/news/route.js     (Lightweight fetcher)    │
│                                                         │
│  Pipeline Waves:                                        │
│  Wave 1: 01_news_fetcher ──→ raw articles               │
│  Wave 2: 02_article_normalizer ──→ cleaned articles     │
│  Wave 3: 03_base_intelligence ──→ bias + ownership      │
│  Wave 4: 04_ai_summarizer + 05_derived_metrics (║)      │
│          ├─ summarizeArticles (async, Claude/extractive) │
│          ├─ computeRealityScore (sync)                   │
│          ├─ buildPerspectives (sync)                     │
│          └─ buildTimeline (sync)                         │
│  Wave 5: 05_derived_metrics.highlightDiffs               │
│  Wave 6: 10_payload_builder ──→ UI_PAYLOAD_SCHEMA        │
└─────────────────────────────────────────────────────────┘
```

## Layers

### 1. Presentation Layer
- **Single component:** `src/components/NewsLensApp.jsx` (~1100 lines)
- Contains all sub-components inline (not extracted to separate files)
- Two-view state machine: `activeView: "selector" | "feed"`
- Uses Recharts for data visualization (BarChart, PieChart)

### 2. API Layer
- **Next.js App Router** API routes (server-side, edge-compatible)
- `GET /api/analyze?q=<query>` — Full 6-wave agent pipeline
- `GET /api/news?topic=<id>` — Lightweight fetch + normalize only (no AI analysis)
- Both routes import agents directly (no service layer abstraction)

### 3. Agent Layer (`src/lib/agents/`)
- 6 agent files implementing 10 logical agents
- Each file exports pure functions (no classes, no shared state)
- Agents are numbered by execution order: `01_` through `10_`
- Only `04_ai_summarizer` is async (external API call); all others are synchronous

### 4. Data Flow
```
User clicks topic → fetch(/api/analyze?q=topic)
  → 01_news_fetcher: NewsAPI/GNews/RSS/Fallback → raw articles[]
  → 02_article_normalizer: clean, truncate, add metadata → normalized[]
  → 03_base_intelligence: lookup bias DB + ownership DB → enriched[]
  → 04_ai_summarizer: Claude API or extractive fallback → summary{}
  → 05_derived_metrics: realityScore, perspectives, timeline, diffs
  → 10_payload_builder: stitch everything → UI_PAYLOAD_SCHEMA
  → Response.json(payload)
```

## Entry Points
- **Web:** `src/app/page.js` → renders `<NewsLensApp />`
- **API:** `src/app/api/analyze/route.js` (main pipeline)
- **API:** `src/app/api/news/route.js` (lightweight news fetch)
- **Dev server:** `npm run dev` (Next.js dev server)

## Key Abstractions
- **Agent pattern:** Each agent is a pure function that takes articles in, returns enriched articles out. No shared state, no side effects (except the AI summarizer's API call).
- **Fallback chain:** The news fetcher gracefully degrades through 4 data sources.
- **Bias/Ownership databases:** Static lookup tables in `03_base_intelligence.js` — not persisted, not configurable at runtime.
