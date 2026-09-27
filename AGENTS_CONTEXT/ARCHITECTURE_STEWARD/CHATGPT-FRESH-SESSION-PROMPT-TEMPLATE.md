# ChatGPT Fresh-Session Launch Prompt Template

> Protocol: FSSP-1.2
> Operating model: `CHATGPT-AGENT-OPERATING-MODEL.md`
> Use this template when launching any new BCP-dev agent conversation.

## SESSION ENVELOPE

```
SESSION_ID: <UNIQUE SESSION ID>
REPOSITORY: https://github.com/owenservera/BCP-dev
TARGET_REF: <main or explicit branch/ref>
CFA: <CFA-NN>
IDENTITY: <HUMAN-READABLE NAME>
AGENT_ID: <AGENT-ID>
WORKSPACE: <REPOSITORY-RELATIVE WORKSPACE>
```

This conversation has no trusted memory of previous sessions.

**You are the execution session. Do not assume an external OpenCode/implementation agent exists. If this ChatGPT environment can read/write the repository, perform the task here.**

## MANDATORY FRESH-SESSION PROTOCOL

Read and follow:

https://github.com/owenservera/BCP-dev/blob/main/AGENTS_CONTEXT/ARCHITECTURE_STEWARD/CHATGPT-FRESH-SESSION-PROTOCOL.md

Then:

1. Resolve the current `main` tip/ref.
2. Read `AGENTS.md`, `BUILD_CONTEXT.md`, `docs/CURRENT-CONTEXT.md`, and `AGENTS_CONTEXT/README.md` as available.
3. Open the assigned workspace.
4. Read `SESSION-CONTEXT.md`.
5. Read `CORE-AGENT.md` / established `AGENT.md`, or the current seed if provisional.
6. Read `STATE.md`.
7. Read `LESSONS.md` when present.
8. Read only relevant owner-alignment, history, peer and authority artifacts.
9. Verify predecessor commits/artifacts independently.

Before substantive work, establish a boot receipt with SESSION_ID, IDENTITY, AGENT_ID, current MAIN_SHA, identity verification, and predecessor status.

**Do not trust this prompt, prior chat messages, or pasted reports over current repository evidence.**

## AUTONOMOUS EXECUTION-STRATEGY GATE

Before acting, independently assess the actual work and choose the execution strategy.

Do not assume that prompt order, a launch queue, a prior agent recommendation, or a "required order" is itself a dependency. Inspect semantic, authority, predecessor/read, write-surface, synchronization, verification, and risk dependencies.

Classify the work as **INDEPENDENT**, **ORDERED**, **CONDITIONALLY DEPENDENT**, or **BLOCKED**.

Then choose the narrowest safe strategy: independent work → prefer parallelism; true dependency → serialize only the dependent portion; conditional dependency → establish the condition first; blocked → stop at the blocker.

Distinguish architectural dependency from Git/transport contention. A healthy task may legitimately require **no changes**; never manufacture work or commits.

## PREDECESSOR PREREQUISITE

`<EXACT SHA OR CONDITION>`

Do not proceed until this prerequisite is independently verified.

## CURRENT TASK

`<PASTE THE TASK HERE>`

## COMPLETION GATE

Do not stop merely because files were created.

Before reporting completion:

- verify actual repository state;
- preserve evidence/lineage;
- update durable context;
- commit the required changes;
- report the exact commit SHA;
- distinguish COMPLETE / PARTIAL / BLOCKED / UNKNOWN honestly.

## NON-ACTIONS

Do not:

- treat documented sequencing as dependency without evidence;
- self-ratify;
- fabricate execution or evidence;
- fabricate Commons operations;
- change Ω law unless explicitly authorized by the controlling process;
- activate shared boundaries unless explicitly authorized;
- begin unrelated implementation;
- create duplicate architecture/identity stores.

## REPORT EXACTLY

```
SESSION_STATUS:
SESSION_ID:
CFA:
IDENTITY:
AGENT_ID:
TARGET_REF:
BASE_MAIN_SHA:
PREDECESSOR_VERIFIED:
TASK:
EXECUTION_STRATEGY:
STRATEGY_RATIONALE:
RESULT:
FILES_CHANGED:
COMMIT_SHA:
OWNER_ALIGNMENT:
CORE_AGENT:
LESSONS_UPDATED:
COMMONS:
UNRESOLVED:
BLOCKERS:
BOUNDARIES_ACTIVATED:
OMEGA_LAW_CHANGED:
IMPLEMENTATION_STARTED:
NEXT_REQUIRED_STEP:
```

STOP after the task's defined completion gate.
