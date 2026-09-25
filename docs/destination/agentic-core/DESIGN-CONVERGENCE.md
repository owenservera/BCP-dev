# Design Convergence Target

This document is intentionally empty of final architecture at scaffold time.

The investigator must converge on a small set of primitives and show why they are sufficient.

## Required final diagram

Produce a single VIVIM-native graph similar to:

`World / User Intent`
→ `Capability`
→ `Plan`
→ `Work`
→ `Scheduler / Trigger`
→ `Execution Runtime`
→ `Attempt / Step`
→ `Verification`
→ `Evidence`
→ `World Update`
→ `Attention / Continuity`

Add:

`Authority`

at the exact boundary where it belongs, and show:

`AI`

as an optional participant rather than a required executor.

## Required decisions

The synthesis must explicitly decide or leave UNKNOWN:

- Agent semantic boundary;
- Workflow vs Recipe boundary;
- Automation vs Schedule/Trigger boundary;
- Work vs Run vs Attempt;
- Plan vs execution state;
- Step persistence;
- queue/worker model;
- timer/event substrate;
- resource leasing;
- idempotency;
- retry/compensation;
- HITL;
- budgets;
- deterministic verification;
- replay;
- context snapshots;
- sandbox;
- artifact production;
- attention/continuity;
- child Work/subagents;
- AI insertion boundary;
- plugin/runtime boundary.

## Anti-bloat rule

The target is not “all features from all frameworks.”

The target is the smallest coherent deterministic substrate that can support VIVIM's product vision and later absorb AI capabilities without architectural replacement.
