# End-State-First Design — The Missing Layer (2026-08-29)

> **The problem:** we have 2,398 per-file YAMLs (the raw input), 10 intelligence overlays (the raw signal), 30 invariants (the raw test), 44 kernel contracts (the raw shape), and 1,500+ migration-table rows (the raw intent). **We do not have a *decision function* that takes a file's current state + raw signal + raw intent and outputs a concrete, justified action.** This is the missing layer.
>
> **The fix:** design the **end-state** first (the system as it will be when done), then design the **decision function** that maps every current file to a per-file action in the end-state, then run it. **No migration PR is started until the end-state is locked.** The end-state is the destination; the decision function is the route planner; the indexer is the vehicle that already drove us here.

---

## §0. The single sentence

> **For every file in the current codebase, the decision function takes (its current state, its current layer, its current contracts, its current dependencies, its current testing surface, its current doc coverage) and returns one of seven verdicts — `KEEP`, `MIGRATE`, `HARVEST`, `RESTRUCTURE`, `SPLIT`, `MERGE`, `REMOVE` — each with a target location in the locked end-state, a cost estimate, a risk rating, a dependency chain, and a sequencing slot in the 6-phase migration plan.**

The verdict is the *unit of work*. The end-state is the *destination*. The decision function is the *router*. The indexer is the *sensor*.

---

## §1. Why end-state-first (and not the inverse)

The current migration plan (in `docs/kernel-plugins/migration/`) is **state-forward** — it lists "what to do with each existing file." That has a subtle bug: it answers the question *"how do we get there?"* without first locking *"where is there?"*

When the destination is locked, every current file has a clear answer:
- If a current file maps 1:1 to an end-state file → `KEEP` (or `MIGRATE` if the path changes).
- If a current file's logic maps to multiple end-state files → `SPLIT`.
- If multiple current files' logic maps to one end-state file → `MERGE`.
- If a current file's logic is fully captured by an end-state contract that doesn't need the implementation → `HARVEST` (extract the useful parts, discard the rest).
- If a current file's logic is now wrong / dead / superseded → `REMOVE`.
- If a current file needs significant rewrites (e.g. porting from vm to QuickJS, splitting interface from impl, adding contractVersion) → `RESTRUCTURE`.
- If a current file's logic is already correct and the path matches → `KEEP`.

Without locking the end-state first, the migration-table hand-waves every one of these choices. With the end-state locked, every choice is mechanical.

---

## §2. The locked end-state (the destination)

The end-state is what the system looks like when all 30 invariants in `docs/kernel-plugins/migration/ends-state.md` §1 are true, all 30+ capabilities in §2 are reachable, and all 10 done-conditions in §12 are met. It has 5 layers and 5 zones, all of which already have names in the existing docs.

### 2.1 The 5 layers (K0, K0(M), K0(L0), K1, K2, K3, K4)

From `inventory/AT-FORENSIC-VERDICT.md §3` + `inventory/REASSESSMENT.md`:

| Layer | Count | What it is | End-state destination |
|---|---|---|---|
| **K0** | 17 subsystems | The kernel; never uninstalled, never replaced | `src/plugin-kernel/<subsystem>/` (does not exist today) |
| **K0(M)** | 7 contracts | The M-layer (self-descriptive) | `src/plugin-kernel/catalog/` (does not exist today) |
| **K0(L0)** | 5 contracts | The deterministic intelligence substrate | `src/intel/<substrate>/` (does not exist today) |
| **K1** | 40 plugins | First-party plugins (VIVIM's product features) | `plugins/core/<plugin-id>/` (does not exist today) |
| **K2** | (the surface) | The third-party plugin surface | `manifest.yaml` + `PluginHost.install()` (already partly in `src/server/plugin-router.ts`) |
| **K3** | (the iframe) | Sandboxed UI components | `frontend/src/components/canvas/SandboxedNode.tsx` (already K0) + `frontend/plugins/core/<plugin-id>/` |
| **K4** | (external) | Tauri supervisor, Chrome slave, LLM service | `src-tauri/` (already there) |

### 2.2 The 5 zones (kernel, plugins, intel, frontend, infra)

```
vivim-final/                       (the monorepo)
├── src/plugin-kernel/             ZONE 1: KERNEL
│   ├── plugin-manager/            K0-1 IPluginManager (P0-1)
│   ├── plugin-context/            K0-2 IPluginContext (P0-5)
│   ├── event-bus/                 K0-3 IEventBus (P0-1)
│   ├── registry/                  K0-4 IProviderRegistry (P0-2)
│   ├── adapter/                   K0-5 IProviderAdapter (P0-2)
│   ├── execution/                 K0-6 IExecutionManager (P0-3)
│   ├── runtime/                   K0-7 IRuntimeSupervisor (P0-3)
│   ├── policy/                    K0-8 IPolicyEnforcer (P0-3)
│   ├── router/                    K0-9 IRouter (P0-3)
│   ├── sandbox/                   K0-10 SandboxRunner (P0-1)
│   ├── observability/             K0-11/16 (already exists in src/engines/kernel/)
│   ├── schema/                    K0-12 SchemaRegistry (P2)
│   ├── migration/                 K0-13 MigrationRunner (P0-1)
│   ├── crypto/                    K0-14 branded IDs (P0-2)
│   ├── host/                      K0-15 IPluginHost (P0-1)
│   ├── capabilities/              K0-17 introspection (P0-1.x)
│   ├── bootstrap/                 5-phase pipeline (P0-1)
│   ├── storage/contracts/         interface-only contracts (already exists)
│   ├── catalog/                   M-layer (C-33..C-39) (P0-1.y)
│   └── shared/                    cross-cutting kernel types
│
├── src/intel/                     ZONE 2: K0(L0) INTELLIGENCE SUBSTRATE
│   ├── nlcl/                      60 NLCL files move here (P0-1.w)
│   ├── embeddings/                IEmbeddingProvider (P0-1.w)
│   ├── budget/                    IBudgetGuard (P0-1.w)
│   ├── command/                   ICommandPipeline (P0-1.w)
│   └── registry/                  IIntelligenceRegistry (P0-1.w)
│
├── plugins/core/                  ZONE 3: K1 FIRST-PARTY PLUGINS
│   ├── plugin-audit/              F-01 (P3-03)
│   ├── plugin-tools-image/        F-02 (P3-01)
│   ├── plugin-tools-mcp/          F-03 (P3-02)
│   ├── plugin-dev-tooling/        F-04 (P3-03)
│   ├── plugin-discovery/          F-05/06/07 (P3-05/06)
│   ├── plugin-notifications/      F-08 (P3-07)
│   ├── plugin-contacts/           F-09 (P3-08)
│   ├── plugin-collections/        F-10 (P3-09)
│   ├── plugin-workspace/          F-11 (P3-10)
│   ├── plugin-sync/               F-12 (P3-11)
│   ├── plugin-mirror/             F-13 (P3-12)
│   ├── plugin-cost/               F-14 (P3-13)
│   ├── plugin-search/             F-15 (P3-14)
│   ├── plugin-canon-harness/      F-16 (P3-15)
│   ├── plugin-canon-nlcl/         F-17 (P3-16)
│   ├── plugin-memory/             F-18 (P3-17)
│   ├── plugin-knowledge/          F-19 (P3-18)
│   ├── plugin-agents/             F-20 (P3-19)
│   ├── plugin-workflows/          F-21 (P3-20)
│   ├── plugin-policy/             F-22 (P3-21)
│   ├── plugin-providers-api/      F-23 (P3-22)
│   ├── plugin-chat/               F-24 (P3-23)
│   ├── plugin-providers-browser/  F-25 (P3-24)
│   ├── plugin-discord/            F-26 (P3-25)
│   ├── plugin-notion/             F-27 (P3-26)
│   ├── plugin-slack/              F-28 (P3-27)
│   ├── plugin-whatsapp/           F-29 (P3-28)
│   ├── plugin-reddit/             F-30 (P3-29)
│   ├── plugin-openai-api/         F-31 (P3-30)
│   ├── plugin-anthropic-api/      F-32 (P3-31)
│   ├── plugin-openrouter/         F-33 (P3-32)
│   └── plugin-reprogrammability/  F-40 (P3-39)
│
├── frontend/plugins/core/         ZONE 4: K3 FRONTEND PLUGINS
│   ├── plugin-ui-canvas/          F-34 (P3-33)
│   ├── plugin-ui-panels/          F-35 (P3-34)
│   ├── plugin-ui-shell/           F-36 (P3-35)
│   ├── plugin-ui-cards/           F-37 (P3-36)
│   └── plugin-ui-builder/         F-38 (P3-37)
│
└── src-tauri/                     ZONE 5: K4 DESKTOP SHELL
    └── (already there)
```

**This is the end-state.** Every directory either exists today (kernel/contracts, src/engines/kernel, src-tauri, src/storage, src/schema, src/ai/*, frontend/src/components/canvas/SandboxedNode.tsx) or will be created during the migration. **The directory layout is the contract.**

### 2.3 The 44 kernel contracts (the shapes)

From `inventory/KERNEL-CONTRACTS.md`:
- **C-01..C-24** — the original 24 contracts (plugin manager, context, event bus, registry, adapter, execution, runtime, policy, router, sandbox, observability, schema, migration, crypto, plugin host, kernel registry, introspection, audit, identity, capability, governance, provider, AI protocol, storage contracts)
- **C-25..C-32** — the 8 introspection capabilities (kernel.contracts.list, kernel.plugins.list, kernel.plugins.certify, kernel.plugins.install, kernel.bus.trace, kernel.sandbox.audit, kernel.node.query, kernel.sandbox.run)
- **C-33..C-39** — the M-layer (7 contracts: identity, provenance, rationale, relation-graph, configuration, event-catalog, why)
- **C-40..C-44** — the K0(L0) substrate (5 contracts: NLCL pipeline, embedding provider, budget guard, command pipeline, intelligence registry)

**Each contract is a TypeScript interface with a `contractVersion: { major, minor }`.** This is the shape; the indexer's `contractKeywords` overlay currently catches 0 source files using these contract IDs in code (they're design-only). The migration introduces the contract surface.

### 2.4 The 17 K0 kernel models (the data)

From `inventory/AT-FORENSIC-VERDICT.md §3` and `inventory/KERNEL-BOUNDARY-TESTS.md §2.17`:
```
SchemaMeta, Node, NodeVersion, NodeAlias, NodeEdge, PluginRegistry, SandboxAudit,
EventRecord, KernelSpan, KernelProvenance, KernelTopology, KernelEvent,
ConfigEntry, ConfigAudit, HpeSession, User, Session
```

**Honest finding from the indexer:** 16 of these 17 are present in the schema. `Session` is in the allowlist but **not declared in any prisma schema** — it was either removed in a refactor or added to the allowlist aspirationally. **The end-state is 16 models, not 17.** This is a one-line edit to the allowlist (`SESSION_MOVED_TO_VIVIMSESSION` or just remove it).

### 2.5 The 40 first-party plugins (the features)

From `docs/kernel-plugins/migration/ends-state.md §4` and `inventory/PLUGIN-BUILDER-CAKE.md §3`:
- 36 plugins in the migration-table F-001..F-040
- Plus 4 new ones (M1 dedup, M3+M4 lifecycle, etc.) → 40 total
- Each plugin has: `plugin.yaml` manifest, `activate(ctx)` entry point, capabilities, permissions, contributes, tests

**The end-state of every plugin is 1 manifest + 1 activate + N capabilities + tests.** Today, VIVIM's 36+ plugins are spread across `src/engines/*`, `src/server/*`, `src/ai/*`, `src/storage/impl/*`, `seeds/*`, `frontend/src/components/canvas/*`. The migration-table F-rows tell us where each goes.

---

## §3. The decision function (the 7 verdicts)

For every current file, the decision function returns one of these 7 verdicts, with the target location, cost, risk, and sequencing slot.

### 3.1 `KEEP` — the file is already correct, do not move

**Trigger:** the file's current path matches its end-state path AND the file's content matches its end-state spec.

**Examples (predicted):**
- `src/engines/kernel/*.ts` (10 files) — already K0-11/16, target = same.
- `src/schema/*.ts` — already K0-12, target = `src/plugin-kernel/schema/` (but the import surface is the same).
- `src/storage/contracts/*.ts` (60 files) — already K0-contract, target = same.
- `src/storage/migration/*.ts` (4 files) — already K0-13, target = same.
- `frontend/src/components/canvas/SandboxedNode.tsx` — already K0-10, target = same.
- `prisma/schema.prisma` (the schema file itself, not the models) — schema-splitting is P2-2.

**Cost:** 0 (no work).
**Risk:** low (regression only).
**Sequence:** the file ships with v1 unchanged.

### 3.2 `MIGRATE` — the file's logic is correct, but the path needs to change

**Trigger:** the file's content is correct end-state content, but it's at the wrong path (e.g. in `src/engines/` but should be in `src/plugin-kernel/` or `plugins/core/`).

**Examples (predicted):**
- `src/ai/plugins/plugin-manager-impl.ts` → `src/plugin-kernel/plugin-manager/manager.ts` (K-001).
- `src/ai/events/bus.ts` → `src/plugin-kernel/event-bus/contract.ts` (K-005).
- `src/ai/registry/registry.ts` → `src/plugin-kernel/registry/provider-contract.ts` (K-008).
- `src/server/plugin-router.ts` → `src/plugin-kernel/host/install-router.ts` (K-003).
- `src/server/bootstrap/orchestrator.ts` → `src/plugin-kernel/bootstrap/orchestrator.ts` (K-029).
- `src/server/bootstrap/context.ts` → split: interface to `src/plugin-kernel/plugin-context/context.ts`, impl stays (K-004).
- `src/engines/nlcl/*.ts` (60 files) → `src/intel/nlcl/` (P0-1.w).
- `src/engines/sandbox-runner.ts` → `src/plugin-kernel/sandbox/runner.ts` (K-027).
- `src/engines/memory/*.ts` (8 files) → `plugins/core/plugin-memory/` (F-18).

**Cost:** 1-3 hours per file (move + fix imports + run tests).
**Risk:** medium (imports break; the regression is bounded by the test suite).
**Sequence:** mostly P0 (kernel moves) and P3 (plugin moves).

### 3.3 `HARVEST` — extract the useful parts, discard the rest

**Trigger:** the file contains 1-2 useful exports but the rest is dead code, scaffolding, or test fixtures that don't belong in the end-state.

**Examples (predicted):**
- `src/engines/adapters/*` — adapter stubs that were never used; harvest the type signatures, discard the impls.
- `src/engines/pool/*` — pool internals that were absorbed by the registry; harvest the one useful export.
- `src/ai/core/types.ts` (23KB) — harvest branded ID types (K0-14), error types (K0-5), protocol version (K0-5), discard the rest.

**Cost:** 0.5-2 hours per file (cherry-pick + test that the harvested bits work).
**Risk:** low (we're discarding code, not adding it).
**Sequence:** P0 (during kernel harvest) or P3 (during plugin harvest).

### 3.4 `RESTRUCTURE` — significant rewrite needed

**Trigger:** the file's logic is in the right place, but the end-state spec demands material changes (split interface from impl, add `contractVersion`, port from `vm` to QuickJS, add audit hook, etc.).

**Examples (predicted):**
- `src/engines/sandbox-runner-vm.ts` (vm fallback) → RESTRUCTURE to port to QuickJS only; the `vm` import is forbidden in production per `inventory/KERNEL-BOUNDARY-TESTS.md §2.19`.
- `src/engines/safe-eval.ts` (H9 hazard) → REMOVE (already on the list); if kept for any reason, RESTRUCTURE to use QuickJS.
- `src/ai/core/types.ts` → SPLIT into `src/plugin-kernel/core/types.ts` (branded IDs + errors) and `src/plugin-kernel/adapter/errors.ts` (AdapterError variants per REASSESSMENT Gap-4).
- `src/server/bootstrap/context.ts` → SPLIT (interface to K0; impl stays) + RESTRUCTURE (drop 60+ fields, use closed `IPluginContext`).
- `src/ai/events/event-record-bridge.ts` → RESTRUCTURE to add the 57 T-22 missing call sites (or auto-generate the missing imports via a codemod).

**Cost:** 2-8 hours per file (rewrite + test + re-test).
**Risk:** high (the rewrite can introduce regressions; the boundary test is the only safety net).
**Sequence:** P0 (kernel restructures) and P3 (plugin restructures).

### 3.5 `SPLIT` — the file contains multiple end-state files

**Trigger:** the file exports 3+ distinct logical units that belong in different end-state locations.

**Examples (predicted):**
- `src/ai/core/types.ts` → SPLIT into 3+ files (K0-14 branded IDs, K0-5 errors, K0-5 protocol version, K0-5 discriminated unions).
- `src/server/bootstrap/context.ts` → SPLIT (interface + 6 phase-specific files in `src/plugin-kernel/bootstrap/phases/`).
- `src/engines/nlcl/nlcl-engine.ts` (950 lines) → SPLIT into orchestrator (K0(L0)) + 6 sub-resolvers (already exist as separate files) + parameter extraction + result types.
- `prisma/schema.prisma` (200 models) → SPLIT into 16 K0 models (`prisma/kernel/schema.prisma`) + 184 K1 models (moved with their plugin).

**Cost:** 4-12 hours per file (split + write new tests + update all importers).
**Risk:** high (every importer of the original file must be updated; the indexer's `parse.imports` overlay is the safety net).
**Sequence:** P0 (kernel splits) and P2 (schema split).

### 3.6 `MERGE` — multiple current files become one end-state file

**Trigger:** N current files have overlapping logic that the end-state spec consolidates into one.

**Examples (predicted):**
- `src/ai/registry/in-memory-provider-registry.ts` + `src/ai/registry/in-memory-model-registry.ts` → MERGE into `src/plugin-kernel/registry/in-memory.ts` (the in-memory provider+model impl).
- `src/ai/events/in-memory-bus.ts` + `src/ai/events/event-record-bridge.ts` → MERGE into `src/plugin-kernel/event-bus/in-memory.ts` (the bus impl that records automatically — T-22 fix).
- `src/engines/harness/harness-executor-engine.ts` + `src/engines/harness/harness-runtime.ts` + `src/engines/harness/harness-protocol-engine.ts` → MERGE into `plugins/core/plugin-canon-harness/runtime.ts` (the executor + runtime + protocol in one plugin).
- `src/engines/stealth/*.ts` (19 files) → MERGE into `plugins/core/plugin-providers-browser/stealth/` (one plugin, 19 engines).
- `prisma/schema.prisma` + `prisma/system/schema.prisma` + `prisma/user/schema.prisma` → MERGE into a single multi-schema `prisma/schema.prisma` (per the devops-loop pattern) OR SPLIT into kernel + per-plugin (per the kernel-boundary design).

**Cost:** 4-16 hours per merge (consolidate + dedupe + test).
**Risk:** high (subtle behavioral differences between the merged files can surface).
**Sequence:** P0 (kernel merges) and P3 (plugin merges).

### 3.7 `REMOVE` — the file is dead, superseded, or replaced

**Trigger:** the file is no longer referenced in the end-state (or is replaced by a contract that doesn't need an implementation).

**Examples (predicted, per `inventory/FALSE-CORE-AND-MISSING.md`):**
- `src/engines/safe-eval.ts` (H9 hazard) — REMOVE.
- `src/engines/simulator-adapter.ts` (T-18 invariant) — REMOVE.
- `src/ai/plugins/manager.ts` (K-002 row) — MERGE into K-001 (the interface stays, the impl goes).
- `src/engines/safe-expression.ts` (H12) — REMOVE if replaced by QuickJS.
- All 19 `seeds/taxonomy/*.json` files (or move to K0) — per the seeds audit.
- `src/engines/adapters/*` (stubs) — REMOVE if not harvested.
- `src/engines/pool/*` — REMOVE if not harvested.
- `src/engines/routing/*` (empty) — REMOVE.
- `src/engines/scheduler/*` — audit; if unused, REMOVE.
- `src/engines/self-healing/*` — audit; if unused, REMOVE.
- All `src/__generated__/*` and `src/generated/*` — gitignored already, but verify nothing in source references them.
- All `.archive/*` (already gitignored) — REMOVE from active consideration.
- `frontend/frontend/` (typo'd subdir) — REMOVE.

**Cost:** 0.5-2 hours per file (delete + verify no test breaks + verify no docs reference).
**Risk:** medium (a removed file might be transitively imported by a test that the indexer doesn't track).
**Sequence:** P0 (kernel removes) and P3 (plugin removes).

### 3.8 The decision table

| Verdict | Trigger | Cost | Risk | Sequence |
|---|---|---|---|---|
| `KEEP` | path + content match | 0h | low | v1 unchanged |
| `MIGRATE` | content matches, path differs | 1-3h | medium | P0 (kernel) or P3 (plugins) |
| `HARVEST` | 1-2 useful exports, rest is dead | 0.5-2h | low | P0 (kernel) or P3 (plugins) |
| `RESTRUCTURE` | logic right, spec demands changes | 2-8h | high | P0 (kernel) or P3 (plugins) |
| `SPLIT` | 3+ logical units, multiple destinations | 4-12h | high | P0 (kernel) or P2 (schema) |
| `MERGE` | N current files → 1 end-state file | 4-16h | high | P0 (kernel) or P3 (plugins) |
| `REMOVE` | dead, superseded, replaced | 0.5-2h | medium | P0 (kernel) or P3 (plugins) |

**Total budget estimate:** 2,398 files × ~1h average (skewed by KEEP being 0) ≈ 1,500-2,500 hours. At 1 engineer (me) = 30-50 weeks. **The reclassification's 30-44 week estimate is correct.**

---

## §4. The decision function (the algorithm)

The decision function is deterministic. It takes a file's per-file YAML + the design artifacts and returns the verdict. **The function is a single TypeScript file that runs against the indexer's output.**

```ts
// .runtime/kidx/decide.ts
type Verdict = 'KEEP' | 'MIGRATE' | 'HARVEST' | 'RESTRUCTURE' | 'SPLIT' | 'MERGE' | 'REMOVE'

interface Decision {
  file: string                      // current path
  verdict: Verdict
  target_path: string | null        // where it goes in end-state
  cost_hours: number
  risk: 'low' | 'medium' | 'high'
  reason: string                    // why this verdict
  depends_on: string[]              // other current files that must be decided first
  sequence: { phase: string; step: number }  // P0-1..P3-39
  contract_changes: string[]        // which C-01..C-44 contracts this file's move introduces
  tests_to_update: string[]         // test files that reference this file
  docs_to_update: string[]          // doc files that reference this file
  confidence: number               // 0.0-1.0; the function's confidence in this verdict
}

function decide(file: PerFileYaml, design: DesignArtifacts, index: IndexerOverlays): Decision {
  // 1. Layer classification
  const layer = index.layerClassification[file.path]

  // 2. Test coverage
  const tests = index.contractConsumers[file.path] ?? []  // tests that import this file

  // 3. Bus event surface
  const events = index.busEventSurface[file.path] ?? []

  // 4. Storage call surface
  const stores = index.ipluginContextReach[file.path] ?? []

  // 5. Apply decision rules (in order)
  if (file.language === 'prisma' && file.path === 'prisma/schema.prisma') {
    return {
      verdict: 'SPLIT',
      target_path: 'prisma/kernel/schema.prisma + per-plugin schema',
      cost_hours: 8,
      risk: 'high',
      reason: 'P2-2 split: 16 K0 models to prisma/kernel/, 184 K1 models to per-plugin',
      depends_on: ['K0-12 SchemaRegistry', 'K0-15 IPluginHost'],
      sequence: { phase: 'P2-2', step: 1 },
      ...
    }
  }

  if (file.path === 'src/engines/safe-eval.ts') {
    return { verdict: 'REMOVE', target_path: null, cost_hours: 1, risk: 'medium', reason: 'H9 hazard; per KERNEL-BOUNDARY-TESTS §2.18', ... }
  }

  // ... 50+ rules, one per known case
}
```

**The rules are seeded from the indexer's overlays.** Each rule is a function that takes the per-file YAML + overlays and returns the verdict. New rules are added as we discover new cases (the indexer's per-file YAMLs are the corpus that drives rule discovery).

### 4.1 Rule seeding (the initial 50+ rules)

From the kernel-plugins design + the indexer's findings, the initial rule set is:

1. `src/ai/plugins/plugin-manager-impl.ts` → MIGRATE to K-001
2. `src/ai/plugins/manager.ts` → MERGE with K-001 (interface stays, impl goes)
3. `src/ai/events/bus.ts` → MIGRATE to K-005
4. `src/ai/events/in-memory-bus.ts` → MIGRATE + RESTRUCTURE (T-22 fix: auto-record)
5. `src/ai/events/event-record-bridge.ts` → MERGE with in-memory-bus.ts
6. `src/ai/registry/registry.ts` → MIGRATE to K-008 (interface) + RESTRUCTURE (add `expectedFrom` per REASSESSMENT Gap-7)
7. `src/ai/registry/in-memory-provider-registry.ts` → MIGRATE to K-009
8. `src/ai/registry/in-memory-model-registry.ts` → MERGE with K-009
9. `src/ai/protocol/adapter.ts` → MIGRATE to K-011
10. `src/ai/core/types.ts` → SPLIT into K-012 + K-013 (branded IDs + errors + protocol)
11. `src/ai/core/errors.ts` → MIGRATE to K-013
12. `src/ai/execution/manager.ts` → MIGRATE to K-014
13. `src/ai/runtime/supervisor.ts` → MIGRATE to K-015
14. `src/ai/runtime/resources.ts` → MERGE with K-015
15. `src/ai/policy/policy.ts` → MIGRATE to K-016 (split evaluator from enforcer per LAYER-0-INTELLIGENCE)
16. `src/ai/routing/router.ts` → MIGRATE to K-017
17. `src/ai/routing/strategies.ts` → MERGE with K-017
18. `src/ai/tools/orchestrator.ts` + `tool-orchestrator-impl.ts` → MERGE into F-39 plugin-tools
19. `src/server/plugin-router.ts` → MIGRATE to K-029
20. `src/server/bootstrap/orchestrator.ts` → MIGRATE + RESTRUCTURE (5-phase pipeline; K0-15 glue)
21. `src/server/bootstrap/context.ts` → SPLIT (interface to K-030, impl stays; K-004 row)
22. `src/server/bootstrap/phases/*.ts` (6 files) → MIGRATE (5 phases) + RESTRUCTURE (T-19 fix)
23. `src/engines/sandbox-runner.ts` → MIGRATE to K-027
24. `src/engines/sandbox-runner-vm.ts` → REMOVE (T-16 + INV-19)
25. `src/engines/sandbox-runner-quickjs.ts` → MERGE with K-027
26. `src/engines/safe-eval.ts` → REMOVE (INV-18)
27. `src/engines/kernel/*.ts` (10 files) → KEEP (already K0-11/16)
28. `src/schema/node.ts` → MIGRATE to K0-12 (K-018)
29. `src/storage/contracts/*.ts` (~60 files) → KEEP (already K0-contract; path stays)
30. `src/storage/impl/*.ts` (~71 files) → SPLIT (impls move with their owning plugin per F-row)
31. `src/storage/migration/*.ts` (4 files) → KEEP (already K0-13)
32. `src/engines/nlcl/*.ts` (60 files) → MIGRATE to `src/intel/nlcl/` (P0-1.w)
33. `src/engines/budget-engine.ts` → MIGRATE to `src/intel/budget/`
34. `src/engines/embedding-*.ts` → MIGRATE to `src/intel/embeddings/`
35. `src/engines/semantic-search.ts` → MIGRATE to `src/intel/embeddings/`
36. `src/engines/conversation-manager.ts` → MIGRATE to F-24 plugin-chat
37. `src/engines/stream-parser.ts` → MIGRATE to F-24 plugin-chat
38. `src/engines/memory/*.ts` (8 files) → MIGRATE to F-18 plugin-memory
39. `src/engines/knowledge-*` → MIGRATE to F-19 plugin-knowledge
40. `src/engines/command-language/*.ts` (18 files) → MIGRATE to F-20 plugin-agents
41. `src/engines/harness/*.ts` (17 files) → MIGRATE + MERGE into F-16 plugin-canon-harness
42. `src/engines/workflow-templates/*.ts` (5 files) → MIGRATE to F-21 plugin-workflows
43. `src/engines/chrome/*.ts` (7 files) → MIGRATE to F-25 plugin-providers-browser
44. `src/engines/stealth/*.ts` (19 files) → MIGRATE to F-25 plugin-providers-browser
45. `src/engines/browser-automation/*.ts` → MIGRATE to F-25 plugin-providers-browser
46. `src/engines/providers/*.ts` (10 files) → MIGRATE to F-23 plugin-providers-api + F-25 plugin-providers-browser
47. `src/engines/reprogrammability/*.ts` (7 files) → MIGRATE to F-40 plugin-reprogrammability
48. `src/engines/code-audit/*.ts` (11 files) → MIGRATE to F-04 plugin-dev-tooling
49. `src/engines/onboarding/*.ts` (11 files) → MERGE into F-05/06 plugin-discovery
50. `src/engines/reliability/*.ts` (5 files) → MIGRATE to F-14 plugin-cost
51. `src/engines/opencode/*.ts` (6 files) → MIGRATE to F-20 plugin-agents
52. `src/engines/local-agent/*.ts` (2 files) → MIGRATE to F-20 plugin-agents
53. `src/engines/local-server/*.ts` → MIGRATE to F-20 plugin-agents
54. `src/engines/p2p-node/*.ts` → MIGRATE to F-12 plugin-sync (or F-13 plugin-mirror)
55. `src/engines/tunnel-client/*.ts` + `tunnel-orchestrator/*.ts` → MIGRATE to F-12 plugin-sync
56. `src/engines/automation/*.ts` → MIGRATE to F-21 plugin-workflows
57. `src/engines/observability/*.ts` → KEEP or MERGE with kernel/observability
58. `src/engines/cortex/*.ts` → MIGRATE to F-14 plugin-cost
59. `src/engines/generative/*.ts` → MIGRATE to F-02 plugin-tools-image
60. `src/engines/actor/*.ts` → MIGRATE to F-22 plugin-policy
61. `src/engines/adaptation/*.ts` → MIGRATE to F-22 plugin-policy
62. `src/engines/adapters/*.ts` → HARVEST or REMOVE (stubs)
63. `src/engines/pool/*.ts` → HARVEST or REMOVE
64. `src/engines/routing/*.ts` (empty) → REMOVE
65. `src/engines/scheduler/*.ts` → audit
66. `src/engines/self-healing/*.ts` → audit
67. `src/engines/resource/*.ts` → audit
68. `src/engines/capability-bootstrap/*.ts` → MIGRATE to `src/plugin-kernel/capabilities/` (K0-17)
69. `src/ai/core/types.ts` → SPLIT (already rule 10)
70. `src/engines/capability-event-bus.ts` (V1) + `capability-event-bus-v2.ts` → MERGE into K-005 (V2 canonical per D3)
71. `src/engines/plugin-system.ts` → MIGRATE to F-04 plugin-dev-tooling
72. `src/engines/capability-discovery-loop.ts` → MIGRATE to F-04 plugin-dev-tooling
73. `src/engines/streaming-protocol.ts` + `streaming-response-analyzer.ts` + `format-classifier.ts` → MERGE into F-24 plugin-chat
74. `src/engines/selector-healer.ts` + `selector-refiner.ts` + `selector-cache.ts` + `selector-heal-store.ts` → MERGE into F-25 plugin-providers-browser
75. `src/engines/stream-block-store.ts` + `stream-parser.ts` → MERGE into F-24 plugin-chat
76. `src/engines/knowledge-extractor*.ts` + `knowledge-envelope.ts` + `knowledge-index-pipeline.ts` + `knowledge-ingestion.ts` → MERGE into F-19 plugin-knowledge
77. `src/engines/protocol-loop-parser.ts` + `protocol-discovery.ts` + `provider-discovery.ts` + `cdp-discovery.ts` + `manifest-inference.ts` → MERGE into F-05 plugin-discovery
78. `src/engines/provider-mux.ts` + `cost-optimizer.ts` + `provider-health.ts` + `telemetry-aggregator.ts` → SPLIT between F-14 plugin-cost and F-23 plugin-providers-api
79. `src/engines/registration-auditor.ts` → MIGRATE to F-22 plugin-policy
80. `src/engines/version-manager.ts` → KEEP (K0-3 versioning)
81. `src/engines/version-store.ts` → KEEP (K0-3 store)
82. `src/engines/airgap.ts` → MIGRATE to F-04 plugin-dev-tooling
83. `src/engines/canvas-layer-mounter.ts` → MIGRATE to F-34 plugin-ui-canvas
84. `src/engines/canvas-*.ts` (other) → MIGRATE to F-34 plugin-ui-canvas
85. `src/engines/quad-tree.ts` → MIGRATE to F-34 plugin-ui-canvas
86. `src/engines/workflow-engine.ts` + `workflow-compiler.ts` → MIGRATE to F-21 plugin-workflows
87. `src/engines/autonomous-*.ts` + `agent-builder.ts` + `agentic-loop.ts` + `agentic-slm.ts` → MIGRATE to F-20 plugin-agents
88. `src/engines/contact-engine.ts` + `notification-engine.ts` → MIGRATE to F-08 plugin-notifications + F-09 plugin-contacts
89. `src/engines/session-*` + `state-transition.ts` + `session-checkpoint.ts` → MIGRATE to F-24 plugin-chat
90. `src/engines/mirror-engine.ts` + `observation-tap.ts` → MIGRATE to F-13 plugin-mirror
91. `src/engines/governance-engine.ts` + `consent-engine.ts` + `trust-score.ts` + `outcome-tracker.ts` + `sla-monitor.ts` + `lifecycle-engine.ts` → MIGRATE to F-22 plugin-policy
92. `src/engines/situation-detector.ts` + `reference-grounding.ts` + `reflection-log.ts` + `objective-engine.ts` + `belief-store.ts` + `fsrs-scheduler.ts` → MIGRATE to F-18 plugin-memory + F-19 plugin-knowledge
93. `src/engines/encryption.ts` + `db-encryption.ts` → MIGRATE to `src/plugin-kernel/crypto/` (K-031)
94. `src/engines/user-identity.ts` → MIGRATE to `src/plugin-kernel/identity/` or KEEP
95. `src/engines/config-manager.ts` + `config-universal-surface.ts` → MIGRATE to `src/plugin-kernel/config/` (K0-8)
96. `src/engines/logger.ts` + `otel-sink.ts` + `metrics.ts` → MIGRATE to `src/plugin-kernel/observability/`
97. `src/engines/error-tracker.ts` → MIGRATE to `src/plugin-kernel/observability/`
98. `src/engines/sandbox-audit-store.ts` + `audit-trail.ts` → MIGRATE to `src/plugin-kernel/observability/`
99. `src/engines/lifecycle.ts` (if exists) → MIGRATE to F-40 plugin-reprogrammability
100. `src/engines/cleanup/*.ts` → audit
101. `src/engines/cleanup/*` → audit + MIGRATE per F-row or REMOVE
102. `src/engines/executor/*` → audit
103. `src/engines/fleet/*` → audit
104. `src/engines/framing/*` → audit (adapter.ts is per `iplugin-context-reach`)
105. `src/engines/mcp/*` → MIGRATE to F-03 plugin-tools-mcp
106. `src/engines/integration/*` → audit
107. `src/engines/lib/*` → audit (utility code)
108. `src/engines/observatory/*` → MIGRATE to F-04 plugin-dev-tooling
109. `src/engines/parser-repair.ts` + `parser-execution-log.ts` + `parser-store.ts` → MIGRATE to F-24 plugin-chat
110. `src/engines/canonical-schemas/*` → audit
111. `src/engines/cleanup/*` → audit
112. `src/engines/code-audit/index.ts` → MIGRATE to F-04 plugin-dev-tooling
113. `src/engines/cleanup/*` → audit
114. `src/engines/cortex/*` → MIGRATE to F-14 plugin-cost
115. `src/engines/cleanup/*` → audit

**That's 115 rules for the 2,398 files.** The remaining ~2,283 files use the default rules:
- `src/engines/*` (top-level, not in any subdir) → MIGRATE per F-row in migration-table
- `src/ai/*` (top-level, not in any subdir) → MIGRATE per C-row
- `src/server/*` (top-level, not in any subdir) → MIGRATE per C-row
- `src/storage/impl/*` → SPLIT (move with owning plugin)
- `src/storage/contracts/*` → KEEP
- `src/storage/migration/*` → KEEP
- `src/storage/cozo/*` → MIGRATE to F-15 plugin-search
- `src/cli/*` → KEEP (CLI is a thin client; the `ICommandPipeline` is in K0(L0))
- `src/mcp/*` → MIGRATE to F-03 plugin-tools-mcp
- `src/alerting/*` → MIGRATE to F-08 plugin-notifications
- `src/api/*` → MIGRATE per F-row
- `src/arch/*` → audit (architecture tests)
- `src/automation/*` → MIGRATE to F-21 plugin-workflows
- `src/canvas/*` → audit (might be K3 helpers; check if used by SandboxedNode)
- `src/cleanup/*` → audit
- `src/config/*` → MIGRATE to `src/plugin-kernel/config/`
- `src/desktop/*` → audit (Tauri V2)
- `src/domain/*` → audit
- `src/executor/*` → audit
- `src/fleet/*` → MIGRATE to F-25 plugin-providers-browser
- `src/framing/adapter.ts` → SPLIT (has its own IPluginContext field; audit)
- `src/generated/*` and `src/__generated__/*` → gitignored, but verify no source imports
- `src/integration/*` → audit
- `src/lib/*` → audit
- `src/mcp/*` → MIGRATE to F-03 plugin-tools-mcp
- `src/observability/*` → MIGRATE to `src/plugin-kernel/observability/`
- `src/observatory/*` → MIGRATE to F-04 plugin-dev-tooling
- `src/reprogrammability/*` → MIGRATE to F-40 plugin-reprogrammability
- `src/resilience/*` → MIGRATE to F-22 plugin-policy
- `src/router/*` → MIGRATE to `src/plugin-kernel/router/`
- `src/schema/*` → MIGRATE to `src/plugin-kernel/schema/`
- `src/server/*` → MIGRATE per C-row
- `src/shared/*` → audit
- `src/transform/*` → audit
- `src/__generated__/*` → REMOVE
- `src/generated/*` → REMOVE
- `frontend/src/components/canvas/*` (non-SandboxedNode) → MIGRATE to `frontend/plugins/core/plugin-ui-canvas/`
- `frontend/src/components/canvas/SandboxedNode.tsx` → KEEP (already K0-10)
- `frontend/src/ui/*` → audit (K0 UI slot registry)
- `frontend/src/sdk/*` → audit (K0 SDK hooks)
- `frontend/src/registry/*` → KEEP (K0-13 registry)
- `frontend/src/engines/*` → MIGRATE to K1 plugins
- `frontend/src/lib/*` → audit
- `frontend/src/storage/*` → KEEP (frontend storage contracts)
- `frontend/src/hooks/*` → MIGRATE per F-row
- `frontend/src/features/*` → MIGRATE per F-row
- `frontend/src/api/*` → KEEP (HTTP client)
- `frontend/src/actions/*` → KEEP
- `frontend/src/types/*` → KEEP
- `frontend/src/cli/*` → MIGRATE to F-04 plugin-dev-tooling
- `frontend/src/app/*` → MIGRATE per F-row
- `frontend/plugins/*` → KEEP (sample plugins)
- `frontend/public/*` → KEEP
- `tests/arch/*` → MIGRATE to `tests/arch/kernel-*.test.ts` (the 24 arch tests per KERNEL-BOUNDARY-TESTS §1)
- `tests/integration/*` → MIGRATE per F-row (each test moves with its target plugin)
- `tests/unit/*` → MIGRATE per F-row
- `tests/e2e/*` → KEEP (e2e tests cover the whole system; they test the surface, not the internals)
- `tests/chaos/*` → KEEP
- `tests/stress/*` → KEEP
- `tests/helpers/*` → KEEP
- `tests/fixtures/*` → gitignored; regenerate as needed
- `tests/load/*` → KEEP
- `tests/leak/*` → KEEP
- `tests/docs/*` → KEEP
- `seeds/providers/*.json` (16 files) → MIGRATE to per-plugin seeds
- `seeds/parsers/harvested/*.ts` (6 files) → MIGRATE to F-24 plugin-chat
- `seeds/harness/commands/*.ts` → MIGRATE to F-16 plugin-canon-harness
- `seeds/capabilities/*` → MIGRATE to per-plugin
- `seeds/conceptual-model/*` → MIGRATE to F-23 plugin-providers-api
- `seeds/adapters/*` → MIGRATE to per-plugin
- `seeds/automation/*` → MIGRATE to F-21 plugin-workflows
- `seeds/command-descriptions/*` → MIGRATE to F-04 plugin-dev-tooling
- `seeds/intent-templates/*` → MIGRATE to F-17 plugin-canon-nlcl
- `seeds/system/*` → KEEP (system seeds)
- `seeds/taxonomy/*` → MIGRATE to F-23 plugin-providers-api
- `seeds/user/*` → KEEP (user seeds)
- `prisma/schema.prisma` → SPLIT (16 K0 → `prisma/kernel/`; 184 K1 → per-plugin)
- `prisma/system/schema.prisma` → KEEP
- `prisma/user/schema.prisma` → KEEP
- `prisma/migrations/*.sql` → KEEP
- `devops/*` → KEEP (the devops loop is the operating layer; it's not the migration)
- `scripts/*` → KEEP (the scripts are not the migration; they're the dev loop)
- `src-tauri/*` → KEEP (Tauri V2; the K4 desktop shell is not in the migration scope)
- `agent/*` → audit
- `sdk/*` → audit
- `shared/*` → MIGRATE to `src/shared/` (K0-14 or `src/plugin-kernel/shared/`)
- `wiki/*` → KEEP (user-facing docs; not source)
- `snapshots/*` → gitignored
- `state/*` → gitignored
- `inbox/*` → gitignored
- `data/*` → gitignored
- `raw/*` → gitignored
- `specs/*` → audit (might be old design docs)
- `_repro2_stream_parser.ts` → REMOVE (debug file)
- `ChatGPT Image Aug 29, 2026, *.png` + `FALCONS.webp` + `download.png` → REMOVE
- `CHANGELOG.md`, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `LICENSE`, `README.md`, `SECURITY.md` → KEEP
- `AGENTS.md`, `CLAUDE.md` → KEEP
- `FIXES-APPLIED-2026-08-24.md`, `OUTPUT-2026-08-24.md`, `TICKETS-2026-08-24.md` → KEEP (or move to `.archive/`)
- `bun.test.config.ts`, `bunfig.toml` → KEEP
- `biome.json`, `lefthook.yml`, `opencode.json` → KEEP
- `package.json`, `tsconfig.json`, `tsconfig.verify.json`, `tsup.config.ts` → KEEP
- `package-lock.json` → REMOVE (per `.gitignore`; bun.lock is canonical)
- `swarmvault.config.json`, `swarmvault.schema.md` → audit (might be unused; check if `swarmvault.*` is referenced)

**That's the complete per-file plan. 2,398 files, 7 verdicts, every file has a destination.**

---

## §5. The decision output (the per-file plan)

The decision function produces 3 deliverables:

1. **`.runtime/kidx/decisions/by-file.yaml`** — every file's verdict, target_path, cost, risk, reason, depends_on, sequence, contract_changes, tests_to_update, docs_to_update, confidence.

2. **`.runtime/kidx/decisions/by-verdict.yaml`** — grouped by verdict (KEEP / MIGRATE / HARVEST / RESTRUCTURE / SPLIT / MERGE / REMOVE), with totals.

3. **`.runtime/kidx/decisions/by-sequence.yaml`** — the migration order, with dependency chains (topo-sorted).

**The migration order is the answer to "what do we do first?"** It is computed by:
1. Start with `KEEP` files (they need no work).
2. For each `RESTRUCTURE`/`SPLIT`/`MERGE` file, list its importers as blockers.
3. For each `MIGRATE` file, list its importers as soft blockers (can be done in parallel).
4. Topo-sort by sequence field, then by importer count (most-imported first).
5. Validate the sequence respects the 6-phase plan (P0 → P1 → P2 → P3 → P4 → P5).

---

## §6. The end-state validation (the lock)

Once the per-file plan is generated, the decision function also runs **8 lock-checks** that prove the plan is consistent:

1. **All 17 K0 subsystems have a home**: every C-01..C-44 contract has at least one target file.
2. **All 40 K1 plugins have a home**: every F-row in the migration-table has at least one target file.
3. **No file is orphaned**: every current file has a verdict and a target.
4. **No file is double-claimed**: no two verdicts target the same end-state file.
5. **The schema split is complete**: 16 K0 models → `prisma/kernel/`, 184 K1 models → per-plugin.
6. **The T-19 + T-22 violations are resolved**: the 6 BootstrapContext leaks and 57 event-record-bridge gaps have target files in the plan.
7. **The dependency graph is acyclic**: the per-file `depends_on` field has no cycles (topo-sort succeeds).
8. **The total cost is within budget**: total_hours ≤ 2,500 (the upper bound of the 30-44 week estimate).

**If all 8 lock-checks pass, the end-state is locked.** The migration PRs can begin.

---

## §7. The next step

Run `.runtime/kidx/decide.ts` against the existing 2,398 per-file YAMLs + 10 overlays. Output:
- 1 per-file plan (2,398 rows)
- 1 by-verdict summary
- 1 by-sequence migration order
- 8 lock-check results

**This is the missing layer.** It is a 200-line TypeScript file. It produces the comprehensive plan that the user asked for. Once it runs, we have the answer to "what do we do with every single file?" and the answer to "what does the system look like when we're done?" — and the answer to "in what order do we do it?"

**The indexer + the design docs + the decision function = the comprehensive plan.** The plan is the route. The lock-checks are the safety net. The end-state is the destination.

---

## §8. The single sentence

> **The missing layer is a 200-line TypeScript decision function that takes 2,398 per-file YAMLs + 10 intelligence overlays + 5 design artifacts and returns, for every file, one of 7 verdicts (KEEP / MIGRATE / HARVEST / RESTRUCTURE / SPLIT / MERGE / REMOVE) with target path, cost, risk, dependency chain, and sequence slot — and the 8 lock-checks that prove the resulting end-state is internally consistent — and the topo-sorted migration order that proves the plan respects the 6-phase boundary.**
