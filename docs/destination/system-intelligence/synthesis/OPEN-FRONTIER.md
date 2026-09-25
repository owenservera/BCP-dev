# Open Frontier

> Wave 1 synthesis. These are unresolved destination questions, not architecture laws.

## UNSCOPED or materially under-modelled

| Area | Current evidence | What remains unknown | Relevant slices |
|---|---|---|---|
| Product Instance / native lifecycle | Product Instance characterization + Ω boot/recovery/vault | instance identity, durable product path, replace/update semantics, native shell boundary | VS1, VS8 |
| Account / routing | Legacy ProviderAccount and routing behavior; Ω realization model | canonical Ω Account, account selection, durable routing policy, fallback semantics | VS3, VS5, VS8 |
| Session lifecycle | Legacy ProviderSession/ProfileSession; provider-browser live session path | authentication ownership, expiry, reconnect, account/session binding | VS3, VS7 |
| Whole-world projection | mind WorldModel + world/canvas destination docs | domain breadth, identity reconciliation, relationship authority, projection bounds | VS1, VS2, VS3, VS5 |
| Canonical AI conversation model | Ω Chat contract + Legacy Conversation/ConversationMessage | minimal provider-independent conversation identity and translation rules | VS2, VS3, VS5 |
| Durable Work / continuity | run/director/watch/liveness plus vault evidence | one product Work lifecycle, checkpoints, review and continuation semantics | VS4, VS5, VS6 |
| Attention | standing/watch/liveness mechanisms | durable attention identity, interruption policy, notification semantics | VS5, VS7 |
| Desktop/external-world substrate | browser-mediated provider path; legacy browser/OS mechanisms | general governed filesystem/native-app/device/network interaction | VS4, VS7 |
| Generic web/resource substrate | provider-browser | first-class web resource/session/page identity beyond provider-specific realizations | VS3, VS7 |
| Local intelligence/model lifecycle | historical provider/local-model evidence | model installation, selection, replacement, resource governance | VS3, VS7 |
| Plugin ecosystem/distribution | Forge/runtime | ordinary-user acquisition, trust, update, disable and sharing | VS6, VS7 |
| Multi-device continuity | local-first/export principles | owned-machine synchronization, merge, portability and identity continuity | VS5, VS8 |

## Important negative findings

- Legacy implementation does not automatically become Ω destination implementation.
- Standalone Ω decisions explain lineage but do not prove current BCP behavior.
- A live-looking code path is not live proof.
- mind/self-knowledge is a bounded projection, not evidence of a complete world database.
- Canvas/workspace representations are not canonical world truth merely because they persist.

## Characterization slices before broad implementation

1. Provider/account/session/routing: one real authenticated provider account, one user-selected route, one externally visible result, and proof of the actual account/session used.
2. Product Instance/persistence: start → durable mutation → close → reopen, proving user-owned state survives temporary-state cleanup and executable replacement.
3. Canonical Chat: translate one conversation between two source representations while preserving provider-independent identity and provenance.
4. World/surface: one project containing a conversation, document, work item and account relationship; prove multiple surfaces without duplicated truth.
5. Work/attention continuity: leave work running, return later, recover state and present an inspectable outcome and attention item.

## Next-cycle stopping condition

Do not expand archaeology merely to enumerate more files. Expand only where a characterization slice exposes an unproven or contradictory dependency.