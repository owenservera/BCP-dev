# Agent System Master Upgrade — Index
## 2026-09-28

Status: PROPOSED MASTER DESIGN. No runtime activation is implied by these documents.
Design branch: design/agent-system-master-upgrade-2026-09-28.
Baseline: e181820502f1a5ea572ed51b98cebd3af0b9c5ae.

## Core documents

1. MASTER-AGENT-SYSTEM-UPGRADE-2026-09-28.md — target architecture, execution model, migration order and definition of final.
2. MASTER-COMMUNICATION-SYSTEM-DESIGN-2026-09-28.md — Commons ordering, handoffs, transport, identity, validation and promotion gate.
3. DELEGATION-AND-CAPABILITY-ENFORCEMENT-2026-09-28.md — exact agent resolution, worker containment, revocation and completion enforcement.
4. IMPLEMENTATION-MATRIX-CHATGPT-VS-LOCAL-2026-09-28.md — explicit implementation/proof split.

## Important synthesis

The external corpus review is accepted as identifying a major missing dimension: shipping discipline.
The previous review concentrated on mechanical correctness of delegation and communication. This master upgrade adds the missing operating-system layer: code as completion, dormant/on-call specialist model, compact homes, generated envelopes, executable gates, execution metrics, and a Commons promotion/fallback decision.

Not accepted as an immediate deletion rule: Commons is not discarded now; it receives an explicit proof deadline and fallback mode. The ten CFAs are not erased; they become a domain coverage map with only the executing corridor active and the rest on-call.

Not accepted as a role collapse: ChatGPT is not reduced to a passive design mailbox. It remains the independent COORD-01 reasoning/audit surface. Local OpenCode is the authoritative execution/proof surface for the user's machine.

## Immediate next step

Do not create another architecture layer. Move to M1: implement the completion contract and prove one real bounded code corridor from current main.

## Historical safety

Existing large homes and date-stamped documents should be harvested and retired gradually. They are not to be mass-deleted merely to satisfy a target file count.