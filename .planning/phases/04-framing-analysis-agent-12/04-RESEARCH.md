# Phase 4: Framing Analysis (Agent 12) - Research

## 1. Domain Overview
The goal is to analyze each article's content and assign a primary framing lens (e.g., Economic, Moral, Conflict) using a zero-shot classification approach via Groq's Llama 3.3. This allows the UI to display qualitative framing context alongside the quantitative L/C/R bias score.

## 2. Agent Architecture (`12_framing_detector.js`)
- **Input:** Takes `enriched` articles array.
- **Provider:** `Groq SDK` (`llama-3.3-70b-versatile`). Same pattern as `04_ai_summarizer.js`.
- **Parallelization Constraint:** As per `04-CONTEXT.md` (D-03), Agent 12 must run in parallel with `04_ai_summarizer.js` to avoid delaying the <4s latency budget. Instead of waiting for summaries, it will map over the articles, take the first 300 words of `content` or `description`, and prompt Groq to classify it.
- **Taxonomy:** Economic, Moral, Conflict, Responsibility, Human Interest, Policy, Leadership.
- **Output injection:** Each article object receives a `.framing` property, e.g., `{ label: 'Economic', confidence: 0.82, reasoning: 'Focuses on trade tariffs...' }`.
- **Fallback:** If Groq fails, fallback to `{ label: 'Neutral', confidence: 1.0, reasoning: 'Classification unavailable.' }`.
- **Batching Strategy:** To maintain <4s latency, we should send a **single batch prompt** to Groq containing small snippets of all articles simultaneously (using `response_format: { type: "json_object" }`). This prevents the need for 20 independent API calls.

## 3. UI Integration
- **`SourceCards.jsx` Integration (D-01, D-02):**
  - **Unified Pill:** Combine the traditional Bias label and Framing label into one `<span>` (e.g., "Left • Conflict Lens").
  - **Confidence Parsing:** If `framing_confidence` < 0.5, apply `opacity-50` or similar visual fade to the framing portion.
  - Remove the original standalone `card.framing && ...` span. Keep `FRAMING_TAG_CLASS`.
- **`MetaStrip.jsx` Integration:**
  - `MetaStrip` correctly renders `coverageHealth.primaryFraming`.
  - `10_payload_builder.js` correctly populates `coverageHealth.primaryFraming`, so no changes are needed here.

## 4. Derived Metrics (`05_derived_metrics.js`)
- `highlightDiffs()` already handles `.framing` comparisons to detect contradictions. Activating Agent 12 will seamlessly hydrate this logic.

## 5. Potential Risks & Latency
- **Risk:** High latency if calling Groq sequentially.
- **Mitigation:** Use batching. A single JSON structure sent to Groq containing IDs and snippet text, returning a map of `{ [id]: { label, confidence, reasoning } }`.

## Validation Architecture
- Check that `12_framing_detector.js` utilizes batch JSON parsing.
- Ensure unified badge formatting in `SourceCards.jsx` uses opacity indicators for low confidence framing labels, complying with `04-CONTEXT.md` D-01.

## RESEARCH COMPLETE
