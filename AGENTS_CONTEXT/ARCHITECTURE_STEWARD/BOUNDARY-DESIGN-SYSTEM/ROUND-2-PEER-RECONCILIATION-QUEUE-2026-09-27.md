# Round 2 — Peer Boundary Reconciliation Queue

> Date: 2026-09-27
> Coordinator: Architecture Steward
> Router: human owner / communication router
> Status: READY

## Objective

Round 1 independently exposed the CFA positions. Round 2 resolves only the bounded seam questions that remain material.

Do not ask agents to redo their bootstraps. Do not seek general consensus. Do not let the router mediate semantic ownership.

## RP-01 — CFA-01 World ↔ CFA-03 Semantic Continuity

Question:

What exact World-side reference/result must Semantic Continuity receive for resolved, ambiguous, stale, unresolvable and conflicted grounding?

Required distinction:

World meaning ≠ grounding/interpretation state.

Ask both sides independently.

## RP-02 — CFA-03 Semantic Continuity ↔ CFA-04 Authority

Question:

What minimum semantic package crosses from canonical Intent/Plan meaning into live authorization?

Consider actor/behalf, intended effect, target, capability/operation, context/scope, semantic provenance and risk information.

Second question:

How does expiry or revocation return to Semantic Continuity without turning authority state into semantic meaning?

Ask both sides independently.

## RP-03 — CFA-01 World ↔ CFA-04 Authority

Question:

What exact distinction must exist among existent, addressable, visible, accessible, authorized, nonexistent and not observed?

Required invariants:
- hidden must not imply nonexistent;
- existence must not imply permission;
- addressability must not imply authorization.

## RP-04 — CFA-01 World ↔ CFA-02 Data

Question:

Which decisions belong to World versus Data for semantic identity, correspondence, canonical record identity, revision, relationship identity, merge, split, alias, Event/State and canonical-vs-derived World fields?

Required outcome: a minimum dimensional crosswalk, not a universal identity model.

## RP-05 — CFA-02 Data ↔ CFA-04 Authority

Question:

What authority information must be durably retained with a consequential data mutation so the system can reconstruct who acted, under what authority, on what target, under what scope/time, and what result/evidence followed?

Then distinguish:

durable authority reference ≠ live authority decision.

## RP-06 — CFA-02 Data ↔ CFA-03 Semantic Continuity

Question:

How should semantic continuity and durable data continuity refer to the same meaning without collapsing semantic identity, record identity, Intent identity, revision identity, evidence identity and representation identity?

Treat this as secondary until the higher-leverage seams are clearer.

## Deferred execution seams

Once CFA-05 completes Round 1, route:

- CFA-03 ↔ CFA-05: Intent → Plan → Work → Attempt → Evidence semantic package and return path;
- CFA-04 ↔ CFA-05: minimum durable authority reference and re-resolution on retry/resume;
- CFA-02 ↔ CFA-05: Work/Attempt ↔ target/pre-state/post-state/external-effect/evidence linkage.

## Router execution order

Wave 1:
- RP-01
- RP-02
- RP-03

Wave 2:
- RP-04
- RP-05

Wave 3:
- RP-06 and the CFA-05 seams when CFA-05 exists.

## Completion condition

A seam is ready for Steward activation only when both peers have independently answered the same bounded question and:

- their answers agree; OR
- the disagreement is precisely recorded as UNKNOWN or CONFLICTED; OR
- the issue is explicitly deferred with a named dependency.

The Steward then creates the ACTIVE boundary record. Agents do not activate shared boundaries themselves.

## Router rule

Carry questions and answers with minimal paraphrase. Preserve the difference between:

- CFA claim;
- peer claim;
- Steward reconciliation;
- human-owner decision.