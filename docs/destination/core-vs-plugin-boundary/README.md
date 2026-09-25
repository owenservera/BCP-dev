# Core vs Plugin Boundary Research

Status: DERIVED — COMPLETE / DEEPENED PASS
Branch: research/core-vs-plugin-boundary

## Executive result

VIVIM should retain a very small K0 enforcement kernel, a K1 shared protocol layer, replaceable first-party system plugins, third-party extension plugins, and out-of-tree tooling.

The decisive boundary is not “important versus unimportant”. It is: what must be enforced before an arbitrary plugin can safely exist?

K0 contains only the smallest mechanisms that answer that question. Product/domain meaning, policy content, external-system knowledge, storage implementations, UX and evolution analysis remain outside the kernel.

## K0 nucleus

- signed Recipe/manifest admission
- integrity, hashing, signature and canonical encoding primitives
- plugin isolation and Port transport
- host-side capability egress enforcement
- revocation/generation fencing
- atomic activation and fail-closed recovery mechanics
- minimal owner-scoped platform seam
- generic runtime lifecycle required to admit, start, stop and recover compartments

These are supported by current Ω B1–B5 and concrete host code in genesis.ts, canon.ts, worker.ts and ports.ts.

## K1 is not a second kernel

K1 is the shared language crossing the boundary: Manifest/Recipe, Port, Capability, Lifecycle, Outcome/Refusal, Plugin references, Object/Revision references, Evidence references, Intent references, Work references, Authority frames and Change references.

Shared vocabulary does not imply host ownership of the behavior described by that vocabulary.

## System plugins remain plugins

The default VIVIM composition can contain first-party system plugins for Law/Policy, Vault, Work, Mind/Context, NLCL, Agent, Providers, Accounts, Browser realization, Credentials, Chat, Discovery/Healing, Forge, Surfaces, Memory/Attention and Product Instance.

Being bundled, essential, security-sensitive, boot-required or heavily depended upon does not promote one of these to K0.

## Concrete repository evidence

See ARCHAEOLOGICAL-EVIDENCE.md and CURRENT-OMEGA-IMPLEMENTATION-MAP.md for direct mapping to current Ω source and law.

Especially strong evidence:

- host/src/genesis.ts: only a closed generic bootstrap identity set is hardcoded; later plugins and grants are Recipe data
- host/src/worker.ts: compartment mechanics are host-owned while lifecycle policy remains outside host
- host/src/ports.ts: host-side token ownership, revocation, generation and scope are mechanically enforced
- contracts/src/manifest.ts: plugin declarations, runtime tiers, dependencies, risk and generality remain protocol data rather than host product semantics
- plugins/vivim-law: substantial authority and privacy semantics remain in plugins
- plugins/vivim-agent: delegation and adaptation governance remain in plugins
- plugins/vivim-run/src/liveness.ts: rich resource/lifecycle semantics remain in a system plugin

## Decomposition rule

A concept may span all three layers.

Capability: K1 reference → plugin definition/implementation → K0 egress enforcement.

Law: K1 authority protocol → plugin policy content → K0 enforcement mechanism.

Evidence: K1 evidence reference → plugin storage/semantics → K0 integrity primitives.

Work: K1 durable identity → plugin orchestration/execution → K0 safe invocation.

Object: K1 identity/revision → plugin domain semantics/storage.

Resource control: K0 hard safety bounds → plugin policy/economics.

## False-Core result

The deeper audit finds no evidence requiring Vault, Work, Intent/NLCL, Law semantics, Provider/Browser, World/Object ontology, Evidence storage, Forge semantics, Surfaces, Resource economics, Self-Knowledge or Product Instance to become K0 domains.

Where these areas are security-sensitive, the recurring pattern is still: policy/meaning outside, enforcement boundary inside.

## Evolution result

Everything-is-a-Plugin and Evolution are one coupled architecture with two dimensions:

Plugin architecture = what can be added, replaced or removed.

Evolution governance = under what evidence and authority that change is allowed.

Replacement follows: propose → dependency/impact → compatibility → authority → stage → atomic activation → verify → monitor → promote/rollback/quarantine.

A plugin's ability to create another plugin does not grant the child authority. A provider-healed realization is not exempt from the same admission model. A system plugin cannot silently rewrite the constitutional boundary.

## Stress-tested cases

The package walks through removal/replacement of chat, NLCL, Vault, provider/browser realization and Work, plus third-party surfaces, object-domain plugins, Forge-generated plugins, contract evolution, constitutional changes, zero-plugin boot and system-plugin upgrades.

The hardest unresolved experiment is active Work continuity across implementation replacement because it simultaneously exercises identity, contract compatibility, authority, evidence, persistence and evolution.

## Zero-plugin falsifier

The minimal runtime state is a generic, inspectable trust substrate able to verify/admit a composition, explain an empty state and install a valid composition. It should not need chat, provider, project, memory, routing, canvas or Work semantics merely to boot.

## Package contents

The required 19 outputs are present, plus diagrams and a deeper evidence/control layer covering archaeology, current implementation mapping, boundary anatomy, stress cases, K0 proof obligations, lifecycle/trust, contract evolution, responsibility decision ledger, review checklist and zero-plugin bootstrap.

## Authority warning

This package is derived research. It does not amend ratified Ω decisions. Where this package and current Ω law disagree, the law wins and the disagreement becomes an explicit reconciliation item.

## Build gate

Before any substantive host/runtime work, classify the responsibility here. A new K0 proposal must include a protected invariant, concrete bypass, universality argument, domain-neutrality argument, smallest mechanism, removal experiment, impact set and falsifier.