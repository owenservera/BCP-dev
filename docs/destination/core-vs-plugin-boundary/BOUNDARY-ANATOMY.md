# Boundary Anatomy

The unit of classification is a responsibility, not a component name.

## Capability

K1 defines the reference and version. A plugin declares and implements the capability. Policy content says what use means. K0 verifies token ownership, generation, scope and egress.

## Law

The law plugin owns policy content and decision semantics. K1 carries authority, evidence, outcome and refusal vocabulary. K0 prevents an unauthorized invocation and enforces structural constraints.

## Vault

K1 defines persistence/reference semantics. A vault plugin chooses storage and namespace behavior. K0 protects integrity, admission and activation.

## Provider

Provider plugins own provider knowledge, account/session behavior, realizations, browser interaction, parsing and healing. K1 carries provider/realization references. K0 supplies generic invocation and admission enforcement.

## Surface

A surface plugin owns representation and interaction. K1 carries object/context/work references. K0 only protects the runtime boundary. A surface never becomes Core merely because it is the main UI.

## Boundary smell tests for Core

A Core candidate is suspicious when it contains domain names, provider selectors, DOM knowledge, product UX, domain-specific storage schemas, policy content, or implementation imports tied to a particular plugin. “Temporary” privileged escape hatches are especially dangerous because they usually become permanent private APIs.

## Boundary smell tests for plugins

A plugin is suspicious when it can mint its own authority, bypass egress checks, alter active composition without admission, rewrite canonical history without migration, or requires undocumented host internals.

These tests should become code-review criteria and, where feasible, static checks.