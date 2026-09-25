# Agent Commons Context and Compaction

## Problem

Agent runtimes cannot safely place an unbounded Commons history into context.

Commons therefore provides derived context representations without replacing raw history.

## Three tiers

### HOT

Recent raw messages used for immediate interaction.

### WARM

Derived thread/conversation summaries linked to their source messages.

### COLD

Historical event/message references retained for retrieval.

## Summary contract

Every derived summary must identify what it summarizes:

    {
      "derived": true,
      "summary_of": ["msg_01", "msg_07", "msg_12"],
      "content": "..."
    }

Never rely on an unscoped numeric message range as a global ordering mechanism.

## Provenance rule

A summary is REPRESENTATION.

The summarized messages remain RAW HISTORY.

Therefore:

SUMMARY != SOURCE

and:

EVIDENCE != REPRESENTATION

## Subscription-aware compaction

A subscription may request hot, warm, cold, or custom hot/warm limits.

The same event history can therefore produce different context packages for different agents without duplicating canonical history.

## Rehydration

An agent must be able to move from:

summary -> source message IDs -> original event -> referenced artifact

when deeper inspection is required.

## Compaction does not erase

Compaction is a projection operation. Raw event history survives compaction.
