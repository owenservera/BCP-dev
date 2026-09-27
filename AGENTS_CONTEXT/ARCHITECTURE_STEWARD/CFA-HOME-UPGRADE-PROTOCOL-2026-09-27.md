# CFA Home Upgrade Protocol

> Version: 1.3
> Date: 2026-09-27
> Status: ACTIVE
> Scope: fresh ChatGPT sessions for CFA-01 through CFA-10 after ratified identity establishment.
> Governing protocol: FSSP-1.3
> Purpose: validate and improve each agent's durable home without repeating CFA birth/ratification.

## Stage boundary

This protocol governs **home maintenance only**. Completing this task establishes cold-startability and durable context; it does **not** establish the CFA's substantive work roadmap and does not authorize a downstream product cycle, P1 workstream, implementation task, or proof run.

The next distinct stage after home readiness is **CFA Domain Roadmap Formation**, governed by `CFA-DOMAIN-ROADMAP-FORMATION-PROTOCOL-2026-09-27.md`. A completed home-upgrade task must never be used as evidence that the CFA has already selected or accepted downstream work.

## Mission

Each CFA already has a ratified identity in the current repository.

The fresh session is **not a bootstrap/birth session**.

It is a home-maintenance and cold-start validation session:

```
VERIFY CURRENT IDENTITY
→ LOAD HOME
→ CHECK OPERATING MODEL
→ CHECK SESSION-CONTEXT
→ CHECK STATE
→ CHECK LESSONS
→ CHECK ALIGNMENT/HISTORY
→ RECONCILE AGENT-SPECIFIC GAPS
→ PERSIST DURABLE IMPROVEMENTS
→ VERIFY
→ COMMIT
→ REPORT
```

## Mandatory first read

1. `/AGENTS.md`
2. `/BUILD_CONTEXT.md`
3. `/docs/CURRENT-CONTEXT.md`
4. `/AGENTS_CONTEXT/README.md`
5. `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/CHATGPT-AGENT-OPERATING-MODEL.md`
6. `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/CHATGPT-FRESH-SESSION-PROTOCOL.md`
7. the assigned CFA's `SESSION-CONTEXT.md`
8. the assigned CFA's durable identity (`CORE-AGENT.md` or established `AGENT.md`)
9. the assigned CFA's `STATE.md`
10. the assigned CFA's `LESSONS.md`
11. current alignment/history artifacts as applicable

## Persistent task queue

Each CFA home must contain `TASKS.md`. The home-upgrade session must read it, reconcile the seeded home-upgrade task against current repository truth, update its status as work progresses, and leave the next actionable state durable before stopping.

The session must also persist its completion report in `RESULTS/<SESSION_ID>.md` before marking the task complete. Follow `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SESSION-RESULT-CONTRACT.md`.

`TASKS.md` is the agent's work queue, not semantic authority or proof of dependency.

## Required validation

The session must establish:

- current `main` SHA;
- assigned CFA identity;
- agent_id;
- workspace;
- ratification status;
- current semantic mission;
- current boundaries;
- current unresolved items;
- whether the session context points to the correct durable artifacts;
- whether the recorded baseline SHA is clearly informational rather than a gate;
- whether `TASKS.md` represents the durable work frontier separately from state, lessons, and authority;
- whether lessons are separate from state and authority;
- whether stale or superseded launch material can mislead a fresh session.

## Upgrade rule

Change only what is justified by the assigned CFA's own repository evidence.

Typical valid changes:

- correct stale front-door pointers;
- make current mission/frontier more navigable;
- record an actually observed agent-specific lesson;
- clarify local non-scope/boundaries;
- preserve useful predecessor/history links;
- remove ambiguity between active and superseded instructions.

Do not rewrite settled semantic authority merely to make the home look consistent.

## Do not repeat bootstrap

Because the CFA is already ratified:

- do not self-ratify;
- do not repeat Owner Dialogue unless a genuine new owner decision is required;
- do not create a second identity artifact;
- do not replace an established `AGENT.md` with a duplicate `CORE-AGENT.md`;
- do not activate shared boundaries;
- do not change Ω law;
- do not begin unrelated implementation;
- do not create another registry, task manager, memory database, evidence store or ontology.

## Lesson rule

`LESSONS.md` is compact operational memory.

Only record a lesson when it is:

- behavior-changing for future sessions;
- reusable beyond the current moment;
- supported by evidence or a verified repository event.

Do not turn the file into a transcript.

## Completion gate

The session is complete only when:

1. current identity and boundaries are verified;
2. the home can bootstrap a future fresh session without prior chat history;
3. agent-specific corrections, if any, are persisted;
4. lessons are updated only when warranted;
5. changed files are verified;
6. an exact session result receipt exists at `RESULTS/<SESSION_ID>.md`;
7. the receipt and durable changes are contained in a verifiable commit/ref;
8. `TASKS.md` marks the home-upgrade task `DONE` (or a truthful blocked/partial state);
9. the session returns the FSSP-1.3 completion report.

## Report

Use `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SESSION-RESULT-CONTRACT.md` v1.1 as the sole report schema. Output its fields exactly in the defined order; do not add, remove, or reorder fields.

## Stop condition

After completing the home upgrade and report, STOP.

Do not proceed into the next CFA unless the owner's launch sequence explicitly assigns it.


## Handoff after completion

After the completion receipt is verified, stop this task. The owner/Steward should route the CFA to the separate domain-roadmap formation stage rather than selecting substantive work from this home-upgrade result.
