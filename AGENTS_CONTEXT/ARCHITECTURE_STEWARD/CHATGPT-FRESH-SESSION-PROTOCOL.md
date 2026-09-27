# ChatGPT Fresh-Agent Session Protocol

> Version: FSSP-1.0
> Date: 2026-09-27
> Scope: every new ChatGPT web-app conversation launched as an independent BCP-dev agent session.
> Status: PROPOSED / Steward operating protocol
> Authority: process protocol only; not Ω law and not semantic authority.

## 1. Purpose

A new ChatGPT conversation is treated as an independent agent session.

The conversation has no trusted memory of prior sessions. The repository is the durable source of truth.

A launch prompt is therefore not a substitute for agent context. It is a task envelope that points the new session to the durable context it must recover before acting.

The governing pattern is:

```
FRESH CHAT
→ IDENTIFY ASSIGNED AGENT
→ LOAD AGENT SESSION-CONTEXT
→ LOAD DURABLE IDENTITY / SEED
→ LOAD CURRENT STATE
→ LOAD OWNER ALIGNMENT + HISTORY
→ VERIFY CURRENT MAIN
→ LOAD RELEVANT PEERS / AUTHORITY
→ EXECUTE TASK
→ VERIFY RESULT IN REPOSITORY
→ COMMIT DURABLE STATE
→ RETURN MACHINE-CHECKABLE REPORT
```

## 2. Conversation-as-agent rule

The active ChatGPT conversation itself is the execution session.

Do not assume an external implementation agent exists.

If repository read/write capability is available in the ChatGPT session, the session should perform the assigned repository work directly.

If repository write or required execution capability is unavailable, report **BLOCKED** or **PARTIAL** with the exact limitation. Never invent a handoff, execution, signature, commit, message ID, test result or repository change.

## 3. Durable source-of-truth hierarchy

Use this order unless a more specific governing artifact says otherwise:

1. Ω ratified law.
2. BCP enforced state/vocabulary.
3. Current repository code/tests/evidence.
4. Current owner-aligned CFA identity and boundary artifacts.
5. Destination architecture/research.
6. Agent session context and working artifacts.
7. Historical/archive material.

The agent's local session context is a navigation aid, not authority.

## 4. Agent home convention

Every CFA home MUST expose a fresh-session front door:

```
SESSION-CONTEXT.md
```

When the CFA is ratified, it MUST also expose:

```
CORE-AGENT.md
```

When the CFA is provisional, use the existing seed/design artifact instead of manufacturing a CORE-AGENT.

The canonical relationship is:

```
SESSION-CONTEXT.md
  → CORE-AGENT.md        (if ratified)
  → BOOTSTRAP-SEED.md / CORE-AGENT-SEED.md / design proposal (if provisional)
  → STATE.md
  → OWNER-ALIGNMENT-*.md
  → IDENTITY-HISTORY.md
  → active task artifacts
```

`SESSION-CONTEXT.md` must remain small and pointer-heavy. It summarizes where to look; it must not become a second authority document.

## 5. Required SESSION-CONTEXT contents

Each CFA session context should state:

- CFA number;
- human-readable identity;
- agent_id;
- current identity status;
- canonical workspace path;
- durable identity artifact, if any;
- current STATE artifact;
- owner-alignment artifact;
- identity-history artifact;
- immediate relevant peer homes;
- current mission/task frontier;
- major unresolved UNKNOWN / CONFLICTED / DEFERRED items;
- last verified main commit;
- last updated date;
- explicit warning that the file is navigation context, not authority.

The file should point to canonical artifacts rather than copying long bodies of text.

## 6. Fresh-session load order

Before substantive action:

### A. Repository baseline

Read:

- `/AGENTS.md`
- `/BUILD_CONTEXT.md` if present
- `/docs/CURRENT-CONTEXT.md` if present
- `/AGENTS_CONTEXT/README.md`

Verify the current `main` tip.

### B. Agent home

Open the assigned CFA workspace from the launch prompt.

Read in this order:

1. `SESSION-CONTEXT.md`
2. `CORE-AGENT.md` if it exists; otherwise the current seed/design artifact
3. `STATE.md`
4. latest owner-alignment record, if any
5. identity history, if any
6. task-specific artifact named by the launch prompt

### C. Peer context

Load only the peers needed for the current task.

For boundary/ratification work, inspect the relevant peer CORE-AGENT identities and current CFA register/ownership map.

### D. Authority

Read the narrowest current Ω/destination authority needed to answer the task. Do not load the entire repository when the current evidence is sufficient.

## 7. Verify claims from prior sessions

A pasted completion report is evidence of what another conversation claimed, not repository truth.

For every predecessor dependency:

```
REPORTED SHA
→ VERIFY ON CURRENT MAIN
→ INSPECT EXPECTED ARTIFACT
→ ONLY THEN CONTINUE
```

Never accept “I completed it” as sufficient proof.

## 8. Identity discipline

The session must bind itself to the `agent_id` and workspace specified by the launch prompt and confirmed by repository evidence.

Never derive identity from:

- the ChatGPT conversation name;
- Git author name;
- branch name;
- user account;
- memory of a previous conversation;
- a folder name alone.

If current artifacts disagree about identity, preserve the contradiction and resolve it through the documented owner/boundary process.

## 9. Execution envelope

Every generated launch prompt should explicitly include:

- protocol version/link;
- repository;
- target CFA;
- agent_id;
- canonical workspace;
- predecessor prerequisite, when any;
- exact read-first sequence;
- current task;
- explicit completion gate;
- explicit STOP condition;
- write/commit rule;
- non-actions;
- common completion report format.

The prompt should be sufficient to bootstrap the session without copying the entire architecture into the new conversation.

## 10. Sequencing

A prompt may declare:

```
SERIAL
```

when predecessor state must be visible before the session begins.

When sessions can run independently, parallel execution is permitted only when their write surfaces do not conflict and no authority dependency is hidden.

For architecture ratification and boundary work, default to serial execution unless the controlling protocol explicitly permits parallelism.

## 11. Owner dialogue gate

When a task requires owner alignment:

```
SELF-DESIGN / EXISTING PROPOSAL
→ OWNER QUESTIONS
→ EXPLICIT OWNER DECISION
→ DURABLE ALIGNMENT
→ CORE-AGENT IDENTITY
```

Do not self-ratify.

Do not create `CORE-AGENT.md` before alignment.

Once an identity is already ratified, a fresh session verifies and reconciles rather than re-ratifying it.

## 12. Commit discipline

When repository writes are available:

- make only changes justified by the current task;
- preserve prior evidence and lineage;
- verify modified files before finishing;
- commit durable changes to the branch/ref specified by the task;
- report the exact resulting SHA.

Do not claim a commit exists until the repository confirms it.

## 13. Commons discipline

Commons is communication state, not authority.

Only claim a Commons operation when the actual available runtime/transport has executed and its result is recoverable.

If the ChatGPT session cannot perform the native operation, record the limitation exactly.

Never fabricate:

- identities;
- key material;
- signatures;
- event IDs;
- message IDs;
- stream positions.

## 14. Failure handling

A fresh session must use the narrowest honest state:

- `COMPLETE`
- `PARTIAL`
- `BLOCKED`
- `UNKNOWN`

Do not convert a capability/environment limitation into an architecture failure.

Do not silently continue past a missing predecessor when the task requires that predecessor.

## 15. Completion report contract

Every substantive session returns:

```
SESSION_STATUS:
CFA:
IDENTITY:
AGENT_ID:
BASE_MAIN_SHA:
PREDECESSOR_VERIFIED:
TASK:
RESULT:
FILES_CHANGED:
COMMIT_SHA:
OWNER_ALIGNMENT:
CORE_AGENT:
COMMONS:
UNRESOLVED:
BLOCKERS:
BOUNDARIES_ACTIVATED:
OMEGA_LAW_CHANGED:
IMPLEMENTATION_STARTED:
NEXT_REQUIRED_STEP:
```

Values must be evidence-backed.

## 16. Handoff / next-prompt generation

When the owner brings a completed report back to a later conversation:

1. verify the reported commit on current `main`;
2. inspect the changed durable artifacts;
3. compare actual state to the report;
4. determine the next task from the controlling sequence;
5. generate a new launch prompt using this protocol;
6. include the verified predecessor SHA or exact prerequisite condition;
7. do not repeat questions already settled unless repository evidence has changed them.

The next prompt is generated from **current repository truth**, not from the previous chat transcript alone.

## 17. Parallel conversation rule

Multiple fresh conversations may coexist.

Each conversation is an independent session and MUST:

- bind to one assigned CFA/agent identity;
- read its own durable session context;
- verify current main before acting;
- avoid assuming another conversation's uncommitted work exists;
- communicate only through durable repository artifacts / Commons where genuinely supported;
- treat the latest verified main state as the shared synchronization point.

## 18. Anti-context-wall rule

Do not solve context loss by copying more architecture into prompts.

Instead use progressive disclosure:

```
SESSION-CONTEXT
→ CORE-AGENT / SEED
→ STATE
→ RELEVANT PEERS
→ TASK ARTIFACT
→ EVIDENCE ONLY AS NEEDED
```

A launch prompt should point to durable context rather than becoming the durable context.

## 19. Protocol evolution

If the same fresh-session failure recurs across multiple sessions, change this protocol.

If the issue occurs only within one CFA, change that CFA's session context or task prompt.

If the issue is a peer-boundary ambiguity, use the boundary/reconciliation process.

Do not weaken the protocol merely to make one task easier.

## 20. First validated lesson

The 2026-09-27 CFA-01 session exposed a critical failure mode:

> A new ChatGPT conversation may incorrectly assume that repository work must be handed to an external implementation agent.

The correct rule is now explicit:

**The new ChatGPT conversation is the agent session. If the current ChatGPT environment can read/write the repository, it should execute the task itself.**

This protocol exists to make that assumption durable and automatic.

## 21. Steward design principle

The objective is not perfect memory.

The objective is:

```
independent session
+
durable identity
+
small local context
+
verified repository state
+
explicit task envelope
+
evidence-backed completion
```

That combination should make fresh conversations behave consistently even when the human launches many sessions over time.
