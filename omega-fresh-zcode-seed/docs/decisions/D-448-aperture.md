# D-448 — The aperture: per-requester projections at a width lattice, elision that never lies

## Status

RATIFIED

## Context

- The Ω-9 spec (paper `D-433`, re-materialized per
  `omega-upgrades/RE-MATERIALIZATION-NOTE.md` — the transcript original is
  not on disk; this tree record lands the re-materialized spec's mechanism)
  names the aperture: every read of a capability's state is a projection at
  a declared width, so the same evidence serves the owner, the deputy, and
  the stranger as three different honest views.
- The one invariant: **elision that is not law-side is leakage with a
  scrollbar.** Widths are a small ordered lattice (law, not adjectives);
  a view is a deterministic fold over the target's rows that never
  fabricates and never silently truncates — what the view drops it names
  as `{count, kinds}`, and `raw` minus the view equals exactly the elided
  set; widening is a governed event with a cited ceremony, never an ask;
  absent a scope the aperture fails closed to `summary`, never to full
  width.

Blocks: none

## Options

| Criterion | (a) pure aperture core in vivim-run (scope rows + the projection fold + receipts) | (b) renderer-side progressive disclosure | (c) per-field content masking |
|---|---|---|---|
| The API is not the leak | Yes — the fold elides before anything renders | No — the surface elides, the API handed over everything | Partly |
| Comparable, refutable widths | Yes — one tiny ordered lattice | No — adjectives per surface | No — per-field rules explode |
| Honest, diffable elision | Yes — {count, kinds}, mechanically checkable | No | Partially |
| Zero host LOC | Yes | Yes | Yes |

## Decision

**Decision:** (a) — `plugins/vivim-run/src/aperture.ts`, in substance:

- **Disclosure-scope rows** (ns `aperture`): `{target, principal, width:
  summary|body|detail|raw, setBy, at}` — the width lattice, ordered and
  tiny; the first `setBy` for a target is its owner (foreign writers
  refuse `DISCLOSURE_SCOPE_FOREIGN_WRITER`); an amendment that changes the
  width must cite the prior row (`supersedes`) or refuse
  `DISCLOSURE_SCOPE_CONFLICT`; a wider width additionally demands a cited
  ceremony (consent/decision refs) or refuses `DISCLOSURE_WIDENING_UNCITED`.
- **The projection fold** (`aperture.view@1`): a deterministic fold over
  the target's evidence rows at the requester's scope width — the view
  carries `{width, scopeRef, elided: {count, kinds}, evidenceDigest}`; no
  scope for the requester fails closed to `summary` (proof-of-existence),
  and an explicit width without a scope refuses `DISCLOSURE_SCOPE_UNKNOWN`;
  an off-lattice width refuses `DISCLOSURE_WIDTH_INVALID`; a fold that
  cannot re-derive its own digest refuses
  `DISCLOSURE_VIEW_NONDETERMINISTIC`.
- **Receipts** (one row per widening): `{requester, target, width,
  evidenceDigest, consentRef, at}` — the default posture is not an event,
  crossing it is; a receipt that fails to persist rolls the widening back
  loudly (`DISCLOSURE_RECEIPT_UNWRITTEN`); the audit trail reads back
  headlessly.

## Consequences

- D-379's fence gains a middle setting between "own" and "refuse"; the
  context spine's window (D-443) can mount a lawful scoop later; Ω-11's
  privacy classes intersect the lattice without owning it.
- As-built: aperture.scope.set@1 (MUTATION), aperture.view@1 (READ — the
  fold), aperture.read@1 (READ — scopes + receipts, headless) land in
  vivim-run's lane; the widen ceremony and its receipt ride the pure core
  (scope.set with cites is the cited-amendment path); the vault mirror
  rides port caps when present (ring-first). Zero host LOC; existing tests
  stay green.

## Evidence

- Falsifiers, green in this record's tree BEFORE the flip per `D-364`
  (`omega:loop --stub D-448` generates the RED stub this list resolves to):
  - `F-DISCLOSURE.1` (two-eyes) — the same vault rows projected for owner (raw), deputy (body, scope-cited), stranger (summary) → three views, each citing its scope row and evidence digest; none fabricates
  - `F-DISCLOSURE.2` (gated-widening) — the deputy widens without consent → DISCLOSURE_WIDENING_UNCITED naming the consent id; with consent → the wider view serves and the receipt row reads back through the audit path
  - `F-DISCLOSURE.3` (determinism) — the same (requester, target, width, vault state) twice → byte-identical views
  - `F-DISCLOSURE.4` (elision-honesty) — elided fields appear as {count, kinds}; raw minus the view equals exactly the elided set — mechanically diffable
  - `F-DISCLOSURE.5` (fail-closed) — delete the scope row → the stranger's next width-demanding view refuses DISCLOSURE_SCOPE_UNKNOWN and the default view falls to summary, never to full width
  - `F-DISCLOSURE.6` (headless) — 1–5 daemon-only, zero pixels; the view renders as text
  - `F-DISCLOSURE.7` (loud-failure) — zero silent-fallback paths — every branch resolves, refuses with a sentence, or rolls back with DISCLOSURE_RECEIPT_UNWRITTEN
- Files: `plugins/vivim-run/src/aperture.ts`, ops in `src/index.ts`,
  `tooling/gates/test/f-disclosure.test.ts`.
- Refusal register (exact): DISCLOSURE_WIDTH_INVALID ·
  DISCLOSURE_SCOPE_CONFLICT · DISCLOSURE_WIDENING_UNCITED ·
  DISCLOSURE_SCOPE_UNKNOWN · DISCLOSURE_TARGET_UNRESOLVED ·
  DISCLOSURE_SCOPE_FOREIGN_WRITER · DISCLOSURE_VIEW_NONDETERMINISTIC ·
  DISCLOSURE_RECEIPT_UNWRITTEN.
- Precedents: the re-materialized Ω-9 spec (paper `D-433`); `D-379`
  (the cross-principal fence this softens lawfully); `D-384` (the
  root-delegation consent path); `D-411` (the grandfather-citation
  pattern); `D-364`.


- Ratified on greens (evidence-class, F-DISCLOSURE.1-7 green in this record's tree BEFORE the flip per D-364): landing commit f9b8841; full gate green 1418/0 ×2 on the PROPOSED tree (2026-09-21T07:20:03Z and 07:25Z; the prior tip's 1362 + 56 new); zero host LOC; anvil untouched.

## Index

summary: plugins/vivim-run/src/aperture.ts — the aperture: per-target per-principal disclosure scopes over the ordered width lattice (summary, body, detail, raw), the deterministic projection fold with honest elision {count,kinds} and scope-cited evidence digests, fail-closed strangers (summary or a named refusal, never full width), cited-ceremony widening with receipt rows, and the headless audit trail
rationale: Not all eyes see the same row - elision that is not law-side is leakage with a scrollbar, so widths are law and views are folds that never fabricate and never silently truncate (Omega-9, the aperture, re-materialized spec)
class: evidence
