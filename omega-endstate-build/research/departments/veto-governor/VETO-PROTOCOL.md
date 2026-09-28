# Veto Protocol — VETO-01

## 1. Decision states

VETO-01 returns exactly one primary disposition:

- NO_VETO
- VETO_PROPOSED

VETO_PROPOSED is advisory in the current phase.

## 2. Standard proposal

    vetoId: VETO-YYYYMMDD-NNN
    status: PROPOSED
    mode: ADVISORY
    target:
      type: proposal | decision | change | workstream | organizational-change | release
      reference: durable reference
    primaryMission: full VIVIM beta ready to distribute for free
    claim:
      statement: what should not proceed
    reason:
      category: mission-drift | premature-commitment | evidence-gap |
               irreversibility | coordination-cost | repeat-failure |
               governance-risk | false-completion | other
      explanation: why this matters to the mission
    evidence:
      - reference: source
        observation: objective observation
        relevance: why it supports the veto
    impact:
      preventedFailureOrCost: what the veto protects
      estimatedSeverity: low | medium | high | critical
    releaseCondition:
      - specific condition that would release the veto
    confidence: low | medium | high
    ownerDecision: PENDING

## 3. Decision discipline

### Veto only when there is a concrete target

Do not veto a vague direction.

### Veto the smallest necessary thing

Prefer:

> veto this irreversible commitment until X is known

over:

> veto the whole initiative.

### Veto must be evidence-linked

Prefer primary repository evidence, live test results, direct observations, and explicit owner decisions over inference.

### Veto must be releasable

The owner should be able to tell what evidence or change would cause the governor to withdraw the proposal.

### Veto must be time-aware

A veto is attached to a specific state of the world. When that state changes, the governor should reconsider rather than treating an old veto as permanent law.

## 4. Owner interaction

The owner may:

- accept the veto;
- override it;
- request more evidence;
- narrow the target;
- ask the governor to reconsider after a new fact appears.

An owner override must not be hidden.

The override should be treated as an observation for later governor evaluation.

## 5. Metrics

The first implementation should measure the governor, not assume its value.

Useful measures include:

- veto proposals per unit of real work;
- accepted vs overridden vetoes;
- time from veto to resolution;
- false-veto rate discovered through subsequent outcomes;
- missed-veto incidents;
- repeat-risk incidents after veto or override;
- work or coordination cost avoided;
- delay introduced by the governor;
- changes in beta-relevant throughput after introducing advisory review.

These are experimental measures, not success scores.

## 6. Anti-patterns

Do not allow:

1. Permanent veto — a temporary concern becomes immutable law.
2. Veto by preference — architectural taste masquerades as mission risk.
3. Veto without evidence — rhetoric substitutes for observation.
4. Veto inflation — every uncertainty becomes a stop condition.
5. Veto monopoly — the governor becomes the only source of truth.
6. Self-justifying veto — the governor cites its own prior vetoes as evidence.
7. Authority laundering — an advisory proposal is repeated elsewhere as if it were binding.
8. Context capture — the governor only sees the author's framing and becomes sycophantic.
9. Single-model certainty — one model's judgment is treated as objective truth.
10. Governance creep — the governor acquires planning, implementation, staffing or architecture authority.
11. Hidden veto — refusal is encoded indirectly rather than recorded as a review decision.
12. Unmeasured friction — vetoes are celebrated without measuring the coordination and delivery cost they introduce.

## 7. First experiment

Run the governor against real planning and architectural proposals while it remains advisory.

Do not start by wiring it into the runtime execution path.

The experiment should answer:

> Does a single independent, opinionated veto function identify costly mission-threatening decisions early enough to improve real beta progress, without creating more coordination cost than it saves?

Only that empirical answer should determine the next authority level.
