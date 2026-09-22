# LANDING-SKELETON — The Target Repo Structure

> **This is the constitution of the rebuilt repo.** Every card, every net-new project, every line of code lands in one of these folders. No exceptions. No "misc/" or "other/" or "tmp/". If you can't find a home for something, it doesn't belong here yet.

---

## The 4 Layers (Mental Model)

```
vivim-next/
│
├── kernel/        ← IRREDUCIBLE. Cannot be removed without breaking the system.
│                    Has the strictest rules. Most-tested. Last to change.
│
├── plugins/       ← REPLACEABLE. Can be swapped, removed, or rewritten.
│                    Each plugin is self-contained. Plugins depend on kernel, not each other.
│
├── surfaces/      ← WHAT THE USER TOUCHES. UI, CLI, desktop windows.
│                    Surfaces call into plugins through kernel contracts.
│
├── infra/         ← HOW WE BUILD AND SHIP. Tooling, installers, seeds, devops.
│                    Infra is the only place that knows about deployment.
│
├── tests/         ← TESTS organized by layer they test, not by file.
│
├── specs/         ← SPECIFICATIONS for net-new projects (proposed/approved/implemented).
│
├── docs/          ← USER-FACING docs only. No "design notes" — those are specs or backbone.
│
├── .backbone/     ← The backbone system itself. Synced from control room.
│
└── README.md      ← What this is, in one page.
```

**The rule:** `kernel → plugins → surfaces → infra`. Lower layers cannot import higher layers. `surfaces` cannot import `plugins` directly — they go through `kernel` contracts.

---

## The Full Structure

```
vivim-next/
│
├── kernel/                              # LAYER 1: IRREDUCIBLE
│   ├── capability/                      # F-007 capability-registry
│   │   ├── contract.ts                  # UnifiedCapability interface (the contract)
│   │   ├── registry.ts                  # The registry impl
│   │   ├── resolver.ts                  # Resolution engine
│   │   ├── event-bus.ts                 # CapabilityEventBus
│   │   └── tests/                       # Tests for kernel/capability
│   │
│   ├── execution/                       # F-008, F-009, F-012
│   │   ├── action-plan.ts               # ActionPlan IR (F-008)
│   │   ├── compiler.ts                  # ActionPlan -> ExecutionPlan
│   │   ├── kernel.ts                    # ExecutionKernel (F-009)
│   │   ├── harness.ts                   # Harness command registry (F-012)
│   │   ├── repair.ts                    # JSON repair for LLM output
│   │   └── tests/
│   │
│   ├── storage/                         # F-036 dual-db
│   │   ├── contract/                    # Storage contracts (the interface)
│   │   │   ├── conversation.ts          # F-001 conversation store contract
│   │   │   ├── memory.ts                # F-002 memory store contract
│   │   │   ├── knowledge.ts             # F-003 knowledge store contract
│   │   │   ├── provider.ts              # F-005 provider store contract
│   │   │   └── index.ts
│   │   ├── impl/                        # Storage implementations
│   │   │   ├── sqlite/                  # SQLite impl (one file per contract)
│   │   │   └── memory/                  # In-memory impl for tests
│   │   ├── schema/                      # Prisma schemas
│   │   │   ├── system.prisma
│   │   │   └── user.prisma
│   │   └── tests/
│   │
│   ├── identity/                        # F-021, F-019
│   │   ├── user.ts                      # User identity (F-021)
│   │   ├── session.ts                   # Session lifecycle (F-019)
│   │   ├── lifecycle.ts                 # App lifecycle
│   │   ├── version.ts                   # Version manager
│   │   └── tests/
│   │
│   ├── security/                        # F-014, F-015, F-016
│   │   ├── safe-eval.ts                 # Safe-eval gate (F-014)
│   │   ├── sandbox.ts                   # Sandbox runners
│   │   ├── consent.ts                   # Consent engine (F-015)
│   │   ├── governance.ts                # Governance engine
│   │   ├── audit.ts                     # Audit trail
│   │   ├── encryption.ts                # App-level encryption (F-016)
│   │   └── tests/
│   │
│   ├── types/                           # Shared kernel types
│   │   ├── ids.ts                       # ULID generation
│   │   ├── errors.ts                    # Error classes
│   │   ├── result.ts                    # Result<T, E>
│   │   └── index.ts
│   │
│   └── tests/                           # Cross-cutting kernel tests
│       ├── arch/                        # Architecture tests (kernel/plugin boundaries)
│       └── invariant/                   # Invariant tests (Governor Canon, etc.)
│
├── plugins/                             # LAYER 2: REPLACEABLE
│   │
│   ├── provider/                        # F-005, F-006
│   │   ├── manifest.ts                  # Provider manifest loader
│   │   ├── cdp/                         # CDP integration
│   │   │   ├── governor.ts              # ChromeGovernor (lives here? — see TBD)
│   │   │   ├── watchdog.ts              # CDP watchdog
│   │   │   └── discovery.ts             # CDP discovery
│   │   ├── discovery/                   # 8-phase onboarding
│   │   │   ├── phases.ts
│   │   │   └── harness.ts
│   │   ├── adapters/                    # Per-provider adapters
│   │   │   ├── claude.ts
│   │   │   ├── chatgpt.ts
│   │   │   ├── gemini.ts
│   │   │   └── ...
│   │   ├── selectors/                   # CDP selectors
│   │   ├── resilience/                  # Selector healing (F-030)
│   │   └── tests/
│   │
│   ├── retrieval/                       # F-013, F-003
│   │   ├── semantic/                    # Semantic search
│   │   ├── embedding/                   # Embedding providers
│   │   │   ├── ollama.ts
│   │   │   ├── minilm.ts
│   │   │   └── huggingface.ts
│   │   ├── knowledge-graph/             # Knowledge graph
│   │   │   ├── envelope.ts
│   │   │   ├── extractor.ts
│   │   │   └── pipeline.ts
│   │   └── tests/
│   │
│   ├── memory/                          # F-002
│   │   ├── fsrs.ts                      # FSRS-6 scheduler
│   │   ├── engine.ts                    # Memory engine
│   │   ├── indexer.ts
│   │   ├── exporter.ts
│   │   └── tests/
│   │
│   ├── parsing/                         # F-011
│   │   ├── stream.ts                    # StreamParserEngine
│   │   ├── align.ts
│   │   ├── block-store.ts
│   │   ├── fallback.ts                  # Fallback chain
│   │   ├── adapters/                    # Per-provider parsers
│   │   │   ├── claude-sse.ts
│   │   │   ├── chatgpt-delta.ts
│   │   │   ├── gemini-batchexecute.ts
│   │   │   └── ...
│   │   └── tests/
│   │
│   ├── agent/                           # F-010
│   │   ├── builder.ts
│   │   ├── loop.ts
│   │   ├── planner.ts
│   │   └── tests/
│   │
│   ├── plugin-system/                   # F-022 (the plugin loader itself, not the plugins)
│   │   ├── loader.ts                    # Hot-reload
│   │   ├── contract.ts                  # Plugin contract
│   │   ├── registry.ts
│   │   └── tests/
│   │
│   ├── mcp/                             # F-023
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── tests/
│   │
│   ├── sync/                            # F-020
│   │   ├── engine.ts
│   │   ├── lock.ts
│   │   ├── idempotency.ts
│   │   └── tests/
│   │
│   ├── budget/                          # F-028
│   │   ├── engine.ts
│   │   ├── cortex.ts
│   │   ├── optimizer.ts
│   │   └── tests/
│   │
│   ├── update/                          # F-029
│   │   ├── engine.ts                    # Self-update
│   │   ├── transfer.ts                  # Transfer accelerator
│   │   ├── export.ts
│   │   └── tests/
│   │
│   └── tests/                           # Plugin tests organized per-plugin
│
├── surfaces/                            # LAYER 3: WHAT THE USER TOUCHES
│   │
│   ├── web/                             # F-034 frontend (Next.js + React)
│   │   ├── app/                         # Next.js App Router
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── canvas/                      # F-033 canvas-frontend
│   │   ├── state/                       # Frontend state management
│   │   └── tests/
│   │
│   ├── desktop/                         # F-035 desktop-installer
│   │   ├── tauri/                       # Tauri v2 config
│   │   ├── installer/                   # NSIS scripts
│   │   └── sidecar/                     # Bun-compiled binary
│   │
│   ├── cli/                             # CLI surface
│   │   ├── commands/
│   │   ├── repl/                        # Interactive shell
│   │   └── tests/
│   │
│   ├── api/                             # HTTP/WS surface
│   │   ├── server.ts                    # Bun HTTP server
│   │   ├── ws.ts                        # WebSocket
│   │   ├── routes/                      # Route handlers
│   │   └── tests/
│   │
│   └── tests/
│
├── infra/                               # LAYER 4: HOW WE BUILD AND SHIP
│   │
│   ├── seed/                            # F-037 seed-pipeline
│   │   ├── providers/
│   │   ├── parsers/
│   │   ├── capabilities/
│   │   ├── harness/
│   │   └── taxonomy/
│   │
│   ├── devops/                          # F-038 devops-tooling
│   │   ├── desktop/                     # 15-action desktop loop
│   │   ├── runtime-test/                # 8-phase provider test
│   │   ├── audit/                       # Source-code audit
│   │   ├── cross-surface/               # CLI/API/MCP/UI parity
│   │   └── db/                          # DB doctor, migrations
│   │
│   ├── build/                           # Build scripts
│   │   ├── tauri/
│   │   ├── next/
│   │   └── bun/
│   │
│   ├── logging/                         # F-040 logging
│   │   ├── logger.ts
│   │   ├── otel.ts
│   │   └── sinks/
│   │
│   ├── observability/                   # F-017
│   │   ├── metrics.ts
│   │   ├── health.ts
│   │   └── sla.ts
│   │
│   ├── backend-server/                  # The Bun server that powers everything
│   │   ├── index.ts                     # Server entry
│   │   ├── bootstrap/                   # Boot phases
│   │   ├── config/                      # ConfigManager
│   │   └── shutdown/
│   │
│   └── tests/                           # Infra tests
│
├── tests/                               # F-039 test-suite (cross-cutting)
│   ├── integration/                     # Cross-layer integration
│   ├── e2e/                             # End-to-end
│   ├── arch/                            # Architecture tests (boundaries)
│   ├── chaos/                           # Failure-mode tests
│   ├── load/                            # Performance tests
│   └── fixtures/                        # Shared test fixtures
│
├── specs/                               # NET-NEW PROJECT SPECIFICATIONS
│   ├── proposed/                        # Submitted, awaiting review
│   │   └── voice-input.md               # AR-001 (admitted, awaiting spec)
│   ├── approved/                        # Reviewed, ready to land
│   ├── implemented/                     # Built, in production
│   └── rejected/                        # Documented for the record
│
├── docs/                                # USER-FACING docs only
│   ├── README.md                        # What is vivim-next?
│   ├── user-guide.md                    # How to use
│   ├── install.md                       # How to install
│   └── contributing.md                  # How to extend
│
├── .backbone/                           # The backbone system
│   ├── BACKBONE.md                      # Overview
│   ├── cards/                           # FEATURE_CARD.json per card
│   ├── waves/                           # Shippable batches
│   ├── admissions/                      # Net-new requests
│   ├── runs/                            # Gate run history
│   ├── runner.ts                        # The tools (synced)
│   ├── gate.ts
│   ├── wave-planner.ts
│   ├── admit.ts
│   └── STATE-MACHINE.md
│
├── package.json                         # Single source of truth for deps
├── tsconfig.json
├── biome.json                           # Lint config
├── .gitignore
├── LICENSE
└── README.md                            # First thing the user sees
```

---

## The Dependency Rule (Strict)

```
kernel       ← can import from: kernel only
plugins      ← can import from: kernel, plugins (same-plugin only)
surfaces     ← can import from: kernel, plugins (via contracts)
infra        ← can import from: kernel, plugins, surfaces (it glues them)
```

**Enforced by tests:**
- `tests/arch/kernel-isolation.test.ts` — kernel cannot import from plugins/surfaces/infra
- `tests/arch/plugin-isolation.test.ts` — plugins can only import from kernel (not other plugins)
- `tests/arch/surface-kernel-only.test.ts` — surfaces can only import kernel contracts
- `tests/arch/infra-everything.test.ts` — infra can import anything (it's the glue)

---

## What Goes Where (40-Card Mapping)

| Card | Layer | Folder | Status |
|------|-------|--------|--------|
| F-001 conversation-system | kernel | kernel/execution (or new kernel/conversation) | REWRITE — needs tests, no fabric yet |
| F-002 memory-system | plugin | plugins/memory | COPY (clean engine, good tests) |
| F-003 knowledge-graph | plugin | plugins/retrieval/knowledge-graph | COPY |
| F-004 context-assembly | plugin | plugins/retrieval (or kernel/) | COPY |
| F-005 provider-cdp-system | plugin | plugins/provider | COPY (with fixes) |
| F-006 provider-discovery-test | plugin | plugins/provider/discovery | COPY |
| F-007 capability-registry | kernel | kernel/capability | COPY (this IS the kernel) |
| F-008 action-plan-ir | kernel | kernel/execution | COPY |
| F-009 execution-kernel | kernel | kernel/execution | COPY |
| F-010 agent-builder | plugin | plugins/agent | COPY |
| F-011 stream-parsing | plugin | plugins/parsing | COPY |
| F-012 harness-execution | kernel | kernel/execution | COPY |
| F-013 semantic-retrieval | plugin | plugins/retrieval | COPY |
| F-014 sandbox-security | kernel | kernel/security | COPY |
| F-015 governance-policy | kernel | kernel/security | COPY |
| F-016 encryption-privacy | kernel | kernel/security | COPY |
| F-017 observability | infra | infra/observability | COPY |
| F-018 storage-relocation | infra | infra/backend-server (or kernel/storage) | DECIDE |
| F-019 lifecycle-session | kernel | kernel/identity | COPY |
| F-020 sync-p2p | plugin | plugins/sync | COPY |
| F-021 user-identity | kernel | kernel/identity | COPY |
| F-022 plugin-system | plugin | plugins/plugin-system | COPY (meta-plugin) |
| F-023 mcp-integration | plugin | plugins/mcp | COPY |
| F-024 workspace-presets | plugin | plugins/agent (or surface) | DECIDE |
| F-025 observation-outcome | infra | infra/observability | COPY |
| F-026 media-bridge | plugin | plugins/retrieval (or surface) | DECIDE |
| F-027 send-resilience | plugin | plugins/provider/resilience | COPY |
| F-028 budget-cost | plugin | plugins/budget | COPY |
| F-029 update-system | infra | infra/update | COPY |
| F-030 selector-resilience | plugin | plugins/provider/resilience | COPY |
| F-031 humanization-ux | plugin | plugins/agent (or surface) | DECIDE |
| F-032 content-management | plugin | plugins/retrieval (or new plugin) | DECIDE |
| F-033 canvas-frontend | surface | surfaces/web/canvas | COPY |
| F-034 frontend-surfaces | surface | surfaces/web | COPY (rewrite — restructure per new layout) |
| F-035 desktop-installer | infra | infra/desktop → surfaces/desktop | COPY |
| F-036 dual-db-system | kernel | kernel/storage | COPY (the schema + contract) |
| F-037 seed-pipeline | infra | infra/seed | COPY |
| F-038 devops-tooling | infra | infra/devops | COPY |
| F-039 test-suite | tests/ | tests/ | COPY (restructure) |
| F-040 logging | infra | infra/logging | COPY |
| F-041 voice-input (NET-NEW) | surface | surfaces/web/voice (or plugin) | SPEC FIRST |

**TBDs to resolve per card** (DECIDE in review):
- F-018: storage-relocation — kernel/storage or infra?
- F-024: workspace-presets — plugin or surface?
- F-026: media-bridge — plugin or surface?
- F-031: humanization-ux — plugin or surface?
- F-032: content-management — new plugin or part of retrieval?
- F-035: desktop-installer — infra (build) or surface (the app)?

---

## What Lives in Each Layer (One-Liner)

- **kernel/** — "If you remove this, the system can't run." Capability contract, execution, storage contract, identity, security, types.
- **plugins/** — "If you remove this, the system still runs, just less capable." Providers, retrieval, memory, parsing, agents, sync, MCP, budget.
- **surfaces/** — "If you remove this, the system still runs, just no way to interact." Web UI, desktop window, CLI, API server.
- **infra/** — "If you remove this, the system can't be built, seeded, or observed." Seed pipeline, devops, build, logging, observability, backend server bootstrap.
- **tests/** — "Cross-layer tests." Integration, e2e, arch, chaos, load, fixtures.
- **specs/** — "What's coming next." Proposed → approved → implemented → rejected. Net-new lives here before it becomes code.
- **docs/** — "What the user sees." README, user guide, install, contributing. No design notes — those are specs.
- **.backbone/** — "The tracking system." Cards, waves, admissions, gate runs, the tools that maintain it.

---

## The Per-Folder README Pattern

Every folder gets a `README.md` (max 50 lines) that says:
1. **What lives here** (one sentence)
2. **What can import this** (which layers)
3. **What this can import** (which layers)
4. **One example card** (the canonical example)
5. **Where to add new code** (the convention)

This makes the repo self-documenting. You can `cd` into any folder and know what's expected.

---

## The Boot Sequence (Who Runs What)

```
1. infra/build/        → builds the binary
2. infra/seed/         → seeds the DB (system + user)
3. infra/backend-server/index.ts → boots:
     a. kernel/types          (load first)
     b. kernel/storage        (init DB)
     c. kernel/identity       (init users/sessions)
     d. kernel/security       (init sandbox)
     e. kernel/capability     (register capabilities)
     f. kernel/execution      (init action plan compiler)
     g. plugins/*             (load plugins from registry)
     h. surfaces/*            (bind to ports/UI)
4. surfaces/web        → user opens browser
5. surfaces/desktop    → user opens app
```

Plugins load AFTER kernel. Surfaces bind AFTER plugins. Infra is everywhere but never imported by the others directly — it sets up the environment.

---

## What This Skeleton Does NOT Have

- **No `src/`, `frontend/`, `prisma/` at the top level** — everything is in its proper layer
- **No `shared/`, `common/`, `utils/`** — shared code goes in `kernel/types/` or a specific plugin
- **No `examples/`, `demos/`, `playground/`** — demos are specs or test fixtures
- **No `archive/`, `legacy/`, `old/`** — old code lives in `vivim-final` (the frozen archive) if you need it
- **No `_internal/`, `private/`, `hidden/`** — if it shouldn't be seen, don't commit it

---

## The Migration Sequence (After This Skeleton Is Agreed)

1. **Empty the vivim-next repo** (only README + .gitignore exist)
2. **Create the folder skeleton** (empty folders + per-folder READMEs)
3. **Migrate card-by-card** in dependency order:
   - First: kernel/types, kernel/storage, kernel/identity (the foundation)
   - Then: kernel/capability, kernel/execution, kernel/security (the brain)
   - Then: plugins/* (the features)
   - Then: surfaces/* (the UI)
   - Then: infra/* (the build)
   - Last: tests/* (verify everything)
4. **Per card**: copy → adjust imports → fix boundary violations → run tests → commit
5. **One card per commit**, message: `card(F-007): migrate capability-registry to kernel/capability`

---

## The Net-New Flow (After This Skeleton Is Agreed)

```
IDEA
  ↓
SPEC (in specs/proposed/) — written by anyone, follows the spec template
  ↓
ADMISSION REQUEST (bun .backbone/admit.ts propose)
  ↓
RUBRIC SCORE (8 criteria, threshold 12)
  ↓
DECISION (admit / research / drop)
  ↓
if admit → spec moves to specs/approved/ → FEATURE_CARD created → spec becomes the card's design doc
  ↓
IMPLEMENTATION (card transitions MAPPED → DESIGNED → SCAFFOLDED → PARTIAL → WORKING)
  ↓
SHIPPED (in a wave)
```

The spec template is in `specs/TEMPLATE.md` (next file to create).

---

## Open Questions (Need Your Input)

1. **Is `kernel/conversation/` needed?** F-001 (conversation) could be in `kernel/` (it IS the chat system) or in `plugins/`. My instinct: kernel, but want your call.
2. **Is `surfaces/api/` separate from `surfaces/cli/`?** Some repos merge these. Mine keeps them separate for clarity. OK?
3. **Where does `kernel/execution/` end and `plugins/agent/` begin?** ActionPlan is kernel; agent-loop is plugin. The boundary is "the plan vs the agent that uses the plan." OK?
4. **F-035 desktop-installer: `infra/desktop/` (build) or `surfaces/desktop/` (the app)?** My instinct: split. `surfaces/desktop/` is the Tauri config + app shell. `infra/build/` has the build scripts. The NSIS installer is `infra/`. OK?

---

*This is the constitution. Anything that contradicts this needs to amend this file first.*
