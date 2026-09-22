# Step 1.8: Capability Bootstrap — The "Manifest" Equivalent

**Date:** 2026-08-28
**Read:**
- `kernel/capability/capability-bootstrap.ts` (18 lines, re-exports)
- `kernel/capability/capability-bootstrap-generated.ts` (331 lines, partial)
- `work/forge/src/engines/capability-bootstrap/default.ts` (57 lines)
- `work/forge/src/engines/capability-bootstrap/types.ts` (62 lines)
- **Status:** READ + ANALYZED

**Critical finding:** The capability bootstrap is **TWO parallel systems** that both register capabilities into `UnifiedCapabilityRegistry`:
1. **Hand-written builders** in `capability-bootstrap/default-caps.ts` (forge) — 50,109 lines, 12 builder functions, every capability explicitly registered.
2. **Generated from taxonomy pool** in `capability-bootstrap-generated.ts` — reads `seeds/taxonomy/pool.taxonomy.json` and auto-registers from the pool.

The hand-written one is in the forge only (not migrated). The generated one exists in vivim-next. The `default.ts` file in the re-export (`capability-bootstrap.ts` line 10) references `./capability-bootstrap/default.js` which doesn't exist in vivim-next. So **vivim-next is relying on the generated bootstrap only**.

---

## What the code does

### `capability-bootstrap.ts` (18 lines, vivim-next)

A **re-export shim** (line 5-8 comment: "This file is now a thin re-export so existing imports continue to work"). It re-exports:
- `registerDefaultCapabilities` from `./capability-bootstrap/default.js` — hand-written bulk registration.
- `registerDiscoveryCapabilities` from `./capability-bootstrap/discovery.js` — discovery-related caps.
- `registerKernelCapabilities` from `./capability-bootstrap/kernel.js` — kernel caps.
- `registerNlInterpretCapability` from `./capability-bootstrap/nl-interpret.js` — NL interpreter.
- `seedLocalAgentProvider` from `./capability-bootstrap/seed.js`.
- `BootstrapServices`, `makeCapability` from `./capability-bootstrap/types.js`.

**The sub-directory `capability-bootstrap/` does not exist in vivim-next.** It exists only in the forge. The re-exports will fail at runtime in vivim-next. The generated bootstrap (`capability-bootstrap-generated.ts`) is the actually-working path.

### `capability-bootstrap-generated.ts` (331 lines, vivim-next)

The auto-generated bulk registration. From the file header (line 1-8): "AUTO-GENERATED from taxonomy pool — do not edit manually. This file replaces the hand-written capability-bootstrap.ts by reading the unified taxonomy pool (`seeds/taxonomy/pool.taxonomy.json`) and registering every capability with its cross-surface bindings. The handler map at the bottom is the 'last mile' that connects generated specs to real backend service calls."

**The mechanism:**

1. **Load pool** (line 52-63): `loadPool()` reads `seeds/taxonomy/pool.taxonomy.json`, filters to `kind === 'capability'`, returns `TaxonomyPoolCapability[]`. If the file is missing, returns empty + logs warn.

2. **The pool entry shape** (line 23-44): `{ id, slug, label, description, category, capabilityKind, surfaces, inputSchema, outputSchema, cliCommand, apiEndpoint, mcpToolName, uiAction, workflowNodeType, isAsync, requiresConfirmation, ui_component, ui_position, ui_order, ui_group }`. **This is the manifest.** The pool is JSON, the generated file is the runtime.

3. **Handler map** (line 69-268): `createHandlerMap(registry, services)` builds a `Record<slug, handler>` from ~30 hand-written handler functions (lines 79-179+, conversation, knowledge, memory, etc.). `extraHandlers` Map (line 69) is an extension point — `extendHandlerMap(slug, handler)` lets new code add a handler. Handlers are closures over `services` (the `BootstrapServices` bag — see below).

4. **Fallback handler** (referenced at line 287): if a pool entry has no handler in the map, use a fallback. (Need to see the body to know what the fallback does — likely returns `{}`.)

5. **Register** (line 276-329): `registerGeneratedCapabilities(registry, services)` iterates the pool, builds a `UnifiedCapability` from each node, calls `makeCapability(partial, handler)`, registers. Try/catch silently swallows errors (line 318-325: "Some capabilities may have duplicate slugs from different sources. Skip silently in generated mode"). Skipped count is logged.

### `capability-bootstrap/default.ts` (forge, 57 lines)

The hand-written version. The orchestrator. It calls 12 builder functions in order:
- `buildStorageCaps(services)` — registered directly first.
- `buildAiGatewayCaps(services)` — registered directly second.
- Then 10 builder functions spread into one `defaults` array: `buildConversationCaps`, `buildKnowledgeCaps`, `buildMemoryCaps`, `buildAdminCaps`, `buildSystemCaps`, `buildProviderHealthCaps`, `buildTelemetryCaps`, `buildAgentCaps`, `buildOpenCodeServeCaps`, `buildOpenCodeModelSyncCaps`.

All registered in order. Plus `seedLocalAgentProvider` is called first if `localAgentStore && localAgentExecutor` are in `services`.

### `capability-bootstrap/types.ts` (forge, 62 lines)

- **`BootstrapServices` interface** (line 18-34): the bag of dependencies every handler closure captures. 16 fields: `db`, `conversationStore`, `governor`, `conversationManager`, `profileAllocator`, plus 11 optional ones (`memoryEngine?`, `semanticSearch?`, `knowledgeIngestion?`, `synthesizer?`, `localAgentStore?`, `localAgentExecutor?`, `opencodeModelSync?`, `opencodeClient?`, `opencodeIngest?`, `relocationEngine?`).

- **`ALL_SURFACES` const** (line 36): `['cli', 'ui', 'workflow', 'mcp', 'api']`.

- **`makeCapability(partial, handler)`** (line 38-56): the factory. Defaults `surfaces` to `ALL_SURFACES`, `isAsync: true`, `requiresConfirmation: false`, `tags: []`. The single function used by every builder.

### `capability-bootstrap/default-caps.ts` (forge, 50,109 lines)

The **monster file**. 50k lines. 12 builder functions, each one a long array of `makeCapability(...)` calls. This is the ground truth of what capabilities exist. (Not read in detail; the generated bootstrap reads from the pool JSON which is the compiled version of this.)

---

## Key observations

- **Two parallel bootstrap paths, only one works in vivim-next.** The hand-written re-export points to a non-existent directory. The generated file works. So the **taxonomy pool is the single source of truth for capabilities in vivim-next**; the hand-written code is dead.

- **The taxonomy pool is JSON. The `default-caps.ts` is TS that compiles to JSON.** The pool file is `seeds/taxonomy/pool.taxonomy.json`. It's a build artifact derived from the TS file (presumably by `bun run gen:taxonomy` or similar). The generated file reads it at runtime. The TS file is the source.

- **The handler map is the "last mile" between data and code.** Lines 79-179+ are hand-written handlers that call into `services`. The pool provides the *spec* (id, slug, schema, surfaces). The handler map provides the *behavior*. This split lets you add a new capability by adding one entry to the pool AND one handler to the map, without editing the registration loop.

- **`extendHandlerMap(slug, handler)` is the extension API for new capabilities.** Line 71-73. You can add a handler for a slug that doesn't have one in the built-in map. The registration loop (line 287) will pick it up. This is a **runtime extension point for adding a handler to a generated capability**.

- **The pool entries have `ui_component`, `ui_position`, `ui_order`, `ui_group`** (lines 40-43). The generated bootstrap builds a `ui` block from these (line 289-296). The UI is fully driven from the pool JSON. The pool is the source of truth for UI placement.

- **Duplicates are silently swallowed.** Line 321-325. If two pool entries have the same slug, the second one fails to register, the error is caught, and a `skipped` counter is incremented. The log says "skipped" not "error." This is forgiving but hides real problems.

- **`requiresConfirmation: false` is the default for ALL pool capabilities.** Line 53 of types.ts: `requiresConfirmation: partial.requiresConfirmation ?? false`. The pool can override this per-capability, but the default is no. Destructive operations must opt in.

- **`BootstrapServices` has 16 dependencies, 11 of them optional.** Line 18-34 of types.ts. This is a "kitchen-sink DI bag" pattern. The default-caps.ts builders test each one with `?.` and provide fallbacks. The optional ones allow the system to boot without all subsystems (e.g. boot without memory if the engine isn't loaded).

- **The order of registration matters.** Line 38-39 of default.ts: storage + AI gateway registered *first* (separately), then the rest in the `defaults` array. This matters because the router-bridge (Step 1.3) skips capabilities that already exist (line 561-568 of router-capability-bridge.ts). The order is: taxonomy pool → engine capabilities → router bridge covers anything not in the pool. This is the layering.

- **`seedLocalAgentProvider` is the only non-capability thing in the bootstrap.** Line 14 of capability-bootstrap.ts. It seeds a provider manifest (Step 1.6 system) so the local agent can be dispatched. So the capability bootstrap also drives provider registration, in one entry point.

- **`makeCapability` is the universal factory.** Every capability — hand-written, generated, or live (Step 1.7) — goes through this shape. The factory enforces a uniform contract: `isAsync: true`, default `surfaces`, default `tags`, default `requiresConfirmation`. This is the *conformance boundary* — to add a capability, you must fit this shape.

- **The generated file is `do not edit manually`.** Line 2 of capability-bootstrap-generated.ts. It's regenerated from the pool. The pool is regenerated from the TS. The TS is the canonical source. **Three layers, with the TS as ground truth.**

- **The pool is loaded at boot via `readFileSync`.** Line 54. No build step, no bundling. The JSON file is read from disk at boot. If the file is missing, the registry is empty + a warn log (line 59-62). This means capabilities are effectively optional — the system can run without them.

- **The "Unit 2.7" comment from Step 1.7** is part of the same unit system. The capability system, the live registry, the bootstrap are all unit-numbered. This is a development plan in code comments.

---

## Key questions raised

1. **Where is `seeds/taxonomy/pool.taxonomy.json` in vivim-next?** The generated file looks for it at `seeds/taxonomy/pool.taxonomy.json` relative to its own location. It doesn't exist (we confirmed `seeds/providers` is missing too). So the generated bootstrap is a no-op at runtime in vivim-next. The system boots with **zero capabilities**. Is that intentional for the rebuild?

2. **What generates `pool.taxonomy.json`?** A script in `bun run gen:taxonomy` or similar. Where is it? (Not in the bash output we have. Need to search.) The script must traverse `default-caps.ts` and emit the pool JSON.

3. **How are hand-written handlers in `default-caps.ts` reconciled with the handler map in `capability-bootstrap-generated.ts`?** The two systems are parallel. If both exist, the hand-written one is called twice? Or only one runs? The hand-written one references non-existent files in vivim-next. So the answer is: only the generated one runs in vivim-next. The hand-written code is forge-only.

4. **What is "capabilityKind" in the pool entry (line 29)?** Not a field in `UnifiedCapability`. It's metadata that the pool tracks but the generated code doesn't use. Maybe used by the generator to know what kind of capability to create. (E.g. `'command'`, `'http-proxy'`, `'composite'`.)

5. **What is the "fallback handler" at line 287?** `createFallbackHandler(slug)`. What does it do? (Not read in the partial.) Probably returns an empty success. Need to confirm.

6. **How is `requiresConfirmation` enforced at runtime?** The capability has a flag. The registry has `exportForUi` which includes `requiresConfirmation` (line 203 of unified-registry.ts). So the UI checks the flag. But who checks it on the CLI/MCP side? The CLI just runs.

7. **What's the difference between `ui` and `uiAction` (lines 30-39 of unified-registry.ts)?** Both UI bindings. `ui` is the rich one (component, position, group, order, icon, shortcut, requiresConfirmation). `uiAction` is a lightweight one (component, position, order). When both are unset, validation fails (line 68-70). When `ui` is set, `exportForUi` uses it. When only `uiAction` is set, it must be in `UnifiedCapability.uiAction` (line 39). Live capabilities get `uiAction` (line 153-155 of live-capability-registry.ts). Engine capabilities get `ui`.

8. **What is the `discovery` module?** `capability-bootstrap/discovery.ts` is re-exported. The `discover-protocol` CLI command exists. Discovery is the act of finding new providers / capabilities. The bootstrap wires the discovery capabilities into the registry. (11k lines; not read in detail.)

9. **The bootstrap registers in the order: storage → ai-gateway → conversation → knowledge → memory → admin → system → provider-health → telemetry → agent → opencode-serve → opencode-model-sync.** Storage first, AI gateway second, then everything else. This is the boot order. The router-bridge adds the rest.

10. **What about `nl-interpret`?** Re-exported. NLCL patterns bind to capabilities via `capabilityId` (AGENTS.md: "Add NL patterns to `src/engines/nlcl/catalog.ts` linking to your capabilityId"). So the bootstrap registers capabilities, the NLCL catalog is a separate file. Not the bootstrap's job.

---

## Cross-references

- **Step 1.7 (capability system)** — `UnifiedCapabilityRegistry.register()` is what this bootstrap calls. `makeCapability` is the factory. `BootstrapServices` is the DI bag.
- **Step 1.3 (router-capability-bridge)** — covers the HTTP endpoints that are NOT in the pool. Run after `registerDefaultCapabilities` / `registerGeneratedCapabilities`. The skip-on-duplicate (line 561-568) is the precedence: pool first, bridge second.
- **`seeds/taxonomy/pool.taxonomy.json`** — the JSON source. Not in vivim-next. In the forge (presumably; need to find it).
- **`bun run gen:taxonomy`** (or similar) — the generator. Not found yet.
- **`capability-bootstrap/default-caps.ts`** (forge) — 50,109 lines. The hand-written source for the pool.
- **`capability-bootstrap/discovery.ts`** (forge) — 11,042 lines. The discovery caps.
- **`capability-bootstrap/kernel.ts`** (forge) — 6,549 lines. The kernel caps.
- **`capability-bootstrap/seed.ts`** (forge) — 1,565 lines. Seeds the local-agent provider.
- **`capability-bootstrap/nl-interpret.ts`** (forge) — 2,175 lines. The NL interpreter cap.
- **`kernel/capability/live-capability-registry.ts`** — runtime extension. Sits ON TOP of this bootstrap, not parallel to it. `loadFromDb()` is called at boot after the bootstrap.
- **`kernel/capability/capability-bootstrap/types.ts:38` `makeCapability`** — the universal factory.
