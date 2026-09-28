# Owner Delegation — Architecture Steward spawn authority

> Status: OWNER-APPROVED FOR INTEGRATION — 2026-09-28
> Classification: derived operational delegation; not Ω law, not Commons semantic
> authority, not a CFA boundary activation.
> Governing lineage: docs/agent-system/AUTONOMOUS-AGENTIC-TEAM-DESIGN-2026-09-27-v2.md
> Owner decision: docs/agent-system/LOCAL-SYSTEM-SHARED-MAIN-DECISION-2026-09-28.md
> Activation target: the integrated main baseline.
>
> This delegation authorizes the Architecture Steward to spawn the ten ratified
> CFA agents listed below. It does not authorize main writes outside normal
> repository governance, Ω-law changes, unreviewed shared-boundary activation,
> force-pushes, or production implementation beyond the existing Authority and
> Evolution gates.

## Purpose

The owner talks to one agent — the Architecture Steward. Everything the Steward
spawns beyond itself is spawned under a standing delegation from the owner,
recorded here, rather than an ambient capability the Steward assumes it has.

**In doubt, the Steward stops and asks. This file is read, not inferred.**

## Who may be spawned

The Steward (agent_id: architecture-steward) may spawn sessions for exactly these
ten names, and no others, without a fresh owner conversation:

| # | agent_id | Role |
|---|---|---|
| 1 | world-ontology-context | CFA-01 — World & Context Steward |
| 2 | data-model | CFA-02 — Data Steward |
| 3 | semantic-continuity | CFA-03 — Self-Knowledge / Language / Command |
| 4 | authority-governance | CFA-04 — Authority / Governance |
| 5 | agency-work-execution | CFA-05 — Agency / Work / Execution |
| 6 | capability-provider-realization | CFA-06 — Capability / Provider / Realization |
| 7 | composition-plugin-forge | CFA-07 — Composition / Plugin / Forge |
| 8 | experience-interaction-surfaces | CFA-08 — Experience / Interaction / Surfaces |
| 9 | evolution-compatibility-self-maintenance | CFA-09 — Evolution / Compatibility / Self-Maintenance |
| 10 | runtime-constitution-core-substrate | CFA-10 — Runtime Constitution / Core Substrate |

> commons-daemon remains deferred. It has no roster row or home yet. It may enter
> the spawn list only after registration, not by roster drift.

The list is reconciled against AGENTS_CONTEXT/AGENT-COMMONS/PEER-ROSTER.md before
each spawning wave. A roster edit alone does not extend this delegation.

A CFA subagent may spawn only `work-*` leaf workers from the registered catalog
(`docs/agent-system/WORKER-CATALOG-2026-09-28.md`), bounded by its task envelope.
Leaves hold no Commons identity, persist nothing, and spawn nothing — depth floor
is mechanical (`tools.task: false` on all `work-*` bindings). A CFA may never
spawn another CFA or the Steward. If a CFA needs another CFA's work, it sends a
Commons REQUEST/HANDOFF; the Steward turns that into a spawned session.

## Step and cost budgets per wave

- A **wave** is one parallel batch serving one owner-stated goal.
- Default ceiling: **10 concurrent sessions**, at most one per delegated name.
- Step/turn budgets: DEFERRED by owner direction 2026-09-28 (no budget
  constraints by default; depth caps, least-privilege, and verification still
  apply). When the owner activates budgets, each session must receive an explicit
  budget in its envelope; until then this section is a placeholder, not a gate.
- The Steward may not silently raise session count or budget. Any exception requires
  explicit owner approval recorded in that wave's SESSION-CONTEXT.md.

## Authority limits

No spawned session under this delegation may:

- change ratified Ω law (CURRENT-INVARIANTS.md, docs/BUILD-DECISIONS.md, D-records);
- ship consequential production implementation past the CFA-04 authority gate
  and CFA-09 safe envelope;
- force-push main or any published commons/<agent_id> communication ref;
- edit another agent's home directory;
- activate a shared CFA boundary that is UNACTIVATED;
- create a parallel task manager, ontology, authority store, or documentation
  bureaucracy.

## Stop conditions

Stop and report BLOCKED when:

- required Commons identity/key/signing capability is missing;
- authority is denied, expired, or unresolvable;
- a peer-boundary question is not resolved by this delegation;
- a durable receipt is required but the repository-write path is unavailable;
- the action's authority is ambiguous.

Ambiguity is a stop condition, not a coin flip.

## Revocation

The owner may narrow or revoke this delegation by editing or deleting this file
on the current working baseline.

A Steward session that finds this file missing, unreadable, or materially altered
since its last read treats spawning as unauthorized and asks the owner.

This delegation is reviewed whenever CORE-FUNCTION-AREA-REGISTER.md changes
(a CFA is added, retired, split, or merged).

## Technical enforcement boundary

The installed opencode 1.18.4 evidence verifies the spawn direction:
the Steward binding has task: true and each CFA binding has task: false.

The exact ten-name restriction remains a procedural/documented constraint unless
and until a name-scoped permission mechanism is separately verified and wired.
No claim of an unbypassable name allowlist may be made from this file alone.

## What this file does not grant

This delegation grants neither Commons semantic authority nor canonical-data
ownership nor Ω authority. It does not convert LLM output, a tool result, or a
chat report into evidence. All completion claims remain subject to the current
Durable Completion Gate and repository verification.