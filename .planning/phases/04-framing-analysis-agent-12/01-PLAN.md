---
wave: 1
depends_on: []
files_modified:
  - "src/lib/agents/12_framing_detector.js"
  - "src/app/api/analyze/route.js"
autonomous: true
requirements:
  - REQ-1
  - REQ-4
---

# Plan 01: Create Agent 12 (Framing Detector)

<objective>
Implement the `12_framing_detector.js` agent to use Groq's Llama 3.3 for zero-shot framing classification based on the 7 predefined taxonomic lenses, using JSON batching for performance. Integrate it into the parallel execution step of the orchestrator (`route.js`) to adhere to the <4s latency budget.
</objective>

<tasks>

<task id="01">
  <title>Implement Agent 12</title>
  <description>Create the framing detector agent leveraging the Groq SDK with batch JSON format.</description>
  <read_first>
    - src/lib/agents/04_ai_summarizer.js (Reference implementation for Groq JSON integration)
  </read_first>
  <action>
    Create `src/lib/agents/12_framing_detector.js`.
    Export an async function `applyFraming(articles)` that processes array of enriched articles.
    1. Check for `GROQ_API_KEY`. If missing, map `articles` to return `{ label: "Neutral", confidence: 1.0, reasoning: "Skipped" }` for all.
    2. Batching: create a mapping of `id` to the first 300 words of `content` or `description`.
    3. Call Groq with `llama-3.3-70b-versatile` and `response_format: { type: "json_object" }`.
       System prompt must ask for a robust JSON schema mapping `id` to `{ label, confidence, reasoning }` using only the allowed taxonomy: "Economic", "Moral", "Conflict", "Responsibility", "Human Interest", "Policy", "Leadership".
    4. Inject `.framing` into each corresponding article object.
    5. Handle try/catch and fallback reliably.
  </action>
  <acceptance_criteria>
    - `src/lib/agents/12_framing_detector.js` exists.
    - Exports `applyFraming(articles)`.
    - Handles batch processing via one Groq API call.
    - Fallback returns `Neutral` if an error occurs.
  </acceptance_criteria>
</task>

<task id="02">
  <title>Integrate Agent 12 into Orchestrator</title>
  <description>Add the formatting detector to the concurrent execution block in the analysis route.</description>
  <read_first>
    - src/app/api/analyze/route.js
  </read_first>
  <action>
    Edit `src/app/api/analyze/route.js`:
    1. Import `applyFraming` from `../lib/agents/12_framing_detector.js`.
    2. Inside `runPipeline`, after `enriched` articles are mapped (around the `Promise.all` block where `04_ai_summarizer` runs):
       Add `applyFraming(enriched)` to the array of promises (if not already there or inject it manually mutating the `enriched` array parallel to summarization). Note: since `applyFraming` mutates articles in place (or returns mutated articles), ensure `enriched` contains `.framing` properties correctly.
  </action>
  <acceptance_criteria>
    - `src/app/api/analyze/route.js` imports `12_framing_detector.js`.
    - `applyFraming` is awaited within or alongside the main `Promise.all` execution layer without blocking other async agents unnecessarily.
  </acceptance_criteria>
</task>

</tasks>

<verification>
- Run `curl "http://localhost:3000/api/analyze?q=election"` and verify `framing` object is attached to each item in `sourceCards`.
</verification>

<must_haves>
- Uses `llama-3.3-70b-versatile`
- Strict latency enforcement via batching.
</must_haves>
