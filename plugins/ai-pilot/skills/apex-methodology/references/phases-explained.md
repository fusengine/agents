---
name: phases-explained
description: Detailed explanation of each APEX phase (Analyze, Plan, Execute, Verify, eXamine)
---

# APEX Phases Explained

## A - Analyze

```text
ALWAYS run 2 agents in parallel:

1. explore-codebase
   → Map project structure
   → Find existing patterns
   → Identify change locations

2. research-expert
   → Verify official documentation
   → Confirm API methods
   → Check best practices
```

## P - Plan

```text
ALWAYS use TaskCreate:

1. Break down into tasks
2. Each task <100 lines
3. Plan file splits FIRST
4. Map dependencies (addBlockedBy)
```

## E - Execute (with TDD)

```text
FOLLOW plan strictly with TDD cycle:

1. Create interfaces FIRST
2. Write failing test (RED) → verify it fails
3. Write minimal code (GREEN) → verify it passes
4. Refactor → keep tests green
5. Monitor file sizes (<100 lines)
6. Write JSDoc/comments
7. Atomic commits per task
```

See `tdd` skill for detailed RED-GREEN-REFACTOR rules.

## V - Verify (Functional Resolution)

```text
BEFORE sniper, verify functional correctness:

1. Re-read original request
2. List all acceptance criteria
3. Verify each with evidence
4. Check for regressions
5. Confirm: "Problem is RESOLVED"
```

See `verification` skill for detailed checklist.

## X - eXamine

```text
ALWAYS run sniper:

6-phase validation:
1. explore-codebase
2. research-expert
3. grep usages
4. run linters
5. apply fixes
6. ZERO errors
```
