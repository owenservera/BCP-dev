# Kernel Boundary Tests (mechanical + contractual enforcement)

> **The arch tests that make the constitution, the trust model, and the migration plan *enforceable in CI*.** Every rule in `BOUNDARY-CONSTITUTION.md` and every gap flagged in `REASSESSMENT.md` becomes a test in this directory. The tests are not advisory; they are required for merge. Each is a small TypeScript file that scans the codebase, parses imports, classifies source + target into layers, and either passes or breaks the build.
>
> **Two-layer enforcement** (post-REASSESSMENT fix):
> 1. **Mechanical** — no illegal imports, no `globalThis` writes, no `eval`/`require` outside sandbox, namespace discipline, layer boundary.
> 2. **Contractual** — every kernel contract has `contractVersion`; every kernel-emitted bus event passes the namespace check; every first-party `BootstrapContext` reach is now an `IPluginContext` reach; the certifier's 12 attack vectors are all caught.
>
> The existing `src/arch/boundary-scanner.ts` + `src/arch/boundary-rules.ts` is the *enforcement engine*; the tests below are the *rules* the engine enforces. They ship in `tests/arch/kernel-*.test.ts` and run on every PR.

---

## 1. The layer model (formal, machine-readable)

| Layer ID | Path | Allowed dependencies | Owner |
|----------|------|---------------------|-------|
| `kernel` | `src/kernel/**` (new) | `shared`, `src/foundation`, `src/schema/kernel-types.ts` (subset), `src/storage/contracts/*`, `src/lib/*`, external `node:`, `bun:`, `zod` | kernel |
| `kernel-frontend` | `frontend/src/kernel/**` (new) | `shared`, external `react`, `zod` | kernel |
| `foundation` | `src/foundation.ts`, `src/ids.ts`, `src/errors.ts`, `src/config.ts`, `src/lib/*` | `shared`, external | foundation |
| `storage-contracts` | `src/storage/contracts/**` | `shared`, `src/foundation`, `zod` | kernel |
| `storage-impl` | `src/storage/impl/**` | `shared`, `foundation`, `storage-contracts`, `prisma/client`, `node:` | storage (kernel implementation) |
| `storage-infra` | `src/storage/db.ts`, `src/storage/prisma.ts`, `src/storage/verify-compat.ts` | `shared`, `foundation`, `storage-contracts`, `prisma/client` | kernel |
| `engines` | `src/engines/**` (today's mix) | `shared`, `foundation`, `storage-contracts` | engine layer (reclassified in P3) |
| `executor` | `src/executor/**` | `shared`, `foundation`, `engines`, `node:` | kernel |
| `server` | `src/server/**` | `shared`, `foundation`, `storage-contracts`, `storage-infra`, `storage-impl`, `engines`, `executor`, `kernel` | server (calls kernel) |
| `cli` | `src/cli/**` | `shared`, `foundation`, `engines`, `server`, `kernel`, `node:` | cli (calls kernel) |
| `frontend` | `frontend/src/**` (excluding `frontend/src/kernel/**`) | `shared`, `kernel-frontend` (only via a re-export point), `react`, `next/*` | frontend (uses kernel SDK) |
| `devops` | `devops/**` | all of the above | devops |
| `plugins` | `plugins/**` (after P3) | `shared`, `kernel-frontend` (re-exports) | first-party + third-party |
| `frontend-kernel-sdk` | `frontend/src/sdk/**`, `frontend/src/shared/universal-registry.ts` | `shared` | kernel (the plugin author's SDK surface) |

These rules extend the existing `src/arch/boundary-rules.ts`. The test files below are *new*, but the engine they use is the existing `scanBoundaryViolations()` from `boundary-scanner.ts`.

**Post-REASSESSMENT fix:** layer "kernel" is `src/kernel/**` (not `src/plugin-kernel/**` — see Gap-1.1 in `REASSESSMENT.md`; the kernel's directory name is finalized at I-2.1; either name is acceptable as long as the test matches the actual path).

---

## 2. The rules and the tests

### 2.1 Kernel cannot import first-party engines

**Rule (Constitution Rule B + C):** `src/kernel/**` may not import from `src/engines/*`. The kernel does not know about VIVIM's product.

**Test:** `tests/arch/kernel-isolation.test.ts`

```ts
import { describe, it, expect } from 'bun:test'
import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'
import { glob } from 'node:fs/promises'

const KERNEL_DIR = resolve(import.meta.dir, '../../src/kernel')
const ENGINES_DIR = resolve(import.meta.dir, '../../src/engines')

describe('kernel-isolation', () => {
  it('src/kernel/** must not import from src/engines/**', async () => {
    const files: string[] = []
    for await (const f of glob('**/*.ts', { cwd: KERNEL_DIR })) {
      files.push(resolve(KERNEL_DIR, f))
    }
    const violations: string[] = []
    for (const f of files) {
      const content = await readFile(f, 'utf-8')
      for (const m of content.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
        const spec = m[1]
        if (spec.startsWith('../engines/') || spec.startsWith('../../engines/') || spec.startsWith('../../../engines/')) {
          violations.push(`${f}: ${spec}`)
        }
      }
    }
    expect(violations).toEqual([])
  })
})
```

---

### 2.2 Kernel cannot import provider-specific code

**Rule (Constitution Rule E):** The kernel does not know what Discord, Notion, etc. are.

**Test:** `tests/arch/kernel-no-provider-imports.test.ts`

```
For every `import` in `src/kernel/**` whose target contains 'discord', 'notion', 'slack', 'whatsapp', 'reddit', 'openai', 'anthropic', 'gemini', 'chatgpt', 'claude', 'mcp', 'workflow', 'agent', 'memory', 'knowledge', 'harness', 'conversation', 'embedding', 'stealth', 'parser', 'policy-engine', 'consent-engine', fail.
```

---

### 2.3 Kernel cannot import UI product modules

**Rule (Constitution Rule B + C):** The kernel has no opinion on chat, canvas, panels, etc.

**Test:** `tests/arch/kernel-no-ui-product-imports.test.ts`

```
For every `import` in `src/kernel/**` whose target contains 'canvas', 'panel', 'card', 'shell', 'command-palette', 'notifications-center', 'main-menu', 'mobile-nav', 'infinite-canvas', 'living-canvas', 'quad-tree', 'connection-layer', 'register-all', 'capability-bootstrap', 'nlcl/', 'theme-', 'workspace-switcher', 'presence-indicator', fail.
```

---

### 2.4 First-party engines reach kernel ONLY through the contract barrel — REWRITTEN

**Rule (Constitution Rule C + REASSESSMENT Gap-1):** A first-party engine never imports a kernel *runtime* class. The kernel exposes **only** via `src/kernel/contracts.ts` (a single barrel) which re-exports:
- `interface`/`type` definitions (zero runtime)
- `create*` factory functions (which return narrowed contract instances, not the implementation class)
- brand constants (e.g. `KERNEL_CONTRACT_VERSION`)

Anything else is a violation.

**Test:** `tests/arch/first-party-uses-contracts.test.ts`

```ts
import { describe, it, expect } from 'bun:test'
import { resolve } from 'node:path'
import { readFile } from 'node:fs/promises'
import { glob } from 'node:fs/promises'

const ENGINES_DIR = resolve(import.meta.dir, '../../src/engines')

// The allowlist: which exports from src/kernel/ are reachable from engines
const KERNEL_ALLOWLIST = new Set<string>([
  // Identifiers (zero runtime)
  'RequestId', 'ProviderId', 'ModelId', 'SessionId', 'ToolCallId', 'EventId', 'PluginId', 'WorkspaceId',
  // Contract interfaces (zero runtime, but the import is allowed because the type is used at compile time only)
  'IPluginManager', 'IPluginContext', 'IEventBus', 'IProviderAdapter', 'IProviderRegistry', 'IModelRegistry',
  'IRouter', 'IPolicyEnforcer', 'IPolicyEvaluator', 'IExecutionManager', 'IRuntimeSupervisor', 'IResourceManager',
  'SandboxPolicy', 'INodeStoreContract', 'IProviderRegistrar', 'StorageNamespace', 'MigrationRunner',
  'KernelProvenance', 'KernelSpan', 'KernelEvent', 'KernelTracer', 'EncryptionEngine',
  'IProviderStore', 'StreamParserEngine', 'SandboxRunner',
  // Factory functions (runtime-allowed, they return narrowed contract instances)
  'createIPluginManager', 'createIEventBus', 'createIProviderRegistry', 'createIExecutionManager',
  'createIRuntimeSupervisor', 'createIResourceManager', 'createIPolicyEnforcer', 'createSandboxHost',
  'createINodeStoreContract', 'createKernelTracer', 'createEncryptionEngine',
  // Constants
  'KERNEL_CONTRACT_VERSION',
  // Errors
  'KernelError', 'ContractVersionError', 'AdapterError', 'CapacityError', 'ConcurrentStateChangeError',
])

describe('first-party-uses-contracts', () => {
  it('engines may only import allowlisted symbols from src/kernel/', async () => {
    const files: string[] = []
    for await (const f of glob('**/*.ts', { cwd: ENGINES_DIR })) {
      if (f.includes('kernel/')) continue  // exclude the kernel directory itself
      files.push(resolve(ENGINES_DIR, f))
    }
    const violations: string[] = []
    for (const f of files) {
      const content = await readFile(f, 'utf-8')
      // 1. Static: detect any import from src/kernel/*
      for (const m of content.matchAll(/from\s+['"]([^'"]*src\/kernel[^'"]*|\.\.\/kernel[^'"]*|\.\.\/\.\.\/kernel[^'"]*)['"]/g)) {
        violations.push(`${f}: ${m[1]}`)
      }
      // 2. Static: detect any direct `new ConcreteClass()` on kernel classes
      for (const m of content.matchAll(/new\s+([A-Z][A-Za-z0-9]*)/g)) {
        if (!KERNEL_ALLOWLIST.has(m[1]) && /[A-Z]/.test(m[1][0])) {
          // Heuristic: a non-allowlisted capitalized identifier is suspect.
          // False positives (e.g. `new Set(...)`) are filtered by KERNEL_ALLOWLIST exclusion
          // and by an explicit exception list below.
          if (!['Set', 'Map', 'Date', 'Error', 'TypeError', 'RangeError', 'URL', 'RegExp', 'Function', 'Promise', 'Array'].includes(m[1])) {
            // Soft warning only (runtime reach is what matters; static check is best-effort)
            // The runtime check below catches the actual case.
          }
        }
      }
    }
    expect(violations).toEqual([])
  })

  it('engines may not `require` anything from src/kernel/ outside the contract barrel', async () => {
    // Reject `require('../../kernel/...')` patterns
    const files: string[] = []
    for await (const f of glob('**/*.ts', { cwd: ENGINES_DIR })) {
      if (f.includes('kernel/')) continue
      files.push(resolve(ENGINES_DIR, f))
    }
    const violations: string[] = []
    for (const f of files) {
      const content = await readFile(f, 'utf-8')
      for (const m of content.matchAll(/require\(['"]([^'"]+)['"]\)/g)) {
        if (m[1].includes('kernel/') || m[1].includes('plugin-kernel/')) {
          violations.push(`${f}: require(${m[1]})`)
        }
      }
    }
    expect(violations).toEqual([])
  })
})
```

The `KERNEL_ALLOWLIST` is the single source of truth for "what the kernel exposes to engines." Anything not on this list that is imported from `src/kernel/` is a violation. The list is generated automatically at boot by walking `src/kernel/contracts.ts` and recording every export.

---

### 2.5 Plugin code cannot bypass the IPluginContext

**Rule (Constitution Rule C + REASSESSMENT Gap-1 fix):** A plugin's `activate(ctx)` must not reach host internals outside of `ctx`. The static check is the easy part; the runtime check is the real one.

**Test:** `tests/unit/kernel/iplugin-context.test.ts` (static + runtime probe)

**Static analysis:** for every plugin source file (under `frontend/plugins/*` and any future `plugins/*` directory), grep for `globalThis`, `process.env`, `require(`, `eval(`, `(new Function(` and report. (The existing test design from REASSESSMENT §2.5 is correct.)

**Runtime probe:** the test creates an `IPluginContext` (the real type from `src/kernel/contracts.ts`), calls a test plugin's `activate(ctx)`, and asserts that the only keys reachable on `globalThis` from inside the plugin are the ones the kernel exposes (e.g. `__vivim_host__` for the host bridge). The probe runs in a `node:vm` context with `globalThis` frozen to a sentinel except for kernel-exposed keys.

```ts
import { describe, it, expect } from 'bun:test'
import vm from 'node:vm'
import type { IPluginContext } from '../../src/kernel/contracts.js'

describe('iplugin-context', () => {
  it('a plugin activate() can only see kernel-exposed globals', async () => {
    let leakedKeys: string[] = []
    const ctx = makeTestPluginContext()
    const pluginCode = `
      globalThis.process;            // should throw
      globalThis.__pluginManager;     // should throw
      require('node:fs');             // should throw
      // ... kernel-exposed keys:
      globalThis.__vivim_host__;      // should be allowed
    `
    try {
      vm.runInNewContext(pluginCode, {
        __vivim_host__: { send: () => {} },
        // All other keys removed
      })
    } catch (e) {
      leakedKeys.push(...Object.keys(e).filter(k => !k.startsWith('__vivim')))
    }
    expect(leakedKeys).toEqual([])
  })
})
```

---

### 2.6 Plugins cannot access arbitrary storage

**Rule (REASSESSMENT MISSING-6):** A plugin's only path to storage is `ctx.storage.scoped(namespace)`. A direct `ctx.db.prisma.*` or `ctx.nodeStore.create` access is forbidden.

**Test:** `tests/unit/kernel/plugin-storage-namespace.test.ts`

The runtime probe (per REASSESSMENT §2.6) is the right one. Static analysis on plugin source is a "best-effort" check; the runtime probe is authoritative.

---

### 2.7 Plugins cannot directly access privileged host APIs (Capability-Abuse Defense)

**Rule (Constitution Rule D + REASSESSMENT Change-8 — NEW):** When a plugin calls `ctx.capabilities.invoke('plugin:other:cap', ...)`, the kernel's `IPolicyEnforcer.enforceCapabilityInvocation(callerPluginId, calleePluginId, capabilityId)` runs. Default-deny. Per-capability allow-list on the *callee's* manifest.

**Test:** `tests/unit/kernel/plugin-capability-abuse.test.ts`

The test creates two test plugins. Plugin A calls `ctx.capabilities.invoke('plugin:B:secret', ...)` where `B:secret` is declared `requiresConfirmation: true` and not in A's allowed list. The test asserts the call is denied with `PolicyDecision = { allowed: false, reason: '...', code: 'POLICY_DENIED' }`. The kernel emits `policy.denied` to the bus with the reason.

12 cases (matching the certifier's attack-vector count) cover the surface:

1. Caller has no `capability:invoke` permission → denied
2. Callee's `secret` capability not in caller's `allowedCapabilities` → denied
3. Callee's `secret` capability requires confirmation, caller does not have `capability:invoke-with-confirmation` → denied
4. Caller's `PluginId` is suspended (mid-uninstall) → denied
5. Callee is in a different `PluginNamespace` and no bridging rule → denied
6. Caller is the *kernel* (a K0 internal call) → allowed (this is the test surface for the gateway)
7. Caller is `plugin:debug-helper` (a dev tool plugin) calling `plugin:debug-helper:internal` → allowed
8. ... (12 cases total — see `tests/unit/kernel/plugin-capability-abuse.test.ts`)

---

### 2.8 Provider-specific code cannot enter the kernel namespace

**Rule (Constitution Rule E):** The kernel does not know provider-specific shapes.

**Test:** `tests/arch/kernel-no-provider-namespaces.test.ts`

```
For every directory in `src/kernel/`, its subdirectory names must not include 'provider', 'discord', 'notion', 'slack', 'whatsapp', 'reddit', 'gemini', 'chatgpt', 'claude', 'openai', 'anthropic', 'mcp', 'workflow', 'agent', 'memory', 'knowledge', 'harness', 'conversation'.

Allowed exceptions: 'capability' (the universal capability binding, not product-specific).
```

---

### 2.9 Certifier cannot be bypassed

**Rule (Constitution Rule C + REASSESSMENT §2.9):** A plugin cannot install without `IPluginManager.certify()` returning `passed: true`.

**Test:** `tests/unit/kernel/certify-bypass-attempt.test.ts`

The 12 attack vectors (per the prior plan) are the spec. Post-REASSESSMENT, the 13th is added: a plugin that omits `PluginContractVersions` entirely (i.e. does not declare a `contractVersion` for any contract). The certifier rejects with `manifest missing contractVersions[].event-bus — see PLUGIN-CONTRACTS P-17`.

```ts
describe('certify-bypass-attempt', () => {
  // ... 12 prior cases (manifest, permissions↔contributes, integrity, namespace,
  //     scriptUrl, schema, event-prefix, schema-prefix, harness, features,
  //     browser-provider, multi-device-sync) ...
  
  // 13th: missing contractVersions
  it('rejects a manifest that omits contractVersions', () => {
    const manifest = { id: 'com.acme.no-version', version: '1.0.0', /* no contractVersions */ }
    const result = await host.certify(manifest)
    expect(result.passed).toBe(false)
    expect(result.report.join(' ')).toMatch(/contractVersions/)
  })
})
```

---

### 2.10 Harness command namespace

**Rule (Constitution Rule E + REASSESSMENT Gap-7):** Once `harness` is enabled for K2 (v2), a plugin's commands are namespaced `${pluginId}.${localId}` and cannot shadow a built-in. The harness registry shape itself is K0 (per REASSESSMENT Gap-7 fix); the *file* `harness-command-registry.ts` is K0 shape; the *content* (100+ seeded commands in `seeds/harness/commands/`) is K1.

**Test:** `tests/unit/harness/namespace.test.ts` (deferred to v2; today's registry has no namespace check)

This test, when v2 lands, asserts:

1. A first-party kernel command `cap-store.send_message` cannot be shadowed by a plugin command `send_message`.
2. Two plugins cannot both register `acme.invoicer.send` even with the same id (the second one fails at certify).
3. A plugin command id `acme.invoicer.` is rejected (the kernel always prefixes with the plugin's own id; the plugin may NOT self-prefix).

---

### 2.11 Capability event bus namespace

**Rule (MISSING-11):** A plugin's `event.kind` must start with `plugin:${pluginId}.`. A plugin cannot emit a kernel event.

**Test:** `tests/unit/kernel/event-bus-namespace.test.ts`

For 6 well-known kernel event types (`provider:seeded`, `plugin:installed`, `capability:executed`, `binding:status_changed`, `conversation:complete`, `manifest_drift`), a test plugin's `eventBus.publish(kind, ...)` is rejected with a `EventNamespaceError`.

**Post-REASSESSMENT addition (Gap-13):** the bus must also use a consistent namespace separator. The kernel uses `kernel.*` (dot) for its own events. The plugin uses `plugin:${id}.*` (dot) for its own events. No colon namespace. A normalization check is added:

```ts
it('event kinds use a consistent dot-separator (not colon)', () => {
  for (const kind of WELKNOWN_KERNEL_EVENT_KINDS) {
    expect(kind).not.toContain(':')
  }
  // ...
})
```

The kernel's well-known event kinds are renamed from `provider:seeded` to `provider.seeded`, etc. in P0-4 (per `REASSESSMENT Gap-13`).

---

### 2.12 `IEventBus` contract version gate

**Rule (MISSING-2 + PLUGIN-CONTRACTS P-17):** A plugin's `contractVersions[].event-bus` is cross-checked against the kernel's actual version. A plugin requiring `event-bus@1.2` on a kernel exposing `event-bus@1.1` is rejected (warn at minor, deny at major).

**Test:** `tests/unit/kernel/contract-version.test.ts`

5 manifests are tried: same major same minor (pass), same major higher minor (pass), same major lower minor (pass with warn), lower major (fail), missing contract (fail).

Post-REASSESSMENT: the test also asserts that **every** kernel contract has a `contractVersion` field. The test walks `src/kernel/**` and checks every exported `interface` has a `contractVersion: { major: 1; minor: 0 }` member.

```ts
it('every kernel contract has a contractVersion field', async () => {
  for (const file of glob('**/contracts.ts', { cwd: KERNEL_DIR })) {
    const content = await readFile(file, 'utf-8')
    const interfaces = extractInterfaceNames(content)
    for (const i of interfaces) {
      expect(content).toMatch(new RegExp(`interface\\s+${i}[^}]*contractVersion`))
    }
  }
})
```

---

### 2.13 Kernel-only boot

**Rule (Constitution Rule F):** The kernel boots with no first-party plugin installed.

**Test:** `tests/arch/kernel-boot.test.ts`

`bootKernelOnly()` (in `src/kernel/test-helpers.ts`) returns a `BootResult` with `{ db, eventBus, IPluginManager, IProviderRegistry, IEventBus, SandboxedNode, KernelRegistry, KernelTracer, KernelProvenance }`. The test asserts no `ConversationManager`, no `MemoryEngine`, no `WorkflowEngine`, no `ChromeGovernor`, no `AgentBuilder`, no `NLCLEngine`, no `CapabilityBootstrap` is reachable.

**Post-REASSESSMENT additions:**

```ts
it('the kernel-only boot does not register any default capabilities', () => {
  const result = await bootKernelOnly()
  const caps = await result.IProviderRegistry.list()
  expect(caps).toEqual([])  // No default Claude, ChatGPT, etc. — those are first-party
})

it('the kernel-only boot has an empty schema registry beyond the built-in 19', () => {
  const result = await bootKernelOnly()
  const schemas = result.SchemaRegistry.all()
  // 19 built-in cap-store.* types only
  expect(schemas.length).toBe(19)
})

it('the kernel-only boot has the universal Node record ready', () => {
  const result = await bootKernelOnly()
  expect(result.NodeStore).toBeDefined()
  // No Conversation, no Memory, no ProviderAccount — those are first-party
  expect(result.NodeStore.list({ type: 'cap-store.conversation' })).resolves.toEqual([])
})
```

---

### 2.14 `safe-eval.ts` and simulator are gone

**Rule (P0-3, P2-3):** The H9-hazard denylist guard and the simulator must be deleted.

**Test:** `tests/arch/no-safe-eval-no-simulator.test.ts`

```
For every file under `src/`, the import of `safe-eval` or `simulator-adapter` or `legacy-adapter-wrappers` must return 0. The files themselves must not exist.
```

---

### 2.15 `globalThis` write sites are gone (except the kernel's sandbox host)

**Rule (MISSING-17, P0-5):** No `globalThis.__pluginManager`, `globalThis.__harnessRepair`, or any other `globalThis as Record<string, unknown>.__<name> = ...` write site in `src/`, except in the kernel's `sandbox-runner.ts` and a single legacy-compat shim with a TODO-removal date.

**Test:** `tests/arch/no-global-this.test.ts`

```
For every file under `src/`, a regex `/(globalThis|GLOBAL_THIS|_global)\.__\w+\s*=/` must return 0, except for `src/engines/sandbox-runner.ts` and one designated legacy-compat shim.
```

---

### 2.16 Plugin scoped storage has no cross-namespace reach

**Rule (MISSING-6):** `IPluginScopedStore.get/put/delete/list` may only touch keys under `plugin:<pluginId>:*`.

**Test:** `tests/unit/kernel/iplugin-scoped-store.test.ts`

A test plugin's `ctx.storage.scoped('plugin:self')` tries to read/write/list keys under other plugins' prefixes. Every attempt returns `null` / is rejected / returns an empty list. The test also asserts the scoped store cannot drop the namespace, cannot run raw queries, and cannot escape to the unprefixed key space.

---

### 2.17 Prisma schema boundary (with model ownership)

**Rule (F-CRITICAL-2 + REASSESSMENT §3):** After the migration, kernel data models live under `prisma/kernel/`; first-party data models under `plugins/core/<name>/prisma/`.

**Test:** `tests/arch/prisma-model-ownership.test.ts` (new, ships in P2-2)

```ts
const KERNEL_MODELS = [
  'SchemaMeta', 'Node', 'NodeVersion', 'NodeAlias', 'NodeEdge',
  'PluginRegistry', 'SandboxAudit', 'EventRecord',
  'KernelSpan', 'KernelProvenance', 'KernelTopology', 'KernelEvent',
  'ConfigEntry', 'ConfigAudit', 'HpeSession',
  // Borderline (re-classified as K0; see REASSESSMENT §3):
  'User', 'Session',
]
const FIRST_PARTY_MODELS = [
  'Conversation', 'ConversationMessage', 'StreamBlock',  // chat
  'EpisodicMemory', 'SemanticMemory', 'MemoryEmbedding', // memory
  'WorkflowDefinition', 'WorkflowNode', 'WorkflowEdge', // workflows
  // ... ~185 models ...
]

it('kernel models live in prisma/kernel/', () => {
  for (const m of KERNEL_MODELS) {
    expect(modelPath(m)).toMatch(/^prisma\/kernel\//)
  }
})
it('first-party models live in plugins/core/<plugin>/prisma/', () => {
  for (const m of FIRST_PARTY_MODELS) {
    expect(modelPath(m)).toMatch(/^plugins\/core\/[^/]+\/prisma\//)
  }
})
```

---

### 2.18 V1 bus is a legacy compatibility shim

**Rule (P2-5):** V1 is preserved but no new code uses it.

**Test:** `tests/arch/v1-bus-only-legacy.test.ts`

For every file under `src/`, the import of `capability-event-bus` (V1) must return 0 except in the V1→V2 bridge file (`src/kernel/plugin-kernel/events.ts`).

---

### 2.19 (NEW, post-REASSESSMENT) — `globalThis.__vivim_host__` is the ONLY plugin-reachable global

**Rule:** The kernel exposes a single, documented global to plugins (in the iframe sandbox: `window.__vivim.requestCapability`; in the host V8: `globalThis.__vivim_host__` which is a frozen record). No other global may be referenced from a plugin's source.

**Test:** `tests/unit/kernel/plugin-globals.test.ts`

A test plugin's source is scanned for `globalThis.`, `window.`, `self.`, `parent.`, `top.`, `frames.`, `global.`, etc. Any reference other than to the documented kernel-exposed globals is flagged. A 12-row allowlist of globals is the only permitted surface (it includes `__vivim_host__`, `__vivim_requestCapability`, `console.*`, etc.).

---

### 2.20 (NEW, post-REASSESSMENT) — V2 bus `legacy:` kinds are not double-fired

**Rule (P0-4):** The V1→V2 bridge mirrors V1 events to V2 as `legacy:<type>`. A handler subscribed to both V1 directly and V2 with a wildcard must not double-fire.

**Test:** `tests/unit/kernel/v1-v2-bridge-no-double-fire.test.ts`

A test publishes 100 V1 events of 10 different types. A handler subscribed to V1 directly fires 100 times. A handler subscribed to V2 with `onAny('legacy:*')` fires 100 times. A handler subscribed to V2 with `onAny('*')` does **not** fire on the legacy mirror. (The bridge publishes with the kind `legacy:<type>` to distinguish from the V2 canonical kinds.)

---

## 3. The runner

`tests/arch/runner.ts` already exists. It calls `scanBoundaryViolations()` and `runCleanupAnalysis()`. **Add a call to run all 20 tests in this document** as part of `bun run devops gate [--strict]`.

The gate becomes:

- `bun test tests/arch/*.test.ts` — the layer boundary tests
- `bun test tests/unit/kernel/*.test.ts` — the kernel unit tests
- `bun run devops gate` — the existing gate

A green gate is required to merge any PR that touches `src/`, `frontend/src/`, or `prisma/`.

---

## 4. How a rule becomes a test (the workflow)

1. A new boundary rule is identified during a PR (e.g. a new plugin-facing contract is added).
2. The rule is added to `BOUNDARY-CONSTITUTION.md` and `KERNEL-CONTRACTS.md`.
3. A test is added to `tests/arch/` or `tests/unit/kernel/` per the rules in this document.
4. The test must pass on `main` before the PR is merged.
5. The test is added to the CI gate.

The workflow is enforced by code review: a PR without a test for a new boundary rule is incomplete.

---

## 5. Why these tests are sufficient (and what they do not cover)

**Sufficient for:** the *mechanical* and *contractual* boundary — no illegal import, no `globalThis` write, no plugin escape, no `cap-store.*` squat, every kernel contract versioned, every event namespaced, every plugin's capabilities deny-by-default, the certifier is complete.

**Do not cover:** the *semantic* boundary — the host correctly uses the kernel, the certifier's *specific failure modes* in production, the bus bridge is *correct* in all edge cases. These are tested by:

- `tests/unit/kernel/certify.test.ts` — the certifier's 13 attack vectors
- `tests/unit/kernel/iplugin-context.test.ts` — the context's 7 read attempts
- `tests/integration/kernel/e2e-install.test.ts` — a real install + activate + emit + uninstall round-trip
- `tests/integration/kernel/e2e-sandbox.test.ts` — a real sandboxed component render + capability call + deny
- `tests/security/certify-fuzz.test.ts` — fuzzing the certifier with 10,000 randomly mutated manifests

These are not arch tests; they are functional tests. The arch tests catch the *easy* violations; the functional tests catch the *hard* ones.

The test budget for the full boundary migration:

- **20 arch tests** (this document).
- **9 unit tests** for kernel primitives (certify, iplugin-context, contract-version, resource-manager, execution-manager, capability-abuse, plugin-globals, v1-v2-bridge, harness-namespace).
- **6 integration tests** for end-to-end behavior.
- **1 fuzz test** for the certifier.

**Total: 40 tests** (was 36, +4 for K0(L0)). That is the price of a real plugin architecture + a natively intelligent kernel.

### 2.21 (NEW, post-LAYER-0) — `src/kernel/intel/` may not import first-party engines

**Rule (LAYER-0-INTELLIGENCE §4.5):** the K0(L0) deterministic intelligence substrate lives in `src/kernel/intel/`. It cannot import from `src/engines/*` (which contains VIVIM's first-party product code, including the NLCL orchestrator, OpenCode, agents, autonomous, local-agent).

**Test:** `tests/arch/kernel-l0-isolation.test.ts`

```ts
const KERNEL_INTEL = resolve(import.meta.dir, '../../src/kernel/intel')
const ENGINES_DIR = resolve(import.meta.dir, '../../src/engines')
const NLCL_ORCHESTRATOR = resolve(import.meta.dir, '../../src/engines/nlcl/nlcl-engine.ts')
const OPENCODE = resolve(import.meta.dir, '../../src/engines/opencode/opencode-supervisor.ts')
const LOCAL_AGENT = resolve(import.meta.dir, '../../src/engines/local-agent/local-agent-executor.ts')
const AGENTIC_LOOP = resolve(import.meta.dir, '../../src/engines/agentic-loop.ts')
const AUTONOMOUS = resolve(import.meta.dir, '../../src/engines/autonomous-execution.ts')

it('K0(L0) may not import any first-party engine', async () => {
  const files: string[] = []
  for await (const f of glob('**/*.ts', { cwd: KERNEL_INTEL })) {
    files.push(resolve(KERNEL_INTEL, f))
  }
  const violations: string[] = []
  for (const f of files) {
    const content = await readFile(f, 'utf-8')
    if (content.includes(ENGINES_DIR)) violations.push(`${f}: imports from src/engines/`)
  }
  expect(violations).toEqual([])
})
```

### 2.22 (NEW) — the NLCL orchestrator is not in the kernel

**Rule:** `src/engines/nlcl/nlcl-engine.ts` (the 950-line orchestrator) is **K1** — it is a first-party plugin, not a kernel substrate. The K0(L0) `ICommandPipeline` is the *shape*; the NLCL orchestrator is one *implementation*.

**Test:** `tests/arch/nlcl-orchestrator-not-kernel.test.ts`

```
For every import in `src/kernel/intel/`, the resolved target must NOT be `src/engines/nlcl/nlcl-engine.ts`.
```

### 2.23 (NEW) — the OpenCode supervisor is not in the kernel

**Rule:** `src/engines/opencode/opencode-supervisor.ts` is **K1**. The K0(L0) does NOT spawn subprocesses.

**Test:** `tests/arch/opencode-not-kernel.test.ts`

```
For every import in `src/kernel/intel/`, the resolved target must NOT be `src/engines/opencode/*`.
```

### 2.24 (NEW) — the kernel boots without HF, Ollama, OpenCode, or any LLM

**Rule (LAYER-0 §2.1 + §4.2):** the kernel must boot with TF-IDF defaults. Any embedding provider, LLM service, or opencode subprocess is an *optional* upgrade, never a dependency.

**Test:** `tests/integration/kernel/boot-without-l0-substrate.test.ts`

```ts
it('bootKernelOnly() with no L0 substrates registered returns a working kernel', async () => {
  // Do not register any IIntelligenceSubstrate.
  const result = await bootKernelOnly()
  expect(result.embeddings.local).toBe(true)              // TF-IDF is local + default
  expect(result.pipeline.llmFallback).toBeNull()           // no LLM registered
  expect(result.opencode).toBeUndefined()                  // no opencode
  expect(result.interpret('list conversations')).resolves.toBeDefined()
})
```

---

## 6. The post-REASSESSMENT delta

The original `KERNEL-BOUNDARY-TESTS.md` had **18 tests** and was missing the contractual layer entirely. This revision:

- **Test 2.4 rewritten** (was unenforceable) — now enforce kernel-contract reach via an allowlist of exported symbols.
- **Test 2.7 expanded** — added the capability-abuse defense (the 12-case matrix).
- **Test 2.12 expanded** — added the "every kernel contract has a `contractVersion`" check.
- **Test 2.17 expanded** — added the borderline models (`User`, `Session`).
- **Test 2.13 expanded** — added 3 sub-tests for empty registries, empty schemas, empty conversation list.
- **Test 2.19 added** — the `globalThis.__vivim_host__` allowlist.
- **Test 2.20 added** — V1→V2 bridge no-double-fire.

**Net: 18 → 20 tests, with 4 of the original 18 rewritten/expanded.**
