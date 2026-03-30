# Architecture Research: Event-First Integration

## Component Boundaries
The shift to an event-first model requires inserting a new layer between the `TopicSelector` and the `BroadsheetFeed` (article analysis).

1. **Category Level:** User selects a category (e.g., "Politics").
2. **Event Feed Level (NEW):** Fetches ~30-50 top headlines for the category. Sends to Groq. Groq returns `[ { eventName, sourceCount, articles: [] } ]`. UI renders minimal title cards.
3. **Analysis Level (EXISTING):** User clicks an event. The UI passes the specific articles for that cluster to the existing 10-agent pipeline to generate bias, timeline, and diff metrics.

## Data Flow
```
Client (Click "Politics") 
  → GET /api/events?topic=politics
  → Server fetches 50 raw articles (NewsAPI/GNews)
  → Server calls Groq API with system prompt to cluster titles into Events
  → Groq returns JSON array of Events
  → Server returns Events to Client
  → Client renders Event Cards
  
Client (Click Event "Fed Rate Cut")
  → Client sends event's raw articles to /api/analyze (Modification required here to bypass fetching again)
  → Analyze API runs normalizers, bias DB, summarizer, derived metrics
  → Returns UI Payload
  → Client renders BroadsheetFeed
```

## Build Order Implications
1. Build the `/api/events` clustering endpoint first using Groq.
2. Build the `EventFeed` UI view (View 1.5).
3. Modify `/api/analyze` to accept an array of raw articles directly (instead of a search query), so it doesn't have to re-fetch what the cluster already found.
