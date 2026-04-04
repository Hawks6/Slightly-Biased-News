# Requirements - ML Intelligence Layer

This document details the functional and non-functional requirements for the "Stronger ML Logic" phase of *Slightly* Biased News.

## 1. Zero-Shot Framing Detection (Agent 12)

**Objective:** Identify the primary narrative lens of each source to move beyond simple bias scores.

### Functional Specs
- **Logic:** Must use a taxonomy of 5–8 common framing lenses (Economic, Moral, Conflict, Responsibility, Human Interest, Policy, Leadership).
- **Inference:** Zero-shot using **Groq (Llama 3.3 70B)** to minimize cost and latency.
- **Output:** A primary `framing_label` and a `framing_confidence` score (0.0 to 1.0).
- **Display:** Display framing labels on source cards and in the Event MetaStrip.

## 2. Sentiment Valence & Intensity (Agent 13)

**Objective:** Quantify the "emotional charge" and narrative urgency of the text.

### Functional Specs
- **Logic:** Measure "Emotional Valence" (-1.0 to 1.0) and "Tone Intensity" (0.0 to 1.0).
- **Intensity:** Detecting "Charged Language" or "Loaded Adjectives."
- **Inference:** Groq-powered analysis of the article's extractive summary.
- **Display:** A "Narrative Heat" visualization in the DiffsPanel or MetaStrip.

## 3. Contrastive Diff Detection

**Objective:** Highlight where left and right framing diverge on specific facts.

### Functional Specs
- **Logic:** Identifying "Framing Gaps" (e.g., when one source omits an economic detail that another emphasizes).
- **Comparison:** Cross-cluster analysis of extractive summaries.

## 4. Non-Functional Requirements

- **Latency:** Total analysis time for all 10+ agents must remain **< 4 seconds** (using parallelization where possible).
- **Caching:** All ML results must be cached in Redis with a 60-minute TTL.
- **Fallback:** If Groq is unavailable, agents must fall back to a "Neutral" status without breaking the UI.

---
*Last updated: 2026-04-03 after ML Milestone Initialization*
