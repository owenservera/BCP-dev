# VG-0001 — Entire Swarm / Agent System Audit

> Status: IN PROGRESS — Phase 1 evidence reconstruction
> Date: 2026-09-28
> Reviewer: VETO-01 / COORD-01 audit session
> Mission: Full VIVIM beta ready to distribute for free

## Executive disposition
REQUEST-EVIDENCE

This audit has established several structural facts and material risk candidates, but current installed OpenCode runtime behavior has not yet been re-executed by this session. Remaining live-runtime facts are required before a final NO_VETO or VETO_PROPOSED disposition is responsible.

No VETO_PROPOSED item is issued at Phase 1.

## 1. Current-system map
### A. Native OpenCode
Current official V2 documentation describes primary/subagent agent modes, child sessions through the subagent tool, ordered permissions, and session-level APIs. Current OpenCode release evidence visible on 2026-09-28 shows v1.18.32 as latest, while this repository's resident lab records v1.18.4 as its experimental baseline.
### B. Vendored opencode-swarm
The vendor implementation provides a separate SDK-driven orchestrator, SQLite-backed swarm state, mutable shared memory, inter-agent messaging, reporting and MCP control surfaces. It is not merely a thin wrapper around native Task.
### C. Ω resident-team lab
The resident lab deliberately retains opencode-swarm as a reference substrate while testing native Task as the resident-to-worker spawning primitive. Its plugin observes Task/session events but does not yet constitute a complete governance layer.
### D. Agent Commons
Commons provides signed event identity, hash chaining, durable streams, messaging, handoffs, presence and derived context. Its provenance model is substantially closer to the new workspace Truth Chain than mutable swarm key/value memory.
### E. Inherited .opencode organization
The repository carries a mature Steward + ten-CFA + leaf-worker organization as inherited/parallel lineage, while the Ω End-State team control plane currently describes a much smaller experimental roster. This creates a real organizational-resolution question.

## 2. Capability inventory — Phase 1
| Capability | Present substrate | Evidence status | Initial assessment |
|---|---|---|---|
| Parallel session orchestration | opencode-swarm | OBSERVED in source/tests; live runtime UNKNOWN | Existing capability worth preserving as evidence/reference |
| Persistent swarm state | opencode-swarm SQLite | OBSERVED | Useful but not authoritative provenance |
| Shared coordination memory | swarm SQLite | OBSERVED | Useful operational memory; mutable last-writer-wins |
| Inter-agent messaging | swarm MessageBus | OBSERVED | Useful, but separate from Commons semantics |
| Native child-session delegation | OpenCode Task/subagent | DOCUMENTED / lab prior evidence | Must be re-run on current installed build |
| Task permission gating | native OpenCode | DOCUMENTED; repository prior evidence version-specific | Current behavior requires live proof |
| Resident→worker pattern | resident lab | DESIGNED, checkpoints pending | Not yet runtime-proven on current build |
| Durable signed identity | Agent Commons | SOURCE + tests | Strong reusable substrate |
| Evidence/provenance chain | Commons + workspace Truth Chain | PARTIAL | Strong primitives exist; not yet unified |
| Worker leaf containment | .opencode + worker catalog | DOCUMENTED / partly tested historically | Requires current runtime reconciliation |
| Completion receipts | inherited mainline | DOCUMENTED + recorded tests | Existing strong mechanism, not yet unified with Ω roster |
| Turn/queue visibility | VETO-01 | ACTIVE informational protocol | Newly seeded; not system-enforced |

## 3. Critical distinction: two orchestration paradigms
### SDK swarm
swarm CLI -> opencode serve -> SDK session.create -> prompt -> swarm DB/message bus
### Native resident model
parent session -> native Task/subagent -> child session
The first creates and controls sessions through an external orchestrator. The second uses OpenCode's own child-session semantics. They can coexist as experiments, but treating them as one coherent authority/lineage system would be premature.

## 4. Initial anti-pattern exposure
### AP-01 — Shadow topology
Evidence supports coexistence of an Ω three-agent team model, inherited ten-CFA model, five leaf-worker bindings, and a vendored swarm roster. The risk is not the existence of multiple experiments; it is ambiguity over which identity/authority surface is operative.
### AP-02 — Documentation/runtime generation drift
The resident lab and several delegation records are explicitly pinned to OpenCode v1.18.4, while current official documentation and releases have advanced. Historical test results therefore need version qualification.
### AP-03 — Second communication/provenance plane
opencode-swarm has its own message bus and mutable memory while Commons has signed durable streams, messaging and handoffs. This creates a potential second communication substrate that can diverge from the workspace truth chain.
### AP-04 — Capability/permission asymmetry
The swarm orchestrator force-enables its own coordination tools, while the broader team model relies on capability restriction. This deserves explicit policy classification rather than being mistaken for ordinary tool-map least privilege.
### AP-05 — Session-name lineage
Swarm state identifies agents largely by swarm-local names and OpenCode session IDs. The model does not provide the same signed durable identity/stream semantics visible in Commons.
### AP-06 — Unverified worker governance
The resident lab explicitly refuses to treat design documents and green process exits as proof. CP-01+ remain the required live evidence path.

## 5. Transaction-cost hypotheses
The major potential costs are:
- duplicate orchestration concepts;
- duplicate communication/memory surfaces;
- context needed to reconcile old and new organizational models;
- version drift between local experiments and current OpenCode;
- coordination overhead from many persistent roles;
- maintaining multiple authority/provenance mechanisms.

These are hypotheses until measured on real workload.

## 6. NO_VETO areas for Phase 1
No current evidence supports vetoing:
- continued bounded resident-team experimentation;
- retaining opencode-swarm as a reference implementation while its role remains explicitly experimental;
- continued use of Agent Commons as durable communication prior art;
- maintaining the inherited CFA corpus as lineage.

The evidence does support preventing silent promotion of any of these experimental surfaces into canonical authority without fresh verification.

## 7. Candidate experiments
1. Runtime reconciliation probe: record actual OpenCode version, effective config, agent list, Task/subagent permission behavior and parent/child session evidence.
2. U1 current-version proof: re-run CP-01 through the smallest relevant resident→worker checkpoints on the installed build.
3. Topology reconciliation: explicitly classify the Ω roster, inherited CFA bindings, workers and swarm agents as active, experimental, inherited or retired.
4. Communication consolidation experiment: measure whether native/Commons lineage can cover the required resident workflow before retaining swarm messaging as control traffic.
5. Trust-chain bridge experiment: map task, delegation, execution and result receipts into the workspace Truth Chain without creating a second provenance store.
6. Coordination-cost measurement: compare a bounded task executed through the native resident model versus the standalone swarm model using the same real workload.

## 8. VETO_PROPOSED
None at Phase 1.

## 9. Required next evidence
The next audit pass should obtain, from the actual Windows/OpenCode environment:
- exact OpenCode version;
- exact effective config;
- actual visible agent roster;
- parent/child session IDs;
- allowed and denied Task/subagent attempts;
- worker effective permissions;
- whether any alternate spawn surface exists;
- current test results;
- process/worktree behavior;
- actual use of swarm DB/Commons during the resident experiment.

## 10. Current bottom line
The agent system already contains substantial capability.

The central audit question is not which framework should become the winner.

It is: which capabilities are actually needed for the beta mission, which already have trustworthy evidence, and which overlapping mechanisms should remain experiments until their incremental value is demonstrated?

The most consequential unresolved seam is the boundary between native OpenCode delegation + bounded resident organization + Commons provenance and vendored swarm orchestration + swarm-local memory/messaging + SDK-created sessions.

The audit should resolve that seam empirically before the organization commits further architecture around it.