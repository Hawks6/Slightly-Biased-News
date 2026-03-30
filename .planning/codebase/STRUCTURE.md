# Directory Structure

```
slightly-biased-news/
├── .env.example                    # Environment variable documentation
├── .gitignore                      # Standard Next.js ignores
├── README.md                       # Project readme
├── agent-prompts.md                # Original 3-prompt scaffold spec (historical)
├── design.md                       # UI/UX design system specification
├── jsconfig.json                   # Path aliases (@/* → ./src/*)
├── next.config.mjs                 # Next.js config (empty/default)
├── package.json                    # Dependencies and scripts
├── package-lock.json               # Lockfile
├── postcss.config.mjs              # PostCSS with Tailwind CSS v4
│
├── .planning/                      # GSD planning artifacts
│   └── codebase/                   # Codebase mapping documents (this directory)
│
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── globals.css             # Global styles, design tokens, animations
│   │   ├── layout.js               # Root HTML layout (fonts, metadata)
│   │   ├── page.js                 # Root page (renders NewsLensApp)
│   │   └── api/
│   │       ├── analyze/
│   │       │   └── route.js        # GET /api/analyze — Full agent pipeline
│   │       └── news/
│   │           └── route.js        # GET /api/news — Lightweight news fetch
│   │
│   ├── components/
│   │   └── NewsLensApp.jsx         # Monolithic UI component (~1100 lines)
│   │                               #   Contains: TopicSelector, TopicSelectorSearch,
│   │                               #   TrendingTicker, SearchBar, TopicTabs,
│   │                               #   AgentStatusBar, BroadsheetFeed, MetaStrip,
│   │                               #   SummaryCard, BiasDistributionChart,
│   │                               #   RealityScoreBreakdown, PerspectivesPanel,
│   │                               #   TimelinePanel, DiffsPanel, SourceCards
│   │
│   └── lib/
│       └── agents/                 # Multi-agent pipeline modules
│           ├── 01_news_fetcher.js      # News source aggregator (233 lines)
│           ├── 02_article_normalizer.js # Data cleaning/standardization (68 lines)
│           ├── 03_base_intelligence.js  # Bias + ownership lookup (91 lines)
│           ├── 04_ai_summarizer.js      # Claude AI / extractive fallback (137 lines)
│           ├── 05_derived_metrics.js    # Reality score, perspectives, timeline, diffs (292 lines)
│           └── 10_payload_builder.js    # Final JSON assembly (112 lines)
```

## Key Locations

| What | Where |
|------|-------|
| Design tokens & CSS variables | `src/app/globals.css` (lines 3-35) |
| Font loading | `src/app/layout.js` (lines 14-19) |
| SEO metadata | `src/app/layout.js` (lines 3-8) |
| Main UI component | `src/components/NewsLensApp.jsx` |
| API orchestrator | `src/app/api/analyze/route.js` |
| Bias rating database | `src/lib/agents/03_base_intelligence.js` (lines 9-30) |
| Ownership database | `src/lib/agents/03_base_intelligence.js` (lines 32-50) |
| Fallback article data | `src/lib/agents/01_news_fetcher.js` (lines 10-91) |
| Claude AI integration | `src/lib/agents/04_ai_summarizer.js` (lines 7-60) |
| Design specification | `design.md` (root) |
| Agent prompt history | `agent-prompts.md` (root) |

## Naming Conventions
- **Agent files:** Numbered prefix `NN_snake_case.js` (e.g. `01_news_fetcher.js`)
- **API routes:** Next.js convention `route.js` inside feature directories
- **Components:** PascalCase function names, single `.jsx` file
- **CSS:** BEM-ish class names (`.glass-card`, `.bias-left`, `.agent-spinner`)
