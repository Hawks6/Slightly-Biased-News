# Project Structure

Slightly Biased News follows a modern Next.js 15 App Router architecture with a decoupled logic layer for AI agents.

## Core Directory Layout

```text
├── .Planning/          # GSD workflow documentation
│   └── codebase/       # Deep codebase mapping files
├── .agent/             # GSD skill systems and subagent configurations
├── public/             # Static assets (favicons, etc.)
├── src/                
│   ├── app/            # Next.js App Router (Layouts and API routes)
│   │   ├── api/        # Backend orchestrators (/analyze, /events)
│   │   ├── globals.css # CSS configuration with Tailwind v4 theme
│   │   ├── layout.js   # Global structure and fonts
│   │   └── page.js     # Main entry point (renders SlightlyBiasedApp)
│   ├── components/     # Modular UI components
│   │   ├── common/     # Reusable UI (SearchBar, Footer, Ticker)
│   │   ├── dashboard/  # Perspective Analysis components (Recharts)
│   │   ├── events/     # Event Feed and Grid components
│   │   └── ...         # TopicSelector, TopicTabs
│   ├── lib/            # Shared utilities
│   │   ├── agents/     # Core intelligence logic (11 agent files)
│   │   └── redis.js    # Caching helper functions
```

## Key File Locations

| File Basename | Responsibility |
| :--- | :--- |
| `src/app/page.js` | Entry point for the Client Application. |
| `src/components/SlightlyBiasedApp.jsx` | Core state machine and view orchestrator. |
| `src/app/api/analyze/route.js` | Main backend pipeline for 10-wave perspective analysis. |
| `src/lib/agents/01_news_fetcher.js` | Multi-source article retrieval with fallback logic. |
| `src/lib/agents/11_event_clusterer.js` | Groq-powered clustering agent. |
| `src/app/globals.css` | Design system tokens and custom Tailwind styles. |

## Naming Conventions
- **Components:** PascalCase (e.g., `EventFeed.jsx`).
- **Agents:** Sequential numbering prefixed with snake_case (e.g., `04_ai_summarizer.js`).
- **API Routes:** kebab-case directory structure (e.g., `/api/analyze/route.js`).
- **Variables:** camelCase (e.g., `activeView`, `selectedTopic`).
- **Design Tokens:** CSS custom properties (e.g., `--color-accent-brand`).
