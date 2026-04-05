# Tech Stack & Dependencies

The project is built on a modern JavaScript-only stack, leveraging Next.js 15 and React 19 for a high-performance, edge-ready news intelligence platform.

## Core Runtime & Frameworks
- **Runtime:** Node.js (v18.x or v20.x+)
- **Framework:** [Next.js 15.3](https://nextjs.org/) (App Router architecture)
- **UI library:** [React 19.0.0](https://react.dev/)
- **Language:** Plain JavaScript (ES Modules)

## Frontend Ecosystem
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) using the `@tailwindcss/postcss` plugin. Custom tokens are defined in `src/app/globals.css`.
- **Data Visualization:** [Recharts ^2.15.0](https://recharts.org/) for bias distribution charts and pie charts.
- **Icons:** [Lucide React ^0.468.0](https://lucide.dev/) for navigation and status indicators.
- **Dynamic Classes:** [clsx ^2.1.1](https://github.com/lukeed/clsx) for conditional styling.

## Backend & Intelligence Layer
- **AI Orchestration:** [Groq SDK ^1.1.2](https://github.com/groq/groq-sdk-nodejs) for high-speed event clustering (Llama 3.3 70B).
- **Schema Validation:** [Zod ^4.3.6](https://zod.dev/) for validating AI responses and API payloads.
- **Full-Text Extraction:** [@extractus/article-extractor ^8.0.20](https://github.com/extractus/article-extractor) for retrieving clean content from news URLs.
- **HTML Parsing:** [Cheerio ^1.2.0](https://cheerio.js.org/) for DOM-based extraction and RSS processing.
- **State/Caching:** [ioredis ^5.10.1](https://github.com/redis/ioredis) for connecting to Upstash/Redis caching layers.

## Configuration & Environment
Configuration is managed via standard environment variables (see `.env.example`):
- `NEWSAPI_KEY`: Primary data source for global news.
- `GNEWS_KEY`: Secondary data source for higher limits or regional news.
- `ANTHROPIC_API_KEY`: Used for multi-stage bias analysis and framing explanations.
- `GROQ_API_KEY`: Required for the `11_event_clusterer` (Llama 3 context).
- `REDIS_URL`: Connection string for caching analysis results.

## Build & Dev Tooling
- **Build System:** `next build` (Vercel-optimized target)
- **Linting:** [ESLint ^9.0.0](https://eslint.org/) with `eslint-config-next`
- **Path Aliases:** Defined in `jsconfig.json` (`@/*` -> `./src/*`)
