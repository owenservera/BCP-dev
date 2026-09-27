# CFA-04 — Authority Governance Steward
## Boundary Round 2 Task — 2026-09-27

> Coordinator: Architecture Steward
> Status: READY
> Your identity remains PROPOSED / OWNER DIALOGUE REQUIRED unless a later repository artifact explicitly changes that status. Do not silently ratify yourself.

## Start here

Read:

1. `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE/README.md`
2. `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE/AUTHORITY-MODEL.md`
3. `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE/STATE.md`
4. `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE/BOUNDARY-ROUND-1-DECLARATION-2026-09-26.md`
5. `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/BOUNDARY-PROTOCOL.md`
6. `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/ROUND-1-RECONCILIATION-2026-09-27.md`

Then perform only the seam tasks below.

## Do not

- ratify your own identity;
- redo Round-1;
- redesign World;
- redesign Semantic Continuity;
- redesign Data;
- activate a shared boundary;
- modify Ω law;
- implement a new authority subsystem.

## RP-02 — CFA-04 Authority ↔ CFA-03 Semantic Continuity

### Question

What minimum semantic package must cross from canonical Intent/Plan meaning into live authorization?

Consider:
- actor / behalf;
- intended effect;
- target reference;
- capability / operation;
- context/scope;
- semantic provenance;
- risk information.

Then:

How should expiry/revocation return to Semantic Continuity without becoming semantic meaning?

### Produce

Define:
- required semantic input;
- Authority-only data;
- live decision output;
- durable citation/reference;
- refusal/escalation state;
- what must remain orthogonal.

Preserve:

`Intent ≠ Permission`
`Grounding ≠ Authorization`
`Authority result ≠ semantic meaning`.

## RP-03 — CFA-04 Authority ↔ CFA-01 World

### Question

What exact distinction must exist among:

`existent`
`addressable`
`visible`
`accessible`
`authorized`
`nonexistent`
`not observed`

when a World subject is involved?

### Produce

A minimal crosswalk specifying:
- what World asserts;
- what Authority asserts;
- which state transitions cross the boundary;
- what cannot be inferred.

Required invariants:
- existence does not imply permission;
- non-visibility does not imply nonexistence;
- addressability does not imply authorization.

## RP-05 — CFA-04 Authority ↔ CFA-02 Data

### Question

What authority information must be durably retained with consequential data mutation?

The reconstructed chain should allow explanation of:
- actor;
- authority basis;
- target;
- scope/time;
- authorization result;
- mutation/result/evidence.

Then distinguish:

`durable authority reference`
from
`live authority decision`.

### Produce

A minimum durable authority citation/reference contract.

Do not make Data the authority store and do not make Authority the durable data owner.

## Evidence discipline

Classify every important claim:
- OBSERVED
- DERIVED
- PROPOSED
- UNKNOWN
- CONFLICTED

Preserve freshness.

## Required durable output

Add:

`## Round-2 Reconciliation Addendum — 2026-09-27`

to:

`BOUNDARY-ROUND-1-DECLARATION-2026-09-26.md`

or create a clearly linked addendum.

Preserve the original declaration.

Include RP-02, RP-03, RP-05, evidence and unresolved items.

## Identity note

Your Round-1 declaration currently says:

`PROPOSED — OWNER DIALOGUE REQUIRED`

Do not change that status merely because the boundary work is complete.

## Commit

Work directly on `main`.

Suggested message:

`CFA-04: reconcile authority boundary seams Round 2`

## Completion report

Return:
- file path;
- commit SHA;
- RP-02 status;
- RP-03 status;
- RP-05 status;
- most important unresolved issue;
- human-owner intervention required: YES/NO.

Then stop.
