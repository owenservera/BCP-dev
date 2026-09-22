# D-441 — The badge substrate: minted tiers, lived generality, and the print fold

## Status

RATIFIED

## Context

- The Ω-7 spec (paper `D-431`, re-materialized per RE-MATERIALIZATION-NOTE.md)
  lifts the badge from static manifest data to LIVED rows: mint/promote/
  demote ceremonies with era-aware verification, demotion scars, and the
  print fold as the only renderer.
- The one invariant: **the badge is text before it is pixels.** One print
  fold renders the two-axis sentence from rows alone; surfaces may style
  it but never source it elsewhere — anti-forgery by construction.

Blocks: none

## Options

| Criterion | (a) pure badge core in a new module + sdk parity | (b) static validators only | (c) badges as manifest fields |
|---|---|---|---|
| Lived transitions | Yes — mint/promote/demote rows with scars | No | No |
| Self-claim refused | Yes — BADGE_TIER_CLAIMED: the ceremony assigns | Partially | No |
| One renderer | Yes — badge.print from rows alone | No | No |
| Zero host LOC | Yes | Yes | Yes |

## Decision

**Decision:** (a) — `plugins/vivim-run/src/badge.ts` (the pure core; the
run plugin already carries the capability/substrate lanes), in substance:

- **Mint** (ns `badge`): `{badgeId, subjectRef, tier, assignedBy, generality,
  basis, era: {notBefore}, at}` — the kernel ceremony assigns the tier; a
  subject claiming its own tier refuses BADGE_TIER_CLAIMED.
- **Promote**: to a broader generality requires ≥2 resolvable evidence
  refs, ≥1 independent (validateGenerality's static law lifted to runtime);
  BADGE_EVIDENCE_INSUFFICIENT / BADGE_EVIDENCE_UNRESOLVABLE otherwise.
- **Demote**: reason-carrying (REVOKED_KEY_ERA, evidence-lost, breach);
  the demotion SCARS — affected rows carry it forward, nothing deletes.
- **The print fold** (`badgePrint`): the two-axis sentence from rows alone;
  tampering any source row changes the print or fails the digest.
- **Era-aware verification**: a badge evaluates under the law of its mint
  time (the Ω-0.5 schema-cousin doctrine).

## Consequences

- The static validators stay static (the sdk's GEN_* codes bite at manifest
  load); Ω-7 adds the lived half — two seats, one law.
- As-built: the ops (badge.mint@1 MUTATION, badge.promote@1 MUTATION,
  badge.demote@1 MUTATION, badge.print@1 READ) land in vivim-run's lane;
  the sdk-parity clause is exercised against the same fixture shapes.
- Zero host LOC; no new dependencies; existing tests stay green.

## Evidence

- Falsifiers, green in this record's tree BEFORE the flip per `D-364`
  (`omega:loop --stub D-441` generates the RED stub this list resolves to):
  - `F-BADGE.1` (the-print) — the print renders from rows alone; tampering a source row changes the print or fails the digest — no third option
  - `F-BADGE.2` (claimed-tier-refused) — a subject asserting its own tier refuses BADGE_TIER_CLAIMED; the ceremony assigns
  - `F-BADGE.3` (promotion-evidence) — promote with one evidence ref refuses; with two (one independent) it cites both; runtime law matches the static law on the same fixtures
  - `F-BADGE.4` (demotion-is-loud) — a key-era revocation demotes suspect-era badges with REVOKED_KEY_ERA scars riding affected rows; nothing deletes; the print says what happened
  - `F-BADGE.5` (refusal-proves) — every register code fired by a planted violation
  - `F-BADGE.6` (headless) — the badge is text before it is pixels
  - `F-BADGE.7` (loud-failure) — zero silent label changes; every transition is a row or a refusal
- Files: `plugins/vivim-run/src/badge.ts`, ops in `src/index.ts`,
  `tooling/gates/test/f-badge.test.ts`.
- Refusal register (exact): BADGE_TIER_CLAIMED · BADGE_EVIDENCE_INSUFFICIENT ·
  BADGE_EVIDENCE_UNRESOLVABLE · BADGE_ERA_INVALID · BADGE_DUPLICATE.
- Precedents: the re-materialized Ω-7 spec (paper `D-431`); `D-405`
  (the two-axis schema + validateGenerality — the static seat); `D-435`
  (the demotion-scar pattern); `D-364`.


- Ratified on greens (evidence-class, F-BADGE.1-7 green in this record's tree BEFORE the flip per D-364): landing commit 0dd62fb; full gate green 1320/0 ×2 on the PROPOSED tree (2026-09-21T05:49Z and 05:54Z; the prior tip's 1306 + 14 new); zero host LOC; anvil untouched.

## Index

summary: plugins/vivim-run/src/badge.ts — the badge substrate: kernel-minted tiers (self-claims refused), promotion citing two-resolvable-one-independent evidence (the static law lifted to runtime), reason-carrying demotions whose scars ride affected rows, era-aware evaluation, and the print fold as the only renderer
rationale: The badge is text before it is pixels - a trust label that its subject can self-assign, silently change, or render from anywhere is decoration, not evidence (Omega-7, the badge substrate, re-materialized spec)
class: evidence
