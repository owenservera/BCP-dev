/**
 * src/server/bootstrap/orchestrator.ts — LEGACY SHIM
 *
 * K0-15 glue MIGRATE: canonical implementation now lives at
 * `src/plugin-kernel/bootstrap/orchestrator.ts`. The phase siblings and
 * BootstrapContext type remain at their K1 locations during the broader
 * migration; the imports are rewritten to traverse up 2 levels to src/.
 *
 * The kernel owns the boot sequence; the server layer is a thin caller.
 */

export { orchestrateBootstrap } from '../../plugin-kernel/bootstrap/orchestrator.js'
