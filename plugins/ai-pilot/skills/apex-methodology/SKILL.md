---
name: apex-methodology
description: |
  Systematic development workflow: Analyze → Plan → Execute → eLicit → eXamine.
  Use for ANY development task: features, bug fixes, refactoring, hotfixes.
  Triggers: "implement", "create", "build", "fix", "add feature", "refactor", "develop".
  Auto-detects project type (Laravel, Next.js, React, Swift) and loads framework-specific references.
  Enforces: files <100 lines, interfaces separated, SOLID principles, expert self-review, sniper validation.
  Modes: --auto (default), --manual, --skip-elicit
argument-hint: "[task-description]"
user-invocable: false
hooks:
  PostToolUse:
    - matcher: Edit
      hooks:
        - type: command
          command: |
            echo '{"decision":"block","reason":"APEX RULE: File modified via Edit. You MUST immediately launch sniper agent to validate this change before proceeding."}'
    - matcher: Write
      hooks:
        - type: command
          command: |
            echo '{"decision":"block","reason":"APEX RULE: File created via Write. You MUST immediately launch sniper agent to validate this change before proceeding."}'
---

**Current Task:** $ARGUMENTS

# APEX Methodology Skill

**Analyze → Plan → Execute → eLicit → eXamine**

Complete development workflow for features, fixes, and refactoring.

---

## Step 0: Initialize Tracking (MANDATORY FIRST ACTION)

**BEFORE anything else**, initialize APEX tracking — see `references/init-tracking.md` for the exact command.

This creates `.claude/apex/task.json` (documentation consultation status) and `.claude/apex/docs/` (consulted documentation summaries). **The PreToolUse hooks will BLOCK Write/Edit until documentation is consulted.**

---

## Workflow Overview

```text
┌─────────────────────────────────────────────────────────────────┐
│                     APEX WORKFLOW                               │
├─────────────────────────────────────────────────────────────────┤
│  00-init-branch     → Create feature branch                     │
│  00.5-brainstorm    → Design-first questioning (B) ← NEW        │
│  01-analyze-code    → Understand codebase (A)                   │
│  02-features-plan   → Plan implementation (P)                   │
│  03-execution       → Write code with TDD (E) ← UPDATED        │
│  03.5-elicit        → Expert self-review (L)                    │
│  03.7-verification  → Functional resolution check (V) ← NEW    │
│  04-validation      → Verify quality (X)                        │
│  05-review          → Self-review                               │
│  06-fix-issue       → Handle issues                             │
│  07-add-test        → Write tests (TDD cycle)                   │
│  08-check-test      → Run tests                                 │
│  09-create-pr       → Create Pull Request                       │
└─────────────────────────────────────────────────────────────────┘
```

### Skills Integration

| Phase | Skill | Invocation |
|-------|-------|------------|
| 00.5 | `brainstorming` | Questions → alternatives → design doc → approval |
| 03 | `tdd` | RED (test) → GREEN (code) → REFACTOR cycle |
| 03.7 | `verification` | Re-read request → check criteria → confirm resolution |

---

## Phase References

| Phase | File | Purpose |
| --- | --- | --- |
| **00** | `references/00-init-branch.md` | Create feature branch |
| **01** | `references/01-analyze-code.md` | Explore + Research (APEX A) |
| **02** | `references/02-features-plan.md` | TaskCreate planning (APEX P) |
| **03** | `references/03-execution.md` | Implementation (APEX E) |
| **03.5** | `references/03.5-elicit.md` | Expert self-review (APEX L) ← NEW |
| **04** | `references/04-validation.md` | sniper validation (APEX X) |
| **05** | `references/05-review.md` | Self-review checklist |
| **06** | `references/06-fix-issue.md` | Fix validation/review issues |
| **07** | `references/07-add-test.md` | Write unit/integration tests |
| **08** | `references/08-check-test.md` | Run and verify tests |
| **09** | `references/09-create-pr.md` | Create and merge PR |

---

## Core Rules

### File Size (ABSOLUTE)

```text
🚨 STOP at 90 lines → Split immediately
❌ NEVER exceed 100 lines
📊 Target: 50-80 lines per file
```

### Interface Location

```text
✅ src/interfaces/     (global)
✅ src/types/          (type definitions)
✅ Contracts/          (PHP/Laravel)
❌ NEVER in component files
```

### Agent Usage

```text
01-analyze:  explore-codebase + research-expert (PARALLEL)
04-validate: sniper (MANDATORY after ANY change)
```

---

## NEVER

```text
❌ Skip explore-codebase or research-expert
❌ Assume API syntax without verification
❌ Create files >100 lines
❌ Put interfaces in component files
❌ Skip sniper after changes
❌ Merge without tests
❌ Large PRs (>400 lines)
```

---

## Detailed References (Load on Demand)

- `references/init-tracking.md` — Load when running Step 0 (the exact tracking-init command)
- `references/phases-explained.md` — Load when you need the full explanation of each APEX phase (A/P/E/V/X)
- `references/branching-strategy.md` — Load when creating or naming branches
- `references/commit-conventions.md` — Load when writing commit messages
- `references/quick-start-flows.md` — Load when you need the full step-by-step Standard Feature / Bug Fix / Hotfix flows
- `references/flow-diagram.md` — Load when you want the full ASCII flow diagram of the workflow
- `references/validation-requirements.md` — Load when running the pre-PR / code-quality checklist
- `references/pr-guidelines.md` — Load when writing a PR title or description
- `references/language-detection.md` — Load when auto-detecting project type or navigating framework-specific reference directories
