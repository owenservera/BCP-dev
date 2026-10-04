// forge.survey — test/boot.ts (shared boot + the two-class ceremony)
// Real boots of compositions/forge-survey.json — law + vault + the capture seam
// (EXTERNAL_MUTATION, the ONE filesystem seam) + forge.survey (READ). Both are
// needed: survey reads the snapshot AS STORED, so an end-to-end proof needs the
// capture to have written the receipt AND its CAS blobs into this very ledger.
// A survey suite that could only see a hand-written row would be testing a
// fixture, not the seam the ops are built on.
//
// The ceremony is asymmetric on purpose, and that asymmetry IS the class split:
//   forge.mine.capture@1 is EXTERNAL_MUTATION → LAW_POLICY_V1's class default is
//   require-consent → the host gates it BEFORE the handler runs, and the
//   ceremony is TWO grants for TWO principals (the caller's, to pass the gate,
//   and the capture plugin's own, because the read is the plugin's act).
//   forge.survey.run/render@1 are READ → allow/unjournaled → never gated. The
//   refusal suite calls them on a FRESH boot, before any grant, and that is the
//   proof the READ half really is ungated.
import { mkdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { compileComposition, ensureVault, bootComposition } from "../../../host/src/index.ts";
import type { BootedHost } from "../../../host/src/index.ts";
import type { CompositionSpec, PortResult } from "@vivim/omega-contracts";
import { consentIdFor } from "@vivim/omega-contracts";
import { omegaTmp } from "@vivim/omega-platform";
import { CaptureReceiptSchema, InventoryRowSchema } from "../../../packs/builder/src/schemas.ts";
import type { CaptureReceipt } from "../../forge-mine-capture/src/receipt.ts";
import { FORGE_MINE_CAPTURE_OP } from "../../forge-mine-capture/src/receipt.ts";
import { FORGE_SURVEY_RENDER_OP, FORGE_SURVEY_RUN_OP } from "../src/inventory.ts";
import type { InventoryRow, SurveyAtlas, SurveyInventory } from "../src/inventory.ts";

export const OMEGA_ROOT = join(import.meta.dir, "../../..");
export const COMP_SPEC_PATH = join(OMEGA_ROOT, "compositions/forge-survey.json");
export const MINE_ROOT = join(OMEGA_ROOT, "fixtures/mines/synthetic-v0");
export const MINE_MANIFEST_PATH = join(MINE_ROOT, "MANIFEST.json");
export const RECEIPT_NS = "proposal";
const ABSENT_ROOT = join(OMEGA_ROOT, "fixtures/mines/__no-such-mine__");
const PROBE_MINE_ID = "consent-probe@0000000";
const PROBE_PAYLOAD = { mineRoot: ABSENT_ROOT, mineId: PROBE_MINE_ID };
const CAPTURE_PLUGIN_ID = "forge.mine.capture";

/** The per-call deadline this suite gives `forge.mine.capture@1`.
 *
 *  NOT the manifest's `runtime.budget.cpuMs` — nothing in host/src reads that
 *  field (only `maxConcurrentCalls` is enforced, host/src/ports.ts:315); the
 *  bound that actually fires is the CALLER's `deadlineMs`, default 5000
 *  (host/src/ports.ts:438). That default is too tight now that a capture also
 *  materialises its CAS blobs: the pinned 42-file mine issues 41 blob appends
 *  plus the receipt append, every one a two-phase fsyncing vault write
 *  (~120 fsyncs on Windows). Measured ~1.2 s on a fresh vault, over 5 s on one
 *  that has already absorbed several captures. The survey ops themselves are
 *  reads and keep the router default. */
export const CAPTURE_DEADLINE_MS = 60_000;

export interface MineManifest {
  description: string;
  fileCount: number;
  files: Array<{ path: string; sha256: string }>;
  mineId: string;
  rootHash: string;
}

export function readMineManifest(): MineManifest {
  return JSON.parse(readFileSync(MINE_MANIFEST_PATH, "utf-8")) as MineManifest;
}

/** A scratch dir for a suite's own throwaway state (never inside the fixture). */
export function scratchDir(name: string): string {
  const dir = omegaTmp("omega-forge-survey", `${name.replace(/[^a-z0-9.-]/gi, "_")}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  return dir;
}

export interface Booted { host: BootedHost; vaultDir: string }

async function boot(spec: CompositionSpec, name: string): Promise<Booted> {
  const root = omegaTmp("omega-forge-survey", `${name.replace(/[^a-z0-9.-]/gi, "_")}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`);
  rmSync(root, { recursive: true, force: true });
  const vaultDir = join(root, "vault");
  mkdirSync(vaultDir, { recursive: true });
  // The shipped composition's vault `dataDir` is a FIXED ${TMP} path (config
  // passthrough, never authority). Two boots sharing it would open the same
  // sqlite file — every boot gets its own dataDir, or one suite's refusal case
  // would find another suite's rows.
  const vaultEntry = spec.entries.find((e) => e.id === "vivim.vault");
  if (vaultEntry) vaultEntry.config = { ...(vaultEntry.config ?? {}), dataDir: join(root, "vault-data") };
  const { rootKey } = ensureVault(vaultDir);
  const { recipe, buildDir } = compileComposition(spec, join(OMEGA_ROOT, "compositions"), vaultDir, rootKey);
  const host = await bootComposition(recipe, buildDir, vaultDir);
  return { host, vaultDir };
}

/** The shipped builder composition, verbatim from disk. */
export function shippedSpec(): CompositionSpec {
  return JSON.parse(readFileSync(COMP_SPEC_PATH, "utf-8")) as CompositionSpec;
}

/** Boot the shipped composition against a fresh vault. */
export async function bootSurvey(): Promise<Booted> {
  return boot(shippedSpec(), "shipped");
}

/** Boot the SAME composition with a capability withheld from `forge.survey` —
 *  the rig the closed-ledger refusal needs: with `port:vault.get@1` withheld the
 *  op runs, tries to read the receipt, and finds the ledger closed. */
export async function bootSurveyWithout(withheld: string): Promise<Booted> {
  const spec = shippedSpec();
  const entry = spec.entries.find((e) => e.id === "forge.survey");
  if (!entry) throw new Error(`${COMP_SPEC_PATH} has no forge.survey entry`);
  entry.grant = { ...entry.grant, capabilities: entry.grant.capabilities.filter((c) => c !== withheld) };
  return boot(spec, `without-${withheld}`);
}

let booted: Booted | null = null;

export function current(): Booted {
  if (!booted) throw new Error("bootSurvey() has not run yet (beforeAll missing)");
  return booted;
}
export function setCurrent(b: Booted): void { booted = b; }

// ---- the consent ceremony (EXTERNAL_MUTATION only — never for the READ ops) ----

/** The capture seam's two-principal consent ceremony. Returns the GATE refusal
 *  that started it, so callers can prove the class default fired before any
 *  handler code ran. */
export async function consentForCapture(host: BootedHost): Promise<PortResult> {
  const first = await host.router.callAsRoot(FORGE_MINE_CAPTURE_OP, PROBE_PAYLOAD, CAPTURE_DEADLINE_MS);
  if (first.ok) {
    const v = first.value as { rule?: string };
    if (v?.rule !== "CAPTURE_MINE_ROOT_MISSING") {
      throw new Error(`consent appeared active but the probe did not refuse structurally: ${JSON.stringify(first.value).slice(0, 300)}`);
    }
    return first;
  }
  if (first.error !== "REFUSED" || !String(first.detail ?? "").includes("consent required")) {
    throw new Error(`expected a consent-required gate refusal, got ${JSON.stringify(first)}`);
  }
  const callerConsentId = /consent required: (consent_[0-9a-f]+)/.exec(first.detail ?? "")?.[1];
  if (!callerConsentId) throw new Error(`consent refusal carried no consentId: ${first.detail ?? ""}`);
  const granted = await host.router.callAsRoot("law.consent.grant@1", { consentId: callerConsentId });
  if (!granted.ok) throw new Error(`law.consent.grant@1 failed: ${granted.error} ${granted.detail ?? ""}`);
  const pluginConsentId = consentIdFor(CAPTURE_PLUGIN_ID, FORGE_MINE_CAPTURE_OP);
  const pluginGrant = await host.router.callAsRoot("law.consent.grant@1", { consentId: pluginConsentId, principal: CAPTURE_PLUGIN_ID });
  if (!pluginGrant.ok) throw new Error(`law.consent.grant@1 (plugin principal) failed: ${pluginGrant.error} ${pluginGrant.detail ?? ""}`);
  const second = await host.router.callAsRoot(FORGE_MINE_CAPTURE_OP, PROBE_PAYLOAD, CAPTURE_DEADLINE_MS);
  const v = second.ok ? (second.value as { rule?: string }) : null;
  if (!second.ok || v?.rule !== "CAPTURE_MINE_ROOT_MISSING") {
    throw new Error(`after consent the handler should have run and refused CAPTURE_MINE_ROOT_MISSING, got ${JSON.stringify(second).slice(0, 300)}`);
  }
  return first;
}

/** The pinned mine id: the fixture's own root hash IS the pin. */
export function pinnedMineId(manifest: MineManifest = readMineManifest()): string {
  return `pantrylog@${manifest.rootHash}`;
}

// ---- calling ------------------------------------------------------------------

/** One raw call on the current boot, result untouched. */
export function call(op: string, payload: unknown): Promise<PortResult> {
  return current().host.router.callAsRoot(op, payload);
}

/** One raw call on an explicitly named host. */
export function callOn(host: BootedHost, op: string, payload: unknown): Promise<PortResult> {
  return host.router.callAsRoot(op, payload);
}

export interface Refusal { refused: true; error: "REFUSED"; op: string; rule: string; detail: string }

/** Assert the op returned a NAMED refusal (D-379 refusal-as-data: ok:true
 *  carrying the envelope). Throws when the op was gated or returned something
 *  else — a test that silently accepts "no refusal" is the vacuous-assertion
 *  failure this suite is written against. */
export async function refusalOf(op: string, payload: unknown): Promise<Refusal> {
  const r = await call(op, payload);
  if (!r.ok) throw new Error(`${op} was refused at the gate (${r.error}: ${String((r as { detail?: string }).detail ?? "")}) rather than returning a named refusal`);
  const v = r.value as { refused?: boolean; rule?: string; detail?: string; op?: string; error?: string } | null;
  if (v?.refused !== true) throw new Error(`${op} returned a non-refusal where one was expected: ${JSON.stringify(v).slice(0, 400)}`);
  return { refused: true, error: "REFUSED", op: v.op ?? op, rule: v.rule ?? "", detail: v.detail ?? "" };
}

// ---- the capture seam, driven from THIS lane's boot ---------------------------

/** Drive the capture seam for an explicit (mineRoot, mineId), validated against
 *  pack.builder's frozen CaptureReceiptSchema. This is the ONLY way a receipt
 *  gets into the ledger in these suites — the survey ops never write one. */
export async function captureMine(host: BootedHost, mineRoot: string, mineId: string): Promise<CaptureReceipt> {
  await consentForCapture(host);
  const r = await host.router.callAsRoot(FORGE_MINE_CAPTURE_OP, { mineRoot, mineId }, CAPTURE_DEADLINE_MS);
  if (!r.ok) throw new Error(`${FORGE_MINE_CAPTURE_OP} did not return: ${r.error}: ${String((r as { detail?: string }).detail ?? "")}`);
  const parsed = CaptureReceiptSchema.safeParse(r.value);
  if (!parsed.success) {
    const v = r.value as { refused?: boolean; rule?: string; detail?: string };
    const why = v?.refused === true ? `the op REFUSED with ${v.rule}: ${v.detail}` : JSON.stringify(r.value).slice(0, 400);
    throw new Error(`capture receipt does not validate against CaptureReceiptSchema (${why}): ${JSON.stringify(parsed.error.issues.slice(0, 3))}`);
  }
  return parsed.data as CaptureReceipt;
}

/** Capture the pinned fixture through the capture seam. */
export function capturePinned(host: BootedHost, mineRoot: string = MINE_ROOT): Promise<CaptureReceipt> {
  return captureMine(host, mineRoot, pinnedMineId());
}

// ---- the two survey ops, schema-checked against the pack's frozen shapes -------

/** `forge.survey.run@1 {mineId}` — every row validated against the FROZEN
 *  InventoryRowSchema, which is a z.strictObject: it also rejects any extra key
 *  the op invents, which a field-by-field expect() cannot see. */
export async function run(mineId: string): Promise<SurveyInventory> {
  const r = await call(FORGE_SURVEY_RUN_OP, { mineId });
  if (!r.ok) throw new Error(`${FORGE_SURVEY_RUN_OP} did not return: ${r.error}: ${String((r as { detail?: string }).detail ?? "")}`);
  const v = r.value as SurveyInventory & { refused?: boolean; rule?: string; detail?: string };
  if (v?.refused === true) throw new Error(`${FORGE_SURVEY_RUN_OP} REFUSED with ${v.rule}: ${v.detail}`);
  if (v?.schemaVersion !== "1" || v?.op !== FORGE_SURVEY_RUN_OP || typeof v?.count !== "number" || !Array.isArray(v?.rows) || !Array.isArray(v?.capped)) {
    throw new Error(`${FORGE_SURVEY_RUN_OP} returned an unexpected shape: ${JSON.stringify(v).slice(0, 400)}`);
  }
  for (const row of v.rows) {
    const parsed = InventoryRowSchema.safeParse(row);
    if (!parsed.success) {
      throw new Error(`inventory row does not validate against InventoryRowSchema (${row.path}): ${JSON.stringify(parsed.error.issues.slice(0, 3))}`);
    }
  }
  return v;
}

/** `forge.survey.render@1 {mineId}` — the atlas envelope. */
export async function render(mineId: string): Promise<SurveyAtlas> {
  const r = await call(FORGE_SURVEY_RENDER_OP, { mineId });
  if (!r.ok) throw new Error(`${FORGE_SURVEY_RENDER_OP} did not return: ${r.error}: ${String((r as { detail?: string }).detail ?? "")}`);
  const v = r.value as SurveyAtlas & { refused?: boolean; rule?: string; detail?: string };
  if (v?.refused === true) throw new Error(`${FORGE_SURVEY_RENDER_OP} REFUSED with ${v.rule}: ${v.detail}`);
  if (v?.schemaVersion !== "1" || v?.op !== FORGE_SURVEY_RENDER_OP || typeof v?.atlas !== "string" || v.atlas.length === 0) {
    throw new Error(`${FORGE_SURVEY_RENDER_OP} returned an unexpected shape: ${JSON.stringify(v).slice(0, 400)}`);
  }
  return v;
}

/** `forge.survey.render@1 {inventory}` — the no-I/O form: the renderer behind
 *  its own op, handed its input. */
export async function renderInventory(inventory: unknown): Promise<SurveyAtlas> {
  const r = await call(FORGE_SURVEY_RENDER_OP, { inventory });
  if (!r.ok) throw new Error(`${FORGE_SURVEY_RENDER_OP} did not return: ${r.error}: ${String((r as { detail?: string }).detail ?? "")}`);
  const v = r.value as SurveyAtlas & { refused?: boolean; rule?: string; detail?: string };
  if (v?.refused === true) throw new Error(`${FORGE_SURVEY_RENDER_OP} REFUSED with ${v.rule}: ${v.detail}`);
  if (v?.schemaVersion !== "1" || typeof v?.atlas !== "string") {
    throw new Error(`${FORGE_SURVEY_RENDER_OP} returned an unexpected shape: ${JSON.stringify(v).slice(0, 400)}`);
  }
  return v;
}
