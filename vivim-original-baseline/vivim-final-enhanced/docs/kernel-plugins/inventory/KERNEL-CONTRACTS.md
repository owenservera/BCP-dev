# KERNEL Contracts (what K0 exposes to K1/K2/K3/K4) — REVISED post-REASSESSMENT

> **Companion to `BOUNDARY-CONSTITUTION.md` and `PLUGIN-TRUST-MODEL.md`.** This file enumerates the **stable, versioned** contracts the kernel exposes. Each contract has (a) purpose, (b) full TypeScript types (no `...` — see REASSESSMENT Gap-3 + Gap-4), (c) kernel enforcement point, (d) the consumer on the other side, (e) the v1 contract version, (f) migration status. `PLUGIN-CONTRACTS.md` lists what plugins are expected to provide. The compatibility guarantee is the numeric contract version: a plugin certified against `contract@<name>: { major: N, minor: M }` loads on any kernel exposing the same major and minor >= M.
>
> **Post-REASSESSMENT changes** to this file: C-02 (`IPluginContext.sandbox`) now has a full `ISandboxHost` shape; C-05 (`IProviderAdapter`) now has `AdapterError`; C-10 (`IExecutionManager`) now has `drainProvider` + `forceStopProvider`; C-09 (`IPolicyEnforcer`) now has `enforceCapabilityInvocation`; C-12 (`IResourceManager`) now has `acquire` + `tryAcquire`. Every contract has `contractVersion: { major: 1; minor: 0 }`. `kernel:plugins:install` and `provider:seeded` namespace inconsistencies (Gap-13) are normalized to `kernel.*` and `plugin.${id}.*` with dots. **C-33..C-39 are the M-layer (self-descriptive surface) per `inventory/SELF-DESCRIPTIVE.md`. C-40..C-44 are the Layer 0 deterministic intelligence substrate per `inventory/LAYER-0-INTELLIGENCE.md`.**

---

## 1. The contract catalog

| # | Contract | File evidence | v1 version | Migration status |
|---|---------|---------------|-----------|------------------|
| C-01 | `IPluginManager` (host) | `src/ai/plugins/manager.ts:27-45` | 1.0 | P0-1 (P0 critical) |
| C-02 | `IPluginContext` + `ISandboxHost` (the only object a plugin receives) | **NEW** | 1.0 | P0-1 |
| C-03 | `IEventBus` | `src/ai/events/bus.ts:60-79` + `src/engines/capability-event-bus-v2.ts:46` | 1.0 | P0 (extract from V1/V2) |
| C-04 | `CapabilityEventBusV2` impl | `src/engines/capability-event-bus-v2.ts:46` | 1.0 | Already implemented; needs version |
| C-05 | `IProviderAdapter` + `AdapterError` | `src/ai/protocol/adapter.ts:14-30` | 1.0 (`VIVIM_AI_PROTOCOL`) | Already versioned |
| C-06 | `IProviderRegistry` (with `expectedCurrentState` TOCTOU defense) | `src/ai/registry/registry.ts:33-58` | 1.0 | P1-2 |
| C-07 | `IModelRegistry` | `src/ai/registry/registry.ts:60-79` | 1.0 | P1-2 |
| C-08 | `IRouter` | `src/ai/routing/router.ts:19-30` | 1.0 | Already versioned |
| C-09 | `IPolicyEnforcer` (with `enforceCapabilityInvocation` — capability-abuse defense) | `src/ai/policy/policy.ts:40-68` | 1.0 | P0-2 (split + extend) |
| C-10 | `IExecutionManager` (with `drainProvider` + `forceStopProvider` separation) | `src/ai/execution/manager.ts:13-40` | 1.0 | P0-2 |
| C-11 | `IRuntimeSupervisor` | `src/ai/runtime/supervisor.ts:18-28` | 1.0 | P1-1 |
| C-12 | `IResourceManager` (with `acquire` + `tryAcquire` two-method split) | `src/ai/runtime/resources.ts:23-44` | 1.0 | P1-2 |
| C-13 | `SandboxPolicy` (unified iframe + QuickJS) | `src/engines/sandbox-runner.ts:5-16` + `frontend/src/components/canvas/SandboxedNode.tsx:30-51` | 1.0 | P1-1 |
| C-14 | `INodeStoreContract` | `src/storage/contracts/node-store.ts` | 1.0 | P2 (already a contract; needs version) |
| C-15 | `ISchemaRegistry.register(...)` (with `caller` parameter) | `src/schema/node.ts:207-` | 1.0 | P2 |
| C-16 | `IProviderRegistrar.registerOne(manifest, {source:'plugin', pluginId})` | **NEW** | 1.0 | P0-2 |
| C-17 | Storage machinery (Prisma, dual-DB, `MigrationRunner`) | `src/storage/`, `prisma/schema.prisma` | 1.0 | P2 |
| C-18 | `KernelProvenance` + `KernelEvent` + `KernelSpan` | `src/engines/kernel/kernel-provenance.ts` | 1.0 | P1-1 |
| C-19 | `KernelTracer` ring buffer | `src/engines/kernel/kernel-tracer.ts:7-23` | 1.0 | P1-1 |
| C-20 | `EncryptionEngine` + crypto primitives | `src/engines/encryption.ts:1-32` | 1.0 | P1-1 |
| C-21 | `IProviderStore` etc. (provider persistence) | `src/storage/contracts/provider-store.ts` | 1.0 | P2 |
| C-22 | `StreamParserEngine` + `SandboxRunner` (parser chain) | `src/engines/stream-parser.ts` + `src/engines/sandbox-runner.ts` | 1.0 | P1-1 |
| C-23 | Branded ID types | `src/ai/core/types.ts:42-49` | 1.0 | Already enforced |
| C-24 | `IPluginScopedStore` (per-plugin namespace) | **NEW** | 1.0 | P0-1 |
| C-25 | `IContractCatalog` (introspection) | **NEW** | 1.0 | P0-1.x (PLUGIN-BUILDER-CAKE P0) |
| C-26 | `IPluginRegistry.list` exposed as `kernel.plugins.list` capability | wrap existing | 1.0 | P0-1.x |
| C-27 | `IEventBus.trace({kind, since})` | **NEW** | 1.0 | P0-1.x |
| C-28 | `ISandboxAuditStore.query` | wrap existing | 1.0 | P0-1.x |
| C-29 | `INodeStoreContract.query` | wrap existing | 1.0 | P0-1.x |
| C-30 | `ISandboxRunnerContract.run` | wrap existing | 1.0 | P0-1.x |
| C-31 | `IPluginManager.install/upgrade/uninstall` exposed as `kernel.plugins.install` etc. | wrap existing | 1.0 | P0-1.x |
| C-32 | `IPluginManager.certify` exposed as `kernel.plugins.certify` | wrap existing | 1.0 | P0-1.x |
| C-33 | `IIdentityCatalog` (M1 — what am I?) — **self-descriptive** | **NEW** (kernel self-descriptive surface) | 1.0 | **P0-1.y** (self-descriptive phase) |
| C-34 | `IProvenanceStore` (M2 — where did I come from?) — **self-descriptive** | **NEW** | 1.0 | P0-1.y |
| C-35 | `IRationaleCatalog` (M3 — why am I the way I am?) — **self-descriptive** | **NEW** | 1.0 | P0-1.y |
| C-36 | `IRelationGraph` (M4 — how do I fit?) — **self-descriptive** | **NEW** | 1.0 | P0-1.y |
| C-37 | `IConfigurationCatalog` (M1 for config) — **self-descriptive** | **NEW** | 1.0 | P0-1.y |
| C-38 | `IEventCatalog` (M1 for events) — **self-descriptive** | **NEW** | 1.0 | P0-1.y |
| C-39 | `IWhy` (user-facing entry point) — **self-descriptive** | **NEW** | 1.0 | P0-1.y |
| C-40 | `INLCLLayeredPipeline` (the 6-layer pipeline shape) — **K0(L0) deterministic intelligence** | **NEW** (kernel substrate) | 1.0 | **P0-1.w** (intelligence substrate phase) |
| C-41 | `IEmbeddingProvider` (the embedding contract; the kernel ships a TF-IDF default) — **K0(L0)** | **NEW** | 1.0 | P0-1.w |
| C-42 | `IBudgetGuard` (the budget engine shape; the policy values are config) — **K0(L0)** | **NEW** | 1.0 | P0-1.w |
| C-43 | `ICommandPipeline` (the CLI + NLCL + route + execute kernel — the single entry point) — **K0(L0)** | **NEW** | 1.0 | P0-1.w |
| C-44 | `IIntelligenceRegistry` (the upgrade + introspection bus; the M-layer reads from it) — **K0(L0)** | **NEW** | 1.0 | P0-1.w |

---

## 2. Each contract in detail

### C-01 — `IPluginManager` (host)

**Purpose:** the single behavioural surface a plugin host exposes. Handles discover, install, uninstall, enable/disable, certify.

```ts
export interface PluginPackageRef {
  readonly source: string                                  // local path or registry URI
  readonly expectedChecksum?: string
}

export type PluginValidationResult =
  | { readonly valid: true; readonly manifest: ProviderManifest }
  | { readonly valid: false; readonly reason: string }

export type PluginState = 'discovered' | 'installed' | 'enabled' | 'disabled' | 'suspended' | 'uninstalled'

export interface PluginDescriptor {
  readonly id: PluginId
  readonly version: string
  readonly state: PluginState
  readonly installedAt: number
  readonly manifestHash: string
  readonly capabilities: readonly string[]
}

export interface IPluginManager {
  /** v1.0 — extract + sha256 verify, no DB write. */
  discover(source: PluginPackageRef): Promise<PluginValidationResult>

  /** v1.0 — atomic install to plugins/<id>/; certifier must pass. */
  install(source: PluginPackageRef): Promise<PluginDescriptor>

  /** v1.0 — call IExecutionManager.drainProvider first; then DB + filesystem cleanup. */
  uninstall(pluginId: PluginId, opts?: { reason?: string }): Promise<void>

  /** v1.0 — re-load the activate() body with the existing manifest. */
  enable(pluginId: PluginId): Promise<void>

  /** v1.0 — call IExecutionManager.drainProvider; do not unload. */
  disable(pluginId: PluginId): Promise<void>

  /** v1.0 — read-only. */
  get(pluginId: PluginId): Promise<PluginDescriptor | undefined>
  list(filter?: { readonly state?: PluginState }): Promise<readonly PluginDescriptor[]>

  /** v1.0 — re-runs the 13-check compliance suite. */
  certify(manifest: ProviderManifest): Promise<{
    readonly passed: boolean
    readonly report: readonly string[]  // PASS/FAIL/WARN lines
  }>

  readonly contractVersion: { readonly major: 1; readonly minor: 0 }
}
```

**Enforcement point:** `src/ai/plugins/plugin-manager-impl.ts` (P0-1 makes the stubs real); the `PluginHost` is the new `src/kernel/plugin-kernel/host.ts`. The HTTP `plugin-router.ts` becomes a thin adapter.

**Consumer:** kernel (boot, lifecycle); first-party plugins (none — they do not call `IPluginManager`); UI (list).

---

### C-02 — `IPluginContext` + `ISandboxHost` (the only object a plugin receives) — REVISED

**Purpose:** a plugin's only window into the kernel. **No** plugin may receive a `BootstrapContext`, a `StorageDb`, an `EventBus`-shaped global, or a `PluginManager` reference.

```ts
export interface IPluginContext {
  readonly pluginId: PluginId
  readonly contractVersion: { readonly major: 1; readonly minor: 0 }
  readonly manifest: { readonly id: string; readonly version: string }

  /** V2 bus. The only event surface a plugin sees. */
  readonly events: Pick<CapabilityEventBusV2, 'publish' | 'publishAndWait' | 'on' | 'once' | 'onAny'>

  /** Scoped storage. The only path to persistence. */
  readonly storage: {
    scoped(namespace: string): IPluginScopedStore  // C-24
  }

  /** Universal record + schema registry. */
  readonly schema: {
    register(contribution: SchemaContribution): void  // kernel prefixes with plugin:<id>.
  }

  /** Capability invocation. Kernel dispatches via IExecutionManager; the call site
   *  runs IPolicyEnforcer.enforceCapabilityInvocation for the capability-abuse defense. */
  readonly capabilities: {
    invoke<TIn, TOut>(
      capabilityId: string,
      input: TIn,
      opts?: { correlationId?: string }
    ): Promise<TOut>
  }

  /** Sandbox host. Replaces the previous "..." with the full ISandboxHost shape. */
  readonly sandbox: ISandboxHost

  /** Telemetry — every emit goes to the bus; the plugin may subscribe. */
  readonly telemetry: { readonly contractVersion: { readonly major: 1; readonly minor: 0 } }
}

/** The full sandbox host. Mirrors SandboxedNode.tsx:80-140 (the actual behavior today). */
export interface ISandboxHost {
  render(
    component: SandboxComponentInput,
    policy: SandboxPolicy  // C-13
  ): ISandboxInstance
}

export interface ISandboxInstance {
  readonly instanceId: string
  /** Send a message to the iframe (host → iframe). */
  postMessage(message: Record<string, unknown>): void
  /** Receive messages from the iframe (iframe → host). The returned function unsubscribes. */
  onMessage(handler: (msg: Record<string, unknown>) => void): () => void
  /** Tear down. Kernel may force this on uninstall (PLUGIN-CONTRACTS P-16). */
  dispose(): void
  /** The iframe's last `SandboxAuditEvent`. Resolves with null if no event yet. */
  getAuditEvent(): Promise<SandboxAuditEvent | null>
}

export interface SandboxComponentInput {
  readonly slotId: string
  readonly scope: 'system' | 'cross-type' | 'family' | 'provider'
  readonly html: string
  readonly css: string
  readonly scriptUrl?: string  // C-13: must be kernel-asset origin
  readonly contract?: {
    inputs: Record<string, { type: 'string' | 'number' | 'boolean' | 'object' | 'array'; required: boolean }>
    outputs: Array<{ event: string }>
    subscriptions: string[]
  }
  readonly constraints?: { resizable: boolean; resizeAxes?: 'both' | 'x' | 'y' | 'none' }
}

export interface SandboxAuditEvent {
  readonly kind: 'capability_denied' | 'csp_violation' | 'budget_timeout' | 'crash'
  readonly instanceId: string
  readonly ts: number
  readonly detail: Record<string, unknown>
}

export interface IPluginScopedStore {  // C-24
  get(key: string): Promise<unknown | null>
  put(key: string, value: unknown): Promise<void>
  delete(key: string): Promise<void>
  list(prefix?: string): Promise<readonly { key: string; value: unknown }[]>
  // CRITICAL: no getAll(), no raw query, no drop, no other plugins' keys
}
```

**Enforcement point:** `PluginHost` constructs the context; only this object is passed to the plugin's `activate(ctx)` or `create(ctx)`; the context is **closed** — there is no escape hatch.

**Consumer:** every plugin (`activate(ctx)` in a first-party, or the bootstrap function for in-tree plugins).

**V1 version:** `1.0`.

---

### C-03 — `IEventBus`

```ts
export interface EventEnvelope<T> {
  readonly eventId: string  // ULID
  readonly source: string   // 'kernel' for kernel events, 'plugin:<id>' for plugin events
  readonly kind: string      // 'kernel.<name>' or 'plugin.<pluginId>.<name>'
  readonly data: T
  readonly ts: number
  readonly correlationId?: string
  readonly causationId?: string
}

export interface IEventBus {
  /** v1.0 — fire-and-forget publish. If source is a plugin id, kind MUST start with `plugin.<pluginId>.`. */
  publish<T>(source: string, kind: string, event: T, opts?: { correlationId?: string; causationId?: string }): string

  /** v1.0 — awaitable publish. Returns per-handler failures. */
  publishAndWait<T>(source: string, kind: string, event: T, opts?: { correlationId?: string; causationId?: string }): Promise<{
    eventId: string
    failures: ReadonlyArray<{ handlerId: string; error: Error }>
  }>

  /** v1.0 — wildcard subscription. */
  onAny<T>(handler: (envelope: EventEnvelope<T>) => void | Promise<void>): () => void

  /** v1.0 — typed subscription. */
  on<T>(kind: string, handler: (envelope: EventEnvelope<T>) => void | Promise<void>): () => void

  /** v1.0 — exactly-once. */
  once<T>(kind: string, handler: (envelope: EventEnvelope<T>) => void | Promise<void>): () => void

  /** v1.0 — DLQ inspection. */
  getDLQ(): readonly { readonly envelope: EventEnvelope<unknown>; readonly handlerId: string; readonly error: Error }[]

  /** v1.0 — recent events by kind. */
  trace(opts: { kind?: string; since?: number; limit?: number }): Promise<readonly EventEnvelope<unknown>[]>

  readonly contractVersion: { readonly major: 1; readonly minor: 0 }
}
```

**Enforcement point:** `src/engines/capability-event-bus-v2.ts:46` (kernel impl). V1 bus at `src/engines/capability-event-bus.ts:165` is preserved behind the bridge per Constitution Rule F.

**Namespace rule (post-REASSESSMENT Gap-13):** kind MUST use **dot** separator, not colon. Kernel events are `kernel.<name>` (e.g. `kernel.plugin.installed`, `kernel.provider.state_changed`). Plugin events are `plugin.<pluginId>.<name>` (e.g. `plugin.acme.invoicer.invoice_created`). V1 events mirrored to V2 are `legacy.<type>` (e.g. `legacy.provider:seeded`).

**Consumer:** K1 plugins (publish + subscribe); kernel (publishes lifecycle events); observability (subscribes to wildcard for the dev console firehose).

---

### C-05 — `IProviderAdapter` + `AdapterError` (REVISED post-REASSESSMENT Gap-4)

```ts
export type ProviderTransport = 'http' | 'unix-socket' | 'named-pipe' | 'in-process'

export interface ProviderConnection {
  readonly transport: ProviderTransport
  readonly baseUrl?: string
  readonly socketPath?: string
  readonly processId?: number
}

export type AdapterError =
  | { readonly kind: 'transient'; readonly retryable: true; readonly message: string; readonly cause?: unknown }
  | { readonly kind: 'permanent'; readonly retryable: false; readonly message: string; readonly cause?: unknown }
  | { readonly kind: 'rate_limited'; readonly retryAfterMs: number; readonly message: string }
  | { readonly kind: 'auth'; readonly retryable: false; readonly message: string }
  | { readonly kind: 'aborted'; readonly signal: AbortSignal }
  | { readonly kind: 'unknown'; readonly retryable: false; readonly message: string; readonly cause?: unknown }

export interface IProviderAdapter {
  readonly providerId: ProviderId
  readonly manifest: ProviderManifest

  initialize(connection: ProviderConnection, config?: unknown): Promise<void>
  health(signal?: AbortSignal): Promise<ProviderHealth>
  listModels(signal?: AbortSignal): Promise<readonly ModelDescriptor[]>

  /**
   * Stream AIRequest → AIEvent. MUST:
   *  - Translate native exceptions to `AdapterError` (yield an event of kind 'error' with
   *    `error: AdapterError` rather than throwing).
   *  - Honor signal: if AbortSignal is triggered, terminate the iterator with an
   *    'aborted' AdapterError. Never throw raw AbortError.
   *  - Yield at least one final event of kind 'done' or 'error' before completing.
   */
  execute(request: AIRequest, signal: AbortSignal): AsyncIterable<AIEvent>

  /**
   * Cancel the request. Idempotent. Returns when the kernel has ACKNOWLEDGED the cancel;
   * the stream may not have terminated yet — callers should still consume the AsyncIterable
   * until it yields { kind: 'done' } or { kind: 'error' }. After cancel, no further events
   * are emitted by the kernel for this request.
   */
  cancel(requestId: RequestId): Promise<void>

  readonly contractVersion: { readonly major: 1; readonly minor: 0 }
}
```

**Enforcement point:** the kernel wires the adapter to a `ProviderConnection`; the adapter never spawns processes (`src/ai/runtime/supervisor.ts:7`). The `IProviderRegistry` validates `setState` with `expectedCurrentState` (TOCTOU defense; see C-06).

**Consumer:** First-party OpenAI-compatible adapter; future third-party browser-provider plugin (v2); simulator (deprecated).

**V1 version:** `VIVIM_AI_PROTOCOL = { major: 1, minor: 1, version: '1.1' }`.

---

### C-06 — `IProviderRegistry` (with `expectedCurrentState` TOCTOU defense — REVISED Gap-7)

```ts
export const PROVIDER_TRANSITIONS: Readonly<Record<ProviderState, readonly ProviderState[]>> = {
  discovered: ['installed', 'failed'],
  installed: ['validating', 'failed'],
  validating: ['enabled', 'failed'],
  enabled: ['starting', 'disabled'],
  starting: ['ready', 'failed'],
  ready: ['active', 'degraded', 'draining', 'stopped'],
  active: ['degraded', 'unhealthy', 'draining'],
  degraded: ['active', 'unhealthy', 'draining'],
  unhealthy: ['degraded', 'draining', 'failed'],
  draining: ['stopped', 'failed'],
  disabled: ['enabled', 'stopped'],
  stopped: ['starting', 'discovered'],
  failed: ['discovered'],
} as const

export interface IProviderRegistry {
  register(provider: ProviderManifest): Promise<void>
  unregister(providerId: ProviderId): Promise<void>  // calls IExecutionManager.drainProvider first
  get(providerId: ProviderId): Promise<ProviderManifest | undefined>
  list(): Promise<readonly ProviderManifest[]>
  has(providerId: ProviderId): Promise<boolean>

  /**
   * Transition the provider state. ATOMIC via per-provider Mutex.
   * @param expectedFrom the state the caller asserts. Throws ConcurrentStateChangeError
   *   if the actual current state differs (TOCTOU defense — see REASSESSMENT Gap-7).
   *   Pass undefined to skip the check (UNSAFE; only for kernel internal use).
   */
  setState(
    providerId: ProviderId,
    to: ProviderState,
    expectedFrom: ProviderState | undefined
  ): Promise<void>

  getState(providerId: ProviderId): Promise<ProviderState | undefined>
  listAvailable(): Promise<readonly ProviderManifest[]>
  unregisterByProvider(providerId: ProviderId): Promise<void>  // cascades to IModelRegistry

  readonly contractVersion: { readonly major: 1; readonly minor: 0 }
}
```

**Enforcement point:** the per-provider `Mutex` is acquired before read+write, eliminating the TOCTOU race. `setState` throws `ConcurrentStateChangeError` if the actual current state differs from `expectedFrom`. `unregister` calls `IExecutionManager.drainProvider(providerId)` first.

**Consumer:** K0 (kernel — `Gateway.installProvider`/`removeProvider`/`enableProvider`); K1 plugins that want to know which providers are available.

---

### C-09 — `IPolicyEnforcer` (with `enforceCapabilityInvocation` — REVISED Gap + REASSESSMENT Change-8)

```ts
export type PolicyDecision =
  | { readonly allowed: true }
  | { readonly allowed: false; readonly reason: string; readonly code: AIErrorCode }

export interface IPolicyEnforcer {
  /** Called at the moment of network egress. MUST abort on deny. NOT advisory. */
  enforceNetwork(request: AIRequest, target: { url?: string; providerId: ProviderId; model: ModelDescriptor }): Promise<PolicyDecision>

  /** Called at the moment of tool execution. MUST abort on deny. */
  enforceToolInvocation(request: AIRequest, tool: ToolDefinition): Promise<PolicyDecision>

  /** NEW (REASSESSMENT Change-8). The capability-abuse defense. Called by IExecutionManager
   *  every time a plugin invokes a capability (its own or another plugin's). The default
   *  deny: caller has no `capability:invoke` permission, OR callee's capability is not in
   *  the caller's allowlist, OR caller is suspended. The kernel's first defense; the
   *  per-capability allowlist is the kernel's second. */
  enforceCapabilityInvocation(
    caller: { readonly pluginId: PluginId; readonly permissions: readonly PluginPermission[] },
    callee: { readonly pluginId: PluginId; readonly capabilities: readonly string[] },
    capabilityId: string
  ): Promise<PolicyDecision>

  readonly contractVersion: { readonly major: 1; readonly minor: 0 }
}
```

**`enforceCapabilityInvocation` is the missing piece** identified in REASSESSMENT Change-8. Without it, a plugin can call *any* exposed capability of *any* other plugin. With it, the kernel denies by default and grants only when:
- Caller's permissions include `capability:invoke`.
- Callee's `capabilities` array includes `capabilityId` *or* the callee has declared a public allowlist that includes `caller:pluginId` for that capability.
- Caller is not suspended (mid-uninstall).

**Enforcement point:** every `IExecutionManager.create()` that crosses a plugin boundary (i.e. is invoked by `IPluginContext.capabilities.invoke`) calls `enforceCapabilityInvocation` first. The kernel emits `policy.denied` to the bus with the reason.

**Consumer:** kernel (at every cross-plugin capability call); K1 plugins (read-only — they never call this directly; the kernel calls it on their behalf).

**V1 version:** `1.0`. Distinct from `IPolicyEvaluator` (C-08 in the trust model), which is the first-party scoring engine.

---

### C-10 — `IExecutionManager` (with `drainProvider` + `forceStopProvider` separation — REVISED Gap-5)

```ts
export interface IExecutionManager {
  /** Creates and schedules an execution. Provider selection has NOT happened yet. */
  create(request: AIRequest): Promise<ExecutionHandle>

  get(executionId: ExecutionId): Promise<AIExecution | undefined>
  getByRequest(requestId: RequestId): Promise<AIExecution | undefined>
  list(filter?: ExecutionFilter): Promise<readonly AIExecution[]>

  /** MUST propagate cancellation through the Router → Adapter → provider runtime, not just stop reading events. */
  cancel(executionId: ExecutionId, reason?: string): Promise<void>

  snapshot(executionId: ExecutionId): Promise<ExecutionSnapshot | undefined>

  /**
   * Transitions every non-terminal execution to 'draining'. Returns when the longest
   * timeout has elapsed OR all executions are terminal. NEVER throws on timeout —
   * it returns the set of executions that did NOT terminate. The caller decides
   * what to do with them (default: fail them).
   *
   * MUST be called BEFORE `forceStopProvider` or any `IRuntimeSupervisor.stopProvider` call.
   * The kernel enforces this ordering via a per-provider Mutex.
   */
  drainProvider(
    providerId: string,
    opts?: { readonly timeoutMs?: number }
  ): Promise<{
    readonly drained: readonly ExecutionId[]
    readonly stillRunning: readonly ExecutionId[]
  }>

  /**
   * HARD STOPS the provider. MUST only be called AFTER `drainProvider` returned.
   * Throws `DrainTimeoutError` if still-running executions exist after the grace period.
   * The kernel uses this to abort a hung install/uninstall.
   */
  forceStopProvider(
    providerId: string,
    opts?: { readonly graceMs?: number }
  ): Promise<void>

  readonly contractVersion: { readonly major: 1; readonly minor: 0 }
}
```

**Enforcement point:** every uninstall / hot-swap calls `drainProvider` and waits for it. `forceStopProvider` enforces the order via a per-provider Mutex — calling `forceStopProvider` while `drainProvider` is in flight is rejected.

**Consumer:** kernel (router + plugin lifecycle); K0 (provider lifecycle); K1 plugins (cancel their own executions via `ctx.capabilities.invoke` to a `capability:execution:cancel` capability, which the kernel surfaces).

---

### C-12 — `IResourceManager` (with `acquire` + `tryAcquire` two-method split — REVISED Gap-9)

```ts
export type ResourceKind =
  | 'ram-mb' | 'vram-mb' | 'cpu-cores' | 'disk-bytes' | 'gpu-device' | 'concurrent-slot'

export interface ResourceRequest {
  readonly providerId: ProviderId
  readonly kind: ResourceKind
  readonly amount: number
  readonly strict?: boolean  // ignored for the contract; reserved for future use
}

export type ResourceLeaseId = string & { readonly __brand: 'ResourceLeaseId' }

export interface ResourceLease {
  readonly id: ResourceLeaseId
  readonly providerId: ProviderId
  readonly kind: ResourceKind
  readonly amount: number
  readonly acquiredAt: string  // ISO-8601
}

export interface IResourceManager {
  /**
   * Acquire the resource. Throws `CapacityError` on capacity miss.
   * For "give me what you can or skip" semantics, use `tryAcquire`.
   */
  acquire(request: ResourceRequest): Promise<ResourceLease>

  /**
   * Try to acquire the resource. Returns `null` on capacity miss; throws `InvalidRequestError`
   * on malformed request (negative amount, unknown kind, etc.).
   */
  tryAcquire(request: ResourceRequest): Promise<ResourceLease | null>

  renew(leaseId: ResourceLeaseId, additionalAmount?: number): Promise<ResourceLease>

  release(leaseId: ResourceLeaseId): Promise<void>
  snapshot(kind?: ResourceKind): Promise<readonly ResourceSnapshot[]>

  readonly contractVersion: { readonly major: 1; readonly minor: 0 }
}

export class CapacityError extends Error {
  constructor(public readonly kind: ResourceKind, public readonly requested: number, public readonly available: number) {
    super(`CapacityError: requested ${requested} of ${kind}, only ${available} available`)
  }
}

export class InvalidRequestError extends Error {
  constructor(message: string) { super(message) }
}
```

**Enforcement point:** the kernel asks `IRuntimeSupervisor.resources` for a snapshot to influence routing and to gate hot-swap decisions. `acquire` is for "I need this" (throw on miss); `tryAcquire` is for "give me what you can" (return null on miss). The two methods disambiguate the "miss" vs "invalid" cases.

**Consumer:** kernel only.

---

### C-13 — `SandboxPolicy` (unified iframe + QuickJS)

```ts
export interface SandboxPolicy {
  /** Type-level false. The renderer throws if this is not false. */
  readonly allowInlineScript: false

  /** Iframe CSP. */
  readonly csp: string

  /** Capability allow-list. Host-side enforced. */
  readonly allowCapabilities: readonly string[]

  /** Watchdog. */
  readonly budgetMs: number

  /** SandboxRunner (QuickJS) settings. */
  readonly canFetch: readonly string[]
  readonly canReadFile: readonly string[]
  readonly canWriteFile: readonly string[]
  readonly canUseClipboard: boolean
  readonly sandboxBudget: { readonly cpuMs: number; readonly memoryBytes: number }

  /** Which backend to use. */
  readonly backend: 'iframe' | 'quickjs' | 'auto'

  readonly contractVersion: { readonly major: 1; readonly minor: 0 }
}
```

**Enforcement point:**
- `SandboxedNode.tsx:73` — type-level `allowInlineScript: false` plus runtime check (`throw P8 violation`).
- `SandboxedNode.tsx:103` — `allowCapabilities` checked before every `bridge:capability:request`.
- `SandboxedNode.tsx:153` — `<script>` body stripped.
- `SandboxedNode.tsx:157` — CSP via `<meta>`.
- `SandboxedNode.tsx:240` — `budgetMs` watchdog.
- `SandboxedNode.tsx:268` — `sandbox="allow-scripts"` (no `allow-same-origin`).
- `sandbox-runner.ts:36-44` — `vm` fallback gated by `VIVIM_UNSAFE_VM=1`.
- `sandbox-runner.ts:13-16` — `SandboxBudget` enforced.
- `sandbox-runner.ts:42` (post-REASSESSMENT P0-3) — `vm` fallback throws at boot in production.

**Consumer:** K0 (host) enforces for K3 (iframe and QuickJS). K1/K2 plugins supply a `SandboxPolicy` when contributing a sandboxed component.

---

### C-14 — `INodeStoreContract`

```ts
export interface INodeStoreContract {
  create(input: NodeCreateInput): Promise<Node>
  get(id: NodeId): Promise<Node | null>
  list(filter: NodeFilter, opts?: { limit?: number; cursor?: string }): Promise<readonly Node[]>
  update(id: NodeId, patch: NodeUpdatePatch): Promise<Node>
  delete(id: NodeId): Promise<void>
  edges(id: NodeId, opts?: { direction?: 'out' | 'in' | 'both'; type?: string }): Promise<readonly NodeEdge[]>
  query(filter: NodeFilter, opts?: { limit?: number; cursor?: string }): Promise<readonly Node[]>  // NEW (C-29)

  readonly contractVersion: { readonly major: 1; readonly minor: 0 }
}
```

**Enforcement point:** `SchemaRegistry.register()` validates payload against the registered Zod schema BEFORE the store accepts the write. Namespace prefix enforcement for plugin callers (P2).

**Consumer:** K0 (kernel); K1/K2 plugins (read/write through their `IPluginContext.storage.scoped()`).

---

### C-15 — `ISchemaRegistry.register(...)` (with `caller` parameter)

```ts
export class SchemaRegistry {
  register(
    schema: ZodTypeAny,
    opts: { caller: 'boot' | { pluginId: string } }
  ): void

  get(type: NodeType): NodeSchema | undefined
  has(type: NodeType): boolean
  all(): readonly NodeType[]
  validate(type: NodeType, data: unknown): { ok: true } | { ok: false; errors: z.ZodError }
  indexContent(type: NodeType, data: unknown): string
  embeddingText(type: NodeType, data: unknown): string

  readonly contractVersion: { readonly major: 1; readonly minor: 0 }
}
```

**Enforcement point:** inside `register`. If `caller = { pluginId }`, the stored key is `plugin:${pluginId}.${localType}` (or `plugin.<pluginId>.<localType>` per the post-REASSESSMENT dot-namespace — see ADR for normalization). Reject `cap-store.*` (or `cap-store.<...>`) for plugin callers. Two plugins with the same local name get different stored keys.

**Consumer:** K0 (boot registers 19 built-ins); K1/K2 plugins register their own types through `IPluginContext.schema.register(...)`.

---

### C-22 — `StreamParserEngine` + `SandboxRunner` (parser chain)

```ts
export interface StreamParserEngineContract {
  load(): Promise<number>
  parse(providerId: ProviderId, rawBody: string, ctx: ParseContext): Promise<ParseResult>
  detectCompletion(providerId: ProviderId, rawBody: string): Promise<boolean>
  getConfidence(providerId: ProviderId, rawBody: string): Promise<number>

  readonly contractVersion: { readonly major: 1; readonly minor: 0 }
}
```

**Enforcement point:** the parser `LOGIC_CODE` runs in `SandboxRunner` (QuickJS) — never in the host V8. The kernel owns the chain; concrete parsers live in `seeds/parsers/harvested/*.ts` (K1, per REASSESSMENT Gap-7 fix) and are uploaded to DB at boot.

**Consumer:** K0 (ConversationManager-style callers) for all streamed responses; K1 plugins can register new parsers through the existing seed mechanism.

---

### C-23 — Branded ID types

```ts
export type Brand<T, B extends string> = T & { readonly __brand: B }
export type RequestId = Brand<string, 'RequestId'>
export type ProviderId = Brand<string, 'ProviderId'>
export type ModelId = Brand<string, 'ModelId'>
export type SessionId = Brand<string, 'SessionId'>
export type ToolCallId = Brand<string, 'ToolCallId'>
export type EventId = Brand<string, 'EventId'>
export type PluginId = Brand<string, 'PluginId'>
export type WorkspaceId = Brand<string, 'WorkspaceId'>

export const requestId = (v: string): RequestId => v as RequestId
// ... etc

export const KERNEL_CONTRACT_VERSION = { major: 1, minor: 0 } as const
```

**Enforcement point:** TypeScript compile time. The runtime check is in the certifier (PLUGIN-CONTRACTS P-15).

**Consumer:** every kernel and plugin file.

---

### C-33..C-39 — The M-layer (self-descriptive surface)

The kernel is **natively self-descriptive**. The M-layer answers four questions: *what am I?* (M1), *where did I come from?* (M2), *why am I the way I am?* (M3), *how do I fit?* (M4). Full architecture in `inventory/SELF-DESCRIPTIVE.md`; the seven contracts below are the surface. The four laws of the M-layer (co-generation, honesty, self-application, bounded cost) are normative.

The M-layer is **co-generated at boot** from the same source the kernel boots from. Every export in `src/kernel/**`, every interface, every class, every configuration value, every event kind, every plugin manifest — gets a `IdentityCard` (M1), a `ProvenanceRecord` (M2), a `RationaleNote` (M3), and a `RelationEdge` (M4) — without a separate documentation pipeline. The catalog cannot drift; the M-layer is regenerated on every boot.

#### C-33 — `IIdentityCatalog` (M1 — what am I?)

```ts
export type IdentityKind =
  | 'kernel-subsystem'        // e.g. 'IPluginManager'
  | 'kernel-contract'         // e.g. 'C-01'
  | 'kernel-class'            // e.g. 'PluginHost'
  | 'kernel-type'             // e.g. 'NodeType'
  | 'plugin'                  // e.g. 'plugin:discord'
  | 'plugin-capability'       // e.g. 'plugin:discord:send'
  | 'plugin-node-type'        // e.g. 'plugin:discord.message'
  | 'plugin-event'            // e.g. 'plugin:discord.message.sent'
  | 'config-key'              // e.g. 'config.engine.provider-mux.timeout-ms'
  | 'bus-event'               // e.g. 'kernel.plugin.installed'
  | 'prisma-model'            // e.g. 'Conversation'

export interface IdentityCard {
  readonly id: string                       // reverse-DNS or dot-namespaced
  readonly kind: IdentityKind
  readonly displayName: string              // human: 'IPluginManager (host)'
  readonly shortDescription: string        // human: 1 sentence
  readonly longDescription: string         // human: 1-3 paragraphs, structured markdown
  readonly sourceLocation: string          // file:line, e.g. 'src/ai/plugins/manager.ts:27'
  readonly contractVersion: { major: number; minor: number }  // numeric, where applicable
  readonly stability: 'experimental' | 'stable' | 'deprecated' | 'removed'
  readonly supersedes: readonly string[]
  readonly supersededBy: string | null
  readonly tags: readonly string[]
  readonly examples: readonly { readonly description: string; readonly code: string }[]
  readonly children: readonly string[]
  readonly parent: string | null
  readonly capabilities: readonly string[]  // kernel capabilities this exposes
  readonly see: readonly string[]          // M2 / M3 / M4 references
}

export interface IIdentityCatalog {
  list(filter?: { readonly kind?: IdentityKind; readonly tag?: string }): Promise<readonly IdentityCard[]>
  get(id: string): Promise<IdentityCard | undefined>
  describe(id: string, opts?: { readonly include?: ('children' | 'provenance' | 'rationale' | 'graph')[] }): Promise<{ readonly markdown: string }>
  readonly contractVersion: { readonly major: 1; readonly minor: 0 }
}
```

**Enforcement point:** at boot, the kernel walks `src/kernel/**`, `src/storage/contracts/**`, and the installed plugins' manifests, and generates one `IdentityCard` per artifact. The `longDescription` is parsed from a `@doc` JSDoc tag on the export; the `shortDescription` is the first line of the long.

**Consumer:** the kernel's own `/kernel.identity` API; any plugin that wants to introspect the system (including `plugin:plugin-authoring` from the cake).

#### C-34 — `IProvenanceStore` (M2 — where did I come from?)

```ts
export type ArtifactKind = 'contract' | 'subsystem' | 'plugin' | 'capability' | 'class' | 'config' | 'adr' | 'doc'

export interface ProvenanceRecord {
  readonly artifactId: string
  readonly kind: ArtifactKind
  readonly createdAt: string                              // ISO-8601
  readonly createdBy: string                              // 'agent (E2E owner)' | 'I-2 deep probe' | 'human:<name>' | ...
  readonly approvedBy: readonly string[]                   // e.g. ['two-reviewer gate (P0-1)', 'I-1 formalization']
  readonly parent: readonly string[]                       // upstream artifact ids this was derived from
  readonly children: readonly string[]                     // downstream artifact ids derived from this
  readonly supersededBy: string | null
  readonly reason: string                                  // 'VIVIM-as-its-own-plugin' / 'TOCTOU defense' / 'capability-abuse defense' / ...
  readonly evidence: readonly string[]                     // ['REASSESSMENT.md Gap-7', 'inventory/FALSE-CORE-AND-MISSING.md item 13']
  readonly change: { readonly summary: string; readonly ticket?: string }
  readonly tags: readonly string[]
}

export interface IProvenanceStore {
  get(artifactId: string): Promise<ProvenanceRecord | undefined>
  list(filter?: { readonly kind?: ArtifactKind; readonly tag?: string; readonly approvedBy?: string }): Promise<readonly ProvenanceRecord[]>
  why(artifactId: string): Promise<{ readonly markdown: string }>
  readonly contractVersion: { readonly major: 1; readonly minor: 0 }
}
```

**Enforcement point:** the `inventory/REASSESSMENT.md` table-of-gaps, the 7 ADRs, and the per-decision rationale in `inventory/BOUNDARY-CONSTITUTION.md` are parsed at boot. The `evidence` field references the source-of-truth docs.

**Consumer:** `IIdentityCatalog.describe(id, { include: ['provenance'] })`; the `why` capability is exposed to the user.

#### C-35 — `IRationaleCatalog` (M3 — why am I the way I am?)

```ts
export type DecisionType = 'architectural' | 'security' | 'naming' | 'compatibility' | 'performance' | 'ergonomics' | 'other'

export interface AlternativeConsidered {
  readonly name: string
  readonly description: string
  readonly rejectedBecause: string
}

export interface RationaleNote {
  readonly id: string                                    // e.g. 'rationale.kernel.dot-namespace'
  readonly decision: string                              // 'Kernel uses dot-namespaced event kinds, not colon.'
  readonly type: DecisionType
  readonly context: string                               // why this decision was on the table
  readonly chosen: string                                // the choice
  readonly alternatives: readonly AlternativeConsidered[]
  readonly consequences: readonly string[]               // what this enables / blocks
  readonly supersedes: readonly string[]                  // prior rationale ids this overrides
  readonly supersededBy: string | null
  readonly refs: readonly string[]                       // 'REASSESSMENT.md Gap-13', 'KERNEL-CONTRACTS.md §5', ...
}

export interface IRationaleCatalog {
  get(id: string): Promise<RationaleNote | undefined>
  list(filter?: { readonly type?: DecisionType; readonly ref?: string }): Promise<readonly RationaleNote[]>
  why(decision: string, opts?: { readonly depth?: 'one-line' | 'short' | 'full' }): Promise<{ readonly markdown: string }>
  readonly contractVersion: { readonly major: 1; readonly minor: 0 }
}
```

**Enforcement point:** the rationale is **co-generated** with the source. Every `RationaleNote` is either (a) extracted from a `@rationale` JSDoc tag on the relevant contract, (b) parsed from the 6 constitutional rules, (c) parsed from the 7 ADRs, or (d) parsed from the 14 REASSESSMENT gaps. The kernel cannot lie because the rationale is in the same file as the contract.

**Consumer:** `IRationaleCatalog.why(decision)` is exposed as a kernel capability (`kernel.rationale.why`) that the user can invoke.

#### C-36 — `IRelationGraph` (M4 — how do I fit?)

```ts
export type RelationKind =
  | 'consumes'             // A's API is called by B
  | 'depends-on'           // A imports B at runtime
  | 'supersedes'           // A replaces B (B is deprecated)
  | 'paired-with'          // A and B are designed to be used together
  | 'migrates-to'          // A's data is moved to B
  | 'enforces'             // A is enforced by B (e.g. IPolicyEnforcer is enforced by IExecutionManager)

export interface RelationEdge {
  readonly from: string                                    // identity id
  readonly to: string                                      // identity id
  readonly kind: RelationKind
  readonly note: string                                    // short explanation
  readonly evidence: readonly string[]                     // file:line references
}

export interface IRelationGraph {
  outgoing(id: string, opts?: { readonly kind?: RelationKind }): Promise<readonly RelationEdge[]>
  incoming(id: string, opts?: { readonly kind?: RelationKind }): Promise<readonly RelationEdge[]>
  neighbors(id: string): Promise<readonly string[]>
  path(from: string, to: string): Promise<readonly string[]>
  reachable(id: string, hops: number): Promise<readonly string[]>
  /** "What breaks if I change X?" — the transitive closure of inbound consumers. */
  impact(id: string): Promise<readonly string[]>
  readonly contractVersion: { readonly major: 1; readonly minor: 0 }
}
```

**Enforcement point:** the relation graph is **co-generated** with the source. Every `RelationEdge` is either (a) extracted from a `@consumes`, `@depends-on`, `@paired-with`, `@enforces` JSDoc tag, (b) detected by static import analysis (the I-2 deep probe produces the per-file truth map; relations are derived from `import` statements + the boundary rules), or (c) declared in the `inventory/BOUNDARY-MIGRATION-PLAN.md` "Consequences" sections.

**Consumer:** the `impact` capability is the killer feature — a future agent or LLM can ask "what breaks if I change `IPluginManager.install`?" and get the transitive closure of all inbound consumers. **No more archaeology.**

#### C-37 — `IConfigurationCatalog` (M1 for config)

```ts
export interface ConfigCard {
  readonly key: string                                     // e.g. 'engine.provider-mux.timeout-ms'
  readonly displayName: string
  readonly currentValue: unknown                           // what the running kernel has
  readonly defaultValue: unknown
  readonly type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'duration' | 'bytes'
  readonly description: string
  readonly envVar: string | null                          // e.g. 'VIVIM_PROVIDER_MUX_TIMEOUT_MS'
  readonly owner: string                                   // identity id of the subsystem that reads this
  readonly hotReload: boolean                              // can it change at runtime without restart?
  readonly since: { major: number; minor: number }
  readonly deprecated: { since: { major: number; minor: number }; replacement: string | null } | null
}

export interface IConfigurationCatalog {
  list(filter?: { readonly owner?: string; readonly hotReload?: boolean }): Promise<readonly ConfigCard[]>
  get(key: string): Promise<ConfigCard | undefined>
  readonly contractVersion: { readonly major: 1; readonly minor: 0 }
}
```

**Enforcement point:** every `config-manager.ts` schema registration auto-generates a `ConfigCard`. The `currentValue` is read from the live `ConfigManager` instance at call time. The `envVar` is derived from a `@env` JSDoc tag.

**Consumer:** UI panel (admin), `plugin:audit` (logs config changes), `plugin:cli-debug`.

#### C-38 — `IEventCatalog` (M1 for events)

```ts
export interface EventCard {
  readonly kind: string                                    // e.g. 'kernel.plugin.installed'
  readonly direction: 'emitted' | 'consumed' | 'both'
  readonly source: string                                  // identity id of the emitter
  readonly description: string
  readonly payloadSchema: string                            // Zod schema as a string (so the catalog is self-describing)
  readonly examples: readonly { readonly description: string; readonly payload: unknown }[]
  readonly consumers: readonly string[]                    // identity ids of consumers
  readonly since: { major: number; minor: number }
  readonly deprecated: { since: { major: number; minor: number }; replacement: string | null } | null
}

export interface IEventCatalog {
  list(filter?: { readonly source?: string; readonly direction?: 'emitted' | 'consumed' | 'both' }): Promise<readonly EventCard[]>
  get(kind: string): Promise<EventCard | undefined>
  readonly contractVersion: { readonly major: 1; readonly minor: 0 }
}
```

**Enforcement point:** every `IEventBus.publish` call site has a `@emits` JSDoc tag; every `IEventBus.on` call site has a `@consumes` tag. The static analyzer walks the source.

#### C-39 — `IWhy` (the user-facing entry point)

```ts
export interface IWhy {
  /**
   * The single user-facing entry point to the M-layer. Takes a free-text question
   * (a substring of a name, a kind, a tag) and returns a markdown answer.
   *
   * The kernel does NOT use an LLM. It uses a deterministic text-matching algorithm
   * over the four catalogs. The answer is grounded in source — it cannot hallucinate.
   *
   * Examples:
   *   why("why is the namespace dot-separated?")  → M3 lookup
   *   why("what breaks if I change IPluginManager.install?")  → M4 impact()
   *   why("IPluginManager")  → M1 describe()
   *   why("where did enforceCapabilityInvocation come from?")  → M2 why()
   *   why("what is VIVIM_PROVIDER_MUX_TIMEOUT_MS?")  → C-37 get()
   */
  why(question: string): Promise<{
    readonly answer: string  // markdown
    readonly sources: readonly string[]   // the catalog entries that grounded the answer
  }>
  readonly contractVersion: { readonly major: 1; readonly minor: 0 }
}
```

**Enforcement point:** the `why(question)` function is a **deterministic router** — it parses the question, classifies it into M1/M2/M3/M4/M37/M38, calls the appropriate catalog, and returns a markdown answer. The router's rules are themselves an `IdentityCard` (`kernel.catalog.why-router`). The kernel's answer cannot lie because the catalog is co-generated with the source.

**This is the user's hook.** A user types "why is the namespace dot-separated?" → the kernel returns a markdown answer with a link to `BOUNDARY-CONSTITUTION.md` and `REASSESSMENT.md Gap-13`. The user types "what breaks if I change IPluginManager.install?" → the kernel returns the transitive closure of inbound consumers. The user types "IPluginManager" → the kernel returns the `IdentityCard`.

---

### C-25..C-32 — The kernel introspection capabilities (PLUGIN-BUILDER-CAKE §6)

Each is a thin wrapper that exposes an existing kernel mechanism as a kernel-registered capability. They share a common shape:

```ts
export interface IContractDescriptor {
  readonly id: string             // e.g. 'plugin-host'
  readonly name: string           // 'PluginHost'
  readonly version: { readonly major: 1; readonly minor: 0 }
  readonly surface: 'interface' | 'function' | 'class'
  readonly location: string      // 'src/kernel/contracts/plugin-host.ts'
  readonly documentation: string  // markdown summary
}

export interface IContractCatalog {
  list(): Promise<readonly IContractDescriptor[]>
  get(id: string): Promise<IContractDescriptor | undefined>
  readonly contractVersion: { readonly major: 1; readonly minor: 0 }
}

export interface IPluginRegistry extends ... {
  // ... existing methods, plus:
  listDescriptors(): Promise<readonly PluginDescriptor[]>
}

export interface IEventBus {
  // ... existing methods, plus:
  trace(opts: { kind?: string; since?: number; limit?: number }): Promise<readonly EventEnvelope<unknown>[]>
}

export interface ISandboxAuditStoreContract {
  query(opts: { pluginId?: PluginId; kind?: string; since?: number; limit?: number }): Promise<readonly SandboxAuditEvent[]>
}

export interface INodeStoreContract {
  // ... existing methods, plus:
  query(filter: NodeFilter, opts?: { limit?: number; cursor?: string }): Promise<readonly Node[]>
}

export interface ISandboxRunnerContract {
  run(code: string, policy: SandboxPolicy, input: unknown): Promise<{
    readonly result: unknown
    readonly auditEvent: SandboxAuditEvent
    readonly cpuMs: number
  }>
}
```

**Capabilities registered** (per PLUGIN-BUILDER-CAKE §6 + post-REASSESSMENT dot-namespace):

- `kernel.contracts.list` → `IContractCatalog.list`
- `kernel.contracts.get` → `IContractCatalog.get`
- `kernel.plugins.list` → `IPluginManager.list`
- `kernel.plugins.get` → `IPluginManager.get`
- `kernel.plugins.install` → `IPluginManager.install`
- `kernel.plugins.certify` → `IPluginManager.certify`
- `kernel.registry.list` → `IProviderRegistry.list`
- `kernel.bus.trace` → `IEventBus.trace`
- `kernel.sandbox.audit` → `ISandboxAuditStore.query`
- `kernel.node.query` → `INodeStoreContract.query`
- `kernel.capability.invoke` → `IExecutionManager` (via `IPluginContext.capabilities.invoke`)
- `kernel.sandbox.run` → `ISandboxRunnerContract.run`

**Self-descriptive capabilities (the M-layer — registered as `kernel.*` capabilities; see `inventory/SELF-DESCRIPTIVE.md`):**

- `kernel.identity.list` → `IIdentityCatalog.list` (C-33)
- `kernel.identity.get` → `IIdentityCatalog.get` (C-33)
- `kernel.identity.describe` → `IIdentityCatalog.describe` (C-33) — the user-facing "?" tooltip
- `kernel.provenance.get` → `IProvenanceStore.get` (C-34)
- `kernel.provenance.why` → `IProvenanceStore.why` (C-34) — "where did X come from?"
- `kernel.rationale.get` → `IRationaleCatalog.get` (C-35)
- `kernel.rationale.why` → `IRationaleCatalog.why` (C-35) — "why is X the way it is?"
- `kernel.graph.outgoing` → `IRelationGraph.outgoing` (C-36)
- `kernel.graph.incoming` → `IRelationGraph.incoming` (C-36)
- `kernel.graph.impact` → `IRelationGraph.impact` (C-36) — "what breaks if I change X?"
- `kernel.config.list` → `IConfigurationCatalog.list` (C-37)
- `kernel.config.get` → `IConfigurationCatalog.get` (C-37)
- `kernel.events.list` → `IEventCatalog.list` (C-38)
- `kernel.events.get` → `IEventCatalog.get` (C-38)
- `kernel.why` → `IWhy.why` (C-39) — the user-facing free-text question router

The kernel exposes its own self-description through the same capability mechanism every plugin uses. **The M-layer is not a documentation system; it is a runtime contract.**

**Enforcement point:** each capability is implemented as a small wrapper (5-30 lines) in `src/kernel/plugin-kernel/capabilities/<name>.ts` that calls into the existing kernel method. The capability's *contract* is the existing C-01..C-24 + C-29 contract; the capability is just a named entry into it.

**Consumer:** every plugin (including `plugin:plugin-authoring` from the cake).

---

## 3. Cross-cutting: what is NOT a kernel contract

To prevent the catalog from growing into a dumping ground:

- `Conversation` (Prisma model) — kernel has the *universal record* `Node`; "conversation" is a VIVIM product vocabulary.
- `EpisodicMemory`, `SemanticMemory` (Prisma models) — kernel has `Node`; memory is VIVIM product.
- `DiscordVoiceState`, `NotionPageMeta`, `SlackChannelMeta` — provider-specific; not even first-party; they belong to provider plugins.
- `WorkflowDefinition`, `WorkflowNode` — first-party (VIVIM workflows).
- `AutonomousTask`, `HitlGate` — first-party (VIVIM agent plugin).
- `McpServerConfig`, `McpTool` — first-party; the MCP *transport* is universal but the *configuration* is product.
- `StealthLaunchProfile`, `StealthPolicy` — first-party (browser-automation plugin).
- `RoutingPreference`, `MuxSession` — first-party (provider routing).
- `CapabilityTaxonomyV2` (the 60-entry array) — first-party; the kernel has no opinion on what VIVIM's chat capabilities are named.
- The 30+ `frontend/src/components/canvas/*.tsx` UI components — K1; the kernel has `SandboxedNode` and the slot system, not the components.

If a subsystem is "important to VIVIM," that makes it a first-party plugin candidate, not a kernel contract. The decision test is the inverse: would a third-party developer need to implement this themselves to ship a plugin? If no, it is product.

---

## 4. The compatibility guarantee (numeric)

For each contract above, the version field is `contractVersion: { major: N, minor: M }`. A plugin certified against `C-XX@{major: N, minor: <=M}` loads on a kernel exposing `C-XX@{major: N, minor: >=M'}` where `M' >= M` and the major has not moved.

**Kernel commits:**
- A contract's major version **never** decreases.
- A contract's minor version is bumped on additive change.
- A contract's major version is bumped on breaking change.
- The kernel announces a major version bump at least 6 months in advance; the certifier rejects a plugin certified against the prior major.

**Post-REASSESSMENT addition:** every contract has a `contractVersion` field. The arch test `KERNEL-BOUNDARY-TESTS.md` §2.12 enforces this by walking `src/kernel/**` and checking every exported `interface` has `contractVersion: { major: 1; minor: 0 }` as a member.

**What this means in practice for v1:** the kernel ships with all the above contracts at major=1, minor=0. First-party plugins today that import `BootstrapContext` instead of `IPluginContext` (Constitution Rule C) are an **architectural bug**, not a compatibility signal — fix them in P0-1.

---

## 5. The audit surface (post-REASSESSMENT — dot namespace)

Every contract call is observable. The `IEventBus` (C-03) carries events for:

- `kernel.plugin.installed`, `kernel.plugin.uninstalled`, `kernel.plugin.enabled`, `kernel.plugin.disabled`, `kernel.plugin.upgraded`
- `kernel.plugin.certify.passed`, `kernel.plugin.certify.failed`
- `kernel.provider.state_changed`, `kernel.provider.health_changed`, `kernel.provider.crashed`
- `kernel.execution.created`, `kernel.execution.cancelled`, `kernel.execution.completed`, `kernel.execution.failed`
- `kernel.resource.pressure`, `kernel.resource.lease_denied`
- `kernel.sandbox.csp_violation`, `kernel.sandbox.capability_denied`, `kernel.sandbox.crash`, `kernel.sandbox.budget_timeout`
- `kernel.policy.denied` (with reason code) — **post-REASSESSMENT** includes `enforceCapabilityInvocation` denials
- `kernel.audit.recorded`

A plugin may subscribe to any of these events but may **not** publish an event whose `kind` does not start with `plugin.<pluginId>.` (namespace enforcement at the bus level; see `KERNEL-BOUNDARY-TESTS.md` §2.11). Legacy V1 events mirrored to V2 use the `legacy.` prefix to prevent double-fire (see §2.20 in the boundary tests).

The kernel writes to the durable `EventRecord` outbox. The V2 bus ring buffer (`capability-event-bus-v2.ts:50-53`) is the in-memory complement; the DLQ catches handler failures.

---

## 6. Post-REASSESSMENT summary of changes

This revision:

- **C-02** — added the full `ISandboxHost` + `ISandboxInstance` + `SandboxComponentInput` + `SandboxAuditEvent` + `IPluginScopedStore` types (Gap-3).
- **C-03** — added `trace()`; normalized namespace from `provider:seeded` to `provider.seeded` (Gap-13); `legacy.` prefix for V1 mirror.
- **C-05** — added `AdapterError` discriminated union (Gap-4); explicit `cancel` semantics.
- **C-06** — added `expectedFrom` TOCTOU defense (Gap-7); per-provider `Mutex` documented.
- **C-09** — added `enforceCapabilityInvocation` (REASSESSMENT Change-8 — the missing capability-abuse defense).
- **C-10** — added `forceStopProvider`; documented `drainProvider` + `forceStopProvider` ordering.
- **C-12** — added `tryAcquire` (Gap-9); added `CapacityError` + `InvalidRequestError`.
- **C-14** — added `query()` (C-29 surface).
- **C-25..C-32** — formal contract shapes (not just capability names); `IContractCatalog` as a real type.
- **§5** — namespace normalized to `kernel.*` and `plugin.<id>.*` with dots; `legacy.` prefix for V1 events; `kernel.policy.denied` includes capability-abuse denials.
- **`KERNEL_CONTRACT_VERSION` constant** — single source of truth for the contract version.
- **Every `interface` declares `contractVersion: { major: 1; minor: 0 }`** as a member, enforced by `KERNEL-BOUNDARY-TESTS.md` §2.12.

**Net: every contract with `...` or hand-waved "the kernel catches" is now fully typed. Every contract is versioned. Every consumer is named. The audit surface is dot-namespaced. The kernel is self-descriptive via C-33..C-39 (M-layer). The kernel's deterministic intelligence substrate is K0(L0) via C-40..C-44 (see `inventory/LAYER-0-INTELLIGENCE.md`).**

---

### C-40..C-44 — Layer 0 (K0(L0)) — The Deterministic Intelligence Substrate

The kernel is **natively intelligent**. Its NLP, CLI, embedding, budget, and command-pipeline **mechanisms** are inside the kernel boundary; the **content** (LLM, OpenCode, agents) is first-party. See `inventory/LAYER-0-INTELLIGENCE.md` for the full architecture. The five contracts below codify the K0(L0) surface. They join C-01..C-39 as kernel-stable, versioned contracts.

The K0(L0) principle: **the kernel can boot without any LLM service, any opencode subprocess, any Chrome browser, or any first-party plugin. The LLM is a *registered capability* (`kernel.nlcl.llm-fallback`), not a kernel dependency.**

#### C-40 — `INLCLLayeredPipeline` (the 6-layer pipeline shape)

```ts
export type ResolutionLayer = 'deterministic' | 'fuzzy' | 'semantic' | 'classifier' | 'llm' | 'none'

export interface IResolvedIntent {
  readonly patternId: string
  readonly intent: string
  readonly input: Record<string, unknown>
  readonly confidence: number
  readonly layer: ResolutionLayer
  readonly alternatives: readonly IResolvedIntent[]
  readonly capabilityId: string | null
  readonly classification: 'read' | 'write' | 'navigate' | 'destructive' | 'communication' | 'financial' | 'system'
}

export interface IIntentResolver {
  readonly name: string
  readonly layer: ResolutionLayer
  /** MUST be deterministic + local for layers 1-3. Layer 4 (LLM) is the only one that may be optional + remote. */
  readonly deterministic: boolean
  resolve(rawInput: string, ctx: NLCContext): Promise<IResolvedIntent | null>
}

export interface INLCLLayeredPipeline {
  /** Resolve a natural-language input to an intent. Deterministic. Local-first. */
  resolve(rawInput: string, ctx: NLCContext): Promise<IResolvedIntent | null>
  /** Route the intent to an executor. Returns the executor that will run it. */
  route(intent: IResolvedIntent, ctx: NLCContext): Promise<{ readonly executorId: string; readonly input: Record<string, unknown> }>
  /** Last layer that resolved an intent. For telemetry / Oracle. */
  getLastLayer(): ResolutionLayer
  /** Re-register a sub-resolver (for upgrading the substrate without rebooting). */
  registerLayer(layer: ResolutionLayer, resolver: IIntentResolver): void
  readonly contractVersion: { readonly major: 1; readonly minor: 0 }
}
```

**Enforcement point:** the kernel instantiates one `LayeredResolver` at boot. The pipeline shape is fixed (6 layers); the sub-resolvers are configurable via `registerLayer`. The LLM layer is **only** a layer 4 — if no LLM resolver is registered, the pipeline falls through to `none` (per the existing `LayeredResolver:140`).

**Consumer:** every command interpreter — the CLI REPL, the HTTP `/api/interpret` route, the frontend chat box, the MCP `kernel:tools:invoke` — calls the same `interpret` function.

#### C-41 — `IEmbeddingProvider` (the embedding contract)

```ts
export interface IEmbeddingProvider {
  readonly name: string
  readonly dimensions: number
  readonly local: boolean

  /** Warm up (load model, init state). Idempotent. MUST be cancel-safe. */
  init(): Promise<void>
  embed(text: string): Promise<number[]>
  embedBatch(texts: string[]): Promise<number[][]>
  /** Release resources. Called on plugin uninstall + kernel shutdown. */
  dispose(): void
  readonly contractVersion: { readonly major: 1; readonly minor: 0 }
}
```

**Enforcement point:** the kernel ships a default `TfIdfEmbeddingProvider` (K0, zero deps, zero network). A `HfEmbeddingProvider` is a K0(L0) optional upgrade — degrades to TF-IDF if the model cannot be loaded. An `OllamaEmbeddingProvider` is K1 (requires Ollama service).

**Upgrade mechanism:** the kernel exposes `kernel.embeddings.set-provider(provider)` as a K0 capability — a first-party plugin (or a config change at boot) can swap the provider without rebooting.

#### C-42 — `IBudgetGuard` (the budget engine shape)

```ts
export interface RunUsage {
  readonly requests: number
  readonly toolCalls: number
  readonly inputTokens: number
  readonly outputTokens: number
  readonly totalTokens: number
  readonly costCents: number
}

export interface UsageLimits {
  readonly requestLimit?: number | null
  readonly toolCallsLimit?: number | null
  readonly inputTokensLimit?: number | null
  readonly outputTokensLimit?: number | null
  readonly totalTokensLimit?: number | null
}

export interface IBudgetGuard {
  checkBeforeRequest(runId: string, usage: RunUsage, limits: UsageLimits): void
  checkAfterResponse(usage: RunUsage, limits: UsageLimits): void
  checkBeforeToolCall(usage: RunUsage, limits: UsageLimits): void
  accrue(runId: string, costCents: number, tokens?: number): Promise<void>
  guard(runId: string, kind: 'cost' | 'tokens' | 'iterations' | 'duration', used: number, limit: number): Promise<void>
  describe(): { readonly activeLimits: ReadonlyArray<{ readonly runId: string; readonly limits: UsageLimits }> }
  readonly contractVersion: { readonly major: 1; readonly minor: 0 }
}
```

**Enforcement point:** the kernel instantiates a default `BudgetEngine` at boot. The `ExecutionKernel` (C-10) calls `checkBeforeRequest` / `checkAfterResponse` / `checkBeforeToolCall` at the right stages. A first-party plugin (e.g. `plugin:cost`) can swap the implementation via `kernel.budget.set-guard(guard)`.

#### C-43 — `ICommandPipeline` (the CLI + NLCL + route + execute kernel)

```ts
export interface ICommandPipeline {
  /** The single entry point for any command. Used by REPL, HTTP, frontend chat, MCP. */
  interpret(rawInput: string, ctx: NLCContext): Promise<CommandResult>
  /** Register a command pattern (used by first-party plugins and the kernel's own builtin commands). */
  registerPattern(pattern: CommandPattern): void
  /** Register an executor (used by first-party plugins). */
  registerExecutor(executor: CommandExecutor): void
  /** List registered patterns (for the M-layer's IIdentityCatalog, the cake's P0, the help resolver). */
  listPatterns(filter?: { readonly surface?: NLCLSurface }): readonly CommandPattern[]
  /** List registered executors. */
  listExecutors(): readonly string[]
  /** The deterministic help resolver (for "what does command X do?"). */
  help(intent: string): Promise<{ readonly markdown: string }>
  readonly contractVersion: { readonly major: 1; readonly minor: 0 }
}
```

**The CLI REPL, the HTTP `/api/interpret` route, the frontend chat box, and the MCP `kernel:tools:invoke` all call the same `interpret` function.** One entry point. One pipeline. The kernel owns the pipeline; plugins contribute patterns + executors.

#### C-44 — `IIntelligenceRegistry` (the upgrade + introspection bus)

```ts
export interface IIntelligenceSubstrate {
  readonly name: string                                          // e.g. 'nlcl-pipeline' | 'embeddings' | 'budget' | 'classifier' | 'help'
  readonly version: { readonly major: number; readonly minor: number }
  /** Hot-swap the substrate at runtime. Used by the cake's P1 codegen and by the M-layer's IWhy. */
  setProvider(name: string, instance: unknown): Promise<void>
  /** For the M-layer's IIdentityCatalog + IProvenanceStore: the substrate's M1 card. */
  describe(): {
    readonly name: string
    readonly version: { readonly major: number; readonly minor: number }
    readonly capabilities: readonly string[]
    readonly deps: readonly string[]
  }
}

export interface IIntelligenceRegistry {
  register(name: string, substrate: IIntelligenceSubstrate): void
  get(name: string): IIntelligenceSubstrate | undefined
  list(): readonly IIntelligenceSubstrate[]
  /** For the M-layer's IRelationGraph: the substrate's inbound + outbound relations. */
  describe(name: string): Promise<{ readonly markdown: string }>
  readonly contractVersion: { readonly major: 1; readonly minor: 0 }
}
```

**This is the kernel's "intelligence bus" — the place where every swappable substrate (embeddings, classifier, pipeline, budget) is registered.** A new embedding model? `kernel.intelligence.register('embeddings', newEmbedder)`. A new classifier? `kernel.intelligence.register('classifier', newClassifier)`. The M-layer's `IIdentityCatalog` auto-discovers every registered substrate.
