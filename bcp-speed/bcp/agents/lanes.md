# LANES — current BCP agent brief

> Historical lane-specific build sequences were retired. Do not use this file as a backlog or maturity source.

## Universal rules

- Read `agents/bootstrap.md` and your role file first.
- Pass `--experiment` on lease acquisition.
- Use `bcp_tool.py` for lease/depth/log operations; never hand-edit `state/` or `log/`.
- Blocked leases are refusals: inspect the capability and its dependencies.
- A lease holder may only advance its own leased capability within the experiment's target.
- Publish depth changes with concrete evidence.
- Log durable discoveries and failures against the relevant capability.
- Verify current state before acting; historical prompts do not override `state/`.
- The coordinator/maintainer mechanics are local BCP implementation concerns, not repository-wide architectural authority.

## Fresh-session rule

The live capability, experiment, dependency and lease state is the BCP source of truth. Read the bootstrap and current state; do not reconstruct a backlog from historical lane text.

## Architecture boundary

BCP is a control substrate. Ω/destination architecture lives outside this folder. Architectural meaning discovered during BCP work should be surfaced into the appropriate current destination/Steward context rather than copied into another BCP board.
