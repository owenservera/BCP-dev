# PLUGIN-AUTHORING-PATH-AUDIT

> Current destination-facing authoring-path audit.
> Historical cleanup framing is archived.

## Canonical path

pack.builder → forge.author / Forge → builder composition → normal plugin admission.

## SDK/anvil

Purpose: manifest/recipe shape validation, signing/content helpers, and tightly bounded pre-boot/caller conveniences.

Status: ratified anvil under D-404.

It is not a general plugin authoring authority.

## tooling/builder

A bootstrap scaffolding surface may exist for development convenience.

It must remain thin, produce no privileged authority, and eventually subordinate to the Forge path where the destination design requires.

## tooling/generate plugin

This remains a duplicate-surface risk. It must not accumulate semantic features while the canonical authoring path is Forge.

Any retirement/subordination that changes ratified Ω behavior requires its own decision record.

## tooling/generate pack

A pack scaffold may remain until a corresponding Forge capability supersedes it.

## tooling/generate composition

The matrix-driven composition generator remains the canonical composition-generation mechanism where Ω law specifies it.

## packs/builder

The Builder Contract is the protocol/contract declaration the Forge/builder path obeys.

## plugins/forge-author

This is the canonical implementation-side authoring component.

## builder compositions

Builder compositions assemble Forge capabilities under the same recipe/grant model as other compositions.

## Explicit rule

There must not be multiple competing semantic plugin-creation authorities.

Bootstrap scaffolding, validation/anvil, Forge authoring, and composition generation have different roles and must remain explicitly separated.
