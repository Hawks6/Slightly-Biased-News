# Technology Stack

## Runtime & Language
- **Runtime:** Node.js (implied by Next.js 15)
- **Language:** JavaScript (ES Modules via Next.js, no TypeScript)
- **JSX dialect:** React JSX (`.jsx` files in `src/components/`)

## Framework
- **Next.js 15.3** — App Router (`src/app/` directory structure)
  - Server-side API routes in `src/app/api/`
  - Client components marked with `"use client"` directive
  - Root layout at `src/app/layout.js`, single page at `src/app/page.js`

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
  - `DM Serif Display` — display/headings
  - `Newsreader` — body text
  - `DM Sans` — UI elements
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

All API keys are optional — the system gracefully degrades through a fallback chain (NewsAPI → GNews → RSS Scraping → Static mock data).

## Build & Run Scripts
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```
