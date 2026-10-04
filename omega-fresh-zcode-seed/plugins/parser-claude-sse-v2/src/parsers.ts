// parser.claude.sse.v2 — MIG-003 V2 (Prompt 4, Phase 10).
//
// INDEPENDENT re-implementation of the claude-sse v1 pin surface: same row
// grammar, same refusal law, NO shared code with V1 (shapes re-declared here;
// B2 forbids cross-plugin relative imports — and sharing code would defeat
// the experiment). Different machine: V1 is an online single loop mutating a
// tail row; V2 DECODES the text into a pure, immutable event list first, then
// FOLDS events through explicit states (OPEN/APPEND/CLOSE) over a slot map.
// The differential suite (test/differential.test.ts) proves byte-identity.
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

// ---- phase 1: decode (pure line → event list) --------------------------------
type BlockOpen =
  | { open: "text"; seed: string }
  | { open: "reasoning"; seed: string }
  | { open: "tool_use"; toolName: string; input: Record<string, unknown> }
  | { open: "file"; mediaType: string; url: string; filename: string };

type SseEvent =
  | { ev: "open"; block: BlockOpen }
  | { ev: "delta-text"; text: string }
  | { ev: "delta-thinking"; text: string }
  | { ev: "msg-start"; id: unknown }
  | { ev: "msg-stop"; kind: string }
  | { ev: "done-sentinel" }
  | { ev: "bad-line" };

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

function decode(text: string): { events: SseEvent[]; sawData: boolean } {
  const events: SseEvent[] = [];
  let sawData = false;
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data:")) continue;
    sawData = true;
    const payload = trimmed.slice(5).trim();
    if (payload === "[DONE]") { events.push({ ev: "done-sentinel" }); break; }
    let json: Record<string, unknown>;
    try {
      const parsed: unknown = JSON.parse(payload);
      if (!isObj(parsed)) { events.push({ ev: "bad-line" }); continue; }
      json = parsed;
    } catch {
      events.push({ ev: "bad-line" });
      continue;
    }
    if (json.type === "content_block_start" && isObj(json.content_block)) {
      const cb = json.content_block;
      if (cb.type === "thinking") events.push({ ev: "open", block: { open: "reasoning", seed: "" } });
      else if (cb.type === "tool_use") {
        events.push({
          ev: "open",
          block: {
            open: "tool_use",
            toolName: typeof cb.name === "string" ? cb.name : "",
            input: isObj(cb.input) ? cb.input : {},
          },
        });
      } else if (cb.type === "image" || cb.type === "image_url") {
        const src = isObj(cb.source) ? cb.source : {};
        events.push({
          ev: "open",
          block: {
            open: "file",
            mediaType: src.type === "image/jpeg" ? "image/jpeg" : "image/png",
            url: typeof src.url === "string" ? src.url : typeof cb.url === "string" ? cb.url : "",
            filename: typeof cb.alt === "string" ? cb.alt : "",
          },
        });
      } else if (cb.type === "text") {
        events.push({ ev: "open", block: { open: "text", seed: typeof cb.text === "string" ? cb.text : "" } });
      }
      // unknown block types: no event (V1-faithful)
    } else if (json.type === "content_block_delta" && isObj(json.delta)) {
      const delta = json.delta;
      if (typeof delta.text === "string") events.push({ ev: "delta-text", text: delta.text });
      else if (typeof delta.thinking === "string") events.push({ ev: "delta-thinking", text: delta.thinking });
      // other delta types: no event (U-1, shared limitation)
    } else if (json.type === "message_start" && isObj(json.message)) {
      events.push({ ev: "msg-start", id: (json.message as Record<string, unknown>).id });
    } else if (json.type === "message_stop" || json.type === "error") {
      events.push({ ev: "msg-stop", kind: json.type as string });
    }
  }
  return { events, sawData };
}

// ---- phase 2: fold (events → rows; explicit OPEN/APPEND/CLOSE states) --------
interface Slot { kind: "text" | "reasoning"; text: string }

export function parseClaudeSse(text: string): ParsedChunk[] {
  if (typeof text !== "string" || text.length === 0) {
    throw new Error("claude-sse parser v2: empty-stream — stream text must be a non-empty string");
  }
  const { events, sawData } = decode(text);
  if (!sawData) throw new Error("claude-sse parser v2: no-data-lines — stream carried no data: lines");

  // Ordered frames: block frames reference slots by id; meta frames carry rows.
  // Mirrors V1's push order exactly (message_start meta → blocks → stopped meta).
  const frames: Array<{ f: "block"; slot: number } | { f: "meta"; key: string; value: unknown }> = [];
  const slots = new Map<number, Slot | { kind: "tool_use" | "file"; row: ParsedChunk }>();
  let nextSlot = 0;
  let terminated: "message_stop" | "done-sentinel" | null = null;
  let skippedLines = 0;
  let rowCounter = 0; // rows emitted so far (blocks + metas), drives tc_ ids like V1

  const lastFrameIsBlockOf = (kind: "text" | "reasoning"): number | null => {
    for (let i = frames.length - 1; i >= 0; i--) {
      const fr = frames[i]!;
      if (fr.f === "meta") return null; // a meta breaks the tail run (V1 positional rule)
      const s = slots.get(fr.slot)!;
      if (typeof s !== "object" || !("text" in s)) return null;
      return (s as Slot).kind === kind ? fr.slot : null;
    }
    return null;
  };

  for (const e of events) {
    switch (e.ev) {
      case "bad-line": skippedLines += 1; break;
      case "done-sentinel": terminated ??= "done-sentinel"; break;
      case "msg-start":
        frames.push({ f: "meta", key: "message_id", value: e.id });
        rowCounter += 1;
        break;
      case "msg-stop": {
        terminated ??= "message_stop";
        const tail = frames[frames.length - 1];
        if (tail && tail.f !== "meta") {
          frames.push({ f: "meta", key: "stopped", value: e.kind });
          rowCounter += 1;
        }
        break;
      }
      case "open": {
        const id = nextSlot++;
        if (e.block.open === "text" || e.block.open === "reasoning") {
          slots.set(id, { kind: e.block.open, text: e.block.seed });
        } else if (e.block.open === "tool_use") {
          const row: ParsedChunk = {
            data: {
              kind: "claude.tool_use",
              toolCallId: `tc_${rowCounter}`,
              toolName: e.block.toolName,
              input: e.block.input,
            } satisfies ClaudeChunkData,
            final: false,
          };
          slots.set(id, { kind: "tool_use", row });
        } else {
          const row: ParsedChunk = {
            data: {
              kind: "claude.file",
              mediaType: e.block.mediaType,
              url: e.block.url,
              filename: e.block.filename,
            } satisfies ClaudeChunkData,
            final: false,
          };
          slots.set(id, { kind: "file", row });
        }
        frames.push({ f: "block", slot: id });
        rowCounter += 1;
        break;
      }
      case "delta-text":
      case "delta-thinking": {
        const want = e.ev === "delta-text" ? "text" : "reasoning";
        const hit = lastFrameIsBlockOf(want);
        if (hit !== null) {
          (slots.get(hit) as Slot).text += e.text; // APPEND state
        } else {
          const id = nextSlot++; // OPEN state (fresh slot — V1 pushes a new row here)
          slots.set(id, { kind: want, text: e.text });
          frames.push({ f: "block", slot: id });
          rowCounter += 1;
        }
        break;
      }
    }
    if (terminated === "done-sentinel") break; // [DONE] ends the fold like V1's break
  }

  // Emit: walk frames in order (block frames render their slots).
  const rows: ParsedChunk[] = [];
  for (const fr of frames) {
    if (fr.f === "meta") {
      rows.push({ data: { kind: "claude.meta", key: fr.key, value: fr.value } satisfies ClaudeChunkData, final: false });
    } else {
      const s = slots.get(fr.slot)!;
      if ("row" in s) rows.push(s.row);
      else if (s.kind === "text") rows.push({ data: { kind: "claude.text", text: s.text } satisfies ClaudeChunkData, final: false });
      else rows.push({ data: { kind: "claude.reasoning", text: s.text } satisfies ClaudeChunkData, final: false });
    }
  }
  if (rows.length === 0) throw new Error("claude-sse parser v2: zero-rows — stream parsed to zero rows");
  if (!terminated) {
    throw new Error("claude-sse parser v2: unterminated-stream — no message_stop or [DONE] terminator (refusing; fail-closed)");
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
    throw new Error(`claude-sse parser v2: no parser pinned at version ${JSON.stringify(version)} — refusing (fail-closed genealogy)`);
  }
  return PARSER_DEF;
}
