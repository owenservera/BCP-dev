// tooling/gates/test/f-disclosure.test.ts — the F-DISCLOSURE falsifier (D-448, Ω-9).
// Generated as a RED stub by `omega:loop --stub D-448`, then implemented.
//  F-DISCLOSURE.1 two-eyes — the same vault rows projected for owner (raw), deputy (body, scope-cited), stranger (summary) → three views, each citing its scope row and evidence digest; none fabricates
//  F-DISCLOSURE.2 gated-widening — the deputy widens without consent → DISCLOSURE_WIDENING_UNCITED naming the consent id; with consent → the wider view serves and the receipt row reads back through the audit path
//  F-DISCLOSURE.3 determinism — the same (requester, target, width, vault state) twice → byte-identical views
//  F-DISCLOSURE.4 elision-honesty — elided fields appear as {count, kinds}; raw minus the view equals exactly the elided set — mechanically diffable
//  F-DISCLOSURE.5 fail-closed — delete the scope row → the stranger's next width-demanding view refuses DISCLOSURE_SCOPE_UNKNOWN and the default view falls to summary, never to full width
//  F-DISCLOSURE.6 headless — 1–5 daemon-only, zero pixels; the view renders as text
//  F-DISCLOSURE.7 loud-failure — zero silent-fallback paths — every branch resolves, refuses with a sentence, or rolls back with DISCLOSURE_RECEIPT_UNWRITTEN
import { describe, test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  ApertureRegistry, consentRefFor, droppedPairs, projectAt, renderAperture, scopeRowId, setScope,
  DISCLOSURE_WIDTH_INVALID, DISCLOSURE_SCOPE_CONFLICT, DISCLOSURE_WIDENING_UNCITED, DISCLOSURE_SCOPE_UNKNOWN,
  DISCLOSURE_TARGET_UNRESOLVED, DISCLOSURE_SCOPE_FOREIGN_WRITER, DISCLOSURE_VIEW_NONDETERMINISTIC, DISCLOSURE_RECEIPT_UNWRITTEN,
  type EvidenceRow,
} from "../../../plugins/vivim-run/src/aperture.ts";

const TARGET = "ns:chat";

/** Two rows × four fields across the lattice: subject (summary), preview
 *  (body), headers/audit.trail (detail), raw.mime (raw). */
const evidence: EvidenceRow[] = [
  { id: "msg_1", ns: "chat", fields: [
    { name: "subject", width: "summary", value: "Quarterly review" },
    { name: "preview", width: "body", value: "The numbers are in…" },
    { name: "headers", width: "detail", value: "Message-Id: <m1@x>" },
    { name: "raw.mime", width: "raw", value: "RAW MIME BYTES 1" },
  ] },
  { id: "msg_2", ns: "chat", fields: [
    { name: "subject", width: "summary", value: "Re: Quarterly review" },
    { name: "preview", width: "body", value: "Thanks —" },
    { name: "audit.trail", width: "detail", value: "delivered 09:14" },
    { name: "raw.mime", width: "raw", value: "RAW MIME BYTES 2" },
  ] },
];

function seededRegistry(): ApertureRegistry {
  const reg = new ApertureRegistry();
  reg.putEvidence(TARGET, evidence);
  expect(reg.setScope({ target: TARGET, principal: "user:alice", width: "raw", setBy: "user:alice", at: 1 }).ok).toBe(true);
  expect(reg.setScope({ target: TARGET, principal: "agent:bea", width: "body", setBy: "user:alice", at: 1 }).ok).toBe(true);
  expect(reg.setScope({ target: TARGET, principal: "user:carol", width: "summary", setBy: "user:alice", at: 1 }).ok).toBe(true);
  return reg;
}

describe("F-DISCLOSURE.1 (two-eyes)", () => {
  test("the same vault rows project three honest views — owner raw, deputy body, stranger summary — each scope-cited and digested; none fabricates", () => {
    const reg = seededRegistry();
    const owner = reg.view(TARGET, "user:alice");
    const deputy = reg.view(TARGET, "agent:bea");
    const stranger = reg.view(TARGET, "user:carol");
    expect(owner.ok && deputy.ok && stranger.ok).toBe(true);
    if (!owner.ok || !deputy.ok || !stranger.ok) throw new Error("views refused");
    // three different honest views of one row set
    const digests = new Set([owner.projection.evidenceDigest, deputy.projection.evidenceDigest, stranger.projection.evidenceDigest]);
    expect(digests.size).toBe(3);
    // each cites its scope row
    expect(owner.projection.scopeRef).toBe(scopeRowId(TARGET, "user:alice"));
    expect(deputy.projection.scopeRef).toBe(scopeRowId(TARGET, "agent:bea"));
    expect(stranger.projection.scopeRef).toBe(scopeRowId(TARGET, "user:carol"));
    // the widths obey the lattice
    expect(owner.projection.width).toBe("raw");
    expect(deputy.projection.width).toBe("body");
    expect(stranger.projection.width).toBe("summary");
    // none fabricates: every served field exists in the evidence with the same value
    for (const p of [owner.projection, deputy.projection, stranger.projection]) {
      for (const row of p.rows) {
        const src = evidence.find((e) => e.id === row.id)!;
        for (const f of row.fields) {
          const orig = src.fields.find((x) => x.name === f.name)!;
          expect(orig).toBeDefined();
          expect(f.value).toBe(orig.value);
        }
      }
    }
    // the eyes see differently: raw.mime only for the owner, preview for owner+deputy
    const names = (p: typeof owner.projection) => p.rows.flatMap((r) => r.fields.map((f) => f.name));
    expect(names(owner.projection)).toContain("raw.mime");
    expect(names(deputy.projection)).not.toContain("raw.mime");
    expect(names(deputy.projection)).toContain("preview");
    expect(names(stranger.projection)).toEqual(["subject", "subject"]);
  });
});

describe("F-DISCLOSURE.2 (gated-widening)", () => {
  test("widening without a cited ceremony refuses naming the consent id; with consent the wider view serves and the receipt reads back; a failed receipt persists rolls the widening back", () => {
    const reg = seededRegistry();
    // the deputy asks nicely for detail → refused, the consent id named
    const asked = reg.view(TARGET, "agent:bea", "detail");
    expect(asked.ok).toBe(false);
    if (!asked.ok) {
      expect(asked.code).toBe(DISCLOSURE_WIDENING_UNCITED);
      expect(asked.sentence).toContain(consentRefFor(TARGET, "agent:bea"));
    }
    // the ceremony without consent → refused
    const uncited = reg.widen({ target: TARGET, requester: "agent:bea", width: "detail", consentRef: "", by: "user:alice", at: 2 });
    expect(uncited.ok).toBe(false);
    if (!uncited.ok) expect(uncited.code).toBe(DISCLOSURE_WIDENING_UNCITED);
    // the receipt fails to persist → the widening rolls back loudly, nothing widened
    const unwritten = reg.widen({ target: TARGET, requester: "agent:bea", width: "detail", consentRef: consentRefFor(TARGET, "agent:bea"), by: "user:alice", at: 2, persistReceipt: () => false });
    expect(unwritten.ok).toBe(false);
    if (!unwritten.ok) expect(unwritten.code).toBe(DISCLOSURE_RECEIPT_UNWRITTEN);
    expect(reg.view(TARGET, "agent:bea", "detail").ok).toBe(false); // rolled back — still body
    // a foreign ceremony-runner → the anti-forgery
    const foreign = reg.widen({ target: TARGET, requester: "agent:bea", width: "detail", consentRef: consentRefFor(TARGET, "agent:bea"), by: "user:mallory", at: 2 });
    expect(foreign.ok).toBe(false);
    if (!foreign.ok) expect(foreign.code).toBe(DISCLOSURE_SCOPE_FOREIGN_WRITER);
    // with consent → wider view serves, receipt row lands, the audit path reads it back
    const widened = reg.widen({ target: TARGET, requester: "agent:bea", width: "detail", consentRef: consentRefFor(TARGET, "agent:bea"), by: "user:alice", at: 3 });
    expect(widened.ok).toBe(true);
    if (widened.ok) {
      expect(widened.widened).toBe(true);
      expect(widened.receipt?.consentRef).toBe(consentRefFor(TARGET, "agent:bea"));
    }
    const served = reg.view(TARGET, "agent:bea", "detail");
    expect(served.ok).toBe(true);
    const audit = reg.read();
    expect(audit.receipts.length).toBe(1);
    expect(audit.rendered).toContain("agent:bea widened to detail");
    expect(audit.rendered).toContain(consentRefFor(TARGET, "agent:bea"));
  });
});

describe("F-DISCLOSURE.3 (determinism)", () => {
  test("the same (requester, target, width, vault state) twice → byte-identical views, whatever the row order", () => {
    const reg = seededRegistry();
    let a = "x";
    for (let i = 0; i < 100; i++) {
      // deterministic source: rotate/reflect the evidence order, same multiset of rows
      const rotated = i % 2 === 0 ? [...evidence] : [evidence[1]!, evidence[0]!];
      const alt = new ApertureRegistry();
      alt.putEvidence(TARGET, rotated);
      alt.setScope({ target: TARGET, principal: "agent:bea", width: "body", setBy: "user:alice", at: 1 });
      const v = alt.view(TARGET, "agent:bea");
      expect(v.ok).toBe(true);
      if (!v.ok) throw new Error(v.sentence);
      if (a === "x") a = v.projection.evidenceDigest;
      expect(v.projection.evidenceDigest).toBe(a);
    }
    // the pure fold agrees with itself, and the registry's double-compute guard stands behind it
    const p1 = projectAt({ target: TARGET, requester: "agent:bea", width: "body", scopeRef: "s" }, evidence);
    const p2 = projectAt({ target: TARGET, requester: "agent:bea", width: "body", scopeRef: "s" }, [evidence[1]!, evidence[0]!]);
    expect(JSON.stringify(p1)).toBe(JSON.stringify(p2));
    const twice = reg.view(TARGET, "agent:bea");
    expect(twice.ok).toBe(true); // the registry re-derives and would refuse DISCLOSURE_VIEW_NONDETERMINISTIC on divergence
  });
});

describe("F-DISCLOSURE.4 (elision-honesty)", () => {
  test("elided fields appear as {count, kinds}; raw minus the view equals exactly the elided set — mechanically diffable", () => {
    const reg = seededRegistry();
    const raw = reg.view(TARGET, "user:alice");
    const body = reg.view(TARGET, "agent:bea");
    expect(raw.ok && body.ok).toBe(true);
    if (!raw.ok || !body.ok) throw new Error("views refused");
    // the fold's own account: 4 fields dropped (headers, raw.mime ×2, audit.trail), 3 kinds named
    expect(body.projection.elided.count).toBe(4);
    expect(body.projection.elided.kinds).toEqual(["audit.trail", "headers", "raw.mime"]);
    // the mechanical diff: raw's kept pairs minus the body view's kept pairs
    const dropped = droppedPairs(raw.projection, body.projection);
    const rawPairs = raw.projection.rows.flatMap((r) => r.fields.map((f) => `${r.id}:${f.name}`)).sort();
    const bodyPairs = body.projection.rows.flatMap((r) => r.fields.map((f) => `${r.id}:${f.name}`));
    expect(dropped).toEqual(rawPairs.filter((pair) => !bodyPairs.includes(pair)));
    expect(dropped.length).toBe(body.projection.elided.count);
    expect([...new Set(dropped.map((d) => d.split(":").slice(1).join(":")))].sort()).toEqual(body.projection.elided.kinds);
    // raw itself elides nothing — the ceiling of the lattice
    expect(raw.projection.elided).toEqual({ count: 0, kinds: [] });
  });
});

describe("F-DISCLOSURE.5 (fail-closed)", () => {
  test("no scope → the default view fails closed to summary and an explicit width refuses DISCLOSURE_SCOPE_UNKNOWN; a deleted scope never falls back to full width", () => {
    // the scope-less stranger: default posture is the summary-of-existence, never full width
    const bare = new ApertureRegistry();
    bare.putEvidence(TARGET, evidence);
    const stranger = bare.view(TARGET, "user:nobody");
    expect(stranger.ok).toBe(true);
    if (stranger.ok) {
      expect(stranger.projection.width).toBe("summary");
      expect(stranger.projection.scopeRef).toBe("aperture:fail-closed");
      expect(stranger.projection.sentence).toContain(DISCLOSURE_SCOPE_UNKNOWN);
      expect(stranger.projection.rows.flatMap((r) => r.fields.map((f) => f.name))).toEqual(["subject", "subject"]); // never full width
    }
    // the scope-less stranger demanding a width → the named refusal
    const demand = bare.view(TARGET, "user:nobody", "body");
    expect(demand.ok).toBe(false);
    if (!demand.ok) expect(demand.code).toBe(DISCLOSURE_SCOPE_UNKNOWN);
    // with the scope row present the deputy's width serves; delete it (the
    // row is absent) → the next width-demanding view refuses, never widens
    const withScope = new ApertureRegistry();
    withScope.putEvidence(TARGET, evidence);
    withScope.setScope({ target: TARGET, principal: "agent:bea", width: "body", setBy: "user:alice", at: 1 });
    expect(withScope.view(TARGET, "agent:bea", "body").ok).toBe(true);
    const scopeDeleted = new ApertureRegistry(); // same evidence, the scope row deleted
    scopeDeleted.putEvidence(TARGET, evidence);
    const gone = scopeDeleted.view(TARGET, "agent:bea", "body");
    expect(gone.ok).toBe(false);
    if (!gone.ok) expect(gone.code).toBe(DISCLOSURE_SCOPE_UNKNOWN);
    const fallback = scopeDeleted.view(TARGET, "agent:bea"); // and the default still never falls to full width
    expect(fallback.ok).toBe(true);
    if (fallback.ok) expect(fallback.projection.width).toBe("summary");
  });
});

describe("F-DISCLOSURE.6 (headless)", () => {
  test("the ceremony is daemon/CLI-only; the view is data and the audit renders as text", () => {
    const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-run", "src", "aperture.ts"), "utf-8");
    expect(/from\s+"@vivim\/(omega-)?(surfaces\/|canvas|web|daemon-client)/.test(src)).toBe(false);
    expect(/\b(document|window|navigator)\s*\./.test(src)).toBe(false);
    const reg = seededRegistry();
    const text = renderAperture(reg.scopeList(), reg.receiptsOf());
    expect(text).toContain("aperture.read — 3 scope(s), 0 receipt(s)");
    expect(text).toContain(`${TARGET} / agent:bea → body`);
    const view = reg.view(TARGET, "agent:bea");
    expect(view.ok).toBe(true);
    if (view.ok) expect(JSON.stringify(view.projection.rows).length).toBeGreaterThan(0); // the view is rows, renderable by anything
  });
});

describe("F-DISCLOSURE.7 (loud-failure)", () => {
  test("every branch resolves, refuses with a sentence, or rolls back — all codes present, nothing silent", () => {
    const src = readFileSync(join(import.meta.dir, "..", "..", "..", "plugins", "vivim-run", "src", "aperture.ts"), "utf-8");
    for (const code of [DISCLOSURE_WIDTH_INVALID, DISCLOSURE_SCOPE_CONFLICT, DISCLOSURE_WIDENING_UNCITED, DISCLOSURE_SCOPE_UNKNOWN, DISCLOSURE_TARGET_UNRESOLVED, DISCLOSURE_SCOPE_FOREIGN_WRITER, DISCLOSURE_VIEW_NONDETERMINISTIC, DISCLOSURE_RECEIPT_UNWRITTEN]) {
      expect(src.includes(code)).toBe(true);
    }
    expect(/catch\s*(\([^)]*\))?\s*\{\s*\}/.test(src)).toBe(false); // no silent swallows
    // the door refuses, named: bad width, empty target, conflicting amendment, foreign writer
    const reg = seededRegistry();
    const badWidth = reg.setScope({ target: TARGET, principal: "user:dave", width: "everything" as never, setBy: "user:alice", at: 2 });
    expect(badWidth.ok).toBe(false);
    if (!badWidth.ok) { expect(badWidth.code).toBe(DISCLOSURE_WIDTH_INVALID); expect(badWidth.sentence).toContain(DISCLOSURE_WIDTH_INVALID); }
    const noTarget = reg.setScope({ target: "", principal: "user:dave", width: "body", setBy: "user:alice", at: 2 });
    expect(noTarget.ok).toBe(false);
    if (!noTarget.ok) { expect(noTarget.code).toBe(DISCLOSURE_TARGET_UNRESOLVED); expect(noTarget.sentence).toContain(DISCLOSURE_TARGET_UNRESOLVED); }
    const conflict = reg.setScope({ target: TARGET, principal: "agent:bea", width: "detail", setBy: "user:alice", at: 2 }); // no supersedes citation
    expect(conflict.ok).toBe(false);
    if (!conflict.ok) { expect(conflict.code).toBe(DISCLOSURE_SCOPE_CONFLICT); expect(conflict.sentence).toContain(DISCLOSURE_SCOPE_CONFLICT); }
    const foreign = reg.setScope({ target: TARGET, principal: "user:dave", width: "body", setBy: "user:mallory", at: 2 }); // mallory does not own the target
    expect(foreign.ok).toBe(false);
    if (!foreign.ok) { expect(foreign.code).toBe(DISCLOSURE_SCOPE_FOREIGN_WRITER); expect(foreign.sentence).toContain(DISCLOSURE_SCOPE_FOREIGN_WRITER); }
    // the pure door agrees (the module is usable without the registry)
    const pure = setScope({ target: TARGET, principal: "p", width: "summary", setBy: "s", at: 0 }, null, null);
    expect(pure.ok).toBe(true);
    // the empty registry degrades honestly
    const empty = new ApertureRegistry().read();
    expect(empty.rendered).toContain("0 scope(s), 0 receipt(s)");
  });
});
