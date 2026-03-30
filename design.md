# Slightly Biased News — Design Document

> "The world's stories, without the agenda."
> Independent · Transparent · Unbiased

---

## 1. Project Overview

*Slightly* Biased News is a bias-aware digital broadsheet SPA (single-file, vanilla JS + CSS) that aggregates news by topic and surfaces cross-source editorial analysis, political lean scores, and funding/ownership transparency. It is currently a fully static frontend with all data hardcoded; the backend (NewsAPI + Groq AI) is stubbed.

---

## 2. Views

The app has two views managed via CSS `display:none` toggling with opacity fade transitions (~350ms). A third article reader view is planned but not yet implemented.

### View 1 — Topic Selector (`#view-selector`)

The landing screen. Full-viewport flex column.

**Sections (top to bottom):**
1. **Masthead** (`.v1-masthead`) — Logo + live date display (`#v1-date-display`)
2. **Statement** (`.v1-statement`) — Headline copy, standfirst, decorative "Choose Your Edition" label
3. **Topic Grid** (`.topic-grid`) — Asymmetric 4-column grid of 8 clickable topic tiles
4. **Search Row** (`.v1-search-row`) — Freetext topic search + "Analyze →" button

**Topic tile layout (grid spans):**

| Topic    | Columns | Rows | Class modifier |
|----------|---------|------|----------------|
| World    | 2       | 2    | `featured`     |
| Politics | 2       | 1    | `featured`     |
| Business | 1       | 1    | —              |
| Tech     | 1       | 1    | —              |
| Climate  | 1       | 1    | —              |
| Science  | 1       | 2    | `featured`     |
| Culture  | 2       | 1    | —              |
| Opinion  | 1       | 1    | —              |

Each tile contains: large decorative number (`.topic-bg-num`), emoji icon, kicker, name, italic description, and a "N sources · bias analysis included" footer.

**Interaction:** Click any tile → `showFeed(topicId)`. Search bar → `handleV1Search()`.

---

### View 2 — Broadsheet Feed (`#view-feed`)

The main reading experience. Entered via `showFeed()`, exited via `goHome()`.

**Chrome (always visible):**
- Breaking ticker (`.ticker-wrap`) — animated marquee strip, hardcoded headlines × 2 for loop
- Sticky masthead (`.masthead`) — logo, nav links (World / Politics / Business / Tech / Science / Opinion), "← All Topics" back link, date
- Breadcrumb bar (`.breadcrumb-bar`) — current topic name, source count, sub-topic filter tabs

**Page layout:**
```
.content-wrap  (max-width: 1280px, padding: clamp)
  └── .main-grid  (grid: 1fr 360px)
        ├── .main-col        ← left column (all article content)
        └── .sidebar-col     ← right column (sticky at top: 112px)
```

**Main column sections (injected by JS into `#main-col`):**

| Section | Component | Layout |
|---|---|---|
| Hero article | `.hero` | 60% image / 40% text grid |
| Secondary stories | `.secondary-row` | 3-column equal grid |
| Bias Intelligence Report | `.bias-section` | Full-width, 3 panels |
| More Stories | `.more-grid` | 44% large card / 56% compact list |
| Source Transparency | `.source-grid` | 3-column equal grid |

**Sidebar sections (static, per-topic data):**

| Section | Element | Notes |
|---|---|---|
| Trending Now | `#trending-list` | 5 items with large ghost number |
| Opinion | `#opinion-list` | 3 cards, first has blue left-border accent |
| Bias Analyzer | `.analyzer-box` | Dark navy box, input + button (currently no-op) |
| Live Updates | `#live-list` | 3 items, pulsing red dot |

---

## 3. Data Architecture

### `TOPICS` array (8 objects)

Each topic object carries all data needed to render the full feed. Shape:

```javascript
{
  id:          string,       // 'world', 'tech', etc.
  label:       string,       // display name
  icon:        string,       // emoji
  num:         string,       // '01' – '08'
  kicker:      string,       // e.g. 'GLOBAL AFFAIRS'
  span:        string,       // legacy CSS class string (unused — layout now via layoutMap)
  desc:        string,       // tile description
  sources:     number,       // count shown in breadcrumb
  query:       string,       // NewsAPI search query (for future backend)

  // Bias Intelligence Report
  biasData:    [ { source, score, color } ],
  realityScore: number,      // 0-100
  reliability:  number,      // 0-100
  diversity:    number,      // 0-100
  crossRef:     number,      // 0-100
  summary:      string,
  takeaways:    string[],    // 3-4 items, format: "Source & Source: observation"

  // Article sections
  hero:        { title, deck, author, source, time, kicker },
  secondary:   [ { title, deck, author, source, time, kicker, img? } ], // 3 items
  more:        [ { title, deck?, author, source, time, kicker, img? } ], // 4 items

  // Sidebar
  trending:    [ { headline, reads } ],   // 5 items
  opinions:    [ { initials, name, title, quote } ], // 3 items
  live:        [ { time, headline } ],    // 3 items
}
```

### `SOURCES` array (6 objects)

Static registry for the Source Transparency panel:

```javascript
{
  name:          string,   // 'BBC', 'Reuters', etc.
  flag:          string,   // emoji flag
  funding:       string,   // 'Public' | 'Private Corp.' | 'State-Funded' | 'Non-profit Co-op'
  fundingColor:  string,   // badge background hex
  fundingText:   string,   // badge text hex
  owner:         string,
  founded:       number,
  detail:        string,   // italic description
  bias:          number,   // -1.0 to +1.0
  trust:         number,   // 0-100
}
```

---

## 4. Rendering Functions

All rendering is pure string interpolation — no framework, no virtual DOM.

| Function | Output | Trigger |
|---|---|---|
| `renderTopicGrid()` | Injects tiles into `#topic-grid` | `DOMContentLoaded` |
| `showFeed(topicId)` | Transitions to View 2, calls `buildFeed` | Tile click / search |
| `goHome()` | Transitions back to View 1 | Logo / back link click |
| `buildFeed(topic)` | Updates chrome, calls all builders | `showFeed` |
| `buildMainCol(topic)` | Injects all 5 main sections | `buildFeed` |
| `renderHero(topic)` | Returns hero HTML string | `buildMainCol` |
| `renderSecondaryRow(topic)` | Returns 3-card row HTML | `buildMainCol` |
| `renderBiasSection(topic, rc)` | Returns full bias panel HTML | `buildMainCol` |
| `renderBiasChart(biasData)` | Returns inline SVG string | `renderBiasSection` |
| `renderMoreStories(topic)` | Returns large+compact grid HTML | `buildMainCol` |
| `renderSourceTransparency()` | Returns 6-card grid HTML (always from `SOURCES`) | `buildMainCol` |
| `buildTrending(topic)` | Injects into `#trending-list` | `buildFeed` |
| `buildOpinion(topic)` | Injects into `#opinion-list` | `buildFeed` |
| `buildLive(topic)` | Injects into `#live-list` | `buildFeed` |

---

## 5. Utility Functions

```javascript
getDate()             // → "Monday, 30 March 2026" (en-GB locale)
imgUrl(seed, w, h)    // → picsum.photos URL (placeholder, to be replaced by real images)

biasColor(score)      // score → hex color
  ≤ -0.3  →  #DC2626  (red)
  ≤ -0.1  →  #EF4444  (red-light)
  ≤  0.1  →  #CA8A04  (amber)
  ≤  0.3  →  #3B82F6  (blue)
  else    →  #1D4ED8  (blue-dark)

biasLabel(score)      // score → string label
  ≤ -0.6  →  'Far Left'
  ≤ -0.3  →  'Left'
  ≤ -0.1  →  'Left-Center'
  ≤  0.1  →  'Center'
  ≤  0.3  →  'Right-Center'
  ≤  0.6  →  'Right'
  else    →  'Far Right'

realityColors(score)  // score → { bg, text } hex pair
  ≥ 70  →  { bg: '#E8F5E9', text: '#2E7D32' }  (green)
  ≥ 40  →  { bg: '#FFF8E1', text: '#F57F17' }  (amber)
  else  →  { bg: '#FFEBEE', text: '#C62828' }  (red)

realityLabel(score)   // score → 'High / Medium / Low Reliability'
```

---

## 6. Design Tokens

```css
/* ── Colors ─────────────────────────── */
--bg-page:      #F7F5F0   /* warm parchment — page background */
--bg-surface:   #FFFFFF   /* card/panel backgrounds */
--bg-sidebar:   #F4F2ED   /* defined, not currently used inline */
--bg-nav:       #00153c   /* deep guardian navy — masthead, analyzer */
--bg-dark:      #121212   /* near-black — footer */

--text-primary:   #121212
--text-secondary: #3D3D3D
--text-muted:     #6B6B6B

--accent-brand:   #052962  /* guardian blue — interactive, section rules, sidebar */
--accent-red:     #990000  /* breaking news, live badge, es-watch border */
--accent-kicker:  #A11D21  /* kicker labels */
--accent-green:   #2E7D32  /* section-hd.green (unused in current topics) */

--rule-line:  #DCDCDC   /* light dividers */
--rule-heavy: #121212   /* bold section top-borders */

/* ── Typography ─────────────────────── */
--font-display: 'DM Serif Display', serif   /* headlines, numbers, logo */
--font-body:    'Newsreader', serif          /* article text, decks, italic copy */
--font-ui:      'DM Sans', sans-serif        /* labels, nav, badges, UI chrome */
```

**Type scale (key sizes):**

| Element | Font | Size | Weight | Style |
|---|---|---|---|---|
| Logo (V1) | Display | 30px | — | — |
| Logo (Feed) | Display | 28px | — | — |
| V1 headline | Display | clamp(38px, 5.5vw, 68px) | — | — |
| Hero headline | Display | clamp(26px, 3.5vw, 42px) | — | — |
| Sec. headline | Display | 20px | — | — |
| More (large) | Display | 22px | — | — |
| Reality score | Display | 52px | — | — |
| Hero deck | Body | 16px | 300 | italic |
| Source detail | Body | 11px | — | italic |
| Nav links | UI | 13px | 500 | — |
| Kicker | UI | 10px | 700 | uppercase, 0.16em tracking |
| Source badge | UI | 9px | 700 | uppercase, 0.08em tracking |

---

## 7. Layout System

### Responsive breakpoints

```
≥ 1024px  — Full 2-column layout (content + 360px sidebar)
< 1024px  — Stacked single column; sidebar below content; topic grid → 2 columns
< 768px   — Hero stacks vertically; secondary/source grids → 1 col; masthead nav hidden
```

### Key spacing

- Content max-width: `1280px`
- Horizontal padding: `clamp(16px, 3vw, 48px)` (content) / `clamp(16px, 3vw, 80px)` (topic grid)
- Main column right padding: `40px`
- Sidebar left padding: `32px`
- Sidebar sticky top offset: `112px` (masthead 64px + breadcrumb 44px + 4px border)

---

## 8. Bias Intelligence Report — Panel Anatomy

```
.bias-section
  ├── label row ("BIAS INTELLIGENCE REPORT · Powered by *Slightly* Biased News AI")
  │
  ├── .editorial-summary  [F1 — Full width]
  │     ├── header: "Editorial Summary" + realityScore pill (color-coded)
  │     ├── divider
  │     ├── .es-body  — 2-3 sentence summary paragraph
  │     ├── .es-takeaways-label
  │     ├── .es-takeaway × N  — "› Source & Source: observation" rows
  │     └── .es-watch  — red left-border italic watch note
  │
  └── .bias-bottom-row  [F2 + F3 — 58% / 42% grid]
        ├── .bias-chart-panel  [F2]
        │     ├── heading + subheading
        │     ├── .chart-area  — inline SVG bar chart (viewBox 400×150)
        │     │     ├── zero line at y=midpoint
        │     │     ├── bars above zero = right-leaning, below = left-leaning
        │     │     └── score value + source label per bar
        │     └── .bias-legend  — Left / Center / Right color key
        │
        └── .reality-panel  [F3]
              ├── large score number + /100 denom
              ├── reliability label (color from realityColors)
              └── 3× score bars: Source Reliability / Source Diversity / Cross-Reference
```

---

## 9. SVG Bias Chart Spec

- ViewBox: `0 0 400 150`
- Padding: L=36, R=10, T=20, B=30
- Bar width: 30px, gap auto-distributed across chart width
- Zero line: `y = padT + scaleH/2` (vertical center)
- Bar direction: `score < 0` → bar extends downward; `score ≥ 0` → upward
- Bar height: `Math.abs(score) * scaleH/2` (±1.0 = full half-height)
- Minimum bar height: 2px (for score === 0)
- Value label: above bar if right-leaning, below if left-leaning
- Source label: always at `y = H - 6` (bottom of chart)

---

## 10. Animations

| Name | Element | Behaviour |
|---|---|---|
| `ticker` | `.ticker-track` | `translateX(0 → -50%)`, 35s linear infinite |
| `pulse-badge` | `.live-badge`, `.live-dot` | opacity 1→0.5→1, 1.5s / 1.2s infinite |
| View transition | `#view-selector`, `#view-feed` | opacity 0→1, 350ms, via setTimeout |
| Score bar fill | `.score-bar-fill` | `width` CSS transition, 0.6s ease |

---

## 11. Missing Functionalities (Implementation Backlog)

| # | Feature | Status | Notes |
|---|---|---|---|
| 1 | NewsAPI integration — real articles | ❌ Stub | `imgUrl()` uses picsum; all article data is hardcoded in TOPICS |
| 2 | Claude bias analysis endpoint | ❌ Stub | `renderBiasSection` uses hardcoded TOPICS data |
| 3 | Bias Analyzer sidebar search | ❌ No-op | `handleAnalyzerSearch()` only updates the breadcrumb label |
| 4 | Masthead nav link filtering | ❌ Partial | Links highlight but no article sub-filtering occurs |
| 5 | Real article images | ❌ Placeholder | All `<img>` src from `picsum.photos` seeded with topic id |
| 6 | Dynamic breaking ticker | ❌ Hardcoded | 8 static headlines duplicated twice for CSS loop |
| 7 | Article reader (View 3) | ❌ Missing | "Continue reading →" and all article links go to `href="#"` |
| 8 | Breadcrumb tab sub-filtering | ❌ Partial | Tab click calls full `buildFeed` — no category filtering |
| 9 | Pagination / infinite scroll | ❌ Missing | "See all →" links to `#` |
| 10 | Source Transparency — dynamic per topic | ❌ Static | Always renders the same 6 SOURCES regardless of topic |

---

## 12. Target File Structure (After Backend)

```
Slightly-Biased-News/
├── index.html                    # SPA frontend (single file, do not split)
├── package.json
├── .env                          # NEWSAPI_KEY, ANTHROPIC_API_KEY, PORT
├── .env.example
├── design.md                     # this file
└── src/
    ├── server.js                 # Express entry — serves index.html + mounts routes
    ├── routes/
    │   ├── news.js               # GET /api/news?topic=&page=
    │   └── analyze.js            # POST /api/analyze
    ├── services/
    │   ├── newsapi.js            # NewsAPI client + response normalizer
    │   └── claude.js             # Anthropic SDK wrapper + prompt builder
    ├── middleware/
    │   └── error.js              # Global Express error handler
    └── utils/
        ├── bias.js               # biasColor, biasLabel, realityColors (mirrored from frontend)
        └── sources.js            # SOURCES registry (extracted from index.html)
```

---

## 13. API Contracts (Target)

### `GET /api/news`

```
Query params:
  topic  string   — topic id or freetext
  page   number   — default 1

Topic → NewsAPI query mapping:
  world    → "world news international"
  politics → "politics government elections"
  business → "business markets economy"
  tech     → "technology AI innovation"
  climate  → "climate change environment"
  science  → "science discovery research"
  culture  → "culture arts entertainment"
  opinion  → "opinion analysis editorial"
  <other>  → use string as-is

Response 200:
{
  articles: [{
    id, title, deck, author,
    source: { id, name },
    url, urlToImage, publishedAt, kicker
  }],
  totalResults: number,
  topic: string
}
Response 502: { error: "upstream_error", message: string }
Response 503: { error: "no_api_key" }
```

### `POST /api/analyze`

```
Body: {
  topic:    string,
  articles: [{ title, source: { name }, description }]
}

Response 200:
{
  summary:      string,
  takeaways:    string[],
  biasData:     [{ source, score, color }],
  realityScore: number,
  reliability:  number,
  diversity:    number,
  crossRef:     number
}
Response 502: { error: "analysis_failed" }
Response 503: { error: "no_api_key" }
```

---

## 14. Frontend Wiring Plan (index.html `<script>` changes only)

```javascript
// Add at top of script block:
const API_BASE = 'http://localhost:3000';

async function fetchNews(topicId) {
  const res = await fetch(`${API_BASE}/api/news?topic=${topicId}`);
  if (!res.ok) throw new Error('news_fetch_failed');
  return res.json();
}

async function fetchAnalysis(topicId, articles) {
  const res = await fetch(`${API_BASE}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic: topicId, articles })
  });
  if (!res.ok) throw new Error('analysis_failed');
  return res.json();
}

// Modify showFeed(topicId) to:
// 1. Show loading skeleton in #main-col (min 300ms)
// 2. const [newsData, analysis] = await Promise.all([fetchNews, fetchAnalysis])
// 3. Map articles: [0] → hero, [1..3] → secondary, [4..8] → more
// 4. Merge with static TOPICS[topicId] for: trending, opinions, live, kickers
// 5. Call buildFeed(mergedTopic)
// 6. On any fetch error: console.warn + fall back to static TOPICS data

// Modify renderHero / renderSecondaryRow to use article.urlToImage
// (fall back to imgUrl(seed) if null)

// On DOMContentLoaded: fetch world news for ticker update
```