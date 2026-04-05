---
wave: 2
depends_on: ["01-PLAN.md"]
files_modified:
  - "src/components/dashboard/SourceCards.jsx"
autonomous: true
requirements:
  - REQ-1
---

# Plan 02: Framing UI Integration

<objective>
Update `SourceCards.jsx` to render the framing label and bias label in a single, unified badge pill. Ensure that framing labels with a confidence score below 0.5 are visually faded (e.g. `opacity-50`) to denote model uncertainty, as specified in `04-CONTEXT.md`.
</objective>

<tasks>

<task id="01">
  <title>Refactor SourceCards Pill Badge</title>
  <description>Combine the standalone Bias span and Framing span into a single pill, and add confidence checks for visual fading.</description>
  <read_first>
    - src/components/dashboard/SourceCards.jsx
  </read_first>
  <action>
    Edit `src/components/dashboard/SourceCards.jsx`:
    1. Find the separate `<span>` rendering `card.bias` and `card.framing`.
    2. Replace them with a single `<span>` that combines both values:
       - Keep the outer class logic for bias color (`BIAS_TAG_CLASS[card.bias]`).
       - Remove `FRAMING_TAG_CLASS`.
       - Render: `{card.bias formatter}`.
       - If `card.framing && card.framing.label !== "Neutral"`, append an internal span:
         ` • <span className={card.framing.confidence < 0.5 ? "opacity-50" : ""}>{card.framing.label} Lens</span>`.
    3. Ensure that the original `card.framing.reasoning` section remains intact in the expanded view.
  </action>
  <acceptance_criteria>
    - `SourceCards.jsx` uses a single combined span for both Bias and Framing on Source cards.
    - `opacity-50` class is conditionally applied based on `card.framing.confidence < 0.5`.
    - No standalone framing tag is grouped independently above the article title.
  </acceptance_criteria>
</task>

</tasks>

<verification>
- Start the development server (`npm run dev`).
- Run a search query in the app UI, open the results, and verify that the `SourceCards` are displaying the unified badge (e.g. "Left • Conflict Lens") correctly.
</verification>

<must_haves>
- Unified, elegant design on the pill badge.
- Confidence opacity condition.
</must_haves>
