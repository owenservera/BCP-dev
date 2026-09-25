# Agent Commons Handoffs

## Principle

A handoff is structured communication, not a new authority primitive.

It is represented by message.posted with kind=HANDOFF, followed by handoff.changed events for state transitions.

## Initial state machine

    OFFERED
      +--> ACCEPTED
      |      |
      |      v
      |  IN_PROGRESS
      |      |
      |      v
      |   REPORTED
      |      |
      |      v
      |    CLOSED
      |
      +--> DECLINED
      |
      +--> EXPIRED

## Handoff payload

    interface HandoffPayload {
      handoff_id: string;
      from: string;
      to: string;
      subject: string;

      context: string;

      known: string[];
      unknown: string[];
      conflicts: string[];

      questions: string[];
      requested_action: string;

      references: Reference[];
    }

## Continuation

Subsequent messages associated with the work carry handoff_id.

This provides reconstructable delegation lineage without introducing a separate work database.

## Completion

CLOSED means the communication workflow ended.

It does not mean the underlying architectural question is resolved or accepted as truth.

## Escalation

If a handoff discovers an architectural disagreement that requires authority, it points to the appropriate authority/owner mechanism rather than resolving authority inside Commons.
