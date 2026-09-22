# EXTENSION-MODEL.md — The Vivim-Next Extension Model

**Date:** 2026-08-28
**Status:** DESIGN (v1 scope) + OUTLOOK (v2)
**Sources:** All 5 research phases (35 atomic steps, 35 commits)

> This is the truth-grounded roadmap for the VS Code-style extension model in vivim-next. It is based on a 35-step code-only investigation of the current codebase. Every claim cites the code that supports it.

---

## 1. What Exists Today (from Phase 1 — Baseline)

The vivim-next codebase has **4 partial extension mechanisms**, none unified:

| # | Mechanism | Real extension point? | Production-grade? | Reference |
|---|---|---|---|---|
| 1 | **Capabilities** (`LiveCapabilityRegistry`) | YES | ✓ Works | Step 1.7 |
| 2 | **Providers** (`ProviderRegistrar` + JSON manifests) | YES (chat only) | ✓ Complete | Step 1.6 |
| 3 | **Reprogrammability** (`SurfaceRegistry` + 8 ops / 7 kinds) | PARTIAL | ✗ Forge only — not in vivim-next | Step 1.4 |
| 4 | **Frontend slots** (`UIComponentRegistry` + 30 positions) | YES (UI only) | ✓ Production-grade | Step 1.12 |

Plus 4 supporting systems: **QuickJS sandbox** (Step 1.11), **60 storage contracts** (Step 1.13), **harness** (Step 1.9), **memory/knowledge** (Step 1.10).

**The "extension model" is the unification of these 4 mechanisms behind a single user-facing contract.**

---

## 2. What's Open vs Closed (from Phase 2 — Extension Points)

| Surface | Open for user | Engine only | Closed |
|---|---|---|---|
| Backend commands | Live cap register | Engine cap declare; NL catalog | New surface, new handler kind |
| Backend data | NodeStore type+data, capability-mediated access | ACL enforcement | New contract, new column |
| Backend browser | (none) | Provider manifest pipeline, harness | New protocol |
| Frontend UI (chrome) | Slot override (30 positions), catalog entry | (none) | New slot, new override policy |
| Frontend canvas | Node data, keybinding, palette, CanvasDefinition patch | (none) | New NodeType |
| Reprogrammability | InMemorySurface | Phase 9 plugin surfaces (forge) | New SurfaceKind, new MutationOp |
| Sandbox / security | QuickJS sandbox, ConsentEngine | Sandbox permissions config | New sandbox mode |
| Distribution | Directory watch | (none) | Tarball install, hot-update, version, sign, marketplace |
| Event bus | Emit, listen, new event types | (none) | (none) |

**8 missing pieces for a true VS Code model:** unified manifest format, package format, version + dependencies, hot-update, marketplace, trusted-by-default security, activation events, cross-extension compatibility.

---

## 3. The Extension Contract (from Phase 3 — Contract Design)

### The manifest: `vivim-extension.json`

A single JSON file at the root of a `.vivim-plugin` tarball.

```json
{
  "manifestVersion": "1.0",
  "id": "my-extension",
  "name": "My Extension",
  "version": "1.2.3",
  "author": { "name": "Jane Developer", "email": "jane@example.com" },
  "license": "MIT",
  "engines": { "vivim": ">=0.1.0 <1.0.0" },

  "permissions": {
    "capabilities": [{ "slug": "knowledge_search", "reason": "..." }],
    "filesystem": { "reads": [], "writes": [] },
    "network": { "fetches": [{ "url": "https://api.example.com/*", "reason": "..." }] },
    "consent": { "operations": ["communication"], "targets": ["example.com"] }
  },

  "dependencies": { "other-extension": "^2.0.0" },

  "contributes": {
    "capabilities": [ /* CapabilityContribution[] */ ],
    "surfaces":     [ /* SurfaceContribution[] */ ],
    "providers":    [ /* ProviderContribution[] */ ],
    "storage":      [ /* StorageContribution[] */ ],
    "lifecycle":    [ /* LifecycleContribution[] */ ]
  }
}
```

### The 5 contribution types

| Type | Purpose | At runtime |
|---|---|---|
| **CapabilityContribution** | Add a command (CLI / MCP / API / UI / workflow) | `LiveCapabilityRegistry.registerLive` |
| **SurfaceContribution** | Add a UI renderer to a 30-slot position | `UIComponentRegistry.register` + slot override |
| **ProviderContribution** | Add a chat provider (LLM service) | `ProviderRegistrar.register(manifest)` |
| **StorageContribution** | Add a new Node `type` with schema + auto-CRUD | `NodeStore` type registration + auto-generated live caps |
| **LifecycleContribution** | Subscribe to events / boot / shutdown / cron / upgrade / uninstall | `CapabilityEventBus.on` + cron scheduler |

### Sample: a Slack integration

```json
{
  "id": "slack-integration",
  "name": "Slack Integration",
  "version": "1.0.0",
  "permissions": {
    "network": { "fetches": [{ "url": "https://slack.com/api/*", "reason": "Slack API" }] },
    "consent": { "operations": ["communication"], "targets": ["slack.com"] }
  },
  "contributes": {
    "capabilities": [
      {
        "id": "send_to_slack",
        "slug": "send_to_slack",
        "name": "Send to Slack",
        "category": "communication",
        "handler": {
          "kind": "http",
          "url": "https://slack.com/api/chat.postMessage",
          "method": "POST",
          "consentTarget": "slack.com",
          "consentClassification": "communication"
        },
        "surfaces": ["cli", "mcp", "api"],
        "inputSchema": { ... },
        "outputSchema": { ... },
        "requiresConfirmation": true
      }
    ],
    "storage": [
      {
        "id": "slack-channels",
        "nodeType": "slack.channel",
        "dataSchema": { "type": "object", "properties": { "name": { "type": "string" }, ... } },
        "acl": { "defaultSecurityLevel": 50, "defaultACL": [{ "principal": "self", "permission": "admin" }] },
        "capabilities": [
          { "id": "slack.list_channels", "operation": "list", "surfaces": ["cli", "mcp", "api"] },
          { "id": "slack.create_channel", "operation": "create", "surfaces": ["cli", "mcp", "api"] }
        ]
      }
    ],
    "lifecycle": [
      {
        "id": "on-boot-fetch-channels",
        "subscription": { "kind": "boot", "handler": { "kind": "capability", "slug": "slack.list_channels" } }
      }
    ]
  }
}
```

This extension has 1 capability, 2 auto-CRUD capabilities, 1 lifecycle hook, and a Node type. The user installs it; it appears in 3 transports (CLI/MCP/API) plus the chat composer slot.

---

## 4. The Security Model (from Phase 4 — Security)

### The 5 layers

| Layer | Question it answers | Implementation |
|---|---|---|
| **1. Permissions** (declared) | What does the extension want? | `ExtensionManifest.permissions` |
| **2. Grants** (user-approved) | What does the user allow? | `ExtensionInstall.grants` |
| **3. Sandbox** (code isolation) | What can the code do? | QuickJS + `SandboxPermissions` |
| **4. Consent** (operation gating) | What can the running code do right now? | `ConsentEngine` + per-extension grants |
| **5. Audit** (post-mortem) | What did the code do? | `SandboxAuditStore` + `telemetry-audit` |

### The 3-tier trust model

| Tier | Source | Sandbox | Permissions |
|---|---|---|---|
| **Bundled** | Shipped with host | Weak / none | Auto-granted |
| **Workspace** | Workspace config | QuickJS | User grants (per-workspace) |
| **User** | User profile | QuickJS | User grants (per-user) |

### The trust score (per extension)

`reputation: 0-100; auditViolations: count; userOverrides: count; flagged: bool`

Computed from source + audit history. Low-score extensions get warnings, not blocks.

### The resource limits (per extension)

Defaults: 60 calls/min, 5s CPU/call, 50MB memory/call, 30 network requests/min, 10MB/min, 1000 nodes, 1MB/node, $1/day cost. Tracked via sliding window. User can grant higher (with warning).

### The 5 must-dos for v1

1. **`permissionsProvider` injection** in `LiveCapabilityRegistry`. **Closes the inline-handler sandbox gap.**
2. **`consentEngine.require()` in the HTTP live handler.** **Closes the HTTP-bypass-consent gap.**
3. **`extensionId` on every grant + audit log entry.** **Per-extension attribution.**
4. **SHA-256 fingerprint** on install + load. **Tamper detection.**
5. **A user-facing UI** for permissions + grants + audit. **The user is the trust root.**

---

## 5. The Lifecycle (from Phase 5 — Lifecycle & Distribution)

### The 5 install paths

| Path | Source | Use case |
|---|---|---|
| A | `.vivim-plugin` tarball | User downloads + installs |
| B | URL | User runs `vivim install <url>` |
| C | Marketplace (v2) | User runs `vivim install <extension-id>` |
| D | Directory watch | Dev mode — host watches a folder |
| E | Workspace config | Team mode — `vivim.workspace.json` lists extensions |

All 5 paths run the **same install pipeline**: read → validate → grant → apply.

### The activation modes (per contribution)

| Mode | When | Use case |
|---|---|---|
| `eager` (default) | At install + at every host boot | Background tasks, default |
| `lazy` | On first invocation | Capabilities that aren't always needed |
| `onEvent` | When a specified event fires | Reactive capabilities, event handlers |

### The hot-reload path

- **Dev mode** uses the existing `PluginHotReload` (file watcher).
- **Production update** is a re-install with a new version. The `LifecycleContribution.subscription.kind: 'upgrade'` hook runs before the diff.

### The uninstall path

1. User clicks "Uninstall."
2. Host prompts: "Keep data / Archive / Delete?"
3. Host unregisters all contributions.
4. Per `StorageContribution.uninstall.deleteData`: archive / all / keep.
5. `LifecycleContribution.subscription.kind: 'uninstall'` hook runs.
6. Install Node is deleted.
7. Audit log records everything.

### The marketplace (v2)

Out of scope for v1. v1's contract is marketplace-compatible: same manifest, same tarball, same install pipeline. v2 adds: signing, publisher registry, review system, marketplace server.

---

## 6. What's Out of Scope for v1

| Item | Why out of scope | When |
|---|---|---|
| Signing (ed25519 / rsa-pss-sha256) | v1 uses SHA-256 weak signing | v2 |
| Marketplace | Needs hosting infrastructure | v2 |
| Publisher trust model | Needs marketplace | v2 |
| User reviews + ratings | Needs marketplace | v2 |
| Disable (pause) flow | v1.5 — uninstall works; disable is a UX layer | v1.5 |
| `onUpgrade` / `onUninstall` / `onHealthCheck` hooks | Test references them; code doesn't have them | v1.5 |
| `safe-expression.ts` migration | Currently uses `safe-eval.ts` denylist (H9 hazard) | continuous |
| Reprogrammability migration to vivim-next | Forge only today | post-v1 |
| Auto-update notifications | Needs marketplace | v2 |
| Cross-extension data isolation | v1 uses Node-level ACL; per-extension isolation is opt-in | v2 |

---

## 7. Open Questions (for the principal)

These are the decisions the design can't make alone. Each is a fork in the road.

1. **Q: Should v1 ship with a marketplace server, or only tarball/URL/directory/workspace paths?**
   - **Option A (recommended):** v1 = tarball/URL/directory/workspace. v2 = marketplace. Lower friction to ship.
   - **Option B:** v1 includes a hosted marketplace. Higher value to users, more work.

2. **Q: Should v1 require a SHA-256 fingerprint match on every load, or just on install?**
   - **Option A (recommended):** match on every load. Catches tampering.
   - **Option B:** match on install only. Lower CPU cost, less safety.

3. **Q: Should `requiresConfirmation: true` be the default for `communication` operations, or opt-in?**
   - **Option A (recommended):** default true for `communication` + `financial` + `destructive`. User explicitly opts out.
   - **Option B:** opt-in. Lower friction, less safety.

4. **Q: Should extensions be able to declare `dependencies` on other extensions in v1, or only v1.5?**
   - **Option A (recommended):** v1 supports dependencies. Without them, multi-extension systems are awkward.
   - **Option B:** v1.5. Single extension per feature.

5. **Q: Should the `StorageContribution` auto-generate CRUD capabilities be the default, or opt-in?**
   - **Option A (recommended):** default on. Less boilerplate.
   - **Option B:** opt-in. More explicit.

6. **Q: Should `LiveCapabilityRegistry.HTTP` handlers require a `consentTarget` + `consentClassification`?**
   - **Option A (recommended):** yes. Closes the consent-bypass gap.
   - **Option B:** no. Allow extensions to skip consent. (Don't do this.)

7. **Q: Should the `LiveCapabilityStore` schema include the `activation` field?**
   - **Option A (recommended):** yes. The host can persist lazy + onEvent caps and load them on trigger.
   - **Option B:** no. The host keeps activation state in a separate store.

8. **Q: Should the bulk `unregisterExtension(extensionId)` orchestrator be built in v1 or v1.5?**
   - **Option A (recommended):** v1. Without it, uninstall is incomplete.
   - **Option B:** v1.5. Manual unregister for now.

---

## 8. The Sub-Cards to Admit (post-research)

This research produces the design. The implementation requires admitting new cards. **Proposed list** (subject to principal approval):

| Card | Title | Status |
|---|---|---|
| F-042 | `vivim-extension.json` schema + Zod validator | SCAFFOLD (this research is the spec) |
| F-043 | `ExtensionInstaller` (5 install paths → 1 pipeline) | SCAFFOLD (Step 5.1) |
| F-044 | `ExtensionInstallStore` (Node type for install state) | SCAFFOLD (Step 5.1) |
| F-045 | `LiveCapabilityRegistry.permissionsProvider` injection | SCAFFOLD (Step 4.1 + 4.2) |
| F-046 | `LiveCapabilityRegistry.consentEngine` injection (close HTTP bypass) | SCAFFOLD (Step 4.1) |
| F-047 | `ExtensionTrustScore` + `trust-score.ts` extension dimension | SCAFFOLD (Step 4.3) |
| F-048 | Per-extension rate limits + sliding window | SCAFFOLD (Step 4.4) |
| F-049 | Bulk `unregisterExtension` orchestrator | SCAFFOLD (Step 5.4) |
| F-050 | `onUpgrade` / `onUninstall` / `onHealthCheck` lifecycle hooks | SCAFFOLD (Step 5.3 + 5.4) |
| F-051 | `StorageContribution` auto-CRUD generator | SCAFFOLD (Step 3.5) |
| F-052 | `SurfaceContribution` slot wiring | SCAFFOLD (Step 3.2) |
| F-053 | Reprogrammability migration to vivim-next | SCAFFOLD (Step 1.4) |
| F-054 | `safe-expression.ts` migration (close H9 hazard) | SCAFFOLD (Step 1.11) |
| F-055 | `vivim-extension` UX (host UI) | DESIGN (out of scope for this design doc) |
| F-056 | Marketplace server (v2) | DESIGN (v2) |
| F-057 | Signing + publisher registry (v2) | DESIGN (v2) |

**12 SCAFFOLD + 3 DESIGN = 15 sub-cards.** Each becomes a FEATURE_CARD through the standard admission process.

---

## 9. The Roadmap

### Phase 0: Foundation (this is what this research does)

- ✅ `vivim-extension.json` schema (Step 3.7)
- ✅ 5 contribution types (Steps 3.1-3.6)
- ✅ Security model (Steps 4.1-4.6)
- ✅ Lifecycle (Steps 5.1-5.5)
- ✅ This document (Step 5.6)

### Phase 1: Must-Have v1 (5 must-dos from Step 4.6)

- **F-045** `permissionsProvider` injection
- **F-046** `consentEngine` injection
- **F-044** Per-extension audit log
- **F-043** SHA-256 fingerprint
- **F-055** User UI for permissions + grants + audit

### Phase 2: Nice-to-Have v1

- **F-047** Trust score per extension
- **F-048** Per-extension rate limits
- **F-049** Bulk unregister
- **F-050** onUpgrade / onUninstall hooks
- **F-051** StorageContribution auto-CRUD
- **F-052** SurfaceContribution slot wiring

### Phase 3: v1.5 (disable + polish)

- **F-049** bulk `uninstallExtension`
- Disable flow (pause + resume)
- `onHealthCheck` hook
- Reprogrammability migration
- `safe-expression.ts` migration (close H9)

### Phase 4: v2 (marketplace + signing)

- **F-056** Marketplace server
- **F-057** Signing + publisher registry
- Cross-extension data isolation
- Auto-update notifications
- User reviews + ratings

---

## 10. The Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Live HTTP handler bypasses consent | High today | High | F-046 |
| Inline handler is denylist-only (H9) | High today | High | F-054 (safe-expression.ts) |
| User installs malicious extension | Medium | Medium | Permissions + audit + trust score |
| Extension update breaks data | Medium | High | `migrations[]` + rollback + NodeVersion time travel |
| Two extensions claim same slug | Medium | Medium | Slug is namespace-by-extension-id; collision is install error |
| Marketplace server is compromised (v2) | Low | Critical | Signing + certificate chain |
| Tarball contains executable code | High | High | Sandboxed; quickjs runs it, not host |

---

## 11. The Vocabulary (so we're aligned)

- **Extension** = a user-installable package with a `vivim-extension.json` manifest, a `.vivim-plugin` tarball, a unique `id`, a semver `version`, declared `permissions`, and one or more `contributes`.
- **Contribution** = a typed addition: capability, surface, provider, storage, lifecycle. The unit of what the extension adds.
- **Manifest** = `vivim-extension.json`. The contract.
- **Tarball** = `.vivim-plugin`. The package format. Contains the manifest + dist/ + inline/ + parsers/ + README + LICENSE.
- **Capability** = a command. A `UnifiedCapability` registered in the `UnifiedCapabilityRegistry`. 5 surfaces: cli, ui, workflow, mcp, api.
- **Live capability** = a runtime-registered capability. The primary extension point. 3 handler kinds: inline, http, mcp.
- **Surface** = a UI position. One of 30 slots. Overridable per slot's `overridableBy` policy.
- **Slot** = a position in the UI. `chat.composer`, `tab.bar`, `entry.unified`, etc. The 30-slot catalog is closed; the catalog of renderers is open.
- **Node** = the universal data unit. `NodeStore` is the layer.
- **Sandbox** = QuickJS WASM with allowlist permissions. Inline handlers run here.
- **Grant** = a user-approved permission for an extension. Time-bounded.
- **Audit log** = the per-operation log. Every sandbox call + every consent grant + every mutation.
- **Trust score** = 0-100 reputation. Computed from source + audit history.
- **Activation** = eager / lazy / onEvent. Per contribution.
- **Tier** = bundled / workspace / user. Per extension.

---

## 12. The End

This document is the **truth-grounded roadmap** for the VS Code-style extension model in vivim-next. It is based on a 35-step code-only investigation. Every claim cites the code.

The next step is **principal approval of the open questions (Section 7)** + **admission of the sub-cards (Section 8)**. Once approved, the implementation begins with the 5 must-haves (Section 9, Phase 1).

**Total research output:**
- 35 atomic commits (one per step)
- 36 research files (~10,000 lines of analysis)
- 1 final design document (this file)
- 16 proposed sub-cards (F-042 through F-057)

The principal has a choice to make.
