# VETO-01 / EXP-001 — Advisory Governor Trial

> Status: READY TO RUN
> Authority: advisory only
> Primary company mission: **full VIVIM beta ready to distribute for free**

## Question

Does an independent, opinionated veto function improve real beta progress enough to justify the coordination cost it introduces?

## Trial design

For the next bounded set of consequential planning, architecture, organizational or release decisions:

1. Create a minimal decision/context bundle.
2. Send the bundle to VETO-01 independently of the proposing agent.
3. Ask VETO-01 to perform an adversarial search for reasons the proposal should not proceed as currently proposed.
4. Require either NO_VETO or a VETO_PROPOSED record.
5. Present any proposed veto to the owner.
6. Record the owner decision.
7. Continue normal execution under the owner's decision.
8. Revisit the governor's judgment after relevant outcomes are known.

## Context bundle

The minimum bundle should contain:

- primary mission;
- current roadmap frontier;
- proposal/change being considered;
- concrete expected outcome;
- evidence already established;
- known unknowns;
- reversibility and rollback information;
- material dependencies;
- relevant prior decisions.

Do not automatically include the full repository, the full author conversation, or every historical document.

## Recommended first targets

Prefer decisions with real opportunity cost:

- committing to a major new architecture;
- creating a persistent agent or department;
- building a new coordination mechanism;
- adopting a large external dependency;
- changing an important product boundary;
- declaring a milestone or baseline complete;
- spending substantial effort on infrastructure that is not directly product-facing;
- accepting a shortcut that creates difficult-to-reverse debt.

Avoid starting with trivial decisions. The experiment needs meaningful stakes.

## Owner interaction

The owner sees the governor's complete proposal.

The owner can:

- ACCEPT;
- OVERRIDE;
- REQUEST-EVIDENCE;
- DEFER.

The governor does not retaliate, silently re-block, or reinterpret an override as non-compliance.

## Outcome review

After an outcome becomes observable, record:

- what happened;
- whether the veto prediction was supported;
- whether the governor missed a material risk;
- what new evidence appeared;
- whether the veto saved work/cost;
- whether the veto introduced delay;
- whether the same risk recurred.

## Success signal

Do not optimize for number of vetoes.

Evidence of value would look more like:

- important risks surfaced earlier;
- avoidable rework prevented;
- mission drift caught;
- expensive premature commitments avoided;
- decision quality improved;
- owner time spent on governance remained small relative to value returned.

Evidence against value would include:

- high override frequency with little downstream support;
- repeated false alarms;
- substantial coordination delay;
- vague or non-actionable objections;
- growing dependence on the governor for ordinary judgment.

## First authority transition

There is no automatic progression.

Only after advisory evidence exists should the organization consider an experiment in which VETO-01 has actual blocking authority over a deliberately narrow action class.

That future experiment must have:

- explicit scope;
- release/unblock conditions;
- auditability;
- rollback;
- owner override semantics;
- independent testing.
