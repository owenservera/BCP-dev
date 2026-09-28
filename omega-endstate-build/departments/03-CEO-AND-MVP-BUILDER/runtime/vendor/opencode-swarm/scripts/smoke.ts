// Smoke test: prove opencode serve + SDK + OpenRouter work end-to-end.
// Run: bun scripts/smoke.ts [providerID/modelID]
import { createOpencodeServer, createOpencodeClient } from "@opencode-ai/sdk"

const modelArg = process.argv[2] ?? "openrouter/openai/gpt-4o-mini"
const slash = modelArg.indexOf("/")
const providerID = modelArg.slice(0, slash)
const modelID = modelArg.slice(slash + 1)

console.log(`starting opencode server...`)
const server = await createOpencodeServer({ hostname: "127.0.0.1", port: 14123 })
console.log(`server at ${server.url}`)

try {
  const client = createOpencodeClient({ baseUrl: server.url })

  const providers = await client.config.providers()
  const ids = providers.data?.providers?.map((p: any) => p.id) ?? []
  console.log(`providers available: ${ids.join(", ")}`)

  const session = await client.session.create({ body: { title: "smoke-test" } })
  if (!session.data) throw new Error(`session create failed: ${JSON.stringify(session.error)}`)
  console.log(`session: ${session.data.id}`)

  console.log(`prompting ${providerID}/${modelID}...`)
  const result = await client.session.prompt({
    path: { id: session.data.id },
    body: {
      model: { providerID, modelID },
      tools: { "*": false },
      parts: [{ type: "text", text: "Reply with exactly the word SMOKE_OK and nothing else." }],
    },
  })
  if (!result.data) throw new Error(`prompt failed: ${JSON.stringify(result.error)}`)
  console.log(`raw result: ${JSON.stringify(result.data, null, 2).slice(0, 2000)}`)

  const text = result.data.parts
    .filter((p: any) => p.type === "text")
    .map((p: any) => p.text)
    .join("")
  console.log(`response: ${JSON.stringify(text)}`)
  if (!text.includes("SMOKE_OK")) throw new Error("model did not return SMOKE_OK")
  console.log("SMOKE TEST PASSED")
} finally {
  server.close()
}
