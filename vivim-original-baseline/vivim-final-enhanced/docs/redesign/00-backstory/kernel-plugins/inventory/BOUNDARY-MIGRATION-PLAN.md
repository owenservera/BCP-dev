# Boundary Migration Plan (P0 → P3)

> **The work that takes the codebase from "200-table schema labeled CORE" to "Vivim is a kernel hosting Vivim itself as a first-party plugin suite."** Prioritized, code-anchored, and ordered so each phase has a test that proves it.
>
> Priority legend: **P0 = architectural / security boundary** (block release); **P1 = critical separation**; **P2 = cleanup**; **P3 = future optimization**.

---

## 0. The migration test (Constitution Rule F)

A passing migration at every phase is one that satisfies:

> If ALL VIVIM first-party plugins were removed, would a valid kernel still boot, discover plugins, validate them, and install/run them safely?

The "kernel-only boot" test is run as part of `bun test tests/arch/kernel-boot.test.ts` (new) and as a manual smoke test (`bun run test:kernel-only` — new). **Until this test passes after P0-1, no third-party plugin can be installed safely.**

---

## 1. P0 — Architectural / Security Boundary (8 sub-phases, 1 release blocker)

The P0 phases ship together. They are the security boundary: `IPluginManager` is the single install path, the certifier is real, the contexts are closed, the policy is split. Each sub-phase is a small PR; the last sub-phase in P0 is the gate.

### P0-1 — `IPluginManager`, `IPluginContext`, `PluginManifestSchema`, `PluginHost`, V1→V2 bus bridge

**Current location:** `src/ai/plugins/manager.ts` (`IPluginManager` contract — exists, stubbed); `src/ai/plugins/plugin-manager-impl.ts` (`TrustedPluginManager` impl — exists, stubbed); `src/server/plugin-router.ts` (real HTTP install path, separate from `TrustedPluginManager`); `src/server/bootstrap/context.ts` (`BootstrapContext` — exists, 60+ fields, used by first-party).

**Target boundary:** KERNEL owns `src/kernel/plugin-kernel/` with `manifest.ts`, `permissions.ts`, `plugin-context.ts`, `host.ts`, `events.ts`. The `BootstrapContext` is **reduced** — it only contains what the kernel itself needs to thread through the boot phases; it is **not** the plugin context. The HTTP `plugin-router.ts` becomes a thin adapter that calls `PluginHost.install(source)`.

**Required contract:** KERNEL-CONTRACTS C-01 (`IPluginManager`), C-02 (`IPluginContext` + `ISandboxHost`), C-09 (`IPolicyEnforcer` with `enforceCapabilityInvocation` — REASSESSMENT Change-8), C-24 (`IPluginScopedStore`); PLUGIN-CONTRACTS P-01 (`PluginManifestSchema` with `contractVersions[]` + `allowedCapabilities[]`), P-02 (`activate`), P-03 (`deactivate`), P-09 (permissions), P-13 (event-type prefix), P-15 (13 attack vectors), P-17 (contract versions), P-18 (capability-invocation permissions).

**Dependency blockers:**
- `src/ai/plugins/plugin-manager-impl.ts:162-171` uses `globalThis.__pluginManager` and `require('../../engines/plugin-system.js')`. Both must be removed (item MISSING-17). The `PluginHost` is wired through `BootstrapContext`.
- `src/server/bootstrap/phases/capabilities.ts:42-48, 62` (the boot-time `activatePluginManager` + `globalThis.__harnessRepair`). Both must be removed.
- The `IProviderRegistry` (KERNEL-CONTRACTS C-06) and `IExecutionManager` (C-10) are needed by the PluginHost but their in-memory impls are still in the same file. **Split before use** (P1-2).
- The `IPolicyEnforcer` (C-09) needs the new `enforceCapabilityInvocation` method added (REASSESSMENT Change-8).
- The `IExecutionManager` (C-10) needs `drainProvider` + `forceStopProvider` separation added (REASSESSMENT Gap-5).
- The `SandboxPolicy` (C-13) needs the unified shape with `backend: 'iframe' | 'quickjs' | 'auto'`.

**Risk:** High. This is the security boundary. If the certifier is wrong, a third-party plugin can corrupt the host. **Two-reviewer gate before merge.**

**Test required (must pass before merge):**
- `tests/unit/kernel/plugin-host.test.ts` — install/upgrade/uninstall round-trip with real sha256.
- `tests/unit/kernel/certify.test.ts` — every P-15 check (13 attack vectors) is unit-tested with a positive and a negative case.
- `tests/unit/kernel/iplugin-context.test.ts` — `activate(ctx)` cannot reach `globalThis`, `process`, `require`, or any non-`ctx` object (try/catch around `Object.getOwnPropertyNames(globalThis)`).
- `tests/unit/kernel/plugin-capability-abuse.test.ts` — the 12-case matrix from `KERNEL-BOUNDARY-TESTS.md` §2.7.
- `tests/integration/kernel/e2e-install.test.ts` — install a sample plugin from a tar.gz, call a capability, see the audit event, uninstall, see the bus event.
- `tests/arch/kernel-boot.test.ts` — new: kernel boots with no first-party plugin installed.
- `tests/unit/kernel/contract-version.test.ts` — every kernel contract has `contractVersion: { major: 1; minor: 0 }` (per `KERNEL-BOUNDARY-TESTS.md` §2.12).
- **The full `tests/arch/` suite must remain green.**

**Migration order:**
1. Add `src/kernel/plugin-kernel/{manifest,permissions,plugin-context,host,events}.ts` (new files; the existing `src/ai/plugins/*` becomes a thin compatibility shim for legacy callers).
2. Implement `PluginHost.discover()` by **moving** `plugin-router.ts:20` `computeFileHash` and `47` `extractTarGz` into the host (no duplicate).
3. Implement `PluginHost.certify()` with the full P-15 suite (13 attack vectors).
4. Implement `PluginHost.install()` to call per-axis registries (stubs until Phases 2–4).
5. Implement `PluginHost.uninstall()` with full cleanup (including `IExecutionManager.drainProvider` per Gap-5).
6. Reduce `BootstrapContext` to the fields the kernel actually threads; pass `PluginHost` instead of `PluginManagerImpl`.
7. Update `phases/capabilities.ts` to call `host.activate(ctx)` instead of `activatePluginManager(eventBus)`.
8. Delete `globalThis.__pluginManager` and `globalThis.__harnessRepair` writes.
9. Convert `plugin-router.ts` to a thin HTTP adapter: `POST /api/plugins/install` calls `host.install(source)`.
10. Add `IPolicyEnforcer.enforceCapabilityInvocation` (REASSESSMENT Change-8 — the missing capability-abuse defense).
11. Add `IExecutionManager.drainProvider` + `forceStopProvider` (REASSESSMENT Gap-5 — the drain/stop ordering).
12. Run all 8 tests above.

**Done when:** A third-party plugin (the existing `frontend/plugins/sample-plugin/*` after a small adaptation) installs via `PluginHost`, runs in the host V8 with a closed `IPluginContext`, emits a bus event with a `plugin.<id>.`-prefixed kind, calls another plugin's capability through the `enforceCapabilityInvocation` gate, and uninstalls cleanly. The kernel-only boot test passes.

---

### P0-1.w — `ICommandPipeline` + `IIntelligenceRegistry` + K0(L0) deterministic intelligence substrate

**Current location:** `src/engines/nlcl/` (60 files, ~5,000 LOC), `src/engines/opencode/` (6 files, 1,400 LOC), `src/engines/agentic-loop.ts`, `src/engines/autonomous-execution.ts`, `src/engines/local-agent/*`, `src/engines/budget-engine.ts`, `src/engines/embedding-*` (4 files), `src/cli/*` (10 files, 700+ LOC), `src/server/routes/interpret.ts` (and similar).

**Target boundary:** K0(L0) holds the *deterministic* mechanism of NLP/CLI/intelligence — the 6-layer pipeline shape, the `ICommandPipeline` interface, the `IEmbeddingProvider` contract, the `IBudgetGuard` shape, the `IIntelligenceRegistry`. The *content* (LLM, OpenCode, agents, autonomous, local-agent, the NLCL orchestrator) is **K1** (VIVIM product).

**Required contract:** KERNEL-CONTRACTS C-40 (`INLCLLayeredPipeline`), C-41 (`IEmbeddingProvider`), C-42 (`IBudgetGuard`), C-43 (`ICommandPipeline`), C-44 (`IIntelligenceRegistry`).

**Dependency blockers:** the NLCL orchestrator (`src/engines/nlcl/nlcl-engine.ts`) must be re-classified as K1 — it becomes `plugin:canon-nlcl`. The OpenCode supervisor + client + ingest + executor become `plugin:providers-browser` + `plugin:local-agent`. The `agentic-loop`, `autonomous-execution`, `agent-builder` become `plugin:agents`. The 19 `categories/*.ts` pattern data files become K1 content; the `builder.ts` shape becomes K0(L0) mechanism.

**Risk:** Medium. The K0(L0) extraction requires a deep refactor (move 60 files between layers), but the kernel can boot with TF-IDF + deterministic pipeline + no LLM + no opencode, so the change is *additive*, not breaking. The kernel-only boot test (P0-6) must pass with no L0 substrate registered beyond the defaults.

**Test required:**
- `tests/arch/kernel-l0-isolation.test.ts` (T21) — every file under `src/kernel/intel/` may not import from `src/engines/*`.
- `tests/arch/nlcl-orchestrator-not-kernel.test.ts` (T22) — the NLCL orchestrator is K1, not K0.
- `tests/arch/opencode-not-kernel.test.ts` (T23) — the OpenCode supervisor is K1, not K0.
- `tests/integration/kernel/boot-without-l0-substrate.test.ts` (T24) — the kernel boots with TF-IDF + no LLM + no opencode.
- `tests/unit/kernel/iembedding-provider.test.ts` — the default TF-IDF provider; HF upgrade is optional + degrades.
- `tests/unit/kernel/icommand-pipeline.test.ts` — the single-entry-point pipeline; CLI + HTTP + frontend chat all call the same `interpret`.
- `tests/unit/kernel/iintelligence-registry.test.ts` — `register` + `get` + `list` + hot-swap; the M-layer's `IIdentityCatalog` auto-discovers.

**Migration order:**
1. Create `src/kernel/intel/` directory. Add the 5 new contracts (C-40..C-44) in `src/kernel/intel/contracts.ts`.
2. Move `TextNormalizer` from `src/engines/nlcl/` to `src/kernel/intel/text-normalizer.ts`. Move `NLCommandParser` to `src/kernel/intel/nl-parser.ts`. Move `FuzzyResolver` + `FuzzyMatcher` to `src/kernel/intel/fuzzy.ts`. Move `TfIdfEmbeddingProvider` + `TfIdf` to `src/kernel/intel/embeddings-tfidf.ts`. Move `CommandPatternRegistry` + `CommandPattern` + `NLPattern` to `src/kernel/intel/command-pattern.ts`.
3. Implement `INLCLLayeredPipeline` (K0(L0) — the 6-layer pipeline orchestrator). Default sub-resolvers: deterministic, fuzzy, semantic (TF-IDF). Classifier + LLM are optional, registered at runtime.
4. Implement `ICommandPipeline` (K0(L0) — the single entry point). Calls `INLCLLayeredPipeline.resolve` + `IntentRouter.route` + `ExecutionKernel.execute` (or the kernel's `IExecutionManager`).
5. Implement `IIntelligenceRegistry` (K0(L0) — the upgrade bus). On boot, registers the default TF-IDF provider + the deterministic pipeline.
6. Update `src/cli/index.ts` to call `ICommandPipeline.interpret` (the CLI is a thin shell — the mechanism is kernel).
7. Update `src/server/routes/interpret.ts` to call `ICommandPipeline.interpret` (the HTTP route is a thin shell — same mechanism).
8. Update `src/engines/nlcl/nlcl-engine.ts` to register its patterns + executors on `ICommandPipeline` instead of owning the pipeline. The orchestrator becomes a first-party plugin (`plugin:canon-nlcl`).
9. Update the M-layer (C-33..C-39) to read from `IIntelligenceRegistry.list()` — the registry auto-discovers every K0(L0) substrate.
10. Update the cake (P0 in `inventory/PLUGIN-BUILDER-CAKE.md`) to read from `ICommandPipeline.listPatterns()` + `IIntelligenceRegistry.list()` — the cake auto-discovers the current kernel's intelligence surface.
11. Run all 7 tests above.

**Done when:** the kernel boots with no first-party plugin AND no L0 substrate registered beyond defaults; the CLI REPL + HTTP `/api/interpret` + frontend chat all call the same `ICommandPipeline.interpret`; the NLCL orchestrator is a K1 plugin, not a kernel file; the M-layer's IWhy auto-discovers every K0(L0) substrate; the cake's P0 reads from `IIntelligenceRegistry.list()`; the kernel's `IWhy.why('embeddings')` answers "what embedding provider is running?"

> **Addendum 2026-08-29 — Upgraded execution (ADR 008):** the deterministic kidx + migration-table targets are **proposals, not verdicts**. For P0-1.w, per-PR execution is LLM-driven: read the source, enumerate imports, classify each as **K0 (universal)** vs **K1 (VIVIM-specific)** against `PLUGIN-TRUST-MODEL.md` and `KERNEL-CONTRACTS.md` C-02, decide **MOVE vs SPLIT vs KEEP** on the file's real content (not the kidx label), and prove it with the 3-gate per-PR check (kernel-l0-isolation, boot-without-l0-substrate, contractVersion). Batch `Copy-Item` of NLCL categories is relocation, not a P0-1.w pass — the auditable pass re-migrates those files one by one. See `adr/008-llm-driven-migration.md`.

### P0-1.y — `IIdentityCatalog` (M1) + `IProvenanceStore` (M2) + `IRationaleCatalog` (M3) + `IRelationGraph` (M4) + `IConfigurationCatalog` (C-37) + `IEventCatalog` (C-38) + `IWhy` (C-39) — the M-layer (self-descriptive)

**Current location:** `src/engines/kernel/` (observability kernel) + `src/cli/discovery-stack.ts` (capability discovery).

**Target boundary:** the M-layer (7 new contracts C-33..C-39) is **inside** the kernel. The M-layer is co-generated at boot from the same source the kernel boots from. See `inventory/SELF-DESCRIPTIVE.md` for the full architecture.

**Required contract:** KERNEL-CONTRACTS C-33..C-39.

**Dependency blockers:** P0-1 (real `IPluginManager` + closed `IPluginContext` + certifier); the M-layer's IIdentityCatalog depends on the contract catalog being real (C-25); the IRationaleCatalog depends on the ADRs being parseable; the IRelationGraph depends on the import graph being scannable.

**Risk:** Medium. The M-layer is large (7 contracts + 1 parser + 1 co-generator + 1 router). The cost is in the co-generator (the part that walks the source tree at boot); the contracts are small.

**Test required:** the 4 new arch tests (T25..T28 already in `inventory/KERNEL-BOUNDARY-TESTS.md`):
- Every kernel export has an `IdentityCard`.
- Every kernel contract has `contractVersion`.
- The M-layer's catalog matches the static import graph within a 1% tolerance.
- The `IWhy.why(question)` returns a deterministic answer grounded in source.

**Migration order:**
1. Add the 7 new contracts (C-33..C-39) in `src/kernel/intel/contracts.ts` (or a new `src/kernel/self-descriptive/`).
2. Implement the co-generator: a small TS function that walks `src/kernel/**`, parses `@doc`, `@rationale`, `@emits`, `@consumes`, `@depends-on`, `@paired-with`, `@enforces`, `@env` JSDoc tags, and generates the M-layer catalogs in-memory.
3. Implement the `IWhy` router: a deterministic text-classifier that maps a free-text question to M1/M2/M3/M4/M37/M38 and returns a markdown answer.
4. Register the M-layer with the kernel observability (`KernelRegistry.registerEngine({ id: 'self-descriptive', ... })`).
5. Add `kernel.identity.describe`, `kernel.provenance.why`, `kernel.rationale.why`, `kernel.graph.impact`, `kernel.config.get`, `kernel.events.get`, `kernel.why` to the kernel's registered capabilities.
6. Update the cake's P0 to read from `IIdentityCatalog` + `IIntelligenceRegistry` — the codegen has a complete picture of the kernel's surface.
7. Run all 4 tests.

**Done when:** a user can ask `why('why is the namespace dot-separated?')` and get a markdown answer grounded in the constitution + REASSESSMENT + KERNEL-CONTRACTS, without grep archaeology.

### P0-2 — `IPolicyEnforcer` split; `ProviderRegistrar.registerOne`; in-memory protocol cache

**Current location:** `src/ai/policy/policy.ts` (mixed `IPolicyEnforcer` + `IPolicyEvaluator`); `src/engines/provider-registrar.ts:62` (no `registerOne`); `src/engines/provider-protocol-generator.ts` (disk-only static file).

**Target boundary:** KERNEL owns the *enforcer* contract and the `registerOne` entry point; FIRST-PARTY owns the *evaluator* and the *concrete policy engines* (`P0PolicyEngine`, `ConsentEngine`, `ExecutionPolicyEngine`, `GovernanceEngine`). The protocol cache becomes in-memory.

**Required contract:** KERNEL-CONTRACTS C-06 (`IProviderRegistry`), C-09 (`IPolicyEnforcer`), C-16 (`IProviderRegistrar.registerOne`).

**Dependency blockers:** `IPolicyEnforcer` must be in place before the first first-party plugin can be loaded (the kernel needs to enforce at egress). The first-party `IPolicyEvaluator` migrates with `plugin:providers-api`.

**Risk:** Medium. The split is mechanical; the cache is well-defined. The risk is **silent policy bypass** — the enforcer must be the *only* call site at egress.

**Test required:**
- `tests/unit/ai/policy-enforcer.test.ts` — every `enforceNetwork` and `enforceToolInvocation` deny is honored.
- `tests/unit/engines/provider-register-one.test.ts` — third-party provider registers, FK is set, no in-tree seed data is touched.
- `tests/integration/engines/protocol-cache.test.ts` — `registerOne` provider is queryable without restart; existing consumers of the generated file still work.
- `tests/arch/regulatory-call-sites.test.ts` — **new**: every `fetch` / `http` / `WebSocket` / `spawn` call site in the engine layer is reachable from `IPolicyEnforcer.enforceNetwork()`.

**Migration order:**
1. Split `src/ai/policy/policy.ts` into `src/kernel/policy/enforcer.ts` (the kernel contract + the default-deny impl) and `src/ai/policy/evaluator.ts` (the first-party scoring). The current `default-policy.ts`+`store-backed-policy.ts` move to first-party.
2. Add `ProviderRegistrar.registerOne(manifest, { source: 'plugin', pluginId })`. The method does the same 7-table upsert as `register()` and sets `providerDefinition.pluginId = pluginId`.
3. Convert `provider-protocol-generator.ts` to a `Map<providerId, Protocol>` rebuild on `registerOne`/uninstall. The disk file remains a snapshot for cold boot.
4. Wire `IPolicyEnforcer` into the AI gateway's data plane: every adapter call passes through `enforceNetwork` first.
5. Run all 4 tests above.

**Done when:** A third-party provider that requires `network` permission installs via `PluginHost`, is queryable through the gateway without restart, and is denied at egress when its permission is missing.

---

### P0-3 — `SandboxPolicy` origin + `scriptUrl`; `vm` fallback; `safe-eval.ts` removal; harness seed split

**Current location:** `frontend/src/components/canvas/SandboxedNode.tsx:154-156` (scriptUrl attribute); `src/engines/safe-eval.ts` (HAZARD H9 denylist guard); `src/engines/sandbox-runner.ts:36-44` (`vm` fallback gated by `VIVIM_UNSAFE_VM=1`); `seeds/harness/commands/*` (100+ first-party harness commands, REASSESSMENT Gap-7).

**Target boundary:** KERNEL owns the scriptUrl origin check (certifier + renderer), the `vm` removal, and the `harness-command-registry` *shape*. The 100+ harness seed commands are K1 first-party content.

**Required contract:** KERNEL-CONTRACTS C-13 (`SandboxPolicy` unified with `backend: 'iframe' | 'quickjs' | 'auto'`); PLUGIN-CONTRACTS P-12; PLUGIN-CONTRACTS P-05 (size caps + CSS deny-list).

**Dependency blockers:** Requires the kernel asset store (new). Requires the certifier from P0-1.

**Risk:** Medium. Removing `safe-eval.ts` requires all parser code to run in `SandboxRunner` (QuickJS). Audit every `safe-eval` consumer.

**Harness seed split (REASSESSMENT Gap-7):** the harness command registry *shape* is K0 (`src/kernel/harness/registry.ts`); the 100+ seeded commands in `seeds/harness/commands/*` are K1 first-party content (move to `plugins/core/canon-harness/commands/*`).

**Test required:**
- `tests/unit/sandbox/scripturl-origin.test.ts` — every scriptUrl from a plugin is checked against the kernel-asset origin allow-list; `../`, `//`, `data:` are rejected.
- `tests/integration/sandbox/no-vm-fallback.test.ts` — production build throws if `VIVIM_SANDBOX_MODE=vm`.
- `tests/unit/engines/safe-eval-removal.test.ts` — no file imports `safe-eval` after the migration.
- `tests/unit/sandbox/ui-payload-caps.test.ts` — html > 64KB or css > 32KB rejected; CSS with `@import`, `expression(`, or `url(http...)` rejected.
- `tests/unit/sandbox/unified-policy.test.ts` — the same K3 component renders correctly in both iframe and QuickJS modes (per `KERNEL-BOUNDARY-TESTS.md` §2.13).

**Migration order:**
1. Add the kernel asset store under a well-known origin (e.g. `_kernel/plugins/<pluginId>/<assetId>.js`). New endpoint: `GET /_kernel/plugins/:pluginId/:assetId` with `X-Kernel-Asset: 1` header.
2. Certifier validates every `UiGeneratedContribution.scriptUrl` is a URL under that origin (PLUGIN-CONTRACTS P-05 with size caps + CSS deny-list).
3. `SandboxedNode.tsx:154-156` adds a runtime check at mount time.
4. `safe-eval.ts` is deleted; every consumer (the parser runtime in `stream-parser.ts`) runs in `SandboxRunner` (QuickJS).
5. `sandbox-runner.ts` adds the production-build check; the `vm` code path is dead-code-eliminated in production.
6. **NEW (REASSESSMENT Gap-7):** `harness-command-registry.ts` (the class) moves to `src/kernel/harness/registry.ts`; the 100+ seeded commands in `seeds/harness/commands/*` move to `plugins/core/canon-harness/commands/*` as first-party content. Namespace enforcement ships in v2.
7. Run all 5 tests above.

**Done when:** A plugin-supplied scriptUrl with `../`, `//`, or `data:` is rejected at certify; a 100KB html or a CSS with `@import` is rejected; the `safe-eval.ts` file is deleted; the `vm` fallback is unreachable in production; the harness seed split is done.

---

### P0-4 — `IEventBus` plugin-id namespace enforcement; one-way V1→V2 bridge

**Current location:** `src/engines/capability-event-bus-v2.ts:46` (V2 bus); `src/engines/capability-event-bus.ts:165` (V1 bus); `src/plugin-kernel/events.ts` (to be created).

**Target boundary:** KERNEL owns the V1→V2 bridge; V2 is canonical for K1/K2; V1 is preserved for legacy engines.

**Required contract:** KERNEL-CONTRACTS C-03 (`IEventBus`).

**Dependency blockers:** P0-1 must land first (the bridge needs `PluginId`).

**Risk:** Low. The bridge is one-way; legacy consumers do not need to migrate.

**Test required:**
- `tests/unit/kernel/event-bus-bridge.test.ts` — V1.emit appears in V2.snapshot() with correlationId; DLQ still isolates.
- `tests/unit/kernel/event-bus-namespace.test.ts` — a plugin publishing `provider:seeded` is rejected; a plugin publishing `plugin:acme.foo:created` is accepted.

**Migration order:**
1. Create `src/kernel/plugin-kernel/events.ts` with the V1→V2 bridge.
2. Add the namespace check to V2's `publish`.
3. Run the 2 tests above.

**Done when:** V1 still works; V2 is the only bus K1/K2 plugins see; a plugin cannot impersonate kernel events.

---

### P0-5 — `globalThis` + `require()` cleanup; `BootstrapContext` reduction

**Current location:** `src/ai/plugins/plugin-manager-impl.ts:162-171` (`globalThis.__pluginManager` + `require()`); `src/server/bootstrap/phases/capabilities.ts:42-48, 62` (`globalThis.__harnessRepair`); `src/server/bootstrap/context.ts:1-110` (60+ fields).

**Target boundary:** KERNEL threads `PluginHost` through `BootstrapContext` (the field becomes `host: PluginHost`). The `globalThis` writes are deleted.

**Required contract:** the KERNEL boundary test (P0-1).

**Dependency blockers:** P0-1.

**Risk:** Low. Mechanical cleanup.

**Test required:**
- `tests/arch/no-global-this.test.ts` — **new**: scan `src/` for `globalThis` and `(globalThis as` writes; the only allowed ones are in the legacy compatibility shim (one file, with a TODO-removal date).
- `tests/arch/no-require-eval.test.ts` — **new**: scan for `require(` and `eval(`; only the kernel's `sandbox-runner.ts` is allowed.

**Migration order:**
1. Move `PluginHost` (P0-1) onto `BootstrapContext.host`.
2. Replace `globalThis.__pluginManager` references in `src/server/bootstrap/phases/capabilities.ts` with `ctx.host`.
3. Replace `globalThis.__harnessRepair` references with a proper `BootstrapContext.harnessRepair` field.
4. Add the arch tests.
5. Run the 2 tests above.

**Done when:** Zero `globalThis` writes in `src/` except in the kernel's `sandbox-runner.ts` and in the legacy shim (with TODO).

---

### P0-6 — Kernel-only boot test (Constitution Rule F)

**Current location:** none — does not exist.

**Target boundary:** KERNEL must boot with NO first-party plugin installed.

**Required contract:** Constitution Rule F.

**Dependency blockers:** P0-1, P0-2, P0-3, P0-4, P0-5.

**Risk:** None — this is a test, not a change.

**Test required:**
- `tests/arch/kernel-boot.test.ts` — `await bootKernelOnly()` calls the `BootstrapContext` setup without any first-party plugin activation; assert: db, eventBus, IPluginManager, IProviderRegistry (empty), IEventBus, SandboxedNode (host), and the observability kernel (KernelRegistry, KernelTracer, KernelProvenance) are all present; assert: no ConversationManager, no MemoryEngine, no WorkflowEngine, no ChromeGovernor, no AgentBuilder, no NLCL.

**Migration order:**
1. Add the `tests/arch/kernel-boot.test.ts` test.
2. Add a `bootKernelOnly()` helper in `src/kernel/test-helpers.ts` that runs only the kernel phases.
3. Run the test; it MUST pass.

**Done when:** Constitution Rule F is testable. The kernel can be built, packaged, and shipped *without* any VIVIM product on top.

---

### P0-7 — `IPluginContext` boundary test (no escape hatch)

**Current location:** none.

**Target boundary:** A plugin's `activate(ctx)` cannot reach host internals outside of `ctx`.

**Required contract:** Constitution Rule C.

**Dependency blockers:** P0-1.

**Test required:**
- `tests/unit/kernel/iplugin-context.test.ts` — passes a `IPluginContext` to a test plugin; the test plugin tries to read `globalThis.process.env`, `require('node:fs')`, `globalThis.__pluginManager`, `(globalThis as any).__harnessRepair`; each attempt is either caught or returns `undefined`. The plugin only ever sees what `ctx` exposes.

**Migration order:** add the test. (The implementation in P0-1 already uses a closed context; this test pins the contract.)

---

### P0-8 — `ProviderManifestVersion` FK to `PluginRegistry`

**Current location:** `prisma/system/schema.prisma` `ProviderManifestVersion` is a sibling of `PluginRegistry`; they are not linked.

**Target boundary:** Every provider installed by a plugin has a `pluginId` FK to the installing `PluginRegistry` row. The lifecycle is linked: uninstall the plugin → archive the manifest versions.

**Required contract:** P0-2 (`registerOne`).

**Dependency blockers:** P0-2.

**Risk:** Low. Migration is a backfill (`UPDATE provider_definition SET plugin_id = (SELECT id FROM plugin_registry WHERE name = ...) WHERE plugin_id IS NULL`).

**Test required:**
- `tests/integration/engines/provider-fk.test.ts` — every `provider_definition` row has a `plugin_id`; uninstalling a plugin archives its `provider_manifest_version` rows.

**Migration order:**
1. Migration: add `plugin_id` FK on `provider_definition` (already exists per `plugin-router.ts:276` — but the schema file may need a one-line update if it lacks the relation).
2. Backfill: every existing seed provider gets `plugin_id = NULL` and a synthetic `plugin_registry` row named `seed`.
3. The FK is `ON DELETE SET NULL` — uninstalling a plugin nulls the FK but does not cascade-delete the provider row.
4. Run the test.

**Done when:** Every `provider_definition` row has a non-null or well-defined `plugin_id`; uninstalling a plugin nulls it without losing the provider data.

---

## 2. P1 — Critical separation (4 sub-phases, contract-versioned)

### P1-1 — `SandboxPolicy` iframe+QuickJS unified

**Current location:** `SandboxedNode.tsx:30-51` (iframe); `sandbox-runner.ts:5-16` (QuickJS).

**Target boundary:** One `SandboxPolicy` type. Render via the host that fits.

**Required contract:** KERNEL-CONTRACTS C-13.

**Migration order:** define the union; update both hosts to read it.

**Test required:** the same K3 component renders correctly in both iframe and QuickJS modes.

---

### P1-2 — Split interface from in-memory impl (`IProviderRegistry`, `IModelRegistry`, `IResourceManager`, `IExecutionManager`, `IRouter`)

**Current location:** all 5 contracts share files with in-memory impls (`src/ai/registry/in-memory-*.ts`, `src/ai/runtime/in-memory-resource-manager.ts`, `src/ai/execution/in-memory-manager.ts`, `src/ai/routing/default-router.ts`).

**Target boundary:** interface K0; in-memory impl K1. The kernel depends only on the interface; the kernel ships one default impl (the simplest in-memory one) so a first-party plugin may not need to provide its own.

**Required contract:** KERNEL-CONTRACTS C-06, C-07, C-08, C-10, C-12.

**Migration order:** for each of the 5, move the interface to `src/kernel/*-registry-contract.ts`; keep the in-memory impl in `src/ai/*/in-memory-*.ts` (K1).

**Test required:** `bun test tests/arch/kernel-only-interface-imports.test.ts` — the kernel only imports the interface, not the impl.

---

### P1-3 — Event-bus namespace + audit enforcement; `KernelRegistry.registerEngine` per plugin

**Current location:** V1/V2 bus allow any `kind`; `KernelRegistry.registerEngine` is opt-in (engines call it themselves).

**Target boundary:** Every plugin emits with a `plugin:<id>:` prefix; every install/uninstall/upgrade calls `KernelRegistry.registerEngine` and `unregisterEngine` automatically (no opt-in).

**Migration order:** add the prefix check to V2; wire the registration into `PluginHost.install/uninstall`.

**Test required:** `tests/unit/kernel/plugin-bus-namespace.test.ts`.

---

### P1-4 — `UIComponent` generated expansion; `scriptUrl` write-site audit

**Current location:** `frontend/src/components/canvas/SandboxedNode.tsx:19` (renderer); `src/storage/contracts/ui-component-store.ts` (storage); the proposal in the prior `PLAN.md` to expand `UiGeneratedContribution` to a `UiComponent` row.

**Target boundary:** KERNEL owns the row expansion logic; FIRST-PARTY owns the catalog of available components.

**Required contract:** KERNEL-CONTRACTS C-? (the unified `IUiComponentStore`); PLUGIN-CONTRACTS P-05.

**Migration order:** define `IUiComponentStore` interface in KERNEL; move concrete impl to a first-party plugin or keep as a kernel-default (like the in-memory storage provider). `UiGeneratedContribution` is expanded to a `UiComponent` row at install time.

**Test required:** `tests/unit/kernel/ui-generated.test.ts` — every `UiContribution` produces a valid `UiComponent` row; `scriptUrl` is the kernel-asset origin.

---

## 3. P2 — Cleanup (5 sub-phases)

### P2-1 — `SchemaRegistry` `plugin:${id}.` prefix; `NodeType` widened

**Current location:** `src/schema/node.ts:207`.

**Target boundary:** KERNEL enforces the prefix; FIRST-PARTY registers through `IPluginContext.schema.register(contribution)`.

**Migration order:** add `caller: 'boot' | { pluginId }` parameter; widen `NodeType` to `BuiltinNodeType | (string & {})`; update `registerAllSchemas()` to pass `caller: 'boot'`.

**Test required:** `tests/unit/schema/prefix.test.ts` — two plugins with the same local name do not collide; `cap-store.*` rejected for plugins.

---

### P2-2 — Prisma data-model split (kernel vs first-party vs user)

**Current location:** `prisma/schema.prisma` (200 models, single file).

**Target boundary:** KERNEL's 15 models stay; first-party models migrate to `plugins/core/<plugin>/prisma/schema.prisma`; user models stay in `prisma/user/`.

**Migration order:** split the file; backfill `plugin_id` FKs; update Prisma client generation.

**Test required:** the dual-DB boundary test passes; every first-party model's `plugin_id` is non-null.

---

### P2-3 — Remove `safe-eval.ts` and `simulator-adapter.ts` + `legacy-adapter-wrappers.ts`

**Current location:** `src/engines/safe-eval.ts:1-15` (HAZARD H9); `src/ai/protocol/simulator-adapter.ts`; `src/ai/protocol/legacy-adapter-wrappers.ts`.

**Target boundary:** KERNEL no longer contains a denylist-based eval guard. KERNEL no longer ships a simulator.

**Migration order:** delete the files; update the parser runtime to run in `SandboxRunner` only.

**Test required:** `bun test tests/arch/no-safe-eval-no-simulator.test.ts`.

---

### P2-4 — `IProviderAdapter` and `IProviderRegistry` typed `contractVersion`

**Current location:** the `IProviderAdapter` contract is in `src/ai/protocol/adapter.ts`; the `VIVIM_AI_PROTOCOL` constant covers it.

**Target boundary:** every contract has a `contractVersion` field. The certifier cross-checks the manifest's `contractVersions` against the kernel's actual versions.

**Migration order:** add the field; document the certifier check.

**Test required:** the `PluginContractVersionsSchema` cross-check.

---

### P2-5 — `CapabilityEventBus` V1 deprecation path (one release behind)

**Current location:** V1 is still imported by many engines.

**Target boundary:** V1 is preserved behind the bridge; new code only sees V2. V1 is removed in a future major.

**Migration order:** add `@deprecated` annotations; add a runtime warning when V1 is imported; remove V1 in the next major.

---

## 4. P3 — Future optimization (one plugin at a time)

After P0–P2 land, the next work is **moving one first-party engine at a time** from `src/engines/<name>.ts` to `plugins/core/<name>/`. Each move is a small PR. The order is by size:

1. `plugin:contacts` (small) — F-HIGH-17
2. `plugin:notifications` (small) — F-HIGH-17
3. `plugin:cost` (small) — F-HIGH-16
4. `plugin:collections` (small) — F-HIGH-18
5. `plugin:outcomes` (small) — F-MED-11
6. `plugin:audit` (small) — F-LOW-4
7. `plugin:policy` (medium) — F-HIGH-13
8. `plugin:sla` (small) — F-LOW-4
9. `plugin:sync` (medium) — F-HIGH-19
10. `plugin:search` (small) — Domain D
11. `plugin:workspace` (medium) — Domain B
12. `plugin:mirror` (small) — F-HIGH-20
13. `plugin:discovery` (small) — F-HIGH-11
14. `plugin:routing-learning` (small) — Domain G
15. `plugin:tools-image` (small) — F-MED-8
16. `plugin:tools` (small) — Domain G
17. `plugin:dev-tooling` (medium) — Domain J (F-LOW)
18. `plugin:ui-shell` (small) — Domain D
19. `plugin:ui-cards` (small) — Domain D
20. `plugin:ui-panels` (small) — Domain D
21. `plugin:ui-builder` (small) — Domain D
22. `plugin:ui-canvas` (medium) — Domain D
23. `plugin:knowledge` (medium) — F-HIGH-14
24. `plugin:memory` (medium) — F-CRITICAL-7
25. `plugin:chat` (large) — F-CRITICAL-4
26. `plugin:agents` (medium) — F-CRITICAL-10
27. `plugin:workflows` (medium) — F-CRITICAL-9
28. `plugin:canon-nlcl` (large) — F-CRITICAL-4
29. `plugin:canon-harness` (large) — F-CRITICAL-8
30. `plugin:providers-browser` (large) — F-CRITICAL-6
31. `plugin:providers-api` (large) — F-CRITICAL-5 (with the 9 seed manifests)
32. `plugin:discord` (proof) — Domain E
33. `plugin:slack` (proof) — Domain E
34. `plugin:notion` (proof) — Domain E
35. `plugin:whatsapp` (proof) — Domain E
36. `plugin:reddit` (proof) — Domain E

The Phase 3.5 proof (per the prior `PLAN.md`) is migrating Discord/Notion exclusively via the plugin path. Phase 3.6 (after) migrates Slack/WhatsApp/Reddit.

**v2 plugins** (separate roadmap, after P3):
- `plugin:canon-harness` exposes `harness` contribution type to K2
- `plugin:providers-browser` exposes `browser-provider` to K2
- `feature-registry.ts` for K2 `features` contribution
- review-gate mechanism for K2 `ui:compiled-component`

---

## 5. Summary

| Phase | Sub-phases | What it achieves | Estimated calendar |
|---|---|---|---|
| **P0** (blocker) | 8 sub-phases + **P0-1.x** (8 capability wrappers, post-REASSESSMENT Change-7) + **P0-1.w** (K0(L0) deterministic intelligence substrate, 10 PRs, 2 sprints) + **P0-1.y** (M-layer self-descriptive contracts, 7 PRs, 1 sprint) | Single install path; certifier; closed context; policy split with `enforceCapabilityInvocation`; sandbox hardening; bus bridge; `globalThis` cleanup; kernel-only boot test; kernel-introspection capabilities; K0(L0) intelligence substrate; M-layer self-descriptive contracts | 5-7 sprints (was 2-3) |
| **P1** (contract versioned) | 4 sub-phases | `SandboxPolicy` unified; interface/impl split; bus namespace (dot); UI contribution expansion; `contractVersion` typed on every contract | 1-2 sprints |
| **P2** (cleanup) | 5 sub-phases | `SchemaRegistry` prefix; Prisma split; `safe-eval`+simulator removed; V1 deprecation | 1-2 sprints |
| **I-2 Deep Probe** | 10 evidence docs (was 8; +2 for L0 substrate + L0 resolvers) | Per-file truth map; event bus diff; contract consumer map; IPluginContext reach audit; Prisma table audit; DOM/event surface; frontend component inventory; harness command inventory; **L0 substrate inventory; L0 resolver coverage** | 4-6 weeks (1 sprint) |
| **P3** (one plugin at a time) | 36 first-party plugin extractions (now including the NLCL orchestrator, OpenCode bridge, agents, etc., per LAYER-0) | Each plugin uses the kernel contracts identically to a third-party plugin; the harness seed split (Gap-7 fix) moves 100+ commands to `plugins/core/canon-harness/commands/` | 6-12 months |

After I-2: every per-file tier assignment is evidence-backed; every contract has a consumer map; the migration plan is no longer a doc — it is a checked-in artifact.

After P0: the security boundary is real; a third-party plugin can install safely; the capability-abuse defense is in place.

After P1: the contracts are versioned; the kernel-only boot test passes; every kernel contract has `contractVersion: { major: 1; minor: 0 }`.

After P2: the data model is split; the kernel is the minimum substrate.

After P3: VIVIM is a kernel hosting VIVIM as a plugin suite.

---

## 6. I-2 Deep Probe (the work before P0 starts)

> **The forensic reclassification is the design; the I-2 deep probe is the evidence.** Before P0-1 merges, the I-2 probe runs small `bun run` scripts and writes evidence docs that prove every per-file tier assignment, every contract signature, and every consumer. The probe is deterministic and reproducible.

The I-2 deep probe produces these docs in `docs/kernel-plugins/evidence/`:

| File | What it produces | Method |
|---|---|---|
| `evidence/per-file-truth-map.md` | A row per file under `src/engines/`, `src/ai/`, `src/server/`, `frontend/src/engines/`, `frontend/src/sdk/`, `frontend/src/shared/`, `frontend/src/components/canvas/`, with `today | should-be | reason` (K0/K1/K2/K3, dot namespace, evidence:file:line). | `bun run .runtime/probe-truth-map.ts` |
| `evidence/event-bus-diff.md` | Every V1 event type vs V2 envelope; the legacy prefix mapping; the bridge's mirroring rules; the namespace test cases. | `bun run .runtime/probe-bus.ts` |
| `evidence/contract-consumer-map.md` | For each kernel contract (C-01..C-32), the list of files that import it, the symbols used, and the test that pins the contract. | `bun run .runtime/probe-contracts.ts` |
| `evidence/plugin-iplugin-context-reach.md` | For every `BootstrapContext` field accessed by a first-party engine today, the corresponding `IPluginContext` capability. Gaps are flagged. | `bun run .runtime/probe-context-reach.ts` |
| `evidence/cap-store-table-audit.md` | Every Prisma model in `prisma/system/` + `prisma/user/`, classified K0 (kernel) or K1 (first-party), with the migration order. | `bun run .runtime/probe-prisma.ts` |
| `evidence/dom-and-event-surface.md` | Every event type the kernel emits, every event type plugins emit, the namespace, the prefix rules. | `bun run .runtime/probe-events.ts` |
| `evidence/frontend-component-inventory.md` | Every component in `frontend/src/components/canvas/`, `frontend/src/ui/`, `frontend/src/sdk/`, classified K0 (kernel SDK) or K1 (first-party UI). | `bun run .runtime/probe-frontend.ts` |
| `evidence/harness-command-inventory.md` | Every command in `seeds/harness/commands/`, classified K1 (`plugin:canon-harness`); the K0 shape is `src/kernel/harness/registry.ts`. | `bun run .runtime/probe-harness.ts` |

The probe scripts (under `.runtime/`) are themselves shippable artifacts; they run as part of the devops gate.

---

## 7. Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| The certifier (P0-1) misses an attack vector | Medium | High (K2 plugin corrupts host) | Two-reviewer gate; fuzz the certifier with adversarial manifests; add a dedicated `tests/security/certify-fuzz.test.ts` |
| `globalThis` cleanup (P0-5) breaks a legacy consumer | High | Medium | Run the full `bun test` suite; search for `globalThis` usages with `rg`; migrate the legacy shim file-by-file in the same PR |
| The `Node` universal record is too restrictive for some plugin | Low | Medium | Extend `Node` ACL (`prisma/user/schema.prisma` `NodeAcl`) without breaking the existing shape; plugins can contribute a `Node` extension via the kernel |
| `v1` plugins are not forward-compatible to `v2` (harness, browser-provider) | Low | High (plugin breakage) | `contractVersion` is a hard gate; v2 plugins explicitly declare a different `major`; the certifier refuses to load a v2 plugin on a v1 kernel |
| The first-party → plugin migration (P3) breaks the host because of subtle coupling | High | Medium | One plugin at a time; each PR has a 100% `bun test` green; a "kernel-only boot with this one plugin enabled" test as the gate |
| The Prisma split (P2-2) loses the `provider_definition.pluginId` link | Low | High (chain breaks) | Backfill migration; FK is preserved across the split |
| `globalThis.__pluginManager` is read by an external library we missed | Medium | High | `rg "globalThis.__pluginManager"` should return 0 after P0-5; the test enforces it |
| (NEW post-REASSESSMENT) **Capability abuse** — a plugin calls another plugin's capability without restriction | High | Critical | `IPolicyEnforcer.enforceCapabilityInvocation` is the default-deny gate (C-09). The 12-case matrix in `tests/unit/kernel/plugin-capability-abuse.test.ts` covers the surface. |
| (NEW post-REASSESSMENT) **TOCTOU race in `setState`** — two callers see the same state, both call `setState` | Medium | High (lifecycle corruption) | C-06's `expectedFrom` parameter; `setState` throws `ConcurrentStateChangeError` if actual state differs. Per-provider `Mutex` serializes. |
| (NEW post-REASSESSMENT) **DoS via unbounded UI payload** — a plugin ships 100MB html/css | Medium | Medium (browser tab crash) | P-05 size caps (64KB html / 32KB css) + CSS deny-list; Zod-enforced at certify. |
| (NEW post-REASSESSMENT) **The cake over-promises** — users think the cake auto-builds a Discord plugin in 30s | High | Medium (trust erosion) | §3 time-to-build column is honest; the cake is a 4-120x speedup, not 100% automation. The user must supply the *content* (Discord API, Notion blocks, infinite-canvas UX). |

---

*This plan is the work. The forensic verdict is the proof. The constitution is the rule.*
