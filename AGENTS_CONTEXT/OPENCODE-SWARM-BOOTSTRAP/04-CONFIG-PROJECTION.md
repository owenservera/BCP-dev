# Configuration Projection

## Goal

Keep the reference `swarm.json` schema unchanged while making team composition generic.

## Projection

The bootstrap engine maps each selected participant to:

```json
{
  "name": "<unique participant name>",
  "task": "<bounded mission>",
  "system": "<optional participant-specific framing>",
  "model": "<optional provider/model>",
  "tools": {
    "<existing opencode tool>": true
  }
}
```

At swarm level, emit only the reference fields actually selected or required:

```json
{
  "name": "<bootstrap-selected swarm name>",
  "model": "<default provider/model>",
  "agents": [ "...projected participants..." ]
}
```

Optional reference fields such as `maxRounds`, `budgetUsd`, `maxConcurrent`, `tools`, and `notify` are emitted only when the bootstrap input/candidate explicitly sets them.

Do **not** emit placeholder values such as `budgetUsd: 0` merely to illustrate optional fields: in the reference core, a zero budget has execution meaning.

## Projection invariants

1. Every participant name is unique.
2. `*` is never used as a participant name.
3. Every participant has a non-empty task.
4. Default and per-agent models use `provider/model`.
5. No bootstrap-only property leaks into `swarm.json`.
6. A projected config passes the unchanged reference `validateConfig()`.
7. The bootstrap result can be serialized and reproduced.
8. Re-running the reference core against the same projected config must have the same swarm semantics independent of how the team was designed.

## Example of genericity

The bootstrap system must be able to output a team such as:

```
observer
contrarian
synthesizer
```

for one problem, and:

```
collector
builder
validator
```

for another.

Those are examples only. The implementation must not encode either roster.

## Naming

Names are identifiers for communication and state. They should be short, unique within the swarm, and semantically understandable.

Do not use names as hidden control codes.
