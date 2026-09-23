---
directive_id: DIR-001
kind: OWNER-DIRECTIVE
from: owner
to: IMPL-02
workstream: WS-001
issued: 2026-09-24
repository_tip: f0685ed
status: DONE
---

# Finish P1-01 — Cooperative Agent System

## Objective

Finish the currently defined P1-01 / WS-001 work, rather than starting another workstream.

The goal is to take the cooperative-agent substrate from Phase 1 into a demonstrated, durable working system.

## Required reads

Read in this order:

1. /AGENTS.md
2. /BUILD_CONTEXT.md
3. /docs/CURRENT-CONTEXT.md
4. /docs/agent-system/CHATGPT-BOOT.md
5. /docs/agent-system/CURRENT.md
6. /docs/agent-system/P1-WORKSTREAM-PORTFOLIO.md
7. /docs/agent-system/WORKSTREAMS.md
8. docs/agent-system/workstreams/WS-001/README.md
9. docs/agent-system/workstreams/WS-001/LAUNCH-IMPL-02.md
10. docs/agent-system/workstreams/WS-001/SETUP-PROMPT-IMPL-02.md
11. the latest WS-001 handoff and packets

Also verify the current repository tip before acting.

## Required work

Continue from the existing Phase 2 starting point. Do not rebuild Phase 1.

1. Conduct the WS-001 multi-agent dogfood using at least three distinct agent identities where practical.
2. Exercise the durable exchange protocol rather than relying on direct conversation memory.
3. Run the defined F-AGENT-* cold-start, handoff, transcript-ingest, provenance/freshness/conflict, and cross-agent continuity proofs that are applicable to the current implementation.
4. Identify any protocol defects revealed by dogfood.
5. Fix only the cooperative-system defects that are inside WS-001 scope.
6. Keep the system lightweight and reuse existing Ω mechanisms instead of creating parallel ledgers, authority systems, or provenance systems.
7. Produce durable evidence for every completed proof.

## Constraints

- Do not implement P1-02 through P1-09.
- Do not create any of their setup prompts.
- Do not begin the old vivim.self implementation as a side task.
- Do not edit RATIFIED Ω decision records.
- Do not hand-edit BCP state YAML.
- Do not modify vivim-original-baseline/.
- Do not silently resolve contradictions; record them.
- Keep transcripts immutable and derived packets versioned.
- Follow the existing branch/worktree and session-ledger rules.
- CURRENT/WORKSTREAMS/ROSTER remain coordinator-owned unless this directive is explicitly accompanied by integration ownership.

## Completion criteria

P1-01 may be reported complete only when the repository contains evidence showing that:

- a fresh agent can orient from repository artifacts;
- Agent A can hand work to Agent B without hidden context;
- material conversation context can be ingested without becoming law;
- multiple agents can coordinate through durable artifacts;
- stale/historical/proposed/current distinctions survive cold start;
- the workstream can recover after the originating conversation disappears;
- remaining limitations are explicitly recorded rather than implied away.

If a proof cannot be completed, record the exact failure and why.

## Required durable outputs

At the end of the task, leave:

- Ω session-ledger evidence for the work performed;
- any required transcript artifacts;
- packet(s) containing the important findings and reasoning lineage;
- a final WS-001 handoff describing facts, proofs, failures, changed files, and next action;
- an outbox MERGE_REQUEST for coordinator-owned CURRENT/WORKSTREAMS/ROSTER changes;
- a concise statement of whether P1-01 is PROVEN, PARTIALLY PROVEN, or NOT PROVEN.

Do not merely report completion in chat. The repository artifacts are the result.

## Completion instruction

Treat this directive as the current owner instruction for IMPL-02.

Start from the repository's current state, execute the work, prove it, and leave the durable handoff.

Do not wait for another conversational prompt.

## Coordinator closure

DIR-001 was executed by IMPL-02 at commit `439b16e3d8c7eb1080ca96c8ef5544efaca11932`,
merged to `main` as part of PR #1. The resulting P1-01 verdict is
**PARTIALLY PROVEN**. Two proof closers remain explicit in the current workstream
record: genuinely independent multi-agent continuity and independent
cross-ChatGPT continuity.
