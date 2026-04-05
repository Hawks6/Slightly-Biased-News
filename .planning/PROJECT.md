# *Slightly* Biased News

## What This Is

*Slightly* Biased News is an event-first news bias analysis platform. Instead of showing individual articles, it clusters related coverage into "news events" and lets users see how each event is framed across the political spectrum. The three-level architecture — Categories → Events → Analysis — gives users a broadsheet-style experience with AI-powered editorial intelligence underneath.

## Core Value

When a user clicks a news event, they see the full bias analysis across all sources covering that story — how left, center, and right media frame the same facts differently.

## Requirements

### Validated

- ✓ **Event-First Discovery:** Homepage displays category tiles (World, Politics, Business, etc.).
- ✓ **AI-Powered Event Clustering:** Grouping up to 60 articles into singular news events using **Groq (Llama 3.3 70B)**.
- ✓ **Multi-Stage API Route:** `/api/analyze` supports both GET(search) and POST(pre-fetched articles).
- ✓ **Infrastructure Caching:** Redis (Upstash) integration for 60m TTL on analysis and event clusters.
- ✓ **Premium Broadsheet UI:** Parchment aesthetic with DM Serif Display and Newsreader typography.

### Active

- [ ] **Zero-Shot Framing Detector (Agent 12):** Identification of narrative lenses (e.g., Economic, Moral, Conflict, Responsibility) per source using Groq.
- [ ] **Sentiment Valence & Intensity (Agent 13):** Measuring the "emotional charge" of articles on a -1.0 to 1.0 scale.
- [ ] **Framing Diffs & Contradictions:** Automated identification of narrative "gaps" between left and right framing.
- [ ] **Reality Reference Comparison (Agent 14):** Calculating the "Reality Distance" of biased reports against a neutral factual baseline.
- [ ] **Interactive Bias Dashboard:** Visualizing framing labels alongside traditional bias scores.

### Out of Scope

- User authentication and personalization (v1 focus is analysis).
- Mobile-native applications (responsive web is sufficient).
- Custom user-created categories (static category list is fine).

## Context

- **Tech Stack:** Next.js 15, React 19, Tailwind CSS v4, Recharts.
- **Intelligence Layer:** 11 active agents + Upstash Redis cache.
- **Constraint:** All "Heavy" ML logic must prioritize **Groq (Llama 3)** to maintain <2s response times and zero API costs for clustering.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| **Framing over Bias** | Users understand "Conflict" or "Economic" lenses better than abstract "Left/Right" scores. | — Pending |
| **Groq for Intensity Analysis** | High-speed inference needed for real-time tone detection across 60+ articles. | — Approved |
| **Perspective Grouping** | Grouping sources by framing lens rather than just political lean. | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason.
2. Requirements validated? → Move to Validated with phase reference.
3. New requirements emerged? → Add to Active.

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections.
2. Core Value check — still the right priority?

---
*Last updated: 2026-04-03 after ML Milestone Initialization*
