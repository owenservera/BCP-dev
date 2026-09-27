# Agent Commons Identity Recovery

## Threat

`agent_id` is the stable agent identity. `key_id` identifies the signing key used for cryptographic attribution. Losing a local private key must never silently create a new keypair under the same `agent_id`.

Before this guard existed, `loadOrCreateIdentity()` generated a new Ed25519 keypair whenever local key material was absent. In an ephemeral session this could create a silent identity fork: the same `agent_id` with a new `key_id` and unrelated public key.

## Current runtime behavior

The Commons runtime now checks the remote `commons/<agent_id>` branch before minting new identity material.

If the remote branch already contains `identity/agent.json` and local identity/key material is absent, bootstrap fails loudly with:

`COMMONS_IDENTITY_ALREADY_PUBLISHED:<agent_id>:<key_id>:RECOVER_KEY_OR_EXPLICITLY_ROTATE`

If only one of the two local files exists, bootstrap also fails:

`COMMONS_LOCAL_IDENTITY_INCOMPLETE:<agent_id>`

## Recovery

1. Recover the original private key from the approved secure backup/location.
2. Restore it beside the matching `identity/agent.json`.
3. Verify the `agent_id` and `key_id` match the published identity.
4. Re-open Commons and verify the authored stream.
5. If the key is genuinely lost, perform an explicit key-rotation design/operation rather than silently generating a replacement.

## Manual pre-flight

```sh
git fetch origin
git show origin/commons/<AGENT_ID>:<AGENT_HOME>/commons/identity/agent.json
```

The runtime now performs the corresponding remote-identity check during creation. The manual check remains useful for diagnosis.

## Never do this

Do not delete the published identity merely to make initialization succeed. Do not reuse an existing `agent_id` with an unrelated private key. Do not treat a changed `key_id` as a harmless session reset.

Identity continuity is recoverability, not merely key generation.


## Operational drill readiness — 2026-09-27

### Recovery control already exercised

The runtime has a mechanical recovery guard and smoke test for the published-identity/no-local-key case:

AGENTS_CONTEXT/AGENT-COMMONS/runtime/test/smoke.test.ts

The test verifies that a published remote identity cannot silently fork into a new keypair under the same agent_id.

### Full rotation + recovery drill

The full live-fire drill is BLOCKED because the current runtime has no implemented key-rotation operation. Do not simulate rotation by manually changing identity files or claim that such a drill has passed.

Until a real rotation operation exists:
- CFA-04 authority-governance is the operational custodian for the drill procedure and roster/key-ceremony review;
- recovery remains mechanically covered by the existing guard/test;
- rotation remains an explicit blocked work item;
- the eventual drill must verify old-key rejection/retirement, new-key attribution, stable agent_id continuity, and authored-stream continuity.

This preserves the distinction between a tested recovery guard and an unimplemented rotation mechanism.
