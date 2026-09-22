# L4 — Zod Full (38 `src/schema/*` + MCP/frontend mirrors; exports in `generated/gen-zod-full.md`)

> Enforced at: `server/validate.ts:parseRequestBody/parseQuery` (HTTP ingress),
> `mcp/zod-schema.ts` (tool args), engine boundaries (re-validation). Every row
> below is an export observed via `^export` in its file; full shapes live in code.

## File → what it guards (from filenames + export names in generated index)

| File | Guards |
|------|--------|
| `action-plan.ts` | `ActionNodeSchema`, `ActionPlanSchema`, `CapabilityRiskSchema`, `RISK_TIER`, `requiresConfirmation`, `topologicalOrder`, `validateActionPlan` |
| `agent.ts`, `ai.ts`, `automation.ts`, `autonomous.ts` | agent loop / AI gateway / schedule / autonomous task inputs |
| `api-types.ts`, `response-schemas.ts` | wire envelopes `{ok,data,error}` + pagination; mirrors `shared/api-types.ts` |
| `capability.ts`, `capability-composition.ts`, `capability-extensions.ts`, `capability-tier.ts` | taxonomy/binding/program/composite/macro + tier gates |
| `channel.ts`, `collection.ts`, `content.ts`, `conversation.ts`, `memory.ts` | channel/collection/content/message/memory writes |
| `config.ts`, `version.ts`, `surface.ts`, `streaming.ts` | `config_entry` writes, version bumps, surface claims, `ContentPart/Block` + legacy migration |
| `discovery.ts`, `evidence.ts`, `provider.ts`, `provider-protocol.ts` | discovery sessions, evidence packs, provider manifests |
| `governor.ts`, `harness.ts`, `knowledge.ts`, `media.ts`, `mux.ts` | fleet ops, harness commands, ingestion batches, media, mux sessions |
| `nlcl.ts`, `node.ts`, `onboarding.ts`, `plugin.ts`, `policy.ts` | NL commands, node writes, onboarding, plugin install, policy rules |
| `sandbox.ts`, `setup.ts`, `sync.ts`, `tunnel.ts`, `workflow.ts`, `workspace.ts` | sandbox budgets, setup wizard (`WorkspaceSetRequest`…), sync, tunnel, workflow DAGs, workspace modes |

## Mirror rule (drift risk)
`frontend/src/schema/` + `frontend/src/api/schemas.ts` + `mcp/zod-schema.ts` must stay identical in shape to `src/schema/*`. `api-contract.test.ts` + `verify-cross-surface --offline` catch drift. When adding a field: update zod → contract Row → Prisma column → seed → generated index, same PR.

Full export names per file: `generated/gen-zod-full.md` (first 12 exports/file).
