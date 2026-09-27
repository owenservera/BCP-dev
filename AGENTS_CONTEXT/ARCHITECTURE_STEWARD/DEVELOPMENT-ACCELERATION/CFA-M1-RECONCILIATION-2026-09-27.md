# Cross-CFA M1 Reconciliation — Development Acceleration Substrate
## 2026-09-27

> Status: RECONCILED / CENTRAL KERNEL CANDIDATE READY
> Authority: derived Architecture Steward synthesis; not Ω law and not a replacement for CFA-owned semantics.
> Basis: current main verified at 0ef4ab8856af4ec31a7ebcb9b7cbcf3842ddcc72.

## 1. Purpose

Reconcile the ten first bounded CFA M1 evidence packets into one implementation-neutral central extension model.

This does not activate a shared semantic boundary, create a universal ontology, ratify CFA-local proposals, replace Agent Commons / Boundary Protocol / Session Result Contract, or authorize domain-semantic production implementation.

The narrower question is:

What shared development mechanics can be frozen now because all ten CFAs can use them without the Steward deciding what their domain objects mean?

## 2. Verified CFA M1 frontier

| CFA | Durable M1 evidence | Current state | Central consequence |
|---|---|---|---|
| CFA-01 World | M1 Semantic World Kernel Evidence | COMPLETE; peer reconciliation remains | Carry World references/evidence; do not define World semantics |
| CFA-02 Data | Continuity Corridor 1 Evidence | COMPLETE / design-bounded; live provider proof later | Carry reference-oriented continuity, revision and reconstruction links |
| CFA-03 Semantic | Findings + Crosswalk + M1 receipt | COMPLETE; Plan/Work continuity remains partial | Trace semantic artifacts; do not invent Intent/Plan meaning |
| CFA-04 Authority | Authority Corridor Evidence Pack | COMPLETE evidence pack; live corridor waits for shared selection | Carry authority citations/results as references; never calculate permission centrally |
| CFA-05 Work | M1 Work Envelope Characterization | COMPLETE candidate; peer reconciliation required before freeze | Index Work refs/lifecycle; Work semantics remain CFA-owned |
| CFA-06 Capability | M1/M2 Evidence Package | Evidence pass complete; peer follow-up remains | Keep capability/provider/account/session/resource roles separate |
| CFA-07 Composition | Composition Identity + Survivor Proof | M1 evidence complete; peer reconciliation remains | Carry composition refs and replacement lineage; do not define identity centrally |
| CFA-08 Surface | Minimum Surface/View Contract | M1 contract complete | Represent projection/view/layout/interaction without canonizing them |
| CFA-09 Evolution | Minimum Change Contract + Peer Reconciliation | M1 complete | Carry Change refs/lifecycle; leave compatibility semantics to CFA-09 |
| CFA-10 Runtime | K0 Evidence/Falsifier Matrix | K0 matrix established; B1 remains underproven | Record proof levels/runtime evidence; do not weaken K0 |

## 3. Convergence

The ten packets converge on a small cross-domain substrate:

1. References rather than universal objects.
2. Orthogonal epistemic and freshness state.
3. Evidence and lineage attached to claims and changes.
4. Requests distinct from confirmed dependencies.
5. Explicit falsifiers and bounded proof levels.
6. A trace from task through evidence and receipt.
7. Rebuildable central projections rather than a second canonical store.
8. Domain meaning supplied through CFA-owned adapters.

Common trace:

task/question -> subject/owner -> design claim -> scaffold -> change -> targeted verification -> evidence -> receipt -> handoff

Consequential corridor trace:

semantic input -> authority -> Work/Attempt -> capability/realization -> runtime -> effect -> observation -> evidence -> continuity -> surface

The central substrate owns the trace, not the meanings.

## 4. Seam vocabulary candidates

These are seam terms, not a universal ontology.

| Term | Mechanical meaning | Anti-definition |
|---|---|---|
| Reference | pointer to a domain-owned subject, record or revision | not proof of existence or authorization |
| Claim | proposition carrying epistemic/freshness/evidence metadata | not truth because it is indexed |
| Evidence | source/basis supporting a claim or verification | not permission |
| Dependency Request | request for another CFA input | not a dependency merely because it is repeated |
| Dependency | justified cross-CFA relation affecting consuming work | not an attention flag |
| Handoff | bounded transfer of information/request across a seam | not transfer of authority |
| Falsifier | condition that would invalidate a claim/design | not a proof result by itself |
| Proof Result | classified output from a bounded verification | not full-system green |
| Receipt | durable link between task/change/proof/evidence/limits | not semantic authority |
| Reconciliation | explicit comparison and resolution/deferral | not silent convergence |
| Freshness | temporal validity classification | not confidence |

## 5. Generic central schemas

### S1 Reference Envelope

reference id, reference kind, opaque target, optional revision/source/evidence pointers, freshness.

Rules: reference kinds are extensible; the central engine never infers semantic equivalence or authorization.

### S2 Claim / Evidence Envelope

claim id, subject reference, claim type, epistemic state, freshness, owning CFA, sources, optional falsifier, decision refs, status, optional supersedes reference.

Central validation checks shape and lineage. Domain adapters define claim meaning.

### S3 Question / Dependency Edge

question id, optional subject, consumer CFA, optional supplier CFA, requested inputs, evidence refs, relation kind, blocking class, closure condition, status.

REQUEST never auto-promotes to CONFIRMED_DEPENDENCY.

### S4 Decision Packet

question, subject refs, evidence refs, unknowns, conflicts, options, criteria, peer inputs, dependency edges, falsifiers, decision owner, readiness.

Central mechanics validate completeness; the responsible CFA/owner makes the consequential decision.

### S5 Development Trace

task ref, optional question ref, subject refs, design refs, scaffold refs, change refs, proof refs, evidence refs, optional receipt ref, handoff refs, unresolved refs.

### S6 Proof Result

proof id, optional scenario/fixture refs, target refs, proof level, status, invariant results, evidence refs, known limits, escalation flag.

### S7 Scaffold Request

artifact kind, CFA, subject refs, template version, seed inputs, no-clobber flag.

### S8 Handoff Envelope

source CFA, target CFA, subject refs, reason, request, supplied artifacts, evidence refs, expected response, unresolved questions, optional authority basis, status.

This reuses the existing Boundary Protocol handoff concept rather than defining a second message grammar.

## 6. Safe central projections

- CFA/agent index
- artifact/owner index
- reference index
- claim/evidence index
- question/dependency graph
- decision-readiness view
- falsifier coverage view
- task-to-proof-to-receipt trace
- stale/unresolvable evidence report
- bounded context-pack index
- friction/latency telemetry

All are rebuildable derived views.

## 7. Explicitly CFA-owned

- semantic identity definitions
- domain object schemas and canonical fields
- meanings of World, Intent, Plan, Work, Capability, Composition, Surface, Change and K0
- domain invariants/falsifiers
- authority policy and permission semantics
- provider/account/session/resource semantics
- replacement survivor semantics
- compatibility dimensions
- live/product proof truth conditions
- product behavior
- Ω-law changes

## 8. Reconciled open questions

| Question | Primary owner | State | Central response |
|---|---|---|---|
| Semantic identity over time / merge-split | CFA-01 + CFA-02 | UNKNOWN | opaque references only |
| World reference/result acceptance | CFA-01 + CFA-03 | UNKNOWN | adapter extension point |
| World accessible vs authority | CFA-01 + CFA-04 | UNKNOWN | keep dimensions separate |
| Intent -> Plan -> Work continuity | CFA-03 + CFA-05 | PARTIAL / UNKNOWN | reference trace only |
| Authority live re-resolution | CFA-04 | bounded; live proof pending | carry citation/result refs |
| Capability / provider / mediation / upstream service | CFA-06 | OPEN | role-specific refs |
| Account/resource/session joins | CFA-06 + CFA-02 | OPEN | adapter-owned |
| Composition semantic identity | CFA-07 | PROPOSED | opaque composition reference |
| Surface durable-state boundary | CFA-08 + peers | OPEN | metadata only until peer closure |
| Change semantic delta / impact / compatibility | CFA-09 | PROPOSED | generic Change reference only |
| K0 B1 executable containment / byte binding | CFA-10 | UNDERPROVEN | central tooling may report; no workaround |

## 9. Gate

The central kernel is mechanically ready when implementation consumes only the generic schemas, treats domain references as opaque, reuses existing protocols, creates rebuildable indexes, exposes adapter points, emits receipts/proof results, and preserves UNKNOWN/CONFLICTED rather than guessing.

No shared boundary is activated by this reconciliation.

## 10. Next step

Use CENTRAL-KERNEL-IMPLEMENTATION-PACKET-2026-09-27.md to build the generic Layer-1 substrate.

