# L4 — Contracts: `src/storage/contracts/` (67 files — the persistence law)

> Convention: each file declares `*Row` interfaces (SQLite-compatible: epoch numbers,
> `0|1` booleans, `*Json` TEXT columns) + one `<Domain>Store` interface.
> Engines import these types only — never `impl/*`. Full method lists regenerable via
> `build-atlas.ts` (`export interface .*Store` extraction).

## Capability + taxonomy (6)

- `capability-store.ts` — `CapabilityTaxonomyRow` (40+ cols: slug/category/uiComponent/uiLabel/uiOrder/parentCapabilityId/interactionMode/minPlanTier/dependsOnJson/concurrencySafe…), `CapabilityBindingRow{id,globalId,providerId,status,bestProgramId,currentProgramId,promotionHistoryJson,confidence}`, `CapabilityProgramRow{id,bindingId,version,name,supersededById,isActive,status,configJson}`, `SelectorStrategyRow{id,name,capabilityId,providerId,strategyType,selectorValue,priority,isActive,hitCount…}` + `CapabilityStore` (taxonomy/binding/program/selector CRUD + promotion).
- `capability-resolution-store.ts` — resolution cache rows + `ResolutionStore` (get/set/invalidate by globalId+providerId).
- `capability-binding-store.ts` — binding lifecycle (`prospect→test-1→test-2→stable→flaky→broken→retired`) + status-log appends.
- `shape-binding-store.ts` — `CapabilityShape` ↔ provider shape bindings.
- `primitive-store.ts` — UI primitives catalog.
- `program-store.ts` — program versions + metrics hooks (`ProgramVersionMetric`).

## Provider + fleet (8)

- `provider-store.ts` — provider defs/endpoints/models/accounts/stream-configs.
- `provider-type-store.ts` — provider archetypes.
- `governor-store.ts` — slave state (`slave:{provider}:{account}` singletons).
- `slave-setup-store.ts` — per-slave setup profiles.
- `stealth-store.ts` — launch/module profiles + policies.
- `mux-store.ts` — `MuxSession` fan-out rows + response rows.
- `selector-heal-store.ts` — heal attempts + strategy health.
- `discovery-store.ts` + `discovered-dom-entity-store.ts` + `protocol-fingerprint-store.ts` + `parser-candidate-store.ts` — discovery pipeline rows.

## Conversation + streaming (7)

- `conversation-store.ts` — `ConversationRow{id,providerSessionId,providerId,accountId,title,state,messageCount,lastMessageAt,contextJson,projectId,topicId,source,externalId,importJobId,syncedAt}`, `ConversationMessageRow{id,conversationId,role,content,blocksJson,blockCount,parentMessageId,sequenceIndex,latencyMs,tokenCount,model,metadataJson,providerMessageId,identityHash,isPinned,isArchived,readStatus}`, `ProviderAccountRow` + `ConversationStore`.
- `stream-block-store.ts` — stream blocks (`StreamBlock` mirror).
- `stream-config-store.ts` — per-provider stream configs.
- `mirror-store.ts` — mirror snapshots + optimistic updates.
- `node-store.ts` — universal nodes/versions/aliases/edges.
- `channel-store.ts` — streaming channels.
- `hpe-session-store.ts` — HPE (human-preference-eval?) sessions.

## Memory + knowledge (10)

- `memory-curated-store.ts` · `memory-intelligence-store.ts` · `knowledge-extractor-store.ts` · `knowledge-ingestion-store.ts` · `semantic-search-store.ts` · `cross-conversation-synthesis-store.ts` · `collection-store.ts` · `collection-item-store.ts` · `content-unit-store.ts` · `context-assembly-store.ts`.
- Row families: curated memories + feedback, embeddings, extraction jobs, ingestion batches, collections/items, content units, context layers/budgets.

## Workflow + autonomous + harness (10)

- `automation-store.ts` (schedules + runs) · `autonomous-store.ts` (tasks/steps/HITL gates) · `agent-loop-store.ts` (loop runs/steps/decision logs) · `agentic-store.ts` · `harness-repair-store.ts` (repair sessions) · `ai-execution-store.ts` (AIExecution + events + provider instances) · `command-store.ts` · `command-description-store.ts` · `intent-template-store.ts` · `workspace-store.ts` (modes/backups/templates).

## Parsing + onboarding + taxonomy (6)

- `parser-store.ts` · `parser-execution-log-store.ts` · `webapp-taxonomy-store.ts` · `onboarding-session-store.ts` (`onboarding/` subdir also present) · `organization-store.ts` · `local-agent-store.ts`.

## System + governance + observability (12)

- `config-store.ts` (`ConfigEntry` + audit) · `version-store.ts` · `registration-store.ts` (registration events + drift) · `kernel-store.ts` (spans/provenance/topology/events) · `telemetry-store.ts` (summaries/cycles) · `health-store.ts` (ticks + history) · `health-digest-store.ts` · `alert-store.ts` (conditions + events) · `sandbox-audit-store.ts` · `router-store.ts` (specs/requests/targets/events) · `situation-store.ts` · `user-identity-store.ts` + `fleet-supervisor.ts` (supervisor contract, not a store — fleet limits + allocation).
- `onboarding/index.ts` — barrel for the 7 onboarding/ contracts (discovery/DOM/fingerprint/candidate/taxonomy/session/binding).

**Total: 60 top-level + 7 `onboarding/` = 67 contract files.**
