# Step 5.1: Install Path

**Date:** 2026-08-28
**Read:** Phase 1 Step 1.14 (distribution), Phase 3 Step 3.7 (manifest), Phase 4 Step 4.6 (security)
**Status:** DESIGNED

---

## The question (from the process)

> "How does an extension get installed? Is it a file drop, a manifest install, a marketplace fetch, or something else?"

## The answer

**Three install paths, all backed by a single install pipeline.** The host reads a `vivim-extension.json` from a tarball (file drop), a manifest URL (fetched), or a marketplace record. The pipeline is the same.

### Path A: File drop (`.vivim-plugin` tarball)

1. User downloads a `.vivim-plugin` tarball.
2. User runs `vivim install <path-to-tarball>` (CLI) or drags into the UI.
3. Host extracts the tarball to a temp dir.
4. Host reads `vivim-extension.json`.
5. Host validates the manifest.
6. Host shows the user the manifest + permissions.
7. User grants.
8. Host applies contributions.

### Path B: Manifest URL

1. User runs `vivim install https://example.com/myext.vivim-plugin` (CLI).
2. Host downloads the tarball.
3. Same as Path A from step 3.

### Path C: Marketplace (v2)

1. User runs `vivim install <extension-id>` (e.g. `vivim install slack-integration`).
2. Host queries the marketplace for the latest version.
3. Host downloads the tarball (or fetches a manifest URL from the marketplace).
4. Same as Path A from step 3.

### Path D: Directory watch (dev mode)

1. User sets a directory in the host config: `extensionsDir: /path/to/dev/extensions`.
2. Host watches the directory for `vivim-extension.json` files.
3. On change, host installs (or re-installs if updated).

This is the "developer mode" — the user edits the extension, the host picks it up.

### Path E: Workspace config

1. User commits a `vivim.workspace.json` to the workspace repo.
2. The file lists extensions: `[{ id: 'slack-integration', version: '^1.0.0' }]`.
3. When the workspace is loaded, the host installs the listed extensions.

This is the "team mode" — the workspace owner curates the extension set.

---

## The unified install pipeline

The host has a single `installExtension(source: InstallSource): Promise<ExtensionInstall>` method that handles all 5 paths:

```typescript
type InstallSource =
  | { kind: 'tarball'; path: string }
  | { kind: 'url'; url: string }
  | { kind: 'marketplace'; extensionId: string; version?: string }  // v2
  | { kind: 'directory'; path: string; manifestPath: string }      // dev mode
  | { kind: 'workspace'; extensionId: string; version?: string }    // team mode

interface ExtensionInstall {
  id: string                       // unique install id (UUID)
  manifest: ExtensionManifest
  source: InstallSource
  version: string
  installedAt: number
  grants: ExtensionGrants
  resourceLimits: ResourceLimits
  trustScore: ExtensionTrustScore
  fingerprint: string               // SHA-256 of the manifest
}
```

The pipeline (per `Phase 4.6` synthesis):
1. Read source → get the manifest.
2. Validate manifest.
3. Compute SHA-256 fingerprint.
4. Show user + grant.
5. Apply contributions.
6. Store install state.
7. Fire `extension:installed` event.

---

## The tarball format (`.vivim-plugin`)

A `.vivim-plugin` is a tarball with this structure:

```
myext.vivim-plugin/
├── vivim-extension.json         # required; the manifest
├── dist/                         # optional; bundled components
│   ├── components/
│   │   └── bubble-citations.jsx  # the slot override component
│   └── assets/
│       └── icon.png
├── inline/                       # optional; sandboxed JS for inline handlers
│   ├── send-to-slack.js
│   └── on-event.js
├── parsers/                      # optional; provider parser logic_code files
│   └── myllm-parser.js
├── README.md                     # optional
├── LICENSE                       # optional
└── SIGNATURE                     # optional; v2
```

**The tarball is a directory, not a flat file.** The host extracts and reads each part.

**Inline handler source** is a `.js` file (not `.ts`). The host reads the file, passes the content as the `code: string` to `LiveCapabilityRegistry.registerLive`. The sandbox runs it.

**Component source** is a `.jsx` file (React). The host reads the file, bundles with the slot override claim. The frontend renders it.

**Provider parser** is a `.js` file matching the `logic_code` shape (per Step 1.6 — `function(module, exports) { exports.default = { ... } }`).

---

## What the install endpoint does today vs. what it should do

### Today (Step 1.14)

```typescript
// POST /api/plugins/install
// 1. Receives the tarball
// 2. Generates a pluginId
// 3. Emits plugin:registered
// 4. Returns OK
// NO extraction, NO validation, NO registration.
```

### Proposed

```typescript
// POST /api/plugins/install
async function installHandler(req: Request) {
  // 1. Receive tarball
  const tarball = await req.formData()
  const file = tarball.get('tarball')
  if (!(file instanceof File)) return error('missing tarball')
  
  // 2. Save to temp
  const tempDir = await extractToTemp(file)
  
  // 3. Read manifest
  const manifest = await readManifest(tempDir)
  if (!validateManifest(manifest)) return error('invalid manifest')
  
  // 4. Run install pipeline
  const install = await extensionInstaller.install({
    kind: 'tarball',
    path: tempDir,
  })
  
  // 5. Return the install state
  return { ok: true, install }
}
```

The 47-line stub becomes a real install pipeline.

---

## What the user sees at install time

The host UI shows:

```
┌────────────────────────────────────────────────────────┐
│ Install: Slack Integration                             │
│ Version 1.2.3 by Jane Developer (MIT)                   │
│                                                        │
│ Description:                                           │
│ "Send messages to Slack channels and read channel       │
│  history."                                             │
│                                                        │
│ What this extension will do:                           │
│                                                        │
│  Commands:                                             │
│    • send_to_slack (cli, mcp, api)                     │
│    • list_slack_channels (cli, mcp, api)                │
│                                                        │
│  Network access:                                       │
│    • https://slack.com/api/*    (call Slack API)        │
│                                                        │
│  Storage:                                              │
│    • Will create slack-channel data (your storage)      │
│                                                        │
│  Lifecycle:                                            │
│    • On boot: fetch channel list                        │
│                                                        │
│  Resource limits:                                      │
│    • 60 commands/min, 5s CPU each                       │
│    • 30 network requests/min, 10MB/min                  │
│                                                        │
│  Trust: 50/100 (new, unverified publisher)              │
│                                                        │
│  [Show full manifest] [Decline] [Accept & Install]     │
└────────────────────────────────────────────────────────┘
```

The user clicks "Accept" → install proceeds.

---

## Where the install state is persisted

Per Step 3.5 philosophy: store as Nodes with `type: 'extension.install'`. The host has an `extension_install` table or Node type.

```typescript
// Each install is a Node:
{
  id: 'ext-install:<uuid>',
  type: 'extension.install',
  dataJson: JSON.stringify({
    extensionId: 'slack-integration',
    version: '1.2.3',
    fingerprint: 'sha256:...',
    source: { kind: 'tarball', path: '...' },
    grants: { ... },
    resourceLimits: { ... },
    trustScore: { ... },
    installedAt: 1234567890,
  }),
  metaJson: JSON.stringify({
    tags: ['extension', 'install', 'slack-integration'],
  }),
  aclJson: JSON.stringify([
    { principal: 'self', permission: 'admin' },
    { principal: 'workspace', permission: 'read' },
  ]),
}
```

The user can list their installed extensions by querying `NodeStore.listByType('extension.install')`.

---

## What this fixes

- ✅ Three install paths (tarball, URL, marketplace) backed by one pipeline.
- ✅ The tarball format is specified.
- ✅ The install endpoint is no longer a stub.
- ✅ The user sees the manifest + permissions + grants at install time.
- ✅ The install state is persisted as Nodes (queryable + versioned + auditable).

## What this does NOT fix

- **The marketplace (Path C) is v2.** v1 supports tarball + URL + directory + workspace.
- **Signing is v2.** v1 uses SHA-256 fingerprinting.
- **The UI** is the host's responsibility; the design is the data, not the visuals.
- **Updates via install** are not yet a separate flow (Step 5.2 will detail).

---

## Open design questions

1. **What if the user installs the same extension twice?** The host checks the fingerprint. If the same manifest, fail. If a different version, treat as update (Step 5.2).

2. **What if the tarball is malformed?** The host returns a clear error. No partial install.

3. **What if the manifest references a missing field?** The Zod schema fails. The host returns the validation error.

4. **What if the user installs in dev mode (directory) and then the directory is deleted?** The extension is still in the install state but the source is gone. The host can re-load from the install state (manifest is stored). The contribution source is regenerated from the install state.

5. **What about offline installs?** The tarball path is offline. The URL path needs network. The marketplace path needs network. Directory + workspace are offline (if the user has the files locally).

6. **What about the `SIGNATURE` file in the tarball?** v2: the host verifies. v1: the host ignores.

7. **What about extension dependencies?** The host checks the `dependencies` field. If a dependency is missing, the host downloads it (URL path) or fails (offline).

---

## Cross-references

- **Step 1.14 (distribution)** — the install endpoint stub.
- **Step 3.7 (manifest)** — the `vivim-extension.json` schema.
- **Step 4.6 (security)** — the install pipeline (read → validate → grant → apply).
- **Step 5.2 (load & activate)** — next step.
- **Step 5.5 (marketplace)** — v2.
- **Step 5.6 (final synthesis)** — the complete picture.
