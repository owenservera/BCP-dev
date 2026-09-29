# Conformance and Acceptance

## A. Core preservation

A conforming implementation MUST prove:

1. An existing reference `swarm.json` runs unchanged.
2. Shared memory semantics are unchanged.
3. Message send/broadcast/inbox/delivery semantics are unchanged.
4. Agent session persistence is unchanged.
5. Resume semantics are unchanged.
6. Retry/backoff behavior is unchanged.
7. Budget semantics are unchanged.
8. `maxConcurrent` semantics are unchanged.
9. Final late-message sweep remains present.
10. The coordination tools cannot be stripped by a restrictive tool map.
11. MCP control operations still work.
12. CLI status/logs/send still work.
13. Existing-server attachment still works.

## B. Bootstrap correctness

A conforming bootstrap implementation MUST prove:

1. It accepts an objective without a fixed team roster.
2. It can produce different team structures for materially different objectives.
3. It does not require role names such as researcher/coder/reviewer.
4. It can perform at least one critique/refinement iteration.
5. It terminates after a bounded number of iterations.
6. Every final participant has a bounded mission.
7. Completion criteria have explicit responsibility coverage.
8. Redundant participants can be removed during refinement.
9. The final projection passes the unchanged reference config validator.
10. The projected config contains no bootstrap-only fields.
11. The same projected config can be executed by the reference swarm core.

## C. Persistent-server acceptance

Using an externally started server:

```
opencode serve
swarm run <generated-config> --server <server-url>
```

must produce a normal reference swarm run.

Stopping the swarm must not implicitly stop the externally owned server.

That property is achieved by using the reference `--server` path rather than modifying `runner.ts`.

## D. Regression corpus

The reference tests should remain available as regression tests. New tests are additive.

At minimum add fixtures for:

- two different objectives generating different participant sets;
- bootstrap refinement removing a redundant participant;
- bootstrap refinement adding a missing participant;
- projected config accepted by reference validation;
- bootstrap iteration limit;
- resource hints propagated into existing config fields;
- persistent-server attachment.

## E. Implementation acceptance sentence

The final implementation is acceptable only if a maintainer can truthfully say:

> "The generic system decides who should be on the team and what each member should do; the original swarm core still decides how that team executes, communicates, persists, resumes, and settles."
