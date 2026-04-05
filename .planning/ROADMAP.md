# Roadmap - *Slightly* Biased News

## Milestone 1: Event-First Architecture (Hawks6 V2) 
*Completed: 2026-04-03*

- [x] Phase 1: Topic Selector & Category Logic
- [x] Phase 2: Event clustering API (Groq)
- [x] Phase 3: Event-First UX Transition (Dashboard refactor)

## Milestone 2: ML Intelligence Layer (Current)
*Objective: Shift from static bias to dynamic semantic framing.*

### Phase 4: Framing Analysis (Agent 12)
- [ ] Research specific framing taxonomies (SemEval compatible).
- [ ] Implement `12_framing_detector.js` (Groq zero-shot).
- [ ] Integrate framing labels into `SourceCards.jsx` and `MetaStrip.jsx`.

### Phase 5: Sentiment & Tone Analysis (Agent 13)
- [ ] Implement `13_valence_analyzer.js` for emotional intensity scoring.
- [ ] Add "Charged Language" detection to `DiffsPanel.jsx`.
- [ ] Visualize article "Intensity" on -1.0 to 1.0 valence scale.

### Phase 6: The "Reality Ref" (Agent 14)
- [ ] Implement `14_reality_ref.js`: Neutral baseline generation + Distance scoring.
- [ ] Build "Framing Diff" view comparing contradictory narratives.
- [ ] Final Milestone Audit: Cross-source framing reconciliation.

## Future Milestones

- Milestone 3: Real-time source fingerprinting (Local embeddings).
- Milestone 4: Performance optimization (Edge-compatible agents).
- Milestone 5: Monetization & Ad Strategy (Non-intrusive placeholders).
