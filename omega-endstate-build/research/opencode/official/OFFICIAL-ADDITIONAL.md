# OpenCode official additional operational documentation snapshot

Captured from `anomalyco/opencode` commit `03e67171ab2dc1e7f16e8cebfbc7f778f61b89f0` on 2026-09-28.


---

# SOURCE: `packages/web/src/content/docs/skills.mdx`

---
title: "Agent Skills"
description: "Define reusable behavior via SKILL.md definitions"
---

Agent skills let OpenCode discover reusable instructions from your repo or home directory.
Skills are loaded on-demand via the native `skill` tool—agents see available skills and can load the full content when needed.

---

## Place files

Create one folder per skill name and put a `SKILL.md` inside it.
OpenCode searches these locations:

- Project config: `.opencode/skills/<name>/SKILL.md`
- Global config: `~/.config/opencode/skills/<name>/SKILL.md`
- Project Claude-compatible: `.claude/skills/<name>/SKILL.md`
- Global Claude-compatible: `~/.claude/skills/<name>/SKILL.md`
- Project agent-compatible: `.agents/skills/<name>/SKILL.md`
- Global agent-compatible: `~/.agents/skills/<name>/SKILL.md`

---

## Understand discovery

For project-local paths, OpenCode walks up from your current working directory until it reaches the git worktree.
It loads any matching `skills/*/SKILL.md` in `.opencode/` and any matching `.claude/skills/*/SKILL.md` or `.agents/skills/*/SKILL.md` along the way.

Global definitions are also loaded from `~/.config/opencode/skills/*/SKILL.md`, `~/.claude/skills/*/SKILL.md`, and `~/.agents/skills/*/SKILL.md`.

---

## Write frontmatter

Each `SKILL.md` must start with YAML frontmatter.
Only these fields are recognized:

- `name` (required)
- `description` (required)
- `license` (optional)
- `compatibility` (optional)
- `metadata` (optional, string-to-string map)

Unknown frontmatter fields are ignored.

---

## Validate names

`name` must:

- Be 1–64 characters
- Be lowercase alphanumeric with single hyphen separators
- Not start or end with `-`
- Not contain consecutive `--`
- Match the directory name that contains `SKILL.md`

Equivalent regex:

```text
^[a-z0-9]+(-[a-z0-9]+)*$
```

---

## Follow length rules

`description` must be 1-1024 characters.
Keep it specific enough for the agent to choose correctly.

---

## Use an example

Create `.opencode/skills/git-release/SKILL.md` like this:

```markdown
---
name: git-release
description: Create consistent releases and changelogs
license: MIT
compatibility: opencode
metadata:
  audience: maintainers
  workflow: github
---

## What I do

- Draft release notes from merged PRs
- Propose a version bump
- Provide a copy-pasteable `gh release create` command

## When to use me

Use this when you are preparing a tagged release.
Ask clarifying questions if the target versioning scheme is unclear.
```

---

## Recognize tool description

OpenCode lists available skills in the `skill` tool description.
Each entry includes the skill name and description:

```xml
<available_skills>
  <skill>
    <name>git-release</name>
    <description>Create consistent releases and changelogs</description>
  </skill>
</available_skills>
```

The agent loads a skill by calling the tool:

```
skill({ name: "git-release" })
```

---

## Configure permissions

Control which skills agents can access using pattern-based permissions in `opencode.json`:

```json
{
  "permission": {
    "skill": {
      "*": "allow",
      "pr-review": "allow",
      "internal-*": "deny",
      "experimental-*": "ask"
    }
  }
}
```

| Permission | Behavior                                  |
| ---------- | ----------------------------------------- |
| `allow`    | Skill loads immediately                   |
| `deny`     | Skill hidden from agent, access rejected  |
| `ask`      | User prompted for approval before loading |

Patterns support wildcards: `internal-*` matches `internal-docs`, `internal-tools`, etc.

---

## Override per agent

Give specific agents different permissions than the global defaults.

**For custom agents** (in agent frontmatter):

```yaml
---
permission:
  skill:
    "documents-*": "allow"
---
```

**For built-in agents** (in `opencode.json`):

```json
{
  "agent": {
    "plan": {
      "permission": {
        "skill": {
          "internal-*": "allow"
        }
      }
    }
  }
}
```

---

## Disable the skill tool

Completely disable skills for agents that shouldn't use them:

**For custom agents**:

```yaml
---
tools:
  skill: false
---
```

**For built-in agents**:

```json
{
  "agent": {
    "plan": {
      "tools": {
        "skill": false
      }
    }
  }
}
```

When disabled, the `<available_skills>` section is omitted entirely.

---

## Troubleshoot loading

If a skill does not show up:

1. Verify `SKILL.md` is spelled in all caps
2. Check that frontmatter includes `name` and `description`
3. Ensure skill names are unique across all locations
4. Check permissions—skills with `deny` are hidden from agents


---

# SOURCE: `packages/web/src/content/docs/sdk.mdx`

---
title: SDK
description: Type-safe JS client for opencode server.
---

import config from "../../../config.mjs"
export const typesUrl = `${config.github}/blob/dev/packages/sdk/js/src/gen/types.gen.ts`

The opencode JS/TS SDK provides a type-safe client for interacting with the server.
Use it to build integrations and control opencode programmatically.

[Learn more](/docs/server) about how the server works. For examples, check out the [projects](/docs/ecosystem#projects) built by the community.

---

## Install

Install the SDK from npm:

```bash
npm install @opencode-ai/sdk
```

---

## Create client

Create an instance of opencode:

```javascript
import { createOpencode } from "@opencode-ai/sdk"

const { client } = await createOpencode()
```

This starts both a server and a client

#### Options

| Option     | Type          | Description                    | Default     |
| ---------- | ------------- | ------------------------------ | ----------- |
| `hostname` | `string`      | Server hostname                | `127.0.0.1` |
| `port`     | `number`      | Server port                    | `4096`      |
| `signal`   | `AbortSignal` | Abort signal for cancellation  | `undefined` |
| `timeout`  | `number`      | Timeout in ms for server start | `5000`      |
| `config`   | `Config`      | Configuration object           | `{}`        |

---

## Config

You can pass a configuration object to customize behavior. The instance still picks up your `opencode.json`, but you can override or add configuration inline:

```javascript
import { createOpencode } from "@opencode-ai/sdk"

const opencode = await createOpencode({
  hostname: "127.0.0.1",
  port: 4096,
  config: {
    model: "anthropic/claude-3-5-sonnet-20241022",
  },
})

console.log(`Server running at ${opencode.server.url}`)

opencode.server.close()
```

## Client only

If you already have a running instance of opencode, you can create a client instance to connect to it:

```javascript
import { createOpencodeClient } from "@opencode-ai/sdk"

const client = createOpencodeClient({
  baseUrl: "http://localhost:4096",
})
```

#### Options

| Option          | Type       | Description                      | Default                 |
| --------------- | ---------- | -------------------------------- | ----------------------- |
| `baseUrl`       | `string`   | URL of the server                | `http://localhost:4096` |
| `fetch`         | `function` | Custom fetch implementation      | `globalThis.fetch`      |
| `parseAs`       | `string`   | Response parsing method          | `auto`                  |
| `responseStyle` | `string`   | Return style: `data` or `fields` | `fields`                |
| `throwOnError`  | `boolean`  | Throw errors instead of return   | `false`                 |

---

## Types

The SDK includes TypeScript definitions for all API types. Import them directly:

```typescript
import type { Session, Message, Part } from "@opencode-ai/sdk"
```

All types are generated from the server's OpenAPI specification and available in the <a href={typesUrl}>types file</a>.

---

## Errors

The SDK can throw errors that you can catch and handle:

```typescript
try {
  await client.session.get({ path: { id: "invalid-id" } })
} catch (error) {
  console.error("Failed to get session:", (error as Error).message)
}
```

---

## Structured Output

You can request structured JSON output from the model by specifying an `format` with a JSON schema. The model will use a `StructuredOutput` tool to return validated JSON matching your schema.

### Basic Usage

```typescript
const result = await client.session.prompt({
  path: { id: sessionId },
  body: {
    parts: [{ type: "text", text: "Research Anthropic and provide company info" }],
    format: {
      type: "json_schema",
      schema: {
        type: "object",
        properties: {
          company: { type: "string", description: "Company name" },
          founded: { type: "number", description: "Year founded" },
          products: {
            type: "array",
            items: { type: "string" },
            description: "Main products",
          },
        },
        required: ["company", "founded"],
      },
    },
  },
})

// Access the structured output
console.log(result.data.info.structured_output)
// { company: "Anthropic", founded: 2021, products: ["Claude", "Claude API"] }
```

### Output Format Types

| Type          | Description                                            |
| ------------- | ------------------------------------------------------ |
| `text`        | Default. Standard text response (no structured output) |
| `json_schema` | Returns validated JSON matching the provided schema    |

### JSON Schema Format

When using `type: 'json_schema'`, provide:

| Field        | Type            | Description                                                |
| ------------ | --------------- | ---------------------------------------------------------- |
| `type`       | `'json_schema'` | Required. Specifies JSON schema mode                       |
| `schema`     | `object`        | Required. JSON Schema object defining the output structure |
| `retryCount` | `number`        | Optional. Number of validation retries (default: 2)        |

### Error Handling

If the model fails to produce valid structured output after all retries, the response will include a `StructuredOutputError`:

```typescript
if (result.data.info.error?.name === "StructuredOutputError") {
  console.error("Failed to produce structured output:", result.data.info.error.message)
  console.error("Attempts:", result.data.info.error.retries)
}
```

### Best Practices

1. **Provide clear descriptions** in your schema properties to help the model understand what data to extract
2. **Use `required`** to specify which fields must be present
3. **Keep schemas focused** - complex nested schemas may be harder for the model to fill correctly
4. **Set appropriate `retryCount`** - increase for complex schemas, decrease for simple ones

---

## APIs

The SDK exposes all server APIs through a type-safe client.

---

### Global

| Method            | Description                     | Response                             |
| ----------------- | ------------------------------- | ------------------------------------ |
| `global.health()` | Check server health and version | `{ healthy: true, version: string }` |

---

#### Examples

```javascript
const health = await client.global.health()
console.log(health.data.version)
```

---

### App

| Method         | Description               | Response                                    |
| -------------- | ------------------------- | ------------------------------------------- |
| `app.log()`    | Write a log entry         | `boolean`                                   |
| `app.agents()` | List all available agents | <a href={typesUrl}><code>Agent[]</code></a> |

---

#### Examples

```javascript
// Write a log entry
await client.app.log({
  body: {
    service: "my-app",
    level: "info",
    message: "Operation completed",
  },
})

// List available agents
const agents = await client.app.agents()
```

---

### Project

| Method              | Description         | Response                                      |
| ------------------- | ------------------- | --------------------------------------------- |
| `project.list()`    | List all projects   | <a href={typesUrl}><code>Project[]</code></a> |
| `project.current()` | Get current project | <a href={typesUrl}><code>Project</code></a>   |

---

#### Examples

```javascript
// List all projects
const projects = await client.project.list()

// Get current project
const currentProject = await client.project.current()
```

---

### Path

| Method       | Description      | Response                                 |
| ------------ | ---------------- | ---------------------------------------- |
| `path.get()` | Get current path | <a href={typesUrl}><code>Path</code></a> |

---

#### Examples

```javascript
// Get current path information
const pathInfo = await client.path.get()
```

---

### Config

| Method               | Description                       | Response                                                                                              |
| -------------------- | --------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `config.get()`       | Get config info                   | <a href={typesUrl}><code>Config</code></a>                                                            |
| `config.providers()` | List providers and default models | `{ providers: `<a href={typesUrl}><code>Provider[]</code></a>`, default: { [key: string]: string } }` |

---

#### Examples

```javascript
const config = await client.config.get()

const { providers, default: defaults } = await client.config.providers()
```

---

### Sessions

| Method                                                     | Description                        | Notes                                                                                                                                                                                                                    |
| ---------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `session.list()`                                           | List sessions                      | Returns <a href={typesUrl}><code>Session[]</code></a>                                                                                                                                                                    |
| `session.get({ path })`                                    | Get session                        | Returns <a href={typesUrl}><code>Session</code></a>                                                                                                                                                                      |
| `session.children({ path })`                               | List child sessions                | Returns <a href={typesUrl}><code>Session[]</code></a>                                                                                                                                                                    |
| `session.create({ body })`                                 | Create session                     | Returns <a href={typesUrl}><code>Session</code></a>                                                                                                                                                                      |
| `session.delete({ path })`                                 | Delete session                     | Returns `boolean`                                                                                                                                                                                                        |
| `session.update({ path, body })`                           | Update session properties          | Returns <a href={typesUrl}><code>Session</code></a>                                                                                                                                                                      |
| `session.init({ path, body })`                             | Analyze app and create `AGENTS.md` | Returns `boolean`                                                                                                                                                                                                        |
| `session.abort({ path })`                                  | Abort a running session            | Returns `boolean`                                                                                                                                                                                                        |
| `session.share({ path })`                                  | Share session                      | Returns <a href={typesUrl}><code>Session</code></a>                                                                                                                                                                      |
| `session.unshare({ path })`                                | Unshare session                    | Returns <a href={typesUrl}><code>Session</code></a>                                                                                                                                                                      |
| `session.summarize({ path, body })`                        | Summarize session                  | Returns `boolean`                                                                                                                                                                                                        |
| `session.messages({ path })`                               | List messages in a session         | Returns `{ info: `<a href={typesUrl}><code>Message</code></a>`, parts: `<a href={typesUrl}><code>Part[]</code></a>`}[]`                                                                                                  |
| `session.message({ path })`                                | Get message details                | Returns `{ info: `<a href={typesUrl}><code>Message</code></a>`, parts: `<a href={typesUrl}><code>Part[]</code></a>`}`                                                                                                    |
| `session.prompt({ path, body })`                           | Send prompt message                | `body.noReply: true` returns UserMessage (context only). Default returns <a href={typesUrl}><code>AssistantMessage</code></a> with AI response. Supports `body.outputFormat` for [structured output](#structured-output) |
| `session.command({ path, body })`                          | Send command to session            | Returns `{ info: `<a href={typesUrl}><code>AssistantMessage</code></a>`, parts: `<a href={typesUrl}><code>Part[]</code></a>`}`                                                                                           |
| `session.shell({ path, body })`                            | Run a shell command                | Returns <a href={typesUrl}><code>AssistantMessage</code></a>                                                                                                                                                             |
| `session.revert({ path, body })`                           | Revert a message                   | Returns <a href={typesUrl}><code>Session</code></a>                                                                                                                                                                      |
| `session.unrevert({ path })`                               | Restore reverted messages          | Returns <a href={typesUrl}><code>Session</code></a>                                                                                                                                                                      |
| `postSessionByIdPermissionsByPermissionId({ path, body })` | Respond to a permission request    | Returns `boolean`                                                                                                                                                                                                        |

---

#### Examples

```javascript
// Create and manage sessions
const session = await client.session.create({
  body: { title: "My session" },
})

const sessions = await client.session.list()

// Send a prompt message
const result = await client.session.prompt({
  path: { id: session.id },
  body: {
    model: { providerID: "anthropic", modelID: "claude-3-5-sonnet-20241022" },
    parts: [{ type: "text", text: "Hello!" }],
  },
})

// Inject context without triggering AI response (useful for plugins)
await client.session.prompt({
  path: { id: session.id },
  body: {
    noReply: true,
    parts: [{ type: "text", text: "You are a helpful assistant." }],
  },
})
```

---

### Files

| Method                    | Description                        | Response                                                                                    |
| ------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------- |
| `find.text({ query })`    | Search for text in files           | Array of match objects with `path`, `lines`, `line_number`, `absolute_offset`, `submatches` |
| `find.files({ query })`   | Find files and directories by name | `string[]` (paths)                                                                          |
| `find.symbols({ query })` | Find workspace symbols             | <a href={typesUrl}><code>Symbol[]</code></a>                                                |
| `file.read({ query })`    | Read a file                        | `{ type: "raw" \| "patch", content: string }`                                               |
| `file.status({ query? })` | Get status for tracked files       | <a href={typesUrl}><code>File[]</code></a>                                                  |

`find.files` supports a few optional query fields:

- `type`: `"file"` or `"directory"`
- `directory`: override the project root for the search
- `limit`: max results (1–200)

---

#### Examples

```javascript
// Search and read files
const textResults = await client.find.text({
  query: { pattern: "function.*opencode" },
})

const files = await client.find.files({
  query: { query: "*.ts", type: "file" },
})

const directories = await client.find.files({
  query: { query: "packages", type: "directory", limit: 20 },
})

const content = await client.file.read({
  query: { path: "src/index.ts" },
})
```

---

### TUI

| Method                         | Description               | Response  |
| ------------------------------ | ------------------------- | --------- |
| `tui.appendPrompt({ body })`   | Append text to the prompt | `boolean` |
| `tui.openHelp()`               | Open the help dialog      | `boolean` |
| `tui.openSessions()`           | Open the session selector | `boolean` |
| `tui.openThemes()`             | Open the theme selector   | `boolean` |
| `tui.openModels()`             | Open the model selector   | `boolean` |
| `tui.submitPrompt()`           | Submit the current prompt | `boolean` |
| `tui.clearPrompt()`            | Clear the prompt          | `boolean` |
| `tui.executeCommand({ body })` | Execute a command         | `boolean` |
| `tui.showToast({ body })`      | Show toast notification   | `boolean` |

---

#### Examples

```javascript
// Control TUI interface
await client.tui.appendPrompt({
  body: { text: "Add this to prompt" },
})

await client.tui.showToast({
  body: { message: "Task completed", variant: "success" },
})
```

---

### Auth

| Method              | Description                    | Response  |
| ------------------- | ------------------------------ | --------- |
| `auth.set({ ... })` | Set authentication credentials | `boolean` |

---

#### Examples

```javascript
await client.auth.set({
  path: { id: "anthropic" },
  body: { type: "api", key: "your-api-key" },
})
```

---

### Events

| Method              | Description               | Response                  |
| ------------------- | ------------------------- | ------------------------- |
| `event.subscribe()` | Server-sent events stream | Server-sent events stream |

---

#### Examples

```javascript
// Listen to real-time events
const events = await client.event.subscribe()
for await (const event of events.stream) {
  console.log("Event:", event.type, event.properties)
}
```


---

# SOURCE: `packages/web/src/content/docs/models.mdx`

---
title: Models
description: Configuring an LLM provider and model.
---

OpenCode uses the [AI SDK](https://ai-sdk.dev/) and [Models.dev](https://models.dev) to support **75+ LLM providers** and it supports running local models.

---

## Providers

Most popular providers are preloaded by default. If you've added the credentials for a provider through the `/connect` command, they'll be available when you start OpenCode.

Learn more about [providers](/docs/providers).

---

## Select a model

Once you've configured your provider you can select the model you want by typing in:

```bash frame="none"
/models
```

---

## Recommended models

There are a lot of models out there, with new models coming out every week.

:::tip
Consider using one of the models we recommend.
:::

However, there are only a few of them that are good at both generating code and tool calling.

Here are several models that work well with OpenCode, in no particular order. (This is not an exhaustive list nor is it necessarily up to date):

- GPT 5.2
- GPT 5.1 Codex
- Claude Opus 4.5
- Claude Sonnet 4.5
- Minimax M2.1
- Gemini 3 Pro

---

## Set a default

To set one of these as the default model, you can set the `model` key in your
OpenCode config.

```json title="opencode.json" {3}
{
  "$schema": "https://opencode.ai/config.json",
  "model": "lmstudio/google/gemma-3n-e4b"
}
```

Here the full ID is `provider_id/model_id`. For example, if you're using [OpenCode Zen](/docs/zen), you would use `opencode/gpt-5.1-codex` for GPT 5.1 Codex.

If you've configured a [custom provider](/docs/providers#custom), the `provider_id` is key from the `provider` part of your config, and the `model_id` is the key from `provider.models`.

---

## Configure models

You can globally configure a model's options through the config.

```jsonc title="opencode.jsonc" {7-12,19-24}
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "openai": {
      "models": {
        "gpt-5": {
          "options": {
            "reasoningEffort": "high",
            "textVerbosity": "low",
            "reasoningSummary": "auto",
            "include": ["reasoning.encrypted_content"],
          },
        },
      },
    },
    "anthropic": {
      "models": {
        "claude-sonnet-4-5-20250929": {
          "options": {
            "thinking": {
              "type": "enabled",
              "budgetTokens": 16000,
            },
          },
        },
      },
    },
  },
}
```

Here we're configuring global settings for two built-in models: `gpt-5` when accessed via the `openai` provider, and `claude-sonnet-4-20250514` when accessed via the `anthropic` provider.
The built-in provider and model names can be found on [Models.dev](https://models.dev).

You can also configure these options for any agents that you are using. The agent config overrides any global options here. [Learn more](/docs/agents/#additional).

You can also define custom variants that extend built-in ones. Variants let you configure different settings for the same model without creating duplicate entries:

```jsonc title="opencode.jsonc" {6-21}
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "opencode": {
      "models": {
        "gpt-5": {
          "variants": {
            "high": {
              "reasoningEffort": "high",
              "textVerbosity": "low",
              "reasoningSummary": "auto",
            },
            "low": {
              "reasoningEffort": "low",
              "textVerbosity": "low",
              "reasoningSummary": "auto",
            },
          },
        },
      },
    },
  },
}
```

---

## Variants

Many models support multiple variants with different configurations. OpenCode ships with built-in default variants for popular providers.

### Built-in variants

OpenCode ships with default variants for many providers:

**Anthropic**:

- `high` - High thinking budget (default)
- `max` - Maximum thinking budget

**OpenAI**:

Varies by model but roughly:

- `none` - No reasoning
- `minimal` - Minimal reasoning effort
- `low` - Low reasoning effort
- `medium` - Medium reasoning effort
- `high` - High reasoning effort
- `xhigh` - Extra high reasoning effort

**Google**:

- `low` - Lower effort/token budget
- `high` - Higher effort/token budget

:::tip
This list is not comprehensive. Many other providers have built-in defaults too.
:::

### Custom variants

You can override existing variants or add your own:

```jsonc title="opencode.jsonc" {7-18}
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "openai": {
      "models": {
        "gpt-5": {
          "variants": {
            "thinking": {
              "reasoningEffort": "high",
              "textVerbosity": "low",
            },
            "fast": {
              "disabled": true,
            },
          },
        },
      },
    },
  },
}
```

### Cycle variants

Use the keybind `variant_cycle` to quickly switch between variants. [Learn more](/docs/keybinds).

---

## Loading models

When OpenCode starts up, it checks for models in the following priority order:

1. The `--model` or `-m` command line flag. The format is the same as in the config file: `provider_id/model_id`.

2. The model list in the OpenCode config.

   ```json title="opencode.json"
   {
     "$schema": "https://opencode.ai/config.json",
     "model": "anthropic/claude-sonnet-4-20250514"
   }
   ```

   The format here is `provider/model`.

3. The last used model.

4. The first model using an internal priority.


---

# SOURCE: `packages/web/src/content/docs/providers.mdx`

---
title: Providers
description: Using any LLM provider in OpenCode.
---

import config from "../../../config.mjs"
export const console = config.console

OpenCode uses the [AI SDK](https://ai-sdk.dev/) and [Models.dev](https://models.dev) to support **75+ LLM providers** and it supports running local models.

To add a provider you need to:

1. Add the API keys for the provider using the `/connect` command.
2. Configure the provider in your OpenCode config.

---

### Credentials

When you add a provider's API keys with the `/connect` command, they are stored
in `~/.local/share/opencode/auth.json`.

---

### Config

You can customize the providers through the `provider` section in your OpenCode
config.

---

#### Base URL

You can customize the base URL for any provider by setting the `baseURL` option. This is useful when using proxy services or custom endpoints.

```json title="opencode.json" {6}
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "anthropic": {
      "options": {
        "baseURL": "https://api.anthropic.com/v1"
      }
    }
  }
}
```

---

#### Hiding models

You can hide specific models from the `/models` picker for a provider using the `blacklist` option. This is useful when a provider exposes models you don't want to use or select.

```json title="opencode.json" {6}
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "anthropic": {
      "blacklist": ["claude-opus-4-20250514"]
    }
  }
}
```

The inverse `whitelist` option hides every model except the ones listed.

```json title="opencode.json" {6}
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "anthropic": {
      "whitelist": ["claude-sonnet-4-20250514"]
    }
  }
}
```

Both options take an array of model IDs — the same IDs shown in the `/models` picker.

- `blacklist` removes the listed models from the picker.
- `whitelist` keeps only the listed models and hides the rest.
- You can combine them: `whitelist` narrows the set, then `blacklist` removes entries from it.

---

## OpenCode Zen

OpenCode Zen is a list of models provided by the OpenCode team that have been
tested and verified to work well with OpenCode. [Learn more](/docs/zen).

:::tip
If you are new, we recommend starting with OpenCode Zen.
:::

1. Run the `/connect` command in the TUI, select `OpenCode Zen`, and head to [opencode.ai/auth](https://opencode.ai/zen).

   ```txt
   /connect
   ```

2. Sign in, add your billing details, and copy your API key.

3. Paste your API key.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Run `/models` in the TUI to see the list of models we recommend.

   ```txt
   /models
   ```

It works like any other provider in OpenCode and is completely optional to use.

---

## OpenCode Go

OpenCode Go is a low cost subscription plan that provides reliable access to popular open coding models provided by the OpenCode team that have been
tested and verified to work well with OpenCode.

1. Run the `/connect` command in the TUI, select `OpenCode Go`, and head to [opencode.ai/auth](https://opencode.ai/zen).

   ```txt
   /connect
   ```

2. Sign in, add your billing details, and copy your API key.

3. Paste your API key.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Run `/models` in the TUI to see the list of models we recommend.

   ```txt
   /models
   ```

It works like any other provider in OpenCode and is completely optional to use.

---

## Directory

Let's look at some of the providers in detail. If you'd like to add a provider to the
list, feel free to open a PR.

:::note
Don't see a provider here? Submit a PR.
:::

---

### 302.AI

1. Head over to the [302.AI console](https://302.ai/), create an account, and generate an API key.

2. Run the `/connect` command and search for **302.AI**.

   ```txt
   /connect
   ```

3. Enter your 302.AI API key.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Run the `/models` command to select a model.

   ```txt
   /models
   ```

---

### Amazon Bedrock

To use Amazon Bedrock with OpenCode:

1. Head over to the **Model catalog** in the Amazon Bedrock console and request
   access to the models you want.

   :::tip
   You need to have access to the model you want in Amazon Bedrock.
   :::

2. **Configure authentication** using one of the following methods:

   ***

   #### Environment Variables (Quick Start)

   Set one of these environment variables while running opencode:

   ```bash
   # Option 1: Using AWS access keys
   AWS_ACCESS_KEY_ID=XXX AWS_SECRET_ACCESS_KEY=YYY opencode

   # Option 2: Using named AWS profile
   AWS_PROFILE=my-profile opencode

   # Option 3: Using Bedrock bearer token
   AWS_BEARER_TOKEN_BEDROCK=XXX opencode
   ```

   Or add them to your bash profile:

   ```bash title="~/.bash_profile"
   export AWS_PROFILE=my-dev-profile
   export AWS_REGION=us-east-1
   ```

   ***

   #### Configuration File (Recommended)

   For project-specific or persistent configuration, use `opencode.json`:

   ```json title="opencode.json"
   {
     "$schema": "https://opencode.ai/config.json",
     "provider": {
       "amazon-bedrock": {
         "options": {
           "region": "us-east-1",
           "profile": "my-aws-profile"
         }
       }
     }
   }
   ```

   **Available options:**
   - `region` - AWS region (e.g., `us-east-1`, `eu-west-1`)
   - `profile` - AWS named profile from `~/.aws/credentials`
   - `endpoint` - Custom endpoint URL for VPC endpoints (alias for generic `baseURL` option)

   :::tip
   Configuration file options take precedence over environment variables.
   :::

   ***

   #### Advanced: VPC Endpoints

   If you're using VPC endpoints for Bedrock:

   ```json title="opencode.json"
   {
     "$schema": "https://opencode.ai/config.json",
     "provider": {
       "amazon-bedrock": {
         "options": {
           "region": "us-east-1",
           "profile": "production",
           "endpoint": "https://bedrock-runtime.us-east-1.vpce-xxxxx.amazonaws.com"
         }
       }
     }
   }
   ```

   :::note
   The `endpoint` option is an alias for the generic `baseURL` option, using AWS-specific terminology. If both `endpoint` and `baseURL` are specified, `endpoint` takes precedence.
   :::

   ***

   #### Authentication Methods
   - **`AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`**: Create an IAM user and generate access keys in the AWS Console
   - **`AWS_PROFILE`**: Use named profiles from `~/.aws/credentials`. First configure with `aws configure --profile my-profile` or `aws sso login`
   - **`AWS_BEARER_TOKEN_BEDROCK`**: Generate long-term API keys from the Amazon Bedrock console
   - **`AWS_WEB_IDENTITY_TOKEN_FILE` / `AWS_ROLE_ARN`**: For EKS IRSA (IAM Roles for Service Accounts) or other Kubernetes environments with OIDC federation. These environment variables are automatically injected by Kubernetes when using service account annotations.

   ***

   #### Authentication Precedence

   Amazon Bedrock uses the following authentication priority:
   1. **Bearer Token** - `AWS_BEARER_TOKEN_BEDROCK` environment variable or token from `/connect` command
   2. **AWS Credential Chain** - Profile, access keys, shared credentials, IAM roles, Web Identity Tokens (EKS IRSA), instance metadata

   :::note
   When a bearer token is set (via `/connect` or `AWS_BEARER_TOKEN_BEDROCK`), it takes precedence over all AWS credential methods including configured profiles.
   :::

3. Run the `/models` command to select the model you want.

   ```txt
   /models
   ```

:::note
For custom inference profiles, use the model and provider name in the key and set the `id` property to the arn. This ensures correct caching.
:::

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "amazon-bedrock": {
      // ...
      "models": {
        "anthropic-claude-sonnet-4.5": {
          "id": "arn:aws:bedrock:us-east-1:xxx:application-inference-profile/yyy"
        }
      }
    }
  }
}
```

---

### Anthropic

1. Once you've signed up, run the `/connect` command and select Anthropic.

   ```txt
   /connect
   ```

2. Here you can select the **Claude Pro/Max** option and it'll open your browser
   and ask you to authenticate.

   ```txt
   ┌ Select auth method
   │
   │ Manually enter API Key
   └
   ```

3. Now all the Anthropic models should be available when you use the `/models` command.

   ```txt
   /models
   ```

:::info
There are plugins that allow you to use your Claude Pro/Max models with
OpenCode. Anthropic explicitly prohibits this.

Previous versions of OpenCode came bundled with these plugins but that is no
longer the case as of 1.3.0

Other companies support freedom of choice with developer tooling - you can use
the following subscriptions in OpenCode with zero setup:

- ChatGPT Plus
- Github Copilot
- Gitlab Duo
  :::

---

### Atomic Chat

You can configure opencode to use local models through [Atomic Chat](https://atomic.chat), a desktop application that runs local LLMs behind an OpenAI-compatible API server (default endpoint `http://127.0.0.1:1337/v1`).

```json title="opencode.json" "atomic-chat" {5, 6, 8, 10-14}
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "atomic-chat": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Atomic Chat (local)",
      "options": {
        "baseURL": "http://127.0.0.1:1337/v1"
      },
      "models": {
        "<your-model-id>": {
          "name": "<your-model-name>"
        }
      }
    }
  }
}
```

In this example:

- `atomic-chat` is the custom provider ID. This can be any string you want.
- `npm` specifies the package to use for this provider. Here, `@ai-sdk/openai-compatible` is used for any OpenAI-compatible API.
- `name` is the display name for the provider in the UI.
- `options.baseURL` is the endpoint for the local server. Change the host and port to match your Atomic Chat setup.
- `models` is a map of model IDs to their display names. Each ID must match the `id` returned by `GET /v1/models` — run `curl http://127.0.0.1:1337/v1/models` to list the ids currently loaded in Atomic Chat.

:::tip
If tool calls aren't working well, pick a loaded model with strong tool-calling support (for example, a Qwen-Coder or DeepSeek-Coder variant).
:::

---

### Azure OpenAI

:::note
If you encounter "I'm sorry, but I cannot assist with that request" errors, try changing the content filter from **DefaultV2** to **Default** in your Azure resource.
:::

1. Head over to the [Azure portal](https://portal.azure.com/) and create an **Azure OpenAI** resource. You'll need:
   - **Resource name**: This becomes part of your API endpoint (`https://RESOURCE_NAME.openai.azure.com/`)
   - **API key**: Either `KEY 1` or `KEY 2` from your resource

2. Go to [Azure AI Foundry](https://ai.azure.com/) and deploy a model.

   :::note
   The deployment name must match the model name for opencode to work properly.
   :::

3. Run the `/connect` command and search for **Azure**.

   ```txt
   /connect
   ```

4. Enter your API key.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

5. Set your resource name as an environment variable:

   ```bash
   AZURE_RESOURCE_NAME=XXX opencode
   ```

   Or add it to your bash profile:

   ```bash title="~/.bash_profile"
   export AZURE_RESOURCE_NAME=XXX
   ```

6. Run the `/models` command to select your deployed model.

   ```txt
   /models
   ```

#### Microsoft Entra ID (Azure CLI)

You can use your Azure CLI session instead of an API key. [Install the Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli), run `az login`, then run `/connect`, select **Azure**, and choose **Microsoft Entra ID (Azure CLI)**. Enter the Azure Resource name when prompted. Use `az login --tenant TENANT_ID` if the Resource belongs to a different tenant.

Find the Resource name by opening your Azure OpenAI or Foundry Resource in the [Azure portal](https://portal.azure.com/) or [Microsoft Foundry](https://ai.azure.com/). It is also the first part of the endpoint: `my-models` in `https://my-models.openai.azure.com/` or `https://my-models.services.ai.azure.com/`. If your identity can list Resources, you can also find their names and Resource groups with:

```bash
az cognitiveservices account list \
  --query "[].{name:name,resourceGroup:resourceGroup}" \
  --output table
```

OpenCode does not query Azure management APIs or discover deployments. Select a model whose catalog name matches your deployment, or configure its deployment name explicitly:

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "azure": {
      "models": {
        "gpt-5-mini": {
          "id": "gpt-production"
        }
      }
    }
  }
}
```

Assign your identity the inference role required by the deployment: **Cognitive Services OpenAI User** for Azure OpenAI models or **Cognitive Services User** for other Foundry models. OpenCode refreshes access tokens through the Azure CLI, including versions earlier than 2.54.0, so you only need to sign in again when the CLI session expires.

---

### Azure Cognitive Services

1. Head over to the [Azure portal](https://portal.azure.com/) and create an **Azure OpenAI** resource. You'll need:
   - **Resource name**: This becomes part of your API endpoint (`https://AZURE_COGNITIVE_SERVICES_RESOURCE_NAME.cognitiveservices.azure.com/`)
   - **API key**: Either `KEY 1` or `KEY 2` from your resource

2. Go to [Azure AI Foundry](https://ai.azure.com/) and deploy a model.

   :::note
   The deployment name must match the model name for opencode to work properly.
   :::

3. Run the `/connect` command and search for **Azure Cognitive Services**.

   ```txt
   /connect
   ```

4. Enter your API key.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

5. Set your resource name as an environment variable:

   ```bash
   AZURE_COGNITIVE_SERVICES_RESOURCE_NAME=XXX opencode
   ```

   Or add it to your bash profile:

   ```bash title="~/.bash_profile"
   export AZURE_COGNITIVE_SERVICES_RESOURCE_NAME=XXX
   ```

6. Run the `/models` command to select your deployed model.

   ```txt
   /models
   ```

---

### Baseten

1. Head over to the [Baseten](https://app.baseten.co/), create an account, and generate an API key.

2. Run the `/connect` command and search for **Baseten**.

   ```txt
   /connect
   ```

3. Enter your Baseten API key.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Run the `/models` command to select a model.

   ```txt
   /models
   ```

---

### Cerebras

1. Head over to the [Cerebras console](https://inference.cerebras.ai/), create an account, and generate an API key.

2. Run the `/connect` command and search for **Cerebras**.

   ```txt
   /connect
   ```

3. Enter your Cerebras API key.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Run the `/models` command to select a model like _Qwen 3 Coder 480B_.

   ```txt
   /models
   ```

---

### Cloudflare AI Gateway

Cloudflare AI Gateway lets you access models from OpenAI, Anthropic, Workers AI, and more through a unified endpoint. With [Unified Billing](https://developers.cloudflare.com/ai-gateway/features/unified-billing/) you don't need separate API keys for each provider.

1. Head over to the [Cloudflare dashboard](https://dash.cloudflare.com/), navigate to **AI** > **AI Gateway**, and create a new gateway. Note your **Account ID** and **Gateway ID**.

2. Run the `/connect` command and search for **Cloudflare AI Gateway**.

   ```txt
   /connect
   ```

3. Enter your **Account ID** when prompted.

   ```txt
   ┌ Enter your Cloudflare Account ID
   │
   │
   └ enter
   ```

4. Enter your **Gateway ID** when prompted.

   ```txt
   ┌ Enter your Cloudflare AI Gateway ID
   │
   │
   └ enter
   ```

5. Enter your **Cloudflare API token**.

   ```txt
   ┌ Gateway API token
   │
   │
   └ enter
   ```

6. Run the `/models` command to select a model.

   ```txt
   /models
   ```

   You can also add models through your opencode config.

   ```json title="opencode.json"
   {
     "$schema": "https://opencode.ai/config.json",
     "provider": {
       "cloudflare-ai-gateway": {
         "models": {
           "openai/gpt-4o": {},
           "anthropic/claude-sonnet-4": {}
         }
       }
     }
   }
   ```

   Alternatively, you can set environment variables instead of using `/connect`.

   ```bash title="~/.bash_profile"
   export CLOUDFLARE_ACCOUNT_ID=your-32-character-account-id
   export CLOUDFLARE_GATEWAY_ID=your-gateway-id
   export CLOUDFLARE_API_TOKEN=your-api-token
   ```

---

### Cloudflare Workers AI

Cloudflare Workers AI lets you run AI models on Cloudflare's global network directly via REST API, with no separate provider accounts needed for supported models.

1. Head over to the [Cloudflare dashboard](https://dash.cloudflare.com/), navigate to **Workers AI**, and select **Use REST API** to get your **Account ID** and create an API token.

2. Run the `/connect` command and search for **Cloudflare Workers AI**.

   ```txt
   /connect
   ```

3. Enter your **Account ID** when prompted.

   ```txt
   ┌ Enter your Cloudflare Account ID
   │
   │
   └ enter
   ```

4. Enter your **Cloudflare API key**.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

5. Run the `/models` command to select a model.

   ```txt
   /models
   ```

   Alternatively, you can set environment variables instead of using `/connect`.

   ```bash title="~/.bash_profile"
   export CLOUDFLARE_ACCOUNT_ID=your-32-character-account-id
   export CLOUDFLARE_API_KEY=your-api-token
   ```

---

### Cortecs

1. Head over to the [Cortecs console](https://cortecs.ai/), create an account, and generate an API key.

2. Run the `/connect` command and search for **Cortecs**.

   ```txt
   /connect
   ```

3. Enter your Cortecs API key.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Run the `/models` command to select a model like _Kimi K2 Instruct_.

   ```txt
   /models
   ```

---

### DeepSeek

1. Head over to the [DeepSeek console](https://platform.deepseek.com/), create an account, and click **Create new API key**.

2. Run the `/connect` command and search for **DeepSeek**.

   ```txt
   /connect
   ```

3. Enter your DeepSeek API key.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Run the `/models` command to select a DeepSeek model like _DeepSeek V4 Pro_.

   ```txt
   /models
   ```

---

### Deep Infra

1. Head over to the [Deep Infra dashboard](https://deepinfra.com/dash), create an account, and generate an API key.

2. Run the `/connect` command and search for **Deep Infra**.

   ```txt
   /connect
   ```

3. Enter your Deep Infra API key.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Run the `/models` command to select a model.

   ```txt
   /models
   ```

---

### DigitalOcean

DigitalOcean's [Inference Engine](https://docs.digitalocean.com/products/inference/) provides access to open models like GPT-OSS, Llama, Qwen, and DeepSeek, plus custom [Inference Routers](https://docs.digitalocean.com/products/inference/how-to/use-inference-router/) that route each request to the cheapest, fastest, or best-fit model for a task.

OpenCode supports two authentication methods:

- **OAuth (Recommended)** — Sign in to your DigitalOcean account; OpenCode uses your DigitalOcean API token directly for inference and discovers your Inference Routers.
- **Model Access Key** — Paste an existing key from the DigitalOcean console.

#### OAuth (Recommended)

1. Run the `/connect` command and search for **DigitalOcean**.

   ```txt
   /connect
   ```

2. Select **Login with DigitalOcean**.

   ```txt
   ┌ Select auth method
   │
   │ Login with DigitalOcean
   │ Paste Model Access Key
   └
   ```

3. Your browser opens to authorize OpenCode. Sign in and approve.

   :::note
   OpenCode requests `genai:read` and `inference:query` OAuth scopes. Your DigitalOcean API token is used directly for inference — no separate Model Access Key is created.
   :::

   :::note
   Inference Routers only appear in the model picker after OAuth. Pasting a Model Access Key manually does not discover routers.
   :::

4. Run the `/models` command. Your Inference Routers appear as the format `router:` in the model selection.

   ```txt
   /models
   ```

5. To pick up newly created Inference Routers, re-run `/connect` and select **DigitalOcean** again.

#### Using a Model Access Key

If you'd rather paste a key directly:

1. Head over to the **Manage** page in the Inference section of the [DigitalOcean console](https://cloud.digitalocean.com/) and create a new key.

2. Run the `/connect` command and select **DigitalOcean**, then **Paste Model Access Key**.

   ```txt
   ┌ Enter your DigitalOcean Model Access Key
   │
   │
   └ enter
   ```

   :::note
   Inference Routers are not auto-discovered with this method. To surface them in the model picker, sign in via OAuth instead.
   :::

3. Run the `/models` command to select a model.

   ```txt
   /models
   ```

#### Environment Variable

Alternatively, set your Model Access Key as an environment variable.

```bash frame="none"
export DIGITALOCEAN_ACCESS_TOKEN=your-model-access-key
```

#### Inference Routers

Inference Routers let you define a routing policy across multiple models — picking the cheapest, fastest, or most appropriate model per request based on the task. After OAuth, OpenCode surfaces each router as `router:<router-name>` in the model picker.

Selecting a router model is a drop-in replacement for any other model — OpenCode forwards your request and DigitalOcean picks the underlying model based on your router's policy. Learn more about [Inference Routers](https://docs.digitalocean.com/products/inference/how-to/use-inference-router/)

---

### Eden AI

[Eden AI](https://www.edenai.co/) is an EU-based gateway that serves models from many vendors over a single OpenAI-compatible API, with a separate EU endpoint for teams that need inference to stay in the EU.

1. Head over to the [Eden AI platform](https://app.edenai.run/user/register) to create an account and generate an API key.

2. Run the `/connect` command and search for **Eden AI**.

   ```txt
   /connect
   ```

3. Enter your Eden AI API key.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Run the `/models` command to select a model like _Mistral Large 3_ or _Claude Sonnet 5_.

   ```txt
   /models
   ```

   Eden AI model ids are themselves in `vendor/model` form, so a full reference has three segments, for example `edenai/anthropic/claude-sonnet-5`.

5. To keep requests on Eden AI's EU gateway, set its base URL.

   ```json title="opencode.json"
   {
     "$schema": "https://opencode.ai/config.json",
     "provider": {
       "edenai": {
         "options": {
           "baseURL": "https://api.eu.edenai.run/v3"
         }
       }
     }
   }
   ```

   The default is `https://api.edenai.run/v3`, so this swaps the global endpoint for the EU one. The EU endpoint serves the subset of the catalog that is available in the EU, so a model chosen in step 4 may not be reachable through it.

---

### FrogBot

1. Head over to the [FrogBot dashboard](https://app.frogbot.ai/signup), create an account, and generate an API key.

2. Run the `/connect` command and search for **FrogBot**.

   ```txt
   /connect
   ```

3. Enter your FrogBot API key.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Run the `/models` command to select a model.

   ```txt
   /models
   ```

---

### Fireworks AI

1. Head over to the [Fireworks AI console](https://app.fireworks.ai/), create an account, and click **Create API Key**.

2. Run the `/connect` command and search for **Fireworks AI**.

   ```txt
   /connect
   ```

3. Enter your Fireworks AI API key.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Run the `/models` command to select a model like _Kimi K2 Instruct_.

   ```txt
   /models
   ```

---

### GitLab Duo

:::caution[Experimental]
GitLab Duo support in OpenCode is experimental. Features, configuration, and
behavior may change in future releases.
:::

OpenCode integrates with the [GitLab Duo Agent Platform](https://docs.gitlab.com/user/duo_agent_platform/),
providing AI-powered agentic chat with native tool calling capabilities.

:::note[License requirements]
GitLab Duo Agent Platform requires a **Premium** or **Ultimate** GitLab
subscription. It is available on GitLab.com and GitLab Self-Managed.
See [GitLab Duo Agent Platform prerequisites](https://docs.gitlab.com/user/duo_agent_platform/#prerequisites)
for full requirements.
:::

1. Run the `/connect` command and select GitLab.

   ```txt
   /connect
   ```

2. Choose your authentication method:

   ```txt
   ┌ Select auth method
   │
   │ OAuth (Recommended)
   │ Personal Access Token
   └
   ```

   #### Using OAuth (Recommended)

   Select **OAuth** and your browser will open for authorization.

   #### Using Personal Access Token
   1. Go to [GitLab User Settings > Access Tokens](https://gitlab.com/-/user_settings/personal_access_tokens)
   2. Click **Add new token**
   3. Name: `OpenCode`, Scopes: `api`
   4. Copy the token (starts with `glpat-`)
   5. Enter it in the terminal

3. Run the `/models` command to see available models.

   ```txt
   /models
   ```

   Three Claude-based models are available:
   - **duo-chat-haiku-4-5** (Default) - Fast responses for quick tasks
   - **duo-chat-sonnet-4-5** - Balanced performance for most workflows
   - **duo-chat-opus-4-5** - Most capable for complex analysis

:::note
You can also specify 'GITLAB_TOKEN' environment variable if you don't want
to store token in opencode auth storage.
:::

##### Self-Hosted GitLab

:::note[compliance note]
OpenCode uses a small model for some AI tasks like generating the session title.
It is configured to use gpt-5-nano by default, hosted by Zen. To lock OpenCode
to only use your own GitLab-hosted instance, add the following to your
`opencode.json` file. It is also recommended to disable session sharing.

```json
{
  "$schema": "https://opencode.ai/config.json",
  "small_model": "gitlab/duo-chat-haiku-4-5",
  "share": "disabled"
}
```

:::

For self-hosted GitLab instances:

```bash
export GITLAB_INSTANCE_URL=https://gitlab.company.com
export GITLAB_TOKEN=glpat-...
```

If your instance runs a custom AI Gateway:

```bash
GITLAB_AI_GATEWAY_URL=https://ai-gateway.company.com
```

Or add to your bash profile:

```bash title="~/.bash_profile"
export GITLAB_INSTANCE_URL=https://gitlab.company.com
export GITLAB_AI_GATEWAY_URL=https://ai-gateway.company.com
export GITLAB_TOKEN=glpat-...
```

:::note
Your GitLab administrator must:

1. [Turn on GitLab Duo](https://docs.gitlab.com/user/duo_agent_platform/turn_on_off/#turn-gitlab-duo-on-or-off)
   for the user, group, or instance
2. [Turn on the Agent Platform](https://docs.gitlab.com/user/duo_agent_platform/turn_on_off/#turn-gitlab-duo-agent-platform-on-or-off)
   (GitLab 18.8+) or [enable beta and experimental features](https://docs.gitlab.com/user/duo_agent_platform/turn_on_off/#turn-on-beta-and-experimental-features)
   (GitLab 18.7 and earlier)
3. For Self-Managed, [configure your instance](https://docs.gitlab.com/administration/gitlab_duo/configure/gitlab_self_managed/)
   :::

##### OAuth for Self-Hosted instances

In order to make Oauth working for your self-hosted instance, you need to create
a new application (Settings → Applications) with the
callback URL `http://127.0.0.1:8080/callback` and following scopes:

- api (Access the API on your behalf)
- read_user (Read your personal information)
- read_repository (Allows read-only access to the repository)

Then expose application ID as environment variable:

```bash
export GITLAB_OAUTH_CLIENT_ID=your_application_id_here
```

More documentation on [opencode-gitlab-auth](https://www.npmjs.com/package/opencode-gitlab-auth) homepage.

##### Configuration

Customize through `opencode.json`:

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "gitlab": {
      "options": {
        "instanceUrl": "https://gitlab.com"
      }
    }
  }
}
```

##### GitLab Duo Agent Platform (DAP) Workflow Models

DAP workflow models provide an alternative execution path that routes tool calls
through GitLab's Duo Workflow Service (DWS) instead of the standard agentic chat.
When a `duo-workflow-*` model is selected, OpenCode will:

1. Discover available models from your GitLab namespace
2. Present a selection picker if multiple models are available
3. Cache the selected model to disk for fast subsequent startups
4. Route tool execution requests through OpenCode's permission-gated tool system

Available DAP workflow models follow the `duo-workflow-*` naming convention and
are dynamically discovered from your GitLab instance.

##### GitLab API Tools (Optional, but highly recommended)

To access GitLab tools (merge requests, issues, pipelines, CI/CD, etc.):

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-gitlab-plugin"]
}
```

This plugin provides comprehensive GitLab repository management capabilities including MR reviews, issue tracking, pipeline monitoring, and more.

---

### GitHub Copilot

To use your GitHub Copilot subscription with opencode:

:::note
Some models might need a [Pro+
subscription](https://github.com/features/copilot/plans) to use.
:::

1. Run the `/connect` command and search for GitHub Copilot.

   ```txt
   /connect
   ```

2. Navigate to [github.com/login/device](https://github.com/login/device) and enter the code.

   ```txt
   ┌ Login with GitHub Copilot
   │
   │ https://github.com/login/device
   │
   │ Enter code: 8F43-6FCF
   │
   └ Waiting for authorization...
   ```

3. Now run the `/models` command to select the model you want.

   ```txt
   /models
   ```

---

### GMI Cloud

To use GMI Cloud with OpenCode:

1. Head over to the [GMI Cloud console](https://console.gmicloud.ai/) to create an API key. You can also review the [API reference](https://docs.gmicloud.ai/inference-engine/api-reference/llm-api-reference) for the endpoint details.

2. Run the `/connect` command and search for **GMI Cloud**.

   ```txt
   /connect
   ```

3. Enter your GMI Cloud API key.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Run the `/models` command to select the model you want.

   ```txt
   /models
   ```

---

### Google Vertex AI

To use Google Vertex AI with OpenCode:

1. Head over to the **Model Garden** in the Google Cloud Console and check the
   models available in your region.

   :::note
   You need to have a Google Cloud project with Vertex AI API enabled.
   :::

2. Set the required environment variables:
   - `GOOGLE_CLOUD_PROJECT`: Your Google Cloud project ID
   - `VERTEX_LOCATION` (optional): The region for Vertex AI (defaults to `global`)
   - Authentication (choose one):
     - `GOOGLE_APPLICATION_CREDENTIALS`: Path to your service account JSON key file
     - Authenticate using gcloud CLI: `gcloud auth application-default login`

   Set them while running opencode.

   ```bash
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json GOOGLE_CLOUD_PROJECT=your-project-id opencode
   ```

   Or add them to your bash profile.

   ```bash title="~/.bash_profile"
   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
   export GOOGLE_CLOUD_PROJECT=your-project-id
   export VERTEX_LOCATION=global
   ```

:::tip
The `global` region improves availability and reduces errors at no extra cost. Use regional endpoints (e.g., `us-central1`) for data residency requirements. [Learn more](https://cloud.google.com/vertex-ai/generative-ai/docs/partner-models/use-partner-models#regional_and_global_endpoints)
:::

3. Run the `/models` command to select the model you want.

   ```txt
   /models
   ```

---

### Groq

1. Head over to the [Groq console](https://console.groq.com/), click **Create API Key**, and copy the key.

2. Run the `/connect` command and search for Groq.

   ```txt
   /connect
   ```

3. Enter the API key for the provider.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Run the `/models` command to select the one you want.

   ```txt
   /models
   ```

---

### Hugging Face

[Hugging Face Inference Providers](https://huggingface.co/docs/inference-providers) provides access to open models supported by 17+ providers.

1. Head over to [Hugging Face settings](https://huggingface.co/settings/tokens/new?ownUserPermissions=inference.serverless.write&tokenType=fineGrained) to create a token with permission to make calls to Inference Providers.

2. Run the `/connect` command and search for **Hugging Face**.

   ```txt
   /connect
   ```

3. Enter your Hugging Face token.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Run the `/models` command to select a model like _Kimi-K2-Instruct_ or _GLM-4.6_.

   ```txt
   /models
   ```

---

### Helicone

[Helicone](https://helicone.ai) is an LLM observability platform that provides logging, monitoring, and analytics for your AI applications. The Helicone AI Gateway routes your requests to the appropriate provider automatically based on the model.

1. Head over to [Helicone](https://helicone.ai), create an account, and generate an API key from your dashboard.

2. Run the `/connect` command and search for **Helicone**.

   ```txt
   /connect
   ```

3. Enter your Helicone API key.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Run the `/models` command to select a model.

   ```txt
   /models
   ```

For more providers and advanced features like caching and rate limiting, check the [Helicone documentation](https://docs.helicone.ai).

#### Optional Configs

In the event you see a feature or model from Helicone that isn't configured automatically through opencode, you can always configure it yourself.

Here's [Helicone's Model Directory](https://helicone.ai/models), you'll need this to grab the IDs of the models you want to add.

```jsonc title="~/.config/opencode/opencode.jsonc"
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "helicone": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Helicone",
      "options": {
        "baseURL": "https://ai-gateway.helicone.ai",
      },
      "models": {
        "gpt-4o": {
          // Model ID (from Helicone's model directory page)
          "name": "GPT-4o", // Your own custom name for the model
        },
        "claude-sonnet-4-20250514": {
          "name": "Claude Sonnet 4",
        },
      },
    },
  },
}
```

#### Custom Headers

Helicone supports custom headers for features like caching, user tracking, and session management. Add them to your provider config using `options.headers`:

```jsonc title="~/.config/opencode/opencode.jsonc"
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "helicone": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Helicone",
      "options": {
        "baseURL": "https://ai-gateway.helicone.ai",
        "headers": {
          "Helicone-Cache-Enabled": "true",
          "Helicone-User-Id": "opencode",
        },
      },
    },
  },
}
```

##### Session tracking

Helicone's [Sessions](https://docs.helicone.ai/features/sessions) feature lets you group related LLM requests together. Use the [opencode-helicone-session](https://github.com/H2Shami/opencode-helicone-session) plugin to automatically log each OpenCode conversation as a session in Helicone.

```bash
npm install -g opencode-helicone-session
```

Add it to your config.

```json title="opencode.json"
{
  "plugin": ["opencode-helicone-session"]
}
```

The plugin injects `Helicone-Session-Id` and `Helicone-Session-Name` headers into your requests. In Helicone's Sessions page, you'll see each OpenCode conversation listed as a separate session.

##### Common Helicone headers

| Header                     | Description                                                   |
| -------------------------- | ------------------------------------------------------------- |
| `Helicone-Cache-Enabled`   | Enable response caching (`true`/`false`)                      |
| `Helicone-User-Id`         | Track metrics by user                                         |
| `Helicone-Property-[Name]` | Add custom properties (e.g., `Helicone-Property-Environment`) |
| `Helicone-Prompt-Id`       | Associate requests with prompt versions                       |

See the [Helicone Header Directory](https://docs.helicone.ai/helicone-headers/header-directory) for all available headers.

---

### llama.cpp

You can configure opencode to use local models through [llama.cpp's](https://github.com/ggml-org/llama.cpp) llama-server utility

```json title="opencode.json" "llama.cpp" {5, 6, 8, 10-15}
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "llama.cpp": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "llama-server (local)",
      "options": {
        "baseURL": "http://127.0.0.1:8080/v1"
      },
      "models": {
        "qwen3-coder:a3b": {
          "name": "Qwen3-Coder: a3b-30b (local)",
          "limit": {
            "context": 128000,
            "output": 65536
          }
        }
      }
    }
  }
}
```

In this example:

- `llama.cpp` is the custom provider ID. This can be any string you want.
- `npm` specifies the package to use for this provider. Here, `@ai-sdk/openai-compatible` is used for any OpenAI-compatible API.
- `name` is the display name for the provider in the UI.
- `options.baseURL` is the endpoint for the local server.
- `models` is a map of model IDs to their configurations. The model name will be displayed in the model selection list.

---

### IO.NET

IO.NET offers 17 models optimized for various use cases:

1. Head over to the [IO.NET console](https://ai.io.net/), create an account, and generate an API key.

2. Run the `/connect` command and search for **IO.NET**.

   ```txt
   /connect
   ```

3. Enter your IO.NET API key.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Run the `/models` command to select a model.

   ```txt
   /models
   ```

---

### LM Studio

You can configure opencode to use local models through LM Studio.

```json title="opencode.json" "lmstudio" {5, 6, 8, 10-14}
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "lmstudio": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "LM Studio (local)",
      "options": {
        "baseURL": "http://127.0.0.1:1234/v1"
      },
      "models": {
        "google/gemma-3n-e4b": {
          "name": "Gemma 3n-e4b (local)"
        }
      }
    }
  }
}
```

In this example:

- `lmstudio` is the custom provider ID. This can be any string you want.
- `npm` specifies the package to use for this provider. Here, `@ai-sdk/openai-compatible` is used for any OpenAI-compatible API.
- `name` is the display name for the provider in the UI.
- `options.baseURL` is the endpoint for the local server.
- `models` is a map of model IDs to their configurations. The model name will be displayed in the model selection list.

---

### Moonshot AI

To use Kimi K2 from Moonshot AI:

1. Head over to the [Moonshot AI console](https://platform.moonshot.ai/console), create an account, and click **Create API key**.

2. Run the `/connect` command and search for **Moonshot AI**.

   ```txt
   /connect
   ```

3. Enter your Moonshot API key.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Run the `/models` command to select _Kimi K2_.

   ```txt
   /models
   ```

---

### MiniMax

1. Head over to the [MiniMax API Console](https://platform.minimax.io/login), create an account, and generate an API key.

2. Run the `/connect` command and search for **MiniMax**.

   ```txt
   /connect
   ```

3. Enter your MiniMax API key.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Run the `/models` command to select a model like _M2.1_.

   ```txt
   /models
   ```

---

### Modal

1. Create a [shared Endpoint](https://modal.com/endpoints) for the model you want to use.

2. Create a [proxy token](https://modal.com/docs/guide/endpoints#proxy-tokens), then join its ID and secret with a period:

   ```txt
   wk-<id>.ws-<secret>
   ```

3. Run the `/connect` command, search for **Modal**, and enter the combined proxy token.

   ```txt
   /connect
   ```

4. Run the `/models` command to select one of the endpoints in your Modal workspace.

   ```txt
   /models
   ```

---

### NVIDIA

NVIDIA provides access to Nemotron models and many other open models through [build.nvidia.com](https://build.nvidia.com) for free.

1. Head over to [build.nvidia.com](https://build.nvidia.com), create an account, and generate an API key.

2. Run the `/connect` command and search for **NVIDIA**.

   ```txt
   /connect
   ```

3. Enter your NVIDIA API key.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Run the `/models` command to select a model like nemotron-3-super-120b-a12b.

   ```txt
   /models
   ```

#### On-Prem / NIM

You can also use NVIDIA models locally via [NVIDIA NIM](https://docs.nvidia.com/nim/) by setting a custom base URL.

```json title="opencode.json" {6}
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "nvidia": {
      "options": {
        "baseURL": "http://localhost:8000/v1"
      }
    }
  }
}
```

#### Environment Variable

Alternatively, set your API key as an environment variable.

```bash frame="none"
export NVIDIA_API_KEY=nvapi-your-key-here
```

---

### Nebius Token Factory

1. Head over to the [Nebius Token Factory console](https://tokenfactory.nebius.com/), create an account, and click **Add Key**.

2. Run the `/connect` command and search for **Nebius Token Factory**.

   ```txt
   /connect
   ```

3. Enter your Nebius Token Factory API key.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Run the `/models` command to select a model like _Kimi K2 Instruct_.

   ```txt
   /models
   ```

---

### Ollama

You can configure opencode to use local models through Ollama.

:::tip
Ollama can automatically configure itself for OpenCode. See the [Ollama integration docs](https://docs.ollama.com/integrations/opencode) for details.
:::

```json title="opencode.json" "ollama" {5, 6, 8, 10-14}
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "ollama": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Ollama (local)",
      "options": {
        "baseURL": "http://localhost:11434/v1"
      },
      "models": {
        "llama2": {
          "name": "Llama 2"
        }
      }
    }
  }
}
```

In this example:

- `ollama` is the custom provider ID. This can be any string you want.
- `npm` specifies the package to use for this provider. Here, `@ai-sdk/openai-compatible` is used for any OpenAI-compatible API.
- `name` is the display name for the provider in the UI.
- `options.baseURL` is the endpoint for the local server.
- `models` is a map of model IDs to their configurations. The model name will be displayed in the model selection list.

:::tip
If tool calls aren't working, try increasing `num_ctx` in Ollama. Start around 16k - 32k.
:::

---

### Ollama Cloud

To use Ollama Cloud with OpenCode:

1. Head over to [https://ollama.com/](https://ollama.com/) and sign in or create an account.

2. Navigate to **Settings** > **Keys** and click **Add API Key** to generate a new API key.

3. Copy the API key for use in OpenCode.

4. Run the `/connect` command and search for **Ollama Cloud**.

   ```txt
   /connect
   ```

5. Enter your Ollama Cloud API key.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

6. **Important**: Before using cloud models in OpenCode, you must pull the model information locally:

   ```bash
   ollama pull gpt-oss:20b-cloud
   ```

7. Run the `/models` command to select your Ollama Cloud model.

   ```txt
   /models
   ```

---

### OpenAI

We recommend signing up for [ChatGPT Plus or Pro](https://chatgpt.com/pricing).

1. Once you've signed up, run the `/connect` command and select OpenAI.

   ```txt
   /connect
   ```

2. Here you can select the **ChatGPT Plus/Pro** option and it'll open your browser
   and ask you to authenticate.

   ```txt
   ┌ Select auth method
   │
   │ ChatGPT Plus/Pro
   │ Manually enter API Key
   └
   ```

3. Now all the OpenAI models should be available when you use the `/models` command.

   ```txt
   /models
   ```

##### Compute residency

For ChatGPT OAuth, OpenCode automatically applies a regional inference residency requirement when one is advertised by your workspace credentials. It forwards the compute residency value from the credential instead of maintaining a fixed list of regions. Data residency at rest does not imply regional inference.

##### Using API keys

If you already have an API key, you can select **Manually enter API Key** and paste it in your terminal.

---

### OpenCode Zen

OpenCode Zen is a list of tested and verified models provided by the OpenCode team. [Learn more](/docs/zen).

1. Sign in to **<a href={console}>OpenCode Zen</a>** and click **Create API Key**.

2. Run the `/connect` command and search for **OpenCode Zen**.

   ```txt
   /connect
   ```

3. Enter your OpenCode API key.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Run the `/models` command to select a model like _Qwen 3 Coder 480B_.

   ```txt
   /models
   ```

---

### OpenRouter

1. Head over to the [OpenRouter dashboard](https://openrouter.ai/settings/keys), click **Create API Key**, and copy the key.

2. Run the `/connect` command and search for OpenRouter.

   ```txt
   /connect
   ```

3. Enter the API key for the provider.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Many OpenRouter models are preloaded by default, run the `/models` command to select the one you want.

   ```txt
   /models
   ```

   You can also add additional models through your opencode config.

   ```json title="opencode.json" {6}
   {
     "$schema": "https://opencode.ai/config.json",
     "provider": {
       "openrouter": {
         "models": {
           "somecoolnewmodel": {}
         }
       }
     }
   }
   ```

5. You can also customize them through your opencode config. Here's an example of specifying a provider

   ```json title="opencode.json"
   {
     "$schema": "https://opencode.ai/config.json",
     "provider": {
       "openrouter": {
         "models": {
           "moonshotai/kimi-k2": {
             "options": {
               "provider": {
                 "order": ["baseten"],
                 "allow_fallbacks": false
               }
             }
           }
         }
       }
     }
   }
   ```

---

### LLM Gateway

1. Head over to the [LLM Gateway dashboard](https://llmgateway.io/dashboard), click **Create API Key**, and copy the key.

2. Run the `/connect` command and search for LLM Gateway.

   ```txt
   /connect
   ```

3. Enter the API key for the provider.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Many LLM Gateway models are preloaded by default, run the `/models` command to select the one you want.

   ```txt
   /models
   ```

   You can also add additional models through your opencode config.

   ```json title="opencode.json" {6}
   {
     "$schema": "https://opencode.ai/config.json",
     "provider": {
       "llmgateway": {
         "models": {
           "somecoolnewmodel": {}
         }
       }
     }
   }
   ```

5. You can also customize them through your opencode config. Here's an example of specifying a provider

   ```json title="opencode.json"
   {
     "$schema": "https://opencode.ai/config.json",
     "provider": {
       "llmgateway": {
         "models": {
           "glm-4.7": {
             "name": "GLM 4.7"
           },
           "gpt-5.2": {
             "name": "GPT-5.2"
           },
           "gemini-2.5-pro": {
             "name": "Gemini 2.5 Pro"
           },
           "claude-3-5-sonnet-20241022": {
             "name": "Claude 3.5 Sonnet"
           }
         }
       }
     }
   }
   ```

---

### Poolside

[Poolside](https://poolside.ai) provides access to its models through an OpenAI-compatible API.

1. Head over to [platform.poolside.ai](https://platform.poolside.ai), sign in, open the **API Keys** tab, and click **New key** to generate an API key.

2. Run the `/connect` command and search for **Poolside**.

   ```txt
   /connect
   ```

3. Enter your Poolside API key.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Run the `/models` command to select a model.

   ```txt
   /models
   ```

#### Poolside deployment

If your organization runs a Poolside deployment, configure it as a custom OpenAI-compatible provider. Store the API key or token from your Poolside administrator in `~/.secrets/poolside-key`. Use a unique provider ID and add the model IDs available from your deployment.

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "poolside-deployment": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Poolside deployment",
      "options": {
        "baseURL": "https://poolside.example.com/openai/v1",
        "apiKey": "{file:~/.secrets/poolside-key}"
      },
      "models": {
        "<served-model-id>": {
          "name": "Poolside deployment model",
          "reasoning": true,
          "interleaved": {
            "field": "reasoning_content"
          }
        }
      }
    }
  }
}
```

Replace `poolside.example.com` with your deployment's host and `<served-model-id>` with a model ID returned by its `/openai/v1/models` endpoint. Model availability and thinking behavior depend on the deployment's configuration.

:::tip
You can also install [Poolside Agent CLI](https://github.com/poolsideai/pool) to use Poolside agents directly from your terminal.
:::

---

### SAP AI Core

SAP AI Core provides access to 40+ models from OpenAI, Anthropic, Google, Amazon, Meta, Mistral, and AI21 through a unified platform.

1. Go to your [SAP BTP Cockpit](https://account.hana.ondemand.com/), navigate to your SAP AI Core service instance, and create a service key.

   :::tip
   The service key is a JSON object containing `clientid`, `clientsecret`, `url`, and `serviceurls.AI_API_URL`. You can find your AI Core instance under **Services** > **Instances and Subscriptions** in the BTP Cockpit.
   :::

2. Run the `/connect` command and search for **SAP AI Core**.

   ```txt
   /connect
   ```

3. Enter your service key JSON.

   ```txt
   ┌ Service key
   │
   │
   └ enter
   ```

   Or set the `AICORE_SERVICE_KEY` environment variable:

   ```bash
   AICORE_SERVICE_KEY='{"clientid":"...","clientsecret":"...","url":"...","serviceurls":{"AI_API_URL":"..."}}' opencode
   ```

   Or add it to your bash profile:

   ```bash title="~/.bash_profile"
   export AICORE_SERVICE_KEY='{"clientid":"...","clientsecret":"...","url":"...","serviceurls":{"AI_API_URL":"..."}}'
   ```

4. Optionally set deployment ID and resource group:

   ```bash
   AICORE_DEPLOYMENT_ID=your-deployment-id AICORE_RESOURCE_GROUP=your-resource-group opencode
   ```

   :::note
   These settings are optional and should be configured according to your SAP AI Core setup.
   :::

5. Run the `/models` command to select from 40+ available models.

   ```txt
   /models
   ```

---

### STACKIT

STACKIT AI Model Serving provides fully managed sovereign hosting environment for AI models, focusing on LLMs like Llama, Mistral, and Qwen, with maximum data sovereignty on European infrastructure.

1. Head over to [STACKIT Portal](https://portal.stackit.cloud), navigate to **AI Model Serving**, and create an auth token for your project.

   :::tip
   You need a STACKIT customer account, user account, and project before creating auth tokens.
   :::

2. Run the `/connect` command and search for **STACKIT**.

   ```txt
   /connect
   ```

3. Enter your STACKIT AI Model Serving auth token.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Run the `/models` command to select from available models like _Qwen3-VL 235B_ or _Llama 3.3 70B_.

   ```txt
   /models
   ```

---

### OVHcloud AI Endpoints

1. Head over to the [OVHcloud panel](https://ovh.com/manager). Navigate to the `Public Cloud` section, `AI & Machine Learning` > `AI Endpoints` and in `API Keys` tab, click **Create a new API key**.

2. Run the `/connect` command and search for **OVHcloud AI Endpoints**.

   ```txt
   /connect
   ```

3. Enter your OVHcloud AI Endpoints API key.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Run the `/models` command to select a model like _gpt-oss-120b_.

   ```txt
   /models
   ```

---

### Scaleway

To use [Scaleway Generative APIs](https://www.scaleway.com/en/docs/generative-apis/) with Opencode:

1. Head over to the [Scaleway Console IAM settings](https://console.scaleway.com/iam/api-keys) to generate a new API key.

2. Run the `/connect` command and search for **Scaleway**.

   ```txt
   /connect
   ```

3. Enter your Scaleway API key.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Run the `/models` command to select a model like _devstral-2-123b-instruct-2512_ or _gpt-oss-120b_.

   ```txt
   /models
   ```

---

### SCX.ai

[SCX.ai](https://scx.ai) is an Australian sovereign AI platform serving open models over an OpenAI-compatible API, hosted on renewable-powered infrastructure in Australia.

1. Head over to the [SCX.ai platform](https://platform.scx.ai) to create an account and generate an API key.

2. Run the `/connect` command and search for **SCX.ai**.

   ```txt
   /connect
   ```

3. Enter your SCX.ai API key.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Run the `/models` command to select a model like _MiniMax-M2.7_ or _GLM-5.2_.

   ```txt
   /models
   ```

---

### Snowflake Cortex

[Snowflake Cortex](https://docs.snowflake.com/en/user-guide/snowflake-cortex/cortex-rest-api) gives you access to frontier models (Claude, OpenAI GPT-5, and more) via an OpenAI-compatible API. All inference runs within the Snowflake perimeter and is billed in Snowflake credits. For per-model rates, see the [Snowflake Service Consumption Table](https://www.snowflake.com/legal-files/CreditConsumptionTable.pdf).

Don't have a Snowflake account? [Sign up for a free trial](https://signup.snowflake.com/?utm_source=opencode&utm_medium=docs&utm_campaign=cortex-provider).

opencode's core workflow for coding, editing files, and running commands relies on tool calling. Only the Claude and OpenAI families within Snowflake Cortex support this. The provider is limited to those families to support the core workflow.

OpenCode supports two authentication methods:

- **Browser OAuth (Recommended)** — sign in with your IdP/SSO; no secrets to manage, tokens refresh automatically.
- **Manual bearer token** — paste a PAT or JWT from the Snowflake console.

#### Browser OAuth (Recommended)

1. Run the `/connect` command and search for **Snowflake Cortex**.

   ```txt
   /connect
   ```

2. Select **Login with Snowflake (External Browser)**.

   ```txt
   ┌ Select auth method
   │
   │ Login with Snowflake (External Browser)
   │ Paste PAT or bearer token manually
   └
   ```

3. Enter your [account identifier](https://docs.snowflake.com/en/user-guide/admin-account-identifier) when prompted, for example `myorg-myaccount` or `xy12345.us-east-1`.

   ```txt
   ┌ Snowflake Account Identifier
   │
   │
   └ enter
   ```

4. Optionally enter a Snowflake role to scope the session (e.g. `SYSADMIN`). Leave blank to use your default role.

5. Complete sign-in in the browser that opens. OpenCode captures the OAuth callback automatically and stores the token — no copy/paste needed.

6. Run the `/models` command to select a model.

   ```txt
   /models
   ```

:::note
Browser OAuth uses Snowflake's built-in `SNOWFLAKE$LOCAL_APPLICATION` security integration ([docs](https://docs.snowflake.com/en/user-guide/oauth-local-applications)), which is rolling out to all accounts. To check availability in your account:

```sql
SHOW SECURITY INTEGRATIONS LIKE 'SNOWFLAKE$LOCAL_APPLICATION';
```

If the result is empty, use the **Manual bearer token** method below while the integration rolls out to your account.
:::

#### Manual bearer token

If you prefer to paste a token directly, or if `SNOWFLAKE$LOCAL_APPLICATION` is not yet available in your account:

1. Generate a [Programmatic Access Token (PAT)](https://docs.snowflake.com/en/user-guide/programmatic-access-tokens) in your Snowflake account.

2. Run the `/connect` command, search for **Snowflake Cortex**, and select **Paste PAT or bearer token manually**.

3. Enter your [account identifier](https://docs.snowflake.com/en/user-guide/admin-account-identifier) when prompted.

4. Paste your PAT.

5. Run the `/models` command to select a model.

   ```txt
   /models
   ```

#### Environment variable

For CI or headless environments, set a PAT or JWT before starting opencode:

```bash
export SNOWFLAKE_ACCOUNT=myorg-myaccount
export SNOWFLAKE_CORTEX_TOKEN=your-pat-or-jwt
```

:::note
`SNOWFLAKE_CORTEX_TOKEN` accepts a PAT or JWT only — the browser OAuth flow is available via `/connect` only and cannot be configured through an environment variable. `SNOWFLAKE_CORTEX_PAT` is still supported for backward compatibility.
:::

The model catalog is provided automatically. A minimal `opencode.json` is all that's needed:

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "model": "snowflake-cortex/claude-sonnet-4-6",
  "small_model": "snowflake-cortex/claude-haiku-4-5"
}
```

---

### Together AI

1. Head over to the [Together AI console](https://api.together.ai), create an account, and click **Add Key**.

2. Run the `/connect` command and search for **Together AI**.

   ```txt
   /connect
   ```

3. Enter your Together AI API key.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Run the `/models` command to select a model like _Kimi K2 Instruct_.

   ```txt
   /models
   ```

---

### Venice AI

1. Head over to the [Venice AI console](https://venice.ai), create an account, and generate an API key.

2. Run the `/connect` command and search for **Venice AI**.

   ```txt
   /connect
   ```

3. Enter your Venice AI API key.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Run the `/models` command to select a model like _Llama 3.3 70B_.

   ```txt
   /models
   ```

---

### Vercel AI Gateway

Vercel AI Gateway lets you access models from OpenAI, Anthropic, Google, xAI, and more through a unified endpoint. Models are offered at list price with no markup.

1. Head over to the [Vercel dashboard](https://vercel.com/), navigate to the **AI Gateway** tab, and click **API keys** to create a new API key.

2. Run the `/connect` command and search for **Vercel AI Gateway**.

   ```txt
   /connect
   ```

3. Enter your Vercel AI Gateway API key.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Run the `/models` command to select a model.

   ```txt
   /models
   ```

You can also customize models through your opencode config. Here's an example of specifying provider routing order.

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "vercel": {
      "models": {
        "anthropic/claude-sonnet-4": {
          "options": {
            "order": ["anthropic", "vertex"]
          }
        }
      }
    }
  }
}
```

Some useful routing options:

| Option              | Description                                          |
| ------------------- | ---------------------------------------------------- |
| `order`             | Provider sequence to try                             |
| `only`              | Restrict to specific providers                       |
| `zeroDataRetention` | Only use providers with zero data retention policies |

---

### xAI

Two ways to authenticate: a SuperGrok subscription via device-code OAuth or a pay-as-you-go API key from the xAI console.

#### Option A — SuperGrok subscription

1. Run the `/connect` command and search for **xAI**.

   ```txt
   /connect
   ```

2. Select **SuperGrok Subscription**. OpenCode opens xAI's verification link with the user code pre-populated when supported.

3. Approve the consent screen. If xAI asks for a code, enter the user code displayed by OpenCode. OpenCode polls xAI's token endpoint and stores the resulting OAuth tokens once you approve.

4. Run the `/models` command to select a Grok model.

   ```txt
   /models
   ```

OpenCode refreshes the OAuth access token automatically. Any Grok or X Premium plan that includes Grok API access works; you do not need a separate `XAI_API_KEY`.

#### Option B — API key

1. Head over to the [xAI console](https://console.x.ai/), create an account, and generate an API key.

2. Run the `/connect` command and search for **xAI**.

   ```txt
   /connect
   ```

3. Select **Manually enter API Key** and paste your xAI API key.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Run the `/models` command to select a model like _Grok Beta_.

   ```txt
   /models
   ```

---

### Z.AI

1. Head over to the [Z.AI API console](https://z.ai/manage-apikey/apikey-list), create an account, and click **Create a new API key**.

2. Run the `/connect` command and search for **Z.AI**.

   ```txt
   /connect
   ```

   If you are subscribed to the **GLM Coding Plan**, select **Z.AI Coding Plan**.

3. Enter your Z.AI API key.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Run the `/models` command to select a model like _GLM-4.7_.

   ```txt
   /models
   ```

---

### ZenMux

1. Head over to the [ZenMux dashboard](https://zenmux.ai/settings/keys), click **Create API Key**, and copy the key.

2. Run the `/connect` command and search for ZenMux.

   ```txt
   /connect
   ```

3. Enter the API key for the provider.

   ```txt
   ┌ API key
   │
   │
   └ enter
   ```

4. Many ZenMux models are preloaded by default, run the `/models` command to select the one you want.

   ```txt
   /models
   ```

   You can also add additional models through your opencode config.

   ```json title="opencode.json" {6}
   {
     "$schema": "https://opencode.ai/config.json",
     "provider": {
       "zenmux": {
         "models": {
           "somecoolnewmodel": {}
         }
       }
     }
   }
   ```

---

## Custom provider

To add any **OpenAI-compatible** provider that's not listed in the `/connect` command:

:::tip
You can use any OpenAI-compatible provider with opencode. Most modern AI providers offer OpenAI-compatible APIs.
:::

1. Run the `/connect` command and scroll down to **Other**.

   ```bash
   $ /connect

   ┌  Add credential
   │
   ◆  Select provider
   │  ...
   │  ● Other
   └
   ```

2. Enter a unique ID for the provider.

   ```bash
   $ /connect

   ┌  Add credential
   │
   ◇  Enter provider id
   │  myprovider
   └
   ```

   :::note
   Choose a memorable ID, you'll use this in your config file.
   :::

3. Enter your API key for the provider.

   ```bash
   $ /connect

   ┌  Add credential
   │
   ▲  This only stores a credential for myprovider - you will need to configure it in opencode.json, check the docs for examples.
   │
   ◇  Enter your API key
   │  sk-...
   └
   ```

4. Create or update your `opencode.json` file in your project directory:

   ```json title="opencode.json" ""myprovider"" {5-15}
   {
     "$schema": "https://opencode.ai/config.json",
     "provider": {
       "myprovider": {
         "npm": "@ai-sdk/openai-compatible",
         "name": "My AI Provider Display Name",
         "options": {
           "baseURL": "https://api.myprovider.com/v1"
         },
         "models": {
           "my-model-name": {
             "name": "My Model Display Name"
           }
         }
       }
     }
   }
   ```

   Here are the configuration options:
   - **npm**: AI SDK package to use, `@ai-sdk/openai-compatible` for OpenAI-compatible providers (for `/v1/chat/completions`). If your provider/model uses `/v1/responses`, use `@ai-sdk/openai`.
   - **name**: Display name in UI.
   - **models**: Available models.
   - **options.baseURL**: API endpoint URL.
   - **options.apiKey**: Optionally set the API key, if not using auth.
   - **options.headers**: Optionally set custom headers.

   More on the advanced options in the example below.

5. Run the `/models` command and your custom provider and models will appear in the selection list.

---

##### Example

Here's an example setting the `apiKey`, `headers`, and model `limit` options.

```json title="opencode.json" {9,11,17-20}
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "myprovider": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "My AI Provider Display Name",
      "options": {
        "baseURL": "https://api.myprovider.com/v1",
        "apiKey": "{env:ANTHROPIC_API_KEY}",
        "headers": {
          "Authorization": "Bearer custom-token"
        }
      },
      "models": {
        "my-model-name": {
          "name": "My Model Display Name",
          "limit": {
            "context": 200000,
            "output": 65536
          }
        }
      }
    }
  }
}
```

Configuration details:

- **apiKey**: Set using `env` variable syntax, [learn more](/docs/config#env-vars).
- **headers**: Custom headers sent with each request.
- **limit.context**: Maximum input tokens the model accepts.
- **limit.output**: Maximum tokens the model can generate.

The `limit` fields allow OpenCode to understand how much context you have left. Standard providers pull these from models.dev automatically.

---

## Troubleshooting

If you are having trouble with configuring a provider, check the following:

1. **Check the auth setup**: Run `opencode auth list` to see if the credentials
   for the provider are added to your config.

   This doesn't apply to providers like Amazon Bedrock, that rely on environment variables for their auth.

2. For custom providers, check the opencode config and:
   - Make sure the provider ID used in the `/connect` command matches the ID in your opencode config.
   - The right npm package is used for the provider. For example, use `@ai-sdk/cerebras` for Cerebras. And for all other OpenAI-compatible providers, use `@ai-sdk/openai-compatible` (for `/v1/chat/completions`); if a model uses `/v1/responses`, use `@ai-sdk/openai`. For mixed setups under one provider, you can override per model via `provider.npm`.
   - Check correct API endpoint is used in the `options.baseURL` field.


---

# SOURCE: `packages/web/src/content/docs/web.mdx`

---
title: Web
description: Using OpenCode in your browser.
---

OpenCode can run as a web application in your browser, providing the same powerful AI coding experience without needing a terminal.

![OpenCode Web - New Session](../../assets/web/web-homepage-new-session.png)

## Getting Started

Start the web interface by running:

```bash
opencode web
```

This starts a local server on `127.0.0.1` with a random available port and automatically opens OpenCode in your default browser.

:::caution
If `OPENCODE_SERVER_PASSWORD` is not set, the server will be unsecured. This is fine for local use but should be set for network access.
:::

:::tip[Windows Users]
For the best experience, run `opencode web` from [WSL](/docs/windows-wsl) rather than PowerShell. This ensures proper file system access and terminal integration.
:::

---

## Configuration

You can configure the web server using command line flags or in your [config file](/docs/config).

### Port

By default, OpenCode picks an available port. You can specify a port:

```bash
opencode web --port 4096
```

### Hostname

By default, the server binds to `127.0.0.1` (localhost only). To make OpenCode accessible on your network:

```bash
opencode web --hostname 0.0.0.0
```

When using `0.0.0.0`, OpenCode will display both local and network addresses:

```
  Local access:       http://localhost:4096
  Network access:     http://192.168.1.100:4096
```

### mDNS Discovery

Enable mDNS to make your server discoverable on the local network:

```bash
opencode web --mdns
```

This automatically sets the hostname to `0.0.0.0` and advertises the server as `opencode.local`.

You can customize the mDNS domain name to run multiple instances on the same network:

```bash
opencode web --mdns --mdns-domain myproject.local
```

### CORS

To allow additional domains for CORS (useful for custom frontends):

```bash
opencode web --cors https://example.com
```

### Authentication

To protect access, set a password using the `OPENCODE_SERVER_PASSWORD` environment variable:

```bash
OPENCODE_SERVER_PASSWORD=secret opencode web
```

The username defaults to `opencode` but can be changed with `OPENCODE_SERVER_USERNAME`.

---

## Using the Web Interface

Once started, the web interface provides access to your OpenCode sessions.

### Sessions

View and manage your sessions from the homepage. You can see active sessions and start new ones.

![OpenCode Web - Active Session](../../assets/web/web-homepage-active-session.png)

### Server Status

Click "See Servers" to view connected servers and their status.

![OpenCode Web - See Servers](../../assets/web/web-homepage-see-servers.png)

---

## Attaching a Terminal

You can attach a terminal TUI to a running web server:

```bash
# Start the web server
opencode web --port 4096

# In another terminal, attach the TUI
opencode attach http://localhost:4096
```

This allows you to use both the web interface and terminal simultaneously, sharing the same sessions and state.

---

## Config File

You can also configure server settings in your `opencode.json` config file:

```json
{
  "server": {
    "port": 4096,
    "hostname": "0.0.0.0",
    "mdns": true,
    "cors": ["https://example.com"]
  }
}
```

Command line flags take precedence over config file settings.


---

# SOURCE: `packages/web/src/content/docs/tui.mdx`

---
title: TUI
description: Using the OpenCode terminal user interface.
---

import { Tabs, TabItem } from "@astrojs/starlight/components"

OpenCode provides an interactive terminal interface or TUI for working on your projects with an LLM.

Running OpenCode starts the TUI for the current directory.

```bash
opencode
```

Or you can start it for a specific working directory.

```bash
opencode /path/to/project
```

Once you're in the TUI, you can prompt it with a message.

```text
Give me a quick summary of the codebase.
```

---

## File references

You can reference files in your messages using `@`. This does a fuzzy file search in the current working directory.

:::tip
You can also use `@` to reference files in your messages.
:::

```text "@packages/functions/src/api/index.ts"
How is auth handled in @packages/functions/src/api/index.ts?
```

The content of the file is added to the conversation automatically.

Configured [references](/docs/references) also appear in `@` autocomplete. Type `@alias` to add the reference root as context, or type `@alias/` to autocomplete files inside that reference.

```text "@docs/README.md"
Compare our setup with @docs/README.md
```

---

## Bash commands

Start a message with `!` to run a shell command.

```bash frame="none"
!ls -la
```

The output of the command is added to the conversation as a tool result.

---

## Commands

When using the OpenCode TUI, you can type `/` followed by a command name to quickly execute actions. For example:

```bash frame="none"
/help
```

Most commands also have keyboard shortcuts using `ctrl+x` as the default leader key. [Learn more](/docs/keybinds).

Here are all available slash commands:

---

### connect

Add a provider to OpenCode. Allows you to select from available providers and add their API keys.

```bash frame="none"
/connect
```

---

### compact

Compact the current session. _Alias_: `/summarize`

```bash frame="none"
/compact
```

**Keybind:** `ctrl+x c`

---

### details

Toggle tool execution details.

```bash frame="none"
/details
```

---

### editor

Open external editor for composing messages. Uses the editor set in your `EDITOR` environment variable. [Learn more](#editor-setup).

```bash frame="none"
/editor
```

**Keybind:** `ctrl+x e`

---

### exit

Exit OpenCode. _Aliases_: `/quit`, `/q`

```bash frame="none"
/exit
```

**Keybind:** `ctrl+x q`

---

### export

Export current conversation to Markdown and open in your default editor. Uses the editor set in your `EDITOR` environment variable. [Learn more](#editor-setup).

```bash frame="none"
/export
```

**Keybind:** `ctrl+x x`

---

### help

Show the help dialog.

```bash frame="none"
/help
```

---

### init

Guided setup for creating or updating `AGENTS.md`. [Learn more](/docs/rules).

```bash frame="none"
/init
```

---

### models

List available models.

```bash frame="none"
/models
```

**Keybind:** `ctrl+x m`

---

### new

Start a new session. _Alias_: `/clear`

```bash frame="none"
/new
```

**Keybind:** `ctrl+x n`

---

### redo

Redo a previously undone message. Only available after using `/undo`.

:::tip
Any file changes will also be restored.
:::

Internally, this uses Git to manage the file changes. So your project **needs to
be a Git repository**.

```bash frame="none"
/redo
```

**Keybind:** `ctrl+x r`

---

### sessions

List and switch between sessions. _Aliases_: `/resume`, `/continue`

```bash frame="none"
/sessions
```

**Keybind:** `ctrl+x l`

---

### share

Share current session. [Learn more](/docs/share).

```bash frame="none"
/share
```

---

### themes

List available themes.

```bash frame="none"
/themes
```

**Keybind:** `ctrl+x t`

---

### thinking

Toggle the visibility of thinking/reasoning blocks in the conversation. When enabled, you can see the model's reasoning process for models that support extended thinking.

:::note
This command only controls whether thinking blocks are **displayed** - it does not enable or disable the model's reasoning capabilities. To toggle actual reasoning capabilities, use `ctrl+t` to cycle through model variants.
:::

```bash frame="none"
/thinking
```

---

### undo

Undo last message in the conversation. Removes the most recent user message, all subsequent responses, and any file changes.

:::tip
Any file changes made will also be reverted.
:::

Internally, this uses Git to manage the file changes. So your project **needs to
be a Git repository**.

```bash frame="none"
/undo
```

**Keybind:** `ctrl+x u`

---

### unshare

Unshare current session. [Learn more](/docs/share#un-sharing).

```bash frame="none"
/unshare
```

---

## Editor setup

Both the `/editor` and `/export` commands use the editor specified in your `EDITOR` environment variable.

<Tabs>
  <TabItem label="Linux/macOS">
    ```bash
    # Example for nano or vim
    export EDITOR=nano
    export EDITOR=vim

    # For GUI editors, VS Code, Cursor, VSCodium, Windsurf, Zed, etc.
    # include --wait
    export EDITOR="code --wait"
    ```

    To make it permanent, add this to your shell profile;
    `~/.bashrc`, `~/.zshrc`, etc.

  </TabItem>

  <TabItem label="Windows (CMD)">
    ```bash
    set EDITOR=notepad

    # For GUI editors, VS Code, Cursor, VSCodium, Windsurf, Zed, etc.
    # include --wait
    set EDITOR=code --wait
    ```

    To make it permanent, use **System Properties** > **Environment
    Variables**.

  </TabItem>

  <TabItem label="Windows (PowerShell)">
    ```powershell
    $env:EDITOR = "notepad"

    # For GUI editors, VS Code, Cursor, VSCodium, Windsurf, Zed, etc.
    # include --wait
    $env:EDITOR = "code --wait"
    ```

    To make it permanent, add this to your PowerShell profile.

  </TabItem>
</Tabs>

Popular editor options include:

- `code` - Visual Studio Code
- `cursor` - Cursor
- `windsurf` - Windsurf
- `nvim` - Neovim editor
- `vim` - Vim editor
- `nano` - Nano editor
- `notepad` - Windows Notepad
- `subl` - Sublime Text

:::note
Some editors like VS Code need to be started with the `--wait` flag.
:::

Some editors need command-line arguments to run in blocking mode. The `--wait` flag makes the editor process block until closed.

---

## Configure

You can customize TUI behavior through `tui.json` (or `tui.jsonc`).

```json title="tui.json"
{
  "$schema": "https://opencode.ai/tui.json",
  "theme": "opencode",
  "leader_timeout": 2000,
  "keybinds": {
    "leader": "ctrl+x",
    "command_list": "ctrl+p"
  },
  "scroll_speed": 3,
  "scroll_acceleration": {
    "enabled": false
  },
  "diff_style": "auto",
  "cursor": {
    "style": "block",
    "blinking": true
  },
  "mouse": true,
  "attention": {
    "enabled": true,
    "notifications": true,
    "sound": true,
    "volume": 0.4,
    "sound_pack": "opencode.default",
    "sounds": {
      "error": "./sounds/error.mp3"
    }
  }
}
```

This is separate from `opencode.json`, which configures server/runtime behavior.

`keybinds` is merged with built-in defaults, so you only need to configure the shortcuts you want to change.

### Options

- `theme` - Sets your UI theme. [Learn more](/docs/themes).
- `keybinds` - Customizes keyboard shortcuts. [Learn more](/docs/keybinds).
- `leader_timeout` - Controls how long OpenCode waits after the leader key. Defaults to `2000`.
- `scroll_acceleration.enabled` - Enable macOS-style scroll acceleration for smooth, natural scrolling. When enabled, scroll speed increases with rapid scrolling gestures and stays precise for slower movements. **This setting takes precedence over `scroll_speed` and overrides it when enabled.**
- `scroll_speed` - Controls how fast the TUI scrolls when using scroll commands (minimum: `0.001`, supports decimal values). Defaults to `3`. **Note: This is ignored if `scroll_acceleration.enabled` is set to `true`.**
- `diff_style` - Controls diff rendering. `"auto"` adapts to terminal width, `"stacked"` always shows a single-column layout.
- `cursor` - Controls the terminal cursor in TUI input fields. `style` defaults to `"block"`, can be `"underline"`, `"line"`, or `"default"`; `blinking` defaults to `true`. When `style` is `"default"`, the terminal default cursor is restored, so `blinking` has no effect.
- `mouse` - Enable or disable mouse capture in the TUI (default: `true`). When disabled, the terminal's native mouse selection/scrolling behavior is preserved.
- `attention` - Configures TUI desktop notifications and sounds. Disabled by default.

Use `OPENCODE_TUI_CONFIG` to load a custom TUI config path.

### Attention

The TUI can request attention for questions, permissions, session errors, and completed sessions. Enable it with `attention.enabled`; built-in events play sounds when triggered, and non-subagent events request desktop notifications only when the terminal is blurred.

- `enabled` - Enable all attention notifications and sounds. Defaults to `false`.
- `notifications` - Allow terminal-mediated desktop notifications when attention is enabled. Defaults to `true`.
- `sound` - Allow attention sounds when attention is enabled. Defaults to `true`.
- `volume` - Default sound volume from `0` to `1`. Defaults to `0.4`.
- `sound_pack` - Sound pack ID to use. Defaults to `opencode.default`.
- `sounds` - Override sound files for `default`, `question`, `permission`, `error`, `done`, or `subagent_done`. Paths can be absolute, `file://` URLs, or relative to `tui.json`.

---

## Customization

You can customize various aspects of the TUI view using the command palette (`ctrl+p`). These settings persist across restarts.

---

#### Username display

Toggle whether your username appears in chat messages. Access this through:

- Command palette: Search for "username" or "hide username"
- The setting persists automatically and will be remembered across TUI sessions


---

# SOURCE: `packages/web/src/content/docs/lsp.mdx`

---
title: LSP Servers
description: OpenCode integrates with your LSP servers.
---

OpenCode can integrate with Language Server Protocol (LSP) servers to use diagnostics as feedback for the agent.

---

## Built-in

OpenCode comes with several built-in LSP servers for popular languages:

| LSP Server         | Extensions                                                          | Requirements                                                 |
| ------------------ | ------------------------------------------------------------------- | ------------------------------------------------------------ |
| astro              | .astro                                                              | Auto-installs for Astro projects                             |
| bash               | .sh, .bash, .zsh, .ksh                                              | Auto-installs bash-language-server                           |
| clangd             | .c, .cpp, .cc, .cxx, .c++, .h, .hpp, .hh, .hxx, .h++                | Auto-installs for C/C++ projects                             |
| csharp             | .cs, .csx                                                           | `.NET SDK` installed                                         |
| clojure-lsp        | .clj, .cljs, .cljc, .edn                                            | `clojure-lsp` command available                              |
| dart               | .dart                                                               | `dart` command available                                     |
| deno               | .ts, .tsx, .js, .jsx, .mjs                                          | `deno` command available (auto-detects deno.json/deno.jsonc) |
| elixir-ls          | .ex, .exs                                                           | `elixir` command available                                   |
| eslint             | .ts, .tsx, .js, .jsx, .mjs, .cjs, .mts, .cts, .vue                  | `eslint` dependency in project                               |
| fsharp             | .fs, .fsi, .fsx, .fsscript                                          | `.NET SDK` installed                                         |
| gleam              | .gleam                                                              | `gleam` command available                                    |
| gopls              | .go                                                                 | `go` command available                                       |
| hls                | .hs, .lhs                                                           | `haskell-language-server-wrapper` command available          |
| jdtls              | .java                                                               | `Java SDK (version 21+)` installed                           |
| julials            | .jl                                                                 | `julia` and `LanguageServer.jl` installed                    |
| kotlin-ls          | .kt, .kts                                                           | Auto-installs for Kotlin projects                            |
| lua-ls             | .lua                                                                | Auto-installs for Lua projects                               |
| nixd               | .nix                                                                | `nixd` command available                                     |
| ocaml-lsp          | .ml, .mli                                                           | `ocamllsp` command available                                 |
| oxlint             | .ts, .tsx, .js, .jsx, .mjs, .cjs, .mts, .cts, .vue, .astro, .svelte | `oxlint` dependency in project                               |
| php intelephense   | .php                                                                | Auto-installs for PHP projects                               |
| prisma             | .prisma                                                             | `prisma` command available                                   |
| pyright            | .py, .pyi                                                           | `pyright` dependency installed                               |
| razor              | .razor, .cshtml                                                     | `.NET SDK` and VS Code C# extension installed                |
| ruby-lsp (rubocop) | .rb, .rake, .gemspec, .ru                                           | `ruby` and `gem` commands available                          |
| rust               | .rs                                                                 | `rust-analyzer` command available                            |
| sourcekit-lsp      | .swift, .objc, .objcpp                                              | `swift` installed (`xcode` on macOS)                         |
| svelte             | .svelte                                                             | Auto-installs for Svelte projects                            |
| terraform          | .tf, .tfvars                                                        | Auto-installs from GitHub releases                           |
| tinymist           | .typ, .typc                                                         | Auto-installs from GitHub releases                           |
| typescript         | .ts, .tsx, .js, .jsx, .mjs, .cjs, .mts, .cts                        | `typescript` dependency in project                           |
| vue                | .vue                                                                | Auto-installs for Vue projects                               |
| yaml-ls            | .yaml, .yml                                                         | Auto-installs Red Hat yaml-language-server                   |
| zls                | .zig, .zon                                                          | `zig` command available                                      |

LSP is disabled by default. When enabled, servers start when one of the above file extensions is detected and the requirements are met.

:::note
You can disable automatic LSP server downloads by setting the `OPENCODE_DISABLE_LSP_DOWNLOAD` environment variable to `true`.
:::

---

## How It Works

When LSP is enabled and opencode opens a file, it:

1. Checks the file extension against all enabled LSP servers.
2. Starts the appropriate LSP server if not already running.

---

## Best Practices

LSP can help the agent find and fix issues by providing diagnostics from language servers. This is useful in some projects, but it is not always a net positive.

Language servers can get out of sync, use significant memory, vary by version or project, and slow down agent workflows. In many projects it is better to have the agent run lint, typecheck, or other diagnostic CLI tools directly, so errors are fed back into the agent loop without those tradeoffs. Document those commands in instruction files such as `AGENTS.md` or skills so the agent knows what to run. Enable LSP when your project benefits from additional language-server feedback.

---

## Configure

You can enable and customize LSP servers through the `lsp` section in your opencode config.

To enable all built-in LSP servers, set `lsp` to `true`.

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "lsp": true
}
```

Use an object to keep built-ins enabled while configuring overrides or custom servers.

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "lsp": {}
}
```

Each configured LSP server entry supports the following:

Server entries need `command` unless they only disable a server.

| Property         | Type     | Description                                       |
| ---------------- | -------- | ------------------------------------------------- |
| `disabled`       | boolean  | Set this to `true` to disable the LSP server      |
| `command`        | string[] | The command to start the LSP server               |
| `extensions`     | string[] | File extensions this LSP server should handle     |
| `env`            | object   | Environment variables to set when starting server |
| `initialization` | object   | Initialization options to send to the LSP server  |

Let's look at some examples.

---

### Environment variables

Use the `env` property to set environment variables when starting the LSP server:

```json title="opencode.json" {5-8}
{
  "$schema": "https://opencode.ai/config.json",
  "lsp": {
    "rust": {
      "command": ["rust-analyzer"],
      "env": {
        "RUST_LOG": "debug"
      }
    }
  }
}
```

---

### Initialization options

Use the `initialization` property to pass initialization options to the LSP server. These are server-specific settings sent during the LSP `initialize` request:

```json title="opencode.json" {5-13}
{
  "$schema": "https://opencode.ai/config.json",
  "lsp": {
    "custom-lsp": {
      "command": ["custom-lsp-server", "--stdio"],
      "extensions": [".custom"],
      "initialization": {
        "preferences": {
          "importModuleSpecifierPreference": "relative"
        }
      }
    }
  }
}
```

:::note
Initialization options vary by LSP server. Check your LSP server's documentation for available options.
:::

---

### Disabling LSP servers

If `lsp` is omitted, all LSP servers are disabled. To disable all LSP servers after another config enabled them, set `lsp` to `false`:

```json title="opencode.json" {3}
{
  "$schema": "https://opencode.ai/config.json",
  "lsp": false
}
```

To disable a **specific** LSP server, set `disabled` to `true`:

```json title="opencode.json" {5}
{
  "$schema": "https://opencode.ai/config.json",
  "lsp": {
    "typescript": {
      "disabled": true
    }
  }
}
```

---

### Custom LSP servers

You can add custom LSP servers by specifying the command and file extensions:

```json title="opencode.json" {4-7}
{
  "$schema": "https://opencode.ai/config.json",
  "lsp": {
    "custom-lsp": {
      "command": ["custom-lsp-server", "--stdio"],
      "extensions": [".custom"]
    }
  }
}
```

---

## Additional Information

### PHP Intelephense

PHP Intelephense offers premium features through a license key. You can provide a license key by placing (only) the key in a text file at:

- On macOS/Linux: `$HOME/intelephense/license.txt`
- On Windows: `%USERPROFILE%/intelephense/license.txt`

The file should contain only the license key with no additional content.


---

# SOURCE: `packages/web/src/content/docs/formatters.mdx`

---
title: Formatters
description: OpenCode uses language specific formatters.
---

OpenCode can format files after they are written or edited using language-specific formatters. Formatters are disabled by default; enable them in your config before OpenCode will run them.

---

## Built-in

OpenCode comes with several built-in formatters for popular languages and frameworks. Below is a list of the formatters, supported file extensions, and commands or config options it needs.

| Formatter            | Extensions                                                                                               | Requirements                                                                                          |
| -------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| air                  | .R                                                                                                       | `air` command available                                                                               |
| biome                | .js, .jsx, .ts, .tsx, .html, .css, .md, .json, .yaml, and [more](https://biomejs.dev/)                   | `biome.json(c)` config file                                                                           |
| cargofmt             | .rs                                                                                                      | `cargo fmt` command available                                                                         |
| clang-format         | .c, .cpp, .h, .hpp, .ino, and [more](https://clang.llvm.org/docs/ClangFormat.html)                       | `.clang-format` config file                                                                           |
| cljfmt               | .clj, .cljs, .cljc, .edn                                                                                 | `cljfmt` command available                                                                            |
| dart                 | .dart                                                                                                    | `dart` command available                                                                              |
| dfmt                 | .d                                                                                                       | `dfmt` command available                                                                              |
| gleam                | .gleam                                                                                                   | `gleam` command available                                                                             |
| gofmt                | .go                                                                                                      | `gofmt` command available                                                                             |
| htmlbeautifier       | .erb, .html.erb                                                                                          | `htmlbeautifier` command available                                                                    |
| ktlint               | .kt, .kts                                                                                                | `ktlint` command available                                                                            |
| mix                  | .ex, .exs, .eex, .heex, .leex, .neex, .sface                                                             | `mix` command available                                                                               |
| nixfmt               | .nix                                                                                                     | `nixfmt` command available                                                                            |
| ocamlformat          | .ml, .mli                                                                                                | `ocamlformat` command available and `.ocamlformat` config file                                        |
| ormolu               | .hs                                                                                                      | `ormolu` command available                                                                            |
| oxfmt (Experimental) | .js, .jsx, .ts, .tsx                                                                                     | `oxfmt` dependency in `package.json` and an [experimental env variable flag](/docs/cli/#experimental) |
| pint                 | .php                                                                                                     | `laravel/pint` dependency in `composer.json`                                                          |
| prettier             | .js, .jsx, .ts, .tsx, .html, .css, .md, .json, .yaml, and [more](https://prettier.io/docs/en/index.html) | `prettier` dependency in `package.json`                                                               |
| rubocop              | .rb, .rake, .gemspec, .ru                                                                                | `rubocop` command available                                                                           |
| ruff                 | .py, .pyi                                                                                                | `ruff` command available with config                                                                  |
| rustfmt              | .rs                                                                                                      | `rustfmt` command available                                                                           |
| shfmt                | .sh, .bash                                                                                               | `shfmt` command available                                                                             |
| standardrb           | .rb, .rake, .gemspec, .ru                                                                                | `standardrb` command available                                                                        |
| terraform            | .tf, .tfvars                                                                                             | `terraform` command available                                                                         |
| uv                   | .py, .pyi                                                                                                | `uv` command available                                                                                |
| zig                  | .zig, .zon                                                                                               | `zig` command available                                                                               |

When formatters are enabled, OpenCode will use `prettier` for matching files if your project has `prettier` in `package.json`.

---

## How it works

When OpenCode writes or edits a file and formatters are enabled, it:

1. Checks the file extension against all enabled formatters.
2. Runs the appropriate formatter command on the file.
3. Applies the formatting changes.

This process happens in the background for enabled formatters.

---

## Configure

You can enable and customize formatters through the `formatter` section in your OpenCode config.

To enable all built-in formatters, set `formatter` to `true`.

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "formatter": true
}
```

Use an object to keep built-ins enabled while configuring overrides or custom formatters.

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "formatter": {}
}
```

Each formatter configuration supports the following:

| Property      | Type     | Description                                                                                |
| ------------- | -------- | ------------------------------------------------------------------------------------------ |
| `disabled`    | boolean  | Set this to `true` to disable the formatter                                                |
| `command`     | string[] | The command to run for formatting. Required for custom formatters; optional for built-ins. |
| `environment` | object   | Environment variables to set when running the formatter                                    |
| `extensions`  | string[] | File extensions this formatter should handle                                               |

Let's look at some examples.

---

### Disabling formatters

If `formatter` is omitted, all formatters are disabled. To disable all formatters after another config enabled them, set `formatter` to `false`:

```json title="opencode.json" {3}
{
  "$schema": "https://opencode.ai/config.json",
  "formatter": false
}
```

To disable a **specific** formatter, set `disabled` to `true`:

```json title="opencode.json" {5}
{
  "$schema": "https://opencode.ai/config.json",
  "formatter": {
    "prettier": {
      "disabled": true
    }
  }
}
```

---

### Custom formatters

You can configure built-in formatters with options like `environment` or `extensions`. To add a custom formatter, specify a `command` and `extensions`:

```json title="opencode.json" {4-14}
{
  "$schema": "https://opencode.ai/config.json",
  "formatter": {
    "prettier": {
      "command": ["npx", "prettier", "--write", "$FILE"],
      "environment": {
        "NODE_ENV": "development"
      },
      "extensions": [".js", ".ts", ".jsx", ".tsx"]
    },
    "custom-markdown-formatter": {
      "command": ["deno", "fmt", "$FILE"],
      "extensions": [".md"]
    }
  }
}
```

The **`$FILE` placeholder** in the command will be replaced with the path to the file being formatted.


---

# SOURCE: `packages/web/src/content/docs/server.mdx`

---
title: Server
description: Interact with opencode server over HTTP.
---

import config from "../../../config.mjs"
export const typesUrl = `${config.github}/blob/dev/packages/sdk/js/src/gen/types.gen.ts`

The `opencode serve` command runs a headless HTTP server that exposes an OpenAPI endpoint that an opencode client can use.

---

### Usage

```bash
opencode serve [--port <number>] [--hostname <string>] [--cors <origin>]
```

#### Options

| Flag            | Description                         | Default          |
| --------------- | ----------------------------------- | ---------------- |
| `--port`        | Port to listen on                   | `4096`           |
| `--hostname`    | Hostname to listen on               | `127.0.0.1`      |
| `--mdns`        | Enable mDNS discovery               | `false`          |
| `--mdns-domain` | Custom domain name for mDNS service | `opencode.local` |
| `--cors`        | Additional browser origins to allow | `[]`             |

`--cors` can be passed multiple times:

```bash
opencode serve --cors http://localhost:5173 --cors https://app.example.com
```

---

### Authentication

Set `OPENCODE_SERVER_PASSWORD` to protect the server with HTTP basic auth. The username defaults to `opencode`, or set `OPENCODE_SERVER_USERNAME` to override it. This applies to both `opencode serve` and `opencode web`.

```bash
OPENCODE_SERVER_PASSWORD=your-password opencode serve
```

---

### How it works

When you run `opencode` it starts a TUI and a server. Where the TUI is the
client that talks to the server. The server exposes an OpenAPI 3.1 spec
endpoint. This endpoint is also used to generate an [SDK](/docs/sdk).

:::tip
Use the opencode server to interact with opencode programmatically.
:::

This architecture lets opencode support multiple clients and allows you to interact with opencode programmatically.

You can run `opencode serve` to start a standalone server. If you have the
opencode TUI running, `opencode serve` will start a new server.

---

#### Connect to an existing server

When you start the TUI it randomly assigns a port and hostname. You can instead pass in the `--hostname` and `--port` [flags](/docs/cli). Then use this to connect to its server.

The [`/tui`](#tui) endpoint can be used to drive the TUI through the server. For example, you can prefill or run a prompt. This setup is used by the OpenCode [IDE](/docs/ide) plugins.

---

## Spec

The server publishes an OpenAPI 3.1 spec that can be viewed at:

```
http://<hostname>:<port>/doc
```

For example, `http://localhost:4096/doc`. Use the spec to generate clients or inspect request and response types. Or view it in a Swagger explorer.

---

## APIs

The opencode server exposes the following APIs.

---

### Global

| Method | Path             | Description                    | Response                             |
| ------ | ---------------- | ------------------------------ | ------------------------------------ |
| `GET`  | `/global/health` | Get server health and version  | `{ healthy: true, version: string }` |
| `GET`  | `/global/event`  | Get global events (SSE stream) | Event stream                         |

---

### Project

| Method | Path               | Description             | Response                                      |
| ------ | ------------------ | ----------------------- | --------------------------------------------- |
| `GET`  | `/project`         | List all projects       | <a href={typesUrl}><code>Project[]</code></a> |
| `GET`  | `/project/current` | Get the current project | <a href={typesUrl}><code>Project</code></a>   |

---

### Path & VCS

| Method | Path    | Description                          | Response                                    |
| ------ | ------- | ------------------------------------ | ------------------------------------------- |
| `GET`  | `/path` | Get the current path                 | <a href={typesUrl}><code>Path</code></a>    |
| `GET`  | `/vcs`  | Get VCS info for the current project | <a href={typesUrl}><code>VcsInfo</code></a> |

---

### Instance

| Method | Path                | Description                  | Response  |
| ------ | ------------------- | ---------------------------- | --------- |
| `POST` | `/instance/dispose` | Dispose the current instance | `boolean` |

---

### Config

| Method  | Path                | Description                       | Response                                                                                 |
| ------- | ------------------- | --------------------------------- | ---------------------------------------------------------------------------------------- |
| `GET`   | `/config`           | Get config info                   | <a href={typesUrl}><code>Config</code></a>                                               |
| `PATCH` | `/config`           | Update config                     | <a href={typesUrl}><code>Config</code></a>                                               |
| `GET`   | `/config/providers` | List providers and default models | `{ providers: `<a href={typesUrl}>Provider[]</a>`, default: { [key: string]: string } }` |

---

### Provider

| Method | Path                             | Description                          | Response                                                                            |
| ------ | -------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------- |
| `GET`  | `/provider`                      | List all providers                   | `{ all: `<a href={typesUrl}>Provider[]</a>`, default: {...}, connected: string[] }` |
| `GET`  | `/provider/auth`                 | Get provider authentication methods  | `{ [providerID: string]: `<a href={typesUrl}>ProviderAuthMethod[]</a>` }`           |
| `POST` | `/provider/{id}/oauth/authorize` | Authorize a provider using OAuth     | <a href={typesUrl}><code>ProviderAuthAuthorization</code></a>                       |
| `POST` | `/provider/{id}/oauth/callback`  | Handle OAuth callback for a provider | `boolean`                                                                           |

---

### Sessions

| Method   | Path                                     | Description                           | Notes                                                                              |
| -------- | ---------------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------- |
| `GET`    | `/session`                               | List all sessions                     | Returns <a href={typesUrl}><code>Session[]</code></a>                              |
| `POST`   | `/session`                               | Create a new session                  | body: `{ parentID?, title? }`, returns <a href={typesUrl}><code>Session</code></a> |
| `GET`    | `/session/status`                        | Get session status for all sessions   | Returns `{ [sessionID: string]: `<a href={typesUrl}>SessionStatus</a>` }`          |
| `GET`    | `/session/:id`                           | Get session details                   | Returns <a href={typesUrl}><code>Session</code></a>                                |
| `DELETE` | `/session/:id`                           | Delete a session and all its data     | Returns `boolean`                                                                  |
| `PATCH`  | `/session/:id`                           | Update session properties             | body: `{ title? }`, returns <a href={typesUrl}><code>Session</code></a>            |
| `GET`    | `/session/:id/children`                  | Get a session's child sessions        | Returns <a href={typesUrl}><code>Session[]</code></a>                              |
| `GET`    | `/session/:id/todo`                      | Get the todo list for a session       | Returns <a href={typesUrl}><code>Todo[]</code></a>                                 |
| `POST`   | `/session/:id/init`                      | Analyze app and create `AGENTS.md`    | body: `{ messageID, providerID, modelID }`, returns `boolean`                      |
| `POST`   | `/session/:id/fork`                      | Fork an existing session at a message | body: `{ messageID? }`, returns <a href={typesUrl}><code>Session</code></a>        |
| `POST`   | `/session/:id/abort`                     | Abort a running session               | Returns `boolean`                                                                  |
| `POST`   | `/session/:id/share`                     | Share a session                       | Returns <a href={typesUrl}><code>Session</code></a>                                |
| `DELETE` | `/session/:id/share`                     | Unshare a session                     | Returns <a href={typesUrl}><code>Session</code></a>                                |
| `GET`    | `/session/:id/diff`                      | Get the diff for this session         | query: `messageID?`, returns <a href={typesUrl}><code>FileDiff[]</code></a>        |
| `POST`   | `/session/:id/summarize`                 | Summarize the session                 | body: `{ providerID, modelID }`, returns `boolean`                                 |
| `POST`   | `/session/:id/revert`                    | Revert a message                      | body: `{ messageID, partID? }`, returns `boolean`                                  |
| `POST`   | `/session/:id/unrevert`                  | Restore all reverted messages         | Returns `boolean`                                                                  |
| `POST`   | `/session/:id/permissions/:permissionID` | Respond to a permission request       | body: `{ response, remember? }`, returns `boolean`                                 |

---

### Messages

| Method | Path                              | Description                             | Notes                                                                                                                                                                 |
| ------ | --------------------------------- | --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET`  | `/session/:id/message`            | List messages in a session              | query: `limit?`, returns `{ info: `<a href={typesUrl}>Message</a>`, parts: `<a href={typesUrl}>Part[]</a>`}[]`                                                        |
| `POST` | `/session/:id/message`            | Send a message and wait for response    | body: `{ messageID?, model?, agent?, noReply?, system?, tools?, parts }`, returns `{ info: `<a href={typesUrl}>Message</a>`, parts: `<a href={typesUrl}>Part[]</a>`}` |
| `GET`  | `/session/:id/message/:messageID` | Get message details                     | Returns `{ info: `<a href={typesUrl}>Message</a>`, parts: `<a href={typesUrl}>Part[]</a>`}`                                                                           |
| `POST` | `/session/:id/prompt_async`       | Send a message asynchronously (no wait) | body: same as `/session/:id/message`, returns `204 No Content`                                                                                                        |
| `POST` | `/session/:id/command`            | Execute a slash command                 | body: `{ messageID?, agent?, model?, command, arguments }`, returns `{ info: `<a href={typesUrl}>Message</a>`, parts: `<a href={typesUrl}>Part[]</a>`}`               |
| `POST` | `/session/:id/shell`              | Run a shell command                     | body: `{ agent, model?, command }`, returns `{ info: `<a href={typesUrl}>Message</a>`, parts: `<a href={typesUrl}>Part[]</a>`}`                                       |

---

### Commands

| Method | Path       | Description       | Response                                      |
| ------ | ---------- | ----------------- | --------------------------------------------- |
| `GET`  | `/command` | List all commands | <a href={typesUrl}><code>Command[]</code></a> |

---

### Files

| Method | Path                     | Description                        | Response                                                                                    |
| ------ | ------------------------ | ---------------------------------- | ------------------------------------------------------------------------------------------- |
| `GET`  | `/find?pattern=<pat>`    | Search for text in files           | Array of match objects with `path`, `lines`, `line_number`, `absolute_offset`, `submatches` |
| `GET`  | `/find/file?query=<q>`   | Find files and directories by name | `string[]` (paths)                                                                          |
| `GET`  | `/find/symbol?query=<q>` | Find workspace symbols             | <a href={typesUrl}><code>Symbol[]</code></a>                                                |
| `GET`  | `/file?path=<path>`      | List files and directories         | <a href={typesUrl}><code>FileNode[]</code></a>                                              |
| `GET`  | `/file/content?path=<p>` | Read a file                        | <a href={typesUrl}><code>FileContent</code></a>                                             |
| `GET`  | `/file/status`           | Get status for tracked files       | <a href={typesUrl}><code>File[]</code></a>                                                  |

#### `/find/file` query parameters

- `query` (required) — search string (fuzzy match)
- `type` (optional) — limit results to `"file"` or `"directory"`
- `directory` (optional) — override the project root for the search
- `limit` (optional) — max results (1–200)
- `dirs` (optional) — legacy flag (`"false"` returns only files)

---

### Tools (Experimental)

| Method | Path                                        | Description                              | Response                                     |
| ------ | ------------------------------------------- | ---------------------------------------- | -------------------------------------------- |
| `GET`  | `/experimental/tool/ids`                    | List all tool IDs                        | <a href={typesUrl}><code>ToolIDs</code></a>  |
| `GET`  | `/experimental/tool?provider=<p>&model=<m>` | List tools with JSON schemas for a model | <a href={typesUrl}><code>ToolList</code></a> |

---

### LSP, Formatters & MCP

| Method | Path         | Description                | Response                                                 |
| ------ | ------------ | -------------------------- | -------------------------------------------------------- |
| `GET`  | `/lsp`       | Get LSP server status      | <a href={typesUrl}><code>LSPStatus[]</code></a>          |
| `GET`  | `/formatter` | Get formatter status       | <a href={typesUrl}><code>FormatterStatus[]</code></a>    |
| `GET`  | `/mcp`       | Get MCP server status      | `{ [name: string]: `<a href={typesUrl}>MCPStatus</a>` }` |
| `POST` | `/mcp`       | Add MCP server dynamically | body: `{ name, config }`, returns MCP status object      |

---

### Agents

| Method | Path     | Description               | Response                                    |
| ------ | -------- | ------------------------- | ------------------------------------------- |
| `GET`  | `/agent` | List all available agents | <a href={typesUrl}><code>Agent[]</code></a> |

---

### Logging

| Method | Path   | Description                                                  | Response  |
| ------ | ------ | ------------------------------------------------------------ | --------- |
| `POST` | `/log` | Write log entry. Body: `{ service, level, message, extra? }` | `boolean` |

---

### TUI

| Method | Path                    | Description                                 | Response               |
| ------ | ----------------------- | ------------------------------------------- | ---------------------- |
| `POST` | `/tui/append-prompt`    | Append text to the prompt                   | `boolean`              |
| `POST` | `/tui/open-help`        | Open the help dialog                        | `boolean`              |
| `POST` | `/tui/open-sessions`    | Open the session selector                   | `boolean`              |
| `POST` | `/tui/open-themes`      | Open the theme selector                     | `boolean`              |
| `POST` | `/tui/open-models`      | Open the model selector                     | `boolean`              |
| `POST` | `/tui/submit-prompt`    | Submit the current prompt                   | `boolean`              |
| `POST` | `/tui/clear-prompt`     | Clear the prompt                            | `boolean`              |
| `POST` | `/tui/execute-command`  | Execute a command (`{ command }`)           | `boolean`              |
| `POST` | `/tui/show-toast`       | Show toast (`{ title?, message, variant }`) | `boolean`              |
| `GET`  | `/tui/control/next`     | Wait for the next control request           | Control request object |
| `POST` | `/tui/control/response` | Respond to a control request (`{ body }`)   | `boolean`              |

---

### Auth

| Method | Path        | Description                                                     | Response  |
| ------ | ----------- | --------------------------------------------------------------- | --------- |
| `PUT`  | `/auth/:id` | Set authentication credentials. Body must match provider schema | `boolean` |

---

### Events

| Method | Path     | Description                                                                   | Response                  |
| ------ | -------- | ----------------------------------------------------------------------------- | ------------------------- |
| `GET`  | `/event` | Server-sent events stream. First event is `server.connected`, then bus events | Server-sent events stream |

---

### Docs

| Method | Path   | Description               | Response                    |
| ------ | ------ | ------------------------- | --------------------------- |
| `GET`  | `/doc` | OpenAPI 3.1 specification | HTML page with OpenAPI spec |


---

# SOURCE: `packages/web/src/content/docs/acp.mdx`

---
title: ACP Support
description: Use OpenCode in any ACP-compatible editor.
---

OpenCode supports the [Agent Client Protocol](https://agentclientprotocol.com) or (ACP), allowing you to use it directly in compatible editors and IDEs.

:::tip
For a list of editors and tools that support ACP, check out the [ACP progress report](https://zed.dev/blog/acp-progress-report#available-now).
:::

ACP is an open protocol that standardizes communication between code editors and AI coding agents.

---

## Configure

To use OpenCode via ACP, configure your editor to run the `opencode acp` command.

The command starts OpenCode as an ACP-compatible subprocess that communicates with your editor over JSON-RPC via stdio.

Below are examples for popular editors that support ACP.

---

### Zed

Install OpenCode from the [Zed ACP Registry](https://zed.dev/docs/ai/external-agents#registry) by running `zed: acp registry` in the Command Palette.

To use a custom OpenCode executable instead, add it to your [Zed](https://zed.dev) configuration (`~/.config/zed/settings.json`):

```json title="~/.config/zed/settings.json"
{
  "agent_servers": {
    "OpenCode": {
      "type": "custom",
      "command": "opencode",
      "args": ["acp"]
    }
  }
}
```

To open it, use the `agent: new thread` action in the **Command Palette**.

You can also bind a keyboard shortcut by editing your `keymap.json`:

```json title="keymap.json"
[
  {
    "bindings": {
      "cmd-alt-o": [
        "agent::NewExternalAgentThread",
        {
          "agent": {
            "custom": {
              "name": "OpenCode",
              "command": {
                "command": "opencode",
                "args": ["acp"]
              }
            }
          }
        }
      ]
    }
  }
]
```

---

### JetBrains IDEs

Add to your [JetBrains IDE](https://www.jetbrains.com/) acp.json according to the [documentation](https://www.jetbrains.com/help/ai-assistant/acp.html):

```json title="acp.json"
{
  "agent_servers": {
    "OpenCode": {
      "command": "/absolute/path/bin/opencode",
      "args": ["acp"]
    }
  }
}
```

To open it, use the new 'OpenCode' agent in the AI Chat agent selector.

---

### Avante.nvim

Add to your [Avante.nvim](https://github.com/yetone/avante.nvim) configuration:

```lua
{
  acp_providers = {
    ["opencode"] = {
      command = "opencode",
      args = { "acp" }
    }
  }
}
```

If you need to pass environment variables:

```lua {6-8}
{
  acp_providers = {
    ["opencode"] = {
      command = "opencode",
      args = { "acp" },
      env = {
        OPENCODE_API_KEY = os.getenv("OPENCODE_API_KEY")
      }
    }
  }
}
```

---

### CodeCompanion.nvim

To use OpenCode as an ACP agent in [CodeCompanion.nvim](https://github.com/olimorris/codecompanion.nvim), add the following to your Neovim config:

```lua
require("codecompanion").setup({
  interactions = {
    chat = {
      adapter = {
        name = "opencode",
        model = "claude-sonnet-4",
      },
    },
  },
})
```

This config sets up CodeCompanion to use OpenCode as the ACP agent for chat.

If you need to pass environment variables (like `OPENCODE_API_KEY`), refer to [Configuring Adapters: Environment Variables](https://codecompanion.olimorris.dev/getting-started#setting-an-api-key) in the CodeCompanion.nvim documentation for full details.

## Support

OpenCode works the same via ACP as it does in the terminal. All features are supported:

:::note
Some built-in slash commands like `/undo` and `/redo` are currently unsupported.
:::

- Built-in tools (file operations, terminal commands, etc.)
- Custom tools and slash commands
- MCP servers configured in your OpenCode config
- Project-specific rules from `AGENTS.md`
- Custom formatters and linters
- Agents and permissions system
