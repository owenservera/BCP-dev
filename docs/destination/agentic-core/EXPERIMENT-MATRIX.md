# Experiment Matrix

Browser and live AI providers are explicitly out of scope for the first experiments.

| ID | Experiment | Proves | Browser? | AI? |
|---|---|---|---|---|
| A1 | deterministic multi-step Work | plan/step execution + evidence | no | no |
| A2 | process restart mid-Work | checkpoint/recovery semantics | no | no |
| A3 | retry after deterministic failure | retry/attempt semantics | no | no |
| A4 | crash after side-effect simulation | idempotency boundary | no | no |
| A5 | human approval interruption | WAITING + resume | no | no |
| A6 | timer-triggered Work | temporal substrate | no | no |
| A7 | event-triggered Work | sleeping composition | no | no |
| A8 | two concurrent Works | queue/resource/lease semantics | no | no |
| A9 | cancellation at each lifecycle point | truthful cancellation | no | no |
| A10 | replay/branch | historical immutability | no | no |
| A11 | Work creates new Artifact | canonical-world integration | no | no |
| A12 | export/restore incomplete Work | durable world + execution continuity | no | no |
| A13 | deterministic planner vs optional AI planner | AI insertion boundary | no | optional |
| A14 | child Work / delegation | sub-work semantics without second agent OS | no | no |

## Acceptance discipline

For each experiment record:

- input;
- starting state;
- durable records written;
- runtime state;
- expected transition;
- failure injected;
- recovered state;
- evidence;
- falsifier;
- unresolved semantics.

Do not call a design “proven” because the happy path works.
