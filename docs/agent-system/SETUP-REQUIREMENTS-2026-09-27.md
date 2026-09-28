# Setup Requirements — Exact Bill of Materials

> Date: 2026-09-27 · Branch: `exp/local-theory-sandbox`
> Companion: `REMAINING-SETUP-WORK-2026-09-27.md` (the roadmap; item numbers match).
> Every item below states owner, inputs, exact deliverables, verification command,
> and acceptance criteria. Nothing is done until its verification command passes
> and the evidence is committed.

## Current-main integration baseline — 2026-09-28

Before executing these requirements, read
`docs/agent-system/CURRENT-RECONCILIATION-2026-09-28.md`.

Current `main`: `7ae2460b04df22a949bae0f1478b539129ce8bca`.

These requirements describe the autonomous-team setup track. They do not override
the current Architecture Steward control plane. Completion claims must also satisfy
the current Durable Completion Gate and its final delivery-ref verification rule.

## Environment (all phases)

- bun ≥1.3.14, node ≥24, git ≥2.51, gh ≥2.83, opencode 1.18.4 (re-verify with
  `bun --version && opencode --version` if the machine changed).
- Repo: `BCP-dev`, sandbox branch rebased onto current `origin/main`
  (`git status -sb` shows no `behind`; suite re-run after every rebase).
- Rule: test-only changes need no gate; runtime-source changes need CFA-04 gate +
  CFA-09 envelope + sandbox-only branch.

## Phase 2b

### 1. Two-host v0 evidence — owner: `runtime-constitution-core-substrate`
- Inputs: `AGENTS_CONTEXT/AGENT-COMMONS/runtime/test/v0-completion.test.ts`.
- Deliverable: same 10 points passing with runtimes on two hosts sharing one
  remote (document host identities + remote URL in the test header or a
  `RESULTS/` receipt; do not hardcode machine-specific paths).
- Verify: `bun test AGENTS_CONTEXT/AGENT-COMMONS/runtime` on the orchestrating
  host → 6+ pass, 0 fail (count grows only by added tests, never by edits that
  weaken assertions).
- Accept: 0 fail on both hosts' runs, evidence committed with exact SHAs.

### 2. Rotation operation — owner: `authority-governance`
- Inputs: `AGENTS_CONTEXT/AGENT-COMMONS/IDENTITY-AND-TRUST.md`,
  `IDENTITY-RECOVERY.md`, Steward `TASKS.md` (`COMMONS-IDENTITY-DRILL-2026-09-27`).
- Deliverables: (a) rotation operation in the runtime (old-key retirement +
  rejection, new-key attribution, stream continuity — additive events only, never
  history rewrite); (b) executed drill record with transcript of each step.
- Verify: drill test asserting retired-key events verify against the OLD key but
  new appends reject it; `TASKS.md` drill entry moves BLOCKED → DONE with receipt.
- Accept: stable `agent_id` across rotation; no silent fork (existing
  no-silent-fork test still green).

### 3. CFA-11 counters — owner: `architecture-steward`
- Inputs: `CORE-FUNCTION-AREA-REGISTER.md` (trigger definitions),
  `OWNER-DIGEST.md`, `RECEIPTS.md`.
- Deliverable: digest section computing the three counters (pending receipts,
  open contradictions, oldest-pending age) from repo files, no manual counts.
- Verify: hand-check counters against `grep` counts on the same files.
- Accept: counters reproducible by a second session following only the digest.

## Phase 3

### 4. A2A-live adapter — owner: `runtime-constitution-core-substrate`
- Inputs: A2A v0.3.0 spec (AgentCard, task lifecycle, SSE, resubscribe, push),
  `TRANSPORT.md`, `SESSION-CAPABILITY-AND-TRANSPORT.md`.
- Deliverables: (a) `runtime/src/transports/a2a-live.ts` implementing the existing
  `CommonsTransport` interface — no new message kinds, no schema change;
  (b) per-agent AgentCard JSON (11 cards once daemon registers, 10 until then);
  (c) conformance test: the 10 v0 points over SSE + resubscribe + one push-webhook
  round-trip, Git fallback asserted by killing the live channel mid-test.
- Verify: `bun test` full suite green; fallback leg proven by the mid-test kill.
- Accept: any event validating over one transport validates over all three; any
  divergence fails the build (falsifier, design §11).

### 5. Presence-loop daemon — owner: `runtime-constitution-core-substrate`
- Inputs: existing `presence(state, ttl)` + `presence` CLI verb.
- Deliverables: (a) `commons-daemon` roster row + home (registration BEFORE any
  spawn-list edit); (b) loop re-emitting presence before `expires_at` and
  scheduling `who-needs-attention`; (c) delegation amendment adding the name.
- Verify: two runtimes observe each other's fresh presence; stale presence
  (killed daemon) visibly expires.
- Accept: correctness never depends on presence (kill-daemon test: sync still
  converges via Git).

### 6. MCP mesh — operated by CFA-10, gated by CFA-04
- Servers: `mcp-commons` (wrap `runtime/src/cli.ts` verbs only), `mcp-machine`
  (`bash`/`git`/`gh` allowlist), `mcp-web` (fetch/search/browser),
  `mcp-memory` (scoped TASKS/STATE/LESSONS read-write per owning agent).
- Each server needs: versioned manifest, least-privilege tool list, per-call
  authorization hook, secret-redaction filter (deny patterns: keys, tokens,
  credentials — test with canary values), idempotency-key support, per-Work-item
  cost/latency budget fields.
- Verify: redaction test (canary secret never appears in any emitted event);
  budget-exceeded test (over-budget call refuses with receipt, does not execute);
  duplicate tool-call test (same idempotency key, one effect).
- Accept: all three tests green; no credential bytes in any Commons event ever
  (standing falsifier).

### 7. Waiting policy — Steward drafts, CFA-04/CFA-09 ratify safety parts
- Deliverable: one policy file (location: `AGENTS_CONTEXT/AGENT-COMMONS/`, name
  TBC by Steward) fixing: default handoff TTL + escalation path; first-accept-wins
  with loser-reason; detach-on-wait (resumption is always a new session);
  STATUS-progress format; human-question routing; max-attempts/backoff/quarantine;
  team-view projection fields.
- Verify: scenario tests for expiry-escalation, double-claim, and runaway
  (bounded loop that must quarantine by attempt N, asserted).
- Accept: policy file exists, tests green, CFA-04/CFA-09 sign-off recorded.

## Phase 4–5

### 8. Self-rebase slice
- Requires: Phases 2b+3 green. Needs: CFA-09 change contract, CFA-04 gate record,
  per-CFA diff proposals, rollback plan, Steward reconciliation record.
- Accept: rolled-forward or rolled-back with lineage intact — either outcome is a
  pass if the records exist; silent history rewrite is the only fail.

### 9–10. Operations + integration
- Digest automation + receipt sweep (counts from item 3, automated).
- Cycle 4 re-evaluation memo (one page: still the right slice? evidence?).
- Integration PRs per Git protocol when `.opencode/README.md` resume conditions
  hold; commons refs never merged; one coherent unit per PR.

## Standing falsifiers (any phase)

- Transport-divergent event → build fails. Consequential effect without gate-time
  Authority result + receipt → defect. Credential bytes in an event → slice
  invalid. Lineage break without additive repair → integration blocked.
