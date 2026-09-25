# Implementation Candidates

## IC-01 Canonical Work
Durable workId, owner/principal, intent, composition/plan, authority reference, actor, state, current attempt, context dependencies, result, evidence, lineage and timestamps.

## IC-02 WorkStep + Attempt
`WorkStep = intended action`; `Attempt = actual trial`.

## IC-03 Gate
Approval, clarification, selection, required input, expiry, resolver and resume disposition.

## IC-04 Deterministic compiler
Lower ActionPlan/composition/template into WorkSteps without effects.

## IC-05 Authority evaluator
Combine capability risk, delegation, project rules, account rules, standing intent, consent, budgets, egress and resource readiness into explicit allow/ask/refuse/unavailable.

## IC-06 Temporal Work producer
Turn schedule/event conditions into authorized Work.

## IC-07 Retry controller
Persist retry wait and create new Attempt identity.

## IC-08 Restart reconciler
Inspect non-terminal Work on boot; validate account/session/resource/world dependencies; resume only when safe.

## IC-09 Replay/branch
Create child Work with preserved parent evidence and causal lineage.

## IC-10 Return continuity
Project Work/evidence/world changes into a “since you left” surface.

## IC-11 Portable Work export
Extend canonical vault export to Work/evidence/lineage.

## IC-12 Deterministic falsifier
`standing intent → scheduled Work → plan → approval → execute → retry → result → return summary`.
