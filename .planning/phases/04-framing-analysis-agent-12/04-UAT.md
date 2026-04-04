---
status: testing
phase: 04-framing-analysis-agent-12
source: [04-VALIDATION.md, walkthrough.md]
started: 2026-04-04T12:20:00Z
updated: 2026-04-04T12:20:00Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

[testing complete]

## Tests

### 1. API Integration & Payload Structure
expected: Running a query via `curl` should return a JSON payload where every article has a `.framing` object with a valid taxonomy label.
result: pass

### 2. Unified UI Badge Rendering
expected: In the dashboard, source cards should display a unified pill badge like "Left · Conflict" instead of separate tags. The framing portion should follow the bullet point after the bias label.
result: pass

### 3. Confidence-Based Opacity (D-01)
expected: If a framing label has a confidence score below 0.5, the label text (the portion after the bullet) should be rendered with 50% opacity (`opacity-50`) while the bias portion remains fully opaque.
result: pass

### 4. Hardened Fallback (No API Key)
expected: If the `GROQ_API_KEY` is missing (or dummy), the pipeline should still complete successfully, and every article should be decorated with a "Neutral" framing label and "Classification unavailable" reasoning.
result: pass

## Summary

total: 4
passed: 4
issues: 0
pending: 0
skipped: 0

## Gaps

[none yet]
