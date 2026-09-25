# Minimum Zero-Plugin State

## Purpose

The zero-plugin state is a falsification tool for hidden product semantics in K0. It does not need to be a useful consumer product.

## What should remain

1. Cryptographic and integrity primitives.
2. Signed Recipe/manifest admission.
3. Generic compartment and Port transport.
4. Capability egress enforcement.
5. Generic lifecycle, activation and recovery mechanics.
6. Minimal owner-scoped platform seam.
7. Diagnostics/inspection explaining why nothing is installed and how a composition is admitted.
8. Installation/admission of a valid plugin composition.

## What should disappear

There should be no requirement for chat, AI provider, browser session, canvas semantics, project ontology, memory semantics, Work orchestration, account model, routing policy, product notifications or provider parser/healing knowledge.

## Bootstrap ceremony

boot K0 → verify signed composition → if empty enter diagnostic/installation state → admit selected composition → instantiate plugins → normal VIVIM product emerges from composition.

## Important distinction

Zero-plugin does not mean zero UI, zero capability or zero diagnostics. It means no first-party product semantics are required to establish or protect the runtime boundary.

## Falsifier

A fresh K0 runtime cannot perform generic admission/inspection duties without importing a product plugin. The response is to inspect the contract boundary first, not automatically add that product behavior to K0.