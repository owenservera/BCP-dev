# CHARTER.md — AMP-1 Autonomous Mission Protocol adoption

> **Classification: DERIVED — CURRENT**

```yaml
mission_id: AMP-1
goal: One-time adoption of the Autonomous Mission Protocol (missions, design-context ledger, automatic context updating, thinker lane) per OWNER-DIRECTIVE AMP-1.
done_criteria:
  - Section 5 self-test passes with evidence in missions/amp-1/evidence/
  - A fresh participant starting from AGENTS.md reaches this mission's NEXT_ACTION via context/DIGEST.md and STATE.md alone
  - agent-tools/agent_lint.py is green
write_allowlist:
  - docs/agent-system/**
  - agent-tools/**
  - bcp-speed/bcp/.opencode/plugins/context-flush.js
  - bcp-speed/bcp/ops-install.ps1
allowlist_ignore:
  - bcp-algos/**
  - setupdocs.zip
  - docs/REPO-CLEANUP-PROMPT-V2.md
budget:
  wall_hours: 8
  commits: 60
escalation_triggers:
  - Tier 2 action needed
  - Same approach failed twice
  - Budget at 80 percent
  - Omega law contradicts the charter
  - A regression that cannot be fixed
tier_ceiling: 1
approved_by: owner (chat, 2026-09-24)
approved_on: 2026-09-24
status: ACTIVE
```

## Goal

Execute OWNER-DIRECTIVE AMP-1 end to end with no further owner input: tiers and
escalation (`AUTONOMY.md`), missions, the design-context ledger, four-layer
automatic context updating, the external thinker lane, deterministic stdlib
tooling, protocol amendments, and a deterministic self-test.

## Non-goals

No P1-02 to P1-09 implementation. No self-merge to `main` in this bootstrap
run (owner reviews first). No OS scheduled-task registration. No new daemons,
databases, embeddings, or dependencies.
