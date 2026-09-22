# Step 4.4: Resource Limits — CPU, Memory, Network, Storage

**Date:** 2026-08-28
**Read:** Phase 1 Step 1.11 (sandbox budget), Phase 1 Step 1.14 (request-queue), Phase 2 Step 2.6 (commands)
**Status:** DESIGNED

---

## The question (from the process)

> "How would we cap an extension's CPU, memory, network, storage? Are there existing rate limiters, budgets, or quota systems we can reuse?"

## The answer

**Yes — partial.** The sandbox has CPU + memory budgets (Step 1.11). The provider system has request queues (Step 1.6). The capability system has rate limits via the `governance-engine.ts` `costBudgetCents`. The host can wire per-extension budgets on top.

---

## Existing rate limiters / budgets

### `SandboxBudget` (Step 1.11 line 14-17)

```typescript
export interface SandboxBudget {
  cpuMs: number          // wall-clock
  memoryBytes: number    // heap
}
```

The QuickJS sandbox kills a handler that exceeds. Per-call.

### Provider request queue (Step 1.6)

`plugins/provider/resilience/request-queue.ts` (4881 lines) — a queue for provider requests. Probably rate-limits per provider, per user, per account. Not read in detail.

### `GovernanceEngine.costBudgetCents` (Step 4.1)

```typescript
export interface AllocationCtx {
  costBudgetCents?: number
  reputationFloor?: number
  // ...
}
```

A budget in cents. The engine filters agents by cost. Per-call (per-allocation).

### `LiveCapabilityRegistry` has no budget today

The live cap handler doesn't have a budget. The sandbox's default budget is used (probably 5s CPU, 50MB memory). Per extension is NOT today.

### `SandboxAuditStore` is the audit log

Every sandbox call has an `auditId`. The store has `create`, `list`. The host can compute rate limits from the audit log (e.g. "no more than 100 calls per hour").

---

## The proposed per-extension resource limits

```typescript
// In the extension install state (Step 4.3):
interface ExtensionInstall {
  // ... existing ...
  resourceLimits: {
    cpu?: {
      callsPerMinute?: number      // e.g. 60
      maxCpuMsPerCall?: number     // e.g. 5000
    }
    memory?: {
      maxMemoryBytesPerCall?: number  // e.g. 50_000_000 (50 MB)
    }
    network?: {
      maxRequestsPerMinute?: number   // e.g. 30
      maxBytesPerMinute?: number      // e.g. 10_000_000 (10 MB)
    }
    storage?: {
      maxNodes?: number              // e.g. 1000 nodes per extension
      maxBytesPerNode?: number       // e.g. 1_000_000 (1 MB)
    }
    cost?: {
      maxCostPerDay?: number         // e.g. $1.00 in cents
    }
  }
}
```

The host enforces:
- **`cpu.callsPerMinute`**: rate limit on the `permissionsProvider`. Track in a sliding window.
- **`cpu.maxCpuMsPerCall`**: pass as `SandboxBudget.cpuMs`.
- **`memory.maxMemoryBytesPerCall`**: pass as `SandboxBudget.memoryBytes`.
- **`network.maxRequestsPerMinute`**: rate limit on the `consentEngine.require()` for `network` classification.
- **`network.maxBytesPerMinute`**: track bytes fetched; deny if exceeded.
- **`storage.maxNodes`**: count `NodeStore.listByType(extensionNodeType)`; deny create if exceeded.
- **`storage.maxBytesPerNode`**: validate `dataJson.length` on create.
- **`cost.maxCostPerDay`**: pass to `GovernanceEngine.costBudgetCents`; deny if exceeded.

---

## How the host tracks rate limits

The host maintains a sliding window per (extension, resource type). The window is in-memory + persisted to a Node with `type: 'extension.usage'` (Step 3.5 philosophy). The window is small (last 60 seconds or 1 day, depending on resource).

```typescript
interface UsageWindow {
  extensionId: string
  resource: 'cpu.calls' | 'cpu.ms' | 'memory.bytes' | 'network.requests' | 'network.bytes' | 'storage.nodes' | 'storage.bytes' | 'cost.cents'
  windowStart: number
  windowEnd: number
  used: number
  limit: number
}
```

The host checks the window before every operation. If `used + delta > limit`, deny with a clear error.

---

## What's the default limit?

The host has a default for each resource:
- `cpu.callsPerMinute`: 60
- `cpu.maxCpuMsPerCall`: 5_000
- `memory.maxMemoryBytesPerCall`: 50_000_000
- `network.maxRequestsPerMinute`: 30
- `network.maxBytesPerMinute`: 10_000_000
- `storage.maxNodes`: 1_000
- `storage.maxBytesPerNode`: 1_000_000
- `cost.maxCostPerDay`: 100 (cents)

The extension's manifest can request different limits (lower or higher). The user grants at install time.

A bundled extension is granted default limits. A user extension is granted what the user approved.

---

## What this fixes

- ✅ Per-extension rate limits (CPU, memory, network, storage, cost).
- ✅ Sliding window tracking.
- ✅ Default limits + per-extension overrides.
- ✅ Clear error when exceeded.

## What this does NOT fix

- **The existing `SandboxBudget` is per-call, not per-extension.** The host needs to thread the per-extension budget into the sandbox.
- **The `GovernanceEngine.costBudgetCents` is per-allocation, not per-extension.** Same: needs extension dimension.
- **The `request-queue.ts` is per-provider, not per-extension.** Reuse as-is; the extension's `provider_capability` calls go through the existing queue.
- **Network bytes tracking is a new feature.** The host has to count bytes fetched.

---

## Open design questions

1. **What if the extension's limit is exceeded?** The operation is denied. The user sees an error. The audit log records the violation. **No automatic suspension** — the next operation can succeed if the window resets.

2. **What about burst limits?** A burst of 100 requests in 1 second is bad. The sliding window should be granular (1-second buckets? 100ms?). For v1, 1-minute buckets are fine.

3. **What about the cost budget?** The `costBudgetCents` is for LLM API calls. The host has to track the cost per extension. **The cost is the LLM provider's billed cost.** The host's `GovernanceEngine` already has a `costBudgetCents`; the extension dimension is new.

4. **What about offline extensions?** A bundled extension that runs offline (e.g. a local file sync) doesn't use network. The limits don't apply. The host should not enforce `network` limits on extensions that don't declare `network.fetches` in their permissions.

5. **What about the sandbox's `memoryProbe`?** Line 23 of `sandbox-runner.ts`: `memoryProbe?: () => { heapUsed: number }`. The host probes heap; if too high, kill the handler. This is the memory enforcement.

6. **What about a misbehaving extension that hangs?** `cpu.maxCpuMsPerCall` kills it. The user gets a "extension timeout" error.

7. **Can the extension request a higher limit at runtime?** No — the manifest declares the limits at install time. To increase, the user must reinstall.

---

## Cross-references

- **Step 1.11 (sandbox budget)** — `SandboxBudget`.
- **Step 1.6 (provider)** — `request-queue.ts` for provider rate limits.
- **Step 4.1 (governance engine)** — `costBudgetCents`.
- **Step 4.3 (trust levels)** — bundled extensions get default limits; user extensions get user-approved limits.
- **Phase 4 Step 4.6 (synthesis)** — the full resource model.
