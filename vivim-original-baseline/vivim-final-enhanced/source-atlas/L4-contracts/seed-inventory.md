# L4 — Seed Inventory (36 TS loaders + JSON manifests; lists in `generated/gen-seeds*.md`)

> Load order (code): `server/bootstrap-seeds.ts` → `cli/commands/seed.ts` (`seed all`)
> inside `bootstrapSeedsPhase` (boot phase 1: seeds). Seed groups on disk (measured):
> `adapters=7, parsers=9, providers=9, harness=8, capabilities=6, taxonomy=3, automation=1, command-descriptions=1, conceptual-model=1, intent-templates=1, system=1, user=1` + loose `memory-intelligence.ts`, `og-capability-port.ts`.
> Full paths: `generated/gen-seeds.md` (TS) + `gen-seeds-detail.md` (TS+JSON).

## What each group seeds (from loader names + row writes)
- `providers/` (9: 8 `.json` + `manifests.ts`): `anthropic-api, openai-api, openrouter, discord, slack, whatsapp, notion, reddit` → `ProviderDefinition/Endpoint/Model/Account/StreamConfig` + `ProviderCapability`. `PROVIDER_MANIFESTS` in-memory golden (no FS reads at test time).
- `parsers/` (9 TS): provider streaming parsers → `ProviderParser{logic_type='inline', parser_logic_code}` + `ParserTestResult` rows. Shadow copy in `src-tauri/data/seeds/parsers/` (8 files) for desktop bundle.
- `taxonomy/` (3) + `capabilities/` (6): `CapabilityTaxonomy` (40-col rows) + tiers + shapes → prospect `CapabilityBinding`s.
- `harness/` (8): `HarnessCommand` registry (`seedHarnessCommands` re-exported from `src/index.ts`) + checkpoints.
- `automation/` (1): `seedAutomation` (re-exported) → `AutomationSchedule` templates.
- `adapters/` (7): protocol adapters (openai-compatible, simulator, legacy wrappers) → `AIProviderInstance` + `ProviderConfig`.
- `command-descriptions/` (1), `intent-templates/` (1), `conceptual-model/` (1): `CommandDescription`, `TaskTemplate`, conceptual service rows.
- `system/` (1), `user/` (1), `memory-intelligence.ts`: per-DB base rows + memory intelligence bootstrap.
- `og-capability-port.ts`: legacy capability port (one-shot migration, not re-run).

## Rules
Seeds are versioned data, not fixtures: parser/taxonomy changes need a seed version bump + `ParserTestResult`/`CapabilityTaxonomyVersion` row, never silent edits. Test goldens live in `tests/fixtures/` (4 files), not `seeds/`.
