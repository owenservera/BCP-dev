# WORKSTREAMS.md — Active Workstream Registry

> **Classification: DERIVED — CURRENT**
> **Maintainer:** COORD-01 · **Updated:** 2026-09-23 · **Tip:** `7525ae6`

## WS-001 — Cooperative Ω agent context & cross-session synchronization substrate

- **Mission:** build the repository-resident cooperative memory protocol so
  many agents/sessions/conversations/workstreams share one durable context
  without anyone loading all history (initiating brief §§1–31).
- **Owner/coordinator:** owner / COORD-01.
- **Status:** ACTIVE — Phase 1 landed (HANDOFF-001); Phase 2 next.
- **Active agents:** IMPL-01 (closing); IMPL-02 (RESERVED, owner launch pending); COORD-01 (integration).
- **Launch folder:** `docs/agent-system/workstreams/WS-001/` (card + SETUP-PROMPT-IMPL-02 + LAUNCH-IMPL-02 + work/ scratch).
- **Base commit:** `becb920`.
- **Current objective:** land SYSTEM / ROSTER / WORKSTREAMS / CURRENT /
  CONTEXT-INDEX / CHATGPT-BOOT + transcript, packet, handoff, inbox/outbox
  conventions + F-AGENT-* falsifiers; ingest the initiating brief as
  transcript + PKT-001; prove the cold-start wall test.
- **Known blockers:** none (docs-only; no gate, lease, or host surface touched).
- **Linked packets:** PKT-001 (initiating brief ingestion; this workstream's
  own charter — DERIVED, not law).
- **Linked decisions:** D-425 (genome), D-426 (falsifier-first), D-427
  (orchestration), D-428 (dev-vault), D-430 (session ledger), D-443 (context
  substrate), D-448/D-451 (aperture), D-452..D-455 (invocation/standing/
  delegation/adaptation), D-350 (portrait), D-309 (agent runtime) — all
  referenced, none amended.
- **Linked transcripts:** CHAT-2026-09-23-cooperative-agent-context (the
  initiating MASTER AGENT PROMPT, stored under `transcripts/2026-09-23/`).
- **Next action:** COORD-01 review → commit decision → owner launches IMPL-02
  (prompt + launch folder) → Phase 2 dogfood → TEST-01 wall tests.

## WS-002 — Ω-native self-description (`vivim.self`) design (PROPOSED, blocked)

- **Mission:** design the eventual Ω-native self-knowledge system that consumes
  the WS-001 substrate (external conversations + local work + runtime
  observations + development evidence + decisions + source semantics →
  cooperative substrate → Ω self-description → task-conditioned context).
- **Owner/coordinator:** owner / COORD-01 (TBD).
- **Status:** PROPOSED — explicitly blocked until WS-001 passes its wall tests
  (initiating brief Phase 5). No agent assigned. No branch. No work until
  COORD-01 opens it.
- **Known content so far:** direction only; `vivim.mind` (Ω10, D-215) stays
  the live world-model owner; the Wave-2 assembly plugin owns context
  assembly (D-417) — do not conflate. Everything else is hypothesis.
- **Next action:** none until WS-001 gate: cold-start + cross-conversation
  proofs recorded by TEST-01.
