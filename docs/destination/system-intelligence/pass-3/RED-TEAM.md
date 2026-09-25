# Pass 3 — Red Team

> Classification: DERIVED — ADVERSARIAL DESIGN REVIEW
> Status: unresolved risks preserved; no architecture declared infallible.

## Attack 1 — Account abstraction becomes provider-specific
Risk: canonical Account becomes an email field and fails providers with different identity models.

Response: store canonical account relationship + provider-specific external identity evidence. Do not require one identity primitive beyond what the provider can actually prove.

**Status: EXPERIMENT-REQUIRED.**

## Attack 2 — BrowserResource becomes a hidden desktop framework
Risk: VIVIM starts implementing an entire OS/browser supervisor before proving the product need.

Response: define the smallest leaseable/inspectable external browser resource, keep platform mechanics in the substrate plugin, and test real resource ownership first.

**Status: DESIGN-CANDIDATE.**

## Attack 3 — Generic object envelope becomes a second ontology
Risk: a “universal object” quietly becomes a second canonical semantics layer.

Response: envelope carries identity/provenance/relationship/revision metadata only; semantic payloads remain typed and domain-owned.

**Status: REJECTED** for a universal semantic supertype; envelope itself remains DESIGN-CANDIDATE.

## Attack 4 — ProviderKnowledgeView becomes a second authority database
Risk: cached provider knowledge diverges from source evidence.

Response: derived view carries basis refs/digest and can always be recomputed. Source rows remain authority/evidence.

**Status: DESIGN-CANDIDATE.**

## Attack 5 — Routing becomes hidden law
Risk: a route selector silently grants permission.

Response: routing chooses a candidate; law/consent remains the authority path.

**Status: EVIDENCE-SUPPORTED.**

## Attack 6 — Work duplicates Intent and Plan
Risk: three task systems emerge.

Response:
- Intent = what was asked;
- Work = durable user-visible outcome identity;
- Plan = procedural decomposition;
- execution/session = current mechanism.

**Status: DESIGN-CANDIDATE.**

## Attack 7 — Freshness becomes time-vibes
Risk: stale local knowledge remains “CURRENT” because its TTL has not expired.

Response: basis revisions/digests determine local currentness; TTL is only an additional external-observation constraint.

**Status: DESIGN-CANDIDATE.**

## Attack 8 — Legacy parity becomes architectural regression
Risk: preserving engine names/classes reintroduces the monolith.

Response: preserve behavioral floor, not class hierarchy.

**Status: REJECTED** for direct architectural copy.

## Attack 9 — Forge auto-modifies authority
Risk: generated code or plugin composition self-promotes.

Response: proposal/evidence/promotion remain separate. New authority requires the existing governed path.

**Status: EVIDENCE-SUPPORTED.**

## Attack 10 — “Third provider” is only a selector swap
Risk: a superficially different provider proves nothing.

Response: choose a provider with materially different auth, DOM/composer, stream/protocol or conversation semantics. Require the canonical contract to survive without product branching.

**Status: EXPERIMENT-REQUIRED.**

## Attack 11 — Restart repeats an external side effect
Risk: Work checkpoint says pending after an effect actually occurred.

Response: checkpoint before irreversible boundary + post-effect receipt + duplicate-effect guard. Exact checkpoint rules require E4/E7.

**Status: EXPERIMENT-REQUIRED.**

## Attack 12 — Surface becomes canonical by convenience
Risk: canvas or chat UI stores truth that is not represented in world data.

Response: surfaces only hold object refs and presentation state; semantic mutation must route through canonical object/work operations.

**Status: EVIDENCE-SUPPORTED.**

## Red-team conclusion

The most dangerous false comfort is **“the architecture is modular because the code is modular.”**

Pass 3 requires evidence at the identity, lifecycle and external-reality seams where modular code can still be semantically wrong.
