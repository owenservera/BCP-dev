# Step 4.6: SECURITY SYNTHESIS — The Trust Model

**Date:** 2026-08-28
**Sources:** Steps 4.1-4.5
**Status:** SYNTHESIZED

---

## The 5 layers of security for an extension

| Layer | Question it answers | Implementation |
|---|---|---|
| **1. Permissions** (declared) | What does the extension want? | `ExtensionManifest.permissions` |
| **2. Grants** (user-approved) | What does the user allow? | `ExtensionInstall.grants` |
| **3. Sandbox** (code isolation) | What can the code do? | QuickJS + `SandboxPermissions` |
| **4. Consent** (operation gating) | What can the running code do right now? | `ConsentEngine` + per-extension grants |
| **5. Audit** (post-mortem) | What did the code do? | `SandboxAuditStore` + `telemetry-audit` + `audit-trail` |

These 5 layers are layered: declared → granted → sandboxed → consented → audited. Each layer reduces the surface area of the next.

---

## The flow: install → run → audit

### Install

1. **Read manifest.** Validate JSON schema.
2. **Compute SHA-256** of the manifest. Store as the install fingerprint.
3. **Read declared permissions** (Layer 1).
4. **Show user** the manifest + permissions + a list of "what this extension will do."
5. **User grants** (Layer 2). Partial grants allowed. The `ExtensionInstall.grants` is populated.
6. **Apply contributions** (Phase 3). The host calls each registry:
   - `LiveCapabilityRegistry.registerLive(spec)` — with `permissionsProvider(spec) → SandboxPermissions` (Layer 3).
   - `UIComponentRegistry.register(slot, slug, component, sandbox)` — with the slot sandbox.
   - `ProviderRegistrar.register(manifest)` — with no sandbox (provider data is loaded into the DB).
   - `NodeStore` type registration — with ACL.
   - `CapabilityEventBus.on(event, handler)` — with the inline handler's permissions.
7. **Fire `extension:installed`** event.
8. **Audit log** records: who installed, when, the SHA-256, the granted permissions.

### Run (a capability invocation)

1. **User invokes** the capability (CLI / MCP / API / UI / workflow).
2. **Capability dispatch** (Layer 4). The `LiveCapabilityRegistry.buildHandler(spec)` runs the handler.
3. **Sandbox check** (Layer 3). If the handler is `inline`, the `SandboxRunner.run()` enforces `SandboxPermissions`.
4. **If HTTP**: the host calls `ConsentEngine.require({ target, classification })`. The grant is checked. If valid, proceed.
5. **If MCP**: the host connects to the MCP server (lazy). The orchestrator routes the tool call.
6. **Audit log** records: extensionId, handlerSlug, input, output, duration, target, classification, granted (true/false).

### Uninstall

1. **User requests uninstall.**
2. **Read install state.** Compute current SHA-256; compare to stored.
3. **If hash mismatch** (tamper detected), warn the user.
4. **Run uninstall hooks** (per `StorageContribution.uninstall.deleteData` policy).
5. **Unregister contributions** (reverse of install).
6. **Archive or delete data** (per policy).
7. **Fire `extension:uninstalled`** event.
8. **Audit log** records: who uninstalled, when, what was archived/deleted.

### Update

1. **User requests update.** New version tarball provided.
2. **Read new manifest.** Validate. Compute new SHA-256.
3. **Diff manifests.** Identify added / removed / modified contributions.
4. **Check permissions.** If new permissions > old, warn + require re-grant.
5. **Apply diff**: unregister removed, register new, re-register modified.
6. **Run migrations** (per `StorageContribution.migrations[]`).
7. **Fire `extension:updated`** event.
8. **Audit log** records: who updated, from/to version, what changed.

---

## The 3-tier trust model (recap from 4.3)

| Tier | Source | Sandbox | Permissions | Update |
|---|---|---|---|---|
| **Bundled** | Shipped with host | Weak / none | Auto-granted | Host update |
| **Workspace** | Workspace config | QuickJS | User grants | Workspace config |
| **User** | User profile | QuickJS | User grants | User opt-in |

The `permissionsProvider` (Step 4.1) returns:
- For bundled: the manifest's permissions (no restriction).
- For workspace/user: the user's grants (filtered).

---

## The trust score (recap from 4.3)

```typescript
interface ExtensionTrustScore {
  extensionId: string
  reputation: number            // 0-100; starts at 50
  auditViolations: number
  userOverrides: number
  flagged: boolean
}
```

The score is computed from the source + audit history. The host shows it in the UI. Low-score extensions get a warning at install time.

---

## The resource limits (recap from 4.4)

```typescript
interface ResourceLimits {
  cpu?: { callsPerMinute?: number; maxCpuMsPerCall?: number }
  memory?: { maxMemoryBytesPerCall?: number }
  network?: { maxRequestsPerMinute?: number; maxBytesPerMinute?: number }
  storage?: { maxNodes?: number; maxBytesPerNode?: number }
  cost?: { maxCostPerDay?: number }
}
```

Defaults:
- 60 calls/min, 5s CPU/call, 50MB memory/call.
- 30 requests/min network, 10MB/min.
- 1000 nodes, 1MB/node.
- $1/day cost.

The host enforces via sliding window. The user can grant higher (with warning).

---

## The supply chain (recap from 4.5)

v1: unsigned, SHA-256 weak signing on load. v2: ed25519 / rsa-pss-sha256 with certificate chain.

---

## What's missing in the current code (the gap analysis)

| Gap | Today | Proposed fix |
|---|---|---|
| `LiveCapabilityRegistry.permissionsFor()` is hardcoded | Default-deny only | Inject `permissionsProvider(spec) → SandboxPermissions` |
| `LiveCapabilityRegistry` HTTP handlers bypass `ConsentEngine` | `audit?.fetch` only | Call `consentEngine.require()` before fetch |
| `ConsentEngine` has no `extensionId` dimension | System-level only | Add `extensionId?` to `ConsentGrant` |
| `P0PolicyEngine` has no `extensionId` dimension | Global only | Add `extensionOverrides` option |
| `trust-score.ts` only scores mutations | `MutationProvenance` → score | Add `ExtensionTrustScore` |
| `LiveCapabilityRegistry` has no rate limiting | None | Add per-extension rate limit + sliding window |
| `LiveCapabilityRegistry` has no audit per extension | Per-call only | Add `extensionId` to audit log |
| `SandboxRunner` per-extension budget | Per-call default | Pass per-extension `SandboxBudget` |
| No UI for granting / revoking | (engine is gate; UI is host's job) | The host's UI (out of scope for this design) |
| No marketplace | None | Phase 5 / v2 |

---

## The "minimum viable security" for v1

To ship v1 of the extension model, the host must:

1. **Add a `permissionsProvider` injection** to `LiveCapabilityRegistry`. Default: deny-all.
2. **Add `consentEngine.require()` to the HTTP live handler.** Default: deny.
3. **Add `extensionId` to `ConsentGrant`.** Default: any non-system grant is per-extension.
4. **Add per-extension rate limits.** Default: the limits in Step 4.4.
5. **Add per-extension audit logging.** Every sandbox call, every consent grant, every mutation.
6. **Add a SHA-256 fingerprint** on install + verification on load.
7. **Add a UI** for the user to review permissions + grants + audit log.

That's the minimum. **Without (1)-(3), the live HTTP handler is a security gap (Step 1.11). Without (4)-(5), resource exhaustion and audit gaps. Without (6), no tamper detection.**

---

## The "production-grade security" for v1

In addition to the minimum:

8. **Per-extension `SandboxBudget`** wired through.
9. **Per-extension `P0PolicyEngine` overrides** (for autonomous extensions).
10. **Extension trust score** computed at install + updated on audit events.
11. **Manifest hash on every contribution** — if a contribution's source changes, detect and warn.
12. **Network airgap mode** (already exists, per `airgap.ts` 4268 lines) — extensions that need network fail loudly.
13. **Anti-detection** (already exists, `anti-detection.ts` 3859 lines) — for browser-driven extensions.

---

## The "v2 security" wishlist

- **Signing** (ed25519 + certificate chain).
- **Publisher trust** (user pins "I trust Jane's extensions").
- **Marketplace reputation** (aggregated user ratings).
- **Cross-extension data isolation** (extension A cannot read extension B's data without explicit grant).
- **Per-capability sub-grants** (e.g. "this extension can call `send_to_slack` but only to channel X").
- **Revocation propagation** (revoking one grant cascades to dependent grants).
- **Sandbox mode plugins** (e.g. a "trusted-mode" sandbox for high-trust extensions that allows more APIs).

---

## The trust boundary diagram

```
┌──────────────────────────────────────────────────────┐
│  HOST (the user runs this)                            │
│                                                       │
│  ┌─────────── EXTENSION SANDBOX ────────────┐         │
│  │                                          │         │
│  │  ┌─ QuickJS handler ─┐                   │         │
│  │  │                   │                   │         │
│  │  │  read input       │ ←─ canUseClipboard: true/false
│  │  │  compute         │ ←─ canReadFile: [...]
│  │  │  return output   │ ←─ canWriteFile: [...]
│  │  │                   │ ←─ canFetch: [...]  (QuickJS intercepts)
│  │  └───────────────────┘                   │         │
│  │                                          │         │
│  │  Audit: every call → auditId            │         │
│  │                                          │         │
│  └──────────────────────────────────────────┘         │
│         │                                              │
│         │ host's API (gated)                           │
│         ▼                                              │
│  ┌─────────── CONSENT ENGINE ───────────────┐         │
│  │  operation: { target, classification }    │         │
│  │  grant: { extensionId, expiresAt }        │         │
│  │  → allow / deny                            │         │
│  └───────────────────────────────────────────┘         │
│         │                                              │
│         ▼                                              │
│  ┌─────────── NODE STORE ────────────────────┐        │
│  │  Node: { type, dataJson, acl, ... }       │        │
│  │  ACL enforced at impl layer                │        │
│  └───────────────────────────────────────────┘         │
│                                                       │
│  Audit log: every operation → extensionInstallId      │
│                                                       │
└──────────────────────────────────────────────────────┘
```

The QuickJS handler is the inner box. The consent engine is the gate. The Node store is the data. The audit log is the trail.

---

## What this fixes for the user

- ✅ The user can review what an extension wants.
- ✅ The user can grant or deny each permission.
- ✅ The user can revoke at any time.
- ✅ The user can review the audit log.
- ✅ The user can rate the extension (in v2).
- ✅ The user can trust a publisher (in v2).
- ✅ The user can uninstall cleanly.

## What this does NOT fix

- **The user is the trust root.** If the user blindly grants all permissions, the extension is fully trusted. The host can warn; it cannot force.
- **The audit log is only useful if the user reads it.** Most users won't.
- **A malicious extension can be subtle.** It can read the user's data and exfiltrate it slowly. The audit log shows the exfiltration; the user must notice.
- **The bundled extensions are out of scope.** The host's release process is the gate.

---

## The 5 hard "must-do"s for v1

1. **`permissionsProvider` injection** in `LiveCapabilityRegistry`. **Without this, every inline handler is a security risk.**
2. **`consentEngine.require()` in the HTTP live handler.** **Without this, every HTTP live handler bypasses consent.**
3. **Per-extension `extensionId` on every grant + audit log entry.** **Without this, the audit log can't distinguish extensions.**
4. **SHA-256 fingerprint on install + load.** **Without this, no tamper detection.**
5. **A user-facing UI for permissions + grants + audit.** **Without this, the user has no way to manage.**

If only one of these ships, ship (1) and (2). They're the live-CapabilityRegistry gap (Step 1.11).

---

## Open design questions

1. **What about the "user installs but doesn't review" path?** The host should show the audit log + trust score periodically. "Hey, your 'My Tasks' extension has accessed 50 nodes this week. Is that expected?"

2. **What about a "dry run" mode?** The user can install with a "dry run" flag. The extension's contributions are registered but disabled. The user can see what the extension would do without it actually doing anything.

3. **What about "automatic extension updates"?** A user can opt in: "auto-update patch versions, ask for minor versions." The host compares versions, runs the diff, fires the `extension:updated` event.

4. **What about a "trusted publisher" list?** The user can say "I trust Jane's extensions." The host skips the review UI for Jane's extensions. (v2.)

5. **What about the "ask the user" delay?** If a permission is denied, the user can grant it later. The extension is in a "waiting for grant" state. The UI shows the pending grants.

6. **What about cross-extension calls?** Extension A calls extension B's capability. Whose permission is checked? **A's permission** (the caller). If A doesn't have permission to call B, the call fails. **A's audit log records the call attempt.**

7. **What about a malicious extension that doesn't declare its permissions?** The host should detect: declared permissions don't match actual behavior. E.g. extension declares no `network.fetches` but the inline handler tries to call the host's fetch API. The host denies + audit-logs. **This is the runtime enforcement gap.**

8. **What about the `safe-eval.ts` denylist (H9)?** The inline handler's `code: string` is parsed by `safe-eval.ts` first. The denylist is the gate. The H9 hazard is "fail-open." The fix is `safe-expression.ts` (AST allowlist). **Until `safe-expression.ts` is complete, the inline handler is a denylist-only check.** This is the highest-priority technical debt in the v1 model.

---

## Cross-references

- **Step 4.1 (consent + policy + governance)** — the 3 engines.
- **Step 4.2 (sandbox)** — QuickJS + `SandboxPermissions`.
- **Step 4.3 (trust levels)** — 3-tier model.
- **Step 4.4 (resource limits)** — sliding window.
- **Step 4.5 (supply chain)** — signing v2.
- **Step 3.7 (manifest)** — the permissions declaration.
- **Phase 5 (lifecycle & distribution)** — the install/uninstall/update flow.
- **Final synthesis (EXTENSION-MODEL.md)** — the complete picture.
