# PHASE 5 — Sovereign, Self-Hosted Platform

| | |
|---|---|
| **Doc** | 05 of 05 |
| **Goal** | Remove every *required* third-party dependency from the core loop and put the user in control of models, data, keys, updates and policy — **the AI-native, sovereign, self-hosted, governed wrapper** — and make it durable enough to run for months. |
| **Entry** | Phase 4 gate |
| **Exit** | §12 sovereignty acceptance tests + 30-day dogfood + go/no-go review |
| **Replaces** | SPEC-1 T042–T044, T069, T070, T073–T080, T096–T100 (T081–T095 Linux/bootable-OS work becomes an **optional track**, §9) |

## 1. Definition of sovereign (testable)

| Property | Test |
|---|---|
| **Works offline** | Unplug network: chat, agents, search, memory, editing, policy, audit all function with local models |
| **Local-first data** | Deleting the app's cloud/sync configuration loses nothing; all state is on disk in documented formats |
| **User-held keys** | Vault, audit-signing, policy-signing and sync-encryption keys are generated and stored locally; recovery is user-managed |
| **No silent egress** | 7-day soak with airgap *off*: every outbound byte is explained by the egress log (provider, update check the user enabled, sync) |
| **Exit rights** | One command exports everything (data, memory, policy, audit, settings) in open formats; one command wipes it |
| **Self-hostable back-ends** | Model gateway, sync, and update feed each run on hardware the user owns |
| **Replaceable parts** | Agent runtime, model backend and provider are swappable behind interfaces; OpenCode is one adapter, not a hard dependency |
| **Governed** | Every capability from Phase 4 still applies to local models and self-hosted services (no "local means trusted") |

## 2. Deployment topologies

```
T1  Single PC          shell + agent + local model + data          (all on the Windows machine)
T2  PC + Home node     shell (PC) ──► node: model gateway, heavy models, sync, update mirror, audit archive
T3  Team self-host     N PCs ──► self-hosted control plane: signed policy distribution, aggregated audit, model gateway
```
All three use the same protocols; T2/T3 add only *optional* services. The PC keeps working if the node is down (falls back to local models/cached policy).

## 3. Workstreams

### 3.1 Model plane

* **Backends:** Ollama and/or llama.cpp server on the PC; vLLM/llama.cpp/Ollama on a home node; cloud providers as *optional* backends. Discover capabilities (context, tools, vision) per model.
* **Sovereign Gateway** (`ocos-gateway`, Rust, OpenAI-compatible surface + our own model-registry API): single endpoint the agent runtime sees; routes by **policy**, not by hard-coded provider. Extends the Phase 4 egress gateway (same process or sibling).
* **Routing policy** (part of `policy.toml`): by data class (`public`, `workspace`, `private`, `secret`), by task (`chat`, `code`, `embed`, `vision`), by cost/latency, by availability. Default: **local first; cloud only with per-class consent**, and `private`/`secret` classes never leave the machine. Every route decision is audited with the reason.
* **Model manager:** download with hash verification and resume, disk-quota, hardware detection (VRAM/RAM/CPU features), recommended sets per hardware tier, unload/idle policy, license display, integrity re-check.
* **Fallback/consent flow:** if a local model can't handle a task, show what would leave the machine (class, size, provider) and ask; remember per class only if the user chooses.
* **Quality guardrails:** per-model tool-calling reliability probe (small self-test suite) — models that fail are excluded from agent roles that need tools.

### 3.2 Agent runtime abstraction

```rust
trait AgentRuntime {           // implemented by OpenCodeAdapter (Phase 4) and later others
  fn capabilities(&self) -> RuntimeCaps;             // streaming, tools via MCP, sessions, fork, attach
  fn start(&self, cfg: SessionCfg) -> SessionHandle; // profile, model route, tool endpoints, budgets
  fn send(&self, s: &SessionHandle, msg: UserMsg);
  fn cancel(&self, s: &SessionHandle);
  fn events(&self, s: &SessionHandle) -> Stream<AgentEvent>;
}
```
* Keep `AgentEvent` (Phase 4) as the only thing the UI/audit see.
* Ship a **minimal native runtime** (`ocos-agent`): tool loop over MCP + our gateway, streaming, context management, summarization — enough to run governed agents without OpenCode. Evaluate protocol options for external runtimes (MCP for tools; an agent↔client protocol such as ACP — *verify current spec/maturity*).
* Pin and hash any external runtime; run it in the Phase 4 sandbox; version-range compatibility tests in CI.

### 3.3 Data plane

| Store | Content | Design |
|---|---|---|
| **Memory** (T043) | Durable user/agent memory (facts, preferences, project notes) | SQLite (WAL), per-profile file, encrypted at rest (SQLCipher or file-level DPAPI/age), provenance per record (source, agent, time, confidence, taint label), review/edit/delete UI, export |
| **Semantic index** (T044) | Local embeddings over chosen folders | Local embedding model; incremental indexing driven by the Phase 2 watcher; per-folder opt-in; exclusion rules; index is *derived data*, rebuildable |
| **Session store** | Transcripts, tool traces | Local, redacted per Phase 4 rules, retention policy |
| **Policy/audit/undo** | From Phase 4 | Included in backup/export |

Rules: **memory writes are tainted-aware** — content derived from untrusted sources can't be stored as "trusted" memory; agents propose memories, the user (or a policy) commits them. "Right to forget": delete by record/source/time range across memory, index, transcripts. Backup: encrypted, incremental, restore-tested to a clean machine.

### 3.4 Sync and multi-device

* End-to-end encrypted, **self-hosted** sync (device-to-device or via the home node) for settings, policy, memory, notes, selected folders. CRDT (e.g., Automerge/Yjs) for structured docs; content-addressed chunks for files. *Choose after a spike; adopt an audited existing sync engine rather than writing one.*
* Device identity: per-device keypair, pairing by QR/short code + fingerprint confirm; revoke a device; key rotation drill.
* Conflict UX for files and memory; audit entries for sync events.
* Optional private network (WireGuard/Tailscale-style) for node access — *user's choice; never required*.

### 3.5 Identity and profiles (T074)

Multiple local profiles, each with its own vault, memory, policy, workspace and agents. Windows Hello / passkey unlock; fast profile switch; shared-machine safe defaults. Admin vs standard profile inside OpenCode OS (who can edit policy/signing keys).

### 3.6 Policy distribution and fleet (T3, optional)

Signed policy bundles (Ed25519; org root → device), version pinning, staged rollout, rollback, local override rules ("stricter only"), aggregated audit upload to a self-hosted collector (append-only, verified chains), device attestation-lite (bundle hash + version reported), remote kill/revoke. Works air-gapped via file-based bundle import.

### 3.7 Supply chain, updates, provenance

* **Reproducible-as-possible builds** in CI; `cargo-audit`, `cargo-deny`, `npm audit`, license check; SBOM (CycloneDX) per release; GitHub artifact attestations/SLSA-style provenance.
* **Code signing** (T007) for exe/installers/DLLs (managed signing service or EV cert).
* **Auto-update with rollback** (T075): signed manifests (minisign/Ed25519), staged install to a side directory, health check on first launch, automatic rollback on failure; update source configurable (official / self-hosted mirror / off).
* **Pinning:** OpenCode (if used) and any bundled runtime/models by version+hash; security-advisory check step in release process (R-SEC-3), including OpenCode advisories.
* **Third-party MCP/plugins:** allowlisted, hashed, run sandboxed, capability-declared (§3.8).

### 3.8 Extensibility (SDK, T098)

* **Plugin manifest**: id, version, publisher key, declared capabilities (same vocabulary as Phase 4), UI contributions, tools, agents. Install shows a capability review; unsigned = warning; updates re-review on capability increase.
* **Execution:** tools as MCP servers in the sandbox; UI extensions as isolated webviews with a narrow message API; optional WASM (wasmtime) host for tiny logic plugins.
* **Agent packages:** profile + prompts + tool requirements + eval set, shareable as files.
* Docs, examples, and a conformance test kit.

### 3.9 Product quality bar (T076–T080)

Opt-in telemetry (off by default; local-only diagnostics by default; a viewer showing exactly what would be sent) and privacy policy; accessibility (screen reader, keyboard navigation, high contrast, reduced motion) audited against WCAG 2.2 AA checklist; localization framework (ICU messages, RTL-ready); theming/personalization; performance budgets (cold start, idle RAM, model-load times) enforced in CI benchmarks; disk/workspace encryption *integration* (BitLocker status check + guidance, encrypted workspace containers) — do not roll our own disk encryption (T073).

### 3.10 Migration and daily-driver program (T096–T097, T100)

Migration assistant (import files, browser bookmarks/profiles where allowed, settings, app pins; always copy, never move); dogfood log template; incident log; measurable go/no-go checklist.

## 4. Task list

| ID | Task | Depends | Acceptance |
|---|---|---|---|
| P5-01 | Model backend abstraction + Ollama/llama.cpp adapters + capability discovery | P4-11 | Chat works fully offline |
| P5-02 | Model manager (download, verify, quota, hardware tiers, unload) | P5-01 | Corrupted download detected; resume works |
| P5-03 | Sovereign Gateway: OpenAI-compatible endpoint, registry, per-agent quotas | P4-11 | Existing runtime works through it unchanged |
| P5-04 | Routing policy engine (data class × task × availability) + consent flow + audit | P5-03, P4-03 | `private` never routes to cloud (tests); route reason logged |
| P5-05 | Tool-calling reliability probe per model; role gating | P5-01 | Failing model excluded from tool roles |
| P5-06 | `AgentRuntime` trait; refactor OpenCodeAdapter; contract tests | P4-02 | Same UI/audit with either runtime |
| P5-07 | `ocos-agent` minimal native runtime | P5-06 | Completes the Phase 4 acceptance scenarios (1)(4) |
| P5-08 | Memory store (encrypted, provenance, taint-aware, review UI) | P4-05 | Untrusted-derived memory cannot self-commit |
| P5-09 | Semantic index (local embeddings, incremental, per-folder opt-in) | P2-12, P5-01 | 50k files indexed; query p95 < 300 ms |
| P5-10 | Right-to-forget across memory/index/transcripts | P5-08, P5-09 | Deletion verified by search + raw store scan |
| P5-11 | Encrypted incremental backup/restore + full export/wipe commands | P5-08 | Restore to clean VM = identical state |
| P5-12 | Sync spike → choose engine → implement (settings, policy, memory, folders) | P5-08 | Two devices converge; conflict UX tested |
| P5-13 | Device pairing/revocation; key rotation drill | P5-12 | Revoked device cannot decrypt new data |
| P5-14 | Profiles (vault, memory, policy, workspace isolation) + Hello/passkey unlock | P4-10 | Cross-profile access impossible (tests) |
| P5-15 | Self-hosted update service + signed manifests + rollback | P4-22 | Forced bad update auto-rolls back |
| P5-16 | Code signing pipeline; SBOM; provenance; audit/deny gates in CI | — | Release blocked on failures |
| P5-17 | Advisory watch step (OpenCode, MCP servers, Rust/npm) in release checklist | P5-16 | Checklist enforced in release workflow |
| P5-18 | Plugin manifest, capability review UI, sandboxed tool/UI hosts | P4-12 | Malicious plugin (over-declares/under-declares) rejected/contained |
| P5-19 | SDK docs, examples, conformance kit; agent-package format | P5-18 | Third-party sample passes kit |
| P5-20 | Fleet: signed policy bundles, staged rollout, audit collector (self-hosted) | P4-03, P4-08 | T3 topology demo; air-gapped bundle import |
| P5-21 | Telemetry viewer (opt-in), privacy policy, data-flow map | P4-11 | Zero telemetry by default (egress log proves) |
| P5-22 | Accessibility audit + fixes (WCAG 2.2 AA checklist) | — | Report; blockers closed |
| P5-23 | Localization framework + 2 pilot locales (incl. es) | — | Strings extracted; pseudo-loc CI check |
| P5-24 | Theming/personalization system | — | Theme pack import/export |
| P5-25 | Performance benchmarks in CI (start, idle RAM, model load, index) | Phase 3 P3-27 | Regressions fail CI |
| P5-26 | BitLocker status check + encrypted workspace guidance | — | Warning when volume unencrypted |
| P5-27 | Migration assistant | P2 | Import test on a real profile |
| P5-28 | 30-day dogfood with log; incident review | all | Log + retro |
| P5-29 | Public alpha package: installer, docs, feedback channel | P5-28 | Published |
| P5-30 | Go/no-go review vs §12 and checklist | all | Signed decision |

## 5. Data classification (used by routing, sync, and audit)

| Class | Examples | Cloud model | Sync | Agent read default |
|---|---|---|---|---|
| `public` | Docs the agent fetched | allowed | yes | auto |
| `workspace` | Project files | ask (per class consent) | opt-in | auto in workspace |
| `private` | Documents, email, clipboard, screen | **never** unless user overrides per session with Hello | encrypted only | ask |
| `secret` | Keys, tokens, vault | **never** | encrypted only, vault channel | never (handles only) |

Classification comes from folder rules, sensitivity labels the user sets, and source (screen/clipboard = `private`). Misclassification failures are safe-side: unknown → `private`.

## 6. Interfaces to keep stable (versioned)

`AgentEvent` v1, policy schema v1, audit record v1, MCP tool catalog v1, gateway API (OpenAI-compatible + registry v1), plugin manifest v1, sync protocol v1, export format v1. Each has a schema file, changelog, and compatibility tests; breaking changes require a major version and a migration.

## 7. Security and privacy additions

Local models are **untrusted code + untrusted output** (weights can be malicious formats; outputs can be injected) — verify hashes, parse with maintained loaders, sandbox inference servers (Job Object, no network except loopback), never give inference processes file access beyond model dirs. Embedding stores inherit the class of their source. Sync servers see only ciphertext. Backups are encrypted with a key the user holds; lost-key = lost-data is documented and offered with a recovery-key ritual.

## 8. Risks

| Risk | Mitigation |
|---|---|
| Local models too weak for reliable tool use | Probe + role gating; hybrid routing with consent; keep cloud optional not required; improve prompts/tool schemas; hardware tiers guidance |
| Building sync/crypto ourselves | Use audited libraries and existing engines; threat-model review; no custom crypto primitives |
| Scope explosion | Each workstream is independently shippable; T1 topology first, T2/T3 optional; alpha gate at P5-29 |
| Model/license/legal exposure | Show licenses; user chooses models; no bundled models |
| Key loss | Recovery key ritual; clear warnings; export/backup drills |
| Solo-maintainer capacity | Prefer adopting mature components; cut order: fleet → SDK → localization → theming |

## 9. Optional tracks (each behind its own go/no-go; not on the critical path)

| Track | What | Trigger to start | Guardrails |
|---|---|---|---|
| **5X-A Real shell registration** | Register OpenCode OS as the Windows shell (Winlogon `Shell`), host the real tray (`Shell_TrayWnd`), session-level start-up, Explorer as fallback — SPEC-1 T011–T014, T023 | Phase 3 daily-drive shows tray/notifications/Alt-Tab gaps that matter | Test in a VM first; recovery hotkey + boot fallback to `explorer.exe` *before* any real-machine install; never on the only machine |
| **5X-B Bootable Linux appliance** | SPEC-1 T081–T095: minimal image → Wayland kiosk → same shell; Wine/Proton + Windows-VM fallback | Only if Windows dependence itself becomes the blocker; decision doc T081 first | Requires hardware/app-compat matrix; anti-cheat/vendor drivers likely unsupported |
| **5X-C Companion (mobile/web)** | Read-only approvals, notifications, chat with the node over the private network | After T2 topology is stable | Approvals from a second device are R3-capable only with Hello/passkey and short-lived tokens |

## 10. Release program

Channels: `dev` → `alpha` (P5-29) → `beta` → `1.0`. Each release: changelog, SBOM, provenance, signed installer/update, security-advisory check, red-team suite green, rollback tested. Support statement: what is guaranteed and what is not.

## 11. Metrics (targets)

Offline task success (scripted suite) ≥ 90% with the recommended local model tier; unexplained egress bytes = 0 in soak; approval prompts per hour of typical work ≤ 10; update rollback success 100% in drills; restore-from-backup success 100%; crash-free sessions ≥ 99%.

## 12. Acceptance — sovereignty and go/no-go (P5-G)

1. **Airplane test:** disable all networking for a full day; do real work (code, notes, search, agent tasks) with local models; nothing breaks except explicitly network-dependent tools, which fail clearly.
2. **Egress soak:** 7 days with normal use and cloud routing enabled for `public` only; egress log reconciles with every byte; no `private`/`secret` class data left the machine.
3. **Recovery drill:** wipe the machine (or use a clean VM), restore from encrypted backup + recovery key; policy, memory, profiles, audit chain (with a noted gap), and settings match.
4. **Update drill:** ship a deliberately broken update → automatic rollback; ship a valid update from the self-hosted feed.
5. **Key drill:** rotate audit, policy and sync keys; old devices revoked; verification tools still validate history.
6. **Portability drill:** switch runtime (OpenCode ↔ native `ocos-agent`) and model backend (Ollama ↔ llama.cpp) with no UI/policy/audit changes.
7. **Plugin drill:** an over-permissioned third-party tool is contained and flagged.
8. **Dogfood:** 30 days as the primary working environment *on top of Windows* with an incident log; no data loss, no unrecovered lock-out, no critical security finding open.
9. **Go/no-go checklist** (P5-30) signed: security review closed, red-team green, docs complete, license/attribution audit, backup/restore proven, accessibility blockers closed.

## 13. Assumptions to verify

Ollama/llama.cpp server APIs and tool-calling support on the author's hardware; availability and license of suitable local models for coding/tool use; ACP/MCP spec status for external runtimes; chosen sync engine's Windows support and audit history; Hello/TPM availability; signing service options.
