# Vivim Plugin Kernel — Boundary Design (Verified)

Every mechanism cited here was confirmed against the actual codebase in
`01-AUDIT-FINDINGS.md`. Where that doc corrected an assumption, this doc
uses the corrected version directly rather than re-deriving it.

## 0. The headline finding, restated precisely

Vivim has **five extensibility mechanisms, one per required axis, at
varying states of completeness** — plus its own internal audit trail
(`[AUDIT R-1..12]`, a `CONVERGENCE-PLAN`) that already identified the core
problem: fragmented, same-purpose modules that don't share a manifest,
lifecycle, or permission model. This design's job is to **finish and unify
what's already there**, prioritizing the pieces that are stubbed
(B1: plugin trust/install) over the pieces that are solid
(A1: UI sandboxing) or already decomposed (A4: bootstrap).

| Axis | Mechanism | State |
|---|---|---|
| Schema | `SchemaRegistry` (`src/schema/node.ts`) | Solid; one typing gap (`NodeType` union) |
| Core features | 5-phase `bootstrap/` pipeline (`src/server/bootstrap/`) | Solid structure; no lazy activation yet |
| Harness | `harness-command-registry.ts` + DAG compiler | Solid; no collision protection |
| External services | manifest→DB→generated-file pipeline + `ai/protocol/*` | Solid; in-tree-only, no runtime load path |
| Frontend UI | `SandboxedNode.tsx` + `UniversalComponentRegistry` + `UiComponent`/6-tier resolver | Solid, genuinely done |
| **Packaging/trust (cross-cutting)** | `TrustedPluginManager` + `plugin-router.ts` | **Stubbed** — two competing partial paths, neither complete |

---

## 1. Schema extensibility

**Mechanism:** every domain object is a `Node` (`src/schema/node.ts`) — a
fixed envelope (`id`, `parentId`, `type`, `state`, `acl`, `quality`,
timestamps) plus a `data: unknown` payload whose shape is declared per
`NodeType` and validated by `SchemaRegistry`
(`register/get/has/all/validate/indexContent/embeddingText`, a runtime
`Map`, singleton `schemaRegistry`, populated today by `registerAllSchemas()`
in `schemas.ts`).

**Design — Tier A (the default path, no migration required):**

```ts
// plugin-kernel/registries/schema-registry.ts
interface SchemaContribution {
  nodeType: string          // kernel-prefixed: "plugin:acme.invoice"
  schema: z.ZodType
  indexContent?: (data: unknown) => string
  embeddingText?: (data: unknown) => string
}
```

Two concrete fixes required in `src/schema/node.ts` itself before this can
work cleanly (not workarounds — the actual gap):

1. Widen `NodeType` from a closed string-literal union to
   `BuiltinNodeType | (string & {})` (or equivalent), so a plugin-registered
   type string is accepted without an `as any` cast at every call site —
   the codebase already accepts `as any` at every *built-in* registration
   call in `schemas.ts`, so this isn't introducing a new looseness, it's
   making an existing one explicit and typed.
2. Enforce the `plugin:${pluginId}.` prefix inside
   `SchemaRegistry.register()` itself when the caller isn't the boot-time
   `registerAllSchemas()` — i.e. the kernel wrapper, not each plugin, is
   responsible for correct namespacing (never trust the plugin to prefix
   itself).

**Tier B (rare, deferred):** a plugin needing a genuinely indexed
relational table ships a `schema.prisma` fragment, table-prefixed
`plugin_<id>_*`, migrated into an isolated `plugin_ext` datasource —
**never** `system` or `user`. Out of scope for the first implementation
pass; tracked, not designed in detail here, since it needs a build-time
story Tier A doesn't.

---

## 2. Core-feature extensibility

**Mechanism:** `src/server/bootstrap/orchestrator.ts` runs five named
phases in order — `seeds → stores → knowledge → capabilities → lifecycle`
— each phase a separate, individually-testable module writing to a shared
`BootstrapContext`. `capabilities.ts` (738 lines, by far the largest phase)
is also where `TrustedPluginManager` gets activated today (§B1 in the
audit doc) — this phase is already, in effect, "the plugin activation
phase," just not structured as one yet.

**Design:** rather than introducing `ModuleRegistry`
(`src/server/module-registry.ts`) as a new layer on top of the phase
pipeline, use it *inside* the `capabilities` phase specifically — that's
where dynamic, plugin-sourced construction belongs; `seeds`/`stores` stay
eager and in-tree (they're infrastructure the kernel itself depends on,
same category as the sandbox runner — see §7).

```ts
interface FeatureContribution {
  name: string
  tags: string[]
  dependsOn?: string[]
  activationEvents: ActivationEvent[]   // 'onStartup' | 'onCommand:x' | ...
  create: (ctx: PluginContext) => unknown | Promise<unknown>
  lifecycle?: { init?; start?; stop? }
}
```

`PluginContext` is the enforcement point — a permission-gated capability
object, never the raw dependency bag `ModuleRegistry.define()`'s `create()`
receives today. In-tree core modules can be marked `trusted: true` during
migration to avoid a big-bang rewrite of every existing engine at once;
`trusted: false` (anything plugin-sourced) always goes through
`PluginContext`.

---

## 3. Harness-capability extensibility

**Mechanism:** `harness-command-registry.ts` resolves `commandId@version`
(correct semver ordering — a previously-fixed defect per its own comment)
to a `HarnessCommand`, validates params against a stored JSON schema,
compiles to a `HarnessDAG`, executes through `HarnessRuntime`, with repair
(`harness-repair-engine.ts`) and crash-recovery checkpointing
(`harness-checkpoint.ts`) already wired.

**Confirmed gap:** no collision protection at registration time — two
commands can silently share an ID today.

**Design:**

```ts
interface HarnessContribution {
  commands: Array<{
    commandId: string        // kernel prefixes to "${pluginId}.${commandId}"
    version: string
    paramSchema: JsonSchema
    recipe: HarnessRecipe    // reuse harness/recipe-types.ts as-is
  }>
  repairStrategies?: RepairStrategyContribution[]
}
```

Permission: `chrome:control` (full) or `chrome:control:read-only`
(observation-only recipes) required before registration succeeds. A
`chrome:control` grant always triggers a runtime confirmation on first
activation — never silently granted from the manifest alone, since a
harness recipe can drive a real, authenticated browser session. This gate
is shared with the external-services axis (§4) — one confirmation, not two,
for a plugin that needs both.

---

## 4. External-service wiring

**Mechanism — three parallel pipelines, all in-tree-only today:**

- **Browser-driven providers:** `seeds/providers/*.json` →
  `schema/provider-manifest.ts` (Zod validation) → `provider-registrar.ts`
  (DB seed) → `provider-protocol-generator.ts` (reads DB, writes a static
  generated file for fast runtime access).
- **API-driven providers:** `src/ai/protocol/openai-compatible/*`
  (full adapter kit: auth, request-builder, stream-parser, error-mapper,
  manifest) + `opencode-adapter.ts`, fronted by
  `src/ai/gateway/vivim-ai-gateway.ts`.
- **MCP:** `src/mcp/server.ts` (tool scaffold) +
  `mcp-client-adapter.ts`/`mcp-server-adapter.ts`.

**Confirmed gap:** `provider-registrar.ts` only reads from the in-tree
`seeds/providers/manifests.ts` import; `provider-protocol-generator.ts`'s
output is a disk file that assumes a rebuild. Neither has a runtime load
path for a plugin installed after the process starts.

**Design:**

```ts
interface ExternalServiceContribution {
  kind: 'browser-provider' | 'api-protocol' | 'mcp-server' | 'mcp-client'
  manifest: ProviderManifest | OpenAiCompatibleManifest | McpServerManifest
}
```

`provider-registrar.ts` gains a second entry point,
`registerOne(manifest, { source: 'plugin', pluginId })`, alongside the
existing `seedAll()` (which keeps its current behavior unchanged for
in-tree seeds). `provider-protocol-generator.ts`'s output moves from
disk-only to an in-memory cache rebuilt on plugin install/uninstall, with
the disk file kept as a startup-time snapshot rather than a hard
dependency. Permission: `network` always; `chrome:control` additionally for
`kind: 'browser-provider'` (shared gate with §3).

---

## 5. Frontend UI customization

**Mechanism — two real, current, complementary systems (not one system
plus a legacy one to retire — see audit A3):**

- **Dynamic/generated components:** `UiComponent` rows
  (`shared/ui-component.ts`: `html`, `css`, `scriptUrl`, `sandboxJson`,
  `constraintsJson`, `contractJson`), resolved through a 6-tier chain
  (`provider+variant > provider > family+variant > family > cross-type >
  system`, `shared/conceptual-model.ts`), rendered through the sandboxed
  `SandboxedNode.tsx` iframe (already solid — see audit A1).
- **Compiled/static components:** `UniversalComponentRegistry`
  (`frontend/src/shared/universal-registry.ts`) — the single live registry
  for every visible UI element, resolved via `registry.resolve(slot, ctx)`,
  hot-swapped via `useSyncExternalStore`. Its own comment confirms it
  supersedes two earlier slot-only registries.

**Design:** a plugin contributing UI declares which kind it's contributing —
generated content goes through the `UiComponent` path (kernel expands the
manifest's terse slot claim into a full row, per audit A2's actual field
shape); compiled React content (rare — requires the plugin to ship real
code, a higher trust tier) goes through `UniversalComponentRegistry`
directly.

```ts
interface UiContribution {
  generated?: Array<{
    slotId: string
    scope: 'system' | 'cross-type' | 'family' | 'provider'
    variant?: string
    ownerId?: string
    html: string
    css: string
    scriptUrl?: string        // must resolve to kernel-controlled asset storage
    contract?: ComponentContract
    constraints?: ComponentConstraints
  }>
  compiled?: Array<{
    id: string
    kind: ComponentKind       // reuse universal-registry.ts's union
    category: ComponentCategory
    slot?: string
  }>                          // compiled entries require `ui:compiled-component`
                               // permission — higher trust than generated
}
```

Permission split: `ui:custom-html-css-only` (default, lower trust) vs.
`ui:custom-scripturl` (the plugin's `scriptUrl` must point into
kernel-controlled asset storage, not an arbitrary origin) vs.
`ui:compiled-component` (ships real code into the bundle — highest trust,
effectively equivalent to a core-feature contribution and reviewed as
such).

---

## 6. The unified manifest

```ts
interface PluginManifest {
  id: string                          // reverse-DNS: "acme.invoicer"
  version: string
  activationEvents: ActivationEvent[]
  permissions: PluginPermission[]     // 'network' | 'chrome:control' |
                                       // 'chrome:control:read-only' |
                                       // 'storage:scoped' | 'schema:extend' |
                                       // 'ui:custom-html-css-only' |
                                       // 'ui:custom-scripturl' | 'ui:compiled-component'
  contributes: {
    schema?: SchemaContribution[]
    features?: FeatureContribution[]
    harness?: HarnessContribution
    services?: ExternalServiceContribution[]
    ui?: UiContribution
  }
}
```

**Packaging/trust — the one axis that needs building, not wrapping**
(audit B1): `plugin-router.ts`'s tar.gz install flow and
`TrustedPluginManager`'s install/discover/certify methods are two
incomplete halves of the same job. The kernel's `PluginHost` unifies them:
`plugin-router.ts`'s extraction + sha256 verification becomes the
`discover()` implementation `TrustedPluginManager` is currently missing;
`certify()` gets real checks (signature, not just field presence;
permission-vs-manifest cross-check; sandbox re-validation for any `ui`
contribution); `install()` calls the five per-axis registries in §1–5
instead of throwing "not yet implemented." Stop using
`globalThis.__pluginManager` — `PluginHost` becomes an explicit dependency
threaded through `BootstrapContext` like everything else in the phase
pipeline (audit A4), not an ambient global.

---

## 7. Package layout

```
src/plugin-kernel/            # NOT src/kernel/ — that collides with the
                               # existing src/engines/kernel/ diagnostics
                               # registry (audit B4); different purpose,
                               # different name, on purpose.
  manifest.ts                 # PluginManifest zod schema (§6)
  plugin-context.ts           # PluginContext — permission-gated capability
                               # object passed to every create()/activate()
  registries/
    schema-registry.ts        # wraps src/schema/node.ts's SchemaRegistry (§1)
    feature-registry.ts       # wraps ModuleRegistry, used inside the
                               # `capabilities` bootstrap phase only (§2)
    harness-registry.ts       # wraps harness-command-registry.ts (§3)
    service-registry.ts       # wraps provider-registrar.ts + ai/protocol +
                               # mcp/server.ts (§4)
    ui-registry.ts            # wraps UiComponent (dynamic) AND
                               # UniversalComponentRegistry (compiled) (§5)
  host.ts                     # PluginHost — completes TrustedPluginManager +
                               # plugin-router.ts into one real
                               # discover/install/certify/enable/disable (§6)
  permissions.ts               # grant/check + the chrome:control runtime
                               # confirmation prompt (shared by §3 and §4)
  events.ts                    # canonical event bus — see Phase 0 of tasks;
                               # merge capability-event-bus.ts / -v2.ts first
```

Every file under `registries/` delegates to a real, existing mechanism —
this design adds a permission-gated entry point and a unified manifest,
it does not reimplement five (mostly) working subsystems. `host.ts` is the
one place doing genuinely new work, because that's the one place
(audit B1) where "genuinely new work" turned out to be true rather than
assumed.

---

## 8. Before writing any kernel code

Locate and read whatever `CONVERGENCE-PLAN` document the `[AUDIT R-1..12]`
comments and `tests/unit/ai/convergence-c1-c4.test.ts` reference (audit
B2) — it is not present as a standalone file in this working tree, which
means either it lives outside this repo (there's a `control-plane\CANON.md`
reference in `.genome/DECISIONS.md` pointing to an external path) or it
existed in prior history this clone doesn't include. Either way, "C4"
(plugin convergence) in that plan and `host.ts` above are very likely the
same initiative — confirm before duplicating effort.
