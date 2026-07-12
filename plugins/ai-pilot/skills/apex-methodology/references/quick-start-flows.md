---
name: quick-start-flows
description: Full step-by-step APEX flows for Standard Feature, Bug Fix, and Hotfix scenarios
---

# Quick Start Flows

## Standard Feature Flow

```text
1. 00-init-branch     → git checkout -b feature/xxx
2. 00.5-brainstorm    → Ask questions, propose alternatives, get design approval
3. 01-analyze-code    → explore-codebase + research-expert
4. 02-features-plan   → TaskCreate task breakdown
5. 03-execution       → TDD: write test FIRST, then implement (files <100 lines)
6. 03.5-elicit        → Expert self-review (elicitation techniques)
7. 03.7-verification  → Verify functional resolution against original request
8. 04-validation      → sniper agent (code quality)
9. 05-review          → Self-review
10. 09-create-pr      → gh pr create
```

## Bug Fix Flow

```text
1. 00-init-branch     → git checkout -b fix/xxx
2. 01-analyze-code    → Understand bug context
3. 07-add-test        → TDD: write failing test FIRST (RED)
4. 03-execution       → Fix the bug (GREEN)
5. 08-check-test      → Verify test passes + no regressions
6. 03.7-verification  → Verify original bug is functionally resolved
7. 04-validation      → sniper agent
8. 09-create-pr       → gh pr create
```

## Hotfix Flow

```text
1. 00-init-branch     → git checkout -b hotfix/xxx
2. 03-execution       → Minimal fix only
3. 03.7-verification  → Verify fix resolves the issue
4. 04-validation      → sniper agent
5. 08-check-test      → Run tests
6. 09-create-pr       → Urgent merge
```
