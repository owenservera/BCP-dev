// omega.echo2 — substitution-experiment V2 for echo.ping@1 (Prompt 4, Phase 3).
//
// Same stable contract as omega.echo (echo.ping@1, READ): {echo:true, payload
// round-trip}. Materially different interior: an append-only hash-chained log
// with monotonic seq and NO clock (V1 is stateless and stamps Date.now()).
// node:crypto is one of the four allowed prod-tree runtimes (README: worker
// threads, sqlite adapter, node:crypto, node:net). No ports, no vault, no
// capabilities — self-contained like V1.
import { createHash } from "node:crypto";
import { definePlugin, startPlugin } from "@vivim/omega-shim";

/** Canonical JSON: object keys sorted recursively. Byte-stable across runs. */
function canonicalize(v: unknown): string {
  if (v === null || typeof v !== "object") return JSON.stringify(v) ?? "null";
  if (Array.isArray(v)) return `[${v.map(canonicalize).join(",")}]`;
  const keys = Object.keys(v as Record<string, unknown>).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${canonicalize((v as Record<string, unknown>)[k])}`).join(",")}}`;
}

interface LogEntry { seq: number; hash: string; chain: string }

const GENESIS = "sha256:" + "0".repeat(64);
let seq = 0;
let head: string = GENESIS;
const log: LogEntry[] = [];

export function resetChain(): void { seq = 0; head = GENESIS; log.length = 0; }
export function chainHead(): string { return head; }
export function chainLength(): number { return log.length; }

export const def = definePlugin({
  ops: {
    "echo.ping@1": async (payload) => {
      const p = (payload ?? {}) as Record<string, unknown>;
      const hash = "sha256:" + createHash("sha256").update(canonicalize(p)).digest("hex");
      seq += 1;
      head = "sha256:" + createHash("sha256").update(head + hash).digest("hex");
      log.push({ seq, hash, chain: head });
      return { echo: true, payload: p, seq, chain: head };
    },
  },
});

startPlugin(def);
