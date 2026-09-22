# Step 1.2: F-022 plugin-hot-reload — The File Watcher

**Date:** 2026-08-28
**Read:** `plugins/plugin-system/plugin-hot-reload.ts` (138 lines)
**Status:** ANALYZED

---

## What the code does

`plugin-hot-reload.ts` is a **different** "plugin system" — it watches a directory of `.ts`/`.js` files, dynamically imports them, and emits `onPluginLoaded` / `onPluginUnloaded` / `onPluginError` events. It does not use the `ProviderPlugin` interface from `plugin-system.ts`. It has its own `ProviderPlugin` type with completely different fields.

Three public types:
- **`ProviderPlugin`** (lines 12-19) — a *loaded* plugin record: `id`, `name`, `version`, `filePath`, `exports` (the raw module), `loadedAt`. This is a *snapshot* of a file on disk, not a contract.
- **`PluginHandler`** / **`PluginUnloadHandler`** / **`PluginErrorHandler`** (lines 21-23) — observer callbacks.

One class:
- **`PluginHotReload`** (lines 27-138) — owns an `fs.watch` on a single directory, loads every `.ts`/`.js` file as a module via `await import(...)`, and tracks loaded plugins in a `Map<string, ProviderPlugin>`. On file change it unloads the existing entry for the path, re-imports with a cache-busting query string, and fires `loadHandlers`. On watcher error, it fires `errorHandlers`. On file delete, it calls `unloadByPath`.

---

## Key observations

- **Two competing `ProviderPlugin` types in the same card.** This file (lines 12-19) defines `ProviderPlugin` as `{ id, name, version, filePath, exports, loadedAt }`. The file `plugin-system.ts` (lines 14-50) defines `ProviderPlugin` as a contract with five mandatory hooks and three optional Phase 9 fields. They are NOT the same interface. Same name, same directory, but completely different semantics.

  - The hot-reload one is a *load record* — what was on disk.
  - The plugin-system one is a *behavior contract* — what the plugin can do.

- **The two are not connected.** This file does not import from `plugin-system.ts`. It has no awareness of `PluginManager`. There is no glue. If you use `PluginHotReload`, you get file watching; if you use `PluginManager`, you get a key-value store. They are separate worlds.

- **Loose module shape.** Lines 106-113 read `mod.default?.id`, `mod.id`, falling back to `filePath`. Same for `name` and `version`. A plugin file can be a default export, a named export, or neither — the code tolerates any of them. But the "expected" shape is `{ id, name, version, ... }`.

- **Cache-busting on reload.** Line 105: `await import(\`${filePath}?t=${Date.now()}\`)`. The query string forces Node to re-evaluate the module instead of returning the cached version. This is a real, working hot-reload — change the file, save, the import is re-run.

- **No "plugin" contract beyond `id`.** The code never checks that the loaded module has any of the Phase 9 fields (`surfaces`, `mutationHandlers`, `capabilities`) or the five mandatory hooks. The hot-reload treats plugins as opaque bags of exports. Whatever contract the loaded module has is the consumer's problem.

- **No `activate` lifecycle.** A plugin is "loaded" the moment its file is on disk and the import succeeds. There is no `activate(context)` call. There is no way to say "load this plugin but don't run anything until event X."

- **No sandbox.** Line 105 uses `await import()` in the host process. The plugin code runs with full Node.js access. There is no VM, no worker thread, no QuickJS. (Step 1.11 will check whether QuickJS exists somewhere.)

- **Watcher is single directory.** Line 35: `start(directory: string)`. Not recursive into subdirs of the given dir, but the `fs.watch` option is `recursive: true` (line 41), so it does watch subdirectories. The initial `loadAllPlugins` is not recursive (line 86: `readdir` with no `withFileTypes`/recursive option). So initial load finds only top-level files; runtime reload can find deeper ones.

- **No error recovery, no retry.** Line 119-124: on import failure, the error is fired to handlers, the bad plugin is not added to the map. If you fix the file and save again, the watcher's `change` event fires and `loadPlugin` retries. So there is an implicit retry-via-filesystem-edit. There is no automatic retry, no backoff, no "skip for now" state.

- **Unload logic is path-based, not id-based.** Lines 127-137: `unloadByPath` iterates all loaded plugins to find the one whose `filePath` matches. If two files happen to share a path (shouldn't happen, but), only the first match unloads. This is fine in practice.

- **`unloadByPath` does not call any cleanup on the plugin.** It just removes the map entry and fires handlers. If a plugin opened a database connection, a watcher, or a worker, the consumer is responsible for cleanup in the unload handler.

- **`EngineError` is the only custom error type referenced.** Line 7. Otherwise this file uses standard Node + plain `Error`.

- **No tests for the hot-reload in this file's directory.** The process said to read it; no test file appears at `plugin-hot-reload.test.ts`. The earlier quarantine listing did not show one either.

---

## Key questions raised

1. **Who consumes `PluginHotReload`?** The file emits `loadHandlers` / `unloadHandlers` / `errorHandlers`, but where are they wired? Is anything in the app actually calling `.onPluginLoaded(...)` and forwarding the plugin to `PluginManager.register()`? If not, the two systems are completely unglued.

2. **Why are there two `ProviderPlugin` types?** Either the codebase has two parallel plugin systems, or the hot-reload was written before the manager and never reconciled. Either way, this is a real architectural split that an extension model will have to resolve.

3. **What does a plugin file actually look like?** The hot-reload reads `mod.default?.id` etc. Is there a template / example? Are there plugin files in the repo today that match this pattern? (Need to search `plugins/` for example files.)

4. **What is `directory` set to in production?** Line 35 takes a `string` arg. Who calls `start()`? Is it the repo's `plugins/` folder? A user's `~/.vivim/extensions/`? Both?

5. **Does the `?t=${Date.now()}` query break `import.meta.url` resolution inside the plugin?** If a plugin does `import.meta.url` to resolve sibling files, the cache-bust may invalidate that. (Probably not — but worth checking.)

6. **What happens on Windows when a file is locked by another process?** `fs.watch` on Windows is unreliable. The hot-reload may miss events. No fallback to polling.

---

## Cross-references

- **Step 1.1 (plugin-system.ts)** — the *other* `ProviderPlugin`. These two are siblings, not the same thing.
- **Step 1.3 (router-capability-bridge.ts)** — a third "plugin"-flavored file in the same dir. Likely also unrelated.
- **`../lib/catch-logger.js`** (line 8) — error-logging helper used at line 94. Used pervasively.
- **`../../kernel/types/errors.js`** (line 7) — `EngineError` is the only typed error referenced.
- **`fs.watch` from `node:fs`** (line 4) — Node's native watcher, not chokidar. Native watcher is unreliable on Windows / network mounts.
