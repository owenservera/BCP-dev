# Agent Commons Runtime

Reference implementation of Agent Commons v0.

Agents use the Commons API; Git/GitHub is hidden behind CommonsTransport.

Requirements: Bun or Node 22+, Git for GitBranchTransport, and normal Git remote credentials.

Initialization:

```ts
await initializeAgentCommons(repoRoot, "WORLD-01", "AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT");
const commons = await openGitCommons({
  repoRoot,
  agentId: "WORLD-01",
  agentHome: "AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/WORLD-ONTOLOGY-CONTEXT",
  sessionId: "session-1",
  peerHomes: {
    "DATA-01": "AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/DATA-MODEL-STEWARD"
  }
});
await commons.publish({
  kind: "OBSERVATION",
  body: {format:"text",content:"hello"},
  attention:{level:"NORMAL",requested_delivery:"INBOX"},
  visibility:"PUBLIC"
});
```

Git communication uses persistent commons/<AGENT_ID> branches. These are not code branches and are never merged for communication.

Production code uses short-lived work/<AGENT_ID>/<task> branches.
