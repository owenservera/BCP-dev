// forge.mine.capture — test/refusal/capture-refusals.test.ts (D-409, D-406 D5)
// The named-refusal net for forge.mine.capture@1. Every case runs on a REAL
// boot (law + vault + the plugin routed normally through
// compositions/forge-mine-capture.json) and every refusal must be a NAMED rule
// in an ok:true envelope (the house's D-379 refusal-as-data), never a generic
// error. The forge-surface gate's FORGE_NO_REFUSAL_TEST requires this file to
// NAME the op; the house discipline requires it to name every RULE, and the
// first test below asserts that the rule set and the tests below are the same
// set — a refusal nobody exercises is a refusal nobody knows works.
//
// The nine named failures:
//   (gate)                        the EXTERNAL_MUTATION class gate (require-consent)
//   CAPTURE_MALFORMED_INPUT       the payload is not {mineRoot, mineId}
//   CAPTURE_MINE_ID_MALFORMED     mineId is not `<repo>@<7-64 hex>`
//   CAPTURE_MINE_ROOT_MISSING     the declared root is absent / not a directory
//   CAPTURE_LAW_REFUSED           a forbidden principal refuses before any read
//   CAPTURE_PATH_ESCAPE           an entry resolves OUTSIDE the mine root
//   CAPTURE_UNREADABLE_FILE       an entry cannot be resolved, stat-ed or read
//   CAPTURE_EMPTY_MINE            zero admitted files
//   CAPTURE_MINE_PIN_MISMATCH     the pin disagrees with the computed root hash
//   CAPTURE_LEDGER_REFUSED        the receipt row was refused or did not read back
//
// Every refusal is checked for a second property: the mine tree was not
// written. Capture is read-only by construction, and a refusal that mutated the
// target would be a worse bug than the one it prevents.
import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { lstatSync, mkdirSync, readdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { CaptureReceiptSchema } from "../../../../packs/builder/src/schemas.ts";
import { consentIdFor } from "@vivim/omega-contracts";
import { CAPTURE_REFUSAL_RULES, EXCLUDED_DIRS, EXCLUDED_FILES, FORGE_MINE_CAPTURE_OP, hashFileBytes, rootHashOf } from "../../src/index.ts";
import {
  MINE_ROOT, bootCapture, bootCaptureWithout, call, callOn, callRefusal, capture, consent,
  current, pinnedMineId, scratchDir, setCurrent,
} from "../boot.ts";

const OP = "forge.mine.capture@1";
const PLUGIN_ID = "forge.mine.capture";

/** A tiny mine on disk, so the refusal cases never touch the pinned fixture. */
function makeMine(name: string, files: Record<string, string>): string {
  const root = scratchDir(name);
  for (const [rel, body] of Object.entries(files)) {
    const abs = join(root, ...rel.split("/"));
    mkdirSync(join(abs, ".."), { recursive: true });
    writeFileSync(abs, body);
  }
  return root;
}

/** The pin a throwaway mine needs to get past CAPTURE_MINE_PIN_MISMATCH.
 *  Mirrors the capture's DECLARED exclusion policy (so a mine carrying a
 *  MANIFEST.json or a dependency tree pins over exactly what the capture
 *  admits); links are skipped, because the op refuses on a link before the pin
 *  check is ever reached. */
function pinFor(root: string, repo: string): string {
  const files: Array<{ path: string; hash: string }> = [];
  const walk = (rel: string): void => {
    const abs = rel === "" ? root : join(root, ...rel.split("/"));
    for (const e of readdirSync(abs, { withFileTypes: true })) {
      const r = rel === "" ? e.name : `${rel}/${e.name}`;
      if (e.isDirectory()) {
        if (Object.prototype.hasOwnProperty.call(EXCLUDED_DIRS, e.name)) continue;
        walk(r);
        continue;
      }
      if (!e.isFile()) continue; // links and specials are never admitted
      if (Object.prototype.hasOwnProperty.call(EXCLUDED_FILES, e.name)) continue;
      files.push({ path: r, hash: hashFileBytes(readFileSync(join(abs, e.name))).hash });
    }
  };
  walk("");
  files.sort((a, b) => (a.path < b.path ? -1 : 1));
  return `${repo}@${rootHashOf(files).replace(/^sha256:/, "")}`;
}

/** Recursive snapshot of a tree, links recorded as links (never followed) — a
 *  refusal must leave the tree byte-identical. */
function snapshot(dir: string): string[] {
  const out: string[] = [];
  const walk = (rel: string): void => {
    const abs = rel === "" ? dir : join(dir, ...rel.split("/"));
    for (const e of readdirSync(abs, { withFileTypes: true })) {
      const r = rel === "" ? e.name : `${rel}/${e.name}`;
      if (e.isDirectory()) { out.push(`d ${r}`); walk(r); continue; }
      if (!e.isFile()) { out.push(`l ${r}`); continue; }
      out.push(`f ${r} ${hashFileBytes(readFileSync(join(abs, e.name))).hash}`);
    }
  };
  walk("");
  return out.sort();
}

beforeAll(async () => {
  const b = await bootCapture();
  setCurrent(b);
  await consent(b.host);
}, 120_000);

afterAll(async () => { await current().host.shutdown().catch(() => {}); }, 30_000);

describe("every refusal names a rule this file actually asserts", () => {
  test("the rule set and the cases below are the same set (no unproven failure mode)", () => {
    expect([...CAPTURE_REFUSAL_RULES].sort()).toEqual([
      "CAPTURE_EMPTY_MINE",
      "CAPTURE_LEDGER_REFUSED",
      "CAPTURE_LAW_REFUSED",
      "CAPTURE_MALFORMED_INPUT",
      "CAPTURE_MINE_ID_MALFORMED",
      "CAPTURE_MINE_PIN_MISMATCH",
      "CAPTURE_MINE_ROOT_MISSING",
      "CAPTURE_PATH_ESCAPE",
      "CAPTURE_UNREADABLE_FILE",
    ].sort());
    const me = readFileSync(import.meta.path, "utf-8");
    // "appears somewhere in the file" is not "is exercised": the header comment
    // alone would satisfy a toContain check. Require each rule to be asserted
    // in an expect() at least once, so a rule that stops being triggered goes red.
    for (const rule of CAPTURE_REFUSAL_RULES) {
      const assertions = me.split("\n").filter((l) => l.includes("expect(") && l.includes(rule));
      expect({ rule, assertions: assertions.length }).toEqual({ rule, assertions: expect.any(Number) });
      expect(assertions.length).toBeGreaterThan(0);
    }
    expect(me).toContain(OP);
  });
});

describe("the EXTERNAL_MUTATION class gate fires BEFORE the handler", () => {
  test("an unconsented capture is refused at the gate with a consentId; consented, the same payload succeeds", async () => {
    const { host } = await bootCapture();
    try {
      const r = await callOn(host, OP, { mineRoot: MINE_ROOT, mineId: pinnedMineId() });
      expect(r.ok).toBe(false);
      if (r.ok) return;
      expect(r.error).toBe("REFUSED");
      expect(r.detail).toContain("consent required");
      // rule: "law.check@1" — the GATE's rule, not the handler's: the handler
      // never ran, so it never read a byte of the mine.
      expect(r.refusal?.rule).toBe("law.check@1");
      const callerConsentId = /consent required: (consent_[0-9a-f]+)/.exec(r.detail ?? "")?.[1];
      expect(callerConsentId).toMatch(/^consent_[0-9a-f]+$/);
      // Two consents, two principals: the caller's (to pass the gate) and the
      // plugin's own (its in-handler self-check runs before the first read).
      expect((await callOn(host, "law.consent.grant@1", { consentId: callerConsentId })).ok).toBe(true);
      expect((await callOn(host, "law.consent.grant@1", { consentId: consentIdFor(PLUGIN_ID, OP), principal: PLUGIN_ID })).ok).toBe(true);
      const second = await callOn(host, OP, { mineRoot: MINE_ROOT, mineId: pinnedMineId() });
      expect(second.ok).toBe(true);
      expect(CaptureReceiptSchema.parse(second.ok ? second.value : null).fileCount).toBe(42);
    } finally {
      await host.shutdown().catch(() => {});
    }
  }, 120_000);

  test("the plugin's own consent is required too — the read is the PLUGIN's act, not the caller's", async () => {
    const { host } = await bootCapture();
    try {
      // grant ONLY the caller's consent: the gate opens, the handler runs, and
      // the plugin's own law self-check refuses before reading a byte.
      const first = await callOn(host, OP, { mineRoot: MINE_ROOT, mineId: pinnedMineId() });
      expect(first.ok).toBe(false);
      const callerConsentId = /consent required: (consent_[0-9a-f]+)/.exec(first.detail ?? "")?.[1];
      await callOn(host, "law.consent.grant@1", { consentId: callerConsentId });
      const second = await callOn(host, OP, { mineRoot: MINE_ROOT, mineId: pinnedMineId() });
      expect(second.ok).toBe(true);
      const v = second.ok ? (second.value as { refused?: boolean; rule?: string; detail?: string }) : null;
      expect(v?.refused).toBe(true);
      expect(v?.rule).toBe("CAPTURE_LAW_REFUSED");
      expect(v?.detail).toContain("require-consent");
    } finally {
      await host.shutdown().catch(() => {});
    }
  }, 120_000);
});

describe("CAPTURE_MALFORMED_INPUT — the payload is not {mineRoot, mineId}", () => {
  const cases: Array<{ name: string; payload: unknown; expectDetail?: string }> = [
    { name: "null", payload: null },
    { name: "array", payload: [] },
    { name: "string", payload: "fixtures/mines/synthetic-v0" },
    { name: "empty object", payload: {} },
    { name: "missing mineRoot", payload: { mineId: "pantrylog@abcdef0" }, expectDetail: "mineRoot" },
    { name: "missing mineId", payload: { mineRoot: MINE_ROOT }, expectDetail: "mineId" },
    { name: "empty mineRoot", payload: { mineRoot: "", mineId: "pantrylog@abcdef0" } },
    { name: "non-string mineRoot", payload: { mineRoot: 42, mineId: "pantrylog@abcdef0" } },
    { name: "non-string mineId", payload: { mineRoot: MINE_ROOT, mineId: 7 } },
    { name: "unknown field", payload: { mineRoot: MINE_ROOT, mineId: "pantrylog@abcdef0", recurse: true }, expectDetail: "recurse" },
  ];
  for (const c of cases) {
    test(`a ${c.name} payload refuses by name`, async () => {
      const r = await callRefusal(c.payload);
      expect(r.rule).toBe("CAPTURE_MALFORMED_INPUT");
      expect(r.error).toBe("REFUSED");
      expect(r.op).toBe(FORGE_MINE_CAPTURE_OP);
      if (c.expectDetail) expect(r.detail).toContain(c.expectDetail);
    });
  }
});

describe("CAPTURE_MINE_ID_MALFORMED — an unpinned mine has no identity", () => {
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
    test(`mineId ${JSON.stringify(id)} refuses by name`, async () => {
      const r = await callRefusal({ mineRoot: MINE_ROOT, mineId: id });
      expect(r.rule).toBe("CAPTURE_MINE_ID_MALFORMED");
      expect(r.detail).toContain("unpinned");
    });
  }
});

describe("CAPTURE_MINE_ROOT_MISSING — the declared root must exist and be a directory", () => {
  test("an absent root refuses by name", async () => {
    const absent = join(scratchDir("absent-root"), "nope", "still-nope");
    const r = await callRefusal({ mineRoot: absent, mineId: "absent@abcdef0" });
    expect(r.rule).toBe("CAPTURE_MINE_ROOT_MISSING");
    expect(r.detail).toContain("does not resolve");
  });

  test("a root that is a FILE, not a tree, refuses by name", async () => {
    const file = join(scratchDir("file-root"), "a-file.txt");
    writeFileSync(file, "not a tree\n");
    const r = await callRefusal({ mineRoot: file, mineId: "afile@abcdef0" });
    expect(r.rule).toBe("CAPTURE_MINE_ROOT_MISSING");
    expect(r.detail).toContain("not a directory");
  });
});

describe("CAPTURE_LAW_REFUSED — the in-handler law self-check is real", () => {
  test("a forbidden principal refuses BEFORE a single file byte is read", async () => {
    // The manifest justification claims the op is law-gated. Prove it as data:
    // forbid forge.mine.capture@1 for the forge.mine.capture principal and
    // watch the op refuse while the mine tree is provably untouched.
    const mine = makeMine("law-refused", { "only.txt": "one\n", "nested/two.txt": "two\n" });
    const before = snapshot(mine);
    const set = await current().host.router.callAsRoot("law.forbidden.set@1", { principal: "forge.mine.capture", ops: [OP] });
    expect(set.ok).toBe(true);
    try {
      const r = await callRefusal({ mineRoot: mine, mineId: pinFor(mine, "lawtest") });
      expect(r.rule).toBe("CAPTURE_LAW_REFUSED");
      expect(r.detail).toContain(OP);
      expect(snapshot(mine)).toEqual(before);
    } finally {
      const clear = await current().host.router.callAsRoot("law.forbidden.set@1", { principal: "forge.mine.capture", ops: [] });
      expect(clear.ok).toBe(true);
    }
  });
});

describe("CAPTURE_PATH_ESCAPE — a mine that reaches outside itself is refused, not described", () => {
  test("a link inside the root that resolves OUTSIDE it refuses by name", async () => {
    const mine = makeMine("path-escape", { "real.txt": "inside\n" });
    const outside = scratchDir("path-escape-outside");
    writeFileSync(join(outside, "secret.txt"), "not mine\n");
    // "junction" needs no elevated privilege on Windows and is a plain symlink
    // on POSIX; either way lstat reports a link and realpath resolves the target.
    symlinkSync(outside, join(mine, "escape"), "junction");
    expect(lstatSync(join(mine, "escape")).isSymbolicLink()).toBe(true);
    const before = snapshot(mine);
    const r = await callRefusal({ mineRoot: mine, mineId: pinFor(mine, "escaper") });
    expect(r.rule).toBe("CAPTURE_PATH_ESCAPE");
    expect(r.detail).toContain("OUTSIDE");
    expect(r.detail).toContain("escape");
    expect(snapshot(mine)).toEqual(before);
  }, 30_000);
});

describe("CAPTURE_UNREADABLE_FILE — a receipt never over-claims", () => {
  test("a dangling link (target removed) refuses by name rather than being dropped", async () => {
    const mine = makeMine("unreadable", { "real.txt": "inside\n" });
    const target = scratchDir("unreadable-target");
    writeFileSync(join(target, "gone.txt"), "here for now\n");
    symlinkSync(target, join(mine, "dangling"), "junction");
    rmSync(target, { recursive: true, force: true }); // ordered AFTER the link exists
    const before = snapshot(mine);
    const r = await callRefusal({ mineRoot: mine, mineId: pinFor(mine, "unread") });
    expect(r.rule).toBe("CAPTURE_UNREADABLE_FILE");
    expect(r.detail).toContain("dangling");
    expect(r.detail).toContain("whole tree");
    expect(snapshot(mine)).toEqual(before);
  }, 30_000);
});

describe("CAPTURE_EMPTY_MINE — a receipt with no files in it is not a mine", () => {
  test("a root admitting zero files refuses by name", async () => {
    const empty = scratchDir("empty-mine");
    const r = await callRefusal({ mineRoot: empty, mineId: "empty@abcdef0" });
    expect(r.rule).toBe("CAPTURE_EMPTY_MINE");
    expect(r.detail).toContain("zero files");
  });

  test("a root whose ONLY content is an excluded dir also refuses (nothing was admitted)", async () => {
    const only = scratchDir("only-excluded");
    mkdirSync(join(only, "node_modules", "dep"), { recursive: true });
    writeFileSync(join(only, "node_modules", "dep", "index.js"), "module.exports = 1;\n");
    const r = await callRefusal({ mineRoot: only, mineId: "onlydep@abcdef0" });
    expect(r.rule).toBe("CAPTURE_EMPTY_MINE");
    expect(r.detail).toContain("1 excluded");
  });
});

describe("CAPTURE_MINE_PIN_MISMATCH — a wrong pin is refused, never silently satisfied", () => {
  test("a well-formed pin that does not name this tree refuses by name, naming both digests", async () => {
    const mine = makeMine("pin-mismatch", { "a.txt": "a\n", "b/c.txt": "c\n" });
    const before = snapshot(mine);
    const real = pinFor(mine, "wrongmine").replace("wrongmine@", "");
    const r = await callRefusal({ mineRoot: mine, mineId: "wrongmine@deadbeef" });
    expect(r.rule).toBe("CAPTURE_MINE_PIN_MISMATCH");
    expect(r.detail).toContain("deadbeef");
    expect(r.detail).toContain(real);
    expect(snapshot(mine)).toEqual(before);
  });

  test("the right pin becomes the wrong pin the moment one byte changes — the pin bites", async () => {
    const mine = makeMine("pin-drift", { "a.txt": "a\n" });
    const good = pinFor(mine, "drift");
    const r0 = await call({ mineRoot: mine, mineId: good });
    expect(r0.ok).toBe(true);
    writeFileSync(join(mine, "a.txt"), "a changed\n");
    const r1 = await callRefusal({ mineRoot: mine, mineId: good });
    expect(r1.rule).toBe("CAPTURE_MINE_PIN_MISMATCH");
    expect(r1.detail).toContain("the tree moved under the pin");
  });
});

describe("CAPTURE_LEDGER_REFUSED — an unledgered receipt attests to nothing", () => {
  test("with the append capability withheld, a correct capture refuses instead of returning", async () => {
    // A second boot of the SAME composition with port:vault.append@1 withheld:
    // the handler runs, reads the mine correctly, and finds the ledger closed.
    // The receipt must be refused, not returned — a receipt the ledger does not
    // hold is a claim, not evidence.
    const { host } = await bootCaptureWithout("port:vault.append@1");
    try {
      await consent(host);
      const mine = makeMine("ledger-refused", { "a.txt": "a\n" });
      const pin = pinFor(mine, "ledger");
      const r = await callOn(host, OP, { mineRoot: mine, mineId: pin });
      expect(r.ok).toBe(true); // the handler ran and returned its refusal envelope
      const v = r.ok ? (r.value as { refused?: boolean; rule?: string; detail?: string }) : null;
      expect(v?.refused).toBe(true);
      expect(v?.rule).toBe("CAPTURE_LEDGER_REFUSED");
      expect(v?.detail).toContain("unledgered");
      // nothing was written into the ledger for that pin
      const row = await callOn(host, "vault.get@1", { ns: "proposal", id: `mine:ledger/${pin.replace("ledger@", "")}` });
      expect(row.ok).toBe(false);
    } finally {
      await host.shutdown().catch(() => {});
    }
  }, 120_000);

  test("and the read-back is not a rubber stamp: the shipped boot DOES land the row", async () => {
    const receipt = await capture({ mineRoot: MINE_ROOT, mineId: pinnedMineId() });
    const id = `mine:pantrylog/${receipt.rootHash.replace(/^sha256:/, "")}`;
    const landed = await callOn(current().host, "vault.get@1", { ns: "proposal", id });
    expect(landed.ok).toBe(true);
    const missing = await callOn(current().host, "vault.get@1", { ns: "proposal", id: `${id}-never-written` });
    expect(missing.ok).toBe(false);
  }, 60_000);
});

describe("refusals carry the op, the rule, and a detail — never a bare error", () => {
  test("every refusal is ok:true carrying {refused, error, op, rule, detail}", async () => {
    const r = await callRefusal({ mineRoot: MINE_ROOT, mineId: "not-a-pin" });
    expect(Object.keys(r).sort()).toEqual(["detail", "error", "op", "refused", "rule"]);
    expect(r.error).toBe("REFUSED");
    expect(r.op).toBe(OP);
    expect(r.detail.length).toBeGreaterThan(10);
  });
});

describe("the receipt's refusals[] are EXCLUSIONS, and they carry their reason", () => {
  test("a dependency tree is excluded with a named reason while the receipt stays valid", async () => {
    const mine = makeMine("exclusions", {
      "MANIFEST.json": '{"note":"the mine inventories itself; capture excludes it by declared policy"}\n',
      "src/main.ts": "export const a = 1;\n",
    });
    mkdirSync(join(mine, "node_modules", "dep"), { recursive: true });
    writeFileSync(join(mine, "node_modules", "dep", "index.js"), "module.exports = 1;\n");
    mkdirSync(join(mine, ".git"), { recursive: true });
    writeFileSync(join(mine, ".git", "HEAD"), "ref: refs/heads/main\n");
    const r = await call({ mineRoot: mine, mineId: pinFor(mine, "excl") });
    expect(r.ok).toBe(true);
    const receipt = CaptureReceiptSchema.parse(r.ok ? r.value : null);
    expect(receipt.fileCount).toBe(1);
    expect(receipt.files.map((f) => f.path)).toEqual(["src/main.ts"]);
    expect(receipt.refusals).toEqual([
      { path: ".git", reason: "VCS metadata outside the declared mine bytes" },
      { path: "MANIFEST.json", reason: expect.stringContaining("self-referential") },
      { path: "node_modules", reason: "dependency tree outside the declared mine" },
    ]);
    for (const f of receipt.files) expect(relative(mine, join(mine, f.path)).startsWith("..")).toBe(false);
  }, 30_000);
});
