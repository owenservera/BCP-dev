# Project Backbone — The Living System

> **Owner:** I own this. This is the source of truth for what we're building, what state it's in, and what comes next.
> **Severed from:** vivim-final blueprints, MASTER-BLUEPRINT, KB-ARCHITECTURE, REFORGE gate model. Those are reference material at best.
> **Refreshed:** Every time work happens. Atomic. Per-feature. No bulk moves.

---

## Current State (2026-08-28 12:10 UTC)

| Metric | Value |
|--------|-------|
| **FEATURE_CARDs** | 41 (40 discovered from code + 1 admitted: voice-input) |
| **WORKING** | 32 (78%) |
| **SCAFFOLDED** | 2 (F-001 1 fail remaining, F-005 3 failing tests) |
| **DISCOVERED** | 6 (infrastructure: F-034..F-039) |
| **Tests passing** | 1,234 (improved from 1,233 — F-001 test fix) |
| **Tests failing** | 5 (down from 6) |
| **Cards mapped to landing** | 40 (see LANDING-SKELETON.md) |
| **Landing skeleton** | DESIGNED (4 layers: kernel, plugins, surfaces, infra) |
| **Migration review process** | DESIGNED (copy / rewrite / skip per card) |
| **Net-new spec format** | DESIGNED (template in SPEC-TEMPLATE.md) |
| **Voice input spec** | WRITTEN (`specs/proposed/voice-input.md`) |
| **Cards shippable to friends** | 21 |

---

## What Lives Here

```
.backbone/
  BACKBONE.md              ← this file (overview, always current)
  STATE-MACHINE.md         ← lifecycle states + transitions
  ADMISSION-RUBRIC.md      ← how new features get in (scoring)
  SPEC-TEMPLATE.md         ← format for net-new project specs
  LANDING-SKELETON.md      ← the target repo structure (THE constitution)
  MIGRATION-REVIEW.md      ← per-card review process (copy/rewrite/skip)
  runner.ts                ← discovers engines, produces cards
  test-mapper.ts           ← maps test files to cards
  gate.ts                  ← runs tests per card, validates transitions
  wave-planner.ts          ← groups cards into shippable waves
  admit.ts                 ← handles net-new feature admission
  refresh.ts               ← single command that runs the full pipeline
  cards/                   ← one FEATURE_CARD.json per feature (41 files)
  waves/                   ← shippable batches (3 ship + 3 arch waves)
  admissions/              ← ADMISSION_REQUEST log (1 admitted)
  specs/                   ← net-new project specifications
    proposed/              ← submitted, awaiting review
      voice-input.md       ← AR-001 spec (filled out)
    approved/              ← reviewed, ready to land
    implemented/           ← built, in production
    rejected/              ← documented for the record
  runs/                    ← gate run records (regeneration history)
```

---

## The 4 Document Categories (Read In Order)

1. **LANDING-SKELETON.md** — Where code lives. The target structure. The constitution.
2. **STATE-MACHINE.md** — How cards move. The lifecycle. Atomic transitions.
3. **ADMISSION-RUBRIC.md** — How new things get in. The 8-criteria scoring.
4. **MIGRATION-REVIEW.md** — How existing things land. Per-card copy/rewrite/skip.

**Plus:**
- **SPEC-TEMPLATE.md** — The format for net-new project specs
- **BACKBONE.md** (this file) — The overview, always current

---

## How It Works

1. **`runner.ts`** scans `src/engines/` and produces 40 feature cards (one per cluster)
2. **`test-mapper.ts`** maps test files to cards by import parsing (34/40 covered)
3. **`gate.ts`** runs the test suite for each card and advances SCAFFOLDED → WORKING when all tests pass
4. **`wave-planner.ts`** groups WORKING cards into SHIP waves (Friends Alpha/Beta/Gamma) and NOT-WORKING cards into ARCH waves
5. **`admit.ts`** handles net-new feature requests with the rubric (threshold 12/22)
6. **`refresh.ts`** runs the full pipeline in one command
7. **Per-card migration** uses the verdict from MIGRATION-REVIEW.md (copy / rewrite / skip)
8. **Net-new flow** uses SPEC-TEMPLATE.md to write the spec, then admit.ts to score it

**One command refreshes the whole system:**
```bash
bun .backbone/refresh.ts           # full refresh
bun .backbone/refresh.ts ship      # only ship view
bun .backbone/refresh.ts arch      # only arch view
```

---

## Friends Alpha — The First Wave (ready to ship)

**W-2026-09-A — 8 cards, 3 friend testers, low risk:**

| Card | Name | Tests | Value | Landing |
|------|------|-------|-------|---------|
| F-015 | Governance & Policy | 57 pass | V-1, V-2 | kernel/security |
| F-007 | Capability Registry | 111 pass | V-1, V-3 | kernel/capability |
| F-009 | Execution Kernel | 76 pass | V-1, V-3 | kernel/execution |
| F-014 | Sandbox & Security Eval | 37 pass | V-1, V-2 | kernel/security |
| F-019 | Lifecycle & Session | 89 pass | V-1, V-3 | kernel/identity |
| F-021 | User Identity & Contacts | 33 pass | V-1, V-2 | kernel/identity |
| F-002 | Memory System (FSRS-6) | 26 pass | V-1, V-3 | plugins/memory |
| F-004 | Context Assembly | 23 pass | V-1, V-3 | plugins/retrieval |

---

## The Landing (Target Repo Structure)

**See `LANDING-SKELETON.md` for the full constitution.** Summary:

```
vivim-next/
├── kernel/          # IRREDUCIBLE — capability, execution, storage, identity, security, types
├── plugins/         # REPLACEABLE — providers, retrieval, memory, parsing, agents, sync, MCP
├── surfaces/        # USER INTERACTION — web, desktop, cli, api
├── infra/           # BUILD/DEPLOY — seed, devops, build, logging, observability
├── tests/           # Cross-cutting — integration, e2e, arch, chaos
├── specs/           # Net-new project specs (proposed → approved → implemented)
├── docs/            # USER-FACING only (no design notes)
├── .backbone/       # The tracking system (synced from control room)
└── README.md        # Constitution
```

**Dependency rule:** `kernel → plugins → surfaces → infra`. Enforced by arch tests.

---

## Arch Work — What Needs Fixing Before Ship

**W-ARCH-001 — Conversation System Hardening (F-001):**
- 1 remaining failing test in conversation-manager
- Effort: S
- Blocks: SHIP for full conversation UX

**W-ARCH-002 — Provider + CDP Stabilization (F-005):**
- 3 failing tests in ChromeGovernor / CDP integration
- Effort: M
- Blocks: SHIP for multi-provider value (chatgpt, claude, gemini, etc.)

**W-ARCH-003 — Infrastructure Coverage (F-034..F-039):**
- Frontend surfaces, desktop installer, dual-DB, seeds, devops, test suite
- Currently DISCOVERED (no engine-level tests)
- Need test strategy for each
- Effort: M per card
- Risk: LOW

---

## Net-New Features — Admission Flow

When something is not in the code yet, it goes through:

1. **Spec** — write using `SPEC-TEMPLATE.md`, save in `specs/proposed/<slug>.md`
2. **Admission** — `bun .backbone/admit.ts propose <slug> "<name>" '<rubric-json>'`
3. **Scoring** — rubric auto-scores (8 criteria, 22 max, threshold 12)
4. **Decision** — admit / research / drop
5. **If admit** — spec moves to `specs/approved/`, FEATURE_CARD created, design begins

**Admitted so far:**
- **AR-001 Voice Input** — 19/22, ADMITTED, now F-041 (MAPPED)
- Spec: `specs/proposed/voice-input.md` (filled out, awaiting your review)

---

## Migration Review Process (Per Card)

For each of the 40 cards being migrated from the existing code:

1. **Read** the card + source code
2. **Verdict** — copy / rewrite / skip (with reason)
3. **Execute** — migrate, fix imports, run tests, commit
4. **Gate** — all tests pass, card transitions to WORKING in landing

**Who decides:**
- Me (Pro): technical boundary, verdict, module placement
- You (principal): rewrite vs copy, skip, value, ship to friends

**Per-card commit:** `card(F-007): copy capability-registry to kernel/capability`

**See `MIGRATION-REVIEW.md` for the full process.**

---

## What I Will Not Do

- **Inherit the old planning documents as ground truth.**
- **Create 100+ cards on day one.**
- **Use the G0-G8 gate numbering as a constraint.**
- **Treat the REFORGE model as a script to follow.**
- **Migrate code before the landing skeleton is agreed** (it's agreed now).
- **Hesitate to drop things.** DROPPED with a reason.
- **Move a card to WORKING with failing tests.**

---

## Next Actions (Immediate)

1. **Review the landing skeleton** (LANDING-SKELETON.md) — does the 4-layer split match your mental model?
2. **Review the migration review process** (MIGRATION-REVIEW.md) — are copy/rewrite/skip the right verdicts?
3. **Review the voice input spec** (specs/proposed/voice-input.md) — is the design right?
4. **Approve the first card to migrate** — F-007 capability-registry is the recommended first
5. **Continue fixing the remaining 5 failing tests** — F-001 (1) and F-005 (3)
6. **Admit 2-3 more net-new features** if voice input spec is approved

---

*This file is regenerated by tooling. If you see drift between this and reality, run: `bun .backbone/refresh.ts`*
