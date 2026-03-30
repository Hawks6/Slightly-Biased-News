<!-- GSD:project-start source:PROJECT.md -->
## Project

**NewsLens**

NewsLens is an event-first news bias analysis platform. Instead of showing individual articles, it clusters related coverage into "news events" and lets users see how each event is framed across the political spectrum. The three-level architecture — Categories → Events → Analysis — gives users a broadsheet-style experience with AI-powered editorial intelligence underneath.

**Core Value:** When a user clicks a news event, they see the full bias analysis across all sources covering that story — how left, center, and right media frame the same facts differently.

### Constraints

- **AI clustering:** Must use Groq free tier (Llama 3.3 70B) for event clustering — no paid API calls for this feature
- **Tech stack:** Build on top of existing Next.js/React architecture — no framework migration
- **Design:** Follow the established broadsheet design system tokens in `globals.css`
- **API keys:** All external API keys must remain optional with graceful fallback behavior
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Runtime & Language
- **Runtime:** Node.js (implied by Next.js 15)
- **Language:** JavaScript (ES Modules via Next.js, no TypeScript)
- **JSX dialect:** React JSX (`.jsx` files in `src/components/`)
## Framework
- **Next.js 15.3** — App Router (`src/app/` directory structure)
## Frontend Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.0.0 | UI library |
| `react-dom` | ^19.0.0 | DOM rendering |
| `recharts` | ^2.15.0 | Charts (BarChart, PieChart for bias visualization) |
| `lucide-react` | ^0.468.0 | Icon library (Search, Shield, TrendingUp, etc.) |
| `clsx` | ^2.1.1 | Conditional className utility |
## Styling
- **Tailwind CSS v4** via `@tailwindcss/postcss` PostCSS plugin
- Custom design tokens defined in `globals.css` using `@theme` directive
- Three-font typography system:
- Fonts loaded via Google Fonts `<link>` tags in `layout.js`
## Backend / Server Dependencies (devDependencies used at build/runtime)
| Package | Version | Purpose |
|---------|---------|---------|
| `@extractus/article-extractor` | ^8.0.20 | Full-text article extraction from URLs |
| `cheerio` | ^1.2.0 | HTML/XML parsing (RSS feeds, HTML stripping) |
## Dev Tooling
| Package | Version | Purpose |
|---------|---------|---------|
| `eslint` | ^9.0.0 | Linting |
| `eslint-config-next` | ^15.3.0 | Next.js ESLint rules |
| `tailwindcss` | ^4.0.0 | CSS framework (via PostCSS) |
## Configuration Files
- `next.config.mjs` — Empty/default Next.js config
- `postcss.config.mjs` — Registers `@tailwindcss/postcss` plugin
- `jsconfig.json` — Path alias: `@/*` → `./src/*`
- `.env.example` — Documents required environment variables
- `.gitignore` — Standard Next.js ignores
## Environment Variables
| Variable | Required | Purpose |
|----------|----------|---------|
| `NEWSAPI_KEY` | Optional | NewsAPI.org API key for article fetching |
| `GNEWS_KEY` | Optional | GNews.io API key (secondary source) |
| `ANTHROPIC_API_KEY` | Optional | Anthropic Claude API for AI-powered summaries |
## Build & Run Scripts
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Language & Module Style
- **Plain JavaScript** — no TypeScript
- **ES Modules** throughout (`import`/`export`, not `require`)
- **React 19** with function components and hooks only (no class components)
- **`"use client"`** directive used for interactive components
## Component Patterns
### Inline Sub-Components
### State Management
- Local `useState` only — no global state management library
- `useCallback` for memoized event handlers
- `useEffect` for side-effect data fetching (e.g., trending ticker)
- State machine via string enum: `activeView: "selector" | "feed"`
### Styling Approach
- **Hybrid:** Tailwind utility classes + inline `style={{ }}` for design token references
- Design tokens are CSS custom properties defined in `globals.css` via `@theme`
- Custom CSS classes for reusable patterns (`.glass-card`, `.bias-left`, `.animate-fade-in-up`)
- `clsx()` used for conditional class composition
## Agent Patterns
### Pure Function Convention
### Fallback Chain Pattern
### HTML Sanitization
## Error Handling
### API Routes
- Try/catch at the route handler level
- Structured error responses: `{ error: string }` with appropriate HTTP status codes
- `console.error` for server-side logging
- No custom error classes or middleware
### Frontend
- Error state managed via `useState(null)` with conditional rendering
- Visual error banner with `AlertTriangle` icon
- No error boundary components
## Naming Conventions
| Element | Convention | Example |
|---------|-----------|---------|
| Component functions | PascalCase | `BroadsheetFeed`, `TopicSelector` |
| Agent files | `NN_snake_case.js` | `01_news_fetcher.js` |
| CSS custom properties | `--color-*`, `--font-*` | `--color-accent-brand` |
| CSS utility classes | kebab-case | `.glass-card`, `.bias-left` |
| API routes | kebab-case directories | `/api/analyze/route.js` |
| Constants | UPPER_SNAKE_CASE | `BIAS_DATABASE`, `FALLBACK_ARTICLES` |
| State variables | camelCase | `activeView`, `isLoading` |
## Import Organization
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern: Multi-Agent Pipeline with Monolithic Frontend
```
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
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
