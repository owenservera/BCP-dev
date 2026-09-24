# BUILD_CONTEXT.md — what exists in BCP-dev today (2026-09-23 cleanup)

> Snapshot as of the 2026-09-23 cleanup at HEAD `18242a3` + cleanup commit.
> Numbers below are era-true for that snapshot; live tip and current state:
> `docs/agent-system/CURRENT.md`. Do not cite this file's HEAD/counts as current.

## What exists today

A parked, fully-checkpointed migration forge at HEAD `18242a3` + cleanup commit
(see `docs/cleanup/REPOSITORY-CLEANUP-REPORT.md`). Two experimental lanes built
and externally verified; one lane released but never started; automation
installed and acceptance-proven; two real VIVIM→Ω migrations verified. Board is
at rest: zero active leases, validate 0 errors.

## What is BCP?

BCP-SPEED (`bcp-speed/bcp/`) is a **generic coordination substrate**: flat-YAML
capabilities, leases with TTL/heartbeat, typed dependencies, experiments,
discoveries/failures, append-only log, generated views. It tracks work; it is
not the product. 49 capabilities (FAM-01..14), 8 closed lease records, 99 log
events, 21 discoveries, 1 failure. Write path: `bcp_tool.py` only.
Detail: `docs/CONTEXT-system.md`.

## What is BCP migration?

The migration system on top of BCP: forensic assay → behavior spec →
canonicality verdict → Ω mapping → independent verification, recorded per
migration in `bcp-speed/bcp/migration/MIG-NNN-*/` (schema + checker
`verify_migration.py` + registry `index.json`). State-table promotion
(`state/migrations.yaml` + sweep guards) explicitly deferred after MIG-002 —
two examples justify a registry file, not a state migration. Model:
`docs/migration/MIGRATION_MODEL.md` (PROPOSED-but-exercised).

## What is VIVIM?

`vivim-original-baseline/vivim-final-enhanced/` — the legacy monolith and
**read-only behavioral mine**: `src/` 1051 files, `src/intel/nlcl` 59 files
(fully assayed → 63 intents), ~400 Prisma `model` blocks across split schemas
(count reconciliation owed at Path-C start). Evidence, never authority.

## What is Ω?

`omega-baseline/omega-final/` — the destination: everything-is-a-plugin
runtime under B1–B5 boot law + ~140 ratified decisions. Host frozen at
1500/1500 LOC, 18-spec composition matrix, Chrome-master/slave-only v1
(D-418/D-456). Law: `docs/decisions/CURRENT-INVARIANTS.md`. Gate
(`bun run omega:gate`) is the arbiter.

## Current migration state

| Item | State |
|---|---|
| EXP-2026-004 Path A (Chrome skeleton 07.1–07.4) | MERGING, all L2, fixture-proven |
| EXP-2026-005 Path B (Intent fabric 08.1–08.4) | MERGING, all L2, fixture-proven |
| EXP-2026-006 Path C (Airlock 09.1) | proposed, gate OPEN, never started (c1 unspawned) |
| MIG-001 chatgpt-send-message | VERIFIED (INTENTIONALLY_TRANSFORMED; live UNVERIFIED) |
| MIG-002 claude-send-message | VERIFIED (INTENTIONALLY_TRANSFORMED; live UNVERIFIED) |
| Automation Tasks 1–6 | PASS (Task 6 conditional: live idle-fire deferred, board parked) |
| Opened owed items | b1's formal b2-consumption word; `omega:gate`-at-tip check (004); model-count reconciliation |

## What is explicitly NOT yet proven

No LIVE Chrome turn has ever run; A+B never integrated (only pairwise hash/IR
proofs); automation never stressed under a live lane; C's bridge economics
unknown (adapter sunset clause stands guard). Full gap list:
`docs/CONTEXT-product.md` §4.
