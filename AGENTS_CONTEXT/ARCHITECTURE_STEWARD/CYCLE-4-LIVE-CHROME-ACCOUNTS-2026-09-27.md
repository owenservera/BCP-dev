# Cycle 4 — Live Chrome / Accounts Execution Packet
## 2026-09-27

> Status: CANDIDATE / PAUSED
> Classification: derived execution packet over existing destination reconciliation
> Not a new architectural workstream; not Ω law.
> Primary proof target: RA-5 — Live account proof

## Planning status

This packet remains valid candidate evidence for later domain planning, but it is **not the current Steward mandate**. It was previously promoted before the CFA-owned roadmap stage had been run and is now intentionally paused.

Reconsider it only after the CFA domain roadmaps are formed and the Steward has reconciled them. Do not infer adoption from the packet's original sequencing or from the Build-and-Harvest plan's former CURRENT label.

## Purpose

Move the repository from documented/code-level provider-browser capability toward truthful live evidence for the user-owned account/session path.

The existing design baseline is:

Account semantics → Provider/Account availability → Realization candidates → Routing policy → Selection decision → Authority/law → Session → Execution → Evidence.

Cycle 4 is the existing Build-and-Harvest Plan phase. Do not redesign the provider abstraction, routing architecture, Commons, or the CFA constellation during this task.

## Lead / contributors

- CFA-06 Capability / Provider / Realization: lead the realization/provider evidence boundary.
- CFA-04 Authority / Governance: authority and re-authentication semantics.
- CFA-05 Agency / Work / Execution: Work/execution attribution when the live path crosses durable Work.
- CFA-08 Experience / Interaction / Surfaces: user-visible account/provider choice evidence where relevant.
- Existing P1-07 / P1-08 evidence: provider laboratory and harvest/reality evidence already referenced by the destination reconciliation.
- Architecture Steward: synthesize, classify, reconcile, and preserve lineage; do not claim live proof from code/tests alone.

## RA-5 acceptance

Prove all four:

1. The selected account/session is the one actually used.
2. There is no silent account substitution.
3. Release/re-authentication is attributable.
4. Evidence reconstructs the path from account selection through realization/session/execution.

A successful unit test, fixture replay, or code inspection is not by itself RA-5 live proof.

## Required evidence envelope

Record:

- owner-machine execution environment;
- provider and account identity used;
- relevant Chrome/profile/session identity;
- selected realization;
- authorization/reauth event where applicable;
- execution request and result;
- evidence references that reconstruct the path;
- any refusal, substitution, drift, healing, or uncertainty observed;
- exact repository commit/ref containing the evidence artifact.

## Stop conditions

Stop and report PARTIAL or BLOCKED rather than manufacturing proof when:

- authenticated owner-machine Chrome cannot be accessed;
- account identity cannot be verified;
- session/profile attribution is ambiguous;
- external effect is uncertain and no reconciliation evidence exists;
- the proposed change would require a new routing/provider architecture decision.

## Current architectural boundary

This packet does not authorize implementation of a new router.

The existing reconciliation remains the contract:

Account is a first-class user-world relationship. Realization is the technical implementation. Routing is user-owned policy over valid realizations. Law remains the authority. Session is execution state. Evidence records what actually happened.

## Completion

When this packet is later selected from the reconciled frontier and live evidence is captured, the Architecture Steward:

VERIFY → CLASSIFY → UPDATE RELEVANT DESTINATION / P1 VIEW → PRESERVE RAW EVIDENCE → SELECT NEXT SLICE

Do not reopen CFA home bootstrap work merely because a live proof is incomplete.
