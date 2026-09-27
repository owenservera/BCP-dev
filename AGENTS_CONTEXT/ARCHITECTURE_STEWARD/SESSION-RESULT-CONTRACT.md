# Session Result Contract

> Version: 1.0
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
TARGET_REF:
BASE_MAIN_SHA:
TASK:
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

## No chat-only completion

A final ChatGPT message is not the durable result. Returning the report in chat is required for human visibility, but it never substitutes for the repository receipt.

## Failure handling

If the session cannot persist the receipt because repository write capability is unavailable, it must report the task as `BLOCKED` or `PARTIAL` rather than silently stopping as complete.

## History

Do not overwrite prior session receipts. Use a new `<SESSION_ID>.md` file for every substantive session.
