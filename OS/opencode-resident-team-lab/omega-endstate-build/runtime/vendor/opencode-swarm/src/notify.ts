/**
 * Notification helpers shared by the notify plugin and the swarm runner.
 *
 * Env:
 *   OPENCODE_NOTIFY_NTFY_TOPIC  — ntfy topic for phone/push notifications (optional)
 *   OPENCODE_NOTIFY_NTFY_URL    — ntfy server base URL (default https://ntfy.sh)
 *   OPENCODE_NOTIFY_DESKTOP=0   — disable desktop notifications
 *
 * Every channel is timeout-capped: a hung notify-send (headless/no dbus) or an
 * unreachable ntfy server must never wedge the process that awaits this.
 */
const NOTIFY_TIMEOUT_MS = 5_000

export async function sendNotification(title: string, body: string): Promise<void> {
  if (process.env.OPENCODE_NOTIFY_DESKTOP !== "0") {
    try {
      const proc = Bun.spawn(["notify-send", "--app-name=opencode", title, body])
      await Promise.race([
        proc.exited,
        new Promise<void>((resolve) =>
          setTimeout(() => {
            proc.kill()
            resolve()
          }, NOTIFY_TIMEOUT_MS),
        ),
      ])
    } catch {
      // notify-send not installed or no display — push channel below still works
    }
  }
  const topic = process.env.OPENCODE_NOTIFY_NTFY_TOPIC
  if (topic) {
    const base = process.env.OPENCODE_NOTIFY_NTFY_URL ?? "https://ntfy.sh"
    try {
      await fetch(`${base}/${encodeURIComponent(topic)}`, {
        method: "POST",
        headers: { Title: title },
        body,
        signal: AbortSignal.timeout(NOTIFY_TIMEOUT_MS),
      })
    } catch {
      // network failure must never break the agent loop
    }
  }
}
