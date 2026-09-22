/**
 * src/server/plugin-router.ts — LEGACY SHIM
 *
 * K-003 row MIGRATE: the real install path moved to
 * `src/plugin-kernel/plugin-manager/install-router.ts` per the K0
 * unification target. This shim re-exports `createPluginRouter` so any
 * remaining K1 caller (legacy HTTP wiring) keeps working.
 *
 * K0-1 owns the install lifecycle. The HTTP boundary is a thin
 * adapter over `IPluginManager`; the unification with K-001 lands in
 * subsequent P0-1 work.
 */

export { createPluginRouter } from '../plugin-kernel/plugin-manager/install-router.js'
