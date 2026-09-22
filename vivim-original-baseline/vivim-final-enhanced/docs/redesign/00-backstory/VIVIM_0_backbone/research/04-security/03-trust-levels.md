# Step 4.3: Trust Levels — User, Workspace, System

**Date:** 2026-08-28
**Read:** Phase 1 Step 1.11 (trust score), Phase 2 Step 2.4 (data ACL)
**Status:** DESIGNED

---

## The question (from the process)

> "What trust does a user extension get? A system extension? A bundled extension? Is there a 3-tier system (user / workspace / system) like VS Code? Or just one tier?"

## The answer

**A 3-tier system: bundled (system), workspace (user-installed, trusted by workspace), user (per-user).** This mirrors VS Code's 3-tier model.

| Tier | Source | Trust | Examples |
|---|---|---|---|
| **Bundled** | Shipped with the host | Highest (curated) | Core providers (ChatGPT, Claude, Gemini), core capabilities |
| **Workspace** | Installed in a workspace, shared with collaborators | Medium | Team-shared extensions |
| **User** | Installed in the user's profile, only this user | Variable | Anything the user installs |

The host ships with bundled extensions. The user installs user extensions. Workspace extensions are a shared layer (per-workspace config).

---

## Trust signals

For each extension, the host tracks:

- **`provenance`**: `'bundled' | 'workspace' | 'user'`. Where did it come from?
- **`signing`**: signed by whom? (Phase 5 will design signing.)
- **`audit history`**: how many operations has it performed? Any violations?
- **`user reviews`**: (future) ratings from other users.
- **`time installed`**: how long has it been trusted?
- **`reputation`**: (future) aggregated score from network of users.

These combine into a **trust score** (per `trust-score.ts`, 8326 lines). The score is 0-100. The host shows it in the UI.

---

## Tier differences

### Bundled

- **Permissions**: auto-granted. The user cannot deny.
- **Sandbox**: not sandboxed (or weakly sandboxed). Runs in the host process.
- **Update mechanism**: host update. The bundled extension is part of the host's release.
- **Uninstall**: not allowed (it's part of the host).
- **Audit**: full audit. The host's reputation is on the line.

### Workspace

- **Permissions**: declared in manifest. User grants at install (workspace-wide) OR per-installation.
- **Sandbox**: QuickJS sandbox. Permissions via `permissionsProvider`.
- **Update mechanism**: workspace config (e.g. `vivim.workspace.json` lists extensions). Pulled on workspace load.
- **Uninstall**: per-user or workspace-wide.
- **Audit**: full audit. Visible to all workspace members.

### User

- **Permissions**: declared in manifest. User grants at install (per-user).
- **Sandbox**: QuickJS sandbox. Permissions via `permissionsProvider`.
- **Update mechanism**: user opts in. Auto-update for patch versions.
- **Uninstall**: user can remove.
- **Audit**: full audit. Visible to the user.

---

## How the host wires trust

The host maintains a registry of installed extensions:

```typescript
interface ExtensionInstall {
  id: string                       // unique install id
  manifest: ExtensionManifest
  source: {
    kind: 'bundled' | 'workspace' | 'user'
    // For bundled: the path in the host's install
    // For workspace: the path in the workspace config
    // For user: the path in the user's profile
  }
  version: string                  // installed version
  installedAt: number
  grants: {
    capabilities: string[]         // granted capability slugs
    networkFetches: string[]       // granted URL patterns
    filesystemReads: string[]
    filesystemWrites: string[]
    consentOperations: string[]    // granted operation tiers
    consentTargets: string[]
    expiresAt: number
  }
  trustScore: number               // 0-100
  flagged: boolean
  flagReason?: string
}
```

The host:
1. Reads the install state at boot.
2. For each extension, applies its contributions (Phase 3).
3. Sets the trust score based on the source + audit history.
4. Wires the `permissionsProvider` to return the grants.
5. Wires the `ConsentEngine` to the per-extension grant.

---

## The trust score (proposed)

```typescript
interface ExtensionTrustScore {
  extensionId: string
  reputation: number            // 0-100; starts at 50
  installCount: number          // how many times installed
  lastUpdated: number
  auditViolations: number       // count of failed permission checks
  userOverrides: number         // count of user-revoked grants
  flagged: boolean
  flagReason?: string
}
```

The score is computed from:
- `+10` if `source = 'bundled'`.
- `+5` if `source = 'workspace'`.
- `0` if `source = 'user'`.
- `-1` per audit violation.
- `-5` per user override.
- `+0.1` per day installed (up to a cap).

The host shows the score in the UI. Low-score extensions get a warning at install time.

---

## What the trust score controls

- **Install UI**: low-score extensions get a warning.
- **Permission grant UI**: low-score extensions need explicit consent for each operation.
- **Update UI**: low-score extensions don't auto-update.
- **Audit log**: high-score extensions can have longer audit retention; low-score are more aggressively logged.

The user can override: "I trust this extension anyway" → grant all permissions, no warnings.

---

## What's in `trust-score.ts` today

Per Step 1.11, `trust-score.ts` (8326 lines) implements trust scoring based on `MutationProvenance` (Step 1.4: `'manual' | 'nlcl' | 'prefix' | 'plugin' | 'llm-harness' | 'system'`). It's used for **mutations**, not **extensions** today. The migration is:
- Add an `ExtensionTrustScore` type.
- Add an `extensionTrustScore(extensionId)` method.
- Compute from the extension's `source`, `audit history`, and `user overrides`.

The new method is independent of the existing provenance-based scoring. They can coexist.

---

## What this fixes

- ✅ 3-tier system: bundled / workspace / user.
- ✅ Trust score per extension.
- ✅ Audit-based score updates.
- ✅ User-overridable trust (low score ≠ blocked, just warned).

## What this does NOT fix

- **The "reputation from network of users"** is a v2 feature. For v1, the score is local.
- **The "signed by whom"** is Phase 5 (signing). For v1, all extensions are unsigned.
- **The "user reviews"** is a marketplace feature. v2.

---

## Open design questions

1. **What's the score threshold for a warning?** Default: < 50. The user can set their own threshold.

2. **Can a bundled extension be uninstalled?** No. Bundled = part of the host. The user can disable (not uninstall) via a config flag.

3. **Can a workspace extension be auto-updated?** Yes, if the workspace config has a `autoUpdate: true` field. Otherwise, the user is notified.

4. **What if the user revokes a grant mid-session?** The host's `ConsentEngine` checks on every operation. The extension's next operation is denied. The audit log records the revocation.

5. **What if the extension is from an unsigned source?** The user is warned at install. The host can refuse to install (config setting) or warn-and-continue (default).

6. **What about cross-tier interactions?** A workspace extension can be overridden by a user extension (later in the resolution order). A bundled extension cannot be overridden.

7. **What about the "publisher" model?** A user can trust a publisher (e.g. "all extensions by Jane Developer are trusted"). The host maintains a publisher registry. (v2.)

---

## Cross-references

- **Step 1.11 (security)** — `trust-score.ts` (existing), `MutationProvenance` (mutation-level trust).
- **Step 2.4 (data ACL)** — Node-level ACL, securityLevel, authorDid.
- **Step 3.7 (manifest)** — the source field (proposed).
- **Step 4.6 (synthesis)** — the full trust model.
- **Phase 5 (lifecycle & distribution)** — will design signing.
