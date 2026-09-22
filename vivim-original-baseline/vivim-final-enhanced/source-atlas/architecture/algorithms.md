# Algorithms — The Named Procedures (inputs → steps → outputs, from code)

> Each entry: where it lives, what problem it solves, the steps in order, and the
> shaping-relevant facts (complexity source, invalidation, fallback). No pseudocode
> invented — step names are the code's own.

## A1. Resolution: 3-layer override + gating (`capability-resolution.ts`, 393 lines)

Problem: one global capability, many provider overrides — which UI contract wins?
Inputs: `RawResolutionRow`s (COALESCE/CASE in store) + `activeBindings[]` + `conversationContext` + plan tier.
Steps: (1) store COALESCE global→tier→provider (`overrideSources` per field: `global|tier|provider`); (2) plan-tier gate (`minPlanTier`: free|pro|max|enterprise); (3) existential rules + `dependsOn[]` satisfaction + search/alias match; (4) emit `ResolvedCapability` incl. `uiSlots` (per-slot component+sandbox from `provider_capability.ui_component_override`), `bindingStatus/Confidence`, `tierOverrides`.
Invalidation: `ManifestDrift`/`ManifestChangeLog` (see `data-dictionary.md` §3).

## A2. Binding promotion (`capability-binder.ts` + status machine)

Problem: pick the best program per binding over time.
States: `prospect→test-1→test-2→stable→flaky→broken→retired` (`BindingStatusLog` appends, `promotionHistoryJson`, `ProgramVersionMetric` per `prog:{binding}:v{n}`).
Inputs: `ParserTestResult` rows (8-phase harness), `SelectorHealthHistory`, confidence+health.
Output: `bestProgramId`/`currentProgramId` pin; fallback via mux (`MuxSession`) or `CapabilityNotFoundError`.

## A3. Selector healing (`selector-healer.ts` + `selector-cache.ts` + `selector-refiner.ts`)

Problem: DOM changed, selector missed — repair without human.
Strategies in order (`HealStrategy`): `aria_relaxed → text_match → dom_structure → llm_proposal → visual_match` → `HealResult{healed,strategy,confidence,originalSelector}`.
Cache: priority-ordered `SelectorStrategy` set; `hitCount` feedback; `SelectorHealthHistory` writes; `mark_broken` when exhausted.

## A4. Execution recovery (`capability.ts:55 DEFAULT_RECOVERY`)

Problem: browser step failed mid-flight.
Chain: `retry_selector → retry_with_fallback → navigate_home → restart_chrome → mark_broken`, each recording `RecoveryStrategyResult{strategy,index,ok,error?}` → `Outcome` + `BindingStatusLog` + `SendResilienceError{recoveryKind: chrome_crash|cdp_down|session_expired|circuit_open|relogin|unknown, retryAfterMs?}`.

## A5. Plan ordering + confirmation (`action-plan.ts`)

Problem: multi-step DAG must run safely.
`topologicalOrder` (DAG sort) + `validateActionPlan` (`ActionNodeSchema`/`ActionPlanSchema`) + `RISK_TIER` + `requiresConfirmation` gate; HITL `HitlGate` (approve/deny/expire) when policy can't decide.

## A6. Dedup + identity (`ids.ts`, 52 lines)

`newId()` ULID (sortable PKs everywhere); derivations `slave/cap/bind/prog/sel` (see glossary); `hashContent` stable sha256 (FNV-1a `fnv1a:` fallback for dedupe keys only, NOT integrity) → `ConversationMessage.identityHash` + `Node` dedup.

## A7. Snapshot load (`capability-snapshot.ts`, O(1) resolution)

`load(providerIds)` counts active bindings; `getBySlug(slug, providerId?)` resolves provider-scoped then provider-agnostic (see `capability-snapshot.test.ts`). Rebuilt by `POST /api/system/refresh-provider-snapshot` from active `ProviderDefinition`s.

## A8. Health + circuit + fleet guards

`provider-health.ts` scores → `ProviderHealthHistory`/`LatencyLog`/`CostLog`; breaker opens after 5 fails/60s (`CircuitOpenError`, `CAP_STORE_CIRCUIT_*`); `FleetSupervisor` caps concurrency + spawn guard + `port-reaper` sweep + `system-pressure` backpressure (ports 9222–9250).
