// src/plugin-kernel/plugin-manager/certifier.ts
// The 12-attack-vector certifier (C-01 certifier stub → real impl).
// Each check is a pure function: (manifest) => { valid, reason, vector? }.
// Replaces the 3 stub checks in src/ai/plugins/plugin-manager-impl.ts.

import { createHash } from 'node:crypto'
import type { ProviderManifest } from '../../ai/core/types.js'

export interface CertifyResult {
  readonly valid: boolean
  readonly reason: string
  readonly vector?: string
}

const KNOWN_VECTORS = ['AV-01', 'AV-02', 'AV-03', 'AV-04', 'AV-05', 'AV-06', 'AV-07', 'AV-08', 'AV-09', 'AV-10', 'AV-11', 'AV-12'] as const

export type AttackVectorId = (typeof KNOWN_VECTORS)[number]

/**
 * AV-01: path traversal — manifest entry must not contain `..`
 */
function av01_pathTraversal(manifest: ProviderManifest): CertifyResult | null {
  const entry = (manifest as any).entry as string | undefined
  if (entry && entry.includes('..')) {
    return { valid: false, reason: 'AV-01: path traversal in manifest.entry', vector: 'AV-01' }
  }
  return null
}

/**
 * AV-02: kernel import — manifest imports must not reference kernel internals
 */
function av02_kernelImport(manifest: ProviderManifest): CertifyResult | null {
  const imports = (manifest as any).imports as string[] | undefined
  if (imports?.some(x => x.startsWith('src/plugin-kernel/internal/'))) {
    return { valid: false, reason: 'AV-02: kernel internal import', vector: 'AV-02' }
  }
  return null
}

/**
 * AV-03: forbidden capability — capabilities must be allowlisted
 */
const ALLOWED_CAPABILITY_PREFIXES = ['fs.read-self', 'fs.write-self', 'network.http-', 'network.https-', 'storage.kv-', 'events.publish-', 'events.subscribe-', 'plugin.']

function av03_forbiddenCapability(manifest: ProviderManifest): CertifyResult | null {
  const capabilities = (manifest as any).capabilities
  if (!capabilities) return null
  // Capabilities may be a string array (test payloads) or a Record (real manifests)
  const caps: string[] = Array.isArray(capabilities)
    ? capabilities
    : Object.keys(capabilities ?? {})
  for (const cap of caps) {
    if (cap.startsWith('kernel.') || cap === 'fs.write-anything' || cap === 'network.bind-raw' || cap === 'process.spawn') {
      return { valid: false, reason: `AV-03: forbidden capability: ${cap}`, vector: 'AV-03' }
    }
    if (!ALLOWED_CAPABILITY_PREFIXES.some(p => cap.startsWith(p))) {
      return { valid: false, reason: `AV-03: capability not in allowlist: ${cap}`, vector: 'AV-03' }
    }
  }
  return null
}

/**
 * AV-04: scriptUrl must match the kernel-asset origin regex
 */
function av04_scriptUrlOrigin(manifest: ProviderManifest): CertifyResult | null {
  const scriptUrl = (manifest as any).scriptUrl as string | undefined
  if (scriptUrl && !scriptUrl.match(/^https:\/\/assets\.vivim\.app\//)) {
    return { valid: false, reason: `AV-04: foreign scriptUrl: ${scriptUrl}`, vector: 'AV-04' }
  }
  return null
}

/**
 * AV-05: prototype pollution — manifest has a non-plain prototype
 */
function av05_prototypePollution(manifest: ProviderManifest): CertifyResult | null {
  if (Object.getPrototypeOf(manifest) !== Object.prototype) {
    return { valid: false, reason: 'AV-05: prototype pollution', vector: 'AV-05' }
  }
  if (Object.prototype.hasOwnProperty.call(manifest, '__proto__')) {
    return { valid: false, reason: 'AV-05: __proto__ in own keys', vector: 'AV-05' }
  }
  return null
}

/**
 * AV-06: bus event non-namespaced — publishes must be dot-namespaced
 */
const NAMESPACE_RE = /^(plugin\.[a-z0-9_.-]+|kernel|legacy)\./
function av06_busEventNamespace(manifest: ProviderManifest): CertifyResult | null {
  const publishes = (manifest as any).publishes as string[] | undefined
  if (publishes?.some(x => x !== '*' && !NAMESPACE_RE.test(x))) {
    return { valid: false, reason: 'AV-06: non-namespaced event', vector: 'AV-06' }
  }
  return null
}

/**
 * AV-07: storage escape — storage access must be namespaced
 */
function av07_storageEscape(manifest: ProviderManifest): CertifyResult | null {
  const storageAccess = (manifest as any).storageAccess as string[] | undefined
  if (storageAccess?.some(x => x === '*' || x.startsWith('kernel/') || x === 'other-plugin/*')) {
    return { valid: false, reason: 'AV-07: storage escape', vector: 'AV-07' }
  }
  return null
}

/**
 * AV-08: eval in manifest — manifest must not contain eval/Function call
 */
function av08_evalInManifest(manifest: ProviderManifest): CertifyResult | null {
  const activate = (manifest as any).activate as string | undefined
  if (activate && (activate.includes('Function(') || activate.includes('eval('))) {
    return { valid: false, reason: 'AV-08: eval/Function in manifest.activate', vector: 'AV-08' }
  }
  return null
}

/**
 * AV-09: unbounded resource — resources must have positive finite bounds
 */
function av09_unboundedResource(manifest: ProviderManifest): CertifyResult | null {
  const resources = (manifest as any).resources as { memory?: number; cpu?: number; timeout?: number } | undefined
  if (!resources) return null
  if (typeof resources.memory === 'number' && (resources.memory < 0 || resources.memory > 1024 * 1024 * 1024)) {
    return { valid: false, reason: 'AV-09: unbounded memory', vector: 'AV-09' }
  }
  if (resources.cpu === Infinity || resources.cpu === -Infinity || (typeof resources.cpu === 'number' && resources.cpu < 0)) {
    return { valid: false, reason: 'AV-09: unbounded cpu', vector: 'AV-09' }
  }
  if (resources.timeout === 0 || (typeof resources.timeout === 'number' && resources.timeout < 0)) {
    return { valid: false, reason: 'AV-09: zero/negative timeout', vector: 'AV-09' }
  }
  return null
}

/**
 * AV-10: cyclic dependency — checked at the graph level (not on a single manifest).
 * Stubbed here as a passthrough; the real check is in the PluginGraph class.
 */
function av10_cyclicDependency(_manifest: ProviderManifest): CertifyResult | null {
  return null
}

/**
 * AV-11: unsafe eval policy — manifest must not override the policy enforcer
 */
function av11_unsafeEvalPolicy(manifest: ProviderManifest): CertifyResult | null {
  const policyOverrides = (manifest as any).policyOverrides as { allowEval?: boolean; allowUnsafe?: boolean } | undefined
  if (policyOverrides?.allowEval || policyOverrides?.allowUnsafe) {
    return { valid: false, reason: 'AV-11: unsafe eval policy override', vector: 'AV-11' }
  }
  return null
}

/**
 * AV-12: unsigned manifest — manifest must have a signature
 */
function av12_unsignedManifest(manifest: ProviderManifest): CertifyResult | null {
  if (!(manifest as any).signature) {
    return { valid: false, reason: 'AV-12: missing signature', vector: 'AV-12' }
  }
  return null
}

const CHECKS: Array<(m: ProviderManifest) => CertifyResult | null> = [
  av05_prototypePollution,
  av01_pathTraversal,
  av02_kernelImport,
  av03_forbiddenCapability,
  av04_scriptUrlOrigin,
  av06_busEventNamespace,
  av07_storageEscape,
  av08_evalInManifest,
  av09_unboundedResource,
  av10_cyclicDependency,
  av11_unsafeEvalPolicy,
  av12_unsignedManifest,
]

/**
 * Run all 12 attack-vector checks against a manifest.
 * Returns the first failure (if any). Order: prototype first (cheapest + most security-critical).
 */
export function certifyManifest(manifest: ProviderManifest): CertifyResult {
  // AV-05 first: if the prototype is polluted, every other check is unreliable
  const proto = av05_prototypePollution(manifest)
  if (proto) return proto

  for (const check of CHECKS) {
    if (check === av05_prototypePollution) continue // already done
    const result = check(manifest)
    if (result) return result
  }
  return { valid: true, reason: 'ok' }
}

/**
 * Compute an integrity hash for a manifest (SHA-256).
 * Moved verbatim from src/ai/plugins/plugin-manager-impl.ts:145.
 */
export function computeManifestHash(manifest: ProviderManifest): string {
  const content = JSON.stringify({
    id: manifest.id,
    name: manifest.name,
    version: manifest.version,
    protocolVersion: manifest.protocolVersion,
    capabilities: manifest.capabilities,
  })
  return createHash('sha256').update(content).digest('hex')
}
