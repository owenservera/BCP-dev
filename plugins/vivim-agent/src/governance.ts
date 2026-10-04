// vivim.agent — governance.ts
// P1-06 Phase-1 governed action chain.
//
// This is deliberately one action type, one authority form, and no standing,
// delegation, budget, or adaptation machinery. The law plugin owns the
// authorization verdict (D-452); this module owns only the wire/data shape
// for the single governed action.
//
// The fixed Phase-1 target is the provider-browser action P1-08 is expected
// to exercise: message.send@1. P1-02 confirms this op exists as a fixture
// contract, while live provider realization remains a separate proof boundary.

export const PHASE1_CAPABILITY = "message.send@1" as const;
export const AGENCY_NS = "agency" as const;
export const AGENCY_EVENT_PREFIX = "event:" as const;

export type AgencyOutcome = "EXECUTED" | "REFUSED";

export interface PrincipalStatement {
  principal: string;
  kind: "human" | "session";
}

export interface AuthorityStatement {
  kind: "consent";
  consentRef: string;
  principal: string;
  capability: typeof PHASE1_CAPABILITY;
  scope: typeof PHASE1_CAPABILITY;
}

export interface GovernedActionRequest {
  principal: PrincipalStatement;
  authority: AuthorityStatement;
  capability: typeof PHASE1_CAPABILITY;
  payload: unknown;
  intentRef?: string;
  now?: number;
}

export interface GovernedEvent {
  kind: "governed-action@1";
  eventId: string;
  at: number;
  causationId: string;
  principal: PrincipalStatement;
  authority: AuthorityStatement;
  capability: typeof PHASE1_CAPABILITY;
  consentChecked: true;
  invocation: {
    frameDigest: string | null;
    verdict: "framed" | "refused";
    authorityResolved: "consent" | null;
  };
  execution: {
    attempted: boolean;
    completed: boolean;
  };
  outcome: AgencyOutcome;
  reasonCode?: string;
  reasonSentence?: string;
  intentRef?: string;
  targetResult?: unknown;
}

export function validateRequest(payload: unknown): GovernedActionRequest {
  if (payload === null || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("agency.execute: payload must be an object");
  }
  const p = payload as Record<string, unknown>;
  const principal = p.principal;
  const authority = p.authority;
  if (principal === null || typeof principal !== "object" || Array.isArray(principal)) {
    throw new Error("agency.execute: principal {principal, kind} is required");
  }
  if (authority === null || typeof authority !== "object" || Array.isArray(authority)) {
    throw new Error("agency.execute: authority {kind, consentRef, principal, capability, scope} is required");
  }
  const pr = principal as Record<string, unknown>;
  const au = authority as Record<string, unknown>;
  if (typeof pr.principal !== "string" || pr.principal.length === 0) {
    throw new Error("agency.execute: principal.principal must be non-empty");
  }
  if (pr.kind !== "human" && pr.kind !== "session") {
    throw new Error("agency.execute: principal.kind must be human|session");
  }
  if (au.kind !== "consent") {
    throw new Error("agency.execute: authority.kind must be consent");
  }
  if (typeof au.consentRef !== "string" || au.consentRef.length === 0) {
    throw new Error("agency.execute: authority.consentRef must be non-empty");
  }
  if (typeof au.principal !== "string" || au.principal !== pr.principal) {
    throw new Error("agency.execute: authority.principal must equal the requesting principal");
  }
  if (au.capability !== PHASE1_CAPABILITY || au.scope !== PHASE1_CAPABILITY) {
    throw new Error("agency.execute: authority must name exactly message.send@1");
  }
  if (p.capability !== PHASE1_CAPABILITY) {
    throw new Error("agency.execute: capability must be exactly message.send@1");
  }
  return {
    principal: { principal: pr.principal, kind: pr.kind },
    authority: {
      kind: "consent",
      consentRef: au.consentRef,
      principal: au.principal as string,
      capability: PHASE1_CAPABILITY,
      scope: PHASE1_CAPABILITY,
    },
    capability: PHASE1_CAPABILITY,
    payload: p.payload,
    ...(typeof p.intentRef === "string" && p.intentRef.length > 0 ? { intentRef: p.intentRef } : {}),
    ...(typeof p.now === "number" && Number.isFinite(p.now) ? { now: p.now } : {}),
  };
}

export function eventId(causationId: string): string {
  return AGENCY_EVENT_PREFIX + causationId;
}
