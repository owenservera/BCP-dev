# ChatGPT Fresh-Agent Session Protocol

> Version: FSSP-1.1
> Date: 2026-09-27
> Scope: every new ChatGPT web-app conversation launched as an independent BCP-dev agent session.
> Status: PROPOSED / Steward operating protocol
> Authority: process protocol only; not Ω law and not semantic authority.
> Operating model: `CHATGPT-AGENT-OPERATING-MODEL.md`

## 1. Purpose

A new ChatGPT conversation is an independent **agent session instance**.

The repository contains the durable agent identity, state and lessons. The launch prompt is the task envelope for this one session.

The governing pattern is:

```
FRESH CHAT
→ BIND SESSION IDENTITY
→ VERIFY CURRENT MAIN
→ ENTER AGENT HOME
→ LOAD SESSION-CONTEXT
→ LOAD IDENTITY / SEED
→ LOAD STATE
→ LOAD LESSONS (when present)
→ LOAD RELEVANT AUTHORITY / PEERS
→ VERIFY PREDECESSOR
→ EXECUTE TASK
→ VERIFY RESULT
→ PERSIST REQUIRED DURABLE CONTEXT
→ REPORT
```

## 2. Conversation-as-agent rule

The active ChatGPT conversation is the execution session.

Do not assume an external implementation agent exists.

If repository read/write capability is available, the session should perform the assigned work directly.

If a required capability is unavailable, report **BLOCKED** or **PARTIAL** with the exact limitation. Never invent a handoff, signature, commit, message ID, test result or repository change.

## 3. Durable source-of-truth hierarchy

Unless a more specific governing artifact says otherwise:

1. Ω ratified law.
2. BCP enforced state/vocabulary.
3. Current repository code/tests/evidence.
4. Current owner-aligned CFA identity and boundary artifacts.
5. Destination architecture/research.
6. Agent durable context and working artifacts.
7. Historical/archive material.

A prompt, chat transcript or conversation report does not outrank repository evidence.

## 4. Agent-home contract

A standing agent home is the durable operating memory of one role.

Expected structure:

```
SESSION-CONTEXT.md
CORE-AGENT.md            # or established AGENT.md
STATE.md
LESSONS.md               # when durable lessons exist
OWNER-ALIGNMENT-*.md     # when applicable
IDENTITY-HISTORY.md      # when applicable
task / research artifacts
```

### Artifact meanings

**SESSION-CONTEXT.md**
- fresh-session front door;
- small and pointer-heavy;
- navigation only, not authority.

**CORE-AGENT.md / AGENT.md**
- durable identity;
- enduring responsibility;
- ownership and non-ownership;
- invariant/boundary references;
- authority references.

**STATE.md**
- current operating frontier;
- current unresolved items;
- recent durable progress.

**LESSONS.md**
- compact, cross-session operational memory;
- only lessons that materially change future behavior;
- not a transcript archive and not semantic authority.

**Owner-alignment / identity history**
- governance and lineage records, when applicable.

## 5. SESSION-CONTEXT requirements

Each session context should state:

- CFA / role;
- human-readable identity;
- agent_id;
- identity status;
- canonical workspace;
- durable identity artifact;
- current STATE;
- LESSONS when present;
- owner-alignment/history when applicable;
- relevant peers;
- current mission/frontier;
- unresolved seams;
- navigation pointers.

A last-known baseline SHA may be recorded for orientation, but it is informational only. **It never replaces verification of the current `main` tip.**

## 6. Fresh-session load order

### A. Repository

Read:

- `/AGENTS.md`
- `/BUILD_CONTEXT.md` if present
- `/docs/CURRENT-CONTEXT.md` if present
- `/AGENTS_CONTEXT/README.md`

Resolve the current `main` tip.

### B. Own home

Read:

1. `SESSION-CONTEXT.md`
2. `CORE-AGENT.md` or established `AGENT.md`; otherwise the current seed/design artifact
3. `STATE.md`
4. `LESSONS.md` when present
5. latest alignment/history artifacts as applicable
6. task-specific artifacts named by the task envelope

### C. Relevant context

Load only the peers and Ω/destination authority needed for the current task.

Do not reconstruct the architecture indiscriminately.

## 7. Session identity

Every launch envelope should identify:

- `SESSION_ID`
- repository
- CFA / role
- identity
- agent_id
- workspace
- target branch/ref

Identity must be reconciled against repository evidence.

Never infer identity from:
- conversation title;
- Git author;
- branch name;
- user account;
- prior chat memory;
- folder name alone.

## 8. Boot receipt

Before substantive work, the session should establish:

```
SESSION_ID
IDENTITY
AGENT_ID
CURRENT_MAIN_SHA
IDENTITY_VERIFIED
PREDECESSOR_STATUS
```

This is a state check, not a semantic conclusion.

## 9. Verify predecessor claims

For every predecessor dependency:

```
reported SHA
→ verify on current main/ref
→ inspect expected artifact
→ validate expected semantic condition
→ continue only when satisfied
```

A report is a claim, not proof.

Do not silently skip a missing or contradictory predecessor.

## 10. Task envelope

The launch prompt is a **task envelope**, not durable memory.

It must contain:

- FSSP version/link;
- session identity;
- repository;
- workspace;
- target branch/ref;
- predecessor prerequisite when needed;
- read-first sequence;
- exact task;
- completion gate;
- non-actions;
- write/commit rule;
- report contract;
- STOP condition.

It should not copy the full architecture or repeat settled identity prose.

## 11. Owner dialogue

Owner dialogue is task-mode, not universal bootstrap.

Use it for:
- new identity/boundary alignment;
- unresolved owner policy;
- decisions repository evidence cannot determine.

Already-ratified identities are verified and reconciled, not repeatedly re-ratified.

## 12. Execution and write discipline

When writes are available:

- make only task-justified changes;
- preserve evidence and lineage;
- update durable context when future sessions need the information;
- verify changed files;
- commit to the specified branch/ref;
- report the exact resulting SHA.

For parallel sessions, use distinct write surfaces/branches where needed.

`main` is the shared synchronization point.

Never assume another session's uncommitted work exists.

## 13. Session result

A session produces:

1. repository evidence;
2. required durable state/lessons/history;
3. an exact commit/ref when changes occurred;
4. a completion report.

Do not create a transcript archive or session-log bureaucracy merely to preserve chats.

## 14. Failure states

Use the narrowest truthful status:

- `COMPLETE`
- `PARTIAL`
- `BLOCKED`
- `UNKNOWN`

A tool limitation is an environment fact.

A repository contradiction is a state/knowledge problem.

A missing owner decision is a governance stop.

Do not conflate them.

## 15. Commons discipline

Commons is communication state, not authority.

Only claim an operation when the available runtime/transport actually executed and its result is recoverable.

Never fabricate:
- identities;
- signatures;
- event IDs;
- message IDs;
- stream positions.

## 16. Completion report contract

Every substantive session returns:

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

Every value must be evidence-backed.

## 17. Handoff / next-session generation

When a report returns to the Architecture Steward or owner:

1. verify the reported commit/ref;
2. inspect the expected durable artifacts;
3. compare report to repository reality;
4. determine the next valid action;
5. generate a new task envelope from current repository truth;
6. include verified predecessor conditions;
7. do not repeat settled questions unless evidence changed them.

The next prompt is a **compiled task envelope**, not a transcript continuation.

## 18. Parallel conversation rule

Multiple sessions may coexist when:

- authority dependencies are independent;
- write surfaces do not conflict;
- their task envelopes make branch/ref ownership explicit.

Each session must:
- verify current main/ref;
- maintain its own identity;
- avoid assumptions about uncommitted peer work;
- communicate through durable repository artifacts or genuinely supported Commons operations.

## 19. Anti-context-wall rule

Do not solve context loss by making prompts larger.

Use progressive disclosure:

```
SESSION-CONTEXT
→ IDENTITY
→ STATE
→ LESSONS
→ RELEVANT PEERS / AUTHORITY
→ TASK
→ EVIDENCE AS NEEDED
```

## 20. Protocol evolution

Fix the smallest layer that caused the failure:

- local operating lesson → agent `LESSONS.md` / `SESSION-CONTEXT.md`;
- task-envelope failure → shared launch template;
- repeated cross-agent failure → FSSP;
- semantic ownership failure → CFA reconciliation;
- owner-intent change → owner dialogue.

Do not introduce infrastructure merely to make one session easier.

## 21. Architectural success condition

A fresh session must be able to determine, without prior chat history:

```
WHO AM I?
WHAT DO I OWN?
WHAT IS CURRENT?
WHAT HAVE I LEARNED?
WHAT IS THIS SESSION TASK?
WHAT MUST I NOT DO?
WHAT PROVES COMPLETION?
WHERE DO I STOP?
```

That is the cold-start contract.
