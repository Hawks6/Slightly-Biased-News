# *Slightly* Biased News — Antigravity Agent Prompts

Three sequential prompts. Run them in order — each prompt builds on the previous one.

---

## PROMPT 1 — Backend: NewsAPI + Express Server

```
[CONTEXT]
Project: Slightly-Biased-News — a bias-aware news reader SPA.
Repo: https://github.com/Hawks6/Slightly-Biased-News
Current state: Single index.html with all data hardcoded in a TOPICS array.
Footer says "Built with NewsAPI & Claude AI" — neither is wired up yet.

Target file structure after this task:
  Slightly-Biased-News/
  ├── index.html            (existing — do NOT modify)
  ├── package.json          (create)
  ├── .env.example          (create)
  ├── src/
  │   ├── server.js         (create — Express entry point)
  │   ├── routes/
  │   │   └── news.js       (create — GET /api/news)
  │   ├── services/
  │   │   └── newsapi.js    (create — NewsAPI client + response normalizer)
  │   ├── middleware/
  │   │   └── error.js      (create — global error handler)
  │   └── utils/
  │       └── sources.js    (create — static source registry, extracted from SOURCES array in index.html)

Stack: Node.js 20, Express 4, node-fetch or axios for HTTP, dotenv, cors.
Environment vars needed: NEWSAPI_KEY, PORT (default 3000).

[TASK]
Scaffold the Express backend and implement GET /api/news.

The endpoint must:
1. Accept query params: `topic` (string) and `page` (number, default 1)
2. Map the `topic` param to a search query — use this mapping:
   world → "world news international"
   politics → "politics government elections"
   business → "business markets economy"
   tech → "technology AI innovation"
   climate → "climate change environment"
   science → "science discovery research"
   culture → "culture arts entertainment"
   opinion → "opinion analysis editorial"
   <any other string> → use as-is (freetext search)
3. Call NewsAPI /everything with: q=<mapped query>, pageSize=9, page=<page>,
   sortBy=publishedAt, language=en
4. Normalize each article to this shape:
   {
     id:          string (md5 of url or use index),
     title:       string,
     deck:        string  (description, truncated to 200 chars),
     author:      string  (default "Staff Reporter" if null),
     source:      { id: string, name: string },
     url:         string,
     urlToImage:  string  (null if missing),
     publishedAt: string  (ISO 8601),
     kicker:      string  (derive from source.name — e.g. "BBC" → "BBC · World")
   }
5. Return: { articles: [...], totalResults: number, topic: string }
6. On NewsAPI error or empty results, return 502 with { error: "upstream_error", message: string }

Also serve index.html statically from the project root at GET /.

[MCP TOOLS]
- Filesystem MCP: read index.html to extract the SOURCES array and reuse it verbatim
  in src/utils/sources.js — do not retype it manually.

[CONSTRAINTS]
- Do NOT modify index.html — backend is additive only at this stage.
- Use CommonJS (require/module.exports), not ESM, unless package.json already uses "type":"module".
- NewsAPI free tier only allows publishedAt sorting and English language — do not add params
  that will 402 on free keys.
- CORS must be open (cors()) so index.html served from any origin can call the API during dev.
- No TypeScript at this stage — plain JS with JSDoc comments for type hints.
- Add a /health GET endpoint returning { status: "ok", uptime: <seconds> } for debugging.

[SUCCESS CRITERIA]
- npm start launches the server without errors on port 3000.
- GET http://localhost:3000/api/news?topic=tech returns a JSON response with articles[].length === 9.
- GET http://localhost:3000/api/news?topic=artificial+intelligence returns results for freetext search.
- GET http://localhost:3000/ serves index.html.
- GET http://localhost:3000/health returns { status: "ok" }.
- Missing NEWSAPI_KEY logs a clear startup warning and returns 503 from /api/news.
```

---

## PROMPT 2 — Backend: Claude Bias Analysis Endpoint

```
[CONTEXT]
Project: Slightly-Biased-News Express backend (see Prompt 1 — must be complete first).
Repo: https://github.com/Hawks6/Slightly-Biased-News

Existing files relevant to this task:
  src/server.js           — Express app, already has /api/news and /health
  src/utils/sources.js    — static source registry with bias scores per source name
  src/middleware/error.js — global error handler pattern to follow

New files to create:
  src/routes/analyze.js   — POST /api/analyze route handler
  src/services/claude.js  — Anthropic SDK wrapper + prompt builder

Stack: Node.js 20, Express 4, @anthropic-ai/sdk, dotenv.
New env var needed: ANTHROPIC_API_KEY.

[TASK]
Implement POST /api/analyze — the Claude-powered bias analysis endpoint.

Request body:
  {
    topic:    string,
    articles: [ { title: string, source: { name: string }, description: string } ]
  }

The endpoint must:
1. Build a structured prompt from the articles list and send it to Claude
   (claude-haiku-4-5 for cost; fallback to claude-3-5-haiku-20241022 if not available).
2. Instruct Claude to respond ONLY with a valid JSON object — no preamble, no markdown fences.
3. The JSON Claude must return:
   {
     summary:      string,   // 2-3 sentence editorial overview
     takeaways:    string[], // 3-4 bullet strings, format: "Source1 & Source2: observation"
     realityScore: number,   // 0-100
     reliability:  number,   // 0-100 — source credibility composite
     diversity:    number,   // 0-100 — range of source perspectives
     crossRef:     number    // 0-100 — claim overlap across sources
   }
4. After getting Claude's response, compute biasData[] server-side by looking up each
   unique source name in sources.js and returning:
   biasData: [ { source: string, score: number, color: string } ]
   Use the biasColor logic already in the frontend (copy it to src/utils/bias.js).
5. Return the merged object: { ...claudeJson, biasData }.
6. If Claude returns malformed JSON, retry once. On second failure, return 502.

Register the route in server.js as: app.use('/api/analyze', require('./routes/analyze')).

[MCP TOOLS]
- Filesystem MCP: read src/utils/sources.js to get the bias score lookup table before
  writing src/services/claude.js — do not hardcode scores.
- Filesystem MCP: read src/middleware/error.js to follow the existing error-handling pattern.

[CONSTRAINTS]
- Use claude-haiku-4-5 (cheap, fast) — this endpoint is called on every topic load.
- max_tokens: 800 — the response shape is small; cap it to control cost.
- The Claude prompt must explicitly say: "Respond ONLY with a JSON object. No markdown.
  No explanation. Start your response with { and end with }."
- Do NOT pass raw article body text to Claude — titles + descriptions only (privacy + cost).
- Missing ANTHROPIC_API_KEY must log a startup warning and return 503 from /api/analyze.
- biasColor thresholds must match the frontend exactly:
    score ≤ -0.3 → #DC2626, score ≤ -0.1 → #EF4444,
    score ≤ 0.1  → #CA8A04, score ≤ 0.3  → #3B82F6, else → #1D4ED8

[SUCCESS CRITERIA]
- POST /api/analyze with a body of 5+ article objects returns valid JSON matching the
  schema above within 10 seconds.
- biasData[] is populated for all sources present in the sources registry.
- Sources not in the registry are included with score: 0 (center) and color: #CA8A04.
- Malformed Claude response triggers exactly one retry before 502.
- ANTHROPIC_API_KEY missing → 503, not a crash.
```

---

## PROMPT 3 — Frontend: Wire index.html to the Live Backend

```
[CONTEXT]
Project: Slightly-Biased-News — single-file SPA (index.html).
Repo: https://github.com/Hawks6/Slightly-Biased-News

Backend is now running (Prompts 1 & 2 complete):
  GET  /api/news?topic=<id>&page=<n>  → { articles[], totalResults, topic }
  POST /api/analyze { topic, articles } → { summary, takeaways, biasData[], realityScore,
                                             reliability, diversity, crossRef }

Key functions in index.html that currently use hardcoded TOPICS data:
  showFeed(topicId)         — called when a topic tile is clicked
  buildFeed(topic)          — calls buildMainCol, buildTrending, buildOpinion, buildLive
  buildMainCol(topic)       — renders hero + secondary + bias section + more stories
  handleV1Search()          — search bar on View 1
  handleAnalyzerSearch()    — sidebar bias analyzer search
  renderHero(topic)         — uses topic.hero (hardcoded object)
  renderSecondaryRow(topic) — uses topic.secondary[] (hardcoded array)
  renderBiasSection(topic)  — uses topic.biasData, summary, takeaways, realityScore, etc.
  renderMoreStories(topic)  — uses topic.more[] (hardcoded array)

[TASK]
Replace all hardcoded TOPICS data usage with live API calls, while keeping the static
TOPICS array as a fallback/skeleton for UI layout (kicker labels, topic metadata, etc.).

Specifically:
1. Add a fetchNews(topicId) async function that calls GET /api/news?topic=<topicId>
   and returns the normalized articles array.
2. Add a fetchAnalysis(topicId, articles) async function that calls POST /api/analyze
   and returns the bias analysis object.
3. Modify showFeed(topicId) to:
   a. Show a loading skeleton in #main-col while fetching (add a simple .loading-skeleton
      CSS rule: animated grey bar placeholder matching section heights).
   b. Await both fetchNews and fetchAnalysis in parallel (Promise.all).
   c. Map the API articles to the shape buildMainCol/renderHero etc. expect:
      - articles[0] → hero
      - articles[1..3] → secondary[]
      - articles[4..8] → more[]
   d. Merge the analysis response (summary, takeaways, biasData, realityScore, etc.)
      with the static TOPICS entry for that topicId to supply any missing fields
      (trending, opinions, live — these stay static for now).
   e. Call buildFeed with the merged object.
4. Modify handleV1Search() and handleAnalyzerSearch() to use the same fetch + merge flow.
5. Replace picsum.photos image URLs with article.urlToImage in renderHero and
   renderSecondaryRow. If urlToImage is null, fall back to picsum with a content-hash seed.
6. Update the breaking ticker (#ticker-track) to display the first 5 article titles
   from the world topic on page load (fetch once at DOMContentLoaded).

Do NOT change any CSS, HTML structure, or rendering functions — only modify the data
layer (fetch calls and the data assembly before buildFeed is called).

[MCP TOOLS]
- Filesystem MCP: read index.html before editing — specifically the showFeed, buildFeed,
  renderHero, renderSecondaryRow, and handleV1Search functions to understand current data shape.

[CONSTRAINTS]
- Keep the static TOPICS array intact — it is still needed for topic metadata
  (id, label, icon, kicker, desc, sources count, trending, opinions, live).
- API base URL must be read from a const API_BASE = 'http://localhost:3000' at the top
  of the <script> block — do not hardcode it inline.
- Graceful degradation: if fetchNews fails (network error or non-200), fall back to
  the existing hardcoded TOPICS data and log a console.warn.
- The loading skeleton must be removed (and real content shown) before the user can
  see a blank column — use a minimum 300ms display time on the skeleton.
- Do not introduce any npm dependencies into index.html — plain fetch() only.

[SUCCESS CRITERIA]
- Clicking any topic tile fetches real articles from NewsAPI and renders them in the hero,
  secondary row, and more stories sections within 3 seconds on a normal connection.
- The Bias Intelligence Report panel shows Claude-generated summary and takeaways
  (visibly different from the hardcoded strings).
- Article images from NewsAPI appear in hero and secondary cards where urlToImage is present.
- The breaking ticker displays real article titles from the world news fetch.
- The sidebar (trending, opinion, live) still renders from static data — no regression.
- If /api/news is unreachable, the UI falls back silently and shows the hardcoded topic data.
- No console errors on load (only the expected console.warn on fallback).
```
