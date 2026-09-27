# CFA-04 — Authority/Data/Work Seam Reconciliation
## 2026-09-28

> Status: COMPLETE — BOUNDED EVIDENCE CLOSURE
> Scope: CFA-04 M1 cross-CFA seam only; no schema freeze, implementation, or Ω-law change.

## 1. Action

Reconciled the current CFA-02 Data and CFA-05 Work evidence against the CFA-04 Authority corridor package to determine what is actually closed and what remains unresolved.

## 2. Evidence reviewed

- CFA-02 `BOUNDARY-ROUND-2-ADDENDUM-2026-09-27.md` explicitly accepts the minimum durable `AuthorityCitation` payload for reconstructing consequential mutations while preserving the distinction between historical citation and live permission.
- CFA-05 `M1-WORK-ENVELOPE-CHARACTERIZATION-2026-09-27.md` explicitly preserves `authorityCitationRef` as historical reconstruction data and requires fresh CFA-04 authorization at consequential gates, while leaving physical citation/join placement UNKNOWN.
- CFA-06 `M2-CROSS-CFA-RECONCILIATION-2026-09-27.md` treats the CFA-04 authority seam as sufficiently characterized for boundary purposes and keeps the final durable join unresolved.
- CFA-04 `AUTHORITY-CORRIDOR-EVIDENCE-PACK-2026-09-27.md` defines the live authority basis, gate-time re-resolution, invocation evidence, and minimum reconstruction package.

## 3. Closed seam

**CLOSED FOR SEMANTIC RECONCILIATION:**

```text
historical AuthorityCitation
    ≠
current authorization

live authority result
    →
runtime gate
    →
execution/effect

historical citation
    →
reconstruction/explanation
```

CFA-02 may preserve the reconstruction payload; CFA-04 remains the semantic owner of live authorization; CFA-05 may reference the historical citation without treating it as permission.

## 4. Minimum payload currently supported

```text
causationRef
actorRef
behalfRef?
targetRef
operationRef
effectRef? / intentRef?
authorityRef
scopeRef / scopeDigest
checkedAt
authorizationState
expiryRef? / revocationRef?
delegationChainRef? / authorityChainDigest?
evidenceRefs
resultRef / mutationRef
```

This is a **reconstruction requirement**, not an adopted physical storage schema.

## 5. Remaining UNKNOWN

- Exact physical AuthorityCitation storage/join remains UNKNOWN.
- Exact Work-versus-Attempt attachment/cardinality remains UNKNOWN.
- CFA-05 Plan/Attempt and retry/resume authority semantics remain open.
- Live authenticated external execution remains unverified.

These unknowns are preserved rather than resolved by inference.

## 6. Boundary result

**Finding:** CFA-04 can treat the Data-side historical citation requirement as semantically satisfied for the current M1 corridor. The shared implementation boundary is not frozen: physical storage/join and Work/Attempt attachment remain downstream reconciliation questions owned by the relevant peers.

## 7. Falsifiers

- A stored historical authorization is treated as current permission.
- CFA-04 begins defining durable Data storage rather than semantic authority requirements.
- Work requires cached permission instead of a fresh gate-time authority result.
- A proposed join creates a second canonical authority/data store.

## 8. Non-actions

No production code changed. No contract/schema was frozen. No Ω law changed. No live corridor was selected locally.