# OpenCode official v1 operational documentation snapshot

Captured from `anomalyco/opencode` commit `03e67171ab2dc1e7f16e8cebfbc7f778f61b89f0` on 2026-09-28.



---

# SOURCE: `packages/web/src/content/docs/agents.mdx`

---
title: Agents
description: Configure and use specialized agents.
---

Agents are specialized AI assistants that can be configured for specific tasks and workflows. They allow you to create focused tools with custom prompts, models, and tool access.

:::tip
Use the plan agent to analyze code and review suggestions without making any code changes.
:::

You can switch between agents during a session or invoke them with the `@` mention.

---

## Types

There are two types of agents in OpenCode; primary agents and subagents.

---

### Primary agents

Primary agents are the main assistants you interact with directly. You can cycle through them using the **Tab** key, or your configured `switch_agent` keybind. These agents handle your main conversation. Tool access is configured via permissions — for example, Build has all tools enabled while Plan is restricted.

:::tip
You can use the **Tab** key to switch between primary agents during a session.
:::

OpenCode comes with two built-in primary agents, **Build** and **Plan**. We'll
look at these below.

---

### Subagents

Subagents are specialized assistants that primary agents can invoke for specific tasks. You can also manually invoke them by **@ mentioning** them in your messages.

OpenCode comes with three built-in subagents, **General**, **Explore**, and **Scout**. We'll look at this below.

---

## Built-in

OpenCode comes with two built-in primary agents and three built-in subagents.

---

### Use build

_Mode_: `primary`

Build is the **default** primary agent with all tools enabled. This is the standard agent for development work where you need full access to file operations and system commands.

---

### Use plan

_Mode_: `primary`

A restricted agent designed for planning and analysis. We use a permission system to give you more control and prevent unintended changes.
By default, all of the following are set to `ask`:

- `file edits`: All writes, patches, and edits
- `bash`: All bash commands

This agent is useful when you want the LLM to analyze code, suggest changes, or create plans without making any actual modifications to your codebase.

---

### Use general

_Mode_: `subagent`

A general-purpose agent for researching complex questions and executing multi-step tasks. Has full tool access (except todo), so it can make file changes when needed. Use this to run multiple units of work in parallel.

---

### Use explore

_Mode_: `subagent`

A fast, read-only agent for exploring codebases. Cannot modify files. Use this when you need to quickly find files by patterns, search code for keywords, or answer questions about the codebase.

---

### Use scout

_Mode_: `subagent`

A read-only agent for external docs and dependency research. Use this when you need to clone a dependency repository into OpenCode's managed cache, inspect library source, or cross-reference local code against upstream implementations without modifying your workspace.

---

### Use compaction

_Mode_: `primary`

Hidden system agent that compacts long context into a smaller summary. It runs automatically when needed and is not selectable in the UI.

---

### Use title

_Mode_: `primary`

Hidden system agent that generates short session titles. It runs automatically and is not selectable in the UI.

---

### Use summary

_Mode_: `primary`

Hidden system agent that creates session summaries. It runs automatically and is not selectable in the UI.

---

## Usage

1. For primary agents, use the **Tab** key to cycle through them during a session. You can also use your configured `switch_agent` keybind.

2. Subagents can be invoked:
   - **Automatically** by primary agents for specialized tasks based on their descriptions.
   - Manually by **@ mentioning** a subagent in your message. For example.

     ```txt frame="none"
     @general help me search for this function
     ```

3. **Navigation between sessions**: When subagents create child sessions, use `session_child_first` (default: **\<Leader>+Down**) to enter the first child session from the parent.

4. Once you are in a child session, use:
   - `session_child_cycle` (default: **Right**) to cycle to the next child session
   - `session_child_cycle_reverse` (default: **Left**) to cycle to the previous child session
   - `session_parent` (default: **Up**) to return to the parent session

   This lets you switch between the main conversation and specialized subagent work.

---

## Configure

You can customize the built-in agents or create your own through configuration. Agents can be configured in two ways:

---

### JSON

Configure agents in your `opencode.json` config file:

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "build": {
      "mode": "primary",
      "model": "anthropic/claude-sonnet-4-20250514",
      "prompt": "{file:./prompts/build.txt}",
      "permission": {
        "edit": "allow",
        "bash": "allow"
      }
    },
    "plan": {
      "mode": "primary",
      "model": "anthropic/claude-haiku-4-20250514",
      "permission": {
        "edit": "deny",
        "bash": "deny"
      }
    },
    "code-reviewer": {
      "description": "Reviews code for best practices and potential issues",
      "mode": "subagent",
      "model": "anthropic/claude-sonnet-4-20250514",
      "prompt": "You are a code reviewer. Focus on security, performance, and maintainability.",
      "permission": {
        "edit": "deny"
      }
    }
  }
}
```

---

### Markdown

You can also define agents using markdown files. Place them in:

- Global: `~/.config/opencode/agents/`
- Per-project: `.opencode/agents/`

```markdown title="~/.config/opencode/agents/review.md"
---
description: Reviews code for quality and best practices
mode: subagent
model: anthropic/claude-sonnet-4-20250514
temperature: 0.1
permission:
  edit: deny
  bash: deny
---

You are in code review mode. Focus on:

- Code quality and best practices
- Potential bugs and edge cases
- Performance implications
- Security considerations

Provide constructive feedback without making direct changes.
```

The markdown file name becomes the agent name. For example, `review.md` creates a `review` agent.

---

## Options

Let's look at these configuration options in detail.

---

### Description

Use the `description` option to provide a brief description of what the agent does and when to use it.

```json title="opencode.json"
{
  "agent": {
    "review": {
      "description": "Reviews code for best practices and potential issues"
    }
  }
}
```

This is a **required** config option.

---

### Temperature

Control the randomness and creativity of the LLM's responses with the `temperature` config.

Lower values make responses more focused and deterministic, while higher values increase creativity and variability.

```json title="opencode.json"
{
  "agent": {
    "plan": {
      "temperature": 0.1
    },
    "creative": {
      "temperature": 0.8
    }
  }
}
```

Temperature values typically range from 0.0 to 1.0:

- **0.0-0.2**: Very focused and deterministic responses, ideal for code analysis and planning
- **0.3-0.5**: Balanced responses with some creativity, good for general development tasks
- **0.6-1.0**: More creative and varied responses, useful for brainstorming and exploration

```json title="opencode.json"
{
  "agent": {
    "analyze": {
      "temperature": 0.1,
      "prompt": "{file:./prompts/analysis.txt}"
    },
    "build": {
      "temperature": 0.3
    },
    "brainstorm": {
      "temperature": 0.7,
      "prompt": "{file:./prompts/creative.txt}"
    }
  }
}
```

If no temperature is specified, OpenCode uses model-specific defaults; typically 0 for most models, 0.55 for Qwen models.

---

### Max steps

Control the maximum number of agentic iterations an agent can perform before being forced to respond with text only. This allows users who wish to control costs to set a limit on agentic actions.

If this is not set, the agent will continue to iterate until the model chooses to stop or the user interrupts the session.

```json title="opencode.json"
{
  "agent": {
    "quick-thinker": {
      "description": "Fast reasoning with limited iterations",
      "prompt": "You are a quick thinker. Solve problems with minimal steps.",
      "steps": 5
    }
  }
}
```

When the limit is reached, the agent receives a special system prompt instructing it to respond with a summarization of its work and recommended remaining tasks.

:::caution
The legacy `maxSteps` field is deprecated. Use `steps` instead.
:::

---

### Disable

Set to `true` to disable the agent.

```json title="opencode.json"
{
  "agent": {
    "review": {
      "disable": true
    }
  }
}
```

---

### Prompt

Specify a custom system prompt file for this agent with the `prompt` config. The prompt file should contain instructions specific to the agent's purpose.

```json title="opencode.json"
{
  "agent": {
    "review": {
      "prompt": "{file:./prompts/code-review.txt}"
    }
  }
}
```

This path is relative to where the config file is located. So this works for both the global OpenCode config and the project specific config.

---

### Model

Use the `model` config to override the model for this agent. Useful for using different models optimized for different tasks. For example, a faster model for planning, a more capable model for implementation.

:::tip
If you don’t specify a model, primary agents use the [model globally configured](/docs/config#models) while subagents will use the model of the primary agent that invoked the subagent.
:::

```json title="opencode.json"
{
  "agent": {
    "plan": {
      "model": "anthropic/claude-haiku-4-20250514"
    }
  }
}
```

The model ID in your OpenCode config uses the format `provider/model-id`. For example, if you're using [OpenCode Zen](/docs/zen), you would use `opencode/gpt-5.1-codex` for GPT 5.1 Codex.

---

### Tools (deprecated)

`tools` is **deprecated**. Prefer the agent's [`permission`](#permissions) field for new configs, updates and more fine-grained control.

Allows you to control which tools are available in this agent. You can enable or disable specific tools by setting them to `true` or `false`. In an agent's `tools` config, `true` is equivalent to `{"*": "allow"}` permission and `false` is equivalent to `{"*": "deny"}` permission.

```json title="opencode.json" {3-6,9-12}
{
  "$schema": "https://opencode.ai/config.json",
  "tools": {
    "write": true,
    "bash": true
  },
  "agent": {
    "plan": {
      "tools": {
        "write": false,
        "bash": false
      }
    }
  }
}
```

:::note
The agent-specific config overrides the global config.
:::

You can also use wildcards in legacy `tools` entries to control multiple tools at once. For example, to disable all tools from an MCP server:

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "readonly": {
      "tools": {
        "mymcp_*": false,
        "write": false,
        "edit": false
      }
    }
  }
}
```

[Learn more about tools](/docs/tools).

---

### Permissions

You can configure permissions to manage what actions an agent can take. Each permission key can be set to:

- `"ask"` — Prompt for approval before running the tool
- `"allow"` — Allow all operations without approval
- `"deny"` — Disable the tool

The available permission keys are:

| Key                  | Tools it gates                                                   |
| -------------------- | ---------------------------------------------------------------- |
| `read`               | `read`                                                           |
| `edit`               | `write`, `edit`, `apply_patch`                                   |
| `glob`               | `glob`                                                           |
| `grep`               | `grep`                                                           |
| `list`               | `list`                                                           |
| `bash`               | `bash`                                                           |
| `task`               | `task`                                                           |
| `external_directory` | Any tool that reads or writes files outside the project worktree |
| `todowrite`          | `todowrite`, `todoread`                                          |
| `webfetch`           | `webfetch`                                                       |
| `websearch`          | `websearch`                                                      |
| `lsp`                | `lsp`                                                            |
| `skill`              | `skill`                                                          |
| `question`           | `question`                                                       |
| `doom_loop`          | Recovery prompts when an agent appears stuck                     |

`read`, `edit`, `glob`, `grep`, `list`, `bash`, `task`, `external_directory`, `lsp`, and `skill` accept either a shorthand action (`"allow" | "ask" | "deny"`) or an object of glob/pattern → action for fine-grained control. The remaining keys accept the shorthand action only.

:::note
Permission keys are matched as wildcard patterns against the underlying tool name, so the same syntax works for built-ins, custom tools, and MCP tools — for example `"mymcp_*": "deny"` denies every tool from an MCP server, and `"mymcp_search": "ask"` targets a single one.
:::

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "edit": "deny"
  }
}
```

You can override these permissions per agent.

```json title="opencode.json" {3-5,8-10}
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "edit": "deny"
  },
  "agent": {
    "build": {
      "permission": {
        "edit": "ask"
      }
    }
  }
}
```

You can also set permissions in Markdown agents.

```markdown title="~/.config/opencode/agents/review.md"
---
description: Code review without edits
mode: subagent
permission:
  edit: deny
  bash:
    "*": ask
    "git diff": allow
    "git log*": allow
    "grep *": allow
  webfetch: deny
---

Only analyze code and suggest changes.
```

You can set permissions for specific bash commands.

```json title="opencode.json" {7}
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "build": {
      "permission": {
        "bash": {
          "git push": "ask",
          "grep *": "allow"
        }
      }
    }
  }
}
```

This can take a glob pattern.

```json title="opencode.json" {7}
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "build": {
      "permission": {
        "bash": {
          "git *": "ask"
        }
      }
    }
  }
}
```

And you can also use the `*` wildcard to manage permissions for all commands.
Since the last matching rule takes precedence, put the `*` wildcard first and specific rules after.

```json title="opencode.json" {8}
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "build": {
      "permission": {
        "bash": {
          "*": "ask",
          "git status *": "allow"
        }
      }
    }
  }
}
```

[Learn more about permissions](/docs/permissions).

---

### Mode

Control the agent's mode with the `mode` config. The `mode` option is used to determine how the agent can be used.

```json title="opencode.json"
{
  "agent": {
    "review": {
      "mode": "subagent"
    }
  }
}
```

The `mode` option can be set to `primary`, `subagent`, or `all`. If no `mode` is specified, it defaults to `all`.

---

### Hidden

Hide a subagent from the `@` autocomplete menu with `hidden: true`. Useful for internal subagents that should only be invoked programmatically by other agents via the Task tool.

```json title="opencode.json"
{
  "agent": {
    "internal-helper": {
      "mode": "subagent",
      "hidden": true
    }
  }
}
```

This only affects user visibility in the autocomplete menu. Hidden agents can still be invoked by the model via the Task tool if permissions allow.

:::note
Only applies to `mode: subagent` agents.
:::

---

### Task permissions

Control which subagents an agent can invoke via the Task tool with `permission.task`. Uses glob patterns for flexible matching.

```json title="opencode.json"
{
  "agent": {
    "orchestrator": {
      "mode": "primary",
      "permission": {
        "task": {
          "*": "deny",
          "orchestrator-*": "allow",
          "code-reviewer": "ask"
        }
      }
    }
  }
}
```

When set to `deny`, the subagent is removed from the Task tool description entirely, so the model won't attempt to invoke it.

:::tip
Rules are evaluated in order, and the **last matching rule wins**. In the example above, `orchestrator-planner` matches both `*` (deny) and `orchestrator-*` (allow), but since `orchestrator-*` comes after `*`, the result is `allow`.
:::

:::tip
Users can always invoke any subagent directly via the `@` autocomplete menu, even if the agent's task permissions would deny it.
:::

---

### Color

Customize the agent's visual appearance in the UI with the `color` option. This affects how the agent appears in the interface.

Use a valid hex color (e.g., `#FF5733`) or theme color: `primary`, `secondary`, `accent`, `success`, `warning`, `error`, `info`.

```json title="opencode.json"
{
  "agent": {
    "creative": {
      "color": "#ff6b6b"
    },
    "code-reviewer": {
      "color": "accent"
    }
  }
}
```

---

### Top P

Control response diversity with the `top_p` option. Alternative to temperature for controlling randomness.

```json title="opencode.json"
{
  "agent": {
    "brainstorm": {
      "top_p": 0.9
    }
  }
}
```

Values range from 0.0 to 1.0. Lower values are more focused, higher values more diverse.

---

### Additional

Any other options you specify in your agent configuration will be **passed through directly** to the provider as model options. This allows you to use provider-specific features and parameters.

For example, with OpenAI's reasoning models, you can control the reasoning effort:

```json title="opencode.json" {6,7}
{
  "agent": {
    "deep-thinker": {
      "description": "Agent that uses high reasoning effort for complex problems",
      "model": "openai/gpt-5",
      "reasoningEffort": "high",
      "textVerbosity": "low"
    }
  }
}
```

These additional options are model and provider-specific. Check your provider's documentation for available parameters.

:::tip
Run `opencode models` to see a list of the available models.
:::

---

## Create agents

You can create new agents using the following command:

```bash
opencode agent create
```

This interactive command will:

1. Ask where to save the agent; global or project-specific.
2. Description of what the agent should do.
3. Generate an appropriate system prompt and identifier.
4. Let you select which permissions the agent should be allowed (anything you don't select is denied).
5. Finally, create a markdown file with the agent configuration.

---

## Use cases

Here are some common use cases for different agents.

- **Build agent**: Full development work with all tools enabled
- **Plan agent**: Analysis and planning without making changes
- **Review agent**: Code review with read-only access plus documentation tools
- **Debug agent**: Focused on investigation with bash and read tools enabled
- **Docs agent**: Documentation writing with file operations but no system commands

---

## Examples

Here are some example agents you might find useful.

:::tip
Do you have an agent you'd like to share? [Submit a PR](https://github.com/anomalyco/opencode).
:::

---

### Documentation agent

```markdown title="~/.config/opencode/agents/docs-writer.md"
---
description: Writes and maintains project documentation
mode: subagent
permission:
  bash: deny
---

You are a technical writer. Create clear, comprehensive documentation.

Focus on:

- Clear explanations
- Proper structure
- Code examples
- User-friendly language
```

---

### Security auditor

```markdown title="~/.config/opencode/agents/security-auditor.md"
---
description: Performs security audits and identifies vulnerabilities
mode: subagent
permission:
  edit: deny
---

You are a security expert. Focus on identifying potential security issues.

Look for:

- Input validation vulnerabilities
- Authentication and authorization flaws
- Data exposure risks
- Dependency vulnerabilities
- Configuration security issues
```


---

# SOURCE: `packages/web/src/content/docs/config.mdx`

---
title: Config
description: Using the OpenCode JSON config.
---

You can configure OpenCode using a JSON config file.

---

## Format

OpenCode supports both **JSON** and **JSONC** (JSON with Comments) formats.

```jsonc title="opencode.jsonc"
{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-4-5",
  "autoupdate": true,
  "server": {
    "port": 4096,
  },
}
```

---

## Locations

You can place your config in a couple of different locations and they have a
different order of precedence.

:::note
Configuration files are **merged together**, not replaced.
:::

Configuration files are merged together, not replaced. Settings from the following config locations are combined. Later configs override earlier ones only for conflicting keys. Non-conflicting settings from all configs are preserved.

For example, if your global config sets `autoupdate: true` and your project config sets `model: "anthropic/claude-sonnet-4-5"`, the final configuration will include both settings.

---

### Precedence order

Config sources are loaded in this order (later sources override earlier ones):

1. **Remote config** (from `.well-known/opencode`) - organizational defaults
2. **Global config** (`~/.config/opencode/opencode.json`) - user preferences
3. **Custom config** (`OPENCODE_CONFIG` env var) - custom overrides
4. **Project config** (`opencode.json` in project) - project-specific settings
5. **`.opencode` directories** - agents, commands, plugins
6. **Inline config** (`OPENCODE_CONFIG_CONTENT` env var) - runtime overrides
7. **Managed config files** (`/Library/Application Support/opencode/` on macOS) - admin-controlled
8. **macOS managed preferences** (`.mobileconfig` via MDM) - highest priority, not user-overridable

This means project configs can override global defaults, and global configs can override remote organizational defaults. Managed settings override everything.

:::note
The `.opencode` and `~/.config/opencode` directories use **plural names** for subdirectories: `agents/`, `commands/`, `modes/`, `plugins/`, `skills/`, `tools/`, and `themes/`. Singular names (e.g., `agent/`) are also supported for backwards compatibility.
:::

---

### Remote

Organizations can provide default configuration via the `.well-known/opencode` endpoint. This is fetched automatically when you authenticate with a provider that supports it.

Remote config is loaded first, serving as the base layer. All other config sources (global, project) can override these defaults.

For example, if your organization provides MCP servers that are disabled by default:

```json title="Remote config from .well-known/opencode"
{
  "mcp": {
    "jira": {
      "type": "remote",
      "url": "https://jira.example.com/mcp",
      "enabled": false
    }
  }
}
```

You can enable specific servers in your local config:

```json title="opencode.json"
{
  "mcp": {
    "jira": {
      "type": "remote",
      "url": "https://jira.example.com/mcp",
      "enabled": true
    }
  }
}
```

---

### Global

Place your global OpenCode config in `~/.config/opencode/opencode.json`. Use global config for user-wide server/runtime preferences like providers, models, and permissions.

For TUI-specific settings, use `~/.config/opencode/tui.json`.

Global config overrides remote organizational defaults.

---

### Per project

Add `opencode.json` in your project root. Project config has the highest precedence among standard config files - it overrides both global and remote configs.

For project-specific TUI settings, add `tui.json` alongside it.

:::tip
Place project specific config in the root of your project.
:::

When OpenCode starts up, it first looks for a config file in the current directory, then traverses up to the nearest Git directory.

This is also safe to be checked into Git and uses the same schema as the global one.

---

### Custom path

Specify a custom config file path using the `OPENCODE_CONFIG` environment variable.

```bash
export OPENCODE_CONFIG=/path/to/my/custom-config.json
opencode run "Hello world"
```

Custom config is loaded between global and project configs in the precedence order.

---

### Custom directory

Specify a custom config directory using the `OPENCODE_CONFIG_DIR`
environment variable. This directory will be searched for agents, commands,
modes, and plugins just like the standard `.opencode` directory, and should
follow the same structure.

```bash
export OPENCODE_CONFIG_DIR=/path/to/my/config-directory
opencode run "Hello world"
```

The custom directory is loaded after the global config and `.opencode` directories, so it **can override** their settings.

---

### Managed settings

Organizations can enforce configuration that users cannot override. Managed settings are loaded at the highest priority tier.

#### File-based

Drop an `opencode.json` or `opencode.jsonc` file in the system managed config directory:

| Platform | Path                                     |
| -------- | ---------------------------------------- |
| macOS    | `/Library/Application Support/opencode/` |
| Linux    | `/etc/opencode/`                         |
| Windows  | `%ProgramData%\opencode`                 |

These directories require admin/root access to write, so users cannot modify them.

#### macOS managed preferences

On macOS, OpenCode reads managed preferences from the `ai.opencode.managed` preference domain. Deploy a `.mobileconfig` via MDM (Jamf, Kandji, FleetDM) and the settings are enforced automatically.

OpenCode checks these paths:

1. `/Library/Managed Preferences/<user>/ai.opencode.managed.plist`
2. `/Library/Managed Preferences/ai.opencode.managed.plist`

The plist keys map directly to `opencode.json` fields. MDM metadata keys (`PayloadUUID`, `PayloadType`, etc.) are stripped automatically.

**Creating a `.mobileconfig`**

Use the `ai.opencode.managed` PayloadType. The OpenCode config keys go directly in the payload dict:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>PayloadContent</key>
  <array>
    <dict>
      <key>PayloadType</key>
      <string>ai.opencode.managed</string>
      <key>PayloadIdentifier</key>
      <string>com.example.opencode.config</string>
      <key>PayloadUUID</key>
      <string>GENERATE-YOUR-OWN-UUID</string>
      <key>PayloadVersion</key>
      <integer>1</integer>
      <key>share</key>
      <string>disabled</string>
      <key>server</key>
      <dict>
        <key>hostname</key>
        <string>127.0.0.1</string>
      </dict>
      <key>permission</key>
      <dict>
        <key>*</key>
        <string>ask</string>
        <key>bash</key>
        <dict>
          <key>*</key>
          <string>ask</string>
          <key>rm -rf *</key>
          <string>deny</string>
        </dict>
      </dict>
    </dict>
  </array>
  <key>PayloadType</key>
  <string>Configuration</string>
  <key>PayloadIdentifier</key>
  <string>com.example.opencode</string>
  <key>PayloadUUID</key>
  <string>GENERATE-YOUR-OWN-UUID</string>
  <key>PayloadVersion</key>
  <integer>1</integer>
</dict>
</plist>
```

Generate unique UUIDs with `uuidgen`. Customize the settings to match your organization's requirements.

**Deploying via MDM**

- **Jamf Pro:** Computers > Configuration Profiles > Upload > scope to target devices or smart groups
- **FleetDM:** Add the `.mobileconfig` to your gitops repo under `mdm.macos_settings.custom_settings` and run `fleetctl apply`

**Verifying on a device**

Double-click the `.mobileconfig` to install locally for testing (shows in System Settings > Privacy & Security > Profiles), then run:

```bash
opencode debug config
```

All managed preference keys appear in the resolved config and cannot be overridden by user or project configuration.

---

## Schema

The server/runtime config schema is defined in [**`opencode.ai/config.json`**](https://opencode.ai/config.json).

TUI config uses [**`opencode.ai/tui.json`**](https://opencode.ai/tui.json).

Your editor should be able to validate and autocomplete based on the schema.

---

### TUI

Use a dedicated `tui.json` (or `tui.jsonc`) file for TUI-specific settings.

```json title="tui.json"
{
  "$schema": "https://opencode.ai/tui.json",
  "scroll_speed": 3,
  "scroll_acceleration": {
    "enabled": true
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
    "volume": 0.4
  }
}
```

Use `OPENCODE_TUI_CONFIG` to point to a custom TUI config file.

When `cursor.style` is `"default"`, the terminal default cursor is restored, so `cursor.blinking` has no effect.

Set `attention.enabled` to turn on TUI desktop notifications and sounds. See [TUI attention](/docs/tui#attention).

Legacy `theme`, `keybinds`, and `tui` keys in `opencode.json` are deprecated and automatically migrated when possible.

---

### Server

You can configure server settings for the `opencode serve` and `opencode web` commands through the `server` option.

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "server": {
    "port": 4096,
    "hostname": "0.0.0.0",
    "mdns": true,
    "mdnsDomain": "myproject.local",
    "cors": ["http://localhost:5173"]
  }
}
```

Available options:

- `port` - Port to listen on.
- `hostname` - Hostname to listen on. When `mdns` is enabled and no hostname is set, defaults to `0.0.0.0`.
- `mdns` - Enable mDNS service discovery. This allows other devices on the network to discover your OpenCode server.
- `mdnsDomain` - Custom domain name for mDNS service. Defaults to `opencode.local`. Useful for running multiple instances on the same network.
- `cors` - Additional origins to allow for CORS when using the HTTP server from a browser-based client. Values must be full origins (scheme + host + optional port), eg `https://app.example.com`.

[Learn more about the server here](/docs/server).

---

### Shell

You can configure the shell used for the interactive terminal using the `shell` option. Compatible shells are also used for agent tool calls.

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "shell": "pwsh"
}
```

If not specified, OpenCode will automatically discover and use a sensible default based on your operating system (e.g. `pwsh` or `cmd.exe` on Windows, `/bin/zsh` or `/bin/bash` on macOS/Linux). You can provide an absolute path or a short name.

---

### Tools

You can manage the tools an LLM can use through the `tools` option.

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "tools": {
    "write": false,
    "bash": false
  }
}
```

[Learn more about tools here](/docs/tools).

---

### Models

You can configure the providers and models you want to use in your OpenCode config through the `provider`, `model` and `small_model` options.

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {},
  "model": "anthropic/claude-sonnet-4-5",
  "small_model": "anthropic/claude-haiku-4-5"
}
```

The `small_model` option configures a separate model for lightweight tasks like title generation. By default, OpenCode tries to use a cheaper model if one is available from your provider, otherwise it falls back to your main model.

Provider options can include `timeout`, `headerTimeout`, `chunkTimeout`, and `setCacheKey`:

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "anthropic": {
      "options": {
        "timeout": 600000,
        "chunkTimeout": 30000,
        "setCacheKey": true
      }
    }
  }
}
```

- `timeout` - Request timeout in milliseconds (default: 300000). Set to `false` to disable.
- `headerTimeout` - Timeout in milliseconds to wait for response headers (default: 300000, or 5 minutes). This timer stops once headers arrive and does not limit the streamed response body. Set to `false` to disable.
- `chunkTimeout` - Timeout in milliseconds between streamed response chunks (default: 300000, or 5 minutes). If no chunk arrives in time, the request is aborted. Set to `false` to disable.
- `setCacheKey` - Ensure a cache key is always set for designated provider.

You can also configure [local models](/docs/models#local). [Learn more](/docs/models).

---

### Policies

Use the `experimental.policies` option to allow or deny OpenCode actions on configured resources. Currently, policies can control which providers OpenCode may use.

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "experimental": {
    "policies": [
      {
        "effect": "deny",
        "action": "provider.use",
        "resource": "openai"
      }
    ]
  }
}
```

[Learn more about policies here](/docs/policies).

---

### Image attachments

OpenCode normalizes image attachments before sending them to the model. By default, images are resized when they exceed `2000x2000` pixels or `5242880` base64 bytes.

Configure image attachment limits with the `attachment.image` option:

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "attachment": {
    "image": {
      "auto_resize": true,
      "max_width": 2000,
      "max_height": 2000,
      "max_base64_bytes": 5242880
    }
  }
}
```

- `auto_resize` - Resize images that exceed the configured limits before provider requests. Set to `false` to reject oversized images instead.
- `max_width` - Maximum image width in pixels before resizing or rejection.
- `max_height` - Maximum image height in pixels before resizing or rejection.
- `max_base64_bytes` - Maximum encoded image payload size. This is the base64 payload size, not the original file size.

If an image still cannot fit after resizing, OpenCode omits oversized tool-result images or fails oversized user-provided images with an image size error.

---

#### Provider-Specific Options

Some providers support additional configuration options beyond the generic `timeout` and `apiKey` settings.

##### Amazon Bedrock

Amazon Bedrock supports AWS-specific configuration:

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "amazon-bedrock": {
      "options": {
        "region": "us-east-1",
        "profile": "my-aws-profile",
        "endpoint": "https://bedrock-runtime.us-east-1.vpce-xxxxx.amazonaws.com"
      }
    }
  }
}
```

- `region` - AWS region for Bedrock (defaults to `AWS_REGION` env var or `us-east-1`)
- `profile` - AWS named profile from `~/.aws/credentials` (defaults to `AWS_PROFILE` env var)
- `endpoint` - Custom endpoint URL for VPC endpoints. This is an alias for the generic `baseURL` option using AWS-specific terminology. If both are specified, `endpoint` takes precedence.

:::note
Bearer tokens (`AWS_BEARER_TOKEN_BEDROCK` or `/connect`) take precedence over profile-based authentication. See [authentication precedence](/docs/providers#authentication-precedence) for details.
:::

[Learn more about Amazon Bedrock configuration](/docs/providers#amazon-bedrock).

---

### Themes

Set your UI theme in `tui.json`.

```json title="tui.json"
{
  "$schema": "https://opencode.ai/tui.json",
  "theme": "tokyonight"
}
```

[Learn more here](/docs/themes).

---

### Agents

You can configure specialized agents for specific tasks through the `agent` option.

```jsonc title="opencode.jsonc"
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "code-reviewer": {
      "description": "Reviews code for best practices and potential issues",
      "model": "anthropic/claude-sonnet-4-5",
      "prompt": "You are a code reviewer. Focus on security, performance, and maintainability.",
      "tools": {
        // Disable file modification tools for review-only agent
        "write": false,
        "edit": false,
      },
    },
  },
}
```

You can also define agents using markdown files in `~/.config/opencode/agents/` or `.opencode/agents/`. [Learn more here](/docs/agents).

---

### Default agent

You can set the default agent using the `default_agent` option. This determines which agent is used when none is explicitly specified.

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "default_agent": "plan"
}
```

The default agent must be a primary agent (not a subagent). This can be a built-in agent like `"build"` or `"plan"`, or a [custom agent](/docs/agents) you've defined. If the specified agent doesn't exist or is a subagent, OpenCode will fall back to `"build"` with a warning.

This setting applies across all interfaces: TUI, CLI (`opencode run`), desktop app, and GitHub Action.

---

### Subagent depth

You can control how deeply subagents can invoke other subagents using the `subagent_depth` option.

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "subagent_depth": 2
}
```

The default is `1`, which allows primary agents to launch subagents but prevents those subagents from launching additional subagents. Set it to `2` to allow one additional level of nested subagents, or `0` to prevent all subagent launches.

---

### Sharing

You can configure the [share](/docs/share) feature through the `share` option.

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "share": "manual"
}
```

This takes:

- `"manual"` - Allow manual sharing via commands (default)
- `"auto"` - Automatically share new conversations
- `"disabled"` - Disable sharing entirely

By default, sharing is set to manual mode where you need to explicitly share conversations using the `/share` command.

---

### Commands

You can configure custom commands for repetitive tasks through the `command` option.

```jsonc title="opencode.jsonc"
{
  "$schema": "https://opencode.ai/config.json",
  "command": {
    "test": {
      "template": "Run the full test suite with coverage report and show any failures.\nFocus on the failing tests and suggest fixes.",
      "description": "Run tests with coverage",
      "agent": "build",
      "model": "anthropic/claude-haiku-4-5",
    },
    "component": {
      "template": "Create a new React component named $ARGUMENTS with TypeScript support.\nInclude proper typing and basic structure.",
      "description": "Create a new component",
    },
  },
}
```

You can also define commands using markdown files in `~/.config/opencode/commands/` or `.opencode/commands/`. [Learn more here](/docs/commands).

---

### Keybinds

Customize TUI keyboard shortcuts in `tui.json` with `keybinds`.

```json title="tui.json"
{
  "$schema": "https://opencode.ai/tui.json",
  "keybinds": {
    "command_list": "ctrl+p"
  }
}
```

`keybinds` is merged with built-in defaults, so you only need to configure the shortcuts you want to change.

[Learn more here](/docs/keybinds).

---

### Snapshot

OpenCode uses snapshots to track file changes during agent operations, enabling you to undo and revert changes within a session. Snapshots are enabled by default.

For large repositories or projects with many submodules, the snapshot system can cause slow indexing and significant disk usage as it tracks all changes using an internal git repository. You can disable snapshots using the `snapshot` option.

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "snapshot": false
}
```

Note that disabling snapshots means changes made by the agent cannot be rolled back through the UI.

---

### Autoupdate

OpenCode will automatically download any new updates when it starts up. You can disable this with the `autoupdate` option.

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "autoupdate": false
}
```

If you don't want updates but want to be notified when a new version is available, set `autoupdate` to `"notify"`.
Notice that this only works if it was not installed using a package manager such as Homebrew.

---

### Formatters

You can enable and configure code formatters through the `formatter` option. Omit it to keep formatters disabled.

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
  "formatter": {
    "prettier": {
      "disabled": true
    },
    "custom-prettier": {
      "command": ["npx", "prettier", "--write", "$FILE"],
      "environment": {
        "NODE_ENV": "development"
      },
      "extensions": [".js", ".ts", ".jsx", ".tsx"]
    }
  }
}
```

[Learn more about formatters here](/docs/formatters).

---

### LSP Servers

You can enable and configure LSP servers through the `lsp` option. Omit it to keep LSP disabled.

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "lsp": true
}
```

Use an object to keep built-ins enabled while configuring overrides or custom LSP servers.

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "lsp": {
    "typescript": {
      "disabled": true
    }
  }
}
```

[Learn more about LSP servers here](/docs/lsp).

---

### Permissions

By default, opencode **allows all operations** without requiring explicit approval. You can change this using the `permission` option.

For example, to ensure that the `edit` and `bash` tools require user approval:

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "edit": "ask",
    "bash": "ask"
  }
}
```

[Learn more about permissions here](/docs/permissions).

---

### Compaction

You can control context compaction behavior through the `compaction` option.

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "compaction": {
    "auto": true,
    "prune": false,
    "reserved": 10000
  }
}
```

- `auto` - Automatically compact the session when context is full (default: `true`).
- `prune` - Remove old tool outputs to save tokens (default: `false`). Set to `true` to enable pruning.
- `reserved` - Token buffer for compaction. Leaves enough window to avoid overflow during compaction.

---

### Watcher

You can configure file watcher ignore patterns through the `watcher` option.

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "watcher": {
    "ignore": ["node_modules/**", "dist/**", ".git/**"]
  }
}
```

Patterns follow glob syntax. Use this to exclude noisy directories from file watching.

---

### MCP servers

You can configure MCP servers you want to use through the `mcp` option.

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {}
}
```

[Learn more here](/docs/mcp-servers).

---

### Plugins

[Plugins](/docs/plugins) extend OpenCode with custom tools, hooks, and integrations.

Place plugin files in `.opencode/plugins/` or `~/.config/opencode/plugins/`. You can also load plugins from npm through the `plugin` option.

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-helicone-session", "@my-org/custom-plugin"]
}
```

[Learn more here](/docs/plugins).

---

### Instructions

You can configure the instructions for the model you're using through the `instructions` option.

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": ["CONTRIBUTING.md", "docs/guidelines.md", ".cursor/rules/*.md"]
}
```

This takes an array of paths and glob patterns to instruction files. [Learn more
about rules here](/docs/rules).

---

### Disabled providers

You can disable providers that are loaded automatically through the `disabled_providers` option. This is useful when you want to prevent certain providers from being loaded even if their credentials are available.

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "disabled_providers": ["openai", "gemini"]
}
```

:::note
The `disabled_providers` takes priority over `enabled_providers`.
:::

The `disabled_providers` option accepts an array of provider IDs. When a provider is disabled:

- It won't be loaded even if environment variables are set.
- It won't be loaded even if API keys are configured through the `/connect` command.
- The provider's models won't appear in the model selection list.

---

### Enabled providers

You can specify an allowlist of providers through the `enabled_providers` option. When set, only the specified providers will be enabled and all others will be ignored.

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "enabled_providers": ["anthropic", "openai"]
}
```

This is useful when you want to restrict OpenCode to only use specific providers rather than disabling them one by one.

:::note
The `disabled_providers` takes priority over `enabled_providers`.
:::

If a provider appears in both `enabled_providers` and `disabled_providers`, the `disabled_providers` takes priority for backwards compatibility.

---

### Experimental

The `experimental` key contains options that are under active development.

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "experimental": {}
}
```

:::caution
Experimental options are not stable. They may change or be removed without notice.
:::

---

## Variables

You can use variable substitution in your config files to reference environment variables and file contents.

---

### Env vars

Use `{env:VARIABLE_NAME}` to substitute environment variables:

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "model": "{env:OPENCODE_MODEL}",
  "provider": {
    "anthropic": {
      "models": {},
      "options": {
        "apiKey": "{env:ANTHROPIC_API_KEY}"
      }
    }
  }
}
```

If the environment variable is not set, it will be replaced with an empty string.

---

### Files

Use `{file:path/to/file}` to substitute the contents of a file:

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": ["./custom-instructions.md"],
  "provider": {
    "openai": {
      "options": {
        "apiKey": "{file:~/.secrets/openai-key}"
      }
    }
  }
}
```

File paths can be:

- Relative to the config file directory
- Or absolute paths starting with `/` or `~`

These are useful for:

- Keeping sensitive data like API keys in separate files.
- Including large instruction files without cluttering your config.
- Sharing common configuration snippets across multiple config files.


---

# SOURCE: `packages/web/src/content/docs/permissions.mdx`

---
title: Permissions
description: Control which actions require approval to run.
---

OpenCode uses the `permission` config to decide whether a given action should run automatically, prompt you, or be blocked.

As of `v1.1.1`, the legacy `tools` boolean config is deprecated and has been merged into `permission`. The old `tools` config is still supported for backwards compatibility.

---

## Actions

Each permission rule resolves to one of:

- `"allow"` — run without approval
- `"ask"` — prompt for approval
- `"deny"` — block the action

---

## Auto mode

Start OpenCode with `--auto` to automatically approve permission requests that are not explicitly denied.

```bash
opencode --auto
```

You can also use auto mode with [`opencode run`](/docs/cli#run).

```bash
opencode run --auto "Refactor this module"
```

Explicit `"deny"` rules are still enforced. Auto mode only changes requests that would otherwise ask for approval.

In the TUI, open the command palette and select **Enable auto-approve permissions** or **Disable auto-approve permissions** to change modes. When auto mode is active, the prompt displays a muted `auto` indicator next to the current agent.

---

## Configuration

You can set permissions globally (with `*`), and override specific tools.

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "*": "ask",
    "bash": "allow",
    "edit": "deny"
  }
}
```

You can also set all permissions at once:

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "permission": "allow"
}
```

---

## Granular Rules (Object Syntax)

For most permissions, you can use an object to apply different actions based on the tool input.

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "bash": {
      "*": "ask",
      "git *": "allow",
      "npm *": "allow",
      "rm *": "deny",
      "grep *": "allow"
    },
    "edit": {
      "*": "deny",
      "packages/web/src/content/docs/*.mdx": "allow"
    }
  }
}
```

Rules are evaluated by pattern match, with the **last matching rule winning**. A common pattern is to put the catch-all `"*"` rule first, and more specific rules after it.

### Wildcards

Permission patterns use simple wildcard matching:

- `*` matches zero or more of any character
- `?` matches exactly one character
- All other characters match literally

### Home Directory Expansion

You can use `~` or `$HOME` at the start of a pattern to reference your home directory. This is particularly useful for [`external_directory`](#external-directories) rules.

- `~/projects/*` -> `/Users/username/projects/*`
- `$HOME/projects/*` -> `/Users/username/projects/*`
- `~` -> `/Users/username`

### External Directories

Use `external_directory` to allow tool calls that touch paths outside the working directory where OpenCode was started. This applies to any tool that takes a path as input (for example `read`, `edit`, `glob`, `grep`, and many `bash` commands).

Home expansion (like `~/...`) only affects how a pattern is written. It does not make an external path part of the current workspace, so paths outside the working directory must still be allowed via `external_directory`.

For example, this allows access to everything under `~/projects/personal/`:

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "external_directory": {
      "~/projects/personal/**": "allow"
    }
  }
}
```

Any directory allowed here inherits the same defaults as the current workspace. Since [`read` defaults to `allow`](#defaults), reads are also allowed for entries under `external_directory` unless overridden. Add explicit rules when a tool should be restricted in these paths, such as blocking edits while keeping reads:

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "external_directory": {
      "~/projects/personal/**": "allow"
    },
    "edit": {
      "~/projects/personal/**": "deny"
    }
  }
}
```

Keep the list focused on trusted paths, and layer extra allow or deny rules as needed for other tools (for example `bash`).

---

## Available Permissions

OpenCode permissions are keyed by tool name, plus a couple of safety guards:

- `read` — reading a file (matches the file path)
- `edit` — all file modifications (covers `edit`, `write`, `patch`)
- `glob` — file globbing (matches the glob pattern)
- `grep` — content search (matches the regex pattern)
- `bash` — running shell commands (matches parsed commands like `git status --porcelain`)
- `task` — launching subagents (matches the subagent type)
- `skill` — loading a skill (matches the skill name)
- `lsp` — running LSP queries (currently non-granular)
- `question` — asking the user questions during execution
- `webfetch` — fetching a URL (matches the URL)
- `websearch` — web search (matches the query)
- `external_directory` — triggered when a tool touches paths outside the project working directory
- `doom_loop` — triggered when the same tool call repeats 3 times with identical input

---

## Defaults

If you don’t specify anything, OpenCode starts from permissive defaults:

- Most permissions default to `"allow"`.
- `doom_loop` and `external_directory` default to `"ask"`.
- `read` is `"allow"`, but `.env` files are denied by default:

```json title="opencode.json"
{
  "permission": {
    "read": {
      "*": "allow",
      "*.env": "deny",
      "*.env.*": "deny",
      "*.env.example": "allow"
    }
  }
}
```

---

## What “Ask” Does

When OpenCode prompts for approval, the UI offers three outcomes:

- `once` — approve just this request
- `always` — approve future requests matching the suggested patterns (for the rest of the current OpenCode session)
- `reject` — deny the request

The set of patterns that `always` would approve is provided by the tool (for example, bash approvals typically whitelist a safe command prefix like `git status*`).

---

## Agents

You can override permissions per agent. Agent permissions are merged with the global config, and agent rules take precedence. [Learn more](/docs/agents#permissions) about agent permissions.

:::note
Refer to the [Granular Rules (Object Syntax)](#granular-rules-object-syntax) section above for more detailed pattern matching examples.
:::

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "bash": {
      "*": "ask",
      "git *": "allow",
      "git commit *": "deny",
      "git push *": "deny",
      "grep *": "allow"
    }
  },
  "agent": {
    "build": {
      "permission": {
        "bash": {
          "*": "ask",
          "git *": "allow",
          "git commit *": "ask",
          "git push *": "deny",
          "grep *": "allow"
        }
      }
    }
  }
}
```

You can also configure agent permissions in Markdown:

```markdown title="~/.config/opencode/agents/review.md"
---
description: Code review without edits
mode: subagent
permission:
  edit: deny
  bash: ask
  webfetch: deny
---

Only analyze code and suggest changes.
```

:::tip
Use pattern matching for commands with arguments. `"grep *"` allows `grep pattern file.txt`, while `"grep"` alone would block it. Commands like `git status` work for default behavior but require explicit permission (like `"git status *"`) when arguments are passed.
:::


---

# SOURCE: `packages/web/src/content/docs/rules.mdx`

---
title: Rules
description: Set custom instructions for opencode.
---

You can provide custom instructions to opencode by creating an `AGENTS.md` file. This is similar to Cursor's rules. It contains instructions that will be included in the LLM's context to customize its behavior for your specific project.

---

## Initialize

To create a new `AGENTS.md` file, you can run the `/init` command in opencode.

:::tip
You should commit your project's `AGENTS.md` file to Git.
:::

`/init` scans the important files in your repo, may ask a couple of targeted questions when the codebase cannot answer them, and then creates or updates `AGENTS.md` with concise project-specific guidance.

It focuses on the things future agent sessions are most likely to need:

- build, lint, and test commands
- command order and focused verification steps when they matter
- architecture and repo structure that are not obvious from filenames alone
- project-specific conventions, setup quirks, and operational gotchas
- references to existing instruction sources like Cursor or Copilot rules

If you already have an `AGENTS.md`, `/init` will improve it in place instead of blindly replacing it.

---

## Example

You can also just create this file manually. Here's an example of some things you can put into an `AGENTS.md` file.

```markdown title="AGENTS.md"
# SST v3 Monorepo Project

This is an SST v3 monorepo with TypeScript. The project uses bun workspaces for package management.

## Project Structure

- `packages/` - Contains all workspace packages (functions, core, web, etc.)
- `infra/` - Infrastructure definitions split by service (storage.ts, api.ts, web.ts)
- `sst.config.ts` - Main SST configuration with dynamic imports

## Code Standards

- Use TypeScript with strict mode enabled
- Shared code goes in `packages/core/` with proper exports configuration
- Functions go in `packages/functions/`
- Infrastructure should be split into logical files in `infra/`

## Monorepo Conventions

- Import shared modules using workspace names: `@my-app/core/example`
```

We are adding project-specific instructions here and this will be shared across your team.

---

## Types

opencode also supports reading the `AGENTS.md` file from multiple locations. And this serves different purposes.

### Project

Place an `AGENTS.md` in your project root for project-specific rules. These only apply when you are working in this directory or its sub-directories.

### Global

You can also have global rules in a `~/.config/opencode/AGENTS.md` file. This gets applied across all opencode sessions.

Since this isn't committed to Git or shared with your team, we recommend using this to specify any personal rules that the LLM should follow.

### Claude Code Compatibility

For users migrating from Claude Code, OpenCode supports Claude Code's file conventions as fallbacks:

- **Project rules**: `CLAUDE.md` in your project directory (used if no `AGENTS.md` exists)
- **Global rules**: `~/.claude/CLAUDE.md` (used if no `~/.config/opencode/AGENTS.md` exists)
- **Skills**: `~/.claude/skills/` — see [Agent Skills](/docs/skills/) for details

To disable Claude Code compatibility, set one of these environment variables:

```bash
export OPENCODE_DISABLE_CLAUDE_CODE=1        # Disable all .claude support
export OPENCODE_DISABLE_CLAUDE_CODE_PROMPT=1 # Disable only ~/.claude/CLAUDE.md
export OPENCODE_DISABLE_CLAUDE_CODE_SKILLS=1 # Disable only .claude/skills
```

---

## Precedence

When opencode starts, it looks for rule files in this order:

1. **Local files** by traversing up from the current directory (`AGENTS.md`, `CLAUDE.md`)
2. **Global file** at `~/.config/opencode/AGENTS.md`
3. **Claude Code file** at `~/.claude/CLAUDE.md` (unless disabled)

The first matching file wins in each category. For example, if you have both `AGENTS.md` and `CLAUDE.md`, only `AGENTS.md` is used. Similarly, `~/.config/opencode/AGENTS.md` takes precedence over `~/.claude/CLAUDE.md`.

---

## Custom Instructions

You can specify custom instruction files in your `opencode.json` or the global `~/.config/opencode/opencode.json`. This allows you and your team to reuse existing rules rather than having to duplicate them to AGENTS.md.

Example:

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": ["CONTRIBUTING.md", "docs/guidelines.md", ".cursor/rules/*.md"]
}
```

You can also use remote URLs to load instructions from the web.

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": ["https://raw.githubusercontent.com/my-org/shared-rules/main/style.md"]
}
```

Remote instructions are fetched with a 5 second timeout.

All instruction files are combined with your `AGENTS.md` files.

---

## Referencing External Files

While opencode doesn't automatically parse file references in `AGENTS.md`, you can achieve similar functionality in two ways:

### Using opencode.json

The recommended approach is to use the `instructions` field in `opencode.json`:

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": ["docs/development-standards.md", "test/testing-guidelines.md", "packages/*/AGENTS.md"]
}
```

### Manual Instructions in AGENTS.md

You can teach opencode to read external files by providing explicit instructions in your `AGENTS.md`. Here's a practical example:

```markdown title="AGENTS.md"
# TypeScript Project Rules

## External File Loading

CRITICAL: When you encounter a file reference (e.g., @rules/general.md), use your Read tool to load it on a need-to-know basis. They're relevant to the SPECIFIC task at hand.

Instructions:

- Do NOT preemptively load all references - use lazy loading based on actual need
- When loaded, treat content as mandatory instructions that override defaults
- Follow references recursively when needed

## Development Guidelines

For TypeScript code style and best practices: @docs/typescript-guidelines.md
For React component architecture and hooks patterns: @docs/react-patterns.md
For REST API design and error handling: @docs/api-standards.md
For testing strategies and coverage requirements: @test/testing-guidelines.md

## General Guidelines

Read the following file immediately as it's relevant to all workflows: @rules/general-guidelines.md.
```

This approach allows you to:

- Create modular, reusable rule files
- Share rules across projects via symlinks or git submodules
- Keep AGENTS.md concise while referencing detailed guidelines
- Ensure opencode loads files only when needed for the specific task

:::tip
For monorepos or projects with shared standards, using `opencode.json` with glob patterns (like `packages/*/AGENTS.md`) is more maintainable than manual instructions.
:::


---

# SOURCE: `packages/web/src/content/docs/tools.mdx`

---
title: Tools
description: Manage the tools an LLM can use.
---

Tools allow the LLM to perform actions in your codebase. OpenCode comes with a set of built-in tools, but you can extend it with [custom tools](/docs/custom-tools) or [MCP servers](/docs/mcp-servers).

By default, all tools are **enabled** and don't need permission to run. You can control tool behavior through [permissions](/docs/permissions).

---

## Configure

Use the `permission` field to control tool behavior. You can allow, deny, or require approval for each tool.

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "edit": "deny",
    "bash": "ask",
    "webfetch": "allow"
  }
}
```

You can also use wildcards to control multiple tools at once. For example, to require approval for all tools from an MCP server:

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "mymcp_*": "ask"
  }
}
```

[Learn more](/docs/permissions) about configuring permissions.

---

## Built-in

Here are all the built-in tools available in OpenCode.

---

### bash

Execute shell commands in your project environment.

```json title="opencode.json" {4}
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "bash": "allow"
  }
}
```

This tool allows the LLM to run terminal commands like `npm install`, `git status`, or any other shell command.

---

### edit

Modify existing files using exact string replacements.

```json title="opencode.json" {4}
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "edit": "allow"
  }
}
```

This tool performs precise edits to files by replacing exact text matches. It's the primary way the LLM modifies code.

---

### write

Create new files or overwrite existing ones.

```json title="opencode.json" {4}
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "edit": "allow"
  }
}
```

Use this to allow the LLM to create new files. It will overwrite existing files if they already exist.

:::note
The `write` tool is controlled by the `edit` permission, which covers all file modifications (`edit`, `write`, `apply_patch`).
:::

---

### read

Read file contents from your codebase.

```json title="opencode.json" {4}
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "read": "allow"
  }
}
```

This tool reads files and returns their contents. It supports reading specific line ranges for large files.

---

### grep

Search file contents using regular expressions.

```json title="opencode.json" {4}
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "grep": "allow"
  }
}
```

Fast content search across your codebase. Supports full regex syntax and file pattern filtering.

---

### glob

Find files by pattern matching.

```json title="opencode.json" {4}
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "glob": "allow"
  }
}
```

Search for files using glob patterns like `**/*.js` or `src/**/*.ts`. Returns matching file paths sorted by modification time.

---

### lsp (experimental)

Interact with your configured LSP servers to get code intelligence features like definitions, references, hover info, and call hierarchy.

:::note
This tool is only available when `OPENCODE_EXPERIMENTAL_LSP_TOOL=true` (or `OPENCODE_EXPERIMENTAL=true`).
:::

```json title="opencode.json" {4}
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "lsp": "allow"
  }
}
```

Supported operations include `goToDefinition`, `findReferences`, `hover`, `documentSymbol`, `workspaceSymbol`, `goToImplementation`, `prepareCallHierarchy`, `incomingCalls`, and `outgoingCalls`.

To configure which LSP servers are available for your project, see [LSP Servers](/docs/lsp).

---

### apply_patch

Apply patches to files.

```json title="opencode.json" {4}
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "edit": "allow"
  }
}
```

This tool applies patch files to your codebase. Useful for applying diffs and patches from various sources.

When handling `tool.execute.before` or `tool.execute.after` hooks, check `input.tool === "apply_patch"` (not `"patch"`).

`apply_patch` uses `output.args.patchText` instead of `output.args.filePath`. Paths are embedded in marker lines within `patchText` and are relative to the project root (for example: `*** Add File: src/new-file.ts`, `*** Update File: src/existing.ts`, `*** Move to: src/renamed.ts`, `*** Delete File: src/obsolete.ts`).

:::note
The `apply_patch` tool is controlled by the `edit` permission, which covers all file modifications (`edit`, `write`, `apply_patch`).
:::

---

### skill

Load a [skill](/docs/skills) (a `SKILL.md` file) and return its content in the conversation.

```json title="opencode.json" {4}
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "skill": "allow"
  }
}
```

---

### todowrite

Manage todo lists during coding sessions.

```json title="opencode.json" {4}
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "todowrite": "allow"
  }
}
```

Creates and updates task lists to track progress during complex operations. The LLM uses this to organize multi-step tasks.

:::note
This tool is disabled for subagents by default, but you can enable it manually. [Learn more](/docs/agents/#permissions)
:::

---

### webfetch

Fetch web content.

```json title="opencode.json" {4}
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "webfetch": "allow"
  }
}
```

Allows the LLM to fetch and read web pages. Useful for looking up documentation or researching online resources.

---

### websearch

Search the web for information.

:::note
This tool is only available when using the OpenCode or OpenCode Go provider, or when either the `OPENCODE_ENABLE_EXA` or `OPENCODE_ENABLE_PARALLEL` environment variable is set to any truthy value (e.g., `true` or `1`).

To enable when launching OpenCode:

```bash
OPENCODE_ENABLE_EXA=1 opencode
# or
OPENCODE_ENABLE_PARALLEL=1 opencode
```

:::

```json title="opencode.json" {4}
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "websearch": "allow"
  }
}
```

Performs web searches using Exa or Parallel to find relevant information online. Useful for researching topics, finding current events, or gathering information beyond the training data cutoff.

No API key is required — the tool connects directly to the backend's hosted MCP service without authentication.

:::tip
Use `websearch` when you need to find information (discovery), and `webfetch` when you need to retrieve content from a specific URL (retrieval).
:::

---

### question

Ask the user questions during execution.

```json title="opencode.json" {4}
{
  "$schema": "https://opencode.ai/config.json",
  "permission": {
    "question": "allow"
  }
}
```

This tool allows the LLM to ask the user questions during a task. It's useful for:

- Gathering user preferences or requirements
- Clarifying ambiguous instructions
- Getting decisions on implementation choices
- Offering choices about what direction to take

Each question includes a header, the question text, and a list of options. Users can select from the provided options or type a custom answer. When there are multiple questions, users can navigate between them before submitting all answers.

---

## Custom tools

Custom tools let you define your own functions that the LLM can call. These are defined in your config file and can execute arbitrary code.

[Learn more](/docs/custom-tools) about creating custom tools.

---

## MCP servers

MCP (Model Context Protocol) servers allow you to integrate external tools and services. This includes database access, API integrations, and third-party services.

[Learn more](/docs/mcp-servers) about configuring MCP servers.

---

## Internals

Internally, tools like `grep` and `glob` use [ripgrep](https://github.com/BurntSushi/ripgrep) under the hood. By default, ripgrep respects `.gitignore` patterns, which means files and directories listed in your `.gitignore` will be excluded from searches and listings.

---

### Ignore patterns

To include files that would normally be ignored, create a `.ignore` file in your project root. This file can explicitly allow certain paths.

```text title=".ignore"
!node_modules/
!dist/
!build/
```

For example, this `.ignore` file allows ripgrep to search within `node_modules/`, `dist/`, and `build/` directories even if they're listed in `.gitignore`.


---

# SOURCE: `packages/web/src/content/docs/custom-tools.mdx`

---
title: Custom Tools
description: Create tools the LLM can call in opencode.
---

Custom tools are functions you create that the LLM can call during conversations. They work alongside opencode's [built-in tools](/docs/tools) like `read`, `write`, and `bash`.

---

## Creating a tool

Tools are defined as **TypeScript** or **JavaScript** files. However, the tool definition can invoke scripts written in **any language** — TypeScript or JavaScript is only used for the tool definition itself.

---

### Location

They can be defined:

- Locally by placing them in the `.opencode/tools/` directory of your project.
- Or globally, by placing them in `~/.config/opencode/tools/`.

---

### Structure

The easiest way to create tools is using the `tool()` helper which provides type-safety and validation.

```ts title=".opencode/tools/database.ts" {1}
import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Query the project database",
  args: {
    query: tool.schema.string().describe("SQL query to execute"),
  },
  async execute(args) {
    // Your database logic here
    return `Executed query: ${args.query}`
  },
})
```

The **filename** becomes the **tool name**. The above creates a `database` tool.

---

#### Multiple tools per file

You can also export multiple tools from a single file. Each export becomes **a separate tool** with the name **`<filename>_<exportname>`**:

```ts title=".opencode/tools/math.ts"
import { tool } from "@opencode-ai/plugin"

export const add = tool({
  description: "Add two numbers",
  args: {
    a: tool.schema.number().describe("First number"),
    b: tool.schema.number().describe("Second number"),
  },
  async execute(args) {
    return (args.a + args.b).toString()
  },
})

export const multiply = tool({
  description: "Multiply two numbers",
  args: {
    a: tool.schema.number().describe("First number"),
    b: tool.schema.number().describe("Second number"),
  },
  async execute(args) {
    return (args.a * args.b).toString()
  },
})
```

This creates two tools: `math_add` and `math_multiply`.

---

#### Name collisions with built-in tools

Custom tools are keyed by tool name. If a custom tool uses the same name as a built-in tool, the custom tool takes precedence.

For example, this file replaces the built-in `bash` tool:

```ts title=".opencode/tools/bash.ts"
import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Restricted bash wrapper",
  args: {
    command: tool.schema.string(),
  },
  async execute(args) {
    return `blocked: ${args.command}`
  },
})
```

:::note
Prefer unique names unless you intentionally want to replace a built-in tool. If you want to disable a built in tool but not override it, use [permissions](/docs/permissions).
:::

---

### Arguments

You can use `tool.schema`, which is just [Zod](https://zod.dev), to define argument types.

```ts "tool.schema"
args: {
  query: tool.schema.string().describe("SQL query to execute")
}
```

You can also import [Zod](https://zod.dev) directly and return a plain object:

```ts {6}
import { z } from "zod"

export default {
  description: "Tool description",
  args: {
    param: z.string().describe("Parameter description"),
  },
  async execute(args, context) {
    // Tool implementation
    return "result"
  },
}
```

---

### Context

Tools receive context about the current session:

```ts title=".opencode/tools/project.ts" {8}
import { tool } from "@opencode-ai/plugin"

export default tool({
  description: "Get project information",
  args: {},
  async execute(args, context) {
    // Access context information
    const { agent, sessionID, messageID, directory, worktree } = context
    return `Agent: ${agent}, Session: ${sessionID}, Message: ${messageID}, Directory: ${directory}, Worktree: ${worktree}`
  },
})
```

Use `context.directory` for the session working directory.
Use `context.worktree` for the git worktree root.

---

## Examples

### Write a tool in Python

You can write your tools in any language you want. Here's an example that adds two numbers using Python.

First, create the tool as a Python script:

```python title=".opencode/tools/add.py"
import sys

a = int(sys.argv[1])
b = int(sys.argv[2])
print(a + b)
```

Then create the tool definition that invokes it:

```ts title=".opencode/tools/python-add.ts" {10}
import { tool } from "@opencode-ai/plugin"
import path from "path"

export default tool({
  description: "Add two numbers using Python",
  args: {
    a: tool.schema.number().describe("First number"),
    b: tool.schema.number().describe("Second number"),
  },
  async execute(args, context) {
    const script = path.join(context.worktree, ".opencode/tools/add.py")
    const result = await Bun.$`python3 ${script} ${args.a} ${args.b}`.text()
    return result.trim()
  },
})
```

Here we are using the [`Bun.$`](https://bun.com/docs/runtime/shell) utility to run the Python script.


---

# SOURCE: `packages/web/src/content/docs/plugins.mdx`

---
title: Plugins
description: Write your own plugins to extend OpenCode.
---

Plugins allow you to extend OpenCode by hooking into various events and customizing behavior. You can create plugins to add new features, integrate with external services, or modify OpenCode's default behavior.

For examples, check out the [plugins](/docs/ecosystem#plugins) created by the community.

---

## Use a plugin

There are two ways to load plugins.

---

### From local files

Place JavaScript or TypeScript files in the plugin directory.

- `.opencode/plugins/` - Project-level plugins
- `~/.config/opencode/plugins/` - Global plugins

Files in these directories are automatically loaded at startup.

---

### From npm

Specify npm packages in your config file.

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-helicone-session", "opencode-wakatime", "@my-org/custom-plugin"]
}
```

Both regular and scoped npm packages are supported.

Browse available plugins in the [ecosystem](/docs/ecosystem#plugins).

---

### How plugins are installed

**npm plugins** are installed automatically using Bun at startup. Packages and their dependencies are cached in `~/.cache/opencode/node_modules/`.

**Local plugins** are loaded directly from the plugin directory. To use external packages, you must create a `package.json` within your config directory (see [Dependencies](#dependencies)), or publish the plugin to npm and [add it to your config](/docs/config#plugins).

---

### Load order

Plugins are loaded from all sources and all hooks run in sequence. The load order is:

1. Global config (`~/.config/opencode/opencode.json`)
2. Project config (`opencode.json`)
3. Global plugin directory (`~/.config/opencode/plugins/`)
4. Project plugin directory (`.opencode/plugins/`)

Duplicate npm packages with the same name and version are loaded once. However, a local plugin and an npm plugin with similar names are both loaded separately.

---

## Create a plugin

A plugin is a **JavaScript/TypeScript module** that exports one or more plugin
functions. Each function receives a context object and returns a hooks object.

---

### Dependencies

Local plugins and custom tools can use external npm packages. Add a `package.json` to your config directory with the dependencies you need.

```json title=".opencode/package.json"
{
  "dependencies": {
    "shescape": "^2.1.0"
  }
}
```

OpenCode runs `bun install` at startup to install these. Your plugins and tools can then import them.

```ts title=".opencode/plugins/my-plugin.ts"
import { escape } from "shescape"

export const MyPlugin = async (ctx) => {
  return {
    "tool.execute.before": async (input, output) => {
      if (input.tool === "bash") {
        output.args.command = escape(output.args.command)
      }
    },
  }
}
```

---

### Basic structure

```js title=".opencode/plugins/example.js"
export const MyPlugin = async ({ project, client, $, directory, worktree }) => {
  console.log("Plugin initialized!")

  return {
    // Hook implementations go here
  }
}
```

The plugin function receives:

- `project`: The current project information.
- `directory`: The current working directory.
- `worktree`: The git worktree path.
- `client`: An opencode SDK client for interacting with the AI.
- `$`: Bun's [shell API](https://bun.com/docs/runtime/shell) for executing commands.

---

### TypeScript support

For TypeScript plugins, you can import types from the plugin package:

```ts title="my-plugin.ts" {1}
import type { Plugin } from "@opencode-ai/plugin"

export const MyPlugin: Plugin = async ({ project, client, $, directory, worktree }) => {
  return {
    // Type-safe hook implementations
  }
}
```

---

### Events

Plugins can subscribe to events as seen below in the Examples section. Here is a list of the different events available.

#### Command Events

- `command.executed`

#### File Events

- `file.edited`
- `file.watcher.updated`

#### Installation Events

- `installation.updated`

#### LSP Events

- `lsp.client.diagnostics`
- `lsp.updated`

#### Message Events

- `message.part.removed`
- `message.part.updated`
- `message.removed`
- `message.updated`

#### Permission Events

- `permission.asked`
- `permission.replied`

#### Server Events

- `server.connected`

#### Session Events

- `session.created`
- `session.compacted`
- `session.deleted`
- `session.diff`
- `session.error`
- `session.idle`
- `session.status`
- `session.updated`

#### Todo Events

- `todo.updated`

#### Shell Events

- `shell.env`

#### Tool Events

- `tool.execute.after`
- `tool.execute.before`

#### TUI Events

- `tui.prompt.append`
- `tui.command.execute`
- `tui.toast.show`

---

## Examples

Here are some examples of plugins you can use to extend opencode.

---

### Send notifications

Send notifications when certain events occur:

```js title=".opencode/plugins/notification.js"
export const NotificationPlugin = async ({ project, client, $, directory, worktree }) => {
  return {
    event: async ({ event }) => {
      // Send notification on session completion
      if (event.type === "session.idle") {
        await $`osascript -e 'display notification "Session completed!" with title "opencode"'`
      }
    },
  }
}
```

We are using `osascript` to run AppleScript on macOS. Here we are using it to send notifications.

:::note
If you’re using the OpenCode desktop app, it can send system notifications automatically when a response is ready or when a session errors.
:::

---

### .env protection

Prevent opencode from reading `.env` files:

```javascript title=".opencode/plugins/env-protection.js"
export const EnvProtection = async ({ project, client, $, directory, worktree }) => {
  return {
    "tool.execute.before": async (input, output) => {
      if (input.tool === "read" && output.args.filePath.includes(".env")) {
        throw new Error("Do not read .env files")
      }
    },
  }
}
```

---

### Inject environment variables

Inject environment variables into all shell execution (AI tools and user terminals):

```javascript title=".opencode/plugins/inject-env.js"
export const InjectEnvPlugin = async () => {
  return {
    "shell.env": async (input, output) => {
      output.env.MY_API_KEY = "secret"
      output.env.PROJECT_ROOT = input.cwd
    },
  }
}
```

---

### Custom tools

Plugins can also add custom tools to opencode:

```ts title=".opencode/plugins/custom-tools.ts"
import { type Plugin, tool } from "@opencode-ai/plugin"

export const CustomToolsPlugin: Plugin = async (ctx) => {
  return {
    tool: {
      mytool: tool({
        description: "This is a custom tool",
        args: {
          foo: tool.schema.string(),
        },
        async execute(args, context) {
          const { directory, worktree } = context
          return `Hello ${args.foo} from ${directory} (worktree: ${worktree})`
        },
      }),
    },
  }
}
```

The `tool` helper creates a custom tool that opencode can call. It takes a Zod schema function and returns a tool definition with:

- `description`: What the tool does
- `args`: Zod schema for the tool's arguments
- `execute`: Function that runs when the tool is called

Your custom tools will be available to opencode alongside built-in tools.

:::note
If a plugin tool uses the same name as a built-in tool, the plugin tool takes precedence.
:::

---

### Logging

Use `client.app.log()` instead of `console.log` for structured logging:

```ts title=".opencode/plugins/my-plugin.ts"
export const MyPlugin = async ({ client }) => {
  await client.app.log({
    body: {
      service: "my-plugin",
      level: "info",
      message: "Plugin initialized",
      extra: { foo: "bar" },
    },
  })
}
```

Levels: `debug`, `info`, `warn`, `error`. See [SDK documentation](https://opencode.ai/docs/sdk) for details.

---

### Compaction hooks

Customize the context included when a session is compacted:

```ts title=".opencode/plugins/compaction.ts"
import type { Plugin } from "@opencode-ai/plugin"

export const CompactionPlugin: Plugin = async (ctx) => {
  return {
    "experimental.session.compacting": async (input, output) => {
      // Inject additional context into the compaction prompt
      output.context.push(`
## Custom Context

Include any state that should persist across compaction:
- Current task status
- Important decisions made
- Files being actively worked on
`)
    },
  }
}
```

The `experimental.session.compacting` hook fires before the LLM generates a continuation summary. Use it to inject domain-specific context that the default compaction prompt would miss.

You can also replace the compaction prompt entirely by setting `output.prompt`:

```ts title=".opencode/plugins/custom-compaction.ts"
import type { Plugin } from "@opencode-ai/plugin"

export const CustomCompactionPlugin: Plugin = async (ctx) => {
  return {
    "experimental.session.compacting": async (input, output) => {
      // Replace the entire compaction prompt
      output.prompt = `
You are generating a continuation prompt for a multi-agent swarm session.

Summarize:
1. The current task and its status
2. Which files are being modified and by whom
3. Any blockers or dependencies between agents
4. The next steps to complete the work

Format as a structured prompt that a new agent can use to resume work.
`
    },
  }
}
```

When `output.prompt` is set, it completely replaces the default compaction prompt. The `output.context` array is ignored in this case.


---

# SOURCE: `packages/web/src/content/docs/mcp-servers.mdx`

---
title: MCP servers
description: Add local and remote MCP tools.
---

You can add external tools to OpenCode using the _Model Context Protocol_, or MCP. OpenCode supports both local and remote servers.

Once added, MCP tools are automatically available to the LLM alongside built-in tools.

---

#### Caveats

When you use an MCP server, it adds to the context. This can quickly add up if you have a lot of tools. So we recommend being careful with which MCP servers you use.

:::tip
MCP servers add to your context, so you want to be careful with which ones you enable.
:::

Certain MCP servers, like the GitHub MCP server, tend to add a lot of tokens and can easily exceed the context limit.

---

## Enable

You can define MCP servers in your [OpenCode Config](https://opencode.ai/docs/config/) under `mcp`. Add each MCP with a unique name. You can refer to that MCP by name when prompting the LLM.

```jsonc title="opencode.jsonc" {6}
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "name-of-mcp-server": {
      // ...
      "enabled": true,
    },
    "name-of-other-mcp-server": {
      // ...
    },
  },
}
```

You can also disable a server by setting `enabled` to `false`. This is useful if you want to temporarily disable a server without removing it from your config.

---

### Overriding remote defaults

Organizations can provide default MCP servers via their `.well-known/opencode` endpoint. These servers may be disabled by default, allowing users to opt-in to the ones they need.

To enable a specific server from your organization's remote config, add it to your local config with `enabled: true`:

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "jira": {
      "type": "remote",
      "url": "https://jira.example.com/mcp",
      "enabled": true
    }
  }
}
```

Your local config values override the remote defaults. See [config precedence](/docs/config#precedence-order) for more details.

---

## Local

Add local MCP servers using `type` to `"local"` within the MCP object.

```jsonc title="opencode.jsonc" {15}
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "my-local-mcp-server": {
      "type": "local",
      // Or ["bun", "x", "my-mcp-command"]
      "command": ["npx", "-y", "my-mcp-command"],
      "enabled": true,
      "environment": {
        "MY_ENV_VAR": "my_env_var_value",
      },
    },
  },
}
```

The command is how the local MCP server is started. You can also pass in a list of environment variables as well.

For example, here's how you can add the test [`@modelcontextprotocol/server-everything`](https://www.npmjs.com/package/@modelcontextprotocol/server-everything) MCP server.

```jsonc title="opencode.jsonc"
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "mcp_everything": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-everything"],
    },
  },
}
```

And to use it I can add `use the mcp_everything tool` to my prompts.

```txt "mcp_everything"
use the mcp_everything tool to add the number 3 and 4
```

---

#### Options

Here are all the options for configuring a local MCP server.

| Option        | Type    | Required | Description                                                                              |
| ------------- | ------- | -------- | ---------------------------------------------------------------------------------------- |
| `type`        | String  | Y        | Type of MCP server connection, must be `"local"`.                                        |
| `command`     | Array   | Y        | Command and arguments to run the MCP server.                                             |
| `cwd`         | String  |          | Working directory for the MCP server process. Relative paths resolve from the workspace. |
| `environment` | Object  |          | Environment variables to set when running the server.                                    |
| `enabled`     | Boolean |          | Enable or disable the MCP server on startup.                                             |
| `timeout`     | Number  |          | Timeout in ms for fetching tools from the MCP server. Defaults to 5000 (5 seconds).      |

---

## Remote

Add remote MCP servers by setting `type` to `"remote"`.

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "my-remote-mcp": {
      "type": "remote",
      "url": "https://my-mcp-server.com",
      "enabled": true,
      "headers": {
        "Authorization": "Bearer MY_API_KEY"
      }
    }
  }
}
```

The `url` is the URL of the remote MCP server and with the `headers` option you can pass in a list of headers.

---

#### Options

| Option    | Type    | Required | Description                                                                         |
| --------- | ------- | -------- | ----------------------------------------------------------------------------------- |
| `type`    | String  | Y        | Type of MCP server connection, must be `"remote"`.                                  |
| `url`     | String  | Y        | URL of the remote MCP server.                                                       |
| `enabled` | Boolean |          | Enable or disable the MCP server on startup.                                        |
| `headers` | Object  |          | Headers to send with the request.                                                   |
| `oauth`   | Object  |          | OAuth authentication configuration. See [OAuth](#oauth) section below.              |
| `timeout` | Number  |          | Timeout in ms for fetching tools from the MCP server. Defaults to 5000 (5 seconds). |

---

## OAuth

OpenCode automatically handles OAuth authentication for remote MCP servers. When a server requires authentication, OpenCode will:

1. Detect the 401 response and initiate the OAuth flow
2. Use **Dynamic Client Registration (RFC 7591)** if supported by the server
3. Store tokens securely for future requests

---

### Automatic

For most OAuth-enabled MCP servers, no special configuration is needed. Just configure the remote server:

```json title="opencode.json"
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "my-oauth-server": {
      "type": "remote",
      "url": "https://mcp.example.com/mcp"
    }
  }
}
```

If the server requires authentication, OpenCode will prompt you to authenticate when you first try to use it. If not, you can [manually trigger the flow](#authenticating) with `opencode mcp auth <server-name>`.

---

### Pre-registered

If you have client credentials from the MCP server provider, you can configure them:

```json title="opencode.json" {7-11}
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "my-oauth-server": {
      "type": "remote",
      "url": "https://mcp.example.com/mcp",
      "oauth": {
        "clientId": "{env:MY_MCP_CLIENT_ID}",
        "clientSecret": "{env:MY_MCP_CLIENT_SECRET}",
        "scope": "tools:read tools:execute"
      }
    }
  }
}
```

---

### Authenticating

You can manually trigger authentication or manage credentials.

Authenticate with a specific MCP server:

```bash
opencode mcp auth my-oauth-server
```

List all MCP servers and their auth status:

```bash
opencode mcp list
```

Remove stored credentials:

```bash
opencode mcp logout my-oauth-server
```

The `mcp auth` command will open your browser for authorization. After you authorize, OpenCode will store the tokens securely in `~/.local/share/opencode/mcp-auth.json`.

---

#### Disabling OAuth

If you want to disable automatic OAuth for a server (e.g., for servers that use API keys instead), set `oauth` to `false`:

```json title="opencode.json" {7}
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "my-api-key-server": {
      "type": "remote",
      "url": "https://mcp.example.com/mcp",
      "oauth": false,
      "headers": {
        "Authorization": "Bearer {env:MY_API_KEY}"
      }
    }
  }
}
```

---

#### OAuth Options

| Option         | Type            | Description                                                                      |
| -------------- | --------------- | -------------------------------------------------------------------------------- |
| `oauth`        | Object \| false | OAuth config object, or `false` to disable OAuth auto-detection.                 |
| `clientId`     | String          | OAuth client ID. If not provided, dynamic client registration will be attempted. |
| `clientSecret` | String          | OAuth client secret, if required by the authorization server.                    |
| `scope`        | String          | OAuth scopes to request during authorization.                                    |

#### Debugging

If a remote MCP server is failing to authenticate, you can diagnose issues with:

```bash
# View auth status for all OAuth-capable servers
opencode mcp auth list

# Debug connection and OAuth flow for a specific server
opencode mcp debug my-oauth-server
```

The `mcp debug` command shows the current auth status, tests HTTP connectivity, and attempts the OAuth discovery flow.

---

## Manage

Your MCPs are available as tools in OpenCode, alongside built-in tools. So you can manage them through the OpenCode config like any other tool.

---

### Global

This means that you can enable or disable them globally.

```json title="opencode.json" {14}
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "my-mcp-foo": {
      "type": "local",
      "command": ["bun", "x", "my-mcp-command-foo"]
    },
    "my-mcp-bar": {
      "type": "local",
      "command": ["bun", "x", "my-mcp-command-bar"]
    }
  },
  "tools": {
    "my-mcp-foo": false
  }
}
```

We can also use a glob pattern to disable all matching MCPs.

```json title="opencode.json" {14}
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "my-mcp-foo": {
      "type": "local",
      "command": ["bun", "x", "my-mcp-command-foo"]
    },
    "my-mcp-bar": {
      "type": "local",
      "command": ["bun", "x", "my-mcp-command-bar"]
    }
  },
  "tools": {
    "my-mcp*": false
  }
}
```

Here we are using the glob pattern `my-mcp*` to disable all MCPs.

---

### Per agent

If you have a large number of MCP servers you may want to only enable them per agent and disable them globally. To do this:

1. Disable it as a tool globally.
2. In your [agent config](/docs/agents#tools), enable the MCP server as a tool.

```json title="opencode.json" {11, 14-18}
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "my-mcp": {
      "type": "local",
      "command": ["bun", "x", "my-mcp-command"],
      "enabled": true
    }
  },
  "tools": {
    "my-mcp*": false
  },
  "agent": {
    "my-agent": {
      "tools": {
        "my-mcp*": true
      }
    }
  }
}
```

---

#### Glob patterns

The glob pattern uses simple regex globbing patterns:

- `*` matches zero or more of any character (e.g., `"my-mcp*"` matches `my-mcp_search`, `my-mcp_list`, etc.)
- `?` matches exactly one character
- All other characters match literally

:::note
MCP server tools are registered with server name as prefix, so to disable all tools for a server simply use:

```
"mymcpservername_*": false
```

:::

---

## Examples

Below are examples of some common MCP servers. You can submit a PR if you want to document other servers.

---

### Sentry

Add the [Sentry MCP server](https://mcp.sentry.dev) to interact with your Sentry projects and issues.

```json title="opencode.json" {4-8}
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "sentry": {
      "type": "remote",
      "url": "https://mcp.sentry.dev/mcp",
      "oauth": {}
    }
  }
}
```

After adding the configuration, authenticate with Sentry:

```bash
opencode mcp auth sentry
```

This will open a browser window to complete the OAuth flow and connect OpenCode to your Sentry account.

Once authenticated, you can use Sentry tools in your prompts to query issues, projects, and error data.

```txt "use sentry"
Show me the latest unresolved issues in my project. use sentry
```

---

### Context7

Add the [Context7 MCP server](https://github.com/upstash/context7) to search through docs.

```json title="opencode.json" {4-7}
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/mcp"
    }
  }
}
```

If you have signed up for a free account, you can use your API key and get higher rate-limits.

```json title="opencode.json" {7-9}
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "{env:CONTEXT7_API_KEY}"
      }
    }
  }
}
```

Here we are assuming that you have the `CONTEXT7_API_KEY` environment variable set.

Add `use context7` to your prompts to use Context7 MCP server.

```txt "use context7"
Configure a Cloudflare Worker script to cache JSON API responses for five minutes. use context7
```

Alternatively, you can add something like this to your [AGENTS.md](/docs/rules/).

```md title="AGENTS.md"
When you need to search docs, use `context7` tools.
```

---

### Grep by Vercel

Add the [Grep by Vercel](https://grep.app) MCP server to search through code snippets on GitHub.

```json title="opencode.json" {4-7}
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "gh_grep": {
      "type": "remote",
      "url": "https://mcp.grep.app"
    }
  }
}
```

Since we named our MCP server `gh_grep`, you can add `use the gh_grep tool` to your prompts to get the agent to use it.

```txt "use the gh_grep tool"
What's the right way to set a custom domain in an SST Astro component? use the gh_grep tool
```

Alternatively, you can add something like this to your [AGENTS.md](/docs/rules/).

```md title="AGENTS.md"
If you are unsure how to do something, use `gh_grep` to search code examples from GitHub.
```


---

# SOURCE: `packages/web/src/content/docs/commands.mdx`

---
title: Commands
description: Create custom commands for repetitive tasks.
---

Custom commands let you specify a prompt you want to run when that command is executed in the TUI.

```bash frame="none"
/my-command
```

Custom commands are in addition to the built-in commands like `/init`, `/undo`, `/redo`, `/share`, `/help`. [Learn more](/docs/tui#commands).

---

## Create command files

Create markdown files in the `commands/` directory to define custom commands.

Create `.opencode/commands/test.md`:

```md title=".opencode/commands/test.md"
---
description: Run tests with coverage
agent: build
model: anthropic/claude-3-5-sonnet-20241022
---

Run the full test suite with coverage report and show any failures.
Focus on the failing tests and suggest fixes.
```

The frontmatter defines command properties. The content becomes the template.

Use the command by typing `/` followed by the command name.

```bash frame="none"
"/test"
```

---

## Configure

You can add custom commands through the OpenCode config or by creating markdown files in the `commands/` directory.

---

### JSON

Use the `command` option in your OpenCode [config](/docs/config):

```json title="opencode.jsonc" {4-12}
{
  "$schema": "https://opencode.ai/config.json",
  "command": {
    // This becomes the name of the command
    "test": {
      // This is the prompt that will be sent to the LLM
      "template": "Run the full test suite with coverage report and show any failures.\nFocus on the failing tests and suggest fixes.",
      // This is shown as the description in the TUI
      "description": "Run tests with coverage",
      "agent": "build",
      "model": "anthropic/claude-3-5-sonnet-20241022"
    }
  }
}
```

Now you can run this command in the TUI:

```bash frame="none"
/test
```

---

### Markdown

You can also define commands using markdown files. Place them in:

- Global: `~/.config/opencode/commands/`
- Per-project: `.opencode/commands/`

```markdown title="~/.config/opencode/commands/test.md"
---
description: Run tests with coverage
agent: build
model: anthropic/claude-3-5-sonnet-20241022
---

Run the full test suite with coverage report and show any failures.
Focus on the failing tests and suggest fixes.
```

The markdown file name becomes the command name. For example, `test.md` lets
you run:

```bash frame="none"
/test
```

---

## Prompt config

The prompts for the custom commands support several special placeholders and syntax.

---

### Arguments

Pass arguments to commands using the `$ARGUMENTS` placeholder.

```md title=".opencode/commands/component.md"
---
description: Create a new component
---

Create a new React component named $ARGUMENTS with TypeScript support.
Include proper typing and basic structure.
```

Run the command with arguments:

```bash frame="none"
/component Button
```

And `$ARGUMENTS` will be replaced with `Button`.

You can also access individual arguments using positional parameters:

- `$1` - First argument
- `$2` - Second argument
- `$3` - Third argument
- And so on...

For example:

```md title=".opencode/commands/create-file.md"
---
description: Create a new file with content
---

Create a file named $1 in the directory $2
with the following content: $3
```

Run the command:

```bash frame="none"
/create-file config.json src "{ \"key\": \"value\" }"
```

This replaces:

- `$1` with `config.json`
- `$2` with `src`
- `$3` with `{ "key": "value" }`

---

### Shell output

Use _!`command`_ to inject [bash command](/docs/tui#bash-commands) output into your prompt.

For example, to create a custom command that analyzes test coverage:

```md title=".opencode/commands/analyze-coverage.md"
---
description: Analyze test coverage
---

Here are the current test results:
!`npm test`

Based on these results, suggest improvements to increase coverage.
```

Or to review recent changes:

```md title=".opencode/commands/review-changes.md"
---
description: Review recent changes
---

Recent git commits:
!`git log --oneline -10`

Review these changes and suggest any improvements.
```

Commands run in your project's root directory and their output becomes part of the prompt.

---

### File references

Include files in your command using `@` followed by the filename.

```md title=".opencode/commands/review-component.md"
---
description: Review component
---

Review the component in @src/components/Button.tsx.
Check for performance issues and suggest improvements.
```

The file content gets included in the prompt automatically.

---

## Options

Let's look at the configuration options in detail.

---

### Template

The `template` option defines the prompt that will be sent to the LLM when the command is executed.

```json title="opencode.json"
{
  "command": {
    "test": {
      "template": "Run the full test suite with coverage report and show any failures.\nFocus on the failing tests and suggest fixes."
    }
  }
}
```

This is a **required** config option.

---

### Description

Use the `description` option to provide a brief description of what the command does.

```json title="opencode.json"
{
  "command": {
    "test": {
      "description": "Run tests with coverage"
    }
  }
}
```

This is shown as the description in the TUI when you type in the command.

---

### Agent

Use the `agent` config to optionally specify which [agent](/docs/agents) should execute this command.
If this is a [subagent](/docs/agents/#subagents) the command will trigger a subagent invocation by default.
To disable this behavior, set `subtask` to `false`.

```json title="opencode.json"
{
  "command": {
    "review": {
      "agent": "plan"
    }
  }
}
```

This is an **optional** config option. If not specified, defaults to your current agent.

---

### Subtask

Use the `subtask` boolean to force the command to trigger a [subagent](/docs/agents/#subagents) invocation.
This is useful if you want the command to not pollute your primary context and will **force** the agent to act as a subagent,
even if `mode` is set to `primary` on the [agent](/docs/agents) configuration.

```json title="opencode.json"
{
  "command": {
    "analyze": {
      "subtask": true
    }
  }
}
```

This is an **optional** config option.

---

### Model

Use the `model` config to override the default model for this command.

```json title="opencode.json"
{
  "command": {
    "analyze": {
      "model": "anthropic/claude-3-5-sonnet-20241022"
    }
  }
}
```

This is an **optional** config option.

---

## Built-in

opencode includes several built-in commands like `/init`, `/undo`, `/redo`, `/share`, `/help`; [learn more](/docs/tui#commands).

:::note
Custom commands can override built-in commands.
:::

If you define a custom command with the same name, it will override the built-in command.


---

# SOURCE: `packages/web/src/content/docs/cli.mdx`

---
title: CLI
description: OpenCode CLI options and commands.
---

import { Tabs, TabItem } from "@astrojs/starlight/components"

The OpenCode CLI by default starts the [TUI](/docs/tui) when run without any arguments.

```bash
opencode
```

But it also accepts commands as documented on this page. This allows you to interact with OpenCode programmatically.

```bash
opencode run "Explain how closures work in JavaScript"
```

---

### tui

Start the OpenCode terminal user interface.

```bash
opencode [project]
```

#### Flags

| Flag                                        | Short | Description                                                             |
| ------------------------------------------- | ----- | ----------------------------------------------------------------------- |
| <nobr><code>{"--continue"}</code></nobr>    | `-c`  | Continue the last session                                               |
| <nobr><code>{"--session"}</code></nobr>     | `-s`  | Session ID to continue                                                  |
| <nobr><code>{"--fork"}</code></nobr>        |       | Fork the session when continuing (use with `--continue` or `--session`) |
| <nobr><code>{"--prompt"}</code></nobr>      |       | Prompt to use                                                           |
| <nobr><code>{"--model"}</code></nobr>       | `-m`  | Model to use in the form of provider/model                              |
| <nobr><code>{"--agent"}</code></nobr>       |       | Agent to use                                                            |
| <nobr><code>{"--auto"}</code></nobr>        |       | Auto-approve permissions that are not explicitly denied                 |
| <nobr><code>{"--port"}</code></nobr>        |       | Port to listen on                                                       |
| <nobr><code>{"--hostname"}</code></nobr>    |       | Hostname to listen on                                                   |
| <nobr><code>{"--mdns"}</code></nobr>        |       | Enable mDNS discovery                                                   |
| <nobr><code>{"--mdns-domain"}</code></nobr> |       | Custom mDNS domain name                                                 |
| <nobr><code>{"--cors"}</code></nobr>        |       | Additional browser origin(s) to allow CORS                              |

---

## Commands

The OpenCode CLI also has the following commands.

---

### agent

Manage agents for OpenCode.

```bash
opencode agent [command]
```

---

#### create

Create a new agent with custom configuration.

```bash
opencode agent create
```

This command will guide you through creating a new agent with a custom system prompt and permission configuration. Anything you don't allow is denied in the generated agent's frontmatter.

#### Flags

| Flag                                        | Short | Description                                                                                                                                                                                                                |
| ------------------------------------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <nobr><code>{"--path"}</code></nobr>        |       | Directory to write the agent file to (defaults to global or `.opencode/agent` based on the prompt)                                                                                                                         |
| <nobr><code>{"--description"}</code></nobr> |       | What the agent should do                                                                                                                                                                                                   |
| <nobr><code>{"--mode"}</code></nobr>        |       | Agent mode: `all`, `primary`, or `subagent`                                                                                                                                                                                |
| <nobr><code>{"--permissions"}</code></nobr> |       | Comma-separated list of permissions to allow (default: all). Available: `bash`, `read`, `edit`, `glob`, `grep`, `webfetch`, `task`, `todowrite`, `websearch`, `lsp`, `skill`. Anything omitted is denied. Alias: `--tools` |
| <nobr><code>{"--model"}</code></nobr>       | `-m`  | Model to use, in `provider/model` format                                                                                                                                                                                   |

Passing all of `--path`, `--description`, `--mode`, and `--permissions` runs the command non-interactively.

---

#### list

List all available agents.

```bash
opencode agent list
```

---

### attach

Attach a terminal to an already running OpenCode backend server started via `serve` or `web` commands.

```bash
opencode attach [url]
```

This allows using the TUI with a remote OpenCode backend. For example:

```bash
# Start the backend server for web/mobile access
opencode web --port 4096 --hostname 0.0.0.0

# In another terminal, attach the TUI to the running backend
opencode attach http://10.20.30.40:4096
```

#### Flags

| Flag                                     | Short | Description                                                                |
| ---------------------------------------- | ----- | -------------------------------------------------------------------------- |
| <nobr><code>{"--dir"}</code></nobr>      |       | Working directory to start TUI in                                          |
| <nobr><code>{"--continue"}</code></nobr> | `-c`  | Continue the last session                                                  |
| <nobr><code>{"--session"}</code></nobr>  | `-s`  | Session ID to continue                                                     |
| <nobr><code>{"--fork"}</code></nobr>     |       | Fork the session when continuing (use with `--continue` or `--session`)    |
| <nobr><code>{"--password"}</code></nobr> | `-p`  | Basic auth password (defaults to `OPENCODE_SERVER_PASSWORD`)               |
| <nobr><code>{"--username"}</code></nobr> | `-u`  | Basic auth username (defaults to `OPENCODE_SERVER_USERNAME` or `opencode`) |

---

### auth

Command to manage credentials and login for providers.

```bash
opencode auth [command]
```

---

#### login

OpenCode is powered by the provider list at [Models.dev](https://models.dev), so you can use `opencode auth login` to configure API keys for any provider you'd like to use. This is stored in `~/.local/share/opencode/auth.json`.

```bash
opencode auth login
```

When OpenCode starts up it loads the providers from the credentials file. And if there are any keys defined in your environments or a `.env` file in your project.

##### Flags

| Flag                                     | Short | Description                                          |
| ---------------------------------------- | ----- | ---------------------------------------------------- |
| <nobr><code>{"--provider"}</code></nobr> | `-p`  | Provider ID or name to log in to                     |
| <nobr><code>{"--method"}</code></nobr>   | `-m`  | Login method label to use, skipping method selection |

---

#### list

Lists all the authenticated providers as stored in the credentials file.

```bash
opencode auth list
```

Or the short version.

```bash
opencode auth ls
```

---

#### logout

Logs you out of a provider by clearing it from the credentials file.

```bash
opencode auth logout
```

---

### github

Manage the GitHub agent for repository automation.

```bash
opencode github [command]
```

---

#### install

Install the GitHub agent in your repository.

```bash
opencode github install
```

This sets up the necessary GitHub Actions workflow and guides you through the configuration process. [Learn more](/docs/github).

---

#### run

Run the GitHub agent. This is typically used in GitHub Actions.

```bash
opencode github run
```

##### Flags

| Flag                                  | Description                            |
| ------------------------------------- | -------------------------------------- |
| <nobr><code>{"--event"}</code></nobr> | GitHub mock event to run the agent for |
| <nobr><code>{"--token"}</code></nobr> | GitHub personal access token           |

---

### mcp

Manage Model Context Protocol servers.

```bash
opencode mcp [command]
```

---

#### add

Add an MCP server to your configuration.

```bash
opencode mcp add
```

This command will guide you through adding either a local or remote MCP server.

---

#### list

List all configured MCP servers and their connection status.

```bash
opencode mcp list
```

Or use the short version.

```bash
opencode mcp ls
```

---

#### auth

Authenticate with an OAuth-enabled MCP server.

```bash
opencode mcp auth [name]
```

If you don't provide a server name, you'll be prompted to select from available OAuth-capable servers.

You can also list OAuth-capable servers and their authentication status.

```bash
opencode mcp auth list
```

Or use the short version.

```bash
opencode mcp auth ls
```

---

#### logout

Remove OAuth credentials for an MCP server.

```bash
opencode mcp logout [name]
```

---

#### debug

Debug OAuth connection issues for an MCP server.

```bash
opencode mcp debug <name>
```

---

### models

List all available models from configured providers.

```bash
opencode models [provider]
```

This command displays all models available across your configured providers in the format `provider/model`.

This is useful for figuring out the exact model name to use in [your config](/docs/config/).

You can optionally pass a provider ID to filter models by that provider.

```bash
opencode models anthropic
```

#### Flags

| Flag                                    | Description                                                  |
| --------------------------------------- | ------------------------------------------------------------ |
| <nobr><code>{"--refresh"}</code></nobr> | Refresh the models cache from models.dev                     |
| <nobr><code>{"--verbose"}</code></nobr> | Use more verbose model output (includes metadata like costs) |

Use the `--refresh` flag to update the cached model list. This is useful when new models have been added to a provider and you want to see them in OpenCode.

```bash
opencode models --refresh
```

---

### run

Run opencode in non-interactive mode by passing a prompt directly.

```bash
opencode run [message..]
```

This is useful for scripting, automation, or when you want a quick answer without launching the full TUI. For example.

```bash "opencode run"
opencode run Explain the use of context in Go
```

You can also attach to a running `opencode serve` instance to avoid MCP server cold boot times on every run:

```bash
# Start a headless server in one terminal
opencode serve

# In another terminal, run commands that attach to it
opencode run --attach http://localhost:4096 "Explain async/await in JavaScript"
```

#### Flags

| Flag                                     | Short | Description                                                                |
| ---------------------------------------- | ----- | -------------------------------------------------------------------------- |
| <nobr><code>{"--command"}</code></nobr>  |       | The command to run, use message for args                                   |
| <nobr><code>{"--continue"}</code></nobr> | `-c`  | Continue the last session                                                  |
| <nobr><code>{"--session"}</code></nobr>  | `-s`  | Session ID to continue                                                     |
| <nobr><code>{"--fork"}</code></nobr>     |       | Fork the session when continuing (use with `--continue` or `--session`)    |
| <nobr><code>{"--share"}</code></nobr>    |       | Share the session                                                          |
| <nobr><code>{"--model"}</code></nobr>    | `-m`  | Model to use in the form of provider/model                                 |
| <nobr><code>{"--agent"}</code></nobr>    |       | Agent to use                                                               |
| <nobr><code>{"--file"}</code></nobr>     | `-f`  | File(s) to attach to message                                               |
| <nobr><code>{"--format"}</code></nobr>   |       | Format: default (formatted) or json (raw JSON events)                      |
| <nobr><code>{"--title"}</code></nobr>    |       | Title for the session (uses truncated prompt if no value provided)         |
| <nobr><code>{"--attach"}</code></nobr>   |       | Attach to a running opencode server (e.g., http://localhost:4096)          |
| <nobr><code>{"--password"}</code></nobr> | `-p`  | Basic auth password (defaults to `OPENCODE_SERVER_PASSWORD`)               |
| <nobr><code>{"--username"}</code></nobr> | `-u`  | Basic auth username (defaults to `OPENCODE_SERVER_USERNAME` or `opencode`) |
| <nobr><code>{"--dir"}</code></nobr>      |       | Directory to run in, or path on the remote server when attaching           |
| <nobr><code>{"--port"}</code></nobr>     |       | Port for the local server (defaults to random port)                        |
| <nobr><code>{"--variant"}</code></nobr>  |       | Model variant (provider-specific reasoning effort)                         |
| <nobr><code>{"--thinking"}</code></nobr> |       | Show thinking blocks                                                       |
| <nobr><code>{"--auto"}</code></nobr>     |       | Auto-approve permissions that are not explicitly denied                    |

---

### serve

Start a headless OpenCode server for API access. Check out the [server docs](/docs/server) for the full HTTP interface.

```bash
opencode serve
```

This starts an HTTP server that provides API access to opencode functionality without the TUI interface. Set `OPENCODE_SERVER_PASSWORD` to enable HTTP basic auth (username defaults to `opencode`).

#### Flags

| Flag                                        | Description                                |
| ------------------------------------------- | ------------------------------------------ |
| <nobr><code>{"--port"}</code></nobr>        | Port to listen on                          |
| <nobr><code>{"--hostname"}</code></nobr>    | Hostname to listen on                      |
| <nobr><code>{"--mdns"}</code></nobr>        | Enable mDNS discovery                      |
| <nobr><code>{"--mdns-domain"}</code></nobr> | Custom mDNS domain name                    |
| <nobr><code>{"--cors"}</code></nobr>        | Additional browser origin(s) to allow CORS |

---

### session

Manage OpenCode sessions.

```bash
opencode session [command]
```

---

#### list

List all OpenCode sessions.

```bash
opencode session list
```

##### Flags

| Flag                                      | Short | Description                          |
| ----------------------------------------- | ----- | ------------------------------------ |
| <nobr><code>{"--max-count"}</code></nobr> | `-n`  | Limit to N most recent sessions      |
| <nobr><code>{"--format"}</code></nobr>    |       | Output format: table or json (table) |

---

#### delete

Delete an OpenCode session.

```bash
opencode session delete <sessionID>
```

---

### stats

Show token usage and cost statistics for your OpenCode sessions.

```bash
opencode stats
```

#### Flags

| Flag                                    | Description                                                                 |
| --------------------------------------- | --------------------------------------------------------------------------- |
| <nobr><code>{"--days"}</code></nobr>    | Show stats for the last N days (all time)                                   |
| <nobr><code>{"--tools"}</code></nobr>   | Number of tools to show (all)                                               |
| <nobr><code>{"--models"}</code></nobr>  | Show model usage breakdown (hidden by default). Pass a number to show top N |
| <nobr><code>{"--project"}</code></nobr> | Filter by project (all projects, empty string: current project)             |

---

### export

Export session data as JSON.

```bash
opencode export [sessionID]
```

If you don't provide a session ID, you'll be prompted to select from available sessions.

#### Flags

| Flag                                     | Description                           |
| ---------------------------------------- | ------------------------------------- |
| <nobr><code>{"--sanitize"}</code></nobr> | Redact sensitive transcript/file data |

---

### import

Import session data from a JSON file or OpenCode share URL.

```bash
opencode import <file>
```

You can import from a local file or an OpenCode share URL.

```bash
opencode import session.json
opencode import https://opncd.ai/s/abc123
```

---

### web

Start a headless OpenCode server with a web interface.

```bash
opencode web
```

This starts an HTTP server and opens a web browser to access OpenCode through a web interface. Set `OPENCODE_SERVER_PASSWORD` to enable HTTP basic auth (username defaults to `opencode`).

#### Flags

| Flag                                        | Description                                |
| ------------------------------------------- | ------------------------------------------ |
| <nobr><code>{"--port"}</code></nobr>        | Port to listen on                          |
| <nobr><code>{"--hostname"}</code></nobr>    | Hostname to listen on                      |
| <nobr><code>{"--mdns"}</code></nobr>        | Enable mDNS discovery                      |
| <nobr><code>{"--mdns-domain"}</code></nobr> | Custom mDNS domain name                    |
| <nobr><code>{"--cors"}</code></nobr>        | Additional browser origin(s) to allow CORS |

---

### acp

Start an ACP (Agent Client Protocol) server.

```bash
opencode acp
```

This command starts an ACP server that communicates via stdin/stdout using nd-JSON.

#### Flags

| Flag                                        | Description                                |
| ------------------------------------------- | ------------------------------------------ |
| <nobr><code>{"--cwd"}</code></nobr>         | Working directory                          |
| <nobr><code>{"--port"}</code></nobr>        | Port to listen on                          |
| <nobr><code>{"--hostname"}</code></nobr>    | Hostname to listen on                      |
| <nobr><code>{"--mdns"}</code></nobr>        | Enable mDNS discovery                      |
| <nobr><code>{"--mdns-domain"}</code></nobr> | Custom mDNS domain name                    |
| <nobr><code>{"--cors"}</code></nobr>        | Additional browser origin(s) to allow CORS |

---

### plugin

Install a plugin and update your config.

```bash
opencode plugin <module>
```

Or use the alias.

```bash
opencode plug <module>
```

#### Flags

| Flag                                   | Short | Description                     |
| -------------------------------------- | ----- | ------------------------------- |
| <nobr><code>{"--global"}</code></nobr> | `-g`  | Install in global config        |
| <nobr><code>{"--force"}</code></nobr>  | `-f`  | Replace existing plugin version |

---

### pr

Fetch and checkout a GitHub PR branch, then run OpenCode.

```bash
opencode pr <number>
```

---

### db

Database tools.

```bash
opencode db [query]
```

#### Flags

| Flag                                   | Description                    |
| -------------------------------------- | ------------------------------ |
| <nobr><code>{"--format"}</code></nobr> | Output format: `json` or `tsv` |

---

#### path

Print the database path.

```bash
opencode db path
```

---

### debug

Debugging and troubleshooting tools.

```bash
opencode debug [command]
```

---

### uninstall

Uninstall OpenCode and remove all related files.

```bash
opencode uninstall
```

#### Flags

| Flag                                        | Short | Description                                 |
| ------------------------------------------- | ----- | ------------------------------------------- |
| <nobr><code>{"--keep-config"}</code></nobr> | `-c`  | Keep configuration files                    |
| <nobr><code>{"--keep-data"}</code></nobr>   | `-d`  | Keep session data and snapshots             |
| <nobr><code>{"--dry-run"}</code></nobr>     |       | Show what would be removed without removing |
| <nobr><code>{"--force"}</code></nobr>       | `-f`  | Skip confirmation prompts                   |

---

### upgrade

Updates opencode to the latest version or a specific version.

```bash
opencode upgrade [target]
```

To upgrade to the latest version.

```bash
opencode upgrade
```

To upgrade to a specific version.

```bash
opencode upgrade v0.1.48
```

#### Flags

| Flag                                   | Short | Description                                                       |
| -------------------------------------- | ----- | ----------------------------------------------------------------- |
| <nobr><code>{"--method"}</code></nobr> | `-m`  | The installation method that was used; curl, npm, pnpm, bun, brew |

---

## Global Flags

The opencode CLI takes the following global flags.

| Flag                                       | Short | Description                          |
| ------------------------------------------ | ----- | ------------------------------------ |
| <nobr><code>{"--help"}</code></nobr>       | `-h`  | Display help                         |
| <nobr><code>{"--version"}</code></nobr>    | `-v`  | Print version number                 |
| <nobr><code>{"--print-logs"}</code></nobr> |       | Print logs to stderr                 |
| <nobr><code>{"--log-level"}</code></nobr>  |       | Log level (DEBUG, INFO, WARN, ERROR) |
| <nobr><code>{"--pure"}</code></nobr>       |       | Run without external plugins         |

---

## Environment variables

OpenCode can be configured using environment variables.

| Variable                              | Type    | Description                                       |
| ------------------------------------- | ------- | ------------------------------------------------- |
| `OPENCODE_AUTO_SHARE`                 | boolean | Automatically share sessions                      |
| `OPENCODE_GIT_BASH_PATH`              | string  | Path to Git Bash executable on Windows            |
| `OPENCODE_CONFIG`                     | string  | Path to config file                               |
| `OPENCODE_TUI_CONFIG`                 | string  | Path to TUI config file                           |
| `OPENCODE_CONFIG_DIR`                 | string  | Path to config directory                          |
| `OPENCODE_CONFIG_CONTENT`             | string  | Inline json config content                        |
| `OPENCODE_DISABLE_AUTOUPDATE`         | boolean | Disable automatic update checks                   |
| `OPENCODE_DISABLE_PRUNE`              | boolean | Disable pruning of old data                       |
| `OPENCODE_DISABLE_TERMINAL_TITLE`     | boolean | Disable automatic terminal title updates          |
| `OPENCODE_PERMISSION`                 | string  | Inlined json permissions config                   |
| `OPENCODE_DISABLE_DEFAULT_PLUGINS`    | boolean | Disable default plugins                           |
| `OPENCODE_DISABLE_LSP_DOWNLOAD`       | boolean | Disable automatic LSP server downloads            |
| `OPENCODE_ENABLE_EXPERIMENTAL_MODELS` | boolean | Enable experimental models                        |
| `OPENCODE_DISABLE_AUTOCOMPACT`        | boolean | Disable automatic context compaction              |
| `OPENCODE_DISABLE_CLAUDE_CODE`        | boolean | Disable reading from `.claude` (prompt + skills)  |
| `OPENCODE_DISABLE_CLAUDE_CODE_PROMPT` | boolean | Disable reading `~/.claude/CLAUDE.md`             |
| `OPENCODE_DISABLE_CLAUDE_CODE_SKILLS` | boolean | Disable loading `.claude/skills`                  |
| `OPENCODE_DISABLE_MODELS_FETCH`       | boolean | Disable fetching models from remote sources       |
| `OPENCODE_DISABLE_MOUSE`              | boolean | Disable mouse capture in the TUI                  |
| `OPENCODE_FAKE_VCS`                   | string  | Fake VCS provider for testing purposes            |
| `OPENCODE_CLIENT`                     | string  | Client identifier (defaults to `cli`)             |
| `OPENCODE_ENABLE_EXA`                 | boolean | Enable Exa web search tools                       |
| `OPENCODE_ENABLE_PARALLEL`            | boolean | Enable Parallel web search tools                  |
| `OPENCODE_SERVER_PASSWORD`            | string  | Enable basic auth for `serve`/`web`               |
| `OPENCODE_SERVER_USERNAME`            | string  | Override basic auth username (default `opencode`) |
| `OPENCODE_MODELS_URL`                 | string  | Custom URL for fetching models configuration      |

---

### Experimental

These environment variables enable experimental features that may change or be removed.

| Variable                                        | Type    | Description                             |
| ----------------------------------------------- | ------- | --------------------------------------- |
| `OPENCODE_EXPERIMENTAL`                         | boolean | Enable the experimental umbrella flag   |
| `OPENCODE_EXPERIMENTAL_ICON_DISCOVERY`          | boolean | Enable icon discovery                   |
| `OPENCODE_EXPERIMENTAL_DISABLE_COPY_ON_SELECT`  | boolean | Disable copy on select in TUI           |
| `OPENCODE_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS` | number  | Default timeout for bash commands in ms |
| `OPENCODE_EXPERIMENTAL_OUTPUT_TOKEN_MAX`        | number  | Max output tokens for LLM responses     |
| `OPENCODE_EXPERIMENTAL_FILEWATCHER`             | boolean | Enable file watcher for entire dir      |
| `OPENCODE_EXPERIMENTAL_OXFMT`                   | boolean | Enable oxfmt formatter                  |
| `OPENCODE_EXPERIMENTAL_LSP_TOOL`                | boolean | Enable experimental LSP tool            |
| `OPENCODE_EXPERIMENTAL_DISABLE_FILEWATCHER`     | boolean | Disable file watcher                    |
| `OPENCODE_EXPERIMENTAL_EXA`                     | boolean | Enable experimental Exa features        |
| `OPENCODE_EXPERIMENTAL_LSP_TY`                  | boolean | Enable TY LSP for python files          |
| `OPENCODE_EXPERIMENTAL_PLAN_MODE`               | boolean | Enable plan mode                        |
| `OPENCODE_EXPERIMENTAL_BACKGROUND_SUBAGENTS`    | boolean | Enable background subagent tasks        |
| `OPENCODE_EXPERIMENTAL_EVENT_SYSTEM`            | boolean | Enable experimental event system        |
| `OPENCODE_EXPERIMENTAL_NATIVE_LLM`              | boolean | Enable native LLM request path          |
| `OPENCODE_EXPERIMENTAL_PARALLEL`                | boolean | Enable parallel web search execution    |
| `OPENCODE_EXPERIMENTAL_SCOUT`                   | boolean | Enable Scout subagent                   |
| `OPENCODE_EXPERIMENTAL_WORKSPACES`              | boolean | Enable workspace support                |
