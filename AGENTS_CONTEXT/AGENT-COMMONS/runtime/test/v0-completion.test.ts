import{test}from"node:test";import assert from"node:assert/strict";import{mkdtemp,writeFile}from"node:fs/promises";import{tmpdir}from"node:os";import{join}from"node:path";import{spawnSync}from"node:child_process";import{loadOrCreateIdentity,verifyEvent}from"../src/crypto.js";import{EventFactory}from"../src/events.js";import{AgentCommons}from"../src/commons.js";import{GitBranchTransport,agentBranch}from"../src/transports/git.js";import{fold}from"../src/fold.js";import{buildContextPackage}from"../src/compaction.js";function g(c:string,...a:string[]){const r=spawnSync("git",a,{cwd:c,encoding:"utf8"});assert.equal(r.status,0,r.stderr||r.stdout);return r.stdout.trim()}
// v0 operational completion test (IMPLEMENTATION-ROADMAP.md): two independent
// agent runtimes prove all ten points through the Git transport. Windows git spawns
// are slow (~19s observed), hence the explicit timeout — see smoke.test.ts.
test("v0 operational completion across two independent runtimes",{timeout:180000},async()=>{
const r=await mkdtemp(join(tmpdir(),"v0-")),bare=join(r,"remote.git");g(r,"init","--bare",bare);
const s=join(r,"seed");g(r,"clone",bare,s);g(s,"config","user.email","t@e");g(s,"config","user.name","T");
await writeFile(join(s,"README.md"),"v0\n");g(s,"add","-A");g(s,"commit","-m","seed");g(s,"push","origin","HEAD:main");
const A="V0-ALPHA",B="V0-BETA",homeA="V0A",homeB="V0B",dirA=join(r,"a"),dirB=join(r,"b");
for(const d of[dirA,dirB]){g(r,"clone",bare,d);g(d,"config","user.email","t@e");g(d,"config","user.name","T")}
g(dirA,"checkout","-b",agentBranch(A),"origin/main");g(dirB,"checkout","-b",agentBranch(B),"origin/main");
// 1. stable identities: load twice, same key material both times.
const ia=await loadOrCreateIdentity(join(dirA,homeA,"commons","identity"),A);
const ia2=await loadOrCreateIdentity(join(dirA,homeA,"commons","identity"),A);
const ib=await loadOrCreateIdentity(join(dirB,homeB,"commons","identity"),B);
assert.equal(ia.identity.public_key_pem,ia2.identity.public_key_pem);
assert.notEqual(ia.identity.public_key_pem,ib.identity.public_key_pem);
const fa=new EventFactory(ia.identity,ia.privateKeyPem,"sa"),fb=new EventFactory(ib.identity,ib.privateKeyPem,"sb");
const ta=new GitBranchTransport({repoRoot:dirA,agentId:A,agentHome:homeA,peerHomes:{[B]:homeB}});
const tb=new GitBranchTransport({repoRoot:dirB,agentId:B,agentHome:homeB,peerHomes:{[A]:homeA}});
const ca=new AgentCommons({agentId:A,eventFactory:fa,transport:ta});
const cb=new AgentCommons({agentId:B,eventFactory:fb,transport:tb});
// 2. separate signed streams.
const ea=await ca.publish({kind:"ANNOUNCEMENT",body:{format:"text",content:"alpha-here"},attention:{level:"NORMAL",requested_delivery:"INBOX"}});
const eb=await cb.publish({kind:"ANNOUNCEMENT",body:{format:"text",content:"beta-here"},attention:{level:"NORMAL",requested_delivery:"INBOX"}});
assert.equal(ea.agent_id,A);assert.equal(eb.agent_id,B);
assert.equal(verifyEvent(ea,ia.identity.public_key_pem),true);
assert.equal(verifyEvent(eb,ib.identity.public_key_pem),true);
// 3. synchronize through Git; each sees the other's event.
await ta.sync();await tb.sync();
const seenA=(await ta.read({event_types:["message.posted"]})).map(e=>e.agent_id).sort();
assert.deepEqual(seenA,[A,B]);
// 4. public feed discovery on both runtimes.
assert.ok((await ca.history("commons.public")).length>=1);
assert.ok((await cb.history("commons.public")).length>=1);
// 5. room creation.
const room=await ca.createRoom({name:"v0-room",members:[B]});
assert.ok(room.startsWith("room:"));
// 6. message exchange in the room.
await ca.send({conversation_id:room,kind:"OBSERVATION",body:{format:"text",content:"q"},attention:{level:"NORMAL",requested_delivery:"INBOX"},visibility:"ROOM"});
await tb.sync();
const first=(await cb.history(room))[0];
await cb.reply(first,{kind:"QUESTION",body:{format:"text",content:"a"},attention:{level:"NORMAL",requested_delivery:"INBOX"},visibility:"ROOM"});
await ta.sync();await tb.sync();
assert.equal((await ca.history(room)).length,2);
assert.equal((await cb.history(room)).length,2);
// 7. deterministic direct conversation: both directions land in one id.
await ca.dm(B,{kind:"REQUEST",body:{format:"text",content:"ping"},attention:{level:"ATTENTION",requested_delivery:"LIVE"}});
await cb.dm(A,{kind:"REQUEST",body:{format:"text",content:"pong"},attention:{level:"ATTENTION",requested_delivery:"LIVE"}});
await ta.sync();await tb.sync();
const dmId=`direct:${[A,B].sort().join(":")}`;
assert.equal((await ca.history(dmId)).length,2);
assert.equal((await cb.history(dmId)).length,2);
// 8. replay into equivalent state on both runtimes.
const pa=fold(await ta.read({})),pb=fold(await tb.read({}));
assert.equal(pa.messages.size,pb.messages.size);
assert.deepEqual([...pa.messages.keys()].sort(),[...pb.messages.keys()].sort());
assert.deepEqual([...(pa.conversations.get(room)?.members??[])].sort(),[...(pb.conversations.get(room)?.members??[])].sort());
// 9. duplicate delivery tolerated: re-appending known events changes nothing.
const before=(await ta.read({})).length;
const known=(await ta.read({agent_id:A})).slice(0,2);
await ta.append(known[0].stream_id,known);
assert.equal((await ta.read({})).length,before);
// 10. raw history preserved while inbox/context views derive.
const raw=(await ta.read({})).length;
const inboxA=await ca.inbox();
assert.ok(inboxA.length>=1);
const pkg=buildContextPackage([...pa.messages.values()]);
assert.ok(pkg.hot.length>=1);
assert.equal((await ta.read({})).length,raw);
});
