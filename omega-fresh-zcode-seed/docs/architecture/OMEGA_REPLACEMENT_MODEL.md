# Ω Replacement Model — what "replaceable" means (Prompt 4, Phase 1 + Phase 12)

> Derived from the implemented contracts (`contracts/src/manifest.ts`,
> `recipe.ts`), the SDK validators (`sdk/src/validate.ts`), the conformance
> runner (`testkit/src/conformance.ts`), and the composition matrix. No new
> framework — this names the structure already latent in Ω.

## A. The stable unit
The **routed op** `<id>@<version>` (e.g. `echo.ping@1`): a contract-kind
contribution's id + version, owned by exactly one composition entry
(`OP_CONFLICT` otherwise) and declared by that entry's manifest
(`GRANT_NOT_DECLARED` otherwise). Families (`message.*`), archetypes
(`message.send`), and composition entries are selection scopes, not stability
units. Ports are the calling convention, not the unit.

## B. What may change without breaking consumers
Implementation code · plugin manifest version · internal algorithm and state
representation · parser transform behind a pinned version · runtime tier
(additive vocabulary) · storage backend behind vault ops · browser realization
behind `message.send@1` · config passthrough (never authority).

## C. What must NOT change
Contract semantics (input/output shape + risk class + failure vocabulary) ·
wire shape of `PortResult` · consumer expectations encoded in conformance
fixtures · µhost assumptions (B1–B5) · authority model (Recipe is the only
grantor; manifests are requests) · evidence requirements (content-hash match,
signed manifest, journaled MUTATIONs).

## D. Breaking-change taxonomy (do not conflate)
1. **Implementation replacement** — same `<id>@<version>`, different code.
   Consumer-invisible by construction. Proven by conformance green on both.
2. **Additive implementation change** — same op, wider accepted inputs
   (optional fields). Compatible iff old vectors still pass byte-identical.
3. **Contract-compatible replacement** — new plugin id, same op. Requires the
   composition grant to move; the op identity is the continuity.
4. **Contract version change** (`X@1 → X@2`) — a different architectural event:
   new contribution, new grant, migration of consumers. Never silent.
5. **Composition-only change** — same implementations, different selection/
   config. No code changes anywhere; proven by diff.
6. **Authority-breaking change** — any of: new unsigned execution path,
   weakened gate, host growth, bypassed Port Protocol. ALWAYS a stop, never
   an "upgrade".

## E. Conformance = the machine-checkable proof (reuse, don't rebuild)
`runConformance(pluginDir, { composition })` proves staged (shape) →
verified (manifest law + dep satisfaction + capability fit + B1 hash +
composition lawful) → active (FakeHost boot + TEST fixture green). Real-host
proof adds: compile ceremony signs + stamps, boot verifies (B1/B4), routed op
round-trips through the worker compartment. An implementation is
*contract-compatible* iff the SAME fixture vectors pass on both AND the
composition grants the op to exactly one of them at a time.

## Phase 12 note — parser-kind selection differs from routed-op selection
`parser` contributions register no op and never enter a route table. For
parsers, "composition selects implementation" = composition MEMBERSHIP + the
realization's version pin (D-355 bar compares pin vs manifest). Same
principle, different mechanism — documented, not conflated.
