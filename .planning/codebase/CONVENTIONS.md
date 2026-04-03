# Coding Conventions

The project follows a strict "Lean & Readable" approach, prioritizing plain JavaScript and functional React components to minimize build overhead and maximize AI maintainability.

## Language & General Style
- **Pure JavaScript:** No TypeScript. Use JSDoc for complex type hinting if necessary.
- **ES Modules (ESM):** Always use `import`/`export`. Avoid `require`/`module.exports`.
- **Naming:** 
    - `PascalCase` for React components.
    - `camelCase` for variables, hooks, and functions.
    - `kebab-case` for directory names and API routes.
    - `snake_case` for data keys and agent file suffixes.

## React & Frontend Patterns
- **React 19 Hooks:** Exclusively use function components with `useState`, `useCallback`, `useEffect`, and `useMemo`.
- **Modular Components:** Components are organized by feature area (e.g., `src/components/dashboard/`).
- **Conditional Styling:** Use `clsx()` for all dynamic class compositions.
- **Design Tokens:** Always reference colors and spacing via CSS variables (e.g., `var(--color-accent-brand)`) to maintain design system integrity.
- **Client-Side:** Add `"use client";` at the top of any file using React hooks or DOM APIs.

## Agent System Patterns
- **Statelessness:** Agents must be pure functions that take an input object and return a transformed output object.
- **Sequential Guarding:** Each agent in the `src/lib/agents/` pipeline should be prefixed by its execution order (01, 02, etc.).
- **Graceful Fallbacks:** Agents should handle API failures internally and return valid, albeit limited, data (e.g., the `FALLBACK_ARTICLES` in Agent 01).
- **Zod Validation:** All AI-generated JSON should be validated with a Zod schema before being passed down the pipeline.

## API & Backend
- **Error Responses:** Standardize on `{ "error": "short_code", "message": "Human readable detail" }`.
- **Caching Checks:** Always verify Redis cache presence at the start of expensive orchestrator routes (`/api/analyze`).
- **HTTP Methods:** 
    - `GET` for retrieval and cached results.
    - `POST` for processing specific payloads (e.g., analyzing selected events).
