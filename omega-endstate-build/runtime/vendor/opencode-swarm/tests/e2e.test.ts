/**
 * End-to-end test: real `opencode serve`, real OpenRouter model, real swarm.
 * Skipped automatically when opencode or OpenRouter auth is unavailable.
 * Run: bun test tests/e2e.test.ts --timeout 240000
 */
import { test, expect } from "bun:test"
import { existsSync } from "node:fs"
import { rmSync, mkdtempSync } from "node:fs"
import { tmpdir, homedir } from "node:os"
import { join } from "node:path"
import { openDb, resolveDbPath } from "../src/db.ts"
import { SwarmMemory } from "../src/memory.ts"
import { runSwarm } from "../src/runner.ts"
import type { SwarmConfig } from "../src/config.ts"

const hasOpencode = Bun.which("opencode") !== null
const hasAuth = existsSync(join(homedir(), ".local/share/opencode/auth.json"))
const enabled = hasOpencode && hasAuth && process.env.SWARM_E2E !== "0"

test.skipIf(!enabled)(
  "two agents share memory and pass messages through a real swarm",
  async () => {
    const dir = mkdtempSync(join(tmpdir(), "swarm-e2e-"))
    try {
      const config: SwarmConfig = {
        name: "e2e",
        model: "openrouter/openai/gpt-4o-mini",
        maxRounds: 3,
        agents: [
          {
            name: "scout",
            task:
              "Use swarm_memory_set to store the value BLUE-42 under the key secret-code. " +
              "Then use swarm_send to tell the agent named analyst: 'the code is in shared memory under secret-code'. " +
              "Then state you are done.",
            tools: { "*": false },
          },
          {
            name: "analyst",
            task:
              "You are waiting for instructions from your teammate scout. Check swarm_inbox. " +
              "If you have no messages yet, just say WAITING. When a message tells you about a shared memory key, " +
              "read it with swarm_memory_get and state the exact value you found.",
            tools: { "*": false },
          },
        ],
      }

      const events: string[] = []
      const result = await runSwarm(config, {
        dir,
        quiet: true,
        onEvent: (e) => events.push(JSON.stringify(e)),
      })

      expect(result.status).toBe("completed")
      const analyst = result.agents.find((a) => a.name === "analyst")
      expect(analyst?.status).toBe("done")
      expect(analyst?.result ?? "").toContain("BLUE-42")

      // WINDOWS ADAPTATION (VIVIM): this Database was opened and never closed upstream. On POSIX
      // the handle is released at process exit, but here it would still be held when the `finally`
      // below calls rmSync(dir), which fails with EBUSY on Windows while the -wal/-shm sidecars are
      // locked. Closed before the assertions can throw, so a failure is not masked as a teardown bug.
      const db = openDb(resolveDbPath(dir))
      let entry: ReturnType<SwarmMemory["get"]>
      try {
        entry = new SwarmMemory(db, result.swarmId).get("secret-code")
      } finally {
        db.close()
      }
      expect(entry?.value).toContain("BLUE-42")
      expect(entry?.updatedBy).toBe("scout")
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  },
  240_000,
)
