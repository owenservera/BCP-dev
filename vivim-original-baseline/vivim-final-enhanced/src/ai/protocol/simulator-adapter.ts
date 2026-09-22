/**
 * VIVIM AI Gateway — Simulator Adapter (LEGACY SHIM)
 * @module ai/protocol/simulator-adapter
 *
 * Re-export shim. Canonical implementation now lives at
 * `src/plugin-kernel/adapter/impl/simulator/adapter.ts`.
 */

export {
  isSimulatorManifest,
  SIMULATOR_MANIFEST,
  SIMULATOR_MODEL_ID,
  SIMULATOR_PROVIDER_ID,
  SimulatorAdapter,
  type SimulatorConfig,
  simulatorAdapterFactory,
} from '../../plugin-kernel/adapter/impl/simulator/adapter.js'
