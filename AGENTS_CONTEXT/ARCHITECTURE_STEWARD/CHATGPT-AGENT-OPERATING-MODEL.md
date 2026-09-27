# ChatGPT Agent Operating Model

> Version: 1.1
> Date: 2026-09-27
> Status: STEWARD DECISION / PROPOSED OPERATING STANDARD
> Scope: independent ChatGPT web-app conversations acting as BCP-dev agents.
> Authority: derived process architecture; not Ω law and not semantic authority.

## 1. Architectural decision

A ChatGPT conversation is an **agent session instance**.

The repository contains the durable definition and memory of the agent. The launch prompt contains only the task-specific execution envelope.

**Instructions are constraints, not a substitute for agent judgment.** A documented sequence, checklist, predecessor label, or suggested next step is evidence to assess; it is not automatically proof that the work must be performed literally or serially.

For every non-trivial task, the agent must first determine the actual execution strategy from repository evidence, including dependencies, authority boundaries, write surfaces, risk, and synchronization requirements. The agent may choose a safer or more efficient strategy than the prompt's illustrative sequence when that strategy preserves the governing constraints.

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

The fresh session performs this deterministic boot sequence:

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
12. Assess execution strategy.
13. Execute the chosen strategy.
14. Verify the result against repository evidence.
15. Persist required durable state.
16. Return the machine-checkable completion report.
```

The session does not need the previous conversation transcript.

### Repository-access and tool-selection gate

Before reading repository content, determine whether connected GitHub integration/access is available.

**Preferred path:** connected GitHub access for current files, refs/SHAs, branches, commits, verification, and writes.

**Web search:** external research/corroboration, or repository fallback only when direct GitHub access is genuinely unavailable.

A supplied GitHub URL is not a reason to switch to general web search. The connected repository is the authoritative access path for current repository state.

Do not claim repository access is unavailable until the connected capability has been checked.

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

## 7. Autonomous execution-strategy assessment

Before choosing how to execute any non-trivial task, the agent must inspect the actual work graph rather than inherit an execution order uncritically.

Assess at minimum:

1. **Semantic dependencies** — does one work unit change meaning required by another?
2. **Authority dependencies** — does one unit require a prior ratification, permission, or governance result?
3. **Read/predecessor dependencies** — does one unit require a verified artifact or state produced by another?
4. **Write-surface conflicts** — can two units safely modify the same durable artifacts?
5. **Synchronization constraints** — where must work converge or be revalidated?
6. **Verification dependencies** — can completion be proven independently, or only after another result exists?
7. **Risk boundaries** — would parallelism increase the chance of irreversible or authority-crossing damage?

Classify the work as **INDEPENDENT**, **ORDERED**, **CONDITIONALLY DEPENDENT**, or **BLOCKED**.

Then choose the narrowest execution strategy that preserves the repository's governing constraints:

- independent work → prefer safe parallelism;
- true dependency → serialize only the dependent portion;
- conditional dependency → establish the condition, then branch execution accordingly;
- blocked work → stop at the blocker rather than manufacturing progress.

A documented sequence, "required order," launch queue, checklist, or prior agent recommendation is **not itself evidence of dependency**. Historical order may be useful context, but the current repository determines the present dependency graph.

Distinguish architectural dependency from operational transport constraints. For example, two independent edits may still contend for a shared branch/ref without becoming semantically dependent.

When the chosen strategy materially differs from the supplied sequence, state the reason in the session report. When the task is obviously independent and low-risk, the assessment can be concise.

The agent must not create unnecessary work merely to satisfy a prescribed sequence. A healthy target may legitimately require **no changes**.

## 8. Parallel sessions

Parallel conversations are allowed when the execution-strategy assessment establishes that they are independent and their write/authority boundaries are compatible.

Where shared mutable artifacts or authority decisions exist, serialize only those portions that truly depend on one another.

`main` is the synchronization point.

No session may assume uncommitted work from another conversation exists.

For shared-state mutations, the controlling process may impose additional ordering, but that ordering remains subject to verification against actual repository dependencies.

## 9. Steward's role

The Architecture Steward is the **session-envelope compiler and coherence owner**, not a central runtime scheduler.

When the owner returns a session report, the Steward:

```
REPORT
→ VERIFY REPOSITORY
→ CLASSIFY RESULT
→ REASSESS CURRENT DEPENDENCIES
→ UPDATE DURABLE CONTEXT
→ DETERMINE NEXT VALID ACTION / EXECUTION STRATEGY
→ GENERATE NEXT TASK ENVELOPE(S)
```

The Steward does not merely copy the previous report into the next prompt.

The next prompt is generated from verified repository state.

When the next action belongs to the human owner (for example, launching independent fresh sessions), the Steward must compile a concrete owner action package rather than merely naming the work. That package should contain direct links, exact launch text, genuine prerequisites, execution strategy, and stop/report conditions.

## 10. Session-result architecture

A session result has four distinct outputs:

1. **Repository evidence** — what changed and what proves it.
2. **Durable context** — state/lessons/alignment/history that future sessions need.
3. **Commit/ref** — the exact durable synchronization point.
4. **Completion report** — a compact claim about the session, always subject to repository verification.

A chat report may be returned without becoming a permanent document when no durable context is needed.

Do not create a session-log bureaucracy merely to archive conversations.

## 11. Failure states

Use the narrowest truthful status:

- `COMPLETE`
- `PARTIAL`
- `BLOCKED`
- `UNKNOWN`

A missing tool capability is an environment fact.

A repository contradiction is a knowledge/state problem.

A missing owner decision is a governance stop.

These must not be conflated.

## 12. Owner dialogue

Owner dialogue is a **task-mode**, not a universal bootstrap step.

Use it when:
- identity/boundary is being established;
- owner policy is genuinely unresolved;
- repository evidence cannot determine the decision.

Do not force owner dialogue into ordinary implementation/research sessions whose task and authority are already settled.

## 13. Anti-bloat rules

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

## 14. Evolution rule

When a fresh-session failure repeats:

- agent-specific failure → fix that agent's `SESSION-CONTEXT` / `LESSONS.md`;
- task-envelope failure → fix the shared launch template;
- cross-agent failure → fix the shared protocol;
- semantic boundary failure → use CFA reconciliation;
- owner-intent change → use owner dialogue.

This keeps process changes at the smallest valid scope.

## 15. Architectural success condition

The operating model succeeds when a fresh session can answer, without prior chat history:

```
WHO AM I?
WHAT DO I OWN?
WHAT IS CURRENT?
WHAT HAVE I LEARNED?
WHAT IS MY TASK?
WHAT MUST I NOT DO?
WHAT PROVES COMPLETION?
WHAT IS THE ACTUAL DEPENDENCY / EXECUTION STRATEGY?
WHERE DO I STOP?
```

That is the cold-start contract.
