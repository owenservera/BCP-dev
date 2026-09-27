# CFA Collaboration + Development Acceleration

> Date: 2026-09-27
> Status: M1 EVIDENCE RECONCILED / GENERIC KERNEL READY
> Authority: derived Steward design; not Ω law and not a substitute for CFA-owned semantics.

This workspace defines the shared substrate the ten CFAs need to make architectural decisions and implement safely at high speed.

## Design intent

The missing capability is not another roadmap. It is a common **decision-to-development loop** that lets every CFA:

`context -> question -> hypothesis -> scaffold -> change -> verify -> evidence -> receipt -> handoff`

The substrate combines two needs that must not be separated:

1. **Collaboration correctness** — shared vocabulary, evidence, claims, dependencies, decisions, handoffs, reconciliation and readiness.
2. **Development speed** — context packs, inspection, scaffolding, replay, targeted verification, receipts, orchestration and measured session friction.

## Design documents

- `COLLABORATION-DEVELOPMENT-ACCELERATION-DESIGN-2026-09-27.md` — overall architecture and M0 development loop.
- `CENTRAL-VS-CFA-RESPONSIBILITY-2026-09-27.md` — what the Steward can safely design/build centrally and what requires CFA input.
- `CFA-INPUT-REGISTER-2026-09-27.md` — exact information requested from each CFA, with timing and decision impact.

## Reuse rule

Existing mechanisms are reused where their semantics fit. In particular, the design draws on the current BCP common-agent substrate and the historical Ω development tooling evidence:

- FSSP-1.3 / Agent Commons transport and receipt discipline;
- boundary epistemic states and handoff/challenge protocol;
- historical genome/context fold;
- historical falsifier-first loop;
- historical orchestration graph;
- historical design simulation;
- historical development-vault and session-ledger concepts.

Historical Ω implementation is evidence of prior design/implementation experience, not automatic architecture authority for BCP.

## Implementation gate

The ten current CFA M1 evidence packets have now been reconciled into a central design baseline. Generic Layer-1 mechanics are ready for implementation under the central-kernel packet; domain semantics, canonical ownership, consequential behavior and live-proof criteria remain CFA-owned.

Implementation packet: CENTRAL-KERNEL-IMPLEMENTATION-PACKET-2026-09-27.md

Reconciliation: CFA-M1-RECONCILIATION-2026-09-27.md

Adapter contract: CFA-ADAPTER-CONTRACT-2026-09-27.md

No shared semantic boundary or Ω-law change is authorized by this design.
