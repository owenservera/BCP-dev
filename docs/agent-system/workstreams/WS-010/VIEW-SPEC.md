# WS-010 — V0 View Specification

> **Classification: DERIVED — PROPOSED V0**

All views are projections of the same derived observatory model.

## 1. Program Map — primary view

Question: Where are we?

Default opening:

    VIVIM MINE              BCP / FORGE             Ω DESTINATION
    legacy evidence       coordination +           governed destination
                          migration machinery          architecture
                               |                     /
                               |                    /
            +------------- P1 WORKSTREAMS ---------+

At Z0 it shows major structure. At Z2+ it reveals workstream cards, relationships,
evidence and attention.

## 2. System Map

Question: How does the architecture actually fit together?

Emphasis:

- subsystem boundaries;
- dependencies;
- inputs/outputs;
- composition;
- authority boundaries;
- source/derived boundaries.

## 3. People / Agent Map

Question: Who/which agent is associated with what recorded work?

Emphasis:

person/agent → session → workstream → work → branch → evidence

This view reflects recorded responsibility. It does not infer performance,
competence, importance or productivity.

## 4. Work Map

Question: What is actually moving?

State families:

- active;
- waiting;
- blocked;
- completed;
- proposed;
- historical;
- unknown/conflicted.

No Kanban columns are required. Work remains spatially related to architecture
and evidence.

## 5. Evidence / History Map

Question: Why is this represented this way?

Emphasis:

- claims;
- evidence;
- decisions;
- commits;
- PRs;
- packets;
- handoffs;
- tests;
- generated artifacts;
- derivation chains.

The view should allow traversal from a human-readable object to the source
supporting its displayed state.

## 6. Time / Evolution

Question: How did this state emerge?

V0+ candidate. If implemented, it must preserve event/source provenance rather
than synthesize an invented narrative.

## 7. Cross-view behavior

Selecting an entity in any view keeps the same entity identity while changing
the projection.

Example:

- Program Map → Repository Truth & Drift
- System Map → architectural dependencies
- Agent Map → recorded agents/work
- Work Map → current work state
- Evidence Map → charter, reports, commits and other evidence

This is navigation, not duplication.
