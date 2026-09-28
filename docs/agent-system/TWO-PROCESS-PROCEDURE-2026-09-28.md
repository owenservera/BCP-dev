# Two-Process Procedure — Interim for the Blocked Two-Host v0 Proof

> Date: 2026-09-28 · Base: `main` @ `f1c971ad`
> Status: PROCEDURE ONLY — the exchange run is NOT executed here (that is S.3, a later wave).
> Owner: `runtime-constitution-core-substrate` (CFA-10) · Goal `finish-full-list`, wave W1, unit A
> Authority: derived operational procedure; not Ω law, not Commons semantics, not a boundary activation.
> Lineage: `FULL-SYSTEM-TEST-GAPS-AND-PREP-2026-09-28.md` (gap 3, prep P3) ·
> `FULL-INTEGRATION-TASK-LIST.md` (S.2/S.3) · `AUTONOMOUS-TEAM-ARCHITECTURE-2026-09-28.md` §6 (topology rules) ·
> `SETUP-REQUIREMENTS-2026-09-27.md` Phase 2b item 1 (two-host v0 shape) ·
> `AGENTS_CONTEXT/AGENT-COMMONS/runtime/test/v0-completion.test.ts` (the 10-point bar) ·
> `AGENTS_CONTEXT/GIT-AND-GITHUB-AGENT-PROTOCOL.md` (no-merge collaboration, file ownership).

## 1. Purpose

The two-host v0 proof (H.1) is BLOCKED — no second machine is available. This
procedure is the single-host interim: two independent processes on **one Windows
host** exchange Commons events through the shared remote exactly as two hosts
would, proving multi-session/process operation without claiming partition,
clock-skew, loss-recovery, or cross-machine key-custody realism. Those claims
stay gated on H.1.

S.3 executes this procedure. S.3 passes only if every point in §8 is green and
no falsifier in §9 fires.

## 2. Shell A/B setup (one Windows host)

1. Open **two shells** (PowerShell recommended), designated **Process A** and
   **Process B**. They must be genuinely separate processes: separate working
   directories (§3), separate agent identities and signing keys (§4), no shared
   in-memory runtime, no shared temp state.
2. In each shell, verify the toolchain independently before touching the repo:
   `bun --version`, `git --version`, `opencode --version`. Record all three
   versions per process in the S.3 receipt. Minimums per setup requirements:
   bun ≥ 1.3.14, git ≥ 2.51, opencode 1.18.4.
3. In each shell, resolve the rendezvous ref first: `git ls-remote origin main`.
   Both processes must start from the **same** `origin/main` SHA. Record that
   SHA in the S.3 receipt as the run baseline. If the SHAs differ, stop: re-sync
   and restart — a run across divergent baselines is not evidence.
4. Windows note: git child-process spawns are slow on Windows (~19 s observed
   for suite-scale runs in `v0-completion.test.ts`, which carries a 180 s
   timeout). S.3 must use generous timeouts and must not mistake slowness for
   divergence.

## 3. Repo clones/copies per process

Each process gets its **own working copy**. Never share one working directory
between processes (file locks, index races, and identity-home collisions would
invalidate the run).

- Preferred: two git worktrees off one local clone of current `origin/main`:
  `git worktree add ../BCP-dev-procA <baseline-SHA>` and
  `git worktree add ../BCP-dev-procB <baseline-SHA>`.
- Acceptable alternative: two full clones of the remote at the baseline SHA.
- Forbidden: the same directory, nested copies, or a copy made by plain
  filesystem duplication without verifying `git status -sb` shows the baseline
  SHA and a clean tree in each copy.
- Each copy configures its own commit identity (`git config user.email` /
  `user.name` locally); git author/committer attribution is lineage only and is
  never treated as Commons identity (Git protocol, commit discipline).
- Teardown after the run: remove worktrees with `git worktree remove`, or
  delete clone directories. Teardown commands and their output go in the S.3
  receipt so a later session can confirm no residue.

## 4. Distinct agent identities per process

- Process A runs as one agent identity (e.g. `S3-ALPHA`), Process B as a
  **different** agent identity (e.g. `S3-BETA`). Distinct `agent_id`s,
  distinct keypairs, distinct agent homes — mirroring the v0 test's
  `V0-ALPHA` / `V0-BETA` pair.
- Each process loads-or-creates its identity exactly as the v0 test does
  (load twice → same key material both times proves stability; cross-process
  public keys must differ).
- Signing keys live in per-process home directories and are never copied
  between processes. A key appearing in both processes is a stream fork, not
  sharing, and fails the run (§9, F2).
- No process may publish, append to, or push the other process's
  `commons/<agent_id>` stream (§5).

## 5. Shared remote (`origin/main`) as rendezvous

- `origin/main` is the **single rendezvous**. All cross-process exchange travels
  through the remote; there is no side channel (no shared files, no local-only
  refs, no chat-pasted event bodies treated as delivery).
- Commons exchange uses persistent agent-owned branches `commons/<agent_id>`
  (Git protocol, branch classes): each process pushes its own stream branch to
  the remote and fetches the peer's stream branch from the remote.
- `main` itself is rendezvous for *baseline and integration only*: the common
  baseline SHA (§2.3) and, after a green run, the S.3 evidence commit. `main`
  is never used as a message bus — no test events are committed to `main`.

## 6. One-writer-per-file/stream rule

- **One writer per stream:** only the owning process writes `commons/<agent_id>`
  for its own `agent_id`. The peer reads it; the peer never writes it.
- **One writer per file:** during the run, any shared durable file has exactly
  one temporary owner. If both processes need one file, the owner is designated
  up front in the S.3 run plan; the other process communicates needs via
  Commons REQUEST/HANDOFF, never via concurrent edit.
- Contention resolves via handoff, never via concurrent edit or via merging
  peer branches (§6 of the architecture doc, §7 below).

## 7. Fetch-and-inspect (never merge-to-communicate)

Reading peer state must never mutate the reader's history:

- Allowed: `git fetch origin`, then `git show origin/commons/<peer>`,
  `git log origin/commons/<peer>`, file/branch views at exact SHAs, or
  checking the peer branch out to a disposable temp ref for inspection.
- Forbidden for communication purposes: `git merge origin/commons/<peer>`
  (into own stream branch, a work branch, or `main`), rebasing onto the peer
  branch, or cherry-picking peer stream commits to "make a handoff visible".
  Per the Git protocol: branches are for changes, Commons is for communication
  — do not merge to communicate.
- A run whose evidence contains a merge of a peer Commons branch for
  communication purposes is invalid even if all assertions pass (§9, F9).

## 8. The 10-point exchange run procedure (S.3 executes)

S.3 runs the v0 bar across the process boundary: the same ten points as
`AGENTS_CONTEXT/AGENT-COMMONS/runtime/test/v0-completion.test.ts`, with the two
runtimes living in Process A / Process B and synchronizing through the shared
remote (§5) instead of a temp-dir bare repo — **plus** point 11, the
cross-process attention check. The preferred execution is a script derived
verbatim from the v0 test's ten steps with only the transport roots repointed
at the two working copies and the remote; any deviation from the v0 assertions
must be named in the S.3 receipt with justification.

1. **Stable identities.** Each process loads its identity twice: same key
   material both times; A and B public keys differ. Assert and log both.
2. **Separate signed streams.** A publishes an ANNOUNCEMENT, B publishes an
   ANNOUNCEMENT; each verifies the other's event against the other's public
   key (`verifyEvent` true both directions).
3. **Synchronize through Git.** A syncs (push own stream, fetch peer), then B
   syncs; each process reads back events of both `agent_id`s — each sees the
   other's event.
4. **Public feed discovery.** Both processes return non-empty
   `commons.public` history.
5. **Room creation.** A creates a room naming the procedure run (e.g.
   `s3-two-process-room`) with B as member; room id starts with `room:`.
6. **Message exchange in the room.** A sends an OBSERVATION (NORMAL/INBOX,
   ROOM-visible); B syncs, reads it, replies; both sync; both histories show
   length 2.
7. **Deterministic direct conversation.** A DMs B and B DMs A (ATTENTION/LIVE);
   after sync both histories for the single deterministic id
   `direct:<A>:<B>` (sorted) show length 2 — one conversation, not two.
8. **Replay into equivalent state.** Both processes fold all read events: equal
   message counts, equal message-key sets, equal room-membership sets.
9. **Duplicate delivery tolerated.** Re-appending known events on either side
   changes nothing (event count before == after).
10. **Raw history preserved while views derive.** Record raw event count; derive
    inbox (non-empty) and a context package (hot non-empty); raw count
    unchanged afterwards.
11. **Cross-process attention check (the S.3 addition).** A publishes an
    ATTENTION-level event addressed to B; after B syncs, the event is visible
    in **both** inboxes (A's outbox-side inbox view and B's inbox); B replies
    or acknowledges; after A syncs, the acknowledgement is visible in both
    inboxes. Log message ids, delivery levels, and both inbox snapshots in the
    S.3 receipt. This is the acceptance delta over v0: attention/handoff
    visible across the process boundary in both directions.

Evidence to commit with the S.3 receipt: baseline SHA (§2.3), per-process
toolchain versions, both `agent_id`s (never the private keys), room id, DM
conversation id, all message/event ids, inbox snapshots for point 11, full
transcript/exit codes, and teardown output.

## 9. Exact falsifiers (what fails the run)

Any one of these fails S.3, regardless of how many other points are green.
A failed run is reported BLOCKED or PARTIAL with the fired falsifier named —
never massaged green.

- **F1 — bad signature.** Any exchanged event fails `verifyEvent` against its
  author's public key.
- **F2 — identity collision.** Both processes present the same `agent_id` or
  the same key material; or one process writes the other's stream.
- **F3 — sync blindness.** After both syncs, either process's read misses any
  event the peer published before the sync.
- **F4 — room divergence.** Room history lengths or contents differ between
  processes after the final sync.
- **F5 — DM split.** The two DMs land in anything other than exactly one
  deterministic `direct:<sorted>` conversation with length 2 on both sides.
- **F6 — fold divergence.** Folded state differs: message counts, message-key
  sets, or room-membership sets.
- **F7 — duplicate intolerance.** Re-appending known events changes the event
  count.
- **F8 — view mutates history.** Raw event count changes as a result of inbox
  or context-package derivation.
- **F9 — merge-to-communicate.** Any merge of a peer `commons/<agent_id>`
  branch performed to read, exchange, or surface communication. Invalidates
  the run even with green assertions.
- **F10 — credential leak.** Credential bytes (keys, tokens, secrets, private
  key material) appear in any event. Invalidates the slice, not just the point
  (standing falsifier).
- **F11 — attention invisible.** The point-11 ATTENTION event or its
  acknowledgement is missing from either inbox after sync plus a documented
  settle window.
- **F12 — transport divergence.** An event validating on one process fails to
  validate on the other after sync (standing falsifier: divergence fails the
  build/run).
- **F13 — baseline or toolchain drift.** Processes ran on different baseline
  SHAs, shared a working directory, or skipped toolchain recording — the run
  is not evidence and must be redone, not retro-justified.

## 10. Explicit non-goals and non-claims

- This procedure proves **nothing** about two-host operation: network
  partitions, clock skew, packet loss recovery, and cross-machine key custody
  stay gated on H.1, which remains BLOCKED (no second machine).
- No production implementation, no shared-boundary activation, no Ω-law
  change, no daemon/presence continuity claim (kill-daemon realism belongs to
  P6), no A2A-live or MCP-mesh claim (Phase 3, separately gated).
- A green S.3 run unblocks S.4 (multi-session standing practice) on a single
  host; it does not unblock H.1.

## 11. Handoff to S.3

S.3 (a later wave) executes §8 against this procedure, commits the evidence
listed there plus a canonical session receipt, and reports DONE only via the
Durable Completion Gate (receipt + TASKS.md closure verified on the delivery
ref). If the S.3 session lacks a repository-write path, it reports BLOCKED —
it does not substitute a chat transcript for evidence.
