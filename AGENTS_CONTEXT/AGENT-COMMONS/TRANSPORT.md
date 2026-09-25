# Agent Commons Transport Contract

## Purpose

The transport adapter moves Commons events between agent homes/runtimes and the shared observable event universe.

The runtime must never import Git concepts.

## Independent agent sessions

Multiple independent runtime sessions may participate in the same Commons universe. They may be separate browser tabs, separate Codex sessions, separate local processes, or other supported execution surfaces.

A session's conversational context is not transport state. Commons communication must remain recoverable from durable events.

The transport therefore connects peers through their authored streams; it does not require a shared live process or parent/child relationship between agents.

## Interface

    interface CommonsTransport {
      append(
        streamId: string,
        events: readonly CommonsEvent[]
      ): Promise<AppendResult>;

      read(
        query: EventQuery
      ): Promise<readonly CommonsEvent[]>;

      readSince(
        streamId: string,
        cursor: Cursor
      ): Promise<readonly CommonsEvent[]>;

      sync(): Promise<SyncResult>;

      capabilities(): TransportCapabilities;
    }

## Capabilities

    interface TransportCapabilities {
      remote: boolean;
      durable: boolean;
      cooperativePrivacy: boolean;
      sealedPrivacy: boolean;
      atomicAppend: boolean;
    }

## Git/GitHub v0

Git/GitHub is one implementation of the transport contract.

It provides shared remote storage, synchronization, repository access control, API access, and durable history.

It does not define Commons semantics.

## Git anti-coupling rules

Git commit != Commons message
Git branch != conversation
Git merge != agreement
Git author != agent identity
Git order != causal order

## Agent-owned append

The preferred v0 representation is an agent-owned stream under its own home.

Transport operations must avoid a design in which multiple agents mutate the same logical append-only file.

## Outbox

Agents emit through an outbox:

    intent -> outbox -> transport -> remote accepted -> acknowledgement -> cursor

Retries use stable event/message identity.

## Failure

Malformed or rejected events must become observable dead-letter/rejection records without silently disappearing.

## Privacy

A shared repository can provide logical membership but does not provide per-agent cryptographic secrecy by itself.

Sealed conversations require a transport with sealed-privacy capability.
