# Adjacent standard research: Model Context Protocol

Collected 2026-09-28.

## Why MCP matters to the Ω OpenCode setup

MCP is the main open protocol OpenCode uses to connect an agent to external tools and data. It is therefore directly relevant to any team that expects to expand from filesystem/Git work into browser, repository, research, business-system, or user-data capabilities.

## Primary references

- MCP specification / project: https://modelcontextprotocol.io/
- TypeScript SDK v2: https://ts.sdk.modelcontextprotocol.io/v2/
- TypeScript server SDK v2: https://ts.sdk.modelcontextprotocol.io/v2/api/@modelcontextprotocol/server/
- Tools: https://ts.sdk.modelcontextprotocol.io/v2/servers/tools
- Prompts: https://ts.sdk.modelcontextprotocol.io/v2/servers/prompts
- Resources: https://ts.sdk.modelcontextprotocol.io/v2/servers/resources
- Tasks extension: https://tasks.extensions.modelcontextprotocol.io/specification/draft/tasks
- Skills extension: https://skills.extensions.modelcontextprotocol.io/specification/stable/skills

## Findings

The current MCP ecosystem separates at least three important concepts:

1. Tools are model-selected actions.
2. Resources are application-selected/read-oriented context.
3. Prompts are user-selected message templates.

The newer Tasks extension introduces a durable asynchronous execution model around tool calls, while the Skills extension binds reusable agent instructions to MCP resources.

For Ω this suggests a useful conceptual separation between:
- capability execution;
- durable/contextual knowledge;
- reusable agent behavior;
- long-running external execution.

OpenCode's native Task/subagent mechanism and MCP Tasks are not automatically the same thing. They live at different layers and should not be conflated without evidence.

## Sovereignty/security relevance

MCP supports both local and remote server arrangements. For a sovereign local-first system, the team should distinguish:
- local process execution;
- remote network-connected tools;
- credential-bearing capabilities;
- read-only resources;
- user-authorized actions.

Do not equate “MCP” with “safe” or “local”; the transport and server deployment determine the trust boundary.
