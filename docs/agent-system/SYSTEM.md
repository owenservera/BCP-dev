# SYSTEM.md — Cooperative Ω Agent Context & Cross-Session Synchronization Protocol

> **Classification: DERIVED — CURRENT** (operational protocol, not Ω constitutional law)
> **Authority:** this file is procedure. Ω law lives in
> `omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md` + `docs/BUILD-DECISIONS.md`.
> If this file ever contradicts Ω law, Ω law wins and this file needs a patch.
> **Workstream:** WS-001 · **Base tip:** `becb920` · **Created:** 2026-09-23

## 1. What this system is

The repository is the durable synchronization substrate for all participants:

- the owner,
- ChatGPT across many fresh conversations,
- unlimited local agents (human-driven or autonomous),
- specialized research / implementation / verification / documentation agents.

Desired property: a fresh authorized participant can enter, discover current
context, tell authoritative from historical from conversational material,
identify the current work, and continue — without anyone reconstructing the
project from memory.

This system is **infrastructure for collaboration**. It is not a second
constitution, not a second session ledger, not a second decision system, and
not a second provenance system. Where a mechanism already exists, this system
**references it** (see §3).

## 2. Epistemic separation (binding)

These classes are never interchangeable:

```text
LAW ≠ SOURCE EVIDENCE ≠ DERIVED STATE ≠ TRANSCRIPT ≠ PROPOSAL ≠ HISTORY ≠ AGENT OPINION
```

Consequences:

- A ChatGPT conversation is not law. A local agent's reasoning is not law.
- A handoff is not law. A generated summary is not law.
- Discoveries in transcripts become project knowledge only through the normal
  evidence/decision mechanisms (Ω decision records, BCP migration records,
  gate-green code/tests).
- Every persistent artifact in `docs/agent-system/` carries a visible
  `Classification:` banner (see §5). Never infer status from folder names.

## 3. Reuse map (do not re-implement)

| Need | Canonical mechanism | This system stores |
|---|---|---|
| Session open/stream/close + retrospective + lessons | Ω session ledger, D-430: `bun run omega:session begin/log/close` inside `omega-baseline/omega-final/` | `sessions/SESSION-<id>.md` pointer records (session id, agent, mission, ledger bundle ref, close digest) — never a parallel log |
| Lesson durability | dev-vault, D-428 (`dev-vault/`, environment-local, hash-chained) | pointers to graduated lessons, never copies of vault content |
| Claim provenance | doctruth (`tooling/gates/doctruth.ts`) + decision Evidence sections | `source kind / source id / source location / hash` fields on packets and handoffs, in doctruth-compatible shape |
| Layer / constitution map | genome, D-425 (`genome/layers.json` → `build/genome.md`) | references to genome layers, never a second registry |
| Compact briefings / entry tooling / self-portrait | `omega:brief`, entry gate, `omega:portrait` (D-350) | packets may cite their outputs; never fork their formats |
| Agent runtime / identity / permissions | `vivim-agent` plugin + `contracts/src/agent.ts` (D-309) + D-452 invocation, D-453 standing, D-454 delegation, D-455 adaptation, D-448/D-451 aperture | ROSTER mirrors runtime identities for coordination only; it confers no permission |
| Context assembly substrate | D-443 context substrate, D-448 aperture | this system is a *consumer* and *test driver* of that substrate, not a replacement |
| Authority / audit trail | `docs/BUILD-DECISIONS.md` + per-record files; synthesis `CURRENT-INVARIANTS.md` | links only |
| Work tracking with teeth | BCP leases/state via `python bcp_tool.py` (forge work); Ω BACKLOG (product work) | WORKSTREAMS mirrors routing state; it does not re-issue leases |

If a row above gains a better canonical home, update this table and migrate
pointers. Never let two writers own the same truth.

## 4. Identities

- **agentId** — stable, human-readable, unique in ROSTER.md (e.g. `COORD-01`,
  `ARCH-01`, `IMPL-01`). Arbitrary new ids allowed; coordinator registers them.
- **session identity** — the Ω session-ledger session id (chain-witnessed).
  One agent may hold many sessions over time; one session belongs to one agent.
- **workstream identity** — `WS-NNN` registered in WORKSTREAMS.md. Workstreams
  are missions, not branches.
- **branch/worktree identity** — the Git branch (and worktree path where used)
  recorded per active task in ROSTER + WORKSTREAMS. Protocol in §8.

## 5. Context classes (banner vocabulary)

Every persistent artifact under `docs/agent-system/` begins with a banner line:

```text
> **Classification: <CLASS> — <FRESHNESS>**
```

CLASS is one of:

```text
AUTHORITATIVE · CURRENT · DERIVED · PROPOSED · HISTORICAL · ARCHIVED · TRANSCRIPT · EXTERNAL-ANALYSIS · UNKNOWN
```

FRESHNESS (for DERIVED/CURRENT/PROPOSED) is one of:

```text
CURRENT · STALE · SUPERSEDED · UNRESOLVABLE · CONFLICTED
```

Rules:

- Only Ω ratified records and the gate are AUTHORITATIVE. Nothing in
  `docs/agent-system/` is AUTHORITATIVE over Ω — at most CURRENT procedure.
- TRANSCRIPT and EXTERNAL-ANALYSIS are never CURRENT. They are evidence.
- Do not silently update old packets in place. New derivation → new version
  (e.g. `PKT-001-v2`), old marked SUPERSEDED with a pointer forward.
- UNKNOWN is honest and preferred over guessing.

## 6. Source hierarchy (orientation heuristic)

```text
constitutional/rules
  > ratified decisions / current invariants
  > current code / contracts / tests
  > derived artifacts (packets, handoffs, CURRENT.md)
  > session records
  > conversation packets
  > raw transcripts
  > agent interpretation
```

Where the existing Ω authority hierarchy differs, **follow Ω**. This list only
teaches fresh agents which way to trust when two sources disagree, pending a
coordinator ruling (see §11).

## 7. Context loading order (default)

A fresh participant MUST NOT read everything. Default order:

```text
1. /AGENTS.md
2. /BUILD_CONTEXT.md
3. /docs/CURRENT-CONTEXT.md
4. /docs/agent-system/SYSTEM.md          (this file)
5. /docs/agent-system/CURRENT.md
6. /docs/agent-system/CONTEXT-INDEX.md
7. active workstream row in WORKSTREAMS.md
8. relevant handoff in handoffs/
9. relevant packets in packets/
10. relevant decisions / code / tests (via packet links)
11. original transcripts only where necessary
```

For Ω-specific tasks also read:

```text
omega-baseline/omega-final/AGENTS.md
omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md
```

Stop as soon as you have enough to act. Cite what you read in your handoff's
FILES INSPECTED / DECISIONS TO READ deltas.

## 8. Branch / worktree discipline

- One active task = one branch (worktrees encouraged for parallel agents).
- Never two agents modifying the same canonical artifact on the same branch.
- Shape: `agent → branch/worktree → research/proposal → handoff → coordinator
  → integration → gate`.
- Record per active task (ROSTER + WORKSTREAMS): agent, branch, base commit,
  workstream, task.
- Ω product changes obey Ω law: no RATIFIED edits, supersede-only; host
  changes name same-commit removal (B5); gate is arbiter.
- BCP state (`bcp-speed/bcp/state/`, `log/`) is written ONLY via
  `python bcp_tool.py`. This system never hand-edits it.

## 9. Transcript handling

- Every material external architecture conversation becomes an immutable file:

```text
docs/agent-system/transcripts/YYYY-MM-DD/CHAT-<timestamp>-<slug>.md
```

- Front-matter (YAML) is mandatory: `session_id, source, date, workstreams,
  repository_tip, participants, status` (see `transcripts/README.md`).
- Never rewrite a stored transcript. Never delete one because a later
  conversation supersedes it. Status changes are recorded as new rows/sections,
  not edits to history.
- A transcript MUST NOT automatically become CURRENT context in full. It is
  ingested via a packet (§10).

## 10. Packet handling

Packets are compact extracted working knowledge over transcripts (or grouped
agent sessions). Convention: `packets/PKT-NNN-<slug>.md` (+ `-v2` suffixes).

A packet identifies: packet id, source transcript(s) + source ranges,
workstream, facts, discovered concepts, proposals, contradictions, unknowns,
recommended reads — with reasoning **lineage** (why the idea appeared, what
assumption it corrected, what evidence changed the view, what supports it in
the repo, what remains hypothetical, what was explicitly rejected).

Every factual claim points back to a repository path, decision, test, or
transcript section. Packets are DERIVED and carry FRESHNESS. See
`packets/README.md`.

## 11. Handoff protocol

Every meaningful agent handoff creates `handoffs/HANDOFF-<id>.md` with the
full field set (mission, base commit, files inspected, facts established /
disproved, discoveries, architectural model, contradictions, unresolved,
proposed changes, files changed, tests/gates run, decisions/transcripts/
packets to read, next action, context-budget recommendation). See
`handoffs/README.md` for the template.

A receiving agent must be able to continue from the handoff alone (+ linked
reads) without reconstructing the previous agent's reasoning. Handoffs are
DERIVED, never law.

## 12. Inbox / outbox protocol

Per-agent structured exchange under `inbox/<agent-id>/` and
`outbox/<agent-id>/`, with a machine-readable envelope (see `ENVELOPE.md`).
Item kinds: REQUEST, QUESTION, HANDOFF, EVIDENCE, CONFLICT, REVIEW,
MERGE_REQUEST. Inbox items are coordination signals, not orders — BCP
directives still flow through the coordinator channel; parked 2026-09-22
entries stay parked until re-issued.

## 13. Ownership / integration / conflict / update rules

- **Ownership:** COORD-01 (or its registered successor) owns workstream state,
  task routing, handoff acceptance, cross-agent conflict detection,
  integration, canonical CURRENT consolidation, and gate status reporting.
  All coordination state stays repository-visible; the coordinator is not a
  hidden singleton memory.
- **Integration:** only the coordinator (or owner) advances CURRENT.md and
  WORKSTREAMS.md canonical rows. Agents propose via outbox MERGE_REQUEST +
  handoff; they do not edit CURRENT directly in concurrent flight.
- **Conflict:** represent contradictions, never silently merge them. Format:
  CLAIM A (source, status) vs CLAIM B (source, status) + resolution naming the
  governing source, with history retained (see FALSIFIERS §F-AGENT-CONFLICT).
- **Updates:** CURRENT.md is small and hand-tended through coordination.
  Packets version forward, never in-place rewrite. Transcripts never change.
  ROSTER is kept current by the coordinator on every session open/close.
- **Link maintenance (D-DOG-01 rule):** every CURRENT/WORKSTREAMS integration
  preserves or refreshes packet/handoff backward links — canonical files may
  advance, the derived chain must stay reachable by link, not just by
  directory listing. Workstream launch cards keep an evidence-chain section.
- **Tip markers (churn rule):** `Tip:` headers in DERIVED files are rolled at
  coordinator integration only. Between integrations, handoffs (branch +
  base commit) are the live tip source — agents cite those, never guess.
  (Amendment accepted by COORD-01 during DIR-001 integration; derived from the
  D-DOG-01 drill finding and recorded in MERGE_REQUEST ITEM-002.)

## 14. Context compression rules

Model: `many transcripts → many packets → active digest → CURRENT.md`, with
older context remaining **addressable** (stable references + on-demand
expansion), never silently dropped into an ever-growing summary.

- CURRENT.md stays loadable in every fresh session (target: under ~120 lines).
  Entries point to evidence; they are not evidence.
- Packets compact transcripts; CURRENT compacts packets. Each layer keeps
  backward pointers.
- Compaction events are recorded (what was folded, where the full text lives).
  Lossy compression without a pointer is a bug.

## 15. Fresh-agent bootstrap

Give a fresh agent, in order: `CHATGPT-BOOT.md` (works for any fresh
participant, not only ChatGPT) + CURRENT.md + the relevant handoff + the
relevant packet(s) + the repository. It should orient without historical
reconstruction (falsifier F-AGENT-COLD-START). Detail in `CHATGPT-BOOT.md`.

## 16. ChatGPT bootstrap

`CHATGPT-BOOT.md` is the stable bridge between independent ChatGPT
conversations: read order, authority warnings (transcripts ≠ law, old docs ≠
current), where conversations live, and the work → transcript → packet →
coordination loop. Sequence detail in §18 of the initiating brief, preserved
in packet PKT-001.

## 17. Archival rules

- Transcripts: never deleted; status-annotated only.
- Packets: superseded versions retained with SUPERSEDED banner + forward link.
- Handoffs: retained per workstream; closed workstreams archive by pointer.
- Sessions pointers: retained; ledger bundles follow Ω retention.
- `docs/archive/` remains the home of pre-system history; this system links to
  it, never rewrites it.

## 18. What this system deliberately does NOT build (v1)

No embeddings, vector DBs, LLM memory layer, semantic code index, ontology DB,
autonomous prioritization, or cloud sync. First the cooperative memory
**protocol**; machinery later, through decisions, if needed.


## Owner/coordinator directive channel

The repository provides an explicit durable owner/coordinator → agent channel for execution prompts that must survive conversation loss.

Directory: docs/agent-system/directives/<agent-id>/
File: DIRECTIVE-<nnn>-<slug>.md

Required front-matter:

- directive_id
- kind: OWNER-DIRECTIVE or COORDINATOR-DIRECTIVE
- from
- to
- workstream
- issued
- repository_tip
- status: OPEN, ACCEPTED, DONE, DECLINED, or SUPERSEDED

Required sections:

- Objective
- Required reads
- Required work
- Constraints
- Completion criteria
- Required durable outputs

Agents MUST check their directive directory at session bootstrap and before starting a new task. A directive is operational coordination, not Ω law and does not grant runtime permission. If it conflicts with higher authority, the agent records a CONFLICT and does not perform the conflicting action.
