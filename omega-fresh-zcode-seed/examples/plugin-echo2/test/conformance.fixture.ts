// omega.echo2 - TEST contribution for the conformance runner.
// Same consumer promise as omega.echo (echo:true + payload round-trip) plus
// the V2 interior proof (monotonic seq, hash-chained head, no clock field).
import type { PluginDef } from "@vivim/omega-shim";
import type { FakeHost } from "@vivim/omega-testkit";

export async function run(def: PluginDef, fake: FakeHost): Promise<{ pass: boolean; seq?: number }> {
  if (!def.ops?.["echo.ping@1"]) return { pass: false };
  const a = await fake.call("echo.ping@1", { hello: "substitution" });
  if (!a.ok) return { pass: false };
  const va = a.value as { echo: boolean; payload: unknown; seq: number; chain: string; at?: unknown };
  if (va.echo !== true) return { pass: false };
  if (JSON.stringify(va.payload) !== JSON.stringify({ hello: "substitution" })) return { pass: false };
  if (typeof va.seq !== "number" || typeof va.chain !== "string") return { pass: false };
  if ("at" in va) return { pass: false }; // V2 interior must not carry V1's clock stamp
  const b = await fake.call("echo.ping@1", { hello: "substitution" });
  if (!b.ok) return { pass: false };
  const vb = b.value as { seq: number; chain: string };
  if (vb.seq !== va.seq + 1) return { pass: false }; // monotonic
  if (vb.chain === va.chain) return { pass: false }; // chain advances
  return { pass: true, seq: vb.seq };
}
