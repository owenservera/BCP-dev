# Step 4.1: Existing Permission System — Consent, Policy, Governance

**Date:** 2026-08-28
**Read:** Phase 1 Step 1.11 (consent + sandbox), `kernel/security/policy-engine.ts` (first 100), `kernel/security/governance-engine.ts` (first 80)
**Status:** ANALYZED

---

## The 3 engines that gate operations

### 1. `ConsentEngine` (Step 1.11)

**Operation-level consent.** 6-tier classification: `read < write < navigate < destructive < financial = communication`. Time-bounded grants (default 1h). `defaultDeny: true`, `requireApprovalAbove: 'write'`. Per-target grants: `(target, classification) → grant`.

Used when: an operation tries to do something that requires user approval (e.g. an HTTP fetch to a new domain).

### 2. `P0PolicyEngine` (policy-engine.ts, 125 lines)

**Capability-level policy.** From the file header: "P0PolicyEngine — deterministic policy for the execution kernel. Evaluates ActionPlans against risk classification and confirmation state."

**Risk tiers:**
- `read: 0`
- `reversible_write: 1`
- `external_communication: 2`
- `destructive: 3`
- `security_sensitive: 4`

**`P0PolicyEngineOptions`** (lines 18-29):
- `allowDestructive: boolean` (default false)
- `allowFinancial: boolean` (default false)
- `allowCommunication: boolean` (default false)
- `allowSecuritySensitive: boolean` (default false)
- `maxRiskTier: number` (default 3, blocks security_sensitive)

**`evaluate(plan: ActionPlan): PolicyDecision`** (line 60) — iterates plan nodes, evaluates each risk. If any is denied, returns denied. Otherwise, returns `{ allowed: true, requiresConfirmation: some node >= tier 2 or requiresConfirmation }`.

**Fail-closed for unknown risk** (line 80-87): "Refusing to authorize unrecognized risk classification: ${risk}." An unrecognized risk is denied, not silently allowed.

**Hard constraints** (lines 7-11): "Policy is deterministic — never calls an LLM. Destructive actions cannot be model-authorized by prose alone. Financial operations have explicit policy. Communication sends are confirmed. No silent destructive retries."

This is the **autonomous-execution policy** — when the agent wants to do something, the P0PolicyEngine decides if it's allowed.

### 3. `GovernanceEngine` (governance-engine.ts, 89 lines)

**Multi-role / multi-model allocation.** From the file header: "GovernanceEngine — multi-role / multi-model allocation (capability-as-data). Allocation strategy is *data-driven* (not a DSL): a governance_policy node declares a strategy + role bindings."

**EndStrategy** = `'early' | 'graceful' | 'exhaustive'`:
- `early` — stop at first success
- `graceful` — run all, keep first success, tolerate failures
- `exhaustive` — run all, aggregate, fail if any fails

**`evaluateAllocation(policyId, ctx)`** (line 37) — resolves role → agent bindings. Filters by `reputationFloor` and `costBudgetCents`.

This is the **agent-allocation policy** — when the agent needs to invoke a tool, which model/agent handles it?

### Other security engines (Step 1.11)

- **`trust-score.ts`** (8326 lines) — provenance → score. Plugins get a score from `MutationProvenance`.
- **`db-encryption.ts`** (5120 lines) — at-rest encryption.
- **`airgap.ts`** (4268 lines) — network kill-switch.
- **`anti-detection.ts`** (3859 lines) — browser fingerprint randomization.

---

## The 3 governance systems — what they gate

| System | Gates | Decision | Time-bounded? | User-facing prompt? |
|---|---|---|---|---|
| **`ConsentEngine`** | Operation-level (fetch URL, write file, send message) | Allow / deny based on grant | Yes (1h default) | Yes (host's UI) |
| **`P0PolicyEngine`** | Capability-level (autonomous action plans) | Allow / deny + requiresConfirmation | No (per-call) | Implicit (confirmation flag) |
| **`GovernanceEngine`** | Agent-level (which model handles a role) | Resolve role → agent | No | No |

These are siblings, not hierarchical. A request can pass one and be blocked by another.

---

## The gap for an extension model

Per the `vivim-extension.json` (Step 3.7), an extension declares its `permissions`:

```json
"permissions": {
  "capabilities": [{ "slug": "knowledge_search", "reason": "..." }],
  "filesystem": { "reads": [], "writes": [] },
  "network": { "fetches": [{ "url": "...", "reason": "..." }] },
  "consent": { "operations": ["communication"], "targets": ["myservice.com"] }
}
```

The host must map these to the 3 engines:

- **`permissions.capabilities[].slug`** → extension can call this capability. The host's capability registry gates this.
- **`permissions.filesystem.reads/writes`** → `SandboxPermissions.canReadFile` / `canWriteFile` allowlist (Step 1.11).
- **`permissions.network.fetches`** → `SandboxPermissions.canFetch` allowlist + the host enforces on `fetch()`.
- **`permissions.consent.operations`** → the extension's `requiresConfirmation` flag is set to true if any operation is `destructive`/`financial`/`communication`. The host's `ConsentEngine` is the runtime gate.

**The current `LiveCapabilityRegistry` does NOT use any of this.** It hardcodes `permissions: { canFetch: [], canReadFile: [], canWriteFile: [], canUseClipboard: true }` and bypasses `ConsentEngine` for HTTP handlers.

**The fix is to thread the manifest's `permissions` through to the runtime.**

---

## The Consent → Sandbox → Trust chain

For a user extension with a `consent: { operations: ['communication'], targets: ['myservice.com'] }` permission:

1. **Install time**: user grants. The host stores: `ExtensionGrant { extensionId, target, classification, grantedAt, expiresAt }`.
2. **Runtime (inline handler)**: handler runs in QuickJS sandbox. The `SandboxPermissions.canFetch` allowlist is set to `['https://myservice.com/*']` (derived from the target). `canUseClipboard: true` if the user granted.
3. **Runtime (HTTP handler)**: handler tries to fetch. The host's `ConsentEngine.require({ classification: 'communication', target: 'myservice.com' })` is called. The grant is checked. If valid, fetch proceeds.
4. **Audit**: every fetch is logged in `SandboxAuditStore` with the extension id, handler slug, target, classification.
5. **Trust score**: every grant adds to the extension's trust score. The user can revoke.

---

## What needs to be added to the existing engines

### `ConsentEngine` (extend)

Add an `extensionId` dimension:
```typescript
export interface ConsentGrant {
  extensionId?: string  // null for system-level
  target: string
  classification: string
  grantedAt: number
  expiresAt: number
}
```

Add a `requireForExtension(extensionId, target, classification)` method that scopes the check to a specific extension's grant.

### `P0PolicyEngine` (extend)

Add per-extension risk overrides:
```typescript
export interface P0PolicyEngineOptions {
  // ... existing ...
  extensionOverrides?: Record<string, {
    allowDestructive?: boolean
    allowFinancial?: boolean
    // ... etc.
  }>
}
```

### `GovernanceEngine` (no change needed)

The GovernanceEngine is for agent allocation, not extension permissions. Out of scope for v1.

### `trust-score.ts` (extend)

Add an `ExtensionTrustScore`:
```typescript
export interface ExtensionTrustScore {
  extensionId: string
  reputation: number        // 0-100
  installCount: number
  lastUpdated: number
  flagged: boolean
  flagReason?: string
}
```

The score is computed from: user grants (positive), audit failures (negative), time installed (positive), provenance (positive for `manual` install, negative for `system` install without user review).

---

## What about the `LiveCapabilityRegistry`?

The current `permissionsFor(spec)` (Step 1.7 line 168) hardcodes a default-deny permission. The fix:
- Add a `permissionsProvider` injection: the host provides a function that maps `LiveCapabilitySpec` → `SandboxPermissions` based on the extension's declared permissions.
- The HTTP handler must call `ConsentEngine.require(...)` before fetching.

```typescript
// Proposed:
export class LiveCapabilityRegistry extends UnifiedCapabilityRegistry {
  constructor(
    private readonly liveStore: LiveCapabilityStore,
    private readonly bus: CapabilityEventBus,
    private readonly permissionsProvider?: (spec: LiveCapabilitySpec) => SandboxPermissions,
    private readonly consentEngine?: ConsentEngine,
    // ... existing ...
  ) { ... }
  
  private permissionsFor(spec: LiveCapabilitySpec): SandboxPermissions {
    return this.permissionsProvider?.(spec) ?? {
      canFetch: [],
      canReadFile: [],
      canWriteFile: [],
      canUseClipboard: true,
    }
  }
  
  private buildHandler(spec: LiveCapabilitySpec) {
    // ...
    case 'http':
      return async (input, ctx) => {
        const h = spec.handlerSpec
        // NEW: require consent before fetching
        if (this.consentEngine && spec.consentTarget && spec.consentClassification) {
          await this.consentEngine.require({
            classification: spec.consentClassification,
            target: spec.consentTarget,
          })
        }
        // ... existing fetch logic ...
      }
  }
}
```

This closes the gap. The user extension declares `consentTarget` + `consentClassification` in its manifest; the host wires the `ConsentEngine`; the live HTTP handler checks consent before fetching.

---

## What this fixes

- ✅ Per-extension grants (extensionId dimension on `ConsentGrant`).
- ✅ Per-extension policy overrides (`P0PolicyEngine.extensionOverrides`).
- ✅ Per-extension trust score (`ExtensionTrustScore`).
- ✅ HTTP live handlers call `ConsentEngine` (closes the Step 1.11 gap).
- ✅ Permissions provider for `LiveCapabilityRegistry` (instead of hardcoded).

---

## What this does NOT fix

- **The inline handler still doesn't call `ConsentEngine`.** The QuickJS sandbox is the gate; the handler can do whatever the sandbox allows. If the user wants to gate an inline handler's actions, the handler itself must call the host's API (which IS gated by `ConsentEngine`).
- **The P0PolicyEngine is for autonomous execution, not extensions.** An extension that runs autonomously is governed by P0 (Phase 7 — the agent execution layer).
- **The user's UI for granting is not in the security layer.** The host renders the consent dialog; the engine is the gate.

---

## Open design questions

1. **What if the extension's `permissions` are too broad?** The host warns. The user can deny specific entries.

2. **Can the user grant a subset of the declared permissions?** Yes — partial grants. The extension runs with what was granted; denied entries cause a "permission denied" error on first use.

3. **What if the extension's runtime behavior exceeds the declared permissions?** The host blocks. The audit log records the violation. The user is notified.

4. **What if a malicious extension declares minimal permissions but uses a feature that bypasses the gate (e.g. `import` in inline code)?** The `safe-eval.ts` denylist (Step 1.11) is the gate. Or the QuickJS sandbox itself (which has no `import` by default).

5. **What about cross-extension data sharing?** Extension A's `data: 'myext.task'` is readable by Extension B if A's ACL allows. The trust model is per-extension. A high-trust extension can read low-trust extensions' data only if the ACL allows.

6. **What if a user revokes a grant mid-session?** The host's `ConsentEngine` checks on every operation. A revoked grant means the next operation is denied.

7. **What about role-based grants?** A user might want to grant "this extension can read but not write." The `permissions.filesystem` is split into `reads` and `writes` for this reason.

8. **What about time-bounded grants?** The current `ConsentEngine` defaults to 1h. The user can grant "until I revoke" (no expiry). The host stores the grant; the engine checks expiry on every call.

---

## Cross-references

- **Step 1.11 (security)** — the existing engines.
- **Step 3.1 (capability contribution)** — the `consentTarget` + `consentClassification` fields.
- **Step 3.7 (manifest synthesis)** — the `permissions` declaration.
- **Phase 4 Step 4.6 (synthesis)** — the full security model.
- **`LiveCapabilityRegistry`** — the runtime that needs the changes.
- **`SandboxRunner`** — the inline handler runtime; permissions are passed in.
