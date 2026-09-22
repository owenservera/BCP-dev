# OMEGA Artifact #1 — Provider Pilot Table (16/16 manifests, measured)

> MSG-01 artifact 1. Code-only: `seeds/providers/manifests.ts` (1,221 lines, 16 entries,
> AUTO-GENERATED from `seeds/providers/*.json`, zero-FS-reads at boot) + `seeds/parsers/`
> harvested set + `src/storage/contracts/stream-config-store.ts` (existence only).
> Rule honored: every cell cites a line; absent fields say ABSENT; runtime-only fields say
> UNKNOWN. Nothing inferred.

## Method + counts

- 16 manifests enumerated by `provider.slug` in file order (§1 table = file order).
- Selector inventory = `endpoints[]` entries with `endpoint_type: chat|login` and their
  `selector:` block keys, quoted verbatim.
- Stream config: manifests contain **no** stream-config block (measured absence). Evidence
  used instead: `models[].supports_streaming` flags + harvested parser file in
  `seeds/parsers/harvested/` (7 files). `ProviderStreamConfig` rows are runtime-populated
  → UNKNOWN for all 16 (table `stream-config-store.ts` exists; per-provider rows not in code).

## §1 Pilot table (file order = manifests.ts order)

| # | slug (lines) | auth_type | profile_strategy | fleet ports | chat composer / send_button | login selectors | stream evidence (models streaming + harvested parser) | capabilities (count + list) | tier |
|---|--------------|-----------|------------------|-------------|-----------------------------|-----------------|------------------------------------------------------|-----------------------------|------|
| 1 | chatgpt (6-143) | browser (16) | per_account (18) | 9252-9280 (20) | `#prompt-textarea` / `[data-testid='send-button']` (49-50); textarea/both/non-editable | email `input[name='email']` / `button[type='submit']` (61-62) | 4/4 streaming (67-105) + `chatgpt-openai-delta.ts` present | 10: select_model, send_message, edit_message, regenerate_response, upload_file, create_new_chat, navigate_chat, delete_chat, rename_chat, browse_with_bing (23-34); recovery 2 (110-117) | free (35) |
| 2 | claude (144-297) | browser (154) | per_account (156) | 9222-9250 (158) | ProseMirror `div[contenteditable="true"]…` / `[aria-label='Send Message'],[aria-label='Send message']` (188-190); prosemirror/both/editable | email `input[type='email']` / `button[type='submit']` (201-202) | 3/3 streaming (207-237) + `claude-streaming-sse.ts` present (also top-level seed) | 11 (161-173); recovery 3 incl `retry_with_fallback → textarea` (241-253) | free (174) |
| 3 | deepseek (298-401) | browser (308) | per_account (310) | 9312-9340 (312) | `textarea` / `button[aria-label='Send']` (337-338); textarea/both/non-editable | email `input[type='email']` / `button[type='submit']` (349-350) | 2/2 streaming (355-372) + `deepseek-reasoning-sse.ts` present | 7 (314-322); recovery 2 (376-383) | premium (323) |
| 4 | facebook (402-437) | browser (411) | single (413) | 9360-9380 (415) | ABSENT (no chat endpoint; landing only 421-428) | ABSENT (no login endpoint) | 0 models + no harvested parser | 4: channel_add, channel_connect, message_send, message_receive (418); config `poll_strategy: cdp-scrape` (434) | premium (419) |
| 5 | gemini (438-561) | browser (448) | per_account (450) | 9282-9310 (452) | `.ql-editor[contenteditable="true"]` / `button[aria-label='Send message']` (480-481); quill/button_click/editable | ABSENT — login endpoint has URL only, no `selector:` block (487-491) | 3/3 streaming (494-523) + `gemini-batchexecute.ts` present | 9 (455-465); recovery 2 (528-535); config `auth_type: google` (558) | free (466) |
| 6 | generic (562-581) | none (570) | none (572) | ABSENT (`fleet_config: {}` 573, no port_range) | ABSENT (no endpoints) | ABSENT | 0 models + `generic-format-agnostic.ts` present | 0 (574) | free (575) |
| 7 | qwen (582-683) | browser (592) | per_account (594) | 9372-9400 (596) | `textarea` / `button[aria-label='Send']` (613-614); textarea/both/non-editable | ABSENT (no login endpoint; landing only 601-607) | 3/3 streaming (622-646) + no harvested parser | 4 (598); recovery 2 (650-657) | premium (599) |
| 8 | slack (684-719) | oauth (693) | single (695) | 9400-9420 (697) | ABSENT (API landing only 703-710) | ABSENT | 0 models + no harvested parser | 4, same messaging set (700); config `poll_strategy: webhook` (716) | premium (701) |
| 9 | studio-ai (720-817) | browser (730) | per_account (732) | 9342-9370 (734) | `rich-textarea` / `button[aria-label='Send message']` (751-752); textarea/both/non-editable | ABSENT (no login endpoint; landing only) | 2/2 streaming (760-779) + `google-ai-studio.ts` present | 4 (736); recovery 2 (784-791); config `auth_type: google` (814) | premium (737) |
| 10 | system (818-837) | none (827) | shared (829) | ABSENT (no `fleet_config` key at all) | ABSENT | ABSENT | 0 models + `system-raw-text.ts` present | 0 (830) | free (831) |
| 11 | telegram (838-873) | api_key (847) | single (849) | 9380-9400 (851) | ABSENT (Bot API landing only) | ABSENT | 0 models + no harvested parser | 4, same messaging set (854); config `poll_strategy: polling` (870) | premium (855) |
| 12 | whatsapp (874-909) | browser (883) | single (885) | 9340-9360 (887) | ABSENT (Web landing only 893-900) | ABSENT | 0 models + no harvested parser | 4, same messaging set (890); config `poll_strategy: cdp-scrape` (906) | premium (891) |
| 13 | z-ai (910-971) | api (919) | shared (921) | ABSENT (no `fleet_config` key) | no `selector:` block (endpoint_type `api`, 925-934; composer_type textarea w/o selector) | ABSENT | 1/1 streaming (937-945) + no harvested parser | 2: send_message, select_model (922); recovery 1 (949-953); config `auth_type: api_key` (968) | premium (923) |
| 14 | opencode (972-1055) | none (982) | single (984) | ABSENT (no `fleet_config` key) | no `selector:` block (`opencode://local`, endpoint_type `api`) | ABSENT | 4/4 streaming (1000-1033) + no harvested parser | 1: agent_run (985); recovery 1 (1037); config `transport: opencode-cli`, `run_mode: one-shot` (1047-1053) | premium (986; models themselves free per display names) |
| 15 | grok (1056-1133) | browser (1066) | per_account (1068) | 9412-9440 (1070) | PLACEHOLDER `composer: ''`, `send_button: ''` (1087-1089); file comment: "Select
...[truncated 2085 chars]