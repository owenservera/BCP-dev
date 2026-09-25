import type {AgentIdentity,CommonsEvent,MessagePayload,ConversationCreatedPayload,MembershipChangedPayload,SubscriptionChangedPayload,PresenceUpdatedPayload,HandoffPayload,DeliveryAcknowledgedPayload} from "./types.js";
import {eventHash,verifyEvent} from "./crypto.js";

const one=(v:unknown)=>typeof v==="string"&&v.length>0;
const arr=(v:unknown)=>Array.isArray(v);
const enums=(v:unknown,a:readonly string[])=>typeof v==="string"&&a.includes(v);

export function validateEvent(e:CommonsEvent):void{
  if(!one(e.event_id)||!one(e.event_type)||!one(e.schema_version)||!one(e.agent_id)||!one(e.session_id)||!one(e.key_id)||!one(e.stream_id)||!Number.isInteger(e.stream_seq)||e.stream_seq<1||!one(e.ts)||!one(e.signature))throw new Error("EVENT_INVALID_ENVELOPE");
  const p=e.payload as any;
  switch(e.event_type){
    case "conversation.created":
      if(!one(p?.conversation_id)||!enums(p.type,["PUBLIC","ROOM","DIRECT","BROADCAST"])||!one(p.created_by)||!arr(p.initial_members)||!enums(p.visibility,["PUBLIC","ROOM","DIRECTED"]))throw new Error("CONVERSATION_CREATED_INVALID");
      break;
    case "conversation.updated":
      if(!one(p?.conversation_id)||!p.changes||typeof p.changes!=="object"||Array.isArray(p.changes))throw new Error("CONVERSATION_UPDATED_INVALID");
      break;
    case "membership.changed":
      if(!one(p?.conversation_id)||!one(p.subject_agent_id)||!enums(p.change,["INVITED","ACCEPTED","DECLINED","LEFT","REMOVED"])||!one(p.actor_agent_id))throw new Error("MEMBERSHIP_CHANGED_INVALID");
      break;
    case "message.posted":{
      const m=p as MessagePayload;
      if(!one(m?.message_id)||!one(m?.conversation_id)||!enums(m.kind,["OBSERVATION","QUESTION","HYPOTHESIS","PROPOSAL","REQUEST","OBJECTION","EVIDENCE_REFERENCE","STATUS","HANDOFF","DECISION_CANDIDATE","ANNOUNCEMENT"])||!m.body||!enums(m.body.format,["text","markdown","json"])||!arr(m.mentions)||!arr(m.references)||!arr(m.topics)||!m.attention||!enums(m.attention.level,["AMBIENT","NORMAL","ATTENTION","URGENT"])||!enums(m.attention.requested_delivery,["LIVE","INBOX","DIGEST","DEFERRED"])||!m.delivery||!enums(m.delivery.requested,["LIVE","INBOX","DIGEST","DEFERRED"])||!enums(m.visibility,["PUBLIC","ROOM","DIRECTED","SEALED"])||!arr(m.recipients)||typeof m.sealed!=="boolean")throw new Error("MESSAGE_POSTED_INVALID");
      break;
    }
    case "subscription.changed":
      if(!one(p?.subscriber)||!enums(p.action,["SUBSCRIBE","UNSUBSCRIBE"])||!p.target||!enums(p.target.type,["PUBLIC","ROOM","DIRECT","TOPIC","MENTIONS"]))throw new Error("SUBSCRIPTION_CHANGED_INVALID");
      break;
    case "presence.updated":{
      const x=p as PresenceUpdatedPayload;
      if(!one(x?.agent_id)||!one(x.session_id)||!enums(x.state,["INITIALIZING","IDLE","RESEARCHING","DELIBERATING","COMMUNICATING","WAITING","BLOCKED","EXECUTING","REVIEWING","HANDOFF","SHUTTING_DOWN"])||!one(x.observed_at)||!one(x.expires_at))throw new Error("PRESENCE_UPDATED_INVALID");
      break;
    }
    case "handoff.changed":{
      const x=p as HandoffPayload;
      if(!one(x?.handoff_id)||!one(x.from)||!one(x.to)||!one(x.subject)||typeof x.context!=="string"||!arr(x.known)||!arr(x.unknown)||!arr(x.conflicts)||!arr(x.questions)||!one(x.requested_action)||!arr(x.references)||!enums(x.state,["OFFERED","ACCEPTED","DECLINED","EXPIRED","IN_PROGRESS","REPORTED","CLOSED"]))throw new Error("HANDOFF_CHANGED_INVALID");
      break;
    }
    case "delivery.acknowledged":{
      const x=p as DeliveryAcknowledgedPayload;
      if(!one(x?.message_id)||!one(x.consumer_agent_id)||!enums(x.status,["DELIVERED","PROCESSED","REJECTED"]))throw new Error("DELIVERY_ACK_INVALID");
      break;
    }
    default: throw new Error(`EVENT_TYPE_UNSUPPORTED:${e.event_type}`);
  }
}

export function verifyEventChain(es:readonly CommonsEvent[],id:AgentIdentity):void{
  const a=[...es].sort((x,y)=>x.stream_seq-y.stream_seq);
  let seq=1,prev:string|null=null;
  for(const e of a){
    validateEvent(e);
    if(e.agent_id!==id.agent_id)throw new Error(`EVENT_AGENT_MISMATCH:${e.event_id}`);
    if(e.stream_seq!==seq)throw new Error(`EVENT_STREAM_GAP:${e.event_id}`);
    if(e.prev_hash!==prev)throw new Error(`EVENT_PREV_HASH_MISMATCH:${e.event_id}`);
    if(!verifyEvent(e,id.public_key_pem))throw new Error(`EVENT_SIGNATURE_INVALID:${e.event_id}`);
    prev=eventHash(e);seq++;
  }
}