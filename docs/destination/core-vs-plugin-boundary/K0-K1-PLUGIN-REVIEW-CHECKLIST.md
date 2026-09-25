# K0 / K1 / Plugin Review Checklist

Use this before substantive implementation or any host edit.

## 1. Name the responsibility

Do not start with a file or package. Write the semantic job in one sentence.

## 2. Attempt externalization

Describe how the job would operate as a system plugin or extension plugin using only published contracts.

## 3. Identify the bypass

If externalization fails, state the exact bypass: unauthorized execution, privilege minting, integrity forgery, isolation escape, partial activation, stale authority or another structural violation.

## 4. Minimize

Remove everything not required to block that bypass. The remainder is the K0 candidate. Move the rest to K1 or plugins.

## 5. Test generality

Name two unrelated plugin families that must obey the same rule. A rule applying only to chat, provider, memory, surface or another product family is probably not K0.

## 6. Test first-party symmetry

Ask whether a legitimate third-party plugin can consume the same contract. If not, record the exact trust-tier reason or identify the missing contract.

## 7. Test replacement

Remove or replace the implementation. Canonical user state, evidence history and stable references should survive, or there must be an explicit migration.

## 8. Test evolution

State whether the change is ordinary plugin evolution, contract evolution, product composition change or constitutional change.

## 9. Test zero-plugin operation

Ensure the proposed feature is not secretly required merely to boot the generic runtime.

## 10. Record evidence

Every new K0 candidate needs a why-not-plugin rationale, implementation location, contract location, authority boundary, dependency/impact set, removal experiment, falsifier and evidence state.

A host code change without this record is boundary drift.