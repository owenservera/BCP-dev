# Local-Machine Team Toolset — Cross-CFA Synthesis (Setup Plan)

> Date: 2026-09-28 · Owner: `architecture-steward` (central synthesis; derived reconciliation layer)
> Status: **PROPOSED** — not Ω law, not implementation authorization, not owner policy, not a shared-boundary activation.
> Mode: DELIBERATE. Base ref: `53e0cfb3f4a881b9589d234ce71427c55b0d8c1e` (current main HEAD at synthesis).
> Method: steward-read of all 10 wave-1 `TOOLSET-TOP10-20260928.md` artifacts (INDEPENDENT units, zero peer I/O between them).
> Authority note: DEMAND counts are OBSERVED (who ranked what); SCORES and PHASES are Steward-DERIVED proposal for owner decision. No CFA semantic authority is overridden; per-domain unknowns stay owned by their CFAs.

## Scoring rubric (applied uniformly in M2)

| Dimension | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| DEMAND (distinct CFAs ranking it) | — | 1 CFA | 2–3 CFAs | 4+ CFAs |
| LEVERAGE (blast radius of absence) | nice-to-have | helps one domain | multiplies team speed or honesty | team cannot run safely/efficiently without it |
| READINESS (what setup takes) | blocked / owner-decision pending | small build or probe needed | convention / extension of existing substrate | present — verify-and-adopt only |
| RISK-REDUCTION (governance/safety) | none | auditability aid | bounds a failure class | load-bearing fence or gate |

Total /12. Phase: **NOW** (do first — high score + ready), **NEXT** (needs extension, probe, or gate decision), **LATER** (blocked, deferred, or justified-build with prerequisites).

## All 100 ranked rows (compact — full rows live in the linked artifacts)

| CFA | #1 pick | #2–#10 (titles) | Artifact |
|---|---|---|---|
| CFA-01 World/Context | Repo search stack | Context assembler (D-443) · five-state resolver · fs/process observer · correspondence crosswalk · projection replay · basis recorder · relationship view · epistemic query · scoped-view filter | `SUBAGENTS/WORLD-ONTOLOGY-CONTEXT/TOOLSET-TOP10-20260928.md` |
| CFA-02 Data | Git worktree + ref ops | Receipt validator · export-verify round-trip · scoped query · migration diff · parser-pin replay · freshness checker · identity-collision audit · checkpoint discipline · dossier assembler | `SUBAGENTS/DATA-MODEL-STEWARD/TOOLSET-TOP10-20260928.md` |
| CFA-03 Continuity | NCLL interpreter CLI | Grounding checker · Intent canonicalizer · cross-plane tracer · basis capture · replay fixtures · CANON manager · explainer · round-trip validator · divergence monitor | `SUBAGENTS/SELF-KNOWLEDGE-COMMAND-COMPILER/TOOLSET-TOP10-20260928.md` |
| CFA-04 Authority | OS sandbox + envelopes | Consent ledger · per-attempt gate · audit log · secret custody · identity/rotation · revocation/kill-switch · receipt gate · delegation tracker · escalation contract | `SUBAGENTS/AUTHORITY-GOVERNANCE/TOOLSET-TOP10-20260928.md` |
| CFA-05 Work | Durable Work queue | Bounded runner · attempt ledger · receipt+validator · retry supervisor · crash harness · parallel dispatch · wait/suspend/resume · idempotency · human-gate+Outcome | `SUBAGENTS/AGENCY-WORK-EXECUTION/TOOLSET-TOP10-20260928.md` |
| CFA-06 Provider | Chrome/CDP substrate | gh · git · scoped shell · bun/node+test · fetch/search · ProviderRealization reads · credential spine · routing recorder · drift kit | `SUBAGENTS/CAPABILITY-PROVIDER-REALIZATION/TOOLSET-TOP10-20260928.md` |
| CFA-07 Forge | Scoped shell + runner | bun/node · git · gh · opencode+leaves · Manifest/Recipe+generator · Builder Pack · forge-surface gate · receipt validation · survivor harness (TO BUILD) | `SUBAGENTS/COMPOSITION-PLUGIN-FORGE/TOOLSET-TOP10-20260928.md` |
| CFA-08 Surfaces | Playwright harness | Screenshots · a11y extractor · surface inspector · event recorder · UIA probe · toast probe · render server · team-view · parity runner | `SUBAGENTS/EXPERIENCE-INTERACTION-SURFACES/TOOLSET-TOP10-20260928.md` |
| CFA-09 Evolution | Receipt validator (C1–C9) | git+gh discipline · change-record evaluator · compat-matrix evaluator · impact lens · vault dry-run · lifecycle conformance · fault-injection · diagnostics bundle · substrate bundle | `SUBAGENTS/EVOLUTION-COMPATIBILITY-SELF-MAINTENANCE/TOOLSET-TOP10-20260928.md` |
| CFA-10 Runtime | OS sandbox | Launcher gate · precedence probe · spawn validator · B1 gate · manifest verifier · activation drills · egress monitor · quota fence · completion tooling | `SUBAGENTS/RUNTIME-CONSTITUTION-CORE-SUBSTRATE/TOOLSET-TOP10-20260928.md` |

## Canonical union — 38 tools in 6 themes (dedupe of the 100 rows)

Same tool named by several CFAs is listed once; demand column counts distinct CFA rankers.

### Theme A — Machine substrate (run things)

| ID | Canonical tool | Demanded by | Demand |
|---|---|---|---|
| A1 | Scoped local shell + work-runner envelopes | CFA-05, CFA-06, CFA-07 | 3 |
| A2 | bun/node runtime + test harness (verified present: bun 1.3.14, node v24.11.1) | CFA-06, CFA-07, CFA-09 | 3 |
| A3 | git + gh + worktree discipline (verified: git 2.51.2, gh 2.83.2) | CFA-02, CFA-06, CFA-07, CFA-09 | 4 |
| A4 | opencode 1.18.4 + work-* leaf dispatch | CFA-05, CFA-07, CFA-09 | 3 |
| A5 | Attach-only Chrome/CDP realization substrate | CFA-06 | 1 |
| A6 | Playwright + Chromium automation harness | CFA-08 | 1 |
| A7 | Web fetch/search substrate (mcp-web shape) | CFA-06 | 1 |
| A8 | Windows UIA desktop probe + toast delivery probe (read-first, allowlisted) | CFA-08 | 1 |

### Theme B — Govern it (authority / runtime fences)

| ID | Canonical tool | Demanded by | Demand |
|---|---|---|---|
| B1 | OS process sandbox + execution envelopes | CFA-04, CFA-10 | 2 |
| B2 | Per-attempt authority gate (live re-resolution) + human-gate suspend/resume | CFA-04, CFA-05 | 2 |
| B3 | Bounded standing / consent ledger | CFA-04 | 1 |
| B4 | Delegation-chain tracker with attenuation | CFA-04 | 1 |
| B5 | Secret custody + credential-reference spine + transport redaction | CFA-04, CFA-06 | 2 |
| B6 | Identity/key custody + rotation + recovery ceremony (drill currently BLOCKED) | CFA-04 | 1 |
| B7 | Revocation/fencing + per-agent kill-switch (+ token egress monitor) | CFA-04, CFA-10 | 2 |
| B8 | Append-only audit log + attempt ledger | CFA-04, CFA-05 | 2 |
| B9 | Escalation / attention surface contract | CFA-04, CFA-08 | 2 |
| B10 | Exact-agent launcher gate + permission-precedence probe + spawn allowlist validator | CFA-10 | 1 |
| B11 | Resource quota + exhaustion fence | CFA-10 | 1 |
| B12 | B1 entry-confinement gate + signed-manifest verifier | CFA-10 | 1 |

### Theme C — Prove it (verification / evidence)

| ID | Canonical tool | Demanded by | Demand |
|---|---|---|---|
| C1 | Receipt validator + Durable Completion Gate discipline | CFA-02, CFA-04, CFA-05, CFA-07, CFA-09, CFA-10 | **6 — highest consensus** |
| C2 | Repo search stack (ripgrep-class + glob + bounded read) | CFA-01, CFA-09 | 2 |
| C3 | Dossier / evidence-bundle assembler | CFA-02, CFA-09 | 2 |
| C4 | Divergence monitor + Commons team-view surface | CFA-03, CFA-08 | 2 |

### Theme D — Know it (data / world / freshness)

| ID | Canonical tool | Demanded by | Demand |
|---|---|---|---|
| D1 | Bounded context assembler (D-443 reuse, never reimplement) | CFA-01 | 1 |
| D2 | Five-state reference resolver + explanation-preserving query | CFA-01 | 1 |
| D3 | Filesystem/process observer + basis/freshness recorder | CFA-01, CFA-02 | 2 |
| D4 | Correspondence crosswalk + identity-collision audit | CFA-01, CFA-02 | 2 |
| D5 | Deterministic projection / replay harness | CFA-01, CFA-03 | 2 |
| D6 | Scoped query over durable state + relationship-assertion view | CFA-01, CFA-02 | 2 |
| D7 | Export-verify round-trip + vault migration dry-run | CFA-02, CFA-09 | 2 |
| D8 | Schema/migration diff + lineage-preserving harness | CFA-02 | 1 |
| D9 | Parser-pin + deterministic replay rig | CFA-02 | 1 |
| D10 | Backup / checkpoint / rollback discipline (working tree) | CFA-02 | 1 |

### Theme E — Mean it (semantic continuity)

| ID | Canonical tool | Demanded by | Demand |
|---|---|---|---|
| E1 | Deterministic command interpreter CLI (wrap NCLL, never fork) | CFA-03 | 1 |
| E2 | Grounding checker with freshness states | CFA-03 | 1 |
| E3 | Intent canonicalizer (D-411 seam) | CFA-03 | 1 |
| E4 | Cross-plane continuity tracer | CFA-03 | 1 |
| E5 | Evidence/basis capture CLI (overlaps D3/C3 — one implementation, three consumers) | CFA-03 | 1 |
| E6 | CANON terminology manager (bounded, lint-only) | CFA-03 | 1 |
| E7 | Self-description explainer | CFA-03 | 1 |
| E8 | Representation round-trip validator + surface-state inspector | CFA-03, CFA-08 | 2 |

### Theme F — Change it safely (work / evolution / forge / surface)

| ID | Canonical tool | Demanded by | Demand |
|---|---|---|---|
| F1 | Durable Work queue (TASKS.md discipline + master router) | CFA-05 | 1 |
| F2 | Retry/backoff/quarantine supervisor + wait/suspend/resume machinery | CFA-05 | 1 |
| F3 | Crash-window / fault-injection / activation-drill harness | CFA-05, CFA-09, CFA-10 | 3 |
| F4 | Idempotency-key + effect-identity discipline | CFA-05 | 1 |
| F5 | Change-record + dimensioned compat-matrix evaluators | CFA-09 | 1 |
| F6 | Quarantine / promotion / rollback conformance suite | CFA-09 | 1 |
| F7 | Forge substrate, run-verified locally (Manifest/Recipe+generator · Builder Pack · forge-surface gate) | CFA-07 | 1 |
| F8 | Composition-replacement survivor falsifier harness — **TO BUILD** (needs CFA-06 trace + M1 design first) | CFA-07 | 1 |
| F9 | Routing-policy record + decision recorder (+ ProviderRealization read path) | CFA-06 | 1 |
| F10 | Provider drift/healing observation kit | CFA-06 | 1 |
| F11 | Surface fixture tools (screenshot diff · a11y extractor · event recorder) | CFA-08 | 1 |
| F12 | Fixture-render server + parity/drift probe runner | CFA-08 | 1 |

## M1 — Theme × CFA demand matrix (● = ranked it; steward-derived mapping)

| Theme | 01 | 02 | 03 | 04 | 05 | 06 | 07 | 08 | 09 | 10 | CFAs |
|---|---|---|---|---|---|---|---|---|---|---|---|
| A Machine substrate | · | ● | · | · | ● | ● | ● | ● | ● | · | 6 |
| B Govern it | · | · | · | ● | ● | ● | · | ● | · | ● | 5 |
| C Prove it | ● | ● | ● | ● | ● | · | ● | ● | ● | ● | 9 |
| D Know it | ● | ● | ● | · | · | · | · | · | ● | · | 4 |
| E Mean it | · | · | ● | · | · | · | · | ● | · | · | 2 |
| F Change safely | · | · | · | · | ● | ● | ● | ● | ● | ● | 6 |

Read: verification/evidence (C) is the near-universal demand (9/10 — only CFA-06's realization-first list skips it); semantic tooling (E) is single-owner (CFA-03 + one CFA-08 share); everything else is genuinely cross-cutting.

## M2 — Score matrix (Steward-DERIVED proposal; totals /12)

| ID | Tool (short) | DEM | LEV | RDY | RSK | Total | Phase |
|---|---|---|---|---|---|---|---|
| C1 | Receipt validator + completion gate | 3 | 3 | 3 | 3 | **12** | NOW |
| A3 | git + gh + worktree discipline | 3 | 3 | 3 | 2 | **11** | NOW |
| A1 | Scoped shell + runner envelopes | 3 | 3 | 2 | 2 | **10** | NOW |
| B5 | Secret custody + redaction | 2 | 3 | 2 | 3 | **10** | NOW |
| F3 | Crash / fault-injection harness | 3 | 3 | 1 | 3 | **10** | NEXT |
| A2 | bun/node + test harness | 3 | 2 | 3 | 1 | **9** | NOW |
| A4 | opencode + work-* dispatch | 3 | 2 | 3 | 1 | **9** | NOW |
| B8 | Audit log + attempt ledger | 2 | 2 | 2 | 3 | **9** | NOW |
| F1 | Durable Work queue | 1 | 3 | 3 | 2 | **9** | NOW |
| B7 | Revocation + kill-switch | 2 | 3 | 1 | 3 | **9** | NEXT |
| B1 | OS sandbox + envelopes | 2 | 3 | 1 | 3 | **9** | NEXT (interim envelopes NOW) |
| C2 | Repo search stack | 2 | 2 | 3 | 1 | **8** | NOW |
| C3 | Dossier / evidence bundle | 2 | 2 | 2 | 2 | **8** | NOW |
| D3 | Observer + freshness recorder | 2 | 2 | 2 | 2 | **8** | NOW |
| D4 | Correspondence + collision audit | 2 | 2 | 2 | 2 | **8** | NOW |
| D7 | Export-verify + migration dry-run | 2 | 2 | 2 | 2 | **8** | NEXT (restore gated to M4) |
| D10 | Checkpoint / rollback discipline | 1 | 2 | 3 | 2 | **8** | NOW |
| B2 | Per-attempt gate (+ human gate) | 2 | 3 | 1 | 3 | **8** | NEXT (procedural form NOW) |
| B10 | Launcher / precedence / allowlist checks | 1 | 3 | 1 | 3 | **8** | NOW procedural · mechanical LATER |
| D6 | Scoped query + relationship view | 2 | 2 | 2 | 1 | **7** | NOW |
| D1 | Context assembler (D-443 policy) | 1 | 2 | 2 | 2 | **7** | NOW |
| D5 | Projection replay harness | 2 | 2 | 1 | 2 | **7** | NEXT |
| C4 | Divergence monitor + team-view | 2 | 1 | 2 | 2 | **7** | NOW |
| F2 | Retry/quarantine + wait/resume | 1 | 3 | 1 | 3 | **7** | NEXT |
| F4 | Idempotency discipline | 1 | 3 | 1 | 2 | **7** | NEXT |
| B3 | Consent / standing ledger | 1 | 2 | 2 | 2 | **7** | NOW |
| B6 | Identity rotation + recovery drill | 1 | 3 | 0 | 3 | **7** | NEXT (unblock drill first) |
| B9 | Escalation contract | 2 | 2 | 1 | 2 | **7** | NEXT |
| E1 | NCLL interpreter CLI | 1 | 2 | 2 | 1 | **6** | NOW |
| E3 | Intent canonicalizer | 1 | 2 | 2 | 1 | **6** | NOW |
| E6 | CANON manager | 1 | 1 | 2 | 1 | **5** | NOW |
| E2 | Grounding checker | 1 | 2 | 1 | 2 | **6** | NEXT |
| E5 | Basis capture CLI | 1 | 2 | 1 | 2 | **6** | NEXT |
| F5 | Change-record + compat evaluators | 1 | 2 | 1 | 2 | **6** | NEXT |
| F6 | Lifecycle conformance suite | 1 | 2 | 1 | 2 | **6** | NEXT |
| F7 | Forge substrate (run-verify) | 1 | 2 | 2 | 1 | **6** | NOW |
| F9 | Routing recorder (+ record reads) | 1 | 2 | 1 | 2 | **6** | NEXT |
| A5 | Chrome/CDP substrate | 1 | 2 | 2 | 1 | **6** | NOW (gated use) |
| D2 | Five-state resolver + epistemic query | 1 | 2 | 1 | 2 | **6** | NEXT |
| F8 | Survivor falsifier harness (BUILD) | 1 | 3 | 0 | 2 | **6** | LATER (needs trace + M1) |
| D8 | Migration diff harness | 1 | 2 | 1 | 2 | **6** | NEXT (post-M4) |
| D9 | Parser-pin replay rig | 1 | 1 | 2 | 1 | **5** | NEXT |
| E4 | Cross-plane tracer | 1 | 2 | 1 | 1 | **5** | NEXT |
| E8 | Round-trip validator + inspector | 2 | 1 | 1 | 1 | **5** | NEXT |
| A6 | Playwright harness | 1 | 2 | 1 | 1 | **5** | NOW |
| B11 | Resource quota fence | 1 | 2 | 1 | 2 | **6** | NEXT |
| B12 | B1 gate + manifest verifier | 1 | 2 | 0 | 2 | **5** | LATER (runtime-blocked) |
| B4 | Delegation tracker | 1 | 2 | 1 | 2 | **6** | NEXT |
| A7 | Fetch/search substrate | 1 | 1 | 1 | 1 | **4** | NOW |
| A8 | UIA + toast probes | 1 | 1 | 1 | 1 | **4** | NEXT (read-first probe) |
| F10 | Drift/healing kit | 1 | 1 | 1 | 1 | **4** | NEXT |
| F11 | Surface fixture tools | 1 | 1 | 1 | 1 | **4** | NOW |
| F12 | Render server + parity runner | 1 | 1 | 1 | 1 | **4** | NOW |
| E7 | Self-description explainer | 1 | 1 | 1 | 1 | **4** | LATER |

## M3 — Phased setup plan (proposal)

### Phase NOW — verify-and-adopt (no builds, no gates beyond existing ones)
1. **C1** — run the receipt validator on every substantive session close (pre-commit expect C8 FAIL, post-commit full PASS). Owner: Steward. Already exists.
2. **A3** — pin git/gh/worktree conventions (no merge-to-read, exact SHAs, short-lived branches, no force-push). Owners: all.
3. **A1/A2/A4** — pin the execution substrate (scoped-shell envelopes, bun/node versions, opencode + leaf discipline) per SETUP-REQUIREMENTS. Owners: CFA-05/CFA-07/CFA-10.
4. **F1/B8/D10** — Work-queue + ledger + checkpoint discipline as team convention. Owner: CFA-05 (Work), CFA-02 (lineage).
5. **B5/B3** — secret redaction at transport boundaries + standing-grant ledger files. Owner: CFA-04.
6. **B10-procedural** — launcher fallback-check + spawn-allowlist grep as checklist items (mechanical form stays LATER). Owner: CFA-10.
7. **C2/C3/C4/D1/D3/D4/D6** — observation and evidence conventions (search envelope, dossier template, context-assembly policy, observer log, correspondence table, scoped query, team-view cadence). Owners: CFA-01/CFA-02/CFA-03/CFA-08.
8. **E1/E3/E6/F7/A5/A6/A7/F11/F12** — wrap-and-run existing substrates (NCLL CLI, Intent seam, CANON lint, Forge suites green-check, attach-only Chrome with CFA-04 gate, Playwright install, fetch wrapper, surface fixtures, render server, parity runner). Owners: CFA-03/CFA-07/CFA-06/CFA-08.

### Phase NEXT — small extensions, probes, and gate decisions (each needs CFA-04 gate + CFA-09 envelope where marked *)
9. **B1*** — select and wire the OS sandbox mechanism (owner decision required); interim: envelope discipline everywhere. Owners: CFA-10 (seam), CFA-04 (what it decides).
10. **B2*/B7*/B9** — per-attempt gate (procedural now), revocation/kill-switch drill, escalation contract with autonomy radius. Owner: CFA-04.
11. **B6** — unblock the identity rotation/recovery drill. Owner: CFA-04.
12. **F3*/F2/F4** — crash/fault-injection harness, retry/quarantine + wait policy, idempotency keys before consequential use. Owners: CFA-05/CFA-09/CFA-10/CFA-06.
13. **D5/D2/D7/D8/E2/E5/E4** — replay harnesses, resolver+query envelope, export round-trips (restore stays M4-gated), migration diff, grounding checker, basis capture, cross-plane tracer. Owners: CFA-01/CFA-02/CFA-03.
14. **F5/F6/F9/B4/B11** — change-record + compat evaluators, lifecycle conformance, routing recorder (blocked on CFA-02 join + CFA-04 protocol), delegation tracker, quota fence. Owners: CFA-09/CFA-06/CFA-04.
15. **A8/F10/E8/D9** — UIA/toast probes (read-first), drift kit, round-trip validator, parser replay. Owners: CFA-08/CFA-06/CFA-03/CFA-02.

### Phase LATER — blocked or justified-build
16. **F8** — survivor falsifier harness: justified build, prerequisites = one CFA-06 replacement trace + M1 identity design. Owner: CFA-07.
17. **B12** — B1 mechanism + manifest verifier: needs real checkout + Bun runtime (BLOCKED-HOSTED-RUNTIME). Owner: CFA-10.
18. **E7** — self-description explainer: after tracer + CANON mature. Owner: CFA-03.
19. **B10-mechanical** — name-scoped permission wiring when a supporting opencode version lands. Owners: CFA-10/CFA-04.

## Tensions and contradictions (preserved, not papered over)

1. **Speed vs verification.** CFA-05/CFA-07 want parallel dispatch and fast local Forge iteration; CFA-04/CFA-09/CFA-10 require gates that slow both. Synthesis position (proposal): gates stay in the loop (C1), speed lives inside envelopes — never by skipping verification.
2. **Validator path alias.** Contract text cites `tools/Validate-Receipt.ps1`; the file lives at `AGENTS_CONTEXT/ARCHITECTURE_STEWARD/tools/Validate-Receipt.ps1` (CFA-04/CFA-09 flagged; CFA-10 observed absence at root). Recommend the Steward correct the alias centrally — no CFA action.
3. **Procedural vs mechanical.** CFA-04/CFA-10 agree: nothing here enforces unbypassably except spawn depth + per-tool grants (provisional). Every "gate" below B1-mechanical is a documented, receipt-checked procedure. The plan never claims otherwise.
4. **One implementation, many consumers.** Basis capture (E5/D3/C3), freshness vocabulary (D3/D7), ledger shapes (B8/F1) recur across lenses — implement once, cite everywhere; second stores stay forbidden.
5. **Generic vs specific.** Idempotency (F4), healing (F10), parity (F12) each have a generic-discipline half and a realization-specific half — the generic half never fictitiously covers the specific half (CFA-05/CFA-06 joint).
6. **MCP mesh posture.** CFAs uniformly treat the mesh as Phase-3 transport, not a prerequisite: interim disciplines (work-runner envelope, redaction canary, budgets) carry the NEXT phase.

## Carried unknowns (still owned by CFAs — not resolved here)

- Runtime propagation of canonical revision/CID (CFA-01 U-1); aggregate multi-object basis (U-2); observation identity for external sources (U-3).
- Toolchain version-pinning across sessions (CFA-02 U-1, CFA-07 U-1); AuthorityCitation storage (CFA-02 U-2); trust/key portability for restore (CFA-02 U-4, M4).
- Live authority citation form (CFA-03 U-1); durable semantic↔record mapping (U-2); Plan/Work semantic package (U-3); mesh-as-transport decision (U-6).
- Sandbox mechanism choice; secret-store choice; autonomy-radius defaults (CFA-04 unknowns).
- Work vocabulary/G1–G6 gates (CFA-05); Account/Session join (CFA-06, blocking F9); healing→evolution handoff (CFA-06/CFA-09).
- Local suite-green status on this machine; composition identity discriminator (CFA-07 U-2/U-3).
- Tool versions on team machines; toast policy; redaction patterns; baseline storage (CFA-08).
- Validator extension language; exact-agent mechanical future; counter-2 registry; M6 slice (CFA-09 U-1–U-6).
- U1 precedence probe; array-form permissions; stronger containment tier (CFA-10 U-1/U-2, M4).

## Lineage

- Sources: the ten `SUBAGENTS/*/TOOLSET-TOP10-20260928.md` artifacts + their `RESULTS/CFAxx-TOOLSET-20260928.md` receipts (wave-1, delivery HEAD `adb3b76a`; steward wave receipt `RESULTS/STEWARD-20260928-LOCAL-TEAM-TOOLSET-WAVE1.md`).
- Demand counts transcribed from the rank tables above; titles quoted or minimally normalized for the union (normalization is steward-derived, source rows linked).
- Scores/phases/matrix mappings are new steward derivation in this document — challengeable, and any CFA may file a correction handoff against its rows.
- No Ω-law content touched; no CFA home touched; no implementation started.
