# Testing & Quality — How to Verify a Change (from `tests/` + `scripts/` + `devops/`)

> Measured 2026-09-18: `tests/` holds **498** TS files — `unit` 378 · `integration` 59 ·
> `e2e` 24 · `helpers` 17 · `arch` 11 · `fixtures` 4 · `chaos/load/stress/docs/fuzz` 1 each.
> Runner: `bun test` (`bun.test.config.ts`); ignore pattern `docs/dev-code-impl/**` on every
> `test:*` script. Linter: Biome (`biome.json`, `lefthook.yml` hooks).

## 1. Suite map (what each proves)

| Suite | Proves | Pattern (from code) |
|-------|--------|---------------------|
| `unit/` (378) | One function in isolation, mocked stores | per-engine specs; mem-doubles (`*-mem.ts`) swapped for Prisma impls |
| `integration/` (59) | Engine × mocked store wiring | engine + contract double, no real DB |
| `e2e/` (24) | Full stack (server + governor + parser + memory) | live boot via `createServerWithEngines`, real CDP or simulator |
| `arch/` (11: 9 tests + runner + …) | Kernel boundary never rots | `api-contract`, `arch-invariants`, `boundary-cdp`, `certifier`, `code-quality`, `dual-db-boundary`, `kernel-isolation` (T-01…T-28), `layer-dependency`, `store-contract-parity`, `runner.ts` |
| `fuzz/` (1) | 12 attack vectors rejected, 10k mutated manifests rejected | manifest fuzzer (certifier pair) |
| `chaos/load/stress` (1 each) | Fleet/circuit/profile under pressure | kill-restart, concurrent-send, large-response scenarios (see `devops/runtime-test/stress/scenario-*.ts` 10 scenarios) |
| `fixtures/helpers/docs` | Shared rows + harnesses + doc tests | `fixtures/` 4 canonical row sets |

Canonical gate (observed in `tests/arch` + atlas convention): `bun test tests/arch tests/fuzz`. Release gates add `providers:smoke` + `verify-cross-surface --runtime`.

## 2. The 9 arch tests (what each fails on)

| Test | Fails when | Fix lane |
|------|-----------|----------|
| `api-contract.test.ts` | capability reachable on one surface but not others (parity drift) | register taxonomy→binding→program→slot→parity, same PR |
| `arch-invariants.test.ts` | bus namespace un-namespaced, storage wildcard, barrel drift | rename to `kernel.*`/`plugin.<id>.*`, scope storage, re-export |
| `boundary-cdp.test.ts` | non-governor imports `BunCdpClient`/CDP transport | route browser work through governor |
| `certifier.test.ts` | 12 attack vectors (vm escape, safe-eval, wildcard storage, un-namespaced bus, …) not rejected | QuickJS-only, scoped storage, namespaced bus |
| `code-quality.test.ts` | barrel exports drift, dead exports, deprecated events linger | `cleanup/unused-exports.ts`, `deprecated-events.ts` |
| `dual-db-boundary.test.ts` | Prisma `@relation` crosses system↔user DBs | replace with string-key join (`slave:/cap:/bind:`) |
| `kernel-isolation.test.ts` (T-01…T-28) | K0 imports K1 (`engines/`, `plugins/core/`, `ai/plugins/manager`); 17-subsystem stubs missing (today 6/17 → T-02 red) | land stubs in order `plugin-context → registry → runtime → policy → …` |
| `layer-dependency.test.ts` | `engines → impl`, `frontend → backend(non-shared)`, upward import | import contracts (not impls), `shared/` only from frontend |
| `store-contract-parity.test.ts` | Prisma impl and mem-double diverge | update both sides same PR |

## 3. Commands (fastest → slowest)

```bash
bun test tests/unit                               # 378 files, seconds
bun run test:fast                                 # unit + arch (pre-push default)
bun test tests/arch tests/fuzz                    # canonical boundary gate
bun run providers:smoke                           # golden matrix over PROVIDER_MANIFESTS (zero FS reads)
bun run scripts/verify-cross-surface.ts --offline # static parity (fast)
bun run scripts/verify-cross-surface.ts --live|--runtime|--runtime-registry  # live parity (slow, blocks PR)
bun test tests/integration                        # 59 files
bun test tests/e2e                                # 24 files (needs Chrome/fleet or simulator)
bun test --coverage tests/unit/                   # 80%+ on engines (repo convention)
bunx tsc --noEmit                                 # full typecheck (run before PR, not mid-task)
biome check src/ tests/ seeds/                    # lint (lefthook runs on commit)
```

## 4. DevOps quality machinery (`devops/` — repo operating on itself)

- **Gates**: `devops/gate.ts` + `confidence-gate.ts` + `unified-gate.ts` + `.gate-baseline.json` (quality closure loops; `bun run devops gate|select|mark|run|report`).
- **Audits**: `audit-arch/` (graph/cycles/boundaries/coupling/cohesion/layering/commands passes) + `audit-code/checks/{architecture,correctness,dependencies,drift,performance,quality,security,testing}.ts` + `deep-scan/passes/{async-correctness,cross-surface,hot-path}.ts` (`audit-code|audit-arch|invariants|deep-scan|sota`).
- **Truth/strategy**: `truth/{scanner,interface-comparator,design-comparator,gap-generator}` (spec↔code drift), `roadmap/*`, `features.ts`, `goals*.ts`, `decision*.ts` (`truth|goals|decision|features|roadmap|research`).
- **Runtime loop**: `runtime-test/` (preflight/port/process-guard/ensure-browser/discover-cdp/discover-protocol/test-cap/test-harness/iterate/engage/stress 10 scenarios/claude+chatgpt+gemini multiturn/cross-provider/concurrent/large-response/chrome-kill/opencode-oneshot+multi-model+agentic-coding) + `desktop/` (build/spawn/verify/state) + `llm-testing/adapters/{api,cli,mcp,provider,surface,ui,workflow}` (LLM-as-human cross-surface probes).
- **Toolkit**: `toolkit/{regen,surface-parity}.ts` (surface regeneration + parity; `devops:toolkit`), `code-index.ts` (FTS search), `seed-memory.ts`, `invariants.ts` (B13 boot-graph canon), `parser-test-harness.ts`, `selector-tester.ts`.

## 5. What to run for your change (decision tree)

```
touched src/schema/* or server/validate.ts → test:fast + e2e smoke
touched contracts/* or impl/*              → store-contract-parity + integration + unit
touched engines/* (no CDP)                 → unit + layer-dependency
touched chrome-governor/executor/fleet     → e2e + stress scenario-07 + boundary-cdp
touched stream-parser/parsers/seeds        → ParserTestResult + providers:smoke + test-parser scripts
touched capability taxonomy/binding        → api-contract + verify-cross-surface --runtime
touched slots/registry/frontend/api        → verify-cross-surface --offline→live + storage-provider.parity
touched boot/bootstrap/container           → arch-invariants (B13) + full boot (serve + readyz)
touched plugin-kernel/                     → kernel-isolation + certifier + fuzz
```
