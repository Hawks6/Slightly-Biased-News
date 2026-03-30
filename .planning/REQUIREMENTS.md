## Validated

<!-- Shipped and confirmed valuable features that already exist -->
- ✓ Multi-source news fetching with fallback chain
- ✓ Article normalizer pipeline 
- ✓ Bias and ownership resolution
- ✓ Claude AI news summary and perspective breakdown
- ✓ Complex metrics (timeline, diffs, reality composite score)
- ✓ Broadsheet design system tokens

## v1 Requirements

### Core User Journey
- [ ] **CORE-01**: User lands on the homepage and sees a grid of high-level category tiles (e.g., World, Politics, Tech).
- [ ] **CORE-02**: User clicks a category tile to view recent news topics in that category.
- [ ] **CORE-03**: User sees a list of "Event Cards" (not individual articles) representing grouped news stories.
- [ ] **CORE-04**: User clicks an Event Card to load the full bias analysis pipeline specifically for that event's articles.

### Event Clustering Pipeline
- [ ] **CLST-01**: System invokes a new `/api/events` endpoint that fetches top articles for a specific category.
- [ ] **CLST-02**: System passes the raw headlines to the Groq API (Llama 3.3 70B) to cluster them into logical news events.
- [ ] **CLST-03**: System returns a structured payload of events, each containing a neutral AI-generated Title, the count of sources, and the raw articles representing that cluster.
- [ ] **CLST-04**: The clustering process completes within a reasonable timeframe (< 5 seconds) to ensure a smooth UI experience.

### Event Feed UI
- [ ] **UI-01**: Event Cards are displayed with a minimalist broadsheet aesthetic (no images, no descriptions).
- [ ] **UI-02**: Event Cards explicitly display the synthesized event title, the number of sources reporting it, and a "time ago" string.
- [ ] **UI-03**: The UI elegantly handles the loading state while Groq clusters the raw articles.
- [ ] **UI-04**: The application supports a "Back" button flow to return to the category list or the event feed.

### Data Flow Refactoring
- [ ] **ARCH-01**: The existing `/api/analyze` route accepts an explicit array of pre-fetched articles via POST (to avoid double-fetching limits) instead of requiring a `q` generic search query.

## v2 Requirements
- User accounts and saved category preferences.
- Search-based custom event generation (cluster search results into events).
- Full article Reader mode ("Continue reading" feature).

## Out of Scope
- **Real-time clustering websockets**: Simple caching on API routes is adequate for v1. No need for complex pub/sub infrastructures.
- **Nested / Sub-events**: Flat hierarchy ensures a simpler user journey.
- **Claude usage for clustering**: Free-tier Groq minimizes costs while preserving the high intelligence of Llama 3 70B for the easy zero-shot clustering task.

## Traceability
*(To be populated by the roadmap generator)*
