---
directive_id: DIR-003
kind: OWNER-DIRECTIVE
from: owner
to: IMPL-04
workstream: WS-001
issued: 2026-09-24
repository_tip: dad6383
status: OPEN
---

# Build P1-01 Turn-Continuity / Conversation-Recovery Hardening

## Objective

Extend the proven WS-001 cooperative-agent substrate so that conversation loss, context-window exhaustion, process restart, or an interrupted agent turn does not require the owner or another participant to reconstruct the task from chat history.

The repository must become the durable recovery surface for an active workstream agent at every turn.

This is a P1-01 continuity-hardening slice. It is not P1-02 and it does not authorize any P1-02..P1-09 implementation.

The desired property is:

> A fresh authorized participant can take over an active workstream task after the originating conversation disappears and continue from the repository's latest durable checkpoint without asking for the lost conversation.

## Required reads

Read in this order before acting:

1. /AGENTS.md
2. /BUILD_CONTEXT.md
3. /docs/CURRENT-CONTEXT.md
4. /docs/agent-system/CHATGPT-BOOT.md
5. /docs/agent-system/SYSTEM.md
6. /docs/agent-system/CURRENT.md
7. /docs/agent-system/CONTEXT-INDEX.md
8. /docs/agent-system/P1-WORKSTREAM-PORTFOLIO.md
9. /docs/agent-system/WORKSTREAMS.md
10. /docs/agent-system/ROSTER.md
11. /docs/agent-system/FALSIFIERS.md
12. /docs/agent-system/ENVELOPE.md
13. /docs/agent-system/workstreams/README.md
14. /docs/agent-system/workstreams/WS-001/README.md
15. /docs/agent-system/handoffs/README.md
16. /docs/agent-system/packets/README.md
17. /docs/agent-system/transcripts/README.md
18. /docs/agent-system/sessions/README.md
19. /docs/agent-system/directives/IMPL-02/DIRECTIVE-001-finish-p1-01.md
20. /docs/agent-system/directives/IMPL-02/DIRECTIVE-002-close-p1-01-proof-gaps.md
21. the latest WS-001 handoff/packet evidence and current ROSTER row
22. BCP agent continuity references: bcp-speed/bcp/agents/bootstrap.md, bcp-speed/bcp/agents/MY-LOOP.md, bcp-speed/bcp/agents/coordinator.md
23. Ω session/agent/context authorities named by CURRENT and SYSTEM, including omega-baseline/omega-final/AGENTS.md, omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md, and the D-430 session-ledger and D-443 context-substrate records if present.
24. Inspect the current local working tree and current branch before changing it.

## Repository-truth findings that motivate this task

The repository already has durable transcripts, packets, handoffs, envelopes, sessions pointers, a coordinator-owned CURRENT/WORKSTREAMS/ROSTER, a durable owner/coordinator directive channel, an Ω session ledger, and a BCP-side periodic checkpoint/heartbeat pattern.

However these are not yet one explicit per-turn recovery contract for a workstream agent.

In particular:
- handoffs are intended for meaningful transfer/close, not every turn;
- CURRENT is coordinator-owned and intentionally small;
- session pointers are a pointer layer, not the ledger;
- directives transport work but do not record the agent's current execution position;
- a fresh agent can recover a completed handoff, but an interrupted active turn still depends too much on conversational or worktree state.

Do not solve this by creating a second session ledger, second provenance system, or hidden memory database.

## Required work

### 1. Define the turn-continuity contract

Create a durable protocol document under docs/agent-system/, using a clear name such as TURN-CONTINUITY.md.

It must define:
- what a turn means operationally;
- turn OPEN / WORK / CHECKPOINT / CLOSE semantics;
- mandatory pre-action bootstrap;
- mandatory checkpoint conditions;
- what must be durable before an agent ends a turn;
- what may remain only in the local worktree;
- how a fresh agent resumes an interrupted turn;
- distinction between checkpoint state, handoff, packet, transcript, directive, CURRENT, and Ω session ledger;
- how branch/worktree identity participates in recovery;
- how repository-tip mismatch is handled;
- how stale checkpoints are detected;
- how conflicts between directive, checkpoint, CURRENT, handoff, and code are surfaced without guessing;
- how completion and closure retire the checkpoint;
- how to recover when the previous agent left uncommitted work;
- explicit rule that essential continuation context may not exist only in chat.

### 2. Define a per-agent current checkpoint

Create the smallest sensible repository-native location, preferably:

docs/agent-system/checkpoints/<agent-id>/CURRENT.md

The checkpoint is mutable current execution state, not law and not historical evidence.

It should be sufficient for a fresh authorized participant to answer:
- Who am I acting as?
- What workstream/task am I on?
- Which directive authorizes the work?
- Which branch/worktree am I using?
- What repository commit did I last durably inspect?
- What has definitely been completed?
- What is currently in progress?
- What is the exact next action?
- What files are modified/uncommitted?
- What tests/checks have run?
- What evidence has been deposited?
- What decisions are in force?
- What is unresolved?
- What must NOT be done?
- How exactly should the next agent resume?

Use explicit statuses, for example READY, IN_PROGRESS, BLOCKED, AWAITING_COORDINATOR, DONE, but choose the final vocabulary only after checking existing repository conventions.

Do not turn this into a second canonical project-state registry.

### 3. Establish durability cadence

The protocol must require a checkpoint:
- before the first substantive action;
- after each material unit of work;
- before any turn-ending response after substantive work;
- immediately before declaring a task blocked;
- immediately before handing work to another participant;
- immediately before marking a task done.

For each checkpoint, record enough information to reconstruct the execution position without the conversation.

A checkpoint should be committed to the agent's task branch.

If material implementation changes remain uncommitted, the checkpoint MUST say so explicitly and record git status, changed paths, whether the changes are intended to survive, the exact next step, and any reproducible patch/diff reference that can safely be retained.

Do not pretend an uncommitted worktree is durable repository state.

### 4. Make recovery deterministic

Add a concise recovery procedure that a fresh agent can follow:

1. bootstrap repository authority;
2. discover the active task/directive;
3. locate that agent's checkpoint;
4. verify checkpoint branch/repository tip against Git;
5. inspect worktree status;
6. read any linked handoff/packet;
7. continue from CHECKPOINT.next_action;
8. do not repeat CHECKPOINT.completed work unless evidence shows it is invalid;
9. emit a new checkpoint before acting materially;
10. create a handoff only when a real transfer/close requires it.

The procedure must be usable after ChatGPT conversation loss, local coding-agent conversation loss, process crash/restart, context-window compaction, and owner absence.

### 5. Integrate into the existing protocol

Amend, rather than duplicate, the relevant parts of:
- docs/agent-system/SYSTEM.md
- docs/agent-system/CHATGPT-BOOT.md
- docs/agent-system/workstreams/README.md

The amendments should make the turn-continuity protocol part of normal workstream bootstrap and operation.

Keep the existing ownership model: coordinator/owner still owns CURRENT/WORKSTREAMS/ROSTER integration; agents still use handoff + outbox for coordinator-owned changes; Ω law remains authoritative; BCP state remains tool-governed.

Do not rewrite old transcripts, packets, or handoffs.

### 6. Add a recovery falsifier

Add a new P1-01 falsifier to docs/agent-system/FALSIFIERS.md, clearly separated from the already PROVEN falsifiers.

The falsifier should test the new property:

conversation/turn loss recovery

Example condition:
- Agent A performs a bounded task;
- Agent A leaves a durable checkpoint at a deliberate interruption point;
- Agent A's conversation is considered gone;
- Agent B, starting with only repository bootstrap + checkpoint + linked evidence, must identify the same work position and continue from the checkpoint without requiring the original chat.

Do not claim this new falsifier is PROVEN merely because the protocol was written.

### 7. Build a small mechanical validator/test

Where practical, add one lightweight repository-native checker or test that validates checkpoint structure and detects at least:
- missing mandatory fields;
- nonexistent linked directive/branch/workstream;
- impossible terminal/current state combinations;
- branch/tip mismatch requiring attention;
- checkpoint claiming no uncommitted work when git status proves otherwise, where that can be checked safely.

Prefer standard-library/simple tooling over new dependencies.

Do not create a large database, ontology, vector store, or daemon.

### 8. Exercise the protocol once

Perform one bounded self-test of the continuity mechanism.

The test must simulate an interruption at a meaningful point, then recover using the durable checkpoint rather than conversational memory.

The self-test must leave evidence of:
- original checkpoint;
- interruption point;
- recovery participant;
- recovery inputs;
- exact resumed action;
- result;
- any discovered flaw.

This is a protocol test, not permission to start P1-02.

### 9. Durable outputs

Produce:
- the new turn-continuity protocol;
- per-agent checkpoint convention + one real IMPL-04 checkpoint;
- any minimal validator/test;
- updated SYSTEM/CHATGPT-BOOT/workstream bootstrap rules;
- updated falsifier entry;
- transcript if a material external conversation is created for this work;
- packet containing important findings if the self-test discovers anything worth preserving;
- handoff to COORD-01;
- outbox MERGE_REQUEST for coordinator-owned canonical changes.

Do not only report results in chat.

## Constraints

- P1-01 / WS-001 scope only.
- Do not implement P1-02 through P1-09.
- Do not begin the Provider Laboratory.
- Do not integrate the P1-02 branch.
- Do not touch impl-04/p1-02-authority-pointer-slice.
- Do not create a second Ω session ledger.
- Do not create a second BCP state/log system.
- Do not create hidden/local-only continuation state as the sole source of truth.
- Do not edit RATIFIED Ω decisions.
- Do not hand-edit BCP state or BCP logs.
- Do not modify vivim-original-baseline/.
- Do not silently change the P1-01 PROVEN verdict.
- If this slice reveals that the existing PROVEN claim must be revisited, record the conflict/proposed amendment rather than rewriting the verdict.
- Keep the implementation lightweight.
- Preserve backward links and immutable-history rules.
- Use a new branch from current main; do not continue the old P1-02 branch.

## Completion criteria

This directive is complete only when:
1. A new participant can find the active directive and the current checkpoint from repository bootstrap artifacts.
2. The checkpoint contains enough state to resume a bounded task without the originating chat.
3. The checkpoint protocol distinguishes itself clearly from packets, handoffs, transcripts, CURRENT, directives, and the Ω session ledger.
4. An interruption/recovery self-test succeeds without hidden conversational context.
5. The mechanism detects at least one deliberately injected recovery inconsistency or stale-state condition and refuses/flags it rather than guessing.
6. The new validator/tests are deterministic.
7. All durable outputs are linked and the coordinator can integrate them without reconstructing the work from chat.
8. P1-01 remains PROVEN as-is unless a concrete contradiction requires a separate re-rule.

## Required final report

Return a concise completion report containing exactly:
- implementation branch;
- implementation commit(s);
- checkpoint path;
- continuity protocol path;
- validator/test path;
- new falsifier id;
- interruption point;
- recovery participant/identity;
- recovery result;
- inconsistency test result;
- tests/gates run;
- durable evidence links;
- handoff id;
- outbox item;
- P1-01 verdict unchanged? YES/NO;
- anything discovered that must be considered by COORD-01 next.

## Stop condition

After the self-test and durable handoff, STOP.

Do not automatically:
- launch another P1 workstream;
- start P1-02;
- run the P1-02 plugin-authoring experiment;
- create the Provider Laboratory;
- continue into unrelated cleanup.

The next decision belongs to the owner/coordinator.

## Owner intent

This directive exists to eliminate the recurring failure mode where a long-running workstream depends on the live chat that happened to contain its latest position.

The chat is a convenient interface.

The repository is the memory.
