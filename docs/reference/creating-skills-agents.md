# Creating Skills & Agents

Guide for creating new skills and agents using the built-in creator tools.

## Overview

| Tool | Purpose |
|------|---------|
| `/fuse-ai-pilot:skill-creator` | Create skills with SKILL.md + references/ |
| `/fuse-ai-pilot:agent-creator` | Create expert agents with hooks |

---

## Creating a Skill

### Workflow

```bash
# 1. Invoke skill-creator
/fuse-ai-pilot:skill-creator

# 2. Mandatory research (runs automatically)
→ explore-codebase (check existing skills)
→ research-expert (fetch official docs)
→ context7 (code examples)

# 3. Create structure
skills/<skill-name>/
├── SKILL.md                    # Entry point
└── references/                 # Documentation
    ├── installation.md         # Setup
    ├── patterns.md             # Core patterns
    └── templates/              # Complete code
        └── basic-setup.md

# 4. Register in marketplace.json
# 5. Validate with sniper
```

### Skill Structure

| File | Max Lines | Content |
|------|-----------|---------|
| SKILL.md | ~150 | Overview, critical rules, reference guide |
| references/*.md | 150 | Conceptual docs (WHY, WHEN) |
| templates/*.md | Unlimited | Complete, working code |

### SKILL.md Template

```yaml
---
name: skill-name
description: Use when [trigger]. Covers [topics].
versions:
  library: X.Y.Z
user-invocable: true
references: references/file1.md, references/file2.md
related-skills: skill-a, skill-b
---
```

---

## Creating an Agent

### Workflow

```bash
# 1. Invoke agent-creator
/fuse-ai-pilot:agent-creator

# 2. Mandatory research
→ explore-codebase (check existing agents)
→ research-expert (fetch agent conventions)

# 3. Create files
plugins/<plugin>/agents/<agent-name>.md
plugins/<plugin>/scripts/validate-*.sh

# 4. Register in marketplace.json
# 5. Validate with sniper
```

### Agent Frontmatter

```yaml
---
name: agent-name
description: Expert [tech]. Use when [trigger].
model: sonnet
color: cyan
tools: Read, Edit, Write, Bash, Grep, Glob, Task, mcp__context7__*
skills: solid-[stack], skill-a, skill-b
hooks:
  PreToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "bash ${CLAUDE_PLUGIN_ROOT}/scripts/validate.sh"
---
```

### Required Sections

1. **Agent Workflow (MANDATORY)** - 3 parallel agents
2. **MANDATORY SKILLS USAGE** - Skill mapping table
3. **SOLID Rules** - Reference to solid-[stack]
4. **Local Documentation** - Skill paths
5. **Gemini Design** (UI agents) - MCP tools

---

## Critical Rules

1. **ALL content in English** - Never French
2. **References < 150 lines** - Templates unlimited
3. **Always register** - marketplace.json + plugin.json
4. **Always validate** - Run sniper after creation
5. **Use $CLAUDE_PLUGIN_ROOT** - Never hard-code paths

---

## Adapting Existing

### Skill Adaptation

```bash
# Copy similar skill
cp -r plugins/<source>/skills/<similar>/ plugins/<target>/skills/<new>/

# Adapt with sed
sed -i '' "s/Next\.js/React/g" references/*.md

# Remove non-applicable
rm references/hydration.md
```

### Agent Adaptation

```bash
# Copy and adapt
cp plugins/nextjs-expert/agents/nextjs-expert.md plugins/new/agents/new-expert.md
sed -i '' "s/nextjs/newstack/g" agents/new-expert.md
```

---

## See Also

- [Skills Documentation](../workflow/skills.md)
- [Agents Documentation](../workflow/agents.md)
- [Architecture](architecture.md)
