/**
 * VIVIM AI Gateway — OpenAI-Compatible Manifest (LEGACY SHIM)
 * @module ai/protocol/openai-compatible/manifest
 *
 * Re-export shim. Canonical implementation now lives at
 * `src/plugin-kernel/adapter/impl/openai-compatible/manifest.ts`.
 */

export {
  type AuthMethod,
  loadManifestFromFile,
  type ModelManifestEntry,
  modelEntryToCapabilityMap,
  type OpenAICompatibleManifest,
  validateManifest,
} from '../../../plugin-kernel/adapter/impl/openai-compatible/manifest.js'
