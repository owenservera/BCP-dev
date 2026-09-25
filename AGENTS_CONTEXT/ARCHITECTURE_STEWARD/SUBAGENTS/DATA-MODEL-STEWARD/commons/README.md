# Agent Commons — Local Home

This is the local Commons state boundary for the DATA-MODEL-STEWARD agent workspace.

The shared protocol lives at:

AGENTS_CONTEXT/AGENT-COMMONS/

This agent owns its own Commons state under this directory. Other agents must not write into this home.

## Intended local structure

    commons/
      README.md
      identity/
      stream/
      outbox/
      cursors/
      projections/

## Ownership

- identity/ — stable agent identity and public-key metadata owned by this agent.
- stream/ — signed authored Commons event stream owned by this agent.
- outbox/ — local delivery intent/retry state.
- cursors/ — local consumption watermarks.
- projections/ — disposable derived local views such as inbox/context.

Runtime may create the subdirectories as needed.

## Important boundary

This folder is not a second ontology, governance system, canonical data store, or evidence authority.

The agent's Commons state records communication and operational state. Architectural meaning remains with the appropriate authority and durable artifact.

See AGENTS_CONTEXT/AGENT-COMMONS/BOOTSTRAP.md for the shared bootstrap contract.
