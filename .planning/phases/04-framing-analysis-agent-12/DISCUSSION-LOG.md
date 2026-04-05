# Discussion Log: Phase 4

**Areas Discussed:**
- Confidence Handling
- UI Integration
- Agent Integration

**Q: Confidence Handling (When framing_confidence is below 0.5)**
*Options:* Skip label, Fallback "Neutral/Factual" label, Show Groq label with faded opacity.
*Selection:* Show the Groq label anyway, but with faded opacity or a low-confidence indicator.

**Q: UI Integration**
*Options:* Simple dedicated badge pill ("Left • Conflict"), Color-code framing labels by lens, Make framing label primary and deemphasize political bias.
*Selection:* Use a simple dedicated badge pill (e.g., "Left • Conflict" all in one line).

**Q: Agent Integration (Latency constraint: <4s)**
*Options:* Run Agent 12 completely in parallel feeding raw article snippet, Wait for AI summarizer to finish.
*Selection:* Run Agent 12 completely in parallel with the other agents, feeding it the raw article text/snippet.
