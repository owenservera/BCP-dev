# Step 3.1: Capability Contribution — Design Contract

**Date:** 2026-08-28
**Read:** Phase 1 Step 1.7 (UnifiedCapability + LiveCapability), Phase 2 Step 2.6 (commands)
**Status:** DESIGNED

---

## The question

**Can a user extension add a new capability? How?**

Today: **Yes, via `LiveCapabilityRegistry.registerLive(spec)`.** A user extension provides:
- `slug, name, description` (identity)
- `handlerSpec: { kind: 'mcp' | 'http' | 'inline', ... }` (execution)
- `inputSchema` (JSON schema for input)
- `surfaces: ['cli', 'ui', 'workflow', 'mcp', 'api']` (which transports to expose)
- `registeredBy` (attribution)

The system auto-generates `cliCommand`, `uiAction`, `workflowNodeType`, `mcpToolName`, `apiEndpoint` from the `surfaces[]` field. The capability is persisted to `LiveCapabilityStore`, hot-reloaded via `CapabilityEventBus`.

---

## What the design needs to address

Looking at Phase 1 + Phase 2 findings:

1. **`requiresConfirmation` is hardcoded `false` for live caps.** (Step 1.7 line 162.) A destructive live cap runs without confirmation. **The contract must allow this to be opt-in.**

2. **`permissionsFor()` is hardcoded** to `{ canFetch: [], canReadFile: [], canWriteFile: [], canUseClipboard: true }`. (Step 1.7 line 168-175.) A live cap cannot fetch or read files. **The contract must allow per-cap sandbox permissions.**

3. **The HTTP live handler bypasses `ConsentEngine`.** (Step 1.11 gap.) A live HTTP cap with `kind: 'http'` calls `audit?.fetch(url, init)`, not `ConsentEngine.require(...)`. **The contract must declare which network targets are allowed, and the host must enforce.**

4. **No version, no dependencies, no `activationEvents`.** A live cap is just registered. It cannot say "activate when X happens."

5. **No `category` declaration.** Live caps all get `category: 'live'`. (Step 1.7 line 145.) The capability palette can't filter them by topic.

6. **The `inline` handler runs `code: string` in the sandbox.** A user can write any string. The contract should declare what globals / APIs the inline code can call. (Today: just `input`.)

7. **The `mcp` handler assumes a configured `McpClientAdapter`.** A live cap with `kind: 'mcp'` throws if no client is wired. The contract should declare the MCP server URL + tool name (it does), but the host must wire the client.

8. **There's no `outputSchema` validation.** The capability returns `unknown` (line 28 of unified-registry.ts). The contract could declare an `outputSchema` for runtime validation.

9. **No `tags` for live caps beyond `['live']`.** (Step 1.7 line 163.) The contract could let the user declare tags.

10. **No display metadata.** No icon, no group, no order. The contract should let the user declare where it appears in the palette.

---

## The proposed `CapabilityContribution` shape

A user extension's `CapabilityContribution` is the spec for a runtime-registered capability, enriched with what's missing from `LiveCapabilitySpec`:

```typescript
// In an extension manifest, this is a JSON object.
// At runtime, this is a TypeScript object passed to registerLive().
export interface CapabilityContribution {
  // ── Identity (required) ──
  id: string                      // unique within extension; e.g. "send-to-slack"
  slug: string                    // global; e.g. "send_to_slack"
  name: string                    // human-readable
  description: string             // for the palette
  category: string                // for filtering; e.g. "communication"
  tags: string[]                  // for search; e.g. ["slack", "send", "messaging"]

  // ── Execution (required, exactly one) ──
  handler:
    | { kind: 'inline'; code: string; permissions: SandboxPermissions }
    | { kind: 'http'; url: string; method: 'GET'|'POST'|'PUT'|'DELETE'; headers?: Record<string,string>; bodyTemplate?: string; consentTarget: string; consentClassification: 'read'|'write'|'navigate'|'destructive'|'financial'|'communication' }
    | { kind: 'mcp'; serverId: string; toolName: string; url?: string; requiredServerConfig?: Record<string,string> }

  // ── Surfaces (required) ──
  surfaces: ('cli' | 'ui' | 'workflow' | 'mcp' | 'api')[]

  // ── Schema (required) ──
  inputSchema: Record<string, unknown>    // JSON schema
  outputSchema?: Record<string, unknown>  // JSON schema, optional

  // ── Display (optional) ──
  display?: {
    icon?: string
    group?: string
    order?: number
    shortcut?: string
  }

  // ── Confirmation (optional, defaults to based on classification) ──
  requiresConfirmation?: boolean

  // ── Activation (optional, defaults to eager) ──
  activation?: {
    kind: 'eager'  // registered at install
    | 'lazy'      // registered on first reference
    | 'onEvent'   // registered when an event fires
    events?: string[]  // for 'onEvent', the event types
  }
}
```

**Key differences from `LiveCapabilitySpec`:**

| Field | `LiveCapabilitySpec` (today) | `CapabilityContribution` (proposed) |
|---|---|---|
| `id` | (derived from `LiveCapabilityStore`) | explicit, unique within extension |
| `slug` | yes | yes |
| `category` | hardcoded `'live'` | explicit |
| `tags` | hardcoded `['live']` | explicit array |
| `handlerSpec` | flat object with `kind` | nested `handler` object with `kind`-discriminated |
| `handlerSpec.code` + permissions | `permissionsFor()` is hardcoded | per-cap `permissions` field |
| `handlerSpec.url` + `method` | yes | yes, with `consentTarget` + `consentClassification` |
| `surfaces` | yes | yes |
| `inputSchema` | yes | yes |
| `outputSchema` | not in spec | optional, runtime-validated |
| `display.icon/group/order/shortcut` | not in spec | optional |
| `requiresConfirmation` | hardcoded `false` | optional, defaults to `true` for `destructive`/`financial` classifications |
| `activation` | eager | eager / lazy / onEvent |

---

## Migration from `LiveCapabilitySpec` to `CapabilityContribution`

The existing `LiveCapabilityRegistry.registerLive(spec)` can be **wrapped** by a new method that takes a `CapabilityContribution`. The wrapper:
1. Derives a `LiveHandlerSpec` from `contribution.handler` (filling in the right shape per kind).
2. Calls `registerLive(spec)` with the derived shape.
3. After registration, applies the `display`, `requiresConfirmation`, `activation` overrides (via the registry's `registerOrReplace` or a new setter).

**No breaking change.** Existing live caps keep working. The new contract is the recommended path.

---

## What this fixes

- ✅ Per-cap sandbox permissions (was: hardcoded default-deny only).
- ✅ `requiresConfirmation` opt-in (was: hardcoded false).
- ✅ HTTP live handlers now require a `consentTarget` + `consentClassification` (the host can wire `ConsentEngine`).
- ✅ Version (via the extension manifest, not per-cap).
- ✅ `category` + `tags` are user-settable.
- ✅ `outputSchema` is optional.
- ✅ Display metadata.
- ✅ Activation model (eager / lazy / onEvent).

---

## What this does NOT fix

- The underlying `SandboxRunner` permission set is still allowlist-only (no denylist). That's the sandbox's contract.
- The `McpClientAdapter` must be wired by the host. The contract declares the URL; it doesn't establish the connection.
- The handler `output` is still `unknown` to the registry. `outputSchema` validates but doesn't transform.
- The `LiveCapabilityStore` is still a separate persistence; the `CapabilityContribution` is the in-memory spec, not the DB row.

---

## Sample contribution (in `vivim-extension.json`)

```json
{
  "id": "send-to-slack",
  "slug": "send_to_slack",
  "name": "Send to Slack",
  "description": "Post a message to a configured Slack channel",
  "category": "communication",
  "tags": ["slack", "send", "messaging"],
  "handler": {
    "kind": "http",
    "url": "https://slack.com/api/chat.postMessage",
    "method": "POST",
    "headers": { "Content-Type": "application/json" },
    "bodyTemplate": "{\"channel\": \"{{channel}}\", \"text\": \"{{message}}\"}",
    "consentTarget": "slack.com",
    "consentClassification": "communication"
  },
  "surfaces": ["cli", "mcp", "api"],
  "inputSchema": {
    "type": "object",
    "properties": {
      "channel": { "type": "string" },
      "message": { "type": "string" }
    },
    "required": ["channel", "message"]
  },
  "outputSchema": {
    "type": "object",
    "properties": {
      "ok": { "type": "boolean" },
      "ts": { "type": "string" }
    }
  },
  "requiresConfirmation": true
}
```

This is one capability, one HTTP call, one confirmation gate. The user installs the extension; the host registers the live cap; the user invokes it via CLI / MCP / API. **All three transports auto-work.**

---

## Open design questions

1. **How does `onEvent` activation work?** The host listens to events. When a matching event fires, the host lazily registers the live cap. But the live cap is `registerLive` — does `unregister` make sense? Lazy means: not yet registered, but the spec is loaded.

   **Proposed:** `lazy` = register on first invocation. `onEvent` = register on event match. The host keeps a "pending" set; on first use or matching event, the host calls `registerLive`.

2. **Can two extensions claim the same slug?** Today: `UnifiedCapabilityRegistry.register()` throws on duplicate (line 87-89). `registerOrReplace` is the lenient path. **Proposed:** extensions are namespaced by `extensionId` (e.g. `myext.send_to_slack`). The full slug is derived. Collision at the global level is allowed only if the engine's `registerOrReplace` is invoked; otherwise the install fails.

3. **Can a capability be re-registered on extension update?** Yes, with a version check. The new spec replaces the old. The old `unregister` is called before the new `registerLive`.

4. **What about MCP-required server config?** The contribution declares `requiredServerConfig`. The host wires it. If not wired, the cap fails on first invocation with a clear error. (Today, the live cap throws if `mcp` adapter is missing — same idea.)

5. **Is `consentClassification` the right name?** It's the operation tier from `ConsentEngine` (Step 1.11): `read < write < navigate < destructive < financial = communication`. The contribution declares the tier; the host's `ConsentEngine` is the gate. So the name is correct.

6. **What if a contribution declares `surfaces: ['api']` but the host doesn't have an HTTP server?** The cap is registered; `apiEndpoint` is set; the HTTP server may or may not pick it up. The host's responsibility.

---

## Cross-references

- **Step 1.7 (UnifiedCapability + LiveCapability)** — the existing contracts.
- **Step 1.11 (security)** — `SandboxPermissions`, `ConsentEngine`. The gap this contract closes.
- **Step 2.6 (commands)** — the cross-surface auto-projection.
- **Step 2.1 (register patterns)** — 12 writers to UnifiedCapabilityRegistry; this contract standardizes the live-cap writer.
- **Step 2.7 (extension points synthesis)** — the gaps this addresses.
- **Phase 3 Step 3.7 (synthesis)** — the unified manifest that combines all contributions.
