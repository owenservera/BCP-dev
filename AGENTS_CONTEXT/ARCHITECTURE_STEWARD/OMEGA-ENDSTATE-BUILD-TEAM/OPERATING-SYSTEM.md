# Ω End-State Build Team — Development Operating System

> Status: TEAM-OWNED DESIGN SURFACE
> Initial state: SELF-DESIGN REQUIRED
> Date: 2026-09-28

## Purpose

This is intentionally a **blank canvas for the team's development system**.

The existing BCP-dev operating system is available as reference.

The team is not required to reproduce it.

The team should design the smallest development operating system that can repeatedly take:

`end-state requirement → architecture → implementation → proof → working product`

without creating unnecessary process.

## The team must decide

### Organization

- What persistent roles/agents are needed?
- Which responsibilities should be centralized?
- Which should be autonomous?
- Which agents should be reused from the existing system?
- Which new roles, if any, should exist only on this path?

### Work decomposition

- Should work be organized by product journey, subsystem, capability, risk, or another axis?
- What is the smallest useful work unit?
- How are cross-cutting changes handled?

### Evidence

- What counts as design evidence?
- What counts as implementation evidence?
- What counts as product proof?
- How are falsifiers maintained?
- How is stale evidence detected?

### Engineering loop

- How do agents move from discovery to implementation?
- How do they review one another?
- How do they avoid local optimization that damages the end state?
- How do they keep the entire product model coherent?

### Context

- What must every fresh agent know?
- What can be discovered on demand?
- What should be stored durably?
- How does the team prevent context from becoming bureaucracy?

### Integration

- How do independent workstreams converge?
- When is a branch ready to integrate?
- How are incompatible designs compared?
- How does the team preserve useful experiments that are not selected?

## Freedom to redesign the OS

The team may replace this document's structure.

A development system is successful only while it improves development.

When recurring evidence shows that the process itself is slowing or distorting the work, the team should redesign the process.

## One standing constraint

Whatever operating system the team chooses, it must preserve enough lineage that a future team can understand why important architecture/product decisions were made.
