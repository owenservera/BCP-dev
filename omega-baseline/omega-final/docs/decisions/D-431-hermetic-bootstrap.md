# D-431 — The hermetic bootstrap: chain-of-custody archive verification and the mechanical self-forge

## Status

RATIFIED

## Context

- The gap analysis (the builder-100 sweep, scenarios #1/#2/#60/#100) demands
  self-hosting as a **core, falsifiable capability**: byte-identical boot from
  a frozen archive, rogue-injection refusal, a Forge that re-emits itself
  byte-identical, wipe-machine → clone → boot. The genome carries Ω-0 as
  `ratified-unimplemented` (specId `D-449`, upgrade doc
  `omega-upgrades/OMEGA-0-HERMETIC-BOOTSTRAP.md`); this record lands it.
- Today the archive discipline is PROGRAM CEREMONY, not system capability:
  `D-414`'s round-close cuts the bundle and pins its sha256 (truncated, in the
  generated ledger row), `build/status.json` pins the toolchain — but nothing
  in the SYSTEM re-proves any of it on demand, nothing refuses a boot on
  unproven ground, and "the Forge emits itself byte-identical" (core
  falsifier F2) is a wave-close assertion by whoever ran the commands.
- The one invariant this record exists to protect: **no stage of the
  bootstrap chain is trusted without a hash, and no boot is called verified
  that the tooling cannot prove.** A system that cannot prove its own ground
  cannot vouch for anything that stands on it — every provenance badge,
  signed row, and evidence citation in the Ω series bottoms out here.
- Recon facts that shape the mechanism: the entire tree is network-clean
  except `surfaces/` (4 files: the web canvas, daemon pair) and `plugins/`
  (1 file: the live LLM provider) — exactly the post-boot canvas/providers
  the headless doctrine excludes; `zod` is the only external dep in the gate
  path (`status.ts`, `anvil.ts`); the gate summary is deterministic modulo
  its `at` timestamp.

Blocks: none

## Options

| Criterion | (a) `boot/` store + `omega:boot` five-stage chain + emit | (b) Extend round-close to verify bundles at cut time only | (c) Defer to Ω-0.5 |
|---|---|---|---|
| Proves the ground on demand, any machine, headless | Yes — verify is a standalone re-runnable op on any clone of the archive | No — proves it once, at cut, on the cutting machine; every later boot is again unverified | No — durability is a different axis (crash/compaction), not proof of ground |
| Rogue injection refused, loudly | Yes — S2 walks the clone's disk against the git manifest; an unlisted file is BOOT_UNVERIFIED_FILE, named, never executed (the check precedes the gate) | Partial — a tampered bundle re-cut would hash-differ, but an injected file beside the archive is never examined | No |
| Self-forge (F2) mechanical | Yes — `boot.emit` re-walks the running tree's manifest against the pinned archive, root-hash to root-hash, on demand, in the dark | No — F2 stays ceremony | No |
| Honesty contract (D-321) | Yes — verdicts are `verified \| advisory \| refused`; unprovable is ADVISORY, never silently VERIFIED; refusals halt and ledger a sentence | n/a | n/a |
| Zero host LOC, no new gate stage | Yes — tooling/ + a gitignored local store; the law rides the existing ceremonies | Yes | Yes |

## Decision

**Decision:** (a) — `tooling/gates/boot.ts`, in substance:

- **The archive is the bundle — no second format, no privileged path.** The
  ledger's latest `_N.bundle` (resolved through the `D-422` A17 pin, the same
  resolution round-close uses) IS the frozen archive. Its pinned sha256 lives
  truncated in the generated ledger README row (`A2`'s row law — generated,
  never typed) and is cross-checked every verify; the FULL sha256 is pinned
  in the boot store's `archive` row on first verify of that bundle number and
  compared full-strength thereafter — a changed bundle under the same number
  is BOOT_ARCHIVE_HASH_MISMATCH.
- **`boot/` is the ns-boot store** (environment-local, gitignored — the
  `D-428` law-committed/memory-local boundary): `records.jsonl` (append-only
  rows: `archive | stage | receipt`) witnessed by `records.chain.json`, one
  sha256 link per line chained to the previous — the session-store idiom.
  Namespace law: kernel-owned, sole writer `boot.ts`, archive/chain rows
  forever, receipts retained with the store; a re-boot appends a new chain,
  never edits the old one. Refused boots ledger their stage rows directly
  (the store verifies the ARCHIVE, not itself — the `D-416` sidecar exists to
  bridge a vault that cannot yet open; this store has no such chicken-and-egg
  and the difference is stated, not hidden).
- **The five-stage chain of custody** — each stage appends one
  `stage` row `{bootId, stage, name, inputHash, outputHash, verdict,
  refusedWith?, detail}`; a refused stage HALTS the boot (nothing after it
  runs) and its sentence is the record:
  - **S1 · resolve** — the bundle exists; full sha256 computed; README row
    cross-checked (short form + tip); the archive row compared full-strength
    when present; the bundle cloned to `omegaTmp` (a local file — no
    network). `inputHash` = sha256(bundle bytes).
  - **S2 · manifest walk** — the manifest is the target tree's `git
    ls-files` → per-path sha256 of on-disk bytes. The verified tree is a
    fresh clone of the pinned bundle (rehearsal, the default) or a
    pre-materialized tree (`--tree` — the self-hosting boot; the store then
    lands in THAT tree's `boot/`, the receipt written into the system it
    just proved). UNLISTED GUESTS are exactly what git reports as untracked
    AND not ignored (`git ls-files --others --exclude-standard`): git's own
    ignore law draws the line between the system (tracked) and the box's
    declared local memory (`boot/`, `sessions/`, `dev-vault/` — the `D-428`
    boundary, reserved in `.gitignore`, never part of the archive); a file
    that is neither tracked nor reserved is BOOT_UNVERIFIED_FILE (named,
    never executed: S2 precedes the gate, and a refused stage halts the
    boot), a manifest path absent from disk likewise. The verifier at
    `<root>/tooling/gates/boot.ts` must hash-match the manifest — the tool
    proving the ground stands on it or refuses (a mid-development tree
    verifying an older bundle honestly refuses here). `outputHash` =
    rootHash = sha256 over the canonical sorted `[path, sha256]` pairs.
  - **S3 · toolchain** — the clone's `build/status.json` pin
    `{bun, node, os, arch}` (`D-414`) vs the actual runtime: `bun`, `node`,
    `arch` exact or BOOT_TOOLCHAIN_DRIFT (pinned vs actual named); an os
    -family mismatch is ADVISORY, not a refusal — a different-platform boot
    is a different receipt (spec choicepoint 5), named in the detail.
  - **S4 · hermeticity** — every manifest code file is scanned for network
    reach (`node:http/https/net/dns/dgram/tls`, `undici`, `fetch(`,
    `WebSocket`, `http(s)://` imports). Markers are legal ONLY under
    `surfaces/` and `plugins/` — the post-boot canvas and live providers,
    named in the receipt detail; anywhere else is BOOT_NETWORK_VIOLATION
    (file:line). An unreadable file is ADVISORY (cannot prove).
  - **S5 · gate digest** — only with `--gate` (the dry-run verifies S1–S4);
    `bun install --offline` + the clone's OWN `omega:gate` script in the
    clone. No gate defined → ADVISORY; install cannot run offline → ADVISORY
    (unproven, not failed); the gate RUNS RED → REFUSED, named by stage.
    `gateDigest` = sha256 over the summary's deterministic fields
    `{ok, failed, hostLoc, tests}` — the volatile `at` excluded, so the same
    tree yields the same digest.
- **The receipt** is written only when no stage refused:
  `{bootId, archiveRef{n, sha256, rootHash}, chainHead (the S1..S5 row
  hashes folded), stages, gateDigest?, toolchain (actual, pin-matched),
  bootedAt, principal, sessionRef?, badge}`. `badge: VERIFIED` only when
  EVERY stage verified; any advisory → `ADVISORY` (the `D-321` never-fake
  -enforce contract — the tool refuses to claim what it cannot measure). If
  a session is open the receipt cites it (the evidence-citation discipline).
- **`boot.emit` — self-forge, mechanical (F2).** Requires explicit
  `--consent` (refused BOOT_NO_CONSENT otherwise — the op table's
  principal-consent law; the register's seventh code, added additively).
  Walks the RUNNING tree's manifest (`git ls-files` + on-disk bytes) and the
  pinned archive's manifest: root-hash equal → the receipt carries
  `selfForge: true`; divergent → BOOT_EMIT_DIVERGENCE naming every path
  (added/removed/content-changed) — the Forge never silently claims to be
  byte-identical to itself.
- **Ops**: `verify [--ledger --bundle --gate]` · `emit [--consent]` ·
  `audit` (re-hash every chain link, re-derive each receipt's chainHead,
  re-check the archive row against the bundle on disk — deterministic replay
  of the verdicts the rows carry) · `receipt [--bootId]` · `status`.

## Consequences

- Self-hosting becomes a property of the system: wipe the machine, clone the
  archive, `omega:boot verify --gate` — archive hash, manifest walk,
  toolchain pin, hermeticity scan, and the clone's own gate, all re-proven
  headless, with a chain-of-custody receipt that outlives the session.
- F2 (self-forge) is promoted from ceremony to capability: `boot.emit`
  re-proves the Forge byte-identical to its archive whenever asked, and a
  one-byte divergence is NAMED, not diffed by hand.
- The proof is tamper-EVIDENT, not tamper-PROOF (`D-321`/`D-428` stance):
  whoever owns the box can rewrite; audit re-derives every digest and names
  the lie.
- The verifier's own ground is honest about its limits: the running
  `boot.ts` hash-match (S2) closes the loop for the verifier itself; the
  deeper module graph is covered by the manifest equality and the S4 scan of
  the CLONE — a running tree that is ahead of the archive refuses at S2 by
  design (mid-development verification of an old bundle is exactly the
  unproven-ground case the law refuses).
- Ω-0.5 (vault durability) unblocks: crash-recovery rehearsal needs a
  deterministic, proven ground to fork from; Ω-1's event atoms get a floor;
  Ω-8's chaos gets a byte-reproducible base state.
- Zero host LOC; writes only under `boot/` (local) and `omegaTmp` (the
  `D-372` scratch root); no new gate stage (the boot chain is a standalone
  ceremony; the genome gate already carries Ω-0's layer law); anvil
  untouched.

## Evidence

- Falsifiers, green in this record's tree BEFORE the flip per `D-364`
  (`omega:loop --stub D-431` generates the RED stub this list resolves to):
  - `F-BOOT.1` (byte-identical ×2) — two verifies of the same archive yield identical stage tuples {stage, inputHash, outputHash, verdict} for S1–S4, gate green both times, and receipts that differ only in bootId/bootedAt (the volatile fields named).
  - `F-BOOT.2` (rogue-injection refusal) — a file planted in the boot tree (untracked, unreserved) fires BOOT_UNVERIFIED_FILE with the path named, the boot HALTS (no stage after it, no receipt), and the refusal exists as a ledgered, replayable sentence.
  - `F-BOOT.3` (self-forge mechanical) — emit on the pristine tree reports selfForge: true via root-hash equality; corrupting one byte of one tracked file yields BOOT_EMIT_DIVERGENCE naming exactly that path; emit without --consent is refused BOOT_NO_CONSENT.
  - `F-BOOT.4` (self-hosting) — from a bare directory containing only the bundle and the boot tool: clone → verify → gate green, entirely local (no network op in the verify path — structural: the module imports no network capability).
  - `F-BOOT.5` (headless) — every op (verify, emit, audit, receipt) completes with no canvas/surface on the path: the core is pure functions over files and git output, and the CLI runs under piped stdio with no TTY.
  - `F-BOOT.6` (advisory honesty) — a boot that cannot prove a stage (os-family mismatch, unreadable file, absent gate, offline install impossible) yields verdict ADVISORY and receipt badge ADVISORY, never VERIFIED — and a stage that proves drift REFUSES; unproven and failed are different sentences, both loud.
- `tooling/gates/boot.ts` (new — the store, the chain, the five stages, the
  pure folds: manifest walk, rootHash, network scan, toolchain compare,
  gateDigest), `package.json` gains `omega:boot`; `.gitignore` reserves
  `boot/`; `genome/layers.json` flips Ω-0 to implemented (treeId 431);
  `AGENTS.md` gains the boot law; the invariants digest gains the
  hermetic-ground law (pass 7) with the freshness pin moved in the same
  commit.
- Self-host, exercised in this record's own round: after round-close cuts
  the wave's bundle, `omega:boot verify --gate` runs against it from the
  clean tip (the running verifier hash-matching the archive — S2's
  self-check green on the real archive), and `boot.emit --consent` re-proves
  the Forge byte-identical to its own bundle — the self-hosting boot and the
  mechanical self-forge, dogfooded on the landing wave.
- Precedents: spec `D-449` (Ω-0, `omega-upgrades/OMEGA-0-HERMETIC-BOOTSTRAP.md`
  — the §10 record text this tree record translates);
  `D-414` (the bundle ceremony + toolchain pin this verifies); `D-422` A17
  (the ledger home this resolves); `D-321` (the honesty contract the verdict
  vocabulary inherits); `D-428` (the law-committed/memory-local boundary the
  store rides); `D-372` (the scratch root the clones live under); `D-426`
  (the falsifier-first loop this record rides).

- Ratified on greens (evidence-class, F-BOOT.1..6 green in this record's tree BEFORE the flip per D-364): landing commit 89077a8; full gate green 1253/0 ×2 on the PROPOSED tree (2026-09-21T00:42:18Z and 00:43:57Z; the prior tip's 1247 + 6 new) + the post-commit green 1253/0 at 00:47:04Z (head 89077a8, the D-364 second green, its status.json carried); the falsifier-first loop caught the program mid-wave (the scanner's own marker labels self-matching, the store's rows refused as unlisted guests in --tree mode — resolved by git's own ignore law, the mechanism amended as-built in this record before the flip); the first full gate flagged the stale genome fold and the F-GENOME.6 live-lock pin took its lawful walk (extended to Ω-0, never weakened); docscan 0 findings after the backtick discipline (three bare `D-449` citations fixed); zero host LOC; anvil untouched; the wave's own session (20260921-000007) runs begin-first under the D-430 law; the self-host dogfood (verify --gate + emit --consent against this wave's own bundle, receipts chained in boot/) executes at wave close, after round-close cuts it — stated here before the flip, proven in the stream.

## Index

summary: boot/ as the ns-boot store: the ledger bundle IS the frozen archive, verified by a five-stage chain-of-custody (resolve, manifest walk, toolchain, hermeticity, gate digest) with receipts VERIFIED or ADVISORY per the D-321 honesty contract, and boot.emit re-proves the Forge byte-identical to itself by root-hash comparison
rationale: The 100 demand a core, falsifiable self-hosting capability, not a milestone memory: no stage of the bootstrap chain is trusted without a hash, and no boot is called verified that the tooling cannot prove - a system that cannot prove its own ground cannot vouch for anything that stands on it (Omega-0, spec `D-449`)
class: evidence
