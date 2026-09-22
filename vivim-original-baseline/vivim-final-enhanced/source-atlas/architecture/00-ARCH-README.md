# Architecture Intelligence — README

> Design context for the entire repo, derived from code — not from prior docs.
> Sources: `src/arch/boundary-rules.ts` (10 layers), `src/arch/boundary-scanner.ts`,
> `tests/arch/*.test.ts` (10 suites), `src/plugin-kernel/bootstrap/orchestrator.ts`
> (5-phase boot order), `src/server/bootstrap/context.ts` (60+ field context),
> `src/server/service-container.ts` (DI + lifecycle), `src/executor/*` (19 files),
> `frontend/src/ui/slots.ts` (capability-global slots), import measurements
> (65 engines→contracts, 116 server→engines, 0 engines→impl violations).

## Files in this folder

| File | Design question |
|------|-----------------|
| `dependency-graph.md` | What may import what? The 10-layer lattice + measured coupling. |
| `boundaries-and-invariants.md` | Which rules are load-bearing? Canon laws + how each is enforced in code/tests. |
| `boot-and-runtime.md` | In what order does the system come alive? 5 boot phases + DI lifecycle + request path. |
| `data-architecture.md` | Why two databases? System vs user split, ID derivations as join keys, JSON-column strategy. |
| `frontend-architecture.md` | How does UI stay hot-swappable? Slots + registry + BE/FE parity. |
| `risks-and-evolution.md` | Where is the architecture going? Kernel migration gap (6/17 subsystems), context leak, hotspots. |
| `capability-lifecycle.md` | NEW: How does one capability execute end-to-end? 9-step trace + recovery + promotion. |
| `security-and-auth.md` | NEW: Who can call what? Bearer/CORS/trace + consent/sandbox/kernel gates + fleet isolation. |
| `configuration.md` | How is it configured? 13 tunables + env vars + ports/paths + scripts that matter. |
| `testing-and-quality.md` | How is it verified? 499 test files, 9 arch tests, gates, per-change tree. |
| `operations.md` | How is it run? Deploy/migrate/seed/backup/observe/shutdown. |
| `error-catalog.md` | What failed? 40+ CapStoreError classes + HTTP mapping + recovery. |
| `coverage.md` | What is covered and what locks it? File presence per area + the check. |
| `shaping-intel.md` | Neutral relational facts for the shaping team: 6 generated matrices, no prescriptions. |
| `mental-models.md` | Plain-English models + zoomable mermaid (system, boot, request, capability life). |
| `data-flows.md` | Data flows + 5 transformations (row → domain → wire → pixel) with mermaid. |
| `algorithms.md` | Named procedures from code: resolution, promotion, heal, recovery, order, dedupe, snapshot, guards. |
| `reprogrammability.md` | How the app rewrites itself: contract v1, 7 kinds, 8 ops, provenance, DSL, regen loop. |
| `core-model.md` | Core vs core+X: db-only → fully-booted ladder + every +X switch and without-it state. |

## One-page mental model

```
DESIGN INTENT (why it looks this way)
  Local-first AI conversation platform where every browser action is a
  versioned capability (taxonomy→binding→program), executed only through
  a single Chrome governor, persisted through typed store contracts,
  and projected into a hot-swappable UI. The kernel/plugin split
  (K0 vs K1) is mid-migration: the boot pipeline already lives in
  src/plugin-kernel/bootstrap/, but 11/17 K0 subsystems are still stubs.

DEPENDENCY DIRECTION (never upward)
  shared → src-foundation → storage-contracts → storage-impl/infra
    → engines → executor → server/cli → (frontend only ← shared)

RUNTIME SHAPE (what actually runs)
  ServiceContainer (fail-fast DI, LIFO teardown)
    └─ 5 boot phases: seeds → stores → knowledge → capabilities → lifecycle
         └─ per-request: auth-gate → validate(zod) → resolution → governor(CDP)
              → parser(DB logic) → memory/knowledge → telemetry/alerts
```

Read `dependency-graph.md` first, then the file matching your task.
All diagrams are ASCII so they render in any terminal.
