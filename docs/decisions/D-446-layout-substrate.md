# D-446 — The layout substrate: versioned placement rows that restore exactly and refuse forks

## Status

RATIFIED

## Context

- The Ω-6 spec (paper `D-430`, re-materialized per
  `omega-upgrades/RE-MATERIALIZATION-NOTE.md` — the transcript original is
  not on disk; this tree record lands the re-materialized spec's mechanism)
  names spatial state as vault data: placement as versioned, restorable rows
  that reference object identity without duplicating object state (CP-3).
- The one invariant: **the layout survives the app.** A snapshot is a
  deterministic digest fold over canonical tile state; restore is verified
  re-hydration (digest-checked, never blind); and two snapshots claiming one
  parent refuse `LAYOUT_SNAPSHOT_FORKED` — divergence reconciles through one
  named merge record whose per-tile fold is deterministic, never a silent
  second child (CP-1's one-truth doctrine applied to space).
- ns `canvas` stays RESERVED for the future canvas-surface writer (the
  spec's own judgment, §3): this substrate lands in ns `layout` — the
  reservation is discipline, not an empty seat to borrow.

Blocks: none

## Options

| Criterion | (a) pure layout core in vivim-run (snapshots + digest fold + verified restore + merge fold) | (b) placement state in the renderer | (c) best-effort JSON dumps per save |
|---|---|---|---|
| Survives the reinstall | Yes — restore is digest-checked re-hydration | No — dies with the pixels | Partially — no verification, no lineage |
| Divergence is lawful | Yes — forks refused; merges named and deterministic | No — last save wins, silently | No |
| Zero host LOC | Yes | Yes | Yes |

## Decision

**Decision:** (a) — `plugins/vivim-run/src/layout.ts`, in substance:

- **Snapshot rows** (ns `layout`): `{layoutId, principal, tiles: [{tileId,
  x, y, w, h, z, state}], digest, parentSnapshot?}` — tiles reference
  identity (tileId), never object state; `state` is the PLACEMENT label
  (placed|ghost|shelved), not the object's own state. The digest folds the
  canonical tile projection only — fields beyond the grammar never enter it,
  so object state cannot affect placement truth.
- **The snapshot fold:** sha256 over canonical tile state (tiles sorted by
  tileId, keys sorted) — same tiles, same bytes, forever.
- **The geometry door:** invalid geometry refuses `LAYOUT_TILE_OVERLAP` —
  overlapping rectangles, non-finite or non-positive extents, and one
  identity placed twice never land.
- **The fork law (the CRDT-law substrate):** a second snapshot claiming an
  already-claimed parent refuses `LAYOUT_SNAPSHOT_FORKED`; cross-ledger
  divergence reconciles through exactly ONE named merge record — the
  deterministic per-tile LWW fold (union of tiles by identity, total order
  on canonical tile bytes: commutative, associative, idempotent — any merge
  order converges to the same digest, ×100).
- **Restore is verified re-hydration:** restoring re-computes the digest
  over the row's tiles and refuses `LAYOUT_DIGEST_MISMATCH` with the diffs —
  never blind, never "mostly restoring".

## Consequences

- Placement survives the app, the device, and the reinstall as rows; ghosts
  (§18) get placement independent of any realization; the canvas wave
  arrives onto a proved substrate with its namespace seat still reserved.
- As-built: layout.snapshot@1 (MUTATION), layout.restore@1 (MUTATION —
  refuses on digest mismatch), layout.read@1 (READ) land in vivim-run's
  lane; the merge fold lands in the pure core this wave (F-LAYOUT.2/4 prove
  it), its op seat following when the canvas wave consumes it; the vault
  mirror rides port caps when present (ring-first). Zero host LOC; no new
  dependencies; existing tests stay green.

## Evidence

- Falsifiers, green in this record's tree BEFORE the flip per `D-364`
  (`omega:loop --stub D-446` generates the RED stub this list resolves to):
  - `F-LAYOUT.1` (the-reinstall) — delete the app → reinstall → restore from the vault row → layout byte-exact (digest match), zero diffs
  - `F-LAYOUT.2` (the-merge) — two devices diverge → logs reconcile → both converge to identical layouts; zero lost tiles; exactly one named merge record per ledger
  - `F-LAYOUT.3` (refusal-proves) — invalid geometry, a forked parent claim, a tampered digest: three distinct named refusals; object-state fields cannot affect placement truth; nothing lands outside ns `layout` — `canvas` stays reserved, untouched
  - `F-LAYOUT.4` (deterministic-merge) — the same diverged logs merged 100 times (both fold orders) → the same digest, ×100
  - `F-LAYOUT.5` (ghost-placement) — suspend/discard the realization (placement state → ghost); placement rows persist; identity refs still resolve — a thousand tiles without a thousand runtimes (§18)
  - `F-LAYOUT.6` (headless) — 1–5 daemon-only; the layout is data, renderable by anything (F1)
  - `F-LAYOUT.7` (loud-failure) — no silent divergence; every reconciliation is a merge row or a refusal
- Files: `plugins/vivim-run/src/layout.ts`, ops in `src/index.ts`,
  `tooling/gates/test/f-layout.test.ts`.
- Refusal register (exact): LAYOUT_DIGEST_MISMATCH · LAYOUT_TILE_OVERLAP ·
  LAYOUT_SNAPSHOT_FORKED.
- Precedents: the re-materialized Ω-6 spec (paper `D-430`); `D-364`;
  CP-1/CP-3 (one truth; the layout survives the app); the D-332 namespace
  reservation discipline.


- Ratified on greens (evidence-class, F-LAYOUT.1-7 green in this record's tree BEFORE the flip per D-364): landing commit e2dff6f; full gate green 1362/0 ×2 on the PROPOSED tree (2026-09-21T06:37:56Z and 06:43Z; the prior tip's 1320 + 42 new); zero host LOC; anvil untouched.

## Index

summary: plugins/vivim-run/src/layout.ts — the layout substrate: versioned placement snapshots (identity-referencing tiles, deterministic digest fold over canonical tile state), verified re-hydration on restore (digest-checked, never blind), a geometry door (LAYOUT_TILE_OVERLAP), the fork law (LAYOUT_SNAPSHOT_FORKED — divergence reconciles through one named deterministic per-tile LWW merge record), and headless rendering — ns layout, canvas reserved
rationale: The layout survives the app - placement trapped in a renderer dies at the first reinstall, and two devices that diverge without a named merge record lose data wearing a sync feature's clothes (Omega-6, the layout substrate, re-materialized spec)
class: evidence
