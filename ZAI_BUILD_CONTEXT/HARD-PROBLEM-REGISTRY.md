# Hard Problem Registry

This is the default attack order, not an immutable schedule. The agent may reorder only when evidence shows a dependency requires it.

## HP-01 — External identity chain
Account → Session → Browser Resource → Realization → Effect → Evidence.

Solve:
- Account identity;
- ownership;
- Session binding;
- resource identity;
- debugPort vs actual resource identity;
- attributable external effect.

Proof target: E1.

## HP-02 — Multi-account/resource isolation
Two authenticated accounts, independent resources, no cross-use.

Proof target: E2.

## HP-03 — Concurrency and resource leasing
Multiple simultaneous Works without contamination, with observable ownership and recovery.

Proof target: E3.

## HP-04 — Restart/expiry/recovery
Browser/process/session interruption and recovery without silently attaching to the wrong identity.

Proof target: E4.

## HP-05 — Routing as governed policy
Provider/account/model/realization selection with explicit user policy, constraints, explainability and evidence. Learned ranking can assist but cannot become authority.

## HP-06 — Durable Work
Durable Work identity, checkpointing, effect boundaries, interruption, continuation, outcome/evidence.

Proof target: E7.

## HP-07 — Canonical world/object model
Common envelope + typed semantics, relationships, revisions, lifecycle, projections, export/restore without universal semantic supertype.

Proof target: E6.

## HP-08 — Artifact / Document / File lifecycle
Create/edit/reference/version/project/export/restore and provider/context use.

## HP-09 — Provider knowledge
Evidence-backed aggregation of manifests, observations, candidates, mappings, parsers, realizations and drift without creating a second authority database.

## HP-10 — Provider onboarding/healing
Discovery → observation → inference → mapping → verification → realization → execution → evidence → drift → repair → probation → promotion.

## HP-11 — Self-knowledge freshness
Basis refs/digests, dependency versions, stale/conflicted/unresolvable states, recomputation/invalidation.

Proof target: E8.

## HP-12 — World/surface/continuity
Canonical world → projections → workspace/canvas/surface → continuity across restart.

## HP-13 — Legacy behavioral floor
Harvest and rebuild account-aware provider use, conversation continuity, workspace/canvas, background work, recovery/export, discovery/healing.

## HP-14 — Product Instance
Start → initialize → useful action → close → reopen → same durable world/composition/identity.

Proof target: G9.

## HP-15 — Full VIVIM Ω frontend/product surface
Build the coherent user-facing product rather than a collection of developer diagnostics.

## Hard-problem rule

One primary HP per turn.

The agent should select the highest-impact unresolved HP whose prerequisites are available, solve it deeply, package it, and stop for the turn report. It may then continue autonomously if the execution environment supports multiple turns, but each turn remains a single coherent problem.
