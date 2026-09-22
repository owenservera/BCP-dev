# Step 5.2: Load & Activate — Eager, Lazy, onEvent

**Date:** 2026-08-28
**Read:** Phase 1 Step 1.2 (hot-reload), Phase 3 Step 3.1 (capability contribution activation), Phase 3 Step 3.6 (lifecycle)
**Status:** DESIGNED

---

## The question (from the process)

> "When does an extension actually start running? Eager (load all at boot) or lazy (load when first used)?"

## The answer

**Three activation modes: eager, lazy, onEvent.** All declared per-contribution in the manifest. The default is `eager`.

| Mode | When it runs | Use case |
|---|---|---|
| `eager` | At install + at every host boot | Background tasks, default for capabilities |
| `lazy` | On first invocation | Capabilities that aren't always needed |
| `onEvent` | When a specified event fires | Reactive capabilities, event handlers |

---

## Per-contribution activation

The activation mode is declared **per contribution**, not per extension. So an extension can have:
- A `CapabilityContribution` with `activation: 'eager'` (always registered).
- A `LifecycleContribution` with `subscription.kind: 'event', activation: 'eager'` (subscribed at boot).
- A `CapabilityContribution` with `activation: 'lazy'` (only when first invoked).
- A `LifecycleContribution` with `subscription.kind: 'event', activation: 'onEvent'` (subscribed when the event fires).

---

## The eager path (default)

At install:
1. Read the manifest.
2. For each contribution with `activation: 'eager' | (omitted)`:
   - Register the contribution immediately.
   - For capabilities: `LiveCapabilityRegistry.registerLive(spec)`.
   - For surfaces: `UIComponentRegistry.register(...)`.
   - For providers: `ProviderRegistrar.register(manifest)`.
   - For storage: register Node type + auto-CRUD caps (also eager by default).
   - For lifecycle: subscribe to events.

At every host boot:
1. Load the install state from `NodeStore.listByType('extension.install')`.
2. Re-apply all eager contributions.
3. (For lazy/onEvent, the contribution is "ready" but not "active.")

---

## The lazy path

A lazy contribution is "ready" at install (the manifest is loaded) but not "active" (the registry doesn't have it yet). On first invocation:

1. The host's capability dispatch receives a call to the lazy cap.
2. The host checks: is this a lazy contribution? If yes, activate.
3. Activate: `LiveCapabilityRegistry.registerLive(spec)`. This is a one-time cost.
4. Then dispatch the call.

After activation, the cap behaves like an eager cap (stays registered).

For surfaces, "lazy" means the slot override is not yet sent. On first render of the slot, the host checks and sends the override. (The slot system already has `mount.when: 'on-capability-call'` per Step 3.2 — same idea.)

---

## The onEvent path

A contribution with `activation: 'onEvent'` is "ready" but not "active" until a specified event fires.

For `LifecycleContribution` with `subscription.kind: 'event'`, the subscription is the activation. The host:
1. Holds the spec in memory.
2. On event match: register the handler (subscribe).
3. After that, the handler fires on every event.

For `CapabilityContribution` with `activation: 'onEvent', events: [...]`, the host:
1. Holds the spec in memory.
2. On event match: `LiveCapabilityRegistry.registerLive(spec)`.
3. After that, the cap is active.

**This is meta-recursive.** A `LifecycleContribution` that activates on an event is itself a subscription. The system handles the recursion via an internal "pending subscriptions" map.

---

## The activation state machine

```typescript
type ActivationState =
  | 'ready'      // spec loaded, not registered
  | 'active'     // registered in the host
  | 'inactive'   // was active, now suspended (per `uninstall.unmount.when`)
  | 'failed'     // activation failed (audit log records why)
  | 'uninstalled'  // removed
```

The transition graph:
```
ready → active (on first use, on event, or at boot)
ready → failed (on registration error)
active → inactive (on user pause)
active → ready (on user unload with `keep: true`)
active → uninstalled (on user uninstall)
inactive → active (on user resume)
```

The host maintains the state per contribution. The state is persisted to the install Node.

---

## The `LiveCapabilityRegistry.loadFromDb()` (Step 1.7)

Per Step 1.7 line 110-114: `LiveCapabilityRegistry.loadFromDb()` loads all persisted live caps at startup. This is **already the eager path** for live caps. So:
- Eager live caps: persisted at install, re-loaded at boot via `loadFromDb()`.
- Lazy live caps: persisted at install, NOT loaded at boot. Loaded on first invocation.
- onEvent live caps: persisted at install, NOT loaded at boot. Loaded on event.

The host's `loadFromDb()` only loads eager caps. Lazy + onEvent caps wait for their trigger.

---

## What this fixes

- ✅ Per-contribution activation mode.
- ✅ Eager (default), lazy (on first use), onEvent (on event).
- ✅ Activation state machine (ready / active / inactive / failed / uninstalled).
- ✅ Lazy caps don't pay registration cost until needed.
- ✅ onEvent caps wait for the event (saves startup time + memory).

## What this does NOT fix

- **The `LiveCapabilityStore` persists all caps**, eager or not. The host must filter on `loadFromDb()` (eager only). Or: the `LiveCapabilityStore` schema gets a `activation: 'eager' | 'lazy' | 'onEvent'` field. **Proposed.**
- **The "active" → "inactive" transition** needs a `suspend` method on each registry. Today: `unregister`. The user can't pause without uninstall. **Deferred to v1.5.**

---

## Open design questions

1. **What if a lazy cap is never invoked?** It stays in "ready" forever. The host could time it out and unload. Default: never unload.

2. **What if an onEvent cap's event never fires?** Same as lazy. Stays "ready."

3. **What if activation fails?** The cap goes to `failed`. The audit log records why. The user sees the failure. The user can retry or remove.

4. **Can the user manually activate a lazy cap?** Yes — via a "force activate" UI. The user can preview the cap.

5. **Can the user manually deactivate an active cap?** v1.5. For v1, the only way to deactivate is uninstall.

6. **What about cross-extension activation?** If extension A's contribution is lazy and the user calls it, A activates. If A's contribution depends on B (e.g. calls B's capability), B must also be active. The host checks dependencies at activation time.

---

## Cross-references

- **Step 1.2 (hot-reload)** — the file-watch loader; complementary to this.
- **Step 1.7 (live capability)** — `loadFromDb()` is the eager path today.
- **Step 3.1 (capability contribution)** — the `activation` field.
- **Step 3.6 (lifecycle contribution)** — the `subscription.kind: 'event'` variant.
- **Step 5.3 (hot-reload)** — combines with this for dev mode.
- **Step 5.6 (synthesis)** — the complete picture.
