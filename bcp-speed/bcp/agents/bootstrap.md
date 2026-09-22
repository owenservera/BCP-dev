# BOOTSTRAP — every agent runs this before anything else

Read in this exact order:

1. `RECONCILIATION.md` (workspace root) — resolves contradictions, states the
   authoritative model.
2. `state/taxonomy.yaml` — the controlled vocabulary, ID schemes, depth
   levels, enums, and signal types. **Every write you make must conform to
   this file.** If a term, ID, or status you need isn't defined here, that's
   a `require_human` moment, not a license to invent one.
3. `state/capabilities.yaml` — what exists and its current depth.
4. `state/leases.yaml` — what's already claimed.
5. `state/deps.yaml` — what blocks what.
6. `state/discoveries.yaml` and `state/failures.yaml` — filter by your
   assigned family/capabilities before starting work; don't relearn what's
   already been learned.
7. Your own role file (`scoped-builder.md`, `fullscope-builder.md`,
   `coordinator.md`, or `maintainer.md`).

That's seven file reads. That's your entire cold-start context — no database,
no API, no auth.

## Writing — never by hand

**Do not hand-edit `state/*.yaml` or `log/*.yaml`.** One slipped indent or a
duplicated key silently corrupts shared state for every agent. All changes go
through `python bcp_tool.py ...`, which locks, validates against
`state/taxonomy.yaml`, checks dependencies and leases, refuses invalid
transitions (`REFUSED: <reason>`, exit 1, nothing changed), and writes the
matching log event in the same step.

| You want to | Run |
|---|---|
| see what you can build next | `available --scope FAM-01 [--experiment EXP-...]` |
| understand one capability (depth, lease, requires, discoveries) | `show FAM-01.1` |
| claim it | `lease acquire FAM-01.1 --agent AGT-you [--experiment EXP-...] [--depth-target L2]` |
| prove you are alive / extend the TTL | `lease renew FAM-01.1 --agent AGT-you` (about hourly) |
| publish progress | `depth bump FAM-01.1 L2 --agent AGT-you --note "..."` |
| let go | `lease release FAM-01.1 --agent AGT-you` |
| report you are blocked | `log append --agent AGT-you --signal BLOCKED_ON_DEPENDENCY --cap FAM-02.1 --blocked-on FAM-01.7` |
| record a lesson / a dead end | `discovery add` / `failure add --agent AGT-you --applies-to FAM-01.1 --text "..."` |
| emit any other signal | `log append --agent AGT-you --signal <SIGNAL> [--cap ...] [--detail "..."]` |

Signals that mark a state change (`LEASE_ACQUIRED`, `DEPTH_BUMPED`, ...) are
emitted by their own command; `log append` refuses them.

If a command says `STATE ERROR`, a state file is broken — stop, run
`python validate.py`, and flag it. Do not work around it.

## Autonomy bands (see RECONCILIATION.md for the full table)

- `self_approve` — just do it, log it.
- `propose_then_act` — emit the signal, wait ~5 min for a veto in the log,
  then act if none appeared.
- `require_human` — stop, flag clearly, do not act.
