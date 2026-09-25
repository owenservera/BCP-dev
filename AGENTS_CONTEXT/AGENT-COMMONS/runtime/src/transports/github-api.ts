import { Buffer } from "node:buffer";
import type { AgentIdentity, AppendResult, CommonsEvent, CommonsTransport, Cursor, EventQuery, SyncResult, TransportCapabilities } from "../types.js";
import { eventHash } from "../crypto.js";
import { verifyEventChain } from "../validation.js";

export interface GitHubTreeEntry { path: string; mode?: string; type?: string; sha: string; }

export interface GitHubGitDataClient {
  getRef(ref: string): Promise<{ sha: string } | null>;
  createRef(ref: string, sha: string): Promise<void>;
  updateRef(ref: string, sha: string): Promise<void>;
  getCommit(sha: string): Promise<{ treeSha: string }>;
  getTree(treeSha: string): Promise<GitHubTreeEntry[]>;
  getBlob(sha: string): Promise<string>;
  createBlob(content: string): Promise<string>;
  createTree(baseTreeSha: string, entries: GitHubTreeEntry[]): Promise<string>;
  createCommit(message: string, treeSha: string, parentSha: string): Promise<string>;
  matchingRefs(prefix: string): Promise<Array<{ name: string; sha: string }>>;
}

export class FetchGitHubGitDataClient implements GitHubGitDataClient {
  constructor(private readonly o: { repositoryFullName: string; token: string; apiBaseUrl?: string }) {}

  private url(path: string): string {
    return `${(this.o.apiBaseUrl ?? "https://api.github.com").replace(/\/$/, "")}/repos/${this.o.repositoryFullName}${path}`;
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const response = await fetch(this.url(path), {
      method,
      headers: {
        accept: "application/vnd.github+json",
        authorization: `Bearer ${this.o.token}`,
        "x-github-api-version": "2022-11-28",
        ...(body === undefined ? {} : { "content-type": "application/json" }),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`GITHUB_API_${response.status}:${detail}`);
    }
    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  }

  async getRef(ref: string) {
    try {
      const r = await this.request<{ object: { sha: string } }>("GET", `/git/ref/${ref.replace(/^refs\//, "")}`);
      return { sha: r.object.sha };
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("GITHUB_API_404:")) return null;
      throw error;
    }
  }

  async createRef(ref: string, sha: string) {
    await this.request("POST", "/git/refs", { ref: `refs/${ref.replace(/^refs\//, "")}`, sha });
  }

  async updateRef(ref: string, sha: string) {
    await this.request("PATCH", `/git/refs/${ref.replace(/^refs\//, "")}`, { sha, force: false });
  }

  async getCommit(sha: string) {
    const r = await this.request<{ tree: { sha: string } }>("GET", `/git/commits/${sha}`);
    return { treeSha: r.tree.sha };
  }

  async getTree(treeSha: string) {
    const r = await this.request<{ tree?: GitHubTreeEntry[]; truncated?: boolean }>("GET", `/git/trees/${treeSha}?recursive=1`);
    if (r.truncated) throw new Error("COMMONS_GITHUB_TREE_TRUNCATED");
    return r.tree ?? [];
  }

  async getBlob(sha: string) {
    const r = await this.request<{ content: string; encoding: string }>("GET", `/git/blobs/${sha}`);
    if (r.encoding !== "base64") throw new Error("COMMONS_GITHUB_BLOB_ENCODING_UNSUPPORTED");
    return Buffer.from(r.content.replace(/\n/g, ""), "base64").toString("utf8");
  }

  async createBlob(content: string) {
    return (await this.request<{ sha: string }>("POST", "/git/blobs", { content, encoding: "utf-8" })).sha;
  }

  async createTree(baseTreeSha: string, entries: GitHubTreeEntry[]) {
    return (await this.request<{ sha: string }>("POST", "/git/trees", {
      base_tree: baseTreeSha,
      tree: entries.map(e => ({ path: e.path, mode: e.mode ?? "100644", type: e.type ?? "blob", sha: e.sha })),
    })).sha;
  }

  async createCommit(message: string, treeSha: string, parentSha: string) {
    return (await this.request<{ sha: string }>("POST", "/git/commits", { message, tree: treeSha, parents: [parentSha] })).sha;
  }

  async matchingRefs(prefix: string) {
    const refs = await this.request<Array<{ ref: string; object: { sha: string } }>>("GET", `/git/matching-refs/${prefix}`);
    return refs.map(r => ({ name: r.ref, sha: r.object.sha }));
  }
}

export interface GitHubApiTransportOptions {
  agentId: string;
  agentHome: string;
  branch?: string;
  identity: AgentIdentity;
  peerHomes: Record<string, string>;
  client: GitHubGitDataClient;
}

export class GitHubApiTransport implements CommonsTransport {
  private readonly branch: string;

  constructor(private readonly o: GitHubApiTransportOptions) {
    this.branch = o.branch ?? `commons/${o.agentId}`;
  }

  capabilities(): TransportCapabilities {
    return { remote: true, durable: true, cooperativePrivacy: true, sealedPrivacy: false, atomicAppend: true };
  }

  private ref(branch: string) { return `heads/${branch}`; }

  private async branchEvents(branch: string, home: string): Promise<CommonsEvent[]> {
    const ref = await this.o.client.getRef(this.ref(branch));
    if (!ref) return [];
    const commit = await this.o.client.getCommit(ref.sha);
    const tree = await this.o.client.getTree(commit.treeSha);
    const prefix = `${home}/commons/stream/events/`;
    const identityPath = `${home}/commons/identity/agent.json`;
    const identityEntry = tree.find(e => e.path === identityPath && e.type === "blob");
    if (!identityEntry) throw new Error(`COMMONS_IDENTITY_NOT_FOUND:${branch}`);
    const identity = JSON.parse(await this.o.client.getBlob(identityEntry.sha)) as AgentIdentity;
    const events = await Promise.all(
      tree.filter(e => e.type === "blob" && e.path.startsWith(prefix) && e.path.endsWith(".json"))
        .map(async e => JSON.parse(await this.o.client.getBlob(e.sha)) as CommonsEvent),
    );
    verifyEventChain(events, identity);
    return events.sort((a, b) => a.stream_seq - b.stream_seq);
  }

  async append(streamId: string, events: readonly CommonsEvent[]): Promise<AppendResult> {
    if (!events.length) return { event_ids: [], stream_seq_from: 0, stream_seq_to: 0 };
    if (events.some(e => e.agent_id !== this.o.agentId || e.stream_id !== streamId)) throw new Error("COMMONS_STREAM_OWNER_MISMATCH");

    const branchRef = await this.o.client.getRef(this.ref(this.branch));
    const current = branchRef ? await this.branchEvents(this.branch, this.o.agentHome) : [];
    const last = current.at(-1);
    const expectedSeq = (last?.stream_seq ?? 0) + 1;
    const expectedPrev = last ? eventHash(last) : null;
    if (events[0].stream_seq !== expectedSeq || events[0].prev_hash !== expectedPrev) throw new Error("COMMONS_STREAM_STATE_STALE:REGENERATE_EVENTS");
    verifyEventChain([...current, ...events], this.o.identity);

    const parentSha = branchRef?.sha ?? (await this.o.client.getRef(this.ref("main")))?.sha;
    if (!parentSha) throw new Error("COMMONS_MAIN_REF_NOT_FOUND");
    const parentCommit = await this.o.client.getCommit(parentSha);
    const identityPath = `${this.o.agentHome}/commons/identity/agent.json`;
    const identityBlob = await this.o.client.createBlob(JSON.stringify(this.o.identity, null, 2) + "\n");
    const eventEntries = await Promise.all(events.map(async event => ({
      path: `${this.o.agentHome}/commons/stream/events/${event.stream_seq.toString().padStart(12, "0")}-${event.event_id}.json`,
      sha: await this.o.client.createBlob(JSON.stringify(event, null, 2) + "\n"),
    })));
    const treeSha = await this.o.client.createTree(parentCommit.treeSha, [{ path: identityPath, sha: identityBlob }, ...eventEntries]);
    const commitSha = await this.o.client.createCommit(`Agent Commons: append for ${this.branch}`, treeSha, parentSha);
    try {
      if (branchRef) await this.o.client.updateRef(this.ref(this.branch), commitSha);
      else await this.o.client.createRef(this.ref(this.branch), commitSha);
    } catch (error) {
      throw new Error(`COMMONS_GITHUB_APPEND_RACE:${error instanceof Error ? error.message : String(error)}`);
    }
    return { event_ids: events.map(e => e.event_id), stream_seq_from: events[0].stream_seq, stream_seq_to: events.at(-1)!.stream_seq };
  }

  async read(q: EventQuery = {}): Promise<readonly CommonsEvent[]> {
    const refs = await this.o.client.matchingRefs("heads/commons/");
    const homes = new Map<string, string>([[this.o.agentId, this.o.agentHome], ...Object.entries(this.o.peerHomes)]);
    const all: CommonsEvent[] = [];
    for (const r of refs) {
      const branch = r.name.replace(/^refs\/heads\//, "");
      const agentId = branch.replace(/^commons\//, "");
      const home = homes.get(agentId);
      if (!home) throw new Error(`COMMONS_PEER_NOT_REGISTERED:${agentId}`);
      all.push(...await this.branchEvents(branch, home));
    }
    return all
      .filter(e => !q.agent_id || e.agent_id === q.agent_id)
      .filter(e => !q.event_types || q.event_types.includes(e.event_type))
      .filter(e => !q.conversation_id || (e.payload as { conversation_id?: string }).conversation_id === q.conversation_id)
      .filter(e => !q.after_event_id || e.event_id > q.after_event_id)
      .sort((a, b) => a.event_id.localeCompare(b.event_id))
      .slice(0, q.limit ?? Infinity);
  }

  async readSince(streamId: string, cursor: Cursor) {
    return (await this.read({})).filter(e => e.stream_id === streamId && e.stream_seq > cursor.stream_seq);
  }

  async sync(): Promise<SyncResult> {
    return { updated_refs: (await this.o.client.matchingRefs("heads/commons/")).map(r => r.name) };
  }
}
