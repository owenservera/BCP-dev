# CHARTER.md template — copy to missions/<MISSION-ID>/CHARTER.md

> **Classification: DERIVED — CURRENT**

Fill every field. An agent may DRAFT a charter; it becomes ACTIVE only when the
owner approves. Record chat approvals as `owner (chat, <date>)`. An agent NEVER
approves its own charter.

```yaml
mission_id: MISSION-NNN-short-slug
goal: One sentence — the outcome, not the activity.
done_criteria:
  - Observable, checkable condition 1
  - Observable, checkable condition 2
write_allowlist:
  - docs/agent-system/missions/MISSION-NNN-short-slug/**
  - docs/agent-system/context/**
  - <rest of Tier 1 paths for this mission>
allowlist_ignore:
  - <pre-existing untracked paths this mission will never touch,
     e.g. hands-off surfaces already in the worktree>
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
approved_by: PENDING OWNER APPROVAL
approved_on: YYYY-MM-DD
status: DRAFT
```

`status` is one of DRAFT|ACTIVE|DONE|BLOCKED|PAUSED|ABANDONED.
`budget` defaults to 8 wall hours / 60 commits when omitted (AUTONOMY.md D3).
`tier_ceiling: 1` is the normal maximum; Tier 2 always needs the owner.

Charter guard (enforced by `agent_lint.py`): widening `write_allowlist`
or adding `allowlist_ignore` entries requires `approved_by: owner` in the
same charter text; dropping an owner approval while entries exist is
refused. Draft flow: commit a new charter with an EMPTY allowlist, add
paths when the owner approves.

## Goal

Expand the one-line goal: why this mission, what changes in the repo.

## Non-goals

What this mission explicitly will not do (paths, verdicts, lanes).
