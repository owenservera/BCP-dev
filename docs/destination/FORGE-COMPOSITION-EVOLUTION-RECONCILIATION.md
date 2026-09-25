# D7 — Composition, Forge & Evolution Reconciliation

> Classification: DERIVED — WORKING DESIGN / RESEARCH
> Status: initial destination reconciliation.
> Scope: connect existing Ω plugin/composition/Forge/discovery/healing machinery and legacy VIVIM builder behavior to the destination principle that the environment can extend itself without a privileged user class.

## 1. Destination requirement

The user should not hit a hard boundary where VIVIM stops being able to do what they need because “there is no feature.”

The destination response is:

```
"I want VIVIM to do X"
        ↓
capability gap
        ↓
understand requested behavior
        ↓
compose / generate candidate
        ↓
verify against evidence
        ↓
user-controlled promotion
        ↓
new ordinary capability
```

The new capability should then participate in the same environment as every other capability.

## 2. Existing Ω material

Ω already provides:

- everything-is-a-plugin runtime;
- manifests and explicit contributions;
- composition definitions;
- Forge authoring;
- proposal/evaluation/promotion/rollback;
- generated artifact proof;
- capability registration;
- discovery/observation/inference/mapping/verification;
- healing and probation;
- anti-silent-promotion rules;
- no-privileged-path doctrine.

These are strong destination-aligned foundations.

## 3. Existing VIVIM mine evidence

The legacy tree contains:

- plugin builder;
- natural-language plugin generation;
- live capability registration;
- canvas designer;
- capability UI resolution;
- provider onboarding;
- provider protocol generation;
- selector healing;
- plugin registries.

The mine demonstrates the desired direction: users can describe behavior and the system can construct/configure parts of the environment.

The legacy architecture itself should not become the destination.

## 4. Composition semantics

A composition combines existing capabilities into useful behavior.

Examples:

- a project briefing;
- a morning report;
- a research workflow;
- a “prepare but do not send” communication task;
- a provider failover workflow;
- a custom workspace.

Composition is not the same as plugin.

### Plugin

Introduces a new bounded power or domain contribution.

### Composition

Combines available powers.

### Agent

Executes delegated work using those powers.

### Forge

Creates/changes the plugins, compositions, or surfaces themselves.

This separation should remain intact.

## 5. Capability gap

A capability gap occurs when the user expresses a desired outcome and the installed environment has no sufficiently valid capability path.

The existing NLCL WorldModel already has a capability-gap shape.

That gives us a product loop:

```
unknown request
   ↓
capability gap recorded
   ↓
ask / inspect / create
   ↓
Forge proposal
```

A gap should be data, not an error explosion.

## 6. User creation path

A normal user should eventually be able to say:

> “I want a workspace that shows my GitHub issues, relevant emails, and the Claude research I've done this week.”

The Forge should be able to:

1. understand the requested outcome;
2. find available capabilities;
3. compose existing pieces;
4. identify missing capability gaps;
5. propose any generated component;
6. run tests/falsifiers;
7. show permissions and effects;
8. let the user approve promotion;
9. install/use the result.

No expert-only SDK should be required for the normal path.

## 7. Promotion discipline

Nothing generated or repaired becomes trusted merely because it exists.

The lifecycle remains:

```
DRAFT
→ TESTING
→ EVALUATED
→ PROMOTED
```

Failure states remain explicit.

Promotion requires evidence.

The user controls the final transition into ordinary trusted behavior.

## 8. Healing is evolution too

Provider healing is the same larger pattern applied to changing external reality:

```
existing capability
   ↓
drift detected
   ↓
observe current provider
   ↓
generate/revise realization
   ↓
test
   ↓
probation
   ↓
promote replacement
```

This is why Forge and Provider Intelligence should not become separate philosophical systems.

They are two application domains of governed evolution.

## 9. Composition editing

The user should be able to change a composition through ordinary interaction.

Examples:

> “Add GitHub issues to this project view.”

> “Use Claude instead of ChatGPT for this workflow.”

> “Run this every Monday morning.”

> “Ask me before sending anything.”

The system translates those requests into composition/configuration changes.

The resulting configuration remains inspectable.

## 10. Safe change model

A change proposal should show, at an appropriate level:

- what changes;
- what capabilities are added/removed;
- what data becomes reachable;
- what new effects become possible;
- what provider/account relationships are used;
- what policies apply;
- what evidence supports the change.

The user should be able to accept, reject, or modify.

## 11. No privileged user class

The destination principle is not “everyone gets root.”

It is:

> fundamental powers are available through governed, intelligible mechanisms rather than a hidden developer/admin boundary.

The runtime may retain protected host mechanisms internally.

The user-facing environment should not require a separate developer class to create ordinary plugins/compositions.

## 12. User control over evolution

The person should control:

- whether Forge may create proposals automatically;
- which domains it can modify;
- whether generated code can execute in isolation;
- what evidence is required;
- whether promotion is automatic, approval-gated, or forbidden;
- rollback;
- version choice.

This is the same agency model applied to system evolution.

## 13. Evolution provenance

Every evolved artifact should be able to answer:

```
what changed
why
who requested it
what evidence supported it
what was tested
what failed
who approved promotion
what prior version it replaced
how to roll back
```

That is especially important because evolution changes the environment itself.

## 14. Maturity path

### E0 — static plugins

Plugins/compositions can be installed and executed.

### E1 — configurable composition

Users can configure existing compositions.

### E2 — capability gap detection

Unmet requests become inspectable capability gaps.

### E3 — in-product composition

Users can assemble existing capabilities without leaving VIVIM.

### E4 — generated proposal

Forge can produce a candidate plugin/composition/surface.

### E5 — evidence-backed promotion

Candidate can be tested, evaluated, approved, and promoted.

### E6 — autonomous repair

Provider drift can trigger a governed repair path.

### E7 — self-evolving environment

The environment can continuously improve within user-defined boundaries while preserving provenance, rollback, and sovereignty.

## 15. Critical gaps

### G-E1 — ordinary-user Forge surface

Forge is architecturally present, but the end-user interaction is not yet the finished product.

### G-E2 — composition UX

JSON compositions work as machinery; the user-facing composition model needs to become first-class.

### G-E3 — capability-gap workflow

The gap is represented, but the path from gap → proposal is not yet one product flow.

### G-E4 — evolution policy

Need one coherent user policy for automatic proposal, testing, promotion, and rollback.

### G-E5 — generated-artifact sandboxing

Generated behavior must remain constrained by the same plugin/capability boundaries as hand-created behavior.

### G-E6 — evolution continuity

Updating a capability must not destroy existing work, routing policy, world relationships, or user configuration.

## 16. Thin falsifier

Ask VIVIM:

> “Create a weekly Project X briefing that uses my existing project context, gathers relevant new conversations, uses my selected AI provider for synthesis, shows me the result Monday morning, and never sends anything automatically.”

Prove:

1. the request becomes a capability/composition proposal;
2. existing capabilities are reused before generating new ones;
3. provider routing follows the existing user policy;
4. no external mutation is introduced;
5. the schedule/standing intent is explicit;
6. the proposal is testable;
7. promotion is user-controlled;
8. after promotion the briefing behaves like any ordinary capability;
9. the provenance of the new composition is inspectable;
10. rollback leaves prior environment behavior recoverable.

## 17. Immediate implementation sequence

### D7-1 — composition characterization

Map current compositions to product-level compositions and identify user-editable dimensions.

### D7-2 — capability-gap bridge

Connect NLCL capability gaps to Forge proposals.

### D7-3 — in-product composition

Enable natural-language modification of existing compositions under ordinary policy.

### D7-4 — Forge proposal path

Connect user request → candidate → tests → evidence → approval.

### D7-5 — promotion/rollback UX

Make evolution transitions visible and reversible.

### D7-6 — healing integration

Connect provider drift repair to the same governed evolution model.

## 18. Relationship to Provider Intelligence

Provider Intelligence answers:

> “What is actually true about the external system right now?”

Forge answers:

> “How can VIVIM change its own capability implementation to accommodate that reality?”

The boundary is:

```
P1-07
external reality
     ↓
evidence
     ↓
P1-08 / Forge
candidate change
     ↓
verification
     ↓
promotion
```

Neither should silently decide the other's authority.

## 19. Working conclusion

“Everything is a plugin” is not merely an architectural constraint.

It is the mechanism that makes VIVIM a system users can extend without waiting for a vendor release.

The final destination therefore requires:

**capabilities that can be used → compositions that can be changed → Forge that can create them → verification that can trust them → user control over promotion and rollback.**

That is the path from a personal computing environment to a personal computing environment that can evolve with its owner.

## 20. Cross-cutting evolution constitution

This D7 design remains the principal Forge/self-extension reconciliation, but its evolution semantics are now governed by the dedicated cross-cutting design at `EVOLUTION-RECONCILIATION.md`.

Therefore:

- Forge proposes or changes capabilities/compositions;
- Provider Intelligence characterizes external reality;
- maintenance handles bounded deterministic repair;
- the shared evolution rules govern impact, compatibility, authority, verification, promotion, rollback, and continuity;
- constitutional change remains outside ordinary Forge authority.

The dedicated research lane must resolve the remaining hard questions before D7 claims destination-grade self-evolution.
