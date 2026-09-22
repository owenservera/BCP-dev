# Step 5.4: Disable / Uninstall

**Date:** 2026-08-28
**Read:** Phase 1 Step 1.14 (distribution), Phase 3 Step 3.5 (storage uninstall policy), Phase 4 Step 4.6 (security)
**Status:** DESIGNED

---

## The question (from the process)

> "How does a user turn off or remove an extension? What's the cleanup story?"

## The answer

**Two paths: disable (pause) and uninstall (remove).** Disable is v1.5. Uninstall is v1.

| Action | Effect | Data |
|---|---|---|
| **Disable** | All contributions unregistered. Install state preserved. Can re-enable. | Data preserved |
| **Uninstall** | All contributions unregistered. Install state removed. Per `StorageContribution.uninstall.deleteData`: archive or hard-delete. | Per policy |

---

## The disable path (v1.5)

1. User clicks "Disable" on the extension.
2. Host transitions the install state to `inactive`.
3. Host unregisters all contributions:
   - For each `CapabilityContribution`: `LiveCapabilityRegistry.revokeLive(id)`.
   - For each `SurfaceContribution`: remove from `UIComponentRegistry` catalog + clear `SlotOverrideClaim`.
   - For each `ProviderContribution`: unregister from `ProviderRegistrar`.
   - For each `StorageContribution`: deactivate the Node type (no more auto-CRUD caps).
   - For each `LifecycleContribution`: unsubscribe from events + cancel cron.
4. Data is **preserved** (Nodes are not touched).
5. Fire `extension:disabled` event.
6. Audit log records the disable.

To re-enable:
1. User clicks "Enable".
2. Host transitions to `active`.
3. Host re-registers contributions (per the original install flow).
4. Data is still there (no recreation needed).
5. Fire `extension:enabled` event.

**Gap:** the `LiveCapabilityRegistry.revokeLive(id)` is the only "unregister" method on live caps. The other registries (`UIComponentRegistry`, `SurfaceRegistry`, etc.) have unregister but the wiring for bulk "unregister all from extension X" doesn't exist. **Build a `unregisterExtension(extensionId)` orchestrator.**

---

## The uninstall path (v1)

1. User clicks "Uninstall" on the extension.
2. Host prompts: "Keep data or delete? [Archive] [Delete] [Cancel]".
3. User chooses.
4. Host transitions to `uninstalled`.
5. Host unregisters all contributions (same as disable).
6. **For each `StorageContribution`**:
   - If `uninstall.deleteData: 'archive'`: mark all `NodeStore.listByType(extensionNodeType)` with `state: 'archived'`. They're queryable but not "active."
   - If `uninstall.deleteData: 'all'`: hard-delete all Nodes of the extension's types.
   - If `uninstall.deleteData: 'keep'`: leave the data. (Equivalent to disable + remove the install state.)
7. **For each `SurfaceContribution`**: same as disable (unregister from catalog + clear slot override).
8. **For each `CapabilityContribution`**: revokeLive.
9. **For each `LifecycleContribution`**: unsubscribe + cancel.
10. **For each `ProviderContribution`**: unregister from `ProviderRegistrar`.
11. **Delete the install Node** (`NodeStore.delete(extensionInstallNodeId)`).
12. Fire `extension:uninstalled` event.
13. Audit log records: who uninstalled, when, what was archived/deleted.

---

## The `onUninstall()` hook

The test (Step 1.14) references `onUninstall` as a `ProviderPlugin` hook. For the v1 extension model, the hook is on a `LifecycleContribution`:

```typescript
interface LifecycleContribution {
  // ... existing ...
  subscription?: ... | { kind: 'uninstall'; handler: { kind: 'inline'; code: string; permissions: SandboxPermissions } | { kind: 'capability'; slug: string } }
}
```

The handler runs **before** the host unregisters contributions. The extension can:
- Final-cleanup (e.g. "delete my temp files").
- Notify external services (e.g. "revoke my OAuth token").
- Refuse the uninstall (return `{ ok: false, reason: 'still in use' }` — the host prompts the user).

Default: handler is optional. If absent, the host just unregisters.

---

## The cleanup story for data

The `StorageContribution.uninstall.deleteData` field (Step 3.5) controls the data policy. The host implements:
- `archive` (default): mark `state: 'archived'` on all extension Nodes. The data is still in the DB but the extension's auto-CRUD caps don't operate on it.
- `all`: hard-delete. The data is gone. **Irreversible.**
- `keep`: leave as-is. The extension is uninstalled but the data remains. Other extensions can read it if the ACL allows.

The user sees the data on uninstall. The host UI shows: "Extension X has 1,234 nodes. Keep / Archive / Delete?"

---

## What happens to the capabilities during uninstall

For each `CapabilityContribution`:
1. `LiveCapabilityRegistry.revokeLive(id)` — removes from registry.
2. Any in-flight calls are aborted (the handler is gone).
3. Future calls fail with "capability not found."
4. The cap is removed from the `LiveCapabilityStore`.

If a user tries to call the cap (e.g. from a saved NL pattern), the call fails gracefully. The NL pattern is marked as "extension uninstalled" in the UI.

---

## What happens to slot overrides during uninstall

For each `SurfaceContribution`:
1. Remove the component from `UIComponentRegistry` catalog.
2. Clear the `SlotOverrideClaim` — the slot falls back to its default or another contribution's renderer.
3. The UI re-renders (useSyncExternalStore).

---

## What happens to providers during uninstall

For each `ProviderContribution`:
1. `ProviderRegistrar` unregisters the provider.
2. The provider's data in `provider_definition`, `provider_endpoint`, etc. is deleted.
3. Any active conversations using this provider are... **what?** The user might have in-flight conversations. The host should:
   - Notify the user: "Provider X is being uninstalled. Your active conversations will be moved to provider Y."
   - Or: fail the conversations.
   - Default: notify + offer a migration path.

---

## What happens to event subscriptions during uninstall

For each `LifecycleContribution`:
1. `CapabilityEventBus.off(event, handler)`.
2. Cron jobs are cancelled.
3. The handler is no longer invoked.

---

## The audit log entry

Every uninstall fires an `extension:uninstalled` event AND writes to the audit log:

```typescript
{
  event: 'extension:uninstalled',
  extensionId: 'slack-integration',
  version: '1.2.3',
  uninstalledBy: 'user:alice',
  uninstalledAt: 1234567890,
  dataAction: 'archive',  // or 'all', 'keep'
  nodesArchived: 1234,
  capabilitiesRevoked: 2,
  surfacesRemoved: 1,
  providersUnregistered: 0,
  subscriptionsCancelled: 3,
}
```

The audit log is permanent. The user can see the history of their extensions.

---

## What this fixes

- ✅ Two paths: disable (v1.5) and uninstall (v1).
- ✅ `onUninstall()` hook on `LifecycleContribution`.
- ✅ `StorageContribution.uninstall.deleteData` policy: archive / all / keep.
- ✅ Bulk "unregister all from extension X" orchestrator.
- ✅ Audit log records uninstall.

## What this does NOT fix

- **The bulk "unregister all" orchestrator doesn't exist today.** It needs to be built.
- **The provider migration path** (for in-flight conversations) is not detailed. v1.5.
- **The "extension uninstalled" UX** (NL pattern warning, etc.) is the host's responsibility.

---

## Open design questions

1. **What if the user uninstalls an extension with in-flight calls?** The host aborts the calls. The user retries with a different extension (or without).

2. **What if the extension's data is shared with other extensions?** The user is warned. The host can show: "Extension X's data is referenced by extension Y. Uninstall anyway?"

3. **What if the uninstall fails partway through?** The host rolls back. The user retries.

4. **What if the user wants to re-install after uninstall?** Yes — same as install. The install state is fresh. The data depends on the previous `deleteData` policy (archived = recoverable, deleted = gone).

5. **What if a bundled extension is "uninstalled"?** Bundled = part of the host. The user can disable (v1.5) but not uninstall.

6. **What if the user uninstalls a workspace extension?** Per-workspace. The user's local install state is separate from the workspace config.

---

## Cross-references

- **Step 1.14 (distribution)** — the test references `onUninstall`; the code doesn't have it.
- **Step 3.5 (storage contribution)** — the `uninstall.deleteData` policy.
- **Step 3.6 (lifecycle contribution)** — the `kind: 'uninstall'` hook (proposed).
- **Step 4.6 (security)** — the audit log entry.
- **Step 5.1 (install path)** — re-install is the same pipeline.
- **Step 5.6 (synthesis)** — the complete picture.
