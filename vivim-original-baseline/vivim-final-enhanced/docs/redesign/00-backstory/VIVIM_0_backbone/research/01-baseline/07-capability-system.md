# Step 1.7: Capability System — The "Command Palette" Equivalent

**Date:** 2026-08-28
**Read:**
- `kernel/capability/unified-registry.ts` (231 lines)
- `kernel/capability/live-capability-registry.ts` (241 lines)
- `kernel/capability/capability.ts` (100 lines, partial)
- **Status:** READ + ANALYZED

**Critical finding:** The capability system has TWO layers:
1. **`UnifiedCapabilityRegistry`** — engine-time registration. Capabilities are declared in TypeScript and registered at boot. Closed system unless you edit the codebase.
2. **`LiveCapabilityRegistry`** — runtime registration. Capabilities are declared as JSON specs at runtime, persisted, and live-reloaded. **This IS the extension model.** A user (or a plugin) provides a `LiveCapabilitySpec` with `slug`, `name`, `description`, `inputSchema`, `surfaces`, and a `handlerSpec` of kind `'mcp' | 'http' | 'inline'` — and it gets registered as a first-class capability with all cross-surface parity (CLI, UI, workflow, MCP, API).

---

## What the code does

### `UnifiedCapabilityRegistry` (unified-registry.ts)

The system that ALL capability-driven surfaces consume. From the file header (line 1-3): "UnifiedCapabilityRegistry — single registry where every capability is defined once and automatically exported to CLI, UI, workflow, MCP, and API surfaces."

**`UnifiedCapability` interface** (lines 19-48):
- `id`, `slug`, `name`, `description`, `category` — identity
- `surfaces: ('cli' | 'ui' | 'workflow' | 'mcp' | 'api')[]` — which surfaces this capability exposes to
- `inputSchema: Record<string, unknown>` — JSON schema for input
- `outputSchema: Record<string, unknown>` — JSON schema for output
- `handler: (input, ctx) => Promise<unknown>` — the executor
- `cliCommand?: { name, aliases, examples }` — required if `surfaces` includes `'cli'` (line 59-61)
- `ui?: { component, position, group?, order, icon?, shortcut?, requiresConfirmation? }` — required (or `uiAction`) if surfaces includes `'ui'` (line 68-70)
- `uiAction?: { component, position, order }` — alternative lighter UI binding
- `workflowNodeType?: string` — if surfaces includes `'workflow'`, this is the workflow node type
- `mcpToolName?: string` — required if surfaces includes `'mcp'` (line 62-64)
- `apiEndpoint?: { method, path }` — required if surfaces includes `'api'` (line 65-67)
- `isAsync: boolean`, `requiresConfirmation: boolean`, `tags: string[]`
- `isComposite?`, `compositeId?` — composite capabilities (multi-step)

**`UnifiedCapabilityRegistry` class** (lines 75-216):
- Internal: `capabilities: Map<id, UnifiedCapability>`, `slugIndex: Map<slug, UnifiedCapability>`, optional `progResolver` for harness programs.
- `setProgramResolver(fn)` (line 81) — install a runtime resolver for `prog-*` slugs (multi-step harness programs).
- `register(cap)` (line 85) — strict: throws if id or slug already exists. Validates the capability (line 86).
- `registerOrReplace(cap)` (line 105) — lenient: replaces existing by slug. The deliberate override path for engine-owned capabilities that shadow a taxonomy stub. Newest wins.
- `unregister(id)`, `get(id)`, `getBySlug(slug)`, `getBySlugAsync(slug)` (uses prog resolver).
- `list(filter?: { surface?, category?, tag? })` — filtered enumeration.
- `execute(id, input, ctx)` (line 152) — validates required inputs, calls `handler(input, ctx)`.
- **`exportForCli()`** (line 171), **`exportForMcp()`** (line 185), **`exportForUi()`** (line 197) — surface-specific exports. Each one filters by surface and projects the relevant fields. This is the cross-surface parity mechanism.

**`parseProgSlug(slug)`** (line 222) — parses `prog-<capabilitySlug>-<providerId>` back to parts. Harness programs have a namespacing convention.

### `LiveCapabilityRegistry` (live-capability-registry.ts)

**THIS IS THE EXTENSION MODEL.** From the file header (line 1-5): "LiveCapabilityRegistry — runtime capability registration (Unit 2.7). Capabilities can be defined mid-conversation from a JSON spec, persisted to a `live_capability` store, and hot-reloaded via CapabilityEventBus. **The registry is no longer closed at runtime.**"

Three handler kinds (line 21): `'mcp' | 'http' | 'inline'`.

**`LiveHandlerSpec`** (lines 23-32):
- `kind: 'mcp'` → `serverId`, `toolName`, `url` (connect URL)
- `kind: 'http'` → `url`, `method`, `headers`, `bodyTemplate` (mustache over input)
- `kind: 'inline'` → `code` (runs in `SandboxRunner`)

**`LiveCapabilitySpec`** (lines 34-42):
- `slug`, `name`, `description`, `handlerSpec`, `inputSchema`, `surfaces`, `registeredBy`

**`LiveCapabilityRecord`** (lines 44-49) — extends the spec with `id`, `version`, `isActive`, `registeredAt`.

**`LiveCapabilityStore`** (lines 51-56) — the persistence contract: `create`, `listActive`, `get`, `revoke`. Implementations decide storage (Prisma, file, etc.).

**`LiveCapabilityRegistry` class** (line 69-237) — extends `UnifiedCapabilityRegistry`:
- Constructor takes a `LiveCapabilityStore`, a `CapabilityEventBus`, optional `SandboxRunner`, `McpClientAdapter`, `TelemetryAudit`. It owns a sandbox by default.
- **`registerLive(spec)`** (line 88) — the key method. Validates → wraps into `UnifiedCapability` (id: `live:<id>`, category: `'live'`, surfaces determine CLI/UI/workflow/MCP/API bindings, tags: `['live']`) → calls `super.register()` → persists to `liveStore` → emits `live_capability:registered` event.
- **`loadFromDb()`** (line 110) — at startup, loads all active live caps from the store and re-registers them. **No data loss across restarts.**
- **`revokeLive(id)`** (line 116) — unregisters from the in-memory registry AND revokes the persistent record. If the handler is an MCP one, disconnects the MCP server.
- **`specToUnifiedCapability(spec, id)`** (line 138) — the conversion. Sets `cliCommand`, `uiAction`, `workflowNodeType`, `mcpToolName`, `apiEndpoint` based on which surfaces are requested. This is how a JSON spec becomes a first-class capability with cross-surface parity.
- **`buildHandler(spec)`** (line 177) — dispatches by `handlerSpec.kind`:
  - `inline` → `sandbox.run(code, input, permissions, { handlerSlug })`. If `!res.ok`, throws. The sandbox permissions default to `{ canFetch: [], canReadFile: [], canWriteFile: [], canUseClipboard: true }` (line 168-175).
  - `http` → `audit?.fetch(url, init)` if audit is configured, else `globalThis.fetch(url, init)`. `bodyTemplate` is mustache-rendered (line 239).
  - `mcp` → lazy connect, then call via `tool-orchestrator-facade.js` (4-stage pipeline, line 223-224). Tool-level errors (isError) are surfaced as capability errors.

**`renderTemplate(tpl, data)`** (line 239) — `{{key}}` mustache replacement.

### `CapabilityEngine` (capability.ts)

A different layer — this is the **runtime executor for capability bindings** (CDP-based browser execution for chat providers). NOT the registry layer. It takes a `capabilitySlug` + `providerId` + `accountId`, looks up the binding in `CapabilityStore`, gets the selectors, and runs them via `ChromeGovernor`. It has a 5-strategy default recovery chain (line 55-61): `retry_selector` → `retry_with_fallback` → `navigate_home` → `restart_chrome` → `mark_broken`. This is the provider-side capability execution.

The two systems (`UnifiedCapabilityRegistry` / `LiveCapabilityRegistry` vs `CapabilityEngine`) are **different concerns**:
- Registry: what capabilities exist + how are they dispatched.
- Engine: how a chat-provider capability is executed (with selectors, browser, recovery).

---

## Key observations

- **The extension model already exists.** `LiveCapabilityRegistry` is a *working* user-extension mechanism. A user (or an agent) can:
  1. Define a `LiveCapabilitySpec` (slug, name, description, schema, surfaces, handlerSpec).
  2. Call `registerLive(spec)`.
  3. The capability is now reachable from CLI / UI / workflow / MCP / API with full parity.
  4. It's persisted in `LiveCapabilityStore`. Survives restart.
  5. It can be revoked with `revokeLive(id)`.
  
  The "extension model" the user asked for is largely already here, in this one file (241 lines).

- **Three handler kinds cover the realistic extension space:**
  - `inline` (sandboxed JS) — for local logic. Sandboxed via `SandboxRunner`.
  - `http` (a URL) — for "this just calls my API". With mustache templating for the body.
  - `mcp` (an MCP server) — for "this is a tool my MCP server exposes". Routes through the orchestrator.

- **`SandboxRunner` is the security boundary for inline handlers.** Line 82: `this.sandbox = sandbox ?? new SandboxRunner(memoryAuditStore)`. The `permissionsFor()` method (line 168) defaults to *zero* network/file permissions — only clipboard. This is a permissioned sandbox. **But** the default `memoryAuditStore` is a no-op (line 60-65), so sandbox audit is not persisted in-memory. A real deployment injects `SandboxAuditStore`. This is the "in-memory vs persistent" gap.

- **The cross-surface parity is automatic.** A `LiveCapabilitySpec` with `surfaces: ['cli', 'mcp', 'api']` gets `cliCommand`, `mcpToolName`, `apiEndpoint` auto-generated (lines 150-160). The user just lists surfaces. This is the cleanest extensibility model in the codebase.

- **Live capabilities are tagged.** Line 163: `tags: ['live']`. So `registry.list({ tag: 'live' })` finds them. This is discoverable.

- **`apiEndpoint` is auto-generated as `/api/live/<slug>`.** Line 159. So a live capability is auto-exposed as a POST endpoint. The thin client at the CLI/UI/MCP layer can hit it through the standard capability dispatch.

- **Validation is strict in `UnifiedCapabilityRegistry.register` and lenient in `registerOrReplace`.** Lines 85 vs 105. The strict one throws on duplicate id/slug. The lenient one is "the newest wins." The latter is the override path. **There is no equivalent override path for `LiveCapabilityRegistry` — it calls `super.register()` (line 91), which is strict.** If a live cap is registered with a slug that already exists in a different registry, it throws. (Or does it? `super` here is `UnifiedCapabilityRegistry`, but the `this.register(cap)` is on the live instance which extends unified. So if the live registry has a slug collision with itself, `super.register` throws. With a previously-registered engine cap, it also throws.)

- **Engine capabilities can override live ones via `registerOrReplace`.** The live registry uses `super.register()` which is strict; engine capabilities can use `registerOrReplace` to win the slug. So the precedence is: **engine > live** if there's a conflict. This is a deliberate "the engine is canonical" policy.

- **Live caps get category `'live'`.** Line 145. Not user-settable. (The spec doesn't expose a `category` field.) So all live caps share one category.

- **`requiresConfirmation: false` by default for live.** Line 162. The system does NOT prompt before running a live cap. This is a security gap — a user (or a compromised agent) can register a destructive live cap and it'll run on first invocation. The confirmation flag exists for engine capabilities (line 38, 69-70) but is hardcoded off for live ones.

- **`handler` parameter `ctx: CapabilityContext`** has `conversationId?`, `providerId?`, `slaveId?`, `userId?`, `metadata`. The live handler only uses `input` (line 181, 190, 207) — it ignores `ctx` entirely. The MCP handler routes through the orchestrator which is where context flows.

- **The `memoryAuditStore` is a placeholder.** Line 60-65 is a no-op. The comment says "A real deployment injects a durable SandboxAuditStore." This is an in-memory-only dev story; not production-ready.

- **`CapabilityEngine` is a SEPARATE registry's consumer.** `UnifiedCapabilityRegistry` is in the kernel and is purely declarative. `CapabilityEngine` is the executor that runs chat-provider capabilities via ChromeGovernor. They share the concept of "capability" but they are different systems. The live registry extends the declarative one; it does not extend the executor.

- **The unit numbering "Unit 2.7", "Unit 2.9", "Unit 2.10"** in the comments suggests there's a unit/skill plan somewhere. The live registry is a specific unit, not the whole "extension model."

- **The harness program is referenced (`prog-*` slugs).** This is the "agentic harness" — a multi-step program that runs capabilities in sequence. It uses `setProgramResolver` (line 81) to lazily resolve `prog-<cap>-<provider>` slugs. This is the closest thing to a "user-configurable program" in the runtime.

---

## Key questions raised

1. **Is the `LiveCapabilityRegistry` actually used today?** The unit comment "Unit 2.7" suggests it was built incrementally. Are there real live capabilities registered? (Test code in `tests/` would tell us.) If yes, the extension model is already working. If no, the design is in place but unproven.

2. **What is `LiveCapabilityStore` actually backed by?** The interface has `create`, `listActive`, `get`, `revoke`. Is there a Prisma implementation? An in-memory test stub? Or is it just an interface waiting for an impl?

3. **What's the `registeredBy` field used for?** Line 41 of the spec. The system tracks who registered each live cap. Is it user id, agent id, plugin id? Where is it displayed?

4. **How is `requiresConfirmation` enforced for live caps?** It's hardcoded to `false` (line 162). The system has a confirmation mechanism (line 38, 69-70 of the engine capability validation). But the live registry doesn't use it. **This is a security gap.**

5. **What's the relationship between `SurfaceSpec` (reprogrammability) and `UnifiedCapability`?** Both are declarative contracts. A `ReprogrammableSurface` represents a visible element; a `UnifiedCapability` represents an operation. They are siblings, both rooted in zod schemas. Can a plugin register a `LiveCapability` that returns a `SurfaceSpec`? Not in the current design; the live cap returns `unknown` (line 28). The two systems don't directly compose.

6. **What's the `tool-orchestrator-facade.js`?** The MCP live handler dynamically imports it (line 223). The comment says "4-stage pipeline." This is presumably the tool-use orchestration layer. It's a black box from this file's perspective.

7. **What happens when a live cap with `kind: 'inline'` raises a runtime error in the sandbox?** `if (!res.ok) throw new EngineError(...)` (line 186). But the engine's `execute()` (line 152-169) doesn't have a try/catch. The error propagates to the caller. Is that the intended UX?

8. **Is the live registry also exposed as a `Capability` surface?** `exportForCli` etc. would include live caps. But who calls these? The CLI / UI / MCP / API surface adapters. The bootstrap is somewhere — the user-facing entry points are wired into the server / shell.

9. **`bodyTemplate` mustache is single-pass.** Line 240. No nested keys (`{{a.b}}`), no conditionals, no loops. Just `{{key}}` → value. Simple, but limiting.

10. **The `audit.fetch.bind(this.audit)` fallback to `globalThis.fetch`** (line 197) means the audit is a "consent-gated fetch" if configured, but if no audit is injected, it's the global fetch. So inline/http live caps have NO consent enforcement unless the audit is injected. Another security gap if audit isn't wired.

---

## Cross-references

- **Step 1.1 (plugin-system.ts)** — the `ProviderPlugin.capabilities` field emits `plugin:capabilities-registered` events. But the live registry is a separate system; plugins don't automatically register live caps. A plugin could *call* `registerLive` if it had a reference to the registry, but there's no wiring shown.
- **Step 1.6 (provider plugins)** — providers bind to `global_capability_id` in the DB. The live registry is a runtime-registration system. They don't compose directly. A live cap is not provider-bound by default; it just exists.
- **Step 1.11 (security/sandbox)** — `SandboxRunner` is the inline handler runtime. The permissions default is conservative. Will read in Step 1.11.
- **`kernel/capability/capability-bootstrap.ts`** + **`capability-bootstrap-generated.ts`** — the boot-time bulk registration. Will read in Step 1.8.
- **`kernel/capability/live-capture-engine.ts`** — the engine that *captures* live caps (probably from agent output). Not read yet.
- **`kernel/capability/capability-event-bus.ts`** + **`capability-event-bus-v2.ts`** — the event bus. Live registry emits `live_capability:registered` and `live_capability:revoked`.
- **`kernel/capability/mcp-client-adapter.ts`** — the MCP client. Live MCP handler uses it.
- **`kernel/capability/sandbox-runner.ts`** — the sandbox. Live inline handler uses it.
- **`kernel/capability/capability.ts`** — the executor (separate from registry). Uses `CapabilityStore`, `ChromeGovernor`, recovery strategies.
- **`kernel/capability/capability-taxonomy.ts`** — the category system. Probably the source of categories used in `UnifiedCapability.category`.
- **`kernel/capability/capability-resolution.ts`** — slug → capability resolution. The dispatch path.
- **`kernel/capability/capability-discovery-loop.ts`** — auto-discovery. The system that finds capabilities and wires them up.
