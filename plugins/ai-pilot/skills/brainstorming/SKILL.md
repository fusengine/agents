---
name: brainstorming
description: Use when user requests creative work - creating features, building components, adding functionality, or modifying behavior. Activates BEFORE APEX Analyze phase to refine requirements through structured questioning.
user-invocable: true
references: references/workflow.md, references/anti-patterns.md
related-skills: apex, research, exploration
argument-hint: "[feature-or-task-description]"
---

# Brainstorming Skill

**Design-first approach: no code before design approval.**

---

## Agent Workflow (MANDATORY)

Before ANY brainstorming session, use `TeamCreate` to spawn agents:

1. **fuse-ai-pilot:explore-codebase** - Understand project context, patterns, constraints
2. **fuse-ai-pilot:research-expert** - Fetch best practices and documentation

After design approval, transition to **APEX Analyze** phase.

---

## Overview

| Scenario | Action |
|----------|--------|
| **New feature** | Full brainstorming (6 steps) |
| **Major change** | Full brainstorming (6 steps) |
| **Component creation** | Full brainstorming (6 steps) |
| **Trivial fix (1-3 lines)** | Skip brainstorming, go to APEX |
| **Simple rename/typo** | Skip brainstorming, go to APEX |

---

## 6-Step Process

### Step 1: Explore Project Context

Gather context before asking questions:

- `git log --oneline -20` - Recent changes and direction
- Existing code patterns and conventions
- Related documentation and prior decisions
- Tech stack and dependency constraints

### Step 2: Ask Clarifying Questions (ONE AT A TIME)

Ask focused questions sequentially. Wait for each answer before the next.

Categories: purpose, constraints, success criteria, users, integrations.

> See [workflow.md](references/workflow.md) for question categories

### Step 3: Propose 2-3 Approaches

Present alternatives with trade-offs in table format:

| Approach | Pros | Cons | Recommendation |
|----------|------|------|----------------|
| Option A | ... | ... | ... |
| Option B | ... | ... | ... |
| Option C | ... | ... | ... |

Always include a clear recommendation with rationale.

### Step 4: Present Design for Approval

Break design into digestible sections:

1. Architecture overview
2. Key components and responsibilities
3. Data flow and state management
4. Edge cases and error handling

**Wait for explicit user approval before proceeding.**

### Step 5: Save Design Document

Save approved design to: `docs/plans/YYYY-MM-DD-<topic>-design.md`

### Step 6: Transition to APEX

Hand off to APEX Analyze phase with the approved design as input.

---

## Reference Guide

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Workflow** | [workflow.md](references/workflow.md) | Question categories, proposal format, design template |
| **Anti-Patterns** | [anti-patterns.md](references/anti-patterns.md) | Catching rationalizations to skip brainstorming |

---

## Quick Reference

```text
1. Explore   → git log, codebase, docs (agents in parallel)
2. Question  → ONE AT A TIME, wait for answers
3. Propose   → 2-3 options with trade-offs table
4. Design    → Present sections, get approval
5. Save      → docs/plans/YYYY-MM-DD-<topic>-design.md
6. Handoff   → APEX Analyze with approved design
```

---

## Critical Rules

1. **NEVER write code before design approval** - Design first, always
2. **Ask questions ONE AT A TIME** - Never dump a list of 10 questions
3. **Always propose alternatives** - Minimum 2 approaches with trade-offs
4. **Save the design doc** - Creates audit trail and shared reference
5. **Get explicit approval** - "Looks good" or similar before proceeding
