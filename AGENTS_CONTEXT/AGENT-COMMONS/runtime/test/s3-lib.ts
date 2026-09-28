// s3-lib.ts — shared helpers for Wave-3 unit S.3 (finish-full-list, two-process run).
//
// AUTHORSHIP ONLY (unit S.3a, MODE=DELIBERATE). This file is never executed by
// its author; the Steward executes it in S.3b per the receipt command list.
// Goal `finish-full-list`, wave W3, unit S.3. Authority: TWO-PROCESS-PROCEDURE
// §§2–11 (derived procedure, not Omega law) + v0-completion.test.ts (10-point bar).
//
// ## What this file is
// Pure helpers shared by s3-procA.ts / s3-procB.ts, plus a small CLI used ONLY
// by S.3b step (4):
//   bun s3-lib.ts --compare <evidenceA.json> <evidenceB.json> --baseline <SHA>
//   (cross-process convergence checks that no single process may assert alone)
// No network. No merges. No pushes to origin. No sleeps/polls (anti-hang: every
// git op is a synchronous local subprocess against the file-path bare remote).
//
// ## Falsifier index (F1–F13, procedure §9) — where each is checked
//   F1  bad signature ............ procs (own + peer verify) + verify-converged
//   F2  identity collision ....... procs (stability, cross-pubkey) + compare
//   F3  sync blindness ........... procB (both agent_ids visible) + compare
//   F4  room divergence .......... procB (len 2) + compare/verify-converged
//   F5  DM split ................. procB (single direct: id, len 2) + verify
//   F6  fold divergence .......... compare (superset) + verify-converged (equal)
//   F7  duplicate intolerance .... procs (re-append, count unchanged)
//   F8  view mutates history ..... procs (raw count before/after inbox+context)
//   F9  merge-to-communicate ..... procs (no merge cmds; merge-commit scan) + compare
//   F10 credential leak .......... procs (payload secret scan) + compare
//   F11 attention invisible ....... procB + compare + verify-converged (both inboxes)
//   F12 transport divergence ..... procs (peer verify with peer pubkey) + verify
//   F13 baseline/toolchain drift . procs (record) + compare (heads equal, dirs differ)
//
// Imports: bun/node stdlib only + compile-time `import type` from existing
// runtime src (erased at runtime; zero network installs).

import { spawnSync } from "node:child_process";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { CommonsEvent } from "../src/types.js";
import type { Projection } from "../src/fold.js";

// Bun runtime flag for "run as CLI entrypoint" (typed locally so no extra
// @types dependency is needed; erased at compile time).
declare global {
  interface ImportMeta {
    readonly main?: boolean;
  }
}

// ---------------------------------------------------------------------------
// argv
// ---------------------------------------------------------------------------

export interface S3Args {
  root: string; // per-process worktree dir (procA/procB checkout, never shared)
  remote: string; // local bare repo FILE PATH (all exchange travels here)
  run: string; // run name, e.g. s3-20260928 (evidence naming + room-name filter only)
  phase: string; // procA only: "init" (default) | "verify"
  evidenceB: string; // procA --phase verify: path to procB evidence JSON
  compareA: string; // --compare: evidence A path
  compareB: string; // --compare: evidence B path
  baseline: string; // --compare: expected BASE_MAIN_SHA
}

export function parseArgs(argv: string[]): S3Args {
  const get = (k: string): string | null => {
    const i = argv.indexOf(k);
    return i >= 0 && i + 1 < argv.length ? argv[i + 1] : null;
  };
  return {
    root: get("--root") ?? "",
    remote: get("--remote") ?? "",
    run: get("--run") ?? "",
    phase: get("--phase") ?? "init",
    evidenceB: get("--evidence-b") ?? "",
    compareA: get("--compare-a") ?? get("--compare") ?? "",
    compareB: get("--compare-b") ?? "",
    baseline: get("--baseline") ?? "",
  };
}

export function needInitArgs(a: S3Args): void {
  for (const [k, v] of [["--root", a.root], ["--remote", a.remote], ["--run", a.run]] as const)
    if (!v) throw new Error(`S3_ARGS_MISSING:${k}`);
}

// ---------------------------------------------------------------------------
// git subprocesses (synchronous, local only; never origin, never merge)
// ---------------------------------------------------------------------------

export function sh(cwd: string, ...args: string[]): string {
  const r = spawnSync("git", args, { cwd, encoding: "utf8" });
  if (r.status !== 0) throw new Error(`S3_GIT_FAILED: git ${args.join(" ")} :: ${r.stderr || r.stdout}`);
  return (r.stdout ?? "").trim();
}

export function trySh(cwd: string, ...args: string[]): string | null {
  const r = spawnSync("git", args, { cwd, encoding: "utf8" });
  return r.status === 0 ? (r.stdout ?? "").trim() : null;
}

export function runCapture(cmd: string, ...args: string[]): string {
  const r = spawnSync(cmd, args, { encoding: "utf8" });
  if (r.status !== 0) return `UNAVAILABLE:${((r.stderr || r.stdout) ?? "").trim().slice(0, 160)}`;
  return (r.stdout ?? "").trim();
}

// Per-process toolchain record (procedure §2.2). Record-only: a missing binary
// is evidence, not a silent skip (F13 fires on SKIPPED recording, not on old
// versions — version minimums are judged by the Steward at S.3b).
export function toolchain(): { bun: string; git: string; opencode: string } {
  return {
    bun: runCapture("bun", "--version"),
    git: runCapture("git", "--version"),
    opencode: runCapture("opencode", "--version"),
  };
}

// Point ALL transport/git I/O at the local bare remote under a fixed name.
// Reads origin's URL read-only for the receipt (proves which remote we did NOT
// use); no fetch/push/ls-remote against origin exists anywhere in this harness.
export const S3_REMOTE_NAME = "s3remote";

export function ensureS3Remote(repoRoot: string, barePath: string): { url: string; originUrl: string } {
  const existing = trySh(repoRoot, "config", "--get", `remote.${S3_REMOTE_NAME}.url`);
  if (existing && existing !== barePath)
    throw new Error(`S3_REMOTE_MISMATCH:${existing} !== ${barePath}`);
  if (!existing) sh(repoRoot, "remote", "add", S3_REMOTE_NAME, barePath);
  const url = sh(repoRoot, "config", "--get", `remote.${S3_REMOTE_NAME}.url`);
  const originUrl = trySh(repoRoot, "config", "--get", "remote.origin.url") ?? "NO-ORIGIN";
  return { url, originUrl };
}

// Create the own stream branch ref WITHOUT checking anything out (worktrees
// stay detached at the baseline SHA; the transport moves refs via update-ref).
// F9: this helper and every caller use only branch/fetch/show/update-ref/push
// of the OWN commons/<id> ref — merge/rebase/cherry-pick appear nowhere.
// NOTE the branch starts AT the baseline HEAD and therefore inherits ALL
// mainline history; F9 mergeCommits() must scan only baseline..branch, never
// the whole branch history (S.3b F9 false-fire, fixed S.3c).
// S.3d fresh-branch guard: stream branch refs are REPO-GLOBAL (shared across
// all worktrees of the repo), so a stale `commons/<id>` ref left by a prior
// run is silently reused by `git branch X HEAD`-when-absent logic and mixes
// foreign history/identity into this run (S.3b-retry: TWO seq-1 event blobs
// on one ref → verifyEventChain fails → read()'s catch{} swallows → silent
// empty → F3 false-fire). Fail CLOSED: a pre-existing ref survives ONLY when
// its tip is exactly this run's baseline AND it carries zero event blobs
// under the home prefix; anything else throws S3_STALE_BRANCH_REUSE.
// SETUP CONTRACT (S.3b step 1, steward-owned): delete stale
// `commons/S3-ALPHA` / `commons/S3-BETA` refs in the MAIN repo BEFORE worktree
// creation and verify absence (`git branch --list "commons/S3*"` prints
// nothing). TEARDOWN CONTRACT (S.3b step 5, steward-owned): delete them AFTER
// the run — the main repo must never retain S3 stream refs.
// S.3e guard (S.3b-retry-2 root cause): the transport's `append()` picks its
// parent as `remoteHead ?? localHead ?? main` where remoteHead is
// `refs/remotes/<remote>/<branch>`. That TRACKING ref is repo-global, survives
// both `worktree remove` and deletion of the bare-remote directory, and is
// invisible to `git branch --list` (which lists only local heads). A surviving
// tracking ref made append() build on the prior run's history — importing its
// identity blob, so this run's events were signed by a key the ref did not
// carry → verifyEventChain threw → read()'s catch{} swallowed → silent empty →
// F3 false-fire, then S3_IDENTITY_BLOB_MISMATCH once the ref was visible. The
// S.3d guard above only inspected LOCAL heads and therefore missed it. This
// check makes stale tracking state impossible rather than merely unlikely.
export function assertNoStaleTrackingRefs(repoRoot: string, remote: string): void {
  const tracking = (trySh(repoRoot, "for-each-ref", "--format=%(refname)", `refs/remotes/${remote}`) ?? "")
    .split("\n").map((s) => s.trim()).filter((s) => s !== "");
  if (tracking.length !== 0) {
    throw new Error(`S3_STALE_TRACKING_REFS:${remote} has ${tracking.length} stale tracking ref(s): ${tracking.join(",")} (delete the remote with \`git remote remove ${remote}\` before a fresh run; append() would inherit that history)`);
  }
}

export function ensureOwnBranch(repoRoot: string, branch: string, baseline: string, home: string): void {
  if (!baseline) throw new Error("S3_BASELINE_MISSING:fresh-branch guard requires baselineHead");
  if (!home) throw new Error("S3_HOME_MISSING:fresh-branch guard requires agent home prefix");
  assertNoStaleTrackingRefs(repoRoot, S3_REMOTE_NAME);
  const existing = trySh(repoRoot, "rev-parse", "--verify", `refs/heads/${branch}`);
  if (!existing) {
    const head = sh(repoRoot, "rev-parse", "HEAD");
    if (head !== baseline) throw new Error(`S3_BASELINE_MISMATCH:worktree HEAD ${head} !== baseline ${baseline}`);
    sh(repoRoot, "branch", branch, "HEAD");
    return;
  }
  if (existing !== baseline) throw new Error(`S3_STALE_BRANCH_REUSE:${branch} tip ${existing} !== baseline ${baseline} (prior-run ref reused; delete commons/S3-* before retry)`);
  const prefix = `${home}/commons/stream/events`;
  const names = trySh(repoRoot, "ls-tree", "-r", "--name-only", existing, "--", prefix) ?? "";
  const blobs = names.split("\n").map((s) => s.trim()).filter((s) => s.endsWith(".json"));
  if (blobs.length !== 0) throw new Error(`S3_STALE_BRANCH_REUSE:${branch} carries ${blobs.length} pre-existing event blobs at tip==baseline (stale reuse forbidden)`);
}

// F9 evidence: any merge commit UNIQUE to the stream branch invalidates.
// The scan MUST be scoped to the baseline..branch range: an unscoped
// `git log --merges <branch>` walks the inherited mainline history and
// false-fires on mainline integration merges (S.3b F9 false-fire, fixed S.3c).
// Fail-closed: an empty baseline throws instead of silently scanning unscoped.
export function mergeCommits(repoRoot: string, branch: string, baseline: string): string[] {
  if (!baseline) throw new Error("S3_BASELINE_MISSING:F9 scan requires baseline..branch scope");
  const out = trySh(repoRoot, "log", "--merges", "--format=%H", `${baseline}..${branch}`) ?? "";
  return out.split("\n").map((s) => s.trim()).filter(Boolean);
}

// Read-observability asserts (S.3d hardening, harness-side only — NO src/
// changes): after sync, BEFORE trusting read(), prove via direct git commands
// that the ref state is what this run just wrote. Transport read() swallows
// per-ref verification failure via `catch {}` (OBSERVED defect, flagged for
// CFA-09 — see S.3d receipt; not fixed here), so a future silent-empty trips
// a NAMED assert here instead of a mystery F3 downstream. All three checks
// are feasible without src/ changes (pure rev-parse / ls-tree / show).
export function assertRefSynced(repoRoot: string, branch: string): void {
  const local = trySh(repoRoot, "rev-parse", "--verify", `refs/heads/${branch}`);
  const tracking = trySh(repoRoot, "rev-parse", "--verify", `refs/remotes/${S3_REMOTE_NAME}/${branch}`);
  if (!local || !tracking) throw new Error(`S3_SYNC_REF_MISSING:${branch} local=${local ?? "ABSENT"} tracking=${tracking ?? "ABSENT"} (do not trust read())`);
  if (local !== tracking) throw new Error(`S3_SYNC_DIVERGED:${branch} local ${local} !== tracking ${tracking} (push/sync did not converge; do not trust read())`);
}

export function assertEventBlobs(repoRoot: string, ref: string, home: string, minCount: number, label: string): void {
  const names = trySh(repoRoot, "ls-tree", "-r", "--name-only", ref, "--", `${home}/commons/stream/events`) ?? "";
  const n = names.split("\n").map((s) => s.trim()).filter((s) => s.endsWith(".json")).length;
  if (n < minCount) throw new Error(`S3_EVENT_BLOBS_MISSING:${label}: ${n} < ${minCount} under ${home}/commons/stream/events at ${ref}`);
}

export function assertIdentityBlob(repoRoot: string, ref: string, home: string, pubkey: string, label: string): void {
  const raw = trySh(repoRoot, "show", `${ref}:${home}/commons/identity/agent.json`);
  if (!raw) throw new Error(`S3_IDENTITY_BLOB_MISSING:${label}: no ${home}/commons/identity/agent.json at ${ref}`);
  const pem = (JSON.parse(raw) as { public_key_pem?: string }).public_key_pem;
  if (pem !== pubkey) throw new Error(`S3_IDENTITY_BLOB_MISMATCH:${label}: ref identity is not this run's pubkey (stale-run identity mixed in?)`);
}

// ---------------------------------------------------------------------------
// fold / inbox summaries (evidence JSON payloads)
// ---------------------------------------------------------------------------

export interface FoldSummary {
  messageCount: number;
  messageKeys: string[]; // sorted message_ids
  rooms: Record<string, { members: string[]; status: string; name?: string }>;
  conversationCount: number;
}

export function summarizeFold(p: Projection): FoldSummary {
  const rooms: FoldSummary["rooms"] = {};
  for (const [id, c] of p.conversations)
    if (id === "commons.public" || id.startsWith("room:"))
      rooms[id] = {
        members: [...c.members].sort(),
        status: c.status,
        ...(c.name ? { name: c.name } : {}),
      };
  return {
    messageCount: p.messages.size,
    messageKeys: [...p.messages.keys()].sort(),
    rooms,
    conversationCount: p.conversations.size,
  };
}

export interface InboxEntry {
  message_id: string;
  conversation_id: string;
  kind: string;
  level: string;
  delivery: string;
}

export function snapshotInbox(ms: readonly { message_id: string; conversation_id: string; kind: string; attention: { level: string; requested_delivery: string } }[]): InboxEntry[] {
  return ms.map((m) => ({
    message_id: m.message_id,
    conversation_id: m.conversation_id,
    kind: m.kind,
    level: m.attention.level,
    delivery: m.attention.requested_delivery,
  }));
}

// F10 evidence: credential-shaped bytes must never appear inside event payloads.
// (Standing falsifier: a hit invalidates the slice, not just the point.)
const SECRET_RE = /BEGIN [A-Z ]*PRIVATE KEY|PRIVATE KEY|private-key\.pem|BEGIN OPENSSH PRIVATE/i;
export function scanForSecrets(events: readonly CommonsEvent[]): string[] {
  const hits: string[] = [];
  for (const e of events)
    if (SECRET_RE.test(JSON.stringify(e.payload)) || SECRET_RE.test(e.signature ?? ""))
      hits.push(e.event_id);
  return hits;
}

// ---------------------------------------------------------------------------
// evidence files (one per process, under its OWN root — never a side channel:
// procB must NOT read procA's evidence; only S.3b step (4) reads both)
// ---------------------------------------------------------------------------

export async function writeEvidence(root: string, home: string, run: string, obj: unknown): Promise<string> {
  const path = join(root, home, "evidence", `${run}.json`);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(obj, null, 2) + "\n");
  return path;
}

export async function loadEvidence(path: string): Promise<any> {
  return JSON.parse(await readFile(path, "utf8"));
}

// ---------------------------------------------------------------------------
// S.3b step (4a): pure cross-process comparison of the two evidence JSONs.
// NOTE the deliberate asymmetry: procA/init exited BEFORE procB ran, so A's
// fold is a strict SUBSET of B's. Equality is asserted only post-resync by
// procA --phase verify (step 4b). F6 fires on key-set REGRESSION (B missing an
// A key), never on B ⊃ A growth.
// ---------------------------------------------------------------------------

export interface CompareCheck {
  id: string;
  pass: boolean;
  note: string;
}

export function compareEvidence(a: any, b: any, baseline: string): { pass: boolean; checks: CompareCheck[] } {
  const checks: CompareCheck[] = [];
  const ck = (id: string, pass: boolean, note: string) => checks.push({ id, pass, note });

  ck("F13/baseline-A", a?.baselineHead === baseline, `A HEAD ${a?.baselineHead} vs baseline ${baseline}`);
  ck("F13/baseline-B", b?.baselineHead === baseline, `B HEAD ${b?.baselineHead} vs baseline ${baseline}`);
  ck("F13/heads-equal", a?.baselineHead === b?.baselineHead, `A ${a?.baselineHead} vs B ${b?.baselineHead}`);
  ck("F13/distinct-dirs", a?.procDir !== b?.procDir, `A ${a?.procDir} vs B ${b?.procDir}`);
  ck("F13/versions-recorded", !!(a?.versions?.bun && a?.versions?.git && b?.versions?.bun && b?.versions?.git), "toolchain recorded per process");
  ck("F2/agent-ids-differ", a?.agentId !== b?.agentId, `${a?.agentId} vs ${b?.agentId}`);
  ck("F2/pubkeys-differ", a?.pubkey !== b?.pubkey && !!a?.pubkey && !!b?.pubkey, "cross-process public keys differ");
  ck("F9/no-merges", (a?.mergeCommits?.length ?? 99) === 0 && (b?.mergeCommits?.length ?? 99) === 0, "no merge commits on either stream branch");
  ck("F10/no-secrets", (a?.secretHits?.length ?? 99) === 0 && (b?.secretHits?.length ?? 99) === 0, "no credential bytes in events");
  ck("origin-untouched", a?.originUrl === b?.originUrl, `origin (read-only, never pushed): ${a?.originUrl}`);
  ck("remote-shared", a?.remoteBare === b?.remoteBare, `shared bare rendezvous: ${a?.remoteBare}`);

  const aKeys: string[] = a?.foldSummary?.messageKeys ?? [];
  const bKeys: string[] = b?.foldSummary?.messageKeys ?? [];
  const missing = aKeys.filter((k) => !bKeys.includes(k));
  ck("F3+F6/no-blindness", missing.length === 0, missing.length ? `B misses ${missing.length} A keys` : `B sees all ${aKeys.length} A keys (B total ${bKeys.length})`);

  ck("room-id-agree", a?.ids?.room === b?.ids?.room, `exchange room ${a?.ids?.room}`);
  ck("attention-room-agree", a?.ids?.attentionRoom === b?.ids?.attentionRoom, `attention room ${a?.ids?.attentionRoom}`);
  ck("F4/room-len-2", b?.roomLenAfterReply === 2, `B room history len ${b?.roomLenAfterReply} (A obs + B reply)`);
  ck("F4/room-members", JSON.stringify(b?.foldSummary?.rooms?.[b?.ids?.room]?.members) === JSON.stringify([a?.agentId, b?.agentId].sort()), `members ${JSON.stringify(b?.foldSummary?.rooms?.[b?.ids?.room]?.members)}`);
  ck("F5/dm-len-2", b?.dmLen === 2, `B dm ${b?.ids?.dmId} len ${b?.dmLen}`);
  ck("F5/dm-single-id", b?.ids?.dmId === `direct:${[a?.agentId, b?.agentId].sort().join(":")}`, `deterministic id ${b?.ids?.dmId}`);

  const aInbox: string[] = (a?.inbox ?? []).map((e: InboxEntry) => e.message_id);
  const bInbox: string[] = (b?.inbox ?? []).map((e: InboxEntry) => e.message_id);
  ck("F11/attention-in-A-inbox", aInbox.includes(a?.ids?.attention), "outbox-side view (A member of attention room)");
  ck("F11/attention-in-B-inbox", bInbox.includes(b?.ids?.attention ?? a?.ids?.attention), "B inbox sees ATTENTION msg");
  ck("F11/reply-in-B-inbox", bInbox.includes(b?.ids?.attentionReply), "B inbox sees ack reply");
  ck("F11/ack-recorded", !!b?.ids?.ackEvent, `delivery.acknowledged event ${b?.ids?.ackEvent}`);
  // A-init exited before B's reply existed: reply in A's inbox is asserted by
  // step (4b) verify-converged, NOT here. Assert the expected absence so a
  // forged equality cannot pass silently.
  ck("ordering/A-predates-B-reply", !aInbox.includes(b?.ids?.attentionReply), "A init inbox correctly predates B reply (see 4b)");

  ck("F7/dup-stable", a?.dupAfter === a?.dupBefore && b?.dupAfter === b?.dupBefore, `A ${a?.dupBefore}->${a?.dupAfter}, B ${b?.dupBefore}->${b?.dupAfter}`);
  ck("F8/raw-stable", a?.rawAfter === a?.rawBefore && b?.rawAfter === b?.rawBefore, `A ${a?.rawBefore}->${a?.rawAfter}, B ${b?.rawBefore}->${b?.rawAfter}`);
  ck("views-nonempty", (a?.inbox?.length ?? 0) >= 1 && (b?.inbox?.length ?? 0) >= 1 && (a?.contextHot ?? 0) >= 1 && (b?.contextHot ?? 0) >= 1, "inbox + context hot non-empty both sides (§8.10)");

  return { pass: checks.every((c) => c.pass), checks };
}

// CLI entry for S.3b step (4a). Only runs under `bun s3-lib.ts --compare ...`.
if (import.meta.main) {
  const a = parseArgs(process.argv.slice(2));
  if (a.compareA && a.compareB && a.baseline) {
    const ea = await loadEvidence(a.compareA);
    const eb = await loadEvidence(a.compareB);
    const res = compareEvidence(ea, eb, a.baseline);
    console.log(JSON.stringify(res, null, 2));
    if (!res.pass) {
      console.error("S3_COMPARE_FAIL");
      process.exit(1);
    }
    console.log("S3_COMPARE_PASS");
  } else {
    console.error("Usage: bun s3-lib.ts --compare <evidenceA.json> <evidenceB.json> --baseline <SHA>");
    process.exit(2);
  }
}
