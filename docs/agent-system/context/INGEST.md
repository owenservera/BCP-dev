# INGEST.md — thinker-to-repo ingest procedure

> **Classification: DERIVED — CURRENT**

The thinker has no repo write access and does not relay tasks. Its output
reaches the repo through two paths: structured deposits and raw exports.
Provenance is never optional.

## Path 1 — structured deposit (preferred)

The thinker ends a session (and periodically whenever a decision forms)
with a CONTEXT DEPOSIT block in the exact v1 format from
`context/THINKER-PROTOCOL.md`. The owner pastes the block (or the whole
chat containing it) as a file into `context/inbox/`.

## Path 2 — raw export

The owner drops the whole chat export into `context/inbox/` (any of
`.md .txt .json .html`).

## Deterministic half (mechanical, no judgment)

Run `python agent-tools/agent_ingest.py`. For each file in `inbox/` it:

1. hashes it (sha256);
2. moves it byte-identical to
   `docs/agent-system/transcripts/<date>/THINKER-<timestamp>-<slug>.md`
   with the mandatory transcript front-matter (session_id, source, date,
   workstreams, repository_tip, participants, status, plus source_file and
   source_sha256);
3. writes an ingest receipt to `context/ingest-receipts/`;
4. converts any CONTEXT DEPOSIT v1 blocks straight into insight files
   (`author: thinker:<name>`, `status: PROPOSED`).

Byte-identical means: the archived file after the front-matter block is
the source bytes verbatim (verified by hash in the self-test).

## Judgment half (the agent)

For raw chats with no deposit block, read the transcript and write the
insight notes yourself, each with `sources` pointing at transcript ranges
(file + line spans). Answers to open QUESTIONs become `answers:`-linked
insights; when an answer changes your plan, update STATE at once.

## Trigger

The L2 `context-flush` plugin checks `inbox/` on idle and, if non-empty,
runs the deterministic half and then prompts you to do the judgment half.
