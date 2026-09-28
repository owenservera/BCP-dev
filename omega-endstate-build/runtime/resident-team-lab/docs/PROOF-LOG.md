# Resident Team Lab — Proof Log

> Status: LIVE LOG
> Rule: record evidence, not conclusions inferred from a green process exit.

## 2026-09-28 — Lab created

### CP-00 — Baseline retained
**Status:** PROVEN at repository level.

The vendored `opencode-swarm` reference core remains intact under `runtime/vendor/opencode-swarm/`. The corrected Windows validation harness remains under `runtime/scripts/validate-swarm.ps1`.

### CP-01 — Native Task permission matching
**Status:** PENDING LIVE RE-RUN.

Repository/source evidence indicates that V1 OpenCode supports granular `permission.task` patterns, but the installed behavior must be exercised directly on this machine before this becomes a design dependency.

### CP-02 onward
**Status:** NOT STARTED.

No later checkpoint should be marked proven from design documents alone.

## Evidence capture rule

For each run record:

- exact OpenCode version;
- config path;
- plugin path;
- root/parent session ID;
- child session ID(s);
- requested target agent;
- whether the call was allowed or refused;
- relevant plugin event records;
- final observable artifact;
- commit or file containing durable evidence.

A claim is **PROVEN** only when the expected observable state exists.
A claim is **UNPROVEN** when the run completed but the expected artifact was not inspected.
A claim is **REFUTED** when the expected state is contradicted by observed evidence.
