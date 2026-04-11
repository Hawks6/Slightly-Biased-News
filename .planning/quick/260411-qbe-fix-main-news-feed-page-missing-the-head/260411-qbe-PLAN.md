# Quick Task 260411-qbe: Fix main news feed page missing the heading of the news

**Mode:** quick

## Tasks

1. **Pass Query to SummaryCard**
   - **files**: `src/components/SlightlyBiasedApp.jsx`
   - **action**: Pass `data.meta?.query` as `query` prop to the `SummaryCard` component.
   - **verify**: Check that the `query` prop is passed correctly.
   - **done**: false

2. **Render Query in SummaryCard**
   - **files**: `src/components/dashboard/SummaryCard.jsx`
   - **action**: Update the component to accept the `query` prop and render it as the `<h2>` heading instead of the hardcoded text "The Consensus" (with "The Consensus" as a fallback).
   - **verify**: Check that the title now uses the passed `query`.
   - **done**: false
