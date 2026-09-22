# Step 1.3: F-022 router-capability-bridge — A Static HTTP-to-Capability Table

**Date:** 2026-08-28
**Read:** `plugins/plugin-system/router-capability-bridge.ts` (648 lines)
**Status:** ANALYZED

---

## What the code does

`router-capability-bridge.ts` is **misnamed.** Despite living in the `plugin-system/` directory, it is NOT a plugin runtime. It is a **static table of HTTP endpoints** (lines 43-549) that gets converted to `UnifiedCapability` entries at boot.

**The mechanism:**

1. `ROUTER_ENDPOINTS` (line 43) is a hard-coded array of ~70 HTTP endpoints, each with `{ method, path, slug, description, category, surfaces? }`. Path patterns use `:param` syntax (e.g. `/api/canvas/instance/:id`).
2. `registerRouterCapabilities(registry, port)` (line 551) iterates the table.
3. For each endpoint, it checks if a capability with the same `apiEndpoint.method` + `apiEndpoint.path` already exists in the registry. If yes, skip.
4. Otherwise it calls `makeCapability(...)` (from `capability-bootstrap.js`) with:
   - `id: 'router:<slug>'`
   - `surfaces: ['cli', 'api', 'mcp']` (default)
   - `cliCommand.name: <slug with underscores → spaces>`
   - `apiEndpoint: { method, path }`
5. The capability's **handler** (lines 591-628) is a proxy: it `fetch()`es `http://localhost:${port}${path}` with the caller's input, replacing `:param` placeholders with input values and appending the rest as query params (for GET) or body (for POST/PUT/etc).
6. Each registered capability is logged. Returns `{ registered, skipped }`.

**The goal** (per the file header at lines 1-13): ensure that the CLI, the universal dispatcher, and MCP can reach ALL backend HTTP routes via capabilities. The bridge is a shim until real handlers are written in `capability-bootstrap-generated.ts`.

---

## Key observations

- **Not a plugin runtime.** The file name is misleading. It is a static table → capability-registry adapter. "Plugin" in the path is a code-organization accident, not a semantic one.

- **The "plugin" word has a third meaning here.** Same word, three different things in the same directory:
  1. `plugin-system.ts` — `ProviderPlugin` contract with lifecycle hooks
  2. `plugin-hot-reload.ts` — file-watch + dynamic-import load record
  3. `router-capability-bridge.ts` — static HTTP table → capabilities
  
  The shared word is noise. Each file is its own thing.

- **"F2/F8 fix" comment at line 3** — this is a one-time bridge added in a past fix to close a coverage gap. It is explicitly described as a stop-gap (lines 11-12): "This is a bridge layer — as real handlers are written in `capability-bootstrap-generated.ts`, they take precedence." The skip-on-duplicate logic at lines 561-568 enforces this: if a real capability already exists for the endpoint, the bridge yields.

- **The table is the source of truth, not the route declarations.** Lines 43-549 are a hand-maintained list. There is no scanning of the actual router code. If a new HTTP route is added to a router file but not added to this table, it is unreachable via capability/CLI/MCP. The invariant is "if you add a route, add it here too." This is a manual sync, not an automated one.

- **70+ endpoints enumerated.** Categories include: canvas (10), agent (4), automation (2), autonomous (4), browser (2), conceptual (3), kernel (3), mutation (7), routing (4), plugins (2), setup (4), storage (4), generative (2), template (2), update (3), users (2), webhook (1), harness (2), audit (3), provenance (1), workspace (2), version (1). This is a comprehensive surface map of the HTTP API.

- **The capability is a thin HTTP proxy.** Lines 591-628. The handler does not implement the operation; it just calls back into the running server via `fetch()`. The "capability" is essentially a typed CLI wrapper around an HTTP call. There is no in-process shortcut, no caching, no special privileges.

- **The proxy is unauthenticated.** Line 617 sets `X-Source: capability-bridge` header but no auth token. This is fine if the local server is loopback-only (which it presumably is), but it means the bridge assumes the server is reachable on `localhost:port` and that the call is trusted.

- **Categories are a real taxonomy.** Each entry has a `category` string (`canvas`, `agent`, `automation`, `system`, `browser`, `knowledge`, `llm`, `storage`, `user`, `ai`, `admin`). This is the "taxonomy" the capability system uses to group commands. The `surfaces` field defaults to `['cli', 'api', 'mcp']` — every bridge entry is reachable from all three.

- **Param handling is string-based.** Lines 594-606: `:param` placeholders are replaced with `String(merged[name])`. No type coercion, no validation. If the caller passes a number, it gets stringified. If they don't pass a required param, the URL has a literal `:id` in it and the fetch 404s.

- **No tests in this file's directory either.** The bridge has no test file alongside it. The capability-bootstrap tests do not appear to cover the bridge.

- **`UnifiedCapabilityRegistry` is the registry type it accepts.** Line 20 imports it from `./unified-registry.js`. Step 1.7 will read that file.

- **`makeCapability` is from `capability-bootstrap.js`.** Line 15. Step 1.8 will read that file. The bridge assumes a `makeCapability(spec, handler)` factory exists.

---

## Key questions raised

1. **Is the bridge still needed?** If `capability-bootstrap-generated.ts` already covers most endpoints, many of these are probably skipped. Who keeps the table in sync — is it actively edited, or has it gone stale?

2. **What happens to a capability once it is registered?** `registry.register(cap)` is called once at boot. The handler closure captures `port` and `ep`. If the server restarts on a different port, the bridge is stale until next boot. (This is fine for a desktop app that restarts the bridge on startup.)

3. **What about the universal dispatcher?** The file header says the bridge is for "CLI, universal dispatcher, and MCP." The dispatcher probably consumes the capability list and routes by `apiEndpoint`. Need to confirm in Phase 1.7/1.8.

4. **Are there *any* plugin-related endpoints in this file?** Lines 322-335: `/api/plugins` (list) and `/api/plugins/install`. These are the only "plugin" surface in the entire 648-line file. The bridge implies there IS a plugin management HTTP API somewhere — `plugin_list` and `plugin_install`. But this file does not implement them; it just wraps them. Where are the actual `/api/plugins` and `/api/plugins/install` route handlers? (Step 1.6 will look at provider-registrar.)

5. **Is this file contributing to the "extension" model?** No. It is a list of HTTP endpoints. An extension model would let the user declare new endpoints. The bridge declares them statically. The closest "extension" hook here is that the table is in the codebase, not generated — meaning a developer could add an entry without writing any other code. But "developer can edit a list" is not an extension model.

6. **Why is it in `plugin-system/`?** Probably historical: at some point the bridge was considered a "plugin" for the capability system. The directory's name is now misleading. A `extensions/router-bridge/` or `capability/router-bridge/` would be more accurate.

---

## Cross-references

- **Step 1.1 (plugin-system.ts)** — the file's sibling and namesake. Totally different concept.
- **Step 1.2 (plugin-hot-reload.ts)** — the file's other sibling. Also different concept.
- **Step 1.7 (capability system)** — the registry that `registerRouterCapabilities` writes into.
- **Step 1.8 (capability bootstrap)** — `makeCapability` factory, `capability-bootstrap-generated.ts` which the bridge yields to.
- **`./unified-registry.js`** (line 20) — the registry API: `register(cap)`, `list({ surface })`.
- **`./capability-bootstrap.js`** (line 15) — `makeCapability(spec, handler)`. The factory that wraps a spec + handler into a `UnifiedCapability`.
- **All 70+ endpoints in the table** are evidence of the HTTP surface area. An extension model would need to either consume this table (manifest of HTTP routes) or supersede it.
