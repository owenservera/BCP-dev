---
description: Write this session's completion receipt per SESSION-RESULT-CONTRACT.md before stopping.
agent: architecture-steward
---

Before this session ends, create:

```
<AGENT-HOME>/RESULTS/<SESSION_ID>.md
```

using exactly the field list in
`AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SESSION-RESULT-CONTRACT.md`
(`SESSION_STATUS`, `SESSION_ID`, `CFA / AGENT`, `IDENTITY`, `AGENT_ID`, `TARGET_REF`,
`BASE_MAIN_SHA`, `TASK`, `EXECUTION_STRATEGY`, `STRATEGY_RATIONALE`, `RESULT`,
`FILES_CHANGED`, `COMMIT_SHA`, `PREDECESSOR_VERIFIED`, `OWNER_ALIGNMENT`,
`LESSONS_UPDATED`, `COMMONS`, `UNRESOLVED`, `BLOCKERS`, `BOUNDARIES_ACTIVATED`,
`OMEGA_LAW_CHANGED`, `IMPLEMENTATION_STARTED`, `NEXT_REQUIRED_STEP`).

Hard rules, not suggestions:

- Use the same factual result already reported in chat. Do not invent identifiers,
  commit SHAs, or test results.
- `SESSION_STATUS: DONE` is only correct when **all four** of: (1) the required
  durable change exists, (2) an exact commit/ref contains it, (3) this receipt file
  exists, (4) `TASKS.md` is updated to `DONE`. If any is missing, use `BLOCKED` or
  `PARTIAL`.
- If repository write capability is unavailable and the receipt cannot be persisted,
  report `BLOCKED`/`PARTIAL` in chat rather than silently ending as if complete.
- Never overwrite a prior session's receipt file — always a new `<SESSION_ID>.md`.

After writing the receipt, update `TASKS.md` in the same agent home to reflect the
resulting status (`DONE`, `BLOCKED`, or `SUPERSEDED`), and only then end the session.
