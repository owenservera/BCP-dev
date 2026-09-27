# CFA-06 — M2 Minimum Join-Shape Research — 2026-09-27

> Status: RESEARCH COMPLETE — NOT ADOPTED
> Scope: smallest conceptual join among Capability / Realization / Provider / Account / Model / Session / Resource
> Mode: current repository evidence only; no peer Round-1 outputs consumed
> Implementation: NONE

## Executive conclusion

The smallest defensible M2 shape is **not a new durable entity or a second store**.

It is a **typed, non-authoritative join projection** assembled from existing durable references:

`Capability`
→ `Realization`
→ `Provider`
→ `Account?`
→ `Model?`
→ `Session?`
→ `Resource?`

with:

- evidence references attached to the realization/join where needed;
- Authority evaluated separately at execution time;
- Work/Attempt owning execution lifecycle separately;
- durable identity/revision/lineage remaining in the canonical Data seam.

The join is therefore a **relationship view**, not a new source of truth.

## 1. Existing evidence

### Capability

**OBSERVED / CURRENT**

Current Ω uses capability semantics in two forms:
- `ProviderRealization.archetypeSlug` identifies the realization's semantic archetype.
- `WorkStep.capability` identifies the capability needed by a Work step.
- `resolve.classify@1` produces a capability string from an automation rule or promoted realization.

There is no canonical standalone `Capability` interface in the current Ω subtree.

**DERIVED / CURRENT**

A capability can presently be represented by the stable semantic operation/archetype reference without introducing a separate capability record.

**UNKNOWN**

Whether aliases, operation revisions, or future capability families require a richer identity than `<archetypeSlug>`.

### Realization

**OBSERVED / CURRENT**

`ProviderRealization` is the strongest canonical concrete realization record currently present:
- `archetypeSlug`
- `providerId`
- `providerClass`
- `status`
- discovery/op/entity/stream references
- evidence references
- supersession
- optional parser pins
- vault revision on read

Realization ids are deterministically derived from archetype + provider id.

**DERIVED / CURRENT**

A realization is the minimum concrete bridge between semantic capability and an actual provider implementation.

### Provider

**OBSERVED / CURRENT**

`ProviderRealization.providerId` is the current provider identity field.

The provider registry is realization-driven and projects current-state provider rows from `ns="providers"`.

**CONFLICT / CURRENT**

The browser substrate exposes a second provider-like identity:
- `SessionRecord.providerId = "browser"`
- `LiveSessionDescriptor.providerId = "chatgpt"`

This is consistent with a mediation-vs-service distinction, but the current canonical vocabulary does not yet name that distinction explicitly.

**PROPOSED**

Treat these as distinct semantic roles:
- **Provider/service identity** — the external provider/service being realized.
- **Mediation/transport identity** — the mechanism used to reach it (for example browser-mediated).

Do not force either role to become a new record until evidence requires one.

### Account

**UNKNOWN / CURRENT**

No canonical `accountId` or Account record was found in the current Ω provider/session substrate.

**PROPOSED**

Account is an optional reference in the join.

Its omission is meaningful: not every provider/operation necessarily has a user-account concept.

Account identity must remain separate from credentials/secrets and separate from Authority.

### Model

**UNKNOWN / CURRENT**

No canonical model identity was found in the current M2 substrate.

**PROPOSED**

Model is an optional reference or value only when the provider exposes a materially selectable model.

Do not create a Model record merely because an LLM provider happens to have one.

A model selection is not itself authorization and does not redefine Capability identity.

### Session

**OBSERVED / CURRENT**

`SessionRecord` exists under `ns="providers"`.

It contains:
- session identity
- archetype
- parser version
- capture reference
- lifecycle status
- simulation/live mode
- optional live descriptor

The session record is reference-oriented: capture bytes are not embedded.

**DERIVED / CURRENT**

Session is a concrete runtime attachment state, not the semantic identity of Provider or Account.

**UNKNOWN**

The final durable session lifecycle and the canonical relationship between Session and Account are not yet settled.

### Resource

**UNKNOWN / CURRENT**

No canonical `resourceId` or generalized execution-resource record was found in the current M2 substrate.

**PROPOSED**

Resource must remain polymorphic until the World and Work seams clarify whether a given resource is:
- an external World object;
- a local execution resource;
- a provider-owned operational resource;
- or another bounded resource class.

Do not make Resource synonymous with Session, Account, browser tab, or external object.

### Work / Attempt

**OBSERVED / CURRENT**

`WorkStep.capability` identifies requested capability semantics.

`WorkAttempt` is the canonical attempt lifecycle record.

Current `work.ts` does not yet carry an explicit realization/account/session/resource reference tuple.

**DERIVED / CURRENT**

CFA-06 must provide concrete selection/realization context to Work, but must not absorb Work lifecycle or Attempt state.

## 2. Minimum conceptual join

The smallest useful conceptual shape is:

`RealizationJoin` (PROPOSED, non-durable by default)

~~~text
{
  capability: {
    opOrArchetype: string
  },

  realization: {
    ref: { ns, id, rev }
  },

  provider: {
    serviceId: string
    mediationId?: string
  },

  accountRef?: { ns, id, rev },

  modelRef?: { ns, id, rev },

  sessionRef?: { ns, id, rev },

  resourceRef?: { ns, id, rev },

  evidenceRefs: Array<{ ns, id, rev }>
}
~~~

This is a conceptual join, not an adopted TypeScript contract.

### Why the join is this small

1. **Capability is not repeated into every provider-specific record.**
2. **Realization is the concrete bridge** and already has a durable canonical record.
3. **Provider is not inferred from Session alone.**
4. **Account / Model / Session / Resource are optional**, because absence can be semantically valid.
5. **References preserve one-data-store discipline.**
6. **Evidence remains evidence, not authority.**
7. **Authority is deliberately absent from the join.**
8. **Work/Attempt is deliberately absent from the join's ownership model.**

## 3. Mandatory non-collapse rules

### Capability ≠ Realization

A realization can be replaced while semantic capability remains unchanged.

Changing the realization must not silently rewrite the semantic capability.

### Provider ≠ Account

Provider identifies the service/realization domain.

Account identifies the particular user-owned account context, when one exists.

A credential or secret is neither identity.

### Provider ≠ Mediation

The current browser evidence makes this distinction necessary.

`browser` can be the mediation path while `chatgpt` is the external service identity.

Neither should be overloaded without an explicit semantic definition.

### Account ≠ Session

An account may persist across sessions.

A session may expire, reconnect, or be replaced while retaining the same account.

### Session ≠ Resource

A session is attachment/runtime state.

A resource may be external-world state, local execution capacity, or provider-owned material.

These roles must not be collapsed merely because one implementation currently stores both in one namespace.

### Capability / Route ≠ Authority

The join may identify a candidate concrete path.

It must never contain a cached `allowed`, `consented`, or `authorized` verdict as canonical state.

Authority is resolved independently at execution time.

### Join ≠ Work lifecycle

The join may be attached to a Work/Attempt as evidence/context.

It does not own:
- attempt numbering;
- retries;
- waiting;
- recovery;
- verification;
- Outcome.

Those remain CFA-05 responsibilities.

## 4. Reference semantics

Every reference in the proposed join has one role.

| Reference | Meaning | Current basis | Required future owner |
|---|---|---|---|
| capability | semantic requested behavior | WorkStep.capability + archetypeSlug | CFA-06, subject to CFA-03/CFA-02 evidence |
| realizationRef | concrete provider realization | ProviderRealization + vault rev | CFA-06 + CFA-02 data seam |
| provider.serviceId | provider/service identity | ProviderRealization.providerId | CFA-06, vocabulary clarification |
| provider.mediationId | mechanism/transport | browser/provider-browser evidence | CFA-06 |
| accountRef | user-owned provider account | absent today | CFA-02 durable data, CFA-06 semantics |
| modelRef | selected provider model | absent today | CFA-02 durable data if needed, CFA-06 semantics |
| sessionRef | concrete runtime attachment | SessionRecord | CFA-02 durable data + CFA-06 semantics |
| resourceRef | concrete resource | absent today; World has canonical object refs | CFA-01/CFA-02 + CFA-06 seam |

## 5. Join construction rules

### Rule J1 — derive, do not duplicate

The join should be computed from durable references and current state rather than becoming another canonical record.

### Rule J2 — optional means truly optional

An absent Account, Model, Session or Resource must not be treated as an error unless the selected capability/provider requires that role.

### Rule J3 — unresolved is not false

If a reference cannot currently be reconstructed, the join should expose an unresolved/unknown condition rather than silently substituting another entity.

### Rule J4 — revision matters for evidence

When a record is cited as proof or reconstruction input, use the revisioned reference `{ns,id,rev}`.

The current vault/storage vocabulary already treats revision as load-bearing.

### Rule J5 — same semantic capability, new realization

Replacing the realization may change:
- provider;
- account;
- model;
- session;
- resource;
- implementation evidence.

It must not automatically change the semantic capability identity.

### Rule J6 — authority is evaluated after selection

The join can say:

> "this is the concrete route under consideration"

It cannot say:

> "this route is authorized."

### Rule J7 — Work sees the route, not the store

Work/Attempt should eventually reference the concrete route context or its evidence, but should not need to know the internals of the provider registry or session storage.

## 6. Worked examples

### Example A — browser-mediated ChatGPT

Current evidence can support:

~~~text
Capability       = message.send
Realization      = providers/realization:message.send:browser@rev
Provider.service = chatgpt
Provider.mediation = browser
Account          = UNKNOWN
Model            = UNKNOWN
Session          = providers/session:<id>@rev
Resource         = UNKNOWN
Evidence         = realization evidence + session capture evidence
~~~

This is enough to describe a concrete route without inventing an Account or Model.

### Example B — provider replacement

Given:

~~~text
message.send
  → realization:browser/chatgpt
~~~

and later:

~~~text
message.send
  → realization:api/provider-X
~~~

the semantic Capability may remain the same if the equivalence evidence supports it.

The concrete provider/session/evidence changes.

### Example C — account switch

Given the same Provider + Capability:

~~~text
Account A → Session A
Account B → Session B
~~~

the join must produce two distinguishable concrete routes.

The capability remains the same.

This is the minimum proof needed to avoid silently crossing user-account boundaries.

### Example D — session reconnect

Given:

~~~text
Account A → Session A (expired)
Account A → Session B (new attachment)
~~~

the join changes its Session reference while preserving Account identity.

The Authority decision is independently re-resolved for the execution request.

## 7. Compatibility with the existing Ω shape

The proposed join is compatible with current evidence because:

- `ProviderRealization` already supplies a revisioned concrete realization reference.
- `SessionRecord` already supplies a revisioned session record.
- `VaultProvenanceRef` already supplies revisioned evidence references.
- `CanonicalObjectRef` / `CanonicalRevisionRef` provide generic object-reference shapes for future resource/world integration.
- `WorkStep.capability` already carries semantic capability identity.
- `PortResult` and `Outcome` already distinguish refusal/unknown/unsupported classes from successful results.

No new persistence mechanism is necessary merely to express the relationship.

## 8. Where the proposed join is intentionally silent

The current evidence is insufficient to decide:

1. whether `provider.serviceId` deserves a first-class Provider record;
2. whether mediation belongs inside Provider, inside Realization, or as a separate relation;
3. the canonical Account schema;
4. the canonical Model schema;
5. the canonical Resource taxonomy;
6. whether resource identity is always a World object;
7. how Account/Session references are versioned and reconstructed;
8. which route context CFA-05 persists on Work versus Attempt;
9. the exact Authority input and re-resolution protocol;
10. whether capability aliases/revisions require a dedicated semantic identity record.

These remain **UNKNOWN / DEFERRED**, not implicit design decisions.

## 9. Adoption test

The proposed join should not be adopted as a contract until all of these are true:

- CFA-02 confirms the durable reference/revision envelope.
- CFA-04 confirms the Authority boundary and re-resolution semantics.
- CFA-05 confirms the Work/Attempt attachment seam.
- CFA-03 confirms semantic continuity requirements.
- CFA-01 resolves the World/Resource relationship where external resources are involved.
- The browser `browser` vs `chatgpt` identity split has an explicit vocabulary.
- At least one concrete two-account case demonstrates that account identity remains distinct.
- At least one concrete session-replacement case demonstrates continuity.
- No new canonical data store is required.

## 10. Final classification

| Element | Classification | Confidence |
|---|---|---|
| Capability is distinct from Realization | DERIVED / CURRENT | high |
| ProviderRealization is the concrete durable bridge | OBSERVED / CURRENT | high |
| Session is distinct from Realization | DERIVED / CURRENT | high |
| Session is distinct from Account | DERIVED / CURRENT | medium |
| Browser mediation may differ from upstream service provider | DERIVED / CURRENT | high |
| Account is an optional reference in the eventual join | PROPOSED | medium |
| Model is an optional reference | PROPOSED | medium |
| Resource is an optional reference with unresolved taxonomy | PROPOSED | medium |
| Join is a derived/non-authoritative projection | PROPOSED | high |
| Authority must be outside the join | DERIVED / CURRENT | high |
| Work/Attempt lifecycle must be outside the join | DERIVED / CURRENT | high |
| One vault-backed identity/revision system is sufficient | DERIVED / CURRENT | medium-high |
| Exact Account/Session durable envelope | UNKNOWN | unresolved |
| Exact Provider/mediation vocabulary | UNKNOWN | unresolved |
| Exact Resource taxonomy | UNKNOWN | unresolved |

## 11. Next gate

The research is complete enough to stop independent CFA-06 design work on M2 until peer evidence arrives.

Next action should be **cross-CFA reconciliation of PI-02 / PI-04 / PI-05 / PI-03 / PI-01 / PI-09**.

No contract amendment should be made from this document alone.

## Non-actions

No production code, contract file, manifest, vault schema, provider registry, Work record, authority record, or Ω law was changed by this research.
