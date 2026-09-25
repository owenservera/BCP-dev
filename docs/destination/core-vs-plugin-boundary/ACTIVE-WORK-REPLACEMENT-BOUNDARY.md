# ACTIVE-WORK-REPLACEMENT-BOUNDARY

## Canonical stable identity

Work identity is the durable subject. The canonical WorkRecord remains stable across implementation changes. A process, worker or plugin instance is never the Work identity.

## Stable fields

- workId
- objective
- requestedBy
- planRef and plan version
- step identity and dependency graph
- authority context/citations
- effect identity for side effects
- evidence history
- attempt history
- user-facing state

## Changeable fields

- implementation plugin
- provider realization
- worker/process instance
- scheduling assignment
- parser/model realization where contract permits
- implementation version, provided compatibility is explicit.

## Required replacement envelope

old implementation → replacement candidate → dependency census → contract comparison → plan compatibility → authority compatibility → active-attempt treatment → evidence decision → promote/rollback.

## Compatibility authority split

| Question | Owner |
|---|---|
| Does the new implementation satisfy the required contract? | compatibility/evolution service |
| Is the data/plan mapping semantically safe? | Work + evolution domain |
| Is the replacement authorized? | law/authority plugin |
| Can the new implementation be admitted and activated safely? | K0 |
| What actually happened during the transition? | evidence/audit layer |

## Active attempt cases

### Idle before next step
Pause at the Work boundary, compare implementations, then continue only after compatibility succeeds.

### Running deterministic step with no external effect yet
Continue or restart only under explicit attempt semantics; the attempt remains attributable.

### External mutation in flight
Do not infer success or failure from worker replacement. Preserve UNKNOWN_EFFECT/reconciling state and require evidence-based reconciliation.

### Implementation incompatible
Pause or migrate. Never silently bind the Work to a different semantic contract.

### Plugin retired
Keep canonical Work and history. Either migrate to a compatible successor, leave the Work paused, or surface a user-required reconstruction path.

## Critical boundary

K0 does not decide whether replacement is semantically compatible. K0 only enforces that an admitted implementation is structurally authorized and safely activated. Work/Evolution compute and record the semantic decision.

## Status

Architecture: PROVEN K1/System-Plugin boundary. Concrete runtime continuation across replacement: EXPERIMENT-REQUIRED.

## Resolving experiment

Build a two-implementation deterministic capability with identical contract and a third deliberately incompatible version. Start durable Work, replace implementation between steps and during an attempt, crash/restart, reconcile, and verify canonical history plus effect identities remain intact.