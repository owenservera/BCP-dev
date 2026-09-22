# L3 — Engine Subfolders (274 files, 33 dirs; complete list in `generated/gen-engines-sub.md`)

> `src/engines/*.ts` (186 flat, see `engines.md`) is the stable kernel surface.
> This file covers the 274 nested files: `walk(src/engines) 460 − flat 186 = 274`.
> Every filename below appears with header+exports in `generated/gen-engines-sub.md`;
> here is the semantic map (dir → role → key files → contracts).

## Reader rule
Flat file = capability/family entry point. Subfolder = implementation detail of one family. Never import a subfolder file directly from another family — go through the flat entry.

## The 33 dirs (measured `Get-ChildItem` top-level + recurse where nested)

| Dir | Files (top/recurse) | Role | Entry + contracts |
|-----|--------------------|------|--------------------|
| `nlcl/` | 30 top / **60 recurse** (`categories/`, `executors/`, `graph/`) | Natural-language command language: parse → graph → executors per category | `nlcl-engine.ts` + `NlclGraphNode/Edge` rows; routes `/api/nlcl/*`, `POST /api/interpret`, REPL, `nl_command` |
| `stealth/` | 19 | Evasion modules + launch profiles | `StealthLaunch/ModuleProfile/Policy` rows, `stealth-store.ts` |
| `command-language/` | 18 | CLI/NL grammar: prefixes, args, combos, NLP match | `UnknownPrefix/Command`, `NlpMatch/LowConfidence/ComboAmbiguousError` |
| `harness/` | 17 | 8-phase provider test/repair runtime + checkpoints | `HarnessCheckpoint/Command`, `RepairSession`, `harness-repair-store.ts` |
| `code-audit/` | 11 | Repo self-audit checks (arch/correctness/deps/drift/perf/quality/security/testing) | `devops/audit-code` mirror |
| `onboarding/` | 11 | Provider onboarding pipeline (discover→promote) | `ProviderOnboardingSession`, `onboarding/*` 7 contracts |
| `kernel/` | 10 | K0 context + topology + provenance + spans | `kernel-context.ts`, `KernelSpan/Provenance/Topology/Event` |
| `capability-bootstrap/` | 8 | Prospect seeding (`capability-bootstrap*.ts` + generated) | `CapabilityTaxonomy` rows |
| `memory/` | 8 | Episodic/semantic/procedural + fabric + warden quota | `memory-*-store.ts`, `MemoryEmbedding` |
| `browser-automation/` | 7 | Scripted flows over governor (registry-driven) | `registry.ts` + `BrowserCapabilityRegistry` |
| `chrome/` | 7 | Governor pool impls | `governor-store.ts` |
| `tunnel-client/` | 7 | Tunnel relay client | `/api/tunnel/*` |
| `opencode/` | 6 | OpenCode client/ingest/supervisor (managed-vs-external classifier) | `/api/opencode/*`, `OpenCodeServe/PermissionDeniedError` |
| `providers/` | 6 | Provider adapters + protocol fingerprints | `ProviderDefinition`, `ProtocolFingerprint` |
| `parsers/` | 6 | Parser framework (DB logic executed here, never stored here) | `ProviderParser`, `ParserExecutionLog` |
| `actor/` | 5 | Agent actor runtime | `AgentLoopRun/Step`, `agent-loop-store.ts` |
| `reliability/` | 5 | Retry/sla/guards composition | `retry-engine.ts`, `idempotency-guard.ts` |
| `resource/` | 5 | Budgets/quotas (cortex-budget, token budgets) | `TokenBudgetRow`, `BudgetExceededError` |
| `p2p-node/` | 5 | P2P peer/transfer state | `SyncPeer`, transfer rows |
| `workflow-templates/` | 5 | Canned DAGs compiled to `WorkflowDefinition` | `Workflow*` models |
| `reprogrammability/` | 4 | Surface regen targets | `config-universal-surface.ts` |
| `scheduler/` | 4 | Cron/schedule runners | `AutomationSchedule/Run` |
| `tunnel-orchestrator/` | 4 | Tunnel orchestration over client | same |
| `automation/` | 3 | Automation orchestrator impls | `automation-store.ts`, `/api/automate/*` |
| `events/` | 3 | Bus v2 + recording bridge | `KernelEvent`, `EventRecord` |
| `pool/` | 3 | Worker/slave pools | `fleet-limiter.ts` |
| `local-agent/` | 2 | On-device agent loop | `local-agent-store.ts` |
| `runtime/` | 2 | Runtime supervisors | `runtime/*` overlays |
| `adapters/` | 1 | Single legacy adapter shim | — |
| `generative/` | 1 | Generative task store impl | `InMemoryGenerativeTaskStore`, `/api/generative/*` |
| `local-server/` | 1 | Embedded static server | `VIVIM_LOCAL_SERVER_*` env |
| `observability/` | 1 | Engine-level taps | `observation-tap.ts` |

## How to use with generated index
1. Find the file in `generated/gen-engines-sub.md` (exact path + header + export count).
2. Read the flat entry in `engines.md` for the family contract.
3. Follow the contract → impl → row chain in `storage-parity.md` / `data-dictionary.md`.
