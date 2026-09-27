# Stage E Self-Knowledge Readiness — Workload Design
## 2026-09-27

> Status: DESIGN — READY FOR EXECUTION
> Scope: close the Stage E readiness gate. Do not implement runtime joins until the gate passes.
> Authority: Architecture Steward workload design only.

## 1. Workload decision

Stage E should be treated as a bounded cross-CFA readiness program, not one coding task.

Target state:

existing vivim.mind
+ existing Steward graph
+ explicit basis/freshness contract
+ explicit cross-plane grounding contract
+ freshness and grounding falsifiers
→ STAGE E READY

The program must prove that a fresh agent can move from one bounded runtime target to an attributed architectural trace without reconstructing the whole repository or inferring authority from code topology.

## 2. Work lanes

### L0 — Scope and gate contract
Owner: Architecture Steward.
Deliver: exact readiness checklist, non-goals, proof levels, stop conditions, one structural trace target, one consequential first-build trace target.
Recommended targets: `mind.portrait@1` and `COMP-FIRST-RESEARCH-EVIDENCE-WORLD`.

### L1 — Derived-view and freshness contract
Lead: CFA-03.
Consult: CFA-01, CFA-02, CFA-04, CFA-07, CFA-09, CFA-10.
Deliver: DerivedView, BasisRef, basis digest, dependency vector, derivation identity, CURRENT/STALE/CONFLICTED/UNRESOLVABLE semantics, restart behavior, lazy validation, external observation boundary.
Hard rule: freshness is computed from current basis comparison. Stored freshness is only a cache hint.

### L2 — Source and runtime basis adapters
Owners: responsible CFAs; central team owns only generic adapter mechanics.
Required characterization:
- World/Object revision → stable revision/CID reference.
- Continuity/reconstruction → durable reference and revision semantics.
- Authority/policy → policy version or digest reference.
- Capability/provider/realization → stable observation basis.
- Composition/manifest → version plus immutable identity where required.
- Change/compatibility → relevant revision and compatibility basis.
- Runtime → bounded generation/source token.
Each adapter must name owner, source refs, resolution rule, unresolved behavior, and falsifier.

### L3 — Steward graph bundle contract
Owner: Architecture Steward.
Deliver: deterministic bundle input set, canonical serialization, graph digest, lineage rules, schema handling, bounded trace projection, bundle freshness metadata, validation report.
Constraint: bundle is a projection/cache of the one Steward graph, never a second canonical graph.

### L4 — Cross-plane grounding contract
Lead: CFA-03 + Architecture Steward.
Consult: other CFAs only at actual seam crossings.
Minimum trace:
runtime observation → contract → capability/plugin/realization → grounding link → responsibility → journey → vertical slice → evidence → proof status.
Deliver: explicit link table, allowed link kinds, basis/evidence requirements, orphan and stale behavior, replacement behavior, trace result shape, grounding.trace@1 acceptance criteria.
Hard rule: imports, filenames, routes, class names and proximity cannot create semantic grounding by inference.

### L5 — Falsification and proof harness
Owner: central mechanics; CFAs provide domain falsifiers.
Required falsifiers:
1. Changed source basis cannot leave an old derived view CURRENT.
2. Changed derivation identity cannot leave an old result CURRENT.
3. Missing basis becomes UNRESOLVABLE.
4. Domain-defined contradiction becomes CONFLICTED without selecting authority.
5. Self-knowledge cannot grant permission or mutate law.
6. No competing architecture graph is created.
7. Replacement preserves semantic identity only according to owner-defined survivor rules.
8. Unmapped runtime knowledge is reported as ORPHANED or UNKNOWN.

### L6 — Bounded integration pilot
Owners: CFA-03 plus central implementation support.
Pilot A: `mind.portrait@1` → runtime observation → contract/plugin evidence → Steward responsibility → evidence/proof → freshness.
Pilot B: `COMP-FIRST-RESEARCH-EVIDENCE-WORLD` → requirements → implementation/proof attachments → grounded agent packet.
Constraints: no live provider build, no B1 selection, no new semantic authority, no universal identity/event/state, no broad graph rebuild.

### L7 — Gate audit
Owner: Architecture Steward.
Deliver: readiness matrix, source/proof links, explicit UNKNOWNs, gate receipt, next routing state.
Promotion is binary: NOT READY or READY.

## 3. Parallel execution model

Wave 0: L0 plus initial L1 scope lock.
Wave 1: L1 refinement, independent CFA adapter characterization for L2, and L3 bundle design in parallel.
Wave 2: central reconciliation of L1/L2/L3 into L4.
Wave 3: central mechanical harness plus CFA falsifier inputs.
Wave 4: bounded L6 pilot.
Wave 5: L7 gate audit.

L2 must not become a serial CFA-01 → CFA-02 → ... → CFA-10 chain. Each adapter is independently characterized and then reconciled.

## 4. Dependency graph

L0 → L1/L2/L3 → L4 → L5 → L6 → L7

L2 and L3 can proceed while L1 is being refined, provided no disputed semantic choice is frozen.

## 5. Central versus CFA

Build centrally:
- structural validation and deterministic serialization;
- reference and evidence envelopes;
- basis comparison and digest mechanics;
- graph bundle assembly and validation;
- bounded trace execution;
- proof/falsifier bookkeeping;
- receipt generation;
- readiness and dependency projections;
- context-pack generation and speed telemetry.

Require CFA input:
- domain reference meaning;
- canonical revision identity;
- identity survivor rules;
- authority/policy semantics;
- realization semantics;
- contradiction keys;
- domain falsifiers;
- live/product proof conditions.

Primary CFA responsibilities:
CFA-01 World/Object revision and addressability.
CFA-02 continuity, reconstruction, record revision.
CFA-03 self-knowledge, grounding, semantic trace.
CFA-04 authority citations and policy dependency.
CFA-06 capability/provider/realization basis.
CFA-07 composition/manifest identity and replacement.
CFA-09 change and compatibility implications.
CFA-10 runtime generation and constitutional proof boundary.

CFA-05 and CFA-08 are consulted only when the selected trace actually crosses Work or Surface semantics.

## 6. Development-speed design

Every agent packet should contain only:
TARGET | OWNER | WHY | CURRENT EVIDENCE | REQUIRED CONTRACT | OPEN UNKNOWN | FALSIFIER | FRESHNESS BASIS | DELIVERABLE | STOP CONDITION

Mechanical loop:
inspect → scaffold → prove/replay → receipt → handoff

Speed rules:
- characterize each source once, then reuse the accepted pointer;
- attach evidence when the artifact is created, not after the fact;
- one falsifier per material readiness claim;
- synthetic mechanical proof first, real target second;
- a failed gate creates one precise closure item, not another broad research cycle.

## 7. Required durable artifacts

1. This workload design.
2. Stage E readiness contract/checklist.
3. CFA adapter packets for participating CFAs.
4. DerivedView/BasisRef contract.
5. Steward graph bundle contract.
6. Cross-plane grounding/link contract.
7. Falsifier/proof matrix.
8. Bounded pilot packet.
9. Stage E gate receipt.

Implementation artifacts such as the freshness utility, bundle reader, grounding trace, runtime adapters, or persistence layer are downstream of the readiness gate.

## 8. Completion condition

The workload is complete when:
- work is independently owned and mostly parallel;
- central mechanics are separated from domain semantics;
- synchronization points are explicit;
- the minimum trace contract is frozen;
- the minimum freshness basis is frozen;
- the required falsifiers are executable;
- both bounded pilot targets are defined;
- the final gate is auditable from evidence.

## 9. Explicit non-goals

- no Ω law changes;
- no universal freshness law;
- no CFA-02 ratification as universal data authority;
- no B1 production mechanism choice;
- no live provider/product implementation;
- no universal Event/State/identity primitive;
- no second Architecture Graph;
- no global invalidation bus requirement;
- no automatic architecture mutation.

## 10. Operating sequence

Design → owner characterization → central reconciliation → mechanical proof harness → bounded proof → gate audit → runtime join implementation.

The important change is that the readiness gate becomes a real workload with parallel inputs, rather than a repeated assessment step.