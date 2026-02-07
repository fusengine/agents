---
name: architecture
description: Agent file structure and organization
when-to-use: Understanding how agents are organized in plugins
keywords: architecture, structure, directory, files, plugin
priority: high
related: frontmatter.md, registration.md
---

# Agent Architecture

## Overview

Agents live in plugin directories and reference skills for domain knowledge.

---

## Directory Structure

```
plugins/<plugin-name>/
├── agents/
│   └── <agent-name>.md      # Agent definition file
├── skills/
│   ├── skill-a/             # Domain skills
│   │   ├── SKILL.md
│   │   └── references/
│   └── solid-[stack]/       # SOLID rules for this stack
├── scripts/
│   └── validate-*.sh        # Hook validation scripts
└── .claude-plugin/
    └── plugin.json          # Plugin manifest
```

---

## File Purposes

| File | Purpose |
|------|---------|
| `agents/<name>.md` | Agent definition with frontmatter + content |
| `skills/*/SKILL.md` | Skill entry points agent can access |
| `scripts/*.sh` | Hook scripts for validation |
| `plugin.json` | Plugin metadata and paths |

---

## Agent File Structure

```markdown
---
# YAML Frontmatter
name: agent-name
description: ...
model: sonnet
tools: ...
skills: ...
hooks: ...
---

# Agent Title

## Agent Workflow (MANDATORY)
... (uses TeamCreate)

## MANDATORY SKILLS USAGE
...

## SOLID Rules
...

## Local Documentation
...

## Quick Reference
...
```

→ See [required-sections.md](required-sections.md) for section details

---

## Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Plugin folder | kebab-case | `nextjs-expert` |
| Agent file | kebab-case.md | `nextjs-expert.md` |
| Script file | validate-*.sh | `validate-nextjs-solid.sh` |
| Skill folder | kebab-case | `solid-nextjs` |

---

## Plugin Manifest

```json
// .claude-plugin/plugin.json
{
  "name": "fuse-nextjs",
  "version": "1.0.0",
  "agents": ["./agents/nextjs-expert.md"],
  "skills": ["./skills/nextjs-16", "./skills/solid-nextjs"]
}
```

---

## Best Practices

| DO | DON'T |
|----|-------|
| One agent per plugin (main) | Multiple competing agents |
| Reference solid-[stack] skill | Duplicate SOLID rules |
| Use relative paths | Hard-code absolute paths |
| Keep agent file focused | Put all docs in agent file |
