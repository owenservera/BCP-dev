# I-2 Deep Probe Spec (deterministic → evidence)

> **The forensic reclassification is the design; the I-2 deep probe is the evidence.** Before P0-1 merges, the I-2 probe runs small `bun run` scripts and writes evidence docs that prove every per-file tier assignment, every contract signature, and every consumer. The probe is deterministic and reproducible — `bun run .runtime/probe-all.ts` regenerates all 8 evidence docs from scratch.
>
> The probe scripts (under `.runtime/`) are themselves shippable artifacts; they run as part of the devops gate.

## The 8 probe scripts (and the 8 evidence docs they produce)

| Script | Produces | Time | Cost |
|---|---|---|---|
| `probe-truth-map.ts` | `evidence/per-file-truth-map.md` | ~5 min | One-time; the result is the source of truth for `PLUGIN-TRUST-MODEL.md` |
| `probe-bus.ts` | `evidence/event-bus-diff.md` | ~2 min | Every V1 event type vs V2 envelope; the legacy prefix mapping |
| `probe-contracts.ts` | `evidence/contract-consumer-map.md` | ~5 min | For each kernel contract, the list of files that import it + the test that pins it |
| `probe-context-reach.ts` | `evidence/plugin-iplugin-context-reach.md` | ~10 min | For every `BootstrapContext` field accessed by a first-party engine, the corresponding `IPluginContext` capability; gaps are flagged |
| `probe-prisma.ts` | `evidence/cap-store-table-audit.md` | ~3 min | Every Prisma model in `prisma/system/` + `prisma/user/`, classified K0 (kernel) or K1 (first-party) |
| `probe-events.ts` | `evidence/dom-and-event-surface.md` | ~3 min | Every event type the kernel emits; every event type plugins emit; namespace + prefix rules |
| `probe-frontend.ts` | `evidence/frontend-component-inventory.md` | ~3 min | Every component in `frontend/src/components/canvas/`, `frontend/src/ui/`, `frontend/src/sdk/` |
| `probe-harness.ts` | `evidence/harness-command-inventory.md` | ~2 min | Every command in `seeds/harness/commands/`, classified K1 (`plugin:canon-harness`) |
| `probe-l0-substrate.ts` (post-LAYER-0) | `evidence/l0-substrate-inventory.md` | ~2 min | Every file under `src/kernel/intel/`, classified by `substrate` (pipeline / embedding / budget / command / registry). |
| `probe-l0-resolvers.ts` (post-LAYER-0) | `evidence/l0-resolver-coverage.md` | ~2 min | Every NLCL resolver, classified by layer (deterministic / fuzzy / semantic / classifier / llm) and `deterministic` flag. |

**Total I-2 time: ~4-6 weeks** (1 sprint) including writing the probe scripts + verifying the outputs.

## Probe script template (per-file)

Every probe script follows this template:

```ts
// .runtime/probe-<name>.ts
import { resolve } from 'node:path'
import { readFile, writeFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'

const ROOT = resolve(import.meta.dir, '..')
const EVIDENCE_DIR = resolve(ROOT, 'docs/kernel-plugins/evidence')

async function main() {
  // 1. Walk the source tree
  // 2. Apply the per-file rule
  // 3. Write a markdown table to EVIDENCE_DIR/<name>.md
  // 4. Exit 0 if all expected; exit 1 if any surprise (CI gate)
}

main()
```

Each probe is **a small TypeScript file** under `.runtime/`, runnable via `bun run`, that:

1. **Walks** a defined source subtree (e.g. `src/engines/`, `prisma/`, `frontend/src/components/canvas/`).
2. **Applies a deterministic rule** (a regex, an AST walk, a Zod parse).
3. **Writes a markdown table** to `evidence/<name>.md` with a row per file/symbol.
4. **Exits 0** if every row matches the expected classification; **exits 1** if any surprise (the CI gate).

## `probe-truth-map.ts` — the most important probe

This probe produces `evidence/per-file-truth-map.md`, the per-file truth map flagged as REASSESSMENT Gap-2.

**Output schema** (one row per file):

```
| file | today | should-be | reason | evidence |
```

Where:

- `file` is the absolute path from the repo root.
- `today` is the current tier assignment (K0 / K1 / K2 / K3 / mixed).
- `should-be` is the target tier per the forensic reclassification.
- `reason` is the migration rationale (one short sentence).
- `evidence` is `file:line` (the canonical anchor).

**Algorithm:**

1. For every `.ts` file under `src/engines/`, `src/ai/`, `src/server/`, `src/storage/contracts/`, `src/schema/`, `frontend/src/engines/`, `frontend/src/sdk/`, `frontend/src/shared/`, `frontend/src/components/canvas/`, `frontend/src/ui/`:
   - Apply the per-file rule (a small lookup table maintained in the script; e.g. `harness-command-registry.ts` → K0; `harness-executor-engine.ts` → K1).
   - If the file is not in the lookup table, default to "should be K0" and flag the row for human review (CI gate fails the build).
2. For every `.prisma` model under `prisma/system/`, `prisma/user/`:
   - Apply the kernel-model allowlist (Node, NodeVersion, NodeAlias, NodeEdge, SchemaMeta, PluginRegistry, SandboxAudit, EventRecord, KernelSpan, KernelProvenance, KernelTopology, KernelEvent, ConfigEntry, ConfigAudit, HpeSession, User, Session).
   - Any other model is K1 first-party content.

**Run:** `bun run .runtime/probe-truth-map.ts`. Output: `evidence/per-file-truth-map.md` (~500-700 rows).

**CI gate:** every file in the source subtree must appear in the output table. Any file that does not is a build failure (the file is "unknown to the kernel").

## `probe-bus.ts` — the event bus diff

This probe produces `evidence/event-bus-diff.md`, the reconciliation between V1 (`src/engines/capability-event-bus.ts:165`) and V2 (`src/engines/capability-event-bus-v2.ts:46`).

**Output schema:**

```
| V1 type (legacy.<type> on V2) | V2 kind (canonical) | direction | handler count today | dropped? |
```

**Algorithm:**

1. Parse the V1 union (every `type: '...'` in `CapabilityEvent`).
2. Parse the V2 envelope (every `kind` ever passed to `publish` in the codebase).
3. Map each V1 type to a V2 kind (e.g. V1 `provider:seeded` → V2 `legacy.provider.seeded`).
4. For every V1 type, count the handlers in the codebase (rg for `eventBus.on(` and `on(` calls).
5. Mark handlers that won't be called by V2 as **dropped** (a real migration hazard).

**Run:** `bun run .runtime/probe-bus.ts`. Output: `evidence/event-bus-diff.md`.

## `probe-contracts.ts` — the contract consumer map

This probe produces `evidence/contract-consumer-map.md`.

**Output schema:**

```
| contract (C-XX) | symbol | file:line | imported by | pinned by test |
```

**Algorithm:**

1. For every kernel contract C-01..C-32, find all importers via AST (not regex).
2. List the symbol used (`IPluginManager.install`, `IEventBus.publish`, etc.).
3. For each importer, assert there is a test in `tests/unit/kernel/` or `tests/integration/kernel/` that exercises the call.

**Run:** `bun run .runtime/probe-contracts.ts`. Output: `evidence/contract-consumer-map.md`.

## `probe-context-reach.ts` — the IPluginContext reach audit

This probe produces `evidence/plugin-iplugin-context-reach.md`. **It is the proof that Constitution Rule C holds.**

**Output schema:**

```
| BootstrapContext field | first-party file that reads it | corresponding IPluginContext capability | gap? |
```

**Algorithm:**

1. For every field on `BootstrapContext` (src/server/bootstrap/context.ts:37-110), find every reader via AST.
2. For each reader, identify what the reader is doing (publish, store, etc.).
3. Map the action to an `IPluginContext` capability:
   - `eventBus.publish` → `ctx.events.publish`
   - `db.prisma...` → `ctx.storage.scoped(pluginId).get/put/delete`
   - `providers...` → `ctx.capabilities.invoke('kernel.providers.list', ...)`
   - `kernelRegistry.registerEngine` → `kernel:engines:register` (K0 internal; not plugin-facing)
   - etc.
4. Mark rows where no corresponding capability exists as `gap: <reason>`.

**Run:** `bun run .runtime/probe-context-reach.ts`. Output: `evidence/plugin-iplugin-context-reach.md`.

**CI gate:** every `gap` row must have a resolution in P0-1. If a gap is unaddressed, the kernel boot fails.

## `probe-prisma.ts` — the data-model split

This probe produces `evidence/cap-store-table-audit.md`.

**Output schema:**

```
| model | today location | target location | should-be | K0/K1? |
```

**Algorithm:**

1. For every `model` block in `prisma/system/schema.prisma` and `prisma/user/schema.prisma`:
   - Match against the kernel-model allowlist (Node, NodeVersion, NodeAlias, NodeEdge, SchemaMeta, PluginRegistry, SandboxAudit, EventRecord, KernelSpan, KernelProvenance, KernelTopology, KernelEvent, ConfigEntry, ConfigAudit, HpeSession, User, Session).
   - In the allowlist → K0 → target `prisma/kernel/`.
   - Not in the allowlist → K1 → target `plugins/core/<owning-plugin>/prisma/`.

**Run:** `bun run .runtime/probe-prisma.ts`. Output: `evidence/cap-store-table-audit.md`.

## `probe-events.ts` — the event surface

This probe produces `evidence/dom-and-event-surface.md`.

**Output schema:**

```
| event kind | direction | source | today | should-be | namespace check |
```

**Algorithm:**

1. For every `eventBus.emit(` / `eventBus.publish(` call in the codebase, capture the kind.
2. For every `eventBus.on(` / `onAny(` call, capture the kinds subscribed.
3. Classify: kernel (must start with `kernel.`), plugin (must start with `plugin.<id>.`), or legacy (V1 mirror; prefix `legacy.`).
4. Flag any kernel event that does NOT start with `kernel.` and any plugin event that does NOT start with `plugin.<id>.`.

**Run:** `bun run .runtime/probe-events.ts`. Output: `evidence/dom-and-event-surface.md`.

## `probe-frontend.ts` — the frontend component inventory

This probe produces `evidence/frontend-component-inventory.md`.

**Output schema:**

```
| component file | exports | today | should-be | slot? |
```

**Algorithm:**

1. For every `.tsx` file in `frontend/src/components/canvas/`, `frontend/src/ui/`, `frontend/src/sdk/`, `frontend/src/shared/`:
   - List the default export (the component).
   - Classify by purpose (canvas, card, panel, control, primitive, hook, sdk).
   - Map to the K0/K1 split (K0 only: `SandboxedNode` host + the SDK surface in `frontend/src/sdk/`).

**Run:** `bun run .runtime/probe-frontend.ts`. Output: `evidence/frontend-component-inventory.md`.

## `probe-harness.ts` — the harness command split

This probe produces `evidence/harness-command-inventory.md`.

**Output schema:**

```
| command id | source file | K0 shape or K1 content | plugin:canon-harness path |
```

**Algorithm:**

1. For every command registered in `seeds/harness/commands/*.ts`:
   - Capture the command id.
   - Mark as K1 (every seed is first-party).
   - Map to the target `plugins/core/canon-harness/commands/<id>.ts`.
2. The kernel shape (`harness-command-registry.ts` class) is K0 → `src/kernel/harness/registry.ts`.

**Run:** `bun run .runtime/probe-harness.ts`. Output: `evidence/harness-command-inventory.md`.

## The full I-2 deliverable list

After the 8 probes run, `docs/kernel-plugins/evidence/` contains:

```
evidence/
├── per-file-truth-map.md       # every source file, K0/K1/K2/K3, evidence:file:line
├── event-bus-diff.md            # V1 → V2 mapping, dropped handlers
├── contract-consumer-map.md     # C-01..C-32 → consumer files → test that pins it
├── plugin-iplugin-context-reach.md  # every BootstrapContext field → IPluginContext capability
├── cap-store-table-audit.md     # every Prisma model → K0 or K1
├── dom-and-event-surface.md     # every event kind → direction → source → namespace check
├── frontend-component-inventory.md  # every component → K0 SDK or K1 first-party UI
└── harness-command-inventory.md # every harness command → plugin:canon-harness/commands/<id>.ts
```

These 8 docs are the input to P0-1. The `probe-truth-map.ts` output is the source of truth for `PLUGIN-TRUST-MODEL.md` v2 (per-file). The `probe-context-reach.ts` output is the proof that Constitution Rule C holds. The `probe-bus.ts` output is the proof that the V1→V2 bridge doesn't drop events. The others are the proof that the migration is complete.

## The I-2 acceptance gate

The I-2 deep probe is complete when:

1. All 8 probe scripts run green (no surprises, no unclassified files).
2. All 8 evidence docs are committed.
3. `PLUGIN-TRUST-MODEL.md` is updated to reference the per-file truth map (the table becomes a stub; the per-file data is in the evidence doc).
4. The migration plan (`BOUNDARY-MIGRATION-PLAN.md`) §6 is updated with the actual per-file numbers.
5. The `inventory/REASSESSMENT.md` is updated to mark Gap-2 (per-file truth map) as resolved.

**The I-2 probe is the bridge between design and implementation.** Without it, P0-1 is "let's see what happens." With it, P0-1 is "the file at `src/ai/plugins/plugin-manager-impl.ts:35-50` is replaced by `src/kernel/plugin-kernel/host.ts:install()`; the test is `tests/unit/kernel/plugin-host.test.ts`; the migration order is X."

## Time / cost

- 8 probe scripts: 1 day (each is small; ~50-100 lines).
- 8 evidence docs (the first run): 1 day.
- Gap-resolution: 1-2 days (some probes will find "unknown" files; resolve those).
- Documentation update: 1 day.
- Total: **1 sprint (4-6 weeks)** including review.

After the I-2 probe, every per-file tier assignment is evidence-backed, every contract has a consumer map, and the migration plan is no longer a doc — it is a checked-in artifact.

---

> **Addendum 2026-08-29 — Upgraded execution (ADR 008):** the 8 probes are **evidence, not execution**. They emit `evidence/*.md` via ``bun run .runtime/probe-*.ts`` and exit 1 on surprises. The per-PR migration (P0-1.w, P0-3) is then **LLM-driven per PR**: the agent reads the source, enumerates imports, classifies each as **K0 (universal)** vs **K1 (VIVIM-specific)** against `PLUGIN-TRUST-MODEL.md` and `KERNEL-CONTRACTS.md` C-02, decides **MOVE vs SPLIT vs KEEP** on the file's real content (the kidx target is a proposal), and proves it with the 3-gate per-PR check (kernel-l0-isolation, boot-without-l0, contractVersion) before `complete` → `advance`. See `adr/008-llm-driven-migration.md`.
