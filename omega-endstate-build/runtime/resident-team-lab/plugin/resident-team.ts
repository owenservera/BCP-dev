/**
 * Ω Resident Team Lab plugin
 *
 * Phase 0: observe, do not replace.
 *
 * This plugin deliberately builds around the known-working vendored
 * opencode-swarm plugin. It adds lightweight Task/session observability but
 * leaves native OpenCode Task as the actual spawning primitive.
 *
 * Future governance belongs here only after a corresponding proof checkpoint
 * passes in docs/CHECKPOINTS.md.
 */

import type { Plugin } from "@opencode-ai/plugin"
import { SwarmPlugin } from "../../vendor/opencode-swarm/plugin/swarm.ts"
import { appendFileSync, mkdirSync } from "node:fs"
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

export const ResidentTeamPlugin: Plugin = async (ctx) => {
  const base = await SwarmPlugin(ctx)

  return {
    ...base,

    "tool.execute.before": async (input, output) => {
      if (input.tool !== "task") return
      recordEvent(ctx.directory, {
        kind: "task.before",
        sessionID: input.sessionID,
        callID: input.callID,
        args: output.args as JsonRecord,
      })
    },

    "tool.execute.after": async (input, output) => {
      if (input.tool !== "task") return
      recordEvent(ctx.directory, {
        kind: "task.after",
        sessionID: input.sessionID,
        callID: input.callID,
        title: input.title,
        output: output.output,
      })
    },

    event: async ({ event }) => {
      if (event.type === "session.created") {
        recordEvent(ctx.directory, {
          kind: "session.created",
          properties: event.properties,
        })
      }

      if (event.type === "session.deleted") {
        recordEvent(ctx.directory, {
          kind: "session.deleted",
          properties: event.properties,
        })
      }
    },
  }
}
