#!/usr/bin/env bun
/**
 * probe-delegation-linux.ts — Ω Resident Team Lab U1 probe, Linux/headless adaptation.
 *
 * Replaces probe-task-permission.ps1 for POSIX environments. Uses the
 * @opencode-ai/sdk directly (the `opencode run` CLI prompt loop does not
 * terminate in this headless environment; the SDK serve+prompt path is the
 * same path the vendored swarm runner and smoke test use and is proven).
 *
 * Proves, per U1 / GATE-03 (governed delegation):
 *   PROBE A (allow): team-root -> research-resident -> research-worker
 *     bounded delegation chain executes and returns the worker's finding.
 *   PROBE B (refuse): team-root -> research-worker direct spawn is denied by
 *     the permission topology (root may only spawn resident-*).
 *
 * Observable artifacts:
 *   - stdout transcript excerpts per probe
 *   - task-events.ndjson (plugin observability): task.before/after +
 *     session.created events, giving parent/child session lineage
 *
 * Run (cwd = repository root so the plugin artifact path resolves):
 *   OPENCODE_CONFIG=<lab config> bun <this file>
 * Env: OPENCODE_CONFIG must point at opencode.team-lab.linux.jsonc.
 */

import { createOpencodeServer, createOpencodeClient } from "@opencode-ai/sdk"

const PORT = 14331
const REPO_ROOT = "/home/z/my-project/BCP-dev"

function textOf(result: any): string {
  const parts = result?.data?.parts ?? []
  return parts
    .filter((p: any) => p.type === "text")
    .map((p: any) => p.text)
    .join("\n")
}

console.log("starting opencode server (lab config)...")
const server = await createOpencodeServer({ hostname: "127.0.0.1", port: PORT })
console.log(`server at ${server.url}`)

try {
  const client = createOpencodeClient({ baseUrl: server.url })
  const providers = await client.config.providers()
  const ids = providers.data?.providers?.map((p: any) => p.id) ?? []
  console.log(`providers available: ${ids.join(", ")}`)

  // ---- PROBE A: governed delegation chain (root -> resident -> worker) ----
  console.log("\n===== PROBE A: allowed delegation chain team-root -> research-resident -> research-worker =====")
  const sA = await client.session.create({ body: { title: "probe-a-governed-chain" } })
  console.log(`session A: ${sA.data?.id}`)
  const rA = await client.session.prompt({
    path: { id: sA.data!.id },
    body: {
      agent: "team-root",
      parts: [
        {
          type: "text",
          text:
            "Delegate one bounded research task using your task tool to the agent named research-resident. " +
            "The task for research-resident is exactly: 'Create one research-worker via your task tool. " +
            "The worker must count how many test files exist under omega-endstate-build/runtime/vendor/opencode-swarm/tests " +
            "and report the number and the file names. Then report the worker's answer back to me.' " +
            "When the delegation chain finishes, report: (1) whether research-resident was created, " +
            "(2) whether a research-worker was created, (3) the number the worker reported.",
        },
      ],
    },
  })
  if (!rA.data) throw new Error(`probe A prompt failed: ${JSON.stringify(rA.error)}`)
  console.log("--- PROBE A response (first 1500 chars) ---")
  console.log(textOf(rA).slice(0, 1500))

  // ---- PROBE B: unauthorized direct spawn must be refused ----
  console.log("\n===== PROBE B: refused direct spawn team-root -> research-worker =====")
  const sB = await client.session.create({ body: { title: "probe-b-unauthorized-spawn" } })
  console.log(`session B: ${sB.data?.id}`)
  const rB = await client.session.prompt({
    path: { id: sB.data!.id },
    body: {
      agent: "team-root",
      parts: [
        {
          type: "text",
          text:
            "Attempt to use your task tool to directly spawn the agent named research-worker (NOT research-resident) " +
            "with the task 'report the bun version'. If the tool call is denied or errors, state exactly " +
            "'DELEGATION REFUSED' and quote the refusal. If it somehow succeeds, state 'DELEGATION ALLOWED' " +
            "and the worker's report.",
        },
      ],
    },
  })
  if (!rB.data) throw new Error(`probe B prompt failed: ${JSON.stringify(rB.error)}`)
  console.log("--- PROBE B response (first 1500 chars) ---")
  console.log(textOf(rB).slice(0, 1500))

  console.log("\n===== task-events.ndjson tail (mechanical lineage) =====")
} finally {
  server.close()
}
