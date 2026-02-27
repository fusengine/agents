---
name: workflow
description: Detailed brainstorming process - question categories, proposal format, design doc template
when-to-use: During any brainstorming session to structure the conversation
keywords: brainstorming, questions, proposal, design, alternatives, approval
priority: high
related: anti-patterns.md
---

# Brainstorming Workflow

## Overview

Structured process to refine requirements before writing any code.
Ensures alignment between user intent and implementation plan.

---

## Question Categories

Ask questions ONE AT A TIME from these categories as needed:

### Purpose

| Question | Why It Matters |
|----------|---------------|
| What problem does this solve? | Avoids building the wrong thing |
| Who is the end user? | Shapes UX decisions |
| What does success look like? | Defines acceptance criteria |

### Constraints

| Question | Why It Matters |
|----------|---------------|
| Are there performance requirements? | Influences architecture |
| Must it integrate with existing code? | Prevents breaking changes |
| What is the timeline? | Determines scope and depth |
| Are there security/compliance needs? | May require specific patterns |

### Data and State

| Question | Why It Matters |
|----------|---------------|
| What data does this feature use? | Shapes models and APIs |
| Where does the data come from? | API, DB, local state |
| How should errors be handled? | UX and resilience strategy |

### Integrations

| Question | Why It Matters |
|----------|---------------|
| Which existing components are affected? | Scope of changes |
| Are there external APIs involved? | Auth, rate limits, schemas |
| Does this affect other features? | Regression risk |

---

## Proposing Alternatives

### Table Format (MANDATORY)

Always present options in this format:

```markdown
| Criteria | Option A: [Name] | Option B: [Name] | Option C: [Name] |
|----------|-------------------|-------------------|-------------------|
| Complexity | Low | Medium | High |
| Scalability | Limited | Good | Excellent |
| Time to build | 1 task | 3 tasks | 5+ tasks |
| Maintenance | Simple | Moderate | Complex |
| **Recommendation** | - | **Recommended** | - |
```

### Recommendation Rules

- Always recommend ONE option clearly
- Explain WHY in 1-2 sentences
- Acknowledge trade-offs honestly
- If user disagrees, adapt without pushback

---

## Design Document Template

Save to: `docs/plans/YYYY-MM-DD-<topic>-design.md`

```markdown
# [Feature Name] - Design Document

**Date**: YYYY-MM-DD
**Status**: Approved

## Summary

[1-2 sentence description of what we are building and why]

## Requirements

- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

## Chosen Approach

[Description of the selected option and rationale]

## Architecture

[Component diagram or description of key parts]

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| [Choice 1] | [Why] |
| [Choice 2] | [Why] |

## Files to Create/Modify

| File | Action | Purpose |
|------|--------|---------|
| `path/to/file` | Create/Modify | [What it does] |

## Edge Cases

- [Edge case 1 and how to handle it]
- [Edge case 2 and how to handle it]

## Out of Scope

- [What we explicitly decided NOT to build]
```

---

## When to Skip Brainstorming

| Scenario | Action |
|----------|--------|
| Trivial fix (1-3 lines) | Go directly to APEX |
| Typo or rename | Go directly to APEX |
| User provides complete spec | Validate, then APEX |
| Repeated/known pattern | Brief confirmation, then APEX |
| Bug fix with clear repro | Go directly to APEX |

**When in doubt, brainstorm.** The cost of asking is low; the cost of building the wrong thing is high.
