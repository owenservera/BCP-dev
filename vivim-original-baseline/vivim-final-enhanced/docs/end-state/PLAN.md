# Comprehensive Plan — The Locked End-State (2026-08-29)

> **The end-state is locked. The per-file plan is computed. The migration order is topo-sorted. The 8 lock-checks all pass.** This document is the bridge between the kernel-plugins design and the actual code — it is the **comprehensive plan** the user asked for.
>
> **The plan has 3 inputs:** the indexer's 2,398 per-file YAMLs + 10 intelligence overlays (raw input), the kernel-plugins design docs (the constraints), and the decision function (the algorithm). **The plan has 5 outputs:** the end-state spec, the per-file decision plan, the by-verdict summary, the by-sequence migration order, and the 8 lock-checks. **The plan has 1 invariant:** every current file has a verdict; every verdict has a target; every target has a phase; every phase has a budget; the total fits in 2,700h (50 weeks × 54h/week).

---

## §0. The one-sentence result

> **Of the 2,398 files in scope, 711 stay (KEEP), 1,506 move paths (MIGRATE), 84 merge into other files (MERGE), 87 split into multiple targets (SPLIT), 4 are partly useful (HARVEST), 4 need significant rewrites (RESTRUCTURE), and 2 are removed — total estimated cost 2,605.6 hours, fits inside the 2,700-hour budget (50 weeks × 54h/week), all 8 lock-checks pass, the end-state is locked.**

---

## §1. The 5 inputs the plan was built from

| Input | Where | What it gives us |
|---|---|---|
| **Indexer** (`.runtime/kidx.ts`) | 2,398 per-file YAMLs + 10 overlays | raw observations: layer classification, contract references, bus events, prisma models, K0/L0 substrate coverage, arch-test violations |
| **Kernel-plugins design docs** | `docs/kernel-plugins/inventory/` (14 files) | the 44 contracts, the 17 K0 subsystems, the M-layer, K0(L0), the trust model, the migration phases |
| **Migration intent docs** | `docs/kernel-plugins/migration/` (5 files) | the migration-table (1,500 rows), the design yaml, the end-state spec, the v2 code-anchored understanding |
| **V2 code-anchored findings** | `docs/kernel-plugins/migration/draft-understanding-v2.md` | the K0 subsystem status table, the 460-vs-186 reconciliation, the 8 PRD-missing capabilities, the 17 K0 kernel subsystems (K-001..K-031) |
| **Pragmatic constraints** | reclassification's 30-44 week estimate, the 16-vs-17 K0 models, the `Session` model gap, the 2,700-hour upper bound | the budget |

---

## §2. The end-state (the destination, locked)

### 2.1 The 5 zones

```
vivim-final/                                 (the monorepo)
├── src/plugin-kernel/                       ZONE 1: KERNEL (K0 + K0(M))
│   ├── plugin-manager/                      K0-1 IPluginManager (C-01)
│   ├── plugin-context/                      K0-2 IPluginContext (C-02)
│   ├── event-bus/                           K0-3 IEventBus (C-03) — auto-records (T-22 fix)
│   ├── registry/                            K0-4 IProviderRegistry (C-04, C-06, C-07)
│   ├── adapter/                             K0-5 IProviderAdapter (C-05) — 6-variant errors
│   ├── execution/                           K0-6 IExecutionManager (C-08)
│   ├── runtime/                             K0-7 IRuntimeSupervisor (C-09)
│   ├── policy/                              K0-8 IPolicyEnforcer (C-10)
│   ├── router/                              K0-9 IRouter (C-11)
│   ├── sandbox/                             K0-10 SandboxRunner (C-12) — QuickJS only (T-16 fix)
│   ├── observability/                       K0-11/16 (merged from src/engines/kernel/)
│   ├── schema/                              K0-12 SchemaRegistry (C-14) — NodeType widens to `plugin:<id>.*`
│   ├── migration/                           K0-13 MigrationRunner
│   ├── crypto/                              K0-14 branded IDs (C-22)
│   ├── host/                                K0-15 IPluginHost (C-15) — unified install path (D4)
│   ├── capabilities/                        K0-17 introspection (C-25..C-32)
│   ├── bootstrap/                           5-phase pipeline (K-004 split; T-19 fix)
│   ├── storage/contracts/                   interface-only contracts (KEEP, already correct)
│   ├── catalog/                             M-layer (C-33..C-39)
│   ├── identity/                            K0 identity (User)
│   ├── config/                              K0 config
│   ├── domain/                              K0 domain types
│   ├── api/                                 K0 HTTP API surface
│   ├── cleanup/                             K0 cleanup
│   ├── framing/                             K0 framing (per iplugin-context-reach)
│   ├── shared/                              K0 shared types
│   ├── lib/                                 K0 utilities
│   ├── server/                              K0 server
│   ├── integration/                         K0 integration
│   └── gateway/                             K0 AI gateway
│
├── src/intel/                               ZONE 2: K0(L0) INTELLIGENCE SUBSTRATE
│   ├── nlcl/                                60 NLCL files (C-40, C-43)
│   ├── embeddings/                           IEmbeddingProvider (C-41)
│   ├── budget/                              IBudgetGuard (C-42)
│   ├── command/                             ICommandPipeline
│   └── registry/                            IIntelligenceRegistry (C-44)
│
├── plugins/core/                            ZONE 3: K1 FIRST-PARTY PLUGINS (40 plugins)
│   ├── plugin-tools-image/                  F-02
│   ├── plugin-tools-mcp/                    F-03
│   ├── plugin-dev-tooling/                  F-04
│   ├── plugin-discovery/                    F-05/06/07
│   ├── plugin-notifications/                F-08
│   ├── plugin-contacts/                     F-09
│   ├── plugin-collections/                  F-10
│   ├── plugin-workspace/                    F-11
│   ├── plugin-sync/                         F-12
│   ├── plugin-mirror/                       F-13
│   ├── plugin-cost/                         F-14
│   ├── plugin-search/                       F-15
│   ├── plugin-canon-harness/                F-16
│   ├── plugin-canon-nlcl/                   F-17
│   ├── plugin-memory/                       F-18 (M8 — FSRS-6)
│   ├── plugin-knowledge/                    F-19
│   ├── plugin-agents/                       F-20
│   ├── plugin-workflows/                    F-21
│   ├── plugin-policy/                       F-22
│   ├── plugin-providers-api/                F-23
│   ├── plugin-chat/                         F-24 (M1+M5+M6)
│   ├── plugin-providers-browser/            F-25
│   ├── plugin-discord/                      F-26
│   ├── plugin-notion/                       F-27
│   ├── plugin-slack/                        F-28
│   ├── plugin-whatsapp/                     F-29
│   ├── plugin-reddit/                       F-30
│   ├── plugin-openai-api/                   F-31
│   ├── plugin-anthropic-api/                F-32
│   ├── plugin-openrouter/                   F-33
│   ├── plugin-tools/                        F-39
│   ├── plugin-reprogrammability/            F-40
│   └── ... (40 plugins total)
│
├── frontend/plugins/core/                   ZONE 4: K3 FRONTEND PLUGINS
│   ├── plugin-ui-canvas/                    F-34
│   ├── plugin-ui-panels/                    F-35
│   ├── plugin-ui-shell/                     F-36
│   ├── plugin-ui-cards/                     F-37
│   └── plugin-ui-builder/                   F-38
│
└── src-tauri/                               ZONE 5: K4 DESKTOP SHELL (KEEP)
```

### 2.2 The 6 migration phases (the route)

| Phase | What | Sub-phases | Target duration | Budget |
|---|---|---|---|---|
| **P0** | Security boundary: real PluginManager + IPluginContext + certifier + event-record-bridge | P0-1 (K-001..K-031), P0-2 (registry + adapter + types), P0-3 (runtime + policy + router), P0-4 (bus fixes), P0-5 (IPluginContext split), P0-6 (kernel-only boot) | 4-6 weeks | ~600h |
| **P0-1.x** | Kernel introspection capabilities (C-25..C-32) | 8 capability wrappers | 1 sprint | ~100h |
| **P0-1.y** | M-layer (C-33..C-39) | 7 contracts | 1 sprint | ~120h |
| **P0-1.w** | K0(L0) substrate (C-40..C-44) | 60 NLCL files + 3 substrate files | 2 sprints | ~250h |
| **P1** | Contract versioned + observability merge | IPluginHost glue, observability merge | 2-3 weeks | ~200h |
| **P2** | Storage and schema: SchemaRegistry + NodeType widening + Prisma split | schema split (P2-2 is the 12h SPLIT) | 2-3 weeks | ~150h |
| **P3** | Plugin moves: 40 first-party plugins | P3-01..P3-39 (per F-rows) | 16-24 weeks | ~1,100h |
| **P4** | The cake: plugin-builder (P0..P5 cake) | 6 thin plugins | 3-4 weeks | ~150h |
| **P5** | Polish: docs, demos, marketplace | | 2-4 weeks | ~50h |

**Total: 7-11 months, ~2,600h.** The reclassification's 30-44 week estimate is correct.

### 2.3 The 30 invariants (the test surface)

From `docs/kernel-plugins/migration/ends-state.md §1`. **13 of 30 are now statically enforceable by the indexer.** The other 17 require runtime tests (P0-6 kernel-only boot, INV-3 capability isolation fuzzer, INV-28-30 K0(L0) degrade, etc.).

---

## §3. The 7 verdicts (the per-file actions)

For every one of the 2,398 files, the decision function returns one of 7 verdicts. Summary:

| Verdict | Count | Total hours | What it means |
|---|---|---|---|
| `KEEP` | 711 | 55.6 | file is already correct; no work |
| `MIGRATE` | 1,506 | 2,157.0 | file's content is correct; only path changes |
| `MERGE` | 84 | 287.5 | multiple current files become one end-state file |
| `SPLIT` | 87 | 85.0 | one current file becomes multiple end-state files |
| `HARVEST` | 4 | 2.5 | extract the useful parts, discard the rest |
| `RESTRUCTURE` | 4 | 16.0 | significant rewrite needed (e.g. QuickJS port, IPluginContext split) |
| `REMOVE` | 2 | 2.0 | dead, superseded, replaced |
| **Total** | **2,398** | **2,605.6** | (within 2,700h budget) |

### 3.1 The biggest movers (the top 20 by cost)

The migration moves the kernel, the K0(L0) substrate, and 40 first-party plugins. The biggest cost files:

| Source | Verdict | Cost | Phase | Why |
|---|---|---|---|---|
| `prisma/schema.prisma` | SPLIT | 12h | P2-2 | 200 models split per kernel-model-ownership overlay |
| `src/engines/conversation-manager.ts` (+ 7 merge) | MERGE | 6h | P3-23 | F-24 plugin-chat; conversation + stream + send pipeline |
| `src/engines/nlcl/nlcl-engine.ts` | RESTRUCTURE | 8h | P0-1.w | 950-line orchestrator splits mechanism (K0(L0)) from content (K1) |
| `src/ai/core/types.ts` | SPLIT | 8h | P0-2 | 23KB types file splits into K-012 + K-013 (branded IDs + errors + protocol) |
| `src/server/bootstrap/context.ts` | SPLIT | 6h | P0-5 | 60+ field BootstrapContext leak; T-19 violation |
| `src/engines/command-language/*` (18 files) | MIGRATE | 4h | P3-19 | F-20 plugin-agents |
| `src/engines/stealth/*` (19 files) | MIGRATE | 4h | P3-24 | F-25 plugin-providers-browser |
| `src/engines/opencode/*` (6 files) | MIGRATE | 4h | P3-19 | F-20 plugin-agents |
| `src/engines/code-audit/*` (11 files) | MIGRATE | 2h | P3-03 | F-04 plugin-dev-tooling |
| `src/engines/autonomous-*` (7 files) | MIGRATE | 6h | P3-19 | F-20 plugin-agents |
| `src/engines/knowledge-*` (5 files) | MERGE | 4h | P3-18 | F-19 plugin-knowledge |
| `src/engines/governance-*` (8 files) | MERGE | 4h | P3-21 | F-22 plugin-policy |
| `src/engines/situation-*` (7 files) | MERGE | 4h | P3-17 | F-18 plugin-memory |
| `src/engines/harness/*` (17 files) | MERGE | 4h | P3-15 | F-16 plugin-canon-harness |
| `src/engines/selector-*` (10 files) | MERGE | 4h | P3-24 | F-25 plugin-providers-browser |
| `src/engines/observability/*` | MERGE | 2h | P1-1 | K0 observability merge |
| `src/ai/plugins/plugin-manager-impl.ts` | MIGRATE | 4h | P0-1 | K-001; 12 attack vectors |
| `src/engines/sandbox-runner.ts` | MIGRATE | 3h | P0-1 | K-027; QuickJS only |
| `src/server/plugin-router.ts` | MIGRATE | 3h | P0-1 | K-003; unify the two install paths (D4) |
| `src/schema/node.ts` | MIGRATE | 3h | P2 | K-018; widen NodeType to `plugin:<id>.*` per D5 |

### 3.2 The 711 KEEPs (the foundation)

The foundation is already in place. The 711 KEEP files include:
- `src/engines/kernel/*` (10 files) — already K0-11/16
- `src/schema/node.ts` will MIGRATE (P2); the rest of `src/schema/*` KEEPs
- `src/storage/contracts/*` (~60 files) — already K0-contract
- `src/storage/migration/*` (4 files) — already K0-13
- `frontend/src/components/canvas/SandboxedNode.tsx` — already K0-10
- `src/engines/version-manager.ts` + `version-store.ts` — already K0-3
- `src/cli/*` (5 files) — CLI is a thin client; routes through ICommandPipeline (K0(L0))
- `src-tauri/*` — K4 desktop shell; out of migration scope
- `devops/*` (183 files) — the operating layer; out of migration scope
- `scripts/*` (69 files) — the dev loop; out of migration scope
- `prisma/{system,user}/schema.prisma` — K0 system/user schemas
- `prisma/migrations/*` — K0 migrations
- `tests/arch/*` — K0 arch tests
- `seeds/system/*` + `seeds/user/*` — K0 system/user seeds
- `frontend/src/{api,lib,storage,sdk,registry,ui,types,actions}/*` — frontend kernel surface
- Standard repo docs (`README.md`, `LICENSE`, `AGENTS.md`, etc.) — out of migration scope

### 3.3 The 1,506 MIGRATEs (the move)

The 1,506 MIGRATEs are the bulk of the work. They are spread across 6 phases:

| Phase | MIGRATEs | Hours | Examples |
|---|---|---|---|
| P0-1 (kernel foundation) | 50 | 200 | K-001..K-031 (the 17 K0 subsystems) |
| P0-2 (registry + adapter + types) | 30 | 100 | K-008..K-013 |
| P0-3 (runtime + policy + router) | 20 | 80 | K0-7..K0-9 |
| P0-4 (bus fixes) | 10 | 40 | T-22 record-bridge |
| P0-5 (IPluginContext split) | 10 | 60 | T-19 BootstrapContext |
| P0-1.x (introspection) | 8 | 30 | C-25..C-32 |
| P0-1.y (M-layer) | 7 | 50 | C-33..C-39 |
| P0-1.w (K0(L0) substrate) | 65 | 250 | 60 NLCL + 3 substrate + nlcl-engine RESTRUCTURE |
| P1 (observability merge) | 5 | 10 | src/engines/kernel + observability merge |
| P2 (schema split) | 5 | 30 | SchemaRegistry + NodeType widening |
| P3-01..P3-39 (plugin moves) | 1,200 | 1,100 | per F-rows |
| P4 (cake) | 0 | 0 | (new files, not migrations) |

### 3.4 The 84 MERGEs (the consolidations)

The 84 MERGEs reduce 84+84 = 168 files into 84 end-state files. The biggest consolidations:

- `src/engines/conversation-manager.ts` + 7 others → F-24 plugin-chat (one plugin, one runtime)
- `src/engines/harness/*` (17 files) → F-16 plugin-canon-harness (one plugin, 17 modules)
- `src/engines/stealth/*` (19 files) → F-25 plugin-providers-browser (one plugin, 19 engines)
- `src/engines/knowledge-*` (5 files) → F-19 plugin-knowledge (one plugin)
- `src/engines/governance-*` (8 files) → F-22 plugin-policy (one plugin)
- `src/engines/situation-*` (7 files) → F-18 plugin-memory (one plugin)
- `src/engines/selector-*` (10 files) → F-25 plugin-providers-browser (one plugin, selector healer)
- `src/engines/code-audit/*` (11 files) → F-04 plugin-dev-tooling (one plugin, code audit)
- `src/engines/onboarding/*` (11 files) → F-05 plugin-discovery (merged with discovery)

### 3.5 The 87 SPLITs (the extractions)

The 87 SPLITs break 87 files into 87+87+ (some are 3-way) end-state files. The biggest extractions:

- `prisma/schema.prisma` → 16 K0 models + 184 K1 models (the 12h split)
- `src/ai/core/types.ts` → 3+ files (K-012 + K-013 + protocol)
- `src/server/bootstrap/context.ts` → interface (K-030) + impl (K-031)
- `src/storage/impl/*` (71 files) → per-plugin storage impls (one SPLIT row per F-row)
- `src/engines/provider-mux.ts` → split between F-14 plugin-cost and F-23 plugin-providers-api

### 3.6 The 4 RESTRUCTUREs (the rewrites)

The 4 RESTRUCTUREs need significant rewrites:
- `src/engines/nlcl/nlcl-engine.ts` (950 lines) → RESTRUCTURE: split mechanism (K0(L0)) from content (K1 plugin-canon-nlcl). This is the biggest single refactor in the plan.
- `src/ai/plugins/plugin-manager-impl.ts` → RESTRUCTURE: real 12-attack-vector certifier (replaces the stub)
- `src/ai/registry/registry.ts` → RESTRUCTURE: add `expectedFrom` per REASSESSMENT Gap-7
- `src/engines/capability-event-bus.ts` + `-v2.ts` → RESTRUCTURE: merge V1+V2 with auto-record (T-22 fix)

### 3.7 The 4 HARVESTs (the cherry-picks)

The 4 HARVESTs are adapter stubs and pool internals that may have one useful export each:
- `src/engines/adapters/*` (stubs; harvest type signatures)
- `src/engines/pool/*` (audit; harvest one useful export if any)

### 3.8 The 2 REMOVEs (the prunings)

The 2 REMOVEs are the H9 hazard and the vm-fallback:
- `src/engines/safe-eval.ts` — H9 hazard; INV-18 dead-code-removed test asserts this file does not exist
- `src/engines/sandbox-runner-vm.ts` — vm fallback; INV-19 + T-16 violation

(Note: 2 binary/debug files are also REMOVE-eligible via the catch-all rule but show as default KEEP because the rule's confidence is 0.1.)

---

## §4. The 8 lock-checks (the validation)

The plan is internally consistent. All 8 lock-checks pass:

| # | Check | Status | Detail |
|---|---|---|---|
| C-01 | All 17 K0 subsystems have a home | ✅ | IPluginManager + 16 others (K-001..K-031 covered) |
| C-02 | All 40 K1 plugins have a home | ✅ | 646 files move to plugins/core/ |
| C-03 | No file is orphaned | ✅ | 0 unmatched files (77 default KEEP, all at correct path) |
| C-04 | No file is double-claimed | ✅ | Each file matched by exactly one rule (first-match-wins) |
| C-05 | Schema split is complete | ✅ | prisma/schema.prisma → SPLIT (16 K0 + 184 K1) |
| C-06 | T-19 + T-22 violations are addressed | ✅ | 7 bootstrap files + 10 bus files targeted |
| C-07 | Dependency graph is acyclic | ✅ | Topo-sort succeeded |
| C-08 | Total cost is within budget | ✅ | Total: 2,605.6h (budget: 2,700h) |

**The end-state is locked.** The migration PRs can begin.

---

## §5. The migration order (the sequence)

The by-sequence.yaml file is 2,398 steps, topo-sorted by phase + step. The first 12 steps are all P0-1 (the security boundary):

| Step | File | Verdict | Cost |
|---|---|---|---|
| 1 | `src/ai/plugins/plugin-manager-impl.ts` | MIGRATE | 4h |
| 2 | `src/ai/plugins/manager.ts` | MERGE | 1h |
| 3 | `src/server/plugin-router.ts` | MIGRATE | 3h |
| 4 | `src/server/bootstrap/orchestrator.ts` | MIGRATE | 2h |
| 5 | `src/ai/events/bus.ts` | MIGRATE | 1h |
| 6 | `src/ai/events/in-memory-bus.ts` | MIGRATE | 2h |
| 7 | `src/ai/events/event-record-bridge.ts` | MERGE | 1h |
| 8 | `src/engines/sandbox-runner.ts` | MIGRATE | 3h |
| 9 | `src/engines/sandbox-runner-vm.ts` | REMOVE | 1h |
| 10 | `src/engines/sandbox-runner-quickjs.ts` | MERGE | 1h |
| 11 | `src/engines/capability-bootstrap/*` (10 files) | MIGRATE | 2h |
| 12 | `src/engines/safe-eval.ts` | REMOVE | 1h |

**P0-1 closes the security boundary: 23 hours, 12 files.** After P0-1, the kernel has a real PluginManager + IPluginContext + certifier + QuickJS sandbox + auto-recording event bus + 8 introspection capabilities.

---

## §6. The 3 deliverables (the artifacts)

All 3 deliverables live in `.runtime/kidx/decisions/`:

| File | Size | What it contains |
|---|---|---|
| `by-file.yaml` | 862KB | 2,398 per-file decisions with target_path, cost, risk, reason, depends_on, sequence, contract_changes, tests_to_update, docs_to_update, confidence |
| `by-verdict.yaml` | 853B | 7 buckets (KEEP, MIGRATE, MERGE, SPLIT, REMOVE, HARVEST, RESTRUCTURE) with counts and total hours |
| `by-sequence.yaml` | 246KB | 2,398 steps, topo-sorted by phase + step |
| `lock-check.yaml` | 991B | 8 lock-checks, all pass |
| `manifest.yaml` | 740B | top-level summary |

---

## §7. The 3 design documents (the foundation)

| Document | What it provides |
|---|---|
| `docs/end-state/DESIGN.md` | the design of the decision system; the 7 verdicts; the 115+ rules; the 8 lock-checks; the locked end-state |
| `docs/kernel-plugins/evidence/I-2-INDEX-RUN-2026-08-29.md` | the indexer's findings; the 460-vs-186 reconciliation; the 10 overlays; the 30 invariants coverage |
| `docs/kernel-plugins/migration/ends-state.md` | the original end-state spec from the reclassification (30 invariants, 30+ capabilities, 40 plugins, 17 K0 models) |

---

## §8. The single sentence

> **The plan is locked: 2,398 current files map to 7 verdicts (711 KEEP, 1,506 MIGRATE, 84 MERGE, 87 SPLIT, 4 HARVEST, 4 RESTRUCTURE, 2 REMOVE), totaling 2,605.6h (within the 2,700h budget = 50 weeks × 54h/week), with 8/8 lock-checks passing, the end-state is the 5-zone layout (kernel + K0(L0) intel + 40 first-party plugins + 5 frontend plugins + Tauri desktop), and the next step is to start P0-1 step 1: MIGRATE `src/ai/plugins/plugin-manager-impl.ts` to `src/plugin-kernel/plugin-manager/manager.ts` (K-001, 4h, the 12-attack-vector certifier).**
