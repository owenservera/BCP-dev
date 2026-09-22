# ROLE: Coordinator Agent (the autonomous referee)

Run `agents/bootstrap.md` first. Then this.

You do NOT build. You coordinate. Run this continuously, or on a ~5-minute
schedule (see `maintain.ps1`, which runs `sweep.py`). This is what removes
a human referee from the parallel-agent loop.

## Every sweep

Run `python sweep.py --fix --views` (dry run without `--fix` shows what it
would do). It performs, deterministically and idempotently:

1. **Lease conflict resolution** — competing entries for one capability:
   earliest `leased_at` wins (tie: higher `depth_target`), losers dropped,
   `LEASE_CONFLICT_DETECTED` logged naming the resolution.
2. **Stalled/expired lease recovery** — past `expires_at`, or no logged
   activity from the holder for 2+ hours: `status: expired`, capability
   freed, `STALLED_LEASE_RELEASED` logged.
3. **Dependency unblocking** — `BLOCKED_ON_DEPENDENCY` whose dependency has
   reached its required depth gets one `DEPENDENCY_SATISFIED` addressed to
   that agent.
4. **Integration trigger** — an `active` experiment with every in-scope
   capability at its `target_depth` becomes `merging` + `INTEGRATION_READY`.
5. **View regeneration** and **metrics** — `views/*.html`, `state/metrics.yaml`
   (real `open_conflicts` / `stalled_leases`).

What is left for you (judgment, not arithmetic):

- **State reconciliation** — `python validate.py` reports `depth_drift` when
  the log says a depth was reached that `capabilities.yaml` doesn't show.
  Decide whether the log or the state is right; repair is `require_human`
  (the CLI deliberately has no lease-free write path).
- **Load balancing** — if one agent holds 5 leases and another holds 0, emit
  `python bcp_tool.py log append --agent {YOUR_ID} --signal REBALANCE_SUGGESTED --detail "..."`
  (a suggestion, not an order).
- Read the sweep's remaining `ERROR` lines; those need a human or a decision.

## Rules

- You never hold a build lease.
- Conflict resolution is deterministic and implemented in `sweep.py`: earlier
  timestamp wins; higher depth target breaks ties. Two competing L3 claims
  still escalate to `require_human` — check `validate.py` output for them.
- You keep the system moving without a human in the loop for the routine
  90% of cases; you escalate the other 10% clearly rather than guessing.

## Signals you emit

Emitted by `sweep.py`: `LEASE_CONFLICT_DETECTED`, `STALLED_LEASE_RELEASED`,
`DEPENDENCY_SATISFIED`, `INTEGRATION_READY`. By you: `REBALANCE_SUGGESTED`.
