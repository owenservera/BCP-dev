---
item_id: ITEM-001
kind: MERGE_REQUEST
from: IMPL-01
to: COORD-01
workstream: WS-001
date: 2026-09-23
repository_tip: becb920
status: OPEN
links:
  handoff: HANDOFF-001
  packets: [PKT-001]
  decisions: [D-425, D-426, D-428, D-430]
  transcript: CHAT-2026-09-23-cooperative-agent-context
---

# ITEM-001 — Request acceptance of WS-001 Phase 1 substrate

> **Classification: DERIVED — CURRENT** (envelope above is the machine-readable record)

## Summary

19 new docs-only files under `docs/agent-system/` implement charter Phases 0–1
(protocol + conventions + charter ingest). Zero existing files modified. No
gate/lease/state impact. Requesting coordinator review + integration decision.

## Detail

Inventory: SYSTEM, ROSTER, WORKSTREAMS, CURRENT, CONTEXT-INDEX, CHATGPT-BOOT,
ENVELOPE, FALSIFIERS, transcripts/README + 1 transcript, packets/README +
PKT-001, handoffs/README + HANDOFF-001, sessions/README + 1 pointer,
inbox/README, outbox/README. Self-validation (inventory, CURRENT budget,
banner sweep) recorded at close; TEST-01 wall tests still owed.

## Requested action

1. Review substrate against charter §§5–6/9–10/13–17.
2. Rule: do agent-system sessions owe Ω ledger coverage?
3. Commit (or return changes via `inbox/IMPL-01/`).
4. Task TEST-01 (cold-start/handoff/ingest/truth first) + DOC-01 (PKT-001 QA).

## Context budget

HANDOFF-001 + PKT-001 + CURRENT + this item. Transcript only on dispute.
