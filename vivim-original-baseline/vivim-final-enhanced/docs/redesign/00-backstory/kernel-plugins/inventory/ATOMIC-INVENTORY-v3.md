# Atomic Inventory — Forensic Reclassification (v3)

> **This file replaces the 194-row product-language inventory in `ATOMIC-INVENTORY.md` as the authoritative classification.** The forensic architecture analysis (`BOUNDARY-CONSTITUTION.md`, `PLUGIN-TRUST-MODEL.md`, `KERNEL-CONTRACTS.md`, `PLUGIN-CONTRACTS.md`) is the rule; this file is the per-row proof. Every row ends in one explicit decision: `KEEP`, `MOVE`, `SPLIT`, `MERGE`, `DEFER`, `REMOVE`. Every row is code-anchored to a file:line or model name from the actual repository.

**Format per row** (machine-friendly, CSV-extractable):

```
ID | Domain | Product Capability | Current Layer (proposal) | Recommended Layer (forensic) | Confidence | Kernel Mechanism | Plugin Contract | Implementation Owner | v1/v2 | Security Tier | Evidence | Decision
```

**Counts (computed by the rules, not asserted):**

- **KERNEL (K0)**: the minimum substrate (Constitution Rule A + Rule F)
- **K1 — first-party plugin**: Vivim's own product features
- **GENERIC (K2)**: third-party extension surface
- **SANDBOXED (K3)**: untrusted iframe/QuickJS content

The prior proposal claimed 75 CORE / 84 DEFAULT PLUGIN / 35 GENERIC. The forensic reclassification yields a different split, recorded in `AT-FORENSIC-VERDICT.md` "Executive verdict." A row's *Recommended Layer* is the truth; the prior proposal is now a teaching artifact.

---

## Domain A — Boot, Events & System Foundations (18 → 13 KEEP, 5 SPLIT, 0 MERGE, 0 DEFER, 0 REMOVE)

| ID | Domain | Product Capability | Cur | Rec | Conf | Kernel Mechanism | Plugin Contract | Owner | v | Tier | Evidence | Decision |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| A01 | Boot | 5-phase bootstrap pipeline (seeds → stores → knowledge → capabilities → lifecycle) | CORE | KERNEL | HIGH | `BootstrapContext` threaded through phases; `IPluginContext`-style factory for first-party plugins | — | kernel | v1 | K0 | `src/server/bootstrap/orchestrator.ts:15`, `phases/capabilities.ts:26` (738 lines) | KEEP |
| A02 | Boot | Topology observability (engines/stores/capabilities/routes registered) | CORE | KERNEL | HIGH | `KernelRegistry` + `KernelTracer` + `KernelProvenance` | — | kernel | v1 | K0 | `src/engines/kernel/kernel-registry.ts:15`, `kernel-provenance.ts` | KEEP |
| A03 | Boot | Schema/provider version + drift detection | CORE | KERNEL (machinery) / K1 (drift values) | HIGH | `SchemaMeta` + `verifySchemaCompat` on boot | DriftEvent writes by K1 browser-automation plugin | kernel | v1 | K0/K1 split | `prisma/system/schema.prisma` `SchemaMeta`, `ManifestDrift`, `RegistrationEvent`; `src/server/bootstrap/phases/seeds.ts:21-22` | SPLIT |
| A04 | Events | Typed in-process pub/sub (capability:executed, provider:seeded, …) | CORE | KERNEL | HIGH | `IEventBus` (KERNEL-CONTRACTS C-03) + V2 impl + V1 bridge | `IPluginContext.events.{publish,on,once,onAny}` (PLUGIN-CONTRACTS P-13) | kernel | v1 | K0 | `src/engines/capability-event-bus-v2.ts:46`, `:165`; `src/ai/events/bus.ts:60-79` | KEEP |
| A05 | Events | Durable event outbox for replay | CORE | KERNEL | HIGH | `EventRecord` model + `EventRecordStore` | `IEventBus.publish` mirrors to it transparently | kernel | v1 | K0 | `src/engines/event-record-store.ts`, `prisma/system/schema.prisma` `EventRecord`, `RegistrationEvent` | KEEP |
| A06 | Boot | Module dependency sort + cycle detection (Kahn) | CORE | KERNEL | HIGH | `ModuleRegistry` (already a topo-sort DI) | — | kernel | v1 | K0 | `src/server/module-registry.ts:59` | KEEP |
| A07 | Boot | Lifecycle hooks (init/start/stop per engine) | CORE | KERNEL | HIGH | `ModuleRegistry.lifecycle.{init,start,stop}` + `Kernel.start()/stop()` | `IPluginContext` provides dispose hooks | kernel | v1 | K0 | `module-registry.ts:32`; `kernel-context.ts:89-117` | KEEP |
| A08 | Boot | Central config (one place for tunables, audited) | CORE | KERNEL | HIGH | `ConfigManager` + `ConfigEntry`/`ConfigAudit` + `registerSchema` | First-party plugin config reads via their own contracts | kernel | v1 | K0 | `src/engines/config-manager.ts`, `prisma/system/schema.prisma` `ConfigEntry`+`ConfigAudit` | KEEP |
| A09 | Boot | Structured logging + tracing (no `console.*`) | CORE | KERNEL | HIGH | `KernelTracer` + `getLogger` (pino) + `KernelProvenance` | Plugins publish via `IEventBus`; they may NOT use host's `getLogger` directly | kernel | v1 | K0 | `src/engines/logger.ts`, `otel-sink.ts`, `kernel-tracer.ts`, `kernel-provenance.ts`; `KernelSpan`+`KernelProvenance`+`KernelEvent` in `prisma/system/schema.prisma` | KEEP |
| A10 | Boot | Universal ID + error shapes (ULID, branded) | CORE | KERNEL | HIGH | `ulid()` factory, `EngineError` base, `RequestId/ProviderId/PluginId/...` branded types | Plugins import from `kernel/ids.ts` and `kernel/errors.ts` | kernel | v1 | K0 | `src/ids.ts`, `src/errors.ts`, `src/ai/core/types.ts:42-49` | KEEP |
| A11 | Boot | Encryption key management (PBKDF2 + AES-GCM) | CORE | KERNEL | HIGH | `EncryptionEngine` | — | kernel | v1 | K0 | `src/engines/encryption.ts:1-32` | KEEP |
| A12 | Boot | Encrypt sensitive fields at rest (tokens, secrets) | CORE | KERNEL | HIGH | `DbEncryptionEngine` (envelope); field-level in `ProviderAccount` writes | — | kernel | v1 | K0 | `src/engines/db-encryption.ts:8`, `ProviderAccount` secrets | KEEP |
| A13 | Boot | Capability taxonomy (the *vocabulary* primitive — not Vivim's taxonomy) | CORE | KERNEL (primitive) / K1 (Vivim's `CAPABILITY_TAXONOMY_V2`) | HIGH | `IProviderRegistry` + `ICapabilityBinding` + the universal `Capability` shape | First-party plugin (chat) registers its own taxonomy entries | kernel + plugin:chat | v1 | K0 shape / K1 content | `src/engines/unified-registry.ts:31`, `capability-taxonomy.ts:25` (60 entries) | SPLIT |
| A14 | Boot | Capability discovery loop | CORE | K1 (`plugin:chat`) | HIGH | `IProviderRegistry.list()` is the kernel primitive; the *loop that reconciles them with NLCL* is product | — | plugin:chat | v1 | K1 | `src/engines/capability-discovery-loop.ts`; confusion with `IProviderRegistry.list()` in `registry.ts:33-58` | MOVE |
| A15 | Boot | Natural language → capability | CORE | K1 (`plugin:canon-nlcl`) | HIGH | `IPluginContext.capabilities.invoke(...)` is the kernel primitive; the NL resolver itself is product | — | plugin:canon-nlcl | v1 | K1 | `src/engines/capability-bootstrap/nl-interpret.ts`, `src/engines/nlcl/*` (60 files) | MOVE |
| A16 | Boot | CLI = thin shell over capabilities (no second transport) | CORE | KERNEL | HIGH | `src/cli/*` consumes `IPluginContext.capabilities.invoke()` | — | kernel | v1 | K0 | `src/cli/*`; `server/index.ts` bootstrap | KEEP |
| A17 | Boot | Migrations + backups + restore + relocation | CORE | KERNEL (machinery) / K1 (WorkspaceBackup product) | HIGH | `MigrationRunner` + `BackupManager` + `CompactionManager` + `LifecycleEngine` | Workspace presets/templates/backup are first-party | kernel + plugin:workspace | v1 | K0/K1 split | `src/storage/migration/`, `backup-manager.ts`, `compaction-manager.ts`, `lifecycle-engine.ts`, `prisma/system/schema.prisma` `WorkspaceBackup` | SPLIT |
| A18 | Boot | Air-gapped / offline mode guard | CORE | KERNEL | HIGH | `airgap.ts` | — | kernel | v1 | K0 | `src/engines/airgap.ts` | KEEP |

## Domain B — Data, Storage & Schema (20 → 12 KEEP, 3 SPLIT, 2 MERGE, 1 GENERIC, 0 REMOVE, 2 DEFER)

| ID | Domain | Product Capability | Cur | Rec | Conf | Kernel Mechanism | Plugin Contract | Owner | v | Tier | Evidence | Decision |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| B01 | Storage | Universal record (Node + Version + Alias + Edge) with ACL | CORE | KERNEL | HIGH | `INodeStoreContract` + `Node` model + `NodeVersion` + `NodeAlias` + `NodeEdge` | `IPluginContext.storage.scoped()` for plugin records | kernel | v1 | K0 | `src/schema/node.ts:207`, `prisma/system/schema.prisma` `Node*`, `src/storage/contracts/node-store.ts` | KEEP |
| B02 | Schema | Define a new NodeType with Zod validation | GENERIC | GENERIC | HIGH | `SchemaRegistry.register(type, schema, { caller: { pluginId } })` | `SchemaContribution` (PLUGIN-CONTRACTS P-08) | plugin (any) | v1 | K2 | `src/schema/node.ts:207` | KEEP |
| B03 | Schema | Isolated plugin data (cannot corrupt core) | GENERIC | GENERIC | HIGH | `IPluginScopedStore` enforces per-plugin namespace | `IPluginContext.storage.scoped()` | plugin (any) | v1 | K2 | KERNEL-CONTRACTS C-02, C-24; `PluginContext` not yet built (P0-1) | KEEP |
| B04 | Storage | Time-travel Node history (NodeVersion) | CORE | KERNEL | HIGH | `INodeStoreContract` | `IPluginContext.storage.scoped().get(id)` returns the current; versioning is kernel | kernel | v1 | K0 | `prisma/system/schema.prisma` `NodeVersion` | KEEP |
| B05 | Storage | Alias / canonicalize identities ("acme" → canonical entity) | CORE | KERNEL | HIGH | `NodeAlias` model | — | kernel | v1 | K0 | `prisma/system/schema.prisma` `NodeAlias` | KEEP |
| B06 | Storage | Link records with weighted relationships | CORE | KERNEL | HIGH | `NodeEdge` (with `.weight`) | — | kernel | v1 | K0 | `src/schema/node.ts` `EdgeSchema`; `NodeEdge` model | KEEP |
| B07 | UI | Primitives & slots (the universal UI vocabulary) | CORE | KERNEL | HIGH | `PrimitiveScope` + `Primitive` + `ProviderType` + `SlotBinding` | First-party UI plugins use these | kernel | v1 | K0 | `shared/conceptual-model.ts` `PrimitiveScope` | KEEP |
| B08 | Storage | Content units (split any record into indexable chunks) | CORE | KERNEL | HIGH | `ContentUnit` model + `ContentUnitStoreImpl` | — | kernel | v1 | K0 | `src/engines/content-unit-decomposer.ts`, `prisma/user/schema.prisma` `ContentUnit` | KEEP |
| B09 | Storage | Conversations list and ordering (storage shape) | CORE | KERNEL (shape) / K1 (engine) | HIGH | `Conversation` + `ConversationStore` contract | `IPluginContext.storage.scoped()` for the chat plugin | kernel + plugin:chat | v1 | K0/K1 split | `prisma/user/schema.prisma` `Conversation`, `src/storage/contracts/conversation-store.ts` | SPLIT |
| B10 | Storage | Messages + streams + attachments (storage shape) | CORE | KERNEL (shape) / K1 (engine) | HIGH | `ConversationMessage` + `MessageAttachment` + `StreamBlock` + `ParserExecutionLog` | — | kernel + plugin:chat | v1 | K0/K1 split | `prisma/user/schema.prisma` those models | SPLIT |
| B11 | Storage | Channels + collections + containers | CORE | K1 (`plugin:collections`) | HIGH | `Channel`+`Collection`+`CollectionItem`+`EntityContainer` | First-party collection plugin | plugin:collections | v1 | K1 | `prisma/user/schema.prisma` those models; `src/engines/collection-engine.ts` | MOVE |
| B12 | Storage | Contacts + identities | CORE | K1 (`plugin:contacts`) | HIGH | `Contact`+`ContactIdentity` | — | plugin:contacts | v1 | K1 | `prisma/user/schema.prisma` those models; `src/engines/contact-engine.ts` | MOVE |
| B13 | Storage | Entities + mentions (auto-extracted) | CORE | K1 (`plugin:knowledge`) | HIGH | `Entity`+`EntityMention` | — | plugin:knowledge | v1 | K1 | `prisma/user/schema.prisma` those models; `src/engines/entity-container-engine.ts` | MOVE |
| B14 | Storage | Notifications, sync state, media attachments | CORE | K1 (`plugin:notifications`/`plugin:sync`/`plugin:media`) | HIGH | `Notification`+`SyncState`+`MediaAttachment` | — | plugin:notifications etc. | v1 | K1 | `prisma/user/schema.prisma` those models | MOVE |
| B15 | DB | 200-table schema + migrations + seed truth | CORE | KERNEL (Prisma + SchemaMeta) / K1 (the 200 tables themselves) | HIGH | Prisma client + `SchemaMeta` + `verifySchemaCompat` + `MigrationRunner` | First-party plugins declare their own table sets | kernel | v1 | K0 | `prisma/schema.prisma` 200 models; `prisma/system/` 110; `prisma/user/` 90; `src/storage/db.ts`, `prisma.ts`, `verify-compat.ts` | SPLIT (kernel machinery vs first-party schema design) |
| B16 | Storage | Stream parser logic in DB (inline `LOGIC_CODE`) + sandboxed execution | CORE | KERNEL (loader + chain) / K1 (concrete parsers) | HIGH | `StreamParserEngine` (chain) + `SandboxRunner` (QuickJS) | Provider-specific parsers are first-party | kernel + plugin:providers-* | v1 | K0/K1 split | `src/engines/stream-parser.ts`, `sandbox-runner.ts:38-55` | SPLIT |
| B17 | Storage | Conversation history sync (import/export) | DEFAULT PLUGIN | K1 (`plugin:chat` includes import) | HIGH | The storage machinery; the import/export feature is first-party | — | plugin:chat | v1 | K1 | `src/engines/conversation-history-sync.ts`, `ImportJob` model | KEEP |
| B18 | Storage | Workspace presets + templates | DEFAULT PLUGIN | K1 (`plugin:workspace`) | HIGH | Storage machinery; UX is first-party | — | plugin:workspace | v1 | K1 | `src/engines/workspace-presets.ts`, `WorkspaceTemplateRow` | KEEP |
| B19 | Storage | Workspace backup (user-managed) | DEFAULT PLUGIN | K1 (`plugin:workspace`) | MEDIUM | `BackupManager` (kernel); the user-facing backup/restore UX is first-party | — | plugin:workspace | v1 | K1 | `BackupManager`; `WorkspaceBackup` model — **MERGE with B18** (single `plugin:workspace`) | MERGE |
| B20 | Storage | Storage contracts (engines depend on contract, never DB impl) | CORE | KERNEL | HIGH | `src/storage/contracts/*` (40+) | — | kernel | v1 | K0 | `src/storage/contracts/*` | KEEP |

## Domain C — Security, Trust & Isolation (14 → 6 KEEP, 3 SPLIT, 2 MOVE, 1 MERGE, 1 DEFER, 1 KEEP-as-DEFER)

| ID | Domain | Product Capability | Cur | Rec | Conf | Kernel Mechanism | Plugin Contract | Owner | v | Tier | Evidence | Decision |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| C01 | Sandbox | Plugin iframe (opaque origin, no `allow-same-origin`) | CORE | KERNEL (host) | HIGH | `frontend/src/components/canvas/SandboxedNode.tsx:268` `sandbox="allow-scripts"`; `frontend/.../SandboxedNode.tsx:268` | K3 components render here | kernel | v1 | K0 | `SandboxedNode.tsx:19-282` | KEEP |
| C02 | Sandbox | CSP for plugin frames | CORE | KERNEL | HIGH | `SandboxedNode.tsx:157` `<meta http-equiv="Content-Security-Policy">`; `SandboxPolicy.csp` field | `SandboxPolicy.csp` (PLUGIN-CONTRACTS P-12) | kernel | v1 | K0 | `SandboxedNode.tsx:73, 153, 157` | KEEP |
| C03 | Sandbox | `allowCapabilities` allow-list (host-side enforced) | CORE | KERNEL | HIGH | `SandboxedNode.tsx:103` host-side check + `capability_denied` audit | `SandboxPolicy.allowCapabilities` | kernel | v1 | K0 | `SandboxedNode.tsx:103, 116` | KEEP |
| C04 | Sandbox | Watchdog (`budgetMs`) | CORE | KERNEL | HIGH | `SandboxedNode.tsx:240` `setTimeout` + `budget_timeout` audit | `SandboxPolicy.budgetMs` | kernel | v1 | K0 | `SandboxedNode.tsx:240-250` | KEEP |
| C05 | Install | Verify plugin integrity (sha256 of archive) | CORE | KERNEL | HIGH | `IPluginManager.discover()` → `install()` | `PluginPackageIntegrity` (PLUGIN-CONTRACTS P-11) | kernel | v1 | K0 | `src/ai/plugins/plugin-manager-impl.ts:145-154` | KEEP |
| C06 | Install | Certify plugin (Zod + permission↔contributes + scriptUrl origin + namespace) | CORE | KERNEL | HIGH | `IPluginManager.certify()` — P-15 compliance suite | — | kernel | v1 | K0 | `src/ai/plugins/plugin-manager-impl.ts:96-140` (stub today) | KEEP |
| C07 | Install | Permission lattice (network, storage:scoped, schema:extend, ui:*, chrome:control) | CORE | KERNEL | HIGH | `IPolicyEnforcer.enforceNetwork/enforceToolInvocation`; `PluginContext.permissions` | `PluginPermission` (PLUGIN-CONTRACTS P-09) | kernel | v1 | K0 | `src/ai/policy/policy.ts:40-68`; KERNEL-CONTRACTS C-09 | KEEP |
| C08 | Storage | Scoped plugin storage (cannot read another plugin's) | GENERIC | KERNEL (primitive) / K2 (use) | HIGH | `IPluginScopedStore` (KERNEL-CONTRACTS C-02) | `IPluginContext.storage.scoped()` | kernel | v1 | K0 (primitive) / K2 (use) | KERNEL-CONTRACTS C-02 | KEEP |
| C09 | Policy | Consent gates (which actions require approval) | DEFAULT PLUGIN | K1 (`plugin:policy`) | MEDIUM | `IPolicyEnforcer` (kernel) is the *enforcer*; the consent *content* is product | — | plugin:policy | v1 | K1 | `src/engines/consent-engine.ts`; Constitution Rule D | MOVE |
| C10 | Policy | Policy + governance rules (who can do what) | DEFAULT PLUGIN | K1 (`plugin:policy` + `plugin:audit`) | HIGH | Same: enforcement is kernel, content is product | — | plugin:policy | v1 | K1 | `policy-engine.ts`, `governance-engine.ts`, `PolicyRule` model; Constitution Rule D | MOVE |
| C11 | Audit | Tamper-evident audit trail | CORE | KERNEL | HIGH | `KernelProvenance` + `RegistrationEvent` + `BindingStatusLog` + `EventRecord` | Plugins may not bypass | kernel | v1 | K0 | `audit-trail.ts`, `kernel-provenance.ts` | KEEP |
| C12 | Policy | Stealth / anti-detection modes | DEFAULT PLUGIN | K1 (`plugin:providers-browser`) | HIGH | The product owns stealth; the kernel only owns the runtime | — | plugin:providers-browser | v1 | K1 | `stealth/*` (19 files); `anti-detection.ts` | MOVE |
| C13 | Policy | Sync encryption and peer trust (multi-device) | CORE | K1 (`plugin:sync`) | MEDIUM | Sync is a VIVIM product feature; encryption is the kernel primitive (C-20) | — | plugin:sync | v1 | K1 | `sync.ts`, `sync-engine.ts`, `SyncPeer`+`SyncState` | MOVE |
| C14 | Policy | Budget engine (cost/latency ceilings) | DEFAULT PLUGIN | K1 (`plugin:cost`) | HIGH | `IResourceManager` is kernel; the *budget policy* is product | — | plugin:cost | v1 | K1 | `budget-engine.ts`, `cortex-budget.ts`; Constitution Rule D | MOVE |

## Domain D — Canvas, Workspace & UI Shell (22 → 0 KEEP, 16 MOVE-to-K1, 3 MERGE, 1 SPLIT, 0 REMOVE, 1 KEEP-as-DEFER, 1 KEEP-as-K3-host)

| ID | Domain | Product Capability | Cur | Rec | Conf | Kernel Mechanism | Plugin Contract | Owner | v | Tier | Evidence | Decision |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| D01 | UI | Infinite canvas (pan/zoom world) | DEFAULT PLUGIN | K1 (`plugin:ui-canvas`) | HIGH | Slot system + `Node` are kernel; the canvas surface is product | `UniversalComponentRegistry.register('canvas.living', ...)` | plugin:ui-canvas | v1 | K1 | `frontend/.../InfiniteCanvas.tsx`, `LivingCanvas.tsx`, `quad-tree.ts` | MOVE |
| D02 | UI | Canvas surface + layers (bg/content/overlays/connection lines) | DEFAULT PLUGIN | K1 (`plugin:ui-canvas`) | HIGH | Slot system is kernel | — | plugin:ui-canvas | v1 | K1 | `CanvasSurface.tsx`, `ConnectionLayer.tsx`, `ZLayerPanel.tsx`, `CanvasLayerMounter` | MOVE |
| D03 | UI | Draggable/resizable canvas node | DEFAULT PLUGIN | K1 (`plugin:ui-canvas`) | HIGH | `RegionRect` shape is kernel; the rendered node is product | — | plugin:ui-canvas | v1 | K1 | `CanvasNode.tsx`, `SlotNode.tsx` | MOVE |
| D04 | UI | Minimap, spatial index | DEFAULT PLUGIN | K1 (`plugin:ui-canvas`) | HIGH | `QuadTree` is a kernel utility (universal spatial index); the minimap *render* is product | — | plugin:ui-canvas | v1 | K1 | `CanvasMinimap.tsx`, `quad-tree.ts` | MOVE |
| D05 | UI | Dockable/resizable/themed panel system | DEFAULT PLUGIN | K1 (`plugin:ui-panels`) | HIGH | Slot system is kernel; the panel *system* is product | — | plugin:ui-panels | v1 | K1 | `PanelShell.tsx`, `PanelRegistry.ts`, `PanelSplit.tsx`, `TabBar.tsx`, `ZLayerPanel.tsx` | MOVE |
| D06 | UI | Drawer + slide panels | DEFAULT PLUGIN | K1 (`plugin:ui-shell`) | HIGH | Slot system is kernel; drawer is product | — | plugin:ui-shell | v1 | K1 | `DrawerSystem.tsx`, `SlidePanel.tsx` | MOVE |
| D07 | UI | UI slots + registry (every visible piece has a slot) | CORE | KERNEL | HIGH | `UiComponent` + `UniversalComponentRegistry` | K1/K2 plugins register entries | kernel | v1 | K0 | `shared/ui-component.ts:99`, `frontend/src/shared/universal-registry.ts:127` | KEEP (as **universal registry primitive**) |
| D08 | UI | User supplies html+css for a slot (sandboxed) | GENERIC | GENERIC | HIGH | `SandboxedNode` host | `UiGeneratedContribution` (PLUGIN-CONTRACTS P-05) | plugin (any) | v1 | K2 | `manifest.contributes.ui.generated[]` → `UiComponent` row | KEEP |
| D09 | UI | User supplies compiled React component | GENERIC | GENERIC (DEFERRED to v2) | HIGH | `UniversalComponentRegistry.register()` (K0 shape); v1 rejects at certify with review-gate error | — | plugin (any) | v2 | K2 | `frontend/src/shared/universal-registry.ts:127`; v1 P-06 reject | KEEP (as DEFERRED-v2) |
| D10 | UI | Theme (dark/light, accent, typography) | DEFAULT PLUGIN | K1 (`plugin:ui-shell`) | HIGH | — | — | plugin:ui-shell | v1 | K1 | `ThemeProvider.tsx`, `ThemeSettings.tsx` | MOVE |
| D11 | UI | Workspace switcher, presence avatars | DEFAULT PLUGIN | K1 (`plugin:workspace`) | HIGH | — | — | plugin:workspace | v1 | K1 | `WorkspaceSwitcher.tsx`, `PresenceIndicator.tsx` | MOVE |
| D12 | UI | Default layout per type (region per slot) | CORE | KERNEL (shape) / K1 (defaults) | HIGH | `ProviderType.regionLayout` is the kernel shape; the actual layout data is first-party | — | kernel + plugin:ui-canvas | v1 | K0/K1 split | `shared/conceptual-model.ts` `ProviderType.regionLayout` | SPLIT |
| D13 | UI | Panel palette + canvas palette (browse & place) | DEFAULT PLUGIN | K1 (`plugin:ui-canvas`) | HIGH | — | — | plugin:ui-canvas | v1 | K1 | `PanelPalette.tsx`, `CanvasPalette.tsx` | MOVE |
| D14 | UI | Cards (knowledge/canvas/list) | DEFAULT PLUGIN | K1 (`plugin:ui-cards`) | HIGH | — | — | plugin:ui-cards | v1 | K1 | `frontend/src/components/canvas/cards/*` | MOVE |
| D15 | UI | Search panel, canvas search, agent search | DEFAULT PLUGIN | K1 (`plugin:search`) | HIGH | The `search.ts` shape is kernel; the *panels* are product | — | plugin:search | v1 | K1 | `SearchPanel.tsx`, `CanvasSearch.tsx`, `search.ts` | MOVE |
| D16 | UI | Quick actions, command palette, notifications center | DEFAULT PLUGIN | K1 (`plugin:ui-shell`) | HIGH | — | — | plugin:ui-shell | v1 | K1 | `QuickActionsMenu.tsx`, `CommandPalette.tsx`, `NotificationsCenter.tsx` | MOVE |
| D17 | UI | Brand, main menu, mobile nav | DEFAULT PLUGIN | K1 (`plugin:ui-shell`) | HIGH | — | — | plugin:ui-shell | v1 | K1 | `Brand.tsx`, `MainMenu.tsx`, `MobileNav.tsx` | MOVE |
| D18 | UI | Empty states, errors, toasts, skeletons | DEFAULT PLUGIN | K1 (`plugin:ui-shell`) | HIGH | — | — | plugin:ui-shell | v1 | K1 | `EmptyState.tsx`, `ErrorBanner.tsx`, `Toast.tsx`, `Skeleton.tsx` | MOVE |
| D19 | UI | Builder surface (drag to connect capabilities) | DEFAULT PLUGIN | K1 (`plugin:ui-builder`) | HIGH | — | — | plugin:ui-builder | v1 | K1 | `builder/BuilderSurface.tsx` etc. | MOVE |
| D20 | UI | Provider setup wizard + status badges | DEFAULT PLUGIN | K1 (`plugin:providers-*` include) | HIGH | — | — | plugin:providers-* | v1 | K1 | `ProviderSetupWizard.tsx`, `ProviderStatusBadges.tsx` | MOVE |
| D21 | UI | Audit/RBAC/templates/mutation history panels | DEFAULT PLUGIN | K1 (`plugin:ui-panels`) | HIGH | — | — | plugin:ui-panels | v1 | K1 | `AuditDashboard.tsx`, `RbacManager.tsx`, `TemplatesGallery.tsx`, `MutationHistoryPanel.tsx` | MOVE |
| D22 | UI | Plugin tooling (scaffolding, hot reload) | GENERIC | K1 (`plugin:dev-tooling`) | HIGH | — | — | plugin:dev-tooling | v1 | K1 | `frontend/.../plugin-hot-reload.ts`, `frontend/plugins/sample-plugin/*` | MOVE |

## Domain E — Conversations, Providers & Messaging (26 → 2 KEEP, 12 MOVE, 4 SPLIT, 2 GENERIC, 0 MERGE, 1 KEEP-as-DEFER, 0 REMOVE, 5 KEEP-as-DEFER-via-plugin)

| ID | Domain | Product Capability | Cur | Rec | Conf | Kernel Mechanism | Plugin Contract | Owner | v | Tier | Evidence | Decision |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| E01 | Chat | Unified conversations inbox | DEFAULT PLUGIN | K1 (`plugin:chat`) | HIGH | Conversation + Message models are storage; the inbox is product | — | plugin:chat | v1 | K1 | `conversation-manager.ts`; `Conversation`+`Collection` | MOVE |
| E02 | Stream | Streamed replies (tokens live) | CORE | KERNEL (loader + sandbox) / K1 (concrete parsers) | HIGH | `StreamParserEngine` + `SandboxRunner` (QuickJS) | Provider-specific parsers are first-party | kernel + plugin:providers-* | v1 | K0/K1 split | `stream-parser.ts`, `sandbox-runner.ts:38-55` | SPLIT |
| E03 | Stream | Capture what providers actually returned | CORE | KERNEL (`StreamBlock` shape) / K1 (capture engine) | HIGH | `StreamBlock` is the universal shape; `live-capture-engine.ts` is product | — | kernel + plugin:chat | v1 | K0/K1 split | `live-capture-engine.ts`, `StreamBlock` model | SPLIT |
| E04 | Resil. | Handle sends that fail (retry or explain) | DEFAULT PLUGIN | K1 (`plugin:chat` includes resilience) | HIGH | `RetryEngine` (kernel), `IdempotencyGuard` (kernel), `LockManager` (kernel) are primitives; the *policy* is product | — | plugin:chat | v1 | K1 | `send-capability.ts`, `send-resilience.ts`, `retry-engine.ts`, `idempotency-guard.ts`, `lock-manager.ts` | KEEP (engine KEEP, behavior MOVE) |
| E05 | Chat | Typed composer + send button per provider | DEFAULT PLUGIN | K1 (`plugin:chat`) | HIGH | — | — | plugin:chat | v1 | K1 | `composer-typing.ts`, `provider-selectors.ts` | MOVE |
| E06 | Provider | Account/profile per provider (multiple logins) | CORE | KERNEL (shape) / K1 (profile management) | HIGH | `ProviderAccount` + `ProviderSession` + `ProfileSession` are storage; the `ProfileAllocator` and Chrome profile dir management are product | — | kernel + plugin:providers-browser | v1 | K0/K1 split | `ProviderAccount`+`ProviderSession`+`ProfileSession` models; `executor/profile-allocator.ts` | SPLIT |
| E07 | Provider | Register a provider (endpoints/parsers/caps/models/fleet) | CORE | KERNEL (registry) / K1 (first-party data) | HIGH | `IProviderRegistry.register()`; `ProviderRegistrar.register()`; `IProviderAdapter` | — | kernel + plugin:providers-api | v1 | K0/K1 split | `provider-registrar.ts:62`; `IProviderRegistry` in `registry.ts:33-58` | SPLIT |
| E08 | Provider | Add a new provider (api-protocol, mcp-*, browser-provider) | GENERIC | GENERIC | HIGH | `IProviderRegistry.register()` | `ProviderContribution` (PLUGIN-CONTRACTS P-07) | plugin (any) | v1 (api-protocol, mcp-*) / v2 (browser-provider) | K2 | `manifest.contributes.services[]`; `openai-compatible/manifest.ts:37-69` | KEEP |
| E09 | Provider | Discover provider internals automatically | DEFAULT PLUGIN | K1 (`plugin:providers-browser` for browser discovery; `plugin:providers-api` for API discovery) | HIGH | — | — | plugin:providers-* | v1 | K1 | `protocol-discovery.ts`, `provider-discovery.ts`, `cdp-discovery.ts`, `manifest-inference.ts` | MOVE |
| E10 | Provider | Heal broken browser selectors | DEFAULT PLUGIN | K1 (`plugin:providers-browser`) | HIGH | — | — | plugin:providers-browser | v1 | K1 | `selector-healer.ts`, `selector-refiner.ts`, `selector-cache.ts`, `selector-heal-store.ts` | MOVE |
| E11 | Provider | Govern real browsers (CDP) — launch, health, restart | DEFAULT PLUGIN | K1 (`plugin:providers-browser`) | HIGH | `IRuntimeSupervisor` is kernel (KERNEL-CONTRACTS C-11); `ChromeGovernor` is the VIVIM product impl | — | plugin:providers-browser | v1 | K1 | `chrome-governor.ts` (800 lines), `cdp-watchdog.ts`, `chrome-governor-resilience.ts` | MOVE |
| E12 | Provider | Human-like interaction (delays, retries, recovery) | DEFAULT PLUGIN | K1 (`plugin:providers-browser`) | HIGH | — | — | plugin:providers-browser | v1 | K1 | `humanized-interaction.ts`, `execution-policy.ts` | MOVE |
| E13 | Provider | Multi-provider routing (cost/latency) | DEFAULT PLUGIN | K1 (`plugin:providers-api`) | HIGH | `IRouter` (KERNEL-CONTRACTS C-08) is the contract; concrete routing strategies are first-party | — | plugin:providers-api | v1 | K1 | `provider-mux.ts`, `MuxSession`+`MuxResponseRow`+`RoutingPreference` | KEEP (engine KEEP, content MOVE) |
| E14 | Chat | Conversation organizer (threads/topics/imports) | DEFAULT PLUGIN | K1 (`plugin:chat`) | HIGH | — | — | plugin:chat | v1 | K1 | `conversation-organizer.ts` | MOVE |
| E15 | Chat | Cross-conversation synthesis | DEFAULT PLUGIN | K1 (`plugin:chat`) | HIGH | — | — | plugin:chat | v1 | K1 | `cross-conversation-synthesis.ts` | MOVE |
| E16 | Stream | Response analysis (protocol detection, formatting) | DEFAULT PLUGIN | K1 (`plugin:providers-api`) | HIGH | — | — | plugin:providers-api | v1 | K1 | `streaming-protocol.ts`, `streaming-response-analyzer.ts`, `format-classifier.ts` | MOVE |
| E17 | Provider | Model selection per provider (Opus vs Sonnet) | DEFAULT PLUGIN | K1 (`plugin:providers-api`) | HIGH | `IModelRegistry` (KERNEL-CONTRACTS C-07) | — | plugin:providers-api | v1 | K1 | `ProviderModel` rows, `ProviderCapabilityTaxonomy` | KEEP (engine KEEP, content MOVE) |
| E18 | Stream | Stream channel caps (typing, presence) | DEFAULT PLUGIN | K1 (`plugin:chat`) | HIGH | — | — | plugin:chat | v1 | K1 | `streaming-channel-caps.ts` | MOVE |
| E19 | Session | Session persistence + checkpointing | CORE | KERNEL (storage + state machine) / K1 (UX) | HIGH | `SessionCheckpoint`+`StateTransition`; the checkpoint engine is first-party | — | kernel + plugin:chat | v1 | K0/K1 split | `session-checkpoint.ts`, `SessionCheckpoint` model | SPLIT |
| E20 | Session | Session capabilities (checkout/fork/branch) | DEFAULT PLUGIN | K1 (`plugin:chat`) | HIGH | — | — | plugin:chat | v1 | K1 | `session-caps.ts` | MOVE |
| E21 | Provider | Discord integration (channels, voice states) | DEFAULT PLUGIN | K1 (P3.5 proof: `plugin:discord` exclusively via plugin path) | HIGH | — | `ProviderContribution` | plugin:discord | v1 | K1 | `seeds/providers/discord.json`, `DiscordVoiceState`+`DiscordMemberMeta` | KEEP-as-DEFERRED — migrate in P3.5 |
| E22 | Provider | Slack integration (threads, channel metadata) | DEFAULT PLUGIN | K1 (`plugin:slack`) | HIGH | — | `ProviderContribution` | plugin:slack | v1 | K1 | `seeds/providers/slack.json`, `SlackChannelMeta`+`SlackThreadMeta` | KEEP-as-DEFERRED — migrate in P3 |
| E23 | Provider | Notion integration (blocks, pages, databases) | DEFAULT PLUGIN | K1 (P3.5 proof: `plugin:notion` exclusively via plugin path) | HIGH | — | `ProviderContribution` | plugin:notion | v1 | K1 | `seeds/providers/notion.json`, `NotionBlockMeta`+`NotionPageMeta`+`NotionDatabaseMeta` | KEEP-as-DEFERRED — migrate in P3.5 |
| E24 | Provider | Anthropic/OpenAI/OpenRouter API providers | DEFAULT PLUGIN | K1 (`plugin:providers-api` ships these) | HIGH | — | `ProviderContribution` (api-protocol kind) | plugin:providers-api | v1 | K1 | `anthropic-api.json`+`openai-api.json`+`openrouter.json` | MOVE |
| E25 | Provider | WhatsApp + Reddit onramps | DEFAULT PLUGIN | K1 (`plugin:whatsapp`/`plugin:reddit`) | HIGH | — | `ProviderContribution` | plugin:* | v1 | K1 | `whatsapp.json`, `reddit.json`, `ProtocolFingerprint`, `DiscoveredDomEntity` | KEEP-as-DEFERRED — migrate in P3 |
| E26 | Capabilities | Built-in capability wrappers ("send" etc.) | CORE | KERNEL (the wrapper shape) / K1 (the `cap:conversation:send_message` etc. registrations) | HIGH | The wrapper primitive is universal; the registrations are first-party | — | kernel + plugin:chat | v1 | K0/K1 split | `builtin-capability-wrappers.ts`; `registerDefaultCapabilities` in `capability-bootstrap/default.ts` | SPLIT |

## Domain F — Memory, Knowledge & Intelligence (22 → 4 KEEP, 12 MOVE, 1 SPLIT, 2 GENERIC, 1 MERGE, 0 REMOVE, 0 DEFER)

| ID | Domain | Product Capability | Cur | Rec | Conf | Kernel Mechanism | Plugin Contract | Owner | v | Tier | Evidence | Decision |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| F01 | Memory | Memory (episodic + semantic + curated) with FSRS | DEFAULT PLUGIN | K1 (`plugin:memory`) | HIGH | `Node` + `NodeVersion` are kernel; the FSRS scheduler and the memory *shape* are first-party | — | plugin:memory | v1 | K1 | `memory-engine.ts`, `EpisodicMemory`+`SemanticMemory`+`MemoryCurated`, `fsrs-scheduler.ts` | MOVE |
| F02 | Memory | Embeddings + similarity search | DEFAULT PLUGIN | K1 (`plugin:memory` includes embeddings) | HIGH | `EmbeddingProvider` (kernel contract) | — | plugin:memory | v1 | K1 | `embedding-minilm.ts`+`embedding-ollama.ts`+`embedding-hf.ts`, `semantic-search.ts` | MOVE |
| F03 | Memory | Deep knowledge extraction (entity/decision/fact) | DEFAULT PLUGIN | K1 (`plugin:knowledge`) | HIGH | — | — | plugin:knowledge | v1 | K1 | `knowledge-extractor.ts`, `knowledge-extractor-continuous.ts`, `knowledge-index-pipeline.ts` | MOVE |
| F04 | Memory | Felt memory with embeddings | DEFAULT PLUGIN | K1 (`plugin:memory` includes this) | HIGH | — | — | plugin:memory | v1 | K1 | `knowledge-envelope.ts`, `PatternExtract`, `MemoryFeedback` | MOVE |
| F05 | Memory | Knowledge ingestion (batch import) | DEFAULT PLUGIN | K1 (`plugin:knowledge`) | HIGH | — | — | plugin:knowledge | v1 | K1 | `knowledge-ingestion.ts`, `ImportJob` | MOVE |
| F06 | Memory | Context assembly (DETECT→RECALL→RANK→BUDGET→INJECT) | CORE | KERNEL (pipeline) / K1 (policy) | HIGH | The 5-stage pipeline is a kernel mechanism; the priority weights + budget values are product | — | kernel + plugin:memory | v1 | K0/K1 split | `context-assembly.ts` | SPLIT |
| F07 | Memory | Situation detection (what user is trying to do) | DEFAULT PLUGIN | K1 (`plugin:memory` or `plugin:canon-nlcl`) | HIGH | — | — | plugin:memory | v1 | K1 | `situation-detector.ts` | MOVE |
| F08 | Memory | Reference grounding (cite claim source) | DEFAULT PLUGIN | K1 (`plugin:memory`) | HIGH | — | — | plugin:memory | v1 | K1 | `reference-grounding.ts`, `reflection-log.ts` | MOVE |
| F09 | Memory | Semantic grounding + search | DEFAULT PLUGIN | K1 (`plugin:memory`) | HIGH | — | — | plugin:memory | v1 | K1 | `semantic-grounding.ts`, `semantic-search.ts`, `embedding-classifier.ts`, `classifier-nli.ts` | MOVE |
| F10 | Memory | Belief store (what product believes, confidence) | DEFAULT PLUGIN | K1 (`plugin:memory`) — **MERGE with F01** | HIGH | — | — | plugin:memory | v1 | K1 | `belief-store.ts` | MERGE |
| F11 | Memory | FSRS scheduler | DEFAULT PLUGIN | K1 (`plugin:memory`) | HIGH | — | — | plugin:memory | v1 | K1 | `fsrs-scheduler.ts` | MOVE |
| F12 | Memory | Export memories | DEFAULT PLUGIN | K1 (`plugin:memory`) | HIGH | — | — | plugin:memory | v1 | K1 | `memory-export.ts` | MOVE |
| F13 | Memory | Mirror engine (live mirror of external state) | DEFAULT PLUGIN | K1 (`plugin:knowledge` or new) | HIGH | — | — | plugin:knowledge | v1 | K1 | `mirror-engine.ts`, `MirrorState`+`MirrorSnapshot`+`OptimisticUpdate`, `ObservationEvent` | MOVE |
| F14 | Cost | Cost optimizer (tokens vs latency) | DEFAULT PLUGIN | K1 (`plugin:cost`) | HIGH | `IResourceManager` is kernel; the *cost policy* is product | — | plugin:cost | v1 | K1 | `cost-optimizer.ts`, `cortex-budget.ts`, `ProviderCostLog`+`ProviderLatencyLog` | MOVE |
| F15 | Comm | Contact + notification engines | DEFAULT PLUGIN | K1 (`plugin:contacts`, `plugin:notifications`) | HIGH | — | — | plugin:* | v1 | K1 | `contact-engine.ts`, `notification-engine.ts`, `Notification`, `AlertCondition`+`AlertEvent` | MOVE |
| F16 | Memory | Add a new long-lived knowledge source | GENERIC | GENERIC | HIGH | `SchemaRegistry.register(..., { caller: { pluginId } })` | `SchemaContribution` | plugin (any) | v1 | K2 | `manifest.contributes.schema[]` | KEEP |
| F17 | Audit | Agent decisions log (every autonomous step recorded) | CORE | KERNEL (provenance) / K1 (decision log shape) | HIGH | `KernelProvenance` is kernel; the `AgentDecisionLog` model is a first-party audit view of it | — | kernel + plugin:agents | v1 | K0 shape / K1 data | `AgentDecisionLog` model, `decision-store.ts`; `KernelProvenance` | KEEP (the *shape* is kernel; the *content* is first-party data) |
| F18 | Memory | Decision records, topics, projects, pattern extracts | DEFAULT PLUGIN | K1 (`plugin:knowledge`) | HIGH | — | — | plugin:knowledge | v1 | K1 | `DecisionRecord`, `Topic`+`ConversationTopic`, `Project`, `PatternExtract` | MOVE |
| F19 | Trust | Trust scoring (reliable fact/source) | DEFAULT PLUGIN | K1 (`plugin:knowledge`) | HIGH | — | — | plugin:knowledge | v1 | K1 | `trust-score.ts` | MOVE |
| F20 | Strategy | Objective engine (current goals) | DEFAULT PLUGIN | K1 (`plugin:agents`) | HIGH | — | — | plugin:agents | v1 | K1 | `objective-engine.ts` | MOVE |
| F21 | Memory | Classifier NLI + format/content classification | DEFAULT PLUGIN | K1 (`plugin:knowledge`) | HIGH | — | — | plugin:knowledge | v1 | K1 | `classifier-nli.ts`, `format-classifier.ts`, `content-item-engine.ts` | MOVE |
| F22 | Memory | Add a new intelligence processor (a new classifier) | GENERIC | GENERIC (v2 deferred) | HIGH | Future `manifest.contributes.features[]` → `feature-registry.ts` | — | plugin (any) | v2 | K2 | v1 rejects at certify | KEEP |

## Domain G — Automation, Workflow, Harness & Tools (20 → 4 KEEP, 9 MOVE, 1 SPLIT, 4 GENERIC, 1 MERGE, 0 REMOVE, 1 DEFER)

| ID | Domain | Product Capability | Cur | Rec | Conf | Kernel Mechanism | Plugin Contract | Owner | v | Tier | Evidence | Decision |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| G01 | Auto | Workflow engine (multi-step DAGs) | DEFAULT PLUGIN | K1 (`plugin:workflows`) | HIGH | — | — | plugin:workflows | v1 | K1 | `workflow-engine.ts`, `WorkflowDefinition`+`WorkflowNode`+`WorkflowEdge`+`WorkflowExecution`+`WorkflowNodeExecution` | MOVE |
| G02 | Auto | Workflow credentials + webhooks | DEFAULT PLUGIN | K1 (`plugin:workflows`) | HIGH | `EncryptionEngine` is kernel; credential *handling* is first-party | — | plugin:workflows | v1 | K1 | `WorkflowCredential`, `WorkflowWebhook` | MOVE |
| G03 | Auto | Automation schedules + runs | DEFAULT PLUGIN | K1 (`plugin:workflows`) | HIGH | — | — | plugin:workflows | v1 | K1 | `AutomationSchedule`+`AutomationRun`, `automation-store.ts` | MOVE |
| G04 | Agents | Agent loop (product drives itself through a goal) | DEFAULT PLUGIN | K1 (`plugin:agents`) | HIGH | — | — | plugin:agents | v1 | K1 | `agentic-loop.ts`, `agent-loop-store.ts`, `AgentLoopRun`+`AgentStep` | MOVE |
| G05 | Agents | Autonomous replay/planner/execution with HITL gates | DEFAULT PLUGIN | K1 (`plugin:agents`) | HIGH | — | — | plugin:agents | v1 | K1 | `autonomous-planner.ts`+`autonomous-execution.ts`+`autonomous-replay.ts`, `AutonomousTask`+`HitlGate`+`TaskTemplate` | MOVE |
| G06 | Tools | MCP servers + clients (external tools as capabilities) | DEFAULT PLUGIN | K1 (`plugin:tools-mcp`) | HIGH | `IProviderRegistry.register()` is the kernel primitive; MCP is one adapter | — | plugin:tools-mcp | v1 | K1 | `mcp-server-adapter.ts`+`mcp-client-adapter.ts`, `McpServerConfig`+`McpTool`+`McpToolCall` | MOVE |
| G07 | Tools | Add a new external tool (MCP server) | GENERIC | GENERIC | HIGH | `IProviderRegistry.register()` | `ProviderContribution` `kind:'mcp-server'` (PLUGIN-CONTRACTS P-07) | plugin (any) | v1 | K2 | `manifest.contributes.services[]` | KEEP |
| G08 | Harness | Harness runtime (DAG execution) | CORE | KERNEL (DAG execution contract) / K1 (recipes) | HIGH | The runtime primitive is universal; the *recipes* are first-party | — | kernel + plugin:canon-harness | v1 | K0 shape / K1 content | `harness-runtime.ts`+`harness-protocol-engine.ts`, `HarnessCheckpoint` | SPLIT |
| G09 | Harness | Harness commands registry (catalog) | CORE | KERNEL (registry) / K1 (seeded commands) | HIGH | `HarnessCommandRegistry` is the registry shape; the 100+ seeded commands are first-party recipes | — | kernel + plugin:canon-harness | v1 | K0 shape / K1 content | `harness-command-registry.ts:54`, `HarnessCommand` model | SPLIT (already partially done — registry K0, content K1) |
| G10 | Harness | Add a new reusable browser recipe (Harness command) | GENERIC | GENERIC (v2 deferred) | HIGH | Future `manifest.contributes.harness.commands[]` | — | plugin (any) | v2 | K2 | v1 rejects at certify | KEEP (DEFERRED-v2) |
| G11 | Harness | Harness repair (recipe break → propose fix) | DEFAULT PLUGIN | K1 (`plugin:canon-harness`) | HIGH | — | — | plugin:canon-harness | v1 | K1 | `harness-repair-engine.ts`+`harness-feedback-coordinator.ts`+`harness-checkpoint.ts`, `RepairSession`+`WorkflowRetryQueue` | MOVE |
| G12 | Safety | Safe expressions / safe eval | CORE | KERNEL | HIGH | `safe-expression.ts` is the AST allowlist; `safe-eval.ts` is the current denylist (HAZARD H9) | — | kernel | v1 | K0 | `safe-expression.ts`, `safe-eval.ts` ("Hazard H9 - denylist is fundamentally incomplete (fail-open). Proper fix is allowlist via safe-expression.ts + quickjs-only sandbox") | KEEP (with explicit H9 fix in P0-3) |
| G13 | Tools | Tool orchestration facade | DEFAULT PLUGIN | K1 (`plugin:tools`) | HIGH | — | — | plugin:tools | v1 | K1 | `tool-orchestrator-facade.ts`, `tool-use-protocol.ts` | MOVE |
| G14 | Tools | Add a native-coded capability (handler at startup) | GENERIC | GENERIC (v2 deferred) | HIGH | Future `manifest.contributes.features[]` → `ModuleRegistry` inside `capabilities` phase (D6) | — | plugin (any) | v2 | K2 | v1 rejects at certify | KEEP (DEFERRED-v2) |
| G15 | Caps | Live capability registry | CORE | KERNEL | HIGH | `UnifiedCapabilityRegistry` (the Map<slug, capability> shape) is universal | — | kernel | v1 | K0 | `unified-registry.ts:31` | KEEP |
| G16 | Tools | Image generation bridge | DEFAULT PLUGIN | K1 (`plugin:tools-image`) | HIGH | — | — | plugin:tools-image | v1 | K1 | `image-gen-bridge.ts` | MOVE |
| G17 | Learn | Routing/rule/transfer learning | DEFAULT PLUGIN | K1 (`plugin:routing-learning`) | HIGH | — | — | plugin:routing-learning | v1 | K1 | `router-capability-bridge.ts`, `Rule`, `TransferAccelerator`+`TransferPattern`+`LearningEvent` | MOVE |
| G18 | Routing | Route specs, requests, targets, events | CORE | KERNEL (shape) / K1 (concrete routes) | HIGH | `RouteSpec`+`RouteRequest`+`RouteTarget`+`RouteEvent` are the universal shape; concrete routes are first-party | — | kernel + plugin:routing | v1 | K0 shape / K1 content | `RouteSpec`+`RouteRequest`+`RouteTarget`+`RouteEvent` models, `router-store.ts` | SPLIT (already partially — split the storage contract from the engine) |
| G19 | Memory | Situation-aware context budgeting for workflows | CORE | K1 (`plugin:workflows`) | HIGH | Same engine as F06 | — | plugin:workflows | v1 | K1 | `ContextBudgetConfig` | MERGE (with F06) |
| G20 | Tooling | Build plugin from NL (no code) | GENERIC | K1 (`plugin:dev-tooling`) | HIGH | — | — | plugin:dev-tooling | v1 | K1 | `server/plugin-builder-router.ts` | MOVE |

## Domain H — Health, Observability & Operations (16 → 6 KEEP, 7 MOVE, 2 SPLIT, 1 KEEP-as-DEFERRED)

| ID | Domain | Product Capability | Cur | Rec | Conf | Kernel Mechanism | Plugin Contract | Owner | v | Tier | Evidence | Decision |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| H01 | Health | Heartbeat (record + assess health every tick) | CORE | KERNEL | HIGH | `ProviderHealth`+`HealthTick`+`HealthStore` | — | kernel | v1 | K0 | `ProviderHealth`+`HealthTick` models; `health-store.ts`+`health-digest-store.ts`; `ProviderHealthKernel` | KEEP (the *kernel* is the primitive; the *view* in HealthDashboard is K1) |
| H02 | Health | Show health of each provider + overall system | DEFAULT PLUGIN | K1 (`plugin:ui-panels`) | HIGH | The aggregation mechanism is kernel; the *panel* is product | — | plugin:ui-panels | v1 | K1 | `health-digest.ts`, `HealthDigest` model, `HealthDashboard.tsx` | MOVE |
| H03 | Health | Provider health history (timeline) | CORE | KERNEL | HIGH | `ProviderHealthHistory` | — | kernel | v1 | K0 | `ProviderHealthHistory` model | KEEP |
| H04 | Telemetry | Telemetry aggregates (latency/success/selector) | CORE | KERNEL (reprogrammable pipeline) | HIGH | The `TelemetryAggregator` with runtime-swap pipelines is the kernel primitive | — | kernel | v1 | K0 | `telemetry-aggregator.ts`, `CapabilityTelemetry`+`TelemetryCycleLog`+`TelemetrySummaryDaily` | KEEP |
| H05 | Health | Selector health over time (hit vs miss) | CORE | KERNEL (shape) / K1 (browser-automation data) | HIGH | `SelectorHealthHistory` is a kernel health table; the *writer* is `plugin:providers-browser` | — | kernel + plugin:providers-browser | v1 | K0 shape / K1 writer | `SelectorHealthHistory` model | SPLIT |
| H06 | Fleet | Fleet events + circuit breakers | CORE | KERNEL | HIGH | `FleetEvent`+`CircuitBreakerState`+`fleet-supervisor` contract | — | kernel | v1 | K0 | `FleetEvent`+`CircuitBreakerState` models; `fleet-supervisor.ts` contract | KEEP |
| H07 | Errors | Error tracker (collect, deduplicate, surface) | CORE | KERNEL | HIGH | `error-tracker.ts`+`ErrorTracker` | — | kernel | v1 | K0 | `error-tracker.ts` | KEEP |
| H08 | Drift | Drift detection (provider UI/API diverges) | DEFAULT PLUGIN | K1 (`plugin:providers-browser`) | HIGH | `DriftEvent`+`ManifestDrift` are kernel health tables; the *detection* is product | — | plugin:providers-browser | v1 | K1 | `DriftEvent`+`ManifestDrift` models; `registration-auditor.ts` | MOVE (the *data* stays kernel; the *engine* moves to K1) |
| H09 | Drift | Manual drift detection (record-only) | CORE | KERNEL | HIGH | `ManifestChangeLog` is the kernel record; writes happen on every provider update | — | kernel | v1 | K0 | `ManifestChangeLog` model | KEEP |
| H10 | Telemetry | Latency measurements per attempt | CORE | KERNEL | HIGH | `LatencyMeasurement` | — | kernel | v1 | K0 | `LatencyMeasurement` model | KEEP |
| H11 | Audit | Registration auditor | DEFAULT PLUGIN | K1 (`plugin:providers-browser` — **MERGE with H08**) | HIGH | — | — | plugin:providers-browser | v1 | K1 | `registration-auditor.ts` | MERGE |
| H12 | Observability | Diagnostics oracle (query live topology/events/spans) | CORE | KERNEL (oracle queries) / K1 (the oracle's *panels*) | HIGH | The `Oracle*` engines and the `KernelTopology`+`KernelEvent`+`KernelSpan` tables are kernel | — | kernel | v1 | K0 | `src/engines/kernel/oracle-*.ts`+`diagnostics/*`; `KernelSpan`+`KernelProvenance`+`KernelTopology`+`KernelEvent` models | SPLIT |
| H13 | Audit | Binding/program state change log with trigger | CORE | KERNEL | HIGH | `BindingEvent`+`BindingStatusLog`+`ProgramVersionMetric` | — | kernel | v1 | K0 | those models | KEEP |
| H14 | Outcomes | Outcome tracker (capability achieved what it promised?) | DEFAULT PLUGIN | K1 (`plugin:outcomes`) | HIGH | — | — | plugin:outcomes | v1 | K1 | `outcome-tracker.ts`, `Outcome` model | MOVE |
| H15 | SLA | SLA monitor | DEFAULT PLUGIN | K1 (`plugin:sla`) | HIGH | — | — | plugin:sla | v1 | K1 | `sla-monitor.ts` | MOVE |
| H16 | Metrics | Metrics endpoint + aggregations | CORE | KERNEL (Prometheus-style scrape) | HIGH | `metrics.ts` | — | kernel | v1 | K0 | `metrics.ts` | KEEP |

## Domain I — Policy, Identity, Billing & Admin (14 → 4 KEEP, 4 MOVE, 1 SPLIT, 0 MERGE, 0 REMOVE, 1 KEEP-as-DEFERRED)

| ID | Domain | Product Capability | Cur | Rec | Conf | Kernel Mechanism | Plugin Contract | Owner | v | Tier | Evidence | Decision |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| I01 | Auth | Users, onboarding, RBAC | DEFAULT PLUGIN | KERNEL (User identity primitive) / K1 (RBAC + onboarding UX) | HIGH | `User`+`UserOnboarding`+`UserPreference` are kernel identity; `rbac-engine.ts` and `RbacManager.tsx` are first-party | — | kernel + plugin:identity | v1 | K0 shape / K1 content | `User`+`UserOnboarding`+`UserPreference` models; `rbac-engine.ts`; `RbacManager.tsx` | SPLIT |
| I02 | Cost | Costs, pricing, billing per provider | CORE | KERNEL (`ProviderCostLog`+`CostStore` tables) / K1 (`cost-optimizer.ts`) | HIGH | The cost log is a kernel observability table; the *optimizer* is product | — | kernel + plugin:cost | v1 | K0/K1 split | `ProviderCostLog`, `CostStore` tables, `cost-optimizer.ts` | SPLIT |
| I03 | Alerts | Alerting — conditions and alert events | DEFAULT PLUGIN | K1 (`plugin:notifications`) | HIGH | — | — | plugin:notifications | v1 | K1 | `AlertCondition`+`AlertEvent` models, `alert-store.ts` | MOVE |
| I04 | Sync | Sync peers + sync logs (multi-device) | DEFAULT PLUGIN | K1 (`plugin:sync`) | HIGH | — | — | plugin:sync | v1 | K1 | `SyncPeer`+`SyncLog`, `sync-engine.ts`+`sync.ts` | MOVE |
| I05 | Stealth | Stealth policies (per-module/launch profiles) | DEFAULT PLUGIN | K1 (`plugin:providers-browser`) | HIGH | — | — | plugin:providers-browser | v1 | K1 | `StealthPolicy`+`StealthModuleProfile`+`StealthLaunchProfile` | MOVE |
| I06 | Audit | Sandbox audits (every isolated execution) | CORE | KERNEL | HIGH | `SandboxAudit` model + `sandbox-audit-store.ts` | — | kernel | v1 | K0 | `SandboxAudit` model, `sandbox-audit-store.ts` | KEEP |
| I07 | Harness | HPE sessions (advanced session harness) | CORE | KERNEL (session primitive) / K1 (`plugin:canon-harness` consumer) | HIGH | The session primitive is kernel; HPE-specific code is first-party | — | kernel + plugin:canon-harness | v1 | K0 shape / K1 content | `HpeSession` model, `hpe-session-store.ts` | KEEP |
| I08 | Discovery | Protocol inference, fingerprints, parser candidates | DEFAULT PLUGIN | K1 (`plugin:providers-*`) | HIGH | — | — | plugin:providers-* | v1 | K1 | `ProtocolFingerprint`+`ParserCandidate`+`ParserTestResult`, `protocol-loop-parser.ts` | MOVE |
| I09 | Discovery | Taxonomies for surfaces, web apps, discovery sessions | DEFAULT PLUGIN | K1 (`plugin:discovery`) | HIGH | — | — | plugin:discovery | v1 | K1 | `WebAppTaxonomy`+`ProviderArchetype`+`ProviderShapeBinding`+`DiscoverySession`+`DiscoveryResult` | MOVE |
| I10 | Caps | Capability shapes + shape bindings (vocab primitive) | CORE | KERNEL (`CapabilityShape`+`CapabilityShapeBinding` types) / K1 (`plugin:chat`+`plugin:providers-*` register concrete shapes) | HIGH | The shape vocabulary is kernel; the *content* is first-party | — | kernel + plugin:chat | v1 | K0 shape / K1 content | `CapabilityShape`+`CapabilityShapeBinding`+`ProviderShapeBinding`+`capability-shape-registry.ts` | KEEP (the types are kernel; the registry is product) |
| I11 | Caps | Capability bindings + program versions + events | CORE | KERNEL (the binding shape) | HIGH | `CapabilityBinding`+`CapabilityProgram`+`ProviderOverride`+`BindingEvent` | — | kernel | v1 | K0 | those models | KEEP |
| I12 | Agents | Inbox, agent definitions, permissions, file edits | DEFAULT PLUGIN | K1 (`plugin:agents`) | HIGH | — | — | plugin:agents | v1 | K1 | `RunInbox`+`AgentDefinition`+`AgentPermissionDecision`+`AgentFileEdit`+`AgentSession`+`AgentBuilderRun` | MOVE |
| I13 | Surf | Surfaces versioning (snapshot of UI/route state) | CORE | KERNEL (versioning) | HIGH | `SurfaceVersion` model | — | kernel | v1 | K0 | `SurfaceVersion` model | KEEP |
| I14 | Admin | Governance/lifecycle/sla/trust/stealth engines | DEFAULT PLUGIN | K1 (`plugin:policy`/`plugin:workspace`/etc.) | HIGH | — | — | plugin:* | v1 | K1 | `governance-engine.ts`, `lifecycle-engine.ts`, `sla-monitor.ts`, `trust-score.ts`, `stealth-*` | MOVE |

## Domain J — Generic Plugin Surface & Tooling (22 → 2 KEEP, 2 MOVE, 0 SPLIT, 18 GENERIC, 0 MERGE, 0 REMOVE, 0 DEFER)

| ID | Domain | Product Capability | Cur | Rec | Conf | Kernel Mechanism | Plugin Contract | Owner | v | Tier | Evidence | Decision |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| J01 | Plugins | Write a manifest (id, version, permissions, contributions) | GENERIC | GENERIC | HIGH | `IPluginManager` + `PluginManifestSchema` (KERNEL-CONTRACTS C-01; PLUGIN-CONTRACTS P-01) | `PluginManifest` | plugin (any) | v1 | K2 | `src/plugin-kernel/manifest.ts` (proposed); see PLUGIN-CONTRACTS P-01 | KEEP |
| J02 | Plugins | Declare permissions; certify checks | GENERIC | KERNEL (enforcement) | HIGH | `IPolicyEnforcer` + certifier (PLUGIN-CONTRACTS P-15) | — | kernel | v1 | K0 | KERNEL-CONTRACTS C-07; PLUGIN-CONTRACTS P-15 | KEEP |
| J03 | Plugins | Install / enable / disable / uninstall (atomic) | GENERIC | KERNEL | HIGH | `IPluginManager.{install,uninstall,enable,disable}` (KERNEL-CONTRACTS C-01) | `PluginManager` enforces staging | kernel | v1 | K0 | `src/ai/plugins/manager.ts:27-45`; `src/server/plugin-router.ts:100-431` (real today, unifying) | KEEP |
| J04 | Plugins | Hot reload while developing | GENERIC | K1 (`plugin:dev-tooling`) | HIGH | — | — | plugin:dev-tooling | v1 | K1 | `plugin-hot-reload.ts` | MOVE |
| J05 | Plugins | Package + verify (tar.gz + sha256) | GENERIC | KERNEL | HIGH | `IPluginManager.discover()` with `computeFileHash` (PLUGIN-CONTRACTS P-11) | — | kernel | v1 | K0 | `plugin-manager-impl.ts:145-154`; `plugin-router.ts:20` | KEEP |
| J06 | Plugins | Declare a schema entry (new NodeType) | GENERIC | GENERIC | HIGH | `SchemaRegistry.register(..., { caller: { pluginId } })` (KERNEL-CONTRACTS C-15) | `SchemaContribution` (PLUGIN-CONTRACTS P-08) | plugin (any) | v1 | K2 | `manifest.contributes.schema[]` | KEEP |
| J07 | Plugins | Supply html+css for a slot (sandboxed) | GENERIC | GENERIC | HIGH | `SandboxedNode` host | `UiGeneratedContribution` (PLUGIN-CONTRACTS P-05) | plugin (any) | v1 | K2 | `manifest.contributes.ui.generated[]` | KEEP |
| J08 | Plugins | Supply a `scriptUrl` for a slot | GENERIC | GENERIC (with `ui:custom-scripturl` permission) | HIGH | Origin allow-list + `ui:custom-scripturl` gate | `UiGeneratedContribution.scriptUrl` | plugin (any) | v1 | K2 | Same as J07; permission gate | KEEP |
| J09 | Plugins | Supply a compiled React component | GENERIC | GENERIC (v2 deferred) | HIGH | `UniversalComponentRegistry.register()`; v1 rejects | — | plugin (any) | v2 | K2 | v1 P-06 reject | KEEP (DEFERRED-v2) |
| J10 | Plugins | Add an API provider adapter | GENERIC | GENERIC | HIGH | `IProviderRegistry.register()` | `ProviderContribution` (PLUGIN-CONTRACTS P-07) | plugin (any) | v1 | K2 | `manifest.contributes.services[]` `kind:'api-protocol'` | KEEP |
| J11 | Plugins | Add an MCP server (or client) | GENERIC | GENERIC | HIGH | `IProviderRegistry.register()` | `ProviderContribution` `kind:'mcp-server'\|'mcp-client'` | plugin (any) | v1 | K2 | same | KEEP |
| J12 | Plugins | Add a browser-driven provider | GENERIC | GENERIC (v2 deferred) | HIGH | `IProviderRegistry.register()` + `chrome:control` gate | — | plugin (any) | v2 | K2 | v1 rejects at certify | KEEP (DEFERRED-v2) |
| J13 | Plugins | Add a reusable browser recipe (Harness command) | GENERIC | GENERIC (v2 deferred) | HIGH | Future `HarnessCommandRegistry.register()` with `${pluginId}.` prefix | — | plugin (any) | v2 | K2 | v1 rejects | KEEP (DEFERRED-v2) |
| J14 | Plugins | Add a native-coded capability (handler at startup) | GENERIC | GENERIC (v2 deferred) | HIGH | Future `ModuleRegistry.define()` inside `capabilities` phase | — | plugin (any) | v2 | K2 | v1 rejects | KEEP (DEFERRED-v2) |
| J15 | Plugins | React to events | GENERIC | GENERIC | HIGH | `IPluginContext.events.{on,once,onAny,publish,publishAndWait}` (PLUGIN-CONTRACTS P-13) | — | plugin (any) | v1 | K2 | KERNEL-CONTRACTS C-03 | KEEP |
| J16 | Plugins | Store data scoped to your plugin | GENERIC | GENERIC | HIGH | `IPluginContext.storage.scoped()` (KERNEL-CONTRACTS C-02, C-24) | `IPluginScopedStore` | plugin (any) | v1 | K2 | KERNEL-CONTRACTS C-02 | KEEP |
| J17 | Plugins | Declare activation events | GENERIC | GENERIC | HIGH | `manifest.activationEvents` (PLUGIN-CONTRACTS P-01) | — | plugin (any) | v1 | K2 (only `onStartup` acted on in v1) | `manifest.activationEvents` | KEEP |
| J18 | Plugins | Validate manifest with actionable errors | GENERIC | KERNEL | HIGH | `PluginManifestSchema` strict + `IPluginManager.certify()` | — | kernel | v1 | K0 | PLUGIN-CONTRACTS P-01; P-15 | KEEP |
| J19 | Plugins | Namespace protection (cannot shadow another plugin's) | GENERIC | KERNEL | HIGH | Inside each registry (`plugin:${id}.` for schema, `${pluginId}.` for harness) | — | kernel | v1 | K0 | KERNEL-CONTRACTS C-15; PLUGIN-CONTRACTS P-10 | KEEP |
| J20 | Plugins | Observability — every plugin's actions are visible | GENERIC | KERNEL | HIGH | `KernelRegistry.registerEngine()` per plugin; `KernelProvenance`; bus emit on lifecycle | — | kernel | v1 | K0 | `src/engines/kernel/kernel-registry.ts:15` | KEEP |
| J21 | Plugins | Scaffold a plugin from NL | GENERIC | K1 (`plugin:dev-tooling`) | HIGH | — | — | plugin:dev-tooling | v1 | K1 | `server/plugin-builder-router.ts` | MOVE |
| J22 | Plugins | Lint + typecheck before publishing | GENERIC | K1 (`plugin:dev-tooling`) | HIGH | — | — | plugin:dev-tooling | v1 | K1 | Future `plugin lint` CLI | MOVE |

---

## Counts and ratios (mechanical, not asserted)

| Outcome | Count |
|---|---|
| KEEP (item is at the correct layer, no change) | 59 |
| MOVE (reclassify — engine is currently at a different layer than truth) | 80 |
| SPLIT (item is currently two things conflated; one half moves, the other stays) | 11 |
| MERGE (two items are one item; combine) | 4 |
| GENERIC (the item is the plugin extension surface — already correct) | 38 |
| DEFER (item is real but blocked on v2 — v1 certifier rejects) | 2 |
| REMOVE (item is dead code, never used) | 0 |
| **Total** | **194** |

**Layer totals after the reclassification** (computed from Recommended column):

| Layer | Count |
|---|---|
| KERNEL (K0) | 71 |
| K1 (first-party plugin) | 76 |
| GENERIC (K2) | 38 |
| SANDBOXED (K3) | 1 (the iframe host, not an item) |
| DEFERRED (K2/v2) | 8 |

The prior proposal claimed 75 CORE / 84 DEFAULT PLUGIN / 35 GENERIC. The forensic count is **71 K0 / 76 K1 / 38 K2 / 8 K2-deferred / 1 K3-host**. The 71-vs-75 is a small net shift; the bigger shift is **the way the layer is enforced** (Constitution rules) and **the introduction of "split" as the default outcome for items that mixed mechanism + content** (11 of 194 rows are explicitly split, accounting for ~30 underlying subsystems that today conflate kernel and product).

The verdict and the per-row diff against the proposal are in `AT-FORENSIC-VERDICT.md`.
