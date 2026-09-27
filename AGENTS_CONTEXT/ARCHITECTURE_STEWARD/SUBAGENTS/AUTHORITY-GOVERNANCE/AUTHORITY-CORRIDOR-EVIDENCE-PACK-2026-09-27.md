# CFA-04 — Authority Corridor Evidence Pack
## 2026-09-27

> Status: M1 EVIDENCE CLOSURE / PROPOSED CORRIDOR
> Owner: `authority-governance`
> Scope: semantic/evidence mapping only; no production implementation.
> Primary candidate: existing P1-06 `agency.execute@1` → `message.send@1`.

## 1. Purpose

Map one existing governed consequential action end-to-end and establish the smallest evidence package needed to prove:

1. the requested effect and actor are explicit;
2. live authority is checked before the effect;
3. runtime enforcement remains distinct from semantic authorization;
4. positive and negative outcomes are reconstructable;
5. no peer semantic owner is absorbed by CFA-04.

This is a corridor analysis, not a generic authorization-engine design.

## 2. Corridor selected

### Candidate action

`agency.execute@1` in `omega-baseline/omega-final/plugins/vivim-agent/src/index.ts`.

The existing Phase-1 implementation intentionally narrows to:

```
principal
→ explicit consent reference
→ D-452 invocation frame
→ fixed capability message.send@1
→ runtime/provider target
→ governed event
```

The action's wire shape is defined in `plugins/vivim-agent/src/governance.ts`.

### Why this candidate

- It already crosses the Authority / Work / Capability / Runtime boundaries.
- It explicitly calls `law.describe@1` to resolve the current consent state.
- It explicitly calls `invoke.check@1` with a frame before calling `message.send@1`.
- It records both refused and executed governed-event outcomes.
- The repository already states that its live authenticated provider realization remains separately unverified, which prevents accidental conflation of recorded-fixture proof with live external proof.

## 3. Positive corridor

### Requested effect

`message.send@1`.

Source: P1-06 Phase-1 governed-action contract.

### Actor / principal

The request carries:

- `principal.principal`
- `principal.kind = human | session`

The same principal is placed into the D-452 frame as both `caller` and `behalf` for this single-principal slice.

**Owner:** CFA-02 for canonical identity/data semantics; CFA-04 for the authority interpretation of the principal relationship.

### Authority basis

The Phase-1 vehicle uses explicit consent:

`authority.kind = consent`

with:

`authority.consentRef`

The agent code first reads current consent rows through `law.describe@1` and accepts only a matching active consent whose scope is compatible with `message.send@1`.

**Owner:** CFA-04.

### Capability

The action is deliberately fixed to:

`message.send@1`

The Phase-1 implementation does not treat arbitrary capability selection as part of the proof vehicle.

**Owner:** CFA-06 for semantic Capability/effect meaning; this corridor consumes that fact.

### Invocation

The implementation constructs an explicit D-452 frame:

```
{
  caller,
  behalf,
  op: "message.send@1",
  scope: "message.send@1",
  authority: { kind: "consent", ref: consentRef },
  intentRef?
}
```

It passes the frame to `invoke.check@1` with:

- target operation;
- operation class `EXTERNAL_MUTATION`;
- known operation set;
- the current live consent result;
- current time;
- causation ID.

**Owner:** CFA-04 for the semantic authority contract; CFA-10 owns mechanical enforcement of the resulting gate.

### Runtime / realization

Only after a framed, non-refused invocation result does the implementation call the target `message.send@1`.

The repository's migration slice maps the target to the provider-browser path, including session attach, promoted realization, parser pins, streamed chunks, vault persistence and output evidence.

**Owner:** CFA-06 for realization/provider semantics; CFA-10 for non-bypassable runtime enforcement; CFA-05 for Work/execution semantics.

### Evidence / result

The governed event captures:

- principal;
- authority statement;
- capability;
- invocation verdict/frame digest;
- execution attempted/completed;
- overall outcome;
- reason on refusal;
- optional Intent reference;
- target result on execution.

The D-452 invocation ledger separately provides the invocation row keyed by causation.

**Owners:** CFA-05 owns Work/execution outcome semantics; evidence remains cross-cutting; CFA-02 owns durable record continuity where applicable.

## 4. Positive success condition

A positive corridor is semantically established when all of the following are true:

- the actor/principal is explicit and valid for the request;
- an explicit consent basis exists;
- the current consent registry resolves that exact consent as active and in scope;
- the invocation frame is complete;
- the operation is known;
- the target remains within declared scope;
- `invoke.check@1` returns a framed result;
- the target capability executes only after the gate;
- the resulting event and invocation evidence can be linked by causation ID;
- any external/provider result remains separately classified from authorization evidence.

### Proof status

**DESIGN/IMPLEMENTATION:** PROVEN in current repository evidence.

**RECORDED-FIXTURE / TEST:** existing Ω falsifiers establish the D-452 invocation properties; P1-06 establishes the governed-action wire path.

**LIVE EXTERNAL:** UNVERIFIED here. The migration record explicitly marks authenticated Chrome owner-run proof as pending.

## 5. Negative corridor

### Negative case A — expired/revoked consent

Change the current authority state so the cited consent is no longer live, then submit the same semantic action.

Expected path:

```
same principal
→ same consentRef
→ law.describe resolves inactive/missing live consent
→ invoke.check@1
→ INVOKE_AUTHORITY_UNRESOLVED
→ target message.send@1 NOT CALLED
→ governed event outcome REFUSED
→ refusal reason preserved
```

The precise refusal text is governed by the D-452 invocation decision; the existing P1-06 implementation passes the non-live consent into the invocation gate rather than asserting liveness from the request.

### Negative case B — out-of-scope invocation

Keep a valid authority basis but submit a frame whose scope does not cover the requested operation.

Expected result:

`INVOKE_SCOPE_EXCEEDED`

No target execution may occur.

### Negative case C — principal mismatch

Supply an authority statement whose principal differs from the request principal.

The Phase-1 request validator rejects the malformed authority relationship before target execution.

### Negative case D — frameless mutation

Any external-mutation path lacking the required D-452 frame must refuse with:

`INVOKE_FRAME_MISSING`

The target must not execute.

## 6. Negative success condition

A negative corridor is proved only when the system demonstrates both:

1. a deterministic refusal with an explicit reason; and
2. evidence that the consequential target did not execute.

A refusal without target non-execution evidence is insufficient to prove the semantic safety claim.

## 7. Ownership map

| Corridor element | Semantic owner | Durable data owner | Runtime/enforcement owner | Evidence requirement |
|---|---|---|---|---|
| Principal identity | CFA-02 | CFA-02 | N/A | identity ref must resolve |
| Intended effect / Intent | CFA-03 when present | CFA-02 | N/A | Intent ref only; never permission |
| Capability/effect meaning | CFA-06 | CFA-02 if durable reference | CFA-10 for generic gate enforcement | capability definition + selected realization |
| Authority basis | CFA-04 | bounded references/records as reconciled with CFA-02 | CFA-10 enforces resulting gate | live authority source |
| Consent / standing / delegation | CFA-04 | CFA-02 boundary unresolved per existing seam | CFA-10 consumes gate result | source rows + liveness |
| Invocation frame | CFA-04 | invocation ledger / durable join as currently governed | CFA-10 enforces gate boundary | frame + verdict + causation |
| Work / Attempt | CFA-05 | CFA-02 | CFA-10 where execution fencing applies | attempt attribution/recovery |
| Provider / realization / session | CFA-06 | CFA-02 for durable records | CFA-10 generic enforcement | live realization attribution |
| Runtime refusal/enforcement | CFA-10 | runtime/evidence join remains open | CFA-10 | accepted/refused gate trace |
| External effect / outcome | CFA-05 + CFA-06 split | CFA-02 for durable continuity | N/A | external observation distinct from authorization |

## 8. Minimum reconstruction package

The minimum evidence needed to explain one decision is:

```
principal reference
+ requested operation/effect
+ target/capability reference
+ authority basis reference
+ authority liveness inputs at decision time
+ invocation frame
+ invocation verdict + refusal if any
+ causation ID
+ runtime enforcement observation
+ Work/Outcome reference when execution occurred
+ external/provider observation when applicable
```

Important split:

- **Authority claim** = what permission basis was resolved.
- **Enforcement evidence** = what runtime did with that result.
- **Effect evidence** = what happened externally.
- **Outcome** = Work-level result.

None of these replaces another.

## 9. What the current repository proves

### Established

- D-412 provides non-recycling principal records.
- D-452 requires explicit frames and live authority re-resolution at the invocation gate.
- D-453 makes standing scoped, expiring and revocable.
- D-454 makes delegation attenuating and vault-resolved.
- D-455 governs consequential adaptation with explicit ratification/rollback/census controls.
- P1-06 `agency.execute@1` consumes live consent through `law.describe@1`, performs an explicit invocation check, then invokes `message.send@1` only on a framed result.
- The negative invocation cases are represented by named D-452 refusals and falsifiers.

### Not established by this package

- authenticated owner-machine live execution;
- complete provider-side external effect proof;
- final CFA-02 AuthorityCitation durable schema;
- complete Work multi-step/retry authority semantics;
- a final user-facing explanation surface;
- broad heterogeneous capability/effect coverage.

## 10. Falsifiers for this evidence package

F-ACP.1 — **Authority bypass**  
If `message.send@1` can be reached from the selected corridor without `invoke.check@1` or equivalent governed authority resolution, the corridor mapping is false.

F-ACP.2 — **Stale permission**  
If an already-used consent remains accepted after a required revocation/expiry re-check, the corridor mapping is false.

F-ACP.3 — **Refusal leakage**  
If a negative authority result still causes the target effect, the semantic/runtime separation is false.

F-ACP.4 — **Evidence collapse**  
If a successful provider response is used as proof that authorization existed, the reconstruction model is false.

F-ACP.5 — **Ownership leakage**  
If the CFA-04 design begins defining canonical Work, Provider, World, Data or Runtime semantics instead of consuming explicit peer-owned inputs, the boundary is false.

## 11. M1/M3 conclusion

**Finding:** the repository contains enough current evidence to define a thin, fully attributable Authority corridor around the existing P1-06 governed action, but **not enough to claim destination-grade live external authorization proof**.

The strategic next proof is therefore not a new authorization engine. It is:

```
peer-owned seam evidence
→ one governed action
→ live authority check
→ runtime gate observation
→ attributable effect
→ reconstructable result
```

The largest remaining blockers are external/live realization evidence and the unresolved durable Data join, not absence of the core authority primitive.

## Evidence index

1. `omega-baseline/omega-final/docs/decisions/D-412-principal-seam.md`
2. `omega-baseline/omega-final/docs/decisions/D-452-invocation.md`
3. `omega-baseline/omega-final/docs/decisions/D-453-standing.md`
4. `omega-baseline/omega-final/docs/decisions/D-454-delegation.md`
5. `omega-baseline/omega-final/docs/decisions/D-455-adaptation-governance.md`
6. `omega-baseline/omega-final/plugins/vivim-agent/src/governance.ts`
7. `omega-baseline/omega-final/plugins/vivim-agent/src/index.ts`
8. `omega-baseline/omega-final/plugins/vivim-law/src/invocation.ts`
9. `omega-baseline/omega-final/plugins/vivim-law/src/index.ts`
10. `omega-baseline/omega-final/plugins/vivim-law/src/standing.ts`
11. `omega-baseline/omega-final/plugins/vivim-agent/src/delegation.ts`
12. `omega-baseline/omega-final/tooling/gates/test/f-invoke.test.ts`
13. `omega-baseline/omega-final/tooling/gates/test/f-standing.test.ts`
14. `omega-baseline/omega-final/tooling/gates/test/f-delegate.test.ts`
15. `docs/migration/FIRST_VERTICAL_SLICE.md`
16. current CFA-04/CFA-05/CFA-06/CFA-10/Data strategic roadmap and task artifacts.
