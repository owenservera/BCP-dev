# Pass 3 — Experiment Matrix

> Classification: DERIVED — EXPERIMENT PLAN
> Status: all mandatory live/behavioral experiments remain unrun from this pass.

## Status vocabulary

- DESIGN FIRST
- EXPERIMENT FIRST
- IMPLEMENT FIRST
- UNKNOWN

## Mandatory matrix

| ID | Required experiment | Gate | Prerequisite | Expected falsifier | Status |
|---|---|---|---|---|---|
| E1 | One real account end-to-end | Account→Session→Browser Resource→Provider→Realization→effect→evidence | D1 account/resource design | evidence cannot prove the intended account/resource path | EXPERIMENT FIRST |
| E2 | Two accounts + isolation | Account A and B under same provider or shared resource class never cross | E1 | target/account identity ambiguous or cross-account effect | EXPERIMENT FIRST |
| E3 | Concurrent browser/resource work | two independent work items run concurrently without resource/target contamination | E1 + E2 | resource lock/ownership cannot be proven | EXPERIMENT FIRST |
| E4 | Session expiry + Chrome/process restart + recovery | same intended relationship recovers or explicitly refuses | E1 | restart/expiry yields silent substitution or unprovable identity | EXPERIMENT FIRST |
| E5 | Materially different third provider | same semantic capability contract with materially different provider realization | D4 | canonical contract requires provider-specific product branching | EXPERIMENT FIRST |
| E6 | New durable Artifact/Document/object lifecycle | new object traverses world→surface→work→evidence→export→restore | D2 + D3 | a new object requires core redesign or duplicate storage truth | DESIGN FIRST |
| E7 | Restart during durable background Work | Work identity/checkpoint reconstructs after process restart | D3 | only in-memory plan/attempt state survives | DESIGN FIRST |
| E8 | Change underlying evidence/contract | self-knowledge marks stale/recomputes rather than silently remaining current | D5 | derived view stays current on changed basis | DESIGN FIRST |

## E1 — exact trace

```
choose Account A
→ resolve candidate realization
→ select session
→ prove browser profile/process/target
→ identify provider
→ perform one governed action
→ capture result
→ record account/session/resource refs
→ persist Work/Result/Evidence
```

Acceptance:
- no identity hop is inferred only from debugPort;
- external effect has attributable account/session/resource evidence;
- post-effect result links back to the same chain;
- failure after external mutation is distinguished from pre-effect refusal.

## E2 — exact trace

```
Account A + Resource A
Account B + Resource B
         ↓
same semantic capability
         ↓
concurrent or alternating requests
         ↓
prove the external identity for each
```

Acceptance:
- A never acts as B;
- B never acts as A;
- resource ownership is inspectable;
- a missing ownership proof refuses rather than guessing.

## E3 — exact trace

Test:
- two concurrent Works;
- two sessions;
- same provider and then different providers;
- overlapping execution windows.

Acceptance:
- no cross-target messages/results;
- no duplicate click after ambiguous completion;
- lock ownership and release are observable;
- crash leaves recoverable state.

## E4 — exact trace

Faults:
- browser process closes;
- target disappears;
- authenticated session expires;
- VIVIM process restarts;
- Chrome restarts.

Acceptance:
- recover same account/resource when identity can be proved;
- request re-authentication when it cannot;
- never attach to an arbitrary surviving page as a “best effort” identity substitute;
- recovery evidence names the transition.

## E5 — third provider

Use a provider whose interaction/stream/auth characteristics differ materially from Provider-01.

Acceptance:
- canonical capability semantics survive;
- provider-specific parser/mapping/selector knowledge stays in realization boundary;
- no semantic capability contract is forked only to accommodate incidental provider UI;
- any genuine contract gap is recorded explicitly.

## E6 — durable object falsifier

Create a new object type that was absent from the existing world.

Run:
```
CREATE
IDENTIFY
RELATE
READ
MODIFY
VERSION
DERIVE
PROJECT
REFERENCE
EXPORT
RESTORE
ARCHIVE/DELETE
```

Acceptance:
- one canonical identity;
- same object remains addressable after restart;
- surface is projection;
- Work can reference it;
- evidence cites mutations;
- export/restore does not create duplicate canonical identity;
- archive/delete does not physically destroy historical revisions.

## E7 — Work restart falsifier

Start a multi-step background Work, stop the process between steps, restart, reconstruct.

Acceptance:
- Work identity survives;
- last durable checkpoint is known;
- already-completed external effects are not silently repeated;
- unresolved step is explicit;
- next action is inspectable;
- evidence distinguishes interrupted vs failed vs completed.

## E8 — self-knowledge freshness falsifier

Change one authoritative basis record:
- realization state;
- manifest/contract version;
- canonical world relationship;
- policy.

Query a previously derived self-view.

Acceptance:
- basis mismatch makes view STALE/CONFLICTED or recomputes;
- the view exposes the current basis;
- no time-based freshness claim hides a changed local source;
- derived view never becomes an authority source.

## Current execution reality

No E1–E8 is claimed as completed by Pass 3. The repository supplies fixture/proof mechanisms and design evidence; E1–E5 in particular require owner-machine/live external evidence. E6–E8 can be exercised in bounded local/fixture form once their design packets are implemented.
