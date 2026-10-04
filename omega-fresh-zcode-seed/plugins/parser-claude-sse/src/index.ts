// parser.claude.sse.v1 — entry (parser-kind only: no routable ops).
// The conformance runner requires a `def` export; the TEST contribution
// (test/conformance.fixture.ts) exercises the transform directly.
import { definePlugin } from "@vivim/omega-shim";

export const def = definePlugin({ ops: {} });
