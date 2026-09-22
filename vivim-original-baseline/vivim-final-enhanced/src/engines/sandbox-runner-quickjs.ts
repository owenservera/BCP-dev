/**
 * src/engines/sandbox-runner-quickjs.ts — LEGACY SHIM
 *
 * K-027 row MERGE: the QuickJS impl was merged into
 * `src/plugin-kernel/sandbox/runner.ts`. This shim re-exports it
 * for any remaining K1 caller.
 */

export {
  SandboxRunner,
  type SandboxPermissions,
  type SandboxBudget,
  type SandboxRunOptions,
  type SandboxResult,
} from '../plugin-kernel/sandbox/runner.js'
