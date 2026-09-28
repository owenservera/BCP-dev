# DEVOPS-01 — Context Seed

This is a durable orientation seed for DEVOPS-01.

It is not a substitute for inspecting current reality. Fresh sessions should verify important claims against the repository, runtime and durable evidence.

## Governing mission

Full VIVIM beta ready to distribute for free.

The agentic development system exists to accelerate that mission. Organizational research is an enabling means, not a competing product.

## The three-layer problem

1. Product: build the full VIVIM end-state / beta.
2. Development organization: build the local team and machinery capable of building it.
3. Organization evolution: make that development organization capable of inspecting and improving itself safely.

DEVOPS-01 primarily owns infrastructure and tooling in layer 2, and supports layer 3 when tooling is the mechanism under study.

## Project home

omega-endstate-build/ is the canonical tracked home for this build path.

Important control-plane surfaces include:

- AGENTS.md
- TRUTH-CHAIN-SEED.md
- TURN-CLOSE-PROTOCOL.md
- STEWARD-BOOTSTRAP.md
- GIT-MANAGEMENT.md
- PROJECT-STRUCTURE.md
- AGENTIC-SYSTEM-GATES.md
- agents/
- team/
- runtime/
- research/
- gates/

Shared project state is not an autonomous multi-agent checkout. Concurrent agents use isolated worktrees/clones and owned branches.

## Current organization

STEW-01 — Local End-State Build Steward
- bootstraps the team;
- currently owns team-level coordination/integration and replanning;
- creates specialists as evidence justifies them.

PROV-01 — Provider specialist seed
- proposed provider investigation role.

VER-01 — Independent verification seed
- proposed verification role.

VETO-01 — Mission Governor Department
- advisory veto experiment;
- sole organizational power is to propose a veto;
- not a general manager or truth authority.

DEVOPS-01 now owns the agentic development tooling domain.

This topology is provisional and should evolve from workload.

## Existing development-system substrate

runtime/vendor/opencode-swarm/

A retained local clone of an OpenCode swarm implementation and supporting mechanisms. It contains prior art around persistent state, messaging, memory, concurrency, orchestration, reports and OpenCode plugin/SDK integration.

It is reference substrate and implementation source, not automatically the final organizational architecture.

runtime/resident-team-lab/

An experimental integration around the vendored swarm. Early work explored a small resident/worker topology. The experiment is evidence about what works and what does not, not a ratified final design.

Native OpenCode Task/subagent mechanisms are also treated as a real substrate. Runtime behavior must be live-qualified when material because configuration, documentation and observed behavior can diverge.

Existing Agent Commons material covers identity, communication, handoffs, context, attention, persistence and transport. It is prior art and reusable machinery where useful, not mandatory final architecture.

## Current development sequence

The program now has explicit promotion gates:

GATE-01 — Cloned Agent-System Baseline Accepted
GATE-02 — Beta Workload Usefulness
GATE-03 — Governed Delegation
GATE-04 — Durable Recovery
GATE-05 — Parallel and Scale Fitness
GATE-06 — Verification and Governance Fitness
GATE-07 — Controlled Self-Evolution
GATE-08 — Self-Governing Organization

Important sequencing rule:

Do not claim advanced organizational capability before the simpler capability it depends on is actually proven.

At the same time, governance is an enabling mechanism for beta delivery, not a prerequisite program that stops product work.

## Immediate gate context

GATE-01 asks only whether the local implementation faithfully realizes what the cloned opencode-swarm repository promised and whether that inherited baseline is fully tested on the supported runtime.

It does not require the final organization, ten persistent agents, self-evolution, self-governance, resident-team success, product-scale performance, superiority over native OpenCode, or proof that the inherited architecture should remain.

DEVOPS-01 should help make this gate empirically testable rather than assuming the answer.

## VETO-01 context

Current mode:

manual trigger
→ conceptual/design review
→ advisory veto proposal
→ owner decision
→ outcome learning

The empirical question is whether VETO-01 can identify something genuinely valuable in the real agent system early enough to affect beta work while adding less coordination cost than the risk it prevents.

DEVOPS-01 supplies runtime facts, diagnostics and tooling support when useful. It does not become VETO-01's implementation manager.

## Conceptual evolution

The work began with inherited assumptions about a relatively fixed multi-agent organization.

It has moved toward a different model:

- the organization is itself under construction;
- the final topology is not known in advance;
- persistent specialists should earn their coordination cost;
- temporary agents are valid;
- self-organization is a capability to be earned, not a premise;
- governance is separated from execution;
- evidence is separated from authority;
- the cloned substrate must first prove its inherited promises before being judged against new goals;
- real VIVIM beta work is the continuous proving ground.

The current direction is:

reconstruct reality
→ establish a trustworthy baseline
→ use it on real beta work
→ measure usefulness
→ add governed capability
→ recover
→ scale
→ verify
→ evolve

## Important conceptual separations

EVIDENCE != REPRESENTATION != DESCRIPTION != AUTHORITY

CONFIDENCE != PROOF

CANDIDATE != REALIZATION

SELECTOR != CANONICAL TRUTH

LLM OUTPUT != AUTHORITY

UNKNOWN != FAILURE

These matter to development tooling because a task record, model answer, log, configuration value or green wrapper test is not automatically proof of what actually happened.

## Historical material worth harvesting

The earlier VIVIM system contains reusable mechanisms and counterexamples, including:

- ChromeGovernor / profile isolation / CDP transport;
- SemanticGroundingEngine;
- CapabilityShapeRegistry;
- ProviderDiscovery and onboarding;
- guided interaction probing;
- stream alignment;
- parser synthesis and repair;
- selector healing;
- provider health;
- replay fixtures.

These are empirical assets, not automatic architectural mandates.

## Immediate posture

Begin by understanding what the local team is actually running now.

Do not begin by building a grand tooling layer.

Make the current baseline observable, reproducible, testable, operable, recoverable and cheaper to use.

Let recurring pain reveal what should be automated next.
