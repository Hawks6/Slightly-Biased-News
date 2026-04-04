# Features Research: Event-First News Platforms

## Table Stakes (Must-Have)
- **Event Clustering:** Group multiple articles reporting the same story into a single logical "News Event".
- **Minimal Event Cards:** Display the event headline, the number of distinct sources covering it, and a "time ago" string.
- **Categorization:** Events are grouped under broad topics (World, Politics, Tech, etc.).
- **Click-to-Analyze:** Clicking the card transitions the user to the deep-dive analysis feed for that specific event.

## Differentiators
- **Divergence Hinting:** Showing an at-a-glance metric on the event card indicating how divided the coverage is (e.g., "High Divergence", "Consensus").
- **Smart Headline Synthesis:** The AI writes a neutral, overarching headline for the event cluster, rather than just picking one publisher's biased headline.

## Anti-Features (What NOT to build)
- **Real-time websocket clustering:** Complex and unnecessary. Standard Next.js server actions / API fetches with caching (revalidate: 60) are plenty fast enough for news.
- **Nested Events:** Let's keep the hierarchy flat: Category -> Events -> Articles. We do not need "sub-events".
