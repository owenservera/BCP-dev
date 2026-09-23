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

## C9 — "Promote after #2" vs no state/migrations.yaml [RESOLVED]

- A: `docs/migration/MIGRATION_MODEL.md` — "Promote to BCP-enforced only after #2."
- B: no `state/migrations.yaml` exists post-MIG-002.
- Evidence: `docs/migration/MIGRATION_COMPARISON_001_002.md` — "Promotion to
  `state/migrations.yaml` + sweep guards still deferred — two examples justify a
  registry file, not a state-table migration."
- Resolution: deliberate deferral, recorded — not an omission. Model status:
  PROPOSED-but-exercised; registry (`index.json`) is the current machinery.

## C10 — BCP README "140 capabilities" vs 49 [RESOLVED]

- A: `bcp-speed/bcp/README.md` — 140-cap working example; EXP-2026-001 seed text.
- B: `state/capabilities.yaml` — 49 capabilities (FAM-01..14).
- Resolution: README describes the generic package shape; instance diverges.
  Clarifying NOTE banner added (mechanics sections untouched — they are current).

## C11 — Untracked Prompt-4 / Chameleon work vs cleanup scope [OPEN]

- A: master prompt for THIS task: "Do NOT implement Prompt 4 / substitution experiments."
- B: untracked on disk: `bcp-algos/` ("Project Chameleon" fluid-vault sandbox),
  `omega-…/docs/architecture/` (Prompt-4 Phase 1–2 analysis), `omega-…/examples/plugin-echo2/`
  (substitution experiment V2), `setupdocs.zip`.
- Evidence: plugin-echo2's manifest names "Prompt 4, Phase 3"; architecture docs
  name "Prompt 4, Phase 1/2".
- Resolution: NONE TAKEN — left fully untouched (not staged, moved, or deleted) as
  possibly another workstream's active surface. `/AGENTS.md` marks all four
  hands-off pending owner direction. Owner decides: commit as a workstream,
  relocate, or discard.

## C12 — "186 engines" vs 32 top-level dirs [OPEN]

- A: legacy docs claim 186 engines in `src/engines`.
- B: `docs/CONTEXT-product.md` §1: 32 top-level dirs verified.
- Remaining uncertainty: counting method (files vs dirs vs submodules). Owned by
  next assay that touches `src/engines`; NLCL mine count (59 files) is separately
  verified and unaffected.
