# CFA-06 — Stage E L2 Capability / Provider / Realization Basis Adapter
## 2026-09-27

> Status: **CHARACTERIZATION COMPLETE — OWNER-BOUNDED**
> CFA: CFA-06 — Capability / Provider / Realization
> agent_id: `capability-provider-realization`
> Milestone: Stage E L2 — Source / Runtime Basis Adapters
> Classification: adapter characterization; not runtime-join implementation, not Ω law, not shared semantic-boundary activation.

## 1. Adapter record

| Field | Characterization |
|---|---|
| `adapterId` | `cfa06.provider-realization-basis.v1` |
| `ownerCFA` | CFA-06 |
| `basisKind` | `capability-provider-realization-observation` |
| Canonical source | Ω vault `ns="providers"`, ProviderRealization record identified by `providerRealizationId(archetypeSlug, providerId)` |
| Current source identity | `providers / realization:<archetypeSlug>:<providerId> / rev / cid` returned by the existing vault record |
| Primary semantic dimensions | capability archetype/op, provider identity, provider class, realization lifecycle, parser pin, realization evidence, replacement lineage |
| Runtime observation supplement | provider/session observation evidence when a selected trace requires it |
| Status | **CLOSED for canonical realization-record basis; runtime implementation drift basis remains UNKNOWN** |

## 2. Current evidence

### OBSERVED / CURRENT — canonical realization identity

`omega-baseline/omega-final/contracts/src/provider.ts` defines `ProviderRealization` in the `providers` namespace with:

- `archetypeSlug`;
- `providerId`;
- `providerClass`;
- `status`;
- discovery / operation / entity references;
- stream references;
- `evidenceRefs`;
- `supersedes`;
- `createdAt`;
- optional `parserPins`;
- reader-visible `rev`.

The canonical record id is derived by `providerRealizationId(archetypeSlug, providerId)`.

### OBSERVED / CURRENT — durable revision/CID resolution

The current provider registry resolves realization rows from vault `ns="providers"` and obtains `rev` through `vault.get@1`. The vault response also carries `cid`.

Therefore the strongest currently available canonical comparison token for a realization observation is:

`BasisRef {
  sourceKind: "vault.providers.provider-realization",
  sourceId: "realization:<archetypeSlug>:<providerId>",
  rev,
  contentDigest: cid
}`

The adapter does not create a new identity registry.

### OBSERVED / CURRENT — lifecycle/evidence semantics

Realization status transitions are evidence/probe governed:

`PROMOTED → DEGRADED → TESTING → REQUIRES_REDISCOVERY → PROMOTED`

as applicable through `discovery.verify@1` and `discovery.heal@1`. Provider realization records carry evidence references and `supersedes` lineage.

### OBSERVED / CURRENT — browser session distinction

The existing browser substrate keeps mediation and upstream-service identity distinct:

- `SessionRecord.providerId = "browser"` is the mediation provider;
- `LiveSessionDescriptor.providerId = "chatgpt"` identifies the upstream service.

The adapter therefore does **not** collapse provider, mediation, session or upstream service into one token.

## 3. Resolution rule

For a requested capability/archetype and selected provider realization:

1. derive the canonical realization id with `providerRealizationId(archetypeSlug, providerId)`;
2. resolve the latest vault row for that id through the existing provider registry/vault path;
3. read the canonical record with `vault.get@1`;
4. require a valid vault revision;
5. use the returned `rev` plus `cid` as the current realization basis token;
6. retain the record's `evidenceRefs`, `supersedes`, lifecycle status and parser-pin references as attributable dependency/evidence context;
7. when a trace requires runtime/session observation, resolve the relevant session/evidence separately and preserve its own identity rather than folding it into the realization token.

No fallback to a timestamp, route name, class name, or file proximity is permitted as a canonical realization basis.

## 4. BasisRef / dependency-token shape

### Canonical realization BasisRef

```text
sourceKind = "vault.providers.provider-realization"
sourceId   = realization:<archetypeSlug>:<providerId>
rev        = vault revision
contentDigest = vault CID
```

### Supplemental dependency tokens

Where material to the selected derived view, retain explicit tokens for:

```text
providerClass
realizationStatus
parserPin/version
evidenceRef(s)
supersedesRef
sessionRef / session revision
```

These are dependency/evidence references, not a new universal identity layer.

## 5. Freshness comparison rule

A capability/provider/realization derived view may remain **CURRENT** only when:

1. its canonical realization BasisRef still resolves;
2. the current vault `rev` and `cid` match the recorded basis;
3. every declared supplemental dependency required by that view still matches its own basis;
4. the view's derivation identity matches the generic L1 contract;
5. no domain-defined contradictory realization evidence invalidates the derivation.

Stored `freshness` is only a cache hint.

A change in realization record revision or CID is sufficient to make a dependent derived view **STALE** before recomputation.

## 6. STALE behavior

Return **STALE** when any known relevant basis changes, including:

- the realization record advances to a new vault revision/CID;
- the realization replacement lineage changes in a way material to the derived view;
- a declared parser/contract dependency changes;
- a selected session/reference dependency changes where that dependency was explicitly part of the view basis.

The adapter must not continue serving the previous derived result as CURRENT after such a detected mismatch.

## 7. UNRESOLVABLE behavior

Return **UNRESOLVABLE** when:

- the canonical realization id cannot be resolved from the required inputs;
- the vault record is missing;
- the vault record cannot provide a valid revision;
- a required declared dependency cannot be resolved;
- a required runtime/session observation basis is unavailable for a view that explicitly depends on it.

A missing or unavailable basis must never be converted into guessed CURRENT.

## 8. CONFLICTED behavior

CFA-06 may classify a view as **CONFLICTED** when the current realization-specific evidence contains a provider-domain contradiction that the derivation is explicitly capable of recognizing, for example mutually incompatible observations referring to the same realization claim.

The adapter itself does not decide which external observation is true.

It records the conflicting evidence references and leaves authority/policy interpretation outside CFA-06's self-knowledge adapter.

Where no provider-domain contradiction rule is available, the correct result is **UNKNOWN**, not inferred conflict.

## 9. Falsifier

### F06-L2-01 — realization revision drift

1. Record a derived observation against realization BasisRef `providers / realization:X / rev=N / cid=C1`.
2. Replace/update the canonical realization record through the existing governed verification/healing path.
3. Resolve the current record and observe `rev=N+1` and/or `cid=C2`.
4. Revalidate the prior derived view.

**Expected:** prior view becomes **STALE** (or is recomputed to a new current basis). It cannot remain CURRENT against the changed canonical realization record.

### F06-L2-02 — unresolved realization

1. Request a realization whose canonical vault record cannot be resolved.
2. Attempt derived-view validation.

**Expected:** **UNRESOLVABLE**. No timestamp, route or historical cached result may substitute for the missing canonical basis.

### F06-L2-03 — replacement continuity

Replace realization A with compatible realization B while preserving the semantic capability identity.

**Expected:** realization basis/reference changes and lineage remains attributable; semantic Capability identity is not rewritten merely because realization changed.

## 10. Evidence and source refs

**CURRENT / OBSERVED**

- `omega-baseline/omega-final/contracts/src/provider.ts` — canonical `ProviderRealization`, canonical realization id and reader-visible revision.
- `omega-baseline/omega-final/plugins/vivim-providers/src/index.ts` — provider registry reads realization rows through the vault and exposes revision.
- `omega-baseline/omega-final/plugins/provider-browser/src/session.ts` — explicit SessionRecord / LiveSessionDescriptor identity split and revisioned capture/session references.
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/CAPABILITY-PROVIDER-REALIZATION/RESULTS/M1-M2-EVIDENCE-PACKAGE-2026-09-27.md` — current provider/account/session evidence and unresolved join limits.
- `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/CAPABILITY-PROVIDER-REALIZATION/OWNER-ALIGNMENT-2026-09-27.md` — provider/account/session/realization semantic ownership and replacement invariant.
- `omega-baseline/omega-final/docs/decisions/D-326-healing-writes.md` — evidence-backed realization healing/revision/supersedes lifecycle.

## 11. What this adapter deliberately does not claim

### UNKNOWN

1. **Provider implementation content identity:** the provider-browser manifest currently exposes an empty `contentHash`; existing realization revision/CID proves the stored realization record, not every byte of the executing provider implementation.
2. **Universal external observation token:** different providers may require provider-specific observation identities beyond the canonical realization record.
3. **Account-specific basis:** Account semantics are owned by CFA-06, but the current Ω substrate does not expose a canonical durable Account join.
4. **Generalized Model basis:** model identity is optional and remains corridor/provider-specific.
5. **Generalized Resource basis:** resource identity is optional and remains corridor-specific.
6. **Provider/session live proof:** owner-machine authenticated live-provider proof remains separately gated.

### DEFERRED

- a universal provider implementation-content digest contract;
- a universal account/model/resource basis adapter;
- runtime join implementation;
- cross-provider external-observation normalization;
- any second provider identity or freshness store.

### CONFLICTED

No direct ownership conflict identified.

## 12. Boundary invariants

- `Capability ≠ Provider ≠ Realization`
- `Provider ≠ Account ≠ Session ≠ Resource`
- `Routing ≠ Authorization`
- `Realization evidence ≠ Work Outcome`
- `Provider-specific repair ≠ generic Evolution`
- `Evidence ≠ Authority`
- `Unknown ≠ Failure`
- `stale ≠ false`
- a realization/provider/session replacement does not by itself redefine semantic Capability identity;
- the adapter does not create a second canonical identity or persistence store;
- self-knowledge may describe realization state but cannot authorize an operation or mutate Ω law.

## 13. Closure verdict

**ADAPTER STATUS: CLOSED — OWNER CHARACTERIZATION COMPLETE**

The adapter is closed against the strongest canonical basis available today: the revision/CID-addressed ProviderRealization vault record plus explicitly declared dependent references.

The closure intentionally does **not** promote provider implementation content identity, account/model/resource joins, or live external observation into facts that the repository has not yet proved.

L2 central reconciliation may therefore consume this adapter as a **current owner characterization**, while preserving the listed UNKNOWN / DEFERRED items.

**No runtime self-knowledge join was implemented.**
**No shared semantic boundary was activated.**
**No Ω law was changed.**
