# Project Roadmap

## Phase 1: Event API & Clustering Logic
**Goal:** Establish the new backend route (`/api/events`) to fetch top raw articles and group them logically into distinct news events using the Groq Llama 3 API.

**Requirements:**
- CLST-01: `/api/events` route structure.
- CLST-02: Integration of `groq-sdk` with strict system prompt and Zod schema validation for event output.
- CLST-03: Returning a minimal payload of events, titles, sources, and grouped raw articles.
- CLST-04: Process finishes within acceptable bounds (<5s).

**Success Criteria:**
1. A direct API call to `/api/events?category=politics` returns a valid JSON array of events containing actual, non-hallucinated article data.
2. Grouping strictly adheres to similarity rules (no disparate articles randomly bunched together).
3. The response time holds up relatively well with ~30-50 fetched articles.

**Verification command:** `curl "http://localhost:3000/api/events?category=politics"`

---

## Phase 2: App Data Flow Refactoring
**Goal:** Modify the core `/api/analyze` 10-agent pipeline to accept an explicit array of pre-fetched articles via POST to prevent double-fetching limits from NewsAPI and unify the payload sequence.

**Requirements:**
- ARCH-01: Update `api/analyze/route.js` to parse POST JSON bodies containing an `articles: []` array, bypassing `01_news_fetcher` locally.
- CORE-04 (partial): Guaranteeing that passing the grouped event articles correctly runs through normalizers, bias DB, summarizer, timeline, diffs, and payload builder seamlessly.

**Success Criteria:**
1. Sending a POST with mock raw articles yields a fully constructed UI dashboard payload without hitting NewsAPI.
2. The legacy `GET /api/analyze?q=query` logic remains intact or throws a deprecation error.
3. No internal agent breaks from the payload shift.

---

## Phase 3: Event-First UI Migration
**Goal:** Implement the three-level navigation (Categories → Event Feed → Analysis Data) using minimalist layout designs in `NewsLensApp.jsx`.

**Requirements:**
- CORE-01: Grid of high-level category tiles on the main view.
- CORE-02: Clicking a category fetches and reveals the middle "Event Feed" view.
- CORE-03: Populate minimal event cards.
- UI-01: Minimal absolute design for event cards.
- UI-02: Title, count, explicit recency.
- UI-03: Spinners/loading skeletons while Groq works.
- UI-04: "Back" navigation.

**Success Criteria:**
1. Users see the new topic selector grid. Clicking "Tech" brings up ~8 distinct minimal event cards, fetching live via `/api/events`.
2. Users see a clean loading view while clustering resolves.
3. Clicking a single event card smoothly sends the POST to `/api/analyze` and transitions the view into the existing Broadsheet Pipeline dashboard exactly for those stories.
4. Users can hit the back button to view other tech events.

## Traceability

| Requirement ID | Mapped Phase | Status |
|----------------|--------------|--------|
| CORE-01 | Phase 3 | Pending |
| CORE-02 | Phase 3 | Pending |
| CORE-03 | Phase 3 | Pending |
| CORE-04 | Phase 2, 3 | Pending |
| CLST-01 | Phase 1 | Pending |
| CLST-02 | Phase 1 | Pending |
| CLST-03 | Phase 1 | Pending |
| CLST-04 | Phase 1 | Pending |
| UI-01 | Phase 3 | Pending |
| UI-02 | Phase 3 | Pending |
| UI-03 | Phase 3 | Pending |
| UI-04 | Phase 3 | Pending |
| ARCH-01 | Phase 2 | Pending |
