# PLUGIN-AUTHORING-PATH-AUDIT — every mechanism that creates plugins (master §29)

> Canonical semantic path (see PLUGIN-BUILDER-ARCHITECTURE.md):
> **pack.builder → forge.author (+forge.*) → builder composition → surface.**
> Everything else below is positioned relative to that path. No code moved.

## 1. `sdk/` — NOT an authoring path
- Purpose: manifest/recipe shape validation + ceremony signing helpers + port/stream conveniences.
- Authoring power: NONE (the §3 builder modules of the PROPOSED design doc never landed).
- Authority: anvil (D-404). Runtime phase: pre-boot + caller-side.
- Tests: anvil.test.ts 9/9 + consumer suites. Consumers: gates, testkit, builder, plugin tests.
- Relation to Forge/pack.builder/anvil: IS the anvil; validates Forge outputs; does not author.
- Status: CURRENT (as anvil). Target: STAY ANVIL. See SDK-ANVIL-ACCOUNTING.md.

## 2. `tooling/builder` (`omega new-plugin`) — bootstrap surface
- Purpose: scaffold contract/provider/engine/surface plugin + FakeHost test + fixture; validate + conformance the result.
- Inputs: plugin id/contract/kind. Outputs: plugin dir (hand-editable scaffold).
- Authority: NONE (emits unsigned scaffold; law applies at conformance/compile).
- Implementation: thin wrapper over sdk (parse/validate) + testkit (runConformance). No competing semantics — every check it runs IS the canonical law.
- Tests: tooling/builder/test/* (asserted by tree; not re-run this session).
- Consumers: human/bootstrap (created forge.author once, per Forge doc L-FORGE boundary).
- Relation to Forge: PREDECESSOR/surface — could become a surface invoking forge.author instead of scaffolding directly.
- Status: KEEP-BUT-MARK (bootstrap, not canonical). Target: SURFACE-OVER-FORGE or documented bootstrap; do NOT extend its semantics.

## 3. `tooling/generate plugin` — DUPLICATE scaffold
- Purpose: scaffold plugins/<name> + core.ts + authoring checklist.
- Overlap: same job as (2) and as forge.author's emission. THREE plugin-creators coexist (this section's finding).
- Authority: none. Tests: tooling/gates/test/generate.test.ts (validateManifest consumer).
- Status: QUARANTINE (conceptually — no file moves). Target: SUBORDINATE (surface over forge.author) or RETIRE via decision. Must not gain features meanwhile.

## 4. `tooling/generate pack` — sole pack scaffold
- Purpose: packs/domain-<x> SCHEMA+CONTRACT+POLICY+TEST skeleton.
- Overlap: pack.builder's direction, but NO forge.pack exists — nothing competes today.
- Status: KEEP-BUT-MARK (bootstrap until a pack-Forge exists). Target: unchanged until forge.pack; then subordinate.

## 5. `tooling/generate composition` — CANONICAL composition mechanism
- Purpose: emit compositions/*.json byte-identical from _matrix.json; --check falsifier in gate.
- Authority: matrix is source of truth (D-377); gate fails drift mechanically.
- Status: CURRENT. Target: KEEP. (Not eliminated for being called "generate" — §14 anticipated and rejected that.)

## 6. `packs/builder` — the Builder Contract
- Purpose: SCHEMA+CONTRACT+POLICY+TEST the Forges obey (36 files: contract/policy/src/test).
- Authority: CONTRACT (declaration, not implementation). Status: CURRENT. Target: KEEP.

## 7. `plugins/forge-author` — the canonical implementation
- Purpose: forge.author.init@1 emits plugin structure; self-hosting falsifier reproduces plugins/forge-author/ byte-identical outside // AUTHORED regions.
- Authority: ordinary plugin (manifest, capabilities, composition membership, law, provenance).
- Tests: test/happy/self-host.test.ts. Consumers: builder composition forge-author.json.
- Status: CURRENT canonical path. Target: KEEP + extend (more forge.* per BACKLOG.md).

## 8. Builder compositions (`compositions/forge-author.json`) — canonical assembly
- Purpose: assemble Forge ops with grants (builder composition, FORGE_IN_PRODUCT separated).
- Authority: recipe/grant law like any composition. Status: CURRENT. Target: KEEP.

## Explicit answer
THREE mechanisms scaffold plugins (2, 3, 7) but only ONE is canonical (7).
(2) is a compatible bootstrap surface; (3) is an unreconciled duplicate.
Convergence = (3) subordinated or retired by decision; (2) marked bootstrap;
(7) extended. No second semantic implementation of plugin creation may gain
features. Recorded here; the retirement decision belongs to the owner + a
D-record, not to cleanup.
