# AT-FORENSIC-VERDICT — Top-20, Kernel, First-Party, Surface, Security, Migration, Risk

> **The final report.** The forensic reclassification answers the prompt's questions. **Read the constitution (`BOUNDARY-CONSTITUTION.md`) and the per-row inventory (`ATOMIC-INVENTORY-v3.md`) for the proof. This file is the executive summary.**

---

## 1. Executive Verdict

> **"Do the proposed boundaries correctly describe VIVIM?"**

**No — confidence 90%.** The prior proposal correctly identifies the *shape* of a plugin architecture (four layers, manifest + permissions, sandbox isolation) but materially misclassifies the *content* of the kernel. The 194-row proposal labels 75 rows as CORE; the forensic reclassification reduces the true kernel to **71 rows** (a small number) but **increases the precision of the split** — 11 rows are explicitly SPLIT (mechanism in kernel, content in first-party), and 80 rows are explicit MOVEs from "CORE" to a first-party plugin. **The success statement (`Vivim is a general-purpose local-first application kernel capable of hosting Vivim itself as a first-party plugin suite`) is achievable but requires a focused P0 phase (8 sub-phases, 1-2 sprints) before any third-party plugin can install safely.** The remaining 90% of confidence is whether the migration plan holds up to adversarial review of the certifier and whether the first-party plugins can be extracted without breaking boot. Both are testable.

The single largest correction the forensic pass made is to the **200-table Prisma schema** claim. The proposal treats "200 tables = CORE" as evidence the kernel is large. The forensic pass found that **~185 of those 200 tables are VIVIM product data** (Conversations, Memory, DiscordVoiceState, NotionPageMeta, WorkflowDefinition, etc.), and the **true kernel data model is ~15 tables** (Node, NodeVersion, NodeAlias, NodeEdge, SchemaMeta, PluginRegistry, SandboxAudit, EventRecord, KernelSpan, KernelProvenance, KernelTopology, KernelEvent, ConfigEntry, ConfigAudit, HpeSession). The "200-table schema" is a smokescreen that inflates the apparent kernel size by **~13×**.

The second largest correction is the `BootstrapContext` leak: today every first-party engine receives the full 60+ field `BootstrapContext`, which is the kernel's internal state bag. Constitution Rule C requires a *closed* `IPluginContext` that an external plugin could consume; this context does not exist yet. **Until it does, there is no "VIVIM eats its own dog food" — VIVIM uses internals that third-party plugins cannot.**

---

## 2. Top 20 Most-Important Changes

| # | Change | Why | Migration phase | Forensic evidence |
|---|--------|-----|------------------|-------------------|
| 1 | **Stop calling VIVIM's 200-table schema "CORE"** | The kernel data model is ~15 tables; the rest is VIVIM product data | F-CRITICAL-2 / P2-2 | `prisma/system/schema.prisma` (110) + `prisma/user/schema.prisma` (90) — 10 examples of "VIVIM product labeled CORE": `Conversation`, `EpisodicMemory`, `DiscordVoiceState`, `NotionPageMeta`, `WorkflowDefinition`, `AutonomousTask`, `McpTool`, `StealthPolicy`, `ProviderManifestVersion`, `CapabilityTelemetry` |
| 2 | **Define `IPluginContext` (closed) and ship it** | The "no VIVIM-only fast path" rule requires a closed context that an external plugin could consume; today plugins receive `BootstrapContext` (60+ fields of internal state) | MISSING-1 / P0-1 | `src/server/bootstrap/context.ts:37-110` (60+ fields) is the wrong shape |
| 3 | **Make `IPluginManager.discover()` and `install()` real** | Today `TrustedPluginManager.discover()` returns `valid:false "not yet implemented (C4 phase 1)"`; the real install lives only in `plugin-router.ts:100-431` (HTTP) | MISSING-5 / P0-1 | `src/ai/plugins/plugin-manager-impl.ts:35-50` (stubs); `src/server/plugin-router.ts:100` (real but separate) |
| 4 | **Make `IPluginManager.certify()` real (12 attack vectors)** | Today's certifier checks 3 things (manifest id/name + hash present + capabilities count); MISSING checks: namespace uniqueness, permission↔contributes, scriptUrl origin, schema Zod compiles, activate dry-run | MISSING-4 / P0-1 | `src/ai/plugins/plugin-manager-impl.ts:96-140` |
| 5 | **Unify `TrustedPluginManager` and `plugin-router.ts` into one `PluginHost`** | Two install paths is the definition of architectural malpractice | D4 / P0-1 | `src/ai/plugins/plugin-manager-impl.ts:27` + `src/server/plugin-router.ts:100` |
| 6 | **Delete `globalThis.__pluginManager` and `require()` lazy imports** | Workarounds for circular deps that the kernel boundary would solve; they prevent the plugin host from being testable in isolation | MISSING-17 / P0-5 | `src/ai/plugins/plugin-manager-impl.ts:162-171`; `src/server/bootstrap/phases/capabilities.ts:42-48, 62` |
| 7 | **Split `IPolicyEnforcer` from `IPolicyEvaluator`** | Per Constitution Rule D, enforcement is kernel; policy *content* is product. The current file has both, making it possible to accidentally treat enforcement as advisory | MISSING-12 / P0-2 | `src/ai/policy/policy.ts:40-68` ("they're different kinds of authority") |
| 8 | **Move `CAPABILITY_TAXONOMY_V2` (60 entries) to a first-party plugin** | The taxonomy is VIVIM's product vocabulary, not a kernel vocabulary. A Discord plugin author does not need `cap:conversation:send_message` | F-CRITICAL-1 / P3 | `src/engines/capability-taxonomy.ts:25-60` |
| 9 | **Add `ProviderRegistrar.registerOne(manifest, { source: 'plugin', pluginId })`** | Today no runtime path exists for a plugin to add a provider; the in-tree seed catalog is the only path | MISSING-7 / P0-2 | `src/engines/provider-registrar.ts:7` ("Seeds provider intel from the canonical in-repo manifests") |
| 10 | **Convert provider protocol cache to in-memory + disk snapshot** | A plugin installed after process start is not queryable through the generated file until restart; the generator is a build-time artifact, not a runtime contract | MISSING-8 / P0-2 | `src/engines/provider-protocol-generator.ts` (disk-only static file output) |
| 11 | **Move `ConversationManager` (1165 lines) + 60-file `nlcl/` to a first-party `plugin:chat`** | The 8-step send pipeline is VIVIM product; the kernel has no opinion on whether to support an inbox | F-CRITICAL-4 / P3 | `src/engines/conversation-manager.ts:1-40`; 60 files in `src/engines/nlcl/` |
| 12 | **Move `ChromeGovernor` (800 lines) + 19 stealth modules + 19 browser-automation engines to `plugin:providers-browser`** | The browser substrate is product; the kernel has only the iframe host and the `IRuntimeSupervisor` *contract* | F-CRITICAL-6 / P3 | `src/engines/chrome-governor.ts:1-50`; 19 files in `stealth/`; 19 in `browser-automation/` |
| 13 | **Move `MemoryEngine` + 8 memory files + 8 memory Prisma models to `plugin:memory`** | Memory is a VIVIM product; the kernel has the universal `Node` record that the memory plugin uses | F-CRITICAL-7 / P3 | `memory-engine.ts`; `memory/*` (8 files); `EpisodicMemory`+`SemanticMemory`+...+`MemoryAccess`+`MemoryLink` models |
| 14 | **Move 17 `harness/*` files + 4 harness Prisma models to `plugin:canon-harness`** | The harness is VIVIM's browser-recipe language; the recipes are product. The `HarnessCommandRegistry` *shape* stays kernel; the *content* moves | F-CRITICAL-8 / P3 | `src/engines/harness/*` (17 files); `HarnessCheckpoint`+`HarnessCommand`+`RepairSession`+`WorkflowRetryQueue` |
| 15 | **Add `IPluginContext.storage.scoped()` (closed, per-namespace)** | Today plugins access the entire `CapStoreDb` (no per-plugin isolation); a malicious plugin reads every user's memory | MISSING-6 / P0-1 | `BootstrapContext.db` (`CapStoreDb`) has no scoping |
| 16 | **Add `contractVersion` on every kernel contract** | The compatibility guarantee is in the constitution but is not enforceable in code; only `VIVIM_AI_PROTOCOL` is versioned | MISSING-2 / P1 | `src/ai/core/types.ts:18` is the only versioned contract |
| 17 | **Add `scriptUrl` kernel-asset origin gate** | Today the iframe accepts any `scriptUrl`; a future plugin contribution could supply any URL. The kernel must own the asset origin | MISSING-15 / P0-3 | `SandboxedNode.tsx:154-156`; "P8 invariant: allowInlineScript is FORCED false" exists; scriptUrl origin is not |
| 18 | **Remove `safe-eval.ts` (HAZARD H9 denylist) and `simulator-adapter.ts`** | The file's own header admits the denylist is fundamentally insecure; the simulator is a test artifact that has no place in the kernel | F-HIGH-22 / P0-3 + P2-3 | `src/engines/safe-eval.ts:1-15` ("Hazard H9 - denylist is fundamentally incomplete") |
| 19 | **Move the 9 in-tree provider manifests (Discord, Notion, Slack, WhatsApp, Reddit, OpenAI, Anthropic, OpenRouter) to first-party plugins** | The seed catalog is VIVIM product; the registry contract is kernel | F-CRITICAL-5 / P3 | `seeds/providers/manifests.ts:1-50` (9 manifests) |
| 20 | **Add 18 arch tests (mechanical boundary enforcement) to `tests/arch/`** | The constitution is currently enforced by review; CI enforcement is the only way to prevent boundary erosion over time | KERNEL-BOUNDARY-TESTS.md / P0-1 | `tests/arch/layer-dependency.test.ts` exists for the foundation; nothing enforces the kernel boundary today |

The 20 changes are the minimum to make the success statement **actually true in code** rather than **a doc paragraph**. The other 174 rows in the inventory are consequences: the "VIVIM-as-its-own-plugin" rule forces ~80 of the 194 rows to move to first-party plugins.

---

## 3. Final Minimal Kernel (17 subsystems — REVISED post-REASSESSMENT)

The kernel after the migration is approximately **17 subsystems** (was 15; `IPluginHost` and the observability kernel are now enumerated separately per REASSESSMENT Gap-14). Order is by dependency.

1. **`IPluginManager`** — discover / certify / install / enable / disable / uninstall (KERNEL-CONTRACTS C-01). The single install path. Atomic staging in `tmpdir()`. Sha256 verification before any write.
2. **`IPluginContext` factory** — the closed object every plugin receives (MISSING-1; C-02). The "no VIVIM-only fast path" enforcement. Includes the full `ISandboxHost` shape (Gap-3 fix).
3. **`IEventBus`** — typed pub/sub with envelopes, DLQ, `publishAndWait`, V1→V2 bridge, and `trace()` (C-03). Every cross-tier event is observable. Namespace normalized to dots (Gap-13 fix).
4. **`IProviderRegistry` + `IModelRegistry`** — the registry shape with `PROVIDER_TRANSITIONS` state machine + `expectedCurrentState` TOCTOU defense (C-06, C-07; Gap-7 fix). `unregister()` cascades.
5. **`IProviderAdapter` contract + `AdapterError`** — the single behavioural surface a provider integration implements (C-05). The error model is now a 6-variant discriminated union (Gap-4 fix). Versioned by `VIVIM_AI_PROTOCOL`.
6. **`IExecutionManager`** — concurrency, queueing-by-priority, fallback-on-provider-crash, cancellation, `drainProvider()` + `forceStopProvider()` separation (C-10; Gap-5 fix).
7. **`IRuntimeSupervisor` + `IResourceManager`** — the OS-process boundary and the typed resource lease (C-11, C-12). `IResourceManager` now has `acquire` (throw) + `tryAcquire` (return null) — Gap-9 fix.
8. **`IPolicyEnforcer` + `IPolicyEvaluator`** — the deny-at-egress primitive (C-09). **NEW in v1.0: `enforceCapabilityInvocation` — the capability-abuse defense (REASSESSMENT Change-8).** Distinct from `IPolicyEvaluator` (advisory scoring — first-party).
9. **`IRouter` + `IRoutingStrategy`** — candidate discover + score + decide (C-08). Strategies are first-party.
10. **`SandboxedNode` host (frontend) + `SandboxRunner` (backend) + unified `SandboxPolicy`** — iframe + QuickJS isolation primitives (C-13). `allowInlineScript: false` + CSP + `allowCapabilities` + `budgetMs` + Watchdog. `vm` fallback privileged.
11. **`SandboxAuditStore` + `KernelProvenance` + `KernelTracer` + `KernelSpan` + `KernelEvent`** — every install / uninstall / capability call / sandbox run / state transition is recorded (C-18, C-19).
12. **`SchemaRegistry` + `INodeStoreContract`** — the universal record (`Node` + `NodeVersion` + `NodeAlias` + `NodeEdge`) with namespace enforcement (C-14, C-15). `register(..., { caller: 'boot' | { pluginId } })` — kernel always prefixes.
13. **`MigrationRunner` + `verifySchemaCompat` + dual-DB boundary** — the data-machinery that persists every plugin's tables. The data *shape* is product; the *machinery* is kernel.
14. **`EncryptionEngine` + `DbEncryptionEngine` + `MessageIdentity` + branded ID types** — crypto primitives (C-20). `crypto.createHash('sha256')` for message identity; AES-GCM for at-rest.
15. **`IPluginHost` glue** (separated per REASSESSMENT Gap-14) — the audit + topology + diagnostic kernel glue. Calls per-axis registries (schema, services, ui) and emits `kernel.plugin.installed`.
16. **`KernelRegistry` + `Oracle*` observability** (separated per REASSESSMENT Gap-14) — the diagnostic query engine. `KernelRegistry.registerEngine` is called automatically on every plugin install (P1-3). `Oracle*` engines serve the diagnostic UI.
17. **Kernel-introspection capabilities (C-25..C-32)** — the 8 capability wrappers (per `PLUGIN-BUILDER-CAKE.md` §6). These are *exposures*, not new mechanisms; they are the "what the kernel exposes to the plugin-builder" surface.

Plus, the **storage machinery** (Prisma client, `SchemaMeta`, `verifySchemaCompat`, the boot pipeline phases) and the **observability** (`getLogger`, `KernelTracer`) are part of the kernel's foundation, not separate subsystems.

The 17 subsystems are the **minimum** required to make the success statement true. Removing any one of them forces either: (a) a third-party plugin to reach past the kernel, or (b) the host V8 to absorb the responsibility (which is the "no VIVIM-only fast path" violation).

The kernel data model (REVISED — was "~15 tables", now **17-18 tables** with the borderline `User` and `Session` formally classified as K0 per REASSESSMENT Gap-15):

- `SchemaMeta`, `Node`, `NodeVersion`, `NodeAlias`, `NodeEdge`
- `PluginRegistry`, `SandboxAudit`, `EventRecord`
- `KernelSpan`, `KernelProvenance`, `KernelTopology`, `KernelEvent`
- `ConfigEntry`, `ConfigAudit`, `HpeSession`
- **`User`, `Session`** (re-classified as K0 — see REASSESSMENT Gap-15)

The remaining ~183 Prisma models in `prisma/system/*.prisma` and `prisma/user/*.prisma` are VIVIM first-party data; they migrate with their owning plugin.

---

## 4. First-Party Plugins (VIVIM as its own plugin)

After P3, VIVIM's product features are first-party plugins. The taxonomy:

```
plugins/core/
  plugin-chat/                   ConversationManager, StreamParser client, message-identity, send pipeline, UI composer/inbox
  plugin-memory/                 MemoryEngine, FSRS, embeddings, memory-fabric, semantic-search
  plugin-knowledge/              knowledge-extractor, knowledge-ingestion, semantic-grounding, cross-conversation-synthesis
  plugin-agents/                 agent-builder, autonomous-execution, local-agent, OpenCode bridge
  plugin-workflows/              workflow-engine, automation-orchestrator
  plugin-canon-nlcl/             NLCLEngine, intent resolvers, command catalog, command executors
  plugin-canon-harness/          harness-executor, harness-command-registry, harness-repair, content-pipeline
  plugin-policy/                 P0PolicyEngine, ConsentEngine, ExecutionPolicyEngine, GovernanceEngine, IPolicyEvaluator
  plugin-cost/                   cost-optimizer, cortex-budget
  plugin-collections/            collection-engine
  plugin-contacts/               contact-engine
  plugin-notifications/          notification-engine
  plugin-workspace/              workspace-presets, workspace-backup, workspace-mode
  plugin-sync/                   sync-engine, conversation-history-sync
  plugin-mirror/                 mirror-engine, observation-tap
  plugin-routing-learning/       transfer-accelerator, learning-event
  plugin-discovery/              web-app taxonomy, provider-archetype, discovery-session
  plugin-audit/                  outcome-tracker, sla-monitor, registration-auditor
  plugin-search/                 semantic-search UI, search-panel
  plugin-tools/                  tool-orchestrator-facade, tool-use-protocol
  plugin-tools-image/            image-gen-bridge
  plugin-tools-mcp/              mcp-server-adapter, mcp-client-adapter

  plugin-providers-api/          OpenAI-compatible adapter, ProviderRegistrar.registerOne impl, provider-protocol cache
  plugin-providers-browser/      ChromeGovernor, SelectorHealer, SelectorRefiner, Stealth*, BrowserAutomation*
  plugin-claude/                 kind:'api-protocol' (Anthropic)
  plugin-openai-api/             kind:'api-protocol' (OpenAI compatible)
  plugin-openrouter/             kind:'api-protocol' (OpenRouter)
  plugin-discord/                kind:'browser-provider' (v2)
  plugin-notion/                 kind:'api-protocol'
  plugin-slack/                  kind:'browser-provider' (v2)
  plugin-whatsapp/               kind:'browser-provider' (v2)
  plugin-reddit/                 kind:'browser-provider' (v2)

  plugin-ui-canvas/              InfiniteCanvas, LivingCanvas, CanvasSurface, CanvasNode, ConnectionLayer
  plugin-ui-panels/              PanelShell, PanelRegistry, AuditDashboard, RbacManager, TemplatesGallery, HealthDashboard
  plugin-ui-shell/               Brand, MainMenu, MobileNav, CommandPalette, NotificationsCenter, OnboardingTour
  plugin-ui-cards/               DocCard, MediaCard, AutomationCard, AgentCard, ShellCard
  plugin-ui-builder/             BuilderSurface, CapabilityNode, SurfaceNode

  plugin-dev-tooling/            plugin-hot-reload, plugin-builder NL→manifest, plugin lint
```

This is **not** a rename — it is a **migration**. The first-party plugins are the VIVIM product, refactored to use the same kernel contracts a third-party plugin would. After P3, no engine in `src/engines/` exists; every engine is a plugin. **Boot with no plugins installed; install `plugin:chat` and the chat works; install `plugin:discord` and Discord works; install both and the user sees a unified conversation surface.**

The 36 first-party plugins (count from P3 list in `BOUNDARY-MIGRATION-PLAN.md` §4) is a 6-12 month effort. P0–P2 are 1-2 sprints each.

---

## 5. Generic Plugin Surface (what an external developer builds)

The plugin's surface is **the same surface a first-party plugin uses** (Constitution Rule C). The list is short and explicit:

| Contribution | What it is | Permission | v1? | v2? |
|---|---|---|---|---|
| `schema` | `SchemaContribution[]` → `SchemaRegistry.register(..., { caller: { pluginId } })` | `schema:extend` | yes | yes |
| `services[kind:'api-protocol']` | `OpenAICompatibleManifest` → `IProviderRegistry.register()` + `IProviderAdapter` impl | `network` | yes | yes |
| `services[kind:'mcp-server']` | stdio/http/sse MCP server registration | `network` | yes | yes |
| `services[kind:'mcp-client']` | MCP client (calls external servers) | `network` | yes | yes |
| `services[kind:'browser-provider']` | CDP-driven provider (drives a website as a user) | `network` + `chrome:control` | no (rejected v1) | yes |
| `ui.generated[]` | html + css + optional `scriptUrl` for a `SandboxPolicy` slot | `ui:custom-html-css-only` or `ui:custom-scripturl` | yes | yes |
| `ui.compiled[]` | compiled React component via `UniversalComponentRegistry` | `ui:compiled-component` | no (rejected v1) | yes (with review gate) |
| `harness.commands[]` | new browser recipe | `chrome:control` | no (rejected v1) | yes |
| `features[]` | native-coded capability handler registered at startup | depends on the feature | no (rejected v1) | yes |
| `activationEvents` | `onStartup` (always); `onCommand:*` `onProvider:*` `onSchema:*` parsed in v1, acted on in v2 | — | partial | yes |

The plugin sees the **same kernel contracts as VIVIM itself**:
- `IPluginContext.events.{publish,on,once,onAny}` — same bus VIVIM uses
- `IPluginContext.storage.scoped(namespace)` — same Node store VIVIM uses
- `IPluginContext.schema.register(...)` — same registry VIVIM uses
- `IPluginContext.capabilities.invoke(...)` — same capability router VIVIM uses
- `IPluginContext.sandbox.render(...)` — same `SandboxedNode` host VIVIM uses

This is what "VIVIM eats its own dog food" means in code. **Today it is not true; the migration is what makes it true.**

---

## 6. Security / Trust Model (the K0–K4 tiers)

Full detail in `PLUGIN-TRUST-MODEL.md`. The summary:

| Tier | What | Enforced by | Where today |
|---|---|---|---|
| **K0** | Kernel | — | 71 subsystems (per reclassification) |
| **K1** | First-party plugin | `IPolicyEnforcer`, `BootstrapContext` reduction, kernel bus | 76 subsystems (after P3, 36 plugins) |
| **K2** | Certified extension plugin | `IPluginManager.certify()` (12 attack vectors), `IPluginScopedStore` (per-namespace), `scriptUrl` origin | 38 rows (the plugin surface) |
| **K3** | Sandboxed component | `SandboxedNode` (iframe, opaque origin, CSP, `allowCapabilities`, `budgetMs`) + `SandboxRunner` (QuickJS) | iframe + 1 host row |
| **K4** | External process | `IRuntimeSupervisor` + `IResourceManager` lease (K3-4 boundary) | Tauri supervisor (RBE) |

The **four enforcement points** the kernel owns:

1. **Plugin install** — `IPluginManager.certify()` (12 attack vectors per `KERNEL-BOUNDARY-TESTS.md` §2.9).
2. **Network egress** — `IPolicyEnforcer.enforceNetwork()` (split from `IPolicyEvaluator` in P0-2).
3. **Sandbox** — `SandboxedNode` (frontend) and `SandboxRunner` (backend), with one unified `SandboxPolicy`.
4. **Process boundary** — `IRuntimeSupervisor` (the Tauri-side Rust process does the real work; TS-side is the contract).

A plugin that bypasses any of these four is a P0 defect. The 18 arch tests in `KERNEL-BOUNDARY-TESTS.md` make bypasses impossible to merge.

---

## 7. Migration Sequence (the recommended order)

The full plan is in `BOUNDARY-MIGRATION-PLAN.md`. The recommended order is:

### Phase P0 (blocker, 1-2 sprints, ~15 PRs)

1. **P0-1** `IPluginManager` + `IPluginContext` + `PluginManifestSchema` + `PluginHost` + V1→V2 bridge (the security boundary). **2 reviewer gate.**
2. **P0-2** `IPolicyEnforcer` split + `ProviderRegistrar.registerOne` + in-memory protocol cache.
3. **P0-3** `SandboxPolicy` origin + `scriptUrl` + remove `safe-eval.ts` + remove `vm` fallback in production.
4. **P0-4** Bus event-type namespace enforcement.
5. **P0-5** `globalThis` + `require()` cleanup; reduce `BootstrapContext`.
6. **P0-6** Kernel-only boot test.
7. **P0-7** `IPluginContext` boundary test.
8. **P0-8** `ProviderManifestVersion` FK to `PluginRegistry`.

**Exit gate:** `tests/arch/kernel-boot.test.ts` passes; `tests/arch/kernel-isolation.test.ts` passes; the certifier test passes all 12 attack vectors; a real third-party plugin can install, run, and uninstall safely.

### Phase P1 (contract versioned, 1 sprint, ~5 PRs)

1. **P1-1** `SandboxPolicy` iframe+QuickJS unified.
2. **P1-2** Interface/impl split for the 5 K1-owned in-memory registries.
3. **P1-3** `KernelRegistry.registerEngine` automatic on install/uninstall.
4. **P1-4** `UiGeneratedContribution` expansion to `UiComponent` row.
5. **P1-5** (parallel) `contractVersion` field on every kernel contract.

**Exit gate:** every contract has a `contractVersion`; the certifier cross-checks plugin `contractVersions` against the kernel's.

### Phase P2 (cleanup, 1-2 sprints, ~10 PRs)

1. **P2-1** `SchemaRegistry.register(..., { caller })` + `NodeType` widened.
2. **P2-2** Prisma data-model split.
3. **P2-3** Remove `safe-eval.ts` (done in P0-3), `simulator-adapter.ts`, `legacy-adapter-wrappers.ts`.
4. **P2-4** `contractVersion` typed on every contract.
5. **P2-5** V1 bus deprecation path.

**Exit gate:** the kernel boots with no first-party plugin and the 15 subsystems are the only code under `src/kernel/`.

### Phase P3 (one plugin at a time, 6-12 months, 36 PRs)

Migrate first-party engines to `plugins/core/<name>/`. Order by size: smallest first. After each, the kernel-only boot test + a "kernel + this one plugin" boot test must pass.

**v2 (after P3, separate roadmap):**
- `harness` contribution for K2 (with `chrome:control` gate)
- `browser-provider` for K2 (with `chrome:control` gate)
- `features` for K2 (with `feature-registry.ts`)
- `ui:compiled-component` for K2 (with review-gate mechanism)

---

## 8. Architectural Risk

The single biggest risk is **the plugin architecture being a nominal facade** — meaning the kernel APIs exist on paper, but in practice the *useful* VIVIM functionality still secretly depends on VIVIM-specific kernel internals that third-party plugins cannot reach. This is the failure mode of every "plugin architecture" that doesn't work.

**Symptoms to watch for during migration:**

1. **VIVIM's chat can do X; a third-party Discord plugin cannot do X** because X is implemented in a `BootstrapContext` field that a third-party plugin does not receive. **Test:** for every `BootstrapContext` field accessed by a first-party engine today, assert there is a corresponding `IPluginContext` capability for a third-party plugin to do the same thing.

2. **The first-party plugin extraction (P3) requires a kernel hook that does not exist** — e.g. the first-party `plugin:chat` needs to inject its UI into the canvas; the kernel has no `registerCanvasSlot(slotId, pluginId, component)` contract. **Test:** every UI surface that a first-party plugin contributes to must be reachable through `UniversalComponentRegistry.register()` (kernel) + `UiComponentStore` (kernel). No "special path" for VIVIM.

3. **The certifier is incomplete** — a malicious plugin finds a way to install. **Test:** fuzzing the certifier with 10,000 randomly mutated manifests; require 100% rejection of any that would violate a P-15 check.

4. **The first-party plugin extraction breaks boot** — the engine was coupled to the kernel in a way the migration plan didn't anticipate. **Test:** every P3 PR has a "kernel + this one plugin" boot test.

5. **Bus event-type namespace enforcement collides with legacy** — the kernel's own engines publish events with non-`plugin:`-prefixed kinds; the new check is over-strict and breaks them. **Test:** the kernel's own engines pass the namespace check before the plugin check is enforced.

6. **V1→V2 bus bridge loses events** — the one-way mirror misses some events. **Test:** every V1 event published during the integration test must appear in V2's snapshot.

7. **The `BootstrapContext` reduction is more invasive than expected** — a "remove a field" turns out to require threading the same data through `IPluginContext`. **Test:** every field removed from `BootstrapContext` is reachable through `IPluginContext` or a kernel contract.

8. **The kernel-only boot test (P0-6) fails** — the kernel is too entangled with a first-party engine to boot without it. **Test:** P0-6 ships with P0-1; if it fails, the migration plan was wrong.

**Mitigation:** the migration plan is testable. Every phase has a test that proves the success statement. If a phase's test cannot be written, that phase is wrong; the plan is wrong; the constitution is wrong. The forensic pass does not ship the migration — it ships the *test scaffold* the migration must satisfy.

**NEW risks added post-REASSESSMENT:**

9. **(honest-list risk)** The cake is a speed multiplier, not an automation oracle. The §3 table has 24 `🟢` plugins, but the *time-to-build* column reveals that even a 1B-parameter LLM cannot eliminate the *content knowledge* the user must supply (Discord auth flow, Notion block model, infinite-canvas UX, etc.). The cake is a 4-120x speedup, not a 100% automation. **Test:** the time-to-build column is honest; the user is told upfront what the cake produces and what they must supply (see `inventory/PLUGIN-BUILDER-CAKE.md` §3 "What the user must supply" column).
10. **(capability abuse)** A plugin calls another plugin's capability without restriction. **Test:** the 12-case matrix in `inventory/KERNEL-BOUNDARY-TESTS.md` §2.7 covers the surface; `IPolicyEnforcer.enforceCapabilityInvocation` is the kernel's first defense (default-deny), and the per-capability allowlist in the callee's manifest is the second (PLUGIN-CONTRACTS P-18).
11. **(DoS via unbounded UI payload)** A plugin ships a 100MB `html` or `css` string. **Test:** `P-05` size caps (64KB html / 32KB css) + CSS deny-list (`@import`, `expression(`, `url(http...)`) are Zod-enforced at certify; the kernel rejects any violation with `ui payload too large` or `plugin css contains forbidden construct`.
12. **(TOCTOU in `setState`)** Two callers observe `active` simultaneously, both call `setState('draining')`, both succeed. **Test:** C-06's `expectedFrom` parameter is enforced; `setState(id, to, expectedFrom)` throws `ConcurrentStateChangeError` if the actual state differs.
13. **(sandbox host shape under-specified)** The previous `IPluginContext.sandbox` had `...` in the return type. **Test:** the full `ISandboxHost` + `ISandboxInstance` shape is in `inventory/KERNEL-CONTRACTS.md` C-02; the renderer in `SandboxedNode.tsx:80-140` conforms to it.

---

## 9. What this report is NOT

This is **not** a rearchitecture. The kernel does not get rebuilt. The first-party engines do not get rewritten. The migration moves files and adds contracts. The size of the diff per PR is small. The cost is in **breadth** (every kernel contract must be versioned, every first-party engine must be extracted) not in depth (no single change is large).

This is **not** a new architecture. The kernel boundary is already implicit in the codebase: `CapabilityEventBus` and `CapabilityEventBusV2` already exist; `IPluginManager` already exists; `SandboxedNode` already exists; `IRuntimeSupervisor` already exists. The migration makes the boundary *explicit* and *enforceable* — that is the only change.

This is **not** a "Vivim as a different product." The same binaries boot. The same user experience. The same engines run. The same data persists. The only difference is that, after the migration, a third-party developer can write a plugin that does what `plugin:discord` does, using the *same contracts VIVIM itself uses* — and the kernel enforces the security boundary that today is implicit and incomplete.

---

## 10. The single sentence the migration must end with

> **A valid kernel boots with no first-party plugin installed. A first-party plugin installs the same way a third-party plugin does. A third-party plugin cannot reach a capability the kernel does not expose. The kernel does not know what a Conversation or a Memory is — it knows what a Node is.**

The migration plan (`BOUNDARY-MIGRATION-PLAN.md`) is the work. The forensic inventory (`ATOMIC-INVENTORY-v3.md`) is the per-row proof. The constitution (`BOUNDARY-CONSTITUTION.md`) is the rule. The trust model (`PLUGIN-TRUST-MODEL.md`) is the security tier. The contracts (`KERNEL-CONTRACTS.md`, `PLUGIN-CONTRACTS.md`) are the law. The arch tests (`KERNEL-BOUNDARY-TESTS.md`) are the gate. The 18 critical items in `MISSING KERNEL PRIMITIVES` are the P0 schedule. The 36 first-party plugins in `BOUNDARY-MIGRATION-PLAN.md` §4 are the P3 schedule.

**The success condition of this report is the success condition of the architecture: it becomes true in code, not in a doc paragraph.**

— END —
