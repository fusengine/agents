---
name: SKILL-template
description: Complete template for creating SKILL.md files
keywords: template, skill, skeleton, boilerplate
---

# SKILL.md Template

## Usage

Copy this template when creating a new skill's SKILL.md file.

---

## Template

```markdown
---
name: <skill-name>
description: Use when <trigger conditions>. Covers <main topics>.
versions:
  <library>: "X.Y.Z"
  <framework>: "X.Y"
user-invocable: true
references: references/installation.md, references/core-concepts.md, references/patterns.md, references/templates/basic-setup.md, references/templates/advanced-example.md
related-skills: <related-skill-a>, <related-skill-b>
---

# <Skill Title>

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing <domain> patterns
2. **fuse-ai-pilot:research-expert** - Verify latest <library> docs via Context7/Exa
3. **mcp__context7__query-docs** - Check <specific> patterns

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

| Feature | Description |
|---------|-------------|
| **<Feature 1>** | <Description> |
| **<Feature 2>** | <Description> |
| **<Feature 3>** | <Description> |

---

## Critical Rules

1. **<Rule 1>** - <Explanation>
2. **<Rule 2>** - <Explanation>
3. **<Rule 3>** - <Explanation>
4. **<Rule 4>** - <Explanation>
5. **<Rule 5>** - <Explanation>

---

## Architecture

\`\`\`
<project-structure>/
├── <folder>/
│   ├── <file>.ts
│   └── <file>.ts
└── <folder>/
    └── <file>.ts
\`\`\`

→ See [basic-setup.md](references/templates/basic-setup.md) for complete example

---

## Reference Guide

### Concepts

| Topic | Reference | When to Consult |
|-------|-----------|-----------------|
| **Installation** | [installation.md](references/installation.md) | Setting up <library> |
| **Core Concepts** | [core-concepts.md](references/core-concepts.md) | Understanding <topic> |
| **Patterns** | [patterns.md](references/patterns.md) | Common use cases |

### Templates

| Template | When to Use |
|----------|-------------|
| [basic-setup.md](references/templates/basic-setup.md) | Starting new project |
| [advanced-example.md](references/templates/advanced-example.md) | Complex scenarios |

---

## Quick Reference

### <Common Pattern 1>

\`\`\`typescript
// Minimal example
\`\`\`

→ See [template.md](references/templates/template.md) for complete example

### <Common Pattern 2>

\`\`\`typescript
// Minimal example
\`\`\`

→ See [template.md](references/templates/template.md) for complete example

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
```

---

## Placeholders

| Placeholder | Replace With |
|-------------|--------------|
| `<skill-name>` | Skill folder name (kebab-case) |
| `<library>` | Main library name |
| `<framework>` | Framework if applicable |
| `<trigger conditions>` | When skill should activate |
| `<main topics>` | What skill covers |
| `<related-skill-a>` | Related skill names |
| `<Feature N>` | Key features |
| `<Rule N>` | Critical rules |

---

## Example Filled

```yaml
---
name: tanstack-query
description: Use when fetching, caching, or synchronizing server data. Covers queries, mutations, caching, and optimistic updates.
versions:
  tanstack-query: "5.67.2"
  react: "19"
user-invocable: true
references: references/installation.md, references/queries.md, references/mutations.md, references/caching.md, references/templates/basic-setup.md
related-skills: react-19, zustand
---
```
