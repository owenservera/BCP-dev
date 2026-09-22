# Generated — zod schemas (38)

> Machine-generated from `src/schema/*.ts`. Export = first 12 `^export` names per file. Validators enforced at ingress by `server/validate.ts` + `mcp/zod-schema.ts`.

| file | exports | names |
|------|---------|-------|
| `src/schema/agentic.ts` | 12 | `ActorRefSchema ActorRef AGENTIC_EDGE AgentReputationSchema AgentReputation AgentDataSchema AgentData RoleDataSchema RoleData GovernanceRoleBindingSchema GovernanceRoleBinding GovernancePolicyDataSchema` |
| `src/schema/api-types.ts` | 12 | `ApiResponse ApiSuccessResponse ApiErrorResponse CapabilityDetail CapabilityExecuteResponse CapabilityListResponse InterpretBody InterpretSuccessResponse InterpretConfirmationResponse InterpretClarificationResponse InterpretErrorResponse InterpretResponse` |
| `src/schema/api-validators.ts` | 12 | `IdParam OptionalString MetadataRecord AutonomousGoalSchema AutonomousExecuteSchema GateResolveSchema ReplaySchema AgentCanvasCommandSchema AgentCanvasPolicySchema AgentCanvasPlanSchema KnowledgeIngestSchema KnowledgeSynthesizeSchema` |
| `src/schema/automation.ts` | 6 | `AlertSeverity AlertCondition AlertEvent AutomationSchedule AutomationRun DiscoveryObjective` |
| `src/schema/chrome.ts` | 6 | `SlaveStatus SuperState LaunchOptions ChromeSlave CDPCommand CDPResult` |
| `src/schema/command-description.ts` | 2 | `CommandDescriptionSchema CommandDescriptionInput` |
| `src/schema/conceptual-model.ts` | 12 | `RegionRectSchema ComponentConstraintsSchema SandboxPolicySchema PrimitiveScopeSchema ComponentContractSchema ComponentArchetypeSchema UiComponentInputSchema LayoutUpdateSchema SlotCatalogEntrySchema SlotCatalogSchema ViewPresetLayoutEntrySchema ViewPresetSchema` |
| `src/schema/config.ts` | 3 | `ConfigEntry ConfigAuditEntry ConfigSchema` |
| `src/schema/contact.ts` | 11 | `ContactData EmailFieldSchema PhoneFieldSchema UrlFieldSchema AddressSchema SocialProfileSchema ContactDataSchema OrganizationData OrganizationDataSchema contactNodeSchema organizationNodeSchema` |
| `src/schema/content.ts` | 1 | `ValidationResult` |
| `src/schema/core.ts` | 7 | `PlanTier BindingStatus CapabilityTaxonomy Binding Program Outcome SelectorStrategy` |
| `src/schema/document.ts` | 12 | `DocumentData DocumentDataSchema CodeData CodeDataSchema KnowledgeData KnowledgeDataSchema WebpageData WebpageDataSchema documentNodeSchema codeNodeSchema knowledgeNodeSchema webpageNodeSchema` |
| `src/schema/email.ts` | 8 | `EmailData EmailAddressSchema EmailAttachmentSchema EmailDataSchema EmailThreadData EmailThreadDataSchema emailNodeSchema emailThreadNodeSchema` |
| `src/schema/event.ts` | 10 | `EventData AttendeeSchema EventDataSchema ReminderData ReminderDataSchema LocationData LocationDataSchema eventNodeSchema reminderNodeSchema locationNodeSchema` |
| `src/schema/harness.ts` | 5 | `HarnessNode HarnessDAG HarnessModule HarnessTelemetry HarnessCheckpoint` |
| `src/schema/health.ts` | 3 | `ProviderHealthReport HealthSignal HealthHistory` |
| `src/schema/index.ts` | 0 | `` |
| `src/schema/learning.ts` | 3 | `LearningEvent Rule BindingEvent` |
| `src/schema/media.ts` | 4 | `MediaKind MediaData MediaDataSchema mediaNodeSchema` |
| `src/schema/message.ts` | 6 | `MessageData MessageDataSchema ConversationData ConversationDataSchema messageNodeSchema conversationNodeSchema` |
| `src/schema/node-data.ts` | 12 | `FsrsState MemoryData MemoryDataSchema AcuData AcuDataSchema NotebookData NotebookDataSchema NoteData NoteDataSchema BookmarkData BookmarkDataSchema ArtifactData` |
| `src/schema/node.ts` | 9 | `Edge EdgeSchema NodeAcl NodeQuality NodeState NodeType NodeBase NodeSchema schemaRegistry` |
| `src/schema/provider-manifest.ts` | 7 | `StreamTransportSchema SseFormatSchema StreamConfigSchema StreamConfig StreamConfigValidation ProviderManifestSchema ProviderManifest` |
| `src/schema/provider.ts` | 5 | `ProviderDefinition ProviderTransport ProviderEndpoint ProviderAccount ProviderParser` |
| `src/schema/repair-metadata.ts` | 1 | `RepairMetadata` |
| `src/schema/response-schemas.ts` | 12 | `CapabilityDetailSchema CapabilityListResponseSchema CapabilityExecuteSuccessSchema ConversationDetailSchema ConversationMessageDetailSchema SendMessageSuccessSchema SendMessageErrorSchema SendMessageResponseSchema ProviderDetailSchema ProviderListResponseSchema HealthDashboardResponseSchema InterpretSuccessSchema` |
| `src/schema/rich-text.ts` | 12 | `MarkSchema Mark TextNodeSchema TextNode PhrasingContent EmphNode StrongNode DeleteNode InlineCodeNode LinkNode ImageNode BreakNode` |
| `src/schema/routing.ts` | 5 | `RouteEventType RouteSpec RouteRequest RouteTarget RouteEvent` |
| `src/schema/schemas.ts` | 0 | `` |
| `src/schema/session.ts` | 7 | `SessionState MessageRole VivimSession ProviderSession ProfileSession Conversation ConversationMessage` |
| `src/schema/social.ts` | 6 | `SocialPostData SocialAuthorSchema SocialMetricsSchema SocialAttachmentSchema SocialPostDataSchema socialPostNodeSchema` |
| `src/schema/streaming.ts` | 12 | `ToolCallStateSchema ToolCallState TextPart ReasoningPart CodePart FilePart ToolCallPart ToolResultPart SourcePart CustomPart ErrorPart MetaPart` |
| `src/schema/task.ts` | 9 | `TaskPriority TaskStatus TaskData TaskDataSchema ProjectData MilestoneSchema ProjectDataSchema taskNodeSchema projectNodeSchema` |
| `src/schema/telemetry.ts` | 3 | `TelemetryPipelineConfig TelemetrySchedule TelemetryRetention` |
| `src/schema/transfer.ts` | 3 | `TransferPattern TransferCandidate TransferAttempt` |
| `src/schema/types.ts` | 12 | `ProviderDefinitionRow ProviderEndpointRow ProviderParserRow ProviderStreamConfigRow ProviderCapabilityRow ProviderConfigRow ProviderModelRow ProviderAccountRow TraceEntryRow CapabilityTaxonomyRow CapabilityTierRow CapabilityBindingRow` |
| `src/schema/validators.ts` | 9 | `CreateAccountSchema SendMessageSchema CreateConversationSchema UpdateConversationSchema FleetStartSchema FleetStopSchema ConfigUpdateSchema RollbackSchema CapabilitySearchSchema` |
| `src/schema/versioning.ts` | 4 | `VersionConfig PromotionRule DegradationRule ProviderManifestVersion` |
