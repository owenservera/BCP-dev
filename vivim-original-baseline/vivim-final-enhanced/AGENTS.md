# AGENTS.md — vivim-final Project Instructions

## Project Overview

**vivim-final** is cap-store v1 Knowledge Graph Rebuild — a local-first AI conversation platform built with Bun + Prisma + TypeScript.

- **Runtime:** Bun
- **Language:** TypeScript (strict mode, ESNext target)
- **ORM:** Prisma v6.5 (3 schemas: root + system + user)
- **Linter/Formatter:** Biome
- **Git Hooks:** Lefthook
- **Testing:** Bun test runner
- **Build:** tsup (ESM + DTS)
- **Frontend:** Next.js 16 + React 19 (in `frontend/`)

## 🚨 CRITICAL: MIGRATION IS THE TOP PRIORITY 🚨

The kernel/plugin boundary migration is in progress and is owned by the closed-loop agentic system. **If you are reading this, the migration is the most important work happening in the repo right now.**

The full system is documented in **`docs/end-state/MIGRATION.md`** — read that first.

## How to drive the migration loop (READ THIS BEFORE ANYTHING ELSE)

```bash
# 1. See the state
bun run .runtime/migration/orchestrator.ts status

# 2. Verify the safety net is clean
bun run .runtime/migration/orchestrator.ts gate

# 3. Dispatch the next PR
bun run .runtime/migration/orchestrator.ts next
# This writes the prompt to .runtime/migration/prompts/<phase>-step-<n>.md
# It also sets the phase to in-progress and updates state.json

# 4. Do the work described in the prompt
# Read the prompt file. It tells you which file to move, where, and which skill to use.
# The 11 skills in .opencode/skill/migration-*/SKILL.md tell you HOW to do each kind of move.

# 5. Run the safety net
bun test tests/arch tests/fuzz
# (Other test failures are pre-existing and not your concern; see "Pre-existing test failures" below)

# 6. Record the completed PR
bun run .runtime/migration/orchestrator.ts complete

# 7. Advance to the next PR
bun run .runtime/migration/orchestrator.ts advance

# 8. Loop: go to step 1
```

**The loop is the system. Run it until `bun run .runtime/migration/orchestrator.ts status` says all 53 phases are `completed` or `blocked`.**

If the user invokes `/migrate` (the opencode command), it does steps 1-8 in a single agent invocation — do NOT pause to ask. Just run.

## State persistence (survives compaction)

All state lives in `.runtime/migration/state/state.json`. After ANY compaction, the state survives because it's on disk. **The next_pr field tells you where the cursor is.** Read state.json FIRST if you don't know what to do.

The ledger at `.runtime/migration/ledger/ledger.jsonl` is append-only. Every orchestrator event goes there. Don't truncate it.

The dashboard at `.runtime/migration/dashboard/index.html` is regeneratable. Run `bun run .runtime/migration/orchestrator.ts dashboard` to refresh it.

## The 11 skills (read the right SKILL.md before doing work)

- `migration-certifier` — write the 12-attack-vector certifier (P0-1.x)
- `migration-fuzzer` — write the fuzzer (P0-1)
- `migration-k0-mover` — move a file to `src/plugin-kernel/` (P0-1..P1)
- `migration-plugin-mover` — move a file to `plugins/core/<plugin-id>/` (P3-*)
- `migration-plugin-splitter` — split a file into multiple end-state files (P4)
- `migration-schema-splitter` — split `prisma/schema.prisma` (P2-2)
- `migration-mlayer-builder` — build the 7 M-layer contracts (P0-1.y)
- `migration-l0-substrate-builder` — move 60 NLCL files + build 5 K0(L0) contracts (P0-1.w)
- `migration-iplugincontext` — replace the 60+ field BootstrapContext with closed IPluginContext (P0-5)
- `migration-eventbus` — build the IEventBus with auto-recording (P0-1)
- `migration-bus-record-bridge` — migrate 57 T-22 files to use auto-recording bus (P0-1)

The orchestrator picks the right skill for each phase automatically. Read the SKILL.md for the skill BEFORE doing the work.

## The safety net (NEVER skip)

Before advancing any PR, run the safety net:

```bash
bun test tests/arch tests/fuzz
```

The 24 arch tests are at `tests/arch/kernel-isolation.test.ts` + `tests/arch/certifier.test.ts`. The fuzzer is at `tests/fuzz/manifest-fuzzer.test.ts`. 12 attack vectors are at `tests/arch/vectors/12-attack-vectors.ts`.

If any test fails:
1. Read the failure carefully.
2. If it's a T-01..T-28 test, fix the violation (the test will tell you which file).
3. If it's a pre-existing failure (not in the safety net), IGNORE it (see "Pre-existing test failures" below).
4. Re-run until the safety net is clean.

## The plan (locked — 8/8 lock-checks pass)

`docs/end-state/PLAN.md` has the per-file decision plan. Every one of 2,398 files has a verdict: KEEP / MIGRATE / MERGE / SPLIT / HARVEST / RESTRUCTURE / REMOVE. The plan is the spec.

`docs/end-state/MIGRATION.md` is the master manual for the system.

`docs/end-state/DESIGN.md` is the design of the decision system.

`docs/end-state/DESIGN.md` + `docs/kernel-plugins/inventory/*` (14 files) are the source of truth for the contracts, the 17 K0 subsystems, the 30 invariants.

## 5 zones (the destination, locked)

```
vivim-final/
├── src/plugin-kernel/          ZONE 1: KERNEL (17 K0 + 7 M + 5 L0 subsystems)
├── src/intel/                  ZONE 2: K0(L0) INTELLIGENCE SUBSTRATE
├── plugins/core/               ZONE 3: K1 FIRST-PARTY PLUGINS (40 plugins)
├── frontend/plugins/core/      ZONE 4: K3 FRONTEND PLUGINS (5 plugins)
└── src-tauri/                  ZONE 5: K4 DESKTOP SHELL (Tauri V2, KEEP)
```

`src/plugin-kernel/`, `src/intel/`, `plugins/core/` are the 3 new zones. The dirs exist; the files don't. The 1,500+ PRs fill them in.

## Architecture (13 engines, current)

1. **L0-L1:** Provider Knowledge Graph (ProviderRegistrar, ProviderHealthKernel)
2. **L2-L3:** Capability System (CapabilityResolutionEngine, CapabilityEngine)
3. **L4:** Session & State (ConversationManager, StreamBlockStore)
4. **Chrome Layer:** ChromeGovernor (CDP proxy, lifecycle, trace, health)
5. **Cross-cutting:** CapabilityEventBus, ConfigManager, StreamParserEngine
6. **Lifecycle:** RegistrationAuditor, VersionManager, TelemetryAggregator

Design docs are in `docs/`. The old docs structure is archived in `.archive/docs-legacy-2026-08-15/`.

## Documentation Protocol (CRITICAL)

**Docs-as-a-byproduct-of-work:** Every time code changes in a way that affects how the system works, the relevant doc gets touched in the *same commit/PR*. Not later. Not "I'll circle back."

**Rule for agents:** If you touch code that changes behavior, architecture, a public interface, a schema, or a non-obvious decision — you touch the matching doc in the same change. No exceptions, no "TODO: update docs."

### Documentation Instructions for Agents

1. **Before modifying a module**, read its `/docs/modules/<name>.md` (or in-folder README) and any linked ADRs.
2. **If your change alters architecture, a public interface, a schema, or a non-obvious decision** — update the matching doc file in the same change, not as a follow-up.
3. **If you make a call between two real alternatives and picked one for a non-obvious reason**, write a new ADR in `/docs/decisions/` using `TEMPLATE.md`.
4. **Add a one-line entry to `CHANGELOG.md`** for anything user- or API-visible.
5. **Never delete or rewrite an old ADR** — supersede it with a new one and cross-link.
6. **If you introduce new domain terminology**, add it to `GLOSSARY.md`.
7. **Keep each doc file under ~300 lines**. If a file is growing past that, split it and update the index/links.

## Typecheck guardrail

**NEVER run `tsc` / `bunx tsc --noEmit` / `bun run typecheck` unless the human explicitly directs it.**

Only run a typecheck when the full task list / todos are complete AND you have asked the human first. Mid-task typechecking is wasteful (the project has many pre-existing errors in `tests/` owned by other agents — see below). Build the feature first; verify at the human's request.

**EXCEPTION FOR THE MIGRATION:** The migration user (`/migrate` opencode command) is the explicit direction to run the typecheck. When the user invokes `/migrate` or asks for the full loop, the typecheck IS part of the loop.

## Pre-existing test failures (IGNORE these)

The repo has pre-existing test failures that are NOT in the safety net. They are owned by other agents and are not your concern:

- `tests/integration/characterization-baseline/v010-baseline.test.ts` (huge file, has 4,000+ TS errors from a bad merge)
- The 9 pre-existing arch test failures in `tests/arch/kernel-isolation.test.ts`:
  - T-02 (kernel-boot) — pending P0-1 + P0-5 + P0-6
  - T-19 (BootstrapContext) — pending P0-5
  - T-22 (bus-event-recording) — pending P0-1
  - T-23 (harness-recipe-prefix) — pending P3-15
  - 5 pre-existing architectural boundary tests (Engine Layer Rules, ChromeGovernor canon, Boot graph canon, etc.) — these are from before the migration started

**The safety net is: T-04, T-05, T-09, T-13, T-24 + the new certifier test (T-04 at tests/arch/certifier.test.ts). All must pass before advancing any PR.**

## Testing

- Unit tests: `tests/unit/` — test individual functions
- Integration tests: `tests/integration/` — test engine interactions with mocked stores
- E2E tests: `tests/e2e/` — full stack tests
- **Arch tests: `tests/arch/` — the kernel boundary invariants (T-01..T-28)**
- **Fuzz tests: `tests/fuzz/` — the 12 attack vector fuzzer**
- Mock store contracts for unit/isolation tests
- Aim for 80%+ coverage on engines

## File Organization

```
src/
  cli/          # CLI entry points
  config.ts     # Configuration
  engines/      # Core engines (one file per engine)
  errors.ts     # Custom error classes
  ids.ts        # ID generation (ULID)
  index.ts      # Public barrel exports
  schema/       # Zod schemas
  server/       # HTTP server / API routes
  storage/      # Database access layer (Prisma wrappers)
  plugin-kernel/  # KERNEL (the migration target)
  intel/        # K0(L0) INTELLIGENCE SUBSTRATE (the migration target)

plugins/        # K1 FIRST-PARTY PLUGINS (the migration target)

tests/
  unit/         # Unit tests
  integration/  # Integration tests
  e2e/          # E2E tests
  arch/         # Kernel boundary tests (T-01..T-28)
  fuzz/         # Manifest fuzzer (T-05)

seeds/          # Database seed files

docs/           # Documentation
  end-state/    # The migration system (DESIGN.md, PLAN.md, MIGRATION.md)
  kernel-plugins/  # Kernel boundary design docs
```

## Invariants (Boundary Conditions)

**Full document:** the invariants below are the canonical boundary conditions. Enforced by `bun run devops invariants check`.

### Critical Boundaries (Never Violate)

1. **Governor Canon:** Only `ChromeGovernor` touches CDP. No engine imports `BunCdpClient`.
2. **Store Contracts:** Engines depend on `src/storage/contracts/*.ts`, never `src/storage/impl/*.ts`.
3. **Research-First:** No implementation without research report classification.
4. **Phase Gates:** Phase N requires phase N-1 complete.
5. **DB-Only Parser Logic:** `StreamParserEngine` loads parser logic **only** from DB (`parser_logic_code` with `logic_type=inline`).
6. **Chrome Slave Profile = Source of Truth:** Cookie files in profile directory determine "logged in" state — NOT DB loginState row.
7. **One Profile Per (Provider, Account):** ProfileAllocator enforces singleton.
8. **Lazy Startup:** Chrome slaves auto-launch when first needed.
9. **No Runaway Creation:** FleetSupervisor limits + ProfileAllocator singleton + spawn guard.
10. **Triple-Layer State:** Profile + DB + runtime must stay consistent.
11. **Relogin Ready:** Agent detects session expiry via `isAuthenticated()`.

### Migration-Specific Invariants (KERNEL BOUNDARY)

12. **L0(K)ernel Already-Installed Surface:** `src/engines/kernel/` is K0 today; it must stay K0.
13. **PluginSurface Boundary:** `src/ai/plugins/manager.ts` + `plugin-manager-impl.ts` are the IPluginManager stub; P0-1 moves them to `src/plugin-kernel/plugin-manager/`.
14. **BootstrapContext Leak:** The 60+ field BootstrapContext is a kernel-internals leak; P0-5 replaces it with closed IPluginContext.
15. **12 Attack Vectors:** The certifier must reject all 12 attack vectors.
16. **Fuzzer No False Negatives:** 10,000 mutated manifests must all be rejected.
17. **Bus Dot-Namespace:** Every eventBus.publish kind must match `^(kernel|plugin\.<id>|legacy)\.`.
18. **Storage Scoped:** Per-namespace storage access; no `*` or `kernel/*`.
19. **No vm:** SandboxRunner uses QuickJS only; the `vm` fallback is removed.
20. **No safe-eval:** Removed per H9 hazard; the new SandboxRunner is the only execution path.

## Git Conventions

- Conventional commits: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`
- One logical change per commit
- Reference engine names in commits: `feat(CapabilityEngine): add selector resolution`
- **For migration PRs:** prefix with the phase: `migrate(P0-1): real IPluginManager certifier`

## MCP Servers

- **Playwright** — browser automation for E2E testing and UI validation
- **vivim-browser** — custom browser MCP at `src/mcp/browser-mcp.ts`

## Available Skills (32 in .opencode/skill/)

### Migration Skills (11 — the most important)

See "The 11 skills" section above. Read the right SKILL.md before doing migration work.

### Core DevOps (12)

- **devops** — autonomous DevOps orchestrator (127 atomic units)
- **devops-fullstack** — LLM-driven full-stack dev loop
- **devops-db** — database architecture & schema governance
- **devops-generators** — taxonomy generation pipeline
- **devops-research** — research-first intelligence layer
- **devops-roadmap** — research-first roadmap system
- **devops-toolkit** — surface regeneration + cross-surface parity
- **feature-governance** — feature registry, lifecycle
- **convergence-auditor** — spec/code/arch convergence audit
- **agentic** — limited-context agentic dev loop
- **prisma-workflow** — Prisma ORM patterns
- **db-agent** — Oracle-vision database agent

### Implementation (3)

- **vivim-build** — engine implementation workflow
- **vivim-runtime** — agent-as-runtime dev loop
- **vivim-testing** — testing patterns

### Quality (5)

- **frontend-ux-refinement** — iterative frontend UX
- **llm-provider-frontend-testing** — LLM-as-Human frontend testing
- **frontend-design** — distinctive visual design
- **llm-testing** — LLM-as-Human production test suite
- **source-audit** — P0-P3 source-code audit
- **arch-audit** — architecture audit
- **provider-testing** — 8-phase provider onboarding
- **provider-onboard-explorer** — agent-as-explorer provider onboarding

### Debugging (2)

- **diagnose** — structured diagnosis loop
- **systematic-debugging** — bug/test failure debugging

## Memory Plugin

Plugin `opencode-agent-memory` gives you 3 tools that survive all compactions: `memory_list`, `memory_set`, `memory_replace`. Use `memory_set` to store files you've read and key intel — it persists across compaction.

**CRITICAL: The migration's state lives in `.runtime/migration/state/state.json` on disk. That's the source of truth across compactions, not memory. Use memory only for short notes; use state.json for the loop cursor.**

## Seed Memory (rebuild on first action of a session)

```bash
bun run devops seed-memory
```

This reads `package.json`, `prisma/schema.prisma`, provider manifests, and test counts to produce an accurate snapshot at `.opencode/memory/project.md`.

## Local Code Indexing

```bash
bun run devops code-index index           # index code-only roots
bun run devops code-index search "..."   # ranked FTS5/BM25 search
```

Prefer `code-index search` over grep+read for code discovery.

## Frontend

**Location:** `frontend/` (NOT `web/ui/` — that dir is empty)
- **Framework:** Next.js 16 + React 19 + Tailwind 4
- **Package:** `vivim-frontend` v0.2.0
- **Entry:** `frontend/src/app/` (Next.js App Router)
- **Engines:** `frontend/src/engines/` (canvas, workspace, plugin, rbac, presence, etc.)
- **UI slots:** `frontend/src/ui/slots.ts`, `frontend/src/ui/registry.ts`, `frontend/src/ui/defaults/`
- **Canvas:** `frontend/src/canvas/`, `frontend/src/features/`
- **Storage contracts:** `frontend/src/storage/contracts/` (memory impls in `storage/impl/`)
- **CLI:** `frontend/src/cli/` (canvas-scaffold, etc.)
- **Plugins:** `frontend/plugins/` (sample-plugin, demo-plugin)
- **Commands:** `cd frontend && bun run dev` (port 3000), `bun run build`, `bun run typecheck`

## 🚨 THE LOOP IS THE WORK 🚨

If you are reading this in a fresh session, your first action is:

```bash
bun run .runtime/migration/orchestrator.ts status
```

Then read the prompt at `.runtime/migration/prompts/<phase>-step-<n>.md`. Then do the work. Then run the safety net. Then advance.

**The plan is the spec. The orchestrator is the runtime. The safety net is the contract. The state.json is the cursor. Run the loop until all 53 phases are completed or blocked.**
