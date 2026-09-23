# Migration #1 Process Trace — reconstruction (Prompt 2, §3)

> Reconstructed 2026-09-23 from the artifacts MIG-001 actually left behind
> (record, assay, spec, mapping, verification-report, 6 docs/migration files,
> BCP discoveries DISC-022/023, log events). Not from memory of the transcript:
> every row below names the artifact that proves the step happened.

## Stage-by-stage trace

| Stage | Input | Output | Actor | Tools used | Data created | Decisions made | Evidence created | Automation available | Manual work required | Ambiguities / failures |
|---|---|---|---|---|---|---|---|---|---|---|
| DISCOVER | VIVIM tree (6,948 files) | ChatGPT send_message selected as slice | agent | file listing, manifest grep | slice rationale (FIRST_VERTICAL_SLICE §1) | "ChatGPT first, hardest honest slice" | rationale doc | none — no capability inventory exists | source selection entirely manual | none (choice documented, not derived) |
| ASSAY | 12 VIVIM source files + 4 Ω files | assay.chatgpt-send-message.md (46 lines, confidence-tagged) | agent | Read, sha256 (`Get-FileHash` equivalent) | 16 pinned source_locations w/ hashes; 7 observations | which files are load-bearing | assay doc + hashes in record | sha256 via stdlib (manual invocation) | confidence tagging; entry-point chain INFERRED (no runtime trace) | manifest-vs-plugin live authority UNKNOWN; Governor exclusivity scan outstanding |
| BEHAVIOR MODEL | assay | behavior-spec.chatgpt-send-message.md (51 lines: inputs/behavior/invariants/failures/side-effects/unknown) | agent | none (reasoning only) | 6 invariants I-1..I-6; 6 named failures; 4 unknowns U-1..U-4 | exactly-once intent; redact-before-vault ordering | spec doc | none | all of it — no spec template existed | completion-detection rule not assayed (L-3) |
| CLASSIFICATION | spec | canonicality TRANSFORM + rationale | agent | none | record.canonicality | "semantics canonical, both representations incidental" | record field | none | verdict + rationale | product-intent confirmation open for OBSOLETE candidates elsewhere |
| Ω MAPPING | spec + Ω contracts/src + provider-browser/src | omega-mapping.json (preserved/changed/unresolved) | agent | Read of 7 Ω contract files, parser registry | preserved(6)/changed(3)/unresolved(4) lists | zero new contracts; op-map-data mechanism | mapping doc + json | contract-name resolution (later mechanized as V-2) | mapping judgments; transformation mechanism design | thinking-block semantics not yet encountered (surfaced in #2) |
| CONTRACT | mapping | none new — reused message.send@1 + 6 surfaces | agent | — | (no artifact; reuse decision) | "no new Ω architecture for migration convenience" | FIRST_VERTICAL_SLICE §4 | gate (`omega:quick`) proves Ω untouched | reuse-vs-new judgment | none |
| IMPLEMENTATION | mapping | 6 docs + schema + record + 4 MIG-001 artifacts + verify script; 0 Ω/VIVIM/BCP-state edits | agent | Write, bcp_tool discovery add | 13 new files, all additive | one-way-adapter mechanism; discard list (5 items) | files + DISC-022/023 via tool | bcp_tool for discoveries only | all prose + schema design | V-4 checker self-match bug (caught pre-green — a win for the checker) |
| TEST | implementation | verify_migration.py run; validate.py; sweep dry-run | agent | python (stdlib only) | PASS/FAIL lines | none (mechanical) | verification-report.md | verify script (new), validate/sweep (pre-existing) | invoking the three commands | BCP unit tests 26/28 (pre-existing stale assumptions, recorded not fixed) |
| INDEPENDENT VERIFICATION | test outputs | second agent re-ran all checks + sha-pin audit (Prompt-1 executor session + this session) | separate agent session | same scripts, fresh shell | verification-report.md; this trace | INTENTIONALLY_TRANSFORMED verdict | report doc | scripts are re-runnable by anyone | verdict judgment | LIVE: no authenticated profile/Chrome in env — recorded UNVERIFIED |
| EVIDENCE | all above | record.proof_ladder {static/integration/live/regression} + evidence[] refs | agent | — | 8-item evidence list | fixture≠live labeling | record fields | V-5 honesty check (mechanized) | ladder labeling | none |
| INTEGRATION | evidence | docs/migration/ committed-to-disk (untracked); BCP state via tool only | agent | git status (read-only) | 101 log events; discoveries in state | "do not commit unprompted" (repo rule) | git status output | none | commit decision is human | artifacts still untracked — preservation incomplete until commit |

## §4 classification of every step above

### A. DETERMINISTIC (mechanize — done or planned)
locate files · sha256 pinning · schema conformance (V-1) · contract-name
resolution (V-2) · monolith-import refusal (V-4) · proof-ladder honesty (V-5) ·
UNKNOWN discipline (V-6) · BCP validate/sweep · test execution.

### B. AGENT REASONING (keep with provenance, never as fiat)
source selection · confidence tagging · spec writing · canonicality verdict ·
Ω mapping · transformation mechanism · risk severity · comparison judgments.

### C. HUMAN DECISION (do not autonomize)
product intent / OBSOLETE verdicts · commit + integration approval ·
live-proof witnessing (independent human or trusted operator) ·
architectural policy exceptions (Ω law conflicts → STOP, §24).

### D. EVIDENCE (every migration must emit)
assay + spec + mapping + record + verification-report + proof ladder +
BCP discovery rows + lifecycle status transitions.

## Repeated patterns (candidates for machinery — §5 input)
1. Every provider migration re-assays the SAME shared legs (Governor/CDP path,
   stream-parser fallback chain, conversation lifecycle, binder). MIG-001 paid
   full price; #2 must reference-by-record, not re-pin — needs a record
   registry + shared-leg citation.
2. `verify_migration.py` hardcodes the MIG-001 record path — cannot verify a
   second record without editing the checker. Generalization failure #1 (fix in
   P2-5: `--record` / `--all`).
3. Confidence tags, invariant IDs, proof-ladder labels were free prose that the
   checker re-parses by convention. Stable enough after 1 example to template,
   but per Prompt-1 §17 only promote after #2 proves the shape.
4. Dual-representation (manifest + plugin) appeared once; unknown whether
   pattern or accident — carry as observation, do not build for it yet.
