# BCP-SPEED — Build Control Plane
> NOTE (cleanup 2026-09-23): this README describes the generic package shape
> (20 families / 140 capabilities as a working example). THIS instance tracks
> 49 capabilities (FAM-01..14) per `state/capabilities.yaml`, with live depths
> in `docs/CONTEXT-appendix.md` §1. The `EXP-2026-001` seed example in §"How
> agents run" is illustrative, not the current backlog. Mechanics below are current.

A lightweight, file-based devops/tracking system for parallel autonomous
agent development. No database required. Git-native. Visually native via
auto-generated HTML dashboards.

**Kept deliberately separate from Omega** — see `RECONCILIATION.md` for why
and what still applies from earlier design rounds.

## Quick start (Windows)

```powershell
powershell -ExecutionPolicy Bypass -File setup.ps1
powershell -ExecutionPolicy Bypass -File verify.ps1
```

Then open `views/map.html` — you should see a grid of this instance's capabilities
(all grey (L0) on a fresh seed; the "140" in older text is the generic-package
example number, not this instance's 49).

## Quick start (macOS/Linux)

```bash
pip install -r requirements.txt
python generate_views.py
open views/map.html   # or: xdg-open views/map.html
```

## Agents change state through a CLI, never by hand

```
python bcp_tool.py available --scope FAM-01 [--experiment EXP-2026-001]
python bcp_tool.py show FAM-01.1
python bcp_tool.py lease acquire FAM-01.1 --agent AGT-alpha
python bcp_tool.py lease renew   FAM-01.1 --agent AGT-alpha     # heartbeat, ~hourly
python bcp_tool.py depth bump    FAM-01.1 L1 --agent AGT-alpha --note "stub returns mock"
python bcp_tool.py lease release FAM-01.1 --agent AGT-alpha
python bcp_tool.py log append --agent AGT-alpha --signal BLOCKED_ON_DEPENDENCY --cap FAM-02.1 --blocked-on FAM-01.7
python bcp_tool.py discovery add --agent AGT-alpha --applies-to FAM-01.1 --text "..."
```

Each command does an atomic read-modify-write under a lock, checks the change
against `state/taxonomy.yaml` and the dependency graph, refuses invalid
transitions (`REFUSED: ...`, exit 1, nothing changed), and writes the
matching log event in the same step. `capabilities.yaml` edits are one-line,
comment-preserving, and verified by re-parsing before saving.

It enforces: ID/enum conformance · one live lease per capability · REQUIRES
dependencies met before leasing or advancing · only the lease holder may bump
depth, never above the lease target, never downward · 5 leases per scoped
builder / 3 per fullscope builder · experiment scope. It does **not** enforce
autonomy-band veto windows (`propose_then_act`) or per-depth done-criteria.

## Checking and maintaining

```
python validate.py            # read-only: errors + warnings (exit 1 on errors)
python sweep.py               # dry run of the coordinator/maintainer mechanics
python sweep.py --fix --views # what maintain.ps1 loops on
python -m unittest discover -s tests -v
```

`validate.py` computes what the role files used to ask agents to eyeball:
expired/stalled leases, duplicate lease entries (YAML silently keeps only one
of two hand-appended keys), dependency cycles (topological sort), broken IDs,
enums, signals and references, log/state drift, and experiments whose scope
can never finish. `sweep.py --fix` frees expired/stalled leases, resolves
lease conflicts, notifies unblocked agents, flips finished experiments to
`merging`, emits violation signals once, and recomputes `metrics.yaml`.

## Layout

```
bcp/
├── RECONCILIATION.md         # read first — resolves earlier contradictions
├── README.md                 # this file
├── setup.ps1                 # Windows bootstrap
├── verify.ps1                # Windows smoke test
├── maintain.ps1               # Windows maintenance loop wrapper
├── bcp_tool.py               # agents' only write path (see above)
├── validate.py               # read-only health check
├── sweep.py                  # coordinator/maintainer mechanics (dry run by default)
├── bcp_lib.py                # shared: atomic writes, lock, strict YAML, dependency logic
├── generate_views.py         # parses state/, writes views/, recomputes metrics
├── tests/test_bcp.py         # end-to-end tests (stdlib unittest)
├── requirements.txt
├── .gitignore
│
├── state/                    # PRIMARY STORE — hot, git-tracked
│   ├── capabilities.yaml     # what exists, current depth, invariant
│   ├── taxonomy.yaml         # global shared taxonomy library (READ FIRST)
│   ├── leases.yaml           # who's building what, right now (tool-owned)
│   ├── deps.yaml             # typed dependency edges, build order
│   ├── experiments.yaml      # scoped parallel efforts
│   ├── metrics.yaml          # auto-recomputed by sweep.py / generate_views.py
│   ├── discoveries.yaml      # shared institutional memory — what worked
│   └── failures.yaml         # shared institutional memory — what didn't
│
├── log/                      # APPEND-ONLY — one YAML file per day, the
│                              #   event bus (written by bcp_tool.py / sweep.py)
├── views/                    # AUTO-GENERATED — never hand-edit, not
│                              #   git-tracked (see .gitignore)
├── work/{agent-id}/          # per-agent scratch space, private until
│                              #   published via a depth bump
├── agents/                   # role prompts — read bootstrap.md first
│   ├── bootstrap.md
│   ├── scoped-builder.md
│   ├── fullscope-builder.md
│   ├── coordinator.md
│   └── maintainer.md
├── patterns/                 # reusable implementation templates (grows
│                              #   over time — starts empty)
└── caps/                     # optional per-capability context cards
```

## How agents run

1. Point an agent session at `agents/bootstrap.md`. It reads 7 files and
   knows the full current state in ~2 seconds.
2. Assign it a role (`scoped-builder.md` for most work, one
   `fullscope-builder.md` as integrator, plus `coordinator.md` and
   `maintainer.md` running on schedules — see `maintain.ps1`).
3. It picks up work with `bcp_tool.py available`, leases capabilities, builds,
   publishes depth bumps, all through the CLI. (Run `python validate.py` first:
   the seed `EXP-2026-001` scope needs `FAM-01.7` and `FAM-08.1` built before
   it can finish — widen its scope or start from `FAM-01.7`.)
4. Run several scoped-builder sessions in parallel (separate terminal/agent
   windows) — leases in `state/leases.yaml` keep them from colliding.
5. Run `maintain.ps1` in its own window: it runs `sweep.py --fix --views`
   every 5 minutes (frees stalled leases, refreshes views and metrics).

## Replacing the placeholder capability map

`state/capabilities.yaml` ships with 20 generic families / 140
capabilities as a working example. Swap in your real tracked project:
keep the shape (`family → sub-capability → depth → invariant`), replace
the content. Update `state/deps.yaml` and `state/experiments.yaml` to
match, then run `python validate.py` — it tells you what doesn't line up.
