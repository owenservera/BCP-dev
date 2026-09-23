---
session_id: CHAT-2026-09-23-cooperative-agent-context
source: human
date: 2026-09-23
workstreams: [WS-001]
repository_tip: becb920
participants: [owner, chatgpt, impl-01]
status: ingested
---

# Transcript CHAT-2026-09-23-cooperative-agent-context — Initiating brief (stored verbatim)

> **Classification: TRANSCRIPT — HISTORICAL** (as of ingest; status annotated only, never rewritten)
> **Role:** architectural input, NOT authoritative law. Claims herein become
> project knowledge only through repo evidence/decision mechanisms. Packet:
> `packets/PKT-001-cooperative-substrate-charter.md`.
> **Fidelity note:** the initiating conversation arrived as a single MASTER
> AGENT PROMPT (owner → first implementation agent, via ChatGPT-originated
> architecture). No multi-turn chat log preceded it in-repo; the prompt below
> is reproduced complete and unedited as the charter transcript.

# MASTER AGENT PROMPT

## Build the Cooperative Ω Agent Context & Cross-Session Synchronization System

## Mission

You are the first implementation agent for a new Ω workstream.

You have been given the complete initiating architecture conversation between the project owner and ChatGPT as a Markdown document.

Your first job is NOT to implement `vivim.self`.

Your first job is to build the **cooperative agent/context system** that will allow:

* the owner,
* ChatGPT across multiple fresh conversations,
* unlimited local agents,
* specialized research agents,
* implementation agents,
* verification agents,
* documentation/context agents,

to work continuously on Ω without any single participant becoming the bottleneck for context.

The repository must become the durable synchronization substrate.

The desired property is:

> A fresh authorized participant can enter this workstream, discover the current context, understand what has already been established, know which material is authoritative vs historical vs conversational, identify the current work, and continue without requiring the owner or another agent to reconstruct the project from memory.

---

# 1. Start from repository truth

Before designing anything:

Read:

```text
/AGENTS.md
/BUILD_CONTEXT.md
/docs/CURRENT-CONTEXT.md
```

Then:

```text
omega-baseline/omega-final/AGENTS.md
omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md
omega-baseline/omega-final/docs/BUILD-DECISIONS.md
```

Then inspect the complete supplied conversation transcript.

The transcript is an important architectural input, but it is NOT authoritative law.

Do not elevate conversation statements into repository truth without checking the repository.

---

# 2. Current repository boundaries remain binding

BCP-dev contains:

```text
vivim-original-baseline/
    legacy VIVIM behavioral mine

bcp-speed/bcp/
    BCP control substrate + migration forge

omega-baseline/omega-final/
    Ω destination
```

Do not collapse these roles.

The current Ω development process already contains:

```text
decision records
CURRENT-INVARIANTS
BUILD-DECISIONS
process self-model
genome
session ledger
dev-vault
doctruth/librarian
brief tooling
entry tooling
self-portrait
agent control
context substrate
aperture
invocation
standing
delegation
adaptation
```

Reuse these wherever possible.

Do not create a second implementation of an existing mechanism merely because it is inconvenient.

---

# 3. Core objective

Create a new repository-resident cooperative system for shared agent context.

Its purpose is to make agent collaboration and cross-session continuity explicit.

The system MUST support:

```text
many agents
many sessions
many conversations
many workstreams
many branches/worktrees
one shared repository
one durable contextual memory
```

without requiring everyone to load all history.

---

# 4. Fundamental epistemic separation

Preserve this distinction everywhere:

```text
LAW
≠
SOURCE EVIDENCE
≠
DERIVED STATE
≠
TRANSCRIPT
≠
PROPOSAL
≠
HISTORY
≠
AGENT OPINION
```

In particular:

A ChatGPT conversation is not law.

A local agent's reasoning is not law.

A handoff is not law.

A generated context summary is not law.

A transcript may contain important discoveries, but those discoveries become project knowledge through normal evidence/decision mechanisms.

---

# 5. Build the agent-system directory

Create a coherent structure under:

```text
docs/agent-system/
```

Use the actual repository conventions where they suggest a better location.

At minimum design for:

```text
SYSTEM.md
ROSTER.md
WORKSTREAMS.md
CURRENT.md
CONTEXT-INDEX.md

transcripts/
sessions/
packets/
handoffs/
inbox/
outbox/
```

The exact layout may be changed after repository inspection.

Do not proliferate files unnecessarily.

---

# 6. Required artifact meanings

## SYSTEM.md

The permanent operating protocol.

It should describe:

* agent identity
* session identity
* workstream identity
* source classes
* context loading order
* transcript handling
* packet handling
* handoff protocol
* branch/worktree discipline
* ownership rules
* integration rules
* conflict rules
* update rules
* context compression rules
* fresh-agent bootstrap
* ChatGPT bootstrap
* archival rules

This is operational protocol, not Ω constitutional law.

---

## ROSTER.md

A registry of participating agent identities.

Each agent should have:

```text
agentId
role
status
specialization
current workstream
current task
branch/worktree
last session
handoff
```

Keep this current through the cooperative system.

Do not turn it into authority over Ω.

---

## WORKSTREAMS.md

One registry of active workstreams.

Each workstream should identify:

```text
workstream id
mission
owner/coordinator
status
active agents
base commit
current objective
known blockers
linked packets
linked decisions
linked transcripts
next action
```

---

## CURRENT.md

This is the most important compact artifact.

It is the durable shared working-memory bridge.

Keep it small enough to load in every fresh session.

It should contain at least:

```text
CURRENT REPOSITORY TIP
CURRENT WORKSTREAM
CURRENT MISSION
CURRENT ARCHITECTURAL MODEL
WHAT IS ESTABLISHED
WHAT IS NEW
WHAT CHANGED
ACTIVE TASKS
ACTIVE AGENTS
OPEN QUESTIONS
KNOWN CONTRADICTIONS
KNOWN HISTORICAL TRAPS
CURRENT AUTHORITY
RECOMMENDED NEXT READS
RECENT IMPORTANT SESSIONS
```

Every substantive entry should point to deeper evidence.

CURRENT.md must never become a giant transcript.

---

## CONTEXT-INDEX.md

The map into deeper contextual material.

It should let a fresh agent answer:

```text
Where is the architecture context?
Where are the recent conversations?
Where is the current ontology?
Where are the unresolved contradictions?
Where is the current implementation work?
Where are the relevant decisions?
Where are the latest handoffs?
Where are recent lessons?
```

---

# 7. Transcript protocol

Every material external architecture conversation becomes an immutable transcript artifact.

Recommended shape:

```text
docs/agent-system/transcripts/YYYY-MM-DD/
    CHAT-<timestamp>-<slug>.md
```

Each transcript must have metadata:

```yaml
session_id:
source: chatgpt | local-agent | human
date:
workstreams:
repository_tip:
participants:
status:
```

Do not rewrite historical transcripts.

Do not delete them merely because a later conversation supersedes their conclusions.

Their status is historical/contextual evidence.

---

# 8. Transcript extraction

A transcript MUST NOT automatically become CURRENT context in full.

Create a packet from it.

Packets are compact extracted working knowledge.

A packet should identify:

```text
packet id
source transcript
source range
workstream
facts
discovered concepts
proposals
contradictions
unknowns
recommended reads
```

Where possible every extracted factual claim should point back to:

```text
repository path
decision
test
transcript section
```

The packet is a derived representation.

It may be stale.

It may be superseded.

It is not constitutional authority.

---

# 9. Session protocol

Reuse the existing Ω session ledger.

A local agent beginning work should use:

```powershell
bun run omega:session begin --mission "<mission>" --agent "<agent-id>"
```

The agent should stream useful work into that ledger.

At session close:

```text
lessons
evidence
bottlenecks
unresolved questions
next recommendation
```

must be preserved according to the existing Ω session protocol.

The cooperative system should reference these records rather than create a competing development-memory mechanism.

---

# 10. Handoff protocol

Every meaningful agent handoff must create:

```text
docs/agent-system/handoffs/HANDOFF-<id>.md
```

Minimum fields:

```text
HANDOFF ID
SOURCE AGENT
SOURCE SESSION
TARGET AGENT
WORKSTREAM

MISSION

BASE COMMIT

FILES INSPECTED

FACTS ESTABLISHED

FACTS DISPROVED

IMPORTANT DISCOVERIES

CURRENT ARCHITECTURAL MODEL

CONTRADICTIONS

UNKNOWN / UNRESOLVED

PROPOSED CHANGES

FILES CHANGED

TESTS RUN

GATES RUN

DECISIONS TO READ

TRANSCRIPTS TO READ

PACKETS TO READ

NEXT ACTION

CONTEXT BUDGET RECOMMENDATION
```

A receiving agent must be able to continue from the handoff without reconstructing the previous agent's reasoning.

---

# 11. Agent specialization

The system must support many concurrent agents.

A recommended initial roster:

```text
COORD-01
    workstream coordination / integration

ARCH-01
    architecture and ontology

ARCHAEOLOGY-01
    historical VIVIM/Ω extraction

CODE-01
    source semantics / code indexing

RUNTIME-01
    runtime self-model / vault / law / agent

CONTEXT-01
    context compiler / aperture / progressive disclosure

TEST-01
    falsifiers / adversarial verification

DOC-01
    context packets / documentation lineage
```

These are examples, not hard-coded roles.

The registry must allow arbitrary agents to be added.

---

# 12. Concurrent work discipline

Multiple agents may work concurrently.

Avoid multiple agents directly modifying the same canonical artifact simultaneously.

Prefer:

```text
agent
→ branch/worktree
→ research/proposal
→ handoff
→ coordinator
→ integration
→ gate
```

Use normal Git discipline.

The cooperative system should record:

```text
agent
branch
base commit
workstream
task
```

for each active task.

---

# 13. Inbox / outbox protocol

Each agent should have:

```text
inbox/<agent-id>/
outbox/<agent-id>/
```

Use them for structured collaboration.

An inbox item may be:

```text
REQUEST
QUESTION
HANDOFF
EVIDENCE
CONFLICT
REVIEW
MERGE_REQUEST
```

The system should define a simple machine-readable envelope so agents can exchange work without requiring direct conversational coordination.

---

# 14. Context loading protocol

A fresh participant MUST NOT read everything.

The default read order is:

```text
1. /AGENTS.md
2. /BUILD_CONTEXT.md
3. /docs/CURRENT-CONTEXT.md
4. /docs/agent-system/SYSTEM.md
5. /docs/agent-system/CURRENT.md
6. /docs/agent-system/CONTEXT-INDEX.md
7. active workstream
8. relevant handoff
9. relevant packets
10. relevant decisions/code/tests
11. original transcripts only where necessary
```

For Ω-specific tasks also read:

```text
omega-baseline/omega-final/AGENTS.md
omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md
```

The exact ordering may be improved by implementation after inspection.

---

# 15. Context classes

Every persistent context artifact must have a classification.

At minimum:

```text
AUTHORITATIVE
CURRENT
DERIVED
PROPOSED
HISTORICAL
ARCHIVED
TRANSCRIPT
EXTERNAL-ANALYSIS
UNKNOWN
```

This classification MUST be visible.

Never make the agent infer the status from folder names alone.

This directly addresses cold-reader traps such as historical Ollama/provider material.

---

# 16. Source hierarchy

The cooperative system must teach agents:

```text
constitutional/rules
    >
ratified decisions/current invariants
    >
current code/contracts/tests
    >
derived artifacts
    >
session records
    >
conversation packets
    >
raw transcripts
    >
agent interpretation
```

This is an orientation heuristic, not an excuse to override existing Ω authority law.

Where the existing Ω authority hierarchy differs, follow Ω.

---

# 17. ChatGPT synchronization

Create:

```text
docs/agent-system/CHATGPT-BOOT.md
```

This file must be deliberately optimized for a fresh ChatGPT session.

It should say:

```text
You are joining an ongoing Ω workstream.

Read:
/AGENTS.md
/BUILD_CONTEXT.md
/docs/CURRENT-CONTEXT.md
/docs/agent-system/SYSTEM.md
/docs/agent-system/CURRENT.md
/docs/agent-system/CONTEXT-INDEX.md

Then inspect the active workstream and relevant handoffs/packets.

Do not assume transcripts are law.
Do not assume old documents are current.
Use repository authority to verify claims.
```

It should also explain where current conversations are stored.

This becomes the stable bridge between independent ChatGPT conversations.

---

# 18. Fresh ChatGPT session protocol

A future ChatGPT session should be able to operate in this sequence:

```text
open repository / receive boot document
        ↓
read CHATGPT-BOOT
        ↓
read CURRENT
        ↓
identify active workstream
        ↓
inspect relevant packets
        ↓
inspect relevant current decisions/code
        ↓
use original transcript only where required
        ↓
work
        ↓
produce findings/proposals
        ↓
produce a conversation transcript
        ↓
produce/update context packet
        ↓
update CURRENT through normal coordination
```

The objective is continuity without requiring the entire historical conversation corpus in every context window.

---

# 19. Conversation packets must preserve reasoning lineage

When extracting a packet from the supplied transcript:

Do not merely summarize conclusions.

Capture:

```text
why the idea appeared
what earlier assumption it corrected
what evidence changed the view
what repository evidence supports it
what remains hypothetical
what was explicitly rejected
```

This is particularly important for Ω because architectural knowledge often exists as a chain of discoveries.

The agent should preserve genealogy, not just conclusions.

---

# 20. Context compaction

Create a deterministic or at least structurally disciplined compaction process.

The system should allow:

```text
many transcripts
        ↓
many packets
        ↓
active context digest
        ↓
CURRENT.md
```

Older context should remain addressable rather than being lost.

The preferred model is:

```text
compact context
+
stable references
+
on-demand expansion
```

not:

```text
ever-growing summary
```

---

# 21. Duplicate and contradiction handling

The system must identify:

```text
duplicate insight
duplicate packet
contradictory claims
superseded packet
stale packet
same claim with different evidence
```

Do not silently merge contradictions.

Represent them.

Example:

```text
CLAIM A
source: transcript X
status: external-analysis

CLAIM B
source: current decision D-456
status: authoritative

resolution:
B governs; A retained as historical reasoning
```

---

# 22. Context provenance

Every extracted claim should be traceable.

At minimum:

```text
claim
source kind
source id
source location
source hash where practical
extraction session
derived packet
current status
```

Reuse doctruth and existing provenance mechanisms rather than inventing an unrelated provenance protocol.

---

# 23. Context freshness

Packets and CURRENT content must be capable of being marked:

```text
CURRENT
STALE
SUPERSEDED
UNRESOLVABLE
CONFLICTED
```

Do not silently update old packets in place.

Create new derived versions when necessary.

---

# 24. Agent responsibility model

An agent is responsible for:

```text
read
reason
act
record
handoff
```

An agent is NOT responsible for:

```text
rewriting history
declaring law
silently resolving contradictions
promoting its own proposal
editing RATIFIED records
```

---

# 25. Coordinator responsibility

COORD-01 or its equivalent should own:

```text
workstream state
task routing
handoff acceptance
cross-agent conflict detection
integration
context consolidation
canonical CURRENT update
gate status
```

The coordinator should not become a hidden singleton memory.

All meaningful coordination state must remain repository-visible.

---

# 26. First implementation phase

Before creating the full system:

### Phase 0 — Audit

Inspect:

```text
existing AGENTS.md
BUILD_CONTEXT
CURRENT-CONTEXT
session ledger
dev-vault
decision system
doctruth
genome
brief
entry
portrait
existing agent plugin
```

Determine exactly what can be reused.

### Phase 1 — Minimal cooperative substrate

Implement:

```text
SYSTEM
ROSTER
WORKSTREAMS
CURRENT
CONTEXT-INDEX
transcript ingestion convention
packet convention
handoff convention
ChatGPT boot document
```

### Phase 2 — Dogfood

Use at least three local agents with distinct identities.

Have them exchange work solely through the cooperative system for a bounded task.

### Phase 3 — Context wall test

Start a completely fresh agent session.

Give it only:

```text
CHATGPT-BOOT
CURRENT
relevant handoff
relevant packet
```

and the repository.

Determine whether it can continue work correctly.

### Phase 4 — Cross-conversation test

Use the supplied ChatGPT transcript as an external conversation.

Ingest it.

Generate packets.

Start a new agent from the packets.

Verify that the important architectural state survives.

### Phase 5 — Prepare for self-knowledge

Only after the cooperative substrate works should the next workstream begin the actual `vivim.self` design.

---

# 27. Required falsifiers

Create falsifiers for at least:

```text
F-AGENT-COLD-START
F-AGENT-HANDOFF
F-AGENT-TRANSCRIPT-INGEST
F-AGENT-CONTEXT-COMPACTION
F-AGENT-CONFLICT
F-AGENT-PROVENANCE
F-AGENT-FRESHNESS
F-AGENT-MULTI-AGENT
F-AGENT-CROSS-CHATGPT
F-AGENT-CURRENT-TRUTH
```

Examples:

### F-AGENT-COLD-START

A fresh agent can orient using the boot/context path without historical reconstruction.

### F-AGENT-HANDOFF

Agent B can continue the task from Agent A's handoff.

### F-AGENT-TRANSCRIPT-INGEST

The full ChatGPT transcript becomes queryable context without becoming law.

### F-AGENT-CURRENT-TRUTH

A fresh agent can distinguish current law from historical conversation material.

### F-AGENT-CONFLICT

Two contradictory packets are represented honestly and the authoritative source wins without deleting history.

### F-AGENT-COMPACTION

A large transcript corpus can be compacted into bounded active context while preserving expansion references.

---

# 28. Do not overbuild

The first implementation does NOT need:

* embeddings,
* vector databases,
* an LLM memory layer,
* semantic code indexing,
* a new ontology database,
* automatic autonomous prioritization,
* cloud synchronization.

Those may come later.

First build the **cooperative memory protocol**.

---

# 29. Relationship to future vivim.self

This system is infrastructure for the next workstream.

The eventual Ω-native self-description system should be able to consume the cooperative substrate.

Do not duplicate its concepts unnecessarily.

The long-term direction is:

```text
external conversations
+
local agent work
+
runtime observations
+
development evidence
+
decisions
+
source semantics
        ↓
cooperative context substrate
        ↓
Ω self-description
        ↓
task-conditioned context
        ↓
fresh agent
```

---

# 30. Success criterion

Do not judge the implementation by number of files created.

The first system is successful when this can happen:

```text
Agent A
    researches a problem
        ↓
records evidence + reasoning
        ↓
creates packet + handoff

Agent B
    starts later
        ↓
reads CURRENT + packet + handoff
        ↓
continues without Agent A

ChatGPT session 1
    develops architecture
        ↓
transcript is ingested

ChatGPT session 2
    starts fresh
        ↓
reads CHATGPT-BOOT + CURRENT
        ↓
understands the active workstream
        ↓
does NOT need the old chat pasted again

Agent C
    verifies the implementation
        ↓
records falsifier results

Coordinator
    integrates
        ↓
gate
        ↓
CURRENT context advances
```

That is the first proof.

---

# 31. Final design principle

The system should replace:

```text
"I hope someone remembers what we discussed."
```

with:

```text
"The repository knows where the discussion was recorded,
what was extracted from it,
what was proven,
what remains proposed,
what is current,
and what context the next agent needs."
```

The repository becomes the shared memory substrate.

Conversation remains rich reasoning.

Agents become replaceable workers.

ChatGPT becomes a persistent architectural participant across sessions.

No participant needs to carry the whole system in its context window.

---

*(End of verbatim charter. Ingested by IMPL-01, 2026-09-23, base `becb920`.)*
