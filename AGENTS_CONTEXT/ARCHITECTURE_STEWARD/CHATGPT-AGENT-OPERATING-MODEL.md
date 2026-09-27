# ChatGPT Agent Operating Model

> Version: 1.0
> Date: 2026-09-27
> Status: STEWARD DECISION / PROPOSED OPERATING STANDARD
> Scope: independent ChatGPT web-app conversations acting as BCP-dev agents.
> Authority: derived process architecture; not Ω law and not semantic authority.

## 1. Architectural decision

A ChatGPT conversation is an **agent session instance**.

The repository contains the durable definition and memory of the agent. The launch prompt contains only the task-specific execution envelope.

These are deliberately separate:

```
AGENT HOME
  ├── IDENTITY
  ├── SESSION CONTEXT
  ├── CURRENT STATE
  ├── DURABLE LESSONS
  └── GOVERNANCE / HISTORY

FRESH CHAT
  └── TASK ENVELOPE
       └── runs against the current repository state

SESSION RESULT
  └── evidence + durable repository changes + completion report
```

The central rule is:

> **Prompt is not memory. Memory is not authority. State is not identity. A session result is not true until the repository verifies it.**

## 2. The four required layers

### Layer A — Durable identity

The agent's identity answers:

- who am I?
- what enduring responsibility do I own?
- what do I not own?
- what boundaries must I preserve?
- which authority sources govern my conclusions?

Canonical artifact:

- `CORE-AGENT.md` for ratified agents;
- an established `AGENT.md` when that is the ratified legacy convention;
- a seed/design artifact for provisional agents.

Identity must be small, durable and slow-changing.

### Layer B — Session front door

`SESSION-CONTEXT.md` is the fresh-session navigation layer.

It answers:

- where is my home?
- what is my identity artifact?
- what current state should I read?
- what lessons exist?
- which peers matter?
- what is the current frontier?
- where are the unresolved seams?

It is **not authority** and must not become a second architecture document.

It may contain a last-known baseline for orientation, but that value is informational only. A fresh session must independently resolve the current `main` tip.

### Layer C — Durable operational memory

`STATE.md` answers:

> What is currently true about this agent's work frontier?

`LESSONS.md`, when present, answers:

> What repeatable lesson has this agent learned that should change how future sessions operate?

Lessons are not chat transcripts and not a dumping ground for every observation.

A lesson earns durable status only when it is:
- repeated or materially important;
- useful across sessions;
- specific enough to alter behavior;
- attributable to evidence or a verified repository event.

Historical lesson narratives may remain separately dated; `LESSONS.md` is the compact operational memory.

### Layer D — Task envelope

The launch prompt is the **task envelope for one session**.

It contains:
- session identity;
- repository;
- assigned agent/CFA;
- workspace;
- task;
- predecessor prerequisite, if any;
- required read-first paths;
- completion gate;
- non-actions;
- write/branch rule;
- report contract;
- STOP condition.

It must not carry the entire architecture, duplicate identity, or become the only copy of settled knowledge.

## 3. Agent-home standard

A standing agent home should converge on:

```
<AGENT-HOME>/
  SESSION-CONTEXT.md
  CORE-AGENT.md            # or established AGENT.md
  STATE.md
  LESSONS.md               # create when durable lessons exist
  OWNER-ALIGNMENT-*.md     # when applicable
  IDENTITY-HISTORY.md      # when applicable
  <task / research artifacts>
```

The order is functional, not cosmetic.

A fresh session enters through `SESSION-CONTEXT.md`, then follows pointers.

## 4. Fresh-session boot

The fresh session performs this deterministic sequence:

```
1. Bind session identity from the launch envelope.
2. Resolve current main tip.
3. Read repository-wide working agreements.
4. Enter own agent home.
5. Read SESSION-CONTEXT.
6. Read durable identity/seed.
7. Read STATE.
8. Read LESSONS when present.
9. Read only relevant alignment/history/peer context.
10. Verify predecessor prerequisites.
11. Read the task envelope's specific task.
12. Execute.
13. Verify the result against repository evidence.
14. Persist required durable state.
15. Return the machine-checkable completion report.
```

The session does not need the previous conversation transcript.

## 5. Identity verification

A session may not infer identity from the prompt alone.

It must reconcile:

```
prompt identity
↔ session context
↔ durable identity
↔ current register / repository evidence
```

If they disagree, the disagreement is preserved and resolved through the relevant owner/boundary process.

A ratified identity is verified, not re-ratified.

## 6. Predecessors

A predecessor dependency is never just a sentence such as "CFA-01 is done."

The task envelope should specify, where applicable:

```
PREDECESSOR:
  expected commit SHA
  expected artifact(s)
  expected semantic condition
```

The fresh session verifies all three where relevant.

A matching SHA without the expected artifact or semantic condition is insufficient.

## 7. Parallel sessions

Parallel conversations are allowed only when:

- authority dependencies are independent;
- write surfaces do not conflict;
- the task envelope specifies a distinct branch/ref when necessary.

`main` is the synchronization point.

No session may assume uncommitted work from another conversation exists.

For serialized owner alignment or shared-state mutations, the controlling launch sequence decides the order.

## 8. Steward's role

The Architecture Steward is the **session-envelope compiler and coherence owner**, not a central runtime scheduler.

When the owner returns a session report, the Steward:

```
REPORT
→ VERIFY REPOSITORY
→ CLASSIFY RESULT
→ UPDATE DURABLE CONTEXT
→ DETERMINE NEXT VALID ACTION
→ GENERATE NEXT TASK ENVELOPE
```

The Steward does not merely copy the previous report into the next prompt.

The next prompt is generated from verified repository state.

## 9. Session-result architecture

A session result has four distinct outputs:

1. **Repository evidence** — what changed and what proves it.
2. **Durable context** — state/lessons/alignment/history that future sessions need.
3. **Commit/ref** — the exact durable synchronization point.
4. **Completion report** — a compact claim about the session, always subject to repository verification.

A chat report may be returned without becoming a permanent document when no durable context is needed.

Do not create a session-log bureaucracy merely to archive conversations.

## 10. Failure states

Use the narrowest truthful status:

- `COMPLETE`
- `PARTIAL`
- `BLOCKED`
- `UNKNOWN`

A missing tool capability is an environment fact.

A repository contradiction is a knowledge/state problem.

A missing owner decision is a governance stop.

These must not be conflated.

## 11. Owner dialogue

Owner dialogue is a **task-mode**, not a universal bootstrap step.

Use it when:
- identity/boundary is being established;
- owner policy is genuinely unresolved;
- repository evidence cannot determine the decision.

Do not force owner dialogue into ordinary implementation/research sessions whose task and authority are already settled.

## 12. Anti-bloat rules

Do not create:

- a second agent registry;
- a universal memory database;
- a transcript archive;
- a parallel task manager;
- another ontology;
- another evidence store;
- a graph database;
- a generic coordinator runtime.

Add machinery only when recurring real work proves that a current layer cannot express or enforce the requirement.

## 13. Evolution rule

When a fresh-session failure repeats:

- agent-specific failure → fix that agent's `SESSION-CONTEXT` / `LESSONS.md`;
- task-envelope failure → fix the shared launch template;
- cross-agent failure → fix the shared protocol;
- semantic boundary failure → use CFA reconciliation;
- owner-intent change → use owner dialogue.

This keeps process changes at the smallest valid scope.

## 14. Architectural success condition

The operating model succeeds when a fresh session can answer, without prior chat history:

```
WHO AM I?
WHAT DO I OWN?
WHAT IS CURRENT?
WHAT HAVE I LEARNED?
WHAT IS MY TASK?
WHAT MUST I NOT DO?
WHAT PROVES COMPLETION?
WHERE DO I STOP?
```

That is the cold-start contract.

