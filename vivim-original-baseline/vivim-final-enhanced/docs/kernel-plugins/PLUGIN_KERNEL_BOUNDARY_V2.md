# Vivim Plugin Kernel — Complete Boundary Design (v2)

Supersedes the framing in `PLUGIN_KERNEL_BOUNDARY.md` (kept for history). That
pass under-estimated how much of this already exists. This pass goes deeper
into five specific extensibility axes the target architecture requires:

1. Plugins can **add/change schema models**
2. Plugins can **add core features**
3. Plugins can **add harness capabilities**
4. Plugins can **wire in external services**
5. Plugins can **customize the frontend UI**

For each axis: what's already in the repo (grounded in real files), what's
missing to make it a true plugin contribution point, and the concrete
interface. Then one unified manifest, a kernel package layout, and a
sequenced migration.

---

## 0. The headline finding

Vivim already built **five separate, mature extensibility mechanisms** —
one per axis below — independently, at different times, by different
passes. Each is genuinely good in isolation. None of them share a manifest,
an activation lifecycle, a permission model, or a registry. The design work
is unification, not invention:

| Axis | Existing mechanism | File(s) |
|---|---|---|
| Schema | Universal Node layer + `NodeSchemaRegistry` | `src/schema/node.ts`, `node-data.ts` |
| Core features | `ModuleRegistry` (topo-sort DI) | `src/server/module-registry.ts` |
| Harness | Versioned command registry + DAG compiler | `src/engines/harness-command-registry.ts`, `src/engines/harness/*` |
| External services | Manifest → DB → generated protocol pipeline | `src/schema/provider-manifest.ts`, `provider-registrar.ts`, `seeds/providers/*` |
| Frontend UI | DB-stored hot-swappable components, 4-tier scope resolution | `shared/ui-component.ts`, `shared/ui-slots.ts`, `frontend/src/registry/index.ts` |
| Packaging (cross-cutting) | `.vivim-plugin` tar.gz install lifecycle + NL plugin builder | `src/server/plugin-router.ts`, `plugin-builder-router.ts` |

That last row matters most: **the packaging/install/lifecycle layer already
exists and is axis-agnostic** (`plugin-router.ts` installs a tar.gz,
verifies it, "seeds components"). It just doesn't yet know how to seed
anything but UI components. That router is the natural home for the kernel's
`PluginHost`.

---

## 1. Schema extensibility

**What exists:** `src/schema/node.ts` defines `Node` as a universal
container — every domain object (message, conversation, task, memory,
bookmark...) is a row with a fixed envelope (`id`, `parentId`, `type`,
`state`, `acl`, `quality`, timestamps) plus a `data: unknown` payload whose
shape is declared per `NodeType` via a Zod schema (`node-data.ts` has
~10 of these: `MemoryData`, `NotebookData`, etc.) and presumably a
`NodeSchemaRegistry` that maps `NodeType → ZodSchema` for validation.

Separately, `prisma/system/schema.prisma` shows the **JSON-escape-hatch
pattern** already in production use: `ProviderDefinition.capabilitiesJson`,
`.modelsJson`, `.fleetConfigJson` — structured data that doesn't get a
first-class relational column, it gets a JSON blob validated at the
application layer instead of the DB layer. `ProviderDefinition` even already
has a `pluginId` column — someone anticipated plugin-owned providers.

**The gap:** Prisma schemas are compiled ahead-of-time
(`prisma generate` → `src/generated/{system,user}-client`). A plugin cannot
add a genuinely new *relational table* without a build step and a migration
file landing in-tree. That's真 true of any Prisma-based system — don't fight
it, route around it.

**Design: two tiers of schema extensibility, not one.**

- **Tier A — Node types (the 95% case).** A plugin registers a new
  `NodeType` string + Zod schema through the kernel's `SchemaRegistry`.
  Storage is free — it's a row in the existing generic `Node` table, `data`
  column holds the JSON, validated against the plugin's schema at
  read/write time. No migration, no restart-to-codegen. This is exactly
  what `node.ts`/`node-data.ts` already do for built-in types; the only
  change needed is moving `NodeSchemaRegistry.register()` from a hardcoded
  module-load list to something plugins call from `activate()`.

  ```ts
  // kernel/schema-registry.ts
  interface SchemaContribution {
    nodeType: string                 // e.g. "plugin:acme.invoice"
    schema: z.ZodType
    indexedFields?: string[]         // optional: which data.* keys get a
                                      // generated index row for query perf
  }
  ```

- **Tier B — First-class relational tables (rare, perf-critical only).**
  For the small number of cases where a plugin genuinely needs its own
  indexed, joinable table (e.g. a CRM plugin with millions of contact
  rows), the plugin ships a `schema.prisma` *fragment* under its own
  namespace (`plugin_<id>_*` table prefix, enforced by the loader). The
  kernel's build step merges fragments into a generated composite schema
  and runs migrations in a `plugin_ext` schema/datasource, **never** the
  `system` or `user` datasource. This requires a build-time step (can't be
  fully dynamic at runtime — be honest about that with users), but it keeps
  plugin tables physically isolated so a bad migration can't corrupt core
  data. Recommend gating this behind a `schema:extend` permission that's
  rarely granted.

Practical guidance: push everything through Tier A first. Only promote to
Tier B when a plugin proves it needs indexed relational queries the generic
Node table can't serve — the existing `capabilitiesJson`-style columns show
the team already prefers this over premature normalization.

---

## 2. Core-feature extensibility

**What exists:** `src/server/module-registry.ts` — a genuinely solid
declarative DI container: `ModuleDefinition { name, tags, dependsOn, create,
lifecycle: {init,start,stop} }`, Kahn's-algorithm topo sort, circular-dep
detection. It explicitly says in its own header comment that it's
*"infrastructure for future migration"* away from the hand-wired
`bootstrap-engines.ts`. That migration is exactly this project.

**The gap:** `ModuleRegistry.define()` is only ever called from in-tree
bootstrap code. There's no `activationEvents`-style lazy activation (VS
Code's key trick for not loading 200 extensions eagerly), and no permission
gate on what a module's `create()` factory can reach (today, `create(deps)`
gets the *entire* `ModuleDependencies` bag — full ambient access).

**Design:**

```ts
interface FeatureContribution {
  name: string                       // becomes the ModuleRegistry module name
  tags: string[]
  dependsOn?: string[]                // may reference kernel modules or other
                                       // plugins' contributed modules by name
  activationEvents: ActivationEvent[] // 'onStartup' | 'onCommand:x' |
                                       // 'onProvider:x' | 'onSchema:nodeType'
  create: (ctx: PluginContext) => unknown | Promise<unknown>
  lifecycle?: { init?; start?; stop? }
}
```

`PluginContext` (not raw `ModuleDependencies`) is the enforcement point: it
exposes only what the plugin's manifest declared permissions for —
`ctx.storage.scoped(pluginId)`, `ctx.events.on(...)`, `ctx.schema.register(...)`
— never the full service container. This is the single biggest behavioral
change from today's code: **`create()` currently gets ambient access to
everything; the kernel must intermediate it.**

Lazy activation matters here specifically because `src/engines/*` is
150+ files — eagerly instantiating all of them as "core plugins" on every
boot would be a regression versus today's already-eager bootstrap unless
`activationEvents` actually defers construction until first use.

---

## 3. Harness-capability extensibility

**What exists — this is the most mature axis already.**
`src/engines/harness-command-registry.ts` resolves `commandId@version` (with
proper semver ordering, not lexicographic — the file's own comment flags
this as a previously-fixed defect) to a stored `HarnessCommand`, validates
params against a stored JSON-schema, and compiles it into a `HarnessDAG`
node. `src/engines/harness/` has a `recipe-compiler.ts` +
`recipe-types.ts` + `capability-program-registrar.ts` — i.e. there's already
a full pipeline: **register a capability → compile to a DAG → execute
through `HarnessRuntime` → repair on failure via `harness-repair-engine.ts`
→ checkpoint via `harness-checkpoint.ts`.**

**The gap:** registration currently happens through
`capability-program-registrar.ts` against the system DB directly — there's
no notion of "this command came from plugin X," no per-plugin namespacing of
`commandId`, and no permission check before a harness command is allowed to
drive the browser/CDP layer (which is a real capability — `chrome:control`
— not something to hand out by default).

**Design:**

```ts
interface HarnessContribution {
  commands: Array<{
    commandId: string                 // namespaced: "acme.invoice.extract"
    version: string                   // semver
    paramSchema: JsonSchema
    recipe: HarnessRecipe             // reuse recipe-types.ts as-is
  }>
  repairStrategies?: RepairStrategyContribution[]  // plug into
                                                     // harness-repair-engine
}
```

Namespacing rule: kernel prefixes every plugin-contributed `commandId` with
`${pluginId}.` at registration time (not trusting the plugin to do it),
exactly the way npm scopes packages — prevents a plugin silently shadowing
a core command like `send` or `search`.

Permission: `chrome:control` (or a narrower `chrome:control:read-only` for
observation-only recipes) required in the manifest before
`harness-command-registry` will register anything from that plugin. This is
the sharpest edge of the whole system — a malicious or buggy harness recipe
can drive a real logged-in browser session — so it's the one place I'd
recommend a runtime confirmation prompt on first activation, not just a
manifest declaration.

---

## 4. External-service wiring

**What exists:** Two parallel-but-compatible mechanisms:

- **Browser-driven providers** (chat UIs like Claude.ai, ChatGPT web):
  `seeds/providers/*.json` + `seeds/adapters/*.ts` → validated by
  `schema/provider-manifest.ts` (Zod) → `provider-registrar.ts` seeds them
  into `ProviderDefinition`/`ProviderEndpoint`/`ProviderParser`/etc tables →
  `provider-protocol-generator.ts` reads the DB back out into a generated
  static file (`src/__generated__/provider-protocol.ts`) for fast runtime
  access. This is a legitimate "declare once, compile to fast artifact"
  pattern.
- **API-driven providers** (direct API access): `src/ai/protocol/*` —
  `openai-compatible/adapter.ts` (+ `auth.ts`, `request-builder.ts`,
  `stream-parser.ts`, `error-mapper.ts`, `manifest.ts`) is a full adapter
  kit for anything OpenAI-compatible, plus `opencode-adapter.ts` and
  `simulator-adapter.ts` for others. `src/ai/gateway/vivim-ai-gateway.ts`
  fronts all of them.
- **Tool/MCP-driven services:** `src/mcp/server.ts` (a scaffold MCP server
  exposing `tool(name, description, schema, handler)`) and
  `src/engines/mcp-client-adapter.ts` / `mcp-server-adapter.ts` for
  consuming or exposing MCP.

**The gap:** all three pipelines assume the manifest/adapter ships **in the
repo**. `provider-registrar.ts` reads from an in-tree
`seeds/providers/manifests.ts` import — there's no runtime path for "load
this provider manifest from an installed plugin directory." The
regeneration step (`provider-protocol-generator.ts` writing a static file)
also assumes a rebuild, which won't work for a plugin installed after the
app is running.

**Design:** unify the three into one `ExternalServiceContribution`, and
change `provider-protocol-generator.ts`'s output from "static file, needs
rebuild" to "in-memory generated cache, rebuilt on plugin
install/uninstall" (it can still *also* flush to disk as a startup-time
cache — just not require a rebuild):

```ts
interface ExternalServiceContribution {
  kind: 'browser-provider' | 'api-protocol' | 'mcp-server' | 'mcp-client'
  manifest: ProviderManifest | OpenAiCompatibleManifest | McpServerManifest
  // browser-provider: reuses schema/provider-manifest.ts as-is
  // api-protocol: reuses ai/protocol/openai-compatible/manifest.ts as-is
  // mcp-*: new, small — MCP already has its own manifest concept upstream
}
```

Permission: `network` always required; `chrome:control` additionally
required for `browser-provider` (it drives a real browser session same as
harness commands above — the two should probably share one
`chrome:control` grant, not ask twice).

---

## 5. Frontend UI customization

**What exists — also more mature than a first pass suggests.**
`shared/ui-component.ts`: a `UiComponent` is a **DB row** holding
hot-swappable HTML/CSS/JS for one `(primitive, owner, variant)` triple, with
a 4-tier resolution order documented right in the file:
*provider-unique > family-variant > family-global > cross-type > system*.
It already has `ComponentConstraints` (resize safety),
`ComponentContract` (typed `inputs`/`outputs`/`subscriptions` — literally
designed "for plugin generation" per its own comment), and
`ComponentArchetype` (list/form/display/overlay/card/grid).
`shared/ui-slots.ts` adds a separate but compatible slot-claim model
(`UiSlotClaim { component, sandbox }`) resolved *global < plan < provider*.
`frontend/src/registry/index.ts` (`CapabilityRegistry`) is the runtime
lookup: bespoke React component if registered, else a generic
contract-driven renderer.

The existing `frontend/plugins/sample-plugin/manifest.json` already
demonstrates the intended shape: a plugin can contribute a
`canvas-definition` *and* a `ui-component-registry` entry bound to a named
slot (`chat.send`) in one manifest.

**The gap:** two slightly different resolution models
(`UiComponent`'s 5-tier scope vs. `UiSlotClaim`'s 3-tier scope) that appear
to have evolved separately and should be reconciled into one. Also, the
sandbox execution story for plugin-authored JS in `UiComponent` rows isn't
visible from the file headers alone — needs verification that it actually
runs through `sandbox-runner-quickjs.ts`/`-vm.ts` and not `eval` in the
frontend process directly (this is the single highest-value thing to audit
before shipping third-party UI plugins — untrusted JS rendered client-side
is the classic XSS vector).

**Design:** keep `UiComponent` as the storage/resolution model (it's
strictly more expressive), fold `UiSlotClaim` into it as a *simplified
authoring surface* — a plugin manifest declares slot claims in the terse
`UiSlotClaim` shape, the kernel expands them into full `UiComponent` rows at
install time. One audit item to resolve before this axis is "done":
confirm/enforce that `UiComponent.js` execution for non-system-authored
components is sandboxed, and add that as an explicit permission
(`ui:custom-js` vs. a lower-trust `ui:custom-html-css-only` tier for
plugins that only need styling/layout, not behavior).

```ts
interface UiContribution {
  slots: Array<{
    slotId: string                   // e.g. "chat.send", "sidebar.panel"
    scope: 'system' | 'cross-type' | 'family' | 'provider'
    ownerId?: string                 // required for family/provider scope
    component: { html?: string; css?: string; js?: string }
    contract?: ComponentContract     // reuse ui-component.ts as-is
    constraints?: ComponentConstraints
  }>
}
```

---

## 6. The unified manifest

All five axes converge into one `contributes` object per plugin — this
generalizes the sketch from v1 with what's now grounded in real code:

```ts
interface PluginManifest {
  id: string                          // reverse-DNS style: "acme.invoicer"
  version: string                     // semver
  activationEvents: ActivationEvent[]
  permissions: PluginPermission[]     // 'network' | 'chrome:control' |
                                       // 'chrome:control:read-only' |
                                       // 'storage:scoped' | 'schema:extend' |
                                       // 'ui:custom-js' | 'ui:custom-html-css-only'
  contributes: {
    schema?: SchemaContribution[]
    features?: FeatureContribution[]
    harness?: HarnessContribution
    services?: ExternalServiceContribution[]
    ui?: UiContribution
  }
}
```

Packaging stays exactly what `plugin-router.ts` already does — `.vivim-plugin`
tar.gz, sha256-verified, extracted, manifest validated — that file just needs
to call into five registration paths instead of one ("seed components" only,
today). The NL plugin builder (`plugin-builder-router.ts` /
`reprogrammability/plugin-builder.ts`) is a nice-to-keep authoring
accelerator on top, not something to change structurally — worth checking
later whether its output already spans more than the UI axis or needs
extending to emit the other four contribution types too.

---

## 7. Kernel package layout (concrete)

```
src/kernel/
  manifest.ts              # PluginManifest zod schema (unifies §6)
  plugin-context.ts         # PluginContext — the permission-gated capability
                             # object passed to every create()/activate()
  registries/
    schema-registry.ts      # wraps NodeSchemaRegistry (§1 Tier A)
    feature-registry.ts     # wraps ModuleRegistry (§2)
    harness-registry.ts     # wraps harness-command-registry (§3)
    service-registry.ts     # wraps provider-registrar + ai/protocol + mcp (§4)
    ui-registry.ts          # wraps UiComponent + CapabilityRegistry (§5)
  host.ts                   # PluginHost: install/activate/deactivate lifecycle,
                             # delegates storage to plugin-router.ts's existing
                             # tar.gz extraction + hash verification
  permissions.ts            # permission grant/check, one runtime prompt path
                             # for chrome:control (see §3)
  events.ts                 # canonical event bus — pick ONE of
                             # capability-event-bus.ts / -v2.ts, deprecate other
```

Every registry file in `registries/` is intentionally a thin wrapper, not a
rewrite — each delegates to the mature mechanism already documented in §1–5.
The kernel's job is the *permission-gated entry point* and the *unified
manifest*, not reimplementing five working subsystems.

---

## 8. Sequenced migration

1. **`events.ts`** — merge `capability-event-bus.ts` and `-v2.ts` first;
   every other registry will emit through this, so forking it forward is the
   costliest thing to leave unresolved.
2. **`manifest.ts` + `plugin-context.ts`** — define the unified schema and
   the permission-gated context object. No behavior change yet; nothing
   calls it.
3. **`ui-registry.ts`** — lowest risk, highest existing maturity (§5).
   Reconcile `UiComponent`/`UiSlotClaim`, audit JS sandboxing, wire
   `plugin-router.ts`'s install flow through it instead of directly.
4. **`service-registry.ts`** — wire one *new* external provider through the
   plugin path end-to-end (pick something small like Notion or Discord, per
   v1's recommendation) to prove `provider-registrar.ts` can accept a
   plugin-supplied manifest at runtime, not just from the in-tree
   `seeds/providers/manifests.ts` import.
5. **`schema-registry.ts`** (Tier A only) — register one plugin-owned
   `NodeType` end-to-end. Defer Tier B (relational fragments) — it needs a
   build-time story that shouldn't block the rest.
6. **`feature-registry.ts`** — migrate `bootstrap-engines.ts` to go through
   `ModuleRegistry` with real `activationEvents` (lazy, not eager) for at
   least one non-critical engine, prove lazy activation doesn't break
   startup ordering assumptions elsewhere.
7. **`harness-registry.ts`** — last, because it's the highest-risk axis
   (`chrome:control`). Namespace-prefix plugin commands, add the runtime
   confirmation prompt, then migrate one existing harness capability through
   it as the reference case.
8. **Batch-migrate `src/engines/*`** into `plugins/core/*` by domain, same
   as v1's step 6, now with a real kernel underneath instead of a
   hypothetical one.

## 9. Guardrails (add before step 3, not after)

- Extend `tests/arch/layer-dependency.test.ts` /
  `boundary-cdp.test.ts`: nothing in `src/kernel/` imports from
  `src/engines/*` or a plugin path; `PluginContext` is the *only* way a
  `create()`/`activate()` function reaches a kernel registry.
- A `chrome:control` grant (harness or browser-provider) always shows a
  runtime confirmation on first activation — never silently granted from
  the manifest alone, given it can drive an authenticated browser session.
- Tier-B schema fragments build in an isolated `plugin_ext` datasource —
  a broken plugin migration must be structurally unable to touch `system`
  or `user` tables.
