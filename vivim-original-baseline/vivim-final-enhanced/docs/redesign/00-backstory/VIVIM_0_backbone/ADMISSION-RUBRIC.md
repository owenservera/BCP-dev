# Admission Rubric — Net-New Features

> When something is **not in the code yet** and someone (me, the user, a friend) wants it, it goes through this. No exceptions.

## The Rubric (8 criteria, 20 points, threshold 12)

| # | Criterion | Max | What earns points |
|---|-----------|-----|-------------------|
| 1 | **User value** (V-1..V-5) | 5 | V-1=5, V-2=4, V-3=3, V-4=2, V-5=1 |
| 2 | **Kernel independence** | 3 | No new primitive needed = 3, minor = 2, new = 1 |
| 3 | **Testability** | 3 | Clear pass/fail = 3, observable = 2, vague = 1 |
| 4 | **Specificity** (no provider/browser/UI coupling) | 3 | Pure = 3, one coupling = 2, multi = 1 |
| 5 | **Migration cost** (inverse) | 3 | <1 day=3, <1 week=2, >1 week=1, >>1 week=0 |
| 6 | **Reversibility** | 3 | Cleanly removable = 3, leaves artifacts = 2, permanent = 1 |
| 7 | **Friend interest** | 0-2 | 0=0, 1 friend=1, 2+ friends=2 |
| 8 | **Independence from in-flight work** | 0-1 | No overlap=1, overlaps=0 |

**Total: 22 possible, threshold 12 to admit.**

## Verdicts

- **12+** → ADMIT. Create a `FEATURE_CARD` in state `MAPPED`.
- **8-11** → RESEARCH. Create an `ADMISSION_REQUEST` and a research todo. Re-evaluate in next refresh.
- **< 8** → DROP. Log with reason. No card created.
- **Pro (me) can override** any verdict with `decided_by: pro` and a reason.

## Net-New Feature Flow

```
PROPOSED (someone wants it)
  ↓
ADMISSION_REQUEST created (rubric filled in)
  ↓
SCORED (machine or human)
  ↓
VERDICT (admit / research / drop)
  ↓
if admit → FEATURE_CARD created in MAPPED state
if research → tracked in admissions/ with next_review date
if drop → log + close
```

## What Counts as "Net-New"

- A new provider (e.g. "add X")
- A new engine/feature (e.g. "voice input")
- A new data model (e.g. "shopping list")
- A new UI surface (e.g. "kanban board")
- A new capability (e.g. "summarize thread")
- A new integration (e.g. "Notion import")

## What Does NOT Count

- Refactoring existing code (that's a card transition, not a new card)
- Bug fixes (those are tracked separately as `bugs/`)
- Documentation (tracked as `docs/`)
- Test improvements (card cleanup, not admission)

## Friend Interest Tracking

When a friend says "I want X," that's a data point. Multiple friends = stronger signal.
Friends are identified by their install + their explicit feature requests.
This goes in the `friend_interest: ["alice", "bob"]` field on the card.
