// Frontend logic unit tests — pure modules, no DOM (node:test).

import test from "node:test";
import assert from "node:assert/strict";
import {
  basename, dirname, join, extOf, historyPush, historyBack, historyForward,
  applyFilter, fmtSize, fmtClock, clampToViewport, cascadePos, parseOcLine,
  isHostPath, parseHostPath, formatHostPath,
} from "../ui/js/lib/path-util.js";

// ---- path utils ----

test("path: basename/dirname/join", () => {
  assert.equal(basename("a/b/c.txt"), "c.txt");
  assert.equal(basename(""), "");
  assert.equal(dirname("a/b/c.txt"), "a/b");
  assert.equal(dirname("c.txt"), "");
  assert.equal(join("a", "b", "c.txt"), "a/b/c.txt");
  assert.equal(join("a", "", ".", "b"), "a/b");
});

test("path: extOf", () => {
  assert.equal(extOf("a.TXT"), "txt");
  assert.equal(extOf("archive.tar.gz"), "gz");
  assert.equal(extOf("noext"), "");
  assert.equal(extOf(".gitignore"), "");
});

// ---- host path scheme (Phase 2 / G4) ----

test("host paths: isHostPath discriminates scheme", () => {
  assert.equal(isHostPath("host://home/docs/a.txt"), true);
  assert.equal(isHostPath("host://home"), true);
  assert.equal(isHostPath("docs/a.txt"), false);
  assert.equal(isHostPath(""), false);
  assert.equal(isHostPath(null), false);
});

test("host paths: parseHostPath extracts root and rel", () => {
  assert.deepEqual(parseHostPath("host://home/docs/a.txt"), { root: "home", rel: "docs/a.txt" });
  assert.deepEqual(parseHostPath("host://home"), { root: "home", rel: "" });
  assert.deepEqual(parseHostPath("host://home/"), { root: "home", rel: "" });
  assert.equal(parseHostPath("workspace/x"), null);
});

test("host paths: formatHostPath normalizes separators", () => {
  assert.equal(formatHostPath("home", "docs/a.txt"), "host://home/docs/a.txt");
  assert.equal(formatHostPath("home", ""), "host://home");
  assert.equal(formatHostPath("home", "/docs//"), "host://home/docs");
  // roundtrip
  const p = formatHostPath("home", "docs/a.txt");
  assert.deepEqual(parseHostPath(p), { root: "home", rel: "docs/a.txt" });
});

// ---- explorer history reducer (G1.3) ----

test("explorer: back/forward navigation history", () => {
  let s = { history: [""], hIdx: 0, cwd: "" };
  s = historyPush(s, "docs");
  s = historyPush(s, "docs/work");
  assert.equal(s.cwd, "docs/work");
  assert.equal(s.hIdx, 2);
  s = historyBack(s);
  assert.equal(s.cwd, "docs");
  s = historyBack(s);
  assert.equal(s.cwd, "");
  assert.equal(historyBack(s), s); // stuck at root
  s = historyForward(s);
  assert.equal(s.cwd, "docs");
  // pushing after going back truncates the forward branch:
  // ["", "docs", "docs/work"] -> back -> push -> ["", "docs", "pictures"]
  s = historyPush(s, "pictures");
  assert.equal(s.history.length, 3);
  assert.deepEqual(s.history, ["", "docs", "pictures"]);
  assert.equal(historyForward(s), s);
});

// ---- search filter (G1.7) ----

test("explorer: filter narrows results", () => {
  const entries = [
    { name: "Report.txt" }, { name: "notes.md" }, { name: "REPORT-final.txt" },
  ];
  assert.equal(applyFilter(entries, "report").length, 2);
  assert.equal(applyFilter(entries, "").length, 3);
  assert.equal(applyFilter(entries, "  ").length, 3);
  assert.equal(applyFilter(entries, "zzz").length, 0);
});

// ---- formatting ----

test("fmt: sizes and clock", () => {
  assert.equal(fmtSize(0), "");
  assert.equal(fmtSize(512), "512 B");
  assert.equal(fmtSize(2048), "2 KB");
  assert.equal(fmtSize(1536), "1.5 KB");
  const f = fmtClock(new Date(2026, 8, 28, 9, 5));
  assert.equal(f.time, "09:05");
  assert.equal(f.date, "2026/09/28");
});

// ---- window manager geometry (G1.8) ----

test("wm: clampToViewport keeps windows reachable", () => {
  // fully dragged off to the top-left: 60px of width / 40px of height stay visible
  const c = clampToViewport(-500, -500, 400, 300, 1280, 800);
  assert.equal(c.x, -340); // -340 + 400 = 60px visible
  assert.equal(c.y, -260); // -260 + 300 = 40px visible
  const c2 = clampToViewport(2000, 2000, 400, 300, 1280, 800);
  assert.ok(c2.x <= 1280 - 60);
  assert.ok(c2.y + 40 <= 800);
  const c3 = clampToViewport(10, 10, 5000, 5000, 1280, 800);
  assert.equal(c3.w, 1280);
  assert.equal(c3.h, 800);
});

test("wm: cascadePos staggers and stays inside", () => {
  const seen = new Set();
  for (let n = 0; n < 12; n += 1) {
    const p = cascadePos(n, 800, 500, 1280, 800);
    assert.ok(p.x >= 0 && p.x + 800 <= 1280);
    assert.ok(p.y >= 0 && p.y + 500 <= 800 - 40);
    seen.add(`${p.x},${p.y}`);
  }
  assert.ok(seen.size >= 2, "cascade should vary");
});

// ---- chat stream parser (G2.3) — JS mirror of the Rust parser ----

test("ocparse: message.part.updated deltas", () => {
  assert.deepEqual(
    parseOcLine('{"type":"message.part.updated","part":{"type":"text","text":"Hel"}}'),
    [{ t: "delta", text: "Hel" }],
  );
});

test("ocparse: plain delta + session + done", () => {
  assert.deepEqual(parseOcLine('{"type":"message.delta","delta":"lo"}'), [{ t: "delta", text: "lo" }]);
  assert.deepEqual(parseOcLine('{"type":"message.updated","info":{"sessionID":"ses_1"}}'), [{ t: "session", id: "ses_1" }]);
  assert.deepEqual(parseOcLine('{"type":"session.idle"}'), [{ t: "done" }]);
});

test("ocparse: errors surface a message", () => {
  assert.deepEqual(parseOcLine('{"type":"session.error","error":{"message":"Unauthorized"}}'),
    [{ t: "error", message: "Unauthorized" }]);
  assert.deepEqual(parseOcLine('{"type":"x","error":"quota"}'),
    [{ t: "error", message: "quota" }]);
});

test("ocparse: garbage is ignored", () => {
  assert.deepEqual(parseOcLine(""), []);
  assert.deepEqual(parseOcLine("not json"), []);
  assert.deepEqual(parseOcLine("[1,2,3]"), []);
});

// ---- acceptance checklist embedded (gate scoreboard sanity) ----

test("gates: stream events fold into a reply", () => {
  const lines = [
    '{"type":"message.updated","info":{"sessionID":"ses_abc"}}',
    '{"type":"message.part.updated","part":{"type":"text","text":"MOCK-"}}',
    '{"type":"message.part.updated","part":{"type":"text","text":"REPLY: hi"}}',
    '{"type":"session.idle"}',
  ];
  const events = lines.flatMap((l) => parseOcLine(l));
  const text = events.filter((e) => e.t === "delta").map((e) => e.text).join("");
  assert.equal(text, "MOCK-REPLY: hi");
  assert.equal(events.find((e) => e.t === "session")?.id, "ses_abc");
  assert.ok(events.some((e) => e.t === "done"));
});
