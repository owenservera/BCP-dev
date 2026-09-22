# ADR 005 — Schema: Widen `NodeType` + Enforce `plugin:${id}.` Prefix Inside `SchemaRegistry`

- **Date:** 2026-08-28
- **Status:** Ratified (I-1)
- **Deciders:** agent (E2E owner)
- **Tags:** schema, types, isolation

## Context

- `src/schema/node.ts:56` `NodeType` is a closed string-literal union (`'cap-store.message' | 'cap-store.conversation' | ...` — 34 literals). Adding a new type requires editing this union; a plugin cannot register a genuinely new type without a cast.
- `src/schema/node.ts:207` `class SchemaRegistry` is `Map<NodeType, NodeSchema>` with `register/get/has/all/validate/indexContent/embeddingText`. It is runtime-mutable (contradicting its own comment "Register every node schema at boot"). Singleton `schemaRegistry:251` populated by `registerAllSchemas()` in `schemas.ts` (19 types, each call site already uses `as any` because Zod's discriminated union is too broad — an accepted, pervasive pattern).
- Without prefix enforcement, two plugins registering local name `invoice` would collide, and a plugin could squat on `cap-store.*`.

## Decision

1. **Widen `NodeType`** at `src/schema/node.ts:56` to `BuiltinNodeType | (string & {})` — introduce `type BuiltinNodeType = /* the 34 literals */` first for backwards compat, then `type NodeType = BuiltinNodeType | (string & {})`. This makes a plugin string accepted without `as any` at every call site, making the existing porousness explicit and typed.
2. **Enforce prefix inside `SchemaRegistry.register():210`** — add `caller: 'boot' | { pluginId: string }`. Boot caller bypasses prefix (preserves existing 19 registrations). Plugin caller is forced through `` `plugin:${pluginId}.${localType}` ``. Reject `cap-store.*` for plugin callers; reject collisions. Kernel wrapper `src/plugin-kernel/registries/schema-registry.ts` is the only plugin-facing entry point; it never trusts the plugin to self-prefix.
3. **Store** is the existing `Node` table (`data: unknown` validated against the plugin's Zod schema, `NodeStoreContract`). No migration, no `plugin_ext` datasource in v1.

## Consequences

- Existing 19 built-in registrations stay typed; new test registers a non-builtin `NodeType` string without a cast.
- Two plugins registering local `invoice` become `plugin:acme.invoicer.invoice` vs `plugin:other.foo.invoice` — no collision.
- A plugin cannot register `cap-store.task` or any `cap-store.*` type — rejected at registry write time (defense in depth alongside certify-time check).

## Alternatives Considered

- Keep `NodeType` closed, require `as any` for plugins → rejected: either every plugin pays the cast tax or we widen later under churn; widening now is the honest fix.
- Enforce prefix only at `certify()` → rejected: single gate is bypassable if a future path writes to `SchemaRegistry` without going through `certify()`. Registry write is the enforcement point; certify is the early error.

## Tier B (Deferred)

Relational fragments (`plugin_<id>_*`, isolated `plugin_ext` datasource, composite Prisma generation, per-plugin migrations) are designed in this ADR's addendum and built in v2. Pushing everything through Tier A first is consistent with the existing `capabilitiesJson`/`modelsJson` JSON-escape-hatch pattern in `ProviderDefinition`.
