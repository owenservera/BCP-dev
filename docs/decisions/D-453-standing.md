# D-453 — Boundary: standing — yes once, precisely, and it holds (Ω-13)

## Status

RATIFIED

## Context

- The Ω-13 spec (paper `D-445`, re-materialized per
  `omega-upgrades/RE-MATERIALIZATION-NOTE.md` — the transcript original is not
  on disk; this tree record lands the re-materialized spec's mechanism under
  the continuation authority) gives authority duration: a principal's durable
  "this agent may do X in context Y" becomes a standing row — named, scoped,
  expiring, revocable, inspectable.
- The one invariant: **no grant outlives the moment it was granted for.**
  `expiresAt` is REQUIRED — authority without duration is not standing, it
  is surrender (STANDING_PERPETUAL_REFUSED); revocation is immediate and
  loud (STANDING_REVOKED); expiry is a refusal naming the renewal path
  (STANDING_EXPIRED); renewal is a FRESH grant citing the old
  (STANDING_RENEWAL_AS_EXTENSION for in-place extension); and escalation
  beyond a radius is exactly one sentence-shaped consent request that dies
  loudly at its deadline (STANDING_ESCALATION_STALLED) — never auto-yes.
- The silent failure this kills: an agent's zone quietly widening as new ops
  are added under a capability — the grant matched per-op, the danger lived
  in the class, and no row ever held the class.

Blocks: none

## Options

| Criterion | (a) new ns `standing` in vivim-law (radius rows + grant/revoke/check ops + escalation book) | (b) extend the ConsentTable with expiry/context fields | (c) per-composition config files |
|---|---|---|---|
| No perpetual grants, ever | Yes — expiresAt REQUIRED at the store door | No — re-typing keyed history re-types it (the D-412 trap) | No |
| The radius is inspectable as rows | Yes — the §14 INSPECT verb answered by listing | Partially — scattered across consent ids | No — config is not evidence |
| Revocation propagates at the next check | Yes — Ω-12 frames re-resolve live standings; zero cache | Partially | No |
| Zero host LOC | Yes — plugins/vivim-law only | Yes | Yes |

## Decision

**Decision:** (a) — `plugins/vivim-law/src/standing.ts`, in substance:

- **Standing rows** (ns `standing`, ids `standing:<grantId>`, grantId =
  stable hash of (principal, grantee, scope, context)):
  `{standingId, principal, grantee, scope, context?, approvalMode:
  ask|auto|auto-with-proof, expiresAt (REQUIRED), grantedAt, revokedAt?,
  revokeReason?, consentRef?, evidence[], renewedFrom?}` — the §14 seven
  fields as one row; scope is an op-class/capability grammar (the tokens.ts
  subset discipline: exact | prefix-`*` | `*`); lapsed rows are evidence,
  never deleted (retention forever — the trust history).
- **Resolution (gate-time, never cached):** a standing matches when
  grantee = caller, op ∈ scope, context matches, now < expiresAt, not
  revoked. Violations are named refusals with sentences: STANDING_EXPIRED
  (naming expiresAt and the renewal path), STANDING_REVOKED (immediate and
  loud — naming revokedAt and reason), STANDING_SCOPE_EXCEEDED,
  STANDING_CONTEXT_UNMATCHED. Ω-12's frames resolve `standingRef` through
  this check at every invocation.
- **The grant door:** `standing.grant@1` (MUTATION, grantor-gated) refuses
  STANDING_PERPETUAL_REFUSED without expiresAt, STANDING_SCOPE_INVALID on a
  malformed scope grammar, and STANDING_RENEWAL_AS_EXTENSION when a lapsed
  standing is re-granted under the same id — renewal is a fresh row citing
  the old via `renewedFrom` (the chain visible), never an extension.
- **The revoke door:** `standing.revoke@1` (MUTATION, grantor or root) sets
  `revokedAt` immediately — in-flight frames refuse at their next gate
  check; a second revoke refuses loudly (STANDING_REVOKED — the gate does
  not honor dead authority twice).
- **The escalation ceremony:** exceeding every radius surfaces exactly ONE
  consent request — a row naming principal, scope, and reason in a sentence,
  with a deadline; unanswered past deadline it dies loudly
  (STANDING_ESCALATION_STALLED), nothing executed, never auto-yes.
  `auto-with-proof` composes with the evidence economy: a failing proof
  condition falls the check to `ask` — the zoned yes without the silent yes.

## Consequences

- Consent stops being a tax on every operation: ten passing-proof healings
  run with zero prompts; the eleventh with a failing proof falls to ask and
  surfaces one card, not a storm.
- As-built: ops land in vivim-law as `standing.grant@1` (MUTATION),
  `standing.revoke@1` (MUTATION), `standing.check@1` (READ — the gate-time
  verdict Ω-12 consumes); rows persist to vault ns `standing` through the
  granted ports wherever present (fail-closed rollback on append failure,
  the D-325 pattern), memory-first otherwise. Zero host LOC; no new
  dependencies; existing tests stay green.

## Evidence

- Falsifiers, green in this record's tree BEFORE the flip per `D-364`
  (`omega:loop --stub D-453` generates the RED stub this list resolves to):
  - `F-STANDING.1` (the-zoned-yes) — auto-with-proof standing for provider.gmail healings → ten passing-proof checks run with zero prompts (verdict standing each); a failing proof falls to ask → exactly one escalation card surfaces
  - `F-STANDING.2` (the-expiry) — a standing lapsed clock-pinned → the next check refuses STANDING_EXPIRED naming expiresAt and the renewal path; renewal produces a new row citing the old; re-granting the same id refuses STANDING_RENEWAL_AS_EXTENSION
  - `F-STANDING.3` (the-single-card) — exceed the radius → STANDING_SCOPE_EXCEEDED and exactly one escalation row with principal/scope/reason in a sentence; a second surface of the same request is the SAME card; ignored past deadline → STANDING_ESCALATION_STALLED, nothing executed
  - `F-STANDING.4` (the-inspection) — the radius list for a principal → every radius with scope, context, mode, expiry, and revocation state — the §14 query answered as rows
  - `F-STANDING.5` (the-revocation) — revoke mid-flight → the next check refuses STANDING_REVOKED (immediate and loud, naming revokedAt and reason); a second revoke refuses loudly; no cached authority survives anywhere in the tree
  - `F-STANDING.6` (headless) — 1–5 daemon-only — the card is a row before it is a pixel: no surface imports, no window/document/navigator
  - `F-STANDING.7` (loud-failure) — zero auto-yes paths: a grant without expiresAt refuses STANDING_PERPETUAL_REFUSED, malformed rows refuse STANDING_ROW_INVALID at the door, every lapse/stall/exceedance is a sentence — never a silent default
- Files: `plugins/vivim-law/src/standing.ts` (the pure core), wiring in
  `plugins/vivim-law/src/index.ts` (standing.grant@1, standing.revoke@1,
  standing.check@1), `plugins/vivim-law/plugin.json` (two MUTATION + one
  READ contract), `tooling/gates/test/f-standing.test.ts`.
- Refusal register (exact): STANDING_EXPIRED · STANDING_REVOKED ·
  STANDING_SCOPE_EXCEEDED · STANDING_PERPETUAL_REFUSED ·
  STANDING_CONTEXT_UNMATCHED · STANDING_ESCALATION_STALLED ·
  STANDING_RENEWAL_AS_EXTENSION · STANDING_SCOPE_INVALID (+ the store-door
  STANDING_ROW_INVALID / STANDING_UNKNOWN).
- Precedents: the re-materialized Ω-13 spec (paper `D-445`); `D-412` (the
  keyed-history trap new registries exist to avoid); `D-328b`/tokens.ts (the
  grammar-subset discipline); `D-325` (fail-closed persistence rollback);
  `D-452` (frames resolve standingRef at every check); `D-364`.


- Ratified on greens (evidence-class, F-STANDING.1-7 green in this record's tree BEFORE the flip per D-364): landing commit f9b8841; full gate green 1418/0 ×2 on the PROPOSED tree (2026-09-21T07:20:03Z and 07:25Z; the prior tip's 1362 + 56 new); zero host LOC; anvil untouched.

## Index

summary: plugins/vivim-law/src/standing.ts — the standing registry: radius rows {principal, grantee, scope grammar, context, approvalMode, expiresAt REQUIRED, evidence} where no grant lives forever, revocation is immediate and loud, expiry is a refusal naming the renewal path, renewal is a fresh citing grant, escalation is one sentence-shaped card that stalls loudly, and inspection answers the radius list as rows
rationale: Authority without duration is not standing, it is surrender - a radius granted for one project outliving the project, a consent tapped blindly because it never zones, and trust scattered beyond any radius view are the silent failures (Omega-13, standing, re-materialized spec)
class: evidence
