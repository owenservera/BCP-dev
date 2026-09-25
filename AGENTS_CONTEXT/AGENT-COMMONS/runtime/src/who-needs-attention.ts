import{spawnSync}from"node:child_process";
import{fold}from"./fold.js";
import{attentionScore}from"./attention.js";
import{verifyEventChain}from"./validation.js";
import type{AgentIdentity,CommonsEvent,MessagePayload,Projection}from"./types.js";

export interface AttentionSignal{kind:"UNREAD_ATTENTION"|"OVERDUE_HANDOFF"|"UNANSWERED_DIRECT";score:number;message_id?:string;handoff_id?:string;from?:string;subject?:string;detail:string}
export interface AgentAttention{agent_id:string;score:number;signals:AttentionSignal[]}
export interface WhoNeedsAttentionOptions{repoRoot:string;remote?:string;staleAfterMs?:number;nowMs?:number}
export interface WhoNeedsAttentionResult{generated_at:string;stale_after_ms:number;registered_agents:number;agents:AgentAttention[]}

const RESPONDABLE=new Set(["QUESTION","REQUEST","OBJECTION","DECISION_CANDIDATE"] as const);
const git=(cwd:string,args:string[])=>{const r=spawnSync("git",args,{cwd,encoding:"utf8"});if(r.status!==0)throw new Error(`commons ${args.join(" ")} failed: ${r.stderr||r.stdout}`);return r.stdout.trim()};

function discoverAgents(repoRoot:string,remote:string):Array<{agent:AgentIdentity;ref:string;home:string;events:CommonsEvent[]}>{
  git(repoRoot,["fetch","--prune",remote,"+refs/heads/commons/*:refs/remotes/"+remote+"/commons/*"]);
  const refs=git(repoRoot,["for-each-ref","--format=%(refname:short)","refs/remotes/"+remote+"/commons"]).split("\n").filter(Boolean);
  return refs.map(ref=>{
    const files=git(repoRoot,["ls-tree","-r","--name-only",ref]).split("\n").filter(Boolean);
    const identities=files.filter(x=>x.endsWith("/commons/identity/agent.json")||x==="commons/identity/agent.json");
    if(identities.length!==1)throw new Error(`COMMONS_ROSTER_IDENTITY_INVALID:${ref}`);
    const identityPath=identities[0];
    let identity:AgentIdentity;
    try{identity=JSON.parse(git(repoRoot,["show",`${ref}:${identityPath}`])) as AgentIdentity}catch{throw new Error(`COMMONS_ROSTER_IDENTITY_INVALID:${ref}`)}
    if(!identity.agent_id)throw new Error(`COMMONS_ROSTER_IDENTITY_INVALID:${ref}`);
    const suffix="/commons/identity/agent.json";
    const home=identityPath.endsWith(suffix)?identityPath.slice(0,-suffix.length):"";
    const eventPrefix=home?home+"/commons/stream/events/":"commons/stream/events/";
    const eventNames=files.filter(x=>x.startsWith(eventPrefix)&&x.endsWith(".json"));
    const events=eventNames.map(name=>{try{return JSON.parse(git(repoRoot,["show",`${ref}:${name}`])) as CommonsEvent}catch{throw new Error(`COMMONS_ROSTER_EVENT_INVALID:${ref}:${name}`)}});
    verifyEventChain(events,identity);
    return{agent:identity,ref,home,events};
  });
}

function relevant(m:MessagePayload,agent:string,p:Projection):boolean{
  if(m.recipients.includes(agent)||m.mentions.includes(agent))return true;
  if(m.visibility==="PUBLIC"||m.conversation_id==="commons.public")return true;
  const c=p.conversations.get(m.conversation_id);
  if(c?.members.has(agent))return true;
  for(const s of p.subscriptions.values()){
    if(s.subscriber!==agent)continue;
    if(s.target.type==="PUBLIC")return true;
    if(s.target.type==="ROOM"&&s.target.conversation_id===m.conversation_id)return true;
    if(s.target.type==="TOPIC"&&m.topics.includes(s.target.topic))return true;
    if(s.target.type==="DIRECT"&&(m.recipients.includes(agent)||m.agent_id===agent))return true;
  }
  return false;
}

export function whoNeedsAttention(o:WhoNeedsAttentionOptions):WhoNeedsAttentionResult{
  const remote=o.remote??"origin";
  const staleAfterMs=o.staleAfterMs??4*60*60*1000;
  const now=o.nowMs??Date.now();
  const records=discoverAgents(o.repoRoot,remote);
  const byId=new Map(records.map(x=>[x.agent.agent_id,x]));
  const all=new Map<string,CommonsEvent>();
  for(const r of records)for(const e of r.events)all.set(e.event_id,e);
  const events=[...all.values()].sort((a,b)=>a.event_id.localeCompare(b.event_id));
  const projection=fold(events);
  const ack=new Map<string,Map<string,"DELIVERED"|"PROCESSED"|"REJECTED">>();
  const repliedTo=new Set<string>();
  for(const e of events){
    if(e.event_type==="delivery.acknowledged"){
      const x=e.payload as {message_id:string;consumer_agent_id:string;status:"DELIVERED"|"PROCESSED"|"REJECTED"};
      if(!ack.has(x.message_id))ack.set(x.message_id,new Map());
      ack.get(x.message_id)!.set(x.consumer_agent_id,x.status);
    }
    if(e.event_type==="message.posted"){
      const m=e.payload as MessagePayload;
      if(m.reply_to&&byId.has(e.agent_id))repliedTo.add(`${e.agent_id}:${m.reply_to}`);
    }
  }
  const out=new Map<string,AgentAttention>();
  const add=(agent:string,signal:AttentionSignal)=>{
    const current=out.get(agent)??{agent_id:agent,score:0,signals:[]};
    current.score+=signal.score;
    current.signals.push(signal);
    out.set(agent,current);
  };
  const handoffLast=new Map<string,{to:string;subject:string;state:string;ts:number}>();
  for(const e of events)if(e.event_type==="handoff.changed"){const h=e.payload as {handoff_id:string;to:string;subject:string;state:string};handoffLast.set(h.handoff_id,{to:h.to,subject:h.subject,state:h.state,ts:new Date(e.ts).getTime()});}
  for(const e of events){
    if(e.event_type!=="message.posted")continue;
    const m=e.payload as MessagePayload;
    for(const agent of byId.keys()){
      if(e.agent_id===agent||!relevant(m,agent,projection))continue;
      if(m.attention.level==="URGENT"||m.attention.level==="ATTENTION"){
        if(ack.get(m.message_id)?.get(agent)!=="PROCESSED"){
          const base=attentionScore(m,agent);
          add(agent,{kind:"UNREAD_ATTENTION",score:base+(m.attention.level==="URGENT"?80:35),message_id:m.message_id,from:e.agent_id,detail:`${m.attention.level} ${m.kind} is not marked PROCESSED`});
        }
      }
      if(m.visibility==="DIRECTED"&&m.conversation_id.startsWith("direct:")&&m.recipients.includes(agent)&&RESPONDABLE.has(m.kind as any)&&!repliedTo.has(`${agent}:${m.message_id}`)){
        add(agent,{kind:"UNANSWERED_DIRECT",score:attentionScore(m,agent)+50,message_id:m.message_id,from:e.agent_id,detail:`DIRECT ${m.kind} has no reply from ${agent}`});
      }
    }
  }
  for(const [handoffId,h] of handoffLast){
    if(h.state!=="OFFERED")continue;
    if(h.ts<=0||now-h.ts<staleAfterMs)continue;
    const ageHours=Math.floor((now-h.ts)/3600000);
    add(h.to,{kind:"OVERDUE_HANDOFF",score:100+Math.min(50,Math.max(0,ageHours)*5),handoff_id:handoffId,subject:h.subject,detail:`HANDOFF has been OFFERED for ${ageHours}h without transition`});
  }
  const ranked=[...out.values()].sort((a,b)=>b.score-a.score||b.signals.length-a.signals.length||a.agent_id.localeCompare(b.agent_id));
  return{generated_at:new Date(now).toISOString(),stale_after_ms:staleAfterMs,registered_agents:records.length,agents:ranked};
}