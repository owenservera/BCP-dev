# Step 5.3: Hot-Reload

**Date:** 2026-08-28
**Read:** Phase 1 Step 1.2 (plugin-hot-reload), Phase 1 Step 1.14 (test references `onUpgrade`)
**Status:** DESIGNED

---

## The question (from the process)

> "Can extensions be updated without restarting? Is the existing hot-reload mechanism reusable for user extensions?"

## The answer

**Yes, partially.** The existing `PluginHotReload` (Step 1.2) watches a directory and dynamically imports `.ts`/`.js` files. This is reusable for the **dev mode path** (Path D from Step 5.1). For installed extensions (Paths A, B, C, E), the host uses the **explicit update flow** with `onUpgrade(fromVersion)`.

Two paths:
- **Dev mode** (directory watch): uses the existing `PluginHotReload`.
- **Production update** (re-install with new version): uses the `onUpgrade` hook (per the test reference, Step 1.14).

---

## Path A: Dev mode (existing `PluginHotReload`)

The `PluginHotReload` (Step 1.2) is:
- A `fs.watch` on a directory.
- On change, dynamic-imports the file with cache-bust.
- On success, fires `onPluginLoaded` with the loaded module.

For an extension in dev mode (Path D from Step 5.1):
1. The user sets `extensionsDir: /path/to/dev/extensions`.
2. The host's `PluginHotReload` watches the directory.
3. The user edits a file.
4. `PluginHotReload` loads the new module.
5. The host's `extensionLoader.onPluginLoaded(module)` is called.
6. The host identifies the extension by the file path (or by a `vivim-extension.json` in the same dir).
7. The host runs the **update pipeline** (per the production update path, but without `onUpgrade` checks — dev mode is permissive).

**What's missing in the existing `PluginHotReload`:** the integration with the manifest. The hot-reload just produces load records; the host has to wire the manifest → contribution pipeline.

---

## Path B: Production update (new flow)

The user wants to update an installed extension:
1. User provides a new version tarball (or URL).
2. Host reads the new manifest.
3. Host compares new vs old:
   - **Same id, same version**: no-op. (Probably an error.)
   - **Same id, different version**: this is an update.
   - **Same id, new fingerprint**: tamper detected (Step 4.5). Warn.
4. Host diffs the manifests (added / removed / modified contributions).
5. **If a `LifecycleContribution` declares `onUpgrade(fromVersion)`**: host calls it before applying the diff. (v1.5; the test references it but the code doesn't have it yet.)
6. Host applies the diff:
   - For each added contribution: register (per Step 3.x).
   - For each removed contribution: unregister.
   - For each modified contribution: unregister old, register new.
7. For each `StorageContribution.migrations[]`: run the migration on existing data.
8. **Update the install Node** with the new version, fingerprint, grants (if changed), trust score (recomputed).
9. Fire `extension:updated` event.

---

## The `onUpgrade(fromVersion)` hook

The test (Step 1.14) references `onUpgrade` as a `ProviderPlugin` hook. For the v1 extension model, the hook is on a `LifecycleContribution`:

```typescript
interface LifecycleContribution {
  // ... existing fields ...
  subscription?: ... | { kind: 'upgrade'; fromVersion: string; handler: { kind: 'inline'; code: string; permissions: SandboxPermissions } | { kind: 'capability'; slug: string } }
}
```

The handler runs **before** the host applies the diff. The extension can:
- Migrate data (e.g. "rename field X to Y in all my nodes").
- Run cleanup (e.g. "delete all my cached state").
- Refuse the upgrade (return `{ ok: false, reason: 'unsupported' }` — the host aborts).

If the handler is `kind: 'capability'`, the host invokes the capability (which the extension also declares). The capability's `input` is `{ fromVersion, toVersion }`.

---

## Live reload (during host runtime)

For an extension that's currently running, the host must:
1. **Unregister** the old contribution (call `unregister` on each registry).
2. **Register** the new contribution.
3. **Preserve state** if possible (Node data, MCP connections, etc.).
4. **Notify** any in-flight operations: "this cap is being upgraded; abort or wait?"

For a cap that's mid-invocation, the host has two choices:
- **Abort**: the call fails with "extension upgrading."
- **Wait**: the call completes; the new spec waits.

The default: abort in-flight calls on upgrade. The user retries.

---

## The "manifest hash mismatch" path

If the host detects that an installed extension's source file has been modified (SHA-256 mismatch), it:
1. **Warns the user**: "Extension X has been modified. Re-install?"
2. **If user re-installs**: full update flow.
3. **If user ignores**: the extension runs with the **old** spec (from the install Node). The host does NOT auto-reload.

This prevents silent tampering.

---

## What this fixes

- ✅ Dev mode uses the existing `PluginHotReload` (reusable).
- ✅ Production update flow is specified.
- ✅ `onUpgrade(fromVersion)` hook is on `LifecycleContribution`.
- ✅ Live reload aborts in-flight calls (default).
- ✅ Tamper detection via SHA-256 mismatch.

## What this does NOT fix

- **The `onUpgrade` hook doesn't exist in code today.** It's in the test. v1.5.
- **The "preserve state"** for live upgrades is not detailed. (Most state lives in `NodeStore`, which is version-aware via `NodeVersion`. So state preservation is automatic if the new spec is compatible.)
- **The "abort vs wait"** is a UX decision the host makes. The contract is permissive.
- **The "no auto-reload" for tamper detection** is the secure default. The user must opt in.

---

## Open design questions

1. **What if the new manifest has the same version but different fingerprint?** A bug or a re-install. The host prompts the user.

2. **What if the new manifest is semver-incompatible (major bump)?** The host requires explicit user confirmation. "This is a major version change. Existing data may not be compatible."

3. **What if a `migrations[]` fails?** The host rolls back the install to the previous version. The user is notified.

4. **What about a "preview" mode?** The user can install with a preview flag. The new version is loaded but the user can roll back easily.

5. **What about the `LiveCapabilityStore` schema?** It should track `activation: 'eager' | 'lazy' | 'onEvent'` and `version: string` so the host can re-load the right caps at boot.

6. **What if the user updates an extension that's currently in use?** The host queues the update. The user gets "Extension X is updating; some operations will fail." On next op, the new version is active.

---

## Cross-references

- **Step 1.2 (hot-reload)** — `PluginHotReload`, the existing mechanism.
- **Step 1.14 (distribution)** — the test references `onUpgrade`; the code doesn't have it.
- **Step 3.6 (lifecycle contribution)** — the `kind: 'upgrade'` variant (proposed).
- **Step 4.5 (supply chain)** — SHA-256 tamper detection.
- **Step 5.1 (install path)** — Path D (directory watch) uses hot-reload.
- **Step 5.6 (synthesis)** — the complete picture.
