# Step 5.5: Marketplace (v2)

**Date:** 2026-08-28
**Status:** OUT OF SCOPE FOR v1 (documented for v2)

---

## The question (from the process)

> "What's the future marketplace story? What would a marketplace need from the v1 design to slot in?"

## The answer

**v1 does NOT include a marketplace.** The user installs extensions from tarballs, URLs, directories, or workspace config. The v1 design is **marketplace-ready** — the contract is compatible with a future marketplace. This document outlines what v2 would need.

---

## What a v2 marketplace needs

### 1. A marketplace server

A hosted service that stores:
- Extension metadata (id, name, version, description, screenshots).
- Tarball URLs (or hashes for IPFS-style distribution).
- Publisher info (name, certificate).
- Categories, tags, search index.
- Reviews + ratings.
- Install counts.

### 2. A search API

The host queries the marketplace:
- `GET /api/extensions?q=slack` — search by keyword.
- `GET /api/extensions/:id` — get one extension's metadata.
- `GET /api/extensions/:id/versions` — list versions.
- `GET /api/extensions/:id/reviews` — get reviews.

### 3. A publisher model

A publisher is an entity that signs extensions. The marketplace maintains:
- Publisher profile (name, bio, public key).
- Publisher trust score (computed from reviews, install counts, audit violations).
- Per-extension trust score.

The user can pin a publisher: "I trust Jane's extensions."

### 4. Signing infrastructure

The publisher signs the extension tarball with their private key. The host verifies with the publisher's public key (fetched from the marketplace or pre-installed).

The signing format is `SignedExtension` (per Step 4.5):
```typescript
interface SignedExtension {
  manifest: ExtensionManifest
  signature: {
    algorithm: 'ed25519' | 'rsa-pss-sha256'
    publicKey: string
    signature: string
    signedFields: string[]
    signedAt: number
  }
  certificate?: { ... }
}
```

### 5. A review system

Users post reviews. Reviews include:
- Rating (1-5 stars).
- Text.
- Trust score impact (positive = increase, negative = decrease).
- Audit data (the host can show "this extension performed 100 ops last week").

The marketplace aggregates reviews into a publisher trust score.

---

## What v1 needs to support a v2 marketplace

The v1 design is **marketplace-compatible** if:

1. **`vivim-extension.json`** is the manifest format. ✅ (Step 3.7)
2. **The tarball format** is `.vivim-plugin` with `vivim-extension.json` at the root. ✅ (Step 5.1)
3. **The install pipeline** accepts a tarball. ✅ (Step 5.1)
4. **Permissions are declared in the manifest.** ✅ (Step 3.7)
5. **Trust score is per-extension.** ✅ (Step 4.3)
6. **The audit log is per-extension.** ✅ (Step 4.6)
7. **The version is semver.** ✅ (Step 3.7)

The marketplace can host the same tarballs. The host's install pipeline doesn't change.

---

## What's missing for v2

1. **The `SignedExtension` envelope** (Step 4.5).
2. **The publisher registry** (a list of trusted publishers).
3. **The review + rating system** (a Node type for reviews).
4. **The marketplace server** (a separate service).
5. **The search index** (a separate service or in-host full-text search).
6. **The "install count" + "publisher trust score"** (aggregated data, fetched from the marketplace).
7. **The `one-click install` UX** in the host UI.
8. **The "auto-update" mechanism** (per Step 4.3, the user opts in to auto-updates).

---

## The marketplace's "happy path" UX

```
User: "I want a Slack integration."
Host: "Found 12 results. Top 3:"
  1. "Slack Integration" by Jane Developer (4.8★, 10K installs, signed)
  2. "Slack Bridge" by Acme Corp (4.2★, 5K installs, signed)
  3. "Slack Tools" by Open Source Co (4.0★, 50K installs, signed)
User: clicks "Slack Integration" by Jane.
Host: shows manifest + permissions.
User: clicks "Install."
Host: downloads, validates, applies. Done.
```

---

## The marketplace's "warning" UX

```
User: "I want 'Sketchy Slack Tool' (no publisher listed)."
Host: "⚠ This extension is unsigned. The publisher is unverified.
       The extension requests: send_to_slack (cli, mcp, api), network access to *.sketchy.com
       [Show manifest] [Decline] [Install anyway]"
User: clicks "Install anyway."
Host: installs with a warning flag in the trust score.
```

The user took the risk; the audit log records the choice.

---

## The v2 timeline

v2 is post-launch. The v1 design doesn't block v2. The user can build a marketplace server independently and have the host query it.

---

## Cross-references

- **Step 3.7 (manifest)** — the format the marketplace hosts.
- **Step 4.3 (trust levels)** — publisher trust.
- **Step 4.5 (supply chain)** — signing.
- **Step 5.1 (install path)** — Path C (marketplace) is the v2 path.
- **Step 5.6 (synthesis)** — the v1 vs v2 split.
