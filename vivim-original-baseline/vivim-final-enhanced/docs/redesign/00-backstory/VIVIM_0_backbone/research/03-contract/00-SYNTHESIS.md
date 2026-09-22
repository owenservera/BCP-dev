# Step 3.7: CONTRACT SYNTHESIS — The `vivim-extension.json` Manifest

**Date:** 2026-08-28
**Sources:** Steps 3.1-3.6
**Status:** DESIGNED

---

## The unified extension manifest

An extension declares its identity + contributions in a single JSON file. The host reads it on install, validates it, applies each contribution, and tracks the extension for lifecycle.

```json
{
  // ── Manifest metadata (required) ──
  "manifestVersion": "1.0",
  "id": "my-extension",
  "name": "My Extension",
  "description": "Does X, Y, Z",
  "version": "1.2.3",
  "author": {
    "name": "Jane Developer",
    "email": "jane@example.com",
    "url": "https://myext.dev"
  },
  "license": "MIT",
  "homepage": "https://myext.dev",
  "repository": "https://github.com/jane/myext",
  "engines": {
    "vivim": ">=0.1.0 <1.0.0"
  },

  // ── Permissions (required, declared) ──
  "permissions": {
    "capabilities": [
      {
        "slug": "knowledge_search",
        "reason": "Search the knowledge base for context"
      },
      {
        "slug": "memory_query",
        "reason": "Read user memory for personalization"
      }
    ],
    "filesystem": {
      "reads": [],
      "writes": []
    },
    "network": {
      "fetches": [
        { "url": "https://api.myservice.com/*", "reason": "Call MyService API" }
      ]
    },
    "consent": {
      "operations": ["communication"],
      "targets": ["myservice.com"]
    }
  },

  // ── Dependencies (optional) ──
  "dependencies": {
    "other-extension": "^2.0.0",
    "another": "1.x"
  },

  // ── Contributions (zero or more) ──
  "contributes": {
    "capabilities": [
      // ... CapabilityContribution[]
    ],
    "surfaces": [
      // ... SurfaceContribution[]
    ],
    "providers": [
      // ... ProviderContribution[]
    ],
    "storage": [
      // ... StorageContribution[]
    ],
    "lifecycle": [
      // ... LifecycleContribution[]
    ]
  }
}
```

The full schema is a superset of all 5 contribution types. The host validates the entire JSON against the schema, then processes each contribution in order.

---

## The TypeScript schema (top-level)

```typescript
export interface ExtensionManifest {
  manifestVersion: '1.0'
  id: string                         // unique; reverse-DNS or kebab-case
  name: string
  description: string
  version: string                   // semver
  author: {
    name: string
    email?: string
    url?: string
  }
  license?: string                  // SPDX
  homepage?: string                 // URL
  repository?: string               // URL
  engines: {
    vivim: string                   // semver range
  }

  permissions: ExtensionPermissions

  dependencies?: Record<string, string>  // ext-id → semver

  contributes: {
    capabilities?: CapabilityContribution[]
    surfaces?: SurfaceContribution[]
    providers?: ProviderContribution[]
    storage?: StorageContribution[]
    lifecycle?: LifecycleContribution[]
  }
}

export interface ExtensionPermissions {
  capabilities: Array<{
    slug: string
    reason: string                  // shown to user at install time
  }>
  filesystem: {
    reads: string[]                 // paths or path patterns
    writes: string[]
  }
  network: {
    fetches: Array<{
      url: string                   // URL pattern
      reason: string
    }>
  }
  consent: {
    operations: ('read' | 'write' | 'navigate' | 'destructive' | 'financial' | 'communication')[]
    targets: string[]
  }
}
```

---

## Install / Uninstall / Update lifecycle

### Install

1. User provides a tarball (`.vivim-plugin`) or directory.
2. Host extracts the tarball.
3. Host reads `vivim-extension.json`.
4. Host validates the manifest against the schema (Zod).
5. Host checks the `engines.vivim` range against the host version.
6. Host checks `dependencies` (if any) are installed.
7. Host prompts the user to grant the declared `permissions`.
8. User grants (or denies). If denied, install aborts.
9. Host applies each `contributes` entry:
   - For `capabilities[]`: call `LiveCapabilityRegistry.registerLive(spec)` (with the per-cap permissions).
   - For `surfaces[]`: register in the `UIComponentRegistry` catalog + send `SlotOverrideClaim`.
   - For `providers[]`: call `ProviderRegistrar.register(manifest)`.
   - For `storage[]`: register the node type + auto-generate CRUD capabilities.
   - For `lifecycle[]`: subscribe to events + schedule cron.
10. Host writes the manifest + install state to `extension_install` table (a new table; or to a Node with `type: 'extension.install'`).
11. Host fires `extension:installed` event.

### Uninstall

1. User requests uninstall.
2. Host reads the install record.
3. Host runs each contribution's `uninstall` hook:
   - For `capabilities[]`: `LiveCapabilityRegistry.revokeLive(id)`.
   - For `surfaces[]`: unregister from `UIComponentRegistry` catalog + clear `SlotOverrideClaim`.
   - For `providers[]`: unregister from `ProviderRegistrar`.
   - For `storage[]`: run `uninstall.deleteData` policy (default: archive).
   - For `lifecycle[]`: unsubscribe from events + cancel cron.
4. Host fires `extension:uninstalled` event.
5. Host deletes the install record (or marks archived).

### Update

1. User provides a new version.
2. Host reads the new manifest.
3. Host diffs the manifests:
   - If the new version is incompatible (semver-major), the user must uninstall first.
   - If compatible, the host applies the diff:
     - For each new `contributes` entry: register.
     - For each removed entry: unregister.
     - For each modified entry: re-register (preserving any user data per the migration policy).
4. Host runs any `migrations[]` from the new `StorageContribution[]` on existing data.
5. Host fires `extension:updated` event.

---

## The 5 contribution types — summary

| Type | What it does | At runtime |
|---|---|---|
| **CapabilityContribution** | Add a command (CLI / MCP / API / UI / workflow) | `LiveCapabilityRegistry.registerLive` |
| **SurfaceContribution** | Add a UI renderer to a 30-slot position | `UIComponentRegistry.register` + slot override |
| **ProviderContribution** | Add a chat provider (LLM service) | `ProviderRegistrar.register(manifest)` |
| **StorageContribution** | Add a new Node `type` with schema + auto-CRUD | `NodeStore` type registration + auto-generated live caps |
| **LifecycleContribution** | Subscribe to events / boot / shutdown / cron | `CapabilityEventBus.on` + cron scheduler |

A user extension can declare any combination. A "Slack integration" might declare 2 capabilities (send + list channels) + 1 lifecycle (on boot, fetch workspace info) + 1 storage (slack-channel).

---

## The trust model

The `permissions` field is **declared**. The host **enforces**. At install time:
- The user sees what the extension wants (capability slugs, file paths, URL patterns, operation tiers).
- The user grants or denies.
- The host stores the grant (time-bounded, like the `ConsentEngine`).
- The extension's handlers run with the granted permissions.
- If a handler exceeds the granted permissions, the host throws.

This is the **explicit-permission model** (like VS Code's `contributes.permissions` or browser extension permissions). The user is the trust root.

---

## What about Phase 4 (security)?

The `permissions` field is the user-facing layer. Phase 4 will design:
- The technical implementation of each permission type.
- The sandbox modes (QuickJS, vm) per permission.
- The consent UI (where the user grants).
- The audit log (per-extension, per-handler).
- The trust score (per extension, computed from provenance + history).

---

## What about Phase 5 (lifecycle)?

The install/uninstall/update flow above is the **packaging** lifecycle. Phase 5 will design:
- The `.vivim-plugin` tarball format spec.
- The marketplace / registry.
- The signing + verification.
- The hot-update mechanism (without uninstall/reinstall).
- The `onUpgrade(fromVersion)` hook (per Step 1.14, the test references it).
- The health check (`onHealthCheck`).
- The dependency resolution.
- The "extension update available" notification.

---

## The 5 vs 4 vs 3 layer question — where does the manifest fit?

The extension model is one layer above the existing 4 extension surfaces (capabilities, providers, slots, reprogrammability). It unifies them.

```
┌─────────────────────────────────────────────────────────────┐
│  vivim-extension.json (the manifest)                        │
│  declares: id, version, permissions, contributes             │
└──────────────────────┬──────────────────────────────────────┘
                       │
       ┌───────────────┼───────────────┐
       │               │               │
   ┌───▼────┐    ┌─────▼─────┐    ┌────▼────┐
   │  Live  │    │  UI Reg   │    │ Provider│
   │  Cap   │    │  (slot)   │    │ Reg     │
   │  Reg   │    │           │    │         │
   └────────┘    └───────────┘    └─────────┘
```

The manifest is the *user-facing* contract. The 3 registries (Live, UI, Provider) are the *runtime* contracts. The manifest's `contributes` declares which registry each piece lands in.

---

## What's missing from the design

1. **The `extension_install` storage shape.** A new table or Node type. The host's responsibility to define.
2. **The `permissions` → runtime mapping.** The `permissions.capabilities[].slug` maps to a `SandboxPermissions.canFetch` allowlist (for HTTP live caps). The `permissions.filesystem` maps to `canReadFile` / `canWriteFile`. The `permissions.network` is the same. The `permissions.consent.operations` maps to `ConsentEngine`. **Phase 4 will detail this.**
3. **The "extension" entity in the system.** A user can install multiple extensions; each has an id, version, install state. The entity is implicit (the install record). Should it be a Node with `type: 'extension.install'`? Probably yes (Step 3.5 philosophy).
4. **Conflict resolution.** If two extensions declare the same capability slug, the install fails (or the second extension overrides). The contract should declare this. Default: fail.
5. **Versioning policy.** The host's semver policy: major-version updates require explicit uninstall; minor + patch are auto-updated. The contract is permissive; the host decides.
6. **Deprecation policy.** When a capability is removed, the host can mark the extension's capabilities as deprecated. The user sees a warning.
7. **Telemetry.** An extension can opt in to / opt out of telemetry. (VS Code has this.) Not in the design yet.
8. **The marketplace / search.** Out of scope for v1. Phase 5 will detail.
9. **The `onUpgrade` hook.** The test references it; the production code doesn't have it. Phase 5 will design the upgrade hook.
10. **The `onHealthCheck` hook.** The test references it. Phase 5 will design.

---

## Open design questions

1. **What if an extension wants to extend another extension's capability?** E.g. Extension A declares `send_to_slack`; Extension B wants to add a `send_to_slack_with_retry` that wraps it. **Proposed:** Extension B's `CapabilityContribution` can declare `dependencies: { 'ext-a': '^1.0' }` and call `send_to_slack` via the host's capability dispatch. The cross-extension call is mediated by the host.

2. **What if an extension is malicious?** The permissions model is the gate. The user denies. The sandbox is the runtime gate. The audit log is the post-mortem. Trust score tracks reputation.

3. **Can an extension declare a permission it doesn't actually use?** Yes, but the user can deny. The host should warn if the declared permissions are excessive.

4. **What's the minimum viable extension?** Just one capability, no surfaces, no storage, no lifecycle. The host should support zero-contribution extensions (e.g. "metadata only" — an extension that just exists).

5. **Can a contribution's handler call another contribution's handler?** Yes, via the host's capability dispatch. The call goes through the registry, which is the trust boundary.

6. **What about extension-private helpers?** The `StorageContribution.capabilities[]` auto-generates CRUD. For more complex logic, the extension writes a `CapabilityContribution` with an `inline` handler that calls the host's API.

7. **What's the install order?** All capabilities are registered before surfaces (so the slot override's `sandbox` is valid). Storage is registered before surfaces (so the auto-CRUD caps exist for the slot to call). Lifecycle subscriptions are last (so they see the system in its installed state). The order is deterministic.

8. **What if the host doesn't support a contribution type?** The install fails. E.g. if the host doesn't have reprogrammability, a `ReprogrammabilityContribution` is rejected. (Not in the design yet; deferred.)

---

## Cross-references

- **Step 3.1 (CapabilityContribution)** — the capability shape.
- **Step 3.2 (SurfaceContribution)** — the UI surface shape.
- **Step 3.3 (CommandContribution)** — same as Capability with `surfaces: ['cli']`.
- **Step 3.4 (ProviderContribution)** — the provider shape.
- **Step 3.5 (StorageContribution)** — the data shape.
- **Step 3.6 (LifecycleContribution)** — the lifecycle shape.
- **Phase 1 Step 1.7 (capability)** — the runtime registry.
- **Phase 1 Step 1.12 (slot system)** — the runtime registry for surfaces.
- **Phase 1 Step 1.6 (provider)** — the runtime registry for providers.
- **Phase 1 Step 1.13 (storage)** — the Node layer.
- **Phase 1 Step 1.11 (security)** — the sandbox; Phase 4 will detail the runtime enforcement.
- **Phase 2 Step 2.7 (extension points synthesis)** — what was open/closed.
- **Phase 5 (lifecycle & distribution)** — will detail the tarball format, marketplace, signing.
- **Phase 6 (final synthesis)** — the EXTENSION-MODEL.md doc.
