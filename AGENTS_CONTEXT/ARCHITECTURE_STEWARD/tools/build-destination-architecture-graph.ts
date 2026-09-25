#!/usr/bin/env bun
/**
 * VIVIM Destination Architecture Graph builder.
 *
 * Documentation-first by design:
 * - reads destination/architecture/research documents;
 * - emits one typed graph;
 * - keeps source lineage;
 * - does not infer runtime dependencies from file proximity;
 * - never reads application source code as architectural authority.
 *
 * Run from repository root:
 *   bun run AGENTS_CONTEXT/ARCHITECTURE_STEWARD/tools/build-destination-architecture-graph.ts
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";

type NodeKind =
  | "document" | "vision_anchor" | "destination_concept" | "responsibility"
  | "requirement" | "journey" | "vertical_slice" | "keystone"
  | "si_atom" | "evidence" | "reference_piece" | "composition" | "workstream";

type GraphNode = {
  id: string; kind: NodeKind; name: string; layer: string;
  authority: string; status: string; sourceRefs: string[];
  properties: Record<string, unknown>;
};

type GraphEdge = {
  id: string; from: string; to: string; relation: string; class: string;
  status: string; basis: string; sourceRefs: string[];
  evidenceRefs: string[]; reason: string | null;
};

const SOURCES = {
  matrix: "docs/destination/core-vs-plugin-boundary/DESTINATION-RESPONSIBILITY-MATRIX.md",
  master: "docs/destination/DESTINATION-MASTER-MAP.md",
  trace: "docs/destination/REQUIREMENT-EVIDENCE-TRACEABILITY.md",
  slices: "docs/destination/VERTICAL-SLICE-REGISTRY.md",
  dep: "docs/destination/DEPENDENCY-GRAPHS-AND-KEYSTONE-SCORECARD.md",
  north: "docs/destination/NORTH-STAR.md",
  human: "docs/destination/HUMAN-EXPERIENCE.md",
  conceptual: "docs/destination/CONCEPTUAL-MODEL.md",
  siAtoms: "docs/destination/system-intelligence/indexes/ATOMS.json",
  siEdges: "docs/destination/system-intelligence/indexes/EDGES.json",
  journeyMap: "docs/destination/architecture/research/JOURNEY-ARCHITECTURE-MAPPING.md",
  handoff: "AGENTS_CONTEXT/ARCHITECTURE_STEWARD/SESSION-HANDOFF-2026-09-25.md",
  currentBuild: "docs/destination/architecture/graph/CURRENT-BUILD-VIEW.md",
};

const OUT = "docs/destination/architecture/graph";

const nodes = new Map<string, GraphNode>();
const edges: GraphEdge[] = [];

const clean = (value: string) => value.trim().replace(/^\*\*|\*\*$/g, "");
const slug = (value: string, prefix: string) =>
  prefix + value.toUpperCase().replace(/[^A-Z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70);

function addNode(node: GraphNode) {
  if (!nodes.has(node.id)) nodes.set(node.id, node);
}

function addEdge(edge: GraphEdge) {
  edges.push(edge);
}

function row(line: string): string[] {
  return line.slice(1, -1).split("|").map(s => s.trim());
}

function concept(name: string): GraphNode | undefined {
  return [...nodes.values()].find(
    n => n.kind === "destination_concept" && n.name.toUpperCase() === name.toUpperCase(),
  );
}

const [matrix, master, trace, slices, dep, journeyMap, siAtomsText, siEdgesText] = await Promise.all([
  readFile(SOURCES.matrix, "utf8"),
  readFile(SOURCES.master, "utf8"),
  readFile(SOURCES.trace, "utf8"),
  readFile(SOURCES.slices, "utf8"),
  readFile(SOURCES.dep, "utf8"),
  readFile(SOURCES.journeyMap, "utf8"),
  readFile(SOURCES.siAtoms, "utf8"),
  readFile(SOURCES.siEdges, "utf8"),
]);

const docs: Array<[string,string,string,string,string]> = [
  ["DOC-NORTH-STAR","North Star",SOURCES.north,"vision","current"],
  ["DOC-HUMAN-EXPERIENCE","Human Experience",SOURCES.human,"vision","current"],
  ["DOC-CONCEPTUAL-MODEL","Conceptual Model",SOURCES.conceptual,"destination","current"],
  ["DOC-DESTINATION-MASTER-MAP","Destination Master Map",SOURCES.master,"destination","current"],
  ["DOC-RESPONSIBILITY-MATRIX","Destination Responsibility Matrix",SOURCES.matrix,"architecture","current"],
  ["DOC-REQ-TRACE","Requirement & Evidence Traceability",SOURCES.trace,"architecture","current"],
  ["DOC-VS-REGISTRY","Vertical Slice Registry",SOURCES.slices,"architecture","current"],
  ["DOC-DEPENDENCY-GRAPH","Dependency Graphs & Keystone Scorecard",SOURCES.dep,"architecture","current"],
  ["DOC-SI-ATOMS","System Intelligence Atoms Index",SOURCES.siAtoms,"research","research-input"],
  ["DOC-SI-EDGES","System Intelligence Edges Index",SOURCES.siEdges,"research","research-input"],
  ["DOC-JOURNEY-ARCH-MAPPING","Journey → Architecture Mapping",SOURCES.journeyMap,"architecture","current"],
];
for (const [id,name,path,layer,status] of docs) {
  addNode({id,kind:"document",name,layer,authority:"document",status,sourceRefs:[path],properties:{}});
}

// Vision anchors are deliberately small and source-backed.
for (const [id,name,refs] of [
  ["VISION-SOVEREIGN-ENV","Sovereign personal computing environment",[SOURCES.north]],
  ["VISION-PERSISTENT-WORLD","Persistent digital world",[SOURCES.north,SOURCES.human]],
  ["VISION-SIMPLE-MENTAL-MODEL","Extreme internal complexity with simple human mental model",[SOURCES.north]],
  ["VISION-INTERACTION-LOOP","My world → context → what I want → what can be done → what happened",[SOURCES.north,SOURCES.human]],
] as const) addNode({id,kind:"vision_anchor",name,layer:"vision",authority:"destination-vision",status:"current",sourceRefs:refs,properties:{}});

for (const [id,from,to,relation] of [
  ["V-001","DOC-NORTH-STAR","VISION-SOVEREIGN-ENV","DEFINES"],
  ["V-002","DOC-HUMAN-EXPERIENCE","VISION-PERSISTENT-WORLD","ELABORATES"],
  ["V-003","DOC-NORTH-STAR","VISION-SIMPLE-MENTAL-MODEL","DEFINES"],
  ["V-004","DOC-NORTH-STAR","VISION-INTERACTION-LOOP","FRAMES"],
] as const) addEdge({id,from,to,relation,class:"descriptive",status:"current",basis:"source-text",sourceRefs:[],evidenceRefs:[],reason:null});

// Destination concepts from the master-map table.
for (const line of master.split(/\r?\n/)) {
  if (!line.startsWith("| ") || line.startsWith("| Destination concept") || line.startsWith("|---")) continue;
  const c = row(line);
  if (c.length !== 5) continue;
  const [name,current,legacy,truth,req] = c;
  if (!name || name.includes("~~~")) continue;
  const id = slug(name,"CON-");
  addNode({id,kind:"destination_concept",name,layer:"destination",authority:"destination-master-map",status:"current",sourceRefs:[SOURCES.master],properties:{currentMaterial:current,strongestMineEvidence:legacy,currentTruth:truth,destinationRequirement:req}});
  addEdge({id:"DOC-"+id,from:"DOC-DESTINATION-MASTER-MAP",to:id,relation:"DEFINES",class:"descriptive",status:"current",basis:"source-text",sourceRefs:[SOURCES.master],evidenceRefs:[],reason:null});
}

// 125-row responsibility universe.
for (const line of matrix.split(/\r?\n/)) {
  if (!/^\| R-\d+ \|/.test(line)) continue;
  const c = row(line);
  if (c.length < 9) continue;
  const [rid,responsibility,owns,boundary,owner,dataOwner,authority,replacement,status] = c;
  addNode({id:rid,kind:"responsibility",name:responsibility,layer:"architecture",authority:"destination-responsibility-matrix",status,sourceRefs:[SOURCES.matrix],properties:{whatItOwns:owns,boundaryClass:boundary,semanticOwner:owner,canonicalDataOwner:dataOwner,authorityEnforcement:authority,replacementSeam:replacement,currentStatus:status}});
  addEdge({id:"DOC-"+rid,from:"DOC-RESPONSIBILITY-MATRIX",to:rid,relation:"INVENTORIES",class:"descriptive",status:"current",basis:"source-text",sourceRefs:[SOURCES.matrix],evidenceRefs:[],reason:null});
}

// Journeys and requirements.
for (const line of trace.split(/\r?\n/)) {
  if (/^\| \*\*J\d/.test(line)) {
    const c=row(line); if(c.length>=5) {
      const jid=c[0].replace(/\*\*/g,"").split(" ")[0];
      addNode({id:jid,kind:"journey",name:c[0].replace(/\*\*/g,""),layer:"experience",authority:"traceability",status:"current",sourceRefs:[SOURCES.trace],properties:{outcome:c[1],primaryDependencies:c[2],currentOverallRead:c[3],nextGate:c[4]}});
      addEdge({id:"DOC-"+jid,from:"DOC-REQ-TRACE",to:jid,relation:"REGISTERS",class:"descriptive",status:"current",basis:"source-text",sourceRefs:[SOURCES.trace],evidenceRefs:[],reason:null});
      for(const dep of c[2].split(",").map(s=>s.trim()).filter(Boolean)){const t=concept(dep);if(t)addEdge({id:jid+"-"+t.id,from:jid,to:t.id,relation:"DEPENDS_ON",class:"product",status:"current",basis:"source-text",sourceRefs:[SOURCES.trace],evidenceRefs:[],reason:null});}
    }
  }
  if (/^\| [^|]+ \| J[1-8]/.test(line) && !line.includes("Requirement |")) {
    const c=row(line); if(c.length>=4) {
      const name=c[0], id=slug(name,"REQ-");
      addNode({id,kind:"requirement",name,layer:"destination",authority:"traceability",status:"current",sourceRefs:[SOURCES.trace],properties:{journeyCoverage:c[1],currentImplementation:c[2],remainingGap:c[3]}});
      addEdge({id:"DOC-"+id,from:"DOC-REQ-TRACE",to:id,relation:"REGISTERS",class:"descriptive",status:"current",basis:"source-text",sourceRefs:[SOURCES.trace],evidenceRefs:[],reason:null});
      for(const j of c[1].match(/J[1-8]/g)||[])addEdge({id:id+"-"+j,from:id,to:j,relation:"SERVES",class:"product",status:"current",basis:"source-text",sourceRefs:[SOURCES.trace],evidenceRefs:[],reason:null});
    }
  }
}

// Vertical slices.
for (const line of slices.split(/\r?\n/)) {
  if (!/^\| \*\*VS\d/.test(line)) continue;
  const c=row(line); if(c.length<5)continue;
  const name=c[0].replace(/\*\*/g,""),id=name.replace("VS","VS-");
  addNode({id,kind:"vertical_slice",name,layer:"proof",authority:"vertical-slice-registry",status:"current",sourceRefs:[SOURCES.slices],properties:{userOutcome:c[1],mainDependencies:c[2],current:c[3],target:c[4]}});
  addEdge({id:"DOC-"+id,from:"DOC-VS-REGISTRY",to:id,relation:"REGISTERS",class:"descriptive",status:"current",basis:"source-text",sourceRefs:[SOURCES.slices],evidenceRefs:[],reason:null});
  for(const dep of c[2].split(",").map(s=>s.trim()).filter(Boolean)){const t=concept(dep);if(t)addEdge({id:id+"-"+t.id,from:id,to:t.id,relation:"DEPENDS_ON",class:"product",status:"current",basis:"source-text",sourceRefs:[SOURCES.slices],evidenceRefs:[],reason:null});}
}

// Journey → architecture mapping. This is explicit product mapping, not inferred runtime structure.
for (const section of journeyMap.split(/(?=^## J[1-8] —)/m)) {
  const header = section.match(/^## (J[1-8]) —/m);
  if (!header) continue;
  const jid = header[1];
  if (!nodes.has(jid)) continue;
  addEdge({id:"MAP-DOC-"+jid,from:"DOC-JOURNEY-ARCH-MAPPING",to:jid,relation:"DESCRIBES",class:"descriptive",status:"current",basis:"journey-architecture-mapping",sourceRefs:[SOURCES.journeyMap],evidenceRefs:[],reason:"Journey → Architecture Mapping explicitly characterizes this journey."});
  for (const rid of [...new Set(section.match(/\bR-\d{3}\b/g) || [])]) {
    if (!nodes.has(rid)) continue;
    addEdge({id:jid+"-"+rid+"-MAP",from:jid,to:rid,relation:"DEPENDS_ON",class:"product",status:"current",basis:"journey-architecture-mapping",sourceRefs:[SOURCES.journeyMap],evidenceRefs:[],reason:"The journey mapping explicitly identifies this responsibility as exercised by the journey; this is a product dependency, not an automatic hard runtime prerequisite."});
  }
  for (const vs of [...new Set(section.match(/\bVS\d+\b/g) || [])]) {
    const vid = vs.replace(/^VS(\d+)$/,"VS-$1");
    if (!nodes.has(vid)) continue;
    addEdge({id:vid+"-"+jid+"-TESTS",from:vid,to:jid,relation:"TESTS",class:"product",status:"current",basis:"journey-architecture-mapping",sourceRefs:[SOURCES.journeyMap],evidenceRefs:[],reason:"The journey mapping identifies this vertical slice as a primary, supporting or adjacent convergence test for the journey."});
  }
}

// Ranked keystones.
for (const line of dep.split(/\r?\n/)) {
  if (!/^\| \d+ \| \*\*[^|]+\*\* \|/.test(line)) continue;
  const c=row(line); if(c.length<9)continue;
  const name=clean(c[1]), id=slug(name,"KEY-");
  addNode({id,kind:"keystone",name,layer:"architecture",authority:"dependency-scorecard",status:"current",sourceRefs:[SOURCES.dep],properties:{rank:clean(c[0]),currentLevel:c[2],target:c[3],gap:c[4],fanOut:c[5],complexity:c[6],why:c[7]}});
  addEdge({id:"DOC-"+id,from:"DOC-DEPENDENCY-GRAPH",to:id,relation:"PROJECTS",class:"descriptive",status:"current",basis:"source-text",sourceRefs:[SOURCES.dep],evidenceRefs:[],reason:null});
}

// System Intelligence atoms, evidence and typed relations.
const atoms=JSON.parse(siAtomsText).atoms as any[];
const siEdges=JSON.parse(siEdgesText).edges as any[];
for(const a of atoms){
  addNode({id:a.id,kind:"si_atom",name:a.subject?.name||a.id,layer:"research",authority:"system-intelligence",status:"research",sourceRefs:[SOURCES.siAtoms],properties:{subjectKind:a.subject?.kind,claim:a.claim,siStatus:a.status,lineage:a.lineage,product:a.product,program:a.program,maturity:a.maturity,unknowns:a.unknowns,conflicts:a.conflicts,externalReality:a.external_reality,proofCritical:a.proof_critical,researchRole:a.research_role,metrics:a.metrics||null}});
  addEdge({id:"DOC-"+a.id,from:"DOC-SI-ATOMS",to:a.id,relation:"INDEXES",class:"descriptive",status:"current",basis:"source-text",sourceRefs:[SOURCES.siAtoms],evidenceRefs:[],reason:null});
  for(const [evIndex,ev] of (a.evidence||[]).entries()){
    const evidenceId = ev.id || `EV-AUTO-${a.id}-${String(evIndex+1).padStart(2,"0")}`;
    addNode({id:evidenceId,kind:"evidence",name:evidenceId,layer:"evidence",authority:"system-intelligence",status:"evidence",sourceRefs:[SOURCES.siAtoms],properties:{source:ev.source,path:ev.path,location:ev.location,evidenceKind:ev.evidence_kind,note:ev.note||null,idOrigin:ev.id?"source":"deterministic-from-atom-and-position",sourceAtom:a.id,sourceEvidenceIndex:evIndex+1}});
    addEdge({id:a.id+"-"+evidenceId,from:evidenceId,to:a.id,relation:"EVIDENCES",class:"evidence",status:"current",basis:"source-text",sourceRefs:[SOURCES.siAtoms],evidenceRefs:[evidenceId],reason:ev.id?null:"Source evidence record had no canonical id; the graph assigns a deterministic derived identity scoped to the source atom and record position."});
  }
  for(const j of a.product?.journeys||[])if(nodes.has(j))addEdge({id:a.id+"-"+j,from:a.id,to:j,relation:"INFORMS",class:"product",status:"current",basis:"source-text",sourceRefs:[SOURCES.siAtoms],evidenceRefs:[],reason:null});
  for(const v of a.product?.vertical_slices||[]){const vid=v.replace("VS","VS-");if(nodes.has(vid))addEdge({id:a.id+"-"+vid,from:a.id,to:vid,relation:"INFORMS",class:"product",status:"current",basis:"source-text",sourceRefs:[SOURCES.siAtoms],evidenceRefs:[],reason:null});}
  for(const cc of a.product?.concepts||[]){const t=concept(cc);if(t)addEdge({id:a.id+"-"+t.id,from:a.id,to:t.id,relation:"DESCRIBES",class:"semantic",status:"current",basis:"source-text",sourceRefs:[SOURCES.siAtoms],evidenceRefs:[],reason:null});}
  for(const ws of a.program?.workstreams||[]){const wid=slug(ws,"WS-");addNode({id:wid,kind:"workstream",name:ws,layer:"program",authority:"system-intelligence",status:"current",sourceRefs:[SOURCES.siAtoms],properties:{}});addEdge({id:a.id+"-"+wid,from:a.id,to:wid,relation:"CONTRIBUTES_TO",class:"product",status:"current",basis:"source-text",sourceRefs:[SOURCES.siAtoms],evidenceRefs:[],reason:null});}
}
for(const e of siEdges){
  for(const ev of e.evidence||[])addNode({id:ev.id,kind:"evidence",name:ev.id,layer:"evidence",authority:"system-intelligence",status:"evidence",sourceRefs:[SOURCES.siEdges],properties:{source:ev.source,path:ev.path,location:ev.location,evidenceKind:ev.evidence_kind,note:ev.note||null}});
  addEdge({id:e.id,from:e.from,to:e.to,relation:e.type,class:["REQUIRES","DEPENDS_ON","GATES"].includes(e.type)?"runtime":["SUPERSEDES","VARIANT_OF"].includes(e.type)?"lifecycle":"semantic",status:"current",basis:"system-intelligence-index",sourceRefs:[SOURCES.siEdges],evidenceRefs:(e.evidence||[]).map((x:any)=>x.id),reason:e.reason||null});
}

// First reference composition from fresh readiness evidence.
for(const [id,name] of [
 ["PIECE-VIVIM-LAW","vivim.law"],["PIECE-VIVIM-VAULT","vivim.vault"],
 ["PIECE-VIVIM-RUN","vivim.run"],["PIECE-VIVIM-MIND","vivim.mind"],
 ["PIECE-INTENT-NLCL","intent / NLCL"],["PIECE-PROVIDER-BROWSER","provider.browser"],
 ["PIECE-RESEARCH-CAPABILITY","thin research capability"],
] as const) addNode({id,kind:"reference_piece",name,layer:"composition",authority:"fresh-coding-readiness",status:"candidate",sourceRefs:[SOURCES.handoff,SOURCES.currentBuild],properties:{classification:"first-party/system plugin"}});
addNode({id:"COMP-FIRST-RESEARCH-EVIDENCE-WORLD",kind:"composition",name:"Research → Evidence → World",layer:"composition",authority:"fresh-coding-readiness",status:"candidate",sourceRefs:[SOURCES.handoff,SOURCES.currentBuild],properties:{path:"Address → Intent → Context → Capability → Realization → Authority → Work → Execution → Evidence → World → Product Instance continuity"}});
const readinessRefs = [SOURCES.handoff, SOURCES.currentBuild];
for(const n of ["PIECE-VIVIM-LAW","PIECE-VIVIM-VAULT","PIECE-VIVIM-RUN","PIECE-VIVIM-MIND","PIECE-INTENT-NLCL","PIECE-PROVIDER-BROWSER","PIECE-RESEARCH-CAPABILITY"])addEdge({id:"COMP-"+n,from:n,to:"COMP-FIRST-RESEARCH-EVIDENCE-WORLD",relation:"PARTICIPATES_IN",class:"product",status:"candidate",basis:"fresh-coding-readiness",sourceRefs:[SOURCES.handoff,SOURCES.currentBuild],evidenceRefs:[],reason:"First reference piece is explicitly selected by the fresh readiness handoff and current build view."});

for(const jid of ["J1","J2","J3","J4","J5","J6"])addEdge({id:"COMP-J-"+jid,from:"COMP-FIRST-RESEARCH-EVIDENCE-WORLD",to:jid,relation:"TESTS",class:"product",status:"candidate",basis:"current-build-view",sourceRefs:[SOURCES.currentBuild,SOURCES.handoff],evidenceRefs:[],reason:"The current build view identifies this journey as exercised by the first Research → Evidence → World composition."});
for(const vid of ["VS-0","VS-3","VS-4","VS-5","VS-8"])addEdge({id:"COMP-"+vid,from:"COMP-FIRST-RESEARCH-EVIDENCE-WORLD",to:vid,relation:"TESTS",class:"product",status:"candidate",basis:"current-build-view",sourceRefs:[SOURCES.currentBuild,SOURCES.handoff],evidenceRefs:[],reason:"The current build view identifies this vertical slice as a convergence surface for the first Research → Evidence → World composition."});

// Deterministic lineage repair: descriptive/generated edges inherit their source from the originating node when no explicit source was supplied.
for (const e of edges) if (!e.sourceRefs.length && nodes.has(e.from)) e.sourceRefs = [...(nodes.get(e.from)!.sourceRefs)];
for(const n of nodes.values()) if(n.id==="DOC-CODING-READINESS") nodes.delete(n.id);

const nodeArray=[...nodes.values()];
const dedup=new Map<string,GraphEdge>();
for(const e of edges)dedup.set(e.id,e);
const edgeArray=[...dedup.values()];
const ids=new Set(nodeArray.map(n=>n.id));
const invalid=edgeArray.filter(e=>!ids.has(e.from)||!ids.has(e.to));
const counts:any={nodes:nodeArray.length,edges:edgeArray.length,invalidEdges:invalid.length};
const relationCounts: Record<string,number> = {};
for (const e of edgeArray) relationCounts[e.relation]=(relationCounts[e.relation]||0)+1;
const sourceDocuments=[...new Set(Object.values(SOURCES))].sort();
for(const n of nodeArray)counts[n.kind]=(counts[n.kind]||0)+1;
const evidenceNodes=nodeArray.filter(n=>n.kind==="evidence").length;
counts.evidenceNodes=evidenceNodes;

if(counts.responsibility!==125)throw new Error(`Expected 125 responsibilities, got ${counts.responsibility}`);
if(counts.keystone!==10)throw new Error(`Expected 10 keystone projections, got ${counts.keystone}`);
if(counts.journey!==8)throw new Error(`Expected 8 journeys, got ${counts.journey}`);
if(!nodeArray.some(n=>n.id==="DOC-JOURNEY-ARCH-MAPPING"))throw new Error("Journey mapping document node missing");
if(counts.si_atom!==44)throw new Error(`Expected 44 SI atoms, got ${counts.si_atom}`);
if((JSON.parse(siEdgesText).edges||[]).length!==65)throw new Error(`Expected 65 SI edges`);
if(evidenceNodes<1)throw new Error("Graph contains no evidence nodes");
if(nodeArray.some(n=>n.id==="undefined"))throw new Error("Evidence node id undefined; source evidence records must receive deterministic IDs");
if(edgeArray.some(e=>String(e.from)==="undefined"||String(e.to)==="undefined"||e.evidenceRefs?.some((id:any)=>id==null)))throw new Error("Evidence graph contains undefined/null identity");
if(invalid.length)throw new Error(`Invalid graph endpoints: ${invalid.map(e=>e.id).join(", ")}`);

await mkdir(OUT,{recursive:true});
await writeFile(OUT+"/NODES.json",JSON.stringify({schemaVersion:"0.2",generatedAt:new Date().toISOString().slice(0,10),repository:"owenservera/BCP-dev",nodes:nodeArray},null,2)+"\n");
await writeFile(OUT+"/EDGES.json",JSON.stringify({schemaVersion:"0.2",generatedAt:new Date().toISOString().slice(0,10),repository:"owenservera/BCP-dev",edges:edgeArray},null,2)+"\n");
await writeFile(OUT+"/GRAPH-MANIFEST.json",JSON.stringify({schemaVersion:"0.2",graphId:"VIVIM-DESTINATION-ARCHITECTURE",generatedAt:new Date().toISOString().slice(0,10),sourceDocuments,documentationFirst:true,codeIncluded:false,counts,relationCounts,validation:{allEndpointsPresent:invalid.length===0}},null,2)+"\n");
console.log(JSON.stringify(counts,null,2));
