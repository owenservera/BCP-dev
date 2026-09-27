# CFA-06 — M1/M2 Evidence Package — 2026-09-27

> Status: FIRST BOUNDED EVIDENCE PASS COMPLETE
> Scope: M1 Capability-to-Realization Contract + M2 Provider/Account/Session/Resource Model
> Mode: repository evidence only; no production implementation
> Independence: this pass does not consume new Round-1 outputs from peer CFAs.

## Executive finding

The current Ω tree has a coherent, durable **ProviderRealization** contract and a real browser **SessionRecord**, but M2 is not yet a complete semantic model.

The material gap is not "missing fields" alone. The current implementation exposes three different identity layers without a canonical join:

1. **Realization provider identity**: `ProviderRealization.providerId`.
2. **Mediated session identity**: `SessionRecord.providerId = "browser"`.
3. **Upstream service identity**: `LiveSessionDescriptor.providerId = "chatgpt"`.

This is evidence for preserving the CFA-06 distinction between Provider, Account, Session, Realization, Model, and Resource rather than extending the current session row until it carries all meanings.

## M1 — Capability-to-Realization evidence

### Observed / current

**Canonical ProviderRealization contract**
- File: `omega-baseline/omega-final/contracts/src/provider.ts`
- `ProviderRealization` contains:
  - `archetypeSlug`
  - `providerId`
  - `providerClass`
  - `status`
  - `discoverySessionRef`
  - `opMapRef`
  - `entityMapRef`
  - `streamRefs`
  - `evidenceRefs`
  - `supersedes`
  - `createdAt`
  - optional `parserPins`
  - reader-only `rev`
- Canonical realization ids are derived by `providerRealizationId(archetypeSlug, providerId)`.
- `archetypeSlugForOp` deterministically removes the version suffix from an op.

**Promotion is evidence-gated**
- File: `omega-baseline/omega-final/plugins/discovery-verification/src/index.ts`
- `discovery.verify@1` only produces a `PROMOTED` realization after probe evaluation and evidence resolution through `vault.get@1`.
- Provider realization rows cite probe evidence and the promotion event.
- Parser pins are governed against the manifest registry before writes.

**Routing uses realization state but does not define provider semantics**
- File: `omega-baseline/omega-final/plugins/vivim-director/src/resolve.ts`
- Resolution selects a `PROMOTED` realization for an archetype and maps its `providerClass` to computation kind.
- Missing realization escalates to HUMAN rather than inventing a provider.

### M1 interpretation

M1 is substantially present as a runtime vocabulary, but the current capability identity is represented indirectly through `archetypeSlug` / op naming rather than as a separate canonical `Capability` record.

That is acceptable for the first evidence pass because the roadmap explicitly defers a separate Capability standing model unless evidence requires it.

### M1 remaining proof questions

- Whether `archetypeSlug` is sufficient as the stable semantic capability identity across revisions/aliases.
- Which identity/revision/lineage fields CFA-02 requires around a realization record.
- Which effect/risk fields must be attached to the semantic capability versus the concrete realization.
- Whether a future realization can change provider implementation without changing the semantic capability identity.

## M2 — Provider / Account / Session / Resource evidence

### Observed / current

**Provider registry is realization-driven**
- File: `omega-baseline/omega-final/plugins/vivim-providers/src/registry.ts`
- Registry rows are derived from `ns="providers"` realization records.
- Activity is derived from active composition plugin ids.
- Registry contains provider identity, class, status, realization ref, and liveness timestamps.
- It does not introduce a second persistence model.

**Browser session is already durable**
- File: `omega-baseline/omega-final/plugins/provider-browser/src/session.ts`
- `SessionRecord` is stored in the same `providers` namespace.
- It contains `sessionId`, `archetypeSlug`, `parserVersion`, a reference to a capture row, lifecycle state, simulation/live mode, and creation time.
- Live sessions carry a localhost debug-port descriptor.
- Capture bytes are stored separately and referenced by the session.

**Session creation is not yet a real lifecycle**
- File: `omega-baseline/omega-final/plugins/vivim-providers/src/index.ts`
- `providers.session.start@1` currently returns a generated session id and `INITIALIZED`.
- It validates a pre-existing consent-shaped id but does not append a durable session record.
- The same file explicitly marks session bookkeeping as deferred until a session consumer exists.

**Browser live descriptor exposes a semantic split**
- File: `omega-baseline/omega-final/plugins/provider-browser/src/session.ts`
- `SessionRecord.providerId` is the mediation provider `"browser"`.
- `LiveSessionDescriptor.providerId` is the upstream service `"chatgpt"`.
- The same session therefore spans at least two provider concepts.

### Search evidence

Repository code search over the Ω subtree found:
- no canonical `interface Capability` in Ω;
- no `accountId` field;
- no `resourceId` field;
- `SessionRecord` is the only explicit durable session model found in the current Ω tree.

This does not prove that no future account/model/resource concept exists anywhere else; it establishes that the present Ω provider/session substrate does not yet expose a canonical M2 join model.

### M2 interpretation

The current substrate should **not** be extended by adding arbitrary Account/Resource fields to `SessionRecord`.

The missing model needs a deliberate semantic seam:

`Capability`
→ `RealizationCandidate`
→ `Provider`
→ `Account`
→ `Model` (when applicable)
→ `Session`
→ `Resource`
→ `Work / Attempt`

The durable persistence side of this seam should remain one vault-backed identity/revision system; CFA-06 should not create a parallel data store.

## Material contradictions / design pressure

### 1. "browser" versus "chatgpt" provider identity

Current evidence uses:
- realization provider id = `browser` in the D-357 browser falsifier;
- live service id = `chatgpt` inside the session descriptor.

This is not automatically wrong: "browser" can mean realization mechanism while "chatgpt" means service/provider. But the distinction is not yet explicit in the canonical vocabulary.

**Required decision gate:** define Provider versus Mediation/Transport versus upstream service identity before M2 is implemented.

### 2. Session exists, but Account is absent

A session currently identifies a provider and an archetype, but not an independently durable account identity.

This means the current substrate cannot yet prove the invariant:
`same provider + different account` ⇒ distinct realization target.

**Required decision gate:** define the account join without making Session the owner of account semantics.

### 3. Model and Resource are currently implicit

The browser proof demonstrates a concrete ChatGPT path but does not expose a canonical model identity or a generalized resource identity.

That is acceptable for the present browser falsifier; it is insufficient as the general M2 model.

## Candidate minimum M2 join (research proposal, not adopted)

A concrete realization should be reconstructable from references such as:

`capabilityRef`
`realizationRef`
`providerRef`
`accountRef?`
`modelRef?`
`sessionRef?`
`resourceRef?`

Rules:
- each reference has one semantic role;
- omission is meaningful (e.g. a provider that has no account concept);
- references resolve through the existing vault identity/revision system;
- Session contains runtime attachment state, not canonical account meaning;
- Model is present only when the provider actually exposes a material model choice;
- Resource represents a concrete execution resource only when the operation requires one;
- no reference is treated as authorization.

This proposal is intentionally not written into contracts yet.

## Evidence classification

| Finding | State | Freshness |
| --- | --- | --- |
| ProviderRealization is canonical in `contracts/src/provider.ts` | OBSERVED | CURRENT |
| Promotion is proof/evidence gated | OBSERVED | CURRENT |
| Provider registry derives from realization rows | OBSERVED | CURRENT |
| Browser SessionRecord is durable-by-vault-reference | OBSERVED | CURRENT |
| Session.start is still placeholder bookkeeping | OBSERVED | CURRENT |
| No canonical Account/Resource field surfaced in Ω search | OBSERVED (search-bound) | CURRENT |
| Browser mediation identity vs ChatGPT service identity needs explicit vocabulary | DERIVED | CURRENT |
| A separate Account/Model/Resource record family is the correct final shape | PROPOSED | CURRENT |
| Exact CFA-02 storage envelopes and identity/revision join | UNKNOWN | DEFERRED |
| Exact multi-model semantics | UNKNOWN | DEFERRED |

## Stop / escalation conditions

Do not implement M2 joins until these are reconciled with peers:
- CFA-02: canonical identity/revision/lineage and persistence envelope;
- CFA-04: authority boundary around account/session/resource use;
- CFA-05: how a selected realization becomes attached to Work/Attempt;
- CFA-03: continuity expectations across account/session changes.

No Ω law collision was found in this pass.

## Immediate bounded next work

1. Produce a peer-intelligence request package for CFA-02/CFA-04/CFA-05/CFA-03 based on the concrete ambiguities above.
2. Draft the minimum non-authoritative M2 join shape without writing contracts.
3. Only after reconciliation, decide whether any contract or implementation delta is warranted.

## Not done

- No production implementation.
- No new Account/Resource/Capability persistence layer.
- No Ω law changes.
- No legacy-provider abstraction was imported into Ω.
