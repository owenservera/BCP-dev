# Generated — server files (69) with /api prefixes

> Machine-generated. Prefix = literal `/api/…` strings found per file (max 8). Canonical routing lives in `server/index.ts` fetch() chains + `server-routers-full.md`.

| file | api prefixes seen |
|------|-------------------|
| `src/server/agent-canvas-router.ts` | `/api/agent/canvas/command /api/agent/canvas/policy /api/agent/canvas/plan` |
| `src/server/auth-gate.ts` | `` |
| `src/server/automation-router.ts` | `/api/automate/ /api/automate/recipes /api/automate/roles /api/automate/run` |
| `src/server/autonomous-router.ts` | `/api/autonomous/execute /api/autonomous/tasks /api/autonomous/gates /api/autonomous/gates/:id/resolve /api/autonomous/status/:id /api/autonomous/:id/cancel /api/autonomous/:id/replay /api/autonomous/:id/trace` |
| `src/server/bootstrap-engines.ts` | `` |
| `src/server/bootstrap-seeds.ts` | `` |
| `src/server/bootstrap/context.ts` | `` |
| `src/server/bootstrap/orchestrator.ts` | `` |
| `src/server/bootstrap/phases/capabilities.ts` | `` |
| `src/server/bootstrap/phases/knowledge.ts` | `` |
| `src/server/bootstrap/phases/lifecycle.ts` | `` |
| `src/server/bootstrap/phases/seeds.ts` | `` |
| `src/server/bootstrap/phases/stores.ts` | `` |
| `src/server/canvas-router.ts` | `/api/canvas/ /api/canvas/definitions /api/canvas/spawn /api/canvas/resolve /api/canvas/events /api/canvas/observe /api/canvas/instance/:id /api/canvas/instance/:id/mutate` |
| `src/server/canvas-ws.ts` | `` |
| `src/server/capability-router.ts` | `/api/capabilities /api/capabilities/:id/execute /api/capabilities/:id` |
| `src/server/chrome-router.ts` | `/api/chrome/factory /api/chrome/reset` |
| `src/server/collection-router.ts` | `/api/collections /api/collections/:id /api/collections/:id/children /api/collections/:id/move /api/collections/:id/items /api/collections/:id/items/:item` |
| `src/server/conceptual-router.ts` | `/api/conceptual/families /api/conceptual/provider-types/:slug /api/conceptual/resolve /api/conceptual/surface` |
| `src/server/conversation-router.ts` | `/api/providers /api/providers/:id/capabilities /api/conversations/:id/capabilities /api/conversations/:id/capabilities/:slug/execute /api/sandbox/debug /api/fleet/status /api/fleet/:id /api/fleet/start` |
| `src/server/conversation-sync-router.ts` | `/api/conversations/sync/:provider /api/conversations/sync/:provider/status /api/conversations/sync/:provider/logs /api/conversations/sync/:provider/fetch/:conversation` |
| `src/server/engines-catalog.ts` | `` |
| `src/server/errors.ts` | `` |
| `src/server/generative-router.ts` | `/api/generative/status/:task /api/generative/cancel/:task /api/generative/list /api/generative/subscribe/:task /api/generative/` |
| `src/server/index.ts` | `/api/foo/{id}/bar /api/foo/:id/bar /api/openapi /api/v /api/setup/ /api/route/ /api/nlcl/ /api/knowledge/` |
| `src/server/interpret-router.ts` | `/api/interpret /api/nlcl/interpret` |
| `src/server/kernel-router.ts` | `/api/kernel /api/kernel/oracle/query /api/kernel/oracle/heal /api/kernel/oracle/scan /api/kernel/oracle/events /api/kernel/oracle/visibility /api/kernel/oracle/manifest /api/kernel/oracle/policy` |
| `src/server/knowledge-router.ts` | `/api/knowledge/ingest /api/knowledge/search /api/knowledge/synthesize /api/knowledge/export /api/knowledge/entities /api/knowledge/decisions /api/knowledge/topics /api/knowledge/jobs` |
| `src/server/llm-harness-router.ts` | `/api/llm-harness/plan /api/llm-harness/apply /api/llm-harness/escalate` |
| `src/server/memory-router.ts` | `/api/memory/export /api/memory/import /api/memory/review/due /api/memory/review/:id` |
| `src/server/memory-viz-router.ts` | `/api/memory/graph /api/memory/graph/subgraph /api/memory/graph/neighbors /api/memory/graph/clusters /api/memory/timeline /api/memory/stats /api/memory/curated /api/memory/assert` |
| `src/server/middleware/built-in/cors.ts` | `` |
| `src/server/middleware/built-in/error-handler.ts` | `` |
| `src/server/middleware/built-in/rate-limiter.ts` | `` |
| `src/server/middleware/built-in/request-logger.ts` | `` |
| `src/server/middleware/built-in/trace-propagation.ts` | `` |
| `src/server/middleware/index.ts` | `/api/version` |
| `src/server/middleware/pipeline.ts` | `` |
| `src/server/middleware/types.ts` | `` |
| `src/server/module-registry.ts` | `` |
| `src/server/mutation-router.ts` | `/api/mutation/apply /api/mutation/preview /api/mutation/history /api/mutation/undo /api/mutation/redo /api/mutation/status` |
| `src/server/mux-router.ts` | `/api/route/auto /api/route/mux /api/route/fanout /api/route/cost-report /api/route/preferences` |
| `src/server/nlcl-router.ts` | `/api/nlcl/interpret /api/nlcl/confirm /api/nlcl/commands /api/nlcl/help /api/nlcl/audit /api/nlcl/parse /api/nlcl/` |
| `src/server/node-router.ts` | `/api/nodes/alias /api/nodes/alias/:alias /api/nodes/rebuild-graph /api/nodes/count /api/nodes /api/nodes/:id/raw /api/nodes/:id/children /api/nodes/:id/lineage` |
| `src/server/onboarding-boot.ts` | `` |
| `src/server/plugin-builder-router.ts` | `/api/plugin-builder/build /api/plugin-builder/seed` |
| `src/server/plugin-router.ts` | `` |
| `src/server/response.ts` | `/api/conversations /api/providers /api/nodes /api/knowledge/search /api/capabilities/:id /api/conversations/:id/send` |
| `src/server/routes/contacts.ts` | `/api/contacts/search /api/contacts /api/contacts/:id /api/contacts/lookup /api/contacts/:id/merge /api/contacts/:id/merged` |
| `src/server/routes/containers.ts` | `/api/containers /api/containers/:id /api/containers/:id/members /api/containers/:id/members/:user` |
| `src/server/routes/content.ts` | `/api/content/search /api/content /api/content/:id` |
| `src/server/routes/knowledge.ts` | `/api/knowledge/entities/search /api/knowledge/entities /api/knowledge/entities/:id /api/knowledge/topics/search /api/knowledge/topics /api/knowledge/topics/:id /api/knowledge/projects/search /api/knowledge/projects` |
| `src/server/routes/media.ts` | `/api/media/undownloaded /api/media/types/:type /api/media /api/media/:id /api/media/:id/download /api/media/:id/progress` |
| `src/server/routes/notifications.ts` | `/api/notifications/unread-count /api/notifications /api/notifications/:id /api/notifications/:id/read /api/notifications/read-all` |
| `src/server/routes/sync.ts` | `/api/sync/pending /api/sync /api/sync/progress /api/sync/error /api/sync/:id` |
| `src/server/routes/tunnel.ts` | `/api/tunnel/status /api/tunnel/config /api/tunnel/start /api/tunnel/stop /api/tunnel/health /api/tunnel/p` |
| `src/server/routes/update.ts` | `/api/update/check /api/update/provider/:slug /api/update/download /api/update/install /api/update/apply /api/update/version /api/update/providers /api/update/provider/:slug/status` |
| `src/server/routes/users.ts` | `/api/users/current /api/users /api/users/switch /api/users/:id /api/users/:id/role` |
| `src/server/service-container.ts` | `` |
| `src/server/setup-router.ts` | `/api/setup/workspace /api/setup/launch-visible /api/setup/verify /api/setup/complete /api/setup/restore /api/setup/profiles /api/setup/kill` |
| `src/server/source-middleware.ts` | `` |
| `src/server/storage-router.ts` | `/api/storage/ /api/storage/status /api/storage/progress /api/storage/move /api/storage/rollback /api/storage/cleanup /api/storage/ttl/sweep /api/storage/ttl/message/:id` |
| `src/server/surface-router.ts` | `/api/surface/:id/spec /api/surface/:id/summary /api/surface` |
| `src/server/template-router.ts` | `/api/template/from-graph /api/template /api/template/:id /api/template/:id/instantiate` |
| `src/server/validate.ts` | `` |
| `src/server/variant-router.ts` | `/api/variant /api/variant/ /api/variant/:id /api/variant/:id/activate` |
| `src/server/version-router.ts` | `/api/version /api/version/:id /api/version/:id/restore /api/version/diff /api/workspace/backup /api/workspace/restore /api/provenance/weights` |
| `src/server/webhook-router.ts` | `` |
| `src/server/websocket.ts` | `` |
