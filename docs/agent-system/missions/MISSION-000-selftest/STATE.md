# STATE.md — MISSION-000-selftest (mutable fixture state)

> **Classification: DERIVED — CURRENT**

```yaml
mission_id: MISSION-000-selftest
agent_id: IMPL-04
branch: mission/amp-1
last_commit_inspected: a22e0e1
updated: 2026-09-24
status: ACTIVE
```

## POSITION

Recovery-test fixture at the interruption point: bounded work is done,
uncommitted scratch remains, wip snapshot taken.

## DONE

- Fixture charter and STATE written and committed.

## IN_PROGRESS

- Interrupted here on purpose; recovery continues from NEXT_ACTION.

## NEXT_ACTION

Run python agent-tools/agent_views.py resume MISSION-000-selftest and continue from the reported position.

## UNCOMMITTED

- docs/agent-system/missions/MISSION-000-selftest/scratch.txt (uncommitted fixture work)
- wip ref: pending (filled before resume)

## DECISIONS_IN_FORCE

None.

## OPEN_QUESTIONS

None.

## ESCALATIONS

None.

## DO_NOT

- Do not act on this fixture beyond the self-test; it is not a real mission.

## RESUME

1. Read AGENTS.md, then context/DIGEST.md, then this file.
2. Run `python agent-tools/agent_views.py resume MISSION-000-selftest`.
3. Continue from the reported NEXT_ACTION.
