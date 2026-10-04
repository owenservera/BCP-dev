// @vivim/omega-contracts — world.ts
// Canonical World/Object vocabulary. This is a semantic envelope over the
// existing vault (ns,id,rev,cid); it is NOT a second persistence system.

import type { VaultProvenanceRef } from "./vocabulary.ts";

export type ObjectLifecycle = "active" | "archived" | "deleted";
export type ObjectOrigin = "local" | "imported" | "synchronized" | "generated";
export type RelationshipState = "asserted" | "retracted" | "contested";

export interface CanonicalObjectRef {
  ns: string;
  id: string;
}

export interface CanonicalRevisionRef extends CanonicalObjectRef {
  rev: number;
}

export interface SourceIdentity {
  sourceAuthority: string;
  sourceRealm: string;
  sourceAccountScope?: string;
  externalId: string;
}

export interface CanonicalObject<T = unknown> {
  ref: CanonicalObjectRef;
  revision: number;
  kind: string;
  schemaVersion: string;
  ownerScope?: string;
  lifecycle: ObjectLifecycle;
  origin: ObjectOrigin;
  sourceIdentities: SourceIdentity[];
  content: T;
  provenance: VaultProvenanceRef[];
  evidence: VaultProvenanceRef[];
  createdAt: number;
  updatedAt: number;
}

export interface WorldRelationship {
  ref: CanonicalObjectRef;
  subject: CanonicalObjectRef;
  predicate: string;
  object: CanonicalObjectRef;
  state: RelationshipState;
  authorityRef?: VaultProvenanceRef;
  evidence: VaultProvenanceRef[];
  validFrom?: number;
  validTo?: number;
  createdAt: number;
  updatedAt: number;
}

export interface SourceIdentityMapping {
  ref: CanonicalObjectRef;
  source: SourceIdentity;
  target: CanonicalObjectRef;
  state: "active" | "collision" | "retired";
  evidence: VaultProvenanceRef[];
  createdAt: number;
  updatedAt: number;
}

export const WORLD_OBJECT_NS = "world";
export const WORLD_RELATIONSHIP_NS = "world";

export function isObjectLifecycleTransitionAllowed(
  from: ObjectLifecycle,
  to: ObjectLifecycle,
): boolean {
  if (from === to) return true;
  if (from === "active") return to === "archived" || to === "deleted";
  if (from === "archived") return to === "active" || to === "deleted";
  return false;
}

export function isRelationshipTransitionAllowed(
  from: RelationshipState,
  to: RelationshipState,
): boolean {
  if (from === to) return true;
  return from === "asserted" || from === "contested";
}
