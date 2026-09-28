# VETO-01 Research Synthesis

> Status: RESEARCH BASIS, NOT ARCHITECTURE LAW
> Date: 2026-09-28

## Research question

How can an independent agent with only veto authority become a useful governor of an evolving agentic development organization without becoming a bottleneck, an unaccountable authority, or a generic critic?

## Evidence surveyed

### Independent assurance and early challenge

NASA's Independent Verification and Validation program emphasizes technical independence, objective evidence, lifecycle involvement, and analysis of both products and processes. NASA explicitly treats independence as important to avoiding conflicts of interest in verification.

NASA also states that IV&V should begin early enough to develop an independent understanding of the system and identify risks while correction is still cheaper.

Source: https://swehb.nasa.gov/spaces/SWEHBVD/pages/102695499/SWE-141%2B-%2BSoftware+Independent+Verification+and+Validation

### Stopping production when abnormalities appear

Toyota's Jidoka principle gives workers a mechanism to stop a production line when an abnormality is detected, explicitly linking the stop mechanism to rapid correction and preventing defective output from progressing.

Transferable lesson: a stop mechanism can be a productivity mechanism when stopping is connected to fast diagnosis and recovery.

Source: https://global.toyota/en/company/vision-and-philosophy/production-system/

### Automated guardrails and human approval

OpenAI's current agent guidance distinguishes automatic guardrails from human approval and describes review as a mechanism that pauses a run before sensitive side effects, allowing the decision to be made explicitly and the same run to resume afterward.

Source: https://developers.openai.com/api/docs/guides/agents/guardrails-approvals

### AI critique and constitutional supervision

Anthropic's Constitutional AI work demonstrates using explicit principles plus AI-generated critique and revision as a way to supervise model behavior.

Transferable lesson: critique can be structured around declared principles rather than vague preference.

Source: https://www.anthropic.com/research/constitutional-ai-harmlessness-from-ai-feedback

### LLM evaluators are not automatically objective

Recent empirical work reports limitations in LLM-as-a-judge systems, including poor discrimination between closely matched systems, sensitivity to artifacts, and evaluator bias. Other work identifies sycophancy as a problem in multi-agent interaction.

Implication: VETO-01 should produce evidence-bounded, independently inspectable proposals rather than treating its model output as objective truth.

Sources:
- https://aclanthology.org/2025.findings-emnlp.1036/
- https://aclanthology.org/2025.acl-long.970/
- https://aclanthology.org/2025.findings-acl.1141/

### Structured debate can improve challenge, but forced stance can backfire

Recent multi-agent debate research finds benefits from agents refining views in response to opposition, while also finding that forcing agents to defend assigned stances can produce rhetorical rigidity around flawed reasoning.

Implication: VETO-01 should have an adversarial search posture rather than a fixed "always oppose" stance.

Source: https://aclanthology.org/2025.argmining-1.6/

### Governance topology changes collective performance

A 2026 study of institutional forms in multi-agent systems reports substantial performance differences between governance topologies and argues that there may be no single optimal organizational form; topology can need to be reselected as capability and task characteristics change.

Implication: VETO-01 should be an experiment in one governance primitive, not proof that a veto-centric organization is the final system.

Source: https://arxiv.org/abs/2604.27691

## Synthesis

The strongest transferable pattern is:

**independent challenge + explicit principles + objective evidence + bounded stopping authority + rapid release/reconsideration + measurement of the reviewer itself**

The dangerous pattern is:

**opaque critic + permanent authority + no appeal + no evidence + no measurement**

## Why one power is interesting

Giving the department only veto power creates an unusually clean experiment.

It removes incentives to:

- acquire work for itself;
- grow its own staff;
- steer architecture toward its own preferred implementation;
- optimize task throughput for its own benefit;
- become the organization's hidden scheduler.

Its job is simply to answer:

> Is there enough reason that this should not proceed as currently proposed?

That narrow remit also makes its value measurable.

## Critical design distinction

The governor does not own truth.

It does not own architecture.

It does not own the roadmap.

It does not own acceptance.

It owns only the decision to issue a veto proposal within its experimental role.

The owner decides whether the proposed veto stands.

## First-stage operating model

1. Select a real upcoming decision or work proposal.
2. Produce a minimal decision/context bundle.
3. Give VETO-01 the primary mission and that bundle.
4. Have it independently identify potential grounds for stopping.
5. Require evidence references and a release condition.
6. Present the veto proposal to the owner.
7. Record ACCEPT / OVERRIDE / REQUEST-EVIDENCE.
8. Revisit the decision later using actual outcomes.
9. Measure both prevented cost and introduced coordination cost.

## Research questions that remain open

- How much context does the governor actually need before additional context stops improving judgment?
- Does a separate model/provider improve independence enough to justify the cost?
- Should the governor see the author's rationale at all, and if so when?
- What categories of decisions benefit most from veto review?
- Can veto thresholds be learned from outcomes without creating self-reinforcing bias?
- How should multiple future governors interact without producing paralysis?
- Can a veto become a portable organizational primitive independent of the underlying agent runtime?
- What evidence threshold distinguishes "pause and investigate" from "do not proceed"?
- How can we measure averted failure when the veto prevented the failure from occurring?
- At what point does actual veto authority produce enough acceleration to justify moving beyond owner-mediated advisory mode?

## Working hypothesis

A small, independent advisory governor is worth testing because the ability to stop bad work may be a productivity capability rather than overhead, but only if the governor remains narrow, evidence-linked, fast to review, and empirically evaluated against actual beta progress.
