---
name: anti-patterns
description: Common rationalizations for skipping brainstorming and why they are wrong
when-to-use: When tempted to skip brainstorming or when reviewing skill compliance
keywords: anti-patterns, rationalizations, skip, excuses, red-flags
priority: high
related: workflow.md
---

# Anti-Patterns: Rationalizations for Skipping Brainstorming

## Overview

The most dangerous moment is when you feel confident you already know the answer.
These anti-rationalizations catch the excuses agents use to skip design.

---

## Core Anti-Rationalizations

### "Too simple for design"

**Reality**: Simple projects generate the most wasted work from unexamined assumptions.

| Perception | What Actually Happens |
|------------|----------------------|
| "Just a CRUD form" | Missing validation, edge cases, error states |
| "Simple API call" | Auth, retries, caching, error handling overlooked |
| "Quick component" | Accessibility, responsiveness, state management missed |

**Rule**: If it touches more than 3 files, it deserves brainstorming.

---

### "I already know what to do"

**Reality**: You might know HOW, but the user needs to validate WHAT.

| Your Assumption | User's Hidden Requirement |
|----------------|--------------------------|
| REST API | They wanted GraphQL |
| Client-side state | They need server persistence |
| Single page | They want multi-step wizard |
| Modal dialog | They prefer inline editing |

**Rule**: Your technical knowledge does not replace user intent validation.

---

### "Let me just start coding"

**Reality**: Coding without design is the #1 cause of rework.

| Metric | With Brainstorming | Without |
|--------|-------------------|---------|
| Rework cycles | 0-1 | 3-5 |
| User satisfaction | High | Unpredictable |
| Wasted effort | Minimal | 30-60% |
| Direction changes | Caught early | Discovered late |

**Rule**: 15 minutes of design saves hours of rework.

---

### "The user already told me everything"

**Reality**: Users often omit constraints they consider obvious.

| What Users Say | What They Assume You Know |
|---------------|--------------------------|
| "Add a login page" | Must match existing design system |
| "Create an API" | Must follow existing auth patterns |
| "Build a dashboard" | Must work on mobile too |
| "Add notifications" | Must respect user preferences |

**Rule**: Always verify assumptions. Ask at least 2 clarifying questions.

---

### "This is urgent, no time for design"

**Reality**: Urgency increases the need for design, not decreases it.

| Approach | Under Pressure |
|----------|---------------|
| Skip design | Ship wrong thing fast, then fix for days |
| Quick design (10 min) | Ship right thing, move on |

**Rule**: Even under time pressure, ask ONE clarifying question minimum.

---

### "I'll figure it out as I go"

**Reality**: Emergent design works for exploration, not for delivery.

| When Acceptable | When Dangerous |
|----------------|---------------|
| Prototyping | Production features |
| Research spikes | User-facing changes |
| Solo experiments | Team deliverables |

**Rule**: If the user is waiting for a result, design before building.

---

## Red Flags Table

Watch for these signals that brainstorming is being skipped:

| Red Flag | What It Means | Action |
|----------|--------------|--------|
| Jumping to `Edit`/`Write` without questions | Skipping requirements gathering | STOP. Ask questions first |
| Single approach presented | No alternatives considered | Propose at least 2 options |
| No design doc saved | No audit trail | Save to `docs/plans/` |
| "This is straightforward" in reasoning | Rationalization detected | Challenge the assumption |
| User says "just do X" | May still need clarification | Ask 1-2 questions to confirm |
| Large feature, zero questions asked | Requirements assumed, not gathered | Full brainstorming needed |
| Code written before approval | Design step skipped | Revert and brainstorm |

---

## Self-Check Checklist

Before transitioning to APEX, verify:

- [ ] At least 2 clarifying questions were asked and answered
- [ ] At least 2 alternative approaches were presented
- [ ] User explicitly approved the chosen approach
- [ ] Design document saved to `docs/plans/`
- [ ] Edge cases and constraints documented
- [ ] Out-of-scope items explicitly listed

---

## The Golden Rule

> **The cost of asking one more question is near zero.
> The cost of building the wrong thing is enormous.**

When in doubt, ask. When confident, still ask.
