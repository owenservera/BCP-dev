# Vivim Migration — The Closed-Loop Agentic System (2026-08-29)

> **The product is the kernel-boundary migration. The system that builds it is itself an agentic system. This document is its single-source-of-truth manual.** Read this once; you understand the whole system.

---

## §0. The 3-sentence summary

The migration is **2,398 files / 2,605.6h / 53 phases / 8 lock-checks** and is **locked**. The agentic system that runs it is a closed loop: a single `orchestrator.ts` reads the locked plan, dispatches one PR at a time to a per-skill subagent, runs the safety-net gate (24 arch tests + 12 certifier attack vectors + fuzzer with 0 false negatives), and refuses to advance until the gate is clean. **The plan is the spec. The orchestrator is the runtime. The safety net is the contract.**

---

## §1. The 4 inputs (what the system reads)

| Input | Where | What |
|---|---|---|
| **Indexer** | `.runtime/kidx.ts` | walks the repo, emits 2,398 per-file YAMLs + 10 intelligence overlays in 82s |
| **Decision function** | `.runtime/kidx/decide.ts` | reads the indexer output, returns 7 verdicts per file (KEEP/MIGRATE/MERGE/SPLIT/HARVEST/RESTRUCTURE/REMOVE) with cost, risk, target, sequence |
| **Plan documents** | `docs/end-state/{DESIGN,PLAN}.md` + `docs/kernel-plugins/{migration,evidence,inventory}/*` | the constraints: 17 K0 subsystems, 44 contracts, 30 invariants, 6 phases |
| **Safety net** | `tests/arch/kernel-isolation.test.ts` (8 tests) + `tests/fuzz/manifest-fuzzer.test.ts` (10,000-mutation fuzzer) | the contract: no PR lands unless the gate passes |

---

## §2. The 5 outputs (what the system produces)

| Output | Where | What |
|---|---|---|
| **State** | `.runtime/migration/state/state.json` | 53 phase statuses, next PR, safety-net counters, ledger history |
| **Decisions** | `.runtime/kidx/decisions/{by-file,by-verdict,by-sequence,lock-check,manifest}.yaml` | 2,398 per-file verdicts; 7 verdict buckets; 2,398-step migration order; 8 lock-checks |
| **Per-PR prompts** | `.runtime/migration/prompts/<phase>-step-<n>.md` | the task brief for each subagent, generated on demand |
| **Dashboard** | `.runtime/migration/dashboard/index.html` | the single-page status: progress, next PR, safety net, per-phase status |
| **Ledger** | `.runtime/migration/ledger/ledger.jsonl` | append-only log of every orchestrator event (status, gate, next, complete, advance) |

---

## §3. The 11 skills (what subagents do)

Each skill is a SKILL.md in `.opencode/skill/migration-*/`. The orchestrator picks the right skill for each phase.

| Skill | Phase | What it does |
|---|---|---|
| `migration-certifier` | P0-1.x | write the 12-attack-vector certifier at `src/plugin-kernel/plugin-manager/certifier.ts` |
| `migration-fuzzer` | P0-1 | write the 10,000-mutation fuzzer at `tests/fuzz/manifest-fuzzer.test.ts` |
| `migration-k0-mover` | P0-1, P0-2, P0-3, P0-4, P0-5, P0-6, P1 | move a file to `src/plugin-kernel/`, update imports, run the gate |
| `migration-plugin-mover` | P3-01..P3-39, P4, P5 | move a file to `plugins/core/<plugin-id>/`, write the manifest, run the gate |
| `migration-plugin-splitter` | P4 | split a current file into multiple end-state files (the F-24 plugin-chat case) |
| `migration-schema-splitter` | P2-2 | split `prisma/schema.prisma` into 16 K0 models + 184 K1 models |
| `migration-mlayer-builder` | P0-1.y | build the 7 M-layer contracts (C-33..C-39) at `src/plugin-kernel/catalog/` |
| `migration-l0-substrate-builder` | P0-1.w | move 60 NLCL files to `src/intel/nlcl/` + build 5 K0(L0) contracts (C-40..C-44) |
| `migration-iplugincontext` | P0-5 | replace the 60+ field BootstrapContext with a closed IPluginContext (T-19 fix) |
| `migration-eventbus` | P0-1 | build the IEventBus (C-03) with auto-recording (T-22 fix) at `src/plugin-kernel/event-bus/` |
| `migration-bus-record-bridge` | P0-1 | migrate the 57 T-22 files to use the auto-recording bus |

---

## §4. The 5 orchestrator commands (how to drive it)

```bash
# 1. Status — show the migration state
bun run .runtime/migration/orchestrator.ts status
#   Plan locked: true (8/8 checks passing)
#   Phases: 53 total — 0 completed, 0 in-progress, 53 queued
#   Next PR: P0-1 step 1 — MIGRATE src/ai/plugins/plugin-manager-impl.ts → src/plugin-kernel/plugin-manager/manager.ts (4h, high risk)

# 2. Gate — run the safety net
bun run .runtime/migration/orchestrator.ts gate
#   Checks: 24 arch tests, 12 certifier vectors, fuzzer false-negatives, 8 lock-checks
#   GATE: PASS — safety net is clean, next PR can be dispatched

# 3. Next — dispatch the next PR
bun run .runtime/migration/orchestrator.ts next
#   Reads the plan, finds the next un-completed step, generates the prompt at .runtime/migration/prompts/<phase>-step-<n>.md
#   Subagent (or human) reads the prompt, does the work, runs the gate

# 4. Complete — record a completed PR
bun run .runtime/migration/orchestrator.ts complete
#   Marks the current PR as completed in state.json

# 5. Advance — advance to the next PR in the sequence
bun run .runtime/migration/orchestrator.ts advance
#   Reads by-sequence.yaml, finds the next step, updates state.json

# Plus: dashboard (generates HTML), reset (clears state), help
```

The `migrate`, `gate`, `dashboard` opencode commands are also registered in `opencode.json` (Section §6).

---

## §5. The 8 lock-checks (the validation)

From `.runtime/kidx/decisions/lock-check.yaml`. All 8 pass:

| # | Check | Status | Detail |
|---|---|---|---|
| C-01 | All 17 K0 subsystems have a home | ✅ | IPluginManager + 16 others |
| C-02 | All 40 K1 plugins have a home | ✅ | 646 files move to plugins/core/ |
| C-03 | No file is orphaned | ✅ | 0 unmatched files |
| C-04 | No file is double-claimed | ✅ | First-match-wins |
| C-05 | Schema split is complete | ✅ | 16 K0 + 184 K1 |
| C-06 | T-19 + T-22 violations are addressed | ✅ | 7 bootstrap files + 10 bus files targeted |
| C-07 | Dependency graph is acyclic | ✅ | Topo-sort succeeded |
| C-08 | Total cost within budget | ✅ | 2,605.6h ≤ 2,700h |

---

## §6. The 3 opencode commands (how a user invokes it)

In `opencode.json`:

```json
"migrate": {
  "description": "Dispatch the next kernel-boundary migration PR",
  "agent": "build",
  "template": "Run the closed-loop migration orchestrator: status → gate → next → complete → advance. Never pause to ask; run until the safety net gate fails or all 2,398 decisions are complete."
},
"gate": {
  "description": "Run the safety net gate before any PR lands",
  "agent": "build",
  "template": "Run the migration safety net gate. If it fails, fix the failing test/vector/fuzzer before any PR can land."
},
"dashboard": {
  "description": "Generate the migration dashboard",
  "agent": "build",
  "template": "Generate the migration dashboard. The dashboard is at .runtime/migration/dashboard/index.html."
}
```

---

## §7. The 5 zones (the destination, locked)

```
vivim-final/                                    (the monorepo)
├── src/plugin-kernel/                          ZONE 1: KERNEL (17 K0 + 7 M + 5 L0 subsystems)
├── src/intel/                                  ZONE 2: K0(L0) INTELLIGENCE SUBSTRATE
├── plugins/core/                               ZONE 3: K1 FIRST-PARTY PLUGINS (40 plugins)
├── frontend/plugins/core/                      ZONE 4: K3 FRONTEND PLUGINS (5 plugins)
└── src-tauri/                                  ZONE 5: K4 DESKTOP SHELL (Tauri V2)
```

`src/plugin-kernel/`, `src/intel/`, and `plugins/core/` are the 3 new zones. The dirs exist; the files don't. The 1,500+ PRs fill them in.

---

## §8. The 6 phases (the route)

| Phase | What | Sub-phases | Duration | Budget |
|---|---|---|---|---|
| **P0-1** | Security boundary: real PluginManager + certifier + IPluginContext | K-001..K-031 (the 17 K0 subsystems) | 4-6 weeks | ~600h |
| **P0-1.x** | 8 introspection capabilities (C-25..C-32) | kernel.plugins.certify, kernel.bus.trace, etc. | 1 sprint | ~100h |
| **P0-1.y** | M-layer (C-33..C-39) | 7 self-descriptive contracts | 1 sprint | ~120h |
| **P0-1.w** | K0(L0) substrate (C-40..C-44) | 60 NLCL files + 3 substrate files | 2 sprints | ~250h |
| **P0-2** | Registry + adapter + types | K-008..K-013 + the 23KB core/types.ts split | 2-3 weeks | ~150h |
| **P0-3** | Runtime + policy + router | K0-7..K0-9 | 1-2 weeks | ~100h |
| **P0-4** | Bus fixes | T-22 event-record-bridge (57 files) | 1 week | ~50h |
| **P0-5** | IPluginContext split | T-19 BootstrapContext fix | 1-2 weeks | ~100h |
| **P0-6** | Kernel-only boot test | asserts kernel boots with no first-party plugin | 1 week | ~50h |
| **P1** | Contract versioned + observability merge | IPluginHost glue + observability merge | 2-3 weeks | ~200h |
| **P2** | SchemaRegistry + NodeType widening | K-018 | 1-2 weeks | ~50h |
| **P2-2** | Prisma schema split | 16 K0 models + 184 K1 models | 1 sprint | ~100h |
| **P3-01..P3-39** | 40 first-party plugins | one plugin per PR | 16-24 weeks | ~1,100h |
| **P4** | The cake: plugin-builder | 6 thin plugins (P0..P5 of the cake) | 3-4 weeks | ~150h |
| **P5** | Polish: docs, demos, marketplace | | 2-4 weeks | ~50h |

**Total: 7-11 months, ~2,600h.**

---

## §9. The 30 invariants (the test surface)

13 of 30 invariants are now statically enforceable by the indexer + the orchestrator's gate. The other 17 are runtime-only (P0-6 kernel-only boot, INV-3 capability isolation fuzzer, INV-28-30 K0(L0) degrade, etc.). The orchestrator's gate covers:

- **T-01..T-08:** arch tests (layer-dependency, kernel-boot, kernel-isolation, certifier-12-vectors, fuzzer-no-false-negatives, IPluginContext-closed, BootstrapContext-reduction, script-url-origin)
- **T-09..T-16:** M-layer + contract surface (bus-namespace, storage-scoped, capability-invocation-policy, adapter-version, schema-caller, provider-state-machine, sandbox-csp, ipluginhost-single-path)
- **T-17..T-24:** M-layer integrity (co-generated, complete, honest, queryable, IPluginContext, BootstrapContext-reduction, harness-recipe-prefix, kernel-isolation)
- **T-25..T-28:** L0 substrate (NLCL local, embedding degrade, budget enforced, hot-swap)

---

## §10. The single sentence

> **The system is closed-loop: an orchestrator reads a locked plan, dispatches one PR at a time to a per-skill subagent, runs a safety-net gate (24 arch tests + 12 certifier attack vectors + 10,000-mutation fuzzer with 0 false negatives), and refuses to advance until the gate is clean — the plan is the spec, the orchestrator is the runtime, the safety net is the contract, and the 2,398 files become the kernel.**

---

## §11. The next 3 commands (what to do right now)

```bash
# 1. See the state
bun run .runtime/migration/orchestrator.ts status

# 2. See the dashboard
bun run .runtime/migration/dashboard/index.html

# 3. Start the first PR
bun run .runtime/migration/orchestrator.ts next
# Reads .runtime/migration/prompts/P0-1-step-1.md
# Subagent (or human) does the work: MIGRATE src/ai/plugins/plugin-manager-impl.ts → src/plugin-kernel/plugin-manager/manager.ts
# This is the 12-attack-vector certifier; the foundation of the kernel
```
