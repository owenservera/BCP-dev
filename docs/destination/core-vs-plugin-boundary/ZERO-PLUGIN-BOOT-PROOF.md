# ZERO-PLUGIN-BOOT-PROOF

> Pass 3 converts the conceptual zero-plugin model into a repository-level proof obligation.

## Required boot inputs

1. Platform path for owner-scoped runtime state.
2. Cryptographic trust material or an already trusted root key.
3. A syntactically valid Recipe.
4. Plugin artifact references and hashes if a non-empty composition is requested.
5. No first-party product plugin is required merely to establish the generic trust boundary.

## Current implementation trace

main.ts → ensureVault() → recipe parse/compile → recovery → verifyComposition → bootComposition → genesis kernel → plugin registration/spawn.

## Current contradiction

recipe.ts parseRecipe() explicitly refuses an empty composition. verifyCompositionInvariants() also requires exactly one bootPhase-0 plugin with id vivim.law. Therefore the repository cannot currently represent a genuinely empty valid composition, and boot cannot currently reach the proposed zero-plugin state.

Result: CONTRADICTED in current implementation.

## Intended constitutional model

A valid empty Recipe should be structurally admissible because no product capability is being requested. The runtime should enter a diagnostic/installation state with:

- kernel identity and trust root available;
- generic contracts/diagnostics available;
- no product-domain capability active;
- explicit reason that no composition is installed;
- an admission/install path for a later signed composition.

## What zero-plugin proves

It proves that the trust substrate is not secretly dependent on chat, Vault, Work, provider, language, canvas or Personal Agent semantics. It does not require a consumer-ready UI.

## Falsifier / resolving experiment

Construct an offline empty Recipe fixture containing only the minimum trust/composition metadata. Prove parse → signature verify → composition verify → boot into diagnostic state → inspect → install a signed non-empty composition. The experiment must not add product semantics to K0.

## Blocking status

This does not block the conceptual Core boundary. It blocks any claim that the current implementation already satisfies zero-plugin boot. The implementation change required to resolve it must first be designed as a generic empty-composition rule, with the ratified vivim.law boot-role constraint explicitly reconciled rather than silently removed.