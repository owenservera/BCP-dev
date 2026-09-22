# Generated — shaping intel 2/6: router → engines / contracts

> Machine-generated static import scan (max 8 each). Shows which engine/contract names a router file references. Does not assert runtime behavior.

| router file | engines referenced | contracts referenced |
|-------------|--------------------|----------------------|
| `src/server/agent-canvas-router.ts` | `` | `` |
| `src/server/automation-router.ts` | `automation/agents automation/orchestrator` | `` |
| `src/server/autonomous-router.ts` | `autonomous-execution execution-policy task-history` | `` |
| `src/server/canvas-router.ts` | `capability-event-bus unified-registry` | `` |
| `src/server/capability-router.ts` | `unified-registry` | `` |
| `src/server/chrome-router.ts` | `` | `` |
| `src/server/collection-router.ts` | `` | `` |
| `src/server/conceptual-router.ts` | `` | `` |
| `src/server/conversation-router.ts` | `capability-resolution provider-health mirror-engine` | `` |
| `src/server/conversation-sync-router.ts` | `adapters/chatgpt-adapter conversation-history-sync` | `conversation-store` |
| `src/server/generative-router.ts` | `generative/generative-task-store` | `` |
| `src/server/interpret-router.ts` | `nlcl/nlcl-engine nlcl/types` | `` |
| `src/server/kernel-router.ts` | `config-universal-surface` | `` |
| `src/server/knowledge-router.ts` | `export knowledge-ingestion` | `` |
| `src/server/llm-harness-router.ts` | `nlcl/confirmation-store reprogrammability/llm-harness-agent` | `` |
| `src/server/memory-router.ts` | `fsrs-scheduler memory-export` | `` |
| `src/server/memory-viz-router.ts` | `memory-engine` | `memory-curated-store` |
| `src/server/mutation-router.ts` | `` | `` |
| `src/server/mux-router.ts` | `cost-optimizer provider-mux` | `` |
| `src/server/nlcl-router.ts` | `nlcl/nlcl-engine nlcl/types nlcl/dialogue-session-store` | `` |
| `src/server/node-router.ts` | `` | `` |
| `src/server/plugin-builder-router.ts` | `reprogrammability/plugin-builder` | `` |
| `src/server/plugin-router.ts` | `` | `` |
| `src/server/routes/contacts.ts` | `` | `` |
| `src/server/routes/containers.ts` | `` | `` |
| `src/server/routes/content.ts` | `` | `` |
| `src/server/routes/knowledge.ts` | `` | `` |
| `src/server/routes/media.ts` | `` | `` |
| `src/server/routes/notifications.ts` | `` | `` |
| `src/server/routes/sync.ts` | `` | `` |
| `src/server/routes/tunnel.ts` | `` | `` |
| `src/server/routes/update.ts` | `update-engine` | `` |
| `src/server/routes/users.ts` | `` | `` |
| `src/server/setup-router.ts` | `` | `` |
| `src/server/storage-router.ts` | `backup-manager compaction-manager lifecycle-engine storage-relocation-engine` | `` |
| `src/server/surface-router.ts` | `` | `` |
| `src/server/template-router.ts` | `` | `` |
| `src/server/variant-router.ts` | `` | `` |
| `src/server/version-router.ts` | `reprogrammability/version-store` | `` |
| `src/server/webhook-router.ts` | `workflow-engine` | `` |
