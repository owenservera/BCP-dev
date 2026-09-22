# Step 3.4: Provider Contribution — Design Contract

**Date:** 2026-08-28
**Read:** Phase 1 Step 1.6 (provider plugins), Phase 2 Step 2.7 (extension points)
**Status:** DESIGNED

---

## The question (from the process)

> "Can an extension add a new chat provider (like a new LLM service)? Is the data-driven provider system (manifest + parsers) reusable as the 'extension' model for LLM providers?"

## The answer

**Yes, the data-driven provider system IS the v1 provider model.** It already exists, works, and is the most complete extension pipeline in the codebase. But it is **provider-specific** — the manifest schema is LLM-flavored (endpoints, models, parsers, recovery strategies, etc.). A new "provider" today is a JSON file in `seeds/providers/manifests.ts` (forge only).

The proposed `ProviderContribution` is a thin wrapper that:
1. Accepts a `ProviderManifest` (existing Zod schema).
2. Validates it.
3. Calls `ProviderRegistrar.register(manifest)` (existing).
4. Tracks the contribution for lifecycle (uninstall → unregister).

---

## The existing `ProviderManifest` shape (from Step 1.6)

```typescript
{
  $schema: 'https://vivim.app/cap-store/v1/provider-manifest.schema.json',
  provider: {
    slug, display_name, description, category, provider_type,
    website_url, documentation_url, auth_type, has_multi_account,
    profile_strategy, fleet_config, capabilities: string[], accessTier,
  },
  endpoints: [{ label, url, endpoint_type, is_default, selector?, composer_type?, send_method?, content_editable? }],
  models: [{ slug, display_name, is_default, context_window, max_output_tokens, supports_*, pricing_* }],
  capabilities_config: [{ global_capability_id, recovery_strategies[], ui_*_override }],
  parsers: [{ logic_type, logic_code, fallback? }],
  config: [{ key, value, type, is_secret }],
}
```

This is ~120 fields per manifest. Real, machine-checked, persisted to 6 DB tables.

---

## The proposed `ProviderContribution` shape

A user extension declares a provider by listing the manifest. The wrapper:

```typescript
// In an extension manifest, this is a JSON object.
// At runtime, this is wrapped into a ProviderManifest + a ProviderRegistrar call.
export interface ProviderContribution {
  // ── Identity (required) ──
  id: string                 // unique within extension; e.g. "my-llm"
  providerSlug: string       // matches the manifest's `provider.slug`
  
  // ── Manifest (required) ──
  manifest: ProviderManifest  // the full data; matches the existing Zod schema
  
  // ── Lifecycle (optional) ──
  uninstall?: {
    onExtensionUninstall: 'unregister' | 'archive'  // default: unregister
  }
}
```

The host:
1. Calls `ProviderRegistrar.register(manifest)` on install.
2. On uninstall, calls the reverse: unregister the provider, delete the rows, regenerate the static protocol file.
3. On update, calls `seedProvider(slug)` to re-upsert.

---

## What this fixes

- ✅ User extensions can add a chat provider (manifest pipeline).
- ✅ The data-driven model is preserved (no code generation, just data).
- ✅ Lifecycle is wired (install → register, uninstall → unregister).

---

## What this does NOT fix

- **The `seeds/providers/manifests.ts` is in the forge, not vivim-next.** The migration target doesn't have a provider pipeline. The host would have to ship `ProviderRegistrar` + the schema.
- **The 8-phase onboarding pipeline is developer-only.** A user can't `discover → infer → test-selectors → ...` from the UI. They need a manifest.
- **No provider manifest wizard.** A user has to write the JSON by hand (or copy an existing one and modify).
- **No provider marketplace.** The user gets a provider from a friend, drops the JSON, hits "install."
- **No provider versioning.** Re-installing overwrites.
- **No provider signing.** (Same gap as general extensions.)
- **Inline `logic_code` is a security risk** (it's executable JS as a string). The provider pipeline trusts the manifest source.

---

## How the provider contribution composes with other contributions

A `ProviderContribution` does NOT need to also declare `CapabilityContribution`s. The `provider.capabilities: string[]` field (line 23-34 of `seeds/providers/manifests.ts`) lists the capabilities the provider binds to (e.g. `'send_message'`, `'select_model'`). These are **global capability ids**, not new ones.

So a provider doesn't add commands; it adds bindings to existing commands. The capability surface (`send_message`) is engine-declared. The provider says "I can handle this."

**The `ProviderContribution` is orthogonal to `CapabilityContribution`.**

---

## The provider as an "extension" — what changes?

Today, providers are NOT extensions — they're first-class data loaded at boot. The `ProviderRegistrar` is invoked during bootstrap. The user can't add one at runtime.

The proposed `ProviderContribution` makes providers runtime-loadable:
1. User writes a `ProviderManifest` (or downloads one).
2. User installs the extension.
3. Host calls `ProviderRegistrar.register(manifest)`.
4. The provider is now usable.
5. On uninstall, host unregisters.
6. On update, host re-registers.

The `provider-protocol-generator.ts` is the static-file regenerator. The host runs it after every register/unregister. (Or the protocol is read from DB at runtime, eliminating the static file.)

---

## Sample provider contribution (in `vivim-extension.json`)

```json
{
  "id": "my-llm-provider",
  "providerSlug": "myllm",
  "manifest": {
    "provider": {
      "slug": "myllm",
      "display_name": "My LLM",
      "description": "A custom LLM provider",
      "category": "ai",
      "provider_type": "llm",
      "auth_type": "api_key",
      "has_multi_account": true,
      "profile_strategy": "per_account",
      "accessTier": "free"
    },
    "endpoints": [
      { "label": "Chat", "url": "https://api.myllm.com/v1/chat", "endpoint_type": "chat" }
    ],
    "models": [
      { "slug": "myllm-1", "display_name": "My LLM 1", "is_default": true, "context_window": 128000 }
    ],
    "capabilities": ["send_message", "select_model"],
    "capabilities_config": [],
    "parsers": [
      { "logic_type": "inline", "logic_code": "function(module, exports) { exports.default = { name: 'myllm-v1', providerId: 'myllm', parse(rawBody) { return [{ type: 'text', text: rawBody }] } } }" }
    ],
    "config": [
      { "key": "api_key", "value": "", "type": "string", "is_secret": true }
    ]
  }
}
```

This is one provider. The host registers it; the user can now select "My LLM" as their chat provider.

---

## Reuse of the manifest schema as a "VS Code extension manifest"?

**No.** The provider manifest is provider-specific. The general `vivim-extension.json` (Phase 3.7 synthesis) is a *superset* that can include providers + capabilities + surfaces + data + lifecycle.

The provider manifest is a *contribution* within the larger extension manifest. A user extension that wants to add a provider declares a `ProviderContribution` inside its manifest.

---

## Open design questions

1. **Can two extensions claim the same provider slug?** No — the provider slug is the DB primary key (Step 1.6 line 88). A second install of the same slug would overwrite. The host should warn at install time.

2. **What about provider-specific permissions?** The provider system has no per-provider consent. The `auth_type: 'api_key'` requires the user to provide a key. The host's secrets store is the gate. (Not a per-cap concern; it's per-provider.)

3. **What if the provider's `parsers[].logic_code` is malicious?** The `logic_code` is run by `SandboxRunner` (per Step 1.11). The host should sandbox parser execution. (Today: parsers run in the host process. A gap.)

4. **What about provider-side surfaces (slot overrides)?** A provider can have a slot override: `slot: 'chat.composer', slug: 'myllm.chat-composer'`. The provider manifest could declare a `surfaces` field. The proposed `ProviderContribution` does NOT include this — it's a separate `SurfaceContribution` with `slug: 'myllm.chat-composer'`. (Composition is by slug namespace.)

5. **What about provider upgrade?** Today, `seedAll()` overwrites. The proposed model: re-install with a new version → `seedProvider(slug)` → manifest diff is computed; if the new manifest is compatible (no removed models, no changed endpoint URLs), it's an update; otherwise, an archive + new install.

6. **What about provider dependencies?** A provider might need an MCP server (e.g. for `mcp-kind: 'http'` parser). The `ProviderContribution` should declare required capabilities or MCP servers. (Not in the design yet.)

7. **What about provider lifecycle hooks?** The provider pipeline has no `onRegister` / `onUnregister` hooks. A provider is just data. The host can wrap the install/uninstall with custom logic (e.g. "after install, register an OAuth client"). This is in the host, not the contract.

---

## Cross-references

- **Step 1.6 (provider plugins)** — the existing pipeline.
- **Step 1.11 (security)** — `logic_code` should be sandboxed; today it isn't.
- **Step 2.7 (extension points)** — providers are (b) engine-only today.
- **Step 3.1 (capability contribution)** — orthogonal to provider.
- **Phase 3 Step 3.7 (synthesis)** — the unified `vivim-extension.json` that includes providers as one of several contribution types.
