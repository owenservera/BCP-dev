import { access } from "node:fs/promises";
import { spawnSync } from "node:child_process";

export type ExecutionSurface = "LOCAL_RUNTIME" | "WEBAPP" | "HYBRID" | "UNKNOWN";
export type CommonsTransportChoice = "GIT_BRANCH" | "GITHUB_API" | "READ_ONLY" | "UNAVAILABLE";

export interface SessionCapabilityProfile {
  session_id: string;
  execution_surface: ExecutionSurface;
  observed_at: string;
  capabilities: {
    repository_read: boolean;
    repository_write: boolean;
    filesystem: boolean;
    runtime_exec: boolean;
    git_exec: boolean;
    github_api: boolean;
    network: boolean;
    persistent_process: boolean;
    signing_key: boolean;
  };
  commons: {
    read: boolean;
    signed_write: boolean;
    preferred_transport: CommonsTransportChoice;
  };
}

const executableAvailable = (name: string): boolean =>
  spawnSync(name, ["--version"], { encoding: "utf8", stdio: "ignore" }).status === 0;

export async function detectLocalSessionCapabilities(
  repoRoot: string,
  agentHome?: string,
): Promise<SessionCapabilityProfile> {
  const filesystem = await access(repoRoot).then(() => true).catch(() => false);
  const git = executableAvailable("git");
  const runtime = Boolean(process.versions.node || (globalThis as { Bun?: unknown }).Bun);
  const signingKey = agentHome
    ? await access(`${repoRoot}/${agentHome}/commons/identity/private-key.pem`).then(() => true).catch(() => false)
    : false;
  const githubApi = Boolean(process.env.GITHUB_TOKEN || process.env.GH_TOKEN);
  const preferred_transport = selectCommonsTransport({
    session_id: process.env.COMMONS_SESSION_ID ?? `session-${Date.now()}`,
    execution_surface: "LOCAL_RUNTIME",
    observed_at: new Date().toISOString(),
    capabilities: {
      repository_read: filesystem,
      repository_write: filesystem,
      filesystem,
      runtime_exec: runtime,
      git_exec: git,
      github_api: githubApi,
      network: githubApi,
      persistent_process: false,
      signing_key: signingKey,
    },
    commons: { read: filesystem || githubApi, signed_write: false, preferred_transport: "UNAVAILABLE" },
  });
  return {
    session_id: process.env.COMMONS_SESSION_ID ?? `session-${Date.now()}`,
    execution_surface: "LOCAL_RUNTIME",
    observed_at: new Date().toISOString(),
    capabilities: {
      repository_read: filesystem,
      repository_write: filesystem,
      filesystem,
      runtime_exec: runtime,
      git_exec: git,
      github_api: githubApi,
      network: githubApi,
      persistent_process: false,
      signing_key: signingKey,
    },
    commons: {
      read: filesystem || githubApi,
      signed_write: signingKey && (filesystem || githubApi),
      preferred_transport,
    },
  };
}

export function selectCommonsTransport(profile: SessionCapabilityProfile): CommonsTransportChoice {
  if (
    profile.capabilities.runtime_exec &&
    profile.capabilities.git_exec &&
    profile.capabilities.signing_key &&
    profile.capabilities.repository_write
  ) return "GIT_BRANCH";

  if (
    profile.capabilities.github_api &&
    profile.capabilities.signing_key &&
    profile.capabilities.repository_write
  ) return "GITHUB_API";

  if (profile.capabilities.github_api && profile.capabilities.repository_read) return "READ_ONLY";

  return "UNAVAILABLE";
}

export function webAppCapabilityProfile(input: {
  session_id: string;
  repository_read: boolean;
  repository_write: boolean;
  github_api: boolean;
  signing_key: boolean;
  network?: boolean;
  persistent_process?: boolean;
}): SessionCapabilityProfile {
  const base = {
    session_id: input.session_id,
    execution_surface: "WEBAPP" as const,
    observed_at: new Date().toISOString(),
    capabilities: {
      repository_read: input.repository_read,
      repository_write: input.repository_write,
      filesystem: false,
      runtime_exec: false,
      git_exec: false,
      github_api: input.github_api,
      network: input.network ?? input.github_api,
      persistent_process: input.persistent_process ?? false,
      signing_key: input.signing_key,
    },
  };
  const preferred_transport = selectCommonsTransport({
    ...base,
    commons: { read: base.capabilities.repository_read || base.capabilities.github_api, signed_write: false, preferred_transport: "UNAVAILABLE" },
  });
  return {
    ...base,
    commons: {
      read: base.capabilities.repository_read || base.capabilities.github_api,
      signed_write: input.signing_key && input.github_api && input.repository_write,
      preferred_transport,
    },
  };
}
