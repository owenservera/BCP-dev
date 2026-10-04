# D-455 — The adaptation governance boundary: the system changes itself only under signature

## Status

RATIFIED

## Context

- The Ω-16 spec (paper `D-448`, re-materialized per
  `omega-upgrades/RE-MATERIALIZATION-NOTE.md` — this tree record lands the
  re-materialized spec's mechanism) closes the Ω-9..Ω-16 boundary chain:
  every self-change — a behavior contract's evolution, a model/realization
  swap, a policy amendment, a lexicon shift — becomes an adaptation proposal
  with a vault-cited blast-radius census before the flip, a treaty-impact
  check, a named rollback point, and a signature at the flip: the D-435
  deprecation ceremony, generalized from capabilities to the system's own
  behavior.
- Without it: a "seamless" model swap quietly changes 8% of intent
  resolutions — every one locally lawful, the drift invisible until an
  automation does something subtly wrong at 3am (the vanishing-door disease,
  one abstraction up).
- The one invariant: **the ceremony is rows before it is pixels, and the
  flip is never quiet** — a human principal's signature or a live
  auto-with-proof standing, cited; never confidence alone.

Blocks: none

## Options

| Criterion | (a) one generalized ceremony with typed targets in vivim-agent (propose → census → treaty check → ratify → windowed rollback) | (b) four per-target ceremonies | (c) D-328b evolution mechanics as-is |
|---|---|---|---|
| One law, four target kinds | Yes — behavior/realization/policy/lexicon share the ceremony | No — four drift apart | No |
| The blast radius is counted, not discovered | Yes — vault-cited census, digest-pinned, re-digested at the flip | Per-target ad-hoc | No census at all |
| The flip is signed | Yes — human principal or live standing, both cited | Partially | Evaluator verdict only |
| Zero host LOC | Yes | Yes | Yes |

## Decision

**Decision:** (a) — `plugins/vivim-agent/src/adaptation.ts`, in substance:

- **Ceremony rows** (ns `adapt`, id `proposal:<proposalId>`): `{proposalId,
  target: {kind: behavior|realization|policy|lexicon, ref}, diffRef (the
  diff — for realization targets the resolution battery diff),
  rollbackPoint (a row-cited vault revision — REQUIRED, the way back),
  census[] (vault-cited dependents, digest-pinned; empty only with a cited
  basis proving nothing cites the target), treatyChecks[]
  ({treatyId, impacted, resigned}), status: proposed|ratified|rolled-back,
  window: {notBefore, notAfter}, ratifier (set at the flip)}`.
- **The propose door** (`adapt.propose@1`, MUTATION): no rollback point →
  `ADAPT_ROLLBACK_POINT_MISSING`; an empty census without its proof →
  `ADAPT_CENSUS_UNCITED`; the row is born `proposed`, never ratified by
  construction.
- **The flip** (`adapt.ratify@1`, MUTATION): within the window
  (ratifying before `notBefore` or after `notAfter` → `ADAPT_WINDOW_CLOSED`);
  the census is re-digested at the flip — absent → `ADAPT_CENSUS_UNCITED`,
  digest moved → `ADAPT_BLAST_RADIUS_CHANGED` ("the world moved — re-census
  and re-propose, never ratify a stale map"); an impacted treaty not
  re-signed → `ADAPT_TREATY_UNCHECKED`; no human principal and no live
  auto-with-proof standing → `ADAPT_SILENT_PROMOTION` (§29). The ratified
  row carries the ratifier — the human signature + decisionRef, or the
  standing + the consent it cites: the chain of the yes.
- **The way back** (`rollbackProposal`, pure law; op transport owed to the
  mounts wave): within the window, rollback to the point is one op citing
  the rows; past `notAfter` → `ADAPT_WINDOW_CLOSED` — the way back ends
  where it was drawn, and past it lies only a new adaptation.
- **The last boundary** (`ADAPT_SELF_GOVERNANCE`): the ceremony governing
  itself is itself an adaptation — a proposal targeting the ceremony
  (`adapt.ceremony`) must count the ceremony among its own dependents (a
  census citing ns `adapt`); the recursion is law.
- `adapt.read@1` (READ) renders the ceremony headless.

## Consequences

- The spec's ns `adapt` ownership (vivim.law) is honored in discipline, not
  in placement: the module lands in vivim.agent where the delegation chain
  (Ω-15 — the "who" that may ratify) already lives; sole-writer discipline
  is the three ceremony ops.
- Mounts owed: D-328b `evolution.promote@1` routing behavior targets through
  `adapt.ratify@1`; `policy.amend@1` and `intent.lexicon.accept@1` citing
  the ceremony for their classes; `adapt.census@1` (the vault-reading
  blast-radius fold) and `adapt.rollback@1` transport — the pure law lands
  now, the wiring with the mounts.
- Zero host LOC; ops land additively; existing tests stay green.

## Evidence

- Falsifiers, green in this record's tree BEFORE the flip per `D-364`
  (`omega:loop --stub D-455` generates the RED stub this list resolves to).
  Spec §8's headless and loud clauses share 7; the self-governance recursion
  (spec §9's refusal, made mechanical) takes 6 — the last boundary draws
  itself:
  - `F-ADAPT.1` (the-honest-census) — a behavior change cited by three compositions → the census lists all three with principals; ratifying with no census → `ADAPT_CENSUS_UNCITED`; a fourth dependent after the proposal → `ADAPT_BLAST_RADIUS_CHANGED` at the flip
  - `F-ADAPT.2` (the-signed-flip) — a human principal → the row carries the signature + decisionRef; without → `ADAPT_SILENT_PROMOTION`; via a live auto-with-proof standing → the row cites the standing, which cites the original consent — the chain of the yes
  - `F-ADAPT.3` (the-treaty-guard) — behavior promised in a live treaty → `ADAPT_TREATY_UNCHECKED` naming the treaty; both parties re-sign → the change ratifies
  - `F-ADAPT.4` (the-way-back) — within the window, rollback returns to the point in one op citing the rows; past the window → `ADAPT_WINDOW_CLOSED` with the new-adaptation sentence; ratifying before `notBefore` → `ADAPT_WINDOW_CLOSED`
  - `F-ADAPT.5` (the-model-swap-diff) — a realization swap proposal carries the resolution battery diff and the ratified row cites it (every changed resolution attributable to the row); a proposal without a rollback point → `ADAPT_ROLLBACK_POINT_MISSING`
  - `F-ADAPT.6` (the-last-boundary) — a self-governance proposal that does not count the ceremony among its dependents → `ADAPT_SELF_GOVERNANCE`; one that does → the ceremony amends only through itself, the recursion holds
  - `F-ADAPT.7` (headless-and-loud) — 1–6 daemon-only, rows before pixels; zero unsigned flips; every refusal a sentence; every census, treaty impact, and rollback point a row
- Files: `plugins/vivim-agent/src/adaptation.ts` (the pure core), wiring in
  `plugins/vivim-agent/src/index.ts`, `tooling/gates/test/f-adapt.test.ts`.
- Refusal register (exact): ADAPT_CENSUS_UNCITED · ADAPT_TREATY_UNCHECKED ·
  ADAPT_WINDOW_CLOSED · ADAPT_SELF_GOVERNANCE · ADAPT_SILENT_PROMOTION ·
  ADAPT_ROLLBACK_POINT_MISSING · ADAPT_BLAST_RADIUS_CHANGED.
- Precedents: the re-materialized Ω-16 spec (paper `D-448`); `D-435` (the
  dependents census + inputHash pinning this ceremony generalizes);
  `D-328b` (the evolution machinery gaining its boundary); `D-432` (the
  rollback-point discipline); `D-364`.


- Ratified on greens (evidence-class, F-ADAPT.1-7 green in this record's tree BEFORE the flip per D-364): landing commit f9b8841; full gate green 1418/0 ×2 on the PROPOSED tree (2026-09-21T07:20:03Z and 07:25Z; the prior tip's 1362 + 56 new); zero host LOC; anvil untouched.

## Index

summary: plugins/vivim-agent/src/adaptation.ts — the adaptation governance ceremony: typed proposals (behavior, realization, policy, lexicon) with a REQUIRED row-cited rollback point, a vault-cited digest-pinned census re-digested at the flip, the treaty-impact guard, the signed flip (human principal or live auto-with-proof standing, both cited), the windowed way back, and the self-governance recursion (the ceremony counts itself before amending itself)
rationale: The system changes itself only under signature - a model swap whose blast radius is discovered as breakage is a silent 3am drift, a promotion without a census or a signature is a quiet coup, and a self-change with no way back is a bet placed with the house's money (Omega-16, the adaptation governance boundary, re-materialized spec)
class: evidence
