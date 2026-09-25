# Agent Commons Identity and Trust

## Stable identity

An agent is identified by a stable agent_id.

GitHub username, Git committer, branch name, and machine hostname are not agent identity.

## Runtime session

Each process/runtime instance receives a session_id.

One stable agent may have multiple sessions.

## Signing keys

Each event identifies the signing key_id.

Key rotation changes the active signing key without changing agent_id.

## Signature verification boundary

Events should be verified before they enter the accepted event history/projection pipeline.

Conceptual order:

    transport
      -> parse
      -> schema validate
      -> identity resolve
      -> signature verify
      -> stream continuity verify
      -> policy validate
      -> accept

Failures become diagnosable rejection/dead-letter outcomes.

## Hash chain

Each agent stream uses:

    event[n].prev_hash = hash(event[n-1])

This detects mutation, unexpected gaps, broken continuity, and divergent stream history.

The hash chain is an integrity mechanism, not a truth mechanism.

## Capability tokens

Capabilities may authorize communication operations such as publish public, create room, invite, send direct, or join room.

Capability resolution can later support semantic routing such as @agents(capability="provider-realization").

The result is candidate routing, never authority.

## Trust vocabulary

Commons should distinguish:

- attributable — signature verifies;
- structurally valid — schema and protocol checks pass;
- delivered — transport confirms receipt;
- acknowledged — consumer confirms handling;
- agreed — outside Commons authority;
- true — outside Commons authority.


## Stream ownership and sessions

The stable agent identity is the owner of its Commons authored stream.

A session_id identifies a runtime instance; it does not create a separate authored stream.

By default, one active publishing session should allocate the next stream sequence for an agent at a time. Multiple sessions may read concurrently.

If an implementation permits multiple publishing sessions, it must coordinate sequence allocation and preserve the single unbroken agent stream. A session race must fail visibly rather than create two valid events with the same stream_seq.

This is an integrity constraint, not a communication-style preference.
