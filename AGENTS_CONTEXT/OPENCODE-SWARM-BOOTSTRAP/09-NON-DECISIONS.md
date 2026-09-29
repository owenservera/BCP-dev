# Non-Decisions / Explicit No-Go List

These are intentionally left out of the bootstrap design.

## No fixed agent taxonomy

There is no built-in list of "standard" roles.

## No new swarm execution semantics

Do not change:

- turn execution;
- message delivery;
- memory behavior;
- persistence;
- retries;
- budgets;
- settlement;
- reports;
- notifications;
- MCP semantics.

## No new database model

Do not create a second swarm database merely to support generic bootstrapping.

## No new transport

Do not introduce Redis, queues, websockets, Git transport, Agent Commons, or another broker for this first implementation.

The reference SQLite + in-process plugin + SDK design stays intact.

## No automatic recursive swarm hierarchy

The bootstrap team is not a license to make a recursively self-spawning swarm architecture.

The reference swarm's existing agent configuration remains the execution boundary.

## No hidden methodology

The generic engine must not smuggle in an assumed software-factory workflow.

## No provider lock-in

The bootstrap layer may choose models using the existing provider/model string, but it must not require a specific provider.

## No truth authority

The bootstrap engine designs a team; it does not declare that the resulting team has produced correct or authoritative knowledge.

## No forced persistent-server implementation change

The reference runner already has an existing-server attachment path.

Use that path for the long-lived-server requirement instead of rewriting the runner.
