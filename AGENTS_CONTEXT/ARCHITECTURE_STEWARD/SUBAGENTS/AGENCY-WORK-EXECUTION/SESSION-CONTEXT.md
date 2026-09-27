# CFA-05 — Session Context

> Protocol: FSSP-1.3
> Status: RATIFIED — OWNER-ALIGNED
> Navigation aid only; not authority itself.

## Current strategic planning assignment

This CFA completed **CFA Strategic Roadmap Round 1 — Independent Parallel Planning** in the current first-pass session and is awaiting Architecture Steward cross-CFA reconciliation.

Follow the shared protocol:
`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/CFA-DOMAIN-ROADMAP-FORMATION-PROTOCOL-2026-09-27.md`

The completed strategic roadmap and the first bounded M1 task are recorded in `TASKS.md`. Do not infer the substantive roadmap from an archived launch sequence, destination cycle, P1 workstream, or another CFA's new Round-1 result.

This front-door assignment does not prescribe the roadmap's conclusions. The CFA must independently determine its own milestones, success criteria, dependencies, tooling, design gates, and milestone-specific peer-intelligence needs.

## Fresh-session front door

- Start here: `SESSION-CONTEXT.md`.
- Then read: `CORE-AGENT.md` → `STATE.md` → `TASKS.md` → `LESSONS.md` when present.
- Receipt index: `RECEIPTS.md`.
- Owner alignment/history: `OWNER-ALIGNMENT-2026-09-27.md` → `IDENTITY-HISTORY.md`.

## Identity
- CFA: CFA-05 — Agency / Work / Execution
- identity: Work & Execution Steward
- agent_id: `agency-work-execution`
- workspace: `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AGENCY-WORK-EXECUTION/`
- durable identity: `CORE-AGENT.md`
- state: `STATE.md`
- lessons: `LESSONS.md`

## Roadmap output
- `DOMAIN-ROADMAP-2026-09-27.md` — full local strategic roadmap, independent Round-1 first pass.
- First bounded work: `WORK-M1-CANONICAL-WORK-ENVELOPE-2026-09-27` in `TASKS.md`.

## Mission
Durable Work lifecycle from executable Plan snapshot through governed attempts, waits/retries, recovery/reconciliation, verification, Outcome and evidence linkage.

## Key boundaries
CFA-03 owns Intent/Plan meaning; CFA-04 live authority; CFA-06 realization; CFA-02 durable storage; CFA-09 change compatibility; CFA-10 runtime enforcement.

## Core falsifier
Kill the worker between external execution and recording. Restart must not blindly duplicate an uncertain external effect.

- persistent tasks: `TASKS.md` — durable unfinished-work and next-action queue

## Fresh-session rule
Verify current main and relevant peer identities before substantive work.

## Last verified baseline
`e29cd3068d67ce273a869bdc390afc8f45a12243`


> The recorded baseline above is orientation only. Fresh sessions must resolve and verify the current `main`/target ref; it is not a gate.
