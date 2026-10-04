// D-456 falsifiers — the Chrome-only removal sweep, mechanically checked.
// F-CHROME-ONLY (the concept is gone from the plan): no planning doc still names an
// Ollama provider path or teaches Ollama-first sequencing outside a cited
// history marker, and every doc in the sweep inventory carries the D-456
// pointer. Deliberately untouched and NOT asserted here: RATIFIED records,
// round/audit logs, history rows, provider.llm code and the D-420-fenced
// proving compositions (see D-456 Consequences for the full inventory).
import { describe, test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dir, "../../..");
const VISION = join(ROOT, "docs/forge/OMEGA-ENDSTATE-VISION.md");
const WAVEMAP = join(ROOT, "docs/migration/00-ASSESSMENT/04-WAVE-MAP.md");
const STRATEGY = join(ROOT, "docs/migration/STRATEGY-OMEGA-PLUGIN-REBUILD.md");
const TRIAGE = join(ROOT, "docs/migration/30-TRIAGE/TRIAGE-LEDGER.md");
const GAP = join(ROOT, "docs/migration/00-ASSESSMENT/05-GAP-REGISTRY.md");
const ROADMAP = join(ROOT, "docs/ROADMAP.md");
const WAVE2 = join(ROOT, "docs/migration/20-WAVES/WAVE2-PROVIDER-STRATUM.md");
const INVARIANTS = join(ROOT, "docs/decisions/CURRENT-INVARIANTS.md");
const CONSOLIDATION = join(
  ROOT,
  "docs/forge/annex/OMEGA-CONSOLIDATION-INTEGRATION.md",
);

const read = (p: string): string => readFileSync(p, "utf-8");
const lines = (text: string): string[] => text.split("\n");

/** The sequencing claims D-456 kills — none may survive unmarkered. */
const SEQUENCING_CLAIM_RE =
  /Ollama pilots the spine|Ollama first|Ollama over ChatGPT|ollama pilot-first|the named pilot/i;
/** The markers that make a surviving historical mention lawful. */
const MARKERED_RE = /D-418|D-456|post-v1|historical record|superseded/i;

describe("D-456 · F-CHROME-ONLY.1 — the vision doc no longer pictures an Ollama path", () => {
  const text = read(VISION);

  test("§3 end-state list names no Ollama entry and carries the D-456 marker", () => {
    const mirror = lines(text).find((l) =>
      l.includes("The mirror in the user's hands"),
    );
    expect(mirror).toBeDefined();
    expect(mirror!.toLowerCase()).not.toContain("ollama");
    expect(mirror).toContain("D-456");
  });

  test("no Ollama-first sequencing claim survives unmarkered in the vision doc", () => {
    const bad = lines(text).filter(
      (l) => SEQUENCING_CLAIM_RE.test(l) && !MARKERED_RE.test(l),
    );
    expect(
      bad,
      `unmarkered sequencing claims survive in the vision doc:\n${bad.join("\n")}`,
    ).toEqual([]);
  });
});

describe("D-456 · F-CHROME-ONLY.2 — the wave map teaches Chrome-first", () => {
  const text = read(WAVEMAP);

  test("W2 objective names Chrome master/slave and no Ollama pilot", () => {
    const w2 = lines(text).find((l) => l.includes("every legacy provider"));
    expect(w2).toBeDefined();
    expect(w2).toContain("Chrome master/slave");
    expect(w2!.toLowerCase()).not.toContain("ollama");
    expect(w2).toContain("D-456");
  });

  test("no Ollama-first sequencing claim survives unmarkered in the wave map", () => {
    const bad = lines(text).filter(
      (l) => SEQUENCING_CLAIM_RE.test(l) && !MARKERED_RE.test(l),
    );
    expect(
      bad,
      `unmarkered sequencing claims survive in the wave map:\n${bad.join("\n")}`,
    ).toEqual([]);
  });
});

describe("D-456 · F-CHROME-ONLY.3 — the strategy strata and triage rows go browser-first", () => {
  test("strategy §3 pilot clause is voided with a D-456 marker", () => {
    const text = read(STRATEGY);
    const w2 = lines(text).find((l) => l.includes("W2  PROVIDERS"));
    expect(w2).toBeDefined();
    expect(w2).toContain("D-456");
    const bad = lines(text).filter(
      (l) => SEQUENCING_CLAIM_RE.test(l) && !MARKERED_RE.test(l),
    );
    expect(
      bad,
      `unmarkered sequencing claims survive in the strategy doc:\n${bad.join("\n")}`,
    ).toEqual([]);
  });

  test("triage ledger names no Ollama pilot and carries D-456", () => {
    const text = read(TRIAGE);
    const bad = lines(text).filter((l) => /ollama/i.test(l));
    expect(bad, `ollama mentions survive in the triage ledger:\n${bad.join("\n")}`).toEqual(
      [],
    );
    expect(text).toContain("D-456");
  });

  test("gap registry triage carry names no Ollama pilot and carries D-456", () => {
    const text = read(GAP);
    const bad = lines(text).filter((l) => /ollama/i.test(l));
    expect(bad, `ollama mentions survive in the gap registry:\n${bad.join("\n")}`).toEqual(
      [],
    );
    expect(text).toContain("D-456");
  });
});

describe("D-456 · F-CHROME-ONLY.4 — the extended banners point at this record", () => {
  test("roadmap and wave-2 banners name D-456 with no live pilot teaching", () => {
    for (const p of [ROADMAP, WAVE2]) {
      const text = read(p);
      expect(text).toContain("D-456");
      const bad = lines(text).filter(
        (l) => SEQUENCING_CLAIM_RE.test(l) && !MARKERED_RE.test(l),
      );
      expect(bad, `unmarkered sequencing claims survive in ${p}:\n${bad.join("\n")}`).toEqual(
        [],
      );
    }
  });

  test("invariants v1 bullet and consolidation §4.10 carry the D-456 pointer", () => {
    expect(read(INVARIANTS)).toContain("D-456");
    expect(read(CONSOLIDATION)).toContain("D-456");
  });
});
