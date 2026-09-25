import{createHash,generateKeyPairSync,sign,verify,createPrivateKey,createPublicKey,randomBytes}from"node:crypto";
import{readFile,writeFile,mkdir}from"node:fs/promises";
import{join}from"node:path";
import{spawnSync}from"node:child_process";
import{canonicalize}from"./canonical-json.js";
import type{AgentIdentity,CommonsEvent}from"./types.js";
export function uuidv7(){const b=randomBytes(16),m=BigInt(Date.now());b[0]=Number(m>>40n)&255;b[1]=Number(m>>32n)&255;b[2]=Number(m>>24n)&255;b[3]=Number(m>>16n)&255;b[4]=Number(m>>8n)&255;b[5]=Number(m)&255;b[6]=(b[6]&15)|112;b[8]=(b[8]&63)|128;const h=b.toString("hex");return`${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`}
export const sha256=(v:string)=>createHash("sha256").update(v,"utf8").digest("hex");
export const eventHash=(e:CommonsEvent)=>`sha256:${sha256(canonicalize(e))}`;
function unsigned(e:CommonsEvent){const{signature:_s,...r}=e;return r}
export function signEvent<T>(e:CommonsEvent<T>,k:string):CommonsEvent<T>{return{...e,signature:sign(null,Buffer.from(canonicalize(unsigned(e))),createPrivateKey(k)).toString("base64url")}}
export const verifyEvent=(e:CommonsEvent,k:string)=>verify(null,Buffer.from(canonicalize(unsigned(e))),createPublicKey(k),Buffer.from(e.signature,"base64url"));
function remotePublishedIdentity(repoRoot:string,id:string,remote:string,branch:string):AgentIdentity|null{
  const probe=spawnSync("git",["ls-remote","--heads",remote,`refs/heads/${branch}`],{cwd:repoRoot,encoding:"utf8"});
  if(probe.status!==0)throw new Error(`COMMONS_REMOTE_IDENTITY_CHECK_FAILED:${probe.stderr||probe.stdout}`);
  if(!probe.stdout.trim())return null;
  const fetched=spawnSync("git",["fetch","--prune",remote,`+refs/heads/${branch}:refs/remotes/${remote}/${branch}`],{cwd:repoRoot,encoding:"utf8"});
  if(fetched.status!==0)throw new Error(`COMMONS_REMOTE_IDENTITY_FETCH_FAILED:${fetched.stderr||fetched.stdout}`);
  const ref=`refs/remotes/${remote}/${branch}`;
  const listed=spawnSync("git",["ls-tree","-r","--name-only",ref],{cwd:repoRoot,encoding:"utf8"});
  if(listed.status!==0)throw new Error(`COMMONS_REMOTE_IDENTITY_TREE_FAILED:${listed.stderr||listed.stdout}`);
  const identityPaths=listed.stdout.split("\n").map(x=>x.trim()).filter(x=>x.endsWith("/commons/identity/agent.json")||x==="commons/identity/agent.json");
  if(!identityPaths.length)return null;
  let found:AgentIdentity|null=null;
  for(const path of identityPaths){
    const shown=spawnSync("git",["show",`${ref}:${path}`],{cwd:repoRoot,encoding:"utf8"});
    if(shown.status!==0)throw new Error(`COMMONS_REMOTE_IDENTITY_READ_FAILED:${id}:${path}`);
    let identity:AgentIdentity;
    try{identity=JSON.parse(shown.stdout) as AgentIdentity}catch{throw new Error(`COMMONS_REMOTE_IDENTITY_INVALID:${id}:${path}`)}
    if(identity.agent_id!==id)throw new Error(`COMMONS_REMOTE_IDENTITY_MISMATCH:${id}:${identity.agent_id}`);
    if(found)throw new Error(`COMMONS_REMOTE_IDENTITY_DUPLICATE:${id}`);
    found=identity;
  }
  return found;
}
export async function loadOrCreateIdentity(d:string,id:string,o?:{repoRoot?:string;remote?:string;branch?:string}){
  await mkdir(d,{recursive:true});
  const ip=join(d,"agent.json"),pp=join(d,"private-key.pem");
  const localIdentity=await readFile(ip,"utf8").catch(()=>null);
  const localKey=await readFile(pp,"utf8").catch(()=>null);
  if(localIdentity&&localKey){
    const identity=JSON.parse(localIdentity) as AgentIdentity;
    if(identity.agent_id!==id)throw new Error(`COMMONS_LOCAL_IDENTITY_MISMATCH:${id}:${identity.agent_id}`);
    return{identity,privateKeyPem:localKey};
  }
  if(localIdentity||localKey)throw new Error(`COMMONS_LOCAL_IDENTITY_INCOMPLETE:${id}`);
  if(o?.repoRoot){
    const remote=o.remote??"origin",branch=o.branch??`commons/${id}`;
    const published=remotePublishedIdentity(o.repoRoot,id,remote,branch);
    if(published)throw new Error(`COMMONS_IDENTITY_ALREADY_PUBLISHED:${id}:${published.key_id}:RECOVER_KEY_OR_EXPLICITLY_ROTATE`);
  }
  const{publicKey,privateKey}=generateKeyPairSync("ed25519"),publicKeyPem=publicKey.export({type:"spki",format:"pem"}).toString(),privateKeyPem=privateKey.export({type:"pkcs8",format:"pem"}).toString(),identity:AgentIdentity={agent_id:id,key_id:`${id}:ed25519:${uuidv7()}`,public_key_pem:publicKeyPem,algorithm:"ed25519",created_at:new Date().toISOString()};
  await writeFile(ip,JSON.stringify(identity,null,2)+"\n",{mode:0o600});
  await writeFile(pp,privateKeyPem,{mode:0o600});
  return{identity,privateKeyPem};
}