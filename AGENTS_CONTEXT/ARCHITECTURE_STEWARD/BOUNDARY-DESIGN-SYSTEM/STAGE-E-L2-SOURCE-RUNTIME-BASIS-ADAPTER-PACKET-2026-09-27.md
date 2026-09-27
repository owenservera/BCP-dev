# Stage E L2 — Source / Runtime Basis Adapter Packet
## 2026-09-27

> Status: **L2 CLOSED — 7/7 OWNER INPUTS RECONCILED**
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
| Durable continuity / reconstruction | CFA-02 | vault revisions/CIDs, lineage and reconstruction responsibility are established; durable characterization + receipt + task closure verified on current main | central reconciliation completed; no owner re-execution | **CLOSED** |
| Authority / policy | CFA-04 | authority corridor uses live authority/evidence and policy/law references; owner result is characterized with an explicit partial/UNKNOWN runtime source-binding finding | preserve the partial/UNKNOWN finding for central reconciliation; no additional owner characterization unless a specific gap is assigned | CLOSED — PARTIAL |
| Capability / Provider / Realization | CFA-06 | ProviderRealization and provider-specific evidence are current; owner L2 characterization receipt is present | none; await central reconciliation | CLOSED |
| Composition / Manifest | CFA-07 | Recipe/Manifest admission evidence includes manifest/content identity and replacement lineage; owner L2 characterization is present | none; await central reconciliation | CLOSED |
| Change / Compatibility | CFA-09 | Change is a cross-domain relation with subject/state/evidence/history references; owner L2 characterization is present with residual UNKNOWNs | none; await central reconciliation | CLOSED |
| Runtime generation/source | CFA-10 | runtime lifecycle/generation/fencing evidence exists; durable characterization + receipt + task closure verified on current main; B1 remains underproven | central reconciliation completed; no owner re-execution | **CLOSED — runtime basis UNRESOLVABLE / B1 underproven** |

**CFA-01 closure note:** the strongest World/Object freshness basis is the existing canonical vault revision `(ns,id,rev)`, with optional CID where available. Current WorldModel/EntityView shapes do not propagate the exact canonical revision/CID for every derived entity, so runtime token propagation remains UNKNOWN/deferred. This is a characterization result, not a runtime implementation claim.

CFA-03 is the semantic consumer/lead for self-knowledge and grounding; it does not acquire ownership of these domain basis meanings merely because it consumes the adapters.

## 4. Central L2 reconciliation — 2026-09-28

The Architecture Steward verified all seven owner receipt/task surfaces on current `main` and reconciled them against the common L2 adapter contract. See `RESULTS/STEWARD-20260928-STAGE-E-L2-7-INPUT-RECONCILIATION.md`.

**Decision:** L2 owner characterization is **CLOSED / RECONCILED (7/7)**.

The reconciliation preserves these cross-adapter invariants:
- local CFAs retain canonical domain meaning;
- semantic, durable-record, representation, realization and authority identities remain distinct;
- freshness is compared against current basis rather than stored status;
- missing/ambiguous binding remains `UNRESOLVABLE` or `UNKNOWN`, never guessed `CURRENT`;
- CFA-04 runtime immutable policy-source binding remains UNKNOWN;
- CFA-01 runtime revision/CID propagation remains UNKNOWN/deferred;
- CFA-07 logical Composition identity remains unresolved;
- CFA-09 durable Change identity/revision remains unresolved;
- CFA-10 runtime-generation binding remains unproven/UNRESOLVABLE;
- no runtime join, second graph/store, K0 expansion, B1 mechanism selection or Ω-law change is authorized by this closure.

### L3 enablement

L2 closure enables the next bounded Stage-E work item: **L3 Steward graph-bundle contract/design**. This is readiness work only; Stage E remains NOT READY until later grounding/falsifier/pilot gates pass.

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

## 11. Durable completion transaction

For every owner adapter, use the repository completion transaction from AGENTS_CONTEXT/ARCHITECTURE_STEWARD/DURABLE-COMPLETION-GATE-2026-09-28.md.

The owner MUST NOT report the adapter as DONE/COMPLETE until:
1. the characterization artifact exists;
2. the canonical <AGENT-HOME>/RESULTS/<SESSION_ID>.md receipt exists;
3. the exact TASKS.md L2 entry is updated to DONE, PARTIAL, or BLOCKED as justified;
4. the exact commit/ref is recorded;
5. current main is re-read and both the receipt and task-state update are verified there.

A chat-only completion claim is REPORTED-UNVERIFIED and does not satisfy the L2 gate. For a REPORTED-UNVERIFIED owner, a later Next first verifies/repairs the durable completion surface; it does not automatically rerun the characterization.

## 12. L2 completion gate

L2 is complete only when the seven owner adapters above each have a durable characterization satisfying Section 6, or are explicitly recorded as blocked with a named owner/environment dependency and Steward accepts the remaining UNKNOWN.

L3 graph bundle design remains behind this gate.

## 13. Human routing

The central launch step is complete. The next work is parallel CFA-owned adapter characterization.

Send `Next` to:

`CFA-01, CFA-02, CFA-04, CFA-06, CFA-07, CFA-09, CFA-10` in parallel.

CFA-03 remains the semantic lead/consumer and should not be made a serial predecessor of the adapter owners.

## 14. Integrity

- CFA-01 owner characterization: **CLOSED**.
- Remaining L2 owners: **OPEN**.
- no runtime self-knowledge join implemented;
- no second Architecture Graph;
- no Ω-law change;
- no K0 expansion;
- no semantic ownership transfer;
- no production/live proof claimed.
