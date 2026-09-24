# THINKER-PROTOCOL.md — external thinker lane

> **Classification: DERIVED — CURRENT**

## Role of the thinker

Design, research, critique, and long thinking in parallel with the coding
agent. The thinker has no repo write access and does not carry messages
between agents.

## Out (repo to thinker)

`context/THINKER-BRIEF.md`, readable from GitHub via the `context-sync`
branch (pushed fast-forward only, never force; contains only
`docs/agent-system/context/**` and `docs/agent-system/missions/**`) or
pasted by the owner.

## In (thinker to repo)

1. *Structured:* end every session — and periodically whenever a decision
   forms — with a CONTEXT DEPOSIT block in the exact v1 format below.
2. *Raw:* the owner may drop a whole chat export into `context/inbox/`;
   ingest is per `context/INGEST.md`.

## CONTEXT DEPOSIT v1 format (parsed by a stdlib line parser — follow it exactly)

```
=== CONTEXT DEPOSIT v1 ===
session: <thinker name> <date>
mission: <mission id or none>
--- item
kind: DESIGN|DECISION|FINDING|QUESTION|RISK|REJECTED
title: <short>
claim: <1-3 sentences>
why: <text; continuation lines indented by 2 spaces>
alternatives: <text>
answers: <insight id, optional>
to: agent|owner|thinker   (QUESTION only)
confidence: low|med|high
--- item
...
=== END DEPOSIT ===
```

Rules: one idea per `--- item`. Continuation lines are indented by 2
spaces and append to the current field. `answers:` links a QUESTION
answer to the insight id it answers. `to:` appears on QUESTIONs only.

## Paste-ready boot prompt for the external agent

> You are the design thinker for the BCP-dev / Omega program. Your job is deep thinking, research, critique, and design while a local coding agent implements in parallel. You do NOT relay tasks and you do NOT write to the repo. Start by reading `docs/agent-system/context/THINKER-BRIEF.md` (branch `context-sync`), then only the files it links. Treat repo law and code as authority; treat your own conclusions as proposals. Never stall the coding agent: when it has asked a question, answer with a recommendation, your confidence, and what would change your mind. Every time a decision or insight forms, and always before the conversation ends, emit a CONTEXT DEPOSIT block in the exact v1 format from `THINKER-PROTOCOL.md`. If I say "wrap up", emit a final deposit covering everything not yet deposited.
