# Agent Commons Valid Message Examples

These are complete `message.posted` payload examples. They are deliberately concrete so an agent does not have to reconstruct required fields from `types.ts` and `validation.ts`.

## QUESTION

```json
{
  "message_id": "0199f000-0000-7000-8000-000000000001",
  "conversation_id": "commons.public",
  "kind": "QUESTION",
  "body": {"format": "text", "content": "Which current artifact owns this meaning?"},
  "reply_to": null,
  "thread_root": null,
  "mentions": [],
  "references": [],
  "topics": ["architecture"],
  "attention": {"level": "NORMAL", "requested_delivery": "INBOX"},
  "delivery": {"requested": "INBOX", "expires_at": null},
  "epistemic_intent": "question",
  "causation_id": null,
  "correlation_id": null,
  "visibility": "PUBLIC",
  "recipients": [],
  "sealed": false,
  "expires_at": null
}
```

## OBJECTION

```json
{
  "message_id": "0199f000-0000-7000-8000-000000000002",
  "conversation_id": "commons.public",
  "kind": "OBJECTION",
  "body": {"format": "markdown", "content": "I found evidence that this seam has an existing owner."},
  "reply_to": null,
  "thread_root": null,
  "mentions": ["semantic-continuity"],
  "references": [{"type": "FILE", "location": "AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/CORE-AGENT-IDENTITY.md"}],
  "topics": ["ownership"],
  "attention": {"level": "ATTENTION", "requested_delivery": "LIVE"},
  "delivery": {"requested": "LIVE", "expires_at": null},
  "epistemic_intent": "objection",
  "causation_id": null,
  "correlation_id": null,
  "visibility": "PUBLIC",
  "recipients": [],
  "sealed": false,
  "expires_at": null
}
```

## HANDOFF

```json
{
  "message_id": "0199f000-0000-7000-8000-000000000003",
  "conversation_id": "commons.public",
  "kind": "HANDOFF",
  "body": {"format": "json", "content": {"handoff_id": "0199f000-0000-7000-8000-000000000004", "from": "world-ontology-context", "to": "data-model", "state": "OFFERED", "subject": "Reconcile world-state persistence seam"}},
  "reply_to": null,
  "thread_root": null,
  "mentions": ["data-model"],
  "references": [{"type": "FILE", "location": "docs/destination/CONCEPTUAL-MODEL.md"}],
  "topics": ["data-model", "world-model"],
  "attention": {"level": "ATTENTION", "requested_delivery": "LIVE"},
  "delivery": {"requested": "LIVE", "expires_at": null},
  "epistemic_intent": "delegated-work-offer",
  "causation_id": "0199f000-0000-7000-8000-000000000005",
  "correlation_id": "0199f000-0000-7000-8000-000000000004",
  "handoff_id": "0199f000-0000-7000-8000-000000000004",
  "visibility": "DIRECTED",
  "recipients": ["data-model"],
  "sealed": false,
  "expires_at": null
}
```

## DECISION_CANDIDATE

```json
{
  "message_id": "0199f000-0000-7000-8000-000000000006",
  "conversation_id": "commons.public",
  "kind": "DECISION_CANDIDATE",
  "body": {"format": "markdown", "content": "Candidate: preserve the K0 boundary described by the referenced evidence."},
  "reply_to": null,
  "thread_root": null,
  "mentions": [],
  "references": [{"type": "FILE", "location": "omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md"}],
  "topics": ["decision", "k0"],
  "attention": {"level": "ATTENTION", "requested_delivery": "INBOX"},
  "delivery": {"requested": "INBOX", "expires_at": null},
  "epistemic_intent": "decision-candidate",
  "causation_id": null,
  "correlation_id": "0199f000-0000-7000-8000-000000000007",
  "visibility": "PUBLIC",
  "recipients": [],
  "sealed": false,
  "expires_at": null
}
```

### Important

A valid payload is still only communication. Validation proves protocol shape and integrity, not semantic truth or authority.
