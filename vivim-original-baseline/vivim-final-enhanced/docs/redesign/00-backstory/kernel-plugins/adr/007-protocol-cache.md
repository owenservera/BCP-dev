# ADR 007 — Protocol Cache: In-Memory + Disk Snapshot + `ProviderRegistrar.registerOne`

- **Date:** 2026-08-28
- **Status:** Ratified (I-1)
- **Deciders:** agent (E2E owner)
- **Tags:** providers, registrar, caching, runtime-load

## Context

- `src/engines/provider-registrar.ts:62` `class ProviderRegistrar` seeds provider intel from `seeds/providers/manifests.ts` (build-time inlined `PROVIDER_MANIFESTS`) into 7 tables: `provider_definition`, `provider_endpoint`, `provider_parser` (2-pass fallback), `provider_capability`, `provider_config`, `provider_model` (+ `provider_parser` hash via `StreamAlignmentEngine.computeParserHash`). `seedAll():313` iterates that import. `register():76` does one provider's full upsert. No runtime entry point for a plugin-supplied manifest.
- `provider-protocol-generator.ts` reads the DB back into a generated static file (`src/__generated__/provider-protocol.ts`) for fast runtime access. The file assumes a rebuild — a plugin installed after the process starts is not queryable until restart.
- `plugin-router.ts:276` already links `ProviderDefinition.slug (PK = providerId) → PluginRegistry.name` via `providerDefinition.pluginId` FK update immediately after `registrar.register()`. The FK exists; the runtime registration path does not.

## Decision

1. **Add `ProviderRegistrar.registerOne(manifest, {source:'plugin', pluginId})`** alongside `seedAll()` (unchanged — regression test proves bit-for-bit). The method reuses the same 7-table upsert as `register()` but sets `provider_definition.pluginId = pluginId` and does not touch in-tree seed data. It is the only write path `service-registry.ts` calls.
2. **Generator output becomes in-memory cache + disk snapshot.** `provider-protocol-generator.ts` keeps a `Map<providerId, Protocol>` rebuilt on `PluginHost.install/uninstall` (and on `seedAll` at boot). The generated disk file (`src/__generated__/provider-protocol.ts`) is kept as a startup snapshot for fast cold boot, not a hard dependency. Runtime lookups read the in-memory map first (`registerOne` provider queryable without restart), disk second.
3. **`service-registry.ts` (`src/plugin-kernel/registries/service-registry.ts`)** gates on `network` always. `kind:'browser-provider'` is rejected in v1 with `"requires chrome:control — not yet available (see adr/002)"` until the shared `chrome:control` gate lands in v2 (one confirmation for harness + browser-provider, not two).

## Consequences

- `registerOne` is the single plugin-provider write path. In-tree and plugin providers share the same tables and the same registrar, but different entry points — no second implementation.
- A provider installed via plugin is queryable through the generator's read API without restarting the process; existing generated-file consumers are unaffected (they read the in-memory map, which is pre-populated from disk at boot).
- Deleting a plugin reverses the 7 tables (`deleteProvider*` cycle) + cache eviction — the uninstall path is the install path in reverse.

## Alternatives Considered

- Single `register(manifest, opts?)` overload → rejected: overload hides the plugin vs in-tree distinction that the permission gate and FK need to see at the call site.
- Keep disk file as the only cache → rejected: requires rebuild/restart for every plugin install — breaks the plugin promise.
- Separate `plugin_provider_*` tables → rejected: doubles the query surface; the existing `pluginId` FK already isolates plugin-owned rows for lifecycle and observability.
