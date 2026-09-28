# CFA-04 — M0/M1 Execution-Receipt Authority Requirements
## 2026-09-28 · INVESTIGATED

> Scope: RESEARCH ONLY. Defines the AUTHORITY preconditions for a legitimate
> M1 EXECUTION / IMPLEMENTED claim. No code changed, no authority activated,
> no Ω law touched, no peer home edited, no TASKS.md updated (per mission envelope).

```text
SESSION_STATUS: INVESTIGATED
SESSION_ID: CFA04-M0M1-AUTHORITY-20260928
CFA / AGENT: CFA-04 — Authority / Governance Steward
IDENTITY: RATIFIED — OWNER-ALIGNED (OWNER-ALIGNMENT-2026-09-27.md)
AGENT_ID: authority-governance
TARGET_REF: main @ e181820502f1a5ea572ed51b98cebd3af0b9c5ae
BASE_MAIN_SHA: e181820502f1a5ea572ed51b98cebd3af0b9c5ae
TASK: Define AUTHORITY requirements for M1 execution receipts (preconditions,
  exact-agent fail-closed, one-writer + revocation, return-to-deliberation triggers)
EXECUTION_STRATEGY: deliberate read-only reconciliation of standing delegation,
  completion gate, result contract, corridor evidence pack, Stage-E L2
  characterization, seam reconciliation, and two-process procedure; no work-*
  leaves spawned (read-only task, no execution needed)
STRATEGY_RATIONALE: mission is semantic authority definition; all source
  artifacts are durable and current on BASE_MAIN_SHA; spawning leaves would add
  no evidence
RESULT: INVESTIGATED
FILES_CHANGED: AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SUBAGENTS/AUTHORITY-GOVERNANCE/RESULTS/CFA04-M0M1-AUTHORITY-20260928.md (this receipt, uncommitted)
COMMIT_SHA: NONE (no commit; research-only session)
PREDECESSOR_VERIFIED: YES — BASE_MAIN_SHA matches HEAD e1818205; working tree
  clean except 2 known untracked auto-exports left alone; design branch
  24e5b88e not checked out (read-only reference only)
OWNER_ALIGNMENT: OWNER-ALIGNMENT-2026-09-27.md; standing delegation
  OWNER-DELEGATION.md (10-name list; budgets deferred; commons-daemon deferred)
LESSONS_UPDATED: NO (no reusable learning beyond this receipt; no LESSONS.md write per envelope)
COMMONS: NONE (no Commons transport used; repository receipt is the live completion surface)
UNRESOLVED: runtime immutable source binding for law/policy basis (Stage-E L2
  PARTIAL, known); exact physical AuthorityCitation storage/join; Work-vs-Attempt
  attachment/cardinality — all preserved as UNKNOWN, none inferred
BLOCKERS: NONE for this research task
BOUNDARIES_ACTIVATED: NONE (all shared boundaries remain UNACTIVATED)
OMEGA_LAW_CHANGED: NO
IMPLEMENTATION_STARTED: NO
NEXT_REQUIRED_STEP: Steward consumes this receipt as the CFA-04 authority input
  to the M1 execution-receipt validator; CFA-04 takes no further action unless
  Steward reconciliation identifies a specific authority evidence gap
```

## 1. Authority preconditions for a legitimate EXECUTION / IMPLEMENTED claim

An M1 session may claim EXECUTION / IMPLEMENTED only when **all** rows hold.
A claim missing any row is REPORTED-UNVERIFIED at best, illegitimate at worst.

| # | Precondition | Content | Enforcement | Source |
|---|---|---|---|---|
| P1 | Standing delegation covers the actor | Acting `agent_id` is one of the exact 10 names in OWNER-DELEGATION.md, spawned by the Steward inside a wave serving an owner-stated goal | PROCEDURAL (documented roster; not a mechanically unbypassable allowlist — delegation file says so explicitly) | OWNER-DELEGATION.md §§ Who-may-be-spawned, Technical-enforcement-boundary |
| P2 | No Ω-law change | CURRENT-INVARIANTS.md, BUILD-DECISIONS.md, D-records untouched; D-412/D-452/D-453/D-454/D-455 usable as authority *basis*, never edited by the session | MECHANICAL (reviewable diff) + PROCEDURAL (validator rejects any Ω-law diff in an execution wave) | OWNER-DELEGATION.md Authority-limits; evidence pack §9 |
| P3 | No UNACTIVATED boundary crossed | Session stays inside its CFA semantic ownership; any consequential composition/evolution/self-change needs its explicit authorization gate (D-455 / CFA-07 / CFA-09 seam) | PROCEDURAL (validator checks ownership map); MECHANICAL where K0 admission/fencing applies | CORE-AGENT.md Peer-interfaces; OWNER-DELEGATION.md |
| P4 | Live gate-time authorization, not stored permission | `invoke.check@1` framed result on a complete D-452 frame, with live consent resolved via `law.describe@1` at decision time; a stored AuthorityCitation / prior receipt is reconstruction only, never permission | MECHANICAL (gate refuses: INVOKE_AUTHORITY_UNRESOLVED / SCOPE_EXCEEDED / FRAME_MISSING) + SEMANTIC (citation ≠ authorization) | Evidence pack §§3–6; seam reconciliation §§3–4 |
| P5 | Exact-agent attribution | The session that did the work is the session named in the receipt (AGENT_ID, identity, wave envelope); see §2 | PROCEDURAL validator check (fail-closed); git authorship is lineage only, never identity proof | Result contract §Commons-convergence; §2 below |
| P6 | Durable completion transaction | Required artifacts + canonical RESULTS receipt + TASKS.md closure + exact commit/ref + final re-read of delivery ref verifying both present | PROCEDURAL (Durable Completion Gate, 7-step sequence) | DURABLE-COMPLETION-GATE-2026-09-28.md; SESSION-RESULT-CONTRACT.md v1.1 |
| P7 | Claim tier honesty | DESIGN ≠ IMPLEMENTED ≠ INTEGRATED ≠ LIVE; recorded-fixture/test proof ≠ live external proof (authenticated owner-machine execution still UNVERIFIED for the M1 corridor) | PROCEDURAL (validator checks evidence tier against claim verb) | Evidence pack §§4, 11; GRAPH-W1-B projection contract |
| P8 | Revocation liveness | Delegation file present, readable, unaltered since last read; cited consent/standing/delegation live at gate time (D-453 expiry, D-454 attenuation); revoked/expired → refusal, never execution | MECHANICAL at gate + PROCEDURAL at wave start | OWNER-DELEGATION.md Revocation/Stop-conditions; D-453/D-454 |

## 2. Exact-agent authority verdict

**Verdict: silent fallback to any other agent — including the Steward — is an
authority defect, and the validator must REJECT the resulting execution claim.**

- The delegation authorizes the Steward to *spawn* the ten named CFAs; it does
  not authorize the Steward (or a sibling CFA, or a `work-*` leaf outside its
  envelope) to *perform* their domain work. A CFA may spawn only `work-*`
  leaves; leaves hold no Commons identity, persist nothing, spawn nothing.
  Cross-CFA need travels as Commons REQUEST/HANDOFF, executed as a separately
  spawned session — never as silent substitution.
- A receipt whose AGENT_ID / work envelope does not match the session that
  produced the artifacts fails P5. The validator must treat agent mismatch as
  fail-closed: REJECT the EXECUTION/IMPLEMENTED claim, classify at best as
  REPORTED-UNVERIFIED, route to re-execution by the delegated agent — not to
  adoption of the orphaned work.
- Rationale in CFA-04 invariants: Identity ≠ Authority; MESSAGE ≠ TRUTH.
  A correct artifact with unattributed authorship is an unattributed claim
  (result contract: treat repository authorship as unattributed until verified).
  Convenience substitution is precisely the "remove semantic authority from
  another CFA for convenience" forbidden by CORE-AGENT.md decision rights, and
  the "Steward as product architect of every domain" non-goal of the M0 design.
- **What the validator must REJECT (exact-agent rule):** AGENT_ID not on the
  10-name roster; receipt AGENT_ID ≠ envelope agent; Steward-authored CFA
  domain semantics; leaf-persisted or leaf-spawned work; Commons stream event
  from a non-owner writer; git author/committer presented as Commons identity.
- **Mechanical vs procedural:** the opencode binding evidence (Steward
  `task: true`, CFAs `task: false`) enforces spawn *direction* mechanically;
  the 10-name restriction itself is PROCEDURAL until a name-scoped permission
  mechanism is verified and wired. The validator is therefore a procedural
  gate with fail-closed semantics — it must not claim unbypassable enforcement
  it does not have.

## 3. One-writer rule + revocation for the M1 corridor

- **One writer per Commons stream:** only the owning `agent_id` writes
  `commons/<agent_id>`; peers fetch and inspect, never write, never merge
  peer branches to communicate (branches are for changes; Commons is for
  communication).
- **One writer per file:** during an execution run each shared durable file has
  exactly one designated owner; contention resolves via REQUEST/HANDOFF, never
  via concurrent edit (two-process procedure §6; GIT-AND-GITHUB-AGENT-PROTOCOL).
- **Own-home receipts only:** a session writes RESULTS receipts and TASKS.md
  updates in its own home directory exclusively; editing another agent's home
  is outside every delegation limit.
- **Revocation handling:** (a) wave level — missing/unreadable/materially
  altered OWNER-DELEGATION.md ⇒ spawning unauthorized, ask owner; (b) gate
  level — expired/revoked consent, out-of-scope frame, principal mismatch,
  frameless mutation ⇒ deterministic refusal (INVOKE_AUTHORITY_UNRESOLVED /
  SCOPE_EXCEEDED / FRAME_MISSING) **plus** independently observed target
  non-execution — refusal alone does not prove the negative corridor
  (evidence pack §6); (c) completion level — REPORTED-UNVERIFIED claims must
  not advance any downstream gate (anti-loop invariant: Next first attempts
  durable completion verification, never auto-repeats the research).
- **Mechanical vs procedural:** gate refusals and K0 fencing are MECHANICAL;
  one-writer-per-stream/file, no-merge-to-communicate, and revocation-stop
  discipline are PROCEDURAL. Both layers must hold; neither substitutes for
  the other (cf. falsifier F-ACP.3 refusal leakage, F-ACP.4 evidence collapse).

## 4. Return-to-deliberation triggers (authority ambiguity)

An execution task returns to DELIBERATION (stops, reports BLOCKED/PARTIAL, does
not improvise) when any of the following holds — ambiguity is a stop condition,
not a coin flip:

1. Acting authority ambiguous: delegation missing, expired, unresolvable, or
   the task's agent/envelope is not clearly inside it.
2. Peer-boundary dispute not resolved by the delegation (semantic ownership
   conflict, e.g. citation storage/join placement, Work-vs-Attempt attachment).
3. Ω-law collision: the task as specified would require changing ratified law
   or an UNACTIVATED shared boundary.
4. Owner-policy question: the decision is the owner's personal policy, not a
   derivable semantic (see §5).
5. Missing Commons identity/key/signing capability required for attributable
   execution.
6. Receipt-write path unavailable (cannot leave the durable receipt ⇒ BLOCKED/
   PARTIAL, never chat-only DONE).
7. Contradictory authority basis (CONFLICTED) or unattributable basis
   (UNRESOLVABLE), including the known Stage-E L2 residual: runtime immutable
   source binding UNKNOWN (empty manifest contentHash, no policy digest in
   `law.describe@1`) — if the M1 receipt bar requires immutable-source
   binding, this forces return to deliberation rather than version-only
   hand-waving (falsifier: material rule change at retained version 1.9.0).
8. Steward reconciliation identifies a specific evidence gap in this or any
   predecessor authority input.

## 5. Owner-only questions

1. **Proof bar for IMPLEMENTED:** is recorded-fixture/test evidence sufficient
   for an M1 IMPLEMENTED claim, or is authenticated owner-machine live external
   execution required before the verb IMPLEMENTED (vs DESIGNED/PROVEN-in-fixture)
   may be used? (Semantic authority cannot set this bar; it is owner policy.)
2. **Steward fallback tolerance:** if a delegated CFA session is unavailable,
   may the Steward produce that CFA's domain content provisionally, or must the
   wave wait / re-spawn (fail-closed exact-agent)? Recommended: fail-closed wait.
3. **Standing duration for M1 execution waves:** the current delegation defers
   step/cost budgets and leaves revocation to file edit — does the owner want
   explicit per-wave scope/duration/expiry recorded in SESSION-CONTEXT.md so
   standing expiry (D-453 semantics) is checkable rather than open-ended?

## 6. Falsifiers for this authority definition

- F-AUTH-M1.1: an EXECUTION/IMPLEMENTED claim with no live `invoke.check@1`
  framed result is accepted ⇒ this definition is violated.
- F-AUTH-M1.2: a stored citation or prior receipt is accepted as current
  permission ⇒ historical/live collapse; definition violated.
- F-AUTH-M1.3: work by a non-delegated or substituted agent is ratified
  without re-execution ⇒ exact-agent rule violated.
- F-AUTH-M1.4: a REPORTED-UNVERIFIED claim advances a downstream gate ⇒
  completion-gate violation.
- F-AUTH-M1.5: CFA-04 (or any CFA) defines peer-owned storage/execution
  semantics instead of consuming peer inputs ⇒ ownership leakage.

## 7. Non-actions (envelope compliance)

No production code written. No Ω law changed. No boundary activated. No peer
home edited. No TASKS.md updated (explicitly forbidden by mission). No commits
made. No leaves spawned. No Commons traffic emitted. Design branch untouched.
