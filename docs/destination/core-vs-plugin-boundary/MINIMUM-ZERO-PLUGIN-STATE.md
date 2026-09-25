# Minimum Zero-Plugin State

## Purpose

The zero-plugin state remains the target proof model, but Pass 3 found that the current Ω implementation does not yet realize it.

## Current status

CONTRADICTED in current implementation.

recipe.ts parseRecipe() rejects an empty composition. verifyCompositionInvariants() also requires exactly one bootPhase-0 entry whose id is vivim.law. Therefore the present boot path cannot enter a genuine product-plugin-free state.

This overturns the earlier package wording that treated zero-plugin boot as an already valid runtime state. The architectural principle remains unchanged; the implementation claim is withdrawn pending a generic bootstrap-role design.

## Target proof model

boot inputs → K0 boot → parse/verify empty composition → diagnostic/install state → inspect/explain → install signed composition → normal VIVIM composition.

## What remains without system plugins

Cryptographic/integrity primitives, signed Recipe admission, generic compartment/Port machinery, capability egress enforcement, generic lifecycle/activation/recovery, minimal owner-scoped platform support, and sufficient diagnostics/install capability.

## What must not be required

Chat, provider, browser session, project ontology, memory semantics, Work orchestration, account model, routing policy, product notifications or provider parser/healing knowledge.

## Resolution experiment

Create an offline empty Recipe fixture. Prove parse, signature verification, composition verification, diagnostic boot, inspection, and installation of a signed non-empty composition. The experiment must preserve the ratified security role of vivim.law while removing the literal first-party identity from the generic bootstrap mechanism.

## Blocking status

This blocks the claim of CURRENT zero-plugin compliance. It does not justify enlarging K0. The remedy is a generic bootstrap-role contract plus tests.