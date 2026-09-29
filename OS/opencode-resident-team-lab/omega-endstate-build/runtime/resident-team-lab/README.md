# Ω Resident Team Lab (Linux sandbox rebuild)

> Status: EXPERIMENTAL — rebuilt live on Linux
> Provenance: faithful rebuild of `omega-endstate-build/runtime/resident-team-lab` from
> `owenservera/BCP-dev` @ branch `work/omega-endstate/STEW-01/bootstrap-team`
> Original target: Windows + PowerShell. This rebuild: Linux + bash, on OpenCode CLI
> `1.18.33` with OpenCode Zen **free models** (keyless anonymous tier).

## Why this folder exists

This directory is the working laboratory for the resident-team transition.

The tree deliberately keeps two things distinct:

1. `../vendor/opencode-swarm/` is the vendored reference implementation and known-working substrate (vendored here byte-for-byte from the reference branch).
2. This directory contains the VIVIM integration layer, experimental OpenCode configuration, probes, and design proposals that evolve around that substrate.

Do not replace the vendor implementation here. When a new behavior is proposed, first prove it against the installed substrate, then add the smallest VIVIM layer required.

## Current experiment

The first experiment is intentionally small:

- `team-root` is a primary agent (`opencode/space-bunny-free`, free).
- `research-resident` is a durable-role-shaped subagent (`opencode/nemotron-3.5-lightning-free`, free).
- `research-worker` is a disposable leaf (`opencode/mimo-v2.6-flash-free`, free).

The resident should be able to use OpenCode's native `Task` primitive to request a worker, while configuration and the lab plugin observe the delegation.

This is an observability-first checkpoint. The plugin does not yet invent a custom spawn API and does not yet enforce the full Ω delegation law.

## Layout

- `plugin/` — VIVIM plugin integration/observation code.
- `config/` — isolated OpenCode config + per-agent prompt files (`config/prompts/`).
- `scripts/` — Linux bash probes and repeatable, headless test entry points (the reference repo used PowerShell; this rebuild is Linux).
- `docs/` — evolving proposals, decisions, and checkpoint definitions.
- `artifacts/` — local experiment output (`task-events.ndjson`); ignored by Git when present.

## Empirical deviations on this build (OpenCode 1.18.33) — see docs/PROOF-LOG.md

1. The config `plugin` array resolves npm specifiers here; the harness deploys a byte-identical copy of the canonical plugin to `<project>/.opencode/plugin/resident-team-lab.ts` (auto-discovery).
2. Substrate tool attach is opt-in (`OPENCODE_LAB_ATTACH_SWARM=1`) — registering swarm tools was observed to hide the native Task tool, and Task must remain the spawning primitive.
3. `permission.task` patterns must both MATCH the agent name (`research-resident` ≠ `resident-*` — the reference config's own open question, resolved empirically) AND be ordered deny-first with literal allows last, or the runtime hides the Task tool (`tools.task=false`).

## Running the first probe

From the sandbox project root (`opencode-lab/`) in bash:

```bash
export OPENCODE_CONFIG="$PWD/omega-endstate-build/runtime/resident-team-lab/config/opencode.team-lab.jsonc"
opencode                     # interactive TUI as team-root
```

Then ask `team-root` to delegate one narrowly scoped research task to `research-resident`, and ask the resident to create one `research-worker`.

For the headless mechanical probe (this rebuild's Linux equivalent of the PowerShell probe):

```bash
./omega-endstate-build/runtime/resident-team-lab/scripts/probe-task-permission.sh
```

For the full end-to-end team proof (CP-01 allow + deny, CP-02 nesting, CP-03 observation):

```bash
# one case per invocation (free-tier gateway latency is variable):
./omega-endstate-build/runtime/resident-team-lab/scripts/run-one-case.sh cp01-allow
./omega-endstate-build/runtime/resident-team-lab/scripts/run-one-case.sh cp01-deny
./omega-endstate-build/runtime/resident-team-lab/scripts/run-one-case.sh cp02-nest
./omega-endstate-build/runtime/resident-team-lab/scripts/analyze-proof.sh
```

The first run should be treated as evidence only when the resulting session/child relationship and expected refusal/allowance are observable. A green process exit alone is not a proof.

## Evidence rule

Every checkpoint in `docs/CHECKPOINTS.md` has:

- a capability being tested,
- the smallest test that should prove it,
- observable artifacts,
- failure conditions,
- and the next migration allowed only after the checkpoint passes.

This is intentionally incremental. Nothing here is considered Ω end-state architecture merely because it has been documented.
