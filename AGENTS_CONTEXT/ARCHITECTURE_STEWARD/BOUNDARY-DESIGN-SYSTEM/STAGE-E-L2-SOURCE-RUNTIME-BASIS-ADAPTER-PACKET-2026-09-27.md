# Stage E L2 — Source / Runtime Basis Adapter Packet
## 2026-09-27

> Status: **L2 LAUNCHED — OWNER CHARACTERIZATION IN PROGRESS**
> Coordinator: Architecture Steward
> Semantic lead: CFA-03
> Scope: characterize domain basis/reference adapters; no runtime-join implementation.

## 1. Purpose

Turn the frozen L1 DerivedView/freshness contract into explicit, owner-scoped basis adapters without centralizing domain meaning.

L2 output is a set of adapter characterizations. It is not a universal identity system and does not require a serial CFA-01 → CFA-02 → ... → CFA-10 sequence.

## 2. Required adapter record

Each adapter must record:

- `adapterId`
- `ownerCFA`
- `basisKind`
- canonical source/reference locations
- source identity/revision token available today
- resolution rule
- output `BasisRef` / dependency-token shape
- freshness comparison rule
- `STALE` condition
- `UNRESOLVABLE` condition
- domain-defined `CONFLICTED` condition, if applicable
- evidence/source refs
- falsifier
- explicit UNKNOWN / DEFERRED items

An adapter may consume existing canonical references but must not create a new canonical store.

## 3. Parallel owner matrix

| Adapter | Owner | Current basis evidence | Required L2 closure | Current status |
|---|---|---|---|---|
| World/Object revision | CFA-01 | canonical vault identity/revision exists; WorldReferenceResult carries basis-oriented fields; CFA-01 L2 characterized the strongest token as `(ns,id,rev)` with optional CID | owner-scoped canonical token, resolver, STALE/UNRESOLVABLE behavior, evidence and falsifier | **CLOSED — design CHARACTERIZED; runtime propagation UNKNOWN** |
| Durable continuity / reconstruction | CFA-02 | vault revisions/CIDs, lineage and reconstruction responsibility are established; CFA-02 is ratified but some joins remain unresolved | define which durable record/revision references can serve as basis without creating a second identity store | OPEN |
| Authority / policy | CFA-04 | authority corridor uses live authority/evidence and policy/law references; exact self-knowledge dependency adapter is not frozen | identify policy/law version or immutable digest basis, resolution rule and refusal/staleness boundary | OPEN |
| Capability / Provider / Realization | CFA-06 | ProviderRealization and provider-specific evidence are current; exact stable observation basis and live-vs-fixture rule remain partly open | identify stable capability/realization/provider observation token and unresolved behavior | OPEN |
| Composition / Manifest | CFA-07 | Recipe/Manifest admission evidence includes manifest/content identity and replacement lineage; logical composition survivor semantics remain open | define version + immutable identity basis needed for a derived view; preserve logical-vs-installed identity distinction | OPEN |
| Change / Compatibility | CFA-09 | Change is a cross-domain relation with subject/state/evidence/history references; exact Data mapping remains open | define the minimum change/revision/compatibility basis a derived view actually depends upon | OPEN |
| Runtime generation/source | CFA-10 | runtime lifecycle/generation/fencing evidence exists; B1 remains underproven and exact minimum runtime source token is not frozen | define bounded generation/source basis and failure semantics without promoting experimental machinery to K0 | OPEN |

**CFA-01 closure note:** the strongest World/Object freshness basis is the existing canonical vault revision `(ns,id,rev)`, with optional CID where available. Current WorldModel/EntityView shapes do not propagate the exact canonical revision/CID for every derived entity, so runtime token propagation remains UNKNOWN/deferred. This is a characterization result, not a runtime implementation claim.

CFA-03 is the semantic consumer/lead for self-knowledge and grounding; it does not acquire ownership of these domain basis meanings merely because it consumes the adapters.

## 4. Adapter invariants

Every adapter must preserve:

- semantic identity != durable record identity != representation identity;
- evidence != description != authority;
- stale != false;
- unknown != failure;
- currentness comes from current basis comparison;
- stored freshness is only a cache hint;
- adapter failure to resolve a token must not become guessed CURRENT;
- no adapter creates a universal identity, event or state abstraction;
- no adapter grants permission or mutates Ω law.

## 5. Domain adapter rules

### CFA-01 — World/Object

Use the strongest existing canonical revision identity where available. A source observation must not be substituted for canonical World/Object revision merely because it is recent.

**CFA-01 characterized result:** `world.object-revision.basis.v1`; canonical token `(ns,id,rev)` with optional CID; canonicalRef → exact current revision → optional CID/evidence → BasisRef. STALE is a changed current revision/content identity; UNRESOLVABLE is insufficiently resolvable canonical basis; owner-defined World contradiction is CONFLICTED. Runtime propagation through current WorldModel/EntityView remains UNKNOWN.

Falsifier: change the authoritative World/Object revision and verify that a dependent derived view cannot remain CURRENT.

### CFA-02 — Data continuity

Use durable record/revision/lineage references already owned by the Data plane. Do not turn the BasisRef into a second canonical identity registry.

Falsifier: remove the derived projection while retaining canonical durable records; reconstruction must still be possible from the existing continuity substrate, subject to its stated guarantees.

### CFA-04 — Authority/policy

Carry only the policy/authority dependency necessary to determine whether a derived description remains based on the same governing source. A self-knowledge view may describe authority evidence but must never interpret it as permission.

Falsifier: change/revoke the governing authority basis and verify that a dependent derived view is no longer CURRENT without the self-knowledge plane deciding authorization.

### CFA-06 — Capability/Realization

Use a stable realization/observation basis sufficient to distinguish replacement or drift from unchanged observation. Provider implementation details do not become capability meaning.

Falsifier: replace a realization or alter its observed basis and verify dependent derived state becomes STALE/UNRESOLVABLE as defined, without rewriting capability semantics.

### CFA-07 — Composition/Manifest

Use the strongest installed/admission identity already present in Recipe/Manifest evidence. Do not collapse that into logical Composition identity where survivor semantics remain unresolved.

Falsifier: perform a representation/realization replacement that should preserve logical identity and confirm the adapter does not force an identity break merely from implementation replacement.

### CFA-09 — Change/Compatibility

Use only the change/revision/compatibility references actually required by the derived view. Change remains a cross-domain relation; the adapter does not create a parallel history store.

Falsifier: mutate a governing change basis and verify dependent views stale without converting compatibility into authorization.

### CFA-10 — Runtime

Use the minimum proven runtime generation/source token needed to establish whether a runtime-derived observation has changed. Do not promote State/Graph/Grant/Generation experiments into K0 by terminology.

Falsifier: fence/replace a runtime generation and verify a dependent derived observation cannot remain CURRENT against the retired generation.

## 6. Closure rule

An adapter is **CLOSED** only when its owner has explicitly named:

1. canonical/current source identity;
2. comparison token;
3. resolver;
4. stale condition;
5. unresolvable condition;
6. evidence refs;
7. falsifier;
8. unresolved details.

Compatible prose or a peer's proposed schema does not close another CFA's adapter.

## 7. Evidence ladder

Allowed claims remain:

`OBSERVED → DERIVED → PROPOSED → UNKNOWN / CONFLICTED`

An adapter may be design-closed before it is implementation-proven.

Implementation or live proof is not required merely to characterize the adapter, but any stronger claim must retain its proof level.

## 8. What central mechanics may do after characterization

Once an owner adapter is closed, central code may provide:
- deterministic normalization of the adapter's declared token;
- generic BasisRef comparison;
- digest calculation;
- freshness diagnostics;
- evidence/reference envelope handling;
- receipt generation.

Central code may not decide what a World revision, Authority policy, Capability realization, Composition identity, Change or Runtime generation means.

## 9. Recommended parallel execution

Run these independently:

`CFA-01 || CFA-02 || CFA-04 || CFA-06 || CFA-07 || CFA-09 || CFA-10`

Then Steward reconciliation:

`adapter results → consistency check → L3 graph-bundle enablement`

CFA-03 may consume the set continuously as the semantic lead rather than waiting for a serial round.

## 10. Stop conditions

Stop an adapter when:
- canonical token cannot be established from evidence;
- a proposed token would create a second identity/store;
- the adapter would require an Ω-law decision;
- freshness cannot be compared without inventing a source authority;
- a live-proof claim would depend on an unavailable owner/runtime environment.

In these cases record UNKNOWN/BLOCKED with the missing evidence, not a substitute token.

## 11. L2 completion gate

L2 is complete only when the seven owner adapters above each have a durable characterization satisfying Section 6, or are explicitly recorded as blocked with a named owner/environment dependency and Steward accepts the remaining UNKNOWN.

L3 graph bundle design remains behind this gate.

## 12. Human routing

The central launch step is complete. The next work is parallel CFA-owned adapter characterization.

Send `Next` to:

`CFA-01, CFA-02, CFA-04, CFA-06, CFA-07, CFA-09, CFA-10` in parallel.

CFA-03 remains the semantic lead/consumer and should not be made a serial predecessor of the adapter owners.

## 13. Integrity

- CFA-01 owner characterization: **CLOSED**.
- Remaining L2 owners: **OPEN**.
- no runtime self-knowledge join implemented;
- no second Architecture Graph;
- no Ω-law change;
- no K0 expansion;
- no semantic ownership transfer;
- no production/live proof claimed.
