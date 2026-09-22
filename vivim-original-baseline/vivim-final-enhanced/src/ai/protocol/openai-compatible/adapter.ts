/**
 * VIVIM AI Gateway — OpenAI-Compatible Adapter (LEGACY SHIM)
 * @module ai/protocol/openai-compatible/adapter
 *
 * Re-export shim kept in place to preserve the public surface of
 * `src/ai/index.ts` and `src/ai/protocol/openai-compatible/index.ts`
 * during the kernel/plugin migration.
 *
 * The canonical implementation now lives at
 * `src/plugin-kernel/adapter/impl/openai-compatible/adapter.ts` (K0-5
 * first-party impl, awaiting K-011 contract split). The 5 sibling
 * files (auth, error-mapper, manifest, request-builder, stream-parser)
 * remain at their K1 locations for now; their imports in the new
 * adapter.ts traverse the deep relative path back to them.
 *
 * Once the migration of the broader AI gateway is complete, this shim
 * will be removed.
 */

export { OpenAICompatibleAdapter } from '../../../plugin-kernel/adapter/impl/openai-compatible/adapter.js'
