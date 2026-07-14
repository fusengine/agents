---
name: verification
description: "Use when marking a task as complete, finishing a feature, or claiming a bug is fixed. Ensures functional resolution is verified with evidence before closing. Do NOT use for: lint/type/code-quality validation (use code-quality / sniper AFTER functional verification passes)."
---

# Verification Before Completion

## Overview

**Sniper validates CODE QUALITY. Verification validates FUNCTIONAL RESOLUTION.** Both are needed before closing any task.

Sniper catches linter errors, SOLID violations, and code style issues. Verification ensures the **original request is actually fulfilled** -- the right behavior, the right output, the right fix. A task can pass sniper with zero errors and still be functionally wrong.

| Aspect | Sniper | Verification |
|--------|--------|-------------|
| **Focus** | Code quality | Functional correctness |
| **Checks** | Linting, SOLID, style | Acceptance criteria, regressions, side effects |
| **Runs** | After any code change | Before marking task as complete |
| **Result** | Clean code | Solved problem |

---

## Agent Workflow

When invoked, follow the 6-step verification process below **before** marking any task as completed.

### 6-Step Verification Process

**Step 1: Re-read the original request**
Go back to the original issue, task description, or user message. Read it word by word. Do not rely on memory or assumptions.

**Step 2: List ALL acceptance criteria**
Extract every explicit and implicit requirement from the original request. Number them. If the request is vague, list what a reasonable user would expect.

**Step 3: Verify each criterion with evidence**
For each criterion, provide concrete evidence of resolution:
- Test output showing the expected behavior
- Log output confirming the fix
- Screenshot of the UI change
- Code diff showing the implementation

**Step 4: Check for regressions**
Run the full test suite. Compare results before and after. No new failures, no new warnings.

**Step 5: Check for side effects**
Review every modified file. Confirm no accidental changes to unrelated code. Verify dependencies and configuration are unchanged unless required.

**Step 6: Confirm functional resolution -- challenge, then write the artifact**
Before writing "Original problem is FUNCTIONALLY resolved," ALWAYS route the claim through the `challenger` agent (or `challenge` skill), fresh-context: claim = "functionally resolved" + evidence from Steps 3-5, NEVER the investigation reasoning. This is systematic -- every Verify gate, no exception, exactly like sniper runs at every eXamine. Only write the "FUNCTIONALLY resolved" verdict after a `CONFIRMED` result (or an `UNCERTAIN` explicitly accepted by the owner). A `REFUTED` verdict must be resolved (fix and re-verify) before the claim reaches the owner -- soft-gate, not a hard veto.

Write `.claude/apex/docs/verify-{task-slug}.md` (template: `references/verify-template.md`): every verification step checked, one evidence item per criterion (command output, log excerpt, screenshot path, or diff), plus the challenge verdict from this step. A context-only "it works" declaration does not survive a session boundary; the written artifact is the guardrail gates (sniper, later elicitation passes) actually check. Then state explicitly in your response: "Original problem is FUNCTIONALLY resolved" with a summary of evidence, or list what remains unresolved.

`{task-slug}`: derive per `apex-methodology/references/init-tracking.md` (git branch slug or active `TaskCreate` id) -- same pattern used by the `elicitation` skill's artifact.

---

## Reference Guide

| Resource | Path | Content |
|----------|------|---------|
| Checklist | `references/checklist.md` | Full verification checklist with all categories |
| Common Misses | `references/common-misses.md` | Frequently forgotten verification items |
| Artifact Template | `references/verify-template.md` | `verify-{task-slug}.md` template + task-slug derivation |

---

## Integration with APEX

Verification runs **between eLicit and eXamine** in the APEX workflow:

```
Analyze -> Plan -> Execute -> eLicit -> [VERIFICATION] -> eXamine (sniper)
```

This ensures functional correctness is confirmed before code quality validation. A task is only complete when **both** verification and sniper pass.

---

## Critical Rules

| Rule | Reason |
|------|--------|
| Never skip re-reading the original request | Prevents solving the wrong problem |
| Evidence required for every criterion | "It works" is not evidence |
| Full test suite, not just new tests | Catches regressions |
| Review ALL modified files | Catches accidental side effects |
| Both verification AND sniper must pass | Quality without correctness is useless |
| Step 6 writes `verify-{task-slug}.md` to disk | In-context self-review without persisted state regresses across sessions |
