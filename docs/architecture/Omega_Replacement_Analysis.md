# Ω Replacement Analysis — `echo.ping@1` boundary trace (Prompt 4, Phase 2)

## The chain
```text
consumer (test, counter plugin, demo script)
  → host.router.call("echo.ping@1", payload)      [Port Protocol, capability token host-side (B3)]
  → contract echo.ping@1 (READ, declared in omega.echo plugin.json)
  → router table (built from the signed Recipe's grants, not manifests)
  → worker compartment running examples/plugin-echo/src/index.ts
  → composition (demo|law|run|spine|kernel) grants echo.ping@1 to omega.echo
```

## Coupling inventory
- **Consumer coupled to:** the op string `echo.ping@1`, the payload shape
  `{delayMs?, busyMs?, ...}`, the `PortResult` envelope (`ok/value|error`),
  the semantic promise `{echo:true, payload round-trip}`. Nothing else.
- **Consumer NOT coupled to:** plugin id (`omega.echo`), file path, wall-clock
  `at` field (informational, not asserted by any gate test), internal statelessness.
- **Implementation coupled to:** shim `definePlugin/startPlugin`, `meta.emit`
  discipline for streaming, manifest-declared risk READ (gating behavior).
- **Version identity lives in three places:** contribution `echo.ping` version
  `1` (routing identity), plugin version `0.2.0` (release identity),
  `contentHash` stamped at compile (execution identity, B1). Routing uses the
  first; B1 verifies the third; the second is informational.
- **Authority lives in:** the user-signed Recipe (only grantor). The manifest
  requests; `validateComposition` enforces single ownership (`OP_CONFLICT`)
  and declaration (`GRANT_NOT_DECLARED`).

## How replacement works (mechanical)
1. New plugin dir declares `contract echo.ping@1` (many may declare; cf.
   `validate.ts` — conflicts are per-composition grants, not declarations).
2. Test-only or matrix composition grants the op to the new entry instead.
3. Compile ceremony signs + stamps; boot verifies B1/B4; router routes.
4. Same consumer calls succeed; conformance fixtures green on both.

## What prevents bypass
- Router routes ONLY granted ops (proven: `note.delete@1` absent from table).
- B1: content hash recomputed from source dir must match the signed manifest.
- B4: verification failure refuses the composition (pinned-recipe fallback).
- B2: compartment isolation — plugin code cannot reach host or peers.
- B3: tokens minted host-side; plugin never self-authorizes.
- Fail-closed: unknown ops REFUSED, handler throw → DEGRADED, bad hash → refuse boot.

## Chosen experiment (Phase 3)
V2 = `omega.echo2` (examples/plugin-echo2): same `echo.ping@1` contract,
materially different interior — append-only hash-chained log, monotonic seq,
NO clock (V1 is stateless + `Date.now()`). Consumer vectors assert only the
stable promise (`echo:true` + payload deep-equal), so both pass while
differing observably (`at` vs `seq`+`chain`).
