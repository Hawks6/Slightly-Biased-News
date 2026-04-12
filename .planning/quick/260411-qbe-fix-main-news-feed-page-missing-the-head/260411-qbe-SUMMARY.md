# Quick Task 260411-qbe: Fix main news feed page missing the heading of the news

**Status:** Completed
**Date:** 2026-04-11

## Executed Tasks

1. **Pass Query to SummaryCard** (Completed)
   - Passed `data.meta?.query` as to `SummaryCard` inside `src/components/SlightlyBiasedApp.jsx`.

2. **Render Query in SummaryCard** (Completed)
   - Received `query` prop inside `SummaryCard` (`src/components/dashboard/SummaryCard.jsx`).
   - Rendered the query in the `<h2>` tag, falling back to "The Consensus".

## Notes
The news feed previously had "The Consensus" hardcoded for all event summaries. Now it will accurately display the actual event title or search query from `data.meta.query`.
