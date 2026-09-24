# CHARTER.md — MISSION-000-selftest (recovery-test fixture, NOT a real mission)

> **Classification: DERIVED — CURRENT**

```yaml
mission_id: MISSION-000-selftest
goal: Prove repository-only recovery (AMP-1 section 5.2); do not act on this fixture.
done_criteria:
  - resume reconstructs position, branch, wip ref, NEXT_ACTION from repo files alone
  - injected branch mismatch and stale tip are flagged, not guessed past
write_allowlist:
  - docs/agent-system/missions/MISSION-000-selftest/**
allowlist_ignore:
  - bcp-algos/**
  - setupdocs.zip
  - docs/REPO-CLEANUP-PROMPT-V2.md
budget:
  wall_hours: 1
  commits: 5
escalation_triggers:
  - Tier 2 action needed
tier_ceiling: 1
approved_by: AMP-1 self-test (fixture, not a real mission)
approved_on: 2026-09-24
status: ACTIVE
```

## Goal

Self-test fixture for AMP-1 §5.2. No real work happens here.

## Non-goals

Everything. Do not act on this fixture.
