import { test, expect, afterEach } from "bun:test"
import { sendNotification } from "../src/notify.ts"

const saved = { ...process.env }
afterEach(() => {
  process.env.OPENCODE_NOTIFY_DESKTOP = saved.OPENCODE_NOTIFY_DESKTOP
  process.env.OPENCODE_NOTIFY_NTFY_TOPIC = saved.OPENCODE_NOTIFY_NTFY_TOPIC
  process.env.OPENCODE_NOTIFY_NTFY_URL = saved.OPENCODE_NOTIFY_NTFY_URL
})

test(
  "a hung ntfy server cannot wedge sendNotification (the v0.2.1 linger bug)",
  async () => {
    // ntfy stand-in that accepts the request and never responds
    const hung = Bun.serve({
      port: 0,
      fetch: () => new Promise<Response>(() => {}),
    })
    process.env.OPENCODE_NOTIFY_DESKTOP = "0"
    process.env.OPENCODE_NOTIFY_NTFY_TOPIC = "test-topic"
    process.env.OPENCODE_NOTIFY_NTFY_URL = `http://localhost:${hung.port}`

    const started = Date.now()
    await sendNotification("title", "body")
    const elapsed = Date.now() - started

    hung.stop(true)
    expect(elapsed).toBeLessThan(8_000) // capped by the 5s timeout, not the server
  },
  15_000,
)

test("unreachable ntfy server resolves quickly without throwing", async () => {
  process.env.OPENCODE_NOTIFY_DESKTOP = "0"
  process.env.OPENCODE_NOTIFY_NTFY_TOPIC = "test-topic"
  process.env.OPENCODE_NOTIFY_NTFY_URL = "http://127.0.0.1:1" // nothing listens here
  await sendNotification("title", "body") // must not throw
})
