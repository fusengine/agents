---
name: reference-template
description: Complete template for creating reference files
keywords: template, reference, documentation, conceptual
---

# Reference File Template

## Usage

Copy this template when creating a new reference file in `references/`.

---

## Template

```markdown
---
name: <reference-name>
description: <What this reference covers>
when-to-use: <Trigger conditions for consulting this reference>
keywords: <keyword1>, <keyword2>, <keyword3>, <keyword4>
priority: <high|medium|low>
requires: <prerequisite-reference.md>
related: <related1.md>, <related2.md>
---

# <Reference Title>

## Overview

<1-2 sentences explaining what this reference covers and why it matters.>

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **<Concept 1>** | <Brief explanation> |
| **<Concept 2>** | <Brief explanation> |
| **<Concept 3>** | <Brief explanation> |

---

## When to Use

| Scenario | Approach |
|----------|----------|
| <Scenario 1> | <Recommended approach> |
| <Scenario 2> | <Recommended approach> |
| <Scenario 3> | <Recommended approach> |

---

## Decision Guide

\`\`\`
<Question>?
├── <Option A> → <Action A>
└── <Option B> → <Action B>
    ├── <Sub-option 1> → <Action 1>
    └── <Sub-option 2> → <Action 2>
\`\`\`

---

## Core Pattern

\`\`\`typescript
// Minimal illustrative code (NOT complete implementation)
<code snippet>
\`\`\`

→ See [<template-name>.md](templates/<template-name>.md) for complete implementation

---

## Common Patterns

### <Pattern Name 1>

| When | What |
|------|------|
| <Condition> | <Action> |

### <Pattern Name 2>

| When | What |
|------|------|
| <Condition> | <Action> |

---

## Best Practices

### DO
- <Best practice 1>
- <Best practice 2>
- <Best practice 3>

### DON'T
- <Anti-pattern 1>
- <Anti-pattern 2>
- <Anti-pattern 3>

---

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| <Common mistake 1> | <How to fix> |
| <Common mistake 2> | <How to fix> |

---

## Related References

- [<related-reference-1>](<related-reference-1>.md) - <Why related>
- [<related-reference-2>](<related-reference-2>.md) - <Why related>

## Related Templates

- [<template-1>](templates/<template-1>.md) - <What it demonstrates>
```

---

## Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Reference identifier |
| `description` | Yes | What reference covers |
| `when-to-use` | Yes | Trigger conditions |
| `keywords` | Yes | Search keywords |
| `priority` | Yes | high/medium/low |
| `requires` | No | Prerequisite reference |
| `related` | No | Related references |

---

## Guidelines

### Length

**Maximum 150 lines.** If longer, split into parts:
- `queries.md` → `queries-basic.md` + `queries-advanced.md`

### Code

**Minimal code.** Just enough to illustrate concepts. Full code goes in templates.

### Links

**Always link to templates.** After showing a pattern, link to the complete example.

---

## Example Filled

```yaml
---
name: queries
description: TanStack Query data fetching patterns
when-to-use: When implementing data fetching with caching
keywords: query, fetch, useQuery, data, cache
priority: high
related: mutations.md, caching.md
---
```
