# STATE.md — MISSION-000-selftest (mutable fixture state)

> **Classification: DERIVED — CURRENT**

```yaml
mission_id: MISSION-000-selftest
agent_id: IMPL-04
branch: mission/amp-1
last_commit_inspected: 6326c60
updated: 2026-09-24
status: PAUSED
```

## POSITION

Self-test complete (evidence in missions/amp-1/evidence/recovery.log):
resume reconstructed position/branch/wip/NEXT_ACTION from repo files
alone; injected branch mismatch + stale tip were flagged. Fixture
retired; scratch.txt left uncommitted on purpose with its wip ref below.

## DONE

- Fixture charter and STATE written and committed.

## IN_PROGRESS

- None (PAUSED fixture; do not act).

## NEXT_ACTION

Run python agent-tools/agent_views.py resume MISSION-000-selftest and continue from the reported position.

## UNCOMMITTED

- docs/agent-system/missions/MISSION-000-selftest/scratch.txt (uncommitted fixture work)
- wip ref: refs/wip/MISSION-000-selftest/20260924T194148Z

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
