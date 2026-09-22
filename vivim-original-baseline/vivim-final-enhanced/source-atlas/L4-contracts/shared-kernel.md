# L4 — Contracts: Shared Kernel (`ids.ts` + `errors.ts` + `config.ts` + `index.ts` + `shared/`)

## `src/ids.ts` (52 lines — ID law)

```ts
newId(): string                                  // ULID, monotonic + sortable — all PKs
deriveSlaveId(providerId, accountId)             // `slave:{provider}:{account}`
deriveCapabilityId(providerId, slug)             // `cap:{provider}:{slug}`
deriveBindingId(globalCapId, providerId)         // `bind:{global}:{provider}`
deriveProgramId(bindingId, version)              // `prog:{binding}:v{n}`
deriveSelectorId(capabilityId, providerId, name) // `sel:{cap}:{provider}:{name}`
hashContent(content): string                     // SHA-256 hex (node:crypto); FNV-1a `fnv1a:*` fallback = dedup-only, NOT integrity
```

Every foreign key in `storage/contracts/*` and every Prisma relation using string IDs
follows these derivations. If a join key doesn't match one of the six patterns above,
it is a bug — flag it.

## `src/errors.ts` (365 lines — typed hierarchy)

Base: `CapStoreError{code, message, details?, toJSON()->{error,code,details}}`.

| Class | When thrown (from usage in engines) |
|-------|-------------------------------------|
| `ValidationError` | zod/schema guard failure at ingress or engine boundary |
| `NotFoundError` | store get-by-id miss |
| `ConflictError` | unique violation (binding/program promotion races) |
| `AuthRequired` | `auth-gate.ts` rejection |
| `SlaveNotRunningError(slaveId)` / `SlaveBusyError(slaveId)` | governor allocation failures |
| `CdpTimeoutError(method)` | CDP command timeout |
| `CircuitOpenError(slaveId)` | breaker open, fast-fail |
| `MemoryError` + `MemoryBackendLimitError(existing,rejected)` + `MemoryWardenQuotaError(agentId,used,limit)` | memory harvester (single external backend rule + per-agent quotas) |
| `UpdateError` | updater/version-manager failures |
| (+ more in file tail — see `errors.ts:101-365`) | domain-specific extensions, all extending `CapStoreError` |

HTTP mapping lives in `src/server/errors.ts`; wire shape in `src/schema/response-schemas.ts`.

## `src/config.ts` + `src/config/provider-registry.ts`

App-wide tunables + provider registry (endpoints, default models, stream configs).
Validated by `src/schema/config.ts`, persisted via `contracts/config-store.ts`
(`ConfigEntry` + `ConfigAudit`), surfaced at runtime by `engines/config-manager.ts` +
`config-universal-surface.ts` (reprogrammability: FRONTEND=BACKEND=SDK=CLI=API parity target).

## `src/index.ts` (462 lines — public barrel = what is public)

Re-exports `VERSION='1.0.0'`, `seedAutomation`, `seedHarnessCommands`, then one block per
engine family: `Alerter`, `AutomationScheduler`, `ActionPlan*`, `AdaptiveWorkspaceEngine`,
`AgentBuilderEngine`, `AgenticLoopEngine`, `AirGapEngine`, `ApiProviderAdapter`,
`AutonomousExecutionEngine`, `ReplayController`, `BackupScheduler`, `BeliefStore`,
`BrowserActionSchema…`, `BudgetEngine`, `CapabilityEngine`, `CapabilityBinder`,
`CapabilityComposer`, `CapabilityEventBus`, `CapabilityMacroEngine`, `Parity*`…
(~200 exports total). **Rule: if it's not re-exported here, it's internal.**
`src/cleanup/unused-exports.ts` enforces barrel hygiene.

## `shared/` (isomorphic kernel for BE/FE)

`api-types.ts` (envelopes) · `canvas-types.ts` (scene) · `conceptual-model.ts` (concepts) ·
`screenshot-budget.ts` (budgets) · `stream-blocks.ts` (block union — the streaming wire type) ·
`ui-component.ts` (manifest) · `ui-slots.ts` (slot contract — hot-swappable renderers) ·
`parser/` (parser helpers). Frontend `storage/contracts/` mirrors backend contracts with
memory impls only; the DB-backed truth stays in `src/storage/`.
