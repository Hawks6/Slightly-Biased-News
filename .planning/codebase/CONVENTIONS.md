# Code Conventions

## Language & Module Style
- **Plain JavaScript** — no TypeScript
- **ES Modules** throughout (`import`/`export`, not `require`)
- **React 19** with function components and hooks only (no class components)
- **`"use client"`** directive used for interactive components

## Component Patterns

### Inline Sub-Components
All UI components live inside a single file (`NewsLensApp.jsx`). Sub-components are defined as standalone functions in the same file scope, not extracted to separate modules.

```javascript
// Pattern: standalone function component, not exported
function BroadsheetFeed({ sourceCards }) {
  // ...
  return <div>...</div>;
}

// Only the main component is exported
export default function NewsLensApp() {
  // ...
}
```

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

```javascript
// Typical styling pattern
<div
  className="text-sm font-bold uppercase tracking-widest"
  style={{ color: "var(--color-accent-kicker)" }}
>
```

## Agent Patterns

### Pure Function Convention
Each agent exports pure functions that transform article arrays:

```javascript
// Input: articles[] → Output: enriched articles[]
export function classifyBias(articles) {
  return articles.map((article) => {
    // ... lookup + enrich
    return { ...article, bias: known.bias };
  });
}
```

### Fallback Chain Pattern
External data sources use a try/catch priority chain:

```javascript
// Attempt 1: Primary API
if (apiKey) {
  try { /* fetch */ } catch (e) { console.warn(...) }
}
// Attempt 2: Secondary API
// Attempt 3: Scraping
// Attempt 4: Static fallback
```

### HTML Sanitization
A `cleanText()` helper appears in multiple agent files to strip HTML:

```javascript
function cleanText(html) {
  if (!html) return "";
  let text = String(html).replace(/<[^>]*>?/gm, " ");
  text = text.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")...
  return text.replace(/\s\s+/g, " ").trim();
}
```

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
1. React hooks
2. Third-party libraries (recharts, lucide-react, clsx)
3. Constants/config objects
4. Component definitions (inline)
5. Default export (main component)
