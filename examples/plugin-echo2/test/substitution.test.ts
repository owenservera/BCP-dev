// Substitution proof: echo.ping@1 routed to V1 (omega.echo) vs V2 (omega.echo2).
//
// Test-only composition specs (in-memory, NEVER committed under
// compositions/ — the 18-spec freeze is untouched). Same consumer payload,
// same µhost, same contract. Proves: composition selects implementation;
// consumer/host/contract unchanged; both conform.
//
// Failure modes (Phase 13) are asserted in the second suite: OP_CONFLICT on
// dual grant, GRANT_NOT_DECLARED on phantom grant, unknown op REFUSED.
import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { mkdirSync, rmSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { compileComposition, ensureVault, bootComposition } from "../../../host/src/index.ts";
import type { BootedHost } from "../../../host/src/index.ts";
import { validateComposition } from "@vivim/omega-sdk";
import { runConformance } from "@vivim/omega-testkit";
import { omegaTmp } from "@vivim/omega-platform";

const BASE = join(import.meta.dir, "../../../compositions");

function specFor(id: string, source: string) {
  return {
    name: "subst-test",
    entries: [
      { id: "vivim.law", source: "../plugins/law-stub", bootPhase: 0,
        grant: { capabilities: ["host.journal.append"],
          contracts: ["law.check@1", "law.registry@1", "law.consent.grant@1", "law.describe@1"] } },
      { id, source, bootPhase: 1,
        grant: { capabilities: [], contracts: ["echo.ping@1"] } },
    ],
  };
}

async function bootWith(id: string, source: string) {
  const vault = omegaTmp("omega-subst-test", `run-${Date.now()}-${Math.floor(Math.random() * 1e6)}`);
  rmSync(vault, { recursive: true, force: true });
  mkdirSync(vault, { recursive: true });
  const { rootKey } = ensureVault(vault);
  const { recipe, buildDir } = compileComposition(specFor(id, source), BASE, vault, rootKey);
  const host = await bootComposition(recipe, buildDir, vault);
  return { vault, host };
}

const PAYLOAD = { hello: "same-consumer" };
let hostA: BootedHost;
let hostB: BootedHost;

beforeAll(async () => {
  ({ host: hostA } = await bootWith("omega.echo", "../examples/plugin-echo"));
  ({ host: hostB } = await bootWith("omega.echo2", "../examples/plugin-echo2"));
});
afterAll(async () => { await hostA.shutdown(); await hostB.shutdown(); });

describe("substitution: same contract, same consumer, different implementation", () => {
  test("composition A → V1: stable promise holds, interior is V1 (clock, stateless)", async () => {
    const r = await hostA.router.callAsRoot("echo.ping@1", PAYLOAD);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const v = r.value as Record<string, unknown>;
    expect(v["echo"]).toBe(true);
    expect(v["payload"]).toEqual(PAYLOAD);
    expect(typeof v["at"]).toBe("number"); // V1 interior: wall clock
    expect("seq" in v).toBe(false);
  });

  test("composition B → V2: stable promise holds, interior is V2 (chain, no clock)", async () => {
    const r = await hostB.router.callAsRoot("echo.ping@1", PAYLOAD);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const v = r.value as Record<string, unknown>;
    expect(v["echo"]).toBe(true);
    expect(v["payload"]).toEqual(PAYLOAD);
    expect(typeof v["seq"]).toBe("number"); // V2 interior: monotonic seq
    expect(typeof v["chain"]).toBe("string");
    expect("at" in v).toBe(false);
  });

  test("V2 chain advances across calls (stateful log vs stateless V1)", async () => {
    const a = await hostB.router.callAsRoot("echo.ping@1", PAYLOAD);
    const b = await hostB.router.callAsRoot("echo.ping@1", PAYLOAD);
    if (!a.ok || !b.ok) throw new Error("calls failed");
    const va = a.value as { seq: number; chain: string };
    const vb = b.value as { seq: number; chain: string };
    expect(vb.seq).toBe(va.seq + 1);
    expect(vb.chain).not.toBe(va.chain);
  });

  test("router status: exactly echo.ping@1 routed; compartments active", async () => {
    const pairs: Array<[BootedHost, string]> = [[hostA, "omega.echo"], [hostB, "omega.echo2"]];
    for (const [h, id] of pairs) {
      const st = h.router.status();
      expect(st.routedOps).toContain("echo.ping@1");
      expect(st.routedOps).not.toContain("echo.pong@1");
      expect((st.compartments as Record<string, { state: string }>)[id].state).toBe("active");
    }
  });

  test("conformance green on V2 (staged→verified→active, FakeHost + fixture)", async () => {
    const rep = await runConformance(join(import.meta.dir, ".."));
    expect(rep.issues).toEqual([]);
    expect(rep.staged).toBe(true);
    expect(rep.verified).toBe(true);
    expect(rep.active).toBe(true);
    expect(rep.ops).toContain("echo.ping@1");
  });
});

describe("failure modes fail closed (Phase 13)", () => {
  test("dual grant of echo.ping@1 → OP_CONFLICT at validation", () => {
    const spec = specFor("omega.echo", "../examples/plugin-echo");
    spec.entries.push({ id: "omega.echo.second", source: "../examples/plugin-echo2", bootPhase: 1,
      grant: { capabilities: [], contracts: ["echo.ping@1"] } });
    const issues = validateComposition(spec as never);
    expect(issues.some((i) => i.code === "OP_CONFLICT")).toBe(true);
  });

  test("grant of undeclared op → GRANT_NOT_DECLARED", () => {
    const spec = specFor("omega.echo2", "../examples/plugin-echo2");
    spec.entries[1]!.grant.contracts.push("echo.pong@1");
    const manifests = {
      "vivim.law": JSON.parse(readFileSync(join(BASE, "../plugins/law-stub/plugin.json"), "utf-8")),
      "omega.echo2": JSON.parse(readFileSync(join(import.meta.dir, "../plugin.json"), "utf-8")),
    };
    const issues = validateComposition(spec as never, { manifests: manifests as never });
    expect(issues.some((i) => i.code === "GRANT_NOT_DECLARED")).toBe(true);
  });

  test("unknown op on the live router → REFUSED (not routed, not executed)", async () => {
    const r = await hostB.router.callAsRoot("echo.pong@1", {});
    expect(r.ok).toBe(false);
  });
});
