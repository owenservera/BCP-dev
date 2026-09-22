# D-454 — The delegation boundary: chains fold from vault rows, authority narrows every hop

## Status

RATIFIED

## Context

- The Ω-15 spec (paper `D-447`, re-materialized per
  `omega-upgrades/RE-MATERIALIZATION-NOTE.md` — this tree record lands the
  re-materialized spec's mechanism) names the agency spine's boundary law:
  delegation chains resolve from vault rows (never from carried claims), each
  hop's authority is a mechanically-checked subset of its parent's, expiry
  and revocation cascade to whole descendant subtrees, and a sovereign
  crossing requires a mutually-signed, expiring, mirrored treaty row.
- `agent.delegate@1` (D-328b) journals the envelope but recomputes nothing
  at the boundary: the carried `authority` string is trusted, a child can
  name a superset of its parent's grant, and revoking a parent leaves the
  grandchild exercising a dead chain — every invocation locally lawful, the
  root dead for a week.
- The one invariant: **authority narrows every hop, or it is not delegation
  — it is escape.** The fold is the truth; carried claims are routing hints.

Blocks: none

## Options

| Criterion | (a) pure chain fold in vivim-agent (rows + attenuation + cascade + treaty shape) | (b) trust the envelope, check at exec only | (c) defer to the sharing wave |
|---|---|---|---|
| Carried claims vs vault truth | Vault-recomputed at every fold | The envelope stays the authority | Unaddressed |
| Widening is impossible | Mechanical per-edge subset check | A convention, not an invariant | Unaddressed |
| Revocation is total | Subtree-wide cascade, one sweep | Latest-wins per id only | Later |
| Zero host LOC | Yes | Yes | Yes |

## Decision

**Decision:** (a) — `plugins/vivim-agent/src/delegation.ts`, in substance:

- **Chain rows** (ns `control`, id `chain:<delegationId>`): `{delegationId,
  parent (null for the root hop), grantee, attenuatedScope, expiresAt
  (REQUIRED at every hop — no perpetual grants), status: live|revoked|lapsed}`.
  The D-328b `DelegationRecord` envelope shape is grandfathered, never
  re-typed; Ω-15 rows are the chain's own ledger (authoring rides
  `vault.append@1` — data rows under the composition's grant).
- **The fold** (`delegate.chain@1`, READ): resolves the leaf's full ancestry
  from rows — never from the envelope; verifies `child ⊑ parent` at EVERY
  edge (attenuation as a mechanical subset check in the tokens.ts grammar);
  recomputes expiry from the clock (no cached authority — gate-time pull);
  emits the `authorityChain` digest (sha256 over the canonical root→leaf hop
  chain) for Ω-12 frames to cite. A carried authority claim that disagrees
  with the fold refuses `DELEGATE_ENVELOPE_UNVERIFIED`; a dangling parent
  refuses `DELEGATE_CHAIN_BROKEN`.
- **The cascade** (`delegate.revoke@1`, MUTATION): revoking any hop appends
  `revoked` rows for the whole descendant subtree in one append-only sweep
  (latest-wins per id; genealogy via append refs; already-closed rows stay
  closed). A fold meeting a revoked ancestor refuses
  `DELEGATE_REVOKED_CASCADE` citing the revocation row.
- **Depth budget**: a fold parameter (default 4) the caller passes from a
  declared policy row — never a vibes constant; exceeding it refuses
  `DELEGATE_CHAIN_TOO_DEEP`.
- **The treaty row** (shape declared here; transport owed to the sharing
  wave — the ns `canvas` reserved-namespace precedent): `{parties (two
  distinct principals), delegatedCapabilityGrammar, scope (⊑ the grammar),
  expiresAt, signatures (both parties), mirroredLedgerRefs (both ledgers)}` —
  one signature or one mirror refuses `DELEGATE_TREATY_UNSIGNED`; expiry
  fires exactly on schedule (F11's sentence).

## Consequences

- `agent.delegate@1` keeps its envelope — the boundary composes UNDER it;
  the D-328b law ("carried claims are hints, the vault is the authority")
  generalizes from contracts to authority itself.
- Single-vault scoping, stated honestly: the cascade sweep is one atomic
  append-set; the distributed revocation deadline and cross-ledger mirror
  sync are the sharing wave's work, as is treaty transport.
- Zero host LOC; ops land additively in vivim.agent (delegate.chain@1 READ,
  delegate.revoke@1 MUTATION); existing tests stay green.

## Evidence

- Falsifiers, green in this record's tree BEFORE the flip per `D-364`
  (`omega:loop --stub D-454` generates the RED stub this list resolves to):
  - `F-DELEGATE.1` (the-narrowing-proof) — a three-hop chain whose hop three names a superset → `DELEGATE_ATTENUATION_VIOLATED` naming both grammars; with a subset → the fold's `authorityChain` digest is stable across replays and citable
  - `F-DELEGATE.2` (the-cascade) — revoke hop two → the whole descendant subtree appends revoked rows in one sweep (zero live descendants); a descendant's next fold refuses `DELEGATE_REVOKED_CASCADE` citing the revocation row
  - `F-DELEGATE.3` (the-lapsed-subtree) — expire the root (clock-pinned) → the whole chain refuses `DELEGATE_EXPIRED`; renewal is a fresh chain citing the old (visible genealogy)
  - `F-DELEGATE.4` (the-unverified-envelope) — tamper the carried authority → `DELEGATE_ENVELOPE_UNVERIFIED` (the vault recomputation wins); a dangling parent row → `DELEGATE_CHAIN_BROKEN`
  - `F-DELEGATE.5` (the-treaty-row) — a two-principal crossing with one signature → `DELEGATE_TREATY_UNSIGNED`; both signatures + both mirrors validate; expiry fires exactly on schedule
  - `F-DELEGATE.6` (headless) — 1–5 daemon/CLI-only, zero pixels; the fold renders text
  - `F-DELEGATE.7` (loud-failure) — zero cached authority; every broken, widened, lapsed, too-deep, or unsigned edge is a named refusal with a sentence
- Files: `plugins/vivim-agent/src/delegation.ts` (the pure core), wiring in
  `plugins/vivim-agent/src/index.ts`, `tooling/gates/test/f-delegate.test.ts`.
- Refusal register (exact): DELEGATE_ATTENUATION_VIOLATED ·
  DELEGATE_CHAIN_BROKEN · DELEGATE_EXPIRED · DELEGATE_REVOKED_CASCADE ·
  DELEGATE_ENVELOPE_UNVERIFIED · DELEGATE_TREATY_UNSIGNED ·
  DELEGATE_CHAIN_TOO_DEEP.
- Precedents: the re-materialized Ω-15 spec (paper `D-447`); `D-328`/`D-328b`
  (the envelope and its "hints, not authority" law); `D-309` (the vendored
  scope algebra this fold checks with); `D-364`.


- Ratified on greens (evidence-class, F-DELEGATE.1-7 green in this record's tree BEFORE the flip per D-364): landing commit f9b8841; full gate green 1418/0 ×2 on the PROPOSED tree (2026-09-21T07:20:03Z and 07:25Z; the prior tip's 1362 + 56 new); zero host LOC; anvil untouched.

## Index

summary: plugins/vivim-agent/src/delegation.ts — the delegation boundary: chain rows in ns control (expiresAt required every hop), the vault-recomputed chain fold (per-edge mechanical subset attenuation, clock-pinned expiry, the authorityChain digest for Omega-12 frames, carried-claim verification), the subtree-wide revocation cascade in one append-only sweep, a policy-row depth budget, and the two-sovereign treaty row shape (both signatures, both mirrors, on-schedule expiry)
rationale: Authority narrows every hop or it is not delegation - it is escape - so the chain folds from vault rows instead of trusting envelopes, widening becomes a mechanical refusal instead of a convention, and revocation kills the whole subtree loudly instead of leaving dead grants running nightly automations (Omega-15, the delegation boundary, re-materialized spec)
class: evidence
