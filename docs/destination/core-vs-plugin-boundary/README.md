# Core vs Plugin Boundary Research

Status: DERIVED — PASS 3 COMPLETE / ADVERSARIAL CLOSURE
Branch: research/core-vs-plugin-boundary
PR: #46

## Executive verdict

Pass 3 confirms the central architecture but narrows what can honestly be called proven K0. The strongest proven nucleus is signed composition admission, integrity/signature verification, compartment/Port enforcement, capability egress, revocation/fencing, atomic activation/recovery and generic lifecycle. Several larger host subsystems are now explicitly underproven or experiment-required.

Two earlier claims are corrected by direct code evidence:

1. Zero-plugin boot is NOT current. recipe.ts rejects empty composition and verifyCompositionInvariants() hardcodes vivim.law at bootPhase 0.
2. B1 executable-entry confinement is NOT closed. The manifest entry path is not explicitly proven to remain inside the content tree whose bytes are hashed.

## Proven boundary

K0: universal non-bypassable runtime mechanisms.
K1: shared protocol/reference vocabulary without product implementation ownership.
System plugins: first-party domain capabilities and semantics.
Extension plugins: third-party/user capabilities through the same governed boundary.
Tooling: authoring, analysis, diagnostics and CI outside runtime authority.

## Pass 3 deepening

The package now contains direct host file-by-file classification, formal K0 proof/reduction matrix, host semantic leakage findings, K1 contract audit, first-party privilege audit, B5 extraction analysis, zero-plugin proof model, active Work replacement boundary, adversarial stress results and eight required diagrams.

## Critical findings

- recipe.ts contains a product-specific bootstrap role check; current rule is ratified but its literal first-party identity is not domain-neutral K0. A generic signed bootstrap-role seam is preferred.
- compileComposition() and main.ts are tooling/launcher responsibilities, not K0.
- graph analytics, audit export and worker pooling are not K0; only smaller routing/provenance/lifecycle primitives may remain.
- StateArbitrator is plausible but UNDERPROVEN and must be reduction-tested.
- ToolRegistry/generation resolution is not proven K0; call-lifetime pinning is the smaller candidate.
- current worker isolation is proven as compartment separation, not as a demonstrated hostile OS sandbox.
- rich contracts such as chat, world, work, provider, control and language are semantic/system APIs even when housed in contracts/src.

## Implementation gate

Before any substantive host/runtime work, classify the responsibility here. A K0 proposal requires a protected invariant, concrete bypass, universality argument, domain-neutrality argument, smallest mechanism, removal experiment, impact set and falsifier.

## Blocking experiments

1. B1 executable-entry confinement.
2. Generic empty-composition and bootstrap-role proof.
3. K0 reduction of state, graph and grant provenance.
4. Generation-pin continuity proof.
5. First-party/third-party symmetry test.
6. Active Work implementation replacement test.

## Authority

This package is derived research. Ratified Ω law remains authoritative. Any disagreement is recorded explicitly rather than silently normalizing it.