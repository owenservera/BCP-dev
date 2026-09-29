# OpenCode official v2 specification snapshot

Captured from `anomalyco/opencode` commit `03e67171ab2dc1e7f16e8cebfbc7f778f61b89f0` on 2026-09-28.

These are evolving design/specification artifacts, not a guarantee of the stable v1 operational schema.


---

# SOURCE: `specs/v2/config.md`

# V2 Config Review

This document breaks the legacy configuration schema into small review groups. Work through one group at a time and decide whether each field should be ported as-is, removed, or redesigned for v2.

## Status Labels

- `pending`: not discussed yet
- `keep`: port with substantially the existing meaning
- `remove`: do not carry forward
- `redesign`: keep the capability with a different shape, scope, or owning module

## Schema Scope

Use one v2 config schema for now. Some fields, such as `autoupdate`, are intended for global/user configuration, but there is not yet enough benefit to enforce that with separate global and location schemas. Revisit this if more scope-sensitive fields survive the review.

V2 core discovers config documents named `opencode.json` or `opencode.jsonc` in the global config directory, ancestor project directories, and `.opencode` config directories. The legacy `config.json` filename is not supported in V2.

## Group 1: File Metadata

Small fields describing the config file itself rather than application behavior.

| Field     | Current Purpose                                            | Status | Notes                                                                                 |
| --------- | ---------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------- |
| `$schema` | JSON schema reference for editor validation and completion | keep   | Keep as read-only metadata; loading config must not insert it or create files for it. |

## Group 2: Process And Server Settings

Settings that affect process startup, shell execution, or network serving. Review global-only versus location-specific scope carefully.

| Field        | Current Purpose                                     | Status | Notes                                                                          |
| ------------ | --------------------------------------------------- | ------ | ------------------------------------------------------------------------------ |
| `shell`      | Default shell for terminal and shell tool execution | keep   | Port as effective config; shared shell choice is used throughout opencode.     |
| `logLevel`   | Intended logging level configuration                | remove | Do not port: no config consumer exists and logging initializes from CLI input. |
| `server`     | Hostname, port, mDNS, and CORS settings             | remove | Do not port: location config is loaded after the server is already running.    |
| `autoupdate` | Automatic update or notification behavior           | keep   | Global-only user preference; keep `true`, `false`, and `"notify"`.             |

## Group 3: Commands And Project Resources

Configuration that introduces location-scoped project resources or discoverable content.

| Field          | Current Purpose                         | Status   | Notes                                                                                                     |
| -------------- | --------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------- |
| `command`      | User-defined commands                   | remove   | Do not port as v2 config; named reusable user workflows belong to skills.                                 |
| `skills`       | Additional skill locations              | redesign | Replace `{ paths?, urls? }` with a single array of local path or remote URL discovery sources.            |
| `reference`    | Named git or local directory references | redesign | Rename to plural `references`; retain named local path and Git repository external-context entries.       |
| `instructions` | Additional ambient instruction sources  | keep     | Keep as one array of local paths, glob patterns, or remote URLs supplying automatically included context. |

V2 does not expose separate user-authored command configuration. Skills should cover named reusable prompt workflows, whether invoked directly by the user or loaded by an agent. Internal command routing and built-in commands may remain runtime concerns without creating a `command` or `commands` config field.

This intentionally does not port legacy command-only behavior such as per-command `model`, `agent`, `subtask`, prompt shell expansion, or positional/template substitution. If a related capability is needed in v2, it should be designed in the owning domain rather than preserved through a second workflow definition system.

Keep `skills` as discovery-source configuration rather than inline workflow definitions. Skill content remains owned by `SKILL.md`; each `skills` entry is either a local search root or a remote discovery URL. Direct invocation behavior can be designed separately without expanding the config shape.

```jsonc
{
  "skills": ["./team-skills", "~/shared-skills", "https://example.com/.well-known/skills/"],
}
```

Keep ambient instructions separate from skills. Instructions are automatically included as model context, while skills are loaded or invoked intentionally. Each source is unambiguously either a local path/glob or a URL, so v2 keeps the simple array shape:

```jsonc
{
  "instructions": [
    "CONTRIBUTING.md",
    "docs/guidelines.md",
    ".cursor/rules/*.md",
    "https://example.com/shared-rules.md",
  ],
}
```

Keep named external context references as a v2 configuration capability, renamed to plural `references` because it is a collection keyed by alias. References declare local directories or Git repositories that can later be addressed as `@alias` or `@alias/path` when the v2 runtime implements this behavior.

```jsonc
{
  "references": {
    "design-system": { "path": "../ui-library" },
    "sdk": { "repository": "github.com/example/sdk", "branch": "main" },
  },
}
```

Retain the compact string entry form as well: values starting with `.`, `/`, or `~` represent local paths, and other strings represent Git repositories.

## Group 4: Plugins

Plugin loading has source-path and scope-sensitive behavior, so it should be reviewed separately from other project resources.

| Field    | Current Purpose               | Status   | Notes                                                                                                       |
| -------- | ----------------------------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| `plugin` | User-specified plugin modules | redesign | Rename to plural `plugins`; retain ordered loading with package strings or `{ package, options? }` entries. |

Plugin order remains part of the v2 configuration contract because hook registration and execution can depend on load order. Replace legacy option tuples with readable object entries:

```jsonc
{
  "plugins": [
    "opencode-helicone-session",
    {
      "package": "@my-org/audit-plugin",
      "options": {
        "endpoint": "https://audit.example.com",
      },
    },
  ],
}
```

The configured `plugins` list represents package-loaded plugins only. Local plugin code remains discovered from plugin directories such as `.opencode/plugins/`; v2 does not port arbitrary configured local paths or file URLs into this field.

## Group 5: Filesystem And Tool Runtime

Settings controlling local file observation, snapshots, language tooling, and tool output behavior.

| Field         | Current Purpose                         | Status   | Notes                                                                                                                                             |
| ------------- | --------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `watcher`     | Ignore patterns for filesystem watching | keep     | Keep `{ ignore?: string[] }`; this configures the filesystem watcher subsystem.                                                                   |
| `snapshot`    | Enable filesystem snapshot tracking     | redesign | Rename to plural `snapshots`; controls creation of snapshots used for undo and revert behavior.                                                   |
| `formatter`   | Configure formatters                    | keep     | Keep singular `boolean \| Record<string, entry>` shape; it configures built-in enablement and named formatter overrides.                          |
| `lsp`         | Configure language servers              | keep     | Keep singular `boolean \| Record<string, entry>` shape; custom servers need commands and file extensions.                                         |
| `attachment`  | Configure attachment/image processing   | redesign | Rename to plural `attachments`; retain `{ image?: { auto_resize?, max_width?, max_height?, max_base64_bytes? } }` for input normalization limits. |
| `tool_output` | Configure tool output truncation limits | keep     | Keep `{ max_lines?, max_bytes? }`; both positive thresholds apply to saved-preview truncation behavior.                                           |

`formatter` and `lsp` configure one project tooling subsystem each, so their singular names remain appropriate. `true` enables the built-in registrations, `false` disables them, and a keyed object enables built-ins while applying named overrides or custom registrations. Custom language servers must declare `extensions` so runtime file attachment is deterministic; validation of known built-in server IDs belongs with the eventual v2 LSP integration rather than the aggregate core config schema.

Rename legacy `attachment` to `attachments` in v2. This setting controls processing for the attachment domain and may expand beyond image handling, while singular `attachment` is already used as a model capability flag indicating whether one model accepts attachments.

```jsonc
{
  "formatter": {
    "prettier": { "disabled": true },
    "project": { "command": ["./scripts/format", "$FILE"], "extensions": [".foo"] },
  },
  "lsp": {
    "typescript": { "disabled": true },
    "project": { "command": ["project-language-server", "--stdio"], "extensions": [".foo"] },
  },
  "attachments": {
    "image": { "auto_resize": true, "max_width": 2000, "max_height": 2000 },
  },
  "tool_output": { "max_lines": 2000, "max_bytes": 51200 },
}
```

## Group 6: Sharing And Identity

Settings affecting sharing behavior or user/account identity rather than model execution.

| Field        | Current Purpose                                 | Status | Notes                                                                                                                  |
| ------------ | ----------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------- |
| `share`      | Session sharing behavior                        | keep   | Keep `"manual" \| "auto" \| "disabled"`; it controls manual sharing permission and automatic sharing of new sessions.  |
| `autoshare`  | Legacy automatic sharing flag                   | remove | Do not port deprecated alias; use `share: "auto"`.                                                                     |
| `enterprise` | Enterprise URL configuration                    | keep   | Keep `{ url?: string }`; currently selects the legacy sharing service endpoint when no organization account is active. |
| `username`   | Display username in conversations and telemetry | keep   | Keep string identity override; runtime may otherwise resolve an operating-system username.                             |

Retain `share` as the single session-sharing setting. `"manual"` permits explicit sharing, `"auto"` shares newly created top-level sessions, and `"disabled"` prevents sharing. Legacy `autoshare: true` is only an alias for `share: "auto"`, so v2 does not expose it.

Retain `enterprise.url` for legacy enterprise share hosting selection and `username` as a user-facing identity override. These remain separate from server authentication credentials; `username` identifies the user in conversation and telemetry behavior rather than HTTP basic-auth configuration.

```jsonc
{
  "share": "disabled",
  "enterprise": { "url": "https://share.example.com" },
  "username": "developer",
}
```

## Group 7: Providers And Model Selection

Provider catalog customization and model-choice configuration. The new core work has started here.

| Field                | Current Purpose                                   | Status   | Notes                                                                                                                        |
| -------------------- | ------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `provider`           | Custom provider configuration and model overrides | redesign | Rename to plural `providers` in v2; do not preserve the legacy singular key. Review nested provider/model fields separately. |
| `disabled_providers` | Disable automatically loaded providers            | redesign | Replace with `experimental.policies: [{ effect: "deny", action: "provider.use", resource: "..." }]`.                         |
| `enabled_providers`  | Restrict enabled providers to an allowlist        | redesign | Replace with ordered `provider.use` allow/deny statements and wildcard resources.                                            |
| `model`              | Default model selection                           | keep     | Keep as the fallback model when an active session or agent does not specify a model.                                         |
| `small_model`        | Small/utility model selection                     | remove   | Do not port; its only runtime consumer is title generation, which can use an explicit `title` agent model override.          |

Provider selection rules belong in `experimental.policies` rather than provider entries or repeated top-level provider fields. Initial proposed shape:

```jsonc
{
  "experimental": {
    "policies": [
      {
        "effect": "deny",
        "action": "provider.use",
        "resource": "*",
      },
      {
        "effect": "allow",
        "action": "provider.use",
        "resource": "anthropic",
      },
    ],
  },
}
```

See [provider-policy.md](./provider-policy.md) for the provider policy semantics and precedence rules.

Policy evaluation will consume authored config documents in reverse order while preserving statement order inside each document. The precedence of `.opencode` policy sources remains open until `.opencode` configuration is reviewed.

Provider configuration uses the plural `providers` key in v2. This intentionally differs from the legacy singular `provider` key; v2 does not add a compatibility alias while its configuration surface is still being defined.

Keep `model` as the default model fallback. It is application-wide behavior used when an active session or agent has no explicit model selection, so it does not belong inside any individual provider configuration.

Do not port `small_model`. In the current runtime it is only consulted while generating a session title: the `title` agent model wins first, then `small_model`, then automatic/current-model fallback. In v2, users who need a specific title model should configure the `title` agent directly rather than use a separate top-level model setting.

Provider, model, variant, and provisional agent `options` are authored as partial patches rather than fully materialized runtime option records. Users should be able to set only the override they need, such as a header or an AI SDK request option; catalog state supplies empty defaults and merges patches in configuration order.

Keep provider `env` as an authored list of recognized credential environment variable names. Built-in catalog providers already carry this metadata for automatic environment-backed availability, and configured providers may need to declare the same source. For a configured provider this is additive metadata, not a requirement that one of the variables exists: the provider may instead be usable through configured options, a stored account, or an endpoint that needs no credential.

Within configured models, nest the legacy upstream model identifier `id` under `api.id` with the rest of the model API override. Model `limit` is an authored patch, so an override may change only `context`, `input`, or `output`. Model `cost` accepts one simple pricing object or an array of tiered pricing entries; omitted cache prices default to zero.

Do not port legacy provider model `reasoning`, `temperature`, or `interleaved` flags as first-class config fields; provider/request behavior belongs in structured `options` or model variants. Do not port `release_date`, `status`, `experimental`, `whitelist`, or `blacklist` in this v2 surface.

```jsonc
{
  "providers": {
    "internal": {
      "env": ["INTERNAL_LLM_API_KEY"],
      "options": { "headers": { "Authorization": "Bearer {env:API_KEY}" } },
      "models": {
        "chat": {
          "api": { "id": "upstream-chat-model" },
          "limit": { "output": 32768 },
          "cost": { "input": 1.25, "output": 10 },
          "variants": [{ "id": "high", "aisdk": { "request": { "reasoningEffort": "high" } } }],
        },
      },
    },
  },
}
```

## Group 8: Agents And Permissions

Agent behavior and tool-access policy. Review together because agent configuration can contain permissions and model choices.

| Field           | Current Purpose                                     | Status   | Notes                                                                                                                       |
| --------------- | --------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| `default_agent` | Choose default primary agent                        | remove   | Do not retain a separate top-level selector; default choice should be designed with the v2 agent configuration model.       |
| `mode`          | Legacy agent configuration alias                    | remove   | Do not port deprecated alias; configure agents through the v2 agent surface only.                                           |
| `agent`         | Configure primary, subagent, and specialized agents | redesign | Rename to plural `agents`; retain a named map of built-in overrides and custom agent definitions.                           |
| `permission`    | Tool permission rules                               | redesign | Rename to plural `permissions`; replace legacy map shorthand with an ordered array of `{ action, resource, effect }` rules. |
| `tools`         | Legacy tool enable/disable map                      | remove   | Do not port boolean enable/disable alias; express tool access through permissions.                                          |

Do not port `default_agent` ahead of the v2 agent design. The legacy runtime uses it to choose a visible, non-subagent fallback instead of `build`, but exposing that selection as an isolated top-level field would pre-commit v2 to the legacy agent model before agents and their policy surface are defined together.

Do not port `mode`. The legacy loader already merges this deprecated alias into `agent`, and v2 should expose only one authoring surface for agent definitions.

Rename legacy `agent` to `agents` because the setting is a collection keyed by agent name. It should continue to support overriding built-in agents such as `build`, `plan`, and `title`, as well as declaring named custom agents. The nested entry schema remains open until agent-local `permission` and deprecated `tools` behavior are decided.

Keep nested `agents.<name>.mode` with values `"primary"`, `"subagent"`, or `"all"`. This identifies an agent's runtime role and is separate from the removed top-level legacy `mode` alias, which was an alternate container for agent definitions.

For named configurable entries across v2, use `disabled?: boolean` consistently when an entry should remain configured but inactive. Agent definitions should therefore redesign legacy `disable` as `disabled`; this matches formatters, language servers, future MCP server definitions, and configured model overrides. Runtime catalog state may still track active availability as `enabled`; that is not user-authored config.

Keep separate `model` and `variant` fields on agent definitions. A model reference uses `provider/model-id`, but model IDs may themselves contain slash-delimited segments, such as `openrouter/openai/gpt-5`; appending a variant to that string would be ambiguous.

Keep `color` on agent definitions. Agents are user-visible selectable entities, so a user-authored display color is appropriate metadata for the agent rather than an unrelated application presentation setting. Retain hex colors and named theme colors supported by the existing configuration.

Keep agent-local `options` provisionally using the same structured provider options shape available on configured providers and models: headers, body, and AI SDK provider/request overrides. Its long-term ownership remains open for team review because reusable provider-specific presets can instead be modeled as variants. Do not retain dedicated agent `temperature` or `top_p` fields.

Retain `description`, `hidden`, and `steps`; they define an agent's discoverability, visibility, and iteration budget rather than model request parameters. Rename legacy agent `prompt` to `system`, making clear that it supplies persistent system-level agent content without colliding with top-level ambient `instructions`. Remove deprecated `maxSteps` in favor of `steps`.

```jsonc
{
  "agents": {
    "reviewer": {
      "model": "openrouter/openai/gpt-5",
      "variant": "high",
      "options": {
        "headers": { "x-agent": "reviewer" },
        "body": {},
        "aisdk": { "provider": {}, "request": { "reasoningEffort": "high" } },
      },
      "description": "Review changes for correctness",
      "system": "Find regressions and missing tests.",
      "mode": "subagent",
      "color": "warning",
      "steps": 12,
      "disabled": false,
      "permissions": [{ "action": "edit", "resource": "*", "effect": "deny" }],
    },
  },
}
```

Do not port `tools`, either as a top-level setting or as an agent-entry alias. The legacy loader already converts tool booleans into permission rules, including collapsing write-adjacent tool names into `edit`; v2 should avoid carrying that lossy compatibility input forward.

Rename legacy `permission` to `permissions` and expose the normalized ordered ruleset already modeled by `PermissionV2.Ruleset`. Rules retain the interactive `"ask"` effect in addition to `"allow"` and `"deny"`; this is distinct from `experimental.policies`, whose provider enforcement currently needs only allow/deny decisions. The same `permissions` ruleset shape should be used inside future `agents` entries.

```jsonc
{
  "permissions": [
    { "action": "bash", "resource": "*", "effect": "ask" },
    { "action": "bash", "resource": "git status", "effect": "allow" },
  ],
}
```

## Group 9: Integrations

External protocol and server integration configuration.

| Field | Current Purpose                       | Status   | Notes                                                                                                                                                      |
| ----- | ------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mcp` | MCP server definitions and enablement | redesign | Keep opencode's explicit local/remote server entry format, nested under `mcp.servers`; use `disabled` for inactive entries and move timeout defaults here. |

Keep the opencode MCP server entry format instead of adopting the common `mcpServers` copy/paste shape. Local servers remain explicit `type: "local"` entries with command arrays and `environment`; remote servers remain explicit `type: "remote"` entries with `url`, `headers`, and optional `oauth`. Nest the server map under `mcp.servers` so protocol-wide settings such as timeout defaults can live under the same subsystem.

MCP timeouts have separate startup and request budgets, expressed in milliseconds. `startup` covers establishing the transport and completing MCP initialization. `request` applies independently to each post-initialization MCP request. A server may override either default without repeating the other.

```jsonc
{
  "mcp": {
    "timeout": { "startup": 30000, "request": 300000 },
    "servers": {
      "github": {
        "type": "local",
        "command": ["npx", "-y", "@github/github-mcp-server"],
        "environment": { "GITHUB_TOKEN": "{env:GITHUB_TOKEN}" },
        "disabled": false,
        "timeout": { "startup": 60000 },
      },
      "docs": {
        "type": "remote",
        "url": "https://docs.example.com/mcp",
        "headers": { "Authorization": "Bearer {env:DOCS_TOKEN}" },
        "oauth": {
          "client_id": "{env:MCP_CLIENT_ID}",
          "client_secret": "{env:MCP_CLIENT_SECRET}",
          "scope": "read write",
          "callback_port": 19876,
          "redirect_uri": "http://127.0.0.1:19876/mcp/oauth/callback",
        },
        "disabled": false,
        "timeout": { "request": 600000 },
      },
    },
  },
}
```

## Group 10: Conversation Lifecycle

Behavior affecting long-running conversations and context management.

| Field        | Current Purpose                                             | Status   | Notes                                                                                 |
| ------------ | ----------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------- |
| `compaction` | Automatic compaction, pruning, and context reserve settings | redesign | Group retained verbatim history under `keep` and rename context headroom to `buffer`. |

Retain the compaction capability but redesign the less clear limits. `keep.tokens` is the token budget for recent history serialized into the textual compaction checkpoint. `buffer` is the token headroom reserved so automatic compaction triggers before the input window is exhausted.

```jsonc
{
  "compaction": {
    "auto": true,
    "prune": true,
    "keep": {
      "tokens": 2000,
    },
    "buffer": 10000,
  },
}
```

## Group 11: Deprecated And Experimental Settings

Fields that should not be ported by inertia; each needs an explicit justification.

| Field                                | Current Purpose                         | Status   | Notes                                                                                                                       |
| ------------------------------------ | --------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| `layout`                             | Legacy layout selection                 | remove   | Do not port deprecated option; stretch layout is always used.                                                               |
| `experimental.disable_paste_summary` | Disable pasted-content summary behavior | remove   | Do not port; pasted-input presentation behavior belongs to the client/UI surface.                                           |
| `experimental.batch_tool`            | Enable batch tool                       | remove   | Do not port; batch tool is no longer a supported feature.                                                                   |
| `experimental.openTelemetry`         | Enable AI SDK telemetry spans           | remove   | Do not port; observability is process-level and should use standard OpenTelemetry environment or declarative configuration. |
| `experimental.primary_tools`         | Restrict tools to primary agents        | remove   | Do not port obsolete gating; agent tool access is configured through permissions.                                           |
| `experimental.continue_loop_on_deny` | Continue loop after denied tool call    | remove   | Do not port legacy denied-tool loop behavior.                                                                               |
| `experimental.mcp_timeout`           | MCP request timeout                     | redesign | Move to `mcp.timeout.request` for the default and `mcp.servers.<name>.timeout.request` for per-server overrides.            |

## Review Order

Work through the groups in this order unless a dependency between decisions becomes clear:

1. File Metadata
2. Process And Server Settings
3. Providers And Model Selection
4. Commands And Project Resources
5. Plugins
6. Filesystem And Tool Runtime
7. Sharing And Identity
8. Agents And Permissions
9. Integrations
10. Conversation Lifecycle
11. Deprecated And Experimental Settings


---

# SOURCE: `specs/v2/tools.md`

# V2 Tools

## Design

V2 has one opaque type for locally executable tools:

```ts
type Definition<Input, Output>
type AnyTool = Definition<any, any>

const make: <
  Input extends Schema.Codec<any, any, never, never>,
  Output extends Schema.Codec<any, any, never, never>,
>(config: {
  readonly description: string
  readonly input: Input
  readonly output: Output
  readonly execute: (
    input: Schema.Type<Input>,
    context: Tool.Context,
  ) => Effect.Effect<Schema.Type<Output>, ToolFailure>
  readonly toModelOutput?: (input: {
    readonly input: Schema.Type<Input>
    readonly output: Output["Encoded"]
  }) => ReadonlyArray<Tool.Content>
}) => Definition<Input, Output>
```

Application tools, built-ins, and statically authored plugin tools use this same constructor and execution contract.

`Tool.Definition` is opaque and has exactly one executor. Its schemas and executor are not public fields. The Tool module privately derives model definitions and interprets invocations for the registry; callers normally rely on `Tool.make` inference rather than naming the carrier type.

Input and output codecs are self-contained. Schema conversion cannot require services. Tool dependencies are acquired during construction and captured by `execute`.

## Invocation Context

Every local tool receives the same concrete invocation context:

```ts
interface Tool.Context {
  readonly sessionID: Session.ID
  readonly agent: Agent.ID
  readonly assistantMessageID: Session.MessageID
  readonly toolCallID: ToolCall.ID
}
```

`assistantMessageID` is the durable ID of the assistant message containing the call. The Session runner owns this association and supplies the complete context to the registry; the registry does not infer it.

Decoded tool input is passed separately to `execute`. Raw provider input and domain services do not belong in the invocation context.

Effect interruption is the cancellation mechanism. Tools may translate expected typed failures into `ToolFailure`, but must not translate interruption or defects into model-visible failures.

## Registration

Tools are named when registered:

```ts
yield *
  tools.register({
    read,
    write,
    grep,
  })
```

The record key is the effective model-facing name. A reusable tool value has no intrinsic name.

```ts
interface Tools {
  readonly register: (
    tools: Readonly<Record<string, Tool.AnyTool>>,
  ) => Effect.Effect<void, Tool.RegistrationError, Scope.Scope>
}
```

Tool names use a conservative provider-neutral grammar and are validated at registration. Provider-specific restrictions that cannot be validated generically fail during request preparation with an explicit model-compatibility error.

Process application tools and Location tools expose the same `register` operation but retain separate services and stores. Registration placement determines scope, precedence, and authority; it does not change the tool type.

A Location plugin receives only the narrow `Tools` registration capability, not the internal registry. Its installation effect runs once per applicable Location, acquires that Location's services, constructs its tools, and registers them in the plugin-owned Scope.

Within one placement:

- The latest active registration for a name wins.
- Closing a registration removes only that registration.
- Closing the winner reveals the next-latest active registration.
- Mutating the caller's registration record later does not change the captured registration.

Location registrations take precedence over process application registrations.

## Built-In Tools

Built-ins use the same tool API while capturing trusted Location services:

```ts
const filesystem = yield * FileSystem.Service
const permission = yield * PermissionV2.Service
const tools = yield * Tools.Service

yield *
  tools.register({
    grep: Tool.make({
      description: "Search file contents",
      input: Input,
      output: Output,
      execute: (input, context) =>
        Effect.gen(function* () {
          const root = yield* filesystem.resolveRoot(input)

          yield* permission.assert({
            sessionID: context.sessionID,
            agent: context.agent,
            source: {
              type: "tool",
              messageID: context.assistantMessageID,
              callID: context.toolCallID,
            },
            action: "grep",
            resources: [input.pattern],
            save: ["*"],
            metadata: { root: root.resource },
          })

          return yield* filesystem.grep(input, root)
        }).pipe(/* translate expected typed errors to ToolFailure */),
    }),
  })
```

Trusted tools formulate and sequence permission requests. `PermissionV2` evaluates policy and manages approval. The registry does not inject an `assertPermission` helper.

Sharing a tool type does not imply equal authority. Built-ins and trusted Location plugins may capture services that are not available to application tools.

## Execution

The Location-scoped registry owns effective lookup and settlement. For each local call it:

1. Resolves one effective named registration.
2. Decodes provider input with the input codec.
3. Invokes the tool with the runner-supplied context.
4. Encodes the returned output with the output codec.
5. Projects encoded output into model-facing content.
6. Bounds the complete model-facing output.
7. Returns the settlement and managed-output references to the runner, which persists them durably.

Invalid input never invokes the tool. Invalid output never produces a successful settlement.

`toModelOutput` is pure and total. When omitted, the encoded output remains structured output; an encoded string is also projected as text. Projection does not receive invocation identity because presentation depends only on validated input and output.

Provider-turn materialization captures the effective registration identity for each advertised name without retaining its handler. Settlement rejects the call as stale if that registration was removed or replaced, including when closing an overlay reveals the previously effective registration. The current handler is captured only after this check; removing or replacing its registration afterward does not affect the running invocation.

## Output Bounding

Tools return complete validated domain output. They do not truncate model-facing output or manage retention files.

After projection, one generic settlement boundary bounds the channel actually sent to the provider. When content exists, only its textual parts are measured; structured metadata is retained unchanged without being double-counted, and native media remains unchanged under producer-owned limits. When content is empty, the structured output is measured. Oversized provider-facing text or structured output is retained in managed storage and replaced with a bounded text preview while structured metadata and media are preserved; if complete retention fails, settlement fails operationally rather than publishing lossy success. Managed paths never appear in `Tool.make`, tool output schemas, or projection callbacks solely for retention bookkeeping.

Model-output bounding is not producer memory management. Processes and streaming sources may need separate capture or spooling limits before a tool result exists. Those limits must be modeled at the producer boundary and must not masquerade as model-output truncation. A producer cannot claim a complete retained output after it has already discarded bytes.

## Failure Semantics

Outcomes remain distinct:

- `ToolFailure` is an expected model-visible failure.
- Interruption cancels the invocation and is not a tool result.
- Unexpected typed errors and defects follow the runner's operational failure policy.
- Unknown, invalid, and stale calls become explicit model-visible settlement errors without invoking a handler.

Leaf tools translate only errors they deliberately classify as recoverable. Broad cause-catching around an executor is invalid because it consumes interruption and defects.

## Laws

- **Single executor:** `Tool.make(config)` can invoke only `config.execute`.
- **Codec boundary:** execution observes decoded input; projection observes encoded output.
- **Durable identity:** invocation-owned records use the exact Session, agent, assistant message, and call IDs supplied by the runner.
- **Scoped registration:** closing a Scope removes exactly its registration and reveals any prior active overlay.
- **Captured execution:** registration changes cannot alter an invocation after effective lookup.
- **Stale rejection:** a call never executes a registration other than the one advertised for its provider turn.
- **Storage encapsulation:** domain output does not change according to model-output bounding or retention policy.

## Follow-Up

Location plugin installation should receive the same narrow `Tools` capability. That requires a separate Location-layer ordering change so built-ins register before plugins without introducing a `PluginBoot -> Tools -> PluginBoot` dependency cycle. The carrier, registrar, and plugin-owned Scope semantics are already suitable; no tool-specific plugin hook is needed.

Session's current public result shape still exposes managed `outputPaths`. Extending storage encapsulation across the public Session API requires a separate opaque managed-output reference design; paths are not entirely internal today.


---

# SOURCE: `specs/v2/session.md`

# Session API

## Current V2 Core Slice

The Effect-native core facade treats prompt recording and execution as separate responsibilities:

```text
sessions.create({ id?, location, ... })
  -> omitted ID generates one internal Session ID
  -> supplied ID creates the Session when absent
  -> reused ID returns the existing Session identity

sessions.prompt({ id?, sessionID, prompt, delivery?, resume? })
  -> omitted ID generates one internal message ID
  -> supplied ID inserts one durable Session inbox row when absent
  -> exact reuse returns the same admission receipt
  -> reusing one message ID for another Session, prompt, or delivery mode fails
  -> exact retry schedules another wake unless resume is false
  -> resume omitted or true schedules execution after admission
  -> resume false admits only

sessions.interrupt(sessionID)
  -> interrupts active execution on this process
  -> waits for runner cleanup and settlement
  -> clears a coalesced follow-up wake already registered with this coordinator
  -> preserves durable inbox rows for a later wake or resume
  -> idle or missing Session is a no-op

sessions.active()
  -> snapshots foreground Session drains owned by this process
  -> returns only active Session IDs with { type: "running" }
  -> absence means inactive; activity is not durable across process restarts
```

`session_input` is the durable admission inbox. `PromptAdmitted` records and projects accepted input so pending queue state can be replayed, replicated, and observed by clients. Admitted inputs remain outside model-visible Session history until the serialized runner publishes `Prompted`. Its projector atomically writes the visible user message and marks the inbox row promoted in the same event transaction. The V1-to-V2 shadow bridge publishes the same `Prompted` event for already-visible V1 prompts.

`admittedSeq` is the durable Session event sequence of `PromptAdmitted`. Clients may use the admission event to represent queued input before `Prompted` makes it part of visible conversation history.

Execution routing starts from only the Session ID:

```text
SessionExecution.resume(sessionID)
-> SessionStore.get(sessionID)
-> LocationServiceMap.get(session.location)
-> SessionRunner.run({ sessionID, force? })
```

`SessionExecution` and the read-side `SessionStore` are process-global. `SessionRunner`, catalog, model resolver, tool registry, permission state, and filesystem are cached per Location. No layer takes a Session ID. An omitted `Location.workspaceID` means implicit-local placement; explicit workspace identity remains reserved for future placement semantics.

The local runner issues one explicit `llm.stream(request)` per provider turn, projects each complete local tool call durably before eagerly starting its structured child execution, awaits every started tool fiber after provider-stream closure, and reloads projected history once before continuation. Promoting any new user input resets the selected agent's configured provider-turn allowance; multiple steers promoted at one boundary reset it once. Tool settlement events carry the owning assistant message ID because provider-local call IDs may repeat across turns. Before assembling a provider request, the runner durably fails any local tool still projected as `running` from a previous process with `Tool execution interrupted`; abandoned side effects are never silently replayed.

Projected hosted tools preserve call-side and settlement-side provider metadata separately so settlement and interruption recovery cannot erase continuation identifiers. Provider-native reasoning and provider metadata replay only while the historical assistant model matches the selected continuation model; after a model switch, visible reasoning text remains ordinary assistant text and provider-native metadata is omitted.

## Context Epochs

V2 Sessions persist the exact privileged System Context shown to the model. A Context Epoch stores one immutable provider-cache baseline and a model-hidden structured snapshot used to compare independently observed Context Sources. Environment facts, the host-local date, ambient global/upward-project `AGENTS.md` files, and selected-agent available-skill guidance are the initial sources. Location-wide sources come from the System Context Registry; selected-agent guidance composes with them immediately before Context Epoch admission.

The first complete observation initializes the epoch before any pending prompt becomes model-visible. If initial context is temporarily unavailable, execution stops while the prompt remains pending and retryable. On later provider turns, the runner promotes eligible input first, then reconciles current sources at the safe boundary. Changed context becomes one durable chronological System message, and its event commit advances the epoch snapshot atomically.

```text
Client            Runner                         System Context Registry       Context Epoch Store       Session History         LLM
   │                 │                                      │                           │                       │                 │
   ├─ Admit prompt ─────────────────────────────────────────────────────────────────────────────────────────────▶                 │
   │                 │                                      │                           │                       │                 │
   │                 ├─ Observe initial context ────────────▶                           │                       │                 │
   │                 │                                      │                           │                       │                 │
   │                 ◀─ Complete baseline or unavailable ───┤                           │                       │                 │
   │                 │                                      │                           │                       │                 │
   │                 ├─ Initialize missing epoch ───────────────────────────────────────▶                       │                 │
   │                 │                                      │                           │                       │                 │
   │                 ├─ Promote eligible input ─────────────────────────────────────────────────────────────────▶                 │
   │                 │                                      │                           │                       │                 │
   │                 ├─ Reconcile at safe boundary ─────────▶                           │                       │                 │
   │                 │                                      │                           │                       │                 │
   │                 ◀─ Unchanged or chronological update ──┤                           │                       │                 │
   │                 │                                      │                           │                       │                 │
   │                 ├─ Advance snapshot atomically with update ────────────────────────▶                       │                 │
   │                 │                                      │                           │                       │                 │
   │                 ├─ Baseline + chronological history ─────────────────────────────────────────────────────────────────────────▶
```

Agent and model selection are provider-turn scoped. A switch admitted after the current safe provider-turn boundary applies to the next provider turn without restarting the current turn or replacing the baseline. Agent-specific skill guidance remains a Context Source, so changed guidance is admitted as a chronological System message. A completed compaction causes the next provider attempt to render a fresh baseline directly from current complete context. A Session move clears the epoch so the destination Location initializes a complete baseline on its next run.

```text
Session                            Epoch
   │                                 │
   ├─ initialize complete baseline ──▶
   │                                 │
   │                                 ├─────────────────────────────────╮
   │                                 │ reconcile chronological update  │
   │                                 ◀─────────────────────────────────╯
   │                                 │
   ├─ completed compaction ──────────▶
   │                                 ├─ render fresh baseline
   │                                 │
   ├─ clear after Location move ─────▶
```

Ambient project discovery canonicalizes and contains traversal within the project root and honors `OPENCODE_DISABLE_PROJECT_CONFIG`. An unavailable observation preserves the previously admitted value. A confirmed partial instruction removal emits the complete remaining aggregate with explicit supersession text; removing the final instruction emits a revocation message.

Current Context Epoch follow-ups:

- Add configured, remote, and nested instruction sources with explicit precedence and removal semantics.
- Add durable post-crash continuation recovery for promoted or provider-dispatched work.
- Add explicit manual compaction on top of automatic request-budget compaction.
- Add operational metrics for observation latency, unavailable sources, contention, baseline size, and chronological-update growth.
- Consider watcher-backed per-file caching only if measurements show direct safe-boundary observation is too expensive.
- Expose plugin-defined Context Sources only after plugin reload and scoped cleanup semantics are designed.
- Add clustered Session execution ownership and stale-runtime fencing.

## Automatic Compaction

Before each provider turn, the runner estimates the complete model-visible request and compares it with the selected model's context window minus absolute reserved headroom. The reserve is the greater of the requested/model output allowance and configured `compaction.buffer`. When the request exceeds that budget and older complete turns are available, the runner compacts before executing the pending turn.

Compaction keeps the full transcript durable while replacing its active model representation with one hidden checkpoint containing a structured rolling summary and token-bounded serialized recent context. Provider-native assistant, reasoning, and tool messages never survive across the boundary, avoiding signature and encrypted-reasoning failures when the earlier prefix changes.

`session.next.compaction.started.1` durably identifies the attempt. Compaction deltas are live-only progress. `session.next.compaction.ended.1` durably stores the final summary and serialized recent context; only this completed event projects a model-visible compaction message. On the next provider attempt, the runner observes that completed compaction and directly renders a fresh Context Epoch baseline. A failed or interrupted attempt therefore leaves the previous history boundary active.

Repeated compactions update the previous structured summary with newly compacted messages. The runner then reloads projected history and executes the original pending turn.

When a provider rejects a request as context overflow before durable assistant output or tool execution, the runner attempts one overflow-triggered compaction even when the local estimate did not predict pressure. A completed checkpoint rebuilds the same logical provider turn with one remaining physical attempt. A second overflow, unavailable compaction, or overflow after durable output becomes the ordinary terminal failure; recovery never loops or replays partial side effects. Deterministic old tool-result pruning remains a separate follow-up.

## V1 Runtime Context Parity

This is the canonical checklist for model-visible runtime context still needed before the V2 runner replaces V1. Keep each behavior in its owning boundary rather than treating all model-visible text as a durable Context Source. Update this table in the PR that changes a status.

Status: `complete` is usable in the native V2 path, `partial` covers only part of V1 behavior, and `missing` has no native V2 equivalent.

| Boundary                   | Behavior                                                                 | Status   | Remaining V2 work                                                                                                                      |
| -------------------------- | ------------------------------------------------------------------------ | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Durable Context Source     | Environment facts and host-local date                                    | partial  | Add selected provider/model identity without making model selection a stale Location-wide value.                                       |
| Durable Context Source     | Global and upward project instructions                                   | partial  | Decide whether V2 also discovers legacy `CLAUDE.md` and deprecated `CONTEXT.md`.                                                       |
| Durable Context Source     | Configured local/glob and remote URL instructions                        | missing  | Add independent sources with explicit precedence, unavailable, and removal semantics.                                                  |
| Durable Context Source     | Nearby nested instructions discovered after successful reads             | missing  | Persist discoveries and admit them at the next safe provider-turn boundary.                                                            |
| Durable Context Source     | Selected-agent available skill guidance and skill-body loading           | partial  | Guidance and body exposure are permission-filtered; remove globally denied skill definitions during request-time tool materialization. |
| Per-turn request assembly  | Placement, selected model, chronological history, and canonical lowering | complete | None.                                                                                                                                  |
| Per-turn request assembly  | Selected agent, agent prompt, and effective permissions                  | partial  | V2 uses selected-agent permissions for skill guidance and tool authorization; still apply the agent system prompt and request policy.  |
| Per-turn request assembly  | Provider/model-specific base instructions                                | missing  | Select the provider-family baseline unless the effective agent overrides it.                                                           |
| Per-turn request assembly  | Policy-filtered built-in, MCP, plugin, and structured-output tools       | partial  | Materialize definitions for the effective agent and request.                                                                           |
| Per-turn request assembly  | Per-prompt system text and tool overrides                                | missing  | Design admission and durable replay semantics before exposing them.                                                                    |
| Per-turn request assembly  | Steering, plan/build-switch, and final-step reminders                    | missing  | Add only reminders whose behavior remains part of V2.                                                                                  |
| Per-turn request assembly  | Plugin message, system, parameter, and header transforms                 | missing  | Design V2 plugin hooks and lifecycle semantics.                                                                                        |
| Per-turn request assembly  | Model variants and request settings                                      | partial  | Apply effective agent options and future plugin-mutated request settings.                                                              |
| Per-turn request assembly  | Structured-output policy                                                 | missing  | Add prompt format, generated tool, tool choice, and model-visible policy together.                                                     |
| Per-turn request assembly  | Automatic/context-pressure compaction                                    | complete | V2 initiates automatic and overflow-triggered compaction, then rebuilds the baseline from the completed checkpoint.                    |
| Prompt/reference expansion | Durable typed prompt attachments                                         | complete | None.                                                                                                                                  |
| Prompt/reference expansion | Native template and `@` mention expansion                                | missing  | Parse and resolve native V2 prompt input before durable admission.                                                                     |
| Prompt/reference expansion | File, directory, media, and MCP-resource materialization                 | partial  | Materialize and normalize sources instead of lowering unresolved attachment metadata.                                                  |
| Prompt/reference expansion | Agent-reference expansion                                                | missing  | Produce permission-aware model-visible task guidance.                                                                                  |
| Prompt/reference expansion | Configured-reference expansion                                           | missing  | Resolve aliases and emit durable model-visible reference context or failures.                                                          |
| Prompt/reference expansion | Native synthetic expansion replay                                        | partial  | V2 replays synthetic messages but only the V1 compatibility path creates them.                                                         |

Provider timeout, retry, and watchdog policy is intentionally deferred. The runner does not impose a universal provider-stream inactivity or absolute timeout. A future slice should design configurable policy around provider behavior, durable failure reporting, and local drain-chain release rather than hardcoding one default for every provider.

Inbox delivery is explicit:

- `steer` inputs promote at the next safe provider-turn boundary, including continuation inside the current drain.
- `queue` inputs remain in a FIFO while the current drain requires continuation. When the Session would otherwise become idle, the runner promotes exactly one queued input, then reevaluates continuation before promoting another.

Execution has two entry points:

- `run` is an explicit resume. It joins any active execution or starts a forced drain while idle. A forced drain bypasses the no-eligible-input guard, but preparation may still fail before a provider attempt.
- `wake` reports newly recorded durable inbox work. Repeated wakes coalesce. A wake calls the provider only when it can promote eligible input.

Post-crash continuation recovery is intentionally deferred. A wake does not infer that ambiguous provider work is safe to retry after an input has already been promoted. Explicit `run` may deliberately continue from durable projected history. A future recovery slice should model provider-dispatch ambiguity, required continuation, queued-input promotion, retry policy, and visible recovery status together. It must not assume an enclosing durable execution identity that the Session model does not otherwise need.

A process-global `SessionRunCoordinator` serializes execution for each local Session while allowing different Sessions to run concurrently. Resumes join active execution, overlapping wakes coalesce into one follow-up, and interruption stops current process-local execution without deleting durable inbox work. The runner enters the Session's current Location when execution starts and fences each new provider turn against that Location.

The coordinator's active registry is also the source for `sessions.active()`. It represents only foreground Session drains owned by the current process; background subagents and tasks do not add parent Sessions to this registry. The snapshot is runtime state and is empty after a process restart.

Inbox promotion coalesces pending steers in durable admission order. Once continuation would otherwise end, it promotes one queued input at a time in FIFO order. Add explicit inbox backlog and steering-batch limits before exposing broad multi-caller admission or untrusted queue growth.

Eager local-tool execution is intentionally unbounded in the current local slice. This minimizes tool latency but does not increase SQLite settlement throughput: Session-event publication remains serialized per provider turn. Before broadening exposure, revisit per-turn call limits, output truncation, and operational backpressure using observed workloads. The `session.next.*` event schemas remain experimental and unshipped; databases created by earlier experimental builds are disposable rather than compatibility targets.

The synchronized `session.next.*` event family and projected Session-message model predate this branch. This slice refines their replay contract: projected Session messages retain their source aggregate sequence so canonical context ordering and `sessions.messages(...)` pagination follow durable event order even when caller-supplied IDs or timestamps do not. Consumers can use `sessions.events({ sessionID, after? })` to replay durable `session.next.*` events after an aggregate sequence cursor, then tail durable events without a race. Live-only text, reasoning, and tool-input fragments remain available through EventV2 subscriptions for connected renderers; they are intentionally absent from the replayable Session stream.

The first `sessions.events(...)` contract is durable-only during both replay and live tailing. This keeps one cursor equal to one persisted aggregate sequence and is sufficient for reconnect-safe consumers. A later UI-facing API may optionally interleave live-only deltas while connected, but those fragments must remain explicitly ephemeral: they cannot advance the durable cursor, replay after reconnect, or be mistaken for publication boundaries.

`sessions.history({ sessionID, after?, limit? })` is the finite counterpart for request/response consumers. `after` is an exclusive aggregate sequence, and omission starts before sequence zero. The response is `{ data, hasMore }`; callers derive the next `after` from the final event's durable sequence when `hasMore` is true. Public durable Session events are selected before pagination, which permits gaps from private or historical aggregate events while preserving strictly increasing unique sequences. The log has a moving head, so events committed between pages may appear on the next page.

The finite endpoint is `GET /api/session/:sessionID/history`, uses the normal Session Location and authorization middleware, defaults to 50 events, and accepts at most 100. It returns only events in the public durable Session schema. The existing `sessions.events()` replay-and-tail stream is unchanged.

Durable event tail wakeups are advisory and edge-triggered. Each active tail owns one sliding-capacity-1 dirty signal for its aggregate and re-queries SQLite after a wake. Repeated commits coalesce while the tail is busy because durable rows, not in-memory notifications, preserve every event and sequence. Subscribe and register the dirty signal before historical replay, then remove it when the tail closes, so replay handoff cannot miss a commit and inactive aggregates retain no wake state.

Event replay owner claims are separate from clustered Session execution ownership. The former already fences synchronized projection reconstruction; the latter still needs distributed active-run acquisition, stale-runtime rejection, interruption, and placement orchestration.

## Current Tool Registry Slice

`ApplicationTools` stores process-scoped application registrations shared by all Locations. Each Location-scoped `ToolRegistry` overlays Location registrations, materializes definitions, and owns lookup and settlement. Closing a contribution scope removes its definition and rebuilds the advertised catalog. Trusted tool executors capture and perform authorization; the registry applies catalog visibility filtering, decodes input, invokes the retained handler, validates output, and settles failures as typed tool-result errors.

When a Session omits `agent`, both execution and permission evaluation use the default `build` agent. A caller must not observe `build` model behavior while permission checks silently evaluate an empty no-agent policy.

The first built-in contribution is bounded `read`:

```text
resolve one path relative to the Location or a named project reference
-> reject absolute paths, path escapes, and symlink escapes
-> authorize read against the canonical resource identity
-> for a file: return UTF-8 text or base64 binary content; page oversized UTF-8 text by bounded line ranges
-> for a directory: return direct children in directory-first alphabetical order
-> page directory results with one-based offset and next cursor
```

V2 `bash` uses the normal permission semantics: configured agent rules plus saved project approvals, with `ask` as the default when no rule matches. Bash is not sandboxed: the spawned shell runs with the host user's filesystem, process, and network authority. Structured external `workdir` resolution remains an enforced `external_directory` authority check. Best-effort scans of absolute command arguments produce advisory warnings only; they are not sandbox boundaries and do not request or enforce `external_directory` approval.

The first V2 `apply_patch` leaf supports add, update, and delete hunks. It parses every hunk, resolves every mutation target, approves external directories, approves one edit batch, and preflights approved update/delete targets before committing operations sequentially. A later commit-time failure leaves earlier operations applied and returns an explicit partial-application report. Moves and atomic rollback remain separate follow-ups rather than implied behavior.

### Current Runner Follow-Ups

- Keep eager structured local-tool settlement: durably record each complete call, start its child execution immediately, await all started settlements after provider-turn consumption, persist every result, and reload history once before continuation.
- Buffer or coalesce streamed deltas before rewriting growing assistant projections.
- Revisit additional covering indexes as larger-history query shapes become concrete.
- Design any global multi-Session event stream separately; the finite history API deliberately reads one authorized Session aggregate and does not change global Event publication.
- Decide whether UI-facing Session subscriptions should optionally interleave ephemeral deltas while connected without advancing the durable cursor.
- Add provider-aware context control for provider-executed tool results. Generic text truncation cannot replace provider-native structured payloads that must round-trip exactly.

## Remove Dedicated `session.init` Route

The dedicated `POST /session/:sessionID/init` endpoint exists only as a compatibility wrapper around the normal `/init` command flow.

Current behavior:

- the route calls `SessionPrompt.command(...)`
- it sends `Command.Default.INIT`
- it does not provide distinct session-core behavior beyond running the existing init command in an existing session

V2 plan:

- remove the dedicated `session.init` endpoint
- rely on the normal `/init` command flow instead
- avoid reintroducing `Session.initialize`-style special cases in the session service layer


---

# SOURCE: `specs/v2/catalog-config-plugin-lifecycle.md`

# Catalog / Config / Plugin Lifecycle Options

Status: current core has selected replayable Location-scoped Catalog transforms, aligned with option B. Reload/watch behavior and deferred external plugin activation remain design work; the option comparison below is retained as historical context.

We need to choose where provider/model inputs live and how visible catalog state changes after boot. The designs below compare config, models.dev, auth, plugin activation/disablement, config edits, and policy changes under each option.

## Scenarios

- Initial load: a location opens, built-in/configured plugins activate, and the first visible catalog is constructed.
- Config: authored provider/model definitions and overrides.
- models.dev: remote provider/model data refreshed on a timer.
- Auth: active credentials enable/configure providers and can later disappear.
- Plugin activation: a plugin starts contributing while the location is open.
- Plugin disablement: a plugin stops contributing and its influence must disappear.
- Config edit: authored configuration changes while the location is open.
- Policy: allowed/denied provider selection changes after providers exist.

## A. Config Transforms, Service Reload

`Config` merges its ordered documents and then runs ordered, replayable plugin transforms. Each transform is a callback receiving `Draft<Config.Info>` and may mutate any config field.

```ts
type ConfigTransform = (config: Draft<Config.Info>) => void

const transform = yield * Config.transform()

yield *
  transform((config) => {
    config.providers ??= {}
    config.providers.acme = {
      /* ... */
    }
    config.model = "acme/code"
    config.permissions = [
      /* ... */
    ]
  })
```

Because a transform can mutate any part of config, a transform change cannot safely trigger only `Catalog.reload()` or any other granular subset. Every service derived from config must reload in place from the newly transformed config.

```ts
const transform = yield* Config.transform()
yield* transform((draft) => mutateAnyConfigField(draft))
  → Reload.all()
    → Policy.reload()
    → Catalog.reload()
    → Agent.reload()
    → MCP.reload()
    → other config-consuming services reload
```

### Initial Load

Configured plugin installation/updates should not block location readiness. Build an initial snapshot from authored config and fast built-ins, then activate slow plugins in the background and coalesce their resulting reload requests.

```ts
LocationServiceMap.get(ref)
  → build location layer
    → Config.layer reads authored documents
      → merge authored documents
      → run currently active Config transforms
    → Policy.layer reads transformed Config
    → Catalog.layer reads transformed Config
      → materialize baseline provider/model catalog
  → PluginBoot baseline ready
    → Frontend.fetchCatalog()

PluginBoot background fiber
  → install/update plugin packages concurrently
  → activate completed plugins
    → Config.transform()
      → transform(updateConfig)
    → ReloadScheduler.request()
      → debounce short burst of completed activations
      → Reload.all()
        → Config.get()
          → run newly active Config transforms
        → Catalog.reload()
          → Catalog.Event.Updated
            → Frontend.refetchCatalog()
```

The initial layer build is not a reload. `Reload.all()` only runs after the live location changes, such as a background plugin becoming active or a config source changing. Debouncing reduces repeated full-service reloads when multiple plugins complete near each other; each batch still reloads every config-consuming service because a config transform may mutate any field.

### Config

```ts
config file loaded
  → config source/watch trigger records new documents
    → Reload.all()
      → Policy.reload()
      → Catalog.reload()
        → Catalog.Event.Updated
          → Frontend.refetchCatalog()
```

### models.dev

```ts
timer fires
  → ModelsDevPlugin.refresh()
    → ModelsDev.get()
    → transform(applyModelsDevToConfig)
    → Reload.all()
      → Policy.reload()
      → Catalog.reload()
        → Catalog.Event.Updated
          → Frontend.refetchCatalog()
```

`Catalog` does not know about `ModelsDev`; the plugin transforms config before catalog reads it.

### Auth

```ts
Account.switched(providerID)
  → AuthPlugin.refresh(providerID)
    → Account.active(providerID)
    → transform(applyAuthToConfig)
    → Reload.all()
      → Policy.reload()
      → Catalog.reload()
        → Catalog.Event.Updated
          → Frontend.refetchCatalog()
```

### Plugin Activation

```ts
Plugin.activate("acme-models")
  → Config.transform()
    → transform(applyAcmeConfig)
  → Reload.all()
    → Policy.reload()
    → Catalog.reload()
      → Catalog.Event.Updated
        → Frontend.refetchCatalog()
```

### Plugin Disablement

```ts
Plugin.disable("company-naming")
  → close plugin scope
    → Config internally unregisters transform in finalizer
  → Reload.all()
    → Policy.reload()
    → Catalog.reload()
      → sonnet.name = "Sonnet"
      → Catalog.Event.Updated
        → Frontend.refetchCatalog()
```

### Config Edit

```ts
file watcher sees edit
  → config source/watch trigger records updated documents
  → Reload.all()
    → Policy.reload()
    → Catalog.reload()
      → Catalog.Event.Updated
        → Frontend.refetchCatalog()
```

### Policy

```ts
policy config changes
  → config source/watch trigger records updated documents
  → Reload.all()
    → Policy.reload()
    → Catalog.reload()
      → apply updated policy
      → Catalog.Event.Updated
        → Frontend.refetchCatalog()
```

### Tradeoffs

- A plugin receives `Draft<Config.Info>`, can inspect preceding config state, and can mutate arbitrary config fields through a replayable transform.
- Plugin disablement removes its config transform and lets services rematerialize without manual undo.
- models.dev and auth become config transforms rather than catalog dependencies.
- `Config` owns merge/order semantics for fields visible to transforms.
- Granular service reload is not safe because a config transform can mutate anything; every config-consuming service reloads after any transform change.
- `Catalog` depends on provider/model config semantics and is part of that full service reload.
- One reload produces at most one `Catalog.Event.Updated` notification.
- Deferred plugin activation avoids blocking readiness, but plugin completions may cause repeated full-service reload batches during startup.

## B. Catalog Transforms

Plugins register replayable catalog transforms. Each transform receives a `Catalog.Editor` whose helper methods mutate a private catalog draft; `Catalog` rematerializes visible records from its active transforms.

```ts
interface Catalog {
  transform(): Effect.Effect<(update: (catalog: Catalog.Editor) => void) => Effect.Effect<void>, never, Scope.Scope>
}
```

```ts
const transform = yield* Catalog.transform()
yield* transform(update)
  → replace this transform callback
  → apply active transforms in registration order
  → apply policy
  → commit diff
    → Event.publish(Catalog.Event.Updated)
      → Frontend.refetchCatalog()
```

### Initial Load

Configured plugin installation/updates should not block location readiness. Build an initial catalog from immediately available sources, then activate slow plugins in the background and coalesce refresh requests.

```ts
LocationServiceMap.get(ref)
  → build location layer
    → Catalog.layer creates empty catalog state
    → PluginBoot.layer activates immediately available plugins
      → ConfigProviderPlugin installs Catalog.transform()
      → ModelsDevPlugin installs Catalog.transform()
      → AuthPlugin installs Catalog.transform()
    → Catalog.layer applies active transforms during boot
    → apply policy
    → materialize baseline provider/model catalog
  → PluginBoot baseline ready
    → Frontend.fetchCatalog()

PluginBoot background fiber
  → install/update plugin packages concurrently
  → activate completed plugins
    → Catalog.transform()
      → transform(updateCatalog)
        → Catalog internally rebuilds
          → Catalog.Event.Updated
            → Frontend.refetchCatalog()
```

Each completed plugin activation rebuilds catalog when it calls its transform. Debouncing plugin completions would require adding an explicit batch/suspend-rebuild mechanism; it does not arise from the transform interface itself.

### Config

```ts
config file loaded
  → ConfigProviderAdapter.load()
    → transform(applyConfigToCatalog)
      → Catalog internally rebuilds
```

### models.dev

```ts
timer fires
  → ModelsDevPlugin.refresh()
    → ModelsDev.get()
    → transform(applyModelsDevToCatalog)
      → Catalog internally rebuilds
      → commit diff
```

### Auth

```ts
Account.switched(providerID)
  → AuthPlugin.refresh()
    → transform(applyAuthToCatalog)
      → Catalog internally rebuilds
        → replay active transforms including current auth
        → apply policy
        → commit diff
```

### Plugin Activation

```ts
Plugin.activate("acme-models")
  → Catalog.transform()
    → transform(applyAcmeToCatalog)
    → Catalog internally rebuilds
      → commit diff
```

### Plugin Disablement

```ts
Plugin.disable("company-naming")
  → close plugin scope
    → Catalog internally unregisters transform in finalizer
    → Catalog internally rebuilds
      → sonnet.name = "Sonnet"
      → commit diff
```

### Config Edit

```ts
file watcher sees edit
  → ConfigProviderAdapter.load()
    → transform(applyUpdatedConfigToCatalog)
      → Catalog internally rebuilds
```

### Policy

```ts
policy changes
  → Catalog rebuild trigger
    → replay all active transforms
    → apply updated policy last
    → commit diff
```

### Tradeoffs

- Disablement, source refresh, and policy re-evaluation are transform replay operations.
- Auth does not need to be represented as config.
- Config remains one catalog source rather than a catalog dependency.
- The API shape matches A, but the mutable draft is catalog state instead of configuration state.
- Catalog needs transform ordering and internal rebuild behavior in addition to reads.
- Recompute ordering, serialization, and diff events must be specified.
- One internal rebuild produces at most one `Catalog.Event.Updated` notification.
- Deferred plugin activation avoids blocking readiness and only rebuilds catalog for catalog transform changes.
- Debouncing those rebuilds needs an additional batching interface or an activation coordinator that installs multiple transforms before exposing updates.


---

# SOURCE: `specs/v2/instructions.md`

# V2 Core Instructions

These notes describe how to work on `packages/core` during the v2 port.

## Direction

Move behavior out of large application services and into plugins. Core services should become small, typed containers that own state, expose simple operations, and trigger hooks where policy or integration-specific logic belongs.

The target shape is:

- `packages/core` contains domain schemas, typed errors, state containers, events, and plugin hook contracts.
- Plugins implement provider-specific, config-specific, auth-specific, model-discovery, and generation behavior.
- Services are hot-reloadable by design: updates are granular, observable, and do not require tearing down the whole process.
- `packages/opencode` becomes thinner over time: UI, server routes, CLI, storage glue, and legacy compatibility should call the core services instead of owning domain logic directly.

## Service Shape

Core services should look like `Catalog`, `AccountV2`, and `AgentV2`:

- define schemas and branded ids at the top of the module
- define typed `Schema.TaggedErrorClass` errors for expected failures
- define an `Interface` with small operations
- expose a `Context.Service`
- implement `layer` with private in-memory state
- expose `defaultLayer` with explicit dependencies
- self-export with `export * as Name from "./file"`

Prefer a dumb container API:

- `get`, `all`, `available`, `default`, `update`, `remove`, `activate`, or other small domain verbs
- `update(id, draft => ...)` for registration and mutation
- hook calls before committing mutations when plugins need to enrich, cancel, or validate changes
- events after committing mutations when other services or frontends need to react

Avoid putting application policy directly in core services unless it is a domain invariant. For example, resolving model endpoint inheritance is catalog-owned; deciding which providers to register is plugin-owned.

## Plugin Hooks

Plugins are the extension boundary for v2. Add hooks to `PluginV2.HookSpec` when logic should be provided by integrations instead of the container itself.

Hook conventions:

- hooks receive immutable input plus mutable output
- mutable object outputs are exposed as Immer drafts
- include `cancel: boolean` when plugins can prevent a mutation
- trigger hooks sequentially so ordering remains deterministic
- keep hook names domain-oriented, like `provider.update`, `model.update`, `account.activate`, `agent.generate`
- keep hook payloads small and typed with core schemas

Use hooks for:

- registering providers and models
- applying env/account/config-derived enablement
- transforming SDK/provider options
- implementing generated behavior such as agent generation
- choosing defaults when the choice is policy rather than state

Do not use hooks as a dumping ground for transport concerns, UI behavior, or compatibility shims.

## Plugin Boot

Built-in core plugins are registered by `packages/core/src/plugin/boot.ts`.

When a new core service is intended to be available to plugins:

- add the service to the boot layer dependency type
- yield the service inside the layer
- provide it to each plugin effect in `add`
- add its default layer to `PluginBoot.defaultLayer` only when that does not create a cycle

Keep boot as composition only. It should not contain provider, account, agent, or model policy itself.

## Boundaries

Core should not import from `packages/opencode`. If a type or concept is needed by core, move or remodel the domain shape in core first.

Avoid moving legacy services over wholesale. Port the domain shape and the container API, then leave specific behavior behind hooks for plugins to implement.

When porting an opencode service:

- identify the state it owns
- identify the operations callers actually need
- identify which branches are policy or integration behavior
- model state and operations in `packages/core`
- add hooks for the policy/integration branches
- keep old package code working until callers can migrate incrementally

## Schemas And Types

Use Effect schemas as the public contract:

- branded schemas for ids
- `Schema.Class` or `Schema.Struct` for domain data
- `Schema.TaggedErrorClass` for expected errors
- existing core helpers like `DeepMutable`, `statics`, and integer schemas where appropriate

Prefer `Info` objects as the stored domain records. Add static `empty(...)` constructors when update APIs need to create records on first mutation.

Keep schemas stable and explicit. Do not rely on opencode config shapes as core domain shapes unless the config shape is actually the domain model.

## State And Events

Keep state private to the service layer. Use immutable replacement or Effect refs when persistence/concurrency requires it.

Publish events for committed domain changes, not for attempted mutations. Event names should describe domain facts, for example `catalog.model.updated`.

The v2 goal is granular reconfiguration. A model update should let dependents react to that model update; it should not require global reloads.

## Style

Follow the local core style:

- `Effect.gen(function* () { ... })` for composition
- `Effect.fn("Domain.method")` for public service methods
- `Effect.fnUntraced` for small internal mutation helpers
- `yield* new ErrorClass(...)` for typed failures
- minimal helpers unless they name a real concept
- no `any` unless an existing plugin boundary requires it
- no compatibility code without a concrete persisted or external-consumer need

Prefer the smallest correct port. The goal is to make services easier to replace and reason about, not to recreate the old architecture in a new package.


---

# SOURCE: `specs/v2/provider-model.md`

# Provider and Model Catalog

## Provider Schema

```ts
export const ID = Schema.String.pipe(
  Schema.brand("ProviderV2.ID"),
  statics((schema) => ({
    opencode: schema.make("opencode"),
    anthropic: schema.make("anthropic"),
    openai: schema.make("openai"),
    google: schema.make("google"),
    googleVertex: schema.make("google-vertex"),
    githubCopilot: schema.make("github-copilot"),
    amazonBedrock: schema.make("amazon-bedrock"),
    azure: schema.make("azure"),
    openrouter: schema.make("openrouter"),
    mistral: schema.make("mistral"),
    gitlab: schema.make("gitlab"),
  })),
)
export type ID = typeof ID.Type

const OpenAIResponses = Schema.Struct({
  type: Schema.Literal("openai/responses"),
  url: Schema.String,
  websocket: Schema.optional(Schema.Boolean),
})

const OpenAICompletions = Schema.Struct({
  type: Schema.Literal("openai/completions"),
  url: Schema.String,
  reasoning: Schema.Union([
    Schema.Struct({
      type: Schema.Literal("reasoning_content"),
    }),
    Schema.Struct({
      type: Schema.Literal("reasoning_details"),
    }),
  ]).pipe(Schema.optional),
})
export type OpenAICompletions = typeof OpenAICompletions.Type

const AISDK = Schema.Struct({
  type: Schema.Literal("aisdk"),
  package: Schema.String,
  url: Schema.String.pipe(Schema.optional),
})

const AnthropicMessages = Schema.Struct({
  type: Schema.Literal("anthropic/messages"),
  url: Schema.String,
})

const UnknownEndpoint = Schema.Struct({
  type: Schema.Literal("unknown"),
})

export const Endpoint = Schema.Union([
  UnknownEndpoint,
  OpenAIResponses,
  OpenAICompletions,
  AnthropicMessages,
  AISDK,
]).pipe(Schema.toTaggedUnion("type"))
export type Endpoint = typeof Endpoint.Type

export const Options = Schema.Struct({
  headers: Schema.Record(Schema.String, Schema.String),
  body: Schema.Record(Schema.String, Schema.Any),
  aisdk: Schema.Struct({
    provider: Schema.Record(Schema.String, Schema.Any),
    request: Schema.Record(Schema.String, Schema.Any),
  }),
})
export type Options = typeof Options.Type

export class Info extends Schema.Class<Info>("ProviderV2.Info")({
  id: ID,
  name: Schema.String,
  enabled: Schema.Union([
    Schema.Literal(false),
    Schema.Struct({ via: Schema.Literal("env"), name: Schema.String }),
    Schema.Struct({ via: Schema.Literal("account"), service: Schema.String }),
    Schema.Struct({ via: Schema.Literal("custom"), data: Schema.Record(Schema.String, Schema.Any) }),
  ]),
  env: Schema.String.pipe(Schema.Array),
  endpoint: Endpoint,
  options: Options,
}) {
  static empty(providerID: ID) {
    return new Info({
      id: providerID,
      name: providerID,
      enabled: false,
      env: [],
      endpoint: {
        type: "unknown",
      },
      options: {
        headers: {},
        body: {},
        aisdk: { provider: {}, request: {} },
      },
    })
  }
}

export class NotFound extends Schema.TaggedErrorClass<NotFound>("ProviderV2.NotFound")("ProviderV2.NotFound", {
  providerID: ID,
}) {}
```

## Model Schema

```ts
export const ID = Schema.String.pipe(Schema.brand("ModelV2.ID"))
export type ID = typeof ID.Type

export const VariantID = Schema.String.pipe(Schema.brand("VariantID"))
export type VariantID = typeof VariantID.Type

export const Family = Schema.String.pipe(Schema.brand("Family"))
export type Family = typeof Family.Type

export const Capabilities = Schema.Struct({
  tools: Schema.Boolean,
  input: Schema.String.pipe(Schema.Array),
  output: Schema.String.pipe(Schema.Array),
})
export type Capabilities = typeof Capabilities.Type

export const Variant = Schema.Struct({
  id: VariantID,
  ...ProviderV2.Options.fields,
})
export type Variant = typeof Variant.Type

export const Cost = Schema.Struct({
  tier: Schema.Struct({
    type: Schema.Literal("context"),
    size: Schema.Int,
  }).pipe(Schema.optional),
  input: Schema.Finite,
  output: Schema.Finite,
  cache: Schema.Struct({
    read: Schema.Finite,
    write: Schema.Finite,
  }),
})
export type Cost = typeof Cost.Type

export const Limit = Schema.Struct({
  context: Schema.Int,
  input: Schema.Int.pipe(Schema.optional),
  output: Schema.Int,
})
export type Limit = typeof Limit.Type

export const Ref = Schema.Struct({
  id: ID,
  providerID: ProviderV2.ID,
  variant: VariantID.pipe(Schema.optional),
})
export type Ref = typeof Ref.Type

export class Info extends Schema.Class<Info>("ModelV2.Info")({
  id: ID,
  apiID: ID,
  providerID: ProviderV2.ID,
  family: Family.pipe(Schema.optional),
  name: Schema.String,
  endpoint: ProviderV2.Endpoint,
  options: Schema.Struct({
    ...ProviderV2.Options.fields,
    variant: Schema.String.pipe(Schema.optional),
  }),
  capabilities: Capabilities,
  variants: Variant.pipe(Schema.Array),
  time: Schema.Struct({
    released: DateTimeUtcFromMillis,
  }),
  cost: Cost.pipe(Schema.Array),
  status: Schema.Literals(["alpha", "beta", "deprecated", "active"]),
  enabled: Schema.Boolean,
  limit: Limit,
}) {
  static empty(providerID: ProviderV2.ID, modelID: ID) {
    return new Info({
      id: modelID,
      apiID: modelID,
      providerID,
      name: modelID,
      endpoint: {
        type: "unknown",
      },
      capabilities: {
        tools: false,
        input: [],
        output: [],
      },
      options: {
        headers: {},
        body: {},
        aisdk: { provider: {}, request: {} },
      },
      variants: [],
      time: {
        released: DateTime.makeUnsafe(0),
      },
      cost: [],
      status: "active",
      enabled: true,
      limit: {
        context: 0,
        output: 0,
      },
    })
  }
}
```

## Catalog Interface

```ts
export interface Interface {
  readonly transform: State.Interface<Data, Editor>["transform"]
  readonly provider: {
    readonly get: (providerID: ProviderV2.ID) => Effect.Effect<ProviderV2.Info, ProviderNotFoundError>
    readonly all: () => Effect.Effect<ProviderV2.Info[]>
    readonly available: () => Effect.Effect<ProviderV2.Info[]>
  }

  readonly model: {
    readonly get: (
      providerID: ProviderV2.ID,
      modelID: ModelV2.ID,
    ) => Effect.Effect<ModelV2.Info, ProviderNotFoundError | ModelNotFoundError>
    readonly all: () => Effect.Effect<ModelV2.Info[]>
    readonly available: () => Effect.Effect<ModelV2.Info[]>
    readonly default: () => Effect.Effect<Option.Option<ModelV2.Info>>
    readonly small: (providerID: ProviderV2.ID) => Effect.Effect<Option.Option<ModelV2.Info>>
  }
}
```

`ProviderV2.Info.enabled` is stored provider state. Provider plugins set it to `false` or record whether availability comes from environment, account, or custom configuration.

`ProviderV2.Endpoint` includes `{ type: "unknown" }`. `CatalogV2.model.get()` and `CatalogV2.model.all()` resolve `unknown` endpoints from the provider before returning models.

Model storage is nested by provider because model ids are only unique within a provider.

```ts
type ProviderRecord = {
  provider: ProviderV2.Info
  models: HashMap.HashMap<ModelV2.ID, ModelV2.Info>
}

let records = HashMap.empty<ProviderV2.ID, ProviderRecord>()
```

`ModelV2.Info.enabled` stores model availability. `CatalogV2.model.available()` also requires a usable provider.

```ts
const available = provider.enabled !== false && model.enabled
```

## Current Session Runner Adaptation

The first local V2 Session runner waits for Location plugin boot, then resolves an explicit Session model without silently falling back. Without an explicit model it uses a supported Location catalog default, then falls back to the first available model with a supported route, and otherwise fails with `SessionRunnerModel.ModelNotSelectedError`. Its native adaptation surface is deliberately narrow:

```text
openai/responses over HTTP
openai/completions for OpenAI Chat
openai/completions for OpenAI-compatible Chat
anthropic/messages
aisdk:@ai-sdk/openai
aisdk:@ai-sdk/openai-compatible with an explicit URL
aisdk:@ai-sdk/anthropic
```

Native endpoint URLs are complete endpoint URLs and are split into base URL plus request path when building an LLM route. AI SDK endpoint URLs remain base URLs. The adapter preserves model headers and body options, environment-backed provider credentials, direct model API keys, and selected Session variant overlays.

Unsupported routes fail explicitly with `SessionRunnerModel.UnsupportedEndpointError`. In particular, `openai/responses` with WebSocket transport must not silently downgrade to HTTP. Google, Azure, Bedrock, OpenRouter-specific behavior, GitHub Copilot, Vertex, gateway adapters, and signed authentication remain future provider slices.

## Plugin Interface

```ts
type HookSpec = {
  "account.update": {
    input: {
      id: AccountV2.ID
      serviceID: AccountV2.ServiceID
    }
    output: {
      description: string
      credential: AccountV2.Credential
      cancel: boolean
    }
  }

  "account.remove": {
    input: {
      account: AccountV2.Info
    }
    output: {
      cancel: boolean
    }
  }

  "account.activate": {
    input: {}
    output: {
      from?: AccountV2.ID
      to: AccountV2.ID
      cancel: boolean
    }
  }

  "account.activated": {
    input: {
      from?: AccountV2.ID
      to: AccountV2.ID
    }
    output: {}
  }
}

export type Definition<R = never> = Effect.Effect<
  {
    readonly order: number
    readonly hooks: HookFunctions
  },
  never,
  R
>

export interface Interface {
  readonly add: <R = never>(input: { id: ID; definition: Definition<R> }) => Effect.Effect<void, never, R>

  readonly remove: (id: ID) => Effect.Effect<void>

  readonly trigger: <Name extends keyof Hooks>(name: Name, input: HookInput<Name>) => Effect.Effect<HookInput<Name>>
}
```

## Plugin Order

```ts
export const Order = {
  modelsDev: 0,
  env: 10,
  account: 20,
  provider: 30,
  config: 40,
  discovery: 50,
} as const
```

## Built-In Plugins

```ts
export const ModelsDevPlugin: PluginV2.Definition<ProviderV2.Service | ModelV2.Service | ModelsDev.Service>

export const EnvPlugin: PluginV2.Definition<ProviderV2.Service | Env.Service>

export const AccountPlugin: PluginV2.Definition<ProviderV2.Service | AccountV2.Service>

export const ConfigPlugin: PluginV2.Definition<ProviderV2.Service | ModelV2.Service | Config.Service>

export const AnthropicPlugin: PluginV2.Definition<ProviderV2.Service | AccountV2.Service>

export const OpenRouterPlugin: PluginV2.Definition<ProviderV2.Service>

export const AmazonBedrockPlugin: PluginV2.Definition<ProviderV2.Service | AccountV2.Service | Env.Service>

export const GoogleVertexPlugin: PluginV2.Definition<ProviderV2.Service | AccountV2.Service | Env.Service>

export const GitLabPlugin: PluginV2.Definition<ProviderV2.Service | AccountV2.Service | Env.Service>

export const GitLabDiscoveryPlugin: PluginV2.Definition<ProviderV2.Service | ModelV2.Service | AccountV2.Service>
```

## Plugin Hooks

```ts
export type Hooks = {
  init: {}

  "provider.update": {
    provider: Draft<ProviderV2.Info>
    cancel: boolean
  }

  "model.update": {
    model: Draft<ModelV2.Info>
    cancel: boolean
  }
}
```


---

# SOURCE: `specs/v2/provider-policy.md`

# Policy

## Purpose

Policies control whether an operation on a named resource is allowed. They may be authored in configuration files, but policy evaluation is its own runtime concern.

The first policy consumer is provider availability:

```text
action:   provider.use
resource: provider ID, such as openai or company-ai
```

Provider configuration and provider policy remain separate:

- `providers` describes endpoints, options, and model overrides.
- `experimental.policies` determines whether an operation using a provider is allowed.

A provider can be correctly configured and have valid credentials while policy still denies its use.

## Goals

- Replace legacy `enabled_providers` and `disabled_providers`.
- Keep the default experience unchanged when users specify no policy.
- Support wildcard matching for actions and resources.
- Provide one small policy vocabulary that can later cover operations such as `plugin.load` or `mcp.connect`.
- Let user policy override repository policy, and later allow organization-managed policy to override both.
- Keep evaluation simple: matching statements are applied in order and the last match wins.

## Non-Goals

- Policies do not configure endpoints, credentials, models, or provider options.
- Policies do not make unusable resources usable.
- Policies do not currently provide conditions, principals, approval prompts, or enforced configuration values.
- This spec does not define how organization-managed policies are delivered.

## Statement Shape

```jsonc
{
  "experimental": {
    "policies": [
      {
        "effect": "deny",
        "action": "provider.use",
        "resource": "openai",
      },
    ],
  },
}
```

```ts
interface PolicyInfo {
  effect: "allow" | "deny"
  action: string
  resource: string
}
```

The `Policy` module owns the shared `Policy.Info` interface, `Policy.Effect` type, and evaluator. Domains define their supported typed statement schemas; for example, `Catalog.ProviderPolicy` fixes `action` to `"provider.use"`. The config schema gathers those domain-defined statement schemas into the accepted `experimental.policies` union because config files are one place statements can be authored while the capability is experimental.

## Matching

Both `action` and `resource` use opencode's existing wildcard matching behavior.

Examples:

| Action         | Resource    | Matches                                                                      |
| -------------- | ----------- | ---------------------------------------------------------------------------- |
| `provider.use` | `openai`    | Only use of provider ID `openai`                                             |
| `provider.use` | `company-*` | Use of provider IDs such as `company-us` and `company-eu`                    |
| `provider.*`   | `*`         | Any provider operation on any provider, if more actions are introduced later |

No pattern-specific precedence exists. A specific resource does not automatically beat a wildcard resource. Written/evaluation order controls the result.

## Evaluation

To evaluate an operation and resource:

1. Start with `allow`.
2. Consider every statement whose `action` and `resource` match the requested action and resource.
3. Each matching statement replaces the current decision with its `effect`.
4. The last matching statement determines the result.

Conceptually:

```ts
function evaluate(action: string, resource: string, fallback: Policy.Effect, statements: Policy.Info[]) {
  return (
    statements.findLast(
      (statement) => Wildcard.match(action, statement.action) && Wildcard.match(resource, statement.resource),
    )?.effect ?? fallback
  )
}
```

Each caller supplies the default effect appropriate for its operation. Catalog provider use supplies `"allow"`, so no provider policy statements means normal behavior continues: otherwise usable providers are allowed.

## Ordering Within One Config Document

Statements remain in the order written by the user.

To deny all providers except Anthropic:

```jsonc
{
  "experimental": {
    "policies": [
      {
        "effect": "deny",
        "action": "provider.use",
        "resource": "*",
      },
      {
        "effect": "allow",
        "action": "provider.use",
        "resource": "anthropic",
      },
    ],
  },
}
```

Result:

```text
provider.use / anthropic -> allow
provider.use / openai    -> deny
```

To allow internal providers except experimental ones:

```jsonc
{
  "experimental": {
    "policies": [
      { "effect": "deny", "action": "provider.use", "resource": "*" },
      { "effect": "allow", "action": "provider.use", "resource": "company-*" },
      { "effect": "deny", "action": "provider.use", "resource": "company-experimental-*" },
    ],
  },
}
```

Result:

```text
company-stable: allowed
company-experimental-fast: denied
openai: denied
```

## Ordering Across Authored Config Documents

Ordinary settings and policies have different precedence needs:

- Ordinary settings are read forward, so location-specific settings override user-global settings.
- Policies are read by reversing authored config documents, so user-global policy can override repository policy.
- Statements inside each document keep their written order.

At minimum, this means a repository cannot silently re-enable something the user denied globally.

Project config:

```jsonc
{
  "experimental": {
    "policies": [{ "effect": "allow", "action": "provider.use", "resource": "openai" }],
  },
}
```

User-global config:

```jsonc
{
  "experimental": {
    "policies": [{ "effect": "deny", "action": "provider.use", "resource": "openai" }],
  },
}
```

Result:

```text
provider.use / openai -> deny
```

The relative policy precedence of direct project files and `.opencode` files is intentionally deferred until `.opencode` configuration is reviewed.

## Organization-Managed Policy

Organization-managed policy is not ordinary authored config. When implemented, managed statements must be appended after the reversed authored statements so they have final authority.

```text
repository policy -> user-global policy -> organization-managed policy
```

Plugins must not be allowed to add, remove, or override policy statements. Plugins can contribute functionality or configured providers; policy determines whether opencode permits an operation through its managed execution paths.

Provider policy is not a full sandbox for executable plugins. A denied provider must not be usable through the normal provider/model path, but arbitrary plugin code requires separate governance if that becomes a compliance requirement.

## Interaction With Provider Configuration

```jsonc
{
  "providers": {
    "company-ai": {
      "endpoint": {
        "type": "openai/responses",
        "url": "https://ai.company.example/v1/responses",
      },
    },
  },
  "experimental": {
    "policies": [
      { "effect": "deny", "action": "provider.use", "resource": "*" },
      { "effect": "allow", "action": "provider.use", "resource": "company-ai" },
    ],
  },
}
```

The provider entry configures `company-ai`; the policy statements make it the only provider permitted for use.

Provider policy applies regardless of how a provider becomes known or usable, including:

- models.dev catalog data
- environment credentials
- saved accounts
- built-in provider plugins
- explicit provider configuration

## Applying Provider Policy

Provider records and model overrides should be assembled before checking provider policy. Otherwise later provider loading could recreate a provider that was already filtered.

Intended flow:

1. Build provider/model catalog entries.
2. Apply configured provider and model overrides.
3. Ask `Policy.Service` to evaluate `provider.use` for each provider ID.
4. Prevent denied providers from being selectable or used.

Whether denied providers are removed entirely or retained as disabled records for diagnostics remains an implementation decision.

## Legacy Migration

Legacy deny list:

```jsonc
{
  "disabled_providers": ["openai", "google"],
}
```

Equivalent v2 policy:

```jsonc
{
  "experimental": {
    "policies": [
      { "effect": "deny", "action": "provider.use", "resource": "openai" },
      { "effect": "deny", "action": "provider.use", "resource": "google" },
    ],
  },
}
```

Legacy allowlist:

```jsonc
{
  "enabled_providers": ["anthropic", "openai"],
}
```

Equivalent v2 policy:

```jsonc
{
  "experimental": {
    "policies": [
      { "effect": "deny", "action": "provider.use", "resource": "*" },
      { "effect": "allow", "action": "provider.use", "resource": "anthropic" },
      { "effect": "allow", "action": "provider.use", "resource": "openai" },
    ],
  },
}
```


---

# SOURCE: `specs/v2/schema-changelog.md`

# V2 Schema Changelog

## 2026-06-26: Add Finite Session History

- Add `GET /api/session/:sessionID/history` and generated Promise, Effect, and legacy JavaScript client methods.
- Page public durable Session events after an optional exclusive aggregate sequence, with an explicit `hasMore` exhaustion signal.
- Keep aggregate gaps legal, cap pages at 100 events, and preserve the existing durable replay-and-tail `sessions.events()` stream unchanged.
- Add no migration or durable-event version; this is a finite read API over the existing event manifest.

## 2026-06-22: Simplify Session Input Promotion

- Keep `session.next.prompt.admitted.1` as the durable, client-visible record of pending Session input.
- Replace `session.next.prompt.promoted.1` with the existing `session.next.prompted.1` event when input becomes model-visible.
- Preserve the prompt endpoint, admission receipt, idempotency, steer/queue ordering, and atomic user-message projection.
- Reset experimental V2 events, projections, inputs, Context Epochs, and synchronized workspace state while preserving canonical V1 `session`, `message`, and `part` rows.

## 2026-06-22: Reset Unpublished Compaction Event

- Replace the unpublished `session.next.compaction.ended.1` payload with the current checkpoint payload and remove its legacy decoder.
- Reset experimental events, sequences, Session inputs, projected Session messages, Context Epochs, synchronized workspace rows, and Session workspace links.
- Preserve canonical V1 `session`, `message`, and `part` rows.

## 2026-06-22: Make Session Interruption Process-Local

- Remove the unprojected `session.next.interrupt.requested.1` event from the experimental durable Session event union and generated SDK.
- No canonical V1 data requires migration; experimental V2 event history containing the retired event is disposable.

## 2026-06-05: Execute Automatic Session Compaction

- Trigger automatic compaction before provider turns using the complete estimated request and absolute model-aware headroom.
- Preserve the existing structured summary contract and update prior summaries with newly compacted history.
- Store token-bounded recent history as plain serialized text inside the checkpoint instead of replaying provider-native messages.
- Keep compaction starts durable and progress deltas live-only; activate history cutover only from a durable completed summary.
- Store the completed event with the current checkpoint payload containing stable message identity, reason, summary, and recent context.
- Reload the replacement Context Epoch and continue the original pending turn after compaction.
- Preserve full durable history; compaction changes only the active model representation.
- Defer provider-overflow recovery, explicit manual compaction, and deterministic old tool-result pruning.

Record V2 database, durable-event, projected-message, HTTP, and generated SDK schema changes here. Each entry states why the contract changed and whether consumers or stored data need compatibility handling. Commit messages for schema-affecting changes should include the same summary.

This document covers meaningful contract changes introduced on the `feat/opencode-embedded-api` branch since its divergence from `origin/dev`. Mechanical file moves and internal refactors are omitted unless they changed stored data, replay behavior, public HTTP or SDK shapes, or model-facing tool contracts.

## 2026-06-04 Event-Sourced Session Input Cutover

Affected schema:

- `session_input`, `session_message`, `event`, `event_sequence`, and disposable workspace beta storage.
- New synchronized `session.next.prompt.admitted.1` and `session.next.prompt.promoted.1` events.
- Experimental `SessionV2.prompt(...)`, HTTP, and generated SDK admission receipt.

Change:

- Replace inbox-local admission sequence with event-sourced prompt admission and promotion sequences.
- Give projected Session messages stable `msg_*` resource IDs distinct from `evt_*` creator event IDs.
- Give every event that creates a projected transcript resource an explicit `msg_*` resource ID. Assistant steps propagate one `assistantMessageID` through assistant-owned events.
- Reset incompatible unreleased beta event history, derived Session projections, workspace rows, and Session workspace links.

Compatibility:

- The reset preserves canonical V1 `session`, `message`, and `part` rows.
- Existing synchronized workspaces are disposable beta state and are removed by the reset.
- Before starting the new build, discard adapter-managed external workspace resources created by unreleased builds. The SQL migration cannot remove external resources through runtime adapters, and rediscovering retained resources after startup can replay incompatible beta history.
- Exact prompt retries reconcile one stable `msg_*` identity when Session, prompt, and delivery mode match.

## Earlier Branch History

### Replayable Session Event Refinement And Cursor Stream

Affected schema:

- Existing synchronized `session.next.*` event family in `packages/core/src/session/event.ts`.
- Existing projected V2 Session-message union in `packages/core/src/session/message.ts`.
- New explicit durable-event union and internal replay cursor returned by `sessions.events({ sessionID, after? })`.

Change:

- Keep the existing Session lifecycle event family and projected-message union rather than introducing them in this branch.
- Stop synchronizing text deltas, reasoning deltas, and tool-input deltas; keep them explicitly ephemeral.
- Add an explicit durable-event union for replay-safe consumers.
- Add replay-and-tail aggregate cursors backed by durable Session-event sequence.
- Encode synchronized event payloads before writing JSON storage and decode them while replaying so schema transforms remain explicit at the durable boundary.

Reason:

- Embedded Session execution needs a reconnect-safe replay stream over the existing durable log and derived chronological read model.
- Fragment streams are useful to connected renderers but must not advance durable cursors or inflate synchronized storage.

Compatibility:

- The `session.next.*` lifecycle event family predates this branch; this branch refines its experimental V2 durability and replay contracts.
- Durable replay cursors are per-aggregate event sequences; ephemeral deltas are intentionally absent after reconnect.

### Durable Step Settlement Ownership

Affected schema:

- `session.next.step.ended` and `session.next.step.failed` synchronized event version `2`.

Change:

- Bind step settlement to an explicit assistant message ID.

Reason:

- Provider-local call identifiers can repeat across turns.

Compatibility:

- Step settlement uses synchronized event version `2` because the durable payload changed.

### Durable Session Input Inbox

Affected schema:

- New `session_input` table from `20260603141458_session_input_inbox.ts`.
- Updated pending-input index from `20260603160727_jittery_ezekiel_stane.ts`.
- New `SessionInput.Admitted` schema and `Prompted.delivery` field.
- Prompt-admission conflict behavior in `SessionV2.prompt(...)`.

Change:

- Persist admitted prompts before projection with an autoincrement inbox sequence, unique message ID, Session ID, encoded prompt, `steer` or `queue` delivery mode, optional promoted event sequence, and creation time.
- Index pending inputs by Session, promotion state, delivery mode, and admission sequence.

Reason:

- Prompt admission and model-visible promotion must be separate durable operations.
- Steering must promote at safe provider-turn boundaries while queued prompts remain pending in FIFO order until continuation would otherwise end.

Compatibility:

- Database migration creates the inbox table and replaces its first pending index with a delivery-aware index.
- Exact prompt retries are idempotent; reusing a message ID for different input fails.

### Durable Session Projection Order

Affected schema:

- `session_message.seq` from `20260603040000_session_message_projection_order.ts`.
- Session-message and event indexes from `20260603001617_session_message_projection_indexes.ts`, `20260603040000_session_message_projection_order.ts`, and `20260603160727_jittery_ezekiel_stane.ts`.

Change:

- Reset pre-launch Session-message projections and add `session_message.seq` for newly projected synchronized events.
- Add event aggregate-sequence and aggregate-type-sequence indexes.
- Add Session-message sequence, type-sequence, and compatibility timestamp indexes.

Reason:

- Projected history, replay, compaction lookup, and pagination must follow durable aggregate order rather than timestamps or caller-generated IDs.
- Runner and HTTP read paths need covering indexes for their concrete lookup shapes.

Compatibility:

- Pre-launch Session-message projections are disposable because historical versions could write them without durable creator events.
- The migration resets those projections rather than inventing chronology or blocking startup.
- The timestamp compatibility index remains for legacy or transitional query shapes.

### Structured Tool Registry And Canonical Output

Affected schema:

- Core-owned typed tool registry contract.
- Canonical tool output content and structured settlement schemas.
- Canonical tagged tool file sources in `@opencode-ai/llm`.
- Durable tool called, progress, success, and failure events and projected assistant-tool states.

Change:

- Validate model input against each registered tool's parameter schema.
- Validate handler success against each tool's success schema before optional pure model-output lowering.
- Generate optional tool-definition output JSON Schema from typed success schemas.
- Persist canonical structured output and content for running, completed, and failed tools.
- Represent tool files explicitly as inline data, remote URL, or managed file URI sources rather than one ambiguous URI string.

Reason:

- Embedded tool execution needs one typed boundary between provider calls, local side effects, durable settlement, and replay.

Compatibility:

- These are additive experimental V2 runtime contracts.
- Tool results are durably settled before provider continuation.
- Legacy text, JSON, and inline-media results remain convertible; unresolved URL and file sources must be materialized or explicitly rejected before provider lowering.

### Managed Tool-Output Files

Affected schema:

- New optional managed `outputPath` and `outputPaths` fields on tool results and completed Session tool state.
- Absolute managed output paths accepted by ordinary `read` and `grep` inputs.

Change:

- Spill oversized model-facing tool text into globally unique files under OpenCode's shared tool-output directory.
- Include the absolute file path in the bounded preview so ordinary `read`, `grep`, and `bash` operations can inspect it.

Reason:

- Tool results need bounded model context without discarding the full output.
- Filesystem resolution admits only direct generated `tool_*` files from the managed directory, while existing permissions whitelist that directory.

Compatibility:

- Managed output is retained for a bounded period and exposed as a normal host filesystem path.

### Location-Scoped Filesystem Read And Search Contracts

Affected schema:

- Core filesystem read, directory-list, root-resolution, and named-reference inputs.
- `LocationSearch.FilesInput`, `LocationSearch.GrepInput`, and bounded result schemas.
- `read`, `glob`, and `grep` tool parameters and success payloads.

Change:

- Add bounded file reads, paged directory listings, bounded glob results, and bounded grep matches with line previews.
- Allow named project references for read-oriented operations.
- Resolve and pin canonical approved search roots before traversal.
- Exclude hidden path segments from broad V2 glob and grep discovery.

Reason:

- Embedded tools need deterministic bounds and a shared path-containment authority.
- Broad search should not disclose hidden files implicitly.

Compatibility:

- These are additive V2 tool contracts.
- Hidden-file discovery is intentionally narrower than an unconditional ripgrep `--hidden` traversal.

### Location Workspace Identity

Affected schema:

- `Location.Ref.workspaceID`.
- V2 Location HTTP middleware routing.

Change:

- Brand optional Location workspace identity as `WorkspaceV2.ID` instead of an untyped string.
- Preserve nested `location[workspace]` and workspace-header routing inputs while decoding them into the branded identity.

Reason:

- Location-scoped services and embedded routing need one typed workspace identity boundary.

Compatibility:

- Existing workspace strings remain accepted when they satisfy the workspace ID schema.
- Generated OpenAPI reflects the workspace prefix constraint.

### Structured Mutation Authority And File Leaves

Affected schema:

- New `LocationMutation.ResolveInput`, planned target, external-directory authorization, and typed path errors.
- New `write` and exact `edit` tool schemas.
- New internal file-mutation commit service.

Change:

- Resolve relative mutation paths within the active Location.
- Accept absolute internal paths and require explicit `external_directory` approval before leaf approval for external absolute paths.
- Keep named references read-oriented and reject them for mutation.
- Revalidate path authority immediately before write mechanics.

Reason:

- Mutation tools need explicit capability escalation and symlink/path-swap checks without pretending path APIs provide a syscall-level sandbox.

Compatibility:

- These are additive V2 mutation contracts.
- Richer V1 fuzzy edit behavior remains intentionally deferred.

### V2 Permission Requests And Saved Rules

Affected schema:

- `PermissionV2.Request`, `AssertInput`, `ReplyInput`, source metadata, tagged errors, and lifecycle events.
- V2 permission list, reply, and saved-rule HTTP routes and generated SDK schemas.

Change:

- Add Location-scoped pending permission requests with `once`, `always`, and `reject` replies.
- Attach optional originating tool message and call IDs.
- Preserve authored ordered rules and saved approvals as separate inputs to evaluation.
- Establish action and resource conventions for `read`, `glob`, `grep`, `edit`, `external_directory`, `bash`, `todowrite`, and `webfetch` approvals.

Reason:

- Embedded tool calls need a Core-owned authorization boundary that can suspend and resume through HTTP.

Compatibility:

- These are additive experimental V2 contracts.
- Policy authors should account for canonical resource forms; originating tool source metadata remains optional until every registry call carries its durable assistant owner.

### Initial Core V2 Built-In Tool Schemas

Affected schema:

- `read`, `glob`, `grep`, `write`, exact `edit`, `bash`, and `websearch` model-facing tool contracts.

Change:

- Add Core-owned Location-scoped built-ins with explicit parameter and success schemas.
- Bound bash output and timeout input, search result counts and previews, read sizes, directory pages, and websearch result/context controls.

Reason:

- Embedded runner launch requires a minimal typed tool set without importing legacy application orchestration.

Compatibility:

- These are additive V2 built-ins.
- Richer launch-follow-up leaves such as `apply_patch`, skill loading, task dispatch, and LSP remain separate slices.

### Bash Advisory Warnings

Affected schema:

- Optional `warnings` in the `bash` tool success payload.

Change:

- Return advisory warning strings when best-effort command-argument scanning detects external absolute paths; keep structured external `workdir` approval enforced.

Reason:

- A shell subprocess has host-user filesystem, process, and network authority. Token scanning cannot honestly provide containment.

Compatibility:

- Consumers rendering bash success should tolerate optional warning strings.

### V2 Session HTTP And Generated SDK Contracts

Affected schema:

- V2 Session list, prompt, context, message-list, compact, and wait HTTP routes.
- V2 Location query routing fields.
- Generated OpenAPI and JavaScript SDK schemas.

Change:

- Expose embedded Session creation and read-side behavior over the experimental HTTP API.
- Accept optional prompt admission `id`, `delivery`, and `resume` fields so callers can request idempotency, steering or queue semantics, and durable admission without immediate execution.
- Keep message cursors opaque and preserve configured Location routing through both legacy flat and nested `location[...]` query parameters in the V2 SDK client.

Reason:

- Remote and embedded consumers need one generated contract while Location middleware remains compatible with current server routing.

Compatibility:

- These are experimental V2 routes.
- Prompt admission now returns the admitted user-shaped message and may return a conflict error when one message ID is reused for different input.
- SDK Location GET rewriting preserves existing flat query behavior and adds nested compatibility parameters.

## 2026-06-03: Durable Session Message Pagination

Affected schema:

- Internal `SessionV2.messages()` cursor input.
- Opaque cursor payload returned by `GET /api/session/:sessionID/message`.

Change:

- Remove wall-clock `time` from the message cursor payload.
- Resolve the opaque cursor's projected message `id` to its stored `session_message.seq`.
- Apply page boundaries and ordering with durable per-session `seq` rather than `time_created` plus `id`.

Reason:

- Projected V2 message chronology is defined by synchronized Session-event order.
- Wall-clock timestamps may collide or move backwards, so they are not safe pagination boundaries.
- The list endpoint must agree with replay and context loading, which already order by durable sequence.

Compatibility:

- No database migration is required. `session_message.seq` and its session-scoped index already exist.
- The HTTP cursor remains opaque and existing cursors remain usable because they already carry the projected message `id`; older extra `time` data is ignored while decoding.
- No OpenAPI or generated SDK schema changes are required for this pagination correction.

## 2026-06-03: Public Provider And Model Catalog DTOs

Affected schema:

- Responses from `GET /api/provider`, `GET /api/provider/:providerID`, and `GET /api/model`.
- Generated `ProviderV2PublicInfo` and `ModelV2PublicInfo` SDK schemas.

Change:

- Replace internal catalog response schemas with explicit public DTOs.
- Remove provider request headers and bodies, API settings, custom enablement data, model request overrides, and variant request overrides from public responses.

Reason:

- Internal catalog records may contain credentials or provider-specific request material and must not cross the public HTTP serialization boundary.

Compatibility:

- Public V2 catalog responses intentionally expose fewer fields.
- Internal provider and model schemas remain available to the runtime.

## 2026-06-03: Durable Reasoning And Hosted Tool Replay Metadata

Affected schema:

- Durable `session.next.reasoning.started` and `session.next.reasoning.ended` events.
- Durable `session.next.tool.success` and `session.next.tool.failed` events.
- Projected assistant reasoning and settled tool message state.

Change:

- Add optional reasoning `providerMetadata`.
- Add optional durable tool `result` and project it into settled tool message state.
- Preserve projected tool-call metadata separately from optional settlement-result metadata.
- Replay provider-native reasoning and tool metadata only when the historical assistant model matches the selected continuation model.

Reason:

- Provider continuation requires signed or encrypted reasoning metadata on later turns.
- Provider-executed hosted tool results must survive projection so replay can keep hosted calls and results inline in assistant content.
- Recovery settlement must not erase provider-native call metadata needed to reconstruct a valid continuation request.

Compatibility:

- Added durable-event fields are optional so previously recorded experimental events remain decodable.
- Projected settled tool state gains model-facing result data when available.
- Projected assistant tools gain optional result-side provider metadata; the existing metadata slot remains the backward-compatible call-side slot.
- OpenAI Responses lowers reconstructed provider-executed hosted results to stored item references instead of rejecting assistant history.
- Bedrock Converse signatures, Gemini `thoughtSignature`, and OpenAI-compatible Chat `reasoning_content` now round-trip through canonical continuation parts.

## 2026-06-03: Projected Assistant Ownership And Full-Value Parts

Affected schema:

- Projected assistant text parts.
- Durable text and tool lifecycle boundaries.
- Projected assistant tool ownership.

Change:

- Preserve stable IDs on projected assistant text parts.
- Route durable tool projection updates through explicit owning assistant message IDs rather than provider-local call IDs alone.
- Replay full-value text and tool-input end checkpoints while keeping fragment deltas ephemeral.

Reason:

- Provider-local tool call IDs may repeat across turns.
- Durable projection reconstruction must not depend on ephemeral fragments that disappear after reconnect.

Compatibility:

- Earlier experimental projected assistant rows without stable text IDs are not assumed replay-compatible.
- Current V2 histories reconstruct from durable full-value checkpoints.

## 2026-06-03: Location-Scoped V2 Questions

Affected schema:

- New `QuestionV2.*` domain schemas.
- New `question.v2.asked`, `question.v2.replied`, and `question.v2.rejected` events.
- New question list, reply, and reject HTTP routes and generated SDK schemas.

Change:

- Add schemas for pending requests, question options, ordered answers, and tool ownership metadata.
- Add `GET /api/question/request`.
- Add `POST /api/session/:sessionID/question/request/:requestID/reply`.
- Add `POST /api/session/:sessionID/question/request/:requestID/reject`.

Reason:

- Embedded V2 tool execution needs a Location-owned pending-question service whose suspended replies can be settled through HTTP.

Compatibility:

- These are additive experimental V2 contracts.
- No database migration is required because pending questions are intentionally in-memory Location state.

## 2026-06-03: Core-Owned Todo Update Event

Affected schema:

- Core-owned `SessionTodo.Info`.
- Global `todo.updated` event registration.

Change:

- Register the todo update event from Core session-todo ownership and expose the existing todo item shape to the Core V2 tool.

Reason:

- Embedded V2 `todowrite` execution needs Core-owned persistence and update publication without importing legacy application orchestration.

Compatibility:

- The todo table and public todo update event shape are preserved.
- No database migration is required.

## 2026-06-03: Added Core V2 Tool Schemas

Affected schema:

- New `todowrite` tool parameters and success payload.
- New `question` tool parameters and success payload.
- New `webfetch` tool parameters and success payload.

Change:

- Add a todo replacement-list tool using `SessionTodo.Info` items.
- Add a question tool using ordered `QuestionV2.Prompt` values and ordered answer arrays.
- Add an HTTP(S) fetch tool with explicit `text`, `markdown`, and `html` formats, bounded timeout input, and optional managed output resource metadata.

Reason:

- Embedded V2 execution needs Core-owned built-ins rather than imports from legacy application orchestration.
- Explicit schemas keep model-facing definitions, runtime validation, and durable tool settlement aligned.

Compatibility:

- These are additive Location-scoped V2 built-ins.
- No database migration or public HTTP API migration is required.

## 2026-06-03: Conditional File-Mutation Stale Error

Affected schema:

- New internal `FileMutation.StaleContentError` tagged error.

Change:

- Add a typed error carrying the mutation target path when an approved exact edit no longer matches the bytes at commit time.

Reason:

- V2 exact edits must fail rather than stale-clobber a concurrent cooperating write after permission approval.

Compatibility:

- This is an additive internal error contract.
- No database, HTTP, or generated SDK schema changes are required.

## 2026-06-03: Provider Stream Watchdog Policy Deferred

Affected schema:

- No database, durable-event, HTTP, or generated SDK schema changes.
- Internal Session-runner provider-stream policy.

Change:

- Do not impose a universal provider-stream inactivity or absolute timeout.
- Remove the internal timeout error and hardcoded watchdog service.
- Defer provider timeout, retry, watchdog, durable failure-reporting, and drain-chain-release policy to a configurable design slice.

Reason:

- V1 had no universal processor inactivity watchdog.
- Providers and autonomous workloads have different runtime characteristics, so one hardcoded default is premature.

Compatibility:

- No migration or generated artifact regeneration is required.
- Embedded runner callers do not receive a runner-defined provider-stream timeout error.

## 2026-06-03: Keyed Coalescing Durable Tail Signals

Affected schema:

- No database, durable-event, HTTP, or generated SDK schema changes.
- Internal durable aggregate-tail wake delivery only.

Change:

- Replace the process-global unbounded aggregate-ID PubSub with one sliding-capacity-1 dirty signal per active tail and aggregate.
- Subscribe and register the signal before historical SQLite replay, then remove it when the tail closes.
- Re-query durable rows after each dirty edge and advance only by persisted aggregate sequence.

Reason:

- Wake notifications are advisory edges, not durable event payloads.
- Slow consumers should not retain an unbounded number of redundant wake IDs when one SQLite query can recover every committed row after their cursor.
- Per-tail signaling preserves independent cursors for multiple consumers of the same aggregate.

Compatibility:

- No migration, synchronized event version, OpenAPI, or SDK regeneration is required.
- `sessions.events({ sessionID, after? })` remains a replay-and-tail stream of every durable event in aggregate sequence order.

## 2026-06-03: Sequential V2 Apply Patch Tool

Affected schema:

- New Core-owned `apply_patch` model-facing tool parameters and success payload.
- New Core-owned pure patch hunk representation for add, update, and delete operations.

Change:

- Accept `{ patchText: string }` using the `*** Begin Patch` envelope.
- Return ordered applied-operation records carrying `type`, canonical `target`, and permission-facing `resource`.
- Resolve and approve every target before reading approved update/delete contents.
- Preflight update/delete correctness before committing operations sequentially.
- Report already-applied resources explicitly when a later commit fails.

Reason:

- Embedded V2 agents need reviewable multi-file edits without importing legacy application orchestration into Core.
- Sequential semantics are small and honest: they avoid claiming rollback or transactionality that path-based filesystem commits do not provide.

Compatibility:

- This is an additive model-facing V2 tool contract.
- Moves and atomic rollback are deliberately unsupported in the first slice and remain visible follow-ups.
- No database migration, durable-event version, public HTTP, OpenAPI, or generated SDK change is required.

## 2026-06-03: Embedded Local-Tool Recovery Alignment

Affected schema:

- No database, durable-event, HTTP, or generated SDK schema changes.
- Internal runner recovery and permission evaluation behavior only.

Change:

- Evaluate permissions through the default `build` agent when a Session omits an explicit agent, matching provider-turn execution.
- Before assembling a provider request, durably fail local tools still projected as `running` from a previous process with the existing `session.next.tool.failed` shape and `Tool execution interrupted` message.

Reason:

- Agent-less embedded Sessions previously executed as `build` while evaluating an empty permission ruleset, so the first local tool could wait forever for an approval surface the local Discord proof did not expose.
- A process lost while a local tool was running previously left a dangling tool call that made later provider continuation invalid. Recovery must settle the durable projection without replaying an abandoned side effect.

Compatibility:

- No migration, synchronized event version, OpenAPI, or SDK regeneration is required.
- Existing experimental Session databases recover dangling local-tool projections on the next provider attempt.

## 2026-06-03: V2 Skill Tool

Affected schema:

- New Core-owned `skill` model-facing tool parameters and success payload.
- Existing upstream `SkillV2` service remains the single Location-scoped skill registry.

Change:

- Accept `{ name: string }` for one skill selected from the upstream-discovered Location skill list.
- Assert `skill` permission for the selected name.
- Return V1-shaped `<skill_content name="...">` model output with the skill base directory and a bounded sampled supporting-file list.

Compatibility:

- This is an additive model-facing V2 tool contract.
- No database migration, durable-event version, public HTTP, OpenAPI, or generated SDK change is required.

## 2026-06-03: Pre-PR V2 Safety Review

Affected schema:

- V2 OpenAPI request bodies preserve requiredness instead of inheriting legacy optional-body normalization.
- Existing durable tool-failure and replay-owner schemas are reused without version changes.

Change:

- Fence replay envelopes whose aggregate ID differs from the decoded synchronized payload and persist owner claims when replay first adopts an existing unowned aggregate.
- Settle abandoned local and provider-executed tools durably before continuation; hosted failures preserve inline provider-executed replay.
- Give `apply_patch` add hunks create-only semantics, make sequential commits uninterruptible after preflight, and reject malformed patch grammar eagerly.
- Wait for initial plugin boot before materializing the `skill` built-in, discover conventional config-root skill directories, and resolve current skills again during execution.
- Sanitize provider and model public API URLs by stripping credentials, queries, and fragments.
- Keep V1-like `webfetch` network semantics: approve the requested HTTP(S) URL, allow ordinary hostnames, and delegate redirects to the HTTP transport.
- Keep V2 request bodies required in generated OpenAPI and SDK types.

Compatibility:

- No database migration is required.
- Pre-launch `session.next.*` databases remain disposable experimental state rather than compatibility targets; reset experimental V2 data when upgrading across incompatible event-schema iterations.
- V1 returns fetched images as attachments. The first Core V2 typed settlement remains text-only, so V2 continues to reject fetched images and other non-text files until attachment settlement is designed explicitly.

## 2026-06-03: Defer V2 Bash Background Execution

Affected schema:

- Core V2 model-facing `bash` tool parameters and success payload.

Change:

- Remove the optional `background` bash parameter and process-local background settlement shape from the shipped tool.
- Retain the internal `BackgroundJob` prototype for a later integration slice.

Reason:

- The model has no registered observation or cancellation tool for background bash jobs, and process-local status is not a sufficient remote contract.

Compatibility:

- Foreground V2 bash execution is unchanged.
- Reintroduce background bash only with durable status observation, completion delivery, and explicit cancellation semantics.

## 2026-06-18: Remove Bash Description Input

Affected schema:

- V1 and Core V2 model-facing `bash` tool parameters.

Change:

- Remove the V1 required and V2 optional `description` parameter.
- Derive shell presentation from the command or a generic shell label instead of model-authored description metadata.

Compatibility:

- Existing persisted tool calls may still contain `description`, but new tool definitions no longer expose or require it.
- Shell command execution behavior is unchanged.

## 2026-06-04: Add Durable Session Context Snapshots

Affected schema:

- Add `session_context_epoch` for one active immutable baseline string, structured JSON snapshot, and baseline sequence per Session.

Change:

- Lazily initialize one durable Context Epoch snapshot at the first safe provider-turn boundary.
- Lower its exact baseline string through `LLMRequest.system` for every provider turn in the epoch.
- Reuse the stored baseline verbatim after restart or producer changes instead of resampling privileged initial context.
- Compare later observations against an overwriteable codec-encoded structured snapshot rather than rendered-text hashes.
- Expose admitted chronological context as first-class `system` Session messages while keeping the active baseline in bounded context state.

Compatibility:

- The unpublished Context Epoch schema is consolidated into one database migration; baseline and structured snapshots are operational state rather than synchronized event history.
- Existing experimental V2 Session databases remain disposable across incompatible pre-launch event-schema changes.
- Chronological context updates, replacement epochs after compaction or model switches, project instructions, skills guidance, and plugin transforms remain follow-up slices.

## 2026-06-04: Admit Chronological Session Context Updates

Affected schema:

- Add synchronized `session.next.context.updated.1` Session events containing a durable System-message ID and only exact combined model-visible text.
- Add `session_context_epoch.revision` for transactional structured-snapshot advancement.
- Add the first-class `system` Session message projection for chronological context updates.

Change:

- Reconcile Location-scoped Context Sources at each safe provider-turn boundary using one coherent observation.
- Keep the stored baseline immutable while admitting changed source renderings as chronological `Message.system(...)` history.
- Advance the overwriteable structured snapshot atomically with the rendered System-message event.
- Emit the previously stored model-meaningful removal rendering when a source is removed.
- Reject chronological system updates that would split a local tool call from its result across provider protocols; use wrapped user fallback when Anthropic native system-update placement is unsupported.

Compatibility:

- The synchronized event log retains only text actually shown to the model, not internal structured snapshots.
- Existing experimental V2 Session databases remain disposable across incompatible pre-launch event-schema changes.
- Replacement epochs after compaction or model switches, skills guidance, and plugin-defined context remain follow-up slices.

## 2026-06-04: Replace Session Context Epochs Lazily

Affected schema:

- Add nullable `session_context_epoch.replacement_seq` for idempotent lazy replacement requests.

Change:

- Mark the active Context Epoch for replacement after a model switch or completed compaction projection.
- Persist the triggering aggregate sequence so same-target replay cannot reopen an already-settled replacement.
- Render and overwrite the fresh immutable baseline and structured snapshot lazily at the next safe provider-turn boundary.
- Exclude chronological System messages from earlier epochs when assembling active provider history.

Compatibility:

- Baseline replacement is bounded operational state and does not add permanent synchronized events.
- Existing experimental V2 Session databases remain disposable across incompatible pre-launch event-schema changes.
- Compaction execution, skills guidance, and plugin-defined context remain follow-up slices.

## 2026-06-05: Register Ambient System Context Producers

Affected schema:

- No database schema changes.

Change:

- Replace the Session-specific context loader with a Location-scoped registry of stable-keyed scoped context producers.
- Register environment/date and ambient instruction producers independently, then evaluate producers concurrently in stable contribution-key order.
- Directly discover and read global plus upward project `AGENTS.md` files at each safe provider-turn boundary.
- Preserve admitted instructions across transient scan/read failures and block first-epoch initialization while any context source is unavailable.
- Retry Context Epoch preparation until stable after optimistic revision mismatches.
- Clear the active Context Epoch when a Session moves so the destination initializes a complete baseline before promoting more input.
- Fence Context Epoch initialization against the authoritative Session Location so a concurrent old-Location runner cannot recreate stale privileged context after a move.
- Canonicalize ambient instruction traversal boundaries, honor `OPENCODE_DISABLE_PROJECT_CONFIG`, and make non-empty aggregate updates explicitly supersede previously loaded instructions.

Compatibility:

- Watcher-backed per-file `Refreshable` instruction observations, configured sources, nested discovery, and plugin-defined context remain follow-up slices.

## 2026-06-05: Admit Selected-Agent Skill Guidance

Affected schema:

- Add `session_context_epoch.agent` so each durable baseline records its owning effective agent.
- No synchronized event, public HTTP API, or generated SDK schema changes.

Change:

- Compose selected-agent, permission-filtered available-skill guidance with Location-wide System Context before Context Epoch admission.
- Keep skill bodies behind the existing permission-checked `skill` tool and remove the unfiltered skill list from its Location-wide definition.
- Stop missing-skill errors from enumerating the unfiltered Location-wide skill catalog.
- Bind local tool authorization and pending permission requests to the provider turn's effective agent.
- Keep absolute skill locations out of available-skill guidance; expose body and location only through the permission-checked `skill` tool.
- Request Context Epoch replacement after an agent switch, dynamically re-observe the effective agent during retries, and fence first-epoch creation against the authoritative effective agent.
- Fence existing-epoch replacement against the authoritative effective agent and block cross-agent provider turns while replacement context is unavailable.
- Group the System Context algebra, registry, and built-ins under `system-context/`; keep source producers and Context Epoch persistence with their owning Skill, instruction, and Session modules; rename projected conversation selection to Session History.
- Add the canonical V1-to-V2 runtime-context parity checklist to `specs/v2/session.md`.

Compatibility:

- Existing Context Epoch rows backfill the default `build` agent and reconcile to another selected agent at the next safe provider-turn boundary.

## 2026-06-22: Simplify Session Context Rebaselining

Affected schema:

- Remove `session_context_epoch.agent`, `session_context_epoch.replacement_seq`, and `session_context_epoch.revision`.
- No synchronized event, public HTTP API, or generated SDK schema changes.

Change:

- Sample the effective agent and model once for each provider turn; selection changes apply to the next turn.
- Preserve the immutable baseline and admit ordinary System Context changes as chronological `ContextUpdated` messages.
- Rebuild the baseline directly after completed compaction instead of maintaining pending replacement state.
- Preserve the old baseline and its effective chronological updates while a post-compaction baseline cannot be rendered completely.
- Rely on the process-local Session execution lane instead of optimistic concurrency state between Context Epoch writers.

Compatibility:

- Existing Context Epoch rows migrate in place by dropping the obsolete selection and pending-replacement columns.
- Model and agent switches no longer discard earlier chronological System Context updates by forcing a new baseline.


---

# SOURCE: `specs/v2/todo.md`

# TODO

ok we need to work towards a launch of v2 so we can get out of this rebuild phase

## Post-Hono cleanup - Kit

The opencode server has moved to the Effect HttpApi backend. Remaining work is
mostly cleanup: delete compatibility shims, shrink Zod surfaces, and simplify
test harnesses that used to compare Hono and HttpApi behavior.

## New Data Mode - Dax

This is mostly done. I'm working through modeling subagents, skill invocations
and shell commands.

## Rework agent loop - Kit?

The first Effect-native local runner slice is implemented without bridging
through legacy `SessionPrompt.loop(...)`:

- process-global `SessionExecution.resume(sessionID)` discovers Location from
  the Session read model
- cached Location-scoped `SessionRunner` resolves one supported catalog model
  and issues one explicit `llm.stream(request)` provider turn at a time
- durable V2 projections record text, reasoning, provider failures, tool calls,
  tool results, and assistant output
- a scoped `ToolRegistry` advertises definitions and the first permission-checked
  `read` built-in
- local continuation reloads projected history, and promoting new user input resets the selected agent's configured provider-turn allowance
- concurrent resumes for one Session join one process-local run while different
  Sessions remain concurrent

Prompt admission now uses a durable `session_input` inbox rather than immediate
transcript projection. `steer` inputs promote at the next safe provider-turn
boundary while the current drain requires continuation. `queue` inputs remain in
a FIFO until the Session would otherwise become idle and then promote one at a time.

Next reviewed slices:

- preserve eager structured local-tool settlement: durably record each complete
  call, start its child execution immediately, await every settlement after the
  provider turn closes, then reload projected history once
- revisit per-turn tool-call limits, output truncation, and operational
  backpressure before broadening exposure; eager local execution is deliberately
  unbounded in the current local slice while SQLite publication stays serialized
- remove the public in-memory `@opencode-ai/llm` tool loop after replacing its
  remaining one-turn native-adapter use with a narrow typed dispatcher
- batch streamed deltas and add covering context indexes
- expose replayable Session event cursors over HTTP and the generated SDK where remote consumers need them
- integrate the new BackgroundJob service with V2 tool execution: support background
  bash jobs and background agent dispatch with durable status observation,
  completion delivery, and explicit cancellation / continuation semantics
- add durable/clustered interruption, retries, and stale-owner fencing only as
  their slices become concrete

### Deferred durable continuation recovery

Do not infer that ambiguous provider work is safe to retry from an advisory wake.
The first inbox-driven runner intentionally omits outer provider-attempt markers
until they have a concrete consumer and a complete recovery policy.

Design post-crash continuation recovery as one explicit slice. It should model:

- promoted input and projected-history state
- queued-input promotion and steering assignment
- provider-attempt preparation versus provider-dispatch ambiguity
- required post-tool continuation across process loss
- explicit `retry` and `abandon` decisions for unknown outcomes
- bounded automatic retry only where provider and tool idempotency make it safe
- retry budget, backoff, visible recovery status, startup discovery, and future
  clustered ownership fencing

Do not introduce an enclosing durable execution identity solely to group these
facts; a process-local Session drain has no durable transcript boundary.

## Plugin API design - James?

We need to figure out how we want server plugins to work and what hooks are useful.

Some ideas:

- plugins get immer drafts so bad mutations can be thrown away
- plugins get global "opencode" instance like in that post i showed
- opencode instance has stuff like `opencode.session.prompt()` or
  `opencode.tool.register({...})`

## Rework Config - ???

We should do another pass on config to clean up any mistakes we made with it and
simplify as much as possible. Old configs should get auto-converted to new

## Auth - ???

I have a basic auth system that can track any kind of auth, not just providers

## Model Database - ???

I have a basic model service that allows for models to be registered dynamically

## Provider - ???

Providers should register as plugins and autoload based on whatever logic they
want / config. They should register models into model database

## Event - Kit

The self-contained durable `EventV2` core service is implemented. It owns
sync-versioned persistence, transactional sequencing, pub/sub, replay, and
replay-owner claims without relying on the old bus system.

Remaining slices:

- expose the embedded consumer-facing Session cursor API over HTTP and the
  generated SDK where remote consumers need it
- keep replay-owner claims distinct from future clustered Session execution
  ownership and stale-runtime fencing

## Deferred hardening cleanup

Keep these visible, but do not block functionality slices on them unless a concrete
failure appears during canary work:

- serialize database migration claiming across processes; current migration
  application is protected only by an in-process semaphore, so two processes
  starting against one SQLite database can still race
- simplify process-local durable-tail wake lifecycle with Effect `RcMap` and one
  shared `PubSub.sliding<void>(1)` per active aggregate; keep SQLite cursor replay
  and subscribe-before-history semantics unchanged
- page large durable aggregate replay reads instead of loading every row after a
  stale cursor into one array
- decide whether connected tails need a periodic polling fallback for
  cross-process SQLite writers; current advisory wakes are intentionally
  process-local
- stream-cap websearch body collection before parsing
- add ripgrep execution timeout and bounded line framing
- materialize or consistently reject unresolved URL and file attachment sources
- decide stateless OpenAI Responses hosted-tool continuation behavior; reconstructed hosted output can replay as a stored `item_reference` when `store !== false`, while `store: false` intentionally omits the unavailable reference path
- decide whether to preserve deprecated `@opencode-ai/llm` orchestration exports
- preserve or alias renamed filesystem SDK generated type names if compatibility
  consumers require them
- revisit syscall-level mutation confinement for hostile external processes
  (`openat`, `O_NOFOLLOW`, and descriptor-relative mutation where supported)

## Everything is hotreloadable - ???

Instead of needing to tear down things when something changes every service should emit granular events so services can react to them and reconfigure themselves. Allows frontend to receive these too, eg model.added. also prevents startup from blocking


---

# SOURCE: `specs/v2/api.html`

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>opencode v2 API</title>
    <style>
      :root {
        --bg: #f6f1e8;
        --fg: #1f2723;
        --muted: #6f756d;
        --dim: #ebe3d6;
        --panel: #fffaf1;
        --line: #26342f;
        --thin: #d6ccbd;
        --code: #eee5d8;
        --accent: #496b5a;
        --accent-soft: #dce7dc;
        font-family:
          Inter,
          ui-sans-serif,
          system-ui,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif;
      }

      * {
        box-sizing: border-box;
      }

      html {
        background: var(--bg);
        color: var(--fg);
      }

      body {
        margin: 0;
        background:
          radial-gradient(circle at 12% 0%, rgba(73, 107, 90, 0.12), transparent 34rem),
          linear-gradient(90deg, rgba(38, 52, 47, 0.055) 1px, transparent 1px),
          linear-gradient(rgba(38, 52, 47, 0.045) 1px, transparent 1px), var(--bg);
        background-size: 72px 72px;
        color: var(--fg);
        line-height: 1.5;
      }

      main {
        width: 100%;
        padding: 40px 32px 72px;
      }

      header {
        display: grid;
        grid-template-columns: minmax(0, 1.25fr) minmax(360px, 0.75fr);
        gap: 32px;
        align-items: end;
        border-bottom: 2px solid var(--line);
        padding-bottom: 32px;
      }

      h1,
      h2,
      h3,
      p {
        margin: 0;
      }

      h1 {
        max-width: 1180px;
        font-size: clamp(4rem, 12vw, 13rem);
        line-height: 0.82;
        letter-spacing: -0.09em;
      }

      h2 {
        font-size: clamp(1.75rem, 4vw, 4rem);
        line-height: 0.95;
        letter-spacing: -0.07em;
      }

      h3 {
        font-size: 0.78rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      code,
      pre {
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
      }

      code {
        border: 1px solid var(--thin);
        padding: 1px 5px;
        background: var(--code);
        color: var(--fg);
        font-size: 0.9em;
      }

      pre {
        overflow: auto;
        margin: 0;
        border: 1px solid var(--line);
        padding: 16px;
        background: var(--code);
        color: var(--fg);
        font-size: 0.92rem;
        line-height: 1.5;
      }

      pre code {
        border: 0;
        padding: 0;
        background: transparent;
        font-size: inherit;
      }

      section {
        margin-top: 34px;
      }

      .eyebrow {
        display: inline-block;
        border: 1px solid var(--line);
        margin-bottom: 18px;
        padding: 5px 8px;
        font-size: 0.78rem;
        font-weight: 800;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .lede {
        max-width: 620px;
        color: var(--muted);
        font-size: 1.15rem;
      }

      .panel {
        border: 2px solid var(--line);
        background: rgba(255, 250, 241, 0.92);
        box-shadow: 0 20px 50px rgba(31, 39, 35, 0.08);
      }

      .panel-pad {
        padding: 22px;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        gap: 18px;
      }

      .span-12 {
        grid-column: span 12;
      }

      .span-8 {
        grid-column: span 8;
      }

      .span-6 {
        grid-column: span 6;
      }

      .span-4 {
        grid-column: span 4;
      }

      .stack {
        display: grid;
        gap: 16px;
      }

      .muted {
        color: var(--muted);
      }

      .rule {
        display: grid;
        gap: 16px;
        border: 2px solid var(--line);
        padding: 22px;
        background: var(--accent);
        color: #fffaf1;
      }

      .rule strong {
        font-size: clamp(1.45rem, 3vw, 2.45rem);
        line-height: 1;
        letter-spacing: -0.06em;
      }

      .rule code {
        border-color: var(--bg);
        background: rgba(255, 250, 241, 0.18);
        color: #fffaf1;
      }

      .key {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .pill {
        display: inline-flex;
        align-items: center;
        width: fit-content;
        border: 1px solid var(--line);
        padding: 4px 8px;
        background: var(--panel);
        color: var(--fg);
        font-size: 0.75rem;
        font-weight: 900;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .pill.inverse {
        background: var(--accent);
        color: #fffaf1;
      }

      .diagram {
        display: block;
        width: 100%;
        height: auto;
        border: 2px solid var(--line);
        background: var(--panel);
      }

      .diagram text {
        fill: var(--fg);
        font-family:
          Inter,
          ui-sans-serif,
          system-ui,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif;
      }

      .diagram .box {
        fill: var(--panel);
        stroke: var(--fg);
        stroke-width: 2;
      }

      .diagram .fill {
        fill: var(--accent);
        stroke: var(--accent);
        stroke-width: 2;
      }

      .diagram .fill-text {
        fill: #fffaf1;
      }

      .diagram .line {
        stroke: var(--fg);
        stroke-width: 2;
        fill: none;
        marker-end: url(#arrow);
      }

      table {
        width: 100%;
        border-collapse: collapse;
        border: 2px solid var(--line);
        background: var(--panel);
      }

      th,
      td {
        border: 1px solid var(--thin);
        padding: 11px 12px;
        text-align: left;
        vertical-align: top;
      }

      th {
        border-bottom: 2px solid var(--line);
        background: var(--accent);
        color: #fffaf1;
        font-size: 0.75rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      td.route {
        width: 34%;
        white-space: nowrap;
      }

      td.body {
        width: 28%;
      }

      td.body code {
        display: block;
        white-space: pre-wrap;
        line-height: 1.45;
      }

      td.method {
        width: 72px;
        font-weight: 900;
        letter-spacing: 0.06em;
      }

      td.context {
        width: 150px;
      }

      td.operation {
        width: 210px;
        white-space: nowrap;
      }

      .context-tag {
        display: inline-block;
        border: 1px solid var(--line);
        padding: 3px 7px;
        font-size: 0.72rem;
        font-weight: 900;
        letter-spacing: 0.07em;
        text-transform: uppercase;
      }

      tr.question-row td {
        background: #f7e8b7;
      }

      .request {
        background: var(--accent);
        color: #fffaf1;
      }

      .session {
        background: var(--panel);
        color: var(--fg);
      }

      .server {
        background: var(--dim);
        color: var(--fg);
      }

      .note {
        border-left: 6px solid var(--line);
        padding: 14px 18px;
        background: var(--dim);
      }

      .toc {
        display: grid;
        gap: 8px;
      }

      .toc a {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        border-bottom: 1px solid var(--thin);
        padding: 8px 0;
        color: var(--fg);
        text-decoration: none;
      }

      .toc span {
        color: var(--muted);
      }

      @media (max-width: 980px) {
        main {
          padding: 28px 16px 56px;
        }

        header,
        .grid {
          grid-template-columns: 1fr;
        }

        .span-12,
        .span-8,
        .span-6,
        .span-4 {
          grid-column: 1 / -1;
        }

        table {
          display: block;
          overflow-x: auto;
          white-space: nowrap;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <header>
        <div>
          <div class="eyebrow">opencode v2</div>
          <h1>API map</h1>
        </div>
        <div class="stack">
          <p class="lede">
            A single <code>/api</code> route surface for simple clients and multi-directory frontends. The important
            design question is not route nesting; it is where runtime context comes from.
          </p>
          <div class="key">
            <span class="pill">Server scoped</span>
            <span class="pill inverse">Request context</span>
            <span class="pill">Session pinned</span>
          </div>
        </div>
      </header>

      <section class="grid">
        <article class="span-8 rule">
          <strong
            >Everything has one canonical route. Some routes are server-scoped; runtime routes use context; session item
            routes use the session.</strong
          >
          <p>
            Server-scoped routes manage the whole server: projects, workspace lifecycle, and auth accounts. Runtime
            context is for anything resolved from an active directory, including config, provider capabilities, tools,
            files, and VCS.
          </p>
        </article>
        <nav class="span-4 panel panel-pad toc" aria-label="Page sections">
          <a href="#context"><strong>Context Model</strong><span>how calls resolve</span></a>
          <a href="#endpoints"><strong>Endpoint Inventory</strong><span>all planned routes</span></a>
          <a href="#events"><strong>Events</strong><span>one envelope</span></a>
          <a href="#store"><strong>Frontend Store</strong><span>sync model</span></a>
        </nav>
      </section>

      <section id="context" class="grid">
        <div class="span-12 stack">
          <h2>Context Model</h2>
          <svg class="diagram" viewBox="0 0 1280 360" role="img" aria-labelledby="ctx-title ctx-desc">
            <title id="ctx-title">API context resolution</title>
            <desc id="ctx-desc">
              Non-session routes resolve from request context, session item routes resolve from session storage.
            </desc>
            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                <path d="M0,0 L0,6 L9,3 z" fill="#26342f" />
              </marker>
            </defs>

            <rect class="fill" x="34" y="44" width="294" height="96" />
            <text class="fill-text" x="58" y="84" font-size="24" font-weight="900">Non-session route</text>
            <text class="fill-text" x="58" y="116" font-size="17">/api/file, /api/vcs/status</text>
            <path class="line" d="M328 92 H472" />
            <rect class="box" x="486" y="44" width="286" height="96" />
            <text x="510" y="84" font-size="24" font-weight="900">Request context</text>
            <text x="510" y="116" font-size="17">query params or default runtime</text>
            <path class="line" d="M772 92 H916" />
            <rect class="box" x="930" y="44" width="316" height="96" />
            <text x="954" y="84" font-size="24" font-weight="900">Runtime context</text>
            <text x="954" y="116" font-size="17">directory + workspaceID?</text>

            <rect class="box" x="34" y="220" width="294" height="96" />
            <text x="58" y="260" font-size="24" font-weight="900">Session item route</text>
            <text x="58" y="292" font-size="17">/api/session/:id/prompt</text>
            <path class="line" d="M328 268 H472" />
            <rect class="fill" x="486" y="220" width="286" height="96" />
            <text class="fill-text" x="510" y="260" font-size="24" font-weight="900">Session row</text>
            <text class="fill-text" x="510" y="292" font-size="17">contains pinned context</text>
            <path class="line" d="M772 268 H916" />
            <rect class="box" x="930" y="220" width="316" height="96" />
            <text x="954" y="260" font-size="24" font-weight="900">Runtime context</text>
            <text x="954" y="292" font-size="17">directory + workspaceID?</text>
          </svg>
        </div>

        <article class="span-6 panel panel-pad stack">
          <h3>Request-context calls</h3>
          <p class="muted">
            These calls operate against a directory, optionally through a workspace. Simple clients omit context and use
            the default runtime.
          </p>
          <pre><code>GET /api/fs/tree?path=.&directory=/repo/app&workspace=ws_123</code></pre>
        </article>

        <article class="span-6 panel panel-pad stack">
          <h3>Session-pinned calls</h3>
          <p class="muted">
            These calls never take request context. The session is already pinned to the directory and workspace it was
            created in.
          </p>
          <pre><code>POST /api/session/ses_123/prompt

// server resolves
sessionID -&gt; { directory, workspaceID? }</code></pre>
        </article>
      </section>

      <section id="endpoints" class="grid">
        <div class="span-12 stack">
          <h2>Operation Inventory</h2>
          <p class="muted">
            The SDK is the source of truth. HTTP routes are mounts for RPC-style operations.
            <span class="context-tag server">server</span> operations do not use runtime context.
            <span class="context-tag request">request</span> operations use request/default runtime context from
            <code>directory</code> and <code>workspace</code> query parameters.
            <span class="context-tag session">session</span> operations use pinned session context and should not accept
            context input.
          </p>
        </div>

        <article class="span-12 panel panel-pad stack">
          <table>
            <thead>
              <tr>
                <th>Operation</th>
                <th>Input</th>
                <th>Context</th>
                <th>HTTP mount</th>
                <th>Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="operation"><code>agent.list</code></td>
                <td class="body"><code>{}</code></td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>GET /api/agent</code></td>
                <td>Available agents.</td>
              </tr>
              <tr>
                <td class="operation"><code>auth.activate</code></td>
                <td class="body"><code>{ accountID: AccountID }</code></td>
                <td><span class="context-tag server">server</span></td>
                <td class="route"><code>POST /api/auth/:accountID/activate</code></td>
                <td>Set the account as active for its service.</td>
              </tr>
              <tr>
                <td class="operation"><code>auth.create</code></td>
                <td class="body">
                  <code
                    >{ serviceID: ServiceID credential: | { type: "oauth", refresh: string, access: string, expires:
                    number } | { type: "api", key: string, metadata?: Record&lt;string, string&gt; } description?:
                    string active?: boolean }</code
                  >
                </td>
                <td><span class="context-tag server">server</span></td>
                <td class="route"><code>POST /api/auth</code></td>
                <td>Create an auth account.</td>
              </tr>
              <tr>
                <td class="operation"><code>auth.delete</code></td>
                <td class="body"><code>{ accountID: AccountID }</code></td>
                <td><span class="context-tag server">server</span></td>
                <td class="route"><code>DELETE /api/auth/:accountID</code></td>
                <td>Remove an auth account.</td>
              </tr>
              <tr>
                <td class="operation"><code>auth.get</code></td>
                <td class="body"><code>{ accountID: AccountID }</code></td>
                <td><span class="context-tag server">server</span></td>
                <td class="route"><code>GET /api/auth/:accountID</code></td>
                <td>Get one auth account.</td>
              </tr>
              <tr>
                <td class="operation"><code>auth.list</code></td>
                <td class="body"><code>{ serviceID?: ServiceID }</code></td>
                <td><span class="context-tag server">server</span></td>
                <td class="route"><code>GET /api/auth</code></td>
                <td>List saved auth accounts. Response includes active account mapping.</td>
              </tr>
              <tr>
                <td class="operation"><code>auth.update</code></td>
                <td class="body">
                  <code
                    >{ accountID: AccountID description?: string credential?: | { type: "oauth", refresh: string,
                    access: string, expires: number } | { type: "api", key: string, metadata?: Record&lt;string,
                    string&gt; } }</code
                  >
                </td>
                <td><span class="context-tag server">server</span></td>
                <td class="route"><code>PATCH /api/auth/:accountID</code></td>
                <td>Update account description or credential.</td>
              </tr>
              <tr>
                <td class="operation"><code>catalog.model.get</code></td>
                <td class="body"><code>{ providerID: ProviderID modelID: ModelID }</code></td>
                <td><span class="context-tag server">server</span></td>
                <td class="route"><code>GET /api/catalog/model/:providerID/:modelID</code></td>
                <td>Get one catalog model.</td>
              </tr>
              <tr>
                <td class="operation"><code>catalog.model.list</code></td>
                <td class="body"><code>{}</code></td>
                <td><span class="context-tag server">server</span></td>
                <td class="route"><code>GET /api/catalog/model</code></td>
                <td>List flattened catalog models.</td>
              </tr>
              <tr>
                <td class="operation"><code>command.list</code></td>
                <td class="body"><code>{}</code></td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>GET /api/command</code></td>
                <td>Available commands.</td>
              </tr>
              <tr>
                <td class="operation"><code>config.get</code></td>
                <td class="body"><code>{}</code></td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>GET /api/config</code></td>
                <td>Resolved config.</td>
              </tr>
              <tr>
                <td class="operation"><code>config.update</code></td>
                <td class="body"><code>{ config: Config }</code></td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>PATCH /api/config</code></td>
                <td>Update config.</td>
              </tr>
              <tr>
                <td class="operation"><code>event.subscribe</code></td>
                <td class="body"><code>{}</code></td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>GET /api/event</code></td>
                <td>Server-sent events for the resolved runtime context.</td>
              </tr>
              <tr>
                <td class="operation"><code>formatter.status</code></td>
                <td class="body"><code>{}</code></td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>GET /api/formatter</code></td>
                <td>Formatter status.</td>
              </tr>
              <tr>
                <td class="operation"><code>fs.file</code></td>
                <td class="body"><code>{ path: string }</code></td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>GET /api/fs/file</code></td>
                <td>Read one file.</td>
              </tr>
              <tr>
                <td class="operation"><code>fs.grep</code></td>
                <td class="body"><code>{ pattern: string include?: string limit?: number }</code></td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>POST /api/fs/grep</code></td>
                <td>Search file contents.</td>
              </tr>
              <tr>
                <td class="operation"><code>fs.search</code></td>
                <td class="body"><code>{ query: string type?: "file" | "directory" limit?: number }</code></td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>POST /api/fs/search</code></td>
                <td>Search paths by name.</td>
              </tr>
              <tr>
                <td class="operation"><code>fs.tree</code></td>
                <td class="body"><code>{ path: string }</code></td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>GET /api/fs/tree</code></td>
                <td>Browse a directory.</td>
              </tr>
              <tr>
                <td class="operation"><code>lsp.status</code></td>
                <td class="body"><code>{}</code></td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>GET /api/lsp</code></td>
                <td>LSP status.</td>
              </tr>
              <tr>
                <td class="operation"><code>mcp.prompt.list</code></td>
                <td class="body"><code>{}</code></td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>GET /api/mcp/prompt</code></td>
                <td>List MCP prompts.</td>
              </tr>
              <tr>
                <td class="operation"><code>mcp.prompt.render</code></td>
                <td class="body">
                  <code>{ server: string name: string arguments?: Record&lt;string, string&gt; }</code>
                </td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>POST /api/mcp/prompt/render</code></td>
                <td>Render one MCP prompt.</td>
              </tr>
              <tr>
                <td class="operation"><code>mcp.resource.list</code></td>
                <td class="body"><code>{}</code></td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>GET /api/mcp/resource</code></td>
                <td>List MCP resources.</td>
              </tr>
              <tr>
                <td class="operation"><code>mcp.resource.read</code></td>
                <td class="body"><code>{ server: string uri: string }</code></td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>GET /api/mcp/resource/read</code></td>
                <td>Read one MCP resource.</td>
              </tr>
              <tr>
                <td class="operation"><code>mcp.server.create</code></td>
                <td class="body">
                  <code
                    >{ name: string config: | { type: "local", command: string, arguments?: string[], environment?:
                    Record&lt;string, string&gt; } | { type: "remote", url: string, headers?: Record&lt;string,
                    string&gt;, oauth?: boolean | object } }</code
                  >
                </td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>POST /api/mcp/server</code></td>
                <td>Add an MCP server to runtime config.</td>
              </tr>
              <tr>
                <td class="operation"><code>mcp.server.list</code></td>
                <td class="body"><code>{}</code></td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>GET /api/mcp/server</code></td>
                <td>List MCP servers with status and auth state.</td>
              </tr>
              <tr>
                <td class="operation"><code>mcp.server.oauth.callback</code></td>
                <td class="body"><code>{ name: string code: string }</code></td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>POST /api/mcp/server/:name/oauth/callback</code></td>
                <td>Complete MCP OAuth.</td>
              </tr>
              <tr>
                <td class="operation"><code>mcp.server.oauth.delete</code></td>
                <td class="body"><code>{ name: string }</code></td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>DELETE /api/mcp/server/:name/oauth</code></td>
                <td>Remove MCP OAuth credentials.</td>
              </tr>
              <tr>
                <td class="operation"><code>mcp.server.oauth.start</code></td>
                <td class="body"><code>{ name: string }</code></td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>POST /api/mcp/server/:name/oauth</code></td>
                <td>Start MCP OAuth.</td>
              </tr>
              <tr>
                <td class="operation"><code>permission.list</code></td>
                <td class="body"><code>{}</code></td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>GET /api/permission</code></td>
                <td>Pending permission requests.</td>
              </tr>
              <tr>
                <td class="operation"><code>permission.reply</code></td>
                <td class="body"><code>{ permissionID: PermissionID response: PermissionReply }</code></td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>POST /api/permission/:permissionID/reply</code></td>
                <td>Reply to a permission request.</td>
              </tr>
              <tr>
                <td class="operation"><code>project.get</code></td>
                <td class="body"><code>{ projectID: ProjectID }</code></td>
                <td><span class="context-tag server">server</span></td>
                <td class="route"><code>GET /api/project/:projectID</code></td>
                <td>Get project metadata.</td>
              </tr>
              <tr>
                <td class="operation"><code>project.list</code></td>
                <td class="body"><code>{}</code></td>
                <td><span class="context-tag server">server</span></td>
                <td class="route"><code>GET /api/project</code></td>
                <td>List projects known to this server.</td>
              </tr>
              <tr>
                <td class="operation"><code>project.update</code></td>
                <td class="body">
                  <code
                    >{ projectID: ProjectID name?: string icon?: string commands?: Array&lt;{ name: string command:
                    string }&gt; }</code
                  >
                </td>
                <td><span class="context-tag server">server</span></td>
                <td class="route"><code>PATCH /api/project/:projectID</code></td>
                <td>Update project metadata.</td>
              </tr>
              <tr>
                <td class="operation"><code>provider.list</code></td>
                <td class="body"><code>{}</code></td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>GET /api/provider</code></td>
                <td>Provider inventory for the runtime context.</td>
              </tr>
              <tr>
                <td class="operation"><code>pty.create</code></td>
                <td class="body"><code>{ command?: string cwd?: string shell?: string }</code></td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>POST /api/pty</code></td>
                <td>Create PTY in the runtime context.</td>
              </tr>
              <tr>
                <td class="operation"><code>pty.delete</code></td>
                <td class="body"><code>{ ptyID: PtyID }</code></td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>DELETE /api/pty/:ptyID</code></td>
                <td>Delete PTY.</td>
              </tr>
              <tr>
                <td class="operation"><code>pty.get</code></td>
                <td class="body"><code>{ ptyID: PtyID }</code></td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>GET /api/pty/:ptyID</code></td>
                <td>Get PTY info.</td>
              </tr>
              <tr>
                <td class="operation"><code>pty.list</code></td>
                <td class="body"><code>{}</code></td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>GET /api/pty</code></td>
                <td>List PTYs for the runtime.</td>
              </tr>
              <tr>
                <td class="operation"><code>pty.update</code></td>
                <td class="body">
                  <code>{ ptyID: PtyID title?: string size?: { columns: number, rows: number } }</code>
                </td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>PATCH /api/pty/:ptyID</code></td>
                <td>Update PTY.</td>
              </tr>
              <tr>
                <td class="operation"><code>question.list</code></td>
                <td class="body"><code>{}</code></td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>GET /api/question</code></td>
                <td>Pending user questions.</td>
              </tr>
              <tr>
                <td class="operation"><code>question.reject</code></td>
                <td class="body"><code>{ questionID: QuestionID }</code></td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>POST /api/question/:questionID/reject</code></td>
                <td>Reject a question.</td>
              </tr>
              <tr>
                <td class="operation"><code>question.reply</code></td>
                <td class="body"><code>{ questionID: QuestionID response: QuestionResponse }</code></td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>POST /api/question/:questionID/reply</code></td>
                <td>Reply to a question.</td>
              </tr>
              <tr>
                <td class="operation"><code>session.compact</code></td>
                <td class="body"><code>{ sessionID: SessionID }</code></td>
                <td><span class="context-tag session">session</span></td>
                <td class="route"><code>POST /api/session/:sessionID/compact</code></td>
                <td>Compact the session conversation.</td>
              </tr>
              <tr>
                <td class="operation"><code>session.context</code></td>
                <td class="body"><code>{ sessionID: SessionID }</code></td>
                <td><span class="context-tag session">session</span></td>
                <td class="route"><code>GET /api/session/:sessionID/context</code></td>
                <td>Return active context messages after the last compaction.</td>
              </tr>
              <tr>
                <td class="operation"><code>session.create</code></td>
                <td class="body">
                  <code
                    >{ title?: string agent?: string model?: { providerID: ProviderID, modelID: ModelID } permission?:
                    PermissionRule[] }</code
                  >
                </td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>POST /api/session</code></td>
                <td>Create a session pinned to resolved runtime context.</td>
              </tr>
              <tr>
                <td class="operation"><code>session.delete</code></td>
                <td class="body"><code>{ sessionID: SessionID }</code></td>
                <td><span class="context-tag session">session</span></td>
                <td class="route"><code>DELETE /api/session/:sessionID</code></td>
                <td>Delete a session.</td>
              </tr>
              <tr>
                <td class="operation"><code>session.diff</code></td>
                <td class="body"><code>{ sessionID: SessionID }</code></td>
                <td><span class="context-tag session">session</span></td>
                <td class="route"><code>GET /api/session/:sessionID/diff</code></td>
                <td>Return session diff summary.</td>
              </tr>
              <tr>
                <td class="operation"><code>session.get</code></td>
                <td class="body"><code>{ sessionID: SessionID }</code></td>
                <td><span class="context-tag session">session</span></td>
                <td class="route"><code>GET /api/session/:sessionID</code></td>
                <td>Get one session.</td>
              </tr>
              <tr>
                <td class="operation"><code>session.list</code></td>
                <td class="body">
                  <code
                    >{ limit?: number order?: "asc" | "desc" path?: string roots?: boolean start?: number search?:
                    string cursor?: string }</code
                  >
                </td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>GET /api/session</code></td>
                <td>List sessions for the current runtime context by default.</td>
              </tr>
              <tr>
                <td class="operation"><code>session.message.list</code></td>
                <td class="body">
                  <code>{ sessionID: SessionID limit?: number order?: "asc" | "desc" cursor?: string }</code>
                </td>
                <td><span class="context-tag session">session</span></td>
                <td class="route"><code>GET /api/session/:sessionID/message</code></td>
                <td>Page through session messages.</td>
              </tr>
              <tr>
                <td class="operation"><code>session.prompt</code></td>
                <td class="body">
                  <code>{ sessionID: SessionID prompt: Prompt delivery?: "immediate" | "deferred" }</code>
                </td>
                <td><span class="context-tag session">session</span></td>
                <td class="route"><code>POST /api/session/:sessionID/prompt</code></td>
                <td>Create a user message and queue the agent loop.</td>
              </tr>
              <tr>
                <td class="operation"><code>session.todo</code></td>
                <td class="body"><code>{ sessionID: SessionID }</code></td>
                <td><span class="context-tag session">session</span></td>
                <td class="route"><code>GET /api/session/:sessionID/todo</code></td>
                <td>Return todos associated with the session.</td>
              </tr>
              <tr>
                <td class="operation"><code>session.update</code></td>
                <td class="body">
                  <code>{ sessionID: SessionID title?: string archived?: number permission?: PermissionRule[] }</code>
                </td>
                <td><span class="context-tag session">session</span></td>
                <td class="route"><code>PATCH /api/session/:sessionID</code></td>
                <td>Update title, archival state, or session metadata.</td>
              </tr>
              <tr>
                <td class="operation"><code>session.wait</code></td>
                <td class="body"><code>{ sessionID: SessionID }</code></td>
                <td><span class="context-tag session">session</span></td>
                <td class="route"><code>POST /api/session/:sessionID/wait</code></td>
                <td>Wait until the session is idle.</td>
              </tr>
              <tr>
                <td class="operation"><code>skill.list</code></td>
                <td class="body"><code>{}</code></td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>GET /api/skill</code></td>
                <td>Available skills.</td>
              </tr>
              <tr>
                <td class="operation"><code>vcs.diff</code></td>
                <td class="body"><code>{ format?: "json" | "patch" mode?: "worktree" | "default" }</code></td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>GET /api/vcs/diff</code></td>
                <td>Diff for the runtime directory.</td>
              </tr>
              <tr>
                <td class="operation"><code>vcs.get</code></td>
                <td class="body"><code>{}</code></td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>GET /api/vcs</code></td>
                <td>VCS metadata.</td>
              </tr>
              <tr>
                <td class="operation"><code>vcs.patch</code></td>
                <td class="body"><code>{ patch: string }</code></td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>POST /api/vcs/patch</code></td>
                <td>Apply a patch to the runtime directory.</td>
              </tr>
              <tr>
                <td class="operation"><code>vcs.status</code></td>
                <td class="body"><code>{}</code></td>
                <td><span class="context-tag request">request</span></td>
                <td class="route"><code>GET /api/vcs/status</code></td>
                <td>Changed files.</td>
              </tr>
              <tr>
                <td class="operation"><code>workspace.create</code></td>
                <td class="body">
                  <code
                    >{ projectID?: ProjectID name?: string directory?: string type: string metadata?: Record&lt;string,
                    unknown&gt; }</code
                  >
                </td>
                <td><span class="context-tag server">server</span></td>
                <td class="route"><code>POST /api/workspace</code></td>
                <td>Create or register a workspace.</td>
              </tr>
              <tr>
                <td class="operation"><code>workspace.delete</code></td>
                <td class="body"><code>{ workspaceID: WorkspaceID }</code></td>
                <td><span class="context-tag server">server</span></td>
                <td class="route"><code>DELETE /api/workspace/:workspaceID</code></td>
                <td>Remove a workspace registration.</td>
              </tr>
              <tr>
                <td class="operation"><code>workspace.get</code></td>
                <td class="body"><code>{ workspaceID: WorkspaceID }</code></td>
                <td><span class="context-tag server">server</span></td>
                <td class="route"><code>GET /api/workspace/:workspaceID</code></td>
                <td>Get workspace metadata.</td>
              </tr>
              <tr>
                <td class="operation"><code>workspace.list</code></td>
                <td class="body"><code>{ projectID?: ProjectID }</code></td>
                <td><span class="context-tag server">server</span></td>
                <td class="route"><code>GET /api/workspace</code></td>
                <td>List workspaces, optionally filtered by project.</td>
              </tr>
              <tr class="question-row">
                <td class="operation"><code>workspace.status</code></td>
                <td class="body"><code>{}</code></td>
                <td><span class="context-tag server">server</span></td>
                <td class="route"><code>GET /api/workspace/status</code></td>
                <td>Connection/lifecycle status for all workspaces. Needs team discussion.</td>
              </tr>
              <tr class="question-row">
                <td class="operation"><code>workspace.sync</code></td>
                <td class="body"><code>{}</code></td>
                <td><span class="context-tag server">server</span></td>
                <td class="route"><code>POST /api/workspace/sync</code></td>
                <td>Sync workspace metadata from adapters. Needs team discussion.</td>
              </tr>
              <tr>
                <td class="operation"><code>workspace.update</code></td>
                <td class="body">
                  <code
                    >{ workspaceID: WorkspaceID name?: string metadata?: Record&lt;string, unknown&gt; archived?:
                    boolean }</code
                  >
                </td>
                <td><span class="context-tag server">server</span></td>
                <td class="route"><code>PATCH /api/workspace/:workspaceID</code></td>
                <td>Update workspace metadata or lifecycle state.</td>
              </tr>
              <tr class="question-row">
                <td class="operation"><code>workspace.warp</code></td>
                <td class="body">
                  <code>{ workspaceID?: WorkspaceID sessionID: SessionID copyChanges: boolean }</code>
                </td>
                <td><span class="context-tag server">server</span></td>
                <td class="route"><code>POST /api/workspace/warp</code></td>
                <td>Move a session into or out of a workspace. Needs team discussion.</td>
              </tr>
            </tbody>
          </table>
        </article>
      </section>

      <section id="events" class="grid">
        <article class="span-12 panel panel-pad stack">
          <h2>Event Envelope</h2>
          <p class="muted">
            Every event uses the same envelope. Resource identity belongs in <code>payload</code>. Runtime identity
            belongs in <code>context</code>.
          </p>
          <div class="grid">
            <pre class="span-6"><code>type ApiEvent&lt;Payload&gt; = {
  id: string
  type: string
  time: number
  context: {
    directory: string
    workspaceID?: string
  }
  payload: Payload
}</code></pre>
            <pre class="span-6"><code>{
  "id": "evt_01",
  "type": "message.part.delta",
  "time": 1760000000000,
  "context": {
    "directory": "/repo/app",
    "workspaceID": "ws_123"
  },
  "payload": {
    "sessionID": "ses_123",
    "messageID": "msg_456",
    "partID": "part_789",
    "field": "text",
    "delta": "hello"
  }
}</code></pre>
          </div>
        </article>
      </section>

      <section id="store" class="grid">
        <article class="span-12 panel panel-pad stack">
          <h2>Frontend Sync Store</h2>
          <p class="muted">
            A frontend can keep one giant store like the current TUI. Runtime data is partitioned by
            <code>contextKey</code>. Durable entities such as sessions and messages are keyed by their own IDs.
          </p>
          <pre><code>type RuntimeContext = {
  directory: string
  workspaceID?: string
}

type ContextKey = string
type SessionID = string
type MessageID = string

type SyncStore = {
  status: "loading" | "partial" | "complete"

  shared: {
    provider: Provider[]
    provider_default: Record&lt;string, string&gt;
    provider_next: ProviderListResponse
    provider_auth: Record&lt;string, ProviderAuthMethod[]&gt;
    console_state: ConsoleState
  }

  contexts: Record&lt;
    ContextKey,
    {
      context: RuntimeContext

      config: Config
      agent: Agent[]
      command: Command[]
      lsp: LspStatus[]
      formatter: FormatterStatus[]
      vcs: VcsInfo | undefined
      mcp: Record&lt;string, McpStatus&gt;
      mcp_resource: Record&lt;string, McpResource&gt;

      session: SessionID[]
      session_status: Record&lt;SessionID, SessionStatus&gt;
    }
  &gt;

  session: Record&lt;SessionID, Session &amp; { context: RuntimeContext }&gt;
  session_diff: Record&lt;SessionID, Snapshot.FileDiff[]&gt;
  todo: Record&lt;SessionID, Todo[]&gt;
  permission: Record&lt;SessionID, PermissionRequest[]&gt;
  question: Record&lt;SessionID, QuestionRequest[]&gt;

  message: Record&lt;SessionID, Message[]&gt;
  part: Record&lt;MessageID, Part[]&gt;
}

function contextKey(context: RuntimeContext) {
  return `${context.workspaceID ?? "local"}:${context.directory}`
}</code></pre>
        </article>
      </section>
    </main>
  </body>
</html>
