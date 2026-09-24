# P1-05 / WS-005 — PHASE-1-KERNEL-BASELINE

> **Classification:** DERIVED — CURRENT RUNTIME CHARACTERIZATION + GAP BASELINE  
> **Workstream:** WS-005 / P1-05 — Ω Plugin Kernel & Runtime  
> **Runtime source snapshot:** `6c1c392d5b71c45db6fe3d6e30cafc72ec2cf362`  
> **Publication note:** `main` advanced after this source snapshot with documentation-only P1-03 work before this WS-005 document; the runtime/plugin source characterized here was unchanged.  
> **Repository:** `owenservera/BCP-dev`  
> **Branch:** `main`  
> **Date:** 2026-09-25  
> **Scope:** M1–M4 characterization and design only. No `host/src`, `contracts/src`, or plugin source was modified by this workstream.

## 0. Result at a glance

The current Ω kernel is not a blank design. It is a functioning minimal runtime substrate with a clear split of responsibilities:

- **µHost:** verifies a signed composition, creates worker compartments, mints and checks capability tokens, routes port calls, enforces call budgets/queues, handles host-internal transport operations, and maintains the D-340 graph/arbiter/kernel attachment.
- **Contracts:** define the manifest, Recipe, grants, ports, lifecycle vocabularies, provider-realization records, and related wire/data shapes.
- **Shim:** gives plugin code the compartment-facing `PluginContext`; plugin-to-plugin and plugin-to-host calls are made through `ctx.port.call()`.
- **Plugins:** own domain behavior, provider realization behavior, authorization/governance policy, and vault data semantics.
- **Out-of-tree tooling:** owns the authoring generator, watchdog, and other operational surfaces.

The hard B1–B5 boundary is therefore substantially real today.

Two genuine kernel/runtime gaps remain:

1. **B1 entry-path confinement is not enforced.** The manifest entry is hashed only indirectly through the plugin content directory; the verifier does not currently prove that `entry` remains inside that hashed directory before execution.
2. **True post-boot dynamic load/unload is not implemented.** v1 supports signed composition-time loading plus lazy activation and termination; a new composition entry cannot be added without a recipe reboot, and termination does not unregister the stopped implementation from the router/graph.

Neither gap currently blocks the committed P1-06 or P1-08 Phase-1 implementations. The first is a kernel correctness/security hardening issue that should be closed before treating arbitrary future manifests as B1-complete. The second is a forward-looking dynamic-composition capability and should not cause a Phase-1 host expansion.

The P1-06 and P1-08 live proofs remain separate matters: their repository implementations are characterized here, but this document does not convert their coded state into live execution proof.

---

# M1 — Host / Contracts Characterization

## M1.1 Authoritative scope and snapshot

The registry defines P1-05 as:

- **Mission:** make everything-is-a-plugin composition work through the minimal governed runtime substrate.
- **Boundary:** µHost, contracts, ports, lifecycle, composition, loading/unloading, realization mechanics, authoring substrate.
- **Hard separation:** runtime mechanics are not authorization policy.
- **Dependencies:** P1-03; P1-06; B1–B5; Forge.

Source: `docs/agent-system/WORKSTREAMS.md:49-54`.

The runtime source snapshot used for the characterization is `6c1c392d...`. The older WS-002 truth document records `630ee5d...` as its own baseline tip; that is a historical snapshot inside WS-002, not the current repository tip. WS-002 itself explicitly distinguishes repository reality from historical state and implementation claims (`docs/agent-system/workstreams/WS-002/PHASE-1-TRUTH-BASELINE.md:1-35`).

P1-06 remains coded/committed but **NEEDS RUN**; its document expressly makes no live-execution claim (`docs/agent-system/workstreams/WS-006/PHASE-1-GOVERNANCE-CHAIN.md:1-15`). P1-08 is implemented/committed with the real browser execution leg but also remains **M4 NEEDS OWNER RUN** (`docs/agent-system/workstreams/WS-008/PHASE-1-HANDOFF-PACKAGE.md:1-20`).

## M1.2 B1–B5 laws actually stated by the Ω README

The authoritative README states the following current constraints (`omega-baseline/omega-final/README.md:14-24`):

| Law | What the current repository says it means |
|---|---|
| **B1** | No code executes unless a signed manifest entry in the Recipe references its content hash. |
| **B2** | Each plugin gets a separate worker-thread compartment; heaps are not shared and inter-compartment messaging crosses the Port Protocol. Isolation is explicitly against coupling, not resource exhaustion; Bun does not enforce the worker memory limits, so the watchdog is a detection/containment mechanism rather than a full exhaustion boundary. |
| **B3** | Capability tokens are verified on the host side, outside compartments. |
| **B4** | Verification failures refuse the composition; boot uses the pinned recipe as the fallback/durability anchor. |
| **B5** | `host/src` is hard-capped at 1,500 LOC; the host may not gain surface area without removing equal-or-greater old surface in the same commit. |

The README also fixes two adjacent boot laws in the same section: `bootPhase 0` is reserved to `vivim.law`, and manifests are requests while the signed Recipe is the only grantor (`omega-baseline/omega-final/README.md:18-24`).

The corresponding machine-oriented invariant snapshot confirms B1–B5, including the exact `1500/1500` freeze and the B2 exhaustion limitation (`omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md:74-80`).

## M1.3 µhost size — current result

The current `omega-baseline/omega-final/host/src/` tree contains 13 TypeScript files:

| File | Lines |
|---|---:|
| `audit.ts` | 61 |
| `boot.ts` | 104 |
| `canon.ts` | 128 |
| `contract.ts` | 38 |
| `genesis.ts` | 42 |
| `graph.ts` | 90 |
| `index.ts` | 16 |
| `main.ts` | 66 |
| `ports.ts` | 508 |
| `recipe.ts` | 179 |
| `recovery.ts` | 76 |
| `state.ts` | 37 |
| `worker.ts` | 155 |
| **Total** | **1,500** |

So the B5 discipline is **currently holding exactly**: **1,500 / 1,500 lines, zero headroom**. This matches the repository's own invariant snapshot (`CURRENT-INVARIANTS.md:80` and `:204`).

This is not approximate: the 13 current source files sum to exactly 1,500 physical source lines. Any future host-touching implementation must therefore remove equal-or-greater existing host source in the same change; adding a new host API is not a free extension.

## M1.4 µhost responsibility by source

### Boot, verification, and composition

`host/src/boot.ts:1-104` is the boot coordinator. It verifies the recipe, establishes the root-of-trust relationship, verifies composition invariants, verifies all entries, builds routing, attaches the D-340 kernel, then starts the composition.

The actual verification chain is visible in `host/src/boot.ts:39-69`:

1. verify the Recipe signature;
2. verify that the Recipe root public key matches the vault root;
3. verify composition invariants;
4. verify each entry against the Recipe root;
5. build the routing table;
6. refuse on any accumulated verification error.

Boot then sorts by `bootPhase`. Only phase 0 is spawned eagerly; later entries are registered dormant and are spawned on first routed call. The actual mechanism is `host/src/boot.ts:71-104`.

### Recipe / manifest model

The contracts layer makes the distinction explicit:

- `PluginManifest` is a **request** containing identity, entrypoint, publisher signature, contributions, dependencies, requested capabilities, runtime declaration, content hash, and optional extraction/generality data (`contracts/src/manifest.ts:1-147`).
- `Recipe` is the signed composition and contains entries, explicit grants, root of trust, and signature; the unsigned `CompositionSpec` is the human-authored pre-compile form (`contracts/src/recipe.ts:1-42`).
- `routableOps()` deliberately considers only `contract`, `engine`, and `provider` contributions routable; `lang` and `parser` are data contributions, not operations (`contracts/src/manifest.ts:1-147`).

The host's Recipe compiler signs each manifest, computes its content hash, records the manifest hash, records explicit capability/contract grants from the composition spec, signs the Recipe, and atomically writes the generated Recipe (`host/src/recipe.ts:86-144`).

The verifier checks the manifest digest, publisher signature, source directory existence, and content hash before boot (`host/src/recipe.ts:148-179`).

### Content hashing / evidence of executed bytes

The content hash is deterministic over sorted relative paths and per-file SHA-256 values. Symlinks are rejected. The hashing exclusion set is `node_modules`, `.git`, `plugin.json`, `package.json`, and a few platform/editor artifacts (`host/src/canon.ts:18-70`).

That means B1 currently protects the plugin directory's hashed contents, but it does **not** yet structurally prove that the manifest's executable `entry` is inside that hashed tree. This is the first M3 gap below.

### Port protocol

The wire contract is explicit in `contracts/src/port.ts:1-95`:

- `PortMessage` carries a host-minted causation id, opaque capability token, operation id, structured payload, and deadline.
- `PortResult` is either success or one of the fail-closed error codes `REFUSED`, `REVOKED`, `SCOPE`, `BUDGET`, or `DEGRADED`.
- Refusals may carry an attributable `RefusalReport`.
- Streaming is additive through `StreamChunk`; chunks are 1-based and contiguous.
- Principal classification is data-level and does not reject unknown strings.

The shim exposes exactly one plugin-facing call route: `PluginContext.port.call()`. It looks up the token by `port:<op>`, returns refusal if the token is absent, and sends the call to the host transport (`omega-baseline/omega-final/shim/src/index.ts:1-48`). This is the actual plugin-facing boundary.

### Capability-token model

The Recipe grants capability strings; the host mints opaque tokens for those grants and stores the token-to-plugin-to-capability association.

`host/src/ports.ts:63-96` shows registration and token installation. Host operation aliases such as `port:host.compartment.stats@1` resolve to the same effective guarding capability as their host-op mapping, making the authority independent of insertion order.

The B3 enforcement point is `host/src/ports.ts:187-218`:

- token must exist;
- token owner must equal the calling compartment;
- revoked/generation-invalid tokens are refused;
- host ops must match their exact guarding capability;
- ordinary routed ops require the exact `port:<op>` capability.

No plugin gets to self-authorize by merely declaring a manifest capability request.

### Compartment model

The worker contract is in `host/src/worker.ts:1-155`.

The actual compartment is one `worker_threads.Worker` per plugin, wrapped by `CompartmentHandle`. Its runtime state is:

`booting | active | degraded | stopped`

and its counters record delivery, calls, errors, crashes, boot time, and the last error (`host/src/worker.ts:55-67`).

Graceful termination sends shutdown and gives the worker a bounded 2.5 seconds before forced termination; the fast path has a 500 ms bound (`host/src/worker.ts:70-118`).

The worker header also records the current B2 honesty statement: worker threads provide isolate separation, but Bun does not enforce `resourceLimits`; the watchdog is outside the host and bounds detection time rather than creating a hard resource-exhaustion wall (`host/src/worker.ts:1-11`).

### Port routing, lifecycle of a call, and lazy realization

The router owns:

- active compartment handles;
- manifests;
- operation routes;
- operation risk;
- token records;
- in-flight calls;
- queued calls;
- dormant entries;
- ready waiters;
- kernel graph state.

These are the core maps in `host/src/ports.ts:30-52`.

A phase>0 entry can be registered **without being spawned**. Its manifest, route, graph registration, and tokens exist while its transport remains dormant (`host/src/ports.ts:89-96`). First touch uses single-flight spawning; failed spawns remain dormant so later calls retry rather than silently becoming active (`host/src/ports.ts:98-114`).

The route path is:

1. token structural check;
2. resolve target implementation;
3. for risky work, call `law.check@1`;
4. only after the gate permits, spawn a dormant implementation if needed;
5. reject absent/stopped/degraded implementations;
6. deliver over the worker message channel.

That sequence is directly in `host/src/ports.ts:261-309`.

The host does not itself decide whether an external mutation is lawful. `law.check@1` is the special gate exception because it is the gate itself; the host only transports and journals the decision (`host/src/ports.ts:281-309`). This is the required runtime-mechanics / authorization-policy separation.

### Queueing, budgets, and failure propagation

Per-compartment concurrency defaults to 4 unless the manifest says otherwise. Calls are queued, gate-priority calls may move ahead of normal calls, and deadlines are enforced both while queued and while in flight (`host/src/ports.ts:311-343`).

Crash handling rejects queued and in-flight requests and wakes readiness waiters as degraded (`host/src/ports.ts:471-483`).

### Host-internal transport operations

The host currently exposes the following host operations through the same capability-gated route:

- compartment stats;
- compartment termination;
- journal append;
- token revoke;
- state acquire/release;
- graph snapshot;
- audit-chain export.

The implementation is `host/src/ports.ts:346-430`.

Notably, `host.compartment.spawn@1` is intentionally **not** a dynamic loader. It always returns `REFUSED` and states that restart means rebooting the composition from the signed Recipe (`host/src/ports.ts:365-370`).

This is important to the loading/unloading gap below.

### State arbitration and kernel attachment

D-340 gives the host one non-plugin state arbiter. `host/src/state.ts:1-37` provides shared/exclusive acquisition; conflicting acquisition refuses rather than silently queueing.

The corresponding host operations are `host.state.acquire@1` and `host.state.release@1`, reached through the router's ordinary host-op path (`host/src/ports.ts:388-414`).

The host also exposes a copy-out graph snapshot and audit-chain export to the kernel lens, not mutable references (`host/src/ports.ts:404-430`).

## M1.5 Lifecycle model — what exists, and what it does not mean

There are **three distinct lifecycle vocabularies**, and they must not be collapsed:

1. **Compartment transport state:** `booting | active | degraded | stopped` in `host/src/worker.ts:55-67`.
2. **Generic lifecycle vocabulary:** `staged | verified | active | degraded | quarantined | retired` in `contracts/src/lifecycle.ts:1-45`.
3. **Provider realization state:** `DRAFT | TESTING | PROMOTED | DEGRADED | REQUIRES_REDISCOVERY`, with promotion determined by evidence/probes rather than confidence, in `contracts/src/vocabulary.ts:1-77` and the `ProviderRealization` record in `contracts/src/provider.ts:1-167`.

The host does not pretend that these are the same state machine.

This is intentional. The host's own worker header says lifecycle policy belongs outside the host, through `vivim.run` and the host compartment-admin transport (`host/src/worker.ts:1-11`). CURRENT-INVARIANTS likewise states that tile/process lifecycle scheduling stays plugin-side and the host does nothing new (`CURRENT-INVARIANTS.md:163`).

Therefore **the absence of `quarantined` or `retired` in `CompartmentHandle.state` is not itself a kernel defect**. Those are semantic/policy states; the host supplies transport primitives such as terminate, revoke, stats, and reboot composition.

## M1.6 Composition and loading semantics

The composition model is strong for the fixed v1 use case:

- human-authored spec has no hashes/signatures;
- compiler produces signed manifest files and a signed Recipe;
- boot verifies before execution;
- phase 0 is exactly `vivim.law`;
- later entries may be lazy/dormant;
- first routed use activates a dormant entry.

The composition invariant is enforced directly by `host/src/recipe.ts:39-52` and the phase-ordered boot is implemented in `host/src/boot.ts:71-104`.

What v1 does **not** provide is a general hot-load/hot-unload composition manager. That is a real boundary of the current kernel and is characterized in M3.

## M1.7 Authoring substrate

The authoring substrate already exists and is deliberately outside the µhost.

The repository's D-377 rule states that the composition matrix is the source of truth and that new plugins/packs are authored through `omega:generate plugin|pack`, not by hand (`omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md:186-193`).

The actual generator is in `omega-baseline/omega-final/tooling/generate/generate.ts`. It identifies itself as the W0-1 authoring path, emits plugin scaffolds, and includes the authoring checklist (`generate.ts:1-11`, `:96-111`, `:145-179`, `:319`).

The compiler then converts that authored source into a signed composition through `host/src/recipe.ts:105-144`.

**Conclusion:** authoring is not a missing P1-05 substrate today. It is already implemented as an out-of-tree tool + composition compiler.

---

# M2 — Compliance Check Against the Committed Phase-1 Plugins

## M2.1 Audit method

The check was performed against the committed source currently on `main`, not against design prose.

For each target plugin, the source set was checked for:

- direct imports of `@vivim/omega-host`;
- direct use of `worker_threads`, `Worker`, `parentPort`, or `PortRouter`;
- direct host-compartment manipulation;
- cross-plugin interaction that bypasses `ctx.port.call()`;
- manifest capabilities that are not represented by the actual call pattern.

No such direct host-runtime bypass was found in the current TypeScript source sets for `provider-browser`, `vivim-agent`, or `vivim-law`.

## M2.2 P1-08 — `provider.browser`

The manifest identifies its entry as `src/index.ts`, requests only port capabilities, and declares `message.send@1` as a provider contribution (`plugins/provider-browser/plugin.json:3-30`).

Its application code uses the shim boundary:

- `portCall()` calls `ctx.port.call()` (`plugins/provider-browser/src/index.ts:51-60`);
- initialization registers the day-one fence through `law.forbidden.set@1`, again by port (`src/index.ts:104-124`);
- capture redaction uses `credential.redact@1`, then storage uses `vault.append@1` through the port (`src/index.ts:126-177`);
- session release uses `vault.get@1` and `vault.append@1) through the same port route (`src/index.ts:178-220`);
- the send path resolves its session and realization via port calls and only then executes its provider-specific logic (`src/index.ts:221-300`).

The live ChatGPT leg uses a plugin-local localhost CDP client in `src/live.ts`. Its direct external interaction is with the caller-supplied localhost Chrome debugging endpoint, not with the µhost. The file explicitly states that the CDP leg stays inside the plugin because P1-08 cannot add a host surface (`plugins/provider-browser/src/live.ts:1-17`).

That is **not a Port Protocol violation**. The plugin is the provider implementation; accessing the external provider application is its domain job. The boundary being tested here is the plugin↔µhost/kernel boundary, and that boundary is respected.

### Finding M2-P08

**No violation found.**

No P1-05 correction is required in provider-browser.

P1-08's remaining live-proof work is still owner-side execution and gate evidence, not a kernel boundary problem. WS-008 explicitly records that status (`docs/agent-system/workstreams/WS-008/PHASE-1-HANDOFF-PACKAGE.md:1-20`).

## M2.3 P1-06 — `vivim.agent`

The manifest defines the agent control-plane operations as engine contributions and requests only `port:* ` capabilities, including `port:message.send@1`; it requests **no host capabilities** (`plugins/vivim-agent/plugin.json:3-35`).

The source uses `ctx.port.call()` for its cross-plugin/runtime interactions:

- generic port helper and vault reads: `src/index.ts:92-102`;
- ledger query: `src/index.ts:315`;
- the coded Phase-1 governance path calls `law.describe@1` and `invoke.check@1` through the port, then invokes `message.send@1` through the port (`src/index.ts:158-252`);
- the later control/adaptation paths continue using vault/control operations through `ctx.port.call()` (`src/index.ts:723-740`, `:909-928`).

The source audit found no `@vivim/omega-host`, `PortRouter`, `worker_threads`, `parentPort`, or direct Worker construction in the current `vivim-agent/src/` source set.

### Finding M2-P06

**No violation found.**

No P1-05 correction is required in vivim-agent.

This workstream intentionally does not re-evaluate or redesign P1-06's authorization chain. The relevant fact for P1-05 is simply that its committed implementation enters the target capability through the existing port boundary.

## M2.4 P1-06 — `vivim.law`

`vivim.law` is different because it is legitimately allowed to consume several host transport capabilities.

The manifest requests:

- `host.journal.append`;
- `host.tokens.revoke`;
- `host.kernel.lens`;
- plus vault ports.

Those are explicit requests in `plugins/vivim-law/plugin.json:148-159`. The manifest is not a grant; the Recipe must still grant the capability.

The source accesses those host operations **through the same Port Protocol**:

- journal fallback uses `ctx.port.call(HOST_OPS.journalAppend, ...)` (`plugins/vivim-law/src/index.ts:407-445`);
- audit-chain export calls `ctx.port.call(HOST_OPS.auditChain, {}), then persists via `vault.append@1` (`src/index.ts:610-629`);
- token revocation calls `ctx.port.call(HOST_OPS.tokensRevoke, ...)` (`src/index.ts:693-710`).

The current source set was also checked for direct imports/use of `@vivim/omega-host`, `PortRouter`, `worker_threads`, `parentPort`, or direct Worker construction; none were found.

### Finding M2-LAW

**No violation found.**

The host capability use by vivim-law is a legitimate **ports-based consumption of the host transport surface**, not a bypass. It does not introduce a new host API and does not directly reach host internals.

Again, P1-05 does not judge the law plugin's authorization policy. The characterization here is only that the runtime mechanics remain inside the existing boundary.

## M2.5 Compliance conclusion

| Target | Manifest/entry boundary | Runtime boundary | Direct host bypass | P1-05 action |
|---|---|---|---|---|
| `provider.browser` | Compliant | Uses shim + port; provider CDP stays plugin-local | **None found** | None |
| `vivim.agent` | Compliant | Uses shim + port for governance/vault/action calls | **None found** | None |
| `vivim.law` | Compliant | Uses shim + explicitly granted host ports | **None found** | None |

**There is no M2 violation to route back to P1-06 or P1-08.**

---

# M3 — Genuine Mission Gaps vs Already-Solved Mechanics

## M3.1 Mission matrix

| Mission concern | Current implementation | Classification | Phase-1 blocker? |
|---|---|---|---|
| µHost | 13-file, exactly 1,500-line host with boot/verify/router/worker/kernel primitives | **SOLVED / frozen** | No |
| Contracts | Manifest, Recipe, Port, lifecycle, provider-realization and supporting vocabularies exist | **SOLVED for v1** | No |
| Ports | Host-side token verification + worker transport + result/refusal/stream shapes | **SOLVED** | No |
| Capability model | Recipe grants + opaque host-minted tokens + scope checking | **SOLVED** | No |
| Compartment model | One Worker per plugin, shared-nothing, bounded call queues, crash propagation | **SOLVED for current B2** | No |
| Composition | Signed Recipe, manifest/content verification, boot-phase invariant, route conflict checks | **SOLVED for fixed v1 composition** | No |
| Lifecycle | Transport state exists in host; semantic lifecycle remains plugin-owned | **SOLVED by deliberate ownership split** | No |
| Realization mechanics | ProviderRealization record + discovery promotion/healing vocabulary + provider-browser enforcement | **SOLVED outside host** | No |
| Authoring substrate | `omega:generate plugin|pack` + composition generator + Recipe compiler | **SOLVED outside host** | No |
| B1 executable-entry confinement | Content hash is verified, but executable `entry` is not proven to remain inside the hashed source directory | **REAL GAP — hardening required** | No current P1 blocker; affects general future composition |
| Dynamic post-boot loading | `compartment.spawn@1` explicitly refuses and requires recipe reboot | **REAL GAP — forward-looking** | No |
| True unregister/unload | terminate stops worker but does not remove its route/manifest/token/graph registration | **REAL GAP — forward-looking** | No |
| Process tier in µhost | Process is declared in contracts but intentionally broker-owned outside host | **NOT A GAP** | No |
| WASM tier | Vocabulary only; forward-declared | **NOT A GAP** | No |

## M3.2 GAP-01 — B1 executable-entry confinement

### Evidence

The host verifies the manifest signature and computes/compares the content hash of the resolved source directory (`host/src/recipe.ts:148-179`).

The hashing function covers the plugin directory's files but intentionally excludes `plugin.json`, `package.json`, and `node_modules` (`host/src/canon.ts:18-70`).

The actual worker is then created from:

`new Worker(join(sourceDir, entry))`

in `host/src/worker.ts:121-123`.

The verifier currently checks that `entry` is a string (`host/src/recipe.ts:86-97`) but does not establish that the normalized resolved entry path is contained by `srcDir`.

### Why this is a genuine gap

B1 is about **executed code**, not just the existence of a valid signed manifest.

Today a manifest can name an entry such as a path containing parent-directory traversal. The source directory hash can still verify while the runtime resolves an executable path outside that hashed tree.

The problem is therefore not that the Recipe signature is weak; the problem is that the signed manifest's executable path is not currently proven to refer to bytes covered by the content hash.

This is a kernel verification defect, not authorization policy.

### Current Phase-1 impact

The committed P1-06, P1-08, and `vivim.law` manifests all use `entry: src/index.ts` (`provider-browser/plugin.json:6`, `vivim-agent/plugin.json:6`, `vivim-law/plugin.json:6`). Those entries are conventionally inside the hashed plugin tree.

Therefore **no current Phase-1 plugin is blocked by GAP-01**.

The gap matters before broadening the system to arbitrary plugin manifests.

## M3.3 GAP-02 — dynamic loading is not implemented

The host exposes `host.compartment.spawn@1` as a declared host operation, but the implementation intentionally refuses every invocation and says restart means rebooting the composition from the Recipe (`host/src/ports.ts:365-370`).

Current loading semantics are therefore:

- composition-time verification;
- eager boot for phase 0;
- registration-as-dormant for later phases;
- lazy spawn on first routed use.

That is a valid v1 composition model, but it is not hot-loading.

### Current Phase-1 impact

None.

P1-06 and P1-08 are already composed against the same signed runtime and can be lazy-spawned from the verified Recipe. No Phase-1 flow requires adding a new plugin after boot.

**Classification: forward-looking gap, no current hardening.**

## M3.4 GAP-03 — termination is not full unregister/unload

The host's termination path fails in-flight work and terminates the worker, but its current data structures retain the compartment/manifests/routing/token/graph registrations (`host/src/ports.ts:346-386`, `:471-493`).

The resulting state is effectively:

- worker stopped;
- route still known;
- future dispatch sees the stopped handle and returns `DEGRADED`.

That is sufficient for containment, but it is not a clean dynamic-unload primitive that removes an implementation from the composition.

### Current Phase-1 impact

None.

No Phase-1 workstream currently needs to remove a plugin from a live composition. Quarantine/termination policy is also intentionally outside the host's semantic lifecycle ownership.

**Classification: forward-looking gap, no current hardening.**

## M3.5 What is deliberately NOT a gap

### Semantic lifecycle

The generic `LifecycleState` vocabulary and the provider `RealizationStatus` vocabulary already exist. The host does not need to become the policy owner of those states. The current design puts semantic lifecycle and quarantine decisions outside the µhost while keeping transport controls in the host.

### Realization mechanics

The host does not need to learn provider-specific realization logic. The `ProviderRealization` record and its proof/promotion lifecycle are contract data, while discovery verification/healing and provider plugins write/read those records (`contracts/src/provider.ts:75-167`, `contracts/src/vocabulary.ts:1-77`).

### Authoring

The authoring generator and composition compiler already form a real authoring path. CURRENT-INVARIANTS explicitly calls the matrix + generator the authoring source of truth (`CURRENT-INVARIANTS.md:186-193`).

### Process / WASM isolation tiers

`RuntimeTier` includes `worker-thread | process | wasm`, but `process` is intentionally broker-owned and `wasm` is forward-declared only (`contracts/src/manifest.ts:20-48`). This is an explicit architectural split, not an incomplete µhost implementation.

---

# M4 — Minimal Hardening Proposal (Design Only)

This section is intentionally small. It does **not** implement anything.

## H-01 — Enforce B1 executable-entry confinement

### Design

Strengthen the existing Recipe/manifest verification path; do not add a new host API.

At both composition compilation and boot verification:

1. Resolve `entry` against the resolved plugin source directory.
2. Normalize the result.
3. Verify that the normalized entry remains inside that source directory.
4. Verify that it exists and is a regular file.
5. Only then accept the manifest as B1-compliant.
6. At boot, use the already validated resolved path for worker creation rather than recomputing an unchecked path.

The containment check should be based on normalized path-relative semantics, not string-prefix matching.

### Placement

The natural existing seams are:

- compile-time validation in `host/src/recipe.ts:105-144`;
- synchronous entry verification in `host/src/recipe.ts:148-160`;
- asynchronous verification in `host/src/recipe.ts:161-179`.

No new externally visible host surface is required.

### B5 constraint

Any implementation must still end at or below **1,500 host lines**. Because B5 is a hard same-commit removal rule, the implementation must identify compensating host-source removal before code lands.

### Proof condition

A future gate should demonstrate that:

- a normal `src/index.ts` entry passes;
- `../outside.ts` refuses before execution;
- an entry pointing to a symlink refuses consistently with the existing symlink-hash rule;
- a signed manifest cannot cause an execution path outside the content-hashed tree.

## H-02 — Keep dynamic composition out of the Phase-1 host

No immediate host hardening is proposed for dynamic load/unload.

The minimal future design is:

- composition changes produce a new signed Recipe;
- the composition is verified as a unit;
- activation occurs by rebooting into the new pinned composition;
- lazy activation remains the low-cost intra-composition loading mechanism;
- a future hot-load feature, if ever required, must be a separate design decision and must not grow the µhost casually under B5.

This is intentionally consistent with the current `host.compartment.spawn@1` refusal (`host/src/ports.ts:365-370`) and the B5 rule.

## H-03 — Preserve the current lifecycle ownership split

No host-wide `LifecycleState` expansion is proposed.

Keep:

- host = transport/runtime state and containment;
- plugins/governed services = semantic lifecycle, quarantine, retirement, realization promotion/healing;
- Recipe = composition authority;
- law = authorization policy.

This avoids turning P1-05 into a second implementation of P1-06.

---

# Final Proof Statement

Given only this document and the cited source locations, a reader can state the following without relying on aspirational README prose:

1. **The µhost is real and current:** `host/src` is exactly 1,500 lines across the current 13-file source tree, matching the B5 1,500/1,500 freeze.
2. **The contract layer is real:** `contracts/src` contains 22 files and **1,632 physical source lines**, including the actual manifest, Recipe, Port, lifecycle, provider-realization, and supporting vocabulary types.
3. **The grant boundary is real:** manifests request; the signed Recipe grants; the host mints and verifies opaque capability tokens.
4. **The compartment boundary is real:** plugin code executes in isolated workers and uses the shim's `ctx.port.call()` route for BCP runtime/plugin interactions.
5. **P1-06's committed plugin respects that boundary:** it requests port capabilities, has no host capability grant, and reaches `message.send@1` through the existing port path.
6. **P1-08's committed plugin respects that boundary:** its provider/browser behavior stays inside the plugin and reaches vault/law/capture services through `ctx.port.call()`; its localhost CDP interaction is provider behavior, not a new µhost surface.
7. **vivim.law respects that boundary:** even its legitimate host capabilities are consumed through the existing port route; it does not directly import or manipulate the host.
8. **The current runtime does composition-time verified loading + lazy activation + termination, not live hot-loading/hot-unloading.**
9. **Realization and semantic lifecycle are deliberately plugin-owned mechanisms, not hidden host responsibilities.**
10. **Authoring is already present outside the µhost through the D-377 generator/composition path.**
11. **One B1 hardening defect is real:** executable entry confinement must be enforced so signed code execution is provably contained inside the hashed plugin tree.
12. **No current P1-06 or P1-08 implementation is blocked by the identified forward-looking dynamic-composition gap, and this baseline does not turn their outstanding owner-run work into live proof.**

## Evidence index

Primary source anchors used throughout this baseline:

- `docs/agent-system/WORKSTREAMS.md:49-54`
- `omega-baseline/omega-final/README.md:14-24`
- `omega-baseline/omega-final/docs/decisions/CURRENT-INVARIANTS.md:74-80`, `:102`, `:163`, `:186-204`
- `omega-baseline/omega-final/host/src/boot.ts:39-104`
- `omega-baseline/omega-final/host/src/canon.ts:18-70`
- `omega-baseline/omega-final/host/src/recipe.ts:39-52`, `:86-179`
- `omega-baseline/omega-final/host/src/ports.ts:30-52`, `:63-114`, `:187-218`, `:261-343`, `:346-493`, `:495-508`
- `omega-baseline/omega-final/host/src/state.ts:1-37`
- `omega-baseline/omega-final/host/src/worker.ts:1-155`
- `omega-baseline/omega-final/contracts/src/manifest.ts:1-147`
- `omega-baseline/omega-final/contracts/src/port.ts:1-95`
- `omega-baseline/omega-final/contracts/src/recipe.ts:1-42`
- `omega-baseline/omega-final/contracts/src/lifecycle.ts:1-45`
- `omega-baseline/omega-final/contracts/src/vocabulary.ts:1-77`
- `omega-baseline/omega-final/contracts/src/provider.ts:1-167`
- `omega-baseline/omega-final/shim/src/index.ts:1-48`
- `omega-baseline/omega-final/plugins/provider-browser/plugin.json:3-30`
- `omega-baseline/omega-final/plugins/provider-browser/src/index.ts:51-300`
- `omega-baseline/omega-final/plugins/provider-browser/src/live.ts:1-17`
- `omega-baseline/omega-final/plugins/vivim-agent/plugin.json:3-35`
- `omega-baseline/omega-final/plugins/vivim-agent/src/index.ts:92-252`, `:315`, `:723-740`, `:909-928`
- `omega-baseline/omega-final/plugins/vivim-law/plugin.json:148-159`
- `omega-baseline/omega-final/plugins/vivim-law/src/index.ts:407-445`, `:610-629`, `:693-710`
- `omega-baseline/omega-final/tooling/generate/generate.ts:1-11`, `:96-111`, `:145-179`, `:319`
- `docs/agent-system/workstreams/WS-002/PHASE-1-TRUTH-BASELINE.md:1-35`
- `docs/agent-system/workstreams/WS-006/PHASE-1-GOVERNANCE-CHAIN.md:1-15`
- `docs/agent-system/workstreams/WS-008/PHASE-1-HANDOFF-PACKAGE.md:1-20`

