# WS-010 — Program Observatory / Visual State

> **Classification: DERIVED — PROPOSED V0**
> **Workstream:** P1-10 — Program Observatory / Visual State
> **Status:** REGISTERED — V0 blueprint established; research/build pair not yet run
> **Base repository tip:** fbef973c443b125c442fd674ae9a9f4f5f532207
> **Created:** 2026-09-24

This is a workstream design contract, not Ω constitutional law, BCP state, or a
new authority system.

## Mission

Design and eventually prove a read-only visual observatory of the BCP / VIVIM Ω
program: a living architecture model combined with mission-control visibility.

The observatory helps a human understand:

- what the program is;
- how VIVIM, BCP/Forge, Ω, repositories, systems, workstreams, agents and work
  relate;
- what is currently happening;
- who/which agent is associated with existing recorded work;
- what is waiting, blocked, conflicting, uncertain or changing;
- why the displayed state is believed;
- what evidence supports each representation.

It is a reflection surface, not a task manager or control plane.

## Non-negotiable boundary

The observatory MUST NOT become:

- a second task system;
- a second source of truth;
- a decision system;
- a feedback/input system;
- an authority registry;
- a replacement for Git/GitHub, BCP, Ω law, the agent system, or migration records;
- a hidden project-management database.

It reads and projects existing state. It does not author that state.

## Human-language invariant

> **Identifiers are references; language carries meaning.**

Internal identifiers such as P1-02, WS-002, IMPL-04, PR #8, or EXP-#### may be
shown, searched, and linked, but MUST NOT be the primary semantic representation.

Every human-facing entity needs a contextual description sufficient to answer:
what is this, why does it exist, what is its current state, what does it relate
to, and why should I believe that representation?

## V0 experience

The spatial model is an infinite canvas with three major territories:

1. VIVIM MINE — legacy behavioral/evidence source.
2. BCP / FORGE — coordination, assay, migration and extraction machinery.
3. Ω DESTINATION — governed destination architecture.

P1 workstreams float across and between these territories according to actual
relationships. Repository areas become visible through semantic zoom.

The experience combines:

- Living architecture — structure, boundaries, dependencies and relationships.
- Mission control — current state, attention, conflicts, blockers, gates,
  changes and uncertainty.

## Top-level projections

All projections operate over the same underlying derived entity/relationship
model.

- Program Map — where the program is and how its major territories fit.
- System Map — architecture, boundaries and dependencies.
- People / Agent Map — who/which agent is associated with what existing work.
- Work Map — what is moving, waiting, blocked or complete.
- Evidence / History Map — why a displayed state exists and how it changed.
- Time / Evolution — optional V0+ projection.

These are views, not separate databases.

## State visualization

V0 uses strong visual state:

- fill = lifecycle/operational state;
- border = lifecycle/epistemic distinction;
- shape = entity kind;
- size = structural significance, never an importance score;
- edge = explicit relationship;
- halo/badge = attention or exception;
- text = contextual human-readable meaning.

Color is supplemental, not the only encoding. Unknown and conflict are first-class
visible states.

## Attention model

Two read-only layers:

1. Persistent global attention summary — conflicts, blockers, owner gates,
   unresolved proposals, stale material, and similar derived conditions.
2. Contextual attention — the current canvas highlights attention relevant to the
   visible neighborhood.

Attention is not instruction. The observatory may state that an existing source
records an owner gate; it must not invent an action for the owner.

## Semantic zoom

Zoom is hybrid:

- spatial territories remain stable;
- semantic detail increases with proximity;
- relationship traversal can pull related entities into view.

Conceptual progression:

program → territory → workstream → subsystem/area → work/artifact → source/evidence

The same entity changes representation as zoom changes. Identifiers remain
secondary references.

## Governance

Derived state must retain:

- source reference;
- source type;
- observed/derived timestamp where available;
- authority class;
- epistemic/lifecycle state;
- provenance/derivation relationship;
- conflict/unknown condition.

A displayed fact without a traceable source is explicitly labeled unresolved/unknown
or omitted.

## Proof target

The workstream is not PROVEN by producing a pretty canvas. Future proof must
show that a fresh human/agent can use the observatory to correctly understand
representative program state without the observatory silently becoming an authority.

See PROOF-PLAN.md.

## Agent pair

The workstream uses the paired research pattern:

- External research agent: architectural/UX/semantic research and falsification.
- Local agent: repository archaeology, source feasibility, bounded prototypes and
  reproducibility.

See SETUP-PROMPT-CHATGPT.md and SETUP-PROMPT-LOCAL.md.
