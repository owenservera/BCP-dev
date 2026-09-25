import{test}from"node:test";
import assert from"node:assert/strict";
import{parsePeerRoster}from"../src/peer-roster.js";

test("peer roster parses and rejects duplicate identities",()=>{
  const markdown=`| agent_id | home path | role | status |\n|---|---|---|---|\n| world | AGENTS/WORLD | World | bootstrap-ready |\n| data | AGENTS/DATA | Data | ratified |`;
  assert.deepEqual(parsePeerRoster(markdown),[
    {agent_id:"world",home:"AGENTS/WORLD",role:"World",status:"bootstrap-ready"},
    {agent_id:"data",home:"AGENTS/DATA",role:"Data",status:"ratified"}
  ]);
  assert.throws(()=>parsePeerRoster(markdown+"| data | AGENTS/OTHER | Other | retired |\n"),/COMMONS_PEER_ROSTER_DUPLICATE:data/);
});