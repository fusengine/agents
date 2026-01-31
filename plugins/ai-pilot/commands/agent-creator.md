---
description: Create expert agents following standard patterns. Generates agent.md with frontmatter, hooks, mandatory sections, and skill references.
argument-hint: "<agent-name> [--from <source-agent>] [--adapt <next→react>]"
---

# Agent Creator

Create expert agents following established patterns and conventions.

---

## Agent Architecture

```
plugins/<plugin-name>/
├── agents/
│   └── <agent-name>.md      # Agent definition
├── skills/
│   ├── skill-a/
│   └── skill-b/
├── scripts/
│   └── validate-*.sh        # Hook scripts
└── .claude-plugin/
    └── plugin.json
```

---

## Agent Frontmatter (YAML)

```yaml
---
name: agent-name
description: Expert [domain] with [tech stack]. Use when [trigger conditions].
model: sonnet|opus|haiku
color: blue|magenta|green|yellow|cyan
tools: Read, Edit, Write, Bash, Grep, Glob, Task, mcp__context7__*, mcp__shadcn__*, mcp__gemini-design__*
skills: solid-[stack], skill-a, skill-b, skill-c
hooks:
  PreToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "bash ${CLAUDE_PLUGIN_ROOT}/scripts/validate-[stack]-solid.sh"
  PostToolUse:
    - matcher: "Read"
      hooks:
        - type: command
          command: "bash ${CLAUDE_PLUGIN_ROOT}/scripts/track-skill-read.sh"
---
```

### Field Reference

| Field | Description |
|-------|-------------|
| `name` | Unique agent identifier (kebab-case) |
| `description` | One-line description for agent detection |
| `model` | LLM model (sonnet default, opus for complex) |
| `color` | Terminal output color |
| `tools` | Comma-separated tool access list |
| `skills` | Skills agent can access |
| `hooks` | Pre/Post tool validation scripts |

---

## Required Sections

### 1. Agent Workflow (MANDATORY)

```markdown
## Agent Workflow (MANDATORY)

Before ANY implementation, launch in parallel:

1. **fuse-ai-pilot:explore-codebase** - Analyze [domain] patterns
2. **fuse-ai-pilot:research-expert** - Verify latest [tech] docs via Context7/Exa
3. **mcp__context7__query-docs** - Check [specific] patterns

After implementation, run **fuse-ai-pilot:sniper** for validation.
```

### 2. Mandatory Skills Usage

```markdown
## MANDATORY SKILLS USAGE (CRITICAL)

**You MUST use your skills for EVERY task.**

| Task | Required Skill |
|------|----------------|
| Architecture | `solid-[stack]` |
| [Domain A] | `skill-a` |
| [Domain B] | `skill-b` |
| UI components | `[stack]-shadcn` |

**Workflow:**
1. Identify the task domain
2. Load the corresponding skill(s)
3. Follow skill documentation strictly
4. Never code without consulting skills first
```

### 3. SOLID Rules

```markdown
## SOLID Rules (MANDATORY)

**See `solid-[stack]` skill for complete rules.**

| Rule | Requirement |
|------|-------------|
| Files | < 100 lines (split at 90) |
| Interfaces | `[location]` ONLY |
| Documentation | JSDoc on every function |
| Research | Always before coding |
| Validation | `fuse-ai-pilot:sniper` after changes |
```

### 4. Local Documentation

```markdown
## Local Documentation (PRIORITY)

**Check local skills first before Context7:**

```
skills/[skill-a]/       # Description
skills/[skill-b]/       # Description
skills/[skill-c]/       # Description
```
```

### 5. Quick Reference

```markdown
## Quick Reference

### [Domain A]

| Feature | Documentation |
|---------|---------------|
| Feature 1 | `skill-a/references/` |
| Feature 2 | `skill-a/references/` |

### [Domain B]

| Feature | Documentation |
|---------|---------------|
| Feature 1 | `skill-b/references/` |
```

### 6. Gemini Design (For UI Agents)

```markdown
## GEMINI DESIGN MCP (MANDATORY FOR ALL UI)

**NEVER write UI code yourself. ALWAYS use Gemini Design MCP.**

### Tools
| Tool | Usage |
|------|-------|
| `create_frontend` | Complete views with Tailwind |
| `modify_frontend` | Surgical component redesign |
| `snippet_frontend` | Isolated components |

### FORBIDDEN without Gemini Design
- Creating components with styling
- Writing JSX with Tailwind classes

### ALLOWED without Gemini
- Logic/data fetching only
- Text/copy changes
```

### 7. Forbidden Patterns

```markdown
## Forbidden

- **Using emojis as icons** - Use Lucide React only
- **[Anti-pattern]** - [Alternative]
```

---

## Hook Scripts

### PreToolUse Hooks

```bash
# scripts/validate-[stack]-solid.sh
#!/bin/bash
# Validate SOLID principles before Write/Edit
# Check file size, interface location, etc.
```

### PostToolUse Hooks

```bash
# scripts/track-skill-read.sh
#!/bin/bash
# Track which skills are being consulted
```

---

## Creation Workflow

### Option 1: From Scratch

```bash
# 1. Create agent file
touch plugins/<plugin>/agents/<agent-name>.md

# 2. Add frontmatter + all required sections

# 3. Create validation scripts
touch plugins/<plugin>/scripts/validate-<stack>-solid.sh
chmod +x plugins/<plugin>/scripts/*.sh

# 4. Register in marketplace.json
```

### Option 2: Copy & Adapt (RECOMMENDED)

```bash
# 1. Copy similar agent
cp plugins/nextjs-expert/agents/nextjs-expert.md \
   plugins/new-plugin/agents/new-expert.md

# 2. Adapt with sed
sed -i '' "s/nextjs/newstack/g; s/Next\.js/NewStack/g" agents/new-expert.md

# 3. Update skills list and tools

# 4. Copy and adapt scripts
cp plugins/nextjs-expert/scripts/*.sh plugins/new-plugin/scripts/
```

---

## Marketplace Registration

```json
// .claude-plugin/marketplace.json
{
  "plugins": [
    {
      "name": "fuse-new",
      "source": "./plugins/new-expert",
      "agents": [
        "./agents/new-expert.md"
      ],
      "skills": [
        "./skills/skill-a",
        "./skills/skill-b"
      ]
    }
  ]
}
```

---

## Validation Checklist

- [ ] Frontmatter complete (name, description, model, color, tools, skills)
- [ ] Agent Workflow section present
- [ ] Mandatory Skills Usage table
- [ ] SOLID Rules reference
- [ ] Local Documentation paths valid
- [ ] Quick Reference with skill links
- [ ] Gemini Design section (if UI agent)
- [ ] Forbidden patterns listed
- [ ] Hook scripts executable (`chmod +x`)
- [ ] Registered in marketplace.json

---

## Examples

### Create React agent from Next.js

```
/agent-creator react-expert --from nextjs-expert --adapt next→react
```

**Adaptations:**
- Remove Server Components references
- Replace App Router with TanStack Router
- Remove 'use client' mentions
- Update skills list

### Create Laravel agent

```
/agent-creator laravel-expert
```

**Result:**
- PHP/Laravel specific frontmatter
- Eloquent, Blade, Livewire skills
- PHPDoc instead of JSDoc
- No Gemini Design section

---

## Commit Convention

```
feat(<plugin>): add <agent-name> expert agent

- List tools and skills configured
- Note hooks and validation scripts
- Reference related skills created
```
