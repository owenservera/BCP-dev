# Implementation Blueprint — Resident Team on OpenCode Serve

**Status:** PROPOSED IMPLEMENTATION ORDER  
**Do not treat this as proof that the target runtime behavior exists.**

## 1. Guiding strategy

Do not build a new model-serving engine.

Do not make Commons responsible for process lifecycle.

Do not make the Steward responsible for session lifecycle.

Use:

```
OpenCode serve = execution/session substrate
Team Runtime = lifecycle supervisor
Commons = communication substrate
Repository = durable architectural state
Steward = architectural coordinator
CFAs = resident domain minds
Leaves = bounded specialists
```

## 2. Phase R0 — local OpenCode discovery

Run on the target Windows installation:

```
opencode --version
opencode serve --help
opencode debug paths
```

Start:

```
opencode serve --hostname 127.0.0.1 --port <controlled-test-port>
```

Verify:

```
GET /global/health
GET /doc
GET /agent
GET /session
GET /session/status
GET /event
```

Record the exact version and outputs.

### Acceptance

The server starts predictably and exposes the documented API surface.

## 3. Phase R1 — single-session control proof

Create one session.

Prove:

1. session creation;
2. synchronous message;
3. message read-back;
4. session status;
5. abort;
6. event stream.

### Acceptance

A single CFA-equivalent session can be created, addressed, observed and recovered.

## 4. Phase R2 — asynchronous wake proof

Prove:

1. establish SSE listener;
2. create session;
3. send `prompt_async`;
4. observe HTTP acceptance;
5. observe actual session activity;
6. observe assistant completion/error;
7. read back messages;
8. correlate the complete lifecycle.

Then intentionally test:

- idle session wake;
- prompt while another turn is active;
- server restart during a waiting turn;
- SSE disconnect/reconnect;
- provider/model failure.

### Acceptance

The supervisor can distinguish:

- accepted;
- executed;
- completed;
- failed;
- uncertain.

## 5. Phase R3 — two-session peer proof

Create:

- CFA-A
- CFA-B

Send a Commons-style REQUEST from A to B.

Supervisor:

1. writes/receives communication event;
2. resolves B's OpenCode session;
3. sends wake;
4. observes B's turn;
5. captures response;
6. returns it to Commons;
7. verifies read-back.

### Acceptance

A can reach B without Steward mediation.

## 6. Phase R4 — resident ten-CFA bootstrap

Create the ten CFA session bindings plus Steward.

Suggested startup order:

```
server
  |
Steward
  |
CFA-01 ... CFA-10
```

The exact parallelism should be discovered experimentally.

Do not assume all ten can start simultaneously without provider/account/model contention.

### Startup barriers

Use explicit barriers:

```
B0 server healthy
B1 all agent definitions discoverable
B2 Steward resident
B3 CFA sessions created
B4 each CFA identity verified
B5 Commons cursor initialized
B6 SSE/event observation established
B7 all ten marked resident
```

Only B7 should produce:

```
TEAM_READY = true
```

## 7. Phase R5 — resident peer mesh proof

Test selected direct communication pairs.

Minimum:

- CFA-01 → CFA-02;
- CFA-04 → CFA-06;
- CFA-05 → CFA-10;
- CFA-07 → CFA-09;
- one broadcast/synthesis path via Steward.

Test:

- REQUEST;
- OBJECTION;
- EVIDENCE_REFERENCE;
- HANDOFF;
- DECISION_CANDIDATE.

### Acceptance

Peer-to-peer communication works without making the Steward a mandatory relay.

## 8. Phase R6 — recovery

Kill/restart:

1. one CFA runtime;
2. OpenCode server;
3. supervisor;
4. the entire local team.

For each:

- detect;
- reconstruct;
- resume;
- reconcile Commons;
- prove no duplicate message-induced side effect;
- record recovery receipt.

## 9. Phase R7 — owner interaction

Prove:

```
Owner
  |
  +--> Steward
  |
  +--> CFA-04
  |
  +--> CFA-06
```

The owner can intervene directly without breaking the team model.

## 10. Phase R8 — resident + deliberate mode

Run a real architectural question.

Have at least four CFAs reason simultaneously.

Require:

- peer objections;
- evidence references;
- a revised proposal;
- Steward synthesis;
- durable result.

No production implementation required.

This establishes that residency is not merely an execution optimization.

## 11. Phase R9 — resident + execution mode

Select one bounded, already-governed code corridor.

Use:

- one primary CFA;
- resident peers for consultation;
- one or more bounded leaves;
- exact paths;
- required tests;
- durable receipt;
- commit;
- final reread.

This integrates resident runtime with the existing M0/M1 completion system.

## 12. Runtime supervisor package shape

Illustrative structure:

```
AGENTS_CONTEXT/
  AGENT-RUNTIME/
    team-runtime/
      src/
        server.ts
        opencode-client.ts
        session-registry.ts
        resident-agent.ts
        wake-controller.ts
        event-monitor.ts
        recovery-controller.ts
        heartbeat.ts
        persistence.ts
        correlation.ts
        evidence.ts
      schemas/
      tests/
      RESULTS/
```

This path is only illustrative.

The actual package location should be selected after inspecting the repository's current runtime organization to avoid creating a competing subsystem.

## 13. Team runtime state

Minimum:

```
team_session_id
server_instance_id
server_endpoint
server_version
owner_session_id
steward_session_id

resident_agents[]:
  agent_id
  opencode_session_id
  runtime_instance_id
  state
  last_observed_at
  last_event_at
  commons_cursor

pending_wakes[]:
  request_id
  target_agent_id
  opencode_session_id
  commons_message_id
  lifecycle_state
  sent_at
  last_observed_at
```

This is runtime state, not architectural Work state.

## 14. OpenCode API client

Use the current OpenAPI specification rather than hand-maintaining request types where practical.

Potential codegen or typed client generation should be evaluated from:

```
http://127.0.0.1:<port>/doc
```

However, the generated client must remain a replaceable integration membrane so an OpenCode API change does not infect Commons or CFA semantics.

## 15. Delivery contract

Every CFA wake should have:

```
request_id
team_session_id
target_agent_id
opencode_session_id
commons_message_id
sent_at
http_status
execution_observed_at
terminal_observed_at
result_message_id
outcome
```

Suggested outcome:

```
ACCEPTED
EXECUTING
COMPLETED
FAILED
TIMED_OUT
RECOVERY_REQUIRED
UNKNOWN
```

The current repository's existing completion classes remain separate from this transport/runtime lifecycle.

## 16. Avoiding scheduler duplication

The Team Runtime can decide:

> Which OpenCode session should receive this already-authorized wake?

It should not become:

> What is the next product task?

Task semantics remain in the existing agent/task/governance architecture.

## 17. Suggested first implementation

The smallest useful slice is:

```
R0 -> R1 -> R2 -> R3
```

Do not start with all ten.

The critical first proof is:

```
serve
  +
persistent session mapping
  +
async wake
  +
observable execution
  +
peer direct communication
```

Then scale to ten.

## 18. Why this order is safer

It tests the highest-risk assumptions first:

1. server availability;
2. API correctness;
3. async wake correctness;
4. event observability;
5. session persistence;
6. direct peer communication.

Only after those work does it make sense to create ten resident sessions.

## 19. Test matrix

| Test | Expected |
|---|---|
| server health | healthy/version observed |
| session create | ID returned and readable |
| synchronous prompt | assistant result/read-back |
| async prompt | 204 + observable turn |
| idle async wake | actual turn observed |
| event disconnect | reconnect + reconciliation |
| session restart | durable mapping recovered |
| peer REQUEST | direct peer response |
| wrong agent | hard failure |
| duplicate wake | no duplicate side effect |
| CFA crash | isolated recovery |
| server crash | team-wide recovery |
| supervisor crash | state reconstruction |
| ten CFA startup | all ten resident or explicit failure |
| deliberate multi-CFA question | peer deliberation works |
| bounded execution | receipt/commit/test evidence survives |

## 20. Definition of success

The resident-team runtime is proven when:

- ten CFAs are simultaneously resident and addressable;
- each has stable identity plus current runtime mapping;
- direct peer communication works;
- the Steward is not a mandatory message relay;
- async wakes are verified through observable postconditions;
- server/session failures are detected and recovered or explicitly classified;
- durable repository/Commons state survives runtime failure;
- no second authority/task/ontology system is created;
- local-runtime claims have local-runtime evidence.

