# CONFLICT-REGISTER — contradictions found during 2026-09-23 cleanup

Key: RESOLVED = settled with cited authority · EXPLAINED = era-true, no action ·
OPEN = unresolved, owner owns the next step.

## C1 — "Nothing built" vs "Tasks 1–6 PASS" [RESOLVED]

- A: `ORCHESTRATION-REDESIGN.md:2` — "Status: DESIGN. Nothing below is built yet."
- B: `docs/CONTEXT-system.md` §6 + `bcp-speed/bcp/workspaces/STATE.json` — all six PASS.
- Evidence: `workspaces/task-N/RESULT.md` ×6, dated 2026-09-22, post-date A.
- Resolution: A is the historical plan, B its execution. A bannered HISTORICAL.

## C2 — Lane first-lease orders vs merged board [RESOLVED]

- A: `agents/lanes.md` Lanes A/B/C — acquire FAM-07.2 / 08.1 / 08.4 at L1.
- B: live state — 07.x/08.x all L2, experiments 004/005 merging, nothing leasable.
- Resolution: sequences are completed history; universal rules + LOOP PROTOCOL stand.
  Banner added; coordinator re-issues on resume.

## C3 — Inbox time-bound directives vs parked board [RESOLVED]

- A: W3 hold "till 23:04Z", W5 "b2 holds 08.4 till 23:04Z+", idle-lane nudges (2026-09-22).
- B: `docs/CONTEXT-appendix.md` §3–§4 — lease stall-freed 17:46Z, board parked, 0 active.
- Resolution: entries parked, not open orders. Per-file STATUS banners added.
  Inbox files NOT restructured (coordinator's channel; append-only convention kept).

## C4 — Host LOC 1100 remnants vs B5 1500 [EXPLAINED]

- A: `BENCHMARKS.md:53` ("gated against 1100"), old D-record Evidence rows (1039/1100).
- B: B5 re-frozen 1500/1500 by D-391; CURRENT-INVARIANTS.md budget watch.
- Evidence: D-403 doc-drift record already reconciled the drift class.
- Resolution: A entries are era-true dated measurements in an append-only log /
  frozen ratified records — must NOT be edited. No action. Fresh readers use
  CURRENT-INVARIANTS.md.

## C5 — Composition counts 16 vs 17 vs 18 [EXPLAINED]

- A: older records/prose say 16 (D-370) or 17 (D-391).
- B: present law 18 specs (D-391→17, D-406→18 via matrix path).
- Resolution: numbered eras of the same freeze; D-403 reconciled. Present law in
  CURRENT-INVARIANTS.md. No action.

## C6 — Ollama-first vs Chrome-only [RESOLVED]

- A: vision/roadmap/wave passages naming Ollama pilots.
- B: D-418 (directive) + D-456 (RATIFIED): v1 ships Chrome master/slave only.
- Evidence: mechanical test `tooling/gates/test/d-456-substrate-removal.test.ts`
  greps planning docs; `provider.llm` stands as cited history only.
- Resolution: settled law. Fresh readers treat any unmarked Ollama-path text as
  history; markers are in place at every superseded passage.

## C7 — "merging / verified / green" vs honest gaps [CLARIFIED]

- A: TRACKER.md "ALL L2 ✅ verified", sweep `merging` + INTEGRATION_READY.
- B: `docs/CONTEXT-product.md` §4 — fixture-proven not live-proven; merging ≠
  integrated; `omega:gate`-at-tip never checked; b1's consumption word verbal only.
- Resolution: terminology pinned in `/AGENTS.md` ("must never be assumed") and
  `docs/CURRENT-CONTEXT.md`. `merging` = sweep depth-math; `verified` = external
  fixture verification. No live/integration claim exists — and none is made here.

## C8 — Prisma model counts 201 vs ~400 [OPEN]

- A: strategy/bridge docs say "201 models → ~16 namespaces".
- B: `docs/CONTEXT-product.md` §1: ≈400 `model` blocks counted across 3 split schemas.
- Remaining uncertainty: which count is canonical; likely split-schema double-count
  vs single-schema source. Owned by Path-C start (reconcile before the 09.1 map).
  Flagged in `/BUILD_CONTEXT.md` and `docs/CURRENT-CONTEXT.md`.
- Measured 2026-09-24 (E-01R, P1-02): split schemas declare 111 (system) + 90 (user)
  = 201 declarations across 200 unique model names (sole overlap: `SchemaMeta`,
  present in both); unified `prisma/schema.prisma` declares exactly those 200;
  `frontend/prisma/schema.prisma` declares 2 more under a separate schema. The ~400
  figure is a bad denominator (split-file block sum double-counts), not ~400 distinct
  models. Canonical-name reconciliation still owned by Path-C start.

## C9 — "Promote after #2" vs no state/migrations.yaml [RESOLVED]

- A: `docs/migration/MIGRATION_MODEL.md` — "Promote to BCP-enforced only after #2."
- B: no `state/migrations.yaml` exists post-MIG-002.
- Evidence: `docs/migration/MIGRATION_COMPARISON_001_002.md` — promotion remains deferred.
- Resolution: deliberate deferral, recorded — registry (`index.json`) is the current machinery.

## C10 — BCP README "140 capabilities" vs 49 [RESOLVED]

- A: `bcp-speed/bcp/README.md` — 140-cap working example; EXP-2026-001 seed text.
- B: `state/capabilities.yaml` — 49 capabilities (FAM-01..14).
- Resolution: README describes generic package shape; instance diverges.

## C11 — Untracked Prompt-4 / Chameleon work vs cleanup scope [OPEN]

- A: cleanup prompt says do not implement Prompt 4 / substitution experiments.
- B: tracked Prompt-4 outputs exist on main; other local surfaces remain untracked.
- Resolution: NONE TAKEN — owner decides resume/rebase/replan.

## C12 — "186 engines" vs 32 top-level dirs [OPEN]

- A: legacy docs claim 186 engines.
- B: `docs/CONTEXT-product.md` §1: 32 top-level dirs verified.
- Measured 2026-09-24 (E-01R, P1-02): 186 top-level files + 32 top-level dirs =
  460 recursive `.ts` files. Different denominators; not a contradiction in counts.

## C13 — Prompt-4 interrupted outputs vs "no competing authoring path" [OPEN]

- Prompt-4 outputs are committed but unratified; gates have not been rerun.
- Resolution: owner decides resume/rebase/replan.

## C14 — Authority-pointer pilot branch/artifacts are unavailable [RESOLVED — NOT AVAILABLE — 2026-09-25]

- Setup/README lineage names prior evidence on `impl-04/p1-02-authority-pointer-slice`
  (PKT-006, HANDOFF-010, ITEM-001, and pilot files).
- Direct current-main verification: branch listing returns only `main`; the cited
  branch is absent; current tree contains none of the cited pilot artifacts.
- Repository-wide commit/name checks performed for this workstream found no recoverable
  commit or artifact matching that branch/pilot evidence.
- Resolution: **NOT AVAILABLE**. The pilot is not usable evidence for current P1-02.
  The setup prompt's "verify against main" prerequisite is therefore unsatisfied.
  Do not cite or build on the pilot unless a recoverable repository object is later found.

## C15 — FAM-07/FAM-08 claimed L2 vs seed history and source reality [RESOLVED — DIRECT CONTRADICTION — 2026-09-25]

- Current `bcp-speed/bcp/state/capabilities.yaml` claims L2 for every FAM-07.1–07.4
  (Path A) and FAM-08.1–08.4 (Path B).
- `docs/archive/sessions/session-ses_f371.md` records the seed commit `d949b06`
  as "FAM-07/08/09 at L0", immediately followed by a metrics-recompute commit that
  again states "FAM-07/08/09 at L0".
- `bcp-speed/bcp/state/experiments.yaml` has `agents_assigned: []` for EXP-2026-004
  and EXP-2026-005.
- Source-tree implementation search for FAM-07/FAM-08 and their named capabilities
  finds no implementation in tracked `.ts/.js/.py` source. The apparent work under
  `bcp-speed/bcp/work/` is not part of the current repository state.
- Owner-confirmed repository boundary: this repo is the full current state; there is
  no external/unpushed implementation to check.
- Resolution: **DIRECT CONTRADICTION**. Path A and Path B implementations are
  **currently nonexistent/unavailable in this repository**. The L2 state claims are
  stale/false as present-state implementation claims and must not be used as proof.
  Do not downgrade this to "unverified": the contradiction is directly established
  by the seed history plus absence of implementation in the full current repo.

