# Migration Review Process — How Cards Land

> **Every card that migrates from the existing code to the new repo goes through this.** No exceptions. The review is fast (per-card, not per-wave) but it must happen.

---

## The Per-Card Migration Flow

```
CARD (in .backbone/cards/)
  ↓
[1] READ — I read the card + the source code in the existing repo
  ↓
[2] VERDICT — copy | rewrite | skip (with reason)
  ↓
[3] IF copy:
       a. Locate target folder in landing skeleton
       b. Copy the engines + tests
       c. Adjust imports (to new path conventions)
       d. Fix boundary violations (kernel can't import plugins, etc.)
       e. Run all tests for the card → must pass
       f. Commit: card(F-007): migrate capability-registry to kernel/capability
  ↓
[3] IF rewrite:
       a. Identify what's wrong (naming? coupling? structure?)
       b. Write the new version in the landing
       c. Port tests
       d. Run all tests → must pass
       e. Commit: card(F-007): rewrite capability-registry in kernel/capability
  ↓
[3] IF skip:
       a. Document why (in the card's `dropped_reason`)
       b. Mark card as DROPPED
       c. Commit: card(F-007): drop — replaced by kernel/capability/contract
  ↓
CARD transitions to MAPPED in landing → DESIGNED → SCAFFOLDED → PARTIAL → WORKING
```

---

## The Verdicts

### COPY (the default for WORKING cards)

**Use when:**
- The engine has clean naming
- The code does what the card says (no hidden behavior)
- The test coverage is real (not placeholder)
- The file structure matches the landing (or close)
- No circular dependencies

**Examples from our 40 cards:**
- F-007 capability-registry → COPY → `kernel/capability/`
- F-002 memory-system → COPY → `plugins/memory/`
- F-011 stream-parsing → COPY → `plugins/parsing/`
- F-014 sandbox-security → COPY → `kernel/security/`

### REWRITE (when the code is fundamentally wrong shape)

**Use when:**
- The naming is unclear or misleading
- The file does too many things (split needed)
- There are hidden dependencies not in the card
- The test mocks reveal the engine can't be tested cleanly
- The boundary is wrong (it's in kernel/ but shouldn't be, or vice versa)

**Examples from our 40 cards:**
- F-034 frontend-surfaces → REWRITE → `surfaces/web/` (restructure per new layout)
- F-001 conversation-system → REWRITE → `kernel/execution/` or new `kernel/conversation/` (failing tests, missing design)
- F-039 test-suite → REWRITE → `tests/` (restructure per layer)

**When to rewrite:** when the cost of fixing the existing file is MORE than the cost of writing a new one with the right structure. The new one is then the canonical reference.

### SKIP (the code isn't worth bringing)

**Use when:**
- The engine is dead code (no callers, no tests, no users)
- The engine is replaced by something better in the new design
- The engine is a workaround for a problem the new design solves differently
- The engine has security issues that would require a full rewrite anyway

**Examples from our 40 cards:**
- F-024 workspace-presets → SKIP if the preset system is replaced by explicit config
- F-031 humanization-ux → SKIP if the UX layer is rebuilt without this abstraction
- Any card whose purpose is replaced by a different design decision

**Important:** SKIP is not "ignore." It's "explicitly decide not to bring this." The reason is documented in the card. If the principal wants it later, the card can be resurrected (with a new commit).

---

## Who Decides

### Me (Pro) decides:
- Technical boundary (kernel vs plugin vs surface)
- Verdict (copy / rewrite / skip)
- Module placement within the landing
- Dependency rules
- Architecture tests

### You (principal) decide:
- Whether a rewrite is worth the time
- Whether to skip a card
- Whether to admit a net-new feature
- Whether a wave is ready to ship to friends
- Friend interest and value target alignment

### Both decide:
- Whether the landing skeleton itself should change (rare, requires amending LANDING-SKELETON.md)
- Whether the migration review process should change (requires amending this doc)

---

## The Review Triggers (When to Re-review)

Re-review a card if:
- A new test fails (in the new repo)
- A boundary violation is detected by arch tests
- The card's design changes
- A net-new card is admitted that depends on this one
- The principal asks

**Default:** Once WORKING, the card doesn't need re-review unless something triggers it.

---

## The Per-Card Commit Message Format

```
card(<CARD-ID>): <verdict> <card-name> to <landing-path>

[Optional: short explanation of the verdict]

Refs: backbone/cards/<CARD-ID>-<slug>.json
```

**Examples:**
```
card(F-007): copy capability-registry to kernel/capability
card(F-001): rewrite conversation-system to kernel/conversation (3 failing tests fixed, design cleaned)
card(F-024): skip workspace-presets (replaced by explicit config in infra/backend-server/config)
```

---

## The Per-Card Test Gate

Before the card transitions to WORKING in the landing:
- All tests from the source repo must pass (or be intentionally ported + fixed)
- Architecture tests must pass (no boundary violations)
- TypeScript must compile (`bun x tsc --noEmit`)
- Biome must pass (`bun run lint`)

The card's `last_verified` timestamp updates when the gate passes.

---

## The Per-Card Documentation

Every folder that gets code gets a `README.md` (max 50 lines) that says:
1. What lives here
2. What can import this
3. What this can import
4. One example card (the canonical example)
5. Where to add new code

This is part of the migration. No code lands without a README for its folder.

---

## The Migration Order (Dependency-Based)

```
1. kernel/types          (no deps, must be first)
2. kernel/storage        (uses types)
3. kernel/identity       (uses types, storage)
4. kernel/security       (uses types)
5. kernel/capability     (uses types, identity)
6. kernel/execution      (uses types, capability)
7. plugins/*             (depend on kernel)
8. surfaces/*            (depend on kernel + plugins)
9. infra/*               (depends on everything)
10. tests/               (verifies everything)
```

**Why this order:** each layer can only depend on what's already in place. Kernel is the foundation. Plugins need kernel. Surfaces need kernel + plugins. Infra wraps it all. Tests verify the whole stack.

**Cards within a layer can be parallelized** (multiple agents can migrate different cards simultaneously if isolated correctly).

---

## The First Migration (The Example)

**F-007 capability-registry** is the best first card to migrate:
- It's WORKING (111 tests pass)
- It IS the kernel (F-007 maps directly to `kernel/capability/`)
- It's pure (no UI, no chrome, no storage)
- It's well-tested (the highest test count of any card)
- It defines the contract other cards depend on

**Migration steps for F-007:**
1. Copy `src/engines/capability.ts` → `kernel/capability/contract.ts`
2. Copy `src/engines/capability-bootstrap.ts` → `kernel/capability/registry.ts`
3. Copy `src/engines/capability-resolution.ts` → `kernel/capability/resolver.ts`
4. Copy `src/engines/capability-event-bus.ts` → `kernel/capability/event-bus.ts`
5. Copy `src/engines/capability-snapshot.ts` → `kernel/capability/snapshot.ts`
6. Copy `src/engines/capability-taxonomy.ts` → `kernel/capability/taxonomy.ts`
7. Copy `src/engines/unified-registry.ts` → `kernel/capability/unified-registry.ts`
8. Copy `src/engines/live-capability-registry.ts` → `kernel/capability/live-registry.ts`
9. Adjust imports (`../../../kernel/capability/contract.js` instead of relative paths)
10. Copy tests → `kernel/capability/tests/`
11. Add `kernel/capability/README.md`
12. Run gate: `bun .backbone/gate.ts --card F-007`
13. Commit: `card(F-007): copy capability-registry to kernel/capability`

**Estimated time:** 30-60 minutes for a full migration of a well-tested card.

---

## What I'll Do Without Asking

- Copy WORKING cards that map cleanly to the landing
- Fix obvious import path issues
- Add folder READMEs
- Run the test gate after each card

## What I'll Ask Before Doing

- Any REWRITE verdict
- Any SKIP verdict
- Any change to the landing skeleton
- Any change to this review process
- Any admission of a net-new feature beyond rubric

---

*This is the migration review process. It can be amended by the principal with a commit to this file.*
