// forge.mine — test/boot.ts (shared boot + the two-class ceremony)
// Real boots of compositions/forge-mine.json — law + vault + BOTH halves of the
// D-409 split: forge.mine.capture (EXTERNAL_MUTATION, the filesystem seam) and
// forge.mine (READ, the siblings this lane builds). Booting them together is the
// point: the READ ops consume the receipt the capture seam STORES, so an
// end-to-end proof needs both in one ledger.
//
// The ceremony is asymmetric on purpose, and that asymmetry IS the class split:
//
//   forge.mine.capture@1 is EXTERNAL_MUTATION → LAW_POLICY_V1's class default is
//   require-consent → the host gates it BEFORE the handler runs, and the
//   ceremony is TWO grants for TWO principals (the caller's, to pass the gate,
//   and the capture plugin's own, because the read is the plugin's act).
//
//   forge.mine.verify/diff/list@1 are READ → the class default is
//   allow/unjournaled → the host never gates them and no consent is asked.
//   Calling them on a FRESH boot, before any grant, is the proof that the READ
//   half really is ungated (and that the consent ceremony was not doing the
//   work twice).
import { mkdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { compileComposition, ensureVault, bootComposition } from "../../../host/src/index.ts";
import type { BootedHost } from "../../../host/src/index.ts";
import type { CompositionSpec, PortResult } from "@vivim/omega-contracts";
import { consentIdFor } from "@vivim/omega-contracts";
import { omegaTmp } from "@vivim/omega-platform";
import { CaptureReceiptSchema, ProofReportSchema } from "../../../packs/builder/src/schemas.ts";
import type { CaptureReceipt } from "../../forge-mine-capture/src/receipt.ts";
import { FORGE_MINE_CAPTURE_OP } from "../../forge-mine-capture/src/receipt.ts";
import type { ProofReport } from "../src/mine.ts";
import { FORGE_MINE_DIFF_OP, FORGE_MINE_LIST_OP, FORGE_MINE_VERIFY_OP } from "../src/mine.ts";
import type { MineList } from "../src/index.ts";

export const OMEGA_ROOT = join(import.meta.dir, "../../..");
export const COMP_SPEC_PATH = join(OMEGA_ROOT, "compositions/forge-mine.json");
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
 *  bound that fires is the CALLER's `deadlineMs`, default 5000
 *  (host/src/ports.ts:438). That default is now too tight, and structurally so:
 *  since the CAS producer landed, capturing the pinned 42-file mine issues 41
 *  blob appends plus the receipt append, every one of them a two-phase fsyncing
 *  vault write. Measured on this box: ~1.2 s on a fresh vault, over 5 s on one
 *  that has already absorbed several captures. Declared, not hoped for. */
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
  const dir = omegaTmp("omega-forge-mine", `${name.replace(/[^a-z0-9.-]/gi, "_")}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  return dir;
}

export interface Booted { host: BootedHost; vaultDir: string }

async function boot(spec: CompositionSpec, name: string): Promise<Booted> {
  const root = omegaTmp("omega-forge-mine", `${name.replace(/[^a-z0-9.-]/gi, "_")}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`);
  rmSync(root, { recursive: true, force: true });
  const vaultDir = join(root, "vault");
  mkdirSync(vaultDir, { recursive: true });
  // The shipped composition's vault `dataDir` is a FIXED ${TMP} path (config
  // passthrough, never authority). Two boots sharing it would open the same
  // sqlite file — every boot gets its own dataDir.
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
export async function bootMine(): Promise<Booted> {
  return boot(shippedSpec(), "shipped");
}

/** Boot the SAME composition with a capability withheld from `pluginId` — the
 *  rig the ledger refusal needs: with `port:vault.get@1` withheld, forge.mine
 *  runs, tries to read the receipt, and finds the ledger closed. */
export async function bootMineWithout(pluginId: string, withheld: string): Promise<Booted> {
  const spec = shippedSpec();
  const entry = spec.entries.find((e) => e.id === pluginId);
  if (!entry) throw new Error(`${COMP_SPEC_PATH} has no ${pluginId} entry`);
  entry.grant = { ...entry.grant, capabilities: entry.grant.capabilities.filter((c) => c !== withheld) };
  return boot(spec, `without-${pluginId}-${withheld}`);
}

let booted: Booted | null = null;

export function current(): Booted {
  if (!booted) throw new Error("bootMine() has not run yet (beforeAll missing)");
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
  // only the capture seam gets the declared budget; every other op keeps the router default
  return host.router.callAsRoot(op, payload, op === FORGE_MINE_CAPTURE_OP ? CAPTURE_DEADLINE_MS : undefined);
}

export interface Refusal { refused: true; error: "REFUSED"; op: string; rule: string; detail: string }

/** Assert the op returned a NAMED refusal (D-379 refusal-as-data: ok:true carrying
 *  the envelope). Throws when the op was gated or returned something else — a
 *  test that silently accepts "no refusal" is the vacuous-assertion failure this
 *  suite is written against. */
export async function refusalOf(op: string, payload: unknown): Promise<Refusal> {
  const r = await call(op, payload);
  if (!r.ok) throw new Error(`${op} was refused at the gate (${r.error}: ${String((r as { detail?: string }).detail ?? "")}) rather than returning a named refusal`);
  const v = r.value as { refused?: boolean; rule?: string; detail?: string; op?: string; error?: string } | null;
  if (v?.refused !== true) throw new Error(`${op} returned a non-refusal where one was expected: ${JSON.stringify(v).slice(0, 400)}`);
  return { refused: true, error: "REFUSED", op: v.op ?? op, rule: v.rule ?? "", detail: v.detail ?? "" };
}

// ---- the three READ ops, schema-checked against the pack's frozen shapes ------

/** `forge.mine.list@1 {}` — validated against the shape declared in the
 *  manifest's contract doc (the frozen wire pins only "pinned mines"). */
export async function list(): Promise<MineList> {
  const r = await call(FORGE_MINE_LIST_OP, {});
  if (!r.ok) throw new Error(`${FORGE_MINE_LIST_OP} did not return: ${r.error}: ${String((r as { detail?: string }).detail ?? "")}`);
  const v = r.value as MineList & { refused?: boolean; rule?: string; detail?: string };
  if (v?.refused === true) throw new Error(`${FORGE_MINE_LIST_OP} REFUSED with ${v.rule}: ${v.detail}`);
  if (v?.schemaVersion !== "1" || v?.op !== FORGE_MINE_LIST_OP || typeof v?.count !== "number" || !Array.isArray(v?.mines)) {
    throw new Error(`${FORGE_MINE_LIST_OP} returned an unexpected shape: ${JSON.stringify(v).slice(0, 400)}`);
  }
  return v;
}

/** `forge.mine.verify@1 {mineId}` — validated against pack.builder's frozen
 *  ProofReportSchema (a z.strictObject: it also rejects any extra key). */
export async function verify(mineId: string): Promise<ProofReport> {
  const r = await call(FORGE_MINE_VERIFY_OP, { mineId });
  const parsed = ProofReportSchema.safeParse(r.ok ? r.value : null);
  if (!parsed.success) {
    const v = r.ok ? (r.value as { refused?: boolean; rule?: string; detail?: string } | null) : null;
    const why = v?.refused === true ? `the op REFUSED with ${v.rule}: ${v.detail}` : `${r.ok ? JSON.stringify(r.value).slice(0, 400) : `${r.error}: ${String((r as { detail?: string }).detail ?? "")}`}`;
    throw new Error(`verify report does not validate against ProofReportSchema (${why}): ${JSON.stringify(parsed.error.issues.slice(0, 3))}`);
  }
  if (parsed.data.op !== FORGE_MINE_VERIFY_OP) throw new Error(`verify reported op ${parsed.data.op}`);
  return parsed.data as ProofReport;
}

/** `forge.mine.diff@1 {mineA, mineB}` — same frozen schema. */
export async function diff(mineA: string, mineB: string): Promise<ProofReport> {
  const r = await call(FORGE_MINE_DIFF_OP, { mineA, mineB });
  const parsed = ProofReportSchema.safeParse(r.ok ? r.value : null);
  if (!parsed.success) {
    const v = r.ok ? (r.value as { refused?: boolean; rule?: string; detail?: string } | null) : null;
    const why = v?.refused === true ? `the op REFUSED with ${v.rule}: ${v.detail}` : `${r.ok ? JSON.stringify(r.value).slice(0, 400) : `${r.error}: ${String((r as { detail?: string }).detail ?? "")}`}`;
    throw new Error(`diff report does not validate against ProofReportSchema (${why}): ${JSON.stringify(parsed.error.issues.slice(0, 3))}`);
  }
  if (parsed.data.op !== FORGE_MINE_DIFF_OP) throw new Error(`diff reported op ${parsed.data.op}`);
  return parsed.data as ProofReport;
}

// ---- the capture seam, driven from THIS lane's boot ---------------------------

/** Drive the capture seam for an explicit (mineRoot, mineId), validated against
 *  pack.builder's frozen CaptureReceiptSchema. This is the ONLY way a receipt
 *  gets into the ledger in these suites — the READ ops never write one, so
 *  every end-to-end in this lane starts here. */
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