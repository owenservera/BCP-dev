# AUTONOMY.md — mission tiers and escalation (the standing approval)

> **Classification: DERIVED — CURRENT**
> This file is procedure, not Omega law. Changing this file is a Tier 2
> action (owner only).

One owner approval per mission (its charter), not one approval per task.
Stop-by-default becomes go-by-default inside the charter, with named
escalation triggers. Everything outside the charter or in Tier 2 still
needs the owner.

## Tiers

- **Tier 0 (no approval, self-merge):** create or modify files under
  `docs/agent-system/context/**` and `docs/agent-system/missions/**` on
  your mission branch.
- **Tier 1 (charter-approved, self-merge at milestone when gates are
  green):** any path listed in the mission charter's `write_allowlist`,
  on your mission branch, including code and tests. Gates: `agent_lint.py`
  GREEN plus whatever gate the charter names (Omega gate, BCP validate).
- **Tier 2 (owner only):** edits to RATIFIED Omega decisions; anything
  under `vivim-original-baseline/`; the hands-off surfaces (`bcp-algos/`,
  `setupdocs.zip`, `docs/REPO-CLEANUP-PROMPT-V2.md`, unratified
  `omega-baseline/omega-final/docs/architecture/` and
  `omega-baseline/omega-final/examples/plugin-echo2/`); deleting or
  rewriting any transcript, packet, or insight; BCP state except via
  `bcp_tool.py`; pushing `main` or any force-push; installing OS scheduled
  tasks or any host-level change; changing `AUTONOMY.md` itself; changing
  the P1-01 PROVEN verdict; any path outside the charter allowlist.

## Escalation triggers

Record an `ESCALATION` in the mission STATE, then continue with other
in-scope work. Stop the mission only if fully blocked.

- A Tier 2 action is needed.
- The same approach failed twice.
- Budget at 80 percent (default budget: 8 hours wall clock, 60 commits).
- Omega law contradicts the charter.
- A regression you cannot fix.

## Ask, don't block

When you hit a design question you cannot settle from the repo, write a
`QUESTION` insight (kind QUESTION, `to:` agent/thinker/owner) with your
working assumption and the cost of reversing it, then proceed on the
assumption. Answers arrive asynchronously from the thinker or owner and
are applied at the next checkpoint.
