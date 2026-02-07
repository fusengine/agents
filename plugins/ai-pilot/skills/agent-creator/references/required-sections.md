---
name: required-sections
description: Mandatory content sections for agent files
when-to-use: Writing agent markdown content after frontmatter
keywords: sections, mandatory, workflow, skills, solid, documentation
priority: high
related: frontmatter.md, architecture.md
---

# Required Sections

## Overview

Every agent file must include these sections after the frontmatter.

---

## Section Order

1. Agent Workflow (MANDATORY)
2. MANDATORY SKILLS USAGE
3. SOLID Rules
4. Local Documentation
5. Quick Reference
6. Gemini Design (UI agents only)
7. Forbidden Patterns

---

## 1. Agent Workflow (MANDATORY)

```markdown
## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Analyze [domain] patterns
2. **fuse-ai-pilot:research-expert** - Verify latest [tech] docs via Context7/Exa
3. **mcp__context7__query-docs** - Check [specific] patterns

After implementation, run **fuse-ai-pilot:sniper** for validation.
```

---

## 2. MANDATORY SKILLS USAGE

```markdown
## MANDATORY SKILLS USAGE (CRITICAL)

**You MUST use your skills for EVERY task.**

| Task | Required Skill |
|------|----------------|
| Architecture | `solid-[stack]` |
| [Domain A] | `skill-a` |
| [Domain B] | `skill-b` |

**Workflow:**
1. Identify the task domain
2. Load the corresponding skill(s)
3. Follow skill documentation strictly
```

---

## 3. SOLID Rules

```markdown
## SOLID Rules (MANDATORY)

**See `solid-[stack]` skill for complete rules.**

| Rule | Requirement |
|------|-------------|
| Files | < 100 lines (split at 90) |
| Interfaces | `[location]` ONLY |
| Documentation | JSDoc on every function |
| Validation | `fuse-ai-pilot:sniper` after changes |
```

---

## 4. Local Documentation

```markdown
## Local Documentation (PRIORITY)

**Check local skills first before Context7:**

```
skills/[skill-a]/       # Description
skills/[skill-b]/       # Description
```
```

---

## 5. Quick Reference

```markdown
## Quick Reference

### [Domain A]

| Feature | Documentation |
|---------|---------------|
| Feature 1 | `skill-a/references/` |
```

---

## 6. Gemini Design (UI Agents)

```markdown
## GEMINI DESIGN MCP (MANDATORY FOR ALL UI)

**NEVER write UI code yourself. ALWAYS use Gemini Design MCP.**

| Tool | Usage |
|------|-------|
| `create_frontend` | Complete views |
| `modify_frontend` | Surgical changes |
| `snippet_frontend` | Isolated components |
```

---

## 7. Forbidden Patterns

```markdown
## Forbidden

- **Using emojis as icons** - Use Lucide React only
- **[Anti-pattern]** - [Alternative]
```

→ See [templates/agent-template.md](templates/agent-template.md) for complete example
