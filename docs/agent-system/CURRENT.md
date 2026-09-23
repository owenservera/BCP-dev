# CURRENT.md — Durable Shared Working-Memory Bridge

> **Classification: DERIVED — CURRENT**
> **Rule:** small enough to load every session (target <120 lines). Entries
> point to evidence; they are not evidence. Coordinator-owned; agents propose
> via outbox, never direct-edit in flight. **Updated:** 2026-09-23 · **Tip:** `7525ae6`

## CURRENT REPOSITORY TIP

- BCP-dev HEAD `becb920` (+ untracked `bcp-algos/`, Ω `docs/architecture/`,
  `examples/plugin-echo2/`, `setupdocs.zip` — another workstream's surface, do
  not touch). Board parked, validate 0 errors. (→ `/BUILD_CONTEXT.md`,
  `docs/CURRENT-CONTEXT.md`)

## CURRENT WORKSTREAM / MISSION

- WS-001 ACTIVE: build the cooperative agent-context substrate (this task).
  WS-002 (`vivim.self`) PROPOSED, blocked on WS-001 wall tests.
  (→ `WORKSTREAMS.md`)

## CURRENT ARCHITECTURAL MODEL

- VIVIM (assay) → BCP (forge) → Ω (land) → final VIVIM. Ω = everything-is-a-
  plugin under B1–B5; host frozen 1500/1500; Chrome-master/slave-only v1
  (D-418/D-456); 18-spec matrix. (→ `omega-…/docs/decisions/CURRENT-INVARIANTS.md`)
- New layer: `docs/agent-system/` = coordination protocol that *references*
  session ledger (D-430), dev-vault (D-428), doctruth, genome (D-425),
  agent plugin (D-309 + D-452..455), context substrate (D-443). It duplicates
  none of them. (→ `SYSTEM.md` §3)

## WHAT IS ESTABLISHED

- Ω law + gate arbiter + decision append-only discipline (→ Ω `AGENTS.md`).
- BCP vocabulary enforcement via `bcp_tool.py` only (→ `/AGENTS.md`).
- Substrate skeleton landed this session: SYSTEM, ROSTER, WORKSTREAMS,
  CONTEXT-INDEX, CHATGPT-BOOT, transcript/packet/handoff/envelope conventions,
  F-AGENT-* falsifiers. (→ `SYSTEM.md`, `FALSIFIERS.md`)

## WHAT IS NEW / WHAT CHANGED (this session)

- NEW `docs/agent-system/` tree (first implementation of the initiating brief).
- INGESTED initiating brief as transcript `CHAT-2026-09-23-cooperative-agent-context`
  + packet `PKT-001` (DERIVED, not law).
- No Ω code, decision, lease, or state touched (docs-only).

## ACTIVE TASKS / AGENTS

- IMPL-01: substrate landed + HANDOFF-001 → COORD-01 review / commit decision. (→ `ROSTER.md`)
- IMPL-02 RESERVED: owner launches with `workstreams/WS-001/SETUP-PROMPT-IMPL-02.md` + `workstreams/WS-001/` folder → Phase 2 dogfood.
- NEXT: TEST-01 wall tests (cold-start, handoff, ingest); DOC-01 packet QA.

## OPEN QUESTIONS

- Packet schema v1 sufficient for cross-ChatGPT continuity? (TEST-01 to judge.)
- Envelope spec v1 sufficient for 3-agent dogfood? (Phase 2, unstarted.)

## KNOWN CONTRADICTIONS

- None open in WS-001. Standing trap: old Ollama/`provider.llm` passages are
  cited history (D-418/D-456), never plan. (→ `/AGENTS.md`)

## KNOWN HISTORICAL TRAPS

- Folder ≠ authority — check STATUS banners. `merging` ≠ integrated;
  fixture-proven ≠ live-proven. Parked 2026-09-22 lane/inbox entries are not
  orders. Numbers with dates are snapshots, not law. (→ `/AGENTS.md`)

## CURRENT AUTHORITY

1. Ω ratified law: `omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md`
2. BCP vocabulary: `bcp-speed/bcp/state/taxonomy.yaml` + RECONCILIATION.md
3. `docs/CURRENT-CONTEXT.md` · 4. live BCP state · 5. migration records.
   This file is rank-3-area procedure, never rank-1 law.

## RECOMMENDED NEXT READS

1. `WORKSTREAMS.md` → active row. 2. relevant handoff (`handoffs/`). 3.
   relevant packet (`packets/PKT-001-*.md`). 4. linked decisions/code/tests.

## RECENT IMPORTANT SESSIONS

- 2026-09-23 IMPL-01 WS-001 Phase 1 build (this session; close → HANDOFF-001).
