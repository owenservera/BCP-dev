# Factory Boundary Baseline

> Classification: DERIVED — CODING-READINESS RECONCILIATION
> Date: 2026-09-25
> Scope: minimum factory/building-language boundary for first coding.
> Authority: Ω ratified law remains superior; this document is a derived build view.

## Decision

The smallest credible VIVIM factory is **not a finished VIVIM application**. It is the existing Ω governed composition substrate plus the smallest shared vocabulary required for arbitrary pieces to enter, interoperate, be authorized, execute, persist evidence, and be replaced without moving product semantics into K0.

The build boundary is:

```text
K0 Ω
  admission / integrity
  isolation / Port transport
  capability egress / fencing
  atomic activation / fail-closed recovery
  crypto / canonical primitives
  generic runtime lifecycle
        ↓
K1
  Recipe / Manifest
  Port / Capability references
  lifecycle / refusal / evidence / intent / work / object references
        ↓
System plugins
  first-party product semantics
        ↕
Extension plugins
  third-party / user semantics
        ↓
Compositions
        ↓
Product Instance
```

The host is the constitutional boundary, not the product.

## Evidence already sufficient

1. `omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md`
   - B1–B5 are ratified;
   - everything else is a plugin;
   - host is transport, not policy;
   - V1 is Chrome master/slave, no AI API;
   - core phase is closed and plugin work is open.

2. `omega-baseline/omega-final/contracts/src/recipe.ts`
   - Recipe is the composition authority;
   - entries carry source, manifest/content hashes, capability/contract grants, phase, and config;
   - human composition specs are compiled into the signed recipe.

3. `omega-baseline/omega-final/contracts/src/manifest.ts`
   - one plugin manifest shape;
   - explicit contributions, dependencies, capabilities, runtime tier and content identity;
   - routable operations derive from contributions;
   - risk is declared data, not embedded host policy.

4. `omega-baseline/omega-final/host/src/index.ts`
   - the µhost exports only constitutional/runtime machinery.

5. `omega-baseline/omega-final/host/src/genesis.ts`
   - the current bootstrap closes the initial identity cycle;
   - later grants/plugins are ordinary Recipe data.

6. `docs/destination/CORE-VS-PLUGIN-BOUNDARY-DISTILLATION.md`
   - K0/K1/plugin/tooling split is already characterized;
   - product semantics default outward;
   - each implementation should record why-not-Core, owner, seam, dependencies and falsifier.

## Minimum building language

The first coding boundary does not need another ontology. It needs a stable interoperability vocabulary:

- **Capability** — semantic power available to the environment.
- **Plugin** — bounded provider of contributions/implementations.
- **Contract** — shared invocation/data shape.
- **Composition** — set of plugin entries admitted by one Recipe.
- **Realization** — concrete implementation/provider path for a capability.
- **Authority** — whether an effect may happen.
- **Work** — durable entrusted outcome when continuity is required.
- **Evidence** — what supports the interpretation/result.
- **Object** — canonical user-world identity.
- **Surface** — replaceable representation.
- **Product Instance** — durable environment identity/continuity boundary.

The first composition can use these without deciding every future object kind, surface, provider, routing, or evolution case.

## What belongs where

| Responsibility | Boundary at coding start |
|---|---|
| Signature/content admission | K0 |
| Port/isolation/fencing | K0 |
| Capability token enforcement | K0 |
| Atomic activation/recovery substrate | K0 |
| Canonical crypto/identity primitives | K0 |
| Recipe/Manifest/refs/refusal envelopes | K1 |
| Law policy content | system plugin |
| Vault semantics/storage implementation | system plugin behind shared contracts |
| Work semantics | system plugin |
| World/mind projection | system plugin |
| NLCL / intent realization | system plugin |
| Provider/account/browser realization | system plugin / extension side |
| Forge/authoring | system plugin |
| Product shell / workspace / surface | system plugin |
| User-created capability | extension plugin |
| User-created composition | composition data / governed factory path |
| Tests/generators/diagnostics | tooling |

**First-party does not mean K0. Importance does not mean K0.**

## Known Core obligations that become coding gates

The repository explicitly keeps five open obligations:

- B1 executable-entry confinement;
- generic zero-plugin/bootstrap semantics;
- minimum State/Graph/Grant/Generation reduction;
- first-party/third-party symmetry;
- active Work continuation across replacement.

These do **not** justify reopening the K0 model. They are bounded proofs/implementation work against an already-defined boundary.

The most important current implementation warning is B1: the repository evidence says the intended law is non-bypassable, while the current implementation has been recorded as not fully closing that constraint. Because B5 is already at 1500/1500 LOC, any repair must respect the existing remove-to-add discipline.

## Factory boundary falsifier

A useful first factory implementation should allow an arbitrary third-party-shaped test plugin and a first-party-shaped test plugin to:

1. enter through the same Recipe/Manifest/Port vocabulary;
2. receive only declared capability grants;
3. execute without adding product semantics to K0;
4. leave evidence through the same governed path;
5. be replaced without changing the host contract.

If the experiment requires special first-party entry, a new host exception, or a product-specific Core API, the boundary has regressed.

## Factory-ready interpretation

The boundary is sufficiently clear to code **provided the first implementation treats the open Core obligations as explicit substrate proofs, not as reasons to redesign the factory**.

The factory is therefore the smallest governed host + contract language + composition mechanism that can safely carry interchangeable first-party and extension contributions.


## Fresh takeover re-evaluation — 2026-09-25 / main 13fc6c0

This is a fresh bounded execution of the Factory Boundary question. The prior artifact was treated as historical input, not as completion.

### Current challenge to prior finding

The current mainline changes since the prior Round 1 work are the task-owner/convergence prompt separation only; no Ω boundary law or destination boundary evidence changed. Re-checking the actual current Ω contract/runtime confirms the same architectural cut:

- omega-baseline/omega-final/contracts/src/recipe.ts still makes the signed Recipe the composition grantor.
- omega-baseline/omega-final/contracts/src/manifest.ts still defines one manifest vocabulary for all plugins and keeps requested capabilities separate from grants.
- omega-baseline/omega-final/host/src/index.ts still exposes the µhost as the constitutional/runtime mechanism.
- CURRENT-INVARIANTS.md still makes B1–B5 the governing host laws and freezes host LOC at 1500.

The important fresh finding is that the first composition does not need a new Core boundary. A thin first-party research capability can be a plugin using an existing contract family/realization. This preserves the K0/K1 split.

### Fresh boundary test

The first build should be able to exercise an arbitrary extension-shaped test plugin and a first-party-shaped test plugin through the same Recipe → Manifest → Port path. The only host-side responsibilities needed are admission, isolation/transport, egress enforcement, activation/recovery and generic runtime primitives already identified by the Core research.

A new host exception for research or any other product capability would falsify the boundary.

### Fresh result

The previous READY conclusion survives challenge. The only material clarification is that a new product capability can be added as a plugin without expanding K0, even when that capability is essential to the first composition.

ROUND 1 FINDING: READY