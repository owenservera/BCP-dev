# VETO-01 / Authority Review Model

> Status: VISION + EXPERIMENTAL MODEL
> Date: 2026-09-28
> Primary company mission: **full VIVIM beta ready to distribute for free**
> Scope: design vocabulary and experimental model, not end-state architecture

## Purpose

This document captures the working concept behind VETO-01 as it currently stands.

The goal is not to define the ultimate governance system now.

The goal is to create the smallest useful experimental mechanism from which the organization can learn:

- when independent governance review is useful;
- what should trigger it;
- what kind of work should be reviewed at what maturity;
- how much authority is justified;
- whether the governance function accelerates or obstructs the primary beta mission.

## Governing hierarchy

The hierarchy is:

1. **Primary company mission:** full VIVIM beta ready to distribute for free.
2. **Enabling mission:** build or discover development-system capabilities only insofar as they materially accelerate that mission.
3. **Long-horizon vision:** explore a self-defining, self-evolving, self-governing development organization.

We must not mistake the third item for the current delivery objective.

The organization may discover that the ultimate system is valuable, unnecessary, different from our current expectations, or only partly worth building.

## Core separation

The model separates four things that are easy to conflate:

- **signal** — an observation that a review may be worthwhile;
- **trigger** — the mechanism that actually starts a review;
- **review** — the governor's independent judgment;
- **authority** — what force, if any, follows from that judgment.

Therefore:

> SIGNAL != TRIGGER != REVIEW != VETO != AUTHORITY

A good early system keeps these boundaries explicit.

# Axis 1 — Review trigger

The first axis asks:

> Who or what causes VETO-01 to begin its work?

### Trigger modes

**Manual referral**

An owner, Steward, department lead, verifier, researcher, or other participant explicitly requests review.

This is the starting mode.

**Stage-triggered referral**

The development process reaches a known lifecycle boundary and requests review.

**Signal-assisted referral**

The system observes activity or commitment patterns and suggests:

> "This may have reached a useful review point."

A human or authorized participant decides whether to invoke VETO-01.

This is an important early evolution because it adds sensing without silently adding governance authority.

**Automatic trigger**

A declared condition causes the system to invoke VETO-01 without a human deciding whether the review should start.

**Self-triggered**

VETO-01 itself identifies that it has encountered a condition requiring review and initiates the review.

This is a much later experiment.

### Important distinction

Detection is not activation.

The system may become good at detecting potential governance boundaries long before it is trusted to automatically invoke or enforce a governance decision.

# Axis 2 — Governed work maturity

The second axis asks:

> What has the work become by the time review occurs?

A conceptual lifecycle is:

IDEA
→ CONCEPT
→ DESIGN
→ IMPLEMENTATION PLAN
→ RATIFIED PLAN
→ EXECUTION
→ IMPLEMENTATION
→ INTEGRATION
→ RELEASE

This is a vocabulary for experimentation, not a mandatory workflow.

The current experimental layer is deliberately narrow:

> **Concept / design work approaching a meaningful implementation commitment.**

The initial research problem is therefore not "what is the final correct design-review threshold?"

It is:

> **When has conceptual work accumulated enough commitment, cost, consequence, or dependency that independent review has a positive expected value?**

## Conceptual Commitment Boundary

The first boundary should be treated as a discovered boundary rather than a predefined one.

It is the point at which an idea is becoming sufficiently real that continuing to refine it without independent challenge is no longer obviously cheap.

The boundary may be indicated by combinations of:

- substantial durable documentation;
- repeated revision of the same concept;
- many linked artifacts;
- cross-agent participation;
- explicit roadmap references;
- allocation of implementation resources;
- growing dependency surface;
- increasing irreversibility;
- explicit claims about future architecture;
- movement from exploration toward commitment.

These are candidate signals, not rules.

The objective is to learn which signals actually correlate with valuable intervention.

# Axis 3 — Governor authority

The third axis asks:

> What consequence does a VETO-01 judgment have?

A useful experimental vocabulary is:

**A0 — No governance authority**

The governor exists as research only.

**A1 — Opinion**

The governor provides an independent view.

**A2 — Veto proposal**

The governor may issue a durable VETO_PROPOSED record.

The owner decides.

**A3 — Mandatory review**

Certain lifecycle boundaries cannot be crossed without a governor review occurring.

The governor may still be advisory.

**A4 — Bounded blocking authority**

The governor can stop a narrowly defined action class.

**A5 — Automatic blocking authority**

For a proven class of conditions, the runtime automatically prevents continuation when VETO-01 issues a valid veto.

Five levels is a maximum experimental vocabulary, not a promise that all levels will be implemented.

## Authority is not global

Future authority should be earned per boundary or decision class rather than granted globally.

For example, the governor might eventually have:

- advisory authority for conceptual work;
- mandatory review for organizational restructuring;
- blocking authority for a narrow integration boundary;
- no authority at all over low-risk experiments.

Thus maturity can be asymmetric.

# Trigger and authority are independent

The two axes must remain independent.

Examples:

- manual trigger + advisory opinion;
- automatic trigger + advisory opinion;
- manual trigger + actual blocking authority;
- automatic trigger + actual blocking authority.

This prevents accidental coupling of sensing, judgment, and power.

# A fourth useful dimension — source of trigger

In practice, trigger origin can also be classified:

- **human**;
- **peer agent**;
- **department lead**;
- **workflow system**;
- **environmental signal**;
- **governor self-observation**.

This is not a maturity ladder by itself.

It is a provenance dimension for understanding who decided that review should occur.

# The first experimental arrangement

The starting arrangement should be intentionally light:

DEVELOPMENT WORK
→ lightweight observation/signals
→ possible review candidate
→ human/authorized participant decides
→ VETO-01
→ NO_VETO or VETO_PROPOSED
→ owner disposition
→ normal development continues
→ eventual outcome observed
→ governor evaluated

No automatic runtime blocking is required.

No scheduler is required.

No dedicated enforcement runner is required.

No complete lifecycle classifier is required.

## Review candidate

A review candidate is an observation:

> "Something appears to have crossed a potentially valuable governance boundary."

It is not a veto.

It is not even a decision that review must occur.

The candidate can be generated by a lightweight sensor, human observation, or another participant.

## Suggested early candidate signals

Possible signals include:

- high document churn;
- unusually many substantive edits;
- repeated refinement of one concept;
- many new or cross-linked durable artifacts;
- the same proposal discussed across multiple teams;
- increasing number of dependencies;
- allocation of implementation capacity;
- explicit roadmap linkage;
- increasing irreversibility;
- unresolved contradictions;
- a concept repeatedly re-entering planning.

The experiment should record these signals and their later outcomes rather than immediately turning them into thresholds.

# Backtracking from the ideal state

The long-horizon image is a governor capable of observing concrete implementation and stopping a governed change:

agent change
→ live implementation evidence
→ governor evaluation
→ valid veto
→ execution/integration prevented

We should deliberately backtrack from that end state.

The development path can therefore evolve through:

1. manual review requests;
2. signal-assisted review candidates;
3. stage-triggered advisory reviews;
4. automatic advisory reviews;
5. mandatory review boundaries;
6. narrowly bounded blocking authority;
7. potentially live implementation-level vetoes.

Each transition is an experiment.

No transition occurs merely because the next stage is technologically possible.

# Graduation principle

The governor earns authority through demonstrated responsibility.

A practical principle is:

> **Every increase in autonomy should be preceded by increased observable responsibility, and every increase in authority should be earned by demonstrated performance at the preceding boundary.**

Evidence should consider both sides:

- risks prevented or surfaced;
- false positives;
- missed risks;
- delay introduced;
- context cost;
- owner interaction cost;
- recoverability;
- effects on beta throughput and delivery.

Owner overrides are evidence.

They are not disobedience.

# Governance should discover its own boundaries

The organization should not permanently hard-code:

> "VETO-01 always reviews after design."

Instead, it should learn:

> where are the highest-value governance boundaries?

Different classes of work may eventually justify different trigger and authority combinations.

Examples include:

- exploratory research;
- persistent agent creation;
- major architecture;
- organizational restructuring;
- large dependency adoption;
- integration;
- release.

The eventual governance map is therefore an empirical product of the development system.

# Anti-patterns specific to this model

- treating a review candidate as a veto;
- treating a trigger as authority;
- equating activity volume with commitment;
- hard-coding an arbitrary maturity threshold;
- granting global authority because one boundary was proven;
- making the governor "always against" by construction;
- allowing advisory vetoes to become de facto binding through repetition;
- automating a governance boundary before the boundary itself is understood;
- measuring veto count rather than mission impact;
- allowing governance machinery to consume more beta capacity than it saves;
- turning long-horizon organizational research into the current company mission.

# Primary experimental question

> **Can we discover governance boundaries and progressively automate them in a way that materially accelerates preparation of the full VIVIM beta, while keeping human governance in control until evidence justifies greater autonomy?**
