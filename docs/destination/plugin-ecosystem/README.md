# VIVIM Plugin Ecosystem

> Classification: DERIVED — CURRENT DESTINATION ARCHITECTURE

This package contains the current destination-facing explanation of plugin authoring, Forge, the pre-boot anvil, conformance, and the relationship between developer/bootstrap tooling and ordinary plugin execution.

## Canonical authoring model

pack.builder → forge.author / Forge plugins → builder composition → plugin artifact → normal admission / conformance / activation.

The Forge is itself an ordinary plugin. First-party authoring must not acquire a privileged semantic path unavailable to legitimate extensions.

## Related artifacts

- PLUGIN-BUILDER-ARCHITECTURE.md
- PLUGIN-AUTHORING-PATH-AUDIT.md
- SDK-ANVIL-ACCOUNTING.md

## Boundary

omega-baseline/omega-final/sdk/src is the ratified pre-boot validation/anvil surface, not a general developer SDK.

Plugin authoring, plugin semantics, Forge behavior, and product meaning remain above the constitutional K0 runtime boundary.

## Authority

Ratified Ω decisions and current Ω code/gates remain authoritative. These documents are destination explanations and audits; they do not amend Ω law.
