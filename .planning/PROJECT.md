# NewsLens

## What This Is

NewsLens is an event-first news bias analysis platform. Instead of showing individual articles, it clusters related coverage into "news events" and lets users see how each event is framed across the political spectrum. The three-level architecture — Categories → Events → Analysis — gives users a broadsheet-style experience with AI-powered editorial intelligence underneath.

## Core Value

When a user clicks a news event, they see the full bias analysis across all sources covering that story — how left, center, and right media frame the same facts differently.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

- ✓ Multi-source news fetching with fallback chain (NewsAPI → GNews → RSS → static) — existing
- ✓ Article normalization and cleaning pipeline — existing
- ✓ Bias classification using AllSides/Ad Fontes methodology — existing
- ✓ Ownership transparency (parent company resolution) — existing
- ✓ AI-powered neutral summary generation (Claude + extractive fallback) — existing
- ✓ Reality score composite credibility scoring — existing
- ✓ Perspective builder (left/center/right narrative grouping) — existing
- ✓ Timeline builder (chronological ordering + first-reporter detection) — existing
- ✓ Diff highlighter (contradiction detection + loaded language) — existing
- ✓ Payload builder assembling all agent outputs into UI schema — existing
- ✓ Premium broadsheet-style design system (DM Serif Display, Newsreader, parchment palette) — existing

### Active

<!-- Current scope. Building toward these. -->

- [ ] Homepage displays category tiles (World, Politics, Business, Tech, Science, Climate, Culture, Opinion, and more)
- [ ] Clicking a category fetches articles and clusters them into distinct news events via AI
- [ ] AI-powered event clustering using Groq (Llama 3.3 70B, free tier)
- [ ] Category feed shows minimal title cards per event (title, source count, recency, divergence hint)
- [ ] Clicking an event card runs the full 10-agent analysis pipeline for that event's articles
- [ ] Event analysis view shows the current bias breakdown (charts, perspectives, timeline, diffs, source cards)
- [ ] Smooth three-view navigation: Categories → Events → Analysis with back navigation

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Full article reader / "Continue reading" view — defer to future milestone
- User accounts and saved preferences — not needed for v1
- Real-time live updates / WebSocket feeds — over-engineering for current stage
- Mobile-native app — web-first, responsive design is sufficient
- Comment system or social features — focus is on analysis, not discussion
- Custom topic creation by users — static category list is fine for v1

## Context

- **Existing codebase:** Next.js 15 App Router with React 19, Tailwind CSS v4, Recharts for visualization. 6 agent files implementing the full 10-agent analysis pipeline.
- **Codebase concerns:** The main UI component (`NewsLensApp.jsx`) is a 1100-line monolith. `cheerio` and `@extractus/article-extractor` are misplaced in devDependencies. Duplicated `cleanText()` utility across agent files.
- **Design system:** Recently migrated to a warm parchment broadsheet aesthetic with DM Serif Display, Newsreader, and DM Sans typography.
- **Current architecture gap:** The app currently works article-first (search → show articles). The shift to event-first requires a new clustering layer between article fetching and the analysis pipeline.

## Constraints

- **AI clustering:** Must use Groq free tier (Llama 3.3 70B) for event clustering — no paid API calls for this feature
- **Tech stack:** Build on top of existing Next.js/React architecture — no framework migration
- **Design:** Follow the established broadsheet design system tokens in `globals.css`
- **API keys:** All external API keys must remain optional with graceful fallback behavior

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Event-first instead of article-first | Users care about stories, not individual articles. Clustering provides better UX. | — Pending |
| Groq (Llama 3.3 70B) for event clustering | Free tier, fast inference, OpenAI-compatible API. Avoids Claude costs for clustering. | — Pending |
| Three-view architecture (Categories → Events → Analysis) | Clean information hierarchy. Each level adds depth. | — Pending |
| Minimal event cards (title + metadata only) | User preference. Clean, broadsheet-aesthetic. No images or descriptions on cards. | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-30 after initialization*
