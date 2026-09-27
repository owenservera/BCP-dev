# Session Result Contract

> Version: 1.1
> Date: 2026-09-27
> Status: ACTIVE
> Authority: process contract only; not Ω law or semantic authority.

## Purpose

Every substantive ChatGPT agent session must leave a durable, machine-discoverable completion receipt in its own agent home before it is allowed to stop.

This makes the repository the durable result bus between independent ChatGPT sessions and the Architecture Steward.

## Mandatory location

Create:

`<AGENT-HOME>/RESULTS/<SESSION_ID>.md`

The `RESULTS/` directory may be created by the session when first needed.

## Required contents

```text
SESSION_STATUS:
SESSION_ID:
CFA / AGENT:
IDENTITY:
AGENT_ID:
TARGET_REF:
BASE_MAIN_SHA:
TASK:
EXECUTION_STRATEGY:
STRATEGY_RATIONALE:
RESULT:
FILES_CHANGED:
COMMIT_SHA:
PREDECESSOR_VERIFIED:
OWNER_ALIGNMENT:
LESSONS_UPDATED:
COMMONS:
UNRESOLVED:
BLOCKERS:
BOUNDARIES_ACTIVATED:
OMEGA_LAW_CHANGED:
IMPLEMENTATION_STARTED:
NEXT_REQUIRED_STEP:
```

Use the same factual result reported in chat. Do not invent identifiers or claim completion before repository verification.

## Completion rule

A substantive task is not `DONE` until all of these exist:

1. required durable changes, if any;
2. an exact commit/ref that contains those changes;
3. the local `RESULTS/<SESSION_ID>.md` receipt;
4. the persistent `TASKS.md` entry updated to `DONE` (or `BLOCKED` / `SUPERSEDED` when justified).

The receipt is evidence of what the session concluded; it is not semantic authority. The Architecture Steward independently verifies it against the repository.

For the mandatory final verification and the distinction between DONE, PARTIAL, BLOCKED, and REPORTED-UNVERIFIED, also follow AGENTS_CONTEXT/ARCHITECTURE_STEWARD/DURABLE-COMPLETION-GATE-2026-09-28.md.

## Commons convergence and repository attribution

The intended convergence is: a session completion receipt corresponds to a Commons `HANDOFF` that has reached `REPORTED`, while `<AGENT-HOME>/RESULTS/<SESSION_ID>.md` is the durable repository projection/compatibility surface that preserves the handoff lineage. Until Commons is the operational transport, the repository receipt remains the live completion surface.

`COMMIT_SHA` establishes repository lineage only. It does not establish agent identity, semantic authority, or truth. Unless cryptographic agent attribution is separately verified, treat repository artifact authorship as an unattributed claim and verify it against repository evidence. Signed commit or equivalent attribution is a future hardening path, not current proof.


## Final verification gate

Before the final chat report, the agent MUST re-read the current delivery ref (normally main) and verify that both the canonical receipt and the updated TASKS.md state are present there. A write response, local file, or branch-only result is not enough.

If the final verification cannot be performed, report PARTIAL, BLOCKED, or REPORTED-UNVERIFIED; never DONE / COMPLETE.

## No chat-only completion

A final ChatGPT message is not the durable result. Returning the report in chat is required for human visibility, but it never substitutes for the repository receipt.

## Failure handling

If the session cannot persist the receipt because repository write capability is unavailable, it must report the task as `BLOCKED` or `PARTIAL` rather than silently stopping as complete.

## History

Do not overwrite prior session receipts. Use a new `<SESSION_ID>.md` file for every substantive session.


## Changelog

- 1.1 — 2026-09-27: expanded and normalized the canonical receipt schema with IDENTITY, AGENT_ID, EXECUTION_STRATEGY, and STRATEGY_RATIONALE, and removed the duplicate/non-canonical CORE_AGENT field.
- 2026-09-28 clarification — durable completion now requires final re-read of the delivery ref; chat-only completion is classified as REPORTED-UNVERIFIED until receipt + task-state closure are verified.
