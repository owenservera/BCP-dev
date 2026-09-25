# Open Frontier

## OF-01 Canonical Work schema
Field-level contract, refs, terminal result/evidence and vault identity remain to be fixed.

## OF-02 WorkStep versus Attempt
Legacy conflates them; destination needs a clean relationship for retry and replay.

## OF-03 Standing Intent
Need lifecycle, scope, conditions, expiry, amendment, revocation and Work-generation rules.

## OF-04 Durable scheduler
Need restart-safe temporal triggering and idempotent Work creation.

## OF-05 Crash during active Attempt
Need policy for unknown external state: verify, re-run, refuse or ask.

## OF-06 World dependency snapshot
Need explicit references/freshness semantics beyond cursor/provenance root.

## OF-07 Policy precedence
Need explicit attenuation/precedence across user, project, capability, account, agent and Work rules.

## OF-08 Composition semantics
Need one Ω graph model for conditions, branching, sub-composition and deterministic execution.

## OF-09 Attention
Need one product projection for completed/running/waiting/changed/failed/found/next.

## OF-10 Export coverage
Need exact portable scope for Work/evidence/lineage.

## OF-11 Secret/resource portability
Accounts, profiles, sessions and credentials require separate redaction/reconnection rules.

## OF-12 Evidence tiers
Downstream tests must distinguish fixture, local, restart, and live external evidence.
