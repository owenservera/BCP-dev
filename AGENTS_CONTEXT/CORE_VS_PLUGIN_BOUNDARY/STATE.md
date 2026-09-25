# State — Core vs Plugin Boundary

Updated: 2026-09-25

Status: **RESEARCH PASS COMPLETE / DERIVED PACKAGE COMMITTED**

## Result

The dedicated pass concludes that VIVIM should retain a small K0 enforcement kernel, a K1 shared contract/protocol layer, replaceable first-party system plugins, third-party extension plugins, and out-of-tree tooling.

K0 is limited to non-bypassable, domain-neutral runtime mechanisms: admission/integrity, isolation/transport, capability egress enforcement, revocation/fencing, atomic activation/recovery, minimal platform/crypto primitives and generic lifecycle.

K1 contains shared boundary vocabulary such as Manifest/Recipe, Port, Capability, Outcome/Refusal, Object/Revision, Evidence, Intent, Work, Authority and Change references. Product meaning remains outside K0.

System plugins include law/policy, vault, Work, mind/context, NLCL, agent, providers/realizations, credentials, chat, discovery/healing, Forge, surfaces, memory/attention and Product Instance. Their being essential or bundled does not make them Core.

## Canonical package

`docs/destination/core-vs-plugin-boundary/`

The package contains the 19 required outputs plus `DIAGRAMS.md`.

## Key unresolved questions

- exact zero-plugin bootstrap composition;
- complete symmetry audit of every existing Ω plugin versus external plugins;
- exact Work continuity semantics under replacement;
- contract compatibility algebra;
- OS/product shell boundary;
- unified evolution admission across Forge, healing and installation;
- whether any additional generic object/vault primitive is truly K0.

These remain experiments/design work, not reasons to enlarge Core now.

## Authority

This STATE is a derived research handoff. It does not amend ratified Ω decisions. The research reconciles B1–B5 and the current Ω rule that everything else is a plugin.

## Next action

Use the package as the mandatory classification gate before substantive implementation. Any proposed K0 addition must include a why-not-plugin rationale, impact analysis, replacement seam and falsifier.