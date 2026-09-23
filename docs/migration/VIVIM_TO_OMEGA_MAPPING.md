# VIVIM → Ω Mapping — concept matrix, adapter boundaries, retirements

> Source: VIVIM_FORENSIC_MODEL.md (OBSERVED) + Ω contracts/host/plugins read
> 2026-09-23. Status values: MAPPED = target exists; ADAPTER = seam needed;
> UNKNOWN = needs evidence before a verdict.

## 1. Concept matrix (minimum slice scope + immediate neighbors)

| VIVIM Concept | VIVIM Source (evidence) | Semantic Meaning | Ω Destination | Transformation | Evidence Needed | Status |
|---|---|---|---|---|---|---|
| ProviderDefinition (chatgpt) | seeds/providers/manifests.ts (OBSERVED) | Declarative provider knowledge: identity, auth, fleet ports, capability list | `ProviderRealization` record ns `providers`, id `realization:<archetype>:<provider>` (contracts/src/provider.ts) + vault provenance | Manifest row → realization record via discovery.verify promotion; declarative fields become vault data, not code | Recorded-fixture promotion test (W1 pattern) | ADAPTER |
| ProviderEndpoint (chat URL/composer/send) | manifests.ts chat endpoint (OBSERVED) | Where + how to reach the provider surface | `provider-browser` plugin config + op-map (entityMapRef/opMapRef on realization) | Endpoint selectors → discovery observation → op-map refs, never hard-coded DOM in Ω core | Fixture asserting selector set round-trips manifest→op-map | ADAPTER |
| ProviderAccount | Prisma ProviderAccount; profile_strategy per_account (OBSERVED) | Human credential boundary → profile identity | Vault session record `session:<…>` + fence principals (`provider-browser` config: from/fencePrincipals) | Account → profile → session: attach-only provenance, credential redact BEFORE vault (M12/D-356 ordering law) | Redaction-ordering test (capture→redact→hash) | ADAPTER |
| ProviderParser (chatgpt stream) | Prisma ProviderParser + stream-parser.ts DB-only logic (OBSERVED) | Wire-format → normalized blocks | Parser contribution + governed pin D-355 (`parserPins` on realization; D-385 fence refuses ungoverned pins pre-write) | Parser row → pinned contribution version; fallback chain becomes pin-aware probation | Pin-coverage send-bar test (needs-pin-without-pin refuses) | ADAPTER |
| ProviderStreamConfig | Prisma model (OBSERVED name only) | Transport/completion semantics per provider | Stream discipline in contracts: terminating PortResult authoritative, `checkStreamSeq`, emit-after-final throws → DEGRADED | Stream config → contract-level sequence/finality law, provider specifics stay in plugin | Sequence-violation falsifier | MAPPED |
| CapabilityTaxonomy (send_message global) | Prisma + capability-bootstrap (OBSERVED) | Global semantic op identity | Archetype slug (`archetypeSlugForOp`: `message.send@1`→`message.send`) + contract op `message.send@1` | Global capability → archetype; provider variations keyed under it | Registry derivation test (already exists: deriveRegistry pure) | MAPPED |
| CapabilityBinding (chatgpt_send) | chatgpt.ts capabilities + CapabilityBinding rows (OBSERVED) | Global op → provider realization link | Realization lifecycle DRAFT→TESTING→PROMOTED→DEGRADED→REQUIRES_REDISCOVERY (vocabulary.ts, OBSERVED) | Binding → realization record with status written ONLY by verify/heal, never self-declared | Status-transition test (illegal self-promote refused) | MAPPED |
| CapabilityProgram | Harness program-schema/recipe-compiler (OBSERVED names) | Executable plan for a bound capability | Composition entry: signed manifest + content hash + grant {capabilities, contracts} (contracts/src/recipe.ts) | Program → composition grant; recipe compiles to entry, host ceremony signs | Composition byte-identity check (existing W1 pattern) | ADAPTER |
| SelectorStrategy | Prisma SelectorStrategy; chatgpt 3+3 selector lists (OBSERVED) | Ordered DOM locator fallback per action | Discovery observation data (op-map) + `browser.attach` capture refs | Selectors → data (op-map), never Ω core code; healing owns drift | Drift-seed falsifier (existing W0 pattern family) | ADAPTER |
| Outcome | Prisma Outcome; Ω contracts/src/outcome.ts (OBSERVED) | Execution result + evidence pointer | Ω `Outcome` + `EvidenceRef {ns,id,rev}` (provider.ts, OBSERVED) | Outcome → Outcome with vault refs; every send returns messageId+rev+sentAt+chunks | Outcome-shape conformance test | MAPPED |
| Conversation | Prisma Conversation; conversation-manager.ts 1064 lines (OBSERVED) | Durable user-data thread | Vault ns conversation index (D-378; W3 owns retention/backfill/repair — NOT STARTED) | Conversation → vault conversation rows; Prisma NOT ported wholesale | Retention/backfill gap acknowledged (W3) | ADAPTER |
| ConversationMessage | Prisma model (OBSERVED) | Ordered turn entry with identity | Vault message rows, pack-schema-exact (provider-browser lands ns `email` pack-schema-exact today) | Message → vault row with provenance refs; chat pack schema is future work | Pack-schema conformance test for chat | UNKNOWN |
| StreamBlock | Prisma StreamBlock; normalize/validate fns (OBSERVED) | Atomic streamed content unit | Stream chunks via meta.emit with sequence discipline (D-352) | Blocks → ordered chunks; terminating result authoritative | checkStreamSeq violation test | MAPPED |
| ChromeGovernor | chrome-governor.ts 800 lines (OBSERVED) | Sole browser I/O authority | `provider-browser` BROWSER_MEDIATED realization (fixture-only; CDP leg owner-machine-only future work, OBSERVED header) | Governor capabilities → replaceable plugin contributions behind stable contracts; NO Governor import into Ω | Containment probe D-386 (enforced vs unavailable) | ADAPTER |
| FleetSupervisor | fleet-supervisor.ts 575 lines (OBSERVED) | Slave pool, health, reconnect | Host worker/pool model + discovery-healing probation | Supervisor policy → healing + pool burst observability (D-388), not a ported supervisor | Pool burst bench (existing pattern) | ADAPTER |
| CDPProxy / CDPTransport | 349 / 297 lines (OBSERVED) | Governed CDP session multiplex | Explicitly OUT OF Ω sandbox scope: CDP leg is future owner-machine work, never silently simulated | No CDP in Ω runtime; seam is recorded-fixture capture, attested as fixture | browser-falsifier + m13-containment tests (exist) | ADAPTER |
| Recipe / Harness | recipe-compiler, harness dirs (OBSERVED names) | Compile binding→executable browser plan | Composition spec → signed recipe (host ceremony); `CompositionSpecEntry {id, source, bootPhase, grant}` | Recipe → spec+ceremony; 18 specs via matrix+generate, never hand-edited | Matrix byte-identity 16/16 (W1 pattern) | MAPPED |

## 2. Runtime-behavior matrix

| VIVIM Runtime Behavior | Current Implementation (evidence) | Required Ω Contract | Adapter Needed? | Migration Risk |
|---|---|---|---|---|
| send_message on ChatGPT textarea | manifest endpoint + plugin selectors + human-like typing (OBSERVED both) | `message.send@1` via `browser.attach` session + 4 fail-closed send bars (fence, attached, PROMOTED, parser pin) | YES — one-way adapter: VIVIM knowledge → op-map data → Ω send | HIGH if live proof is demanded this slice; MEDIUM with fixture proof + live deferred explicitly |
| Streaming response capture | DB parser chain, zero-DB hot path, ParserExecutionLog (OBSERVED) | Sequence-checked chunks, terminating result authoritative, oversized refused never truncated | YES — parser-pin adapter (D-355/D-385) | MEDIUM: pin coverage must pre-exist the send |
| Conversation persistence | Prisma Conversation/Message/StreamBlock (OBSERVED) | Vault appends with revs; journaled MUTATION, consent-gated EXTERNAL_MUTATION | YES — Airlock-style (Path C) bridge to prototype storage only, never Ω core dependency | MEDIUM: W3 retention gap is known and out of scope |
| Auth/profile resolution | per_account profiles, cookie-files-are-truth (OBSERVED invariant) | Attach-only session rows + fenced principals + credential.redact ordering law | YES — session adapter with redaction proof | HIGH if auth recovery is in slice; EXCLUDED — existing authenticated profile assumed |
| Selector healing on DOM drift | SelectorStrategy + healing engines (OBSERVED names) | discovery-healing probation: PROMOTED→DEGRADED→TESTING on drift threshold | NO new code — use existing healing; feed it ChatGPT observations | LOW for slice; full drift taxonomy is Migration #2 work |

## 3. Duplicate architectures — verdicts (explicit, no silent choices)

| Duplicate | Verdict | Rationale |
|---|---|---|
| Old ProviderPlugin interface vs new provider plugin registry vs generated protocol registry | ADAPTER (this slice) → MERGE (Migration #2 decision) | Both ChatGPT representations observed live in tree; slice consumes them as assay input and emits op-map data, touching neither registry's authority. Verdict on the surviving registry requires the Claude-conformance comparison. |
| Manifest-driven protocol vs plugin-class behavior | ADAPTER | Same reason: the contradiction is evidence, not a bug to fix under slice pressure. Mapping doc records both; MIG-001 pins which fields were consumed from each. |
| Capability registries (unified-registry vs Ω vivim-providers deriveRegistry) | KEEP (both, separated) | Ω registry is pure derivation over vault records (91-line pure module, OBSERVED) — no architectural overlap with VIVIM's engine registry. No merge. |
| Execution models (harness/recipe vs composition ceremony) | RETIRE (VIVIM side, progressively) | Composition ceremony + 18-spec matrix is the ratified Ω path (W1 green). VIVIM harness is assay input only. |
| Selector models (provider selectors vs op-map observations) | MERGE direction VIVIM→data | Selectors become observation data; no selector code ports. |
| State stores (Prisma 200 models vs vault namespaces) | PARTITION (per PROVIDER_DATA_MODEL.md) | Product data → vault; runtime state → sessions/pool; executable specs → compositions; telemetry → ledger. No wholesale port. |
| Conversation models (Prisma vs D-378 index) | ADAPTER then W3 owns | Slice writes vault rows index-compatible; retention/backfill explicitly W3. |

## 4. Target Ω contracts (pinned, no new architecture this slice)

- `message.send@1` (archetype `message.send`) via `provider-browser`.
- `browser.attach@1` / `browser.release@1` session lifecycle.
- `ProviderRealization` + `RealizationStatus` + `EvidenceRef` + `providerRealizationId`.
- `CompositionSpec/Entry` + signed `Recipe` (existing ceremony, untouched).
- Parser pins D-355 + promotion invariant + D-385 governed-pin fence.
- Stream sequence discipline D-352 + fail-closed bars + containment D-386.

No new Ω contract is introduced by MIG-001. If the slice discovers a missing
contract, the STOP condition fires instead of inventing one.
