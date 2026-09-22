# ADR 003 — Event Bus: V2 Canonical for Kernel, V1 Stays Behind a Bridge

- **Date:** 2026-08-28
- **Status:** Ratified (I-1)
- **Deciders:** agent (E2E owner)
- **Tags:** events, migration, arch-stability

## Context

Two bus modules exist, with different tradeoffs:

- **V1** `src/engines/capability-event-bus.ts:165` — `class CapabilityEventBus` (singleton, `getInstance()`/`resetInstance()`), flat `CapabilityEvent` union (23 variants), sync fire, `Map<type, Set<handler>>` + `onceHandlers`, WS fanout (`wsSubscriptions`), `recent[]` ring of 200, `setDurableStore(EventRecordStore)` mirror. Imported widely across `src/`, `src/server/bootstrap/phases/capabilities.ts:43`, etc.
- **V2** `src/engines/capability-event-bus-v2.ts:46` — `class CapabilityEventBusV2` (no singleton, `new`), `EventEnvelope<T>` with `ulid`, `correlationId`/`causationId`, `publish` / `publishAndWait`, async error isolation → catch + `addToDLQ`, wildcard `onAny('*')`, ring buffer 1000 (circular), DLQ 100, `snapshot()`.

V2 is the right substrate for a permission-gated, activation-event-driven kernel (correlation tracing, awaitable handlers, DLQ). But V1 has many consumers and 23 event types that are not envelope-shaped. A big-bang "migrate all imports off V1" would touch the most files of any task in the plan (Phase 0.3 batched by `src/engines/`, `src/server/`, `frontend/src/`) and is the single most expensive rework if later found wrong.

## Decision

- **V2 is canonical for `src/plugin-kernel/`** — all kernel-emitted events (`plugin:installed`, `plugin:certify_failed`, activation events) are V2 `publish()` calls with `source: 'plugin-kernel'`.
- **V1 stays alive.** No consumer migration is required for v1 to ship.
- **Bridge:** `src/plugin-kernel/events.ts` mirrors V1 `emit()` → V2 `publish('legacy:${type}', event)` best-effort (and optionally V2 → V1 for the small set of types the kernel needs to observe). The bridge is the only place that imports both modules.
- **Arch test:** `tests/arch/single-event-bus.test.ts` asserts at most two bus modules exist and `src/plugin-kernel/**` never imports V1 directly. The test is the migration gate — not a manual checklist.

## Consequences

- New plugin-kernel code gets envelopes, DLQ, and `publishAndWait` without forcing existing engine code to re-shape its 23 flat event types.
- V1 consumers migrate opportunistically, one directory at a time, not as a blocker for the kernel. When (if) V1 is eventually deprecated, the bridge is deleted and the arch test tightens to "exactly one bus module."
- Minor bug carried in V2 `dispatch:180` (`_onceHandlers` variable unused, `once` cleanup done via `remaining` filter) is fixed when `events.ts` is first touched.

## Alternatives Considered

- Big-bang migrate all call sites off V1 → rejected: highest file-churn, highest regression risk, blocks everything.
- Pick V1 as canonical → rejected: loses envelopes/DLQ/`publishAndWait` that the kernel's activation flow needs; would require bolting those onto V1.
- Keep both with no bridge → rejected: two event worlds that cannot observe each other is a split-brain bug.
