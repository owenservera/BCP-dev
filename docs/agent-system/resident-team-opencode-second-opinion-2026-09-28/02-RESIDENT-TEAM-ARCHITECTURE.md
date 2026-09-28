# Resident Ten-CFA Team Architecture

**Status:** SECOND-OPINION PROPOSAL  
**Scope:** agent runtime/control plane only; no Ω-law changes.

## 1. Objective

Build the local system so that a team session contains:

- one owner;
- one Architecture Steward;
- ten resident CFA agents;
- optional bounded leaf workers;
- one Commons communication substrate;
- one durable main repository baseline;
- one runtime supervisor;
- one OpenCode server substrate.

The ten CFAs remain continuously addressable throughout the team session without requiring repeated creation of a new CFA session for every interaction.

## 2. Resident does not mean continuously generating

A resident CFA is:

> a live, addressable, stateful, recoverable participant that waits for work rather than disappearing after each turn.

Normal lifecycle:

```
RESIDENT
   |
   v
WAITING
   |
message/event
   |
   v
PROCESSING
   |
   v
RESPONDING / EXECUTING
   |
   v
WAITING
```

This avoids unnecessary token/compute consumption while preserving the owner's mental model that the team is "ON."

## 3. Proposed layers

```
+----------------------------------------------------+
| OWNER                                               |
| goals / objectives / priority / explicit authority |
+-----------------------------+----------------------+
                              |
                              v
+----------------------------------------------------+
| ARCHITECTURE STEWARD                                |
| global coordination / reconciliation / convergence |
+-----------------------------+----------------------+
                              |
                              v
+----------------------------------------------------+
| RESIDENT TEAM RUNTIME SUPERVISOR                   |
| lifecycle / mapping / health / wake / recovery    |
+-----------------------------+----------------------+
                              |
                              v
+----------------------------------------------------+
| OPENCODE SERVE                                     |
| server / sessions / model turns / tools / events  |
+----------------------------------------------------+
                              |
       +----------+-----------+----------+----------+
       |          |           |          |          |
       v          v           v          v          v
    CFA-01     CFA-02      CFA-03 ... CFA-09    CFA-10
     session    session     session          session
```

The supervisor does not outrank the Steward semantically. It is infrastructure.

## 4. Why one OpenCode server is a reasonable first design

The current server API exposes multiple sessions under one server and explicitly exists to support programmatic/multi-client interaction.

Therefore the initial design should prefer:

```
one server
+
eleven logical sessions
```

over:

```
eleven independent servers
```

Separate servers remain a possible future isolation mechanism if evidence shows one process creates unacceptable blast radius or provider/tool coupling.

## 5. Stable identity vs runtime identity

Every CFA has:

```
agent_id               stable and roster-defined
team_session_id        stable for this team session
opencode_session_id    current OpenCode session
runtime_instance_id    current server/session incarnation
attempt_id             current work attempt when applicable
commons_stream_id      stable communication stream
```

A restart must not mint a new CFA identity.

Example:

```
CFA-06
team = TEAM-2026-09-28-001
OpenCode session = ses_x
runtime instance = 01

server crash

CFA-06
team = TEAM-2026-09-28-001
OpenCode session = ses_x (resume when possible)
runtime instance = 02
```

If the OpenCode session cannot be resumed, recovery must explicitly classify the continuity outcome rather than silently substituting a fresh session.

## 6. Resident team registry

Introduce one runtime registry concept, not a task system.

Illustrative state:

```ts
interface ResidentAgentBinding {
  team_session_id: string;
  agent_id: string;
  cfa_id: string;
  opencode_session_id: string | null;
  runtime_instance_id: string;
  state: "STARTING" | "RESIDENT" | "WAITING" | "PROCESSING" |
         "BLOCKED" | "RECOVERING" | "LOST" | "SHUTTING_DOWN";
  last_observed_at: string;
  last_event_at: string | null;
  commons_cursor: {
    stream_id: string;
    stream_seq: number;
  } | null;
}
```

The registry answers:

> Which live runtime session currently represents this stable agent in this team session?

It must not answer:

> What is the truth about the architecture?

## 7. Team session lifecycle

### Start

1. Verify current main.
2. Establish TEAM_SESSION_ID.
3. Start or attach to OpenCode server.
4. Verify server health/version.
5. Verify discovered agents.
6. Start/attach Steward.
7. Start/attach CFA-01 through CFA-10.
8. Bind stable agent IDs to OpenCode session IDs.
9. Initialize Commons cursors and identity checks.
10. Establish event stream.
11. Mark agents resident only after actual session proof.
12. Deliver owner goal to the Steward and/or designated CFAs.

### Steady state

- supervisor watches server health;
- supervisor consumes event stream;
- supervisor tracks CFA session status;
- Commons carries agent messages;
- CFAs reason/respond;
- Steward reconciles global architecture;
- repository stores durable artifacts.

### Shutdown

1. stop accepting new work;
2. record team shutdown intent;
3. allow/abort in-flight tasks according to policy;
4. flush Commons outbox where supported;
5. persist runtime registry;
6. record last-observed state;
7. stop server/service if owner requested;
8. retain team/session identity for future resume.

## 8. Crash recovery

Failure cases:

### CFA process/session failure

Detect:

- missing status;
- unexpected terminal state;
- event cessation beyond threshold;
- explicit session error;
- supervisor connection error.

Recovery:

1. mark CFA RECOVERING;
2. preserve agent_id and team_session_id;
3. attempt session read-back;
4. attempt supported session resume/reattach;
5. if impossible, create replacement runtime session under the same stable CFA identity only through explicit recovery protocol;
6. replay unresolved Commons messages from cursor;
7. verify no duplicate side effects;
8. mark RESIDENT again;
9. create recovery receipt.

### Server failure

1. mark affected runtime bindings unknown/recovering;
2. preserve team registry;
3. restart server using controlled mechanism;
4. verify `/global/health`;
5. rediscover sessions;
6. reconcile every CFA binding;
7. replay/read-back missing communication;
8. classify unrecoverable sessions explicitly.

### Supervisor failure

The supervisor itself needs durable state sufficient to reconstruct:

- team_session_id;
- known agent mappings;
- last observed session IDs;
- Commons cursors;
- outstanding wake requests;
- recovery attempts.

The supervisor must not become the sole source of truth for architectural work.

## 9. Owner interaction

The owner can:

- address the Steward;
- request participation from one or more CFAs;
- switch the active working surface;
- ask for direct CFA review;
- change mode;
- pause execution;
- authorize/revoke bounded activities;
- ask for independent audit.

The owner is not required to use the Steward as a human communication relay.

## 10. Deliberate mode with resident agents

A deep architectural session may wake several CFAs simultaneously.

Example:

```
Owner question
     |
     v
Steward
     |
     +--> CFA-01: ontology analysis
     +--> CFA-04: authority analysis
     +--> CFA-06: realization analysis
     +--> CFA-09: evolution/compatibility analysis
     +--> CFA-10: substrate analysis
     |
     +<-- objections / evidence / synthesis
```

No requirement exists that the Steward personally author every intermediate message.

## 11. Execution mode with resident agents

Routine implementation may concentrate active work on one CFA while keeping the rest resident.

Example:

```
CFA-05 implements bounded Work change
CFA-04 remains available for authority questions
CFA-10 remains available for runtime constraints
CFA-09 remains available for compatibility implications
other CFAs remain resident and quiet
```

If implementation reveals cross-domain conflict, more CFAs wake and the work returns to DELIBERATE.

## 12. Leaf workers

Leaf workers remain short-lived bounded specialists.

They are different from CFAs.

CFA:

- resident;
- stable architectural responsibility;
- can reason over time;
- can communicate with peers.

Leaf:

- bounded task;
- limited scope;
- no durable independent identity in Commons;
- no spawn capability;
- returns result to owning CFA.

This keeps residency from turning every tiny worker into a permanent process.

## 13. No second ontology/store/task manager

The resident runtime may maintain operational state such as:

- process IDs;
- server URL/port;
- OpenCode session IDs;
- heartbeats;
- retries;
- cursors;
- runtime health.

It must not establish:

- a second canonical Work store;
- a second ontology;
- a second authority store;
- a second Commons history;
- a hidden task database.

## 14. Architectural principle

> **Resident minds, centralized lifecycle, decentralized communication, durable shared state.**

