# WS-010 Round 1 — Contextual Language Contract

> **Classification: DERIVED — PROPOSED (WS-010 research, binding for Rounds 2–3)**
> **Invariant:** identifiers are references; language carries meaning.
> Identifiers render secondary, always.

## L-RULES — derivation rules for every human-readable string

- **L1. Extractive-first.** Display names and context sentences must be
  composed from source vocabulary (portfolio mission lines, charter text,
  record summaries, invariant sentences, taxonomy definitions). Cite the
  source cell per sentence.
- **L2. Tagged interpretation.** Any wording not extractable under L1
  carries an inline `INTERPRETATION REQUIRED` tag and names its author
  (role, never authority). No silent LLM smoothing.
- **L3. State sentences bind to axes.** Every state clause cites its axis
  values (`A2 experiment:merging@sweep-depth-math`, `A5 stale`, …).
  Adjectives without axis bindings are forbidden.
- **L4. Evidence route is a path, not a gesture.** `file:line` / record id
  / packet id / command re-run (`python bcp-speed/bcp/validate.py`) —
  always re-walkable by a fresh agent.
- **L5. Uncertainty is a field, not a tone.** Every card carries an
  explicit uncertainty/conflict statement, including "none recorded" (with
  scope: which sources were checked).
- **L6. Layout order is fixed:** name → context → state → why-here →
  evidence → uncertainty → technical refs (secondary, visually subordinate).

## L-FORBIDDEN — six patterns that fail review

F1. ID-primary labels (`P1-02 / WS-002` as the headline).
F2. Verdict adjectives without axes (`healthy`, `on track`, `done`).
F3. Owner names without A8 source cells.
F4. Priority/rank language (`top`, `next up`, `should do`).
F5. Time adverbs without A5 pins (`recently`, `currently` without as-of).
F6. Cross-scope identity claims (`AGT-b1 (IMPL-02)` style merges).

## L-EXAMPLES — nine worked cards (all source-cited, tip `94cd43d`)

### E1. P1-01 — Cooperative Agent System

1. **Name:** Cooperative Agent System — how humans, ChatGPT sessions, and
   local agents work as one persistent team. 2. **Context:** Provides
   durable coordination (identity, routing, transcripts, packets,
   handoffs) so a fresh participant can continue without reconstructing
   the project from memory. *(Portfolio §3; SYSTEM §1.)* 3. **State:** Proven
   development-control infrastructure; dogfood 7 green / 1 partial / 2
   proven; board parked, zero active leases. *(A2 proven@coordinator-
   verdict; A5 current @validate.py 2026-09-24.)* 4. **Why here:** Program
   Map shows the program's coordination substrate. 5. **Evidence:**
   `P1-WORKSTREAM-PORTFOLIO.md:32-43`, `CURRENT.md:56`,
   `HANDOFF-008`. 6. **Uncertainty:** Residual COMPACTION formal re-rule
   owed (recorded, not blocking). 7. **Refs:** `P1-01 · WS-001`.

### E2. P1-02 — Repository Truth & Drift

1. **Name:** Repository Truth & Drift — determines what exists, what
   governs it, what is historical or stale, and where surfaces disagree.
2. **Context:** Maintains a reconciled map of repository reality without
   becoming a second authority. *(Portfolio §4; WS-002 charter.)*
3. **State:** Registered research workstream; charter proposed, setup
   prompt prepared; not proven, not implementation-active. *(A2
   registered@registry-row; A4 observed.)* 4. **Why here:** Exemplar of
   the ID-vs-meaning invariant. 5. **Evidence:**
   `P1-WORKSTREAM-PORTFOLIO.md:44-52`, `WORKSTREAMS.md:22-30`, PR #8
   `537d987`. 6. **Uncertainty:** Owner/coordinator launch pending; proof
   boundary open. 7. **Refs:** `P1-02 · WS-002`.

### E3. One BCP work item — EXP-2026-004 (used: experiment-track item; `work_item` empty per M-WRK)

1. **Name:** Path A — Chrome Skeleton build track. 2. **Context:** Runs
   the FAM-07 Chrome-skeleton capabilities from plan to verified depth
   with leased scoped builders. *(experiments.yaml:117+.)* 3. **State:**
   Merging by sweep depth-math (all in-scope caps at L2); fixture-proven,
   NOT live-proven, NOT integrated. *(A2 merging@sweep-depth-math; A4
   strongly-inferred@CONTEXT-product §4; A5 current.)* 4. **Why here:**
   Work Map's "moving" lane exemplar with honest qualifiers. 5. **Evidence:**
   `state/experiments.yaml:117-…`, `bcp-speed/bcp/log/2026-09-22.yaml`,
   `docs/CONTEXT-product.md:§4`. 6. **Uncertainty:** Live Chrome turn never
   run; b1's consumption word verbal-only. 7. **Refs:** `EXP-2026-004 · FAM-07.x`.

### E4. One Ω decision — D-456

1. **Name:** v1 ships Chrome master/slave only; the local-model concept
   leaves the plan. 2. **Context:** Removes Ollama-first sequencing from
   every planning surface so a cold reader cannot build the wrong system;
   history keeps its cited audit trail. *(Record §§Context/Decision.)*
3. **State:** Ratified directive-class law; enforced by mechanical sweep
   test. *(A2 ratified@record-Status; A1 authoritative.)* 4. **Why here:**
   Evidence Map anchor for authority preservation. 5. **Evidence:**
   `docs/decisions/D-456-…md`, `tooling/gates/test/
   d-456-substrate-removal.test.ts`. 6. **Uncertainty:** None on status;
   code-removal follow-up directed but separate. 7. **Refs:** `D-456 · directive`.

### E5. One commit/PR — PR #8 (`537d987`)

1. **Name:** P1-02 drift sweep — denominators, hands-off lists, stale
   numbers. 2. **Context:** Swept era-true numbers and stale passages out
   of P1-02 baseline docs after the baseline freeze. 3. **State:** Merged
   to main; substantive P1-02 baseline marker with PRs #6–#7 beneath it.
   *(A2 merged@git-log; A5 current-tip-pinned.)* 4. **Why here:** History
   Map node showing work→evidence→registry chain. 5. **Evidence:**
   `git show 537d987 --stat`, `CURRENT.md:10-11`. 6. **Uncertainty:** None
   on merge fact; content claims inherit swept sources' axes. 7. **Refs:**
   `PR #8 · 537d987`.

### E6. One agent — IMPL-03

1. **Name:** Independent closer — sealed verification run. 2. **Context:**
   Re-verified the WS-001 link chain and cold-start path from HANDOFF-005
   alone, without prior session memory. 3. **State:** Standby; verification
   delivered (rubric 6/6); branch deleted, deposits preserved on main.
   *(A2 standby@ROSTER; A3 idle; A5 current.)* 4. **Why here:** Agent Map
   exemplar incl. post-task branch lifecycle. 5. **Evidence:**
   `ROSTER.md:13`, `HANDOFF-009`, outbox `IMPL-03/ITEM-001`. 6. **Uncertainty:**
   Originating content IDs remapped (bytes identical) — mapping row cited,
   not elided. 7. **Refs:** `IMPL-03 · ex-branch impl-03/… (deleted)`.

### E7. One packet/handoff — PKT-002

1. **Name:** P1-01 dogfood findings — directive DIR-001 execution record.
2. **Context:** Compacted drill evidence (proof table, packet QA, merge
   request) into durable findings incl. two defects with fixes. 3. **State:**
   Derived-current working knowledge; stands, extended (not replaced) by
   later packets. *(A1 non-authoritative; A2 current@banner; A6 derived
   from listed sources.)* 4. **Why here:** Evidence Map node showing
   transcript→packet→CURRENT compression with pointers intact. 5. **Evidence:**
   packet header source list + SHA256 provenance pins. 6. **Uncertainty:**
   Drill-scoped (local-agent, pre-ledger labels). 7. **Refs:** `PKT-002 · WS-001`.

### E8. One conflict — C8 (model counts)

1. **Name:** Prisma model-count disagreement — 201 declared vs ~400 blocks
   counted. 2. **Context:** Strategy docs claim "201 models"; split-schema
   block sum counted ~400; 2026-09-24 measurement shows 201 declarations
   over 200 unique names (+2 separate-schema) — the ~400 is a
   double-counting denominator. 3. **State:** Open; canonical-name
   reconciliation owned by Path-C start. *(A4 contested; A1 supporting.)*
4. **Why here:** Attention exemplar that must show BOTH numbers + OPEN tag.
5. **Evidence:** `CONFLICT-REGISTER.md:C8`, `CURRENT-CONTEXT.md`
   unresolved list. 6. **Uncertainty:** IS the card — no canonical count
   asserted. 7. **Refs:** `C8 · OPEN`.

### E9. One unknown — `bcp-algos/` (hands-off surface)

1. **Name:** Untracked local surface outside workstream ownership.
2. **Context:** Present in the working tree; belongs to another surface
   until the owner triages it. 3. **State:** Unknown by policy — not
   inspected for classification. *(A7 untracked; A4 unknown; A9
   owner-required.)* 4. **Why here:** Unknown-preservation exemplar: the
   map shows the gap without filling it. 5. **Evidence:** `git status
   --short`, `CURRENT.md:12`, `CURRENT-CONTEXT.md` hands-off list.
6. **Uncertainty:** Total — contents, relevance, and fate all untriaged.
7. **Refs:** `bcp-algos/ · untracked · hands-off`.
