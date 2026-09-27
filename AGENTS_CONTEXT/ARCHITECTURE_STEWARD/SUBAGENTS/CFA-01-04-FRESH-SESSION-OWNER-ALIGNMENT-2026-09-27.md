# CFA-01–04 — FRESH-SESSION OWNER ALIGNMENT / RATIFICATION PROTOCOL

> **FSSP-1.1 applies first:** `CHATGPT-FRESH-SESSION-PROTOCOL.md` defines the generic ChatGPT conversation/session bootstrap. This file adds the CFA-01–04 domain sequence and owner-alignment specifics.

Repository: https://github.com/owenservera/BCP-dev

## Purpose

This protocol is the canonical launch instruction for running CFA-01 through CFA-04 in separate, fresh conversation sessions.

Each CFA agent MUST assume that the new conversation has no memory of previous sessions. The repository on current `main` is the durable source of truth.

A prior chat message, prior agent claim, pasted report, or remembered state is not authoritative unless the current repository independently confirms it.

## Required execution order

Run these as four separate fresh sessions, serially:

1. CFA-01 — World & Context
2. CFA-02 — Data
3. CFA-03 — Semantic Continuity
4. CFA-04 — Authority Governance

Do not run them concurrently.

After each CFA completes, record its commit SHA and final status before launching the next fresh session.

---

# UNIVERSAL FRESH-SESSION START

Before making any change:

1. Inspect the current `main` branch and repository state.
2. Read:
   - `AGENTS.md`
   - `BUILD_CONTEXT.md` if present
   - relevant Architecture Steward documentation
   - current CFA register / roster
   - current boundary and ownership artifacts.
3. Read the canonical Boundary Protocol:
   `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/BOUNDARY-DESIGN-SYSTEM/BOUNDARY-PROTOCOL.md`
4. Read the canonical One-Shot Bootstrap Master:
   `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/CORE-FUNCTION-AREA-ONE-SHOT-BOOTSTRAP.md`
5. Read the Owner Alignment Round:
   `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/OWNER-ALIGNMENT-ROUND-2026-09-27.md`
6. Read the CFA's own README, STATE, seed/design/proposal artifacts, and existing identity/history artifacts.
7. Read the current CORE-AGENT files of relevant peer CFAs.
8. Verify every claimed predecessor result from the repository itself.

If an expected artifact is absent, stale, contradictory, or renamed, investigate current repository truth before proceeding.

## Evidence discipline

Use this hierarchy:

1. Current executable/repository evidence
2. Ratified architectural law / identity artifacts
3. Current derived models
4. Current proposals
5. Historical material

Preserve contradictions rather than silently resolving them.

Never manufacture authority.

Preserve these distinctions:

- EVIDENCE ≠ REPRESENTATION ≠ DESCRIPTION ≠ AUTHORITY
- confidence ≠ proof
- candidate ≠ realization
- selector ≠ canonical truth
- LLM output ≠ authority
- unknown ≠ failure
- semantic identity ≠ record identity
- record identity ≠ revision identity
- durable authority reference ≠ live authority decision
- grounding ≠ authorization
- Intent ≠ Permission
- canonical semantic state ≠ presentation state
- Work ≠ worker/process
- Outcome ≠ Evidence

Do not convert an unresolved architectural question into a false fact.

---

# CFA-01 — WORLD & CONTEXT

## Current task

Inspect the current CFA-01 artifacts and perform Owner Alignment for:

Candidate identity:
`World & Context Steward`

Candidate agent_id:
`world-ontology-context`

Read the CFA-01 self-design/state/boundary material currently present in the repository.

Then inspect the current ratified peer identities, especially CFA-02 through CFA-10 where present.

## Resolve explicitly

1. Accept or rename `World & Context Steward`.
2. Determine whether World + Context remain one CFA or should be split.
3. Define the boundary between:
   - CFA-01 semantic identity/correspondence
   - CFA-02 durable record identity/persistence/revision/lineage.
4. Resolve Space ownership:
   - CFA-01 semantic World/Space meaning
   - CFA-08 human-facing surface/presentation concerns.
5. Resolve Addressability:
   - CFA-01 World addressability semantics
   - CFA-03 semantic language/command concerns.
6. Resolve Context:
   - CFA-01 semantic Context ownership
   - CFA-03 Intent/meaning
   - CFA-05 Work/execution.
7. Preserve the distinction between World observation/projection and Evidence.
8. Record unresolved, deferred, or intentionally provisional decisions.

## CFA-01 completion

Only after explicit owner alignment:

- persist the alignment;
- create/update CORE-AGENT identity artifacts as justified;
- update STATE and identity history;
- update relevant register/roster artifacts;
- attempt Commons publication only if genuinely supported;
- never fabricate signatures, message IDs, or identity;
- commit to `main`.

Do NOT activate shared boundaries.
Do NOT change Ω law.
Do NOT begin implementation.

---

# CFA-02 — DATA

## Fresh-session prerequisite

CFA-02 MUST run only after CFA-01 has completed and its commit is visible on current `main`.

The new CFA-02 conversation MUST independently verify CFA-01's actual repository state.

## Current task

CFA-02 is intentionally provisional/foundation-seeded until owner alignment is formally closed.

Candidate identity:
`Data Steward`

Candidate agent_id:
`data-model`

Read:

- CFA-01 aligned result and CORE-AGENT, if created
- CFA-02 README
- CFA-02 STATE
- CFA-02 CORE-AGENT-SEED
- existing CFA-02 boundary/declaration artifacts
- CFA-04 through CFA-10 current CORE-AGENT identities
- current CFA register and ownership map.

## Resolve explicitly

1. Accept or rename `Data Steward`.
2. Confirm durable:
   - identity
   - persistence
   - revision
   - lineage
   - reconstruction
   ownership.
3. Confirm semantic identity/correspondence remains CFA-01.
4. Confirm:
   - Account
   - Session
   - Resource
   semantics remain CFA-06,
   while durable persistence/revision/lineage remains CFA-02.
5. Resolve durable AuthorityCitation storage/join boundary with CFA-04.
6. Resolve durable Work/Attempt/Outcome linkage with CFA-05.
7. Resolve migration and continuity boundary with CFA-09.
8. Define canonical-vs-derived data semantics without assuming implementation schema is architecture.
9. Resolve machine/workspace-safe durable identity requirements.
10. Record unresolved/deferred issues honestly.

## CFA-02 completion

Only after explicit owner alignment:

- create/update CORE-AGENT identity artifacts as justified;
- update STATE and identity history;
- update register/roster artifacts;
- attempt Commons only if genuinely supported;
- never fabricate signing state;
- commit to `main`.

Do NOT activate shared boundaries.
Do NOT change Ω law.
Do NOT begin implementation.

---

# CFA-03 — SEMANTIC CONTINUITY

## Fresh-session prerequisite

Verify current repository state rather than assuming any previous conversation result.

CFA-03 may already be ratified. If current repository evidence confirms a ratified identity, this is a verification/reconciliation task, NOT a request to invent a second identity or repeat alignment unnecessarily.

Current/expected identity:
`Semantic Continuity Steward`

Current/expected agent_id:
`semantic-continuity`

## Verify

Inspect current CFA-03:

- README
- STATE
- CORE-AGENT
- identity history
- boundary artifacts
- current CFA register/roster.

Verify its boundaries against current CFA-01 and CFA-02, and against CFA-04 through CFA-10.

Pay particular attention to:

- semantic identity and continuity;
- language / command / semantic interpretation;
- Intent and Plan meaning;
- Addressability boundary with CFA-01;
- canonical meaning versus presentation;
- semantic evolution versus data continuity;
- authority versus semantic description;
- Work-facing executable Plan boundary with CFA-05.

If already ratified and internally consistent, preserve the ratified identity and document only necessary reconciliation.

If a genuine unresolved owner decision remains, surface it rather than silently altering identity.

Do NOT self-ratify.
Do NOT change Ω law.
Do NOT activate shared boundaries.
Do NOT begin implementation.

Commit only justified reconciliation changes to `main`.

---

# CFA-04 — AUTHORITY GOVERNANCE

## Fresh-session prerequisite

Verify the current repository state independently.

CFA-04 may already be RATIFIED — OWNER-ALIGNED. If current `main` confirms that state, do NOT restart Owner Dialogue or manufacture a new identity.

Current identity expected:
`Authority Governance Steward`

Expected agent_id:
`authority-governance`

## Verify

Inspect current:

- CFA-04 README
- STATE
- CORE-AGENT
- identity history
- Owner Alignment record
- current CFA register/roster
- peer CFA CORE-AGENT files
- authority boundary artifacts.

Confirm the ratified authority model and its boundaries with:

- CFA-01 World/Context
- CFA-02 durable identity/persistence
- CFA-03 semantic meaning/Intent
- CFA-05 Work authorization/execution
- CFA-06 capability/provider realization
- CFA-07 composition/plugin/Forge
- CFA-08 interaction/representation
- CFA-09 change/re-authorization
- CFA-10 runtime enforcement.

Particular distinction:

- durable authority reference is not a live authority decision;
- authority is not semantic meaning;
- authority is not evidence;
- runtime enforcement is not the source of authority semantics;
- CFA-10 enforces generic gates; CFA-04 owns authority governance semantics.

If the repository confirms the identity is already ratified, preserve it.

If a genuine contradiction exists, document it and escalate rather than silently rewriting ratified authority.

Do NOT re-ratify an already ratified identity.
Do NOT change Ω law.
Do NOT activate shared boundaries.
Do NOT begin implementation.

Commit only justified reconciliation changes to `main`.

---

# COMMON COMPLETION CONTRACT

Every CFA execution must end with a concise report containing:

- CFA number
- final identity name
- agent_id
- final status
- owner-alignment/ratification state
- files changed
- unresolved/deferred items
- commit SHA
- whether CORE-AGENT exists
- whether Commons publication was genuinely proven
- confirmation that shared boundaries were not activated
- confirmation that Ω law was not changed
- confirmation that implementation was not started unless explicitly authorized by the task.

## Failure / blocked state

If owner alignment cannot be honestly established:

- stop at the correct PROVISIONAL / BLOCKED / UNALIGNED state;
- document the missing decision/evidence;
- do not manufacture identity or authority;
- do not create a false CORE-AGENT;
- commit only the durable evidence/report if appropriate.

## Serial rule

Do not launch the next CFA until the preceding CFA's actual commit is visible on current `main`.

The next fresh session must independently verify the predecessor.

## Final CFA-04 rule

After CFA-04 completes, STOP.

Do not begin broad implementation.

The next architectural operation is a Steward-led reconciliation of the complete 10-CFA constellation, including:

- current identities and ratification states;
- stale CFA Register entries;
- ownership map;
- peer boundaries;
- overlap/gap/conflict detection;
- graph/documentation freshness.

Boundary activation and implementation are later stages.
