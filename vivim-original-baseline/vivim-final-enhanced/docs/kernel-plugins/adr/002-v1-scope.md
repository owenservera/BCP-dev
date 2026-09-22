# ADR 002 — v1 Scope: 3 Axes Only (Schema Tier-A, UI Generated, Services api/mcp)

- **Date:** 2026-08-28
- **Status:** Ratified (I-1)
- **Deciders:** agent (E2E owner)
- **Tags:** scope, sequencing, trust-boundary

## Context

The five-axis vision is correct (schema, core features, harness, external services, frontend UI). But the five are not equal in risk:

- **Harness** (`src/engines/harness-command-registry.ts:54`) has zero registration-time collision protection — two commands can silently share an ID today. Registration is `HarnessCommandNotFoundError` on lookup only. Fixing it requires DAC (`${pluginId}.` prefix) and it shares a trust gate (`chrome:control`) with `browser-provider` (both drive a real authenticated browser session).
- **`browser-provider`** (`kind: 'browser-provider'` in the provider registrar) also needs `chrome:control`. Shipping one without the other ships half a trust boundary.
- **Compiled UI** (`UiContribution.compiled[] → UniversalComponentRegistry.register()`) ships real code into the bundle — equivalent to a core feature, not a low-trust HTML tweak. `SandboxedNode.tsx:19`'s iframe isolation is bypassed if a plugin can inject a compiled React component without the same scrutiny.
- **Core features lazy activation** (`ModuleRegistry` `activationEvents`) touches 186 `src/engines/*.ts` files and the 738-line `capabilities.ts` phase. Eager→lazy without a per-engine audit risks boot ordering regression.

## Decision

**v1 ships exactly three axes:**

1. **Schema Tier A** — `plugin:${id}.` NodeTypes validated by `SchemaRegistry`, stored in the existing `Node` table.
2. **UI Generated** — `html/css/scriptUrl` → `UiComponent` rows, `scriptUrl` kernel-asset origin, rendered via `SandboxedNode` opaque iframe.
3. **External Services (api-protocol + mcp-*)** — `ProviderRegistrar.registerOne` + in-memory protocol cache, gated on `network`.

**Deferred to v2 (designed in v1, not built):**

- `harness` (DAC + `chrome:control` confirmation prompt)
- `browser-provider` (rejected in v1 with actionable error until shared gate exists)
- `ui.compiled[]` (parsed, rejected at certify with review-gate error)
- `features` (`FeatureContribution` + lazy `activationEvents` inside `capabilities` phase only)
- Tier B relational fragments (`plugin_ext` datasource)

Manifest strictness: unknown `contributes` keys (e.g. `harness` in v1) fail Zod with `Unsupported contribution 'harness' — not yet available. See adr/002.`

## Consequences

- v1 blast radius is bounded to low/med trust surfaces. The three deferred axes each get a dedicated security review before merge.
- Phase 6 and Phase 5 in `PLAN.md` are docs+regression-test only in v1; their wiring is v2.
- A plugin author who tries to ship a harness command in v1 gets a clear, actionable rejection — not silent ignoring.

## Alternatives Considered

- Ship all five axes in v1 → rejected: either the harness/browser-provider gate ships incompletely (half a trust boundary) or it blocks the three shippable axes behind the hardest review.
- Ship four axes (everything except harness) → rejected: `browser-provider` and harness share the same gate; excluding harness but including `browser-provider` still ships half a gate.
