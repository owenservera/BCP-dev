// parser.claude.sse.v1 — MIG-003 V1 (Prompt 4, Phase 9).
//
// VIVIM-derived Claude SSE streaming parser as D-355 parser contribution data:
// recorded SSE text in, ordered ParsedChunk rows out, exactly-one-final.
// Algorithm: FAITHFUL to the seed
// (vivim-final-enhanced/seeds/parsers/claude-streaming-sse.ts) — line-split,
// content_block_start pushes a typed row, deltas mutate the matching tail row,
// message_start/stop mint meta rows. I/O re-expressed (ContentBlock[] →
// ParsedChunk[] with claude.* kinds). Two deliberate corrections (both
// documented in the migration record, never silent):
//   1. the seed's lossy raw-body fallback becomes a named REFUSAL (T-04 law);
//   2. skipped data lines are COUNTED in the done row (observable degradation).
// Purity (D-354): touches ONLY its argument — no ports, no clock, no net.
import type { ParsedChunk } from "@vivim/omega-contracts";

export const CLAUDE_SSE_PARSER_VERSION = "1";
export const CLAUDE_SSE_PARSER_PROVIDER = "claude-sse";
export const CLAUDE_SSE_ARCHETYPE = "chat.complete";

export type ClaudeChunkData =
  | { kind: "claude.text"; text: string }
  | { kind: "claude.reasoning"; text: string }
  | { kind: "claude.tool_use"; toolCallId: string; toolName: string; input: Record<string, unknown> }
  | { kind: "claude.file"; mediaType: string; url: string; filename: string }
  | { kind: "claude.meta"; key: string; value: unknown }
  | { kind: "claude.done"; blocks: number; terminator: "message_stop" | "done-sentinel"; skippedLines: number };

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** V1 transform: recorded Claude SSE text → ordered ParsedChunk rows. */
export function parseClaudeSse(text: string): ParsedChunk[] {
  if (typeof text !== "string" || text.length === 0) {
    throw new Error("claude-sse parser v1: empty-stream — stream text must be a non-empty string");
  }
  const rows: ParsedChunk[] = [];
  let terminated: "message_stop" | "done-sentinel" | null = null;
  let skippedLines = 0;
  let sawData = false;

  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data:")) continue; // comments / event: / blanks — out of domain (seed-faithful)
    sawData = true;
    const payload = trimmed.slice(5).trim();
    if (payload === "[DONE]") { terminated ??= "done-sentinel"; break; }
    let json: Record<string, unknown>;
    try {
      const parsed: unknown = JSON.parse(payload);
      if (!isObj(parsed)) { skippedLines += 1; continue; }
      json = parsed;
    } catch {
      skippedLines += 1; // unparseable data line — counted, never silent (correction 2)
      continue;
    }

    if (json.type === "content_block_start" && isObj(json.content_block)) {
      const cb = json.content_block;
      if (cb.type === "thinking") {
        rows.push({ data: { kind: "claude.reasoning", text: "" } satisfies ClaudeChunkData, final: false });
      } else if (cb.type === "tool_use") {
        rows.push({
          data: {
            kind: "claude.tool_use",
            toolCallId: `tc_${rows.length}`,
            toolName: typeof cb.name === "string" ? cb.name : "",
            input: isObj(cb.input) ? cb.input : {},
          } satisfies ClaudeChunkData,
          final: false,
        });
      } else if (cb.type === "image" || cb.type === "image_url") {
        const src = isObj(cb.source) ? cb.source : {};
        rows.push({
          data: {
            kind: "claude.file",
            mediaType: src.type === "image/jpeg" ? "image/jpeg" : "image/png",
            url: typeof src.url === "string" ? src.url : typeof cb.url === "string" ? cb.url : "",
            filename: typeof cb.alt === "string" ? cb.alt : "",
          } satisfies ClaudeChunkData,
          final: false,
        });
      } else if (cb.type === "text") {
        rows.push({
          data: { kind: "claude.text", text: typeof cb.text === "string" ? cb.text : "" } satisfies ClaudeChunkData,
          final: false,
        });
      }
    } else if (json.type === "content_block_delta" && isObj(json.delta)) {
      const delta = json.delta;
      if (typeof delta.text === "string") {
        const last = rows[rows.length - 1];
        if (last && (last.data as ClaudeChunkData).kind === "claude.text") {
          (last.data as { kind: "claude.text"; text: string }).text += delta.text;
        } else {
          rows.push({ data: { kind: "claude.text", text: delta.text } satisfies ClaudeChunkData, final: false });
        }
      } else if (typeof delta.thinking === "string") {
        const last = rows[rows.length - 1];
        if (last && (last.data as ClaudeChunkData).kind === "claude.reasoning") {
          (last.data as { kind: "claude.reasoning"; text: string }).text += delta.thinking;
        } else {
          rows.push({ data: { kind: "claude.reasoning", text: delta.thinking } satisfies ClaudeChunkData, final: false });
        }
      }
      // other delta types (e.g. input_json_delta) out of domain — shared limitation U-1
    } else if (json.type === "message_start" && isObj(json.message)) {
      rows.push({
        data: { kind: "claude.meta", key: "message_id", value: (json.message as Record<string, unknown>).id } satisfies ClaudeChunkData,
        final: false,
      });
    } else if (json.type === "message_stop" || json.type === "error") {
      terminated ??= "message_stop";
      const last = rows[rows.length - 1];
      if (last && (last.data as ClaudeChunkData).kind !== "claude.meta") {
        rows.push({ data: { kind: "claude.meta", key: "stopped", value: json.type } satisfies ClaudeChunkData, final: false });
      }
    }
  }

  if (!sawData) throw new Error("claude-sse parser v1: no-data-lines — stream carried no data: lines");
  if (rows.length === 0) throw new Error("claude-sse parser v1: zero-rows — stream parsed to zero rows");
  if (!terminated) {
    throw new Error("claude-sse parser v1: unterminated-stream — no message_stop or [DONE] terminator (refusing; fail-closed)");
  }
  const blockCount = rows.length;
  rows.push({
    data: { kind: "claude.done", blocks: blockCount, terminator: terminated, skippedLines } satisfies ClaudeChunkData,
    final: true,
  });
  return rows;
}

export interface ParserDef {
  providerId: string;
  archetypeSlug: string;
  version: string;
  transform: (streamText: string) => ParsedChunk[];
}

export const PARSER_DEF: ParserDef = {
  providerId: CLAUDE_SSE_PARSER_PROVIDER,
  archetypeSlug: CLAUDE_SSE_ARCHETYPE,
  version: CLAUDE_SSE_PARSER_VERSION,
  transform: parseClaudeSse,
};

export function resolveParser(version: string): ParserDef {
  if (version !== CLAUDE_SSE_PARSER_VERSION) {
    throw new Error(`claude-sse parser v1: no parser pinned at version ${JSON.stringify(version)} — refusing (fail-closed genealogy)`);
  }
  return PARSER_DEF;
}
