---
item_id: ITEM-003
kind: MERGE_REQUEST
from: IMPL-02
to: COORD-01
workstream: WS-001
date: 2026-09-24
repository_tip: b5cdb24
branch: impl-02/p1-01-closers
status: DONE
links:
  handoff: HANDOFF-006
  packets: [PKT-003]
  decisions: []
  transcript: none-required
  directive: DIR-002
---

# ITEM-003 — Coordinator rulings owed (DIR-002 staging close)

## Summary

Branch `impl-02/p1-01-closers` stages both independence-proof closers with no
simulation and no verdict change. Requesting: IMPL-03 slot, P1-01 row closer
links, SYSTEM seal-rule review, merge, directive flip, owner-run closers.

## Detail — requested rulings

1. **ROSTER.md:** reserve IMPL-03 (RESERVED, "independent closer, HANDOFF-005
   designated, launch by owner with that file + repo only").
2. **WORKSTREAMS.md P1-01 row:** link the staged closers (HANDOFF-005,
   CROSS-CHATGPT-CLOSER.md, PKT-003, HANDOFF-006) in Evidence; keep verdict
   PARTIALLY PROVEN.
3. **CURRENT.md open-closers section:** point at the two staged closer files
   so a fresh reader finds the runnable next step, not just the gap statement.
4. **Seal findings (new protocol, review asked):** seal-before-run +
   rubric-before-run (PKT-003) — accept into procedure or return with changes.
   No SYSTEM edit made on branch; proposing the rule here first.
5. **Merge** `impl-02/p1-01-closers` → `main` after review.
6. **Directive:** flip DIR-002 OPEN → DONE (owner act; ACCEPT in ITEM-004).
7. **Owner runs (the actual closers):** launch IMPL-03 per HANDOFF-005 seal;
   run a fresh ChatGPT session per CROSS-CHATGPT-CLOSER.md §§0–2; deposit
   outputs; coordinator applies the in-file rubrics. Either green flips its
   proof; both green → MERGE_REQUEST for P1-01 → PROVEN.

## Coordinator ruling

All staging/integration rulings are complete:

1. IMPL-03 reserved for the independent closer.
2. P1-01 WORKSTREAMS evidence now links the sealed closer apparatus.
3. CURRENT now points directly to both runnable closers.
4. Seal-before-run + rubric-before-run accepted into SYSTEM §13.
5. `impl-02/p1-01-closers` merged to `main` as PR #2; merge commit `63ba55c91eb2531804b0310c65448138f0630ab0`.
6. DIR-002 marked DONE.
7. Owner-run closers remain the only path to changing the two proof verdicts.

## Final staging verdict

**P1-01: PARTIALLY PROVEN**

MULTI-AGENT = PARTIAL. CROSS-CHATGPT = NOT PROVEN.

## Context budget

HANDOFF-006 + PKT-003 + the two closer files.
