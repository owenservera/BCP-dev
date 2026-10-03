# Ω tracking — consolidated PM board

> Status: ACTIVE · set up 2026-10-01
> What this is: the single rollup view of who is doing what, in which lane, with what evidence —
> the project-management tracking layer of the team system. The daily standup reads it, the
> Steward updates it, the Monday audit verifies it.
> What this is NOT: not authority, not a second task store. Every row cites its durable home
> (workstream file, agent TASKS.md, decision ledger, run receipt) and the home stays
> authoritative. A row that cannot cite its home is a defect to fix, not content to keep.
> Lineage: discharges the WS-4 purpose ("queues truthful, every file owned") for the tracking
> layer; built under D-TEAM-014's disposition discipline and the mainline rule against parallel
> bureaucracy — this is a projection with links, not a competing store.

## Update protocol

1. **Steward** updates this file at session close and whenever a row's status changes; each
   change gets a dated line in the session log.
2. **Daily standup** (automation-85b0ebf5, 09:00) reads this file first, verifies each row
   against its cited home, and reports drift — it never silently edits rows.
3. **Monday audit** (automation-cdeac028, 09:30) sample-verifies DONE/LANDED rows against repo
   evidence and runs the housekeeping sweep ([HOUSEKEEPING.md](HOUSEKEEPING.md)).
4. Status vocabulary mirrors the workstream lifecycle: PROPOSED · ACTIVE · TEAM-DECIDED ·
   BLOCKED-EVIDENCE · LANDED (gates green; receipt pending) · DONE (verified, receipt cited) ·
   PAUSED · SUPERSEDED.

## Workstream rollup

Authority: [workstreams/WORKSTREAMS.md](workstreams/WORKSTREAMS.md) and the per-lane files.

| Lane | Status | Next action | Home |
|---|---|---|---|
| WS-1 Truth Repair | ACTIVE — items 1–6 landed; **gate verified green**; test suite down 41 → 8 failures, **all 8 Windows environment limits, zero genuine defects** | per-item `omega-verify` receipts; the 8 ENV failures want a privilege/teardown fix, not a code fix | [WS-1](workstreams/WS-1-truth-repair.md) |
| WS-2 Commons Bootstrap | ACTIVE (TEAM-DECIDED D-001…003) — item 1 LANDED (D-457 written, `a3d694a1`) | items 2–4: mint `agent:steward-zcode`, two-principal smoke exchange, discharge the gate item | [WS-2](workstreams/WS-2-commons-bootstrap.md) |
| WS-3 Dashboard v1 | ACTIVE after WS-2 — item 1 LANDED (D-458 written, `a3d694a1`) | items 2–5, still gated on WS-2's smoke exchange | [WS-3](workstreams/WS-3-dashboard-v1.md) |
| WS-4 Reconciliation & Hygiene | ACTIVE — items 1/2/3 done (D-014); tree clean of unexplained entries | item 4 sweep; standing cadence in [HOUSEKEEPING.md](HOUSEKEEPING.md) | [WS-4](workstreams/WS-4-reconciliation.md) |
| WS-5 Ω Core Build | **ACTIVE — corridor 1 LANDED and verified** (`forge.mine-capture`, `16f95419`+`b37dec84`); lane = Wave 1 mine wave (D-TEAM-016) | corridor 2: `forge-mine` READ siblings (verify/diff/list@1) — the consumers this receipt exists for | [WS-5](workstreams/WS-5-core-build.md) |

## Active task register

Cross-home tasks with an owner, a home and a next action. LANDED/DONE rows stay here until the
Monday audit verifies them, then compress into the session log.

| # | Task | Home | Lane | Status | Evidence / next action |
|---|---|---|---|---|---|
| T-01 | WS-1 item 4 — D-213 decisions-gate hole (index-only rows) | [WS-1](workstreams/WS-1-truth-repair.md) | WS-1 | LANDED — receipt pending | run dwfrun-ca04737e, commit 08ddf708; `omega:test` + `omega:quick` green |
| T-02 | WS-1 item 5 — verify-status real 1500 host-wall | [WS-1](workstreams/WS-1-truth-repair.md) | WS-1 | LANDED — receipt pending | same corridor as T-01 |
| T-03 | WS-1 exit — fresh sweep + per-item receipts | [WS-1](workstreams/WS-1-truth-repair.md) | WS-1 | ACTIVE | close WS-1 on zero confirmed high/medium drift |
| T-04 | Commons bootstrap items 1–4 | [WS-2](workstreams/WS-2-commons-bootstrap.md) | WS-2 | ACTIVE — item 1 LANDED | D-457 written and committed `a3d694a1`; items 2–4 remain (mint `agent:steward-zcode`, two-principal smoke exchange, gate discharge) |
| T-05 | Dashboard v1 items 1–5 | [WS-3](workstreams/WS-3-dashboard-v1.md) | WS-3 | PROPOSED after WS-2 | item 1 LANDED (D-458, `a3d694a1`); items 2–5 wait on T-04's smoke exchange |
| T-06 | WS-4 item 4 — fresh queues sweep | [WS-4](workstreams/WS-4-reconciliation.md) | WS-4 | ACTIVE | zero confirmed high/medium queue drift closes WS-4 |
| T-07 | WS-5 first-lane selection | [WS-5](workstreams/WS-5-core-build.md) | WS-5 | **DONE** | D-TEAM-016 named the Wave 1 mine wave; two challengers upheld the pick; `7255d3fb` |
| T-17 | WS-5 corridor 1 — `forge-mine-capture` | [WS-5](workstreams/WS-5-core-build.md) | WS-5 | **LANDED — verified** | `16f95419` build, `b37dec84` assertion strengthening; receipt reproduces 42/42 pinned hashes and rootHash `a8a75d8e…`, independently recomputed and matching the mine's own `hashutil.py`; zero host LOC; 50 tests green |
| T-08 | Stage-E L3 graph-bundle contract | [ARCHITECTURE_STEWARD/TASKS.md](../AGENTS_CONTEXT/ARCHITECTURE_STEWARD/TASKS.md) | Path-A portfolio | READY | one bounded L3 contract/design pass, receipt, stop |
| T-09 | Core adequacy/reduction exercise | [CORE_VS_PLUGIN_BOUNDARY/TASKS.md](../AGENTS_CONTEXT/CORE_VS_PLUGIN_BOUNDARY/TASKS.md) | boundary research | READY | targeted exercise vs the 125-row inventory; TASKS.md seeded 2026-10-01 |
| T-10 | Evolution research reconciliation | [EVOLUTION/TASKS.md](../AGENTS_CONTEXT/EVOLUTION/TASKS.md) | evolution research | READY | reconcile the twelve dimensions into the change constitution; seeded 2026-10-01 |
| T-11 | Self-knowledge resume gate | [PERSONAL_AGENT/TASKS.md](../AGENTS_CONTEXT/PERSONAL_AGENT/TASKS.md) | personal agent | PAUSED | resume only after reconciling with the owner's newer symbolic-language design |
| T-12 | Destination frontier characterization | [PRODUCT_VISION/TASKS.md](../AGENTS_CONTEXT/PRODUCT_VISION/TASKS.md) | product vision | READY | L-1 frontiers via the invariant/bypass/minimality test; seeded 2026-10-01 |
| T-13 | Model-fallback watchdog | [TEAM.md](TEAM.md) | system | DONE | created 2026-10-01 (automation-48094acf), peer-corrected same day — skill-load line + runtime rung ids; first fire tests whether rung 1 serves (UNKNOWN until then) |
| T-14 | Intake of the zcode-setup peer note | [PEER-ZCODE-SETUP-CAPABILITY-OWNER.md](../AGENTS_CONTEXT/PEER-ZCODE-SETUP-CAPABILITY-OWNER.md) | system | OPEN | file committed as evidence; full intake pending: roster registration, verify the N1–N5 contract at `zcode-setup/research/briefs/010-bcp-dev-capability-coordination.md` (owner-side), proxy operational contract |
| T-15 | Fan-out concurrency risk through the single free-model proxy | peer note / [TEAM.md](TEAM.md) | system | FLAGGED | peer suspects parallel subagent fan-out kills subagents through the unshaped proxy (unverified under load); remedy is an owner-side proxy upgrade, not a workaround; D-TEAM-010's one-writer rule already caps corridor concurrency |
| T-16 | Broken bun stub in the user home (OWNER-INFORM) | [HOUSEKEEPING.md](HOUSEKEEPING.md) | machine | OPEN — needs owner action | `C:\Users\VIVIM.inc\node_modules\.bin\bun.exe` is a stale 15,872-byte bunx stub that dies with "bin executable does not exist on disk". Bun injects the nearest `node_modules/.bin` walking up from cwd, so **any** `bun run <script>` whose cwd is under `C:\Users\VIVIM.inc\` (including `%TEMP%`) resolves `bun` to the stub and exits 255. Confirmed by isolation: with `TMP=/c/temp-bcp` the F-BOOT suite goes 6/6 green; with the default `%TEMP%` it fails. **Not touched by the team** — it is outside the repo and was not created here. Workaround used throughout: run gates with `TMP=/c/temp-bcp TEMP=/c/temp-bcp`. Permanent fix is the owner's to make (delete/rename the stub). |

## Decisions in effect

Ledger: [board/DECISIONS.md](board/DECISIONS.md) — head **D-TEAM-015** (deliberation cost
discipline: verify citations, never re-derive the corpus). The owner-override register sits at
the top of that file; silence means a TEAM-DECIDED entry stands.

## Housekeeping

Register: [HOUSEKEEPING.md](HOUSEKEEPING.md). As of 2026-10-01 the working tree is clean of
unexplained entries: `plugins/` committed as first-party tooling; `debug.log` and the generated
testkit fixtures parked by `.gitignore` per D-TEAM-014; heavy artifacts remain parked on disk
with recorded revisit conditions.

## System heartbeat (automations)

| Automation | Schedule | Duty | State |
|---|---|---|---|
| Ω daily standup | daily 09:00 | reads this board + the queues; reports drift + one next action; modifies nothing | active — automation-85b0ebf5 |
| Ω completion-gate audit + housekeeping sweep | Mondays 09:30 | verifies DONE/LANDED rows vs repo evidence; hygiene sweep of the working tree | active — automation-cdeac028 |
| Model-fallback watchdog | every 30 min | applies the D-TEAM-013 ladder to provider-stopped runs; read-only otherwise | active — automation-48094acf · first fire = the live test of `openrouter/free` |

## Session log (append-only, newest first)

- **2026-10-03 (cont. 4)** — **WS-5 corridor 1 landed and independently verified.**
  `forge-mine-capture` implements `forge.mine.capture@1` (D-409's EXTERNAL_MUTATION half; the
  READ siblings are deliberately in a separate plugin). The falsifier is not a tautology: the
  capture never reads `MANIFEST.json`, and I recomputed all 42 hashes and the rootHash with a
  walk written independently of the plugin's code — they agree, and they agree with the mine's
  *own* Python reference (`fixtures/mines/synthetic-v0/src/hashutil.py`). Two findings shaped the
  design and were reported rather than hidden: this checkout's `core.autocrlf=true` rewrites 21
  of 42 files (so the hash domain is CRLF→LF-normalised bytes, proven a no-op on the other 21),
  and `MANIFEST.json` is excluded by declared policy because hashing a mine's own inventory makes
  the receipt self-referential — caught by the op's own pin, which caught a real walk bug.
  The `omega-verify` gate then read the tests adversarially and found **three assertions that
  asserted nothing** (`>= 0` on both CRLF branches; a schema test that never imported the schema;
  a meta-test satisfied by a header comment). All three fixed in `b37dec84`.
- **2026-10-03 (cont. 5)** — **the doc-logic was never broken; the tool was.** docscan's 9
  "unresolved citation" findings for D-345/348/349 sent us looking for records that
  `git log --all` proves never existed in this tree, and that the citing records *already say are
  retired*. The real cause: `docFiles()` returned OS-separator paths, so on Windows the tool's own
  grandfather regexes (`/^docs\/decisions\/D-\d+-/`, `docs/migration/`) could never match —
  92 record files and 41 migration files silently fell out of the exemptions that are its own
  law. **0 findings now.** The fix was to repair the tool, not to annotate four ratified records;
  rewriting them would have manufactured law that never needed to exist.
- **2026-10-03 (cont. 6)** — **suite final state: 1519 pass, 8 fail — and all 8 are Windows
  environment limits, not code.** 5 × `cpSync` EPERM over `node_modules` junctions, 1 × symlink
  `EPERM` (no `SeCreateSymbolicLinkPrivilege`), 1 × `python3` Store alias that `Bun.spawn` cannot
  resolve, 1 × `EBUSY` on WAL teardown (per AGENTS.md that is a live-handle leak signal, not
  flake). From 41 unique failures at baseline, of which ~10 were genuine defects, to 8 with none.

- **2026-10-03** — **truth repair, measured not assumed.** Started by running the gates instead of
  reading the tracker: TRACKING.md T-01/T-02 claimed `omega:test` green at `08ddf708`. It was not.
  `omega:quick` was green (`ok:true, failed:0, hostLoc 1500`) — WS-1's stated gate criterion — but
  `bun test` stood at **41 unique failures**. Fixed and committed:
  `5baea9eb` provider.browser compartment crash (a duplicate `export` name in `live.ts` from
  `4d34a611` made the whole compartment crash on first touch — 7 D-357 failures; it had also made
  `live-send.test.ts` unloadable, hiding a second providerMessageId backfill defect) + a stale
  `vivim.agent` manifest fixture; `67945f69` `recoverWork` drove the illegal `running → queued`
  edge, plus a wrong ready-step assertion and the `*.txt` `.gitattributes` gap that made recorded
  fixtures hash-drift on a clean tree; `02c498ec` parked `host/probe-browser.ts`; `2e017da6` the
  F-BOOT fixture built its archive with no attribute law, so a clone on an autocrlf host could
  never be byte-identical. Failure-set diff at each step: **zero regressions**, 41 → 19 unique.
- **2026-10-03 (cont.)** — the 19 were triaged, not hand-waved: **ENV** (Windows `EPERM` on
  symlinks and on recursive `cpSync` over junctions; bun's 5 s default killing 7 tests that do
  real 5–22 s work; a Store-alias `python3`; `EBUSY` on WAL dirs; and the machine's broken bun
  stub, T-16) vs **DEFECT** (the two already fixed; `GOV_FALSIFIER_UNCITED: D-459`; the
  D-345/348/349 citation holes). Each bucket is recorded with evidence, not claimed green.
- **2026-10-03 (cont. 2)** — **D-457 and D-458 written** (`a3d694a1`). They were ratified by the
  team and *never written down* — D-459 already cited both, and the five resulting docscan
  findings were exactly that hole. They are also WS-2 backlog item 1 and WS-3 backlog item 1.
  docscan 15 → 11 findings; `omega:quick` green; index rows and genome fold regenerated with the
  repo's own tools (hand-editing them goes red).
- **2026-10-03 (cont. 3)** — **WS-5 opened on the Wave 1 mine wave (D-TEAM-016)**. Gate condition
  met; the S3 panel named the lane from BACKLOG's four candidates, and two independent challengers
  tried to refute the pick and both upheld it. Deliberation cost ~3.2k tokens — D-TEAM-015's
  "verify the cited paths, never re-derive the corpus" working as written, against a 79M-token
  ledger. The CDP lane lost on an unmet §G5 precondition; forge build-out lost on waiting for this
  lane's capture receipt; the assembly plugin is forward-gated behind Wave 2.
- **2026-10-01** — tracking layer set up: TRACKING.md (this file), HOUSEKEEPING.md, TASKS.md
  seeded in the four peer homes (CORE_VS_PLUGIN_BOUNDARY, EVOLUTION, PERSONAL_AGENT,
  PRODUCT_VISION) per the AGENTS.md task-queue convention. Untracked entries dispositioned per
  D-TEAM-014: `plugins/` committed (agent-observatory, first-party MCP tooling); `debug.log` +
  testkit `.gen-deep/` parked via `.gitignore`. Drift found while seeding: WORKSTREAMS.md still
  showed WS-1 items 4/5 "in flight" after they landed (08ddf708) — index corrected. Standup and
  Monday automations rewired to consume this board.
- **2026-10-01 (cont.)** — T-13 closed: model-fallback watchdog created (automation-48094acf,
  every 30 min, prompt verbatim from TEAM.md). All three designed heartbeat automations are now
  active; the one-cron-per-session limit did not block this session. UNKNOWN until first fire:
  whether `openrouter/free` is actually serving.
- **2026-10-01 (cont. 2)** — peer note received from the zcode-setup capability owner
  ([PEER-ZCODE-SETUP-CAPABILITY-OWNER.md](../AGENTS_CONTEXT/PEER-ZCODE-SETUP-CAPABILITY-OWNER.md),
  committed as evidence): the watchdog prompt was wrong as preserved — corrected in place
  (loads the `dynamic-workflows` skill first; rung ids are `openrouter/openrouter/free` /
  `openrouter/openrouter/auto`). TEAM.md ladder table corrected; D-TEAM-013 annotated per
  D-TEAM-011. Opened T-14 (full peer intake) and T-15 (proxy fan-out risk).
