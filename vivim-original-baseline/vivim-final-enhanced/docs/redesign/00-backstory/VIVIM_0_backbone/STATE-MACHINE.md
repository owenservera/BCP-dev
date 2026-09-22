# State Machine — FEATURE_CARD Lifecycle

> Atomic, per-feature. No bulk moves. One commit per transition.

## States

```
DISCOVERED → MAPPED → DESIGNED → SCAFFOLDED → PARTIAL → WORKING → SHIPPED → MAINTAINED
     ↓          ↓         ↓           ↓          ↓         ↓          ↓
  DROPPED (with reason, atomic)
```

| State | Meaning | What I can verify |
|-------|---------|-------------------|
| **DISCOVERED** | Found in code scan. No review yet. | File exists in `src/engines/` |
| **MAPPED** | I've read the source, know what it does, know what it depends on. | Read + dependency walk done |
| **DESIGNED** | Migration plan written. Conflicts identified. Cleanup scope clear. | Has a `migration:` block with steps |
| **SCAFFOLDED** | Files/contracts exist. Tests scaffolded. Doesn't fully work yet. | At least one test file exists, may not pass |
| **PARTIAL** | Some tests pass. Core works but edge cases fail. | >= 50% tests passing |
| **WORKING** | All tests pass. No conflicts. No cleanup debt. SOTA-current. | Gate passes for this card |
| **SHIPPED** | In a wave that reached friends. | Wave JSON has this card and `shipped_at` set |
| **MAINTAINED** | Active in prod. Gate-tracked on every refresh. | Appears in `runs/` for last 3 refreshes |
| **DROPPED** | Intentionally not built. | `reason` field required |

## Transitions

Each transition is **one commit** with a message like:
```
feature(F-001): MAPPED → DESIGNED
feature(F-005): WORKING (shipped in wave W-2026-09-A)
feature(F-022): DROPPED (replaced by F-007 capability-registry v2)
```

Each transition **updates**:
- `state` field
- `last_verified` timestamp
- If transitioning to WORKING: clear `cleanup_debt`
- If transitioning to DROPPED: set `reason`, `dropped_at`
- If transitioning to SHIPPED: set `shipped_in_wave`, `shipped_at`

## What I WILL NOT do

- Skip states (DISCOVERED → WORKING without going through MAPPED/DESIGNED)
- Move a card with unverified dependencies
- Mark WORKING if any test in its cluster is failing
- Mark SHIPPED without an actual wave definition

## Atomic Cleanup Rule

When a card transitions to WORKING, its `cleanup_debt` MUST be empty.
When a card is dropped, its `files_to_remove` list is executed in the same commit.

This makes cleanup **invisible to users** and **traceable to cards**.
