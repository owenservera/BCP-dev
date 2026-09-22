# Migration Design — Kernel/Plugin Boundary (v1)

> **The single source of truth for the file-by-file migration.** Every row in
> `migration-table.yaml` conforms to the schema in this file. Every new file in
> `migration-new-files.yaml` is designed against the contract shapes in
> `inventory/KERNEL-CONTRACTS.md` (C-01..C-44).
>
> **Read order:** this file → `migration-table.yaml` (the existing-source
> moves) → `migration-new-files.yaml` (the new files) → `inventory/*.md` (the
> source of truth for contracts and constitution).

---

## 0. The Ground Truth (2026-08-29, this clone)

Counts verified against the actual repo. The reclassification's earlier
numbers (186 engines, 40 contracts, no `src/engines/kernel/`) were
**directionally correct but quantitatively wrong**. The real numbers:

| Bucket | Files | Notes |
|---|---|---|
| `src/engines/` (top-level + subdirs) | 460 | 36 subdirs; `kernel/` (10) is K0 today |
| `src/ai/` (top-level + subdirs) | 35 | 12 subdirs; the AI-protocol / policy / runtime / registry kernel surface |
| `src/storage/contracts/` | 60 | The store-contract layer the boundary enforces |
| `src/storage/impl/` | 71 | Prisma + cozo impls; the per-model DB guts |
| `src/storage/cozo/` | 1 | Cozo layer; cross-store semantic search |
| `src/storage/migration/` | 4 | MigrationRunner + registry + types |
| `src/server/bootstrap/` | 7 | 5-phase pipeline: context, orchestrator, capabilities, knowledge, lifecycle, seeds, stores |
| `prisma/schema.prisma` models | 200 | Per reclassification: ~15 K0, ~185 K1 |
| `frontend/src/` | ~430 | 92 app, 30 engines, 23 lib, 23 sdk, 23 storage, 20 components, 18 hooks, 9 canvas, 9 features, 7 ml, 6 types, 4 actions, 3 api, 3 ui, plus minor |
| `tests/` | 495 | 11 subdirs; `tests/arch/` (8 files) is the boundary gate |
| `seeds/` | 53 | 9 providers, 8 harness, 2 parsers, plus adapters, capabilities, system, taxonomy, user, etc. |

**Total: ~1,800 files in the migration surface.** Plus the `tests/`, `docs/`,
`devops/`, `scripts/`, `frontend/plugins/`, `agent/`, `data/`, `sdk/`,
`shared/`, `src-tauri/`, `src/__generated__/`, `src/alerting/`,
`src/api/`, `src/arch/`, `src/automation/`, `src/canvas/`, `src/cleanup/`,
`src/cli/`, `src/config/`, `src/desktop/`, `src/domain/`, `src/executor/`,
`src/fleet/`, `src/framing/`, `src/generated/`, `src/integration/`,
`src/lib/`, `src/mcp/`, `src/observability/`, `src/observatory/`,
`src/reprogrammability/`, `src/resilience/`, `src/router/`, `src/schema/`,
`src/server/`, `src/shared/`, `src/transform/` directories that are
in-scope but not yet counted.

**None of the destination directories exist:**
- `src/plugin-kernel/` — does not exist
- `plugins/` (top-level) — does not exist
- `src/intel/` (K0(L0)) — does not exist
- `src/catalog/` (M-layer) — does not exist
- `tests/arch/kernel-*.test.ts` (the new arch tests) — does not exist

Everything in `migration-new-files.yaml` is net-new.

---

## 1. The 5+2 Layer Model

The reclassification uses 5 layers (K0, K0(L0), K1, K2, K3, K4). After the
re-read I add 2 sub-axes to K0 to keep the design honest:

| Layer | What | Uninstallable? | Replaceable? | LLM? | Process? |
|---|---|---|---|---|---|
| **K0** | The 17 kernel subsystems (AT-FORENSIC-VERDICT §3) | No | No | No | No |
| **K0(M)** | M-layer: 7 self-descriptive contracts (C-33..C-39) | No | No | No | No |
| **K0(L0)** | The 5 deterministic-intelligence contracts (C-40..C-44) | No | Substrate-swappable via `IIntelligenceRegistry.setProvider` | No (kernel never depends on LLM) | No |
| **K1** | First-party plugins: 36 of VIVIM's product features | Yes | Yes (trusted plugin replaces) | Optional | No |
| **K2** | Third-party plugin surface: manifest, contributions, certifier | N/A (the surface itself) | N/A | Optional | No |
| **K3** | Sandboxed component: iframe host + QuickJS runner | Per-iframe | Per-iframe | Optional (iframe script) | Yes (browser process) |
| **K4** | External process: Tauri supervisor, browser slave, LLM service | N/A | N/A | Optional | Yes (separate process) |

**The 7 sub-axes of K0** (one per kernel subsystem per AT-FORENSIC-VERDICT §3
+ M-layer + L0):

| ID | Subsystem | Anchor file (current) | Migration target |
|---|---|---|---|
| K0-1 | `IPluginManager` | `src/ai/plugins/plugin-manager-impl.ts:35-50, 96-140` | `src/plugin-kernel/plugin-manager/manager.ts` |
| K0-2 | `IPluginContext` factory | (MISSING) | `src/plugin-kernel/plugin-context/context.ts` |
| K0-3 | `IEventBus` | `src/ai/events/bus.ts:60-79` + `src/ai/events/in-memory-bus.ts` | `src/plugin-kernel/event-bus/bus.ts` |
| K0-4 | `IProviderRegistry` + `IModelRegistry` | `src/ai/registry/registry.ts:33-58` + impls | `src/plugin-kernel/registry/provider.ts` |
| K0-5 | `IProviderAdapter` + `AdapterError` | `src/ai/core/types.ts:18` + `src/ai/protocol/adapter.ts` | `src/plugin-kernel/adapter/contract.ts` |
| K0-6 | `IExecutionManager` | `src/ai/execution/manager.ts:13-40` + impls | `src/plugin-kernel/execution/manager.ts` |
| K0-7 | `IRuntimeSupervisor` + `IResourceManager` | `src/ai/runtime/supervisor.ts:7, 18-28` + `src/ai/runtime/resources.ts` | `src/plugin-kernel/runtime/supervisor.ts` |
| K0-8 | `IPolicyEnforcer` + `IPolicyEvaluator` | `src/ai/policy/policy.ts:40-68` | `src/plugin-kernel/policy/enforcer.ts` |
| K0-9 | `IRouter` + `IRoutingStrategy` | `src/ai/routing/router.ts` + `src/ai/routing/strategies.ts` | `src/plugin-kernel/router/core.ts` |
| K0-10 | `SandboxedNode` (frontend) + `SandboxRunner` (backend) | `frontend/src/components/canvas/SandboxedNode.tsx:19` + `src/engines/sandbox-runner.ts:36-44` | `src/plugin-kernel/sandbox/host.ts` + `src/plugin-kernel/sandbox/runner.ts` |
| K0-11 | Audit + Provenance + Tracer + Span + Event | `src/engines/kernel/kernel-provenance.ts` + `kernel-tracer.ts` | `src/plugin-kernel/observability/` |
| K0-12 | `SchemaRegistry` + `INodeStoreContract` | `src/schema/node.ts:56, 207` + `src/storage/contracts/node-store.ts` | `src/plugin-kernel/schema/registry.ts` |
| K0-13 | `MigrationRunner` + `verifySchemaCompat` | `src/storage/migration/migration-runner.ts` + `src/storage/migration/types.ts` | `src/plugin-kernel/migration/runner.ts` |
| K0-14 | `EncryptionEngine` + branded IDs | `src/ai/core/types.ts:18` | `src/plugin-kernel/crypto/primitives.ts` |
| K0-15 | `IPluginHost` glue | (MISSING — `src/server/plugin-router.ts:100` is the real install path) | `src/plugin-kernel/host/glue.ts` |
| K0-16 | `KernelRegistry` + `Oracle*` | `src/engines/kernel/kernel-registry.ts` (already K0) | `src/plugin-kernel/observability/registry.ts` |
| K0-17 | Kernel-introspection capabilities (C-25..C-32) | (MISSING — to be added in P0-1.x) | `src/plugin-kernel/capabilities/introspection.ts` |

**Plus the M-layer and L0 (sub-axes of K0):**

| ID | Subsystem | Migration target |
|---|---|---|
| K0-M1 | `IIdentityCatalog` (C-33) | `src/plugin-kernel/catalog/identity.ts` |
| K0-M2 | `IProvenanceStore` (C-34) | `src/plugin-kernel/catalog/provenance.ts` |
| K0-M3 | `IRationaleCatalog` (C-35) | `src/plugin-kernel/catalog/rationale.ts` |
| K0-M4 | `IRelationGraph` (C-36) | `src/plugin-kernel/catalog/relation-graph.ts` |
| K0-M5 | `IConfigurationCatalog` (C-37) | `src/plugin-kernel/catalog/config.ts` |
| K0-M6 | `IEventCatalog` (C-38) | `src/plugin-kernel/catalog/events.ts` |
| K0-M7 | `IWhy` (C-39) | `src/plugin-kernel/catalog/why-router.ts` |
| K0-L1 | `INLCLLayeredPipeline` (C-40) | `src/intel/nlcl/pipeline.ts` |
| K0-L2 | `IEmbeddingProvider` (C-41) | `src/intel/embeddings/contract.ts` |
| K0-L3 | `IBudgetGuard` (C-42) | `src/intel/budget/guard.ts` |
| K0-L4 | `ICommandPipeline` (C-43) | `src/intel/command/pipeline.ts` |
| K0-L5 | `IIntelligenceRegistry` (C-44) | `src/intel/registry/intelligence.ts` |

**Total kernel subsystems: 17 (K0) + 7 (M-layer) + 5 (L0) = 29 named files
+ their tests + the IPluginContext + the 12-attack-vector certifier + the
fuzzer + the 24 arch tests.**

---

## 2. The 36 First-Party Plugins (the VIVIM product)

Per `inventory/BOUNDARY-MIGRATION-PLAN.md` §4. Order is smallest-first; the
table sorts by current `src/engines/*` file count to align with reality:

| # | Plugin | Current source | Target path | Phase |
|---|---|---|---|---|
| F-01 | `plugin:audit` | `src/engines/kernel/` (10) — already K0 | Stays K0, not a plugin | (n/a) |
| F-02 | `plugin:tools-image` | (1 file) | `plugins/core/plugin-tools-image/` | P3-01 |
| F-03 | `plugin:tools-mcp` | `src/mcp/*` | `plugins/core/plugin-tools-mcp/` | P3-02 |
| F-04 | `plugin:dev-tooling` | `src/engines/code-audit/*` (11) | `plugins/core/plugin-dev-tooling/` | P3-03 |
| F-05 | `plugin-routing-learning` | `src/engines/routing/*` (0 — empty) | Defer | P3-04 |
| F-06 | `plugin-discovery` | `src/engines/onboarding/*` (11) | `plugins/core/plugin-discovery/` | P3-05 |
| F-07 | `plugin-audit` (real) | `src/engines/onboarding/*` (overlap) | Merge into plugin-discovery | P3-06 |
| F-08 | `plugin-notifications` | `src/alerting/*` | `plugins/core/plugin-notifications/` | P3-07 |
| F-09 | `plugin-contacts` | `src/storage/impl/contact-store-impl.ts` (1) | `plugins/core/plugin-contacts/` | P3-08 |
| F-10 | `plugin-collections` | `src/storage/impl/collection-store-impl.ts` (1) | `plugins/core/plugin-collections/` | P3-09 |
| F-11 | `plugin-workspace` | `src/storage/contracts/workspace-store.ts` (1) | `plugins/core/plugin-workspace/` | P3-10 |
| F-12 | `plugin-sync` | `src/storage/impl/conversation-sync-store-impl.ts` (1) | `plugins/core/plugin-sync/` | P3-11 |
| F-13 | `plugin-mirror` | `src/storage/impl/mirror-store-impl.ts` (1) | `plugins/core/plugin-mirror/` | P3-12 |
| F-14 | `plugin-cost` | `src/engines/reliability/*` (5) | `plugins/core/plugin-cost/` | P3-13 |
| F-15 | `plugin-search` | `src/storage/impl/cozo-semantic-search.ts` (1) | `plugins/core/plugin-search/` | P3-14 |
| F-16 | `plugin:canon-harness` | `src/engines/harness/*` (17) | `plugins/core/plugin-canon-harness/` | P3-15 |
| F-17 | `plugin:canon-nlcl` | `src/engines/nlcl/*` (60) | `plugins/core/plugin-canon-nlcl/` | P3-16 |
| F-18 | `plugin:memory` | `src/engines/memory/*` (8) + 4 storage impls | `plugins/core/plugin-memory/` | P3-17 |
| F-19 | `plugin-knowledge` | `src/storage/contracts/knowledge-*-store.ts` (2) | `plugins/core/plugin-knowledge/` | P3-18 |
| F-20 | `plugin:agents` | `src/engines/command-language/*` (18) | `plugins/core/plugin-agents/` | P3-19 |
| F-21 | `plugin-workflows` | `src/engines/workflow-templates/*` (5) | `plugins/core/plugin-workflows/` | P3-20 |
| F-22 | `plugin-policy` | `src/ai/policy/*` (3) | `plugins/core/plugin-policy/` | P3-21 |
| F-23 | `plugin-providers-api` | `src/engines/providers/*` (10) + `seeds/providers/*` (9) | `plugins/core/plugin-providers-api/` | P3-22 |
| F-24 | `plugin:chat` | `src/engines/conversation-manager.ts` + `src/engines/stream-parser.ts` | `plugins/core/plugin-chat/` | P3-23 |
| F-25 | `plugin-providers-browser` | `src/engines/chrome/*` (7) + `stealth/*` (19) + `browser-automation/*` (19) | `plugins/core/plugin-providers-browser/` | P3-24 |
| F-26 | `plugin:discord` | `seeds/providers/discord.json` | `plugins/core/plugin-discord/` | P3-25 |
| F-27 | `plugin:notion` | `seeds/providers/notion.json` | `plugins/core/plugin-notion/` | P3-26 |
| F-28 | `plugin:slack` | `seeds/providers/slack.json` | `plugins/core/plugin-slack/` | P3-27 |
| F-29 | `plugin:whatsapp` | `seeds/providers/whatsapp.json` | `plugins/core/plugin-whatsapp/` | P3-28 |
| F-30 | `plugin:reddit` | `seeds/providers/reddit.json` | `plugins/core/plugin-reddit/` | P3-29 |
| F-31 | `plugin-openai-api` | `seeds/providers/openai-api.json` | `plugins/core/plugin-openai-api/` | P3-30 |
| F-32 | `plugin-anthropic-api` | `seeds/providers/anthropic-api.json` | `plugins/core/plugin-anthropic-api/` | P3-31 |
| F-33 | `plugin-openrouter` | `seeds/providers/openrouter.json` | `plugins/core/plugin-openrouter/` | P3-32 |
| F-34 | `plugin-ui-canvas` | `frontend/src/components/canvas/*` (~100) | `frontend/plugins/core/plugin-ui-canvas/` | P3-33 |
| F-35 | `plugin-ui-panels` | `frontend/src/components/canvas/{AuditDashboard,HealthDashboard,RbacManager,TemplatesGallery}.tsx` (4) | `frontend/plugins/core/plugin-ui-panels/` | P3-34 |
| F-36 | `plugin-ui-shell` | `frontend/src/components/canvas/{MainMenu,MobileNav,CommandPalette,NotificationsCenter,OnboardingTour,Brand}.tsx` (6) | `frontend/plugins/core/plugin-ui-shell/` | P3-35 |
| F-37 | `plugin-ui-cards` | (none currently — to be extracted from `CapabilityCatalog.tsx`) | `frontend/plugins/core/plugin-ui-cards/` | P3-36 |
| F-38 | `plugin-ui-builder` | (none currently — to be extracted from `CanvasConfigPanel.tsx` + `BuilderProvider.tsx`) | `frontend/plugins/core/plugin-ui-builder/` | P3-37 |
| F-39 | `plugin-tools` | `src/ai/tools/orchestrator.ts` + `tool-orchestrator-impl.ts` (2) | `plugins/core/plugin-tools/` | P3-38 |
| F-40 | `plugin-reprogrammability` | `src/engines/reprogrammability/*` (7) + `src/reprogrammability/*` | `plugins/core/plugin-reprogrammability/` | P3-39 |

**Note:** the per-engine file counts sum to ~360, not 460 — the 100-file delta
is the diagnostics kernel (10) and miscellaneous per-directory files in
`pools/`, `transform/`, `runtime/`, etc. that don't fit the plugin taxonomy
and are absorbed into the kernel or removed in P2.

---

## 3. The Row Schema (every row in `migration-table.yaml`)

```yaml
- id: K-001                            # K=kernel, F=first-party, P=plugin-surface, S=storage, C=capability
  source_path: src/server/bootstrap/orchestrator.ts
  source_line_start: 1
  source_line_end: 200
  current_layer: K1                    # what it is today
  proposed_layer: K0                   # what it becomes
  proposed_path: src/plugin-kernel/bootstrap/orchestrator.ts
  target_subsystem: K0-15              # which of the 17+12 kernel subsystems
  contracts_affected: [C-15]           # which of the 44 contracts
  migration_phase: P0-1                # which of the 6 phases
  migration_pr_sequence: 1              # order within the phase
  pr_size: M                            # S/M/L
  blocker_for: [P0-2, P0-5]            # which rows depend on this one
  risk: low                             # low/med/high
  capability_preserved: yes             # does the existing capability remain post-migration?
  capability_enhanced: yes              # does the migration add new capability?
  test_gate: T1                         # which of the 24 arch tests gates this row
  evidence_doc: I-2/probe-02-import-boundary.md  # which I-2 evidence grounds this row
  notes: |
    The orchestrator's 5-phase pipeline is the load-bearing seam.
    The policy/verifier phase becomes kernel; the executor phase becomes K1.
```

**The ID system:**
- `K-001..K-200` — files that move into the kernel (or are created as kernel)
- `K-M01..K-M07` — M-layer files
- `K-L01..K-L05` — K0(L0) intelligence files
- `F-001..F-040` — files that move into a first-party plugin
- `P-001..P-050` — files for the plugin surface (manifest schema, certifier, contribution types)
- `S-001..S-060` — storage contract changes (interface moves, impl follows)
- `C-001..C-032` — kernel capability wrappers (C-25..C-32 + K0(L0) caps + M-layer caps)
- `T-001..T-024` — arch test files (new in P0-1)
- `N-001..N-NNN` — new files that do not yet exist (in `migration-new-files.yaml`)

---

## 4. The 6 Migration Phases (condensed from the 13 in the plan)

| Phase | What lands | Files affected | Duration | Exit gate |
|---|---|---|---|---|
| **P0** | Security boundary: `PluginManager` + `IPluginContext` + certifier (12 vectors) + fuzzer + P0-6 (kernel-only boot) | ~30 K-* + ~10 T-* + ~5 N-* | 4-6 weeks | Kernel boots with no first-party plugin; certifier passes all 12 vectors; fuzzer finds 0 false negatives |
| **P1** | Contract versioned: `IPluginHost` unifies the two install paths; M-layer (C-33..C-39); K0(L0) (C-40..C-44) | ~15 K-* + ~7 K-M* + ~5 K-L* + ~10 N-* | 2-3 weeks | Every contract has `contractVersion`; M-layer catalogs are co-generated; K0(L0) hot-swap works |
| **P2** | Storage and schema: `SchemaRegistry` + `NodeType`; Prisma kernel-model split (15 kernel models extracted); `safe-eval.ts` removed; `simulator-adapter.ts` removed; legacy wrappers removed; `vm` fallback privileged | ~20 K-* + ~5 S-* + ~3 N-* | 2-3 weeks | Kernel boots with only the 15 kernel models; Node types are prefixed; no `vm` fallback in production |
| **P3** | Plugin moves: 40 first-party plugins (per the table above), one at a time, smallest first | ~700 F-* + ~10 K-* (manifest runners) + ~40 N-* | 16-24 weeks | Every first-party plugin installs as K1; every first-party plugin uninstalls cleanly; no engine file in `src/engines/` remains (except the 17 K0 subsystems and K0(L0)) |
| **P4** | The cake: P0..P5 phases of the plugin-builder cake, all part of the release | ~5 K-* + ~30 N-* (cake files) | 3-4 weeks | A user can build, certify, install, and run a third-party plugin end-to-end |
| **P5** | Polish: docs, demos, the Discord/Notion proof, the marketplace | ~10 N-* | 2-4 weeks | A third-party plugin installs from a URL; the certifier rejects a malicious plugin; the kernel-only boot test still passes |

**Total: 6 phases, 30-44 weeks (7-11 months), one coordinated effort.**

The migration is a **stream**, not a one-shot. P3 is the long tail; P0-P2
are the security boundary that makes the rest safe.

---

## 5. The Test Gates (T-001..T-024, all enforceable)

Per `inventory/KERNEL-BOUNDARY-TESTS.md` (8 tests today, 16 to add):

| Test | What it asserts | Layer |
|---|---|---|
| T-01 | `layer-dependency`: K0 must not import from K1+ | K0 |
| T-02 | `kernel-boot`: kernel boots with no first-party plugin | K0 |
| T-03 | `kernel-isolation`: kernel survives uninstall of every first-party plugin | K0 |
| T-04 | `certifier-12-vectors`: 12 attack vectors all rejected | K0 |
| T-05 | `fuzzer-no-false-negatives`: 10K mutated manifests all rejected | K0 |
| T-06 | `IPluginContext-closed`: a plugin cannot reach kernel internals | K0 |
| T-07 | `BootstrapContext-reduction`: every field in IPluginContext | K0 |
| T-08 | `script-url-origin`: scriptUrl must match kernel-asset origin regex | K0 |
| T-09 | `bus-namespace`: every event kind is dot-namespaced | K0 |
| T-10 | `storage-scoped`: per-namespace scoped storage enforced | K0 |
| T-11 | `capability-invocation-policy`: enforceCapabilityInvocation default-deny | K0 |
| T-12 | `adapter-version`: every adapter declares VIVIM_AI_PROTOCOL version | K0 |
| T-13 | `schema-caller`: SchemaRegistry.register requires `{ caller }` | K0 |
| T-14 | `provider-state-machine`: setState expectedFrom enforced | K0 |
| T-15 | `sandbox-csp`: SandboxPolicy csp + allowInlineScript:false | K0 |
| T-16 | `ipluginhost-single-path`: only one install path | K0 |
| T-17 | `m-layer-co-generated`: catalog rebuilt at boot from source | K0(M) |
| T-18 | `m-layer-complete`: every kernel export has IdentityCard | K0(M) |
| T-19 | `m-layer-honest`: IWhy does not use LLM | K0(M) |
| T-20 | `m-layer-queryable`: IWhy registered as kernel.why | K0(M) |
| T-21 | `l0-pipeline-local`: NLCL pipeline works without LLM | K0(L0) |
| T-22 | `l0-embedding-degrade`: HF/Ollama degrade to TF-IDF if model missing | K0(L0) |
| T-23 | `l0-budget-enforced`: BudgetGuard throws on breach | K0(L0) |
| T-24 | `l0-hot-swap`: IIntelligenceRegistry.setProvider works at runtime | K0(L0) |

---

## 6. The Capability Preservation Budget (the 200% target)

The constraint is **≥90% preserved, ideally 200%.** "Preserved" means
the existing user-facing behavior is unchanged. "Enhanced" means new
behavior the original system did not have.

**The 200% comes from:**

1. **Third-party plugin extensibility** (the entire migration is this).
2. **M-layer introspection** (users can ask "why" and "what breaks").
3. **K0(L0) hot-swap** (users can upgrade embedding providers at runtime).
4. **The certifier** (users can submit plugins to a marketplace).
5. **The fuzzer** (users can run it against their own plugins).
6. **Capability-usage introspection** (the kernel can list which plugins use which capabilities — M-layer + capability tracking).
7. **Runtime plugin swap** (a plugin can be hot-upgraded without losing state — K0-15 `IPluginHost`).
8. **Cross-plugin capability routing** (a plugin can declare it provides a capability that another plugin consumes — P-18 in `inventory/PLUGIN-CONTRACTS.md`).

**The 90% floor comes from:**
- Every existing engine continues to work (K1 first-party plugins install by default).
- Every existing API route continues to respond.
- Every existing CLI command continues to run.
- The desktop app boots the same way.
- The Prisma schema is split, but the 185 first-party models move with their plugin — no data loss.

**The 10% risk:**
- The `safe-eval.ts` removal (H9 hazard) removes a denylist that some legacy code path may have relied on. Mitigation: every `stream-parser.ts` consumer is migrated to the QuickJS sandbox first.
- The `vm` fallback removal removes a `vm` execution path used by some tests. Mitigation: tests move to the `SandboxRunner` QuickJS path; the `vm` path stays in `sandbox-runner-vm.ts` for test-only use.
- The `BootstrapContext` reduction may break first-party engines that read fields the closed `IPluginContext` does not expose. Mitigation: every first-party engine is migrated to use the closed context, with a `P0-5` exit-gate test that asserts every field is reachable.

---

## 7. The Files (where the work lives)

| File | Purpose |
|---|---|
| `migration-designyaml.md` | This file. The schema, the layers, the phases, the test gates. |
| `migration-table.yaml` | Every existing source file (one row per file or per logical unit). ~1,500 rows. |
| `migration-new-files.yaml` | Every new file that does not yet exist. ~250 rows. |
| `inventory/KERNEL-CONTRACTS.md` | The 44 contract shapes (C-01..C-44). The new files reference these. |
| `inventory/PLUGIN-CONTRACTS.md` | The 18 plugin contract shapes (P-01..P-18). The manifest schema. |
| `inventory/PLUGIN-TRUST-MODEL.md` | The K0-K4 + M + L0 trust model. Every row's `current_layer` and `proposed_layer` cite this. |
| `inventory/BOUNDARY-MIGRATION-PLAN.md` | The 13-step migration plan that the 6 phases condense. |
| `inventory/AT-FORENSIC-VERDICT.md` | The 17-subsystem kernel enumeration that the K0-* IDs cite. |

---

## 8. The Two Open Risks (in addition to `AT-FORENSIC-VERDICT.md` §8)

1. **The 460-file engine count vs the reclassification's 186.** The
   reclassification's per-directory map was directionally right but missed
   the 100+ files in `src/engines/{pool,observability,runtime,scheduler,
   self-healing,adaptation,cortex,actor,resource,events,automation,
   generative,local-agent,local-server,parsers,runtime}` that don't fit the
   K1 plugin taxonomy. These need to be either (a) absorbed into the kernel
   as K0 utilities, (b) removed in P2, or (c) bundled into an existing
   first-party plugin. The 700-row F-* table resolves this — every one of
   the 100+ files gets a target.

2. **The 67-file storage-contracts count vs the reclassification's 40+.**
   Same issue. The 67 files include K0 stores (`node-store`, `provider-
   store`, `capability-store`, `kernel-store`, `sandbox-audit-store`,
   `plugin-store`, `governor-store`, `event-record-store` — 8 of 67) and
   K1 stores (the rest). The 60-row S-* table resolves this.

---

*Next: `migration-table.yaml` — the per-file migration rows for every
existing source file. `migration-new-files.yaml` — the per-file
specifications for every new file the migration creates.*
