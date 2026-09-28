# Resident Team Lab — Proof Log

> Status: LIVE LOG
> Rule: record evidence, not conclusions inferred from a green process exit.

## 2026-09-28 — Lab created

### CP-00 — Baseline retained
**Status:** PROVEN at repository level.

The vendored `opencode-swarm` reference core remains intact under `runtime/vendor/opencode-swarm/`. The corrected Windows validation harness remains under `runtime/scripts/validate-swarm.ps1`.

### CP-01 — Native Task permission matching
**Status:** PENDING LIVE RE-RUN.

Repository/source evidence establishes that OpenCode v1.18.4 has target-pattern Task permission evaluation, but the installed live behavior must still be exercised on this machine before it becomes a design dependency.

### U1 research hardening
**Status:** DESIGN UPDATED.

Pre-implementation research identified the following items as explicit U1 gates:

- `task_id` resume is excluded from fresh governed spawn;
- model-visible Task targets are not treated as authorization;
- plugin preflight occurs before native Task execution;
- worker leafness must be verified from effective runtime state;
- logical spawn correlation must survive retries;
- child lineage must be observed, not inferred;
- refusal, failure, timeout and unknown must remain distinct.

External corroboration includes:

- https://github.com/anomalyco/opencode/issues/33334 — Task tool schema can expose targets outside an active allow-list; enforcement must be tested at invocation time.
- https://github.com/anomalyco/opencode/issues/41681 — later OpenCode development report documenting permission inconsistency on Task session resume; not treated as v1.18.4 proof, but relevant to resume qualification.
- https://github.com/anomalyco/opencode/issues/17721 — warning about recursive Task permissions and runaway delegation when task permission is configured too broadly.

### CP-02 through CP-10
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
- `spawn_id);
- whether the call was allowed or refused;
- effective child permission relevant to Task;
- parent/child relationship;
- relevant plugin event records;
- final observable artifact;
- commit or file containing durable evidence.

A claim is **PROVEN** only when the expected observable state exists.
A claim is **UNPROVEN** when the run completed but the expected artifact was not inspected.
A claim is **REFUTED** when the expected state is contradicted by observed evidence.
