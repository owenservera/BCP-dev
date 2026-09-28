// s3-procA.ts — Wave-3 unit S.3 INITIATOR (S3-ALPHA). AUTHORSHIP ONLY (S.3a).
//
// Run as its own OS process by the Steward in S.3b step (2):
//   bun s3-procA.ts --root <procADir> --remote <bareRepo> --run <runName>
//   bun s3-procA.ts --root <procADir> --remote <bareRepo> --run <runName> --phase verify --evidence-b <bJson>  (S.3b step 4b)
//
// Roles: phase init publishes ANNOUNCEMENT, creates BOTH rooms (exchange +
// attention), sends the OBSERVATION / DM-ping / ATTENTION message, and records
// evidence BEFORE procB exists. Phase verify re-syncs afterwards and asserts
// full convergence against procB's evidence (the only place A⊆B equality may
// be claimed). procB discovers every id by FOLDING this process's stream —
// room/dm ids are NEVER passed out of band (no side channel, §5).
//
// Map to procedure §8 (v0's 10 + §8.11 attention point):
//   §8.1 stable identities .......... load twice, same key (F2 self)
//   §8.2 separate signed streams .... ANNOUNCEMENT + self-verify (F1, F2)
//   §8.3 sync through git ........... push own stream via s3remote (F3 partial)
//   §8.4 public feed ................ own history non-empty
//   §8.5 room creation .............. exchange room + attention room, B member
//   §8.6 message exchange (half) .... OBSERVATION sent; B's reply comes in S.3b(3)
//   §8.7 deterministic DM (half) .... DM ping sent; pong comes in S.3b(3)
//   §8.8 replay (record) ............ fold summary recorded; equality in 4b (F6)
//   §8.9 duplicate tolerance ........ re-append own events, count unchanged (F7)
//   §8.10 raw preserved ............. inbox + context derive, raw unchanged (F8)
//   §8.11 attention (half) .......... ATTENTION msg in attention room; B-side in procB (F11)
//
// Hard rules (checked in code + evidence): local bare remote ONLY (never
// origin — no ls-remote/fetch/push against origin anywhere); never merge (F9);
// one writer per stream (only own commons/S3-ALPHA events appended here, F2).

import { stat } from "node:fs/promises";
import { join } from "node:path";
import { loadOrCreateIdentity, verifyEvent } from "../src/crypto.js";
import { EventFactory } from "../src/events.js";
import { AgentCommons } from "../src/commons.js";
import { GitBranchTransport, agentBranch } from "../src/transports/git.js";
import { fold } from "../src/fold.js";
import { buildContextPackage } from "../src/compaction.js";
import {
  parseArgs, needInitArgs, sh, toolchain, ensureS3Remote, ensureOwnBranch,
  mergeCommits, summarizeFold, snapshotInbox, scanForSecrets, writeEvidence,
  loadEvidence, assertRefSynced, assertEventBlobs, assertIdentityBlob,
  S3_REMOTE_NAME,
} from "./s3-lib.js";

const SELF = "S3-ALPHA";
const PEER = "S3-BETA";
const HOME = "S3-ALPHA";
const PEER_HOME = "S3-BETA";

function assert(c: unknown, msg: string): asserts c {
  if (!c) throw new Error(`S3_ASSERT:${msg}`);
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (args.phase === "verify") {
    await verifyPhase(args);
    return;
  }

  // ---- phase init ---------------------------------------------------------
  needInitArgs(args);
  const { root, remote, run } = args;
  await stat(root); // worktree must already exist (S.3b step 1 created it)
  await stat(remote); // bare rendezvous must already exist
  const toplevel = sh(root, "rev-parse", "--show-toplevel");
  const baselineHead = sh(root, "rev-parse", "HEAD");
  const status = sh(root, "status", "-sb");
  const versions = toolchain(); // §2.2 per-process record (F13)
  const { url: remoteUrl, originUrl } = ensureS3Remote(root, remote);
  const branch = agentBranch(SELF);
  // S.3d: fresh-branch guard (baseline + home) — stale commons/S3-ALPHA reuse
  // from a prior run fails CLOSED here (S3_STALE_BRANCH_REUSE), never silently.
  ensureOwnBranch(root, branch, baselineHead, HOME);

  // §8.1 stable identities (F2 self-half): load twice → identical key material.
  const idDir = join(root, HOME, "commons", "identity");
  const ia = await loadOrCreateIdentity(idDir, SELF, { repoRoot: root, remote: S3_REMOTE_NAME, branch });
  const ia2 = await loadOrCreateIdentity(idDir, SELF, { repoRoot: root, remote: S3_REMOTE_NAME, branch });
  assert(ia.identity.public_key_pem === ia2.identity.public_key_pem, "F2:identity-unstable");
  const pubkey = ia.identity.public_key_pem;

  const factory = new EventFactory(ia.identity, ia.privateKeyPem, `s3a-${run}`);
  const transport = new GitBranchTransport({ repoRoot: root, agentId: SELF, agentHome: HOME, remote: S3_REMOTE_NAME, peerHomes: { [PEER]: PEER_HOME } });
  const commons = new AgentCommons({ agentId: SELF, eventFactory: factory, transport });

  // §8.2 separate signed streams (F1 self-half, F2): own ANNOUNCEMENT verifies.
  const ea = await commons.publish({ kind: "ANNOUNCEMENT", body: { format: "text", content: `s3-alpha-here:${run}` }, attention: { level: "NORMAL", requested_delivery: "INBOX" } });
  assert(ea.agent_id === SELF, "F2:own-stream-owner-mismatch");
  assert(verifyEvent(ea, pubkey) === true, "F1:own-announcement-bad-signature");

  // §8.3 synchronize through git: push own stream to the LOCAL bare remote.
  // Peer events are EXPECTED absent (procB has not run) — not F3; F3 is
  // asserted by procB + compare after both sides have synced.
  await transport.sync();
  // S.3d read-observability: prove ref state via direct git BEFORE trusting
  // read() — transport read() swallows per-ref verify failure (OBSERVED,
  // CFA-09; no src/ change here), so any silent-empty trips a NAMED assert.
  assertRefSynced(root, branch);
  assertEventBlobs(root, branch, HOME, 1, "procA-post-own-sync");
  assertIdentityBlob(root, branch, HOME, pubkey, "procA-post-own-sync");
  const seenAgents = [...new Set((await transport.read({ event_types: ["message.posted"] })).map((e) => e.agent_id))].sort();
  assert(seenAgents.includes(SELF), "F3:self-event-missing-after-own-sync");

  // §8.4 public feed discovery on this runtime.
  const publicHist = await commons.history("commons.public");
  assert(publicHist.length >= 1, "public-feed-empty");

  // §8.5 room creation: exchange room + dedicated attention room (§8.11 needs
  // its own room so §8.6 keeps its exact length-2 shape, F4). Both name the
  // run; procB discovers both by fold (never by side channel).
  const room = await commons.createRoom({ name: `s3-room-${run}`, purpose: "S.3 two-process exchange", members: [PEER] });
  assert(room.startsWith("room:"), "room-id-shape");
  const attentionRoom = await commons.createRoom({ name: `s3-attention-${run}`, purpose: "S.3 cross-process attention check", members: [PEER] });
  assert(attentionRoom.startsWith("room:"), "attention-room-id-shape");

  // §8.6 (half) + §8.7 (half) + §8.11 (half): OBSERVATION, DM ping, ATTENTION.
  const obs = await commons.send({ conversation_id: room, kind: "OBSERVATION", body: { format: "text", content: `s3-q:${run}` }, attention: { level: "NORMAL", requested_delivery: "INBOX" }, visibility: "ROOM" });
  const dmId = `direct:${[SELF, PEER].sort().join(":")}`;
  const ping = await commons.dm(PEER, { kind: "REQUEST", body: { format: "text", content: `s3-ping:${run}` }, attention: { level: "ATTENTION", requested_delivery: "LIVE" } });
  assert((ping.payload as { conversation_id: string }).conversation_id === dmId, "F5:dm-id-not-deterministic");
  const attention = await commons.send({ conversation_id: attentionRoom, kind: "REQUEST", body: { format: "text", content: `s3-attention:${run}` }, attention: { level: "ATTENTION", requested_delivery: "INBOX" }, visibility: "ROOM", mentions: [PEER] });

  await transport.sync(); // push everything (observation + ping + attention)

  // Local checkpoints (pre-peer expectations documented, not F4/F5: B replies later).
  const roomHist = await commons.history(room);
  assert(roomHist.length === 1, `expected-own-observation-only:${roomHist.length}`);
  const attHist = await commons.history(attentionRoom);
  assert(attHist.length === 1, `expected-own-attention-only:${attHist.length}`);
  const dmHist = await commons.history(dmId);
  assert(dmHist.length === 1, `expected-own-ping-only:${dmHist.length}`);

  // §8.8 (record): fold everything readable here; equality deferred to 4b (F6).
  const all = await transport.read({});
  const proj = fold(all);
  const foldSummary = summarizeFold(proj);

  // §8.9 duplicate delivery tolerated (F7): re-append OWN known events only
  // (one-writer rule — never touch the peer stream, F2).
  const rawBefore = all.length;
  const known = (await transport.read({ agent_id: SELF })).slice(0, 2);
  await transport.append(known[0].stream_id, known);
  const dupAfter = (await transport.read({})).length;
  assert(dupAfter === rawBefore, `F7:duplicate-intolerance:${rawBefore}->${dupAfter}`);

  // §8.10 raw history preserved while views derive (F8).
  const raw0 = (await transport.read({})).length;
  const inbox = await commons.inbox();
  assert(inbox.length >= 1, "inbox-empty");
  const pkg = buildContextPackage([...fold(await transport.read({})).messages.values()]);
  assert(pkg.hot.length >= 1, "context-hot-empty");
  const raw1 = (await transport.read({})).length;
  assert(raw1 === raw0, `F8:view-mutated-history:${raw0}->${raw1}`);

  // F10 standing falsifier: no credential bytes in any event.
  const secretHits = scanForSecrets(await transport.read({}));
  assert(secretHits.length === 0, `F10:credential-leak:${secretHits.join(",")}`);

  // F9 evidence: no merges performed to communicate (none exist in code).
  // Scoped to baseline..branch: the branch inherits mainline history (S.3c fix).
  const merges = mergeCommits(root, branch, baselineHead);
  assert(merges.length === 0, `F9:merge-to-communicate:${merges.join(",")}`);

  const evidence = {
    s3: "W3-S3", proc: "procA", phase: "init", run, agentId: SELF, peerId: PEER,
    home: HOME, procDir: toplevel, remoteBare: remoteUrl, originUrl, baselineHead,
    worktreeStatus: status, versions, pubkey, peerPubkey: null,
    ids: {
      announcement: (ea.payload as { message_id: string }).message_id,
      room, observation: (obs.payload as { message_id: string }).message_id,
      reply: null, dmId, ping: (ping.payload as { message_id: string }).message_id,
      pong: null, attentionRoom, attention: (attention.payload as { message_id: string }).message_id,
      attentionReply: null, ackEvent: null,
    },
    roomLenCheckpoint: roomHist.length, attentionLenCheckpoint: attHist.length, dmLenCheckpoint: dmHist.length,
    roomLenAfterReply: null, dmLen: null,
    inbox: snapshotInbox(inbox), contextHot: pkg.hot.length,
    foldSummary, rawBefore: raw0, rawAfter: raw1, dupBefore: rawBefore, dupAfter,
    secretHits, mergeCommits: merges,
    seenAgents,
    checks: ["8.1/F2", "8.2/F1", "8.3-partial", "8.4", "8.5", "8.6-half", "8.7-half", "8.8-record", "8.9/F7", "8.10/F8", "8.11-half", "F9", "F10", "F13-record"],
  };
  const path = await writeEvidence(root, HOME, run, evidence);
  console.log(JSON.stringify({ S3_PROCA_INIT_OK: true, evidence: path, room, attentionRoom, dmId, baselineHead }));
}

// ---- phase verify (S.3b step 4b): full convergence AFTER procB ran ---------
// Asserts message-key equality with B's evidence, final room/dm lengths, both
// attention ids in THIS (resynced) inbox (F11 A-side post-sync), and verifies
// every event against its author's pubkey (F1/F12 both directions).
async function verifyPhase(args: ReturnType<typeof parseArgs>): Promise<void> {
  const { root, run, evidenceB } = args;
  if (!root || !run || !evidenceB) throw new Error("S3_ARGS_MISSING:verify needs --root --run --evidence-b");
  const b = await loadEvidence(evidenceB);
  const branch = agentBranch(SELF);
  // S.3c: F9 scan scope. Primary source is B's recorded baselineHead (F13:
  // both sides ran at the same baseline); fallback is this worktree's detached
  // HEAD, which stays at the baseline (transport moves refs, never checkout).
  const baselineHead = b?.baselineHead ?? sh(root, "rev-parse", "HEAD");
  ensureS3Remote(root, b.remoteBare ?? "");
  const idDir = join(root, HOME, "commons", "identity");
  const ia = await loadOrCreateIdentity(idDir, SELF, { repoRoot: root, remote: S3_REMOTE_NAME, branch });
  const factory = new EventFactory(ia.identity, ia.privateKeyPem, `s3a-verify-${run}`);
  const transport = new GitBranchTransport({ repoRoot: root, agentId: SELF, agentHome: HOME, remote: S3_REMOTE_NAME, peerHomes: { [PEER]: PEER_HOME } });
  const commons = new AgentCommons({ agentId: SELF, eventFactory: factory, transport });

  await transport.sync();
  const all = await transport.read({});
  // F1/F12 both directions: every event verifies against its author's pubkey
  // (peer pubkey read from the peer's published identity blob — remote, not side channel).
  const peerIdentity = JSON.parse(sh(root, "show", `refs/remotes/${S3_REMOTE_NAME}/${agentBranch(PEER)}:${PEER_HOME}/commons/identity/agent.json`));
  assert(peerIdentity.agent_id === PEER, "F2:peer-identity-mismatch");
  assert(peerIdentity.public_key_pem !== ia.identity.public_key_pem, "F2:identity-collision");
  const keys: Record<string, string> = { [SELF]: ia.identity.public_key_pem, [PEER]: peerIdentity.public_key_pem };
  for (const e of all) {
    assert(keys[e.agent_id], `F2:unknown-author:${e.agent_id}`);
    assert(verifyEvent(e, keys[e.agent_id]) === true, `F1/F12:bad-signature:${e.event_id}`);
  }
  assert(scanForSecrets(all).length === 0, "F10:credential-leak");

  const proj = fold(all);
  const sum = summarizeFold(proj);
  const bKeys: string[] = b.foldSummary.messageKeys;
  const missedByA = bKeys.filter((k) => !sum.messageKeys.includes(k));
  const missedByB = sum.messageKeys.filter((k) => !bKeys.includes(k));
  assert(missedByA.length === 0, `F3/F6:A-misses-B-keys:${missedByA.join(",")}`);
  assert(missedByB.length === 0, `F6:B-misses-A-keys:${missedByB.join(",")}`);

  const roomHist = await commons.history(b.ids.room);
  const attHist = await commons.history(b.ids.attentionRoom);
  const dmId = `direct:${[SELF, PEER].sort().join(":")}`;
  const dmHist = await commons.history(dmId);
  assert(roomHist.length === 2, `F4:room-divergence:${roomHist.length}`);
  assert(attHist.length === 2, `F4:attention-room-divergence:${attHist.length}`);
  assert(dmHist.length === 2, `F5:dm-split:${dmHist.length}`);

  // F11 A-side post-sync: ATTENTION msg AND B's ack reply both visible here.
  const inboxIds = new Set((await commons.inbox()).map((m) => m.message_id));
  assert(inboxIds.has(b.ids.attention), "F11:attention-missing-in-A-inbox-after-sync");
  assert(inboxIds.has(b.ids.attentionReply), "F11:ack-reply-missing-in-A-inbox-after-sync");

  assert(mergeCommits(root, branch, baselineHead).length === 0, "F9:merge-to-communicate");
  console.log(JSON.stringify({ S3_PROCA_VERIFY_OK: true, messages: sum.messageCount, room: roomHist.length, attentionRoom: attHist.length, dm: dmHist.length }));
}

await main().catch((e) => {
  console.error(`S3_PROCA_FAIL:${(e as Error).message}`);
  process.exit(1);
});
