/**
 * Ω Resident Team Lab plugin — canonical VIVIM observation layer.
 *
 * Phase 0: observe, do not replace.
 *
 * Adds lightweight Task/session observability and leaves native OpenCode Task
 * as the actual spawning primitive. Future governance belongs here only after
 * a corresponding proof checkpoint passes in docs/CHECKPOINTS.md.
 *
 * Substrate policy (CP-00):
 *   The vendored opencode-swarm substrate under ../../vendor/opencode-swarm/
 *   stays byte-for-byte. Attaching its tool layer is attempted at INIT time
 *   through a dynamic import resolved from the project directory; if the
 *   installed OpenCode build cannot support it, the lab degrades to pure
 *   observation and records the fact in artifacts/task-events.ndjson
 *   (kind: "substrate.unavailable"). The lab never modifies vendored source.
 *
 * Loader note (empirical, OpenCode 1.18.33):
 *   The config `plugin` array is resolved as npm specifiers on this build and
 *   loose .ts paths from config were observed NOT to load. The harness
 *   deploys a byte-identical copy of this file to
 *   <project>/.opencode/plugin/resident-team-lab.ts (the auto-discovery
 *   location). This file remains the single source of truth; the deployed
 *   copy must never be edited.
 */

import type { Plugin } from "@opencode-ai/plugin"
import { appendFileSync, existsSync, mkdirSync } from "node:fs"
import { dirname, resolve } from "node:path"

type JsonRecord = Record<string, unknown>

function artifactPath(directory: string): string {
  return resolve(directory, "omega-endstate-build/runtime/resident-team-lab/artifacts/task-events.ndjson")
}

function recordEvent(directory: string, event: JsonRecord): void {
  const path = artifactPath(directory)
  mkdirSync(dirname(path), { recursive: true })
  appendFileSync(
    path,
    JSON.stringify({ ts: new Date().toISOString(), ...event }) + "\n",
    "utf8",
  )
}

function swarmCandidates(directory: string): string[] {
  return [
    // this rebuild's layout
    resolve(directory, "omega-endstate-build/runtime/vendor/opencode-swarm/plugin/swarm.ts"),
    // reference repo layout (vendor sits next to resident-team-lab)
    resolve(directory, "omega-endstate-build/runtime/resident-team-lab/../vendor/opencode-swarm/plugin/swarm.ts"),
  ]
}

export const ResidentTeamPlugin: Plugin = async (ctx) => {
  const directory = (ctx as { directory?: string }).directory ?? process.cwd()

  // ---- CP-00 substrate attach (opt-in, non-fatal) -------------------------
  // EMPIRICAL FINDING (2026-09-28, live): when the plugin registers the
  // vendored swarm tool layer, the native Task tool disappears from the
  // primary agent's toolset on this build — and Task is the lab's ONLY
  // sanctioned spawning primitive. Substrate tool attach is therefore
  // OPT-IN via OPENCODE_LAB_ATTACH_SWARM=1 (substrate experiments only);
  // default lab runs are observability-only and record the decision here.
  let base: Record<string, unknown> = {}
  let substrate: "attached" | "unavailable" | "deferred" = "deferred"
  let substrateReason = "opt-out default: Task must remain the spawning primitive (set OPENCODE_LAB_ATTACH_SWARM=1 to attach swarm tools)"
  if (process.env.OPENCODE_LAB_ATTACH_SWARM === "1") {
    substrate = "unavailable"
    substrateReason = "not attempted"
    for (const candidate of swarmCandidates(directory)) {
      if (!existsSync(candidate)) continue
      try {
        const mod = (await import("file://" + candidate)) as {
          SwarmPlugin: Plugin
        }
        base = (await mod.SwarmPlugin(ctx as never)) as Record<string, unknown>
        substrate = "attached"
        substrateReason = candidate
        break
      } catch (e) {
        substrateReason = String((e as Error)?.message ?? e)
      }
    }
  }
  recordEvent(directory, {
    kind: "substrate." + substrate,
    substrate: "opencode-swarm",
    detail: substrateReason,
    tools: Object.keys((base as { tool?: Record<string, unknown> }).tool ?? {}),
  })

  // ---- VIVIM observability hooks (always on) ------------------------------
  const observation = {
    "tool.execute.before": async (input: { tool?: string; sessionID?: string; callID?: string }, output: { args?: JsonRecord }) => {
      if (input.tool !== "task") return
      recordEvent(directory, {
        kind: "task.before",
        sessionID: input.sessionID,
        callID: input.callID,
        args: output.args as JsonRecord,
      })
    },

    "tool.execute.after": async (input: { tool?: string; sessionID?: string; callID?: string; title?: string }, output: { output?: unknown }) => {
      if (input.tool !== "task") return
      recordEvent(directory, {
        kind: "task.after",
        sessionID: input.sessionID,
        callID: input.callID,
        title: input.title,
        output: output.output,
      })
    },

    event: async ({ event }: { event: { type: string; properties?: unknown } }) => {
      if (event.type === "session.created") {
        recordEvent(directory, {
          kind: "session.created",
          properties: event.properties,
        })
      }

      if (event.type === "session.deleted") {
        recordEvent(directory, {
          kind: "session.deleted",
          properties: event.properties,
        })
      }
    },
  }

  return { ...base, ...observation }
}
