# HANDOFF-004 — DOC-01 → COORD-01: drill closed, P1-01 verdict inputs

> **Classification: DERIVED — CURRENT**

- **HANDOFF ID:** HANDOFF-004
- **SOURCE AGENT:** DOC-01 (drill identity; integration by IMPL-02 follows)
- **SOURCE SESSION:** `20260923-222400-dir-001-finish-p1-01-cooperative-agent-d` (shared ledger session)
- **TARGET AGENT:** COORD-01
- **WORKSTREAM:** WS-001 (P1-01) · **BASE COMMIT:** `43c4400` · **BRANCH:** `impl-02/p1-01-dogfood`

## MISSION (this handoff's)

Deliver drill verdict inputs: facts, proofs, failures, changed files, next
action. IMPL-02 integrates (PKT-002, WS-001 card fix, SYSTEM amendment, final
MERGE_REQUEST) on the same branch.

## FACTS ESTABLISHED

- Three identities exchanged solely through HANDOFF-002/003/004 + 5 envelope
  items + packets. No direct-conversation coordination; chain verified file by file.
- Proof table final: 7 GREEN, 2 PARTIAL, 1 NOT-PROVEN
  (`outbox/TEST-01/ITEM-001-proof-table.md` — signed, cite don't re-run).
- PKT-001 STANDS (QA verdict `outbox/DOC-01/ITEM-001-packet-qa.md`); freshness
  precedent set: map dated pointers in newer packets, never silent-patch.
- U-ledger (HANDOFF-001 open question) RESOLVED: ledger opens and streams for
  agent-system docs work; session `20260923-222400-…` is the live proof.
- D-DOG-01 (evidence-chain link gap after owner rewrite) confirmed with split fix.
- Directive cited tip `f0685ed`, executed at `43c4400`; delta = directive file
  only — no scope drift.

## FACTS DISPROVED

- "Agent-system work cannot carry ledger evidence" (disproved — session open).
- "PKT-001 needs a v2 after the rewrite" (disproved — no claim changed).

## IMPORTANT DISCOVERIES

- The owner rewrite is the first live test of coordinator-advances-canonical
  discipline — and it exposed D-DOG-01: canonical files advanced while
  derived-chain links went stale. The protocol needs the link-maintenance rule
  (proposed: every CURRENT/WORKSTREAMS integration must preserve or refresh
  packet/handoff backward links — MERGE_REQUEST item).
- Tip-marker churn confirmed (every commit stales `Tip:` headers): SYSTEM
  update-rules amendment proposed (roll at integration only; handoffs cite
  branch+commit as the live tip source).

## CURRENT ARCHITECTURAL MODEL

As CURRENT.md 2026-09-24. No change.

## CONTRADICTIONS

- None new; C1/C2 representations verified intact post-rewrite.

## UNKNOWN / UNRESOLVED (explicit, not implied away)

- MULTI-AGENT independence (needs ≥2 threads) — PARTIAL, closable by owner
  launching a second agent from HANDOFF-004 alone.
- CROSS-CHATGPT genuineness (needs independent ChatGPT session) — NOT PROVEN,
  closable via the P1-01 ChatGPT conversation on boot + CURRENT only.
- COMPACTION links — PARTIAL, closable by accepting the MERGE_REQUEST below.
- ROSTER IMPL-02 RESERVED→ACTIVE flip — awaiting coordinator (in MERGE_REQUEST).

## PROPOSED CHANGES (for IMPL-02 integration + coordinator ruling)

1. PKT-002 (findings + lineage + hash pins + PKT-001 reader mapping).
2. WS-001 card evidence-chain section (branch).
3. SYSTEM.md update-rules amendment: tip-marker + link-maintenance rules (branch, flagged for review).
4. MERGE_REQUEST: ROSTER flip, CURRENT/WORKSTREAMS packet-handoff links, SYSTEM amendment review.

## FILES CHANGED (drill so far, uncommitted on branch)

- `handoffs/HANDOFF-002.md`, `HANDOFF-003.md`, `HANDOFF-004.md` (this file)
- `outbox/IMPL-02/ITEM-001-directive-accept.md`
- `inbox/TEST-01/ITEM-001-handoff-notice.md`, `outbox/TEST-01/ITEM-001-proof-table.md`
- `inbox/DOC-01/ITEM-001-handoff-notice.md`, `outbox/DOC-01/ITEM-001-packet-qa.md`

## TESTS RUN / GATES RUN

- Proof table = test run (mechanical checks per falsifier, enumerated in evidence).
  No product gates — docs-only.

## DECISIONS / TRANSCRIPTS / PACKETS TO READ

- Coordinator needs: this handoff + TEST-01 proof table + DOC-01 QA + PKT-002
  (forthcoming) + final MERGE_REQUEST. Transcript only on extraction dispute.

## NEXT ACTION

IMPL-02: integrate (PKT-002, card fix, SYSTEM amendment, session pointer,
final MERGE_REQUEST) → commit branch → push → report SHA + verdict.
COORD-01: review branch, rule MERGE_REQUEST, merge, decide second-agent and
ChatGPT-conversation closers for the two open proofs.

## CONTEXT BUDGET RECOMMENDATION

This handoff + two evidence items + PKT-002. Full chain on demand only.
