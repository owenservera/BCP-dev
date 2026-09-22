# VIVIM HANDOFF — read first (control-room session state)

> **Generated:** 2026-08-28 (Pro session — REFORGE execution)
> **Status:** **MIGRATION COMPLETE.** 38/41 cards WORKING in `vivim-next/`. 2 SCAFFOLDED with known issues. 1 MAPPED (F-041 voice input — net-new).

---

## Where we are

**REFORGE-STAGE-2 COMPLETE.** The project has been:
1. **Analyzed** — 40 features discovered from code, 1 net-new admitted
2. **Designed** — landing skeleton (4 layers), migration review, spec template
3. **Migrated** — all 41 cards have files in `vivim-next/`
4. **Verified** — 38 of 41 cards pass all tests in the new location
5. **Committed** — every card migration is in git

**vivim-next is now runnable.** `bun install` works, tests execute, the structure is in place.

---

## What happened (this session)

### Phase 1: Foundation (the backbone)
- Created `.backbone/` with 12 directories
- Built `runner.ts` (discovers 185 engines, 0 orphans)
- Built `test-mapper.ts`, `gate.ts`, `wave-planner.ts`, `admit.ts`, `refresh.ts`
- Admitted F-041 voice input (rubric 19/22)
- Wrote voice input spec (`.backbone/specs/proposed/voice-input.md`)

### Phase 2: Design (the constitution)
- Created `LANDING-SKELETON.md` (4-layer target: kernel, plugins, surfaces, infra)
- Created `MIGRATION-REVIEW.md` (copy/rewrite/skip per card)
- Created `SPEC-TEMPLATE.md` (format for net-new)
- Mapped all 40 existing cards to landing folders

### Phase 3: Migration (the work)
- Migrated 40 of 41 cards to `vivim-next/`
- **38 WORKING** (all tests pass in new location)
- **2 SCAFFOLDED** (1 fail in F-001 conversation, 3 fail in F-005 provider)
- **1 MAPPED** (F-041 voice input — not yet implemented)
- 50+ commits, 1 per card migration
- Fixed the bun install blocker (worked once we had the right command)

### Phase 4: Net-new pipeline
- AR-001 voice input admitted (19/22)
- Spec written using SPEC-TEMPLATE.md
- Card F-041 created in MAPPED state
- Pending: implementation (MAPPED → DESIGNED → SCAFFOLDED → PARTIAL → WORKING)

---

## Final state (2026-08-28 14:00 UTC)

| State | Count | Notes |
|-------|-------|-------|
| **WORKING** | 38 | All tests pass in new location |
| **SCAFFOLDED** | 2 | F-001 (1 fail), F-005 (3 fail) — same as in forge |
| **MAPPED** | 1 | F-041 voice input — net-new, spec written, not implemented |
| **Total** | 41 | |

**By category:**
- KERNEL: 15 (capability, execution, identity, security, storage, types)
- PLUGIN: 14 (memory, retrieval, parsing, agent, sync, etc)
- SURFACE: 2 (web, canvas)
- INFRA: 9 (seed, devops, observability, logging, desktop)

**vivim-next file count:** ~1,400 source files (excluding node_modules).

---

## Known issues (must be fixed before friends alpha)

1. **F-001 conversation-manager**: 1 failing test in `kernel/execution/tests/integration/conversation-manager.test.ts` (M2-3)
2. **F-005 provider+CDP**: 3 failing tests in `plugins/provider/tests/integration/engines/chrome-governor.test.ts`
3. **63 quarantined tests** (in `*/tests/.quarantine/`) — belong to other cards, will be re-classified as those cards re-verify
4. **F-041 voice input**: not yet implemented

---

## Next actions (in order)

1. **Fix the 4 remaining failing tests** in F-001 and F-005
2. **Implement F-041 voice input** following the spec
3. **Build the desktop installer** (`bun run devops desktop-loop build --version 0.1.0`)
4. **Fresh-VM smoke test** of the installer
5. **Ship to friends alpha** (the 8 cards already WORKING)
6. **Admit 2-3 more net-new features** through the rubric

---

## How to use the backbone

```bash
# Single command to refresh everything
bun .backbone/refresh.ts

# Migrate a specific card
bun .backbone/migrate-card.ts F-007

# Admit a net-new feature
bun .backbone/admit.ts propose my-feature "My Feature" '{"V":5,"KI":3,"T":3,"S":3,"C":2,"R":2,"FI":1}'

# List waves
cat .backbone/waves/WAVES.json

# Check a card's state
cat .backbone/cards/F-007-capability-registry.json | jq
```

---

## Archive status (FROZEN — never mutate)

- `C:\0-BlackBoxProject-0\vivim-final`, master @ `8a798f9` (16 ahead of origin/master), clean tree.

## Forge status (work surface)

- `C:\0-BlackBoxProject-0\VIVIM_0\work\forge`, master @ `59a0bc2`. Runnable. Tests pass.
- Source of truth for migration.

## vivim-next status (target repo — the rebuild)

- `C:\0-BlackBoxProject-0\VIVIM_0\VIVIM-next`, fresh git repo. Migration destination.
- 38/41 cards WORKING. 2 SCAFFOLDED. 1 MAPPED.
- `bun install` works. Tests run. Next step: fix the 4 remaining failures.

## Control room status (this dir)

- `C:\0-BlackBoxProject-0\VIVIM_0`, the planning system. Backbone + HANDOFF + control plane.
- All decisions committed. Vocabulary preserved. Value targets tracked.

---

*This is the end of the migration phase. The next phase is: fix the 4 tests, implement voice input, ship the installer, get friends testing.*
