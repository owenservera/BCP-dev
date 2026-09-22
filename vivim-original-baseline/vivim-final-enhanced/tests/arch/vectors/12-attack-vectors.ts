// tests/arch/vectors/12-attack-vectors.ts
// The 12 attack vectors the certifier MUST reject.
// Each is a small adversarial manifest that tries a different attack pattern.

export const ATTACK_VECTORS = [
  {
    id: 'AV-01',
    name: 'path-traversal',
    description: 'Plugin manifest references "../../../etc/passwd" or similar',
    payload: {
      pluginId: 'attacker',
      version: '1.0.0',
      entry: '../../../etc/passwd',
      capabilities: ['fs.read'],
    },
    expected: 'reject',
  },
  {
    id: 'AV-02',
    name: 'kernel-import',
    description: 'Plugin imports a kernel internal (e.g. "src/plugin-kernel/internal/foo")',
    payload: {
      pluginId: 'attacker',
      version: '1.0.0',
      entry: './index.js',
      imports: ['src/plugin-kernel/internal/foo', 'src/intel/embeddings/contract'],
    },
    expected: 'reject',
  },
  {
    id: 'AV-03',
    name: 'forbidden-capability',
    description: 'Plugin requests a capability the kernel does not expose',
    payload: {
      pluginId: 'attacker',
      version: '1.0.0',
      entry: './index.js',
      capabilities: ['kernel.shutdown', 'fs.write-anything', 'network.bind-raw'],
    },
    expected: 'reject',
  },
  {
    id: 'AV-04',
    name: 'script-url-foreign-origin',
    description: 'Plugin scriptUrl points to a non-kernel-asset origin',
    payload: {
      pluginId: 'attacker',
      version: '1.0.0',
      entry: './index.js',
      scriptUrl: 'https://attacker.example.com/payload.js',
    },
    expected: 'reject',
  },
  {
    id: 'AV-05',
    name: 'prototype-pollution',
    description: 'Plugin manifest tries to pollute Object.prototype via __proto__',
    payload: (() => {
      const obj: any = {
        pluginId: 'attacker',
        version: '1.0.0',
        entry: './index.js',
      }
      // The real attack: the certifier should detect that the manifest
      // has a non-plain prototype. In the stub we use Object.create to simulate.
      Object.setPrototypeOf(obj, { isAdmin: true })
      return obj
    })(),
    expected: 'reject',
  },
  {
    id: 'AV-06',
    name: 'bus-event-non-namespaced',
    description: 'Plugin publishes a non-dot-namespaced event kind',
    payload: {
      pluginId: 'attacker',
      version: '1.0.0',
      entry: './index.js',
      publishes: ['raw-syscall', 'kernel-spoof'],
    },
    expected: 'reject',
  },
  {
    id: 'AV-07',
    name: 'storage-escape',
    description: 'Plugin tries to access storage outside its namespace',
    payload: {
      pluginId: 'attacker',
      version: '1.0.0',
      entry: './index.js',
      storageAccess: ['*', 'other-plugin/*', 'kernel/*'],
    },
    expected: 'reject',
  },
  {
    id: 'AV-08',
    name: 'eval-in-manifest',
    description: 'Plugin manifest contains eval() or Function() call',
    payload: {
      pluginId: 'attacker',
      version: '1.0.0',
      entry: './index.js',
      activate: "Function('return process')()",
    },
    expected: 'reject',
  },
  {
    id: 'AV-09',
    name: 'unbounded-resource',
    description: 'Plugin requests unbounded memory or CPU',
    payload: {
      pluginId: 'attacker',
      version: '1.0.0',
      entry: './index.js',
      resources: { memory: -1, cpu: Infinity, timeout: 0 },
    },
    expected: 'reject',
  },
  {
    id: 'AV-10',
    name: 'cyclic-dependency',
    description: 'Plugin A depends on Plugin B which depends on Plugin A',
    payload: null, // special: built dynamically
    expected: 'reject',
  },
  {
    id: 'AV-11',
    name: 'unsafe-eval-policy',
    description: 'Plugin tries to override IPolicyEnforcer to allow eval()',
    payload: {
      pluginId: 'attacker',
      version: '1.0.0',
      entry: './index.js',
      policyOverrides: { allowEval: true, allowUnsafe: true },
    },
    expected: 'reject',
  },
  {
    id: 'AV-12',
    name: 'unsigned-manifest',
    description: 'Plugin manifest lacks the required signature',
    payload: {
      pluginId: 'attacker',
      version: '1.0.0',
      entry: './index.js',
      // no signature field; fuzzer must delete signature from the seed
      _delete_signature: true as any,
    },
    expected: 'reject',
  },
] as const
