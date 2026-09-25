# Boundary Protocol v0

## 1. Minimal shared vocabulary

Every CFA response participating in boundary work uses these epistemic states:

- OBSERVED — directly supported by repository/runtime evidence.
- DERIVED — logically derived from observed evidence.
- PROPOSED — a design hypothesis or recommended structure.
- UNKNOWN — material uncertainty with insufficient evidence.
- CONFLICTED — materially inconsistent claims/evidence exist.

Freshness is orthogonal:

- CURRENT
- STALE
- UNRESOLVABLE

Never use confidence as a substitute for evidence.

## 2. Boundary contract

A Boundary describes a responsibility seam, not a product object.

Minimum questions:

1. Who is responsible for the meaning?
2. Who is responsible for durable representation/data continuity?
3. Who is responsible for authority?
4. Who is responsible for execution?
5. Who is responsible for external realization?
6. Who is responsible for evidence/verification?
7. Who is responsible for lifecycle/evolution?
8. What crosses the seam?
9. What must not cross?
10. What invariants must remain true?
11. What evidence would falsify the current boundary?
12. What remains unknown or contested?

Ownership is multidimensional. Do not force a single owner field where different dimensions belong to different CFAs.

## 3. Responsibility position

Each CFA declares four sets:

- OWNS — semantically accountable in this dimension.
- CONTRIBUTES — supplies necessary information or transformation but does not own the final meaning.
- CONSULTS — needs peer input to work correctly.
- OUT-OF-SCOPE — explicitly not responsible.

## 4. Handoff

A Handoff records a meaningful transfer across a seam.

Required concepts:

source CFA, target CFA, subject, reason, source claim, requested input, supplied artifacts, evidence, expected response, unresolved questions, authority basis, status.

A handoff is not authority transfer.

## 5. Boundary challenge

A BoundaryChallenge exists when evidence or peer claims indicate the boundary may be wrong, incomplete, duplicated, or ambiguous.

It must record:
- the competing claims;
- the dimension of disagreement;
- evidence for each;
- current status;
- proposed resolution;
- falsifier;
- whether owner/ratification is needed.

Do not resolve a challenge by simply choosing the most convenient owner.

## 6. Lifecycle

Boundary:

`PROPOSED -> ACTIVE -> STALE -> SUPERSEDED`

A boundary may move to `CONFLICTED` from any active state when material contradictory claims remain unresolved.

Challenges:

`OPEN -> INVESTIGATING -> RESOLVED | DEFERRED`

Resolved means the participating claims have been reconciled and the record updated; it does not mean that every implementation is already complete.

## 7. Evidence discipline

Every substantive claim should point to one or more repository/runtime sources when available.

Use:
- path + relevant section/line;
- commit/revision when material;
- existing canonical document or implementation;
- experiment/result when runtime evidence exists.

A proposal may exist without evidence, but must be labeled PROPOSED.

## 8. What the Steward may and may not do

The Steward MAY:
- normalize artifacts;
- compare peer claims;
- detect overlap/gap/conflict;
- maintain the boundary register;
- derive graph/index views;
- mark stale records;
- initiate challenges;
- request evidence.

The Steward MUST NOT:
- silently redefine a CFA's semantics;
- turn a proposal into law;
- use the boundary registry as a second ontology;
- erase contradictory evidence;
- assign authority merely because a CFA is convenient to map there.

## 9. Common research loop

`GROUND -> IDENTIFY SUBJECT -> IDENTIFY OWNERS/AUTHORITIES -> CLASSIFY EVIDENCE -> DECLARE RESPONSIBILITY -> MAP SEAM -> DEFINE HANDOFF -> TEST FALSIFIERS -> RECORD UNKNOWN/CONFLICT -> RECONCILE -> PERSIST -> WATCH DRIFT`

This is a shared spine, not a mandatory identical internal methodology.

## 10. Output contract for a CFA

For Round 1, each CFA produces one durable document in its own folder:

`BOUNDARY-ROUND-1-DECLARATION-2026-09-26.md`

The document must contain:
1. CFA identity and current status.
2. Responsibility statement.
3. OWNS / CONTRIBUTES / CONSULTS / OUT-OF-SCOPE table.
4. Top three boundary seams.
5. For each seam: counterpart, subject, current claim, inputs, outputs, invariants, falsifier, evidence, unknowns/conflicts.
6. Explicit statements of what the CFA will **not** decide for peers.
7. Suggested questions for Round 2.

No code is required for Round 1.

## 11. Communication rule

Agent Commons is the communication substrate, not the authority system.

Use Commons for questions, notices, challenges, and handoffs when useful. Durable architecture claims belong in repository artifacts.

The human router may relay peer messages, but agents must remain responsible for their own persistent claims.
