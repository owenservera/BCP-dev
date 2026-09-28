# Security, Evidence and Failure Model

## 1. Core rule

The resident runtime must not convert:

- presence into truth;
- session identity into authority;
- HTTP response into completion;
- successful process start into successful team startup;
- model output into architectural authority.

## 2. Identity model

Preserve:

```
agent_id       = stable architectural agent identity
session_id     = one OpenCode conversation/runtime session
team_session_id = one owner/team operating period
runtime_instance_id = one process/server/session incarnation
key_id         = Commons signing identity
```

These are different dimensions.

## 3. Exact CFA binding

At team startup the supervisor should verify:

```
agent_id
  -> registered CFA
  -> expected CFA home
  -> expected OpenCode agent configuration
  -> expected OpenCode session
```

Do not silently accept an unrequested or default agent.

This is especially important because current repository evidence already identifies silent OpenCode agent fallback as a P2 risk.

## 4. Capability boundary

Current capability discovery includes:

- repository read/write;
- filesystem;
- runtime execution;
- Git;
- GitHub API;
- network;
- persistent process;
- signing key.

The profile is descriptive and grants no authority.

Resident runtime should keep that principle.

## 5. Local-runtime evidence boundary

The following claims must be proved on the target local machine:

- exact OpenCode version;
- exact OpenCode server behavior;
- exact Windows process behavior;
- actual session persistence;
- actual concurrent session capacity;
- actual provider connectivity;
- actual local credentials/keys;
- actual restart behavior.

ChatGPT can audit the resulting evidence but cannot substitute for missing machine-local proof.

## 6. Failure taxonomy

Do not collapse all runtime problems into "agent unavailable."

Use distinct states:

```
EMPTY
INVALID
UNAVAILABLE
CONFLICT
REJECTED
DEAD_LETTER
TIMED_OUT
RECOVERY_REQUIRED
```

This matches the existing Commons epistemic discipline: UNKNOWN is not FAILURE.

## 7. Async delivery failure

An async wake must not be considered successful because:

```
HTTP 204
```

Instead:

```
204
  +
observed session progress
  +
terminal result
  =
execution proof
```

Any missing observation should remain explicit.

## 8. Event stream failure

If SSE disconnects:

1. record transport interruption;
2. reconnect;
3. query current session state;
4. compare message/history state against last observed cursor;
5. identify missing events;
6. reconstruct where possible;
7. classify gaps if reconstruction is impossible.

Do not assume "no event" means "no work."

## 9. Server restart

After restart:

- verify server identity/version;
- rediscover sessions;
- compare known mappings;
- verify message history;
- reconstruct active status;
- replay missing Commons events;
- verify no duplicate wakeups.

## 10. Prompt duplication

A supervisor timeout can create a dangerous sequence:

```
wake request
  |
server slow
  |
supervisor times out
  |
supervisor retries
  |
two model turns happen
```

Therefore retries require correlation/idempotency.

The supervisor should distinguish:

- request accepted;
- request started;
- request completed;
- request status uncertain.

## 11. Unauthorized scope

The resident infrastructure must not silently grant a CFA more capability simply because it is alive.

Examples:

A resident CFA still cannot:

- alter Ω law;
- create a second authority store;
- force-push;
- edit peer home;
- activate an unactivated shared boundary;
- expand its work envelope.

Residency is not authority.

## 12. Runtime supervisor permissions

The supervisor should ideally have only lifecycle/control permissions:

### Can

- start/stop/restart OpenCode server;
- create/read/observe sessions;
- deliver prompts;
- observe events;
- maintain runtime registry;
- recover sessions;
- perform health checks.

### Should not decide

- architectural ownership;
- semantic truth;
- approval;
- authority;
- Ω law;
- product decisions.

## 13. Secrets

Do not place provider passwords, tokens or private keys in Commons messages.

OpenCode server authentication credentials should remain in local protected configuration/environment.

The current server documentation describes HTTP Basic protection through `OPENCODE_SERVER_PASSWORD`; retain that secret outside repository content.

Source: https://dev.opencode.ai/docs/server/

## 14. Localhost-first security

Use:

```
127.0.0.1
```

by default.

Only expose the server remotely after explicit security design.

The documented default for `serve` is loopback.

## 15. Evidence receipt

A resident-runtime startup receipt should record:

- source repository SHA;
- OpenCode version;
- server URL/port;
- health result;
- available agents;
- team session ID;
- each CFA binding;
- Commons identity check;
- session creation/resume evidence;
- SSE connection evidence;
- runtime supervisor process identity;
- exact test commands;
- final result.

## 16. Strong falsifiers

The resident architecture should be considered unproven if any of these occur:

1. one requested CFA silently resolves to another agent;
2. an async wake returns success but there is no observable turn and the system reports success;
3. server restart loses the resident-to-session mapping with no reconstructable path;
4. two CFA sessions share an identity accidentally;
5. peer communication requires the Steward relay for normal operation;
6. recovery causes duplicate side effects;
7. a dead CFA becomes silently "healthy" through stale cached state;
8. repository state claims completion while runtime proof is missing;
9. local-runtime behavior is claimed without local evidence;
10. runtime infrastructure becomes a second task/authority store.

## 17. Evidence hierarchy

Use:

```
runtime observation
   >
server acknowledgement
   >
prompt text
   >
agent claim
```

For durable architectural claims:

```
verified repository evidence
   >
runtime evidence
   >
Commons message
   >
chat statement
```

This preserves the project's existing epistemic distinctions.

