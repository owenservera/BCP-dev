// src/ai/plugins/plugin-manager-impl.ts
// K-001 row: the canonical impl is at src/plugin-kernel/plugin-manager/manager.ts.
// This file is now a thin re-export. It will be removed in P3-01 when the
// plugin-dev-tooling subsumes the AI gateway's plugin surface.

export { TrustedPluginManager, activatePluginManager, certifyManifest, computeManifestHash } from '../plugin-kernel/plugin-manager/manager.js'
