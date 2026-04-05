# Phase 4: Framing Analysis (Agent 12) - Context

**Gathered:** 2026-04-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Adding zero-shot framing classification (Economic, Moral, Conflict, etc.) to each article using Groq, and displaying it on the UI.
</domain>

<decisions>
## Implementation Decisions

### Confidence Handling
- **D-01:** When `framing_confidence` is below 0.5, the label will still be shown but rendered with a visual indicator of low confidence (e.g., faded opacity).

### UI Integration
- **D-02:** The framing label will be integrated perfectly into a simple unified badge pill (e.g., "Left • Conflict" on the same line), respecting the existing broadsheet aesthetic, replacing the dedicated bias pill or merging linearly with it.

### Agent Integration
- **D-03:** Agent 12 must run in parallel with the extractive summarizer (feeding on raw article snippets) to avoid extending the critical path and ensure the total analysis remains under the <4s latency requirement.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Architecture & Conventions
- `.planning/codebase/ARCHITECTURE.md`
- `.planning/codebase/CONVENTIONS.md`
- `.planning/codebase/STACK.md`
- `.planning/codebase/SYSTEM_DESIGN.md`

### Requirements
- `.planning/REQUIREMENTS.md` — Specifies the taxonomy of 5-8 common framing lenses (Economic, Moral, Conflict, Responsibility, Human Interest, Policy, Leadership).
</canonical_refs>
