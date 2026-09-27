# CFA-02 — OWNER ALIGNMENT

> **ChatGPT Fresh-Agent Session — FSSP-1.0**
> This file is a task envelope for a new independent ChatGPT conversation.
> The new conversation itself is the agent execution session. Do not assume an external OpenCode/implementation agent.

## Fresh-session protocol

Before doing anything substantive, read and follow:

https://github.com/owenservera/BCP-dev/blob/main/AGENTS_CONTEXT/ARCHITECTURE_STEWARD/CHATGPT-FRESH-SESSION-PROTOCOL.md

Then open:

https://github.com/owenservera/BCP-dev/blob/main/AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/SESSION-CONTEXT.md

The repository on current `main` is the durable source of truth. Prior chat messages and pasted reports are not authoritative until independently verified.

## Session identity

- Repository: `https://github.com/owenservera/BCP-dev`
- CFA: **CFA-02 — Data / Identity / Persistence**
- Candidate identity: **Data Steward**
- agent_id: `data-model`
- Workspace: `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD/`

## Predecessor prerequisite

CFA-01 must already be ratified and visible on current `main`.

Expected CFA-01 ratification sequence includes commit:

`84d7632a9824ad3c2b08ec2f8be0a17a1aa2e0f5`

Do not trust the SHA merely because it appears here. Verify it exists on current `main`, inspect CFA-01 `CORE-AGENT.md`, `STATE.md`, `OWNER-ALIGNMENT-2026-09-27.md`, and confirm identity:

`World & Context Steward / world-ontology-context`

If the prerequisite is missing or contradictory, stop at **BLOCKED / UNKNOWN** and report the exact repository condition.

## Required fresh-session read order

After the global protocol:

1. `AGENTS.md`
2. `BUILD_CONTEXT.md`
3. `docs/CURRENT-CONTEXT.md`
4. `AGENTS_CONTEXT/README.md` as applicable
5. this workspace `SESSION-CONTEXT.md`
6. `CORE-AGENT-SEED.md`
7. `STATE.md`
8. `BOUNDARY-ROUND-1-DECLARATION-2026-09-26.md`
9. `BOUNDARY-ROUND-2-ADDENDUM-2026-09-27.md`
10. CFA-01 current durable identity artifacts
11. CFA-04 through CFA-10 current `CORE-AGENT.md` identities
12. current CFA register
13. current Architecture Steward ownership map
14. this Owner Alignment task

Do not load unrelated repository material unless required to resolve an actual ambiguity.

## Current status

CFA-02 is intentionally **PROVISIONAL / FOUNDATION-SEEDED** until owner alignment is completed.

Do not treat the candidate identity as ratified because other CFAs are ratified.

## Owner dialogue

The human owner in this new ChatGPT conversation is the alignment authority for this task.

Present these questions explicitly and wait for the owner's decisions before creating `CORE-AGENT.md`:

1. Accept or rename **Data Steward**.
2. Confirm CFA-02 ownership of durable:
   - record identity;
   - persistence;
   - revision;
   - lineage;
   - reconstruction.
3. Confirm semantic identity/correspondence remains CFA-01 and is not absorbed by Data.
4. Confirm Account / Session / Resource **semantics** remain CFA-06 while CFA-02 owns their durable persistence/revision/lineage.
5. Resolve the durable AuthorityCitation storage/join boundary with CFA-04.
6. Resolve durable Work / Attempt / Outcome linkage with CFA-05.
7. Resolve migration/continuity boundary with CFA-09.
8. Define canonical-vs-derived data semantics without assuming an implementation schema is architecture.
9. Confirm final workspace and machine-safe identity.
10. Identify any boundary that must remain UNKNOWN / CONFLICTED / DEFERRED.

### Alignment rule

Do **not** infer owner answers from:

- previous ChatGPT conversations;
- memory;
- this prompt;
- another CFA's proposal;
- the candidate name;
- repository folder naming.

The owner's explicit answer in this session is the alignment input.

## After explicit alignment

Only after the owner has answered and the answers are recorded:

1. Persist `OWNER-ALIGNMENT-2026-09-27.md` as the durable owner decision.
2. Create/update `CORE-AGENT.md` only if the identity is actually aligned.
3. Update `STATE.md`.
4. Create/update `IDENTITY-HISTORY.md`.
5. Update `README.md` / `SESSION-CONTEXT.md` as needed.
6. Update the CFA register and Commons peer roster to the actual final identity/status.
7. Attempt Commons birth/verification only if genuinely supported by the current ChatGPT environment.
8. Commit the durable changes to `main`.
9. Re-read the committed artifacts and verify the resulting SHA.

## Commons rule

Commons is communication state, not authority.

If the current ChatGPT environment cannot execute the native signing/transport lifecycle:

- do not fabricate a message ID, event ID, signature, stream sequence or success;
- record **PARTIAL / BLOCKED** with the precise limitation;
- continue with honest repository work that does not require the unavailable capability.

## Non-actions

Do NOT:

- self-ratify;
- create `CORE-AGENT.md` before explicit owner alignment;
- activate shared boundaries;
- modify Ω law;
- begin substantive production implementation;
- create a second canonical data store;
- create a second identity registry;
- replace CFA-01 semantic ownership;
- replace CFA-04 authority semantics;
- replace CFA-05 Work semantics;
- replace CFA-06 Capability/Provider semantics;
- invent missing evidence.

## Completion contract

Return exactly:

```
SESSION_STATUS:
CFA:
IDENTITY:
AGENT_ID:
BASE_MAIN_SHA:
PREDECESSOR_VERIFIED:
OWNER_ALIGNMENT:
CORE_AGENT:
FILES_CHANGED:
RESULT:
COMMONS:
UNRESOLVED:
BLOCKERS:
COMMIT_SHA:
BOUNDARIES_ACTIVATED:
OMEGA_LAW_CHANGED:
IMPLEMENTATION_STARTED:
NEXT_REQUIRED_STEP:
```

All values must be grounded in repository evidence or explicit owner dialogue.

## STOP condition

After CFA-02 owner-alignment completion and commit:

**STOP.**

Do not begin implementation.

The next operation is the Architecture Steward's full 10-CFA constellation reconciliation.
