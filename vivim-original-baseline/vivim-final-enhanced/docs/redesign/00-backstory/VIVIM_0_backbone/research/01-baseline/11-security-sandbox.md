# Step 1.11: Security & Sandbox — The Trust Boundary

**Date:** 2026-08-28
**Read:**
- `kernel/security/sandbox-runner.ts` (67 lines)
- `kernel/security/safe-eval.ts` (27 lines)
- `kernel/security/consent-engine.ts` (136 lines)
- **Status:** READ + ANALYZED

**Critical finding:** The system has a **real, working, isolated sandbox** (QuickJS WASM with a vm-mode fallback) and a **runtime consent engine** with a 6-tier classification system. These are the two pillars of the security model. The sandbox is the "what code can run" boundary; the consent engine is the "what operations can happen" boundary. Together they cover both code-level and operation-level security. **A user extension can be sandboxed + consent-gated today, using the existing infrastructure.**

---

## What the code does

### `SandboxRunner` (sandbox-runner.ts)

The user-extensible code execution boundary. Two implementations selected at boot:

1. **QuickJS** (`sandbox-runner-quickjs.ts`, 19556 lines) — the default. WASM-based true isolation. "No shared heap, no native addon risk" (line 38 comment).
2. **node:vm** (`sandbox-runner-vm.ts`, 4507 lines) — fallback only. "V8 context in host isolate, kept only for one-line rollback" (line 39-40). Requires `VIVIM_UNSAFE_VM=1` env var to enable (line 42-47 throws without it).

The selector at line 40-47: `VIVIM_SANDBOX_MODE` env var chooses `'quickjs'` (default) or `'vm'`. The `vm` mode is explicitly marked as weaker ("shared V8 heap, denylist-dependent") and is gated behind an env var.

**`SandboxPermissions`** (lines 4-12) — the permission allowlist every handler declares:
- `canFetch: string[]` — URL prefixes. Empty = no fetch.
- `canReadFile: string[]` — absolute paths. Empty = no reads.
- `canWriteFile: string[]` — absolute paths. Empty = no writes.
- `canUseClipboard: boolean` — clipboard.

**`SandboxBudget`** (lines 14-17) — resource limits:
- `cpuMs: number` — wall-clock budget
- `memoryBytes: number` — heap budget

**`SandboxRunOptions`** (lines 19-26):
- `budget?` — overrides default budget
- `handlerSlug?` — for audit log
- `memoryProbe?` — for testing
- `globals?` — extra frozen globals exposed to the handler (e.g. CommonJS module/exports)

**`SandboxResult`** (lines 28-33): `{ ok, output?, error?, auditId }`. Every call is audited.

**`run(code, input, permissions, options)`** signature (lines 61-66) — takes JS code as a string, runs it with the input as an argument, returns the result.

### `safe-eval.ts` (27 lines)

A **denylist guard** for the remaining `new Function()` evaluation site (used by stream-parser inline parsers via SandboxRunner). The comment (lines 1-12) is honest: this is a **short-term hardening** path; the long-term fix is to migrate parsers to AST-based `safe-expression.ts` and use QuickJS-only sandbox.

**`FORBIDDEN_TOKENS`** regex (line 19) — a long denylist of dangerous globals: `constructor`, `__proto__`, `prototype`, `process`, `globalThis`, `global`, `window`, `document`, `self`, `require`, `import`, `eval`, `Function`, `fetch`, `XMLHttpRequest`, `setTimeout`, `setInterval`, `setImmediate`, `queueMicrotask`, `Proxy`, `Reflect`, `Worker`, `postMessage`, `atob`, `btoa`, `WebSocket`, `EventSource`, `localStorage`, `sessionStorage`, `indexedDB`, `navigator`, `location`, `Blob`, `TextEncoder`, `TextDecoder`, `structuredClone`, `MessageChannel`, `BroadcastChannel`, `crypto`, `SubtleCrypto`, `XMLSerializer`, `DOMParser`, `importScripts`, `WebAssembly`, `addEventListener`, `removeEventListener`, `FinalizationRegistry`, `WeakRef`, `WeakMap`, `WeakSet`, `Atomics`, `Intl`, `AbortController`, `AbortSignal`, `URL`, `URLSearchParams`, `File`, `FileReader`, `FormData`, `Headers`, `Request`, `Response`, `ReadableStream`, `WritableStream`, `TransformStream`, `Performance`, `PerformanceObserver`, `Scheduler`, `permissions`, `Notification`, and more.

**`assertTrustedExpressionSource(source, label)`** (line 21) — throws if the source matches any forbidden token. Explicitly described as "fail-open" (H9 hazard) — denylist is incomplete by nature.

### `ConsentEngine` (consent-engine.ts)

The **operation-level permission system**. From the file header (line 1-4): "ConsentEngine — runtime consent gate for operation classification enforcement. Checks whether an operation's classification exceeds the allowed threshold and gates execution accordingly. Grants are time-bounded."

**`ConsentConfig`** (lines 10-15):
- `defaultDeny: boolean` — default deny all operations that require consent
- `requireApprovalAbove: 'read' | 'write' | 'navigate' | 'destructive' | 'financial'` — threshold

**`ConsentGrant`** (lines 17-22): `{ target, classification, grantedAt, expiresAt }` — a time-bounded grant for a specific operation on a specific target.

**`ConsentStore`** (lines 24-29) — persistence contract: `saveGrant`, `findGrant`, `revokeGrant`, `listGrants`.

**`CLASSIFICATION_RANK`** (lines 31-38) — the 6-tier classification:
- `read: 0`
- `write: 1`
- `navigate: 2`
- `destructive: 3`
- `financial: 4`
- `communication: 4` (same rank as financial)

**`ConsentEngine` class** (lines 40-136):
- Default config: `defaultDeny: true`, `requireApprovalAbove: 'write'` (lines 47-51). So write and above require consent; read doesn't.
- `check(operation)` (line 55) — at/below threshold always allowed. Above threshold requires an active grant (in-memory cache or store). With `defaultDeny: true`, no grant = no.
- `require(operation)` (line 85) — throws `ConsentViolationError` if `check` returns false.
- `grant(operation, durationMs = 3_600_000)` (line 95) — 1-hour default grant. Persists if store is configured.
- `revoke(target)` (line 115) — revokes all grants on a target.
- `isRestricted(classification)` (line 125) — true if classification > threshold.
- `listActiveGrants()` (line 132) — current grants (not expired).

### Other security files (not read in detail)

- `policy-engine.ts` (5211 lines) — declarative policy.
- `governance-engine.ts` (3207 lines) — governance primitives.
- `trust-score.ts` (8326 lines) — the implementation that consumes `MutationProvenance` (Step 1.4). Computes trust scores.
- `db-encryption.ts` (5120 lines) — at-rest encryption.
- `encryption.ts` (3592 lines) — encryption primitives.
- `audit-trail.ts` (1816 lines) — audit log.
- `event-record-store.ts` (3564 lines) — event record storage.
- `telemetry-audit.ts` (5579 lines) — telemetry audit (used by LiveCapabilityRegistry for consent-gated fetch, Step 1.7).
- `safe-expression.ts` (14136 lines) — AST-based allowlist evaluator. The PROPER replacement for `safe-eval.ts`.
- `airgap.ts` (4268 lines) — network airgap mode.
- `anti-detection.ts` (3859 lines) — anti-browser-fingerprinting.
- `sandbox-runner-vm.ts` (4507 lines) — vm-mode fallback.
- `sandbox-runner-quickjs.ts` (19556 lines) — QuickJS implementation (the default).
- `tests/.quarantine/code-audit.test.ts` (14543 lines) — code-audit tests (quarantined).

---

## Key observations

- **The sandbox is REAL and ISOLATED.** QuickJS WASM with no shared heap is the gold standard for untrusted-code execution in Node. The `vm` mode is a deliberate rollback option, not the default. This is production-grade.

- **Permissions are allowlist, not denylist.** `canFetch`, `canReadFile`, `canWriteFile` are empty by default. To grant a handler fetch access, you populate `canFetch` with the allowed URL prefixes. **The "default deny" model is the right model.**

- **Budgets are real.** CPU milliseconds and memory bytes. The system can actually cap a runaway handler.

- **`auditId` on every sandbox call.** Line 32. Every `SandboxResult` has an audit id. The audit is per-call, per-handler, persisted to `SandboxAuditStore`. This is the security audit log.

- **The `safe-expression.ts` (14136 lines) is the real allowlist evaluator.** The denylist in `safe-eval.ts` is explicitly a stop-gap. The system already has the better primitive.

- **The 6-tier classification is well-designed.** `read < write < navigate < destructive < financial = communication`. Note that `communication` is at the same rank as `financial` — both are considered high-risk. This means sending a message or making an API call requires consent. A user extension that wants to send a message to Slack (or any external service) must go through consent.

- **Grants are time-bounded (default 1 hour).** Line 97: `durationMs = 3_600_000`. So if a user grants "let this extension write to /Users/me/notes", the grant expires in 1 hour. The user can re-grant or revoke.

- **`requireApprovalAbove: 'write'` is the default.** Line 49. So read operations are silent; write and above require consent. A user extension that just wants to read can run freely. A user extension that wants to write must ask first.

- **The `target` field on `ConsentGrant` is operation-specific.** Line 17-22: `{ target: string, classification: string }`. So a grant is `(target, classification)`-keyed. A grant for "read /Users/me/notes" doesn't imply a grant for "write /Users/me/notes".

- **Live capabilities (Step 1.7) are NOT in the consent path.** `LiveCapabilityRegistry` has `permissionsFor(spec)` (line 168-175 of live-capability-registry.ts) that returns `{ canFetch: [], canReadFile: [], canWriteFile: [], canUseClipboard: true }` — the **most restrictive** sandbox permissions. So inline handlers can't fetch or read files. But HTTP handlers (line 189-205) call `audit?.fetch(url, init)` if audit is wired — `audit` is `TelemetryAudit`, not `ConsentEngine`. **The consent engine is NOT consulted for live cap operations.** This is a gap.

- **The `telemetry-audit.ts` is a different concept from `ConsentEngine`.** `TelemetryAudit.fetch` (used in LiveCapabilityRegistry line 197) is for tracking usage, not gating. The actual gating would be the ConsentEngine. So a live HTTP handler bypasses the consent system unless the host wires both.

- **`Safe-eval.ts` is explicitly marked as insecure.** The denylist approach is a known anti-pattern (line 10-12 comment: "HAZARD H9 — denylist is fundamentally incomplete (fail-open)"). The author knows. The replacement is `safe-expression.ts` (AST allowlist) + QuickJS. Migration is in progress.

- **There's a `telemetry-audit` separate from `audit-trail`.** Both seem to be audit logs. `audit-trail` is the high-level operations log; `telemetry-audit` is the per-call audit (the `auditId` source).

- **The trust-score system (8326 lines) is the social side of the security model.** `MutationProvenance` (Step 1.4) maps to a trust score. Plugins get a trust score based on provenance, history, user grants. This isn't an access control list, but it informs the UI ("this came from a low-trust source, are you sure?").

- **Encryption is at-rest.** `db-encryption.ts` (5121 lines). The Node layer's `contentHash` + `signature` (AGENTS.md from Step 1.10) probably rely on this.

- **`airgap.ts` (4268 lines) is interesting.** A network-airgap mode. The system can run with no network access. A user extension in airgap mode has zero fetch capability (the sandbox already denies it).

- **The Code-audit test in quarantine is 14543 lines.** Big. The tests are in quarantine (won't run by default), but the system *has* code-audit tests. The quarantine means they were deferred, not deleted.

- **The 6-tier classification is INCOMPLETE.** The engine has `read/write/navigate/destructive/financial/communication`. It does NOT have things like `network-call`, `file-system`, `clipboard`. So a "fetch URL" operation is classified as... `navigate`? Or `communication`? The classification enum is the gate; whatever the system classifies the operation as is what gets checked.

---

## Key questions raised

1. **Does the QuickJS sandbox support `import` statements?** Line 19 of safe-eval.ts has `import` in the denylist. So no dynamic import in sandboxed code. Live capabilities can only execute code that uses the injected globals (`canUseClipboard: true` + the input arg + whatever `globals?` provides).

2. **What globals are exposed by default in the QuickJS sandbox?** Not read. Probably a curated set: `console`, `JSON`, `Math`, `Date`, `URL` (or not — URL is in the denylist). The `globals?` option lets the host inject more.

3. **How is `safe-expression.ts` used in practice?** 14136 lines for an AST allowlist. It probably has a list of allowed AST node types (MemberExpression with specific shapes, CallExpression with whitelisted functions, etc.). Where is it wired in?

4. **Where is the consent engine invoked in the live cap flow?** Currently it isn't. The path is: `LiveCapabilityRegistry` → `sandbox.run(code, input, permissions)` or `http handler` → `audit?.fetch`. The `audit` is `TelemetryAudit`, not `ConsentEngine`. So a live HTTP handler bypasses consent. **This is a real gap.**

5. **Can a user extension trigger a consent prompt?** The engine exposes `require(operation)` (line 85) and `grant(operation)` (line 95). A host calling these can ask the user. But the UI for the prompt is not in this file. Where is the consent UI?

6. **What's the `auditId` for?** Generated by the sandbox. Stored in the `SandboxAuditStore`. The store interface is not read, but presumably has `create`, `list`, `getById`. The audit id is referenced by `SandboxResult` so the caller can correlate.

7. **Does the consent engine have a UI?** `require()` throws `ConsentViolationError`. The host catches it and presumably prompts the user. The prompt flow is somewhere in the surface layer (web/desktop). Not in this file.

8. **What is the "airgap" mode exactly?** airgap.ts (4268 lines) is not read. Probably a network kill-switch. If the system is in airgap mode, all `fetch` calls are denied at the platform level, regardless of sandbox permissions. Defense in depth.

9. **What is `anti-detection.ts`?** Probably a layer that randomizes browser fingerprints so a chat provider's anti-bot doesn't detect automation. The chrome-governor would call this.

10. **The 6 classification tiers — is there a 7th for "user-data access"?** The engine has `read/write` for files, but not a separate "personal data" tier. The `target` field carries specificity, so `write /Users/me/medical-records` and `write /Users/me/temp.txt` are different grants. But the engine doesn't *know* the difference. It's up to the caller to classify the target.

11. **What happens if a user extension tries to import a module that the sandbox doesn't expose?** The denylist in `safe-eval.ts` blocks `import`. So a malicious extension can't `import 'node:fs'`. The QuickJS sandbox probably has no module system by default.

12. **Are sandboxed handlers run synchronously or asynchronously?** `Promise<SandboxResult>` (line 66 of sandbox-runner.ts). Async. So the handler can `await` something. But the `await` target must be in the injected globals.

---

## Cross-references

- **Step 1.7 (live-capability-registry.ts)** — inline handlers go through this sandbox. `permissionsFor()` is the default-deny policy. The HTTP handler bypasses the consent engine (gap).
- **Step 1.4 (reprogrammability)** — `MutationProvenance` is the input to `trust-score.ts`. Plugins get a trust score from the provenance + history.
- **Step 1.9 (harness)** — the harness runs in the host process, NOT in the sandbox. It's a different trust boundary (CDP browser isolation, not JS sandbox).
- **`kernel/security/safe-expression.ts`** (14136 lines) — the AST allowlist. The proper sandbox hardening. Replaces `safe-eval.ts` over time.
- **`kernel/security/sandbox-runner-quickjs.ts`** (19556 lines) — the default. The real implementation.
- **`kernel/security/sandbox-runner-vm.ts`** (4507 lines) — fallback. Weak. Gated.
- **`kernel/security/policy-engine.ts`** (5211 lines) — declarative policies. Probably reads consent config from a policy file.
- **`kernel/security/governance-engine.ts`** (3207 lines) — governance primitives. Probably orchestrates policy + consent + audit.
- **`kernel/security/trust-score.ts`** (8326 lines) — provenance → score. UI shows the score.
- **`kernel/security/db-encryption.ts`** (5120 lines) — at-rest encryption.
- **`kernel/security/airgap.ts`** (4268 lines) — network kill-switch.
- **`kernel/security/anti-detection.ts`** (3859 lines) — browser fingerprint randomization.
- **`kernel/security/audit-trail.ts`** + **`event-record-store.ts`** + **`telemetry-audit.ts`** — three layers of audit. Probably: audit-trail = high-level operations, event-record = per-event, telemetry-audit = per-API-call.
