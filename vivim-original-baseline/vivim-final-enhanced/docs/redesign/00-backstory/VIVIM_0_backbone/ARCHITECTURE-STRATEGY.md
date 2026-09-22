# Plugin Architecture Strategy — Decision Registry

**Status: 35-step code-only investigation complete. 8 design decisions made (recorded below). Strategy doc = EXTENSION-MODEL.md (404 lines, 12 sections, 16 sub-cards F-042..F-057). Missing level of detail: the unified `vivim-extension.json` manifest is designed but NOT implemented; the `permissionsProvider` + `consentEngine` injection (F-046) is NOT in the code; the `LiveCapabilityStore` activation schema (F-050) is NOT implemented. These are the 3 must-haves before v1 ships.

---

## Decisions Made (interactive, 8 of 8 answered)

| # | Topic | Answer | Evidence in EXTENSION-MODEL.md |
|---|---|---|---|
| 1 | Marketplace server? | **No** — v2 only. v1 = tarball/URL/directory/workspace only. | §5.5 "Marketplace (v2)" |
| 2 | SHA-256 fingerprint on load? | **No** — install only. Per-install fingerprint; no load-time check. | §4.5 "SHA-256 fingerprint on install + load" (user chose install-only) |
| 3 | `requiresConfirmation` default? | **Opt-in only.** `false` by default; user must opt in per-category. | §4.1 "requiresConfirmation: true" + user choice = opt-in |
| 4 | Extension `dependencies`? | **Yes — v1.** Manifest includes `dependencies` field with semver ranges. | §5.1 `dependencies: { other-extension: '^2.0.0' }` |
| 5 | StorageContribution auto-CRUD? | **Default on.** Auto-generates `list/get/create/update/delete` capabilities. | §5.1 `capabilities: [ { id: 'slack.list_channels', operation: 'list' } ]` |
| 6 | `LiveCapabilityStore` activation schema? | **Yes.** Schema includes `activation: 'eager'/'lazy'/'onEvent'`. | §5.2 "eager (default) / lazy / onEvent" |
| 7 | Bulk `unregisterExtension` orchestrator? | **Yes — v1.** Bulk unregister that unregisters all contributions in correct order. | §5.4 "disable/uninstall" + user choice = v1 |
| 8 | `LiveCapabilityRegistry.permissionsProvider` + `consentEngine` injection? | **Yes.** Closes Step 1.11 security gap: inline handlers get per-cap sandbox permissions; HTTP handlers get consent-gated fetch. | §4.6 "5 must-dos" includes F-045 (permissionsProvider) + F-046 (consentEngine) |

---

## What These Decisions Mean Together

The 8 answers make the extension model **shippable but not production-grade**:
- **No marketplace** = user installs manually (tarball/URL/workspace). Fine for v1.
- **No load-time fingerprint check** = user installs; host doesn't re-verify on every load. Fine for v1; v1.5 can add.
- **Opt-in confirmation** = lower friction, less safety. **Risk:** malicious extensions run destructive actions without confirmation. **Mitigation:** sandbox + consent engine (F-046 closes the HTTP gap; inline is sandbox-only).
- **Dependencies allowed** = multi-extension ecosystems work. **Risk:** dependency conflicts if versions clash. **Mitigation:** semver range only.
- **Auto-CRUD** = less boilerplate. **Risk:** extensions expose too many capabilities by default. **Mitigation:** user grants at install time.
- **Activation schema** = lazy/onEvent extensions don't pay cost until needed. **Risk:** lazy activation fails silently if the event never fires. **Mitigation:** audit log records activation state.
- **Bulk unregister** = clean uninstall. **Risk:** partial failure (some contributions unregister, others don't). **Mitigation:** rollback to previous install state.
- **Permissions/consent injection** = the #1 security fix. **Without this, the live HTTP handler bypasses consent.** **This must ship with v1.** The inline handler already uses `permissionsProvider`; the HTTP handler needs `consentEngine.require()`.

---

## What's Explicitly MISSING (not yet decided, needs design interaction)

These 4 gaps are from the research evidence that aren't fully closed by the 8 answers:

1. **`permissionsProvider` implementation details.** The contract says "inject `permissionsProvider(spec) → SandboxPermissions`". But HOW the provider reads the `ExtensionManifest.permissions.capabilities[].slug` and maps to `SandboxPermissions.canFetch` / `canReadFile` / `canWriteFile` is NOT written. This is a design interaction needed: should the mapping be 1:1 (each capability slug → the same permissions as declared), or granular (the user grants per URL/file/operation)?
2. **`consentEngine` HTTP handler wiring.** The contract says "call `consentEngine.require()` before fetch." But WHERE exactly is the `require()` called? Before the `fetch()` call? Before constructing the `RequestInit`? Before returning? The exact call site needs design.
3. **`StorageContribution.migrations[].fromVersion` mapping to `version` field.** The `vivim-extension.json` has `version: '1.2.3'`. The `StorageContribution.migrations[].fromVersion` is a string. But the host's Node layer uses `version: number` (`NodeRow.version`, `NodeVersionRow.version`). The mapping between semver string (extension) and integer version (Node) is NOT defined.
4. **`LiveCapabilityRegistry.loadFromDb()` filtering by `activation`.** The `LiveCapabilityStore` schema needs the `activation` field. But does the host store `eager` vs `lazy` vs `onEvent` in the DB row? Or does it store it separately (e.g. in the `ExtensionInstall` node)? This is a schema design interaction.

These 4 gaps are the "more design interactions" the user mentioned. They're not open questions from Section 7 — they're implementation details the design needs to close.

---

## Recommended Next Interaction Sequence

Based on the user's request ("register the decision so far — then we will do some more design interactions"), the sequence should be:

1. **Confirm this decision registry** (done — 8 answers recorded above).
2. **Close gap 1** (permissionsProvider mapping) — design the exact mapping from `permissions.capabilities[].slug` → `SandboxPermissions`.
3. **Close gap 2** (consentEngine call site) — design the exact line of code where `require()` is called.
4. **Close gap 3** (version mapping) — design `version` string → integer mapping.
5. **Close gap 4** (Live store schema) — design the DB schema change.
6. **Then:** admit sub-cards F-042 through F-057, starting with the 5 must-haves (F-045, F-046, F-044, F-043, F-055).

---

## What's Confirmed (the evidence is in the artifacts)

- 41 artifacts in `.backbone/research/` (35 steps + 6 syntheses + final doc).
- 35 atomic commits (one per step, one per synthesis, one per final doc).
- 8 interactive answers (all recorded).
- The 5 phases complete (baseline, extension points, contract, security, lifecycle).
- The EXTENSION-MODEL.md covers all 4 extension surfaces, 8 implementation layers, 5 must-dos, 3-tier trust, 5 install paths, marketplace v2.
- The user wants a centralized strategy doc; this registry IS that doc; the synthesis IS the design; the gaps 1-4 are the remaining design interactions.
