/**
 * VIVIM AI Gateway — Contract Invariants (LEGACY SHIM)
 * @module ai/core/invariants
 *
 * This file is a re-export shim kept in place to preserve the public
 * surface of `src/ai/index.ts` during the kernel/plugin migration.
 * The canonical implementation now lives at
 * `src/plugin-kernel/core/invariants.ts` (K-014, K0-15 subsystem).
 *
 * Once the migration of the broader AI gateway is complete, this shim
 * will be removed.
 */

export * from '../../plugin-kernel/core/invariants.js'
