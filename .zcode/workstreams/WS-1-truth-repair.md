# WS-1 — Truth Repair (gates + corpus)

> Status: **ACTIVE** — owner "Begin" 2026-09-29.
> Done: **items 1, 2, 3, 6** — item 1 fold committed `b6e3cad5` (parallel session; fold now reads
> 163 decision rows / 151 test files / 27 plugins / 19 compositions, and D-456's citation was
> repaired); items 2/3/6 committed `dab1f7db` (docs corridor WS-1.2/3/6).
> Item 4 (D-213) and item 5 (verify-status `/1100`) in flight as corridor WS-1.4/5 — scoped to
> `tooling/gates/decisions.ts` and `tooling/ci/verify-status.ts`, files no other writer holds.
> **Concurrency finding (for METHODS-01):** two corridors writing one worktree make a gate result
> unattributable to either change — the docs corridor's green ran on a tree another session had
> already altered. One corridor per worktree, or worktree-per-corridor, is the fix to consider.
> Owner: DELIVERY-01 (execution) · GOVERNOR-01 (challenge) · ratified by owner
> Serving workflows: `omega-build` (one corridor per item), `omega-verify` (closure)

## Purpose

Make the corpus's time dimension truthful and the machine gates green again. Evidence:
Ω standing-state sweep (2026-09-29): 28 drift claims, 23 confirmed; `omega:quick` red at the
genome stage.

## Backlog (each item = one bounded corridor)

| # | Item | Evidence |
|---|---|---|
| 1 | Regenerate the genome fold (`build/genome.json`/`genome.md`) and commit | `genome.ts --check` exits 1: fresh fold 151 test files / 27 plugins vs committed 144 / 25 |
| 2 | Demote `ROADMAP.md`: superseded-by banner (D-410 + `docs/forge/BACKLOG.md`), correct host-wall (1,100 → 1,500/1,500, zero headroom, D-391) and spec-freeze (16 → 18, D-391/D-406), remove spent decision point (D-389/D-390 already RATIFIED) | sweep findings (verified, high/medium) |
| 3 | Annotate stale cross-references in D-313:34, D-327:14, D-323:30, D-372:59, D-391:26 ("status superseded as-of …", lineage preserved) | sweep findings (verified) |
| 4 | Fix the D-213 hole in `decisions.ts` (include index-only rows) so the open board sees the one PROPOSED row two ratified records build on | sweep finding (verified, medium) |
| 5 | Fix `tooling/ci/verify-status.ts:68` printing `/1100` | sweep finding (verified, high) |
| 6 | Document the decision-SHA provenance boundary (canonical Ω repo vs this snapshot checkout, `e724a517`) — or restore history from the bundle if the owner prefers real verification | `decisions.ts` exits 1, 136 issues; law unverifiable here, not disproven |

## Exit criteria

`bun --cwd omega-baseline/omega-final run omega:quick` green; a fresh `omega-reality-check`
shows zero confirmed high/medium drift in the law + substrate areas; each item closed with an
`omega-verify` receipt.
