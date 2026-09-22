# Step 1.6: Provider Plugins — A Data-Driven Manifest System

**Date:** 2026-08-28
**Read:**
- `plugins/provider/provider-registrar.ts` (405 lines, partial)
- `work/forge/seeds/providers/manifests.ts` (1220 lines, partial — first 120)
- **Status:** READ + ANALYZED

**Critical finding:** Providers are NOT code-driven. They are **JSON-like manifests** that get parsed by Zod, upserted into the DB, and then a code generator (`provider-protocol-generator.ts`) reads the DB into a static file (`provider-protocol.ts`). The "plugin" model for chat providers is **data, not code**. This is more like a system extension *registry* than a plugin runtime.

---

## What the code does

The provider plugin system has three layers:

**1. Canonical manifest source** — `seeds/providers/manifests.ts` (forge). Auto-generated comment: "AUTO-GENERATED from seeds/providers/*.json — canonical in-repo provider manifests." The file exports a `PROVIDER_MANIFESTS: unknown[]` (line 5) — a flat array of 12 manifest objects, each one describing a provider (ChatGPT, Claude, Gemini, etc.).

A single manifest (lines 6-120) has:
- `$schema: 'https://vivim.app/cap-store/v1/provider-manifest.schema.json'` — a schema URL.
- `provider`: `{ slug, display_name, description, category, provider_type, website_url, documentation_url, auth_type, has_multi_account, profile_strategy, fleet_config, capabilities: string[], accessTier }` — the provider's identity. `capabilities` is a list of strings like `'send_message'`, `'select_model'`. `auth_type: 'browser'` means CDP-driven.
- `endpoints`: list of `{ label, url, endpoint_type, is_default, selector?, composer_type?, send_method?, content_editable? }` — each endpoint is a page (landing, chat, login) with optional DOM selectors (composer, send button) and behavior (composer_type, send_method, content_editable).
- `models`: list of `{ slug, display_name, is_default, context_window, max_output_tokens, supports_streaming, supports_vision, supports_thinking, supports_tools, pricing_input_per_1m, pricing_output_per_1m }` — each model.
- `capabilities_config`: list of `{ global_capability_id, recovery_strategies[], ui_component_override, ui_label_override, ui_icon_override, ... }` — per-capability UI/recovery overrides.
- `parsers` (not shown in first 120 lines, but `provider-registrar.ts` line 145-150 reads them) — list of `{ logic_type: 'inline', logic_code: string, fallback? }` — inline parsers stored as strings in the manifest. The registrar validates that `logic_type === 'inline'` requires `logic_code`.

**2. Registrar** — `plugins/provider/provider-registrar.ts`. Three public methods:
- `register(manifest: ProviderManifest): Promise<RegisterResult>` (line 76-311) — upserts a manifest into the DB across 6 tables: `provider_definition`, `provider_endpoint`, `provider_parser` (two-pass: insert with null fallback, then patch fallback ids), `provider_capability`, `provider_config`, `provider_model`. Multi-table write per provider. Idempotent (delete-then-insert pattern at lines 120, 145, 240, 265). Emits `provider:seeded` event (line 292-296). Calls auditor if configured.
- `seedAll()` (line 313-330) — iterates `PROVIDER_MANIFESTS`, calls `ProviderManifestSchema.parse(raw)` (Zod) to validate, then `register()`. **Zero filesystem reads at boot** (line 316 comment: "the generator inlined the 12 JSON manifests at build time").
- `seedProvider(slug)` (line 332-340), `verifySeeds()` (line 342-368), `reloadFromSeeds()` (line 370-372).

`RegisterResult` (line 30-37) returns `{ providerId, slug, status: 'created' | 'updated' | 'unchanged', tablesAffected: string[], rowsAdded, rowsModified }`.

**3. Code generator** — `provider-protocol-generator.ts` (22354 lines — probably mostly generated content). Reads the DB after seeding, emits a static `provider-protocol.ts` file. The static file is the "compiled" version that runtime imports.

**ProviderStore** (referenced throughout `provider-registrar.ts` but not read here) is a `Storage Contract` (file: `plugins/storage/contracts/provider-store.ts`). All DB I/O goes through it. The registrar never touches Prisma directly.

---

## Key observations

- **"Provider" is overloaded.** The system has:
  - **ProviderManifest** (Zod schema) — the source data.
  - **ProviderRegistrar** (TS class) — the loader.
  - **ProviderPlugin** (TypeScript interface in `plugin-system.ts`) — the broader plugin contract. **NOT the same thing.** A provider is a "kind" of plugin, but the broader plugin contract allows for non-provider plugins (Phase 9 adds surfaces, mutationHandlers, capabilities).
  - **Provider** (DB row in `provider_definition`) — the runtime instance.

- **The "plugin" runtime for providers is the manifest pipeline.** There is no `await import('./providers/claude.js')` for chat providers. They are JSON → DB → static file. Hot-reload via filesystem (Step 1.2) does NOT apply to providers — they are rebuilt by re-running `seedAll()` and re-generating the protocol file. This is a different lifecycle than `ProviderPlugin` (which IS code).

- **12 manifests in the canonical list.** AGENTS.md from forge says "16 registered providers" but the manifest file says 12. The extra 4 are aliases (`facebook`, `slack`, `telegram`, `whatsapp`, `studio-ai`, `z-ai`, `opencode`, `mistral` — 8 alias slugs) and the 6 UI-facing chat providers are `chatgpt`, `claude`, `gemini`, `deepseek`, `qwen`, `grok`. Total is 6 + 8 = 14 unique slugs (manifests is 12; the discrepancy is likely some aliases in DB but not in the canonical manifest). The `cap-store` AGENTS.md says "16 registered providers" — so the actual DB has more than the in-repo manifest file declares, suggesting runtime registrations from elsewhere (plugins, seeds at runtime).

- **Manifests are versioned via the `$schema` URL.** `'https://vivim.app/cap-store/v1/provider-manifest.schema.json'` — there is a v1 schema. The Zod schema lives in TS. This is a real, machine-checked contract.

- **`auth_type: 'browser'` is a runtime constraint.** It means the provider needs a Chrome profile (CDP-driven). The system supports API-driven providers but the existing 12 are all browser-driven. The `chrome-governor.ts` (30316 lines) is the runtime for browser-driven providers.

- **Selectors are stored as JSON, not code.** `selector: { composer: '#prompt-textarea', send_button: "[data-testid='send-button']" }` (line 49-51 of manifests.ts). The system reads these at runtime to drive the browser. The selectors are *data*; the runtime that uses them is *code*.

- **The manifest stores CODE — the inline parser `logic_code`.** Line 148 of provider-registrar.ts: `if (logicType === 'inline' && !parser.logic_code) { throw ... }`. So a manifest contains executable JavaScript code as a string, which is later run via the parser engine. This is the *only* executable code in a provider manifest. It is the "brain" of the provider — it parses the streaming wire format. The DB-only parser invariant (P5 in the AGENTS.md) says parsers live only in DB, with `allowFileLogic` opt-out.

- **Two-pass write for parser fallback chain.** Lines 145-150 of provider-registrar.ts. First pass inserts every parser with `fallback_parser_id = null`, recording a name→id map. Second pass patches fallback ids from the parser's `fallback` reference (e.g. `gemini/001` → `gemini/002` → `generic/001` → `system/001`). This is a topological sort baked into the upsert.

- **Capabilities are global, not provider-specific.** Line 109: `global_capability_id: 'send_message'`. The `provider_capability` table binds a provider to a global capability with provider-specific overrides. This is the "taxonomy layer" the registrar header calls out (line 374: "1.3 Provider Taxonomy Layer").

- **Recovery strategies are declarative.** Line 112-119: `recovery_strategies: [{ type: 'retry_selector' }, { type: 'navigate_home' }]`. When a capability fails, the system walks these in order. This is a small, typed policy language for failure recovery.

- **UI overrides are data.** `ui_component_override: 'text_input'`, `ui_label_override: 'Send to ChatGPT'`, `ui_icon_override: 'arrow-up-circle'`. The manifest tells the UI what to render for this capability. No code generation per provider.

- **Six tables are touched per provider.** `provider_definition`, `provider_endpoint`, `provider_parser`, `provider_capability`, `provider_config`, `provider_model`. The registrar's `tablesAffected` field lists which got rows. This is heavy; a single `register()` call is 10-20 DB roundtrips.

- **The provider's *slug is the primary key* on `provider_definition`.** Line 88: `const providerId = manifest.provider.slug`. Comment: "This removes the slug<->ULID mismatch that broke account/conversation creation." A past bug. The fix made the slug itself the id.

- **All 6 chat providers are `accessTier: 'free'`.** Line 35 in the manifest. Anything not `'free'` gets `is_active: 0` and `protocol_status: 'Locked'` (lines 92-93 of registrar). So paid-tier providers are seeded but not activatable. This is a licensing/feature flag model.

- **No `CapabilityEventBus` import in the registrar.** Line 24-26: `ProviderRegistrarEventBus` is a *minimal interface* (`emit(event)`) defined locally, NOT the full `CapabilityEventBus`. This avoids a circular dependency. The `eventBus?` is optional. This is a soft-dependency pattern.

- **Same for the auditor.** Line 56-58: `ProviderRegistrarAuditor` is a local interface, optional. The real `RegistrationAuditor` is wired in via DI. Decoupling.

---

## Key questions raised

1. **Who actually writes the JSON manifests?** The header says "AUTO-GENERATED from seeds/providers/*.json". So the canonical sources are JSON files in `seeds/providers/`. The TS file is a generated build artifact. Where are the JSON files? Are they in the repo? Are they in a separate `seed-providers-json` repo? **Need to check.** A user adding a provider presumably writes a JSON file and re-runs the generator.

2. **What is `PROVIDER_PROTOCOL_SOURCE=dev`?** AGENTS.md mentions flipping between `dev` and `prod` sources for the protocol. The `provider-protocol.dev.ts` file is editable. So there are two: the generated one (canonical) and a dev clone (overrides). The dev clone is the editing surface for protocol fixes.

3. **Is the `ProviderPlugin` from `plugin-system.ts` ever used for chat providers?** They look like the same concept but the data flow is different. A `ProviderPlugin` has `providerId`, `onRegister`, etc. The manifest is just data. So either: (a) the `ProviderPlugin` interface is unused for chat providers, only used for non-chat plugins (Phase 9 surfaces, capabilities), or (b) the manifest is later wrapped in a `ProviderPlugin` at runtime. Need to find where `ProviderPlugin` is actually instantiated.

4. **Can a user add a provider without code?** The manifest is JSON. If the user can drop a JSON into `seeds/providers/` and re-run the generator, that's data-driven provider onboarding. But the generator is a build-time step. Is there a runtime path?

5. **What's the failure mode if a manifest is invalid?** `seedAll()` catches errors per provider and continues (lines 320-326), putting them in `result.errors`. So one bad manifest doesn't kill seeding. But the rest of the system may have FK references that now dangle. Need to confirm.

6. **Is `capabilities: string[]` (line 23-34 of manifest) a flat list of cap ids, or a typed reference?** It's a flat list of cap slugs. The `provider_capability` table is the binding; the `capabilities` field is the *declared* set on the provider row. Both are maintained, possibly in sync via the registrar. (A 2-pass would be needed; this is a single-pass write — risk of drift.)

7. **The selector-cache, selector-healer, selector-refiner trio in `plugins/provider/resilience/` is a real self-healing system for selectors.** `selector-healer.ts` is 16255 lines. The selectors are data; the healer is code that finds new selectors when the cached one fails. This is *not* something a user does — it's the system's own self-repair.

8. **`provider-protocol-loader.ts` is 1950 lines.** The load path from the generated `provider-protocol.ts`. Probably caches the static file at startup.

9. **The 8-phase onboarding pipeline (`discover → infer → test-selectors → ... → converge`)** is the *process* for adding a new provider manually. It's not a runtime path; it's a developer workflow. So adding a provider today is: (1) discover protocol with `discover-protocol`, (2) write a manifest by hand or by inference, (3) run `seedAll`, (4) run the 8 phases to verify.

10. **`capabilities_config.ui_*_override` is per-capability UI customization.** A provider can override the global capability's UI component, label, icon. This is a UI extensibility point — but only for providers that already exist. A user can't add a brand-new capability this way.

---

## Cross-references

- **Step 1.1 (plugin-system.ts)** — the broader `ProviderPlugin` interface. Different shape from a manifest. The data-driven provider onboarding is *not* what `ProviderPlugin` describes; `ProviderPlugin` is the hook-based contract for non-provider plugins.
- **Step 1.2 (plugin-hot-reload.ts)** — the file-watch loader. NOT used for providers (those are seeded, not loaded).
- **Step 1.7 (capability system)** — providers declare `capabilities: string[]` and bind to `global_capability_id` in the `provider_capability` table. The capability system is the consumer.
- **`plugins/schema/provider-manifest.ts`** — the Zod schema. Not read yet.
- **`plugins/storage/contracts/provider-store.ts`** — the storage contract. Not read yet.
- **`plugins/provider/provider-protocol-generator.ts`** — the code generator. Not read yet.
- **`plugins/provider/provider-caps.ts`** — 7512 lines. The provider-side capability logic.
- **`plugins/provider/provider-mux.ts`** — 18247 lines. Multiplexes across providers. The "use Claude" / "use ChatGPT" routing layer.
- **`plugins/provider/chrome-governor.ts`** — 30316 lines. The runtime for browser-driven providers. The actual CDP loop.
- **`plugins/provider/discovery/`** — 4 files: `provider-conversation-adapter.ts`, `provider-discovery.ts` (28930 lines!), `provider-selectors.ts`, `provider-test-harness.ts`. The discovery + verification system.
- **`plugins/provider/resilience/`** — 6 files: `request-queue.ts`, `retry-engine.ts`, `selector-cache.ts`, `selector-healer.ts` (16255), `selector-refiner.ts`, `send-capability.ts`, `send-resilience.ts`, `situation-detector.ts`. The self-healing layer.
- **`work/forge/seeds/providers/manifests.ts`** — the canonical source. **The 12 manifests are the answer to "how much of the VS Code extension model is in providers?" Answer: the manifest schema is the analog of `package.json`.**
