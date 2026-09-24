> **Classification: DERIVED — CURRENT**
> **Workstream:** WS-002 (P1-02) · **Status:** PILOT LAUNCH FOLDER (research result ingested, first slice in flight)
> **Base tip:** `ef26df8` · **Agent:** IMPL-04 · **Branch:** `impl-04/p1-02-authority-pointer-slice`
> **Authority note:** this folder is a launch surface only. It is not Ω law, not BCP state, not ontology.

## Mission (one line)

Prove the smallest P1-02 reconciliation function: a read-only, deterministic
authority-pointer contradiction detector over a bounded corpus — one real
contradiction detected, one semantic-freshness case ignored, one unresolved
state preserved.

## Bounded corpus (frozen for this pilot)

* `README.md`
* `AGENTS.md`
* `BUILD_CONTEXT.md`
* `docs/CURRENT-CONTEXT.md`
* `docs/agent-system/CURRENT.md`
* `docs/cleanup/AUTHORITY-MAP.md`
* `docs/cleanup/CONFLICT-REGISTER.md`
* plus explicitly referenced target: `ORCHESTRATION-REDESIGN.md`

## Mechanism

* Implementation: `authority-pointer/check.py` (stdlib only, read-only, deterministic JSON).
* Tests: `authority-pointer/test_check.py` (`python -m unittest`).
* How to run: see `authority-pointer/README.md`.
* Working vocabulary note: the seven-dimension labels used in findings
  (authority/lifecycle/etc.) are **working vocabulary for this report only**.
  They are not persisted as Ω law, BCP state, or ontology (scope rule).

## Evidence chain (keep current, see D-DOG-01)

* Research charter (PROPOSED, not law): `P1-02-RESEARCH-CHARTER.md` (this folder; verbatim + banner).
* Packet: `../../packets/PKT-006-p1-02-authority-pointer-slice.md` (to be deposited).
* Handoff: `../../handoffs/HANDOFF-010.md` (to be deposited, IMPL-04 → COORD-01).
* Merge request: `../../outbox/IMPL-04/ITEM-001-merge-request-p1-02-slice.md` (to be deposited).

## What is already done (do not redo)

* P1-01 PROVEN; WS-001 closed closers; coordinator tip `ef26df8`.
* P1-02 remains REGISTERED in `WORKSTREAMS.md`; no setup prompt; no substrate
  before this pilot.

## Output paths for agents on this workstream

* Implementation → `authority-pointer/` · scratch → `work/`
* Packets → `../../packets/` · handoffs → `../../handoffs/`
* Coordination signals → `../../outbox/IMPL-04/`
