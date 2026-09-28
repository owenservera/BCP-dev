/**
 * Notification plugin: desktop (notify-send) and optional ntfy.sh push when a
 * session finishes, errors, or asks for permission.
 *
 * Install: add to opencode.json `"plugin": ["@ibraheem-111/opencode-swarm/plugin/notify"]`
 * or copy into `.opencode/plugins/` / `~/.config/opencode/plugins/`.
 *
 * Env:
 *   OPENCODE_NOTIFY_NTFY_TOPIC  — ntfy.sh topic for phone/push notifications (optional)
 *   OPENCODE_NOTIFY_DESKTOP=0   — disable desktop notifications
 *
 * NOTE: opencode treats every export of a plugin module as a plugin, so this
 * file must export nothing but the plugin itself.
 */
import type { Plugin } from "@opencode-ai/plugin"
import { sendNotification } from "../src/notify.ts"

export const NotifyPlugin: Plugin = async ({ directory }) => {
  const project = directory.split("/").pop() ?? directory
  return {
    event: async ({ event }) => {
      switch (event.type) {
        case "session.idle":
          await sendNotification(`opencode · ${project}`, "Session finished")
          break
        case "session.error":
          await sendNotification(`opencode · ${project}`, "Session hit an error")
          break
        case "permission.updated":
          await sendNotification(`opencode · ${project}`, "Waiting for permission approval")
          break
      }
    },
  }
}
