# Phase 2 Context: Scaling & Density

This phase focuses on populating the event-first feed to reach "Broadsheet" levels of richness, moving from 1-2 events per page to a consistent 8-10 events.

## Decisions 

-   **Source Prioritization**: We will stick exclusively to **NewsAPI** for high-volume fetching. RSS will remain as a tertiary fallback but wont be scaled in this phase.
-   **Event Target**: The user expects a minimum of **8-10 events per category** (e.g. "Politics").
-   **Pool Strategy**: To achieve 8-10 clusters (events), we will increase the fetch "pool" for NewsAPI to **60 articles** per query.
-   **Extraction Optimization**: We will prioritize "fast" metadata fetching (Title/Description) for the pool, and only perform heavy content extraction for articles that become part of a cluster.

## Remaining Gray Areas

-   None for this phase. User decisions on source (NewsAPI) and volume (8-10) are locked.
