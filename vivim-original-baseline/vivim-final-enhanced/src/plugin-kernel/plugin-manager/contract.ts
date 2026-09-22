// src/plugin-kernel/plugin-manager/contract.ts
// IPluginManager contract (C-01). Moved from src/ai/plugins/manager.ts (K-002 row).
// The contract is the kernel; the impl lands in manager.ts.

import type { PluginDescriptor, PluginId, PluginState, ProviderManifest } from '../../ai/core/types.js'

export interface PluginPackageRef {
  /** Local file path or registry URI — resolution is the implementation's concern. */
  readonly source: string
  readonly expectedChecksum?: string
}

export type PluginValidationResult =
  | { readonly valid: true; readonly manifest: ProviderManifest }
  | { readonly valid: false; readonly reason: string; readonly vector?: string }

export interface IPluginManager {
  discover(source: PluginPackageRef): Promise<PluginValidationResult>

  /**
   * Verifies signature/checksum before anything is written to disk.
   * Must return a PLUGIN_UNTRUSTED-coded failure rather than throwing raw crypto errors.
   */
  install(source: PluginPackageRef): Promise<PluginDescriptor>

  uninstall(pluginId: PluginId): Promise<void>

  enable(pluginId: PluginId): Promise<void>
  disable(pluginId: PluginId): Promise<void>

  get(pluginId: PluginId): Promise<PluginDescriptor | undefined>
  list(filter?: { readonly state?: PluginState }): Promise<readonly PluginDescriptor[]>

  /**
   * Re-runs the 12-attack-vector compliance suite (AV-01..AV-12).
   * Returns the attack vector ID that failed (if any).
   */
  certify(
    pluginId: PluginId,
  ): Promise<{ readonly passed: boolean; readonly report: readonly string[] }>
}
