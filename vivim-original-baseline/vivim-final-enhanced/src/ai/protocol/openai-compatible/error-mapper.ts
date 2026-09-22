/**
 * VIVIM AI Gateway — OpenAI-Compatible Error Mapper (LEGACY SHIM)
 * @module ai/protocol/openai-compatible/error-mapper
 *
 * Re-export shim. Canonical implementation now lives at
 * `src/plugin-kernel/adapter/impl/openai-compatible/error-mapper.ts`.
 */

export {
  assertOkResponse,
  mapOpenAIError,
} from '../../../plugin-kernel/adapter/impl/openai-compatible/error-mapper.js'
