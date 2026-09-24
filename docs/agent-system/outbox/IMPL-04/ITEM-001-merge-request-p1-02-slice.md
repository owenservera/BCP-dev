---
item_id: ITEM-001
kind: MERGE_REQUEST
from: IMPL-04
to: COORD-01
workstream: WS-002
date: 2026-09-24
repository_tip: ef26df8
branch: impl-04/p1-02-authority-pointer-slice
status: OPEN
links:
  handoff: HANDOFF-010
  packets: [PKT-006]
  decisions: []
  transcript: none-required
  directive: none-assigned
---

# ITEM-001 — MERGE_REQUEST (P1-02 authority-pointer pilot)

## Summary

Branch `impl-04/p1-02-authority-pointer-slice` delivers the first P1-02 real slice: read-only deterministic `authority-pointer/check.py` + 10/10 unittest + deterministic report + PKT-006 + HANDOFF-010. Proves one contradiction (`README.md:17` vs historical banners), one semantic-freshness ignore (`CURRENT.md` tip roll), one unresolved preservation (C8/C11/C12), with zero tracked modifications and BCP validate 0 errors. Requesting: register IMPL-04, link WS-002 pilot evidence, keep P1-02 REGISTERED (no promotion), merge.

## Detail — rulings executed (evidence, not proposals)

1. **Positive:** FINDING-001 `contradiction` — README canonical claim vs target HISTORICAL banner + 3 governors (AGENTS, CONTEXT, MAP). Report-only.
2. **Negative:** FINDING-002 `consistent-semantic-tip` — stored `de147d6` vs HEAD `ef26df8…`, convention "roll this marker"+"consolidation" present; passes for fixed + live heads.
3. **Unresolved:** FINDING-003/004/005 `unresolved-preserved` — C8/C11/C12 all `[OPEN]`; no winner.
4. **Determinism/read-only:** rerun hashes identical (`0e69244b…587907b` stdout; `2aa3c91d…77889755` file, 5660 bytes); corpus hashes equal before/after; `git diff` empty.
5. **Reuse/safety:** consumes banners/registers only; no second BCP/Ω parser; no delete/rewrite/ratify; 7-dimension labels are report vocabulary only.
6. **Deliberately untouched:** `README.md`, `CURRENT.md`, `WORKSTREAMS.md`, `ROSTER.md`, BCP `state/`+`log/`, Ω records, `vivim-original-baseline/`, untracked surfaces, no P1-03+ work.

## Requested action

1. Review branch `impl-04/p1-02-authority-pointer-slice` (10 new files, 0 modifications — 9 pilot files + `WS-002/P1-02-RESEARCH-CHARTER.md` durability fix).
2. Apply coordinator-owned edits only (agents propose, coordinator disposes):
   - `ROSTER.md`: add IMPL-04 row — pilot implementer, WS-002, branch + HANDOFF-010, status per coordinator judgment (proposed STANDBY with pilot delivered, or ACTIVE if a second slice is tasked).
   - `WORKSTREAMS.md` P1-02 row: append pilot evidence links (launch folder `workstreams/WS-002/`, research charter `WS-002/P1-02-RESEARCH-CHARTER.md` (PROPOSED), `packets/PKT-006…`, `handoffs/HANDOFF-010`, this ITEM-001). Do NOT flip status to ACTIVE; leave REGISTERED pending owner setup-prompt decision.
   - `CURRENT.md`: no content change proposed.
3. Merge to `main` (`--no-ff`) if accepted; no tip roll required beyond normal integration.
4. Rule next: plugin-authoring second slice only after this integration; no scope expansion in this turn.

## Addendum — durability fix (2026-09-24)

* Research charter now durable at `docs/agent-system/workstreams/WS-002/P1-02-RESEARCH-CHARTER.md`
  (PROPOSED, verbatim + banner; closes U7). Pilot otherwise unchanged and re-verified:
  `check.py` EXIT 0, unittest 10/10 OK, report byte-identical (5660 bytes,
  `2aa3c91d…77889755`), `validate.py` 0 errors, no tracked modifications.
* Pilot verdict stands: SUCCESS for one slice. P1-02 remains NOT PROVEN.
* Durability commit + push recorded in final report (commit SHA reported back alongside this item).

## Context budget

HANDOFF-010 + this item. PKT-006 on proof/falsifier dispute; `authority-pointer/check.py` + report JSON on mechanism dispute.
