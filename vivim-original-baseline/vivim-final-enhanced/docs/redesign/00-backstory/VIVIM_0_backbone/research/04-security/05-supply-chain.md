# Step 4.5: Supply Chain — Signing, Updates, Verification

**Date:** 2026-08-28
**Read:** Phase 1 Step 1.14 (distribution), `kernel/security/db-encryption.ts` (referenced)
**Status:** DESIGNED

---

## The question (from the process)

> "How would we know an extension is from who it says it's from? Is the user OK with no signing in v1? Or is this a blocker for 'VS Code-style'?"

## The answer

**v1 ships without signing.** The user accepts the risk; the host's `permissions` model + audit log is the post-install defense. **Signing is v2.**

The v1 trust model:
- **Bundled extensions** are trusted (they came with the host).
- **Workspace extensions** are semi-trusted (the workspace owner vouched).
- **User extensions** are variable (the user decided).
- **All extensions** are sandboxed + audited.

---

## Why no signing in v1

- **No PKI today.** The system has no keypair distribution mechanism.
- **The marketplace is v2.** Without a marketplace, there's no signer to trust.
- **The `permissions` model is the gate.** A malicious extension can be denied at install time.
- **The audit log catches misbehavior post-install.**
- **The sandbox prevents code-level damage.** A malicious inline handler can only do what the sandbox allows.
- **Quick install / update is more valuable than signed install.** Strict signing adds friction; for v1, the friction is not worth it.

The user (or the principal) can opt in to "only signed extensions" as a v1.5 feature. The v1 default is "unsigned, but sandboxed + audited."

---

## The signing model (v2 design)

When signing is enabled:

```typescript
interface SignedExtension {
  manifest: ExtensionManifest
  signature: {
    algorithm: 'ed25519' | 'rsa-pss-sha256'
    publicKey: string                  // PEM-encoded
    signature: string                  // base64
    signedFields: string[]             // ['id', 'version', 'contributes'] (not 'permissions' — those are local)
    signedAt: number
  }
  certificate?: {
    issuer: string                     // e.g. "letsencrypt"
    subject: string                    // e.g. "CN=jane@example.com"
    chain: string[]                    // PEM chain
    expiresAt: number
  }
}
```

The host:
1. Verifies the signature against the public key.
2. If a certificate is included, verifies the chain against a trusted CA.
3. Checks the certificate's `expiresAt`.
4. Checks the `signedFields` (manifest hash matches signature).
5. Shows the signer + certificate info to the user.

The user can pin a publisher: "Only trust extensions signed by Jane." The host maintains a publisher trust list.

---

## The update verification

When an extension is updated, the host must:
1. Verify the new manifest is signed by the same publisher (if v1 had signing).
2. Check the version is a semver-compatible upgrade (or warn for major).
3. Check the new `permissions` are a subset of (or compatible with) the old ones. **If the new version requests MORE permissions, the user must re-grant.**
4. Run any `migrations[]` from the new `StorageContribution` (Step 3.5).

The host fires `extension:updated` event. The extension's contributions are re-registered.

---

## The rollback story

If an update breaks things, the user can roll back to a previous version. The host:
1. Stores the previous version's manifest.
2. Reverts the contributions (unregister new, re-register old).
3. Runs the previous version's `migrations[]` in reverse.
4. Restores data from `NodeVersion` (Step 1.13) if needed.

**This is the same as `git revert`.** The host's "version history" is the installation history.

---

## What's the user-facing UX?

In v1:
- Install an extension → user sees name, version, description, permissions.
- User grants or denies.
- Extension is sandboxed.
- Audit log records every operation.

In v2 (with signing):
- Install → user sees signer + certificate.
- User can pin publisher.
- Failed signature verification = no install.

In v2 (with marketplace):
- Browse the marketplace.
- See ratings, reviews, install counts.
- One-click install.

---

## The "supply chain" risk in v1

A malicious extension in v1 can:
- Steal data via `network.fetches` (sandbox allows, audit catches).
- Delete data via the host's `NodeStore` API (the host gates by ACL; audit catches).
- Crash the host (sandbox protects, but a slow loop can hang).

Mitigations:
- The user reviews `permissions` at install time.
- The user reviews the source code (if open source).
- The user can revoke at any time.
- The audit log is reviewable.

This is **acceptable for v1** because:
- The extension must be deliberately installed.
- The extension is sandboxed.
- The audit log exists.
- The user can revoke.

**For v2, signing + marketplace reputation are added.**

---

## What's already in the codebase

- **`db-encryption.ts`** (5120 lines) — at-rest encryption. The Node layer's `signature` field (per Step 1.13) is presumably signed by the host's key. But the *extension* is not signed.
- **`audit-trail.ts`** (1816 lines) — the operations log. Records every consent grant, capability invocation, mutation. Per-extension attribution is new.
- **`event-record-store.ts`** (3564 lines) — per-event records. Per-extension attribution is new.
- **`telemetry-audit.ts`** (5579 lines) — per-call audit (used by `LiveCapabilityRegistry` for `audit?.fetch`). Per-extension attribution is new.

The audit infrastructure exists; the **per-extension dimension** is the new addition.

---

## The minimum viable supply chain for v1

For v1, the host:
1. Maintains an `extension_install` table (or Node type) with the install state.
2. Records every operation with the `extensionId` in the audit log.
3. Provides a UI for the user to review and revoke.
4. Optionally: hashes the installed manifest (SHA-256) and verifies on every load. If the hash changes (file edited), warn the user.

The SHA-256 hash on load is a "weak signing" — it's a tamper detector, not a signer. But it catches the common case: "I installed this, the file changed, maybe it was updated or maybe it was tampered with."

---

## What this fixes

- ✅ The user knows the trust level (bundled/workspace/user).
- ✅ The audit log records per-extension operations.
- ✅ v2 has a signing design ready.

## What this does NOT fix

- **A malicious extension can steal data in v1.** The user must check the permissions.
- **A malicious extension can be installed from anywhere.** No signature verification.
- **A malicious extension can update itself (no, wait — updates are user-initiated).** The user must opt in to update.
- **A bundled extension could be compromised (supply chain attack on the host).** Out of scope; the host's release process is the gate.

---

## Open design questions

1. **What's the SHA-256 verification on load?** The host computes the hash of the manifest on install; stores it. On every load, recomputes and compares. If different, warn the user. **This is the "weak signing" v1 model.**

2. **What if the user installs from a URL?** The host downloads the tarball, computes the hash, stores it. The same warning on hash mismatch.

3. **What if the user installs from a directory (dev mode)?** The host computes the hash on every load (or watches for changes). Faster feedback loop for developers.

4. **What about the marketplace reputation?** v2.

5. **What about dependency signing?** v2. For v1, dependencies are in the same tarball; the host trusts the whole thing.

6. **What about offline signatures?** v1 doesn't have them. v2: the user can manually verify a signature.

---

## Cross-references

- **Step 1.11 (security)** — `db-encryption.ts`, `audit-trail.ts`, `telemetry-audit.ts`.
- **Step 1.14 (distribution)** — the install endpoint stub.
- **Step 3.7 (manifest)** — the manifest with permissions.
- **Step 4.3 (trust levels)** — the 3-tier model.
- **Phase 4 Step 4.6 (synthesis)** — the full security model.
- **Phase 5** — the distribution + lifecycle will detail the tarball format + marketplace.
