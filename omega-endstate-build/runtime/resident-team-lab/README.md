# Ω Resident Team Lab

> Status: EXPERIMENTAL
> Purpose: evolve the working `opencode-swarm` integration toward the Ω resident-team model through small, independently provable checkpoints.

## Why this folder exists

This directory is the working laboratory for the resident-team transition.

The repository deliberately keeps two things distinct:

1. `../vendor/opencode-swarm/` is the vendored reference implementation and known-working substrate.
2. This directory contains the VIVIM integration layer, experimental OpenCode configuration, probes, and design proposals that evolve around that substrate.

Do not replace the vendor implementation here. When a new behavior is proposed, first prove it against the installed substrate, then add the smallest VIVIM layer required.

## Current upgrade: U1

U1 is the first major upgrade:

> **governed resident-owned worker delegation through native OpenCode Task.**

The minimal topology is:

```
team-root -> research-resident -> research-worker
```

The resident must be able to make the decision to request bounded worker capacity.

The runtime must decide whether that request is authorized and admitted.

The plugin must not become a second scheduler.

U1 deliberately excludes `task_id` resume. Resume is treated as a separate future capability because v1.18.4's native Task path does not itself establish sufficient ownership/lineage checks for an arbitrary existing session.

See:

- `docs/FIRST-MAJOR-UPGRADE-DESIGN.md`
- `docs/FIRST-MAJOR-UPGRADE-RISK-REGISTER.md`
- `docs/CHECKPOINTS.md`

## Layout

- `plugin/` — VIVIM plugin integration/observation code.
- `config/` — isolated OpenCode configs and resident/worker profiles for experiments.
- `scripts/` — Windows PowerShell probes and repeatable test entry points.
- `docs/` — evolving proposals, decisions, risks, and checkpoint definitions.
- `artifacts/` — local experiment output; ignored by Git when present.

## Running the first probe

From the repository root in PowerShell:

```powershell
$env:OPENCODE_CONFIG = (Resolve-Path .\omega-endstate-build\runtime\resident-team-lab\config\opencode.team-lab.jsonc).Path
opencode
```

Then ask `team-root` to delegate one narrowly scoped research task to `research-resident`, and ask the resident to create one `research-worker`.

For the mechanical permission probe:

```powershell
.\omega-endstate-build\runtime\resident-team-lab\scripts\probe-task-permission.ps1
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
