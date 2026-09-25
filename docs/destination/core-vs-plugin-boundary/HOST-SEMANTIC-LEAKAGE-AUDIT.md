# HOST-SEMANTIC-LEAKAGE-AUDIT

> Pass 3 adversarial audit. Derived evidence; ratified Ω law remains authoritative.

## Finding HSL-01 — product-specific boot policy in recipe verification

Location: host/src/recipe.ts, verifyCompositionInvariants().

The host hardcodes that bootPhase 0 must be exactly the plugin id vivim.law. This is not domain-neutral runtime enforcement; it is a product-composition rule naming a first-party plugin. The current Ω decision makes the rule ratified, so this pass does not delete or override it. It does establish that the rule is a constitutional coupling and a K0-growth risk.

Preferred future seam: a signed bootstrap-role declaration in the Recipe, with K0 enforcing that exactly one admitted entry occupies the bootstrap role. The identity of the law implementation would then be composition data, not a host string.

Result: UNDERPROVEN. Extraction/replacement experiment required.

## Finding HSL-02 — vault initialization mixed into boot

Location: host/src/boot.ts, ensureVault().

Root-key creation, vault-format file creation and owner-only file handling are mixed into the runtime boot substrate. Hash/signature primitives are plausible K0; storage layout and vault-format creation are product/platform semantics.

Preferred seam: retain a minimal owner-scoped key/platform primitive in the runtime and move vault format initialization to a system plugin or product bootstrap component.

Result: UNDERPROVEN boundary; extraction candidate identified.

## Finding HSL-03 — composition compilation inside host

Location: host/src/recipe.ts, compileComposition().

compileComposition() reads human-authored composition files, hashes plugin directories, signs manifests and writes build artifacts. This is a first-boot/build ceremony rather than an irreducible runtime trust mechanism.

Result: TOOLING / OUTSIDE RUNTIME. Its presence in host/src is historical placement, not proof of K0 necessity.

## Finding HSL-04 — CLI policy in host

Location: host/src/main.ts.

The CLI exposes compose/verify commands and first-boot compilation. It is a launcher/tooling surface around the runtime, not constitutional Core. The runtime should remain usable without importing CLI semantics.

Result: TOOLING / OUTSIDE RUNTIME.

## Finding HSL-05 — graph analytics in host

Location: host/src/graph.ts.

fanIn(), blastRadius() and snapshot() are impact-analysis and inspection behavior, not necessary to let plugins safely execute. whoOffers() and signed grant validation are boundary-adjacent; the whole graph is not K0.

Result: graph subsystem is mixed by responsibility; analytics are TOOLING / OUTSIDE RUNTIME.

## Finding HSL-06 — audit export in host

Location: host/src/audit.ts.

Signing and verifying the integrity of a grant that the host itself admits is K0-adjacent. export() is a READ projection for operators/lenses and is not K0. The entire append/history store therefore should not be treated as constitutional merely because grant() calls it.

Result: mixed; K0 primitive plus TOOLING/plugin projection.

## Finding HSL-07 — worker pool hook in host

Location: host/src/worker.ts.

WorkerPoolHook, checkoutCompartment() and pool assignment are resource-optimization concerns. The K0 mechanism is compartment creation/termination and Port transport. Pool warm/cold policy can live outside K0 and should not consume host budget.

Result: TOOLING / OUTSIDE RUNTIME for pool policy.

## Finding HSL-08 — risk and law gate coupling

Location: host/src/ports.ts, risk handling and law dispatch.

The host may need a universal rule that non-READ mutations cannot execute without the configured law gate. That can remain K0 if expressed only as generic enforcement of declared risk metadata. The host must not embed the meaning of consent, standing, delegation or specific policy.

Result: PROVEN K0 for the generic gate-enforcement mechanism; product policy remains system-plugin content.

## Finding HSL-09 — routing, queueing and scheduling

Location: host/src/ports.ts.

Operation routing uniqueness and safe dispatch are K0-adjacent. Queue priority, waiting behavior, scheduling policy, resource economics and caller-facing routing policy are not. These should be decomposed rather than accepted wholesale as Core.

Result: mixed; minimal dispatch K0, scheduling policy SYSTEM PLUGIN / TOOLING.

## Finding HSL-10 — direct product vocabulary in shared contracts

Locations: contracts/src/port.ts, provider.ts, chat.ts, surface.ts, intent.ts, world.ts, work.ts and control.ts.

Several files are semantically rich APIs rather than universal protocol-only contracts. chat, provider, world, work, intent and control shapes encode VIVIM domain meaning. They are legitimate shared data contracts but should not be described as K0 contracts merely because they live in the contracts package.

Result: PROVEN K1 for stable wire/reference portions; semantic portions are SYSTEM PLUGIN APIs.

## Finding HSL-11 — provider and browser knowledge

provider.browser contains ChatGPT-specific provider behavior, parser pins, capture/session records, fence registration and localhost CDP execution. None is K0. The host does not need to know provider identity, DOM, parser or ChatGPT semantics to protect the plugin boundary.

Result: PROVEN SYSTEM PLUGIN.

## Finding HSL-12 — latent ambient runtime privilege

The shim documents a ports-only discipline, but plugin code is currently capable of importing Node APIs; existing first-party plugins already use node:crypto and provider/vault implementations use filesystem/runtime-specific APIs. Worker isolation therefore should not be described as a complete OS capability sandbox unless a separate enforced mechanism proves it.

Result: UNDERPROVEN as a security-boundary claim. If extension plugins are expected to be untrusted at the OS level, a stronger sandbox experiment is required. This is a boundary question, not permission to enlarge K0 automatically.

## Summary

The host contains several shrinkable responsibilities: compilation, CLI behavior, graph analytics, audit projection, worker-pool optimization, vault initialization and scheduling policy. The current K0 claim should therefore be narrower than host/src as a whole.