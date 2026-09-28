# Peer Communication, Delegation and Ambit

## 1. Main architectural correction

The current Owner Delegation document assumes that when one CFA needs another CFA, the Steward can spawn the peer.

That is appropriate for an ephemeral child-agent model.

It is not appropriate for a resident-team model where all ten CFAs are already alive.

The target should become:

> **Resident peers communicate directly. The Steward intervenes when coordination, authority, boundary, resource, or reconciliation conditions require it.**

## 2. Direct peer communication

Examples:

```
CFA-06 -> CFA-02
REQUEST: validate persistence semantics
```

```
CFA-03 -> CFA-01
OBJECTION: proposed semantic identity boundary conflicts with world identity evidence
```

```
CFA-05 -> CFA-06
EVIDENCE_REFERENCE: provider realization data needed for Work outcome interpretation
```

```
CFA-07 -> CFA-04
QUESTION: does candidate promotion require a new authority basis?
```

These should not require a Steward relay.

## 3. Steward's role in peer communication

The Steward remains responsible for:

- global architectural coherence;
- cross-CFA conflict reconciliation;
- owner alignment;
- escalation when a decision crosses authority boundaries;
- stopping conflicting work;
- maintaining the architecture graph;
- selecting work sequencing where dependencies genuinely matter.

The Steward is not:

- a message bus;
- a mandatory relay;
- the sole source of architectural intelligence;
- a substitute for CFA judgment.

## 4. Delegation ambit

The useful concept is **ambit**.

An ambit defines what a CFA may request, review, propose, hand off or execute without becoming the owner of a peer's semantics.

Illustrative CFA-05 ambit:

### May

- request Work-relevant evidence from CFA-06;
- request authority analysis from CFA-04;
- request runtime constraints from CFA-10;
- submit cross-domain objections;
- propose a cross-CFA design candidate;
- hand off a bounded investigation;
- ask a peer to falsify a hypothesis.

### May not

- redefine CFA-06's provider semantics unilaterally;
- grant itself authority belonging to CFA-04;
- modify Ω law;
- create a second canonical store;
- declare a peer's unresolved proposal to be settled truth;
- silently take ownership of peer home/state.

## 5. Delegation != authority transfer

A message can mean:

> "Please investigate X and report the evidence."

It must not automatically mean:

> "You now own X."

Ownership and authority remain explicit.

## 6. Communication classes

The existing Commons protocol is well aligned with the required peer model.

Useful kinds:

- OBSERVATION
- QUESTION
- HYPOTHESIS
- PROPOSAL
- REQUEST
- OBJECTION
- EVIDENCE_REFERENCE
- STATUS
- HANDOFF
- DECISION_CANDIDATE
- ANNOUNCEMENT

This already provides most of the vocabulary required for real team deliberation.

## 7. Real back-and-forth decision making

A cross-CFA problem can now be:

```
CFA-06
  |
  | PROPOSAL
  v
CFA-02
  |
  | OBJECTION
  v
CFA-10
  |
  | EVIDENCE_REFERENCE
  v
CFA-06
  |
  | REVISED PROPOSAL
  v
STEWARD
  |
  | synthesis / unresolved conflict
  v
OWNER
  |
  | decision / direction
  v
TEAM
```

The intermediate reasoning is genuine team communication.

## 8. Decision candidate is not decision

The existing `DECISION_CANDIDATE` message kind should remain explicitly non-authoritative.

Recommended interpretation:

```
DECISION_CANDIDATE
    =
candidate for convergence

not

DECISION
    =
binding architectural authority
```

The durable decision must still be represented through the existing approved governance mechanism.

## 9. Handoffs

Current Commons already models Handoff states.

Resident-team refinement:

- a Handoff should identify stable source/target agent IDs;
- the target agent session is already resident;
- no new CFA spawn is required;
- acceptance means responsibility for the bounded handoff subject;
- acceptance does not change CFA constitutional ownership;
- completion returns a result/reconciliation message.

## 10. Concurrent handoff claims

The repository already identifies concurrent handoff acceptance as a risk.

Resident peers make that risk more visible.

The protocol must define a deterministic rule such as:

- only one valid acceptance transitions the handoff from OFFERED;
- concurrent acceptance events remain preserved;
- a reconciliation operation records the winner and the rejected competing claims;
- no duplicate side-effectful execution occurs merely because two agents accepted.

The exact atomicity mechanism should be designed in the Commons hardening phase.

## 11. Owner as communication layer

The owner may personally provide continuity, challenge, and direction, just as in the current manual working style.

That pattern should not be lost when the runtime becomes autonomous.

The runtime replaces repeated manual process/session management.

It does not replace human steering.

## 12. Recommended communication flow

```
Owner
 |
 +--> Steward
 |
 +--> selected CFA(s)
        |
        +--> peer REQUEST
        +--> peer OBJECTION
        +--> peer EVIDENCE
        +--> peer HANDOFF
        +--> peer PROPOSAL
```

All communication remains subject to Commons protocol and durable evidence boundaries.

## 13. Existing delegation document changes implied

The current statements equivalent to:

> "If a CFA needs another CFA's work, it sends a Commons REQUEST/HANDOFF; the Steward turns that into a spawned session."

should be replaced with:

> "If a CFA needs another resident CFA's work, it sends a Commons REQUEST/HANDOFF directly to the resident peer. The Steward intervenes when the request requires authority escalation, cross-domain sequencing, boundary reconciliation, resource arbitration, or owner decision."

This is a control-plane correction, not an Ω-law change.

## 14. Why this matters

Without this correction, a resident-team runtime would paradoxically keep an ephemeral hierarchy inside a system where the peer agents are supposed to be continuously present.

That would produce:

```
resident architecture
+
spawn-on-demand communication
=
conceptual mismatch
```

The better target is:

```
resident CFA minds
+
direct peer communication
+
Steward reconciliation
+
durable evidence
```

