# Step 1.14: Distribution — How Plugins Reach Users

**Date:** 2026-08-28
**Read:**
- `surfaces/web/src/app/api/plugins/install/route.ts` (47 lines, full)
- `tests/integration/providers/plugin-lifecycle.test.ts` (110 lines, first 50)
- **Status:** READ + ANALYZED

**Critical finding:** The "distribution" surface today is:
1. **A tarball upload endpoint** at `POST /api/plugins/install` — accepts a `.vivim-plugin` multipart upload, emits a `plugin:registered` event, and **does nothing else**. (Line 31-33 explicitly says "A production impl would extract, verify the manifest, register the plugin via PluginManager, and seed its components via CanvasRegistry.")
2. **The `PluginHotReload`** (Step 1.2) watches a directory for `.ts`/`.js` files.
3. **The provider manifest pipeline** (Step 1.6) seeds providers from in-repo JSON.

**There is no marketplace. There is no signed package. There is no version management. The "install" endpoint is a stub that acknowledges the upload and emits an event — actual installation logic is in the comment as a TODO.**

---

## What the code does

### `POST /api/plugins/install` (route.ts, 47 lines)

From the file header (line 1-9): "POST /api/plugins/install — install a `.vivim-plugin` tarball. Mirrors bundle 04 plugin-router.ts lifecycle: `install → verify → register → seed components → activate`. Body: multipart form upload with `tarball` field."

**The endpoint:**
1. Checks `content-type` is `multipart/form-data` (line 18-23) — 400 if not.
2. Extracts the `tarball` field from the form (line 25-29) — 400 if missing.
3. **Generates a pluginId** (line 34): `` `plugin:${file.name}:${Date.now().toString(36)}` ``. The plugin id encodes the filename and the timestamp.
4. **Emits a `plugin:registered` event** (line 35-40) on the `eventBus` (from `getEngineBag()`): `{ type: 'plugin:registered', pluginId, slug: file.name, sizeBytes: file.size }`.
5. **Returns** `{ ok: true, pluginId, message: "Plugin '${file.name}' accepted (${file.size} bytes). Components will be seeded on activation." }`.

**That's it.** No extraction, no manifest validation, no `PluginManager.register()` call, no `SurfaceRegistry.register()`, no actual seeding. The endpoint is a **stub that confirms receipt**.

The comment at line 31-33 is honest: "For the prototype, we accept the tarball and emit a plugin:registered event. A production impl would extract, verify the manifest, register the plugin via PluginManager, and seed its components via CanvasRegistry."

The referenced "bundle 04 plugin-router.ts" suggests a larger plugin-router design exists somewhere (not in vivim-next; probably in the forge or an older bundle).

The format is `.vivim-plugin` (line 4). This is presumably a tarball (line 4: "install a `.vivim-plugin` tarball"). No MIME type, no manifest schema, no version field — the format is a stub.

### `tests/integration/providers/plugin-lifecycle.test.ts` (110 lines, first 50)

The integration test for the plugin lifecycle. **Critical finding:** the test references hooks that **don't exist in the current `plugin-system.ts`**.

Line 36-50:
```ts
test('full lifecycle: register → use → upgrade → unregister', async () => {
  const onRegister = async () => {}
  const onUpgrade = async (_fromVersion: string) => {}
  const onUninstall = async () => {}

  const plugin = {
    providerId: 'lifecycle-test',
    onRegister: onRegister as any,
    onResolveCapabilities: async () => null,
    onAction: async () => null,
    onProjectState: async (s: any) => s,
    onParse: async () => null,
    onUpgrade: onUpgrade as any,
    onUninstall: onUninstall as any,
    onHealthCheck: async () => ({ status: 'healthy' as const, lastCheck: Date.now() }),
    ...
```

The test imports `ProviderPlugin` (line 41) with extra hooks:
- `onUpgrade: (fromVersion: string) => Promise<void>` — line 48
- `onUninstall: () => Promise<void>` — line 49
- `onHealthCheck: () => Promise<{ status: 'healthy'; lastCheck: number }>` — line 50

**The current `plugin-system.ts` (Step 1.1) only has `onRegister`, `onResolveCapabilities`, `onAction`, `onProjectState`, `onParse`, plus Phase 9 surfaces/mutationHandlers/capabilities. The test expects `onUpgrade`, `onUninstall`, `onHealthCheck` — these hooks don't exist yet.**

This is **test-ahead-of-code**. The test is written for a future where the plugin contract includes upgrade, uninstall, and health check hooks. The test will fail to typecheck against the current `ProviderPlugin` interface. (Unless the test is using `as any` everywhere to bypass — let me note line 43, 48, 49: `as any`. So the test compiles but won't actually invoke the missing hooks.)

So the **intended plugin contract** (per the test) includes:
- `onRegister(manifest)` — exists
- `onUpgrade(fromVersion)` — doesn't exist in code
- `onUninstall()` — doesn't exist
- `onHealthCheck()` — doesn't exist
- (plus the other 4)

The test passes a `plugin` object with these methods to `PluginManagerImpl.register()`. But `register()` in plugin-system.ts (line 74-137 of Step 1.1) doesn't call `onUpgrade` / `onUninstall` / `onHealthCheck`. The test would call them via the manager? Or via a separate `upgrade()` / `uninstall()` method that doesn't exist?

The test is in the `tests/integration/providers/` directory but uses `src/engines/plugin-system.js` and `src/engines/plugin-hot-reload.js`. The integration test framework is bun:test. The `manager` is `any` typed (line 9), so typecheck is bypassed. The runtime may also break if the test invokes the missing methods.

### Other distribution-related files (not read)

- `infra/devops/desktop/actions.ts` — `install` action for the desktop installer (NSIS), not for plugins.
- `infra/devops/desktop/index.ts` — same.
- `tests/integration/providers/plugin-lifecycle.test.ts` — the test above.

No marketplace UI, no plugin browser, no version manager UI. The `plugin_install` capability from Step 1.3 (router-bridge) is a thin HTTP wrapper that proxies to the same endpoint.

---

## Key observations

- **The "install" endpoint is a stub.** It acknowledges the upload and emits an event. It does NOT extract, validate, or register. This is documented in the comment as "For the prototype" — the author knows.

- **The "plugin" format is a single tarball `.vivim-plugin`.** No manifest schema, no version, no signing, no checksums. Just a tarball.

- **The plugin lifecycle in the test (line 36) is `register → use → upgrade → unregister`.** 4 stages. The `register` and `use` work today (with the contract from Step 1.1). The `upgrade` and `uninstall` are aspirational — the test references hooks that don't exist.

- **The test uses `as any` to bypass typecheck.** Line 43, 48, 49. So the test will compile but the runtime will silently no-op for the missing hooks (the `PluginManagerImpl` doesn't call them). This is a real test smell — the test asserts a lifecycle the production code doesn't implement.

- **There is no "marketplace" — the term is not in the codebase.** (The grep for `marketplace` returned 0 matches in vivim-next source.) The user-extension model is **file-based + URL-based** only:
  - File-based: `PluginHotReload.start(directory)` watches a directory for `.ts`/`.js` files (Step 1.2).
  - URL-based: `POST /api/plugins/install` accepts a tarball.
  - There is NO registry, NO catalog fetch, NO signed packages, NO automatic update.

- **There is no "extension" format spec.** No `vivim-extension.json` schema, no `vivim-plugin.json` schema. The plugin format is opaque — a tarball that the host would need to know how to extract and interpret.

- **The "hot-reload" of plugins is a directory watcher.** The PluginHotReload watches a directory; the consumer of the load event (presumably a host) decides what to do with the loaded module. The plugin-system's `PluginManagerImpl` has no awareness of hot-reload. The two are unglued.

- **Provider onboarding is a totally different pipeline.** Per Step 1.6, providers come from `seeds/providers/manifests.ts` (12 manifests in-repo) → Zod validate → DB upsert → static file generation. There is no equivalent pipeline for general "plugins" or "extensions" — only for chat providers.

- **There is no version management for plugins.** The "fromVersion" param in the test (line 38) is a hint that the system *wants* version-aware upgrades, but the code doesn't have it.

- **There is no signing, no checksum, no authenticity check.** The install endpoint trusts whatever tarball comes in. A malicious tarball is just accepted.

- **The tarball format is unspecified.** A `.vivim-plugin` is presumably a tarball (line 4 says "tarball"). But what does it contain? A `package.json`? A manifest? A pre-built JS bundle? Source code? The comment doesn't say. The "production impl" would presumably define this.

- **The "G5.6" comment in route.ts (line 2)** refers to a unit or phase in a development plan. "G5.6" is a gate/phase numbering. There's likely a project tracker somewhere.

- **The "bundle 04 plugin-router.ts" referenced in the route.ts comment (line 5)** is a design doc or design source. Not in vivim-next. (The forge's old code may have had a `plugin-router.ts` file.)

- **The system has a `mirror-store.ts` contract (344 lines).** Step 1.13 listed it. The mirror is presumably the system that syncs state across devices. Could be used for "plugin sync" — but the contract is not read.

- **The system has `consent-engine.ts` and `policy-engine.ts`.** A user installing a plugin could trigger a policy check. (Step 1.11.) The policy engine might define a "this plugin requires X grants" policy. Not read in this step.

- **The `requiresConfirmation` flag on capabilities (Step 1.7) is the per-capability confirmation.** A plugin's capabilities can opt in to confirmation. The system already has this. So a plugin install could require consent for the plugin's capabilities.

- **The router-bridge (Step 1.3) has `plugin_list` and `plugin_install` capabilities.** Line 322-335 of router-capability-bridge.ts. The bridge covers the HTTP layer. The actual install logic is in the `/api/plugins/install` route.ts — which is a stub.

---

## Key questions raised

1. **What is the format of a `.vivim-plugin` tarball?** No spec exists. The "production impl" would presumably define: top-level `package.json` with `name`, `version`, `main`, `engines`; a `manifest.json` with capabilities, surfaces, etc.; a `dist/` with bundled JS; a `signatures.json` (or not — Step 1.11 says signing is v2).

2. **Where does the plugin code run after install?** The tarball contains JS. The host extracts it, then either:
   - `require()`s the JS in the main process (no isolation — like the current `PluginHotReload`), or
   - Loads it in the QuickJS sandbox (Step 1.11) (real isolation, but no Node APIs).
   The choice is not made.

3. **Where do plugins live on disk?** A `.vivim-plugin` tarball is uploaded. The host must extract it somewhere. Is it `~/.vivim/extensions/<id>/`? A `plugins/` directory? A `vivim-store/`? Not specified.

4. **How does the user discover plugins?** There is no marketplace. The user must:
   - Download a tarball from somewhere (a website? a GitHub release? a friend?), or
   - Write one themselves and put the .ts/.js files in a watched directory.
   There is no in-app discovery.

5. **How does a plugin declare its capabilities?** No manifest schema exists. A plugin would need a manifest; the host would need a parser. The current code has nothing.

6. **What happens to the plugin's data on uninstall?** The `LiveCapabilityRegistry.revokeLive()` (Step 1.7) removes the capability from the registry. The `SurfaceRegistry.unregister()` (Step 1.4) removes surfaces. But user data (Nodes written by the plugin) is not cleaned up.

7. **How is a plugin upgraded?** The test has `onUpgrade(fromVersion)`. The host would need a version-aware installer. The current code has no version concept for plugins.

8. **What is the trust model for an installed plugin?** The `ConsentEngine` (Step 1.11) is for *operations* (read/write/navigate/...), not for *plugins* themselves. There is no "plugin trust score" or "plugin whitelist." A user-installable plugin is fully trusted by default.

9. **Can a plugin install other plugins?** Recursive? The `requiresConfirmation` flag (Step 1.7) might gate this. The `onRegister` hook could spawn subprocesses that install more plugins. Nothing prevents it.

10. **What is `mirror-store.ts`?** Per Step 1.13, 344 lines. Probably a cross-device sync mechanism. Could be how plugins are shared across devices (or not).

11. **Is there a plugin update mechanism?** The test has `onUpgrade` but the install endpoint doesn't take a version. The provider pipeline (Step 1.6) re-runs `seedAll()` to update. But for general plugins, there's no equivalent.

12. **What is the size of a typical plugin?** No limits specified. A user could upload a 1GB tarball. The endpoint doesn't check.

13. **What is the rollback story?** A bad plugin install needs a rollback. The `NodeVersion` chain (Step 1.13) is for the data layer. The plugin itself has no version history.

14. **What about plugins on the frontend?** The slot system (Step 1.12) is the frontend extension point. A plugin's UI component is registered in the catalog. But the catalog is in-memory + persisted. How does a plugin install register a catalog entry from a tarball? Same gap as backend.

---

## Cross-references

- **Step 1.1 (plugin-system.ts)** — `PluginManagerImpl.register()` is what should be called after a tarball is extracted. The current `/api/plugins/install` doesn't call it.
- **Step 1.2 (plugin-hot-reload.ts)** — the file-watching alternative. The tarball extract could write to a watched directory; hot-reload would fire.
- **Step 1.3 (router-capability-bridge)** — `plugin_list` and `plugin_install` capabilities. They proxy to the stub endpoint.
- **Step 1.6 (provider plugins)** — providers have a *complete* install pipeline (manifest → Zod → DB → static). General plugins have a stub.
- **Step 1.7 (live-capability-registry)** — `registerLive(spec)` + `revokeLive(id)`. The runtime-registration path. **The "install a plugin" flow should call this.**
- **Step 1.4 (reprogrammability)** — `SurfaceRegistry.register()` + `unregister()`. Same pattern.
- **Step 1.11 (security/sandbox)** — the inline handler can run in QuickJS. A plugin's `code` could be a QuickJS module. But the install pipeline doesn't extract or wire this.
- **Step 1.12 (frontend slot system)** — `ui-component-store.ts` is the persistence layer. A plugin install should write to it. The current install doesn't.
- **Step 1.13 (storage)** — `mirror-store.ts` may be how plugins sync across devices. `sandbox-audit-store.ts` audits plugin code execution.
- **`tests/integration/providers/plugin-lifecycle.test.ts`** — the test that references `onUpgrade`/`onUninstall`/`onHealthCheck`. These hooks are not in `plugin-system.ts`. The test is aspirational.
- **AGENTS.md (forge)** — "Provider System (KNOW THIS FIRST)" — providers are the only complete install path. General plugins are not yet at the same level.
- **`infra/devops/desktop/actions.ts`** — has an `install` action. But that's for the desktop NSIS installer, not for plugins.
