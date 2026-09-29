# Implementation Roadmap

## Step 1 — Freeze the reference core

Import/install the reference implementation at a known revision and make its existing tests green.

No functional changes.

## Step 2 — Build the bootstrap types

Implement:

- `BootstrapInput`
- work units
- candidate participants
- bootstrap iteration record
- `BootstrapResult`

No runtime execution yet.

## Step 3 — Build deterministic projection

Implement a pure projector from candidate participants to the exact reference `SwarmConfig`.

The projector is tested independently.

## Step 4 — Build iterative bootstrap

Implement:

```
normalize
decompose
project responsibilities
assign tools/models
challenge
refine
validate
emit
```

Keep iteration bounded.

## Step 5 — Wire the designer to OpenCode

Use the available OpenCode runtime to let a bootstrap designer inspect context and propose the team.

The designer must output structured data that the projector can validate.

## Step 6 — Execute through the untouched core

Call the reference swarm core with the projected configuration.

For long-lived server usage, pass the existing server through the reference `--server` mechanism.

## Step 7 — Add operator experience

Provide a small command such as:

```
swarm bootstrap "<objective>"
```

or an equivalent wrapper.

The command should:

1. collect/bootstrap the objective;
2. run bounded team design;
3. print/save the resulting `swarm.json`;
4. optionally invoke the existing `swarm run`.

Do not overload the reference `swarm run` semantics.

## Step 8 — Add durable bootstrap artifact

Persist:

- objective;
- constraints;
- iterations;
- accepted team;
- projected config;
- validation result.

Use JSON/Markdown first.

## Step 9 — Conformance and regression

Run both:

- all reference swarm tests;
- new bootstrap tests.

A failure in reference behavior is a core regression, not a bootstrap defect.
