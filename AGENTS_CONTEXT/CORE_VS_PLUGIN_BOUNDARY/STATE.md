# State — Core vs Plugin Boundary

Updated: 2026-09-25

Status: RESEARCH PASS COMPLETE / DEEPENED PACKAGE COMMITTED

## Result

The dedicated pass concludes that VIVIM should retain a small K0 enforcement kernel, a K1 shared contract/protocol layer, replaceable first-party system plugins, third-party extension plugins, and out-of-tree tooling.

K0 is limited to non-bypassable, domain-neutral runtime mechanisms: admission/integrity, isolation/transport, capability egress enforcement, revocation/fencing, atomic activation/recovery, minimal platform/crypto primitives and generic lifecycle.

K1 contains shared boundary vocabulary such as Manifest/Recipe, Port, Capability, Outcome/Refusal, Object/Revision, Evidence, Intent, Work, Authority and Change references. Product meaning remains outside K0.

## Deepened evidence pass

The package is grounded in concrete current Ω source, not only design prose:

- host/src/genesis.ts → minimal closed bootstrap and generic kernel structures
- host/src/canon.ts → canonical encoding, hashes, signatures and atomic-write boundary
- host/src/worker.ts → compartment/transport mechanics with explicitly documented resource limits
- host/src/ports.ts → host-side capability token ownership, revocation, generation and scope checks
- contracts/src/lifecycle.ts → host operation/capability vocabulary
- contracts/src/manifest.ts → plugin declaration, dependency, runtime, risk and generality vocabulary
- plugins/vivim-law/* → invocation, standing and privacy semantics outside K0
- plugins/vivim-agent/* → delegation and adaptation governance outside K0
- plugins/vivim-run/* → Work/liveness semantics outside K0

## Canonical package

docs/destination/core-vs-plugin-boundary/

The package contains the 19 required outputs plus diagrams and a deeper evidence/control layer covering archaeology, current implementation mapping, boundary anatomy, stress cases, K0 proof obligations, lifecycle/trust, contract evolution, responsibility decision ledger, review checklist and zero-plugin bootstrap.

## Strongest findings

1. Current Ω source already provides unusually strong evidence for a narrow host.
2. The remaining risk is semantic leakage into K0, not insufficient host authority.
3. Security sensitivity does not imply Core; authority enforcement and policy meaning remain separate.
4. First-party/system and third-party/extension symmetry is the key generality test.
5. Active Work replacement is the hardest boundary experiment because it exercises identity, contracts, evidence, authority, persistence and evolution simultaneously.
6. Zero-plugin bootstrap is a powerful falsifier for hidden product semantics in the host.

## Key unresolved experiments

- exact zero-plugin bootstrap composition and installation UX
- complete symmetry audit of every current Ω plugin versus a legitimate external plugin
- exact Work continuity semantics under implementation replacement
- semantic contract compatibility algebra
- OS/product shell boundary
- unified evolution admission for Forge, provider healing and installation
- whether any generic object/vault primitive truly cannot live outside K0

These are research/experiment items, not reasons to enlarge Core now.

## Authority

This STATE is a derived research handoff. It does not amend ratified Ω decisions. The research reconciles B1–B5 and the current Ω rule that everything else is a plugin.

## Next action

Use the package as the mandatory classification gate before substantive implementation. Any proposed K0 addition must include a protected invariant, concrete bypass, universality argument, domain-neutrality argument, smallest mechanism, removal experiment, impact analysis and falsifier.