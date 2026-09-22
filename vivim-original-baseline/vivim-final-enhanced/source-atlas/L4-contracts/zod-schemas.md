# L4 — Contracts: `src/schema/` (38 files — validation + domain shapes)

> Every file observed in `src/schema/`. Role split: `core` domain shapes vs `api-validators`/
> `validators` request guards vs `response-schemas` envelopes. Engines import these for
> typing; `src/server/validate.ts` enforces them at ingress; `src/mcp/zod-schema.ts`
> re-uses them for tool args.

## Domain shapes (from `core.ts` sample: `PlanTier`, `BindingStatus`, `CapabilityTaxonomy{…uiComponent/uiOrder/interactionMode/minPlanTier…}`)

| File | Family | Declares (representative) |
|------|--------|---------------------------|
| `core.ts` | capability core | `PlanTier(free\|pro\|max\|enterprise)`, `BindingStatus(broken\|flaky\|prospect\|retired\|stable\|test-1\|test-2)`, `CapabilityTaxonomy`, binding/program/outcome/selector types |
| `types.ts` | shared primitives | scalar aliases, JSON-string helpers (`dependsOnJson` pattern) |
| `schemas.ts` | barrel | re-exports all schema modules |
| `index.ts` | barrel | public schema surface |
| `validators.ts` | generic guards | zod refinements used by routers |
| `api-validators.ts` | ingress guards | per-route zod schemas (used by `validate.ts`) |
| `api-types.ts` | wire shapes | request/response DTOs (mirrors `shared/api-types.ts`) |
| `response-schemas.ts` | envelopes | `{ok,data,error}` + pagination |
| `provider.ts` | provider domain | provider def/endpoint/account shapes |
| `provider-manifest.ts` | manifest | manifest version + drift fields |
| `chrome.ts` | browser | launch profiles, slave state, CDP params |
| `session.ts` | session | vivim/provider/profile session shapes |
| `message.ts` | chat | message + blocks + identity hash fields |
| `streaming.ts` | streams | stream blocks, channel caps, align params |
| `node.ts` + `node-data.ts` | universal node | node/version/alias/edge shapes |
| `conceptual-model.ts` | concepts | concept graph (mirrors `shared/conceptual-model.ts`) |
| `content.ts` + `document.ts` + `rich-text.ts` + `media.ts` | content | content units/items, docs, rich text, attachments |
| `contact.ts` + `social.ts` + `email.ts` | engagement | contacts, identities, social mirrors, email |
| `automation.ts` | automation | schedules/runs + workflow refs |
| `harness.ts` | harness | checkpoints/commands/repair sessions |
| `event.ts` | events | bus event kinds (`kernel\|plugin.<id>\|legacy` namespace) |
| `health.ts` | health | ticks, digests, circuit states |
| `telemetry.ts` | telemetry | trace/cycle/summary shapes |
| `routing.ts` | routing | route specs/targets/events |
| `transfer.ts` | transfer | patterns/candidates/attempts |
| `task.ts` | tasks | autonomous tasks/steps/gates |
| `learning.ts` | learning | learning events + rules |
| `command-description.ts` | commands | command manifests + intent templates |
| `config.ts` | config | config entries + audit |
| `repair-metadata.ts` | repair | heal strategies + test results |
| `versioning.ts` | versions | taxonomy/program/workflow/surface versions |

## Notable inline Zod contracts (verified in engines)

- `src/engines/action-plan.ts` — `ActionNodeSchema, ActionPlanSchema, CapabilityRiskSchema, ExecutionEvidenceSchema, GroundedReferenceSchema, VerifySpecSchema` + helpers `topologicalOrder, maxRiskTier, requiresConfirmation, validateActionPlan` (+ `RISK_TIER`).
- `src/engines/browser-action-types.ts` — `BrowserActionSchema, BrowserRefSchema, compactSnapshot`.
- `src/engines/capability-event-bus-v2.ts` — event-kind regex `^(kernel|plugin\.<id>|legacy)\.` (bus namespace law).
