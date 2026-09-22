/**
 * VIVIM AI Gateway — In-Memory Event Bus (LEGACY SHIM)
 * @module ai/events/in-memory-bus
 *
 * Re-export shim. Canonical implementation now lives at
 * `src/plugin-kernel/event-bus/in-memory.ts` (K-006, K0-3).
 */

export {
  InMemoryEventBus,
  providerStateChangedEvent,
} from '../../plugin-kernel/event-bus/in-memory.js'
