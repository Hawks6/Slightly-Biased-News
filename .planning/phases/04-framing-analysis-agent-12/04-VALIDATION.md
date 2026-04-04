---
phase: 4
slug: framing-analysis-agent-12
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-04-03
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Next.js API Routes (Manual/CLI testing via curl) |
| **Config file** | none |
| **Quick run command** | `curl "http://localhost:3000/api/analyze?q=election"` |
| **Full suite command** | UI manual testing |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `curl` to check payload structure.
- **After every plan wave:** Verify in UI (browser).
- **Before `/gsd-verify-work`:** Full UI visualization must be rendered properly.
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID   | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|-----------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-01  | 01   | 1    | REQ-4      | Integration | grep checking integration | ✅ W0 | ⬜ pending |
| 04-01-02  | 01   | 1    | REQ-4      | API       | `curl`            | ✅ W0 | ⬜ pending |
| 04-02-01  | 02   | 2    | D-01        | UI        | UI Check          | ✅ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Badge render | D-01 | Visual UI | Check `SourceCards` visually for unified badge and opacity logic on low confidence labels. |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 10s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-04-03
