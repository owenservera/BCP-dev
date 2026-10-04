# D-444 — The trust substrate: key lineage, era-aware verification, and the non-reuse floor

## Status

RATIFIED

## Context

- The Ω-4 spec (paper `D-428`, re-materialized per
  `omega-upgrades/RE-MATERIALIZATION-NOTE.md` — the transcript original is not
  on disk; THIS tree's D-428 is Ω-DEV.4, the collision recorded in the genome
  lineage note) lifts trust from bare strings to the mesh: principal records
  that can never be reused (D-412's floor, inherited), keys with lineage, and
  revocations that scar forward instead of deleting. The Ω-4X key-rotation
  extension (tree `D-437`) is ALIGNED, not re-opened — its register stays in
  force alongside this record's own.
- The one invariant: **trust moves forward without invalidating backward**
  (vision §19). A signature is judged under the law of its signing time;
  re-signing history is the append-only world's forbidden act, and stranding
  it is provenance's forbidden lie — the era window is the only exit.

Blocks: none

## Options

| Criterion | (a) pure trust core in vivim-run (lineage rows + ceremony + era-aware verify fold) | (b) string principals with inline key checks | (c) defer trust to a service |
|---|---|---|---|
| Rotation is a non-event | Yes — mint-time verification keeps history valid | No — every rotation strands or re-signs | No |
| The non-reuse floor | Yes — keys bind to D-412 records, retired is forever | No — strings recycle silently | No |
| Zero soft-pass branches | Yes — unbound/expired/invalid are named refusals | Partially | No |
| Zero host LOC | Yes | Yes | No — the locks leave the house |

## Decision

**Decision:** (a) — `plugins/vivim-run/src/trust.ts` (the pure core; the run
plugin already carries the substrate lane), in substance:

- **Key-lineage rows** (ns `trust.keys`, retention forever, tombstones
  included): `{keyId, principal, era: {notBefore, notAfter?}, fingerprint}` —
  the fingerprint is testimony about material, never the material (key
  material lives in sealed storage, not the vault).
- **The KeyCeremony** (`trust.bind@1`): binds a key to a D-412 principal
  record — TRUST_PRINCIPAL_UNRESOLVABLE when the principal row is absent (a
  retired record cannot vouch either — retired is forever), TRUST_KEY_EXPIRED
  when binding past the key's own notAfter, TRUST_FINGERPRINT_MISMATCH when
  the ceremony's attestation disagrees, TRUST_DUPLICATE_BIND on re-binding an
  id (supersede via rotation, never re-bind).
- **The verify fold**: era-aware — a signature is judged under the law of its
  signing time, resolved totally (cited key → successor chain → same-principal
  era window); no soft-pass branch exists anywhere in verification.
- **Revocation scars forward**: emergency revocation never deletes and never
  moves notBefore — the key row carries `revokedAt`/`revocationReason`
  (REVOKED_KEY_ERA) forward; suspect-window signatures verify under their own
  law but carry the scar, and the revoked key's next write is a named refusal.
- **Consent resolves through the record** (§14's zoning floor): grants carry
  `{principal, scope, generation, active, revokedAt}` keyed by the stable
  `consentIdFor` hash (D-336/D-353); revocation bumps the generation and a
  stale-generation use refuses TRUST_CONSENT_STALE naming the consent id.
- **The local pairing** (ns `trust.mesh`): two principals pair with zero
  network authority — the ceremony's only I/O is the vault rows both sign; a
  one-signature pairing refuses TRUST_PAIRING_UNWITNESSED.

## Consequences

- As-built: the ops (trust.bind@1 MUTATION, trust.verify@1 READ,
  trust.revoke@1 MUTATION) land in vivim-run's lane following the badge-ops
  pattern; consent and pairing are pure-core ceremonies exercised by the
  falsifier (their port doors ride later records).
- The Ω-4X rotation register (TRUST_KEY_LINEAGE_GAP,
  TRUST_ROTATE_WITHOUT_CEREMONY, TRUST_REVOCATION_SWEEP_INCOMPLETE,
  TRUST_OVERLAPPING_WINDOWS, TRUST_SUCCESSOR_UNSIGNABLE) remains in force
  alongside — proven by F-TRUST-ROTATE, cited here, not re-run.
- Zero host LOC; no new dependencies; existing tests stay green.

## Evidence

- Falsifiers, green in this record's tree BEFORE the flip per `D-364`
  (`omega:loop --stub D-444` generates the RED stub this list resolves to):
  - `F-TRUST.1` (non-reuse) — register → retire → re-register refuses PRINCIPAL_REUSED (the D-412 F-1 inherited at the trust seat)
  - `F-TRUST.2` (consent-binding-and-revocation) — a grant resolves through the principal record; revoke; the next gated use with the stale generation refuses TRUST_CONSENT_STALE naming the consent id
  - `F-TRUST.3` (rotation-non-event) — 10,000 rows signed under key A → ceremony → key B active → all 10,000 rows still verify mint-time; zero row hashes changed
  - `F-TRUST.4` (the-local-pairing) — two principals pair with zero network authority (the ceremony's only I/O is the rows both sign); a one-signature pairing refuses TRUST_PAIRING_UNWITNESSED
  - `F-TRUST.5` (refusal-proves) — every register code fired by a planted violation; the Ω-4X codes stay proven by F-TRUST-ROTATE and are cited, not re-run
  - `F-TRUST.6` (headless) — 1–5 daemon-only; the lineage renders identically on every surface
  - `F-TRUST.7` (loud-failure) — no soft-pass branch anywhere in verification — unclear is a named refusal
- Files: `plugins/vivim-run/src/trust.ts`, ops in `src/index.ts`,
  `tooling/gates/test/f-trust.test.ts`.
- Refusal register (exact): TRUST_PRINCIPAL_UNRESOLVABLE · TRUST_KEY_EXPIRED ·
  TRUST_FINGERPRINT_MISMATCH · TRUST_DUPLICATE_BIND · TRUST_CONSENT_STALE ·
  TRUST_PAIRING_UNWITNESSED · TRUST_KEY_UNBOUND · TRUST_SIGNATURE_INVALID
  (+ PRINCIPAL_REUSED — D-412's own code, inherited with the floor).
- Precedents: the re-materialized Ω-4 spec (paper `D-428`); `D-437` (the
  Ω-4X rotation extension, aligned); `D-412` (the principal seam); `D-336`/
  `D-353` (consent ids as stable hashes); `D-441` (the substrate-module +
  registry pattern); `D-364`.


- Ratified on greens (evidence-class, F-TRUST.1-7 green in this record's tree BEFORE the flip per D-364): landing commit e2dff6f; full gate green 1362/0 ×2 on the PROPOSED tree (2026-09-21T06:37:56Z and 06:43Z; the prior tip's 1320 + 42 new); zero host LOC; anvil untouched.

## Index

summary: plugins/vivim-run/src/trust.ts — the trust substrate: key-lineage rows bound to D-412 principal records through a named-refusal ceremony, era-aware verification (a signature is judged under the law of its signing time, total resolution, zero soft-pass), revocation scars that ride rows forward instead of deleting, generation-counted consent, and local pairing with zero network authority
rationale: Trust moves forward without invalidating backward - a mesh that re-signs history or strands it at the first key rotation is testimony that expires exactly when the hardware does, so the era window, not the calendar, decides which key's word is law (Omega-4, the trust substrate, re-materialized spec)
class: evidence
