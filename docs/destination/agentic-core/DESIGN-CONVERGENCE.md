# Design Convergence

**Status:** DESIGN-CANDIDATE — research package landed; runtime falsifiers remain.

## VIVIM-native graph

`World / User Intent → Trigger/Automation → Work → Plan → Authority → Step/Attempt → Capability → Checkpoint → Verification → Evidence → World Update → Attention/Continuity`

AI is an optional participant at bounded proposal/interpretation/diagnostic/realization boundaries.

## Decisions

- **Agent:** reusable role/policy, not execution root.
- **Workflow vs Recipe:** reusable executable structure; Ω Recipe/Composition remains deployment/governance mechanism.
- **Automation vs Trigger:** Automation is standing declaration; Trigger is individual wake condition.
- **Work vs Run vs Attempt:** Work is canonical durable subject; Run is rejected as a competing root; Attempt is one Step execution.
- **Step persistence:** yes, when needed for dependencies, recovery and evidence.
- **Queue/worker:** durable Work/Step queue; disposable workers.
- **Temporal:** durable Wake records for time/event/dependency/callback/manual waits.
- **Resources:** explicit leases and capacity domains.
- **Idempotency:** mandatory for retryable side effects or explicit reconciliation for unknown effects.
- **Retry/compensation:** retry by failure class; compensation is a new governed action, not implicit rollback.
- **HITL:** durable WAITING_HUMAN state with resumable Work.
- **Budgets:** deterministic deadline/attempt/call/resource constraints.
- **Verification:** explicit contract, separate from executor success.
- **Replay:** decision replay only; no live side effects.
- **Context snapshots:** Work records references/versioned inputs; exact schema remains open.
- **Sandbox:** local governed capabilities first; hard OS isolation remains experiment/platform-specific.
- **Artifacts:** canonical World objects referenced by Work.
- **Attention:** projection, never hidden task store.
- **Child Work:** explicit parentWorkRef, own authority and lifecycle.
- **AI boundary:** candidate output enters typed deterministic validation, then authority.
- **Plugin/runtime:** capabilities remain governed Ω plugins/realizations; no second agent kernel.

## Anti-bloat test

If removing a proposed primitive does not break durable recovery, governance, scheduling, verification, or continuity, it should not be promoted into the V1 core.

## Final design consequence

VIVIM does not need an "agent operating system." It needs a **durable governed Work substrate** on which Agents, Workflows, Automations and AI capabilities can operate.
