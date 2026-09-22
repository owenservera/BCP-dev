# PLUGIN Contracts (what K1/K2 plugins are expected to provide) — REVISED post-REASSESSMENT

> **Companion to `KERNEL-CONTRACTS.md`.** That file enumerates the kernel's surface; this one enumerates the plugin's surface. A plugin's compliance with these contracts is what `IPluginManager.certify()` checks. The same contracts apply to a first-party plugin and a third-party plugin — the kernel does not treat them differently except for trust tier and namespace enforcement.
>
> **Post-REASSESSMENT changes** to this file: P-05 now has explicit size caps and a CSS deny-list; the namespace is normalized to dots; P-15 has 13 attack vectors (was 12); the legacy V1 events are described.

---

## 1. The plugin surface

A plugin must implement or provide:

| # | Plugin contract | File evidence | Required? |
|---|----------------|---------------|-----------|
| P-01 | `PluginManifest` (Zod schema, strict, with `contractVersions[]`) | **NEW** (must be added) | **YES** |
| P-02 | `activate(ctx: IPluginContext): void \| Promise<void>` | **NEW** | **YES** |
| P-03 | `deactivate(ctx: IPluginContext): void \| Promise<void>` | **NEW** | **YES** |
| P-04 | `CapabilityContribution` shape | **NEW** | Per contribution |
| P-05 | `UiGeneratedContribution` shape (with size caps + CSS deny-list) | `SandboxedNode.tsx:38-51` | Per contribution |
| P-06 | `UiCompiledContribution` (deferred) | **NEW** (deferred) | Per contribution (v2) |
| P-07 | `ServiceContribution` shape | `OpenAICompatibleManifest` | Per contribution |
| P-08 | `SchemaContribution` shape (kernel prefixes with `plugin.<id>.`) | `src/schema/node.ts:207-` | Per contribution |
| P-09 | `PluginPermission[]` | **NEW** | **YES** |
| P-10 | Namespace self-prefixing (the kernel prefixes, not the plugin) | **NEW** | **YES** |
| P-11 | `PluginPackageIntegrity` (sha256 + optional signature) | `plugin-manager-impl.ts:145-154` | For K2 |
| P-12 | `SandboxPolicy` for K3 components | `KERNEL-CONTRACTS C-13` | Per K3 contribution |
| P-13 | Event-type namespace prefix (`plugin.<id>.<name>`, dot-separated) | **NEW** | **YES** for publishers |
| P-14 | `storage.scoped` usage contract (no cross-namespace reads) | `KERNEL-CONTRACTS C-24` | **YES** |
| P-15 | Compliance suite (13 attack vectors) | `plugin-manager-impl.ts:96-140` | **YES** |
| P-16 | `shutdown` semantics (graceful uninstall) | **NEW** | **YES** |
| P-17 | Versioning (`semver` + `contractVersions[]` compatibility) | **NEW** | **YES** |
| P-18 | (NEW post-REASSESSMENT) Capability-invocation permissions (`allowedCapabilities` per permission) | **NEW** | **YES** |

---

## 2. Each contract in detail

### P-01 — `PluginManifest` (Zod schema, strict, with `contractVersions[]`)

```ts
import { z } from 'zod'

export const PluginPermissionSchema = z.enum([
  'network',
  'storage:scoped',
  'schema:extend',
  'ui:custom-html-css-only',
  'ui:custom-scripturl',
  'ui:compiled-component',   // parsed, rejected at certify in v1 (review-gated)
  'event:publish',
  'event:subscribe',
  'capability:invoke',
  'capability:invoke-with-confirmation',  // NEW (P-18) for capabilities that require consent
  // v2 only — defined for forward-compat, enforced later:
  // 'chrome:control' | 'chrome:control:read-only'
])

export const ActivationEventSchema = z.union([
  z.literal('onStartup'),
  z.string().regex(/^onCommand:[a-z0-9-]+$/),
  z.string().regex(/^onProvider:[a-z0-9-]+$/),
  z.string().regex(/^onSchema:[a-z0-9-]+$/),
])

export const SchemaContributionSchema = z.object({
  /** Local type name. Kernel prefixes with `plugin.<id>.` (dot-separated, post-REASSESSMENT). */
  localType: z.string().regex(/^[a-z][a-z0-9-]{0,63}$/),
  schema: z.any(),  // z.ZodType at runtime
  indexContent: z.function().args(z.any()).returns(z.string()).optional(),
  embeddingText: z.function().args(z.any()).returns(z.string()).optional(),
})

/** REVISED P-05: size caps + CSS deny-list (REASSESSMENT Gap-6). */
export const UiGeneratedContributionSchema = z.object({
  slotId: z.string().min(1).max(128),
  scope: z.enum(['system', 'cross-type', 'family', 'provider']),
  variant: z.string().regex(/^[a-z0-9-]{1,64}$/).optional(),
  ownerId: z.string().regex(/^[a-z0-9-]{1,128}$/).optional(),
  /** Hard cap: 64KB. */
  html: z.string().max(64 * 1024),
  /** Hard cap: 32KB. Rejected at certify if it contains @import or url() with a remote target or expression(). */
  css: z.string().max(32 * 1024).refine(
    (s) => !/@import\s|expression\s*\(|url\s*\(\s*['"]?https?:/i.test(s),
    { message: 'plugin CSS may not @import remote URLs or use expression() or http(s) url()' }
  ),
  /** scriptUrl MUST be a kernel-asset origin (REASSESSMENT Gap-15 + P0-3). */
  scriptUrl: z.string().url().regex(/^https?:\/\/[\w-]+\/_kernel\/plugins\//).optional(),
  contract: z.object({
    inputs: z.record(z.string(), z.object({ type: z.enum(['string','number','boolean','object','array']), required: z.boolean() })),
    outputs: z.array(z.object({ event: z.string() })),
    subscriptions: z.array(z.string()),
  }).optional(),
  constraints: z.object({ resizable: z.boolean(), resizeAxes: z.enum(['both', 'x', 'y', 'none']) }).optional(),
})

/** v1: parsed, rejected at certify. */
export const UiCompiledContributionSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+(\.[a-z0-9-]+)*$/),
  kind: z.enum(['canvas', 'card', 'panel', 'overlay', 'control', 'primitive', 'hook']),
  category: z.string(),
  slot: z.string().optional(),
})

/** REVISED: dot-namespace (REASSESSMENT Gap-13). */
export const ProviderContributionSchema = z.object({
  kind: z.enum(['api-protocol', 'mcp-server', 'mcp-client']),  // 'browser-provider' rejected in v1
  manifest: z.record(z.string(), z.unknown()),
})

/** NEW (P-18): per-capability allowlist on the manifest. */
export const AllowedCapabilitiesSchema = z.array(z.string()).default([])

/** NEW (P-17): contract version claims. */
export const ContractVersionClaimSchema = z.object({
  contract: z.string().regex(/^[a-z][a-z0-9-]*(\.[a-z0-9-]+)*$/),
  major: z.number().int().nonnegative(),
  minor: z.number().int().nonnegative(),
})
export const PluginContractVersionsSchema = z.array(ContractVersionClaimSchema).min(1)

export const PluginManifestSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(\.[a-z0-9-]+)+$/),   // reverse-DNS
  version: z.string().regex(/^\d+\.\d+\.\d+/),         // semver
  displayName: z.string().max(120).optional(),
  description: z.string().max(2000).optional(),
  activationEvents: z.array(ActivationEventSchema).min(1),
  permissions: z.array(PluginPermissionSchema).min(1),
  /** NEW (P-18). The capabilities the *owner* of this manifest is willing to receive. */
  allowedCapabilities: AllowedCapabilitiesSchema,
  /** NEW (P-17). MUST list every kernel contract the plugin uses. */
  contractVersions: PluginContractVersionsSchema,
  contributes: z.object({
    schema: z.array(SchemaContributionSchema).optional(),
    services: z.array(ProviderContributionSchema).optional(),
    ui: UiGeneratedContributionSchema.partial().optional(),
    /** v2 only — defined for forward-compat, rejected at certify in v1: */
    harness: z.unknown().optional(),
    features: z.unknown().optional(),
  }),
}).passthrough()

export type PluginManifest = z.infer<typeof PluginManifestSchema>
```

**Validation:** Zod strict; unknown `contributes` keys fail with `Unsupported contribution 'harness' — not yet available.`; `permissions` MUST cover every `contributes.*` entry (e.g. `ui.generated[].scriptUrl` requires `ui:custom-scripturl`); `network` required for any `services`; `contractVersions` MUST include at minimum `event-bus` + `plugin-host`.

**Enforcement point:** `IPluginManager.discover()` (C-01). The host then runs `certify()` for a second check.

### P-02 — `activate(ctx: IPluginContext)`

```ts
export type PluginActivate = (ctx: IPluginContext) => void | Promise<void>
```

**Enforcement point:** the kernel calls `activate(ctx)` exactly once per lifecycle. The plugin may not escape `ctx`. The certifier checks a heuristic for `eval`/`new Function`/`require` references in the plugin source (see `KERNEL-BOUNDARY-TESTS.md` §2.5).

### P-03 — `deactivate(ctx: IPluginContext)`

```ts
export type PluginDeactivate = (ctx: IPluginContext) => Promise<void>
```

**Enforcement point:** the kernel wraps the call in a timeout (default 10s; configurable per manifest via `manifest.shutdownTimeoutMs`). If the plugin doesn't release its bus subscriptions, the kernel force-closes them after the timeout (see P-16).

### P-04 — `CapabilityContribution` shape

```ts
export const CapabilityContributionSchema = z.object({
  /** Globally unique. The kernel prefixes with `plugin.<id>.` so the runtime id is `plugin.<id>.<localId>`. */
  localId: z.string().regex(/^[a-z0-9-]+(\.[a-z0-9-]+)*$/),
  name: z.string().max(120),
  description: z.string().max(2000).optional(),
  category: z.string(),
  requiresConfirmation: z.boolean().default(false),
  isAsync: z.boolean().default(false),
  tags: z.array(z.string()).default([]),

  surfaces: z.array(z.enum(['cli', 'ui', 'workflow', 'mcp', 'api', 'sdk'])).min(1),
  inputSchema: z.object({ type: z.literal('object'), properties: z.record(z.string(), z.unknown()), required: z.array(z.string()).optional() }),
  outputSchema: z.object({ type: z.literal('object'), properties: z.record(z.string(), z.unknown()).optional() }),
  handler: z.function().args(z.record(z.string(), z.unknown()), z.object({ metadata: z.record(z.string(), z.unknown()) })).returns(z.unknown()),

  cliCommand: z.object({ name: z.string(), aliases: z.array(z.string()).optional(), examples: z.array(z.string()).optional() }).optional(),
  ui: z.object({ component: z.string(), position: z.string(), order: z.number().int(), group: z.string().optional(), icon: z.string().optional() }).optional(),
  mcpToolName: z.string().optional(),
  apiEndpoint: z.object({ method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']), path: z.string() }).optional(),
})
```

**Enforcement point:** the kernel wraps the `handler` with policy enforcement (`IPolicyEnforcer.enforceToolInvocation` + `enforceCapabilityInvocation`), audit (`kernel.audit.recorded`), event publishing (`kernel.capability.executed`), and telemetry (`KernelProvenance`). The plugin does not see the wrapper.

### P-05 — `UiGeneratedContribution` shape — REVISED with caps

Already defined above. Key changes from the prior proposal:
- HTML hard cap: 64KB. CSS hard cap: 32KB. Both Zod-enforced at certify.
- CSS rejected if it contains `@import`, `expression(`, or `url(http...)` — defense against CSS-side-channel exfiltration.
- `scriptUrl` MUST be a kernel-asset origin — the regex `^https?://[\w-]+/_kernel/plugins/` rejects any non-kernel URL.

**Permission gate:** the plugin must declare `ui:custom-html-css-only` for `html+css`-only contributions, `ui:custom-scripturl` for `scriptUrl`-bearing contributions. Missing permission → certify fails with `permission ui:custom-scripturl required for scriptUrl`.

### P-06 — `UiCompiledContribution` (deferred to v2)

```ts
export const UiCompiledContributionSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+(\.[a-z0-9-]+)*$/),
  kind: z.enum(['canvas', 'card', 'panel', 'overlay', 'control', 'primitive', 'hook']),
  category: z.string(),
  slot: z.string().optional(),
})
```

**v1 certifier response:** `certify() failed: ui:compiled-component requires review gate — not yet available. See BOUNDARY-CONSTITUTION.md §3.3 and BOUNDARY-MIGRATION-PLAN.md P3.`

### P-07 — `ServiceContribution` shape

```ts
export const ApiProtocolContributionSchema = z.object({
  kind: z.literal('api-protocol'),
  manifest: OpenAICompatibleManifestSchema,
})

export const McpServerContributionSchema = z.object({
  kind: z.literal('mcp-server'),
  name: z.string().min(1),
  transport: z.enum(['stdio', 'http', 'sse']),
  command: z.string().optional(),
  url: z.string().url().optional(),
  envVars: z.record(z.string(), z.string()).optional(),
  tools: z.array(z.object({ name: z.string(), description: z.string(), inputSchema: z.record(z.string(), z.unknown()) })).optional(),
})

export const McpClientContributionSchema = z.object({
  kind: z.literal('mcp-client'),
  server: McpServerContributionSchema,
})

export const BrowserProviderContributionSchema = z.object({
  kind: z.literal('browser-provider'),
  // ... (rejected in v1 with "requires chrome:control — not yet available")
})
```

**Enforcement point:** the kernel calls `IProviderRegistry.register(manifest)` (with `expectedCurrentState` TOCTOU defense), then `IExecutionManager.drainProvider(providerId)` on uninstall.

**Permission gate:** the plugin must declare `network` for any service contribution.

### P-08 — `SchemaContribution` shape

```ts
export const SchemaContributionSchema = z.object({
  /** Local type name. Kernel prefixes with `plugin.<id>.` (P-10). */
  localType: z.string().regex(/^[a-z][a-z0-9-]{0,63}$/),
  schema: z.any(),
  indexContent: z.function().args(z.any()).returns(z.string()).optional(),
  embeddingText: z.function().args(z.any()).returns(z.string()).optional(),
})
```

**Enforcement point:** the kernel calls `SchemaRegistry.register(..., { caller: { pluginId } })`; the registry enforces the `plugin.<id>.` prefix (C-15).

**Permission gate:** the plugin must declare `schema:extend`.

### P-09 — Permission declaration

| Permission | What it allows |
|---|---|
| `network` | Open outbound connections; required for any `services` contribution |
| `storage:scoped` | Read/write its own scoped storage namespace; no other plugin's |
| `schema:extend` | Register `SchemaContribution`s |
| `ui:custom-html-css-only` | `UiGenerated` with `html+css` only (no `scriptUrl`) |
| `ui:custom-scripturl` | `UiGenerated` with a `scriptUrl` (must be kernel-asset origin) |
| `ui:compiled-component` | v1: parsed but rejected. v2: register a `UniversalComponentRegistry` entry |
| `event:publish` | Publish to `IEventBus` |
| `event:subscribe` | Subscribe to `IEventBus` (always allowed but listed for transparency) |
| `capability:invoke` | Call `IPluginContext.capabilities.invoke(...)` for another plugin's capability |
| `capability:invoke-with-confirmation` | (NEW, P-18) Call capabilities marked `requiresConfirmation: true` |

**Enforcement point:** every kernel entry point the plugin may call is gated. `certify()` cross-checks: every `contributes.*` entry has its required permission; every `contractVersions[]` claim matches the kernel's actual version.

### P-10 — Namespace self-prefixing (kernel prefixes, not the plugin)

| Resource | How it is namespaced | Enforced by |
|---|---|---|
| `PluginManifest.id` | Reverse-DNS, must be unique across all installed plugins | `IPluginManager.register()` rejects duplicates |
| `CapabilityContribution.localId` | Runtime id is `plugin.<id>.<localId>` (dot, post-REASSESSMENT) | `IPluginManager.certify()` |
| `SchemaContribution.localType` | Runtime type is `plugin.<id>.<localType>` (dot) | `SchemaRegistry.register()` |
| `HarnessCommandContribution.localId` (v2) | Runtime id is `<pluginId>.<localId>` (dot) | `HarnessCommandRegistry.register()` |
| `storage.scoped(namespace)` | The plugin's own namespace; `ctx.storage.scoped()` enforces per-plugin isolation | The context's `storage.scoped()` returns a closed `IPluginScopedStore` |
| `event.kind` | Plugin events MUST be prefixed with `plugin.<pluginId>.` (dot, post-REASSESSMENT) | `IEventBus.publish()` (kernel-enforced) |
| CLI command | The kernel wraps the plugin's `cliCommand` with the manifest id (e.g. `acme.invoicer:mycommand`) | `CommandRegistry` |
| `UiGeneratedContribution.slotId` | Combined with `scope + variant + ownerId` for resolution | Already namespaced by `shared/ui-component.ts:99-130` |

### P-11 — Integrity hash + signature

```ts
export const PluginPackageIntegritySchema = z.object({
  manifestHash: z.string().regex(/^[a-f0-9]{64}$/),
  signature: z.string().optional(),  // v2: signature over manifestHash
  certifiedAt: z.string().datetime().optional(),
})
```

**Enforcement point:** `IPluginManager.discover(source)` (before extract); `install()` (after extract, before DB write). The hash is recomputed from the extracted files; any mismatch → `PLUGIN_UNTRUSTED` error.

### P-12 — `SandboxPolicy` for K3 components

See `KERNEL-CONTRACTS.md` C-13. The plugin declares the policy; the kernel validates.

### P-13 — Event-type namespace prefix (dot-separated, post-REASSESSMENT)

```ts
// In a plugin's activate(ctx):
ctx.events.publish('kernel', 'plugin.acme.invoicer.invoice_created', invoice, { correlationId })
//                    ^ source   ^ kind (must start with 'plugin.<pluginId>.')
```

**Enforcement point:** `IEventBus.publish(source, kind, ...)`: if `source` is a plugin id (matches the `pluginId` of the calling context), `kind` must start with `plugin.<pluginId>.`. If `source` is `'kernel'`, `kind` must start with `kernel.`. Legacy V1 events mirrored to V2 use the `legacy.<type>` prefix.

### P-14 — `storage.scoped` usage contract

A plugin's only path to persistence is `ctx.storage.scoped(namespace)`. The returned `IPluginScopedStore` is closed: it cannot read another plugin's keys, cannot run raw queries, cannot drop the namespace, cannot escape the namespace.

### P-15 — Compliance suite (13 attack vectors)

The certifier runs these checks on every install:

| # | Check | Pass criterion | Failure message |
|---|---|---|---|
| 1 | Manifest Zod (P-01) | All fields valid; unknown `contributes` keys rejected | `unsupported contribution '<name>'` |
| 2 | Permissions ↔ contributes | Every `contributes.*` entry has its required permission | `permission <name> required for <contribution>` |
| 3 | Integrity hash (P-11) | sha256 present and matches the archive | `manifest hash mismatch` |
| 4 | Namespace uniqueness | No other plugin has the same `id` or the same `plugin.<id>.<localId>` claim | `plugin id already installed` |
| 5 | `scriptUrl` origin (C-13) | If present, matches the kernel-asset origin regex | `scriptUrl must be a kernel-asset origin` |
| 6 | Schema Zod compiles | `schema.parse({})` does not throw (sanity) | `schema parse failed: <message>` |
| 7 | Event-type prefix on published events | The plugin's source contains no `ctx.events.publish(..., 'kernel.', ...)` or `ctx.events.publish(..., 'plugin.<other-id>.', ...)` patterns | `plugin must not publish to kernel or other-plugin event namespaces` |
| 8 | Compile / lint pass | TypeScript `tsc --noEmit` over the plugin's source compiles | `tsc failed: <errors>` |
| 9 | Activate dry-run | `activate(ctx)` returns within 5s with a mock `IPluginContext`; no exceptions; no `globalThis` writes | `activate dry-run failed: <message>` |
| 10 | UI payload caps (P-05) | `html <= 64KB`; `css <= 32KB`; CSS does not contain `@import`, `expression(`, or `url(http...)` | `ui payload too large: html=<bytes>, css=<bytes>` / `plugin css contains forbidden construct: <match>` |
| 11 | `plugin.${id}.` namespace on PluginContractVersions | Every `contractVersions[]` claim matches a real kernel contract; major version must match the kernel's major | `contract:event-bus requires major=1, kernel exposes 2.0` |
| 12 | Harness / features / browser-provider rejection | `contributes.harness`, `contributes.features`, `contributes.services[kind:'browser-provider']` all FAIL at certify with actionable error | `harness not yet available — see adr/002` / `browser-provider requires chrome:control — not yet available` |
| 13 | `allowedCapabilities` shape (P-18) | `manifest.allowedCapabilities` is an array of strings, each matching `plugin.<id>.<localId>` or `kernel.<name>` | `allowedCapabilities must be a string array` |

### P-16 — `shutdown` semantics

On uninstall, the kernel calls `deactivate(ctx)`. The plugin must:
- Cancel all bus subscriptions it opened (`onAny`/`on`/`once` returned unsubscribers; the plugin must call them).
- Release any `IResourceLease` it acquired (via `tryAcquire`).
- Dispose any `SandboxedNode` it rendered.
- Call `IExecutionManager.drainProvider(providerId)` for any provider it contributed.
- Flush any `storage.scoped` writes it intended to persist (the kernel may close the connection after the timeout).

The kernel wraps the call in a 10-second timeout (configurable per `PluginManifest.shutdownTimeoutMs`). On timeout, the kernel force-releases everything the plugin allocated (closes bus subscriptions, releases leases, force-stops the provider, deletes the scoped storage).

### P-17 — Versioning and `contractVersions` compatibility

```ts
export const ContractVersionClaimSchema = z.object({
  contract: z.string().regex(/^[a-z][a-z0-9-]*(\.[a-z0-9-]+)*$/),  // e.g. 'plugin-host', 'event-bus', 'kernel.contracts'
  major: z.number().int().nonnegative(),
  minor: z.number().int().nonnegative(),
})
export const PluginContractVersionsSchema = z.array(ContractVersionClaimSchema).min(1)
```

**Enforcement point:** the certifier cross-checks each `ContractVersionClaim` against the kernel's `contractVersion` for the named contract. Mismatch → `certify() failed: plugin requires contract:event-bus@1.2, kernel exposes 1.1` (deny of a major version, warn of a minor).

The plugin MUST list every kernel contract it uses. The certifier checks the set is non-empty (at minimum `event-bus` + `plugin-host`).

### P-18 — (NEW) Capability-invocation permissions

```ts
/** Plugin's published surface (what other plugins can call). */
export const AllowedCapabilitiesSchema = z.array(z.string()).default([])

/** In the manifest, the plugin declares: */
// allowedCapabilities: ['capability:charge:customer', 'capability:export:pdf']
```

**Enforcement point:** `IPolicyEnforcer.enforceCapabilityInvocation(caller, callee, capabilityId)` (C-09). The kernel denies by default; allows only when the capability is in the callee's `allowedCapabilities` array *or* the callee has declared a public allowlist (a sub-list within `allowedCapabilities` marked with a `*` prefix). The `capability:invoke-with-confirmation` permission is required for capabilities marked `requiresConfirmation: true` in the callee's manifest.

**The 12-case matrix in `KERNEL-BOUNDARY-TESTS.md` §2.7 covers the surface.**

---

## 3. What the certifier checks (the v1 compliance suite) — REVISED

The 13 rows of P-15 are the test surface. Each maps to a unit test in `KERNEL-BOUNDARY-TESTS.md` §2.9.

**V1 deferred (with explicit errors, not silent skips):**
- `ui:compiled-component` → FAIL with `ui:compiled-component requires review gate — not yet available`
- `contributes.harness` → FAIL with `harness not yet available — see adr/002`
- `contributes.features` → FAIL with `features not yet available — see adr/006`
- `contributes.services[kind:'browser-provider']` → FAIL with `browser-provider requires chrome:control — not yet available`
- `contributes.services[kind:'mcp-server']` of a server requiring `chrome:control` → FAIL with `chrome:control required for this MCP server — not yet available`

---

## 4. The full plugin lifecycle (the v1 contract end-to-end)

```
  1. plugin-host loads archive (.vivim-plugin or .tgz)
  2. IPluginManager.discover(source):
       a. extract to tmpdir/vivim-plugin-staging/install-<ulid>
       b. compute sha256 of archive bytes
       c. parse manifest.json with PluginManifestSchema (P-01)
       d. run compliance suite P-15 §3 (13 checks)
       e. return { valid: true, manifest } or { valid: false, reason }
  3. IPluginManager.install(source):
       a. if valid, promote tmpdir to plugins/<id>/
       b. write PluginRegistry row with integrityHash
       c. IProviderRegistry.register(...) for each service contribution
       d. SchemaRegistry.register(..., { caller: { pluginId } }) for each schema
       e. UniversalComponentRegistry.register(...) for each compiled component (v2)
       f. UiComponentStore.create(...) for each generated component
       g. construct IPluginContext; call plugin.activate(ctx)
       h. emit 'kernel.plugin.installed' on IEventBus; mirror to EventRecord
  4. runtime: plugin uses ctx.{events,storage,schema,capabilities,sandbox}
  5. IPluginManager.uninstall(pluginId):
       a. IExecutionManager.drainProvider(...) for each provider
       b. IResourceManager.release(...) for each lease
       c. remove IEventBus subscriptions (force on timeout)
       d. remove all node types `plugin.<id>.*` from SchemaRegistry
       e. mark UiComponents `status='deprecated'`
       f. delete provider_*, ui_component, pluginRegistry rows
       g. delete plugins/<id>/
       h. call plugin.deactivate(ctx)
       i. emit 'kernel.plugin.uninstalled'
```

Every step is **atomic** — failure rolls back the partial state. (Today this atomicity is partial; P0-1 enforces it.)

---

## 5. Post-REASSESSMENT changes summary

- **P-01** — added `allowedCapabilities` (P-18) and `contractVersions` (P-17); normalized namespace from `:` to `.`; added CSS deny-list in P-05.
- **P-05** — added size caps (64KB html / 32KB css); added CSS deny-list; tightened `scriptUrl` to a kernel-asset origin.
- **P-13** — event namespace from `plugin:<id>:` to `plugin.<id>.` (dot).
- **P-15** — 13 attack vectors (was 12); added the `allowedCapabilities` shape check (P-18) and the `plugin.${id}.` namespace check.
- **P-17** — `PluginContractVersionsSchema` is required; the set MUST include at minimum `event-bus` + `plugin-host`.
- **P-18** — new: capability-invocation permissions; the 12-case matrix in `KERNEL-BOUNDARY-TESTS.md` §2.7.
- **§3 audit-surface** — every kernel event renamed from `provider:seeded` to `provider.seeded` (dot namespace). Legacy V1 mirror uses `legacy.<type>`.
- **`IPluginContext.storage.scoped()` (C-24)** — added the `IPluginScopedStore` shape explicitly (was implicit before).
- **`P-16 shutdown`** — added `manifest.shutdownTimeoutMs` as the configurable timeout.
