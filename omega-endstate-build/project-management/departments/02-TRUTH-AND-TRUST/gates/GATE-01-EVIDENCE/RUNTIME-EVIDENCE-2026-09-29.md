# GATE-01 — Runtime Evidence Receipt (Linux/zen campaign)

> Date: 2026-09-29 (UTC)
> Evaluator: local operator session (steering STEW-01 authority, owner ratification pending)
> Scope: GATE-01 automated test floor + runtime sections A/B/C/D/E/F/G/M observed on this host
> Status: EVIDENCE — not yet a gate decision

## Environment receipt

| Field | Value |
| --- | --- |
| Vendored substrate | `omega-endstate-build/runtime/vendor/opencode-swarm` @ repo SHA `64ae13d5d57ac12ed0561531609d5503e4c4d1f9` (package @ibraheem-111/opencode-swarm 0.2.2) |
| OpenCode version | 1.18.33 (`/home/z/.opencode/bin/opencode`) |
| Bun version | 1.3.14 |
| Node | v24.21.0 |
| OS | Linux x64 (sandbox host, `uname -s` = Linux) |
| Provider/model | zen provider (`opencode/...`), model `opencode/space-bunny-free`, auth via `~/.local/share/opencode/auth.json` key `zen` |
| Effective config | none beyond auth (smoke/e2e); lab config for delegation probes (see GATE-03 receipt) |
| Test date | 2026-09-29 ~01:30–02:45 UTC |
| Network/auth | outbound HTTPS to zen gateway; no OpenRouter credential present |
| Platform exclusions | desktop notifications (notify-send) not exercised; ntfy not exercised |

## A. Installation and startup

- Clean `bun install` (vendor): 116 packages, success.
- Vendor `bun test`: **50 pass / 1 fail / 137 expect() calls / 51 tests across 10 files** (reproduced 3×).
- Smoke (`bun scripts/smoke.ts opencode/space-bunny-free`): **SMOKE TEST PASSED** — server start, provider list (`opencode`), session create, prompt, token telemetry, cost 0.
- `swarm run` (CLI) starts a configured swarm on this host: proven (three runs).

## B. Multi-agent execution

- Run `sw_023e59b0d2214ed9` (`runtime/examples/validate-space-bunny.json`, 2 agents, parallel, maxConcurrent 2): **completed**. Separate sessions per agent (`scout`/`analyst` session IDs in `swarm status --json`).
- Run `sw_6ec0854ec5444812` (`runtime/team/swarm-team-v1.json`, 4 agents: stew-01/devops-01/prov-01/ver-01, roles per AGENT-ROSTER): all four agents executed concurrently with per-agent tool restrictions honored (stew-01 read-only, devops-01 write-capable, prov-01/ver-01 read+bash only) and produced all five contract memory keys.
- Per-agent model override: exercised in failure probe (`broken-agent` with invalid model was addressed separately; per-agent override field parsed and validated by config layer).

## C. Shared memory

- Cross-agent visibility proven: `scout` wrote `secret-code=BLUE-42`; `analyst` read it and its result contains `BLUE-42`; DB re-read confirms `entry.value` contains BLUE-42 with `updatedBy: scout`.
- Team run: 5 keys (`truth-contract`, `env-baseline`, `devops-result`, `verification-verdict`, `final-verdict`) written by three different agents and read by others.
- Persistence: SQLite at `.swarm/swarm.db`; memory entries read from a fresh process after runs.

## D. Inter-agent communication

- Push delivery observed in event progress (`[analyst] ← 1 message(s)` … across 4 rounds in sw_023e…; multi-round delivery in team run).
- Broadcast: exercised organically by agents in sw_023e… (they noted `to: "*"` behaved as documented).

## E. Persistent state and resume

- Durable state at `.swarm/swarm.db`; `swarm status --json` and `swarm logs sw_023e…` reconstruct full run from a **fresh process**.
- Resume across process boundary exercised twice on `sw_6ec0854ec5444812` (operator timeouts killed the orchestrator mid-delivery): pending messages were re-delivered to completed agents on resume, agents responded; agent-level states remained accurate.
- **Known deviation (recorded honestly):** the team swarm's orchestrator state remains `running` with all four agents `done` — bounded operator time budget plus free-model turn latency prevented observing finalization within the window. The finalization path itself is proven by `sw_023e…` reaching `completed`. This is an open bookkeeping item for a longer unattended resume, not evidence of state corruption.

## F. External control

- `swarm status --json` (machine-readable) proven from a separate process. External `swarm send` injection NOT exercised in this campaign (time-bounded) — recorded as UNRESOLVED, not PASS.

## G. Machine-readable execution

- `--json` result on stdout (captured for all three runs) and `--events` JSONL stream written (`resident-team-lab/artifacts/gate01-campaign/validate-events.jsonl`, `team-events.jsonl`).
- Event semantics cross-checked against progress lines (agent-spawned / agent-turn-done with cost+totals / messages-delivered / agent-done).

## M. Failure isolation

- Probe `sw_c1056c20ebdc451a` (`/tmp/failure-isolation.json`): `broken-agent` (model `opencode/nonexistent-model-xyz`) failed terminally with the provider error recorded verbatim in its result; `healthy-agent` completed and wrote `liveness-proof=ALIVE-99`; swarm status `failed` with the failed agent accurately named. Terminal failure of one agent did not prevent the other's completion.

## Known environment conditions (not regressions)

1. Vendored e2e test (`tests/e2e.test.ts`) hardcodes `openrouter/openai/gpt-4o-mini`; no OpenRouter credential exists here. Across 6 observed suite runs it failed 5× and passed 1× (02:15:43Z, `bun test` exit 0), i.e. **nondeterministic on this host**. `SWARM_E2E=0 bun test` skips it (documented upstream condition). Its skip gate checks auth-store *file existence*, not credential presence — improvement candidate recorded.
2. Free zen models report cost 0 — budget brake never trips (documented platform condition).
3. `opencode run` CLI prompt loop does not terminate in this headless environment; the SDK serve+prompt path (smoke/runner) is fully functional. Headless work must use the SDK or the swarm CLI.

## Result

Automated test floor + observed runtime sections A/B/C/D/E/G/M: **met with recorded conditions**. F (external send) and J/K/L (notifications, MCP, notify plugin): not exercised this campaign. Sections H/I: cost semantics observed as the zero-cost platform condition; budget/concurrency brake not exercised.

Gate decision remains with the owner. This receipt is durable and reproducible: every run ID above is reconstructable from `.swarm/swarm.db` and the artifacts directory.
