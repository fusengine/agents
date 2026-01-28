# APEX Methodology

**A**nalyze → **P**lan → **E**xecute → e**L**icit → e**X**amine

## Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     APEX WORKFLOW                               │
├─────────────────────────────────────────────────────────────────┤
│  A - Analyze    → Understand codebase (explore + research)     │
│  P - Plan       → Break down tasks (TodoWrite)                  │
│  E - Execute    → Write code (expert agent)                     │
│  L - eLicit     → Self-review (75 techniques)                   │
│  X - eXamine    → Validate (sniper agent)                       │
└─────────────────────────────────────────────────────────────────┘
```

## Phases

### A - Analyze (Parallel)

Launch together for speed:
- `explore-codebase` - Map structure, find patterns
- `research-expert` - Documentation, best practices

### P - Plan

Use `TodoWrite` to break down:
- Task list with estimates
- Files < 100 lines each
- Edge cases identified

### E - Execute

Code with domain expert:
- `nextjs-expert`, `laravel-expert`, `react-expert`, etc.
- Follow SOLID rules from `skills/solid-*/`
- JSDoc/PHPDoc mandatory

### L - eLicit (Self-Review)

Expert self-reviews before sniper:

| Mode | Flag | Description |
|------|------|-------------|
| Auto | `--auto` | Auto-select techniques |
| Manual | `--manual` | Choose from 5 options |
| Skip | `--skip-elicit` | Go directly to eXamine |

**75 techniques** in 12 categories (Security, Performance, Architecture, etc.)

### X - eXamine

Sniper validation:
1. Run linters (eslint, prettier, tsc)
2. Run tests
3. Build verification
4. **Zero errors required**

## Commands

| Command | Description |
|---------|-------------|
| `/apex <task>` | Full APEX workflow |
| `/apex-quick <task>` | Skip Analyze, direct Execute |

**Flags:**
- `--quick` - Skip Analyze phase
- `--skip-elicit` - Skip eLicit phase
- `--no-sniper` - Skip eXamine (not recommended)

## When to Use APEX

**ALWAYS if:**
- New feature, component, file
- Multi-file changes (>2 files)
- Architecture modification
- Refactoring, migration

**SKIP if:**
- Questions, explanations
- Trivial fix (1-3 lines)
- Read-only (search, debug)
- Simple git (status, log)

## Tracking

APEX tracks consultations in `.claude/apex/`:

```
project/.claude/apex/
├── task.json              # Task state
└── docs/                  # Auto-generated summaries
```

This prevents infinite loops (hooks don't re-ask for docs already consulted).
