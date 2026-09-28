# Delegation and Capability Enforcement
## 2026-09-28

Prompt text is not security. The final enforcement hierarchy is runtime capability, tool/resource permission, generated envelope, prompt guidance, then human review.

## Exact agent resolution
The requested agent must resolve to that exact identity or execution fails. Silent fallback to the default Steward is forbidden.

## CFA to worker
Each CFA receives a registered worker catalog. Runtime restrictions should cover worker IDs, maximum depth, tool set, writable paths, shell commands, and network domains where supported.
If a particular OpenCode version cannot enforce a resource bound, the system must label it procedural rather than claiming it is mechanically secured.

## Worker classes
Scout: read/search only.
Researcher: read/web research only.
Drafter: scoped file edits only.
Verifier: read/test observation only.
Runner: scoped command execution only.
No worker owns a task, signs durable architecture, or spawns another worker.

## Completion receipt
Required fields: requested_agent, resolved_agent, work_id, source_sha, allowed_paths, actual_changed_paths, commands, tests, result, commit_sha, enforcement_level, blockers, next_action.
The validator rejects missing identity, SHA mismatch, path escape, missing required verification, stale STATE, or invalid schema.

## Revocation
Removing a delegation from the canonical registry denies new spawn. In-flight work stops safely. Stale state cannot resurrect a revoked agent.

## One writer
At most one active writer owns a production path inside a work corridor. Others inspect, review, challenge, or provide evidence.

## No capability inflation
Tool availability is not authorization. Runtime capability changes require an explicit capability-profile change and fresh verification.