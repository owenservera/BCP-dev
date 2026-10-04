// forge.mine — test/refusal/mine-refusals.test.ts (D-409, D-406 D5)
// The named-refusal net for the three READ siblings. Every case runs on a REAL
// boot of compositions/forge-mine.json (law + vault + the capture seam + this
// plugin, routed normally) and every refusal must be a NAMED rule in an ok:true
// envelope (the house's D-379 refusal-as-data), never a generic error. The
// forge-surface gate's FORGE_NO_REFUSAL_TEST requires this file to NAME all
// three ops; the house discipline requires it to name every RULE — and the first
// test below asserts each rule is actually TRIGGERED by a case in this file,
// not merely mentioned. "Appears somewhere in the file" is satisfied by a
// comment and proves nothing (the corridor-1 lesson).
//
// The eight named failures:
//   MINE_VERIFY_MALFORMED_INPUT   verify payload is not {mineId}
//   MINE_DIFF_MALFORMED_INPUT     diff payload is not {mineA, mineB}
//   MINE_LIST_MALFORMED_INPUT     list payload is not {} — the frozen wire pins an empty object
//   MINE_ID_MALFORMED             a mine id is not `<repo>@<7-64 hex>`
//   MINE_RECEIPT_MISSING          no capture receipt is stored for that pin
//   MINE_RECEIPT_MALFORMED        the stored row is not an object at all
//   MINE_ROW_ID_MALFORMED         a receipt-prefixed row whose id names no pin
//   MINE_LEDGER_REFUSED           the receipt could not be read: port refused or the vault failed
//
// Every refusal is checked for a second property: nothing was written. The READ
// half's whole claim to its risk class is that it does not mutate — a refusal
// that appended a row or touched the tree would be a worse bug than the one it
// prevents.
import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { MINE_REFUSAL_RULES } from "../../src/index.ts";
import { MINE_ID_PATTERN, RECEIPT_ID_PREFIX } from "../../src/mine.ts";
import {
  MINE_ROOT, bootMine, bootMineWithout, call, callOn, capturePinned, current,
  pinnedMineId, refusalOf, setCurrent,
} from "../boot.ts";

const OP_VERIFY = "forge.mine.verify@1";
const OP_DIFF = "forge.mine.diff@1";
const OP_LIST = "forge.mine.list@1";
const OP_CAPTURE = "forge.mine.capture@1";
const PLUGIN_ID = "forge.mine";

/** The receipt rows currently in ns proposal, as `id@revN` — the ledger's
 *  before/after witness for "these ops wrote nothing". */
async function receiptRows(): Promise<string[]> {
  const q = await current().host.router.callAsRoot("vault.query@1", { ns: "proposal", filter: { idPrefix: RECEIPT_ID_PREFIX } });
  return q.ok ? (q.value as Array<{ id: string; rev: number }>).map((r) => `${r.id}@rev${r.rev}`).sort() : [];
}

beforeAll(async () => {
  const b = await bootMine();
  setCurrent(b);
  // One real receipt, so the "receipt is missing" cases are genuinely about
  // absence rather than about a boot that never produced anything.
  await capturePinned(b.host);
}, 180_000);

afterAll(async () => { await current().host.shutdown().catch(() => {}); }, 30_000);

describe("every refusal names a rule this file actually TRIGGERS", () => {
  test("the rule set and the cases below are the same set (no unproven failure mode)", () => {
    expect([...MINE_REFUSAL_RULES].sort()).toEqual([
      "MINE_DIFF_MALFORMED_INPUT",
      "MINE_ID_MALFORMED",
      "MINE_LEDGER_REFUSED",
      "MINE_LIST_MALFORMED_INPUT",
      "MINE_RECEIPT_MALFORMED",
      "MINE_RECEIPT_MISSING",
      "MINE_ROW_ID_MALFORMED",
      "MINE_VERIFY_MALFORMED_INPUT",
    ].sort());
    const me = readFileSync(import.meta.path, "utf-8");
    // "the rule appears somewhere in the file" is not "the rule is exercised":
    // the header comment alone would satisfy a toContain check. Require each
    // rule to be asserted inside an expect() at least once, so a rule that
    // stops being triggered goes red instead of silently rotting.
    for (const rule of MINE_REFUSAL_RULES) {
      const assertions = me.split("\n").filter((l) => l.includes("expect(") && l.includes(`"${rule}"`));
      expect({ rule, assertions: assertions.length }).toEqual({ rule, assertions: expect.any(Number) });
      expect(assertions.length).toBeGreaterThan(0);
    }
  });

  test("all three declared ops are named here — FORGE_NO_REFUSAL_TEST reads this file", () => {
    const me = readFileSync(import.meta.path, "utf-8");
    for (const op of [OP_VERIFY, OP_DIFF, OP_LIST]) expect(me).toContain(op);
  });
});

describe("the D-409 class split is real: READ is ungated, the capture seam is not", () => {
  test("on a FRESH boot the capture op is gated by consent while the READ ops run unasked", async () => {
    // Same composition, same boot, no consent granted yet. This is the split
    // proven mechanically rather than in prose: EXTERNAL_MUTATION asks (and is
    // REFUSED at the gate before its handler runs), READ just runs.
    const { host } = await bootMine();
    try {
      const gated = await callOn(host, OP_CAPTURE, { mineRoot: MINE_ROOT, mineId: pinnedMineId() });
      expect(gated.ok).toBe(false);
      expect(gated.error).toBe("REFUSED");
      expect(gated.detail).toContain("consent required");
      // the READ sibling on the SAME boot, same missing consent: no gate
      const read = await callOn(host, OP_VERIFY, { mineId: pinnedMineId() });
      expect(read.ok).toBe(true); // ok:true — the host never gated it
      const v = read.ok ? (read.value as { refused: boolean; rule: string }) : null;
      expect(v!.refused).toBe(true);
      expect(v!.rule).toBe("MINE_RECEIPT_MISSING"); // refused for the RIGHT reason: nothing captured yet
      const listBefore = await callOn(host, OP_LIST, {});
      expect(listBefore.ok).toBe(true);
      expect((listBefore.ok ? listBefore.value as { count: number } : null)!.count).toBe(0);
      // and with consent, the same READ call verifies a real receipt
      await capturePinned(host);
      const after = await callOn(host, OP_VERIFY, { mineId: pinnedMineId() });
      expect(after.ok).toBe(true);
      expect((after.ok ? after.value as { result: string } : null)!.result).toBe("pass");
    } finally {
      await host.shutdown().catch(() => {});
    }
  }, 180_000);

  test("the READ ops write nothing: a refusal round leaves the ledger byte-identical", async () => {
    const before = await receiptRows();
    expect(before.length).toBe(1); // the fixture receipt; the comparison must be about something
    await refusalOf(OP_VERIFY, {});
    await refusalOf(OP_DIFF, { mineA: "pantrylog@abcdef0", mineB: "pantrylog@abcdef1" });
    await refusalOf(OP_LIST, { slug: "x" });
    await refusalOf(OP_VERIFY, { mineId: "pantrylog" });
    expect(await receiptRows()).toEqual(before);
  }, 60_000);
});

describe("MINE_VERIFY_MALFORMED_INPUT — the payload is not {mineId}", () => {
  const cases: Array<{ name: string; payload: unknown; detail?: string }> = [
    { name: "null", payload: null },
    { name: "array", payload: [] },
    { name: "string", payload: "pantrylog@abcdef0" },
    { name: "number", payload: 42 },
    { name: "empty object", payload: {} },
    { name: "non-string mineId", payload: { mineId: 7 }, detail: "mineId" },
    { name: "null mineId", payload: { mineId: null }, detail: "mineId" },
    { name: "empty mineId", payload: { mineId: "" } },
    { name: "unknown field", payload: { mineId: pinnedMineId(), deep: true }, detail: "deep" },
  ];
  for (const c of cases) {
    test(`a ${c.name} payload refuses by name`, async () => {
      const r = await refusalOf(OP_VERIFY, c.payload);
      expect(r.rule).toBe("MINE_VERIFY_MALFORMED_INPUT");
      expect(r.error).toBe("REFUSED");
      expect(r.op).toBe(OP_VERIFY);
      if (c.detail) expect(r.detail).toContain(c.detail);
    });
  }
});

describe("MINE_DIFF_MALFORMED_INPUT — the payload is not {mineA, mineB}", () => {
  const ok = pinnedMineId();
  const cases: Array<{ name: string; payload: unknown; detail?: string }> = [
    { name: "null", payload: null },
    { name: "array", payload: [] },
    { name: "string", payload: `${ok}|${ok}` },
    { name: "empty object", payload: {} },
    { name: "missing mineB", payload: { mineA: ok }, detail: "mineB" },
    { name: "missing mineA", payload: { mineB: ok }, detail: "mineA" },
    { name: "non-string mineB", payload: { mineA: ok, mineB: 9 }, detail: "mineB" },
    { name: "unknown field", payload: { mineA: ok, mineB: ok, mode: "strict" }, detail: "mode" },
  ];
  for (const c of cases) {
    test(`a ${c.name} payload refuses by name`, async () => {
      const r = await refusalOf(OP_DIFF, c.payload);
      expect(r.rule).toBe("MINE_DIFF_MALFORMED_INPUT");
      expect(r.error).toBe("REFUSED");
      expect(r.op).toBe(OP_DIFF);
      if (c.detail) expect(r.detail).toContain(c.detail);
    });
  }
});

describe("MINE_LIST_MALFORMED_INPUT — the frozen wire pins an EMPTY payload", () => {
  const cases: Array<{ name: string; payload: unknown; detail?: string }> = [
    { name: "array", payload: [], detail: "array" },
    { name: "string", payload: "all", detail: "string" },
    { name: "number", payload: 3, detail: "number" },
    { name: "a single filter field", payload: { slug: "pantrylog" }, detail: "slug" },
    { name: "an id field", payload: { mineId: pinnedMineId() }, detail: "mineId" },
  ];
  for (const c of cases) {
    test(`${c.name} refuses by name`, async () => {
      const r = await refusalOf(OP_LIST, c.payload);
      expect(r.rule).toBe("MINE_LIST_MALFORMED_INPUT");
      expect(r.error).toBe("REFUSED");
      expect(r.op).toBe(OP_LIST);
      if (c.detail) expect(r.detail).toContain(c.detail);
    });
  }

  test("{} and an ABSENT payload are the same thing and both work — the grammar is empty, not optional", async () => {
    const empty = await call(OP_LIST, {});
    const absent = await call(OP_LIST, undefined);
    expect(empty.ok).toBe(true);
    expect(absent.ok).toBe(true);
    const a = empty.ok ? empty.value as { schemaVersion: string; count: number } : null;
    const b = absent.ok ? absent.value as { schemaVersion: string; count: number } : null;
    expect(a!.schemaVersion).toBe("1");
    expect(b!.schemaVersion).toBe("1");
    expect(b!.count).toBe(a!.count);
    expect(a!.count).toBe(1);
  });
});

describe("MINE_ID_MALFORMED — an unpinned tree has no identity to verify (D-409 SF3)", () => {
  const bad = [
    "pantrylog",              // no @pin at all
    "pantrylog@",             // empty pin
    "pantrylog@synthetic-v0", // the fixture's own LABEL — not hex, so not a pin
    "pantrylog@ABCDEF0",      // uppercase hex is not the pin alphabet
    "pantrylog@abc",          // too short (needs 7+)
    "Pantrylog@abcdef0",      // uppercase repo slug
    "@abcdef0",               // no repo
  ];
  for (const id of bad) {
    test(`verify refuses mineId ${JSON.stringify(id)} by name`, async () => {
      const r = await refusalOf(OP_VERIFY, { mineId: id });
      expect(r.rule).toBe("MINE_ID_MALFORMED");
      expect(r.detail).toContain("unpinned");
      expect(MINE_ID_PATTERN.test(id)).toBe(false);
    });
  }

  test("diff refuses on EITHER side, naming which one", async () => {
    const ok = pinnedMineId();
    const left = await refusalOf(OP_DIFF, { mineA: "nope", mineB: ok });
    expect(left.rule).toBe("MINE_ID_MALFORMED");
    expect(left.detail).toContain("mineA");
    const right = await refusalOf(OP_DIFF, { mineA: ok, mineB: "nope" });
    expect(right.rule).toBe("MINE_ID_MALFORMED");
    expect(right.detail).toContain("mineB");
  });
});

describe("MINE_RECEIPT_MISSING — a READ op never manufactures the evidence it is asked to check", () => {
  test("a well-formed pin with no stored receipt refuses by name", async () => {
    const r = await refusalOf(OP_VERIFY, { mineId: "ghost@abcdef0" });
    expect(r.rule).toBe("MINE_RECEIPT_MISSING");
    expect(r.detail).toContain("forge.mine.capture@1");
    expect(r.detail).toContain("ghost@abcdef0");
  });

  test("a 64-hex pin that looks real but was never captured refuses too (the shape is not the proof)", async () => {
    const r = await refusalOf(OP_VERIFY, { mineId: "never@0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef" });
    expect(r.rule).toBe("MINE_RECEIPT_MISSING");
  });

  test("diff refuses when EITHER side has no receipt, and says which side", async () => {
    const ok = pinnedMineId();
    const left = await refusalOf(OP_DIFF, { mineA: "ghost@abcdef0", mineB: ok });
    expect(left.rule).toBe("MINE_RECEIPT_MISSING");
    expect(left.detail).toContain("mineA");
    const right = await refusalOf(OP_DIFF, { mineA: ok, mineB: "ghost@abcdef0" });
    expect(right.rule).toBe("MINE_RECEIPT_MISSING");
    expect(right.detail).toContain("mineB");
  });

  test("...and the absence is real, not a lookup bug: the pinned fixture's receipt IS there", async () => {
    const r = await call(OP_VERIFY, { mineId: pinnedMineId() });
    expect(r.ok).toBe(true);
    const v = r.ok ? (r.value as { refused?: boolean; result?: string }) : null;
    expect(v!.refused).toBeUndefined();
    expect(v!.result).toBe("pass");
  });
});

describe("MINE_RECEIPT_MALFORMED — a stored row that is not an object is not verifiable", () => {
  const BAD_ID = "mine:notanobject/abcdef0";
  const BAD_MINE_ID = "notanobject@abcdef0";

  test("a receipt row holding a bare string refuses by name on both readers", async () => {
    const append = await current().host.router.callAsRoot("vault.append@1", {
      ns: "proposal", id: BAD_ID, data: "not a receipt", meta: { type: "capture-receipt" }, refs: [],
    });
    expect(append.ok).toBe(true);
    const verify = await refusalOf(OP_VERIFY, { mineId: BAD_MINE_ID });
    expect(verify.rule).toBe("MINE_RECEIPT_MALFORMED");
    expect(verify.detail).toContain(BAD_ID);
    expect(verify.detail).toContain("string");
    const diff = await refusalOf(OP_DIFF, { mineA: pinnedMineId(), mineB: BAD_MINE_ID });
    expect(diff.rule).toBe("MINE_RECEIPT_MALFORMED");
    expect(diff.detail).toContain("mineB");
  });

  test("...while an OBJECT row that disagrees is a FAILING REPORT, not a refusal — the line is real", async () => {
    // Same row id, now holding an object: the op can produce a report about it,
    // so it must — and the verdict is `fail` with the failing checks named.
    const id = "mine:halftrue/abcdef1";
    const append = await current().host.router.callAsRoot("vault.append@1", {
      ns: "proposal", id, data: {
        schemaVersion: "1", op: "forge.mine.capture@1", mineId: "halftrue@abcdef1",
        mineRoot: join(MINE_ROOT, "..", "..", "..", "nowhere"), capturedAt: "2026-10-03T00:00:00.000Z",
        fileCount: 1, rootHash: `sha256:${"0".repeat(64)}`,
        files: [{ path: "a.txt", hash: `sha256:${"1".repeat(64)}`, bytes: 3, casRef: `cas:sha256:${"1".repeat(64)}` }],
        refusals: [],
      },
      meta: { type: "capture-receipt" }, refs: [],
    });
    expect(append.ok).toBe(true);
    const r = await call(OP_VERIFY, { mineId: "halftrue@abcdef1" });
    expect(r.ok).toBe(true);
    const v = r.ok ? (r.value as { refused?: boolean; result: string; checks: Array<{ name: string; result: string; diff: string | null }> }) : null;
    expect(v!.refused).toBeUndefined();
    expect(v!.result).toBe("fail");
    const failed = v!.checks.filter((c) => c.result === "fail").map((c) => c.name);
    // the un-pinned-hash case D-409 names for this plugin, plus the fold
    expect(failed).toContain("root-hash-recomputes");
    expect(failed).toContain("mine-pin-matches-root-hash");
    // every failing check says why
    for (const c of v!.checks) if (c.result === "fail") expect(typeof c.diff).toBe("string");
    console.log(`[refusal] an object row that disagrees produced a ${v!.result} report, failing ${failed.join(", ")}`);
  });
});

describe("MINE_ROW_ID_MALFORMED — corruption is not a row to skip quietly", () => {
  test("a receipt-prefixed row whose id names no pin refuses list by name", async () => {
    // Its own boot: the poisoned row would otherwise contaminate every later
    // list call in this file — which is precisely the point being proved.
    const { host } = await bootMine();
    try {
      const append = await host.router.callAsRoot("vault.append@1", {
        ns: "proposal", id: "mine:corrupted-row", data: { schemaVersion: "1" }, meta: { type: "capture-receipt" }, refs: [],
      });
      expect(append.ok).toBe(true);
      const r = await callOn(host, OP_LIST, {});
      expect(r.ok).toBe(true);
      const v = r.ok ? (r.value as { refused?: boolean; rule: string; detail: string }) : null;
      expect(v!.refused).toBe(true);
      expect(v!.rule).toBe("MINE_ROW_ID_MALFORMED");
      expect(v!.detail).toContain("mine:corrupted-row");
    } finally {
      await host.shutdown().catch(() => {});
    }
  }, 120_000);

  test("the same prefix with a VALID pin is listed normally — the rule bites only on corruption", async () => {
    // This boot's ledger holds three receipt-prefixed rows, all of which name a
    // real pin: the captured fixture, plus the two rows this file deliberately
    // appended above. None of them is corruption, so none may be refused.
    const l = await call(OP_LIST, {});
    expect(l.ok).toBe(true);
    const v = l.ok ? (l.value as { refused?: boolean; count: number; mines: Array<{ mineId: string }> }) : null;
    expect(v!.refused).toBeUndefined();
    expect(v!.count).toBe(3);
    expect(v!.count).toBe(v!.mines.length);
    expect([...v!.mines.map((m) => m.mineId)].sort()).toEqual([
      "halftrue@abcdef1", "notanobject@abcdef0", pinnedMineId(),
    ].sort());
  });
});

describe("MINE_LEDGER_REFUSED — a receipt the ledger will not serve is not a verified receipt", () => {
  test("with port:vault.get@1 withheld, verify refuses instead of reporting", async () => {
    // A second boot of the SAME composition with the READ port withheld: the
    // handler runs (READ is ungated) and finds the ledger closed. It must say
    // so by name — not answer "no such receipt", which would be a lie about
    // the world, and not return a passing report, which would be worse.
    const { host } = await bootMineWithout(PLUGIN_ID, "port:vault.get@1");
    try {
      await capturePinned(host);
      const r = await callOn(host, OP_VERIFY, { mineId: pinnedMineId() });
      expect(r.ok).toBe(true);
      const v = r.ok ? (r.value as { refused?: boolean; rule: string; detail: string }) : null;
      expect(v!.refused).toBe(true);
      expect(v!.rule).toBe("MINE_LEDGER_REFUSED");
      expect(v!.detail).toContain("vault.get@1");
      // the same closed ledger refuses diff too, naming the side
      const d = await callOn(host, OP_DIFF, { mineA: pinnedMineId(), mineB: pinnedMineId() });
      const dv = d.ok ? (d.value as { refused?: boolean; rule: string; detail: string }) : null;
      expect(dv!.rule).toBe("MINE_LEDGER_REFUSED");
      expect(dv!.detail).toContain("mineA");
    } finally {
      await host.shutdown().catch(() => {});
    }
  }, 180_000);

  test("with port:vault.query@1 withheld, list refuses rather than reporting an empty ledger", async () => {
    const { host } = await bootMineWithout(PLUGIN_ID, "port:vault.query@1");
    try {
      const r = await callOn(host, OP_LIST, {});
      expect(r.ok).toBe(true);
      const v = r.ok ? (r.value as { refused?: boolean; rule: string; detail: string }) : null;
      expect(v!.refused).toBe(true);
      expect(v!.rule).toBe("MINE_LEDGER_REFUSED");
      expect(v!.detail).toContain("vault.query@1");
      // an empty ledger and a closed ledger are different facts, and the op
      // says which one it is: `count: 0` would be a claim about the world.
      expect(v!.detail).toContain("not an empty ledger");
    } finally {
      await host.shutdown().catch(() => {});
    }
  }, 180_000);
});

describe("refusals carry the op, the rule, and a detail — never a bare error", () => {
  test("every refusal is ok:true carrying {refused, error, op, rule, detail}", async () => {
    const r = await refusalOf(OP_VERIFY, { mineId: "not-a-pin" });
    expect(Object.keys(r).sort()).toEqual(["detail", "error", "op", "refused", "rule"]);
    expect(r.error).toBe("REFUSED");
    expect(r.op).toBe(OP_VERIFY);
    expect(r.detail.length).toBeGreaterThan(10);
    // the same envelope on all three ops
    for (const [op, payload] of [[OP_LIST, { x: 1 }], [OP_DIFF, {}]] as Array<[string, unknown]>) {
      const rr = await refusalOf(op, payload);
      expect(Object.keys(rr).sort()).toEqual(["detail", "error", "op", "refused", "rule"]);
      expect(rr.op).toBe(op);
    }
  });
});