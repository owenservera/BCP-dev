// forge.survey — test/refusal/survey-refusals.test.ts (D-417 Wave 1+ lane)
// The named-refusal net for forge.survey.run@1 and forge.survey.render@1. Every
// case runs on a REAL boot (law + vault + capture + survey, through
// compositions/forge-survey.json) and every refusal is a NAMED rule in an
// ok:true envelope (D-379 refusal-as-data), never a generic error. The
// forge-surface gate's FORGE_NO_REFUSAL_TEST requires this file to NAME the op;
// the house discipline requires it to name — and TRIGGER — every RULE.
//
// The ten named failures:
//   SURVEY_RUN_MALFORMED_INPUT       run payload is not {mineId}
//   SURVEY_RENDER_MALFORMED_INPUT    render payload is neither/both/with extras
//   SURVEY_MINE_ID_MALFORMED         mineId is not `<repo>@<7-64 hex>`
//   SURVEY_RECEIPT_MISSING           no capture receipt is stored for that pin
//   SURVEY_RECEIPT_MALFORMED         the stored row is not a readable CaptureReceipt@1
//   SURVEY_BLOB_MISSING              a cited casRef is not in the ledger
//   SURVEY_BLOB_MALFORMED            the stored row is not a decodable CAS blob
//   SURVEY_BLOB_MISMATCH             the decoded bytes do not re-hash to the cited address
//   SURVEY_INVENTORY_MALFORMED       a supplied inventory is not one render could have emitted
//   SURVEY_LEDGER_REFUSED            the receipt or blobs could not be read
//
// The four blob/receipt cases build their own rows DIRECTLY in the ledger (as
// root, outside any plugin) rather than corrupting the pinned fixture: a
// refusal net that damages the fixture to make itself fail is a net that
// damages the corpus. The class split is asserted mechanically too — READ ops
// answer on a fresh boot with no consent granted, while the capture seam is
// refused at the gate.
import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { SURVEY_REFUSAL_RULES } from "../../src/index.ts";
import { FORGE_SURVEY_RENDER_OP, FORGE_SURVEY_RUN_OP, receiptRowId } from "../../src/inventory.ts";
import {
  RECEIPT_NS, bootSurvey, bootSurveyWithout, callOn, capturePinned, consentForCapture, current,
  pinnedMineId, refusalOf, setCurrent,
} from "../boot.ts";

const OP_RUN = FORGE_SURVEY_RUN_OP;
const OP_RENDER = FORGE_SURVEY_RENDER_OP;
const CAPTURE_OP = "forge.mine.capture@1";

/** sha256 in the house idiom. */
function sha256hex(text: string): string {
  return createHash("sha256").update(Buffer.from(text, "utf-8")).digest("hex");
}

/** Append a row straight into the ledger as root — the rig for the four
 *  "what is stored is not what the receipt claims" rules. */
async function put(id: string, data: unknown): Promise<void> {
  const r = await current().host.router.callAsRoot("vault.append@1", {
    ns: RECEIPT_NS, id, data, meta: { type: "test-fixture", producedBy: "survey-refusals" }, refs: [],
  });
  if (!r.ok) throw new Error(`could not seed ${RECEIPT_NS}/${id}: ${r.error} ${String((r as { detail?: string }).detail ?? "")}`);
}

/** A receipt-shaped row citing `casRef`, whose blob row is `blob` (or absent). */
async function seedReceipt(mineId: string, path: string, body: string, blob: unknown | null): Promise<{ casRef: string; hash: string; bytes: number }> {
  const hash = `sha256:${sha256hex(body)}`;
  const casRef = `cas:${hash}`;
  if (blob !== null) await put(casRef, blob);
  await put(receiptRowId(mineId), {
    schemaVersion: "1",
    op: "forge.mine.capture@1",
    mineId,
    mineRoot: "(seeded by the refusal suite — no tree was read)",
    capturedAt: "2026-01-01T00:00:00.000Z",
    fileCount: 1,
    rootHash: `sha256:${sha256hex("root")}`,
    files: [{ path, hash, bytes: Buffer.from(body, "utf-8").length, casRef }],
    refusals: [],
  });
  return { casRef, hash, bytes: Buffer.from(body, "utf-8").length };
}

/** A well-formed CAS blob row whose payload says one thing and whose hash says another. */
function lyingBlob(hash: string, bytes: number, payload: string): unknown {
  return { schemaVersion: "1", op: "forge.mine.capture@1", casRef: `cas:${hash}`, hash, bytes, encoding: "base64", data: Buffer.from(payload, "utf-8").toString("base64") };
}

beforeAll(async () => {
  const b = await bootSurvey();
  setCurrent(b);
}, 120_000);

afterAll(async () => { await current().host.shutdown().catch(() => {}); }, 30_000);

describe("every refusal names a rule this file actually TRIGGERS", () => {
  test("the rule set and the cases below are the same set (no unproven failure mode)", () => {
    expect([...SURVEY_REFUSAL_RULES].sort()).toEqual([
      "SURVEY_BLOB_MALFORMED",
      "SURVEY_BLOB_MISMATCH",
      "SURVEY_BLOB_MISSING",
      "SURVEY_INVENTORY_MALFORMED",
      "SURVEY_LEDGER_REFUSED",
      "SURVEY_MINE_ID_MALFORMED",
      "SURVEY_RECEIPT_MALFORMED",
      "SURVEY_RECEIPT_MISSING",
      "SURVEY_RENDER_MALFORMED_INPUT",
      "SURVEY_RUN_MALFORMED_INPUT",
    ].sort());
    const me = readFileSync(import.meta.path, "utf-8");
    // "appears somewhere in the file" is not "is exercised": the header comment
    // alone would satisfy a toContain check. Require each rule to be asserted
    // inside an expect() at least once.
    for (const rule of SURVEY_REFUSAL_RULES) {
      const assertions = me.split("\n").filter((l) => l.includes("expect(") && l.includes(`"${rule}"`));
      expect({ rule, assertions: assertions.length }).toEqual({ rule, assertions: expect.any(Number) });
      expect(assertions.length).toBeGreaterThan(0);
    }
  });

  test("both declared ops are named here — FORGE_NO_REFUSAL_TEST reads this file", () => {
    const me = readFileSync(import.meta.path, "utf-8");
    expect(me).toContain(OP_RUN);
    expect(me).toContain(OP_RENDER);
    expect(me).toContain(CAPTURE_OP);
  });
});

describe("the class split is real: survey is ungated READ, the capture seam is not", () => {
  test("on a FRESH boot the capture op is consent-gated while survey answers unasked", async () => {
    const { host } = await bootSurvey();
    try {
      const gated = await callOn(host, CAPTURE_OP, { mineRoot: ".", mineId: pinnedMineId() });
      expect(gated.ok).toBe(false);
      expect(String(gated.ok ? "" : gated.detail)).toContain("consent required");
      // the READ ops ran anyway and produced their OWN named refusal
      const read = await callOn(host, OP_RUN, { mineId: "not-captured-yet@abcdef0" });
      expect(read.ok).toBe(true);
      const v = read.ok ? (read.value as { refused?: boolean; rule?: string }) : null;
      expect(v?.refused).toBe(true);
      expect(v?.rule).toBe("SURVEY_RECEIPT_MISSING");
    } finally {
      await host.shutdown().catch(() => {});
    }
  }, 180_000);
});

describe("SURVEY_RUN_MALFORMED_INPUT — the run payload is not {mineId}", () => {
  const cases: Array<{ name: string; payload: unknown; expectDetail?: string }> = [
    { name: "null", payload: null },
    { name: "array", payload: [] },
    { name: "string", payload: "pantrylog@abcdef0" },
    { name: "empty object", payload: {} },
    { name: "non-string mineId", payload: { mineId: 42 } },
    { name: "empty mineId", payload: { mineId: "" } },
    { name: "unknown field", payload: { mineId: "pantrylog@abcdef0", walk: true }, expectDetail: "walk" },
  ];
  for (const c of cases) {
    test(`a ${c.name} run payload refuses by name`, async () => {
      const r = await refusalOf(OP_RUN, c.payload);
      expect(r.rule).toBe("SURVEY_RUN_MALFORMED_INPUT");
      expect(r.error).toBe("REFUSED");
      expect(r.op).toBe(OP_RUN);
      if (c.expectDetail) expect(r.detail).toContain(c.expectDetail);
    });
  }
});

describe("SURVEY_RENDER_MALFORMED_INPUT — render takes exactly one of two shapes", () => {
  const cases: Array<{ name: string; payload: unknown; expectDetail?: string }> = [
    { name: "null", payload: null },
    { name: "array", payload: [] },
    { name: "neither mineId nor inventory", payload: {}, expectDetail: "exactly one" },
    { name: "both mineId and inventory", payload: { mineId: "pantrylog@abcdef0", inventory: {} }, expectDetail: "exactly one" },
    { name: "unknown field", payload: { mineId: "pantrylog@abcdef0", fmt: "json" }, expectDetail: "fmt" },
  ];
  for (const c of cases) {
    test(`a ${c.name} render payload refuses by name`, async () => {
      const r = await refusalOf(OP_RENDER, c.payload);
      expect(r.rule).toBe("SURVEY_RENDER_MALFORMED_INPUT");
      expect(r.error).toBe("REFUSED");
      expect(r.op).toBe(OP_RENDER);
      if (c.expectDetail) expect(r.detail).toContain(c.expectDetail);
    });
  }
});

describe("SURVEY_MINE_ID_MALFORMED — an unpinned tree has no identity to survey", () => {
  const bad = ["pantrylog", "pantrylog@", "pantrylog@synthetic-v0", "pantrylog@ABCDEF0", "pantrylog@abc", "Pantrylog@abcdef0", "@abcdef0"];
  for (const id of bad) {
    test(`mineId ${JSON.stringify(id)} refuses by name on run`, async () => {
      const r = await refusalOf(OP_RUN, { mineId: id });
      expect(r.rule).toBe("SURVEY_MINE_ID_MALFORMED");
      expect(r.detail).toContain("unpinned");
    });
    test(`mineId ${JSON.stringify(id)} refuses by name on render`, async () => {
      const r = await refusalOf(OP_RENDER, { mineId: id });
      expect(r.rule).toBe("SURVEY_MINE_ID_MALFORMED");
      expect(r.detail).toContain("unpinned");
    });
  }
});

describe("SURVEY_RECEIPT_MISSING — an uncaptured mine has nothing to survey", () => {
  test("a well-formed pin with no stored receipt refuses by name, on both ops", async () => {
    const mineId = "never-captured@0000000";
    const run = await refusalOf(OP_RUN, { mineId });
    expect(run.rule).toBe("SURVEY_RECEIPT_MISSING");
    expect(run.detail).toContain("never-captured");
    const render = await refusalOf(OP_RENDER, { mineId });
    expect(render.rule).toBe("SURVEY_RECEIPT_MISSING");
    expect(render.detail).toContain("forge.mine.capture@1");
  });
});

describe("SURVEY_RECEIPT_MALFORMED — a stored row that is not a receipt is not surveyed", () => {
  const cases: Array<{ name: string; data: unknown; expectDetail: string }> = [
    { name: "an array", data: [], expectDetail: "not a JSON object" },
    { name: "a string", data: "not a receipt", expectDetail: "not a JSON object" },
    { name: "the wrong op", data: { schemaVersion: "1", op: "forge.emit.plugin@1", files: [] }, expectDetail: "forge.emit.plugin@1" },
    { name: "no files[]", data: { schemaVersion: "1", op: "forge.mine.capture@1" }, expectDetail: "absent" },
    { name: "files[] not an array", data: { schemaVersion: "1", op: "forge.mine.capture@1", files: {} }, expectDetail: "not an array" },
    { name: "an empty files[]", data: { schemaVersion: "1", op: "forge.mine.capture@1", files: [], rootHash: `sha256:${"0".repeat(64)}` }, expectDetail: "zero files" },
    {
      name: "a row whose hash is not a hash",
      data: { schemaVersion: "1", op: "forge.mine.capture@1", rootHash: `sha256:${"0".repeat(64)}`, files: [{ path: "a.txt", hash: "md5:zz", bytes: 1, casRef: "cas:md5:zz" }] },
      expectDetail: "is not sha256",
    },
    {
      name: "a row whose casRef is not its own hash",
      data: { schemaVersion: "1", op: "forge.mine.capture@1", rootHash: `sha256:${"0".repeat(64)}`, files: [{ path: "a.txt", hash: `sha256:${"0".repeat(64)}`, bytes: 1, casRef: "cas:sha256:" + "1".repeat(64) }] },
      expectDetail: "pure function of the content",
    },
    {
      name: "no rootHash",
      data: { schemaVersion: "1", op: "forge.mine.capture@1", files: [{ path: "a.txt", hash: `sha256:${"0".repeat(64)}`, bytes: 1, casRef: `cas:sha256:${"0".repeat(64)}` }] },
      expectDetail: "rootHash",
    },
  ];
  for (const c of cases) {
    test(`${c.name} refuses by name`, async () => {
      const mineId = `broken@${sha256hex(c.name).slice(0, 40)}`;
      await put(receiptRowId(mineId), c.data);
      const r = await refusalOf(OP_RUN, { mineId });
      expect(r.rule).toBe("SURVEY_RECEIPT_MALFORMED");
      expect(r.detail).toContain(c.expectDetail);
    });
  }
});

describe("SURVEY_BLOB_MISSING — the receipt's address has nothing behind it", () => {
  test("a receipt citing a casRef that was never written refuses by name", async () => {
    const mineId = `noblo@${sha256hex("blob-missing").slice(0, 40)}`;
    await seedReceipt(mineId, "a.txt", "hello\n", null);
    const r = await refusalOf(OP_RUN, { mineId });
    expect(r.rule).toBe("SURVEY_BLOB_MISSING");
    expect(r.detail).toContain("cas:sha256:");
    expect(r.detail).toContain("not in vault ns proposal");
  });
});

describe("SURVEY_BLOB_MALFORMED — a stored row that is not a decodable blob", () => {
  const cases: Array<{ name: string; blob: unknown }> = [
    { name: "a payload that is not base64", blob: { schemaVersion: "1", op: "forge.mine.capture@1", casRef: "cas:sha256:" + "0".repeat(64), hash: `sha256:${"0".repeat(64)}`, bytes: 4, encoding: "base64", data: "!! not base64 !!" } },
    { name: "an unknown encoding", blob: { schemaVersion: "1", op: "forge.mine.capture@1", casRef: "cas:sha256:" + "0".repeat(64), hash: `sha256:${"0".repeat(64)}`, bytes: 4, encoding: "hex", data: "68690a" } },
    { name: "a length that disagrees with the payload", blob: { schemaVersion: "1", op: "forge.mine.capture@1", casRef: "cas:sha256:" + "0".repeat(64), hash: `sha256:${"0".repeat(64)}`, bytes: 99, encoding: "base64", data: Buffer.from("hi\n").toString("base64") } },
    { name: "the wrong op", blob: { schemaVersion: "1", op: "forge.author.init@1", casRef: "cas:sha256:" + "0".repeat(64), hash: `sha256:${"0".repeat(64)}`, bytes: 3, encoding: "base64", data: Buffer.from("hi\n").toString("base64") } },
    { name: "not an object at all", blob: "just a string" },
  ];
  for (const c of cases) {
    test(`${c.name} refuses by name`, async () => {
      const body = "hi\n";
      const mineId = `badblob@${sha256hex(c.name).slice(0, 40)}`;
      // the row must EXIST and be found — the refusal is about its shape, not its absence
      await seedReceipt(mineId, "a.txt", body, c.blob);
      const r = await refusalOf(OP_RUN, { mineId });
      expect(r.rule).toBe("SURVEY_BLOB_MALFORMED");
      expect(r.detail).toContain("cannot decode");
    });
  }
});

describe("SURVEY_BLOB_MISMATCH — bytes that do not re-hash to their own address", () => {
  test("a blob whose payload decodes cleanly but hashes elsewhere refuses by name", async () => {
    // The strongest of the blob rules and the one a vacuous check would miss:
    // the row is well-formed, the base64 round-trips, the length agrees — and
    // the CONTENT ADDRESS is still a lie. InventoryRowSchema is a strictObject
    // with nowhere to say "this row is unverified", so this must be a refusal.
    const mineId = `liar@${sha256hex("blob-mismatch").slice(0, 40)}`;
    const declared = "hello\n";
    const actual = "world\n";
    const { hash, bytes } = await seedReceipt(mineId, "a.txt", declared, lyingBlob(`sha256:${sha256hex(declared)}`, Buffer.byteLength(declared), actual));
    const r = await refusalOf(OP_RUN, { mineId });
    expect(r.rule).toBe("SURVEY_BLOB_MISMATCH");
    expect(r.detail).toContain(hash);
    expect(r.detail).toContain(bytes.toString());
    expect(r.detail).toContain("corrupt");
  });

  test("the same corrupt blob refuses on render@1 too — the resolver is shared", async () => {
    const mineId = `liar2@${sha256hex("blob-mismatch-render").slice(0, 40)}`;
    const declared = "hello\n";
    const actual = "HELLO\n"; // same LENGTH, different content — so the row is well-formed
    expect(actual.length).toBe(declared.length);
    await seedReceipt(mineId, "b.txt", declared, lyingBlob(`sha256:${sha256hex(declared)}`, Buffer.byteLength(declared), actual));
    const r = await refusalOf(OP_RENDER, { mineId });
    expect(r.rule).toBe("SURVEY_BLOB_MISMATCH");
  });
});

describe("SURVEY_INVENTORY_MALFORMED — render will not draw what it could not emit", () => {
  const base = {
    schemaVersion: "1",
    op: OP_RUN,
    mineId: "pantrylog@0000000",
    rootHash: `sha256:${"0".repeat(64)}`,
    count: 1,
    rows: [{ schemaVersion: "1", path: "a.py", hash: `sha256:${"0".repeat(64)}`, bytes: 3, language: "python", exports: [], imports: [], models: [], headings: [] }],
    capped: [],
  };
  const cases: Array<{ name: string; inventory: unknown; expectDetail: string }> = [
    { name: "null", inventory: null, expectDetail: "not an object" },
    { name: "a string", inventory: "not an envelope", expectDetail: "not an object" },
    { name: "an array", inventory: [], expectDetail: "not an object" },
    { name: "the wrong op", inventory: { ...base, op: "forge.survey.render@1" }, expectDetail: "forge.survey.render@1" },
    { name: "an unpinned mineId", inventory: { ...base, mineId: "pantrylog" }, expectDetail: "<repo>@<7-64 hex>" },
    { name: "a malformed rootHash", inventory: { ...base, rootHash: "sha256:zz" }, expectDetail: "rootHash" },
    { name: "no rows[]", inventory: { ...base, rows: undefined, count: 0 }, expectDetail: "rows" },
    { name: "no capped[]", inventory: { ...base, capped: undefined }, expectDetail: "capped" },
    { name: "a count that over-claims", inventory: { ...base, count: 9 }, expectDetail: "over-claims" },
    { name: "a row that is not an object", inventory: { ...base, rows: ["a.py"], count: 1 }, expectDetail: "not a row object" },
    { name: "a row with a non-integer byte count", inventory: { ...base, rows: [{ ...base.rows[0], bytes: 1.5 }] }, expectDetail: "bytes" },
    { name: "a row whose language is neither a string nor null", inventory: { ...base, rows: [{ ...base.rows[0], language: 7 }] }, expectDetail: "language" },
    { name: "a row whose exports is not an array of strings", inventory: { ...base, rows: [{ ...base.rows[0], exports: [7] }] }, expectDetail: "exports" },
    { name: "a capped row with no counts", inventory: { ...base, capped: [{ path: "a.py", field: "exports" }] }, expectDetail: "kept" },
  ];
  for (const c of cases) {
    test(`${c.name} refuses by name`, async () => {
      const r = await refusalOf(OP_RENDER, { inventory: c.inventory });
      expect(r.rule).toBe("SURVEY_INVENTORY_MALFORMED");
      expect(r.detail).toContain(c.expectDetail);
    });
  }
});

describe("SURVEY_LEDGER_REFUSED — an inventory that cannot see the ledger is not an empty one", () => {
  test("with vault.get@1 withheld the receipt read is a closed ledger, not an absent receipt", async () => {
    // The two facts arrive in the SAME envelope — the vault THROWS on a missing
    // row and the shim maps a throw to {ok:false, error:"DEGRADED"} — so the
    // classifier has to tell them apart. A capability REFUSED is not absence,
    // and reporting "no receipt here" for a ledger nobody may read would be the
    // most dangerous answer this op could give.
    const { host } = await bootSurveyWithout("port:vault.get@1");
    try {
      const r = await host.router.callAsRoot(OP_RUN, { mineId: pinnedMineId() });
      expect(r.ok).toBe(true);
      const v = r.ok ? (r.value as { refused?: boolean; rule?: string; detail?: string }) : null;
      expect(v?.refused).toBe(true);
      expect(v?.rule).toBe("SURVEY_LEDGER_REFUSED");
      expect(v?.detail).toContain("vault.get@1");
      expect(v?.detail).not.toContain("no capture receipt is stored");
    } finally {
      await host.shutdown().catch(() => {});
    }
  }, 180_000);

  test("with vault.getmany@1 withheld the blob read is refused — not reported as a missing blob", async () => {
    // The receipt EXISTS in this case (the capture seam still holds its own
    // grant), so the run gets past the receipt and dies on the batch. A missing
    // blob is DATA to getmany and would report SURVEY_BLOB_MISSING; a closed
    // ledger must not be dressed up as an absence.
    const { host } = await bootSurveyWithout("port:vault.getmany@1");
    try {
      await consentForCapture(host);
      await capturePinned(host);
      const r = await host.router.callAsRoot(OP_RUN, { mineId: pinnedMineId() });
      expect(r.ok).toBe(true);
      const v = r.ok ? (r.value as { refused?: boolean; rule?: string; detail?: string }) : null;
      expect(v?.refused).toBe(true);
      expect(v?.rule).toBe("SURVEY_LEDGER_REFUSED");
      expect(v?.detail).toContain("vault.getmany@1");
      expect(v?.detail).not.toContain("not in vault ns proposal");
    } finally {
      await host.shutdown().catch(() => {});
    }
  }, 180_000);
});

describe("refusals carry the op, the rule, and a detail — never a bare error", () => {
  test("every refusal is ok:true carrying {refused, error, op, rule, detail}", async () => {
    const r = await refusalOf(OP_RUN, { mineId: "not-a-pin" });
    expect(Object.keys(r).sort()).toEqual(["detail", "error", "op", "refused", "rule"]);
    expect(r.error).toBe("REFUSED");
    expect(r.op).toBe(OP_RUN);
    expect(r.detail.length).toBeGreaterThan(10);
  });

  test("the refusal suite left the pinned fixture untouched — it seeds the LEDGER, never the mine", async () => {
    // every seeded row went in under a throwaway pin; the pinned fixture's own
    // receipt was never captured on this boot, so nothing about it could change
    const q = await current().host.router.callAsRoot("vault.query@1", { ns: RECEIPT_NS, filter: { idPrefix: "mine:pantrylog/" } });
    expect(q.ok).toBe(true);
    expect(q.ok ? (q.value as unknown[]).length : -1).toBe(0);
    expect(readFileSync(join(process.cwd(), "plugins/forge-survey/plugin.json"), "utf-8")).toContain("forge.survey.render");
  });
});
