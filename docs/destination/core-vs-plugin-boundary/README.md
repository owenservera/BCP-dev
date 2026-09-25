# Core vs Plugin Boundary Research

Status: **DERIVED — PASS 3 COMPLETE / RESPONSIBILITY INVENTORY CORRECTED**
Branch: `research/core-vs-plugin-boundary`
PR: #46

## Executive verdict

Pass 3 confirms the narrow K0/K1/plugin architecture but exposes an important completeness problem in the original responsibility matrix.

The original matrix bundled too many distinct destination responsibilities together. It has now been replaced by:

**`DESTINATION-RESPONSIBILITY-MATRIX.md` — 125 explicit responsibility rows plus cross-cutting concerns.**

This expanded inventory is now the baseline against which Core adequacy must be tested.

The correction does **not** imply that newly separated responsibilities belong in K0. It makes the boundary test honest by ensuring that Self-Knowledge, NCLL, the canonical data model, identity/reconciliation, Work semantics, provider/account/session/resource identity, attention/continuity, product lifecycle, sharing, local intelligence and other destination responsibilities are explicitly represented.

## Proven boundary

K0: universal non-bypassable runtime mechanisms.

K1: shared protocol/reference vocabulary without product implementation ownership.

System plugins: first-party domain capabilities and semantics.

Extension plugins: third-party/user capabilities through the same governed boundary.

Tooling: authoring, analysis, diagnostics and CI outside runtime authority.

## Pass-3 current findings

The strongest proven K0 nucleus remains:

- signed composition admission;
- integrity/signature verification;
- compartment/Port enforcement;
- capability egress;
- revocation/fencing;
- atomic activation/recovery;
- generic lifecycle;
- necessary crypto/canonical primitives.

Current implementation contradictions:

1. zero-plugin boot;
2. B1 executable-entry confinement.

Current K0 candidates still requiring reduction/experiments:

- State;
- Graph/Grant provenance;
- Generation pin;
- platform seam;
- generic bootstrap role;
- hostile OS containment if demanded by the extension threat model.

## Important responsibility correction

The expanded matrix now separates the following that were previously collapsed:

- Self-Knowledge and freshness;
- NCLL / symbolic command language / grounding / teaching;
- canonical data model / ontology / identity / relationships / reconciliation;
- query / retrieval / projection;
- evidence / provenance / verification / epistemic state;
- Intent / Plan / Spatial Intent;
- Authority / Consent / Delegation;
- Work / Step / Attempt / Scheduler / Recovery;
- Provider / Account / Session / Resource;
- Routing / Provider Knowledge / Discovery / Healing;
- Credentials / secrets;
- Memory / Context;
- Attention / Notification / Background / Return continuity;
- Workspace / Surface / Canvas / direct manipulation;
- Product Instance / configuration / persistence / continuity;
- Product shell / OS / desktop / install/update;
- acquisition / export / restore / sync / sharing;
- local intelligence/model lifecycle;
- Forge / distribution / evolution / compatibility / migration / rollback.

## Why the correction matters

A responsibility inventory is upstream of a Core boundary.

The correct chain is:

```
documented destination
        ↓
complete responsibility universe
        ↓
required invariants
        ↓
K0 / K1 / plugin ownership
        ↓
current Ω implementation
        ↓
evidence
        ↓
gap classification
```

The previous matrix skipped the second step at sufficient resolution.

This package now fixes that.

## Current implementation gate

Before any substantive host/runtime work, a K0 proposal requires:

- protected invariant;
- concrete unsafe bypass if externalized;
- universality;
- domain neutrality;
- smallest mechanism;
- extraction/removal experiment;
- impact set;
- falsifier.

## Blocking experiments

1. B1 executable-entry confinement.
2. Generic empty-composition and bootstrap-role proof.
3. K0 reduction of state, graph and grant provenance.
4. Generation-pin continuity proof.
5. First-party/third-party symmetry test.
6. Active Work implementation replacement test.
7. Expanded responsibility adequacy trace across representative vertical slices.

## Authority

This package is derived research. Ratified Ω law remains authoritative. Any disagreement is recorded explicitly rather than silently normalized.
