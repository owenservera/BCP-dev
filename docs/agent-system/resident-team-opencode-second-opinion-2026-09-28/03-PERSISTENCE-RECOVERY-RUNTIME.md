# Persistence, Residency and Runtime Recovery

## 1. The persistence question

The current repository already has a capability field named `persistent_process`, but local capability detection currently hard-codes it to `false`.

That is a meaningful finding:

> persistence is modeled, but resident runtime persistence is not yet proven or implemented.

Source reviewed:

`AGENTS_CONTEXT/AGENT-COMMONS/runtime/src/session-capabilities.ts`

Current interface includes:

```
persistent_process: boolean
```

Local detection currently sets:

```
persistent_process: false
```

The design should therefore separate at least three concepts.

## 2. Three kinds of persistence

### Session persistence

Can the logical OpenCode conversation/session be recovered with its message history and identity?

### Runtime residency

Does the team runtime currently have a live process/session representing the CFA and able to receive work?

### Runtime restartability

If the runtime disappears, can the team reconstruct or reattach the CFA without creating silent identity or lineage discontinuity?

These are not equivalent.

## 3. Recommended capability model

Instead of treating one boolean as sufficient, use:

```
session_persistent
runtime_resident
runtime_restartable
server_connected
event_stream_connected
```

These should describe observed capability; they do not grant authority.

## 4. Resident means waiting, not thinking continuously

A resident agent should behave as:

```
            +---------+
            | WAITING |
            +----+----+
                 |
          incoming event
                 |
                 v
            +---------+
            | ACTIVE  |
            +----+----+
                 |
           result / block
                 |
                 v
            +---------+
            | WAITING |
            +---------+
```

This is the correct interpretation of "all ten are ON."

The CFA is not recreated each time, but the model is not consuming tokens indefinitely.

## 5. Session context layering

Each CFA should have:

### Constitutional memory

- CORE-AGENT identity;
- domain roadmap;
- boundary decisions;
- durable lessons;
- relevant architecture invariants.

### Team-session memory

- current TEAM_SESSION_ID;
- current owner goal;
- current Steward objective;
- active work/handoffs;
- unresolved questions;
- relevant peer messages.

### Turn context

- the current Commons message;
- relevant repository evidence;
- active work envelope;
- recent peer responses;
- requested action.

### Runtime metadata

- OpenCode session ID;
- runtime instance ID;
- event cursor;
- last status;
- health;
- process/server binding.

This prevents the runtime from becoming a giant duplicated prompt.

## 6. Cold restart

A cold restart means the entire local resident team is not currently running.

Recovery source ordering should be:

1. current main branch;
2. team-session runtime registry;
3. durable Commons history;
4. CFA HOME/STATE/TASKS;
5. verified receipts;
6. OpenCode persisted session data where available;
7. last known runtime mapping.

The OpenCode session is helpful continuity, but it is not the sole architectural memory.

## 7. Warm restart

A warm restart is preferable:

- server restarts but session data remains;
- supervisor reattaches;
- CFA session IDs are rediscovered;
- Commons cursors resume.

The runtime should prove continuity rather than infer it from matching names.

## 8. Unrecoverable CFA session

If an OpenCode session cannot be resumed:

Do not silently claim:

> "CFA-06 continued."

Instead:

1. classify the original runtime instance as lost;
2. preserve its last known session ID;
3. retain all durable outputs;
4. start a replacement session;
5. initialize it explicitly as the same stable `agent_id`;
6. record `runtime_instance_id` increment;
7. load durable CFA state;
8. reconcile unread Commons events;
9. produce a recovery receipt;
10. continue only after identity/session continuity checks pass.

The distinction is:

```
same agent identity
!=
same process
!=
same OpenCode session
```

## 9. Outstanding wake requests

The supervisor must persist every asynchronous wake request until one terminal condition is observed.

Suggested lifecycle:

```
INTENDED
  |
SENT
  |
HTTP_ACCEPTED
  |
EXECUTION_OBSERVED
  |
COMPLETED / FAILED / TIMED_OUT / RECOVERY_REQUIRED
```

A request stuck at HTTP_ACCEPTED must not be treated as completed.

## 10. Idempotency

Each wake request should carry a correlation identity.

For example:

```
team_session_id
agent_id
opencode_session_id
request_id
commons_message_id
causation_id
```

The runtime should be able to detect whether a message has already been delivered to a CFA session.

Do not duplicate side effects merely because an acknowledgement was ambiguous.

## 11. Heartbeats and presence

The existing Commons model already includes presence states and timestamps.

Resident runtime health should be richer than a single `PRESENT` value.

Suggested state:

```
STARTING
RESIDENT
WAITING
PROCESSING
COMMUNICATING
BLOCKED
RECOVERING
LOST
SHUTTING_DOWN
```

The existing Commons type vocabulary already contains many of these concepts.

Presence still does not establish truth or authority.

## 12. Server-level health

The first liveness check should use OpenCode's documented:

```
GET /global/health
```

Then:

```
GET /session/status
GET /session/:id
GET /global/event
```

This gives the supervisor multiple observation layers rather than one opaque health bit.

## 13. Persistence locations

OpenCode documents debug path commands for discovering database, home, data, config, cache, state, temporary, binary, log and repository paths.

Source: https://opencode.ai/v2/docs/cli

Do not hard-code guessed filesystem paths into the BCP design.

The local runtime proof should invoke the installed OpenCode path discovery command and record the actual output.

## 14. Background service vs foreground server

For development proof:

```
opencode serve
```

For later managed residency:

```
opencode service start
```

The service is useful operationally because OpenCode itself manages start/stop/restart/status.

However, the Team Runtime Supervisor must remain capable of testing and reconstructing state independently.

## 15. Recommended recovery invariant

> **Every resident CFA must be reconstructable from durable team identity + durable CFA state + Commons cursor/history + observed OpenCode runtime state.**

If this invariant fails, classify the runtime as recovery-required rather than fabricating continuity.

