---
name: frontmatter
description: Agent YAML frontmatter configuration
when-to-use: Configuring agent metadata, tools, skills, hooks
keywords: frontmatter, yaml, config, tools, skills, hooks, model
priority: high
related: hooks.md, architecture.md
---

# Agent Frontmatter

## Overview

The YAML frontmatter defines agent behavior, capabilities, and validation hooks.

---

## Complete Example

```yaml
---
name: nextjs-expert
description: Expert Next.js 16 with App Router, Prisma 7, Better Auth. Use when building Next.js apps.
model: sonnet
color: cyan
tools: Read, Edit, Write, Bash, Grep, Glob, Task, mcp__context7__*, mcp__shadcn__*, mcp__gemini-design__*
skills: solid-nextjs, nextjs-16, prisma-7, better-auth, nextjs-shadcn
hooks:
  PreToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "bash ${CLAUDE_PLUGIN_ROOT}/scripts/validate-nextjs-solid.sh"
---
```

---

## Field Reference

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique identifier (kebab-case) |
| `description` | Yes | One-line for agent detection |
| `model` | Yes | `sonnet`, `opus`, or `haiku` |
| `color` | No | Terminal color |
| `tools` | Yes | Comma-separated tool list |
| `skills` | Yes | Accessible skills |
| `hooks` | No | Pre/Post validation |

---

## Model Selection

| Model | When to Use |
|-------|-------------|
| `sonnet` | Default for most agents |
| `opus` | Complex reasoning, architecture |
| `haiku` | Fast, simple tasks |

---

## Tools Configuration

### Core Tools

```yaml
tools: Read, Edit, Write, Bash, Grep, Glob, Task
```

### With MCP Servers

```yaml
tools: Read, Edit, Write, Bash, Grep, Glob, Task, mcp__context7__*, mcp__shadcn__*, mcp__gemini-design__*
```

| MCP Tool | Purpose |
|----------|---------|
| `mcp__context7__*` | Documentation lookup |
| `mcp__shadcn__*` | UI component registry |
| `mcp__gemini-design__*` | AI frontend generation |
| `mcp__exa__*` | Web search |

---

## Skills Reference

```yaml
skills: solid-nextjs, nextjs-16, prisma-7, better-auth
```

**Always include:**
- `solid-[stack]` - SOLID rules for the stack
- Main framework skill
- Related technology skills

---

## Description Best Practices

| Good | Bad |
|------|-----|
| "Expert Next.js 16 with App Router. Use when building Next.js apps." | "Next.js developer" |
| "Expert Laravel 12 with Eloquent, Livewire. Use when building Laravel apps." | "PHP expert" |

**Pattern**: "Expert [tech] with [features]. Use when [trigger]."

→ See [templates/agent-template.md](templates/agent-template.md) for complete example
