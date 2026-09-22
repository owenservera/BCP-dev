# ADR 004 — PluginHost Unifies `TrustedPluginManager` + `plugin-router.ts`

- **Date:** 2026-08-28
- **Status:** Ratified (I-1)
- **Deciders:** agent (E2E owner)
- **Tags:** packaging, trust, lifecycle

## Context

Two "install a plugin" entry points exist and do not call each other:

- **`TrustedPluginManager`** `src/ai/plugins/plugin-manager-impl.ts:35` — wraps `PluginManagerImpl` (`src/engines/plugin-system.ts`) with a gateway trust layer. `discover():35` always returns `valid:false "not yet implemented (C4 phase 1)"`. `install():50` always throws `pluginInvalid(..., "Install not yet implemented (C4 phase 1)")`. `certify():96` only checks `manifest.id/name` + hash presence + capability count — no signature, no permission↔contributes, no sandbox re-validation. Activated at boot in `src/server/bootstrap/phases/capabilities.ts:42` via `activatePluginManager(eventBus)` and exposed as `globalThis.__pluginManager` with a `require('../../engines/plugin-system.js')` lazy import "to avoid circular deps" — the circular dep (`ai/plugins → engines/plugin-system → ai`) is real.
- **`plugin-router.ts`** `src/server/plugin-router.ts:100` — HTTP, tar.gz, sha256 (`computeFileHash:20`, `extractTarGz:47` via `tar -xzf`), manifest parse, capability-conflict check, `dependsOn` check, `ProviderRegistrar.register()` (`provider-registrar.ts:76`), `UiComponentStore.create()` (`shared/ui-component.ts:99`), `pluginRegistry` + `providerDefinition.pluginId` FK link (`276`), `plugin:installed` emit, staging cleanup. Real, but only knows about providers + UI components.

Audit B1 showed install/trust is the only axis that is genuinely stubbed rather than merely disconnected.

## Decision

**`PluginHost` (`src/plugin-kernel/host.ts`) is the single, unified lifecycle.** It:

1. **Moves** `plugin-router.ts:20` `computeFileHash` + `47` `extractTarGz` + manifest parse into `host.ts:discover()` — do not duplicate.
2. Implements `certify()` for real: Zod schema (`manifest.ts`), hash re-verify, permission↔`contributes` cross-check (every `contributes.*` entry has its required permission), `scriptUrl` origin check, schema prefix check.
3. Implements `install()` to call per-axis registries (stubs until Phases 2–4) instead of throwing.
4. Exposes `enable/disable/toggle/uninstall` (toggle flips `pluginRegistry.isActive` + `providerDefinition.isActive` + `uiComponent.status`; uninstall deletes `provider_*`, `ui_component` scope:provider, `pluginRegistry` row, `pluginDir`).
5. Threaded through `BootstrapContext` (`src/server/bootstrap/context.ts:37`) — `globalThis.__pluginManager` deleted, `require()` hack resolved directionally.

Lifecycle: `discover(tar.gz) → certify(manifest) → install(manifest) → emit plugin:installed (V2)`. Atomic: extract to `tmpdir()/vivim-plugin-staging/install-<ulid>` then `rm -rf` on failure before DB write.

## Consequences

- `plugin-router.ts`'s HTTP handlers become thin adapters that validate the request shape and delegate to `PluginHost` — they no longer contain lifecycle logic.
- `grep -rn "__pluginManager" src` → 0 after Phase 1.5.5 (CI gate).
- Dependency direction: `plugin-kernel → contracts ← engines` (host depends on `ProviderStore` contract, not `ProviderRegistrar` class if needed to break the cycle).
- Security review gate before 1.5 merges: hash-before-write, no `eval`/`new Function` on manifest fields, `scriptUrl` not bypassable via `../` or `//` or `data:`.

## Alternatives Considered

- Build a third installer → rejected: three paths for one lifecycle is architectural malpractice.
- Keep both and make them call each other → rejected: still two public install surfaces with different trust checks; the unified surface should be one Zod shape with one permission lattice.
