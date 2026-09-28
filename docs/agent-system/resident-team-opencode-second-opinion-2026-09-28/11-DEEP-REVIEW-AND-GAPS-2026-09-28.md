# Deep Review — Resident Team + Local OpenCode System

Date: 2026-09-28  
Status: SECOND-OPINION / DESIGN-CRITIQUE — no implementation authorization  
Scope: resident-ten-CFA runtime, OpenCode serve/service substrate, Commons integration, first-generation local-agent cleanup, and cross-surface continuity.

## Executive assessment

The resident-team direction remains coherent, but the design is not yet complete enough to implement safely at ten-agent scale.

The original dossier concentrated on persistence, async wake, recovery, peer communication and supervisor boundaries. This deep review identifies additional missing contracts that become important once all ten CFAs are genuinely resident.

The largest risks are not simply OpenCode API reliability. They are **identity fencing, execution authority carried by messages, supervisor impersonation, recovery atomicity, persistent-context contamination, and repository/runtime source-of-truth drift**.

## Severity model

- P0 — blocks safe resident activation
- P1 — blocks ten-agent scale or durable autonomy
- P2 — important but can follow the first single/two-agent proof
- P3 — operational refinement

## P0 findings

### P0-1 — Exact-agent configuration is internally contradictory

Current repository evidence is inconsistent:

- `FULL-INTEGRATION-TASK-LIST.md` says P1.3 flipped CFA `task:false` → `true` and marks it DONE.
- `.opencode/agents/*.md` currently show `tools.task: true` for the ten CFAs.
- `.opencode/README.md` says the ten CFAs have `task:true` scoped to `work-*` leaves.
- `FULL-SYSTEM-TEST-GAPS-AND-PREP-2026-09-28.md` says the current enforced truth is `task:false` and that the CFA spawn flip is still unverified.
- `OWNER-DELEGATION.md` still says the CFA bindings are `task:false`.

This is not a documentation nuisance. It means the repository currently has multiple incompatible statements about the actual security boundary.

Before any resident runtime proof, generate a single machine-checked binding manifest from the actual `.opencode/agents` configuration and reconcile every document against it.

Until then, treat CFA spawning as **UNVERIFIED**, not as DONE.

### P0-2 — Persistent identity needs fencing against duplicate incarnations

A stable `agent_id` can accidentally have two live runtime instances:

```
CFA-06 / local session A
CFA-06 / local session B
```

or:

```
CFA-06 / local runtime
CFA-06 / another surface
```

Without a lease/epoch/fencing mechanism, both sessions may process the same Commons work or write the same agent stream.

Required concept:

```
agent_id
  + team_session_id
  + active_runtime_epoch
  + session_id
```

Only the current epoch may act as the active runtime incarnation for that stable agent within the team session.

An old process must be able to detect that it has lost its lease and stop consequential activity.

### P0-3 — A peer message must never become execution authority

The resident model makes Commons messages able to wake a CFA.

That creates a subtle authority leak:

```
CFA-05 REQUEST
      ↓
runtime wakes CFA-06
      ↓
CFA-06 interprets request as actionable
      ↓
tool executes
```

The Commons protocol explicitly says assertion/message is not authority, but the runtime must enforce that distinction.

Every inbound wake should therefore have at least:

- message-only / deliberation mode;
- bounded work-envelope mode;
- explicitly authorized consequential mode.

A peer `REQUEST`, `PROPOSAL`, `OBJECTION`, or `HANDOFF` should not by itself authorize a filesystem mutation, production effect, or external side effect.

The receiving CFA may reason about the request and ask for/require a valid Work/Authority envelope.

### P0-4 — Supervisor must not be able to impersonate ten CFA identities

The Team Runtime Supervisor will necessarily be able to address every CFA session.

If it also holds all ten CFA signing keys and can publish Commons events as those identities, it becomes an identity superuser.

Preferred boundary:

- supervisor may route/wake/observe runtime sessions;
- each CFA retains its own Commons signing authority;
- supervisor does not mint CFA signatures;
- supervisor-generated operational evidence uses a separate runtime identity or unsigned local operational log until a governed runtime identity exists;
- any event allegedly authored by a CFA must be signed by that CFA's identity.

The runtime must not solve delivery convenience by centralizing all private keys.

### P0-5 — Commons projection cannot yet be the sole recovery truth

The current `fold.ts` sorts all events lexically by `event_id` before applying them.

The protocol itself says event IDs are identifiers, not causal order.

That makes the current projection potentially inconsistent with stream order and causal semantics.

Worse, `presence.updated` is folded against `Date.now()`, so replaying the identical event history at different times can produce different projections.

That is a determinism failure for a system explicitly intended to rebuild state after restart.

Required separation:

- deterministic historical fold from durable events;
- separate time-relative query/projection evaluation for current presence/expiry.

Do not make historical reconstruction depend on the clock at replay time.

## P1 findings

### P1-1 — Team-session identity is not represented in the existing Commons schema

The resident design introduces `team_session_id` and `runtime_instance_id`, but the current Commons `CommonsEvent` and `MessagePayload` do not visibly carry those fields.

Those identifiers therefore currently live only in the proposed runtime registry/receipt layer.

That may be correct, but it needs to be explicit.

Define whether team/session lineage is:

1. protocol metadata carried by every relevant Commons event;
2. runtime-only metadata referenced by message IDs;
3. derived from an external envelope.

Do not let each implementation invent its own answer.

### P1-2 — Owner is not modelled as an explicit runtime principal

The design says the owner can address Steward, individual CFAs, and switch surfaces.

Current Commons identity is agent-centric and the roster contains agents, not the human owner as a peer identity.

Therefore direct owner → CFA communication has no fully specified transport/authority model yet.

Possible approaches can be evaluated, but the contract must answer:

- how owner intent is authenticated in the local runtime;
- how owner override differs from a peer message;
- how an owner interrupt supersedes or pauses active work;
- how the event is durably recorded;
- how a ChatGPT surface handoff proves it represents the same owner decision.

Do not silently invent `OWNER` as an agent identity without governance design.

### P1-3 — One OpenCode server is not equivalent to ten independent runtimes

The dossier sometimes says each CFA has its own runtime while proposing one shared OpenCode server with eleven sessions.

Those are different properties.

One server may provide separate sessions, but it remains one process-level failure and resource domain.

Therefore terminology should distinguish:

- logical CFA residency;
- session isolation;
- working-directory isolation;
- tool/process isolation;
- server/process isolation;
- machine isolation.

If the owner specifically requires each CFA to have an independent runtime, one-server eleven-session is only a hypothesis and may not satisfy that requirement.

### P1-4 — Session working directory must be a first-class binding

Current OpenCode documentation states that a session is associated with a working directory and that the stored session directory is authoritative when loading/resuming/forking.

This matters because the resident system also has per-CFA homes/worktrees.

The runtime registry therefore needs the exact session directory/worktree as part of the identity binding.

It must never assume that passing a different directory later changes where a saved session acts.

### P1-5 — The supervisor needs a singleton/fencing model too

Protecting CFA identities is not enough.

Two supervisor processes could independently observe the same team registry and both deliver the same wake.

Required:

- one active supervisor epoch per team session;
- durable heartbeat/lease;
- loss-of-lease shutdown;
- startup detection of an existing live supervisor;
- explicit recovery after unclean death.

### P1-6 — Busy-session queueing must include permission/question states

An OpenCode session is not only `idle` or `busy`.

It can encounter permission requests or question-style interactions that require a response.

Current OpenCode server APIs expose session permission responses, and headless automation therefore needs an explicit policy for how those states are handled.

Without this, a resident CFA may appear healthy while waiting indefinitely for a human/tool authorization response.

Resident state should include at least:

`WAITING_FOR_MESSAGE`, `THINKING`, `RUNNING_TOOL`, `WAITING_FOR_PERMISSION`, `WAITING_FOR_QUESTION`, `COMPLETED`, `FAILED`, `RECOVERING`.

### P1-7 — Persistent CFA context needs contamination control

A resident CFA session persists across many turns and potentially many work items.

That creates a different risk from session loss: **stale-context contamination**.

For example:

- old objective remains salient;
- an obsolete work envelope remains in context;
- a superseded proposal is treated as active;
- a prior peer instruction competes with a newer owner instruction.

Define explicit goal/work epochs and context boundaries.

Persistence must preserve continuity without making every historical conversation an active instruction.

### P1-8 — There is no explicit owner/Steward/CFA precedence ladder

The resident mesh creates more simultaneous instruction sources:

OWNER → STEWARD → WORK ENVELOPE → CFA → PEER REQUEST.

The system must define precedence when they conflict.

At minimum:

- Ω/rationalized constitutional constraints cannot be overridden by runtime prompts;
- owner-authorized governance decisions outrank peer requests;
- current valid work envelope constrains execution;
- peer messages propose/request but do not expand authority;
- stale messages cannot resurrect superseded work.

Consensus is not authority.

### P1-9 — Decision-candidate closure is underspecified

Peer deliberation can generate `DECISION_CANDIDATE`, but the dossier does not fully define the lifecycle from candidate to binding decision.

Define something like:

`CANDIDATE → REVIEW/OBJECTION WINDOW → RECONCILIATION → OWNER/STEWARD DECISION WHERE REQUIRED → DURABLE DECISION RECORD`.

The mere absence of objections must never mean approval.

### P1-10 — Steward visibility collides with privacy unless explicitly designed

The dossier correctly says the Steward must observe decision-relevant peer traffic.

But Commons also has `DIRECTED`, `SEALED`, room and membership/privacy semantics.

The design therefore needs a rule for **metadata visibility versus content visibility**.

Possible design patterns:

- decision metadata visible, sealed content not;
- explicit Steward membership in decision-relevant rooms;
- derived decision references visible without exposing private body content;
- owner-authorized access for sealed conversations.

The answer cannot simply be 'Steward sees everything'.

### P1-11 — Runtime wake/reply lifecycle is still not atomic

The proposed state machine is good, but the crash boundaries need exact rules.

For example:

```
RESPONSE_CAPTURED
       ↓ supervisor crashes
COMMONS_RESULT_PUBLISHED?
```

On restart, how does the supervisor decide whether to republish the result?

Every transition needs a durable idempotency/reconciliation rule.

## P2 findings

### P2-1 — OpenCode async wake remains an explicit reliability risk

Current public OpenCode reports include idle and busy-session cases where `prompt_async` returned `204` while a turn did not run, plus serve-mode sessions that could remain busy indefinitely after a tool dispatch failure. These are release-specific reports, not proof of current target-version failure, but they justify treating the feature as a gated dependency.

Sources:
- OpenCode issue #46842 — busy-session async prompt persisted but turn never scheduled.
- OpenCode issue #21524 — idle-session async wake returned 204 without an assistant turn.
- OpenCode issue #36804 — serve-mode tool dispatch could leave a session busy forever.

### P2-2 — A fallback path must be specified before R2

If `prompt_async` is unavailable/unreliable, the design currently implies 'stop'. A practical system should define a controlled fallback:

- queue until session idle and use synchronous `/message`;
- or use a bounded execution worker that owns the blocking request;
- or explicitly classify peer delivery as deferred while preserving message durability.

Which fallback is acceptable must be determined by local evidence and the desired runtime semantics.

### P2-3 — `/session/status` cannot be the sole concurrency oracle

Public reports have described status aggregation differences across directories and sessions. The supervisor should query status in the exact working-directory/session context and reconcile it with events/message history rather than assuming one global status map is authoritative.

### P2-4 — Model/provider snapshot is missing

Resident sessions need explicit startup metadata:

- provider;
- model;
- configuration/profile revision;
- tool policy revision;
- agent binding revision.

Otherwise a long-lived CFA can silently change behavior after provider/config changes.

### P2-5 — Ten-agent cost/resource admission is underdesigned

The current design asks whether ten sessions are affordable but does not define admission controls.

Need:

- maximum simultaneously active turns;
- maximum per-provider concurrency;
- memory budget;
- queue depth;
- wake rate limits;
- backoff policy;
- owner-visible resource state.

### P2-6 — Peer wake loops need causal depth, not only turn count

A simple max-turn count helps, but the runtime should track a wake causality chain:

`message A → wake B → message B → wake A → ...`.

Then cap:

- peer wake depth;
- repeated sender/receiver cycle;
- time spent in one causal chain.

### P2-7 — Current Commons validation is syntactic, not enough for the resident mesh

The current validation checks fields/enums but does not appear to enforce all important semantic relationships such as:

- `stream_id` binding to `agent_id`;
- sender authorization for `membership.changed`;
- delivery acknowledgment identity;
- handoff source/target roster membership;
- conversation membership at post time;
- message recipient consistency;
- expiry semantics.

Resident routing will exercise these gaps much more frequently.

### P2-8 — Current fold/replay ordering problems propagate into attention

`who-needs-attention.ts` also constructs a global event list sorted by `event_id` and feeds it to `fold`.

Therefore a projection-order defect can become an attention-routing defect: the wrong agent may appear to need attention or a reply can appear missing.

Fix projection determinism before using attention as a runtime wake trigger.

### P2-9 — Supervisor should not publish presence on behalf of CFAs

Presence is an agent statement. Runtime health is an infrastructure observation.

Prefer:

- supervisor records runtime health;
- CFA publishes its own Commons presence when alive;
- a discrepancy between runtime health and presence becomes an observable divergence.

Otherwise infrastructure can accidentally impersonate agent liveness.

### P2-10 — Runtime state needs schema/version and migration rules

A long-lived resident system will survive supervisor upgrades.

The runtime registry needs:

- schema version;
- migration strategy;
- atomic write/recovery rules;
- compatibility with older runtime instances.

Without this, upgrading the supervisor can become equivalent to losing the team.

### P2-11 — Session deletion is not cleanup

OpenCode's current API documents `DELETE /session/:id` as deleting the session and its data.

Cleanup tooling should default to classify/archive/terminate rather than delete. Deletion must be an explicit destructive action with evidence preservation and owner authorization.

## P3 findings

### P3-1 — Team-session rollover is undefined

Define when `TEAM_SESSION_ID` ends.

Candidates:

- explicit owner shutdown;
- clean termination of all residents;
- maximum lifetime;
- corruption/recovery boundary;
- deliberate new-goal epoch.

Persistent agents should not create an infinitely growing single team session by accident.

### P3-2 — Startup readiness needs an active response probe

A session existing in `GET /session` should not be enough to mark it RESIDENT.

Use a cheap probe:

- session bound to exact agent;
- context loaded;
- permission policy known;
- test wake succeeds;
- response/read-back observed.

### P3-3 — Owner interruption policy is missing

What happens when the owner says STOP while one CFA is mid-tool-call and four peers are waiting on it?

Define:

- stop propagation;
- abort policy;
- queued-message policy;
- partial-result treatment;
- recovery status.

### P3-4 — Surface handoff requires anti-split-brain rules

If the work moves LOCAL → CHATGPT → LOCAL, the design needs to distinguish:

- same logical work continued elsewhere;
- same CFA identity represented elsewhere;
- an independent reviewer session;
- a stale local runtime still running.

A surface switch should create a new explicit epoch or lease when the active execution representation changes.

### P3-5 — Permission policy and owner intervention need a defined human door

Autonomy should not mean silently approving every tool permission.

Define exactly which permission classes:

- auto-allow;
- require owner;
- require CFA-04 governance;
- deny by default.

Also define how a pending human decision survives supervisor restart.

## Architectural questions still requiring deliberate resolution

1. Does 'own runtime' mean separate OpenCode process/server per CFA, or separate logical session/workspace within one server?
2. Can an OpenCode session be safely rebound to the same stable CFA after server restart without minting a new session?
3. What exact mechanism establishes the active runtime epoch?
4. How is owner identity represented without turning the human into a fake Commons agent?
5. What does the supervisor do when a peer message requests consequential work with no valid work envelope?
6. What is the exact fallback if `prompt_async` fails qualification?
7. How does Commons atomically move a message from delivered to processed when OpenCode and Commons use different durability boundaries?
8. Which peer events must always be visible to Steward, and which remain private?
9. How are persistent CFA histories compacted without semantic drift?
10. What is the resource admission model for ten active sessions?

## Recommended revised gates

Before ten-agent activation:

```
G0  Repository/runtime cleanup and source-of-truth reconciliation
G1  Exact agent binding + permission manifest
G2  Identity/session/runtime epoch fencing
G3  Single-session OpenCode qualification
G4  Durable Commons→OpenCode delivery
G5  Busy/permission/question concurrency control
G6  Two-agent direct peer protocol
G7  Steward-observation + privacy proof
G8  Recovery + duplicate-wake proof
G9  Ten-CFA resource/admission proof
G10 Resident deliberate + governed execution proof
```

## Bottom line

The resident-ten-CFA model is still a strong target. But the core engineering problem is broader than persistence:

> **maintain a single, fenced, authoritative runtime representation of each CFA; deliver untrusted peer communication without accidentally granting execution authority; preserve deterministic Commons reconstruction; and survive crashes, retries, permissions, configuration changes and surface switches without duplicate consequential effects.**

That should be the bar before declaring the first local system retired and the resident system operational.