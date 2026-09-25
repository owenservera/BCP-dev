import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { join, posix } from "node:path";
import { tmpdir } from "node:os";
import type { AppendResult, AgentIdentity, CommonsEvent, CommonsTransport, Cursor, EventQuery, SyncResult, TransportCapabilities } from "../types.js";
import { verifyEventChain } from "../validation.js";

export interface GitTransportOptions {
  repoRoot: string;
  agentId: string;
  agentHome: string;
  branch?: string;
  remote?: string;
  peerHomes?: Record<string, string>;
}

export const agentBranch = (agentId: string) => `commons/${agentId}`;

function run(cwd: string, args: string[], env?: Record<string,string|undefined>, input?: string): string {
  const r = spawnSync("git", args, { cwd, encoding: "utf8", env: { ...process.env, ...env }, input });
  if (r.status !== 0) throw new Error(`git ${args.join(" ")} failed: ${r.stderr || r.stdout}`);
  return r.stdout.trim();
}

function tryRun(cwd: string, args: string[]): string | null {
  const r = spawnSync("git", args, { cwd, encoding: "utf8" });
  return r.status === 0 ? r.stdout.trim() : null;
}

function isAncestor(cwd: string, older: string, newer: string): boolean {
  return spawnSync("git", ["merge-base", "--is-ancestor", older, newer], { cwd }).status === 0;
}

export function initAgentBranch(repoRoot: string, agentId: string, baseRef = "main"): string {
  const branch = agentBranch(agentId);
  tryRun(repoRoot, ["fetch", "--prune", "origin", `+refs/heads/${branch}:refs/remotes/origin/${branch}`]);
  const existing = tryRun(repoRoot, ["rev-parse", `refs/remotes/origin/${branch}`]) ?? tryRun(repoRoot, ["rev-parse", `refs/heads/${branch}`]);
  const base = existing ?? run(repoRoot, ["rev-parse", baseRef]);
  const local = tryRun(repoRoot, ["rev-parse", `refs/heads/${branch}`]);
  if (!local) run(repoRoot, ["update-ref", `refs/heads/${branch}`, base, "0000000000000000000000000000000000000000"]);
  return branch;
}

export function checkoutAgentBranch(repoRoot: string, agentId: string): void {
  throw new Error(`COMMONS_NO_CHECKOUT:${agentId}:Commons transport must never switch the agent worktree branch`);
}

async function blob(repoRoot: string, content: string): Promise<string> {
  return run(repoRoot, ["hash-object", "-w", "--stdin"], undefined, content);
}

async function appendPathToRef(
  repoRoot: string,
  branch: string,
  parentSha: string,
  paths: Array<{path:string;content:string}>
): Promise<string> {
  const tempDir = await mkdtemp(join(tmpdir(), "vivim-commons-index-"));
  const index = join(tempDir, "index");
  try {
    const env = { GIT_INDEX_FILE: index };
    run(repoRoot, ["read-tree", parentSha], env);
    for (const item of paths) {
      const b = await blob(repoRoot, item.content);
      run(repoRoot, ["update-index", "--add", "--cacheinfo", `100644,${b},${item.path}`], env);
    }
    const tree = run(repoRoot, ["write-tree"], env);
    const commit = run(repoRoot, ["commit-tree", tree, "-p", parentSha], {
      GIT_INDEX_FILE: index,
      GIT_AUTHOR_NAME: "Agent Commons",
      GIT_AUTHOR_EMAIL: "commons@vivim.local",
      GIT_COMMITTER_NAME: "Agent Commons",
      GIT_COMMITTER_EMAIL: "commons@vivim.local"
    }, `Agent Commons: append for ${branch}\n`);
    return commit;
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
}

export class GitBranchTransport implements CommonsTransport {
  private readonly branch: string;
  private readonly remote: string;
  constructor(private readonly o: GitTransportOptions) {
    this.branch = o.branch ?? agentBranch(o.agentId);
    this.remote = o.remote ?? "origin";
  }

  capabilities(): TransportCapabilities {
    return { remote: true, durable: true, cooperativePrivacy: true, sealedPrivacy: false, atomicAppend: true };
  }

  async append(_streamId: string, events: readonly CommonsEvent[]): Promise<AppendResult> {
    if (!events.length) return { event_ids: [], stream_seq_from: 0, stream_seq_to: 0 };
    if (events.some(e => e.agent_id !== this.o.agentId)) throw new Error("COMMONS_STREAM_OWNER_MISMATCH");

    const fetched = spawnSync("git", ["fetch", "--prune", this.remote, `+refs/heads/${this.branch}:refs/remotes/${this.remote}/${this.branch}`], { cwd: this.o.repoRoot, encoding: "utf8" });
    if (fetched.status !== 0 && fetched.stderr && !fetched.stderr.includes("couldn't find remote ref")) throw new Error(fetched.stderr);

    const remoteHead = tryRun(this.o.repoRoot, ["rev-parse", `refs/remotes/${this.remote}/${this.branch}`]);
    const localHead = tryRun(this.o.repoRoot, ["rev-parse", `refs/heads/${this.branch}`]);

    if (localHead && remoteHead && isAncestor(this.o.repoRoot, remoteHead, localHead) && localHead !== remoteHead) {
      const pushExisting = spawnSync("git", ["push", this.remote, `refs/heads/${this.branch}:refs/heads/${this.branch}`], { cwd: this.o.repoRoot, encoding: "utf8" });
      if (pushExisting.status === 0) {
        const first = events[0];
        return { event_ids: events.map(e => e.event_id), stream_seq_from: first.stream_seq, stream_seq_to: events.at(-1)!.stream_seq };
      }
      throw new Error(`COMMONS_PUSH_RETRY_FAILED:${pushExisting.stderr || pushExisting.stdout}`);
    }

    if (localHead && remoteHead && localHead !== remoteHead && !isAncestor(this.o.repoRoot, localHead, remoteHead)) {
      throw new Error("COMMONS_LOCAL_BRANCH_DIVERGED");
    }

    const parent = remoteHead ?? localHead ?? run(this.o.repoRoot, ["rev-parse", "main"]);

    const pathEntries = [
      ...events.map(e => ({
        path: posix.join(this.o.agentHome, "commons", "stream", "events", `${e.stream_seq.toString().padStart(12, "0")}-${e.event_id}.json`),
        content: JSON.stringify(e, null, 2) + "\n"
      })),
    ];

    const identityPath = posix.join(this.o.agentHome, "commons", "identity", "agent.json");
    let identity = tryRun(this.o.repoRoot, ["show", `${parent}:${identityPath}`]);
    if (!identity) {
      const local = join(this.o.repoRoot, identityPath);
      identity = await readFile(local, "utf8").catch(() => "");
    }
    if (!identity) throw new Error("COMMONS_IDENTITY_NOT_FOUND");

    const commit = await appendPathToRef(this.o.repoRoot, this.branch, parent, [{path: identityPath, content: identity}, ...pathEntries]);

    const current = tryRun(this.o.repoRoot, ["rev-parse", `refs/heads/${this.branch}`]);
    run(this.o.repoRoot, ["update-ref", `refs/heads/${this.branch}`, commit, current ?? "0000000000000000000000000000000000000000"]);
    const push = spawnSync("git", ["push", this.remote, `refs/heads/${this.branch}:refs/heads/${this.branch}`], { cwd: this.o.repoRoot, encoding: "utf8" });
    if (push.status !== 0) throw new Error(`git push failed: ${push.stderr || push.stdout}`);

    return { event_ids: events.map(e => e.event_id), stream_seq_from: events[0].stream_seq, stream_seq_to: events.at(-1)!.stream_seq };
  }

  async sync(): Promise<SyncResult> {
    const r = spawnSync("git", ["fetch", "--prune", this.remote, `+refs/heads/commons/*:refs/remotes/${this.remote}/commons/*`], { cwd: this.o.repoRoot, encoding: "utf8" });
    if (r.status !== 0) throw new Error(r.stderr || r.stdout);
    return { updated_refs: (r.stdout || "").split("\n").filter(Boolean) };
  }

  private refs(): string[] {
    const out = tryRun(this.o.repoRoot, ["for-each-ref", "--format=%(refname:short)", `refs/remotes/${this.remote}/commons`]);
    return out ? out.split("\n").filter(Boolean) : [];
  }

  private readRef(ref: string, home: string): CommonsEvent[] {
    const prefix = posix.join(home, "commons", "stream", "events");
    const names = run(this.o.repoRoot, ["ls-tree", "-r", "--name-only", ref, "--", prefix]).split("\n").filter(n => n.endsWith(".json"));
    const events = names.map(name => JSON.parse(run(this.o.repoRoot, ["show", `${ref}:${name}`])) as CommonsEvent);
    const identity = JSON.parse(run(this.o.repoRoot, ["show", `${ref}:${posix.join(home, "commons", "identity", "agent.json")}`])) as AgentIdentity;
    verifyEventChain(events, identity);
    return events;
  }

  async read(q: EventQuery = {}): Promise<readonly CommonsEvent[]> {
    const all: CommonsEvent[] = [];
    try { all.push(...this.readRef(this.branch, this.o.agentHome)); } catch {}
    for (const ref of this.refs()) {
      const agent = ref.split("/").at(-1);
      if (!agent) continue;
      const home = agent === this.o.agentId ? this.o.agentHome : this.o.peerHomes?.[agent];
      if (!home) continue;
      try { all.push(...this.readRef(ref, home)); } catch {}
    }
    const seen = new Set<string>();
    return all
      .filter(e => { if (seen.has(e.event_id)) return false; seen.add(e.event_id); return true; })
      .filter(e => !q.agent_id || e.agent_id === q.agent_id)
      .filter(e => !q.event_types || q.event_types.includes(e.event_type))
      .filter(e => !q.conversation_id || (e.payload as {conversation_id?:string}).conversation_id === q.conversation_id)
      .filter(e => !q.after_event_id || e.event_id > q.after_event_id)
      .sort((a,b) => a.event_id.localeCompare(b.event_id))
      .slice(0, q.limit ?? Infinity);
  }
  async readSince(streamId: string, cursor: Cursor): Promise<readonly CommonsEvent[]> {
    return (await this.read({})).filter(e => e.stream_id === streamId && e.stream_seq > cursor.stream_seq);
  }
}
