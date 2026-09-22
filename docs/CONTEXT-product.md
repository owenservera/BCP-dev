# CONTEXT — Product: experiments, baselines, what got built, honest assessment, next steps

Written 2026-09-22 by the master agent. Companion: `CONTEXT-system.md` (the
machine). Scale numbers marked [verified] were counted today; [doc-claimed]
come from prior docs and were not re-proven. The long-horizon objective is
currently ON HOLD per owner — §6 lists the decision points, nothing is pre-decided.

---

## 1. Source trees (what everything builds on or from)

| Tree | What it is | Scale |
|---|---|---|
| `omega-baseline/omega-final` | Landing forge: the **product target** (fresh core, Chrome-canonical). Structured repo (build/, contracts/, genome/, surfaces/, tooling/, testkit/, docs/forge/, AGENTS.md referencing `omega:gate`) | Large structured forge [verified by listing]; "32 layers / 161 decisions / gate-green" [doc-claimed] |
| `vivim-original-baseline/vivim-final-enhanced` | Legacy monolith: adapter seam + import source + NLCL mine. Never modified by BCP work (read-only mine / assay input) | `src/` **1051 files** [verified]; `src/intel/nlcl` **59 files** [verified — matches the assay]; `src/engines` 32 top-level dirs [verified; "186 engines" doc-claimed]; prisma `model` blocks ≈400 across 3 schema files (200+90+111) [verified — docs say "201 models → ~16 namespaces"; reconcile at Path-C start] |
| `bcp-speed/bcp/work/` | Lane scratch (gitignored by design): the actual new builds | AGT-a1 (07.1–07.4), AGT-b1 (08.1–08.3), AGT-b2 (08.4) [verified, §3] |

## 2. Experiments (full-context gin: `docs/EXPERIMENTAL-PATHS.md`)

| Exp | Path | Scope | Target | Status | Story |
|---|---|---|---|---|---|
| 001 | Bootstrap seed | — | L2 | abandoned | Retired placeholder; superseded by 002/003 |
| 002 | Omega Landing — hold the gate green | 22 caps (FAM-01..06) | L3 | proposed | Tracks the landing forge. Untouched — no leases ever |
| 003 | Vivim Prototype — migration loop | 18 caps (FAM-10..14) | L2 | proposed | Tracks the prototype app. Untouched — no leases ever |
| 004 | Path A — Chrome Skeleton W5 | 07.1–07.4 | L2 | **merging** | L0→L1 chain then weakest-first L2, all externally verified. Chain: realization row → vertical slice → law gate → ledger+query |
| 005 | Path B — Intent Fabric | 08.1–08.4 | L2 | **merging** | IR → classifier → resolution→law→op-plan + independent NLCL assay, all externally verified |
| 006 | Path C — Strangler Airlock | 09.1 (+10.1/10.2/10.3/11.1/13.1 as L2 context) | L2 | proposed, **gate released, never started** | Entry: `FAM-09.1` L1 (model→namespace map + count probe), then adapter L1→L2. Sunset clause: adapter dies at Chrome-canonical |

Kill lines (coordinator calls): A red → freeze B/C scope growth · B red → intent
stays adapter-only · C red (bridge costs > fresh) → cut parity, keep airlock.
Institutional memory: **21 discoveries, 1 failure** on record (FAIL-001: don't
assay `src/engines/nlcl` shims as language — ~30 re-export stubs).

## 3. Product built so far (all on disk, all externally verified from outside the builders' processes)

**Path A — Chrome turn slice (AGT-a1):** realization row + handler + stream config
(stamped `realization:message.send:provider.browser`, attach-only) · kernel slice
with fail-closed error paths · 20-row adversarial refusal battery (every refusal
ledgered + replays via 07.4 query) · headless ledger query CLI (refusals queryable
as ordinary events with code+sentence+why+evidence). Fixture turn: 5 chunks seq
0–4, exactly-one-final, terminating result + receipt file. Live mode: honest
`NO_LIVE_CHROME` refusal, zero faked liveness. 8 suites green externally.

**Path B — deterministic NL plane (AGT-b1 + AGT-b2):** typed versioned Intent IR
(schema-conformance validator, round-trip identical, 10 golden intents) ·
classifier + lexicon (unicode/bare-enum/folder-cue/normalization hardening,
adversarial 23/23) · resolution → law/consent → op plan (63-row map: 2 direct +
61 clarify-with-basis, closed-3 intact, hash recipe runtime-identical B1==B2,
consent-fuzz + injection batteries green) · NLCL assay (63 deterministic intents
re-expressed IR-ready, 12-file tail exactly gated, confirmation gate 8/8, assay
4/4, 59/59 files ledgered). Cross-lane handoff proven at runtime (byte-identical
hashes). Includes one real safety repair found by external verification
(classifier rebinding `LAWFUL_OPS` → local `RECOGNIZED_OPS` + regression lock).

**Path C — airlock:** nothing built. Entry lease `FAM-09.1` free at L0.

## 4. Honest assessment (what "merging" does and doesn't mean)

1. **Fixture-proven, not live-proven.** Every L2 was earned against recorded
   fixtures with an explicit honest-refusal where live Chrome was needed. The
   constitution has never carried a LIVE turn; the 07.1 live page-send wiring
   (the "days, not weeks" leg) was estimated, never executed. This is the
   single largest truth-gap on the board.
2. **Merging ≠ integrated.** Sweep flipped 004/005 on depth math (all in-scope
   at target). No A+B integration has ever run; their interface is proven only
   pairwise (hashes, IR conformance).
3. **One handshake is verbal, not logged.** DISC-009/010 say b1 consumed the b2
   ledger for 08.3, but b1's formal consumption word was never logged — owed.
4. **Automation is acceptance-proven piecemeal, never stressed.** MCP, serve,
   supervise, ralph each passed isolated proofs; no live lane has run under the
   full stack. First live cycle is the real test.
5. **Dangling done_whens.** A's done_when includes "omega:gate green at tip" —
   never checked. C's scope cites "201 models" vs ≈400 `model` blocks counted
   across split schemas — reconcile before the map is drawn.
6. **002/003 are pure tracking shells.** 40 caps, zero activity. Fine — but they
   should not be mistaken for progress.

## 5. The final product, stated plainly

Today the project owns: a **fixture-proven Chrome turn pipeline** (realization →
law gate → ledger → headless query) + a **deterministic NL control plane**
(intent IR → gated perception → law/consent resolution → op plan) fed by a
**fully ledgered 59-file assay** — all running offline-capable in stdlib Python,
all verified from outside the builders' processes — plus the **automation to run
itself** (leases, timers, triage, serve control, watchdog, idle resume). What it
does NOT yet own: any live-Chrome proof, any consumer bridge, any integration
of A with B.

## 6. Next-step options (decide, don't drift)

- **A. Live turn first** (kills the biggest truth-gap; unblocks C's
  capture-vs-fixture proof): W1 on owner Chrome session, 07.1 live wiring.
  Needs owner debug-port session. Risk: days-estimate was a guess.
- **B. Airlock first** (only consumer value; parallelizable): spawn W4, `09.1`
  map + count probe. Needs prisma-count reconciliation first. Risks: God-Adapter,
  parity tar pit — sunset clause + 3–5 cap are the guards.
- **C. Automation shakedown** (rides along with A or B, not standalone): first
  live cycle under MCP + serve + supervise + ralph; observe one idle-resume.
- **D. Truthfulness cleanup** (cheap, anytime): log b1's consumption word;
  check-or-defer `omega:gate`; reconcile model counts. No lanes needed.
- **E. Hold** (current stance): board parked, timers keep it safe, decide later.

Resume mechanics when any option is picked: `ops-install.ps1` → start BCP-Serve
→ lanes by inbox with `BCP_LANE_CAP`/`BCP_AGENT` set → heartbeat sweeps
(`CONTEXT-system.md` §5/§8). Kill lines in §2 stay binding throughout.
