# Step 3.6: Lifecycle Contribution — Design Contract

**Date:** 2026-08-28
**Read:** Phase 1 Step 1.11 (security), Phase 1 Step 1.14 (distribution), Phase 2 Step 2.3 (lifecycle hooks)
**Status:** DESIGNED

---

## The question (from the process)

> "Can an extension hook lifecycle events (boot, shutdown, conv-start, etc)? Is the event bus the right hook surface, or do we need a more structured lifecycle?"

## The answer

**The event bus is the right primitive**, but a user extension needs a *structured* lifecycle that wraps it. The current `CapabilityEventBus` is the publish/subscribe layer; the user needs:
- A **typed** subscription API (knowing the event names that matter).
- A **boot/shutdown** hook (lifecycle, not events).
- A **per-conversation** hook (lifecycle).
- A **periodic** hook (cron-like).

The proposed `LifecycleContribution` is the typed contract for these hooks.

---

## The proposed `LifecycleContribution` shape

```typescript
// In an extension manifest, this is a JSON object.
// At runtime, this becomes a set of event subscriptions + cron jobs.
export interface LifecycleContribution {
  // ── Identity (required) ──
  id: string                  // unique within extension; e.g. "on-boot"
  
  // ── Subscription (one of) ──
  subscription?:
    | { kind: 'event'; event: string; handler: { kind: 'inline'; code: string; permissions: SandboxPermissions } }
    | { kind: 'event'; event: string; handler: { kind: 'capability'; slug: string } }
    | { kind: 'boot'; handler: { kind: 'inline'; code: string; permissions: SandboxPermissions } }
    | { kind: 'boot'; handler: { kind: 'capability'; slug: string } }
    | { kind: 'shutdown'; handler: { kind: 'inline'; code: string; permissions: SandboxPermissions } }
    | { kind: 'shutdown'; handler: { kind: 'capability'; slug: string } }
    | { kind: 'conversation-start'; handler: { kind: 'inline'; code: string; permissions: SandboxPermissions } }
    | { kind: 'conversation-start'; handler: { kind: 'capability'; slug: string } }
    | { kind: 'conversation-end'; handler: { kind: 'inline'; code: string; permissions: SandboxPermissions } }
    | { kind: 'conversation-end'; handler: { kind: 'capability'; slug: string } }
    | { kind: 'cron'; schedule: string; handler: { kind: 'inline'; code: string; permissions: SandboxPermissions } }
    | { kind: 'cron'; schedule: string; handler: { kind: 'capability'; slug: string } }
  
  // ── Optional: when does the subscription activate? (default: eager) ──
  activation?: 'eager' | 'lazy' | 'onEvent'
}
```

Where:
- `event` matches an event from the `CapabilityEventBus` (e.g. `'live_capability:registered'`, `'plugin:registered'`, `'canvas:def:updated'`, `'provider:added'`, `'account:plan_tier_changed'`, `'workspace:switched'`).
- `boot` fires once when the host starts.
- `shutdown` fires once when the host stops.
- `conversation-start` fires when a new conversation is created.
- `conversation-end` fires when a conversation is closed.
- `cron` uses a cron expression (e.g. `'0 * * * *'` for hourly).

The handler is either:
- **inline**: a `code: string` that runs in the sandbox with the declared permissions. The handler receives the event payload as `input`.
- **capability**: an existing `slug` to invoke. The event payload is passed as the capability's input.

---

## What this fixes

- ✅ Structured lifecycle hooks (boot, shutdown, conversation-start/end, cron).
- ✅ Event subscriptions (typed, not just "any string").
- ✅ Activation model (eager / lazy / onEvent).
- ✅ Handlers are sandboxed (inline) or re-use existing capabilities.
- ✅ The user doesn't have to know the event bus internals.

---

## What this does NOT fix

- **The handler runs in the same sandbox as `LiveCapabilityRegistry.inline`.** Default-deny permissions, QuickJS.
- **No error handling on handler failure.** If a handler throws, the event bus catches it (probably) and the host continues. The contract should declare retry policy.
- **No priority.** Multiple subscriptions to the same event fire in registration order. The contract should let the user set priority.
- **No cross-extension event ordering.** If extension A and B both subscribe to `live_capability:registered`, the order is undefined.
- **No event filtering.** A subscription gets every event of the given type. Filtering by payload is the handler's job.
- **No wildcards.** A subscription is for a specific event name, not a pattern. (Could add `event: 'capability:*'` later.)

---

## Sample lifecycle contribution (in `vivim-extension.json`)

```json
{
  "id": "log-capability-registrations",
  "subscription": {
    "kind": "event",
    "event": "live_capability:registered",
    "handler": {
      "kind": "inline",
      "code": "console.log('New live cap:', input.slug, 'by', input.registeredBy); return { ok: true };",
      "permissions": { "canFetch": [], "canReadFile": [], "canWriteFile": [], "canUseClipboard": false }
    }
  }
}
```

Or with a capability handler:

```json
{
  "id": "summary-on-conversation-end",
  "subscription": {
    "kind": "conversation-end",
    "handler": {
      "kind": "capability",
      "slug": "summarize_conversation"
    }
  }
}
```

This subscribes to `conversation-end` events. When one fires, the host invokes the `summarize_conversation` capability (which the extension also declared). The capability gets the conversation id as input.

---

## Cron scheduling

The `kind: 'cron'` variant uses a cron expression. The host has a cron runner (probably already exists; the cap-store has `request-queue.ts` and a scheduler). The contract is permissive: any cron expression the host supports.

```json
{
  "id": "daily-cleanup",
  "subscription": {
    "kind": "cron",
    "schedule": "0 0 * * *",
    "handler": {
      "kind": "inline",
      "code": "return { ok: true, cleaned: 0 };",
      "permissions": { "canFetch": [], "canReadFile": [], "canWriteFile": [], "canUseClipboard": false }
    }
  }
}
```

---

## What about the existing `ProviderPlugin` lifecycle?

The `ProviderPlugin` (Step 1.1) has its own lifecycle: `onRegister`, `onResolveCapabilities`, `onAction`, `onProjectState`, `onParse`, plus Phase 9 surfaces/mutationHandlers/capabilities. These are provider-specific.

**The `LifecycleContribution` is for general extensions, not providers.** A provider is loaded via the manifest pipeline; a general extension is loaded via the install endpoint. The lifecycles are different.

If a user extension wants both, it can declare:
- A `ProviderContribution` (for provider-specific behavior).
- A `LifecycleContribution` (for general event subscriptions).

They are orthogonal.

---

## Open design questions

1. **What if the handler's inline code is malicious?** The sandbox is the gate. The handler runs in QuickJS with the declared permissions. A handler that says `permissions: { canUseClipboard: true }` can use the clipboard. A handler with empty permissions can do nothing but log.

2. **What's the cron scheduler's precision?** Cron is usually 1-minute resolution. The host may support seconds. The contract is permissive.

3. **What if the user wants to subscribe to multiple events?** Multiple `LifecycleContribution` entries with the same `id` prefix. The host fires them all.

4. **Can a lifecycle handler invoke another extension's capability?** Yes — `kind: 'capability'` with a slug. The host's capability registry is the source.

5. **What about async event handlers?** Inline handlers are async. The host awaits. The event bus should be careful about back-pressure.

6. **What about the conversation lifecycle hooks?** `conversation-start` and `conversation-end` — what's the schema? Today, the conversation system has `ConversationRow` (Step 1.13). The hook receives the conversation row.

7. **What about host-side events the user doesn't know about?** The event bus is open. The user can `event: 'some-new-event'` and the host's bus will accept it. Discovery is the host's job (e.g. an `event-catalog.ts` that lists known events).

8. **What about activation `onEvent`?** A lifecycle contribution that activates on an event means: the contribution is not subscribed to the event; it IS the subscription that gets installed when the event fires. This is meta-recursive. Probably deferred to v2.

---

## Cross-references

- **Step 1.11 (security)** — sandbox, permissions.
- **Step 1.14 (distribution)** — install endpoint (stub); lifecycle hooks would be installed here.
- **Step 2.3 (lifecycle hooks)** — the existing hook system; this contribution wraps it.
- **Step 3.1 (capability contribution)** — the handler can be a `kind: 'capability'` slug.
- **Step 3.5 (storage contribution)** — the handler can read/write the extension's data.
- **Phase 3 Step 3.7 (synthesis)** — the unified `vivim-extension.json` includes lifecycle.
- **`CapabilityEventBus`** — the host's pub/sub. This contract wraps it.
