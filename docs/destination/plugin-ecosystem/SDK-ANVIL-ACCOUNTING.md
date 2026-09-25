# SDK-ANVIL-ACCOUNTING

> Current destination-facing accounting of the ratified Ω anvil.
> D-404 remains binding unless superseded by a later ratified decision.

## Current status

@vivim/omega-sdk is the frozen pre-boot anvil surface, not a general developer SDK.

Its role is bounded around:
- manifest/recipe shape validation;
- composition validation;
- generality checks;
- signing/verification ceremony support;
- content hashing/canonical helpers;
- port/stream caller conveniences that remain inside the current frozen export surface.

## Architectural rule

The anvil validates construction. It does not become an authoring runtime and does not own product semantics.

## Decomposition rule

Any decomposition/removal requires a superseding ratified decision with:
- per-symbol destination;
- consumer migration;
- export-surface accounting;
- LOC accounting;
- test/gate evidence.

A label-only rename from sdk to anvil is not worth import churn by itself.

## Relationship to Core

The anvil is adjacent to K0 because it participates in pre-boot trust/validation ceremony, but it is not evidence that the whole SDK package belongs inside the constitutional runtime.

The current host/K0 reduction is governed by the separate Core-vs-Plugin research package.
