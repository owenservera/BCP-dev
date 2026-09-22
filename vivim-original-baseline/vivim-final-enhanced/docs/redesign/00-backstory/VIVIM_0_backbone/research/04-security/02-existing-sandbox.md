# Step 4.2: Existing Sandbox Model — QuickJS

**Date:** 2026-08-28
**Read:** Phase 1 Step 1.11 (sandbox), `kernel/security/sandbox-runner-quickjs.ts` (referenced, not read in full)
**Status:** ANALYZED

---

## The sandbox today

`SandboxRunner` (Step 1.11) has two implementations:

- **QuickJS** (`sandbox-runner-quickjs.ts`, 19556 lines) — default. WASM-based. True isolation. No shared heap.
- **node:vm** (`sandbox-runner-vm.ts`, 4507 lines) — fallback. Requires `VIVIM_UNSAFE_VM=1`. Weaker (shared V8 heap, denylist-dependent).

Selected at module load via `VIVIM_SANDBOX_MODE` env var (line 40 of sandbox-runner.ts).

### `SandboxPermissions` (line 4-12)

```typescript
export interface SandboxPermissions {
  canFetch: string[]         // URL prefix allowlist
  canReadFile: string[]      // absolute path allowlist
  canWriteFile: string[]     // absolute path allowlist
  canUseClipboard: boolean
}
```

Empty = no. Default-deny. The QuickJS sandbox enforces this at the host boundary.

### `SandboxBudget` (line 14-17)

```typescript
export interface SandboxBudget {
  cpuMs: number
  memoryBytes: number
}
```

The sandbox kills the handler if it exceeds.

### `SandboxResult` (line 28-33)

```typescript
export interface SandboxResult {
  ok: boolean
  output?: unknown
  error?: string
  auditId: string  // every call is audited
}
```

### `SandboxRunOptions` (line 19-26)

```typescript
export interface SandboxRunOptions {
  budget?: Partial<SandboxBudget>
  handlerSlug?: string
  memoryProbe?: () => { heapUsed: number }
  globals?: Record<string, unknown>  // frozen globals exposed to the handler
}
```

---

## How a handler runs

```typescript
// From LiveCapabilityRegistry (Step 1.7 line 181-188):
case 'inline':
  return async (input) => {
    const code = spec.handlerSpec.code ?? 'return input'
    const res = await this.sandbox.run(code, input, this.permissionsFor(spec), {
      handlerSlug: spec.slug,
    })
    if (!res.ok) throw new EngineError(`inline handler failed: ${res.error}`)
    return res.output
  }
```

The handler runs `code` as a string. The `input` is the call's input. The `permissions` are passed in. The `handlerSlug` is for audit.

---

## The `safe-expression.ts` companion

`safe-expression.ts` (14136 lines) is the **AST allowlist evaluator** — the *proper* sandbox hardening. The `safe-eval.ts` (27 lines) is the denylist stop-gap. The system has both.

`safe-expression.ts` is presumably the path forward. The host should use it for high-trust extensions.

---

## What a user extension's inline handler can do today

With the **default permissions** (Step 1.7 line 168-175):
- `canFetch: []` — no network
- `canReadFile: []` — no file reads
- `canWriteFile: []` — no file writes
- `canUseClipboard: true` — yes, clipboard

The handler receives `input` and any `globals?` the host injected. It can:
- Compute pure values.
- Use `console` (probably).
- Use the injected globals.
- Read/write the clipboard.

It **cannot**:
- Make HTTP requests.
- Read files.
- Write files.
- Import modules.
- Access the host's Node APIs.

So a default-permission inline handler is **severely limited**. To do anything useful, the user must grant additional permissions.

---

## The `permissionsProvider` injection (proposed)

From Step 4.1: `LiveCapabilityRegistry` should accept a `permissionsProvider` that maps a `LiveCapabilitySpec` → `SandboxPermissions` based on the extension's declared permissions.

```typescript
// Proposed:
const permissionsProvider = (spec: LiveCapabilitySpec): SandboxPermissions => {
  // The host's installation system has stored the extension's grant.
  // Look it up by spec.slug (which is namespaced by extension id).
  const grant = extensionGrants.get(spec.slug)
  if (!grant) return { canFetch: [], canReadFile: [], canWriteFile: [], canUseClipboard: true }
  return {
    canFetch: grant.networkFetches,           // e.g. ['https://myservice.com/*']
    canReadFile: grant.filesystemReads,         // e.g. ['/Users/me/notes/**']
    canWriteFile: grant.filesystemWrites,
    canUseClipboard: grant.canUseClipboard,
  }
}

const liveRegistry = new LiveCapabilityRegistry(
  liveStore,
  bus,
  sandbox,
  mcp,
  audit,
  permissionsProvider,  // NEW
  consentEngine,        // NEW (Step 4.1)
)
```

The host's installer stores the grants. The `permissionsProvider` reads them. The sandbox enforces.

---

## The QuickJS handler globals

What globals are exposed to the QuickJS handler? Not read in detail. Probably:
- `console` (logging).
- `JSON` (parse/stringify).
- `Math`, `Date`, `Object`, `Array`, etc. (standard).
- Anything in `globals?` (frozen, per the spec).
- NOT: `require`, `import`, `process`, `globalThis`, etc. (denylist in safe-eval.ts).

The handler is **JS-only** (not TypeScript). The `code: string` is plain JS.

---

## What the QuickJS handler can NOT do (even with permissions)

- **Cannot run async work that outlives the call.** The handler is a function; when it returns, the sandbox may be torn down. (Or the host reuses the sandbox. Not clear.)
- **Cannot make HTTP requests directly.** The handler must go through the host's API (which is gated by `ConsentEngine` + the sandbox's `canFetch` allowlist).
- **Cannot read the host's process state.** The QuickJS WASM has no shared memory with the host.
- **Cannot install npm packages.** The handler runs in the WASM sandbox; no `import` statement.
- **Cannot modify the host's filesystem outside the allowlist.** QuickJS intercepts file ops.

---

## What this fixes (for an extension model)

- ✅ The QuickJS sandbox is production-grade and reusable.
- ✅ The `SandboxPermissions` interface is the right shape.
- ✅ The `SandboxAuditStore` is the audit log.
- ✅ The `permissionsProvider` injection lets the host wire the per-extension grants.

## What this does NOT fix

- **The `LiveCapabilityRegistry` doesn't use `permissionsProvider` today.** It's a code change.
- **The QuickJS handler cannot directly call the host's `ConsentEngine`.** It must go through the host's API (which IS gated).
- **The `safe-expression.ts` migration is in progress.** Until it's complete, the denylist in `safe-eval.ts` is a fail-open risk (Step 1.11 H9).
- **The handler cannot subscribe to events directly.** It must call a host API.
- **The handler cannot spawn subprocesses or workers.** QuickJS is single-threaded, no child process.

---

## Open design questions

1. **What if the user wants the handler to be async?** QuickJS supports async. The `run()` returns a `Promise<SandboxResult>`. So yes, async is supported.

2. **Can the handler make HTTP requests via `fetch`?** The denylist blocks `fetch`. So no — the handler must call the host's API, which uses `globalThis.fetch` and is gated by `SandboxPermissions.canFetch`.

3. **What if the handler needs to call another capability?** The handler must use the host's API. The host's API is itself a capability; the handler can invoke it via the host's dispatch. (Not built today; the user extension would need a way to "call capability X" from inside the sandbox. Deferred to v2.)

4. **What's the timeout?** `SandboxBudget.cpuMs`. The host can set this. Default: probably 5 seconds.

5. **What's the memory limit?** `SandboxBudget.memoryBytes`. Default: probably 50 MB.

6. **Can the handler persist state across calls?** No — the sandbox is per-call. (Or the host reuses the sandbox; the handler can use a host-provided `globals.state` map. Not designed today.)

7. **Can the handler call the host's `NodeStore`?** Only if the host provides a `globals: { nodeStore }` injection. The `LiveCapabilityRegistry.permissionsProvider` is for the sandbox; the host can also pass API references as globals. **Proposed:** the extension's `CapabilityContribution.handler` for `inline` kind includes a `globals` field that the host populates.

---

## Cross-references

- **Step 1.11 (security)** — full sandbox details.
- **Step 4.1 (consent + policy)** — the `permissionsProvider` injection.
- **Step 4.6 (synthesis)** — the full security model.
- **Step 3.1 (capability contribution)** — the `inline` handler spec.
- **Step 3.6 (lifecycle contribution)** — inline handlers in lifecycle hooks.
