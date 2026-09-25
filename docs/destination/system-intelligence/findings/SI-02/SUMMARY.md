# SI-02 — Legacy VIVIM

> Wave 1 archaeology. Research bookkeeping only; not Ω law.

## Question
What behavior or machinery did Legacy VIVIM learn that the destination should not accidentally lose?

## Finding
Legacy contains concrete account/session, conversation/history, capability resolution, browser control, discovery/healing and user-surface behavior. The highest-value harvest is behavioral and contractual; legacy architecture is not destination authority.

## High-value atoms
- **SI-020101 — Legacy capability resolution/execution** — Legacy VIVIM models provider interaction as typed capabilities, resolves language to a capability, routes it to a provider and executes through a single capability surface. [OBSERVED]
- **SI-020102 — Legacy Provider Account model** — Legacy has a concrete ProviderAccount model tying provider identity, email/login state, Chrome profile/debug metadata and provider sessions; it is unique per provider+email. [OBSERVED]
- **SI-020103 — Legacy ProviderSession/ProfileSession chain** — Legacy separates VIVIM session, ProviderSession and ProfileSession, with provider/account relationships and Chrome profile/slave metadata. [OBSERVED]
- **SI-020104 — Legacy conversation/message persistence** — Legacy Conversation and ConversationMessage support live, imported and history-synced conversations, provider/account links, ordering, parentage, provider message ids and identity hashes. [OBSERVED]
- **SI-020105 — ChromeGovernor as historical browser authority** — Legacy places ChromeGovernor at the center of CDP/process lifecycle and states a hard Governor Canon: no other engine touches browser/CDP directly. [OBSERVED]
- **SI-020106 — Discovery/healing/semantic browser machinery** — Legacy contains semantic grounding, selector healing, browser discovery/watchdog, provider discovery and streaming alignment machinery intended to survive changing provider UIs. [OBSERVED]
- **SI-020107 — Legacy canvas/workspace/unified-entry behavior** — Destination evidence explicitly cites legacy CanvasEngine, LivingCanvas, UnifiedEntry, SessionStateProvider, workspaces/presets/adaptive behavior and project/conversation organization as high-value behavioral harvest. [OBSERVED]
