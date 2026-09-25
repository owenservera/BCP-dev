import{readFile}from"node:fs/promises";
import{join}from"node:path";

export interface PeerRosterEntry{agent_id:string;home:string;role:string;status:"bootstrap-ready"|"ratified"|"retired"}

export function parsePeerRoster(markdown:string):PeerRosterEntry[]{
  const rows:PeerRosterEntry[]=[];
  for(const line of markdown.split(/\r?\n/)){
    if(!line.trim().startsWith("|")||line.includes("---")||line.includes("agent_id"))continue;
    const cells=line.split("|").slice(1,-1).map(x=>x.trim().replace(/^`|`$/g,""));
    if(cells.length<4||!cells[0]||!cells[1]||!cells[2]||!["bootstrap-ready","ratified","retired"].includes(cells[3]))continue;
    rows.push({agent_id:cells[0],home:cells[1],role:cells[2],status:cells[3] as PeerRosterEntry["status"]});
  }
  const seen=new Set<string>();
  for(const row of rows){if(seen.has(row.agent_id))throw new Error(`COMMONS_PEER_ROSTER_DUPLICATE:${row.agent_id}`);seen.add(row.agent_id)}
  return rows;
}

export async function loadPeerRoster(repoRoot:string,path="AGENTS_CONTEXT/AGENT-COMMONS/PEER-ROSTER.md"){
  const markdown=await readFile(join(repoRoot,path),"utf8").catch(()=>{throw new Error(`COMMONS_PEER_ROSTER_NOT_FOUND:${path}`)});
  const roster=parsePeerRoster(markdown);
  if(!roster.length)throw new Error("COMMONS_PEER_ROSTER_EMPTY");
  return roster;
}
export async function peerHomesFromRoster(repoRoot:string,agentId:string,path?:string){
  const roster=await loadPeerRoster(repoRoot,path);
  return Object.fromEntries(roster.filter(x=>x.agent_id!==agentId).map(x=>[x.agent_id,x.home]));
}