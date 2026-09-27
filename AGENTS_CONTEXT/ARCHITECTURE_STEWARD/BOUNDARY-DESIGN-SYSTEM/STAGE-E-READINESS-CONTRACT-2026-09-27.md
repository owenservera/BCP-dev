# Stage E Self-Knowledge Readiness Contract
## 2026-09-27

> Status: PROPOSED — READINESS GATE CONTRACT
> Owner: Architecture Steward
> Scope: readiness only; no runtime-join implementation.
> Authority: derived process/design contract; not Ω law and not semantic authority.

## 1. Purpose
Define the minimum evidence/design conditions required before the Architecture Graph ↔ runtime self-knowledge joins may enter implementation.

The gate exists to prevent a plausible self-knowledge design from becoming an implementation before its basis, freshness, grounding, and non-authority properties are mechanically falsifiable.

Target state:
existing vivim.mind + existing Steward graph + explicit basis/freshness + explicit cross-plane grounding + executable falsifiers → STAGE E READY

## 2. Non-goals
- No Ω-law changes.
- No second Architecture Graph.
- No universal freshness, identity, Event/State or provenance system.
- No K0 expansion.
- No provider/live-product implementation.
- No production runtime join implementation before this gate passes.
- No semantic authority inferred from code topology, imports, filenames, routes, class names, or proximity.

## 3. Readiness gate
Stage E is READY only when every mandatory condition below has a durable evidence/design reference.

| ID | Gate condition | Minimum evidence | Required state |
|---|---|---|---|
| E-R1 | Derived-view contract is defined | Typed view/result shape plus ownership and rebuild semantics | PASS |
| E-R2 | Basis identity is defined | BasisRef plus canonical source/revision/CID semantics for each participating basis | PASS |
| E-R3 | Basis digest is deterministic | Canonical serialization + deterministic digest rule | PASS |
| E-R4 | Dependency identity is explicit | Dependency/version vector or bounded equivalent with owner/source refs | PASS |
| E-R5 | Derivation identity is explicit | Stable derivation/plugin/contract/version reference | PASS |
| E-R6 | Freshness is computed, not trusted | Deterministic comparison against current basis; stored freshness treated only as cache hint | PASS |
| E-R7 | Freshness state vocabulary is explicit | CURRENT / STALE / CONFLICTED / UNRESOLVABLE semantics and transitions | PASS |
| E-R8 | Cross-plane grounding contract exists | Allowed link kinds, source/evidence requirements, orphan/stale behavior and trace result shape | PASS |
| E-R9 | Graph bundle contract exists | Deterministic inputs, serialization, digest, lineage, bounded trace projection and freshness metadata | PASS |
| E-R10 | Domain adapters are characterized | Owner, source refs, resolution rule, unresolved behavior and falsifier per adapter | PASS |
| E-R11 | Changed-basis falsifier is executable | A changed authoritative basis cannot leave its old derived view CURRENT | PASS |
| E-R12 | Missing-basis falsifier is executable | Missing basis resolves to UNRESOLVABLE rather than guessed CURRENT | PASS |
| E-R13 | Contradiction falsifier is executable | Domain-defined contradiction becomes CONFLICTED without selecting authority | PASS |
| E-R14 | Non-authority property is explicit and proven | Self-knowledge cannot grant permission or mutate law | PASS |
| E-R15 | Single-graph property is explicit and proven | Runtime joins project onto the existing Steward graph; no competing graph is created | PASS |
| E-R16 | Replacement property is explicit | Semantic/data survivor rules are owner-defined before replacement claims | PASS or explicit DEFERRED with no implementation claim |
| E-R17 | Bounded pilots are defined | `mind.portrait@1` and `COMP-FIRST-RESEARCH-EVIDENCE-WORLD` trace targets with acceptance criteria | PASS |

## 4. Mandatory distinction between evidence classes
All claims in the readiness package must use:
`OBSERVED | DERIVED | PROPOSED | UNKNOWN | CONFLICTED`

Freshness is separate:
`CURRENT | STALE | UNRESOLVABLE`

Evidence strength must remain separate from confidence. Presence in the Architecture Graph does not upgrade maturity or truth status.

## 5. Minimum DerivedView contract
The readiness contract adopts this conceptual shape without freezing a runtime implementation:

DerivedView
  viewId
  result
  basisRefs[]
  basisDigest
  dependencyVersions[]
  derivationRef
  computedAt
  freshness
  conflicts[]
  unknowns[]
  evidenceRefs[]

Rules:
- basisRefs identify what the view depends on.
- basisDigest is reproducible from canonicalized basis identity/version information.
- dependencyVersions capture relevant contract/manifest/policy/implementation dependencies without becoming a global invalidation bus.
- derivationRef identifies the derivation mechanism/version.
- computedAt is metadata only.
- freshness MUST be recomputable from current basis comparison.
- conflicts/unknowns remain visible; no resolver shortcut is implied.

## 6. Minimum cross-plane grounding contract
The minimum accepted trace shape is:

runtime observation → contract → capability/plugin/realization → grounding link → responsibility → journey → vertical slice → evidence → proof status

Allowed grounding is evidence-backed explicit linkage. The following cannot independently create a semantic link:
- import relationship;
- file or directory name;
- route/API adjacency;
- class/function name similarity;
- graph proximity.

Each link must identify its source, target, link kind, evidence basis, freshness basis where applicable, and unresolved behavior.

## 7. Readiness falsifier matrix
| Falsifier | Expected result |
|---|---|
| Change canonical/source basis | Previous derived result becomes STALE or is recomputed; it cannot remain CURRENT |
| Change derivation identity/version | Previous result cannot remain CURRENT without a basis/derivation match |
| Remove required basis | Result becomes UNRESOLVABLE; no guessed replacement |
| Introduce owner-defined contradiction | Result becomes CONFLICTED; authority is not inferred |
| Ask self-knowledge to authorize an operation | Refusal / no authority effect |
| Create a second graph path | Gate FAILS |
| Replace an implementation | Identity survives only according to owner-defined survivor rule; otherwise explicit remap/unknown |
| Present an unmapped runtime fact | ORPHANED or UNKNOWN, not invented grounding |

## 8. Central versus CFA-owned closure
Architecture Steward owns the mechanical gate, serialization, digest, generic reference/evidence envelopes, bundle validation, trace bookkeeping and readiness audit.

CFAs must provide meaning-specific adapter rules and falsifiers for their own domains. Current participating inputs are expected from CFA-01, CFA-02, CFA-04, CFA-06, CFA-07, CFA-09 and CFA-10; CFA-05/CFA-08 are consulted only where selected pilots cross their semantics.

## 9. Promotion rule
Stage E readiness is binary:

`NOT READY` — any mandatory gate is missing, unproven or semantically ambiguous.

`READY` — all mandatory gates are evidenced, unresolved items are explicit, and both bounded pilots have acceptance criteria.

Passing this gate authorizes **only** the subsequent readiness-cleared runtime-join implementation packet. It does not authorize arbitrary self-knowledge implementation.

## 10. Current assessment against this contract
Based on the existing Stage-E readiness assessment:
- E-R1 through portions of E-R5 are characterized in existing research/design.
- generalized freshness proof remains incomplete;
- several domain basis adapters remain open;
- the cross-plane grounding trace is designed but not implementation-proven;
- changed-basis falsification remains unproven.

Therefore current Stage-E state remains:

**NOT READY / BLOCKED**

This contract is the closure checklist for producing the missing evidence; it does not override the existing blocked assessment.

## 11. Required closure sequence
L0 scope lock → L1 DerivedView/freshness → L2 domain basis adapters → L3 graph bundle → L4 grounding contract → L5 falsifiers → L6 bounded pilots → L7 gate audit.

No stage may silently convert a deferred semantic decision into implementation.

## 12. Source basis
- `BOUNDARY-DESIGN-SYSTEM/STAGE-E-SELF-KNOWLEDGE-READINESS-WORKLOAD-DESIGN-2026-09-27.md`
- `BOUNDARY-DESIGN-SYSTEM/GRAPH-W1-E-SELF-KNOWLEDGE-READINESS-ASSESSMENT-RECEIPT-2026-09-27.md`
- `SELF-KNOWLEDGE-AND-DEVELOPMENT-GROUNDING-DESIGN.md`
- `docs/destination/self-knowledge-core/RESEARCH.md`
- `docs/destination/system-intelligence/pass-3/SELF-KNOWLEDGE-DESIGN.md`
- existing Graph Attachment Wave-1 A/B/C/D receipts.

## Integrity
- This contract does not claim Stage-E readiness.
- No runtime joins were implemented.
- No Ω law or semantic owner was changed.
- The existing Architecture Graph remains the only development architecture network.