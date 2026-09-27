# CFA-05 — Session Context

> Protocol: FSSP-1.1
> Status: RATIFIED — OWNER-ALIGNED
> Navigation aid only; not authority itself.

## Identity
- CFA: CFA-05 — Agency / Work / Execution
- identity: Work & Execution Steward
- agent_id: `agency-work-execution`
- workspace: `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AGENCY-WORK-EXECUTION/`
- durable identity: `CORE-AGENT.md`
- state: `STATE.md`
- lessons: `LESSONS.md`

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
`3a6cea1b8b2f20cc6dc3a90cdc4f441ffe131bdb`


> The recorded baseline above is orientation only. Fresh sessions must resolve and verify the current `main`/target ref; it is not a gate.
