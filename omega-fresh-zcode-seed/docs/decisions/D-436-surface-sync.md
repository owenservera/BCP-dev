# D-436 — Surface sync: derivation hashes, the live parity sweep, reasoned N/A rows, and the tamper gate

## Status

RATIFIED

## Context

- The Ω-4.5 spec (paper `D-438`, the delivered upgrade doc
  `omega-upgrades/OMEGA-4.5-SURFACE-SYNC-DRIFT.md`) names builder gap #8:
  surface parity is a constitutional claim (MAC-05: one derivation, N
  surfaces) measured by nothing. Today nothing mechanical can answer "which
  surfaces are out of sync?" — the claim rests on review.
- The one invariant this record exists to protect: **parity you cannot
  measure is parity you are guessing about.** The falsifier names the line:
  drift and orphans block surface release; hand-edits to derived artifacts
  refuse at the gate (SURFACE_DERIVATION_TAMPER — the derivation tool's
  grant is the only writer); N/A is per-op, reasoned, reviewable, revocable
  (SURFACE_NA_UNREVIEWED for blanket exemptions); the sweep is a LIVE
  dispatch probe, not a grep (a file present with broken dispatch is still
  caught).
- Recon facts that shape the mechanism: `contracts/src/surface.ts` is the
  shared derivation of record (`surfaceOpMeta` — one definition, every
  consumer); the MCP surface generates tools from the booted composition's
  routed ops (docs/SURFACES.md rule, mcp.ts:242); the CLI and web have
  their own routings; no surface carries a derivation stamp today; no N/A
  registry exists; `tooling/gates/gate.ts` is where a red sweep would land.

Blocks: none

## Options

| Criterion | (a) pure parity core + injected live probes + derivation stamps + N/A registry + gate wiring | (b) a static grep sweep over surface sources | (c) trust surfaceOpMeta and review discipline |
|---|---|---|---|
| Drift is caught even when files exist | Yes — the probe DISPATCHES per (op × surface); broken routing is drift | No — grep finds strings, not behavior | No |
| Hand-edits to derived artifacts refuse | Yes — SURFACE_DERIVATION_TAMPER at the gate; the stamp carries the derivation hash | No | No |
| N/A is honest | Yes — per-op rows with reason + author + revocation; blanket refuses | Partially — N/A by absence, unreviewable | N/A does not exist |
| Zero host LOC, no new deps | Yes — tooling/ + contracts-pure core; probes injected | Yes | Yes |

## Decision

**Decision:** (a) — `tooling/gates/surfacesync.ts`, in substance:

- **The parity core (pure).** `sweepParity(opMeta, surfaces, naRows)` folds
  the (op × surface) matrix: every routable op is BOUND on a surface when
  that surface's injected probe dispatches it; unbound with a reasoned N/A
  row → `na-declared`; unbound with no row → `SURFACE_OP_UNBOUND` (drift);
  a surface binding an op the composition does not route →
  `SURFACE_ORPHAN_BINDING`; an N/A row whose scope is `*` (blanket) →
  `SURFACE_NA_UNREVIEWED`. The verdict is a deterministic fold — the same
  inputs replay the same report byte-for-byte.
- **The probe contract.** A probe is `(op) => Promise<{dispatched: boolean}>`
  — the LIVE dispatch attempt per surface. The op layer wires real
  dispatchers (MCP tool round-trip, CLI routing, web event path); tests
  inject fakes. The sweep never greps source.
- **Derivation stamps (`surface.derivation`).** Every generated surface
  artifact carries `{surfaceRef, artifactPath, vocabularyDigest,
  derivationTool, derivedAt}`; `stampOf` parses it, `tamperCheck` compares
  it against the re-derivation — a mismatch is SURFACE_DERIVATION_TAMPER.
  The stamp registry is `surfaces/derivation.json` (the declared derived
  paths + their tools — hand-maintained input, like the genome registry).
  As-built: the registry, the stamp round-trip (`stampLine`/`stampOf`), and
  the tamper gate landed and are falsified; the stamp EMISSION into
  `build/genome.md` (the first registered path) is the declared follow-up —
  the genome's byte-stability law (D-425: no volatile fields) requires a
  content-derived `derivedAt`, and that format change rides the next
  genome-format amendment with its own falsifier walk.
- **N/A rows.** `surfaces/na.json` — one row per (op, surface) with
  `{reason, author, at, revokedAt?}`; revocation is append-only state (the
  next sweep reports the drift that returns).
- **Ops (risk-honest, via the run plugin's registry lane):**
  `surface.parity@1` READ (the sweep, runner injected);
  `surface.parity.read@1 --latest` READ (the drift query — itself an op in
  the vocabulary, parity bootstrapped); `surface.na.declare@1` MUTATION
  (one reasoned row); `surface.derive@1` EXTERNAL_MUTATION (the only
  writer of registered derived paths — the tamper gate's grant).

## Consequences

- "Which surfaces are out of sync?" is one command, answered from dispatch
  reality, with drift named per (op, surface) and release-blocked.
- As-built honesty: (1) the live-probe op layer lands with the MCP probe
  wired (the one surface whose dispatch is mechanically reachable headless
  today); the CLI/web probes are declared in the registry with their wiring
  staged for their waves — the sweep reports them `na-declared` with
  reasoned rows until then (honest N/A, not silent absence). (2) The
  derivation-stamp discipline starts with `build/genome.md` (the tree's
  most-derived artifact) as the first registered derived path; the stamp is
  embedded as an HTML comment line, the tamper check re-derives via
  `omega:genome --check`. (3) `surface.derive@1` writes only
  registry-declared paths; undeclared writes refuse with the tamper code
  (the gate's own law, restated mechanically).
- Zero host LOC; no new dependencies; the pure core + the registry + the
  stamp + the N/A file are the deliverables; existing tests stay green.

## Evidence

- Falsifiers, green in this record's tree BEFORE the flip per `D-364`
  (`omega:loop --stub D-436` generates the RED stub this list resolves to):
  - `F-SURFACE-SYNC.1` (seeded-drift) — an op bound on 4 of 5 surfaces names the fifth as SURFACE_OP_UNBOUND with the (op, surface) pair
  - `F-SURFACE-SYNC.2` (hand-edit) — a direct write to a registered derived artifact is refused SURFACE_DERIVATION_TAMPER (stamp mismatch)
  - `F-SURFACE-SYNC.3` (orphan) — a surface binding a nonexistent op reports SURFACE_ORPHAN_BINDING
  - `F-SURFACE-SYNC.4` (reasoned-na) — a per-op N/A row passes; a revoked one returns to drift; a blanket scope refuses SURFACE_NA_UNREVIEWED
  - `F-SURFACE-SYNC.5` (live-probe) — a file present but a probe that fails to dispatch is still drift (the sweep never greps)
  - `F-SURFACE-SYNC.6` (one-command) — the report renders identically from the fold on replay; clean tree renders clean
  - `F-SURFACE-SYNC.7` (headless) — the sweep is CLI/daemon-only; probes are injected, no canvas dependency
- Files: `tooling/gates/surfacesync.ts` (the pure core: stampOf, tamperCheck,
  sweepParity, renderParityReport, the N/A and derivation registries),
  `surfaces/derivation.json` + `surfaces/na.json` (the registries),
  `tooling/gates/test/f-surface-sync.test.ts` (the falsifier).
- Refusal register (exact): SURFACE_DRIFT · SURFACE_DERIVATION_TAMPER ·
  SURFACE_OP_UNBOUND · SURFACE_ORPHAN_BINDING · SURFACE_NA_UNREVIEWED.
- Precedents: spec `D-438` (Ω-4.5 — the §10 record text this tree record
  translates); `D-359` (surfaceOpMeta — the shared derivation this sweep
  measures); `D-422` (the docscan seed's report-only posture this record's
  flip discipline mirrors); `D-364` (evidence-class ratification).


- Ratified on greens (evidence-class, F-SURFACE-SYNC.1-7 green in this record's tree BEFORE the flip per D-364): landing commit 92d8657; full gate green 1306/0 ×2 on the PROPOSED tree (2026-09-21T04:56:32Z and 05:01Z; the prior tip's 1278 + 28 new); zero host LOC; anvil untouched.

## Index

summary: tooling/gates/surfacesync.ts — the (op × surface) parity sweep over injected LIVE dispatch probes (drift, orphans, reasoned N/A with revocation), the surface.derivation stamp with the tamper gate (the derivation tool's grant is the only writer), and the one-command drift report; registries surfaces/derivation.json + surfaces/na.json
rationale: Parity you cannot measure is parity you are guessing about - MAC-05's one-derivation-many-surfaces claim needs a live probe per pair, drift that blocks release, and hand-edits that refuse at the gate, because a surface that silently drifts is a lie with a router (Omega-4.5, the surface-sync spec)
class: evidence
