// parser.claude.sse.v1 — TEST contribution for the conformance runner.
import type { PluginDef } from "@vivim/omega-shim";
import type { FakeHost } from "@vivim/omega-testkit";
import { parseClaudeSse } from "../src/parsers.ts";
import { buildChunkEnvelope } from "@vivim/omega-contracts";

const CANONICAL = [
  'data: {"type":"message_start","message":{"id":"msg_c"}}',
  'data: {"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}',
  'data: {"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":"ok"}}',
  'data: {"type":"content_block_stop","index":0}',
  'data: {"type":"message_stop"}',
].join("\n");

export async function run(_def: PluginDef, _fake: FakeHost): Promise<{ pass: boolean }> {
  const rows = parseClaudeSse(CANONICAL);
  if (rows.length !== 4) return { pass: false };
  if (!rows.every((r, i) => !r.final || i === rows.length - 1)) return { pass: false };
  const chunks = buildChunkEnvelope("conformance", rows); // envelope law is the falsifier
  if (chunks.length !== 4 || !chunks[3]!.final) return { pass: false };
  return { pass: true };
}
