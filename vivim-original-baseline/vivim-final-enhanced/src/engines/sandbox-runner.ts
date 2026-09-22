/**
 * src/engines/sandbox-runner.ts — LEGACY SHIM (selector retired)
 *
 * K-027 row MERGE: the QuickJS impl was merged into the canonical
 * `src/plugin-kernel/sandbox/runner.ts` and the runtime selector (which
 * chose between QuickJS and the deprecated vm fallback) is gone. The
 * `vm` fallback (H9 hazard) is retained only as a roll-back flag
 * behind VIVIM_UNSAFE_VM=1 and is removed in a subsequent PR.
 *
 * This shim re-exports the canonical SandboxRunner class so any
 * remaining K1 caller keeps working. The shim is a candidate for
 * removal once all first-party consumers are migrated.
 */

export {
  SandboxRunner,
  type SandboxPermissions,
  type SandboxBudget,
  type SandboxRunOptions,
  type SandboxResult,
} from '../plugin-kernel/sandbox/runner.js'
