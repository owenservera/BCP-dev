# PLUGIN-BUILDER-ARCHITECTURE — the one current explanation (master §30)

> A brand-new agent should need nothing else to answer the questions below.
> Historical framing lives in docs/archive/ and the Ω annex — never here.

## What is a plugin?
A directory with `plugin.json` (manifest: id, entry, contributions, dependencies,
capabilities, runtime, contentHash) + code + optional tests. It REQUESTS
authority; it never grants it. Kinds: contract/engine/provider (routable),
schema/policy/pack/test/lang/parser (data, incl. non-routable), surface, runtime.

## What is a contract?
A routable op `<id>@<version>` with input/output shape, risk class, and failure
vocabulary. Consumers call contracts through the router; implementations sit
behind them and are replaceable without touching callers, host, or contract.

## What is pack.builder?
The Builder Contract as a pack (`packs/builder/`: SCHEMA+CONTRACT+POLICY+TEST).
It declares what builder/Forge plugins must do — the law the Forges obey.

## What is a Forge?
An ORDINARY Ω plugin whose ops inspect, shape, emit, prove, or promote other Ω
artifacts (forge.author/mine/survey/assay/shape/emit/proof/tier). Same manifest,
same capabilities grammar, same composition membership, same law, same
provenance, same runtime boundary as any plugin. No privileged developer path.

## What is forge.author?
The first Forge: `forge.author.init@1` emits plugin structure, and proves the
model by reproducing itself byte-identical (self-hosting falsifier, minus
`// AUTHORED` regions). If it cannot build itself through its own door, the
model is branding, not architecture.

## What is a builder composition?
A composition (e.g. `compositions/forge-author.json`) assembling Forge plugins
with grants. Builder compositions never route product ops (FORGE_IN_PRODUCT).

## What is the anvil?
`sdk/src`: the frozen pre-boot edge (manifest parse/validate, signing, content
hash, port/stream conveniences) — 860 LOC budget, 45-export surface, remove-to-add
(D-404). It VALIDATES plugin construction; it does NOT author plugins.

## What is tooling?
Out-of-tree developer convenience: inspection, generation, gates, tests.
Legitimate UNLESS it implements a competing semantic authority. Current
judgments: `generate composition` canonical; `builder` bootstrap (keep, mark);
`generate plugin` unreconciled duplicate (quarantined conceptually — see audit).

## What is sdk/?
The internal pre-boot anvil (see above). It is NOT a developer SDK — no
authoring API was ever added. The NAME is historical; imports are not churned
to fix a label. Full accounting: docs/cleanup/SDK-ANVIL-ACCOUNTING.md.

## How does a third party build a plugin?
`forge.author` (via builder composition) or, during bootstrap, `tooling/builder`
scaffold — then the SAME conformance every plugin passes
(staged→verified→active), then composition grant by user-signed recipe. The
µhost never learns the plugin's name.

## How is the result validated? Proven?
`runConformance` (shape, law, deps, capabilities, B1 hash, FakeHost fixture)
+ real-boot round-trip test + gate stages (compositions, surfaces, anvil,
forge-surface). Existence = passing conformance (law 9).

## What path should an agent use?
Forge path for authoring; sdk/testkit for validation; matrix path for
compositions. Never hand-edit specs; never invent a second scaffolder; never
expand the anvil without a superseding D-record.
