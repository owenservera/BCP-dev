# forge.mine.capture — the capture seam (D-409)

Class 3 / **EXTERNAL_MUTATION** Forge plugin: `forge.mine.capture@1`, the ONE
filesystem seam in the forge surface. It walks a declared, pinned legacy mine,
hashes every admitted file, and emits a `CaptureReceipt@1` (the shape
`pack.builder` freezes) plus one append-only proposal row carrying that receipt.

D-409 **split** the mine family along the risk-class boundary: this directory is
the EXTERNAL_MUTATION half, and the READ siblings (`forge.mine.verify@1`,
`forge.mine.diff@1`, `forge.mine.list@1`) belong to the separate `plugins/forge-mine/`
plugin — they are not declared here and must not be. A plugin spans exactly one
risk class (`FORGE_CLASS_SPAN`); merging them back would make this plugin a lie.

## What the op does

`forge.mine.capture@1  {mineRoot, mineId} → CaptureReceipt@1`

1. Validates the payload against a **closed** grammar (`mineRoot`, `mineId`; any
   other field is `CAPTURE_MALFORMED_INPUT`).
2. Checks the mine id against `MINE_ID` (`<repo>@<7-64 hex>`). An unpinned tree
   has no identity to attest.
3. Resolves `mineRoot` and confirms it is a directory.
4. Runs its **own** `law.check@1` self-check, before the first file byte leaves
   the disk.
5. Walks the tree, hashing every admitted file.
6. Computes the root hash and checks it against the pin carried in `mineId`.
7. Appends the receipt to vault ns `proposal` and reads it back; an unsynced
   write is refused, never returned.

## The hash domain — two declared rules, neither a parameter

**Normalisation.** `hash(file) = sha256(CRLF→LF-normalised bytes)`, on raw bytes
(never through a string codec — a mine may hold arbitrary bytes). A lone `0x0D`
that is not part of a CRLF pair is preserved, so the rule can never merge a line
an author wrote on purpose.

Why: a receipt whose hash changed when the reader's checkout rewrote its line
endings would attest to the checkout, not to the mine. The repo already declares
the same law at the checkout edge — `.gitattributes`: *"Recorded harvest
fixtures are byte-hashed in … MANIFEST.json … Without an explicit rule
`* text=auto` checks .txt out as CRLF, so the on-disk bytes stop matching the
recorded sha256"*. The capture applies it at the read edge instead.

This is load-bearing on this checkout, and the suite measures it: of the pinned
mine's 42 files, **21 are checked out with CRLF by `core.autocrlf=true` and 21
are already LF**. The 21 LF files prove the rule is a no-op on LF content; the
other 21 are why a raw-byte capture would disagree with the mine's own manifest.

**Root hash.** `rootHash = sha256("\n".join("path:hexHash" for each admitted
file, in path order))`. This is byte-for-byte the formula the pinned fixture's
own reference implementation computes
(`fixtures/mines/synthetic-v0/src/hashutil.py::root_hash`). Agreeing with an
INDEPENDENT implementation is the falsifier — a formula this plugin invented and
then agreed with itself would prove nothing.

## Exclusions vs refusals — different facts, and the receipt says which is which

`refusals[]` records paths excluded **by declared policy**, each with its named
reason. A **named refusal** ends the op: no receipt at all, because a receipt
that silently dropped an unreadable or escaping entry would attest to a tree it
never saw.

Declared exclusions: `node_modules/` (dependency tree), `.git/` (VCS metadata),
and `MANIFEST.json` — the mine's own inventory. That last one is a self-reference
guard: a mine's manifest lists its own file hashes and (in any maintained mine)
its root hash, so hashing it would make the receipt a function of the very
document the receipt replaces. The pinned synthetic mine excludes itself for
exactly this reason — its manifest lists 42 files and `MANIFEST.json` is not
among them.

## The named refusals

Every refusal is DATA (D-379 refusal-as-data): an `ok: true` result carrying
`{refused: true, error: "REFUSED", op, rule, detail}`.

| rule | the failure |
|---|---|
| `CAPTURE_MALFORMED_INPUT` | the payload is not `{mineRoot, mineId}` (or carries unknown fields) |
| `CAPTURE_MINE_ID_MALFORMED` | `mineId` is not `<repo>@<7-64 hex>` |
| `CAPTURE_MINE_ROOT_MISSING` | the declared root is absent, unresolvable, or not a directory |
| `CAPTURE_LAW_REFUSED` | the in-handler law self-check refused (forbidden principal, or no consent for this principal) |
| `CAPTURE_PATH_ESCAPE` | an entry resolves OUTSIDE the declared mine root |
| `CAPTURE_UNREADABLE_FILE` | an entry cannot be resolved, stat-ed, or read |
| `CAPTURE_EMPTY_MINE` | zero admitted files — a receipt for nothing attests to nothing |
| `CAPTURE_MINE_PIN_MISMATCH` | the pinned digest disagrees with the computed root hash |
| `CAPTURE_LEDGER_REFUSED` | the receipt row was refused, or did not read back byte-identical |

The validation order is itself policy — structure, identity, existence, law,
first byte, pin, ledger — so every refusal leaves the mine tree exactly as it
found it and leaves no receipt row behind. The refusal suite asserts that
property on a before/after snapshot of the tree for every filesystem-shaped case.

## Consent is part of the class, not a detail

`forge.mine.capture@1` is EXTERNAL_MUTATION, so `LAW_POLICY_V1` classifies it
`require-consent` (the fail-closed default) and the host gates it through
`law.check@1` **before the handler runs**. The ceremony is two grants for two
principals: the caller's (to pass the gate) and `forge.mine.capture`'s own (its
in-handler self-check runs before the first read). The read is the plugin's act,
so it consents under its own principal — a caller consenting on the plugin's
behalf would be a consent nobody gave. Both halves are proven in
`test/refusal/capture-refusals.test.ts`.

## The receipt's fields

| field | meaning |
|---|---|
| `schemaVersion` | literal `"1"` |
| `op` | literal `"forge.mine.capture@1"` |
| `mineId` | the pinned id the caller declared (its digest == `rootHash`) |
| `mineRoot` | the **resolved** root, so every `files[].path` resolves against it |
| `capturedAt` | UTC ISO instant of the read (the one moving field; replay ignores it) |
| `fileCount` | number of admitted files |
| `rootHash` | `sha256:` over the ordered `path:hexHash` list |
| `files[]` | `{path, hash, bytes, casRef}` — `bytes` is the length of the HASHED (normalised) bytes |
| `refusals[]` | `{path, reason}` for every path excluded by declared policy |

`casRef` is `cas:<hash>` — a **pure function of the content**. That is deliberate:
D-409's SF2 (CAS blobs vs rows, incremental hashing budget) is still OPEN, so the
receipt must not encode a storage decision. Because the address does not depend
on where the bytes live, SF2 can land without re-capturing any mine; the receipts
already written stay valid.

The receipt row id is `mine:<repo-slug>/<rootHash>` — stable in the mine's
CONTENT, so re-capturing an unchanged mine is an idempotent upsert of the same
row, not an ever-growing pile.

## Run it

```bash
bun test plugins/forge-mine-capture   # the falsifier + every named refusal
bun run omega:quick                    # the gate (hostLoc must stay 1500)
```

The falsifier compares the receipt, file for file, against the mine's own
`MANIFEST.json` — hashes the mine computed for itself. The capture never reads
`MANIFEST.json`; `MANIFEST.json` never mentions this plugin. If they disagree,
one of them is wrong.
