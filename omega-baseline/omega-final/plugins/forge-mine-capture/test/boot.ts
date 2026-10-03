// forge.mine.capture — test/boot.ts (shared boot + the consent ceremony)
// Real boots of compositions/forge-mine-capture.json (law + vault + the plugin,
// forge.mine.capture@1 routed normally), plus the consent ceremony the
// EXTERNAL_MUTATION class demands: the host gates the op through law.check@1
// BEFORE the handler runs, the class default is require-consent, so a fresh
// boot refuses the first call with a consentId and the caller grants it. That
// refusal is evidence the gate fired, not a nuisance — the `gate-1` refusal
// test is the proof the class is real.
import { mkdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { compileComposition, ensureVault, bootComposition } from "../../../host/src/index.ts";
import type { BootedHost } from "../../../host/src/index.ts";
import type { CompositionSpec, PortResult } from "@vivim/omega-contracts";
import { omegaTmp } from "@vivim/omega-platform";
import { CaptureReceiptSchema } from "../../../packs/builder/src/schemas.ts";
import { consentIdFor } from "@vivim/omega-contracts";
import type { CaptureReceipt } from "../src/receipt.ts";
import { FORGE_MINE_CAPTURE_OP } from "../src/receipt.ts";

export const OMEGA_ROOT = join(import.meta.dir, "../../..");
export const COMP_SPEC_PATH = join(OMEGA_ROOT, "compositions/forge-mine-capture.json");
export const MINE_ROOT = join(OMEGA_ROOT, "fixtures/mines/synthetic-v0");
export const MINE_MANIFEST_PATH = join(MINE_ROOT, "MANIFEST.json");
/** A root that cannot exist — the consent ceremony's probe payload, so the
 *  handler (once consent is active) refuses structurally instead of reading
 *  anything at all. */
const ABSENT_ROOT = join(OMEGA_ROOT, "fixtures/mines/__no-such-mine__");
const PROBE_MINE_ID = "consent-probe@0000000";
const PROBE_PAYLOAD = { mineRoot: ABSENT_ROOT, mineId: PROBE_MINE_ID };
/** The plugin's own principal — the in-handler law self-check runs under it. */
const PLUGIN_ID = "forge.mine.capture";

/** The per-call deadline this suite gives `forge.mine.capture@1`.
 *
 *  NOT the manifest's `runtime.budget.cpuMs`: nothing in host/src reads that
 *  field (only `maxConcurrentCalls` is enforced, host/src/ports.ts:315), so the
 *  bound that actually fires is the CALLER's `deadlineMs`, default 5000
 *  (host/src/ports.ts:438). That default is now too tight for this op and the
 *  reason is structural, not incidental: after the CAS producer landed, a
 *  capture of the pinned 42-file mine issues 41 blob appends + 1 receipt append,
 *  and every vault append is TWO-PHASE with fsyncs (changelog.ts:105 two-phase
 *  append + cas.ts:42 blob fsync) — roughly 120 fsyncs on Windows for one op.
 *  Measured here: ~1.2 s on a fresh boot, over 5 s once the same vault has
 *  absorbed several captures. A caller asking for a whole-mine capture has to
 *  say so; 60 s is the declared budget, not a hope. */
export const CAPTURE_DEADLINE_MS = 60_000;

/** The deadline a given op gets here — the capture seam's declared budget,
 *  everything else the router default. */
export function deadlineFor(op: string): number | undefined {
  return op === FORGE_MINE_CAPTURE_OP ? CAPTURE_DEADLINE_MS : undefined;
}

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

/** A scratch dir for a suite's own throwaway mines (never inside the fixture). */
export function scratchDir(name: string): string {
  const dir = omegaTmp("omega-forge-mine-capture", `${name.replace(/[^a-z0-9.-]/gi, "_")}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  return dir;
}

export interface Booted { host: BootedHost; vaultDir: string }

async function boot(spec: CompositionSpec, name: string): Promise<Booted> {
  const root = omegaTmp("omega-forge-mine-capture", `${name.replace(/[^a-z0-9.-]/gi, "_")}-${Date.now()}-${Math.floor(Math.random() * 1e6)}`);
  rmSync(root, { recursive: true, force: true });
  const vaultDir = join(root, "vault");
  mkdirSync(vaultDir, { recursive: true });
  // The shipped composition's vault `dataDir` is a FIXED ${TMP} path (config
  // passthrough, never authority). Two boots sharing it would open the same
  // sqlite file — so every boot gets its own dataDir. Parallel test files and
  // the extra boots a refusal case needs must never share ledger state.
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
export async function bootCapture(): Promise<Booted> {
  return boot(shippedSpec(), "shipped");
}

/** Boot the SAME composition with a different capability grant for the plugin
 *  — the rig the ledger refusal needs: with `port:vault.append@1` withheld the
 *  handler runs, reads the mine, and finds the ledger closed. */
export async function bootCaptureWithout(withheld: string): Promise<Booted> {
  const spec = shippedSpec();
  const entry = spec.entries.find((e) => e.id === "forge.mine.capture");
  if (!entry) throw new Error("forge-mine-capture.json has no forge.mine.capture entry");
  entry.grant = { ...entry.grant, capabilities: entry.grant.capabilities.filter((c) => c !== withheld) };
  return boot(spec, `without-${withheld}`);
}

let booted: Booted | null = null;

export function current(): Booted {
  if (!booted) throw new Error("bootCapture() has not run yet (beforeAll missing)");
  return booted;
}
export function setCurrent(b: Booted): void { booted = b; }

/** One raw call to the capture op on the current boot, result untouched —
 *  tests need both the gate's {ok:false} shape and the handler's {ok:true,
 *  refused} shape. */
export async function call(payload: unknown): Promise<PortResult> {
  return current().host.router.callAsRoot(FORGE_MINE_CAPTURE_OP, payload, CAPTURE_DEADLINE_MS);
}

/** One raw call on an explicitly named host. */
export async function callOn(host: BootedHost, op: string, payload: unknown): Promise<PortResult> {
  return host.router.callAsRoot(op, payload, deadlineFor(op));
}

/** The plugin's refusal envelope (D-379 refusal-as-data: ok:true carrying the
 *  refusal). Throws when the op was gated instead of returning a named refusal. */
export async function callRefusal(payload: unknown): Promise<{ refused: true; error: "REFUSED"; op: string; rule: string; detail: string }> {
  const r = await call(payload);
  if (!r.ok) throw new Error(`${FORGE_MINE_CAPTURE_OP} was refused at the gate (${r.error}: ${String((r as { detail?: string }).detail ?? "")}) rather than returning a named refusal — run the consent ceremony first`);
  const v = r.value as { refused?: boolean; rule?: string; detail?: string; op?: string; error?: string };
  if (v?.refused !== true) throw new Error(`${FORGE_MINE_CAPTURE_OP} returned a non-refusal where one was expected: ${JSON.stringify(v).slice(0, 400)}`);
  return { refused: true, error: "REFUSED", op: v.op ?? FORGE_MINE_CAPTURE_OP, rule: v.rule ?? "", detail: v.detail ?? "" };
}

/** A successful capture, validated against pack.builder's frozen schema. */
export async function capture(payload: unknown): Promise<CaptureReceipt> {
  const r = await call(payload);
  if (!r.ok) throw new Error(`${FORGE_MINE_CAPTURE_OP} did not return: ${r.error}: ${String((r as { detail?: string }).detail ?? "")}`);
  const parsed = CaptureReceiptSchema.safeParse(r.value);
  if (!parsed.success) {
    const v = r.value as { refused?: boolean; rule?: string; detail?: string } | null;
    const why = v?.refused === true ? `the op REFUSED with ${v.rule}: ${v.detail}` : JSON.stringify(r.value).slice(0, 400);
    throw new Error(`receipt does not validate against CaptureReceiptSchema (${why}): ${JSON.stringify(parsed.error.issues.slice(0, 3))}`);
  }
  return parsed.data as CaptureReceipt;
}

/** The EXTERNAL_MUTATION consent ceremony, done the way the house law wants
 *  it — TWICE, for two distinct principals:
 *
 *   1. the CALLER (root): the host gates the op on the caller's principal
 *      before the handler runs, and its class default is require-consent.
 *   2. `forge.mine.capture` ITSELF: the plugin runs its own in-handler
 *      law.check@1 before reading a byte, and the plugin is the principal that
 *      actually reaches into the foreign tree. A caller consenting on the
 *      plugin's behalf would be a consent nobody gave.
 *
 *  Returns the GATE refusal that started it — proof the class default fired
 *  before any handler code ran. Throws if neither branch can be established. */
export async function consent(host: BootedHost): Promise<PortResult> {
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
  // The plugin's own consent — the read is the plugin's act, so it consents
  // under its own principal (root may delegate for any principal; D-384).
  const pluginConsentId = consentIdFor(PLUGIN_ID, FORGE_MINE_CAPTURE_OP);
  const pluginGrant = await host.router.callAsRoot("law.consent.grant@1", { consentId: pluginConsentId, principal: PLUGIN_ID });
  if (!pluginGrant.ok) throw new Error(`law.consent.grant@1 (plugin principal) failed: ${pluginGrant.error} ${pluginGrant.detail ?? ""}`);
  // With both consents active the handler runs and refuses structurally —
  // proof the gate (not the handler) was what blocked the first call.
  const second = await host.router.callAsRoot(FORGE_MINE_CAPTURE_OP, PROBE_PAYLOAD, CAPTURE_DEADLINE_MS);
  const v = second.ok ? (second.value as { rule?: string }) : null;
  if (!second.ok || v?.rule !== "CAPTURE_MINE_ROOT_MISSING") {
    throw new Error(`after consent the handler should have run and refused CAPTURE_MINE_ROOT_MISSING, got ${JSON.stringify(second).slice(0, 300)}`);
  }
  return first;
}

/** The pinned mine id: the fixture's own root hash IS the pin, so the op's pin
 *  check (CAPTURE_MINE_PIN_MISMATCH) has something real to verify. */
export function pinnedMineId(manifest: MineManifest = readMineManifest()): string {
  return `pantrylog@${manifest.rootHash}`;
}
