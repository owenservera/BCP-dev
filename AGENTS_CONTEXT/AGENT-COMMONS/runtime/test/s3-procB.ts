// s3-procB.ts — Wave-3 unit S.3 RESPONDER (S3-BETA). AUTHORSHIP ONLY (S.3a).
//
// Run as its own OS process by the Steward in S.3b step (3), STRICTLY AFTER
// procA completed step (2):
//   bun s3-procB.ts --root <procBDir> --remote <bareRepo> --run <runName>
//
// Roles: publish ANNOUNCEMENT, sync (now seeing procA's stream), verify peer
// events, DISCOVER both rooms by FOLDING procA's stream (room ids never arrive
// by argv/env/file/chat — any such path would be a side channel violating §5),
// reply in the exchange room, DM pong, acknowledge the ATTENTION message, and
// record evidence. procB must NOT read procA's evidence file or worktree.
//
// Map to procedure §8:
//   §8.1 stable identities .......... load twice, same key (F2 self)
//   §8.2 separate signed streams .... ANNOUNCEMENT + self-verify; peer verify (F1, F2)
//   §8.3 sync through git ........... both agent_ids visible after sync (F3)
//   §8.4 public feed ................ both runtimes non-empty (local fold of synced state)
//   §8.5 room discovery ............. fold → rooms created by S3-ALPHA for <run> (F4 shape)
//   §8.6 message exchange ........... read OBSERVATION, reply, resync, len 2 (F4)
//   §8.7 deterministic DM ........... pong back, single direct: id len 2 (F5)
//   §8.8 replay ..................... fold summary recorded; equality in 4b (F6)
//   §8.9 duplicate tolerance ........ re-append own events, count unchanged (F7)
//   §8.10 raw preserved ............. inbox + context derive, raw unchanged (F8)
//   §8.11 attention ................. ATTENTION msg in inbox, acknowledge + reply (F11)
//
// Hard rules: local bare remote ONLY (never origin); never merge (F9); one
// writer per stream (only own commons/S3-BETA events appended here, F2).

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
  assertRefSynced, assertEventBlobs, assertIdentityBlob,
  S3_REMOTE_NAME,
} from "./s3-lib.js";

const SELF = "S3-BETA";
const PEER = "S3-ALPHA";
const HOME = "S3-BETA";
const PEER_HOME = "S3-ALPHA";

function assert(c: unknown, msg: string): asserts c {
  if (!c) throw new Error(`S3_ASSERT:${msg}`);
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  needInitArgs(args);
  const { root, remote, run } = args;
  await stat(root); // worktree must already exist (S.3b step 1 created it)
  await stat(remote); // bare rendezvous must already exist (procA pushed here)
  const toplevel = sh(root, "rev-parse", "--show-toplevel");
  const baselineHead = sh(root, "rev-parse", "HEAD");
  const status = sh(root, "status", "-sb");
  const versions = toolchain(); // §2.2 per-process record (F13)
  const { url: remoteUrl, originUrl } = ensureS3Remote(root, remote);
  const branch = agentBranch(SELF);
  // S.3d: fresh-branch guard (baseline + home) — stale commons/S3-BETA reuse
  // from a prior run fails CLOSED here (S3_STALE_BRANCH_REUSE), never silently.
  ensureOwnBranch(root, branch, baselineHead, HOME);

  // §8.1 stable identities (F2 self-half).
  const idDir = join(root, HOME, "commons", "identity");
  const ib = await loadOrCreateIdentity(idDir, SELF, { repoRoot: root, remote: S3_REMOTE_NAME, branch });
  const ib2 = await loadOrCreateIdentity(idDir, SELF, { repoRoot: root, remote: S3_REMOTE_NAME, branch });
  assert(ib.identity.public_key_pem === ib2.identity.public_key_pem, "F2:identity-unstable");
  const pubkey = ib.identity.public_key_pem;

  const factory = new EventFactory(ib.identity, ib.privateKeyPem, `s3b-${run}`);
  const transport = new GitBranchTransport({ repoRoot: root, agentId: SELF, agentHome: HOME, remote: S3_REMOTE_NAME, peerHomes: { [PEER]: PEER_HOME } });
  const commons = new AgentCommons({ agentId: SELF, eventFactory: factory, transport });

  // §8.2 separate signed streams (F1 self-half, F2): own ANNOUNCEMENT verifies.
  const eb = await commons.publish({ kind: "ANNOUNCEMENT", body: { format: "text", content: `s3-beta-here:${run}` }, attention: { level: "NORMAL", requested_delivery: "INBOX" } });
  assert(eb.agent_id === SELF, "F2:own-stream-owner-mismatch");
  assert(verifyEvent(eb, pubkey) === true, "F1:own-announcement-bad-signature");

  // §8.3 synchronize through git, then prove both streams are visible (F3).
  // F12: every peer event must validate HERE exactly as it did on procA.
  await transport.sync();
  // S.3d read-observability (same rationale as procA: transport catch{} is
  // OBSERVED, CFA-09; prove ref state via direct git BEFORE trusting read()).
  assertRefSynced(root, branch);
  assertEventBlobs(root, branch, HOME, 1, "procB-own-post-sync");
  assertIdentityBlob(root, branch, HOME, pubkey, "procB-own-post-sync");
  // Peer-side visibility at the ref layer too: procA pushed in S.3b step (2).
  assertEventBlobs(root, `${S3_REMOTE_NAME}/${agentBranch(PEER)}`, PEER_HOME, 1, "procB-peer-post-sync");
  const posted = await transport.read({ event_types: ["message.posted"] });
  const seenAgents = [...new Set(posted.map((e) => e.agent_id))].sort();
  assert(seenAgents.includes(SELF) && seenAgents.includes(PEER), `F3:sync-blindness:${seenAgents.join(",")}`);

  // Peer pubkey comes from the peer's PUBLISHED identity blob on the remote
  // (fetch-and-inspect, §7 — never merge, F9). Cross-check pubkeys differ (F2).
  const peerIdentity = JSON.parse(sh(root, "show", `refs/remotes/${S3_REMOTE_NAME}/${agentBranch(PEER)}:${PEER_HOME}/commons/identity/agent.json`));
  assert(peerIdentity.agent_id === PEER, "F2:peer-identity-mismatch");
  assert(peerIdentity.public_key_pem !== pubkey, "F2:identity-collision");
  const keys: Record<string, string> = { [SELF]: pubkey, [PEER]: peerIdentity.public_key_pem };
  for (const e of await transport.read({})) {
    assert(keys[e.agent_id], `F2:unknown-author:${e.agent_id}`);
    assert(verifyEvent(e, keys[e.agent_id]) === true, `F1/F12:bad-signature:${e.event_id}`);
  }

  // §8.4 public feed discovery on both runtimes (same synced state, both views).
  assert((await commons.history("commons.public")).length >= 1, "public-feed-empty");

  // §8.5 room DISCOVERY by folding the peer stream — never by side channel.
  // --run only disambiguates names inside the fold result; the room IDS below
  // come exclusively from folded events. Zero rooms here = F3/F4-class failure.
  const proj0 = fold(await transport.read({}));
  const candidates = [...proj0.conversations.values()].filter(
    (c) => c.type === "ROOM" && c.created_by === PEER && (c.name ?? "").includes(run),
  );
  assert(candidates.length >= 2, `F3/F4:no-rooms-from-peer:${candidates.length}`);
  const byKind = (frag: string) => candidates.filter((c) => (c.name ?? "").includes(frag)).sort((x, y) => x.conversation_id.localeCompare(y.conversation_id));
  const exch = byKind("s3-room-");
  const att = byKind("s3-attention-");
  assert(exch.length >= 1 && att.length >= 1, "F4:room-kinds-missing");
  const room = exch[exch.length - 1].conversation_id; // latest on ties
  const attentionRoom = att[att.length - 1].conversation_id;
  assert(room.startsWith("room:") && attentionRoom.startsWith("room:"), "room-id-shape");
  for (const [id, label] of [[room, "exchange"], [attentionRoom, "attention"]] as const) {
    const members = [...(proj0.conversations.get(id)?.members ?? [])].sort();
    assert(members.includes(SELF) && members.includes(PEER), `F4:${label}-membership:${members.join(",")}`);
  }

  // §8.6 message exchange in the room: read OBSERVATION, reply, resync, len 2 (F4).
  const first = (await commons.history(room))[0];
  assert(first && (first as { kind: string }).kind === "OBSERVATION", "F3:observation-missing");
  const reply = await commons.reply(first, { kind: "QUESTION", body: { format: "text", content: `s3-a:${run}` }, attention: { level: "NORMAL", requested_delivery: "INBOX" }, visibility: "ROOM" });
  await transport.sync();
  const roomHist = await commons.history(room);
  assert(roomHist.length === 2, `F4:room-divergence:${roomHist.length}`);
  const roomLenAfterReply = roomHist.length;

  // §8.7 deterministic direct conversation: pong back; one id, len 2 (F5).
  const dmId = `direct:${[SELF, PEER].sort().join(":")}`;
  const pong = await commons.dm(PEER, { kind: "REQUEST", body: { format: "text", content: `s3-pong:${run}` }, attention: { level: "ATTENTION", requested_delivery: "LIVE" } });
  assert((pong.payload as { conversation_id: string }).conversation_id === dmId, "F5:dm-id-not-deterministic");
  await transport.sync();
  const dmHistA = await commons.history(dmId);
  assert(dmHistA.length === 2, `F5:dm-split:${dmHistA.length}`);
  const dmLen = dmHistA.length;

  // §8.11 cross-process attention: find the ATTENTION message BY FOLD (never by
  // passed id), prove it is in THIS inbox (F11 B-side), acknowledge + reply.
  const proj1 = fold(await transport.read({}));
  const attentionMsg = [...proj1.messages.values()].find(
    (m) => m.conversation_id === attentionRoom && m.attention.level === "ATTENTION" && m.mentions.includes(SELF),
  );
  assert(attentionMsg, "F11:attention-message-not-folded");
  const attentionId = attentionMsg!.message_id;
  let inbox = await commons.inbox();
  assert(inbox.some((m) => m.message_id === attentionId), "F11:attention-invisible-in-B-inbox");
  const ack = await commons.acknowledge(attentionId, "PROCESSED", `s3-seen:${run}`);
  const attReply = await commons.reply(attentionMsg!, { kind: "OBSERVATION", body: { format: "text", content: `s3-ack:${run}` }, attention: { level: "NORMAL", requested_delivery: "INBOX" }, visibility: "ROOM" });
  await transport.sync();
  const attHist = await commons.history(attentionRoom);
  assert(attHist.length === 2, `F4:attention-room-divergence:${attHist.length}`);
  inbox = await commons.inbox(); // final snapshot: ATTENTION msg + ack reply both visible
  assert(inbox.some((m) => m.message_id === attentionId), "F11:attention-lost-after-ack");
  const attentionReplyId = (attReply.payload as { message_id: string }).message_id;
  assert(inbox.some((m) => m.message_id === attentionReplyId), "F11:ack-reply-missing-in-B-inbox");

  // §8.8 (record): fold summary for compare (4a) + verify (4b). Equality with
  // procA's pre-peer fold is NOT asserted here (B ⊃ A by construction, F6).
  const projFinal = fold(await transport.read({}));
  const foldSummary = summarizeFold(projFinal);

  // §8.9 duplicate delivery tolerated (F7): own events only (F2 one-writer).
  const dupBefore = (await transport.read({})).length;
  const known = (await transport.read({ agent_id: SELF })).slice(0, 2);
  await transport.append(known[0].stream_id, known);
  const dupAfter = (await transport.read({})).length;
  assert(dupAfter === dupBefore, `F7:duplicate-intolerance:${dupBefore}->${dupAfter}`);

  // §8.10 raw history preserved while views derive (F8).
  const raw0 = (await transport.read({})).length;
  assert(inbox.length >= 1, "inbox-empty");
  const pkg = buildContextPackage([...fold(await transport.read({})).messages.values()]);
  assert(pkg.hot.length >= 1, "context-hot-empty");
  const raw1 = (await transport.read({})).length;
  assert(raw1 === raw0, `F8:view-mutated-history:${raw0}->${raw1}`);

  // F10 standing falsifier + F9 evidence (scoped to baseline..branch, S.3c fix).
  const secretHits = scanForSecrets(await transport.read({}));
  assert(secretHits.length === 0, `F10:credential-leak:${secretHits.join(",")}`);
  const merges = mergeCommits(root, branch, baselineHead);
  assert(merges.length === 0, `F9:merge-to-communicate:${merges.join(",")}`);

  const evidence = {
    s3: "W3-S3", proc: "procB", phase: "init", run, agentId: SELF, peerId: PEER,
    home: HOME, procDir: toplevel, remoteBare: remoteUrl, originUrl, baselineHead,
    worktreeStatus: status, versions, pubkey, peerPubkey: peerIdentity.public_key_pem,
    ids: {
      announcement: (eb.payload as { message_id: string }).message_id,
      room, observation: first.message_id,
      reply: (reply.payload as { message_id: string }).message_id,
      dmId, ping: null, pong: (pong.payload as { message_id: string }).message_id,
      attentionRoom, attention: attentionId,
      attentionReply: attentionReplyId,
      ackEvent: (ack as { event_id: string }).event_id,
    },
    roomLenCheckpoint: null, attentionLenCheckpoint: null, dmLenCheckpoint: null,
    roomLenAfterReply, dmLen,
    inbox: snapshotInbox(inbox), contextHot: pkg.hot.length,
    foldSummary, rawBefore: raw0, rawAfter: raw1, dupBefore, dupAfter,
    secretHits, mergeCommits: merges,
    seenAgents,
    roomCandidates: candidates.map((c) => c.conversation_id).sort(),
    checks: ["8.1/F2", "8.2/F1", "8.3/F3", "8.4", "8.5-fold-discovery", "8.6/F4", "8.7/F5", "8.8-record", "8.9/F7", "8.10/F8", "8.11/F11", "F9", "F10", "F12", "F13-record"],
  };
  const path = await writeEvidence(root, HOME, run, evidence);
  console.log(JSON.stringify({ S3_PROCB_OK: true, evidence: path, room, attentionRoom, dmId, baselineHead }));
}

await main().catch((e) => {
  console.error(`S3_PROCB_FAIL:${(e as Error).message}`);
  process.exit(1);
});
