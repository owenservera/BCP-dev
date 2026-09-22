# Reassessment — Gaps, Weak Claims, Better Approaches

> **A frank review of the I-1 forensic reclassification package.** I re-read every artifact, the 7 ADRs, the inventory v3, the migration plan, the boundary tests, the verdict, the builder cake, the self-descriptive constitution, and the Layer 0 intelligence substrate. This document surfaces the gaps I missed, the claims that need stronger grounding, and the better approaches I now see. The user asked for honesty; the user gets it.
>
> The artifacts are *directionally* correct. The architecture is sound. But several specific claims and gaps are worth flagging before the migration starts.
>
> **Post-LAYER-0 addendum (this turn):** the kernel is now *natively intelligent and natively self-descriptive*. The deterministic intelligence substrate (K0(L0), contracts C-40..C-44) and the M-layer (contracts C-33..C-39) are inside the kernel boundary. The kernel can boot without any LLM, any opencode subprocess, or any first-party plugin. See `inventory/LAYER-0-INTELLIGENCE.md` for the architecture and `inventory/SELF-DESCRIPTIVE.md` for the M-layer. This does not change the reassessment's other findings; it adds a new dimension.

---

## 0. Scorecard

| Artifact | Verdict | Confidence | Top issue |
|---|---|---|---|
| `BOUNDARY-CONSTITUTION.md` | **Sound** | 95% | The 4-level model is right; Rule F (kernel-only boot) is the right gate. The "success statement" is the right invariant. |
| `PLUGIN-TRUST-MODEL.md` | **Sound, with one gap** | 85% | The K0–K4 axis is right. But the *tier map* (per-file) and the prior proposal's labels don't fully agree — see Gap-2. |
| `KERNEL-CONTRACTS.md` | **Directionally right, materially incomplete** | 80% | The 24 contracts (C-01..C-24) are real contracts. But several have **a missing field, a wrong enforcement point, or a wrong consumer** — see Gap-3, Gap-4, Gap-5, Gap-7, Gap-10, Gap-12. |
| `PLUGIN-CONTRACTS.md` | **Directionally right, P-05 + P-06 + P-12 incomplete** | 80% | The 17 contracts (P-01..P-17) are real. The Zod schemas are sketches, not finalized. The HTML/CSS contribution shape is not yet final (see Gap-6). The `ui:compiled-component` deferral is the right call. |
| `ATOMIC-INVENTORY-v3.md` | **Mechanically right; some moves need a second pass** | 85% | 194 rows with KEEP/MOVE/SPLIT/MERGE/DEFER decisions. A few rows need a re-check against the live code. |
| `FALSE-CORE-AND-MISSING.md` | **Useful, but item 13 has a bug** | 85% | The 25 false-COREs are good. The 20 missing primitives are right. But item 13 (HarnessCommandRegistry) is **contradicted by the migration plan** (P1-3) and needs reconciliation. |
| `BOUNDARY-MIGRATION-PLAN.md` | **Sequence right, test scope right, but undercounted** | 85% | 8 P0 sub-phases, 4 P1, 5 P2, 36 P3. The P0-8 sub-phase contradicts the PLUGIN-TRUST-MODEL claim that harness is K1 (see Gap-8). |
| `KERNEL-BOUNDARY-TESTS.md` | **18 tests right; 2 of them wrong** | 75% | 18 mechanical tests. Test 2.4 is wrong about how the kernel boundary works (see Gap-1). Test 2.13 under-specifies what "kernel-only boot" means. |
| `AT-FORENSIC-VERDICT.md` | **Right direction; one factual error** | 80% | The top-20 is right. The "15 kernel subsystems" is right. The "~15 tables in the kernel data model" is **off by a small amount** (it's ~15-18, not 15 exactly). The risk register misses the **honest-list risk** (see Gap-11). |
| `PLUGIN-BUILDER-CAKE.md` | **Right framing, weak on a few specifics** | 75% | The cake metaphor is good. P1-04 is questionable (see Gap-9). P2-03 + P2-04 are mis-ordered. The "P5 user-facing UI" is under-constrained. |
| `00-README.md` | **Good pointer document** | 90% | Minor: the `inventory/ATOMIC-INVENTORY.md` (the v1 194-row proposal) is still listed alongside `v3` — should mark v1 as **superseded**, not "the boundary-lock artifact." |

**Overall: 9.5 of 12 artifacts ready for use; 2 need a second pass before the I-2 deep probe; 1 (KERNEL-BOUNDARY-TESTS) needs a careful re-write of 2 specific tests.**

---

## 1. Gap-by-gap (ranked by impact)

### Gap-1 — **HIGH**: Test 2.4 in KERNEL-BOUNDARY-TESTS is the wrong rule

**Current text** (`KERNEL-BOUNDARY-TESTS.md` §2.4):

> **First-party engines cannot reach kernel internals** — `src/engines/**` (excluding `src/engines/kernel/`) whose target is a `src/kernel/*` file, the import must be a contract (an `interface` or `type` export) and the file path must end in `-contract.ts` or the symbol must be a re-exported type. Otherwise fail.

**Problem:** This is the wrong rule. The kernel boundary has **two enforcement points**, not one:

1. **Import direction** — `src/engines/**` must not import from `src/kernel/*-contract.ts` (the kernel's own source). It **may** import from `src/kernel/contracts/*-types.ts` (the *re-export point* for plugin-facing types).
2. **Runtime reach** — even if a first-party engine imports a `type` from a kernel file, the *runtime value* must come through a contract-factory, not a direct `new KernelRegistry()`. TypeScript types vanish at runtime, so the import-direction test alone is insufficient.

**Better approach (rewriting test 2.4):**

```
1. Static: src/engines/** must not import any runtime value from src/kernel/** except
   from a `contracts.ts` barrel file. The barrel re-exports only interfaces/types +
   factory functions named `create*`. Anything else is a violation.

2. Runtime: each contract is exposed to a first-party engine as a `create*` factory
   that returns a *narrowed* instance. The engine never sees the implementation
   class. (Example: `createKernelTracer({...})` returns `KernelTracerContract`,
   not `KernelTracer`.) An arch test scans for direct `new ConcreteClass()` calls
   on kernel classes outside the kernel directory.

3. The exclusion in the original test ("excluding src/engines/kernel/") is correct
   and must be preserved. src/engines/kernel/ is the observability kernel; it is
   part of the kernel surface, not an engine that uses it.
```

**Why it matters:** A test that is "more correct than enforced" is worse than a test that is "less correct but enforced" — engineers learn the wrong invariant. The test as written will pass a PR that uses `new KernelRegistry()` from an engine if `KernelRegistry` is exported from a `*-contract.ts` file (which the kernel would do for the right reasons). That breaks the spirit of Rule C.

**Fix:** rewrite test 2.4 in KERNEL-BOUNDARY-TESTS.md before the I-3 scaffold PR lands. The new test must be enforceable by a static scan (regex + AST walk) AND must be runnable against the real codebase, not a sketch.

---

### Gap-2 — **HIGH**: PLUGIN-TRUST-MODEL per-file table is internally inconsistent with AT-FORENSIC-VERDICT

**Problem:** `PLUGIN-TRUST-MODEL.md` §2 says (for example):

| File / area | Today | Should be |
|---|---|---|
| `src/engines/capability-event-bus-v2.ts` (`CapabilityEventBusV2`) | **K0** | **K0** |

But `AT-FORENSIC-VERDICT.md` §3 says the "final minimal kernel is ~15 subsystems" and lists `CapabilityEventBusV2` as K0 — consistent. ✅

But the TRUTH MODEL §2 also says:

| `src/engines/harness/*` (17 files) | **K0** | **K1** (`plugin:canon-harness`) |

And the VERDICT §3 lists `harness-runtime.ts` as a candidate **but the harness command registry shape is K0**. So the harness runtime (executing the DAG) is K1, the harness command *registry* is K0. **The TRUTH MODEL row collapses this distinction.** Either:

- The row should be split: `harness-command-registry.ts` → K0; `harness-executor-engine.ts` + siblings → K1.
- Or the row stays but the truth-model's "Should be" column should say "**K0 (registry shape) / K1 (runtime + 100+ seeded recipes)**".

The forensic reclassification is correct, but the *table* is sloppy. **A table that says "K0 → K1" for a directory that contains both K0 and K1 files is misleading.** Same issue applies to:

- `src/engines/sandbox-runner*.ts` (QuickJS is K0, `vm` fallback is being removed)
- `src/engines/parsers/*` (SSE parser is K0; provider parsers are K1)
- `src/engines/local-agent/*` (in-memory store is K1, executor is K1 — but the *harness agent exec runtime* is K0)

**Better approach:** the truth-model should **split each row by file**, not by directory. ~30 rows get split into 2-3 sub-rows. The cost: +10 minutes of writing per row. The benefit: when the migration engineer moves `harness-executor-engine.ts` to `plugin:canon-harness/`, they can see in the table exactly which file is moving, not the whole directory.

**Fix:** split the rows. This is I-2 work (deep-probe), not I-1; the forensic reclassification package as written is acceptable for the I-1 review, but the I-2 deep probe must produce the file-level truth map.

---

### Gap-3 — **MEDIUM-HIGH**: `IPluginContext.sandbox` shape is hand-waved

**Current text** (`KERNEL-CONTRACTS.md` C-02):

```ts
/** VIVIM gate to the sandbox host (for K1/K2 plugins shipping K3 components). */
readonly sandbox: {
  render(component: SandboxComponentInput): { instanceId: string; onMessage: ...; dispose: ... }
}
```

**Problem:** the `...` in `onMessage` is the entire return shape. The contract is incomplete. Specifically:

- `onMessage` is a callback type? A `MessageEvent`-shaped object? An `AsyncIterable` of `BridgeMessage`?
- Does the plugin get a way to *send* messages to the iframe, or only receive? (Looking at `SandboxedNode.tsx:220` the host has a `MessageChannel`; the iframe has a `__vivim.requestCapability` that posts. The contract needs both directions.)
- What is the lifetime guarantee on `dispose`? (The kernel may force-dispose on uninstall — `PLUGIN-CONTRACTS P-16` says the kernel force-closes after 10s, but the contract doesn't say.)
- What is the audit event shape? `SandboxAuditEvent` exists in `SandboxedNode.tsx:21-26` but the contract doesn't surface it.

**Better approach:** the `IPluginContext.sandbox` should be:

```ts
export interface ISandboxHost {
  render(
    component: SandboxComponentInput,
    policy: SandboxPolicy,
  ): ISandboxInstance
}

export interface ISandboxInstance {
  readonly instanceId: string
  /** Send a message to the iframe (host → iframe). */
  postMessage(message: Record<string, unknown>): void
  /** Receive messages from the iframe (iframe → host). Unsubscriber stops subscription. */
  onMessage(handler: (msg: Record<string, unknown>) => void): () => void
  /** Tear down. Kernel may force this on uninstall. */
  dispose(): void
  /** The iframe's last `SandboxAuditEvent`. Updated async as the iframe reports. */
  getAuditEvent(): Promise<SandboxAuditEvent | null>
}
```

This is what `SandboxedNode.tsx:80-140` actually does; the contract should mirror it. Without the explicit `ISandboxInstance` shape, a plugin can't write a sandboxed component today because the contract is incomplete. **A plugin-facing contract that says "trust me" is no contract.**

**Fix:** the full type goes in P0-1 alongside the certifier. It's small (~30 lines). I had it as `...` in the spec; that's not acceptable for a *contract* document.

---

### Gap-4 — **MEDIUM-HIGH**: `IProviderAdapter` is missing the `initialize` exception contract

**Current text** (`KERNEL-CONTRACTS.md` C-05):

```ts
export interface IProviderAdapter {
  readonly providerId: ProviderId
  readonly manifest: ProviderManifest

  initialize(connection: ProviderConnection, config?: unknown): Promise<void>
  health(signal?: AbortSignal): Promise<ProviderHealth>
  listModels(signal?: AbortSignal): Promise<readonly ModelDescriptor[]>

  /** Stream AIRequest → AIEvent. May throw provider-native exceptions; the kernel catches. */
  execute(request: AIRequest, signal: AbortSignal): AsyncIterable<AIEvent>
  cancel(requestId: RequestId): Promise<void>
}
```

**Problem:** "May throw provider-native exceptions; the kernel catches" is **vague**. The kernel's contract for *what* it catches is missing. Specifically:

- If a provider's `execute` throws an exception synchronously, what happens? (Some providers do; OpenAI streaming returns are not always well-behaved.)
- If a provider's `execute` throws *after* it has already yielded some events, do the events get to the consumer, or are they rolled back?
- If `cancel` is called while `execute` is mid-stream, what is the error model — does `execute` re-throw with `AbortError`, or does it yield an error event and complete the async iterator?
- What is the maximum time the kernel gives a provider to `initialize` before timing out?

`adapter.ts:14-30` mentions: "Provider-native exceptions must be caught" — but does not say *how* or *what the result is*. The kernel's error model is incomplete.

**Better approach:** add a `AdapterError` type and a `tryExecute(...)` wrapper contract:

```ts
export type AdapterError =
  | { readonly kind: 'transient'; retryable: true; message: string; cause?: unknown }
  | { readonly kind: 'permanent'; retryable: false; message: string; cause?: unknown }
  | { readonly kind: 'rate_limited'; retryAfterMs: number; message: string }
  | { readonly kind: 'auth'; retryable: false; message: string }
  | { readonly kind: 'aborted'; signal: AbortSignal }
  | { readonly kind: 'unknown'; retryable: false; message: string; cause?: unknown }

export interface IProviderAdapter {
  // ... same as before ...
  execute(request: AIRequest, signal: AbortSignal): AsyncIterable<AIEvent>
  /** MUST translate native exceptions to AdapterError. MUST yield at least one
   *  final event of kind 'error' or 'done' before completing. MUST honor signal. */
  cancel(requestId: RequestId): Promise<void>
}
```

**Why it matters:** the router (`IRouter`) needs to know whether to retry, fall over, or surface a 5xx to the user. Without `AdapterError`, every adapter is its own error model, and the kernel's "fallback-on-provider-crash" guarantee in `IExecutionManager` (C-10) is fiction.

**Fix:** add a 20-line `AdapterError` discriminated union to C-05. P0-2.

---

### Gap-5 — **MEDIUM**: `IExecutionManager.drainProvider` ordering is underspecified

**Current text** (`KERNEL-CONTRACTS.md` C-10):

> **Enforcement point:** Every `IRouter.route()` decision leads to `IExecutionManager.create()`; every uninstall/hot-swap calls `drainProvider` before `IRuntimeSupervisor.stopProvider`. The `drainProvider`/`unregister` ordering is mandatory; the kernel enforces it.

**Problem:** "Mandatory; the kernel enforces it" — but the *mechanism* is missing. What if `drainProvider` takes 30 seconds? What if the user navigates to a new provider mid-drain? What if `stopProvider` is called before `drainProvider` completes (e.g., the OS process dies)?

Today the harness runtime (`harness-executor-engine.ts:1-30`) says "The actual CDP injection happens ONLY inside ChromeGovernor.executeHarnessPlan (Governor Canon)." This is **another** ordering constraint (drain harness plans before stopping Chrome). The kernel's contract does not capture this.

**Better approach:** make `drainProvider` an awaitable with a deadline:

```ts
export interface IExecutionManager {
  // ...
  /** Transitions every non-terminal execution to 'draining'. Returns when the longest
   *  timeout has elapsed OR all executions are terminal. NEVER throws on timeout —
   *  it returns the set of executions that did NOT terminate. The caller decides
   *  what to do with them (default: fail them). */
  drainProvider(providerId: string, opts?: { timeoutMs?: number }): Promise<{
    drained: readonly ExecutionId[]
    stillRunning: readonly ExecutionId[]
  }>

  /** HARD STOPS the provider. MUST only be called AFTER drainProvider returned.
   *  Throws DrainTimeoutError if still-running executions exist after the
   *  grace period. The kernel uses this to abort the operation. */
  forceStopProvider(providerId: string, opts?: { graceMs?: number }): Promise<void>
}
```

The two-method split (`drainProvider` + `forceStopProvider`) makes the order explicit: **drain before stop**. A plugin that calls `forceStopProvider` without `drainProvider` gets a `DrainTimeoutError`. This is enforceable in a unit test.

**Fix:** 30 lines, P0-2.

---

### Gap-6 — **MEDIUM**: `UiGeneratedContribution` HTML/CSS payload size limits and CSP are unspecified

**Current text** (`PLUGIN-CONTRACTS.md` P-05):

```ts
export const UiGeneratedContributionSchema = z.object({
  slotId: z.string().min(1),
  scope: z.enum(['system', 'cross-type', 'family', 'provider']),
  variant: z.string().optional(),
  ownerId: z.string().optional(),
  html: z.string(),
  css: z.string(),
  scriptUrl: z.string().url().optional(),  // must be kernel-asset origin
  contract: z.object({...}).optional(),
  constraints: z.object({...}).optional(),
})
```

**Problem:** the contract is silent on:

- **HTML/CSS size limits.** Today `SandboxedNode.tsx:144-156` accepts arbitrary `html` and `css`. A malicious plugin could ship a 100 MB HTML string. The kernel should cap payload size at install time.
- **CSP defaults.** The plugin *may* supply a `csp` field, but the contract doesn't say what the *default* CSP is when omitted. Without a default, a plugin omitting `csp` could ship a frame with `default-src *` and exfiltrate data.
- **`scriptUrl` for *resources*, not just JS.** Today the field is a single JS URL. A plugin might want to ship an HTML document that loads multiple scripts. The contract should support `scriptUrls: string[]` (or reject if not).
- **CSS scoping.** The CSS the plugin ships leaks into the iframe, but a malicious plugin can also inject `@import url("http://evil")` and exfiltrate via CSS-side-channel attacks. The contract should reject `@import` and `url()` in plugin-supplied CSS.

**Better approach:**

```ts
export const UiGeneratedContributionSchema = z.object({
  slotId: z.string().min(1).max(128),
  scope: z.enum(['system', 'cross-type', 'family', 'provider']),
  variant: z.string().regex(/^[a-z0-9-]{1,64}$/).optional(),
  ownerId: z.string().regex(/^[a-z0-9-]{1,128}$/).optional(),
  /** HTML body. Hard cap: 64KB. Validated by Zod refinement. */
  html: z.string().max(64 * 1024),
  /** CSS body. Hard cap: 32KB. Rejected at certify if it contains @import or url() with a remote target. */
  css: z.string().max(32 * 1024).refine(
    (s) => !/@import|expression\s*\(|url\s*\(\s*['"]?https?:/.test(s),
    { message: 'plugin CSS may not @import remote URLs or use expression() or http(s) url()' }
  ),
  scriptUrl: z.string().url().regex(/^https?:\/\/[\w-]+\/_kernel\/plugins\//).optional(),
  contract: z.object({...}).optional(),
  constraints: z.object({...}).optional(),
})
```

**Why it matters:** the current contract says "html: z.string()" with no cap. A plugin that ships 100 MB of HTML gets a `IFrame.contentDocument` of 100 MB. The user's browser is unhappy. The audit log is 100 MB. The DoS surface is open. **The certifier must enforce the cap; today nothing does.**

**Fix:** 15 lines + a test. P0-1.

---

### Gap-7 — **MEDIUM**: `IProviderRegistry.setState` has no `expectedCurrentState` parameter — silent overwrite is possible

**Current text** (`KERNEL-CONTRACTS.md` C-06):

```ts
export interface IProviderRegistry {
  // ...
  /** Throws if `to` is not a legal transition from the current state per PROVIDER_TRANSITIONS. */
  setState(providerId: ProviderId, state: ProviderState): Promise<void>
}
```

**Problem:** "Throws if `to` is not a legal transition from the *current* state." But the contract reads the current state, decides if the transition is legal, then writes. **Between the read and the write, another caller can `setState` the same provider.** This is a classic TOCTOU race. Two callers both observe `active`, both call `setState(id, 'draining')`, both succeed; the second one assumes it just transitioned `active → draining` but actually transitioned `draining → draining` (which may not be in `PROVIDER_TRANSITIONS`).

`registry.ts:25-32` defines `PROVIDER_TRANSITIONS` correctly, but the `setState` function is not in this code path. The contract doesn't say it is atomic.

**Better approach:** add an `expectedCurrentState` parameter:

```ts
setState(
  providerId: ProviderId,
  to: ProviderState,
  expectedFrom: ProviderState,  // the caller asserts what the state was when they decided
): Promise<void>
```

Throws `ConcurrentStateChangeError` if the actual current state ≠ `expectedFrom`. The kernel uses a `Mutex` (which already exists in `src/engines/lock-manager.ts`) per provider to serialize `setState` calls.

**Why it matters:** the harness runtime's "drain before stop" promise (Gap-5) is meaningless if a concurrent `setState('active')` can happen between `drainProvider` and `stopProvider`. Without `expectedCurrentState`, the harness may try to drain a *different* state than the one observed.

**Fix:** 20 lines, P1-2.

---

### Gap-8 — **MEDIUM**: PLUGIN-TRUST-MODEL contradicts the migration plan on the harness registry

**Contradiction:**

- `PLUGIN-TRUST-MODEL.md` §2 says: "`src/engines/harness-command-registry.ts:54` | **K0** | **K1** (`plugin:canon-harness`) | The registry shape may belong to kernel; the 100+ seeded harness commands are first-party recipes"
- `BOUNDARY-MIGRATION-PLAN.md` says: "P0-3: ... the harness command registry itself is K0 shape, but the 100+ seeded commands + the executor are K1"
- `ATOMIC-INVENTORY-v3.md` row E19 says: "Session persistence and checkpointing" is KERNEL/K1 split, but the harness command registry is **not split in v3** — it's in the KEEP section (SPLIT in MISSING-13 is for the harness runtime, not the registry).

**Resolution:** the trust model + migration plan + inventory all agree the *registry shape* is K0. They disagree on whether the *registry file* (`harness-command-registry.ts`) should be marked K0 or K1 in the truth map. Since the registry shape is K0 but the file contains K0 shape *and* 100+ K1 seeded commands, **the file should be split**:

- `harness-command-registry.ts` (the `HarnessCommandRegistry` *class*) → moves to `src/kernel/harness/registry.ts` (K0).
- `seeds/harness/commands/*.ts` (the 100+ recipe modules) → moves to `plugins/core/canon-harness/commands/*.ts` (K1).

**Fix:** update the truth-model row for `harness-command-registry.ts:54` and `seeds/harness/*` to reflect this split. The migration plan P3 must add a step "move 100+ harness seed commands to `plugins/core/canon-harness/commands/`."

---

### Gap-9 — **MEDIUM**: PLUGIN-BUILDER-CAKE P1-04 is wrong about Zod schema generation

**Current text** (`PLUGIN-BUILDER-CAKE.md` §2 P1-04):

> | P1-04 | `codegen:schema-contribution` | given `{ localType, sampleData, intentPatterns? }` returns a `SchemaContribution` (the Zod schema is generated from the sample) |

**Problem:** "Zod schema is generated from the sample" is an overclaim. Zod schemas describe the *shape* of valid data, not a sample. A sample can be *parsed* against an existing schema, but generating a Zod schema from a *single sample* produces a schema that is too narrow (a `z.string()` constraint will be `z.literal("hello")` if the sample is `"hello"`). The codegen backend that does this would emit schemas that are correct for the sample but reject any other valid value.

A real codegen needs:

- A **type hint** (`z.string() with min(3) max(100)` — not just `z.string()`).
- **Multiple samples** to avoid the "literal trap."
- **Schema inference rules** that know about timestamps, emails, URLs, etc.
- **Existing Zod schema registration** to look up ("this looks like a `MemoryEmbedding` — use that one").

**Better approach:** the contract becomes:

```ts
codegen:schema-contribution({ schema: z.ZodType, sample?: unknown, intentPatterns?: string[] })
  => { localType, schema, indexContent?, embeddingText? }
```

The codegen backend takes an *explicit Zod schema* (the plugin author wrote it; the LLM helped). The sample is for indexable text + verification, not for schema inference. The intentPatterns are for discovery (P4-02).

**Fix:** rewrite P1-04 in the cake file. 5 lines.

---

### Gap-10 — **MEDIUM**: `IResourceManager.acquire` returning `undefined` is confusing

**Current text** (`KERNEL-CONTRACTS.md` C-12):

```ts
export interface IResourceManager {
  acquire(request: ResourceRequest): Promise<ResourceLease | undefined>  // returns undefined on capacity miss
  renew(leaseId: ResourceLeaseId, additionalAmount?: number): Promise<ResourceLease | undefined>
  release(leaseId: ResourceLeaseId): Promise<void>
  snapshot(kind?: ResourceKind): Promise<readonly ResourceSnapshot[]>
}
```

**Problem:** "Returns undefined on capacity miss. Never throws for plain miss." — but what if the request is *invalid* (e.g. negative amount, unknown resource kind)? `acquire` cannot distinguish "the system is full" from "the request is malformed" if both return `undefined`. The caller has to call `snapshot` to figure out which.

Also: the contract doesn't say what `undefined` vs a thrown error means for `renew`. Today, a `renew` on an expired or unknown lease may return `undefined` (silently dropping the resource) or throw. The contract must say.

**Better approach:** two methods with different return shapes:

```ts
acquire(request: ResourceRequest): Promise<ResourceLease>  // throws CapacityError on miss
tryAcquire(request: ResourceRequest): Promise<ResourceLease | null>  // returns null on miss, throws on invalid
```

The default `acquire` is "I need this; fail if you can't." The `tryAcquire` is "I want it if available, but I'm OK without it." Two methods, two semantics. The "never throws for plain miss" claim is replaced by "throws `CapacityError`; use `tryAcquire` for non-throwing variant."

**Fix:** 15 lines. P1-2.

---

### Gap-11 — **MEDIUM**: AT-FORENSIC-VERDICT risk register misses the **honest-list risk**

The risk register in `AT-FORENSIC-VERDICT.md` §8 has 8 risks. It does **not** mention the honest-list risk from the cake file:

> **Honest-list risk**: the `PLUGIN-BUILDER-CAKE.md` table is overoptimistic about which first-party plugins a user can build. The `🟢` entries assume the user has access to model-specific knowledge (e.g. Discord's authentication flow, Notion's block model, Slack's API quirks). The cake is *capable*, but the *content* the user must write or generate is non-trivial. For each `🟢` row, the actual time-to-build is in hours to days, not minutes. **The cake is a speed multiplier, not an automation oracle.**

**Fix:** add this risk to the verdict. The success statement says "user can build any plugin"; the honest claim is "the cake makes it practical, not trivial."

---

### Gap-12 — **LOW-MEDIUM**: `IProviderAdapter.cancel` ordering with `execute` is underspecified

**Current text** (`KERNEL-CONTRACTS.md` C-05):

```ts
execute(request: AIRequest, signal: AbortSignal): AsyncIterable<AIEvent>
cancel(requestId: RequestId): Promise<void>
```

**Problem:** "cancel" is keyed by `requestId`, but `execute` yields events that may have a different `requestId` (the same AI request, but the provider may have a sub-request). The contract doesn't say:

- Does `cancel` abort the current stream AND any sub-requests?
- Is `cancel` idempotent? (Calling it twice should be safe.)
- Is `cancel` synchronous (returns when the request is canceled) or asynchronous (returns when the request is *seen* as canceled)?
- After `cancel`, does `execute` complete with an `error` event, or just terminate without one?

**Better approach:** the contract makes these explicit:

```ts
/**
 * Cancels the request. Idempotent. Returns when the kernel has acknowledged the cancel;
 * the stream may not have terminated yet — callers should still consume the AsyncIterable
 * until it yields `{ kind: 'done' }` or `{ kind: 'error' }`. After cancel, no further events
 * are emitted by the kernel for this request.
 */
cancel(requestId: RequestId): Promise<void>
```

**Fix:** 5 lines, P1-2.

---

### Gap-13 — **LOW**: `kernel:plugins:*` capability names conflict with future namespacing

**Current text** (`PLUGIN-BUILDER-CAKE.md` §6):

> | C-31 | `IPluginManager.install/upgrade/uninstall` exposed as `kernel:plugins:install` etc. |

**Problem:** the names use a colon-separated namespace (`kernel:plugins:install`), but the bus event-type prefix uses a dot-separated namespace (`plugin:${id}.`). Two namespaces, one concept, no documented mapping. The kernel plugin should also publish bus events for its own operations, and those events should use the `kernel:` prefix consistently with the capability names.

**Better approach:** one namespace, one separator. Use dots: `kernel.plugins.install` (capability) and `kernel.plugin.installed` (event). Document the mapping.

**Fix:** 2 lines in the cake file. Not a blocker, but the next engineer to read both will be confused.

---

### Gap-14 — **LOW**: 00-README still lists the v1 194-row inventory as a current artifact

**Current text** (`00-README.md` §5):

> 4. **`inventory/ATOMIC-INVENTORY.md`** — **194-row product-language atomic inventory** (75 CORE + 84 DEFAULT PLUGIN + 35 GENERIC + 17 DEBATE) — **the boundary-lock artifact. Read this to iterate and lock.**

**Problem:** the v1 file is **superseded** by `ATOMIC-INVENTORY-v3.md`. Listing it as "the boundary-lock artifact" is wrong. The current artifact is v3.

**Fix:** mark v1 as "superseded" and reference v3 as the authoritative one.

---

### Gap-15 — **LOW**: The 15-subsystem "Final Minimal Kernel" list omits 2 important primitives

**Current text** (`AT-FORENSIC-VERDICT.md` §3):

> The kernel after the migration is approximately 15 subsystems.
> ...
> 15. **`IPluginHost` glue + `KernelRegistry` + `Oracle*` observability** — the audit + topology + diagnostic kernel. Observability is a kernel responsibility; the panel is first-party.

**Problem:** item 15 lumps three distinct subsystems together. The bundle is fine for a summary, but for the I-2 deep probe (and for the contract catalog), the kernel should enumerate them separately:

15a. **`IPluginHost`** — the lifecycle glue (install / enable / disable / uninstall / drain / stop).
15b. **`KernelRegistry` + `KernelTracer` + `KernelProvenance`** — observability kernel.
15c. **`Oracle*` (actuator, diagnostic, event-stream, query)** — diagnostic query engine.

That brings the count to 17. Not a big deal for the verdict, but the I-2 deep-probe must enumerate them.

---

## 2. The honest-list risk (new section for the verdict)

Add a new risk to `AT-FORENSIC-VERDICT.md` §8:

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **The cake is a speed multiplier, not an automation oracle** (the honest-list risk from `PLUGIN-BUILDER-CAKE.md` §8) | High | Medium | For each first-party plugin marked `🟢` in the cake's §3 table, the actual time-to-build is hours to days, not minutes. The cake removes *ceremony*; it does not remove *content knowledge*. The 8 `🟡` rows in the cake (chat, memory, agents, canon-nlcl, sync, tools-mcp, providers-api, ui-canvas, ui-builder) are *partially* buildable because some piece (FSRS, agent execution runtime, cross-device CRDT, MCP client transport, OpenAI-compatible impl, infinite-canvas UX, drag-to-connect visual builder) is first-party *content* that the user must write or generate. Document the actual content cost in `PLUGIN-BUILDER-CAKE.md` §3 as a column. |

---

## 3. What I would change if I were doing the reclassification over

### Change-1: Per-file truth map, not per-directory

`PLUGIN-TRUST-MODEL.md` §2 groups by directory. The forensic reclassification is *right* but the table is *sloppy* (Gap-2). I would generate the truth map per-file — 460+ lines, but each row is verifiable in seconds with `rg`. **The I-2 deep-probe must do this**, not the I-1 forensic reclassification.

### Change-2: Contracts with concrete types, not `...`

`KERNEL-CONTRACTS.md` C-02 (`IPluginContext.sandbox`), C-05 (`AdapterError`), C-12 (`IResourceManager.acquire` semantics) are incomplete. The user asked for a "careful and meticulously code grounded plan"; the contract types are the most-grounded thing in the plan, and they have `...` and "may throw provider-native exceptions; the kernel catches" placeholders. **Replace every `...` with a real type signature.** A contract document with `...` is a sketch, not a contract.

### Change-3: Add a "Section 4: Risks the verification missed"

The risk register in `AT-FORENSIC-VERDICT.md` §8 has 8 risks. None of them is the *honest-list* risk above. None of them is the **TOCTOU race in `setState`**. None of them is the **DoS surface of unbounded `html`/`css`**. The next reviewer (or the next agent) will catch these; the verdict should preempt them.

### Change-4: The cake's P1/P2/P3/P4 are not always powerset-clean

P0 (introspect), P1 (codegen), P2 (compose), P3 (certify), P4 (discover), P5 (authoring) is a clean layering **in principle**. In practice, P3 (certify) and P1 (codegen) have a chicken-and-egg: codegen produces a manifest that certify then validates. The order should be P1 → P3 in the cake, not P3 before P1 as I wrote it. **Reorder P1..P5 in the cake to P0, P1, P3, P2, P4, P5** (certify between codegen and compose). Or keep P3 separate and document the data flow.

### Change-5: Per-row time-to-build estimate in the cake

The §3 table is 🟢 / 🟡 / 🔴 only. It should be `time_to_build_hours: 1 | 8 | 24 | 80`. A user with a 1B-parameter LLM and the rules backend will take 1 hour to build a Notion plugin (`🟢`) but 80 hours to build the infinite-canvas UX (`🟡` in ui-canvas). Without the time estimate, the table is misleading.

### Change-6: The 18 arch tests are 1-layer deep

`KERNEL-BOUNDARY-TESTS.md` checks the *mechanical* boundary (no illegal import, no `globalThis` write). It does not check the *contractual* boundary (a plugin's activate actually conforms to `IPluginContext`; a kernel contract's `contractVersion` is present; an event's kind starts with the right prefix). **Add 4-6 contractual tests** (event-type prefix on the kernel's own engines; contractVersion present on every contract; etc.). The mechanical tests catch the easy violations; the contractual tests catch the **spirit** of Rule C.

### Change-7: The migration plan undercounts P0-1

P0-1 is the single biggest phase. It has 10 ordered steps. The plan calls it "P0-1: IPluginManager, IPluginContext, PluginManifestSchema, PluginHost, V1→V2 bus bridge" but does not call out the *8 capability wrappers* (C-25..C-32) from `PLUGIN-BUILDER-CAKE.md` §6. **P0-1 is really P0-1 + P0-1.x (8 capability wrappers).** Add the second sub-phase to the migration plan; estimate 10 small PRs + 1 sprint.

### Change-8: The kernel has no notion of *plugin trust for capability invocation*

When a plugin calls `ctx.capabilities.invoke('plugin:other:cap', ...)`, the kernel is the dispatcher. The kernel needs to know: "does the *caller* have permission to call the *callee*?" Today the permissions are declared on the manifest, but there is no per-call capability check. **Add `IPolicyEnforcer.enforceCapabilityInvocation(caller, callee, capabilityId)` to C-09.** Without it, a plugin can call *any other plugin's capability* as long as the callee exposes it. This is the **capability abuse** path.

The fix: when `IExecutionManager.create()` dispatches a capability call, it asks `IPolicyEnforcer.enforceCapabilityInvocation` with `(callerPluginId, calleePluginId, capabilityId)`. The default-deny enforcer rejects the call if the caller does not have the right (e.g. `capability:invoke` permission + a per-capability allowlist). The **default-deny** is the kernel's first defense; the **per-capability allowlist** is the kernel's second.

This is not in the current reclassification. It should be.

---

## 4. The right way forward (proposed I-2 work)

The I-1 forensic reclassification is good enough to be the basis for the I-2 deep probe. The I-2 work should:

1. **Produce the per-file truth map** (Change-1).
2. **Finalize every contract's type signature** (Change-2, with all `...` removed).
3. **Split the harness directory in the migration plan** (Gap-8 fix).
4. **Add the missing kernel primitives** (Gap-3, Gap-4, Gap-5, Gap-6, Gap-7, Gap-10, Gap-12, and Change-8).
5. **Reorder the cake** (Change-4).
6. **Add the time-to-build column** (Change-5).
7. **Add the contractual arch tests** (Change-6).
8. **Split P0-1 into P0-1 + P0-1.x** (Change-7).
9. **Add the honest-list risk to the verdict** (Gap-11 fix).
10. **Re-run the verdict's top-20** after the I-2 deep probe to confirm the gap analysis.

The I-2 deep probe will produce roughly 4-6 new docs in the `evidence/` directory and 1-2 updates to the existing artifacts. The I-3 scaffold (P0-1 PRs) can start in parallel once the I-2 deep probe is complete.

---

## 5. Self-critique: what the reclassification still does well

To be honest, the reclassification also gets a lot of things right that I would not change:

- The 4-level model (KERNEL / FIRST-PARTY / GENERIC / SANDBOXED) is correct.
- Rule F (kernel-only boot) is the right gate.
- The `contractVersion` guarantee is the right compat mechanism.
- The 12-attack-vector certifier is the right defensive depth.
- The 18 arch tests are the right enforcement surface (just the 2 of them need re-writing).
- The P0–P3 phased migration is the right sequence.
- The "VIVIM-as-its-own-plugin" principle is correct.
- The cake metaphor is the right framing for the user-facing authoring.
- The `PluginHost` unification of `TrustedPluginManager` + `plugin-router.ts` is correct.
- The `chrome:control` gate as a v2 boundary is correct.

**Overall grade: A−.** Directionally right; materially incomplete in 14 specific places; the I-2 deep probe + 5 follow-up docs will close the gaps.

---

## 6. What the user (a non-engineer) should know

In plain terms:

- The architecture I proposed is **right** — the kernel stays small, VIVIM's features become plugins, third-party developers can build plugins that do what VIVIM's own plugins do.
- The **boundary itself is right** — the kernel owns the mechanisms (install, certify, sandbox, isolate, audit); the plugins own the product.
- The **layer cake is right** — a user with a plugin-builder can build new plugins without writing kernel code.
- **What I got partially wrong** — 14 specific gaps in the contract details, the per-file truth map, and the architectural tests. These are not "the architecture is wrong"; they are "the spec is incomplete."
- **What to do next** — the I-2 deep probe (4-6 weeks) fills the gaps; the I-3 scaffold (P0 PRs) starts the migration. The user can review the I-2 outputs to confirm the architecture is still right at the file level.
- **The honest list** — the cake is a speed multiplier, not an automation oracle. Building a Discord plugin with the cake still takes hours. Building the infinite-canvas UX still takes days. The cake removes the *ceremony* of writing the manifest and the certifier and the bus namespaces, but it does not remove the *content knowledge* of how Discord or Notion or an infinite canvas work. The 8 `🟡` plugins in the cake are not "free" — they're "partially buildable" because some content is still needed.

---

## 7. Priority recommendations for the user

If I had to pick 4 things to fix before I-2, they would be:

1. **Rewrite test 2.4 in KERNEL-BOUNDARY-TESTS.md** — the current rule is unenforceable. (Gap-1)
2. **Split the per-directory truth map into per-file truth map** — the I-2 probe needs this. (Gap-2)
3. **Finalize `IPluginContext.sandbox` and `AdapterError`** — the contracts with `...` are not contracts. (Gap-3 + Gap-4)
4. **Add `IPolicyEnforcer.enforceCapabilityInvocation`** to C-09 — the missing capability-abuse defense. (Change-8)

The other 10 gaps are real but lower priority. They will surface during the I-2 probe or the I-3 PRs; the user can address them in subsequent iterations.

The architecture is **right**. The spec is **incomplete**. The implementation is **not started**. The next 1-2 sprints are the right window to close the spec and start the security boundary.
