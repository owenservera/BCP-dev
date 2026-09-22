# D-443 — The context substrate: deterministic assemblies, cited provenance, named eviction

## Status

RATIFIED

## Context

- The Ω-3 spec (paper `D-427` — THIS tree's D-427 is Ω-DEV.3; the collision
  is recorded in the genome lineage note, not hidden; re-materialized per
  `omega-upgrades/RE-MATERIALIZATION-NOTE.md`) names the context layer: the
  mind spine's assembled window — a per-namespace, evidence-citing,
  deterministic projection of the vault (§12) where the same query against
  the same vault assembles the same window, every included row carries its
  refs and its epistemic kind, and the window itself is metered like any
  other resource.
- The one invariant: **an uncited inclusion is a rumor.** The window is
  evidence or it is nothing — a deterministic digest over the cited refs,
  byte offsets for every included row, named eviction at caps (never silent
  truncation), a budgetRef seam to Ω-2, and the digest cache as a
  read-through of the fold, never a second truth.

Blocks: none

## Options

| Criterion | (a) pure assembly core in vivim-run (cited sources + digest fold + named eviction) | (b) per-consumer truncation | (c) raw vault.getmany only |
|---|---|---|---|
| Deterministic window (F12) | Yes — the fold is the truth, replays byte-identical | No — each consumer re-truncates | No assembly at all |
| Provenance completeness | Yes — refs + byte offsets + epistemic kinds ride every row | No | Partially — reads without citations |
| Eviction is named | Yes — CTX_EVICT_UNDECLARED at caps, fail-closed | No — silent truncation (§12's warning) | No |
| Zero host LOC | Yes | Yes | Yes |

## Decision

**Decision:** (a) — `plugins/vivim-run/src/context.ts`, in substance:

- **Assemblies** (ns `ctx.window`): `{assemblyId, principal, query, sources:
  [{ns, role, included: [{id, rev, byteOffsets, epistemicKind}], evicted,
  rule?}], digest, budgetRef, vaultVersion, assembledAt, v}` — the digest a
  deterministic fold over included refs + eviction rules + bounds (sections
  sorted by ns, rows by id then rev, canonical JSON, sha256; supplied row
  order never moves it).
- **The door** (`assemble`): CTX_BUDGET_UNMETERED without a budgetRef (§18 —
  the window is a scheduled workload); CTX_NAMESPACE_UNKNOWN for an ns the
  vault does not carry; CTX_ASSEMBLY_UNRESOLVABLE when a cited source is
  absent; CTX_BOUND_EXCEEDED past the 512-distinct-id per-namespace read
  bound; CTX_EVICT_UNDECLARED at cap without a named rule (newest-N |
  oldest-N — unknown rule names refuse too, the D-378 fail-closed posture);
  CTX_KIND_UNLABELLED for included rows carrying no epistemic kind (§13).
- **The cache**: assemblies cached by digest (principal- and
  vault-version-scoped — D-379's no-cross-principal law inherits) as a
  READ-THROUGH of the fold; a stored digest the fold cannot reproduce
  refuses CTX_DIGEST_DIVERGENCE loudly — `verifyAssembly` re-folds before
  serving, `ingest` refuses tampered rows at the door.
- **The light call**: `versionCheck` — an unchanged vault version-checks
  through the digest cache with zero full assemblies (the D-387
  bodiless-snapshot posture preserved as contract).

## Consequences

- `vault.getmany@1` (D-387) becomes a contract hop instead of a perf trick:
  the consumer supplies the batch, the fold assembles the window with
  citations — "why did the model see that?" answers from rows.
- As-built honesty: this landing generalizes the fold, the register, and the
  two ops the lane wires (context.assemble@1, context.read@1 — both READ;
  the ctx.window write rides the run plugin's ring-first mirror posture).
  The spec's ctx.window.diff@1 and the nlcl projection language stay
  unclaimed (the query field carries the canonical intent ref; ranking ML
  never enters the fold — proposal-only per Ω-2.6).
- Zero host LOC; no new dependencies; existing tests stay green.

## Evidence

- Falsifiers, green in this record's tree BEFORE the flip per `D-364`
  (`omega:loop --stub D-443` generates the RED stub this list resolves to):
  - `F-CTX.1` (deterministic-assembly) — same query + same source rows ⇒ byte-identical window and digest, ×100 replays, across boots (a fresh registry derives the same digest — the fold is the only truth); supplied row order never moves it
  - `F-CTX.2` (provenance-completeness) — every included row resolves to a live revision with byte offsets that tile the window exactly; a cited source that is absent refuses CTX_ASSEMBLY_UNRESOLVABLE; a replay that cannot reproduce the digest refuses CTX_DIGEST_DIVERGENCE rather than serving stale
  - `F-CTX.3` (eviction-is-named) — a namespace over cap → the named rule applies and is cited in the row (the evicted counted), or CTX_EVICT_UNDECLARED; never a shorter window with no explanation
  - `F-CTX.4` (refusal-proves) — unknown ns, unlabelled kind, unmetered assembly, over-bound, absent source, tampered digest: each register code fired by a planted violation
  - `F-CTX.5` (the-light-call) — an unchanged vault version-checks through the digest cache with zero full assemblies; a bumped version re-derives, and the same rows land the same digest
  - `F-CTX.6` (headless) — the ceremony is daemon/CLI-only; the window renders as cited text
  - `F-CTX.7` (loud-failure) — zero silent-truncation paths, mechanically checked: any assembly that dropped rows cites the rule that dropped them
- Files: `plugins/vivim-run/src/context.ts` (the pure core), wiring in
  `plugins/vivim-run/src/index.ts`, `tooling/gates/test/f-ctx.test.ts`.
- Refusal register (exact): CTX_NAMESPACE_UNKNOWN · CTX_ASSEMBLY_UNRESOLVABLE ·
  CTX_DIGEST_DIVERGENCE · CTX_EVICT_UNDECLARED · CTX_KIND_UNLABELLED ·
  CTX_BUDGET_UNMETERED · CTX_BOUND_EXCEEDED.
- Precedents: the re-materialized Ω-3 spec (paper `D-427`); `D-387`
  (vault.getmany + the bodiless snapshot); `D-378` (the fail-closed cap
  posture); `D-379` (the sharing boundary); `D-410-C` (cited revisions
  protected sight unseen); `D-364`.


- Ratified on greens (evidence-class, F-CTX.1-7 green in this record's tree BEFORE the flip per D-364): landing commit e2dff6f; full gate green 1362/0 ×2 on the PROPOSED tree (2026-09-21T06:37:56Z and 06:43Z; the prior tip's 1320 + 42 new); zero host LOC; anvil untouched.

## Index

summary: plugins/vivim-run/src/context.ts — the context substrate: deterministic window assemblies over cited per-namespace sources (digest fold over refs + rules + bounds, byte offsets, epistemic kinds), named fail-closed eviction at caps, the principal-scoped digest cache as a read-through never a second truth, CTX_DIGEST_DIVERGENCE on unreproducible replays, and the light call that version-checks an unchanged vault with zero full assemblies
rationale: An uncited inclusion is a rumor with a prompt wrapped around it - every consumer that re-invents truncation re-invents SILENT truncation, and an unassembled context cannot cite what it included, so the window is evidence or it is nothing (Omega-3, the context substrate, re-materialized spec)
class: evidence
