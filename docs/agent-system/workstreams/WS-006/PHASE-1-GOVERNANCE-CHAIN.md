# P1-06 / WS-006 — PHASE-1-GOVERNANCE-CHAIN

> **Status:** DESIGNED + CODED / **NEEDS RUN**
>
> **Date:** 2026-09-25
> **Repository:** `owenservera/BCP-dev`
> **Workstream:** P1-06 — Ω Agency, Execution & Governance
> **Scope:** one governed action, one success, one deterministic refusal
>
> **Ground truth:** `docs/agent-system/workstreams/WS-002/PHASE-1-TRUTH-BASELINE.md`
>
> This document does not claim a live execution. No sample event log is
> presented as evidence. M4 and M5 remain pending until the owner performs the
> real run and supplies the resulting vault/event records.

---

## 1. P1-02 truth consumed

P1-02 establishes that:

- Path A and Path B implementations are unavailable in the current repository.
- The authority-pointer pilot is unavailable.
- `provider-browser` is a real fixture browser realization, not proof of live Chrome.
- `message.send@1` is an existing provider-browser fixture capability/contract.
- MIG-001/MIG-002 are migration records, not live-proof evidence.

P1-06 therefore does **not** reconstruct or rely on the missing Path-A/B work.

For this Phase-1 chain, the fixed target capability is:

**`message.send@1`**

This is the concrete realization of the owner-supplied `{{CAPABILITY}}` placeholder
for this round. The chain is intentionally written around that one capability;
it is not a generic authorization framework.

---

# 2. M1 — Minimal principal / authority model

## 2.1 Principal

A principal is the identity for whom the governed action is being requested.

This slice permits exactly two principal kinds:

- `human` — the owner/user directly requesting the action;
- `session` — a session acting on the owner's behalf, but still named as the
  principal in the request.

There is no delegation relationship in this slice.

A principal is represented as:

```text
principal = {
  principal: non-empty string,
  kind: "human" | "session"
}
```

The same principal string must appear in the authority statement.

## 2.2 Authority statement

The minimum authority is an explicit, live consent for exactly the selected
capability:

```text
authority = {
  kind: "consent",
  consentRef: string,
  principal: same principal string,
  capability: "message.send@1",
  scope: "message.send@1"
}
```

This is deliberately narrower than a general grant:

- no wildcard scope;
- no standing;
- no delegation;
- no expiry machinery;
- no budget;
- no adaptation;
- no implicit/root bypass.

The mechanical authorization predicate is:

```text
principal matches authority.principal
AND
authority.kind == "consent"
AND
authority.capability == "message.send@1"
AND
authority.scope == "message.send@1"
AND
consentRef resolves to a LIVE consent
AND
live consent principal == principal
AND
live consent covers message.send@1
```

The request validator enforces the shape before the law gate is called.

---

# 3. M2 — Invocation chain

The committed chain is implemented as:

```text
principal
  ↓
explicit authority statement
  ↓
D-452 invoke.check@1
  ↓
live consent resolution
  ↓
capability match: message.send@1
  ↓
target provider-browser message.send@1
  ↓
governed event row in ns agency
```

The implementation is:

- `omega-baseline/omega-final/plugins/vivim-agent/src/governance.ts`
- `omega-baseline/omega-final/plugins/vivim-agent/src/index.ts`
- `omega-baseline/omega-final/plugins/vivim-agent/plugin.json`
- `omega-baseline/omega-final/plugins/vivim-law/src/policy.ts`

### Existing Ω machinery used

**D-412 principal identity** supplies the repository's established principal
identity seam.

**D-452 invocation** is the actual authorization boundary. The chain calls
`invoke.check@1` and supplies the authority rows as live data on every
invocation. It does not cache a successful decision.

D-452's frame is:

```text
{
  caller: principal,
  behalf: principal,
  op: "message.send@1",
  scope: "message.send@1",
  authority: {
    kind: "consent",
    ref: consentRef
  }
}
```

Because `behalf == caller`, no deputy/delegation path is entered.

### Execution ordering

The code enforces this ordering:

1. Validate principal/authority/capability data.
2. Construct the D-452 invocation frame.
3. Ask `invoke.check@1` to resolve the live authority.
4. If refused:
   - do **not** call `message.send@1`;
   - write the governed refusal event;
   - return REFUSED.
5. If framed:
   - call the actual `message.send@1` capability;
   - write the governed success event;
   - return EXECUTED.

The target is therefore not reachable through this chain until the authorization
verdict is `framed`.

### Code-level fail-closed property

The target call occurs only after:

```text
invocation.verdict === "framed"
```

A refused invocation has:

```text
execution.attempted = false
execution.completed = false
outcome = "REFUSED"
```

---

# 4. M3 — Deterministic refusal case

The Phase-1 refusal case is deliberately simple:

> **The request names a consentRef that is not live.**

The request still contains:

- a valid human/session principal;
- the exact `message.send@1` capability;
- the exact `message.send@1` scope;
- a consent-shaped authority statement.

Only the live authority fact is invalid.

The expected D-452 refusal is:

```text
INVOKE_AUTHORITY_UNRESOLVED
```

with D-452's attributable refusal sentence.

The target `message.send@1` must not be called.

The refusal receives the same governed event structure as success, with:

```text
outcome = "REFUSED"
execution.attempted = false
execution.completed = false
reasonCode = "INVOKE_AUTHORITY_UNRESOLVED"
reasonSentence = <actual D-452 sentence from the run>
```

This is deterministic because the same principal, capability, scope and
non-live consent condition produce the same D-452 verdict.

---

# 5. Governed event format

Every attempt handled by `agency.execute@1` writes exactly one event to:

```text
vault namespace: agency
id: event:<causationId>
kind: governed-action@1
```

The event contains:

```text
{
  kind,
  eventId,
  at,
  causationId,

  principal: {
    principal,
    kind
  },

  authority: {
    kind,
    consentRef,
    principal,
    capability,
    scope
  },

  capability,

  consentChecked: true,

  invocation: {
    frameDigest,
    verdict,
    authorityResolved
  },

  execution: {
    attempted,
    completed
  },

  outcome,

  reasonCode?,        // refusal only
  reasonSentence?,    // refusal only
  intentRef?,         // if supplied
  targetResult?       // success only
}
```

The event references the corresponding D-452 invocation row:

```text
ns: invoke
id: inv:<causationId>
```

This makes the governed event reconstructable together with the underlying
invocation evidence rather than relying on prose logs.

---

# 6. M4 — [NEEDS RUN] real governed event emission

**M4 is NOT PROVEN yet.**

No live event output has been fabricated or inferred from source inspection.

The owner must perform two real invocations after the composition containing
the Phase-1 chain and the P1-08 `message.send@1` implementation is available.

## Run prerequisites

The owner needs a composition that actually grants:

- `vivim.agent`
- `vivim.law`
- `vivim.vault`
- the `agency.execute@1` route
- `port:invoke.check@1`
- `port:message.send@1`

The provider-browser prerequisites for `message.send@1` must also be genuinely
satisfied: attached session, promoted browser realization and valid parser pin.
Those are provider-browser's existing fail-closed bars.

## Run A — success

Use a real owner/session principal and a real live consent row for exactly
`message.send@1`.

Invoke:

```text
agency.execute@1
{
  principal: {
    principal: "<REAL-OWNER-OR-SESSION-PRINCIPAL>",
    kind: "human" | "session"
  },
  authority: {
    kind: "consent",
    consentRef: "<REAL-LIVE-CONSENT-ID>",
    principal: "<SAME-PRINCIPAL>",
    capability: "message.send@1",
    scope: "message.send@1"
  },
  capability: "message.send@1",
  payload: <REAL-P1-08-MESSAGE-SEND-PAYLOAD>
}
```

Expected **shape**, not fabricated output:

```text
Outcome = EXECUTED
agency/event:<causationId> exists
invoke/inv:<causationId> exists
principal is the real supplied principal
authority points to the real consent
capability = message.send@1
execution.attempted = true
execution.completed = true
```

Record the actual vault rows returned by the run.

## Run B — deterministic refusal

Repeat with the same principal and capability, but use a consent reference that
does not resolve to a live consent.

```text
authority.consentRef = "<REAL-NON-LIVE-CONSENT-ID>"
```

Do not create a fake consent just for this run.

Expected shape:

```text
Outcome = REFUSED
reasonCode = INVOKE_AUTHORITY_UNRESOLVED
agency/event:<causationId> exists
invoke/inv:<causationId> exists
execution.attempted = false
execution.completed = false
```

Record the actual event and invocation rows.

## What the owner must return to this workstream

Return the **actual persisted rows**, not a paraphrase:

1. success `agency/event:<causationId>`;
2. success `invoke/inv:<causationId>`;
3. refusal `agency/event:<causationId>`;
4. refusal `invoke/inv:<causationId>`.

Include the vault revision/CID metadata if the runtime exposes it.

**Do not mark M4 PROVEN until those four real records exist.**

---

# 7. M5 — [NEEDS RUN] reconstruction check

M5 cannot honestly be performed yet.

It must be performed only after M4 supplies the actual event rows.

The reconstruction procedure is intentionally strict:

1. Start a fresh reasoning pass.
2. Provide only the two `agency` event rows plus their referenced `invoke`
   rows if necessary to resolve the invocation citation.
3. Do not provide this design document.
4. Do not provide source code.
5. Do not provide the run command or prior conversation.
6. Reconstruct, separately for success and refusal:
   - principal;
   - principal kind;
   - authority kind;
   - consent reference;
   - capability;
   - scope;
   - invocation verdict;
   - authority resolution;
   - whether execution was attempted;
   - whether execution completed;
   - outcome;
   - refusal reason where applicable.
7. Compare the reconstruction against the actual rows.
8. If any item cannot be recovered, revise the event schema and rerun both
   cases. Do not mark M5 passed by interpretation of missing fields.

### M5 acceptance condition

M5 = **PROVEN** only if the event evidence alone permits an independent reader
to reconstruct:

```text
principal
→ authority
→ consent
→ invocation
→ capability
→ execution
→ outcome
```

for both cases.

---

# 8. Current milestone status

| Milestone | Status | Evidence |
|---|---|---|
| **M1** | **DONE — DESIGN/CODE** | Principal + consent-only authority model committed. |
| **M2 design/code** | **DONE — CODE** | `agency.execute@1` wired through D-452 then target call. |
| **M2 execution** | **NEEDS RUN** | No real target execution has been performed in this workstream. |
| **M3 design/code** | **DONE — CODE** | Non-live consent deterministically maps to D-452 refusal. |
| **M3 execution** | **NEEDS RUN** | No real refusal event has been captured. |
| **M4** | **NEEDS RUN** | Real governed event rows do not yet exist. |
| **M5** | **BLOCKED ON M4** | Cannot reconstruct an event that has not actually been emitted. |

---

# 9. Explicit non-goals

This slice intentionally does **not** implement:

- standing;
- delegation;
- delegation chains;
- budgets;
- rate limits;
- adaptation;
- policy learning;
- trust scoring;
- autonomous authority;
- a general-purpose agency framework;
- Path-A or Path-B implementation;
- live Chrome/CDP realization.

Those remain outside this Phase-1 proof.

---

# 10. Code changes

Committed to `main`:

1. `omega-baseline/omega-final/plugins/vivim-agent/src/governance.ts`
   — principal/authority/event data model and fixed capability validation.
2. `omega-baseline/omega-final/plugins/vivim-agent/src/index.ts`
   — `agency.execute@1` real authorization/execution/event chain.
3. `omega-baseline/omega-final/plugins/vivim-agent/plugin.json`
   — declares the new engine contribution and required routed dependencies.
4. `omega-baseline/omega-final/plugins/vivim-law/src/policy.ts`
   — classifies `agency.execute@1` as MUTATION in the versioned law policy.

No real execution result is claimed by these commits.

---

# 11. Proof status

**Current status: DESIGNED + CODED, NOT LIVE-PROVEN.**

The repository now contains the smallest concrete authorization chain needed for
the selected action:

```text
principal
→ explicit consent authority
→ D-452 live invocation check
→ message.send@1
→ governed agency event
```

The next proof boundary is the owner-run. Until the real success and refusal
records exist, this document must be treated as a **chain design and implementation
artifact, not evidence of a successful governed execution**.

**M4 and M5 remain intentionally open.**
