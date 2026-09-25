# Canonical Model

## Work

Canonical durable execution subject. Conceptual fields: `workId, requestedBy, objectiveRef, planRef, state, revision, triggerRef?, parentWorkRef?, deadline?, budget?, attentionRef?`.

## Plan

Immutable/versioned executable proposal for one Work. Contains Steps, dependencies, capability refs, verification and retry/resource policy. **Plan never grants authority.**

## Step

Durable planned unit with capability ref, inputs, dependencies, verification contract and execution policy.

## Attempt

One execution attempt against a Step: worker/lease, effect identity, timing, outcome, evidence/checkpoint refs and failure classification.

## Trigger

Manual, time, event, dependency or external callback condition that requests/wakes Work. It does not authorize execution.

## Automation

Standing declaration connecting Trigger conditions to Work creation/continuation policy.

## AgentDefinition

Optional reusable role/policy: capability set, planning strategy, delegation rules and provider/model preference. It is not active execution.

## Artifact / Evidence

Artifacts are canonical outputs. Evidence records observations/decisions/execution facts and provenance.

## Run decision

**REJECTED as separate canonical root.** Use Work identity plus Step/Attempt history.

## Workflow / Recipe

Reusable executable structure. Ω Recipe/Composition remains governance/deployment mechanism; Workflow cannot create independent authority.

## Capability / Tool / Skill

Capability is the governed semantic operation. Tool is a realization interface. Skill is a higher-level reusable composition/affordance. None bypass Law.

## Ownership

World owns Things/relationships. Work owns execution lifecycle. Evidence owns support for claims. Surface owns presentation. Attention is derived. There is no second agent database.
