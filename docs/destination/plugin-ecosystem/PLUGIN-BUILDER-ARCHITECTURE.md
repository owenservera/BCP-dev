# PLUGIN-BUILDER-ARCHITECTURE

> Current destination-facing explanation.
> Historical framing is retained under docs/archive/ and is not current authority.

## What is a plugin?

A plugin is an admitted, replaceable contributor to a composition with a manifest, contracts/capabilities, dependencies, runtime declaration, content integrity, optional tests, and explicit authority requests.

It requests authority; it never grants authority.

## What is a contract?

A shared operation/reference vocabulary that allows consumers and implementations to remain separated and replaceable.

## What is pack.builder?

The Builder Contract pack that defines the protocol the relevant Forge/builder plugins obey.

## What is a Forge?

An ordinary Ω plugin whose operations inspect, shape, emit, prove, or promote artifacts. It uses the same manifest, capability grammar, composition membership, law, provenance, and runtime boundary as other plugins.

There is no separate privileged developer architecture.

## What is forge.author?

The canonical first Forge implementation. Its self-hosting proof is a falsifier for the authoring model: if Forge cannot author/reproduce itself through the ordinary path, the model is incomplete.

## What is the anvil?

omega-baseline/omega-final/sdk/src is the ratified pre-boot anvil. It validates plugin construction and supplies tightly bounded schema/signing/content/port conveniences.

The anvil is not a product plugin and not a general-purpose developer SDK.

The current D-404 accounting is documented in SDK-ANVIL-ACCOUNTING.md.

## How are plugins built?

The canonical destination path is Forge-authoring through a builder composition.

A bootstrap scaffolder may remain as a thin development surface only where current Ω law allows it. It must not become a second semantic authority.

## How are plugins trusted?

Construction is not authority.

The resulting artifact must pass normal conformance, admission, integrity, capability, lifecycle, and composition rules. The K0 host must not depend on the plugin's product name or semantic identity to enforce the boundary.

## Core distinction

K0 protects the conditions under which plugins safely exist.
K1 provides shared boundary vocabulary.
Plugin provides product/domain meaning.
Forge provides extensibility/evolution behavior as an ordinary plugin.
Tooling provides authoring/inspection outside runtime authority.
