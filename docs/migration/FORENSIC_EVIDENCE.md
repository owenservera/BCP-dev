# Forensic Evidence — code-grounded findings (Prompt 03, Phases 0–7, 14–16)

> Every claim below cites file:line read this session. Confidence follows the
> migration record vocabulary. This document EXTENDS (does not replace)
> VIVIM_FORENSIC_MODEL.md with the answers the earlier docs left UNKNOWN.

## Phase 15 — Governor questions, answered from code

### Q1 Is ChromeGovernor the sole browser I/O authority? NO (OBSERVED)
`chrome-governor.ts:413-416` exposes the raw transport via `getTransport()`
("for advanced consumers like SelectorHealer"). Production consumer:
`autonomous-execution.ts:1136` takes the raw transport and constructs
`engines/semantic-grounding.ts:50` (`constructor(private readonly transport)`),
which sends CDP directly at 7+ sites (`DOM.getDocument`, `Runtime.evaluate`,
`Page.captureScreenshot`, … lines 137–301) — bypassing proxy mutex, circuit
breaker, and trace. The Governor is the DEFAULT authority with a USED escape
hatch, not the sole authority.

### Q2 Can any engine reach CDP transport directly? YES (OBSERVED)
Above, plus `cdp-proxy.ts:167-280` harness inner actions call
`this.transport?.send(...)` directly (click/navigate/evaluate/scroll/tab/
extract) rather than the proxy's own gated `send()`.

### Q3 Does CDPProxy bypass Governor rules materially? YES (OBSERVED)
- Inner harness actions skip the per-action circuit-breaker check and per-action
  trace that `send()` (`cdp-proxy.ts:57-76`) provides; only step-count events emit.
- `default:` unknown harness actions increment `stepsCompleted` and SUCCEED
  vacuously (`cdp-proxy.ts:286-287`).
- `tab_switch` swallows errors (`.catch(()=>{})`, line 266-269).
- `capture()` timeout with no match RESOLVES empty body instead of rejecting
  (`cdp-transport.ts:152-160`: `finish('')` settles before `reject()` — dead code).
- **Deadlock (STRONGLY_INFERRED):** `AsyncMutex` is non-reentrant
  (`async-mutex.ts:11-33`); `executeHarnessPlan` holds the slave mutex while the
  `capture` action re-acquires it via `this.capture()` (`cdp-proxy.ts:199` vs
  `:81-82`). The timer is armed only after acquire → permanent hang. Runtime
  reproduction outstanding; do not run `capture` inside a harness DAG until proven.

### Q4 Are Runtime.evaluate / Input.* / navigation / capture / harness equally governed? NO (OBSERVED)
Three tiers: (a) `send()` — mutex + circuit + timing events; (b) harness-inner —
outer-mutex only, no circuit, no trace; (c) raw-transport consumers — nothing.
`Input.*` specifically: only reachable via (b)/(c) or mediated evaluate; no
dedicated governed Input path was found.

### Q5 Is provider/account → slave resolution deterministic? NO (OBSERVED)
`ensureRunningForAccount` (`chrome-governor.ts:246-258`) is deterministic
(find by provider+account, else spawn). BUT `resolveSlaveForExecution`
(`:493-516`) takes `slaves[0]` — first slave of the provider, ACCOUNT-BLIND —
and falls back to `spawn(provider,'default')`, discarding the real account.
Two live paths, two semantics: the capability-execution path can deliver one
account's turn through another account's slave.

### Q6 Does the same provider/account always resolve to the intended profile? PARTIAL (OBSERVED)
Profile DIRS are deterministic per (provider,account) (`profile-allocator.ts:
136-146` + `deriveProfile` `:260-265`). But slave ids are unique per spawn
(`${slug}_${account}_${ts}_${counter}`, fleet line 309) — several live slaves
can share one profile dir concurrently, and the execution path (Q5) may pick
the wrong one. Dir identity: yes. Live-slave identity: no.

### Q7 What is durable if the process dies? (OBSERVED)
Profile dirs + cookie files (login truth), DB rows (trace, conversation,
messages, blocks, parsers, bindings, programs), generated protocol file,
seed manifests (source).

### Q8 What is lost? (OBSERVED)
Slaves map (rebuilt from FleetSupervisor each access — fresh but memory-only),
per-slave mutexes, circuit-breaker states, CdpWatchdogs, stealth-applied set,
generic-slave memo, port counter, CDP sessions (re-attach on demand), and the
in-memory stealth-store fallback (`chrome-governor.ts:29-65`, test/dev only —
production must inject a store or stealth profiles evaporate).

### Q9 Can a response be reconstructed from persisted data? YES (OBSERVED)
`conversation-manager.ts:590-657`: user/assistant messages deduped by
`identityHash`, blocks via `blocks.storeBlocks`, content units decomposed,
conversation row updated. A completed turn is fully re-derivable from
message + block + content-unit rows.

### Q10 Can a browser execution be replayed? NO (STRONGLY_INFERRED)
Trace rows record method + params + result, but harness DAG re-execution
depends on live page state, timeouts, and wall-clock; no replay harness exists
in tree (searched: no `replay` engine under src/engines or executor).

### Auth recovery: BROKEN by default wiring (OBSERVED absence + STRONGLY_INFERRED break)
`recoverAuth` is declared on the contract (`storage/contracts/fleet-supervisor.
ts:40`) and called by governor (`:271-272`) and `fleet-lifecycle-adapter.ts:
18-19` — but the real `FleetSupervisor` class defines NO such method
(confirmed by exhaustive search). Default wiring (`new FleetSupervisor(...)`,
governor `:162-179`, no injection site found under src/server) → TypeError on
invocation. Likewise `healSelector` calls `ensureRunning('default')` although
no instance can bear that id (id scheme `slug_account_ts_counter`) →
`SlaveNotRunningError` → swallowed by `catch{}` → healing silently no-ops
(OBSERVED code path; runtime confirmation outstanding).

## Live-path authority — RESOLVED (was UNKNOWN in MIG-001/002)
Manifest → DB seed (`provider-registrar.ts:2-4,76-139`) → static generated file
(`provider-protocol-generator.ts:181-248` → `src/__generated__/`) → runtime
imports generated protocol with ZERO DB reads on hot path
(`provider-protocol-loader.ts`, default `generated`, gitignored `dev` override
via env). The old plugin classes (`chatgpt.ts` etc.) are NOT in this chain:
they are the legacy/compat path. Verdict for the mapping doc's Migration-#2
question: generated protocol is live; plugin classes RETIRE; unified interface
+ factory registry is the write-path for NEW providers (additive per header).
Confidence: STRONGLY_INFERRED (full chain observed in code; live trace would
make it PROVEN).

## Conversation lifecycle (Phase 6 — OBSERVED)
`send(conversationId,message)` → `sendInternal`: conversation load → provider-
session resolution → context assembly → user-message dedup by identityHash →
execution → parse → assistant dedup by identityHash → `storeBlocks` → content
units → captureAsNode → conversation update. Exactly-once intent is MECHANICAL
(hash-existence checks at `:590-623`), not aspirational. Canonical ids:
conversationId, providerSessionId, accountId, providerMessageId (via
message_start meta), identityHash, message sequence, programId,
selectorStrategyId, traceId (all OBSERVED as fields; dedup key = identityHash).

## Discovery bridge gap (Phase 5 — OBSERVED)
Onboarding CAN mint ProviderDefinition + CapabilityBinding rows and synthesize
ProviderParser code (orchestrator staged pipeline with budgets; parser-synth
writes ProviderParser per its header). It discovers entities WITH selectors
(orchestrator `:309`, verified by querySelector `:504-508`). It does NOT create
CapabilityProgram rows or SelectorStrategy rows — discovered providers cannot
execute until programs/recipes are authored separately. THE missing bridge,
named precisely.

## Phase 14 — duplicate classification
| Duplicate | Verdict | Rationale |
|---|---|---|
| Manifest row vs old plugin class | RETIRE (plugin) | Generated protocol is live; classes not in chain |
| Old plugin interface vs unified interface | MERGE toward unified | Header declares direction; factory registry is write path |
| Generated vs dev protocol | KEEP (env-gated) | Explicit override mechanism, gitignored |
| Static 96-CDP catalog vs snapshot vs unified registry vs binder graph vs taxonomy vs shape-registry | ADAPTER now, MERGE later | 7 representations; snapshot is the execution live path (boot map); taxonomy/shape are knowledge; binder is run-scoping; parity auditor is read-only. Merge needs a non-provider migration to design. UNKNOWN→tracked |
| StreamParserEngine DB logic vs seed parser files | KEEP (layered) | Seeds are source; DB rows are runtime; generated file is hot path — 3 stages, one direction |
| conversation identity (7+ id fields) | KEEP | Distinct jobs (dedup key vs lineage vs provenance); document, don't collapse |

## Phase 16 — data answers (operational meanings)
GLOBAL: send_message/select_model intent, capability taxonomy, recipe shape.
PROVIDER: endpoints/selectors/composer policy/stream grammar/parser/recovery/models.
ACCOUNT: email/profile/cookies/slave binding (profile dir deterministic).
EXECUTION: program version (mutable "best" — provenance warning), selector used,
latency, trace, parser log, outcome. USER-DATA: conversation/message/block/content-unit rows. TELEMETRY: health ticks, fleet events, metrics. EVIDENCE: trace + parser log + outcome + provenance refs. RUNTIME-ONLY: slaves map, mutexes, circuits, sessions, watchdogs. Schema verdict per table, not whole: port semantics (ProviderDefinition/Endpoint/Parser/Binding/Program/Selector/Conversation/Message/Block as op-map+pin+record data), PARTITION runtime/telemetry, RETIRE duplicate registries' authority claims, COMPRESS 200 models to referenced-not-copied.
Migrate semantics, never tables.

## Phase 7 — Ω seam marks
| Desired integration | Mark | Evidence |
|---|---|---|
| Execution boundary (recipe→DAG→proxy) | EXISTS | runHarnessPlan/proxy/harness actions + Ω message.send bars |
| Capability/law model | EXISTS | contracts/src (7 files, all resolve) |
| Evidence/provenance | EXISTS | trace + parser log + outcome + vault refs |
| Intent resolution | PARTIAL | parity auditor + unified registry exist; NL→capability path not traced live |
| Session/lease authority | PARTIAL | browser.attach + realization lifecycle exist; Q5 account-blindness must not cross |
| Block-kind vocabulary | MISSING | chat.ts flat content; U-5/I-7 open |
| Deterministic replay | MISSING | Q10; do not claim |
| Chat vault message rows | PARTIAL | chat.ts exists; pack-schema exactness open (L-5) |
| Auth recovery | CONFLICTING | VIVIM path broken-by-default; Ω must NOT inherit the shape, only the requirement |
| Harness capture-in-DAG | CONFLICTING | deadlock pattern; Ω sequencing must prove reentrancy-safety |
