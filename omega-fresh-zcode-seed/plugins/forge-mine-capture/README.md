# forge.mine.capture — the capture seam (D-409)

Class 3 / **EXTERNAL_MUTATION** Forge plugin: `forge.mine.capture@1`, the ONE
filesystem seam in the forge surface. It walks a declared, pinned legacy mine,
hashes every admitted file, and emits a `CaptureReceipt@1` (the shape
`pack.builder` freezes) plus the append-only proposal rows that carry it — the
receipt itself, and one CAS blob row per distinct content address so every
`casRef` it cites resolves to bytes.

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
7. Appends one CAS blob row per distinct `casRef` to vault ns `proposal` and
   reads them all back in bounded batches.
8. Appends the receipt row and reads it back. An unsynced write — of a blob or
   of the receipt — is refused, never returned.

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
| `CAPTURE_LEDGER_REFUSED` | a governed row was refused or did not read back byte-identical — a CAS blob row (`cas:<sha256hex>`) or the receipt row (`mine:<repo>/<rootHash>`); the detail names which |

The validation order is itself policy — structure, identity, existence, law,
first byte, pin, ledger — so every refusal leaves the mine tree exactly as it
found it and leaves no receipt row behind. The refusal suite asserts that
property on a before/after snapshot of the tree for every filesystem-shaped case.

## The CAS rows — where a `casRef`'s bytes live (D-409 SF2, decided by D-TEAM-023)

The receipt cites `cas:<hash>` on every file row. Until SF2 landed that address
had **no store behind it**: the walk read, hashed and pushed `{path, hash, bytes,
casRef}` and dropped the bytes, and the op's only mutation was the receipt
append. Any consumer resolving those addresses would have found nothing on every
real file.

The producer half now lives here, in the seam SF2 was assigned to:

- **id** — the receipt's own `casRef`, verbatim (`cas:<sha256hex>`). The address
  a receipt cites *is* the address the blob lives at, so there is no second
  naming scheme to drift.
- **namespace** — `proposal`, the same one the receipt uses. No new namespace is
  invented, so SF1 stays un-retired exactly as D-409 left it.
- **payload** — `{schemaVersion, op, casRef, hash, bytes, encoding: "base64", data}`,
  where `data` is base64 of the **normalised** bytes: the exact buffer
  `fileHashAndBytes` hashed and counted, never the raw on-disk bytes. That is
  load-bearing on a CRLF checkout — raw bytes would not re-hash to the receipt's
  own hash, and every consumer's verification would fail on every CRLF file while
  presenting as a consumer bug.
- **shape** — one row per **distinct** `casRef`, in receipt-path order. Two
  byte-identical files in one mine share one row; that is what content addressing
  means.
- **order** — the blobs are appended *before* the receipt, and every one is read
  back (bounded `vault.getmany@1` batches, `GET_MANY_BOUND` = 512) before the
  receipt is returned. **No receipt is emitted for a snapshot that is not fully
  materialised.** Orphan blob rows are inert: nothing cites them except a
  receipt, and a receipt is only returned once its blobs verified.

**Recorded, not solved — the incremental-hashing budget.** A re-capture of an
unchanged mine still *reads and re-hashes every file*: the walk is the evidence,
and skipping it would make the receipt a claim rather than a measurement. Only
the **writes** dedupe, because the row id is the content address and append is
latest-wins per id. A path+mtime+size cache is a separate decision with its own
evidence.

**Measured cost, and what the budget actually is.** The pinned 42-file mine now
issues 41 blob appends plus the receipt append, and every vault append is
TWO-PHASE with fsyncs (`changelog.ts` two-phase append + a blob fsync in
`cas.ts`) — on the order of 120 fsyncs for one capture on Windows. Measured
~1.2 s on a fresh vault and over 5 s on one that has already absorbed several
captures. That is I/O wait, not CPU: `runtime.budget.cpuMs` is left at **4000**
because it is the honest number for the CPU this op spends, and because nothing
in `host/src` reads it anyway — only `maxConcurrentCalls` is enforced
(`ports.ts:315`). The bound that actually fires is the **caller's**
`deadlineMs`, default 5000 (`ports.ts:438`), which the suites now declare
explicitly (`CAPTURE_DEADLINE_MS = 60_000` in both `test/boot.ts` files). A
caller asking for a whole-mine capture has to say what that costs.

`vault.compact@1` has no id-prefix logic, so it treats these rows as ordinary
objects. Base64 inflates each payload ~33%, which is the accepted cost of
storing bytes inside a ledger that already content-addresses them.

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

`casRef` is `cas:<hash>` — a **pure function of the content**, and still so. That
was deliberate while D-409's SF2 (CAS blobs vs rows, incremental hashing budget)
was OPEN: the receipt had to be free of any storage decision, so SF2 could land
without re-capturing a single mine. SF2 has since been decided (D-TEAM-023) and
is implemented here — see *The CAS rows* above — but the discipline it was built
for still holds: the receipt encodes **no** storage decision, it cites an
address, and the address happens to be where the bytes are.

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
