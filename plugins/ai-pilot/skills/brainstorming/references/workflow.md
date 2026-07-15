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

Ask questions ONE AT A TIME from these categories as needed.

### Problem-Framing (do this first)

Before any category below, reformulate the problem in your own words and get it confirmed. The named feature is a proposed solution, not the problem — do not take it at face value.

| Technique | How | Output |
|-----------|-----|--------|
| 5-whys | Ask "why does this matter" up to 5 times on the stated request | The root need behind the ask |
| Double Diamond (Discover-Define) | Discover: gather context/pain points. Define: state one crisp problem statement | A single confirmed problem statement |

Confirm the reformulated problem with the user before moving to Purpose/Constraints/Data/Integrations questions. If they push back, revise and reconfirm — do not proceed on an unconfirmed framing.

### Purpose

| Question | Why It Matters |
|----------|---------------|
| What problem does this solve? | Avoids building the wrong thing |
| Who is the end user? | Shapes UX decisions |
| What does success look like — as a measurable criterion? | Defines acceptance criteria; feeds the comparison-table axes below |

**Success must be measurable** — capture it as a metric or observable criterion (e.g. "p95 < 200ms", "zero manual steps", "passes X test"), not a vague statement. This becomes the source for the comparison-table axes in Proposing Alternatives.

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

### Diverge First (MANDATORY)

Before narrowing to a shortlist, generate **at least 6-8 distinct approaches** with judgment suspended — no filtering, no "that won't work" while generating. Use a named technique to force breadth instead of 3 sizes of the same idea:

| Technique | How |
|-----------|-----|
| SCAMPER | Substitute / Combine / Adapt / Modify / Put-to-other-use / Eliminate / Reverse each part of the obvious solution |
| Reverse brainstorming | Ask "how would we make this fail / worse?" then invert each answer |
| Analogies | How does another domain (a different product, a different industry) solve the same underlying problem? |

Only after the divergent list exists, converge: cluster near-duplicates, drop options that clearly fail the Success Criteria from Problem-Framing, and select **2-3** to present.

### Table Format (MANDATORY)

Always present options in this format. **Derive the criteria rows from the Success Criteria captured in Problem-Framing** — do not default to generic Complexity/Scalability/Time axes unless the user's success criteria actually named them:

```markdown
| Criteria | Option A: [Name] | Option B: [Name] | Option C: [Name] |
|----------|-------------------|-------------------|-------------------|
| [Success criterion 1] | ... | ... | ... |
| [Success criterion 2] | ... | ... | ... |
| Time to build | 1 task | 3 tasks | 5+ tasks |
| **Recommendation** | - | **Recommended** | - |
| **Rejected because** | [reason] | - | [reason] |
```

### Recommendation Rules

- Present all options neutrally first — steelman AND devil's-advocate each one before naming a favorite, to avoid anchoring the user on the first option shown
- Recommend ONE option clearly, after the neutral pass
- Explain WHY in 1-2 sentences
- Acknowledge trade-offs honestly
- If the user disagrees, defend the reasoning once, then defer to their call — do not silently comply and do not dig in past one round

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

## Success Metrics

- [Measurable criterion 1, e.g. "p95 latency < 200ms"]
- [Measurable criterion 2]

## Chosen Approach

[Description of the selected option and rationale]

## Alternatives Considered

| Option | Why rejected |
|--------|-------------|
| [Option X] | [Reason] |
| [Option Y] | [Reason] |

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

## Risks

- [Risk 1 and mitigation]

## Assumptions / Open Questions

- [Assumption made, to validate during Analyze]
- [Open question not yet resolved]

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
