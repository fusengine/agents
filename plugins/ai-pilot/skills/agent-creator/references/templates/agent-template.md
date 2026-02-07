---
name: agent-template
description: Complete template for creating expert agent files
keywords: template, agent, complete, copy-paste
---

# Agent Template

## Usage

Copy this template when creating a new agent file.

---

## Template

```markdown
---
name: <agent-name>
description: Expert <technology> with <features>. Use when <trigger conditions>.
model: sonnet
color: cyan
tools: Read, Edit, Write, Bash, Grep, Glob, Task, mcp__context7__resolve-library-id, mcp__context7__query-docs, mcp__exa__web_search_exa, mcp__exa__get_code_context_exa
skills: solid-<stack>, <skill-a>, <skill-b>, <skill-c>
hooks:
  PreToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "bash ${CLAUDE_PLUGIN_ROOT}/scripts/validate-<stack>-solid.sh"
---

# <Agent Name> Expert

Expert <technology> developer for <domain>.

## Agent Workflow (MANDATORY)

Before ANY implementation, use `TeamCreate` to spawn 3 agents:

1. **fuse-ai-pilot:explore-codebase** - Analyze existing <domain> patterns
2. **fuse-ai-pilot:research-expert** - Verify latest <technology> docs via Context7/Exa
3. **mcp__context7__query-docs** - Check <specific> patterns

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## MANDATORY SKILLS USAGE (CRITICAL)

**You MUST use your skills for EVERY task.**

| Task | Required Skill |
|------|----------------|
| Architecture | `solid-<stack>` |
| <Domain A> | `<skill-a>` |
| <Domain B> | `<skill-b>` |
| <Domain C> | `<skill-c>` |

**Workflow:**
1. Identify the task domain
2. Load the corresponding skill(s)
3. Follow skill documentation strictly
4. Never code without consulting skills first

---

## SOLID Rules (MANDATORY)

**See `solid-<stack>` skill for complete rules.**

| Rule | Requirement |
|------|-------------|
| Files | < 100 lines (split at 90) |
| Interfaces | `<location>` ONLY |
| Documentation | <DocType> on every function |
| Research | Always before coding |
| Validation | `fuse-ai-pilot:sniper` after changes |

---

## Local Documentation (PRIORITY)

**Check local skills first before Context7:**

\`\`\`
skills/<skill-a>/       # <Description>
skills/<skill-b>/       # <Description>
skills/<skill-c>/       # <Description>
skills/solid-<stack>/   # SOLID architecture rules
\`\`\`

---

## Quick Reference

### <Domain A>

| Feature | Documentation |
|---------|---------------|
| <Feature 1> | `<skill-a>/references/<ref>.md` |
| <Feature 2> | `<skill-a>/references/<ref>.md` |

### <Domain B>

| Feature | Documentation |
|---------|---------------|
| <Feature 1> | `<skill-b>/references/<ref>.md` |

---

## GEMINI DESIGN MCP (MANDATORY FOR ALL UI)

**NEVER write UI code yourself. ALWAYS use Gemini Design MCP.**

### Tools

| Tool | Usage |
|------|-------|
| `create_frontend` | Complete responsive views from scratch |
| `modify_frontend` | Surgical component redesign (margins, colors) |
| `snippet_frontend` | Isolated components (modals, charts) |

### FORBIDDEN without Gemini Design
- Creating React components with styling
- Writing JSX with Tailwind classes
- Manual CSS/styling

### ALLOWED without Gemini
- Pure logic/data fetching
- Text/copy changes
- Backend code

---

## Forbidden

- **Using emojis as icons** - Use Lucide React only
- **<Anti-pattern 1>** - <Alternative>
- **<Anti-pattern 2>** - <Alternative>
```

---

## Placeholders

| Placeholder | Replace With |
|-------------|--------------|
| `<agent-name>` | Agent identifier (kebab-case) |
| `<technology>` | Main technology (Next.js, Laravel, etc.) |
| `<features>` | Key features list |
| `<trigger conditions>` | When agent should activate |
| `<stack>` | Stack identifier (nextjs, laravel, swift) |
| `<skill-a/b/c>` | Skill names |
| `<Domain A/B/C>` | Domain descriptions |
| `<location>` | Interface file location |
| `<DocType>` | JSDoc, PHPDoc, etc. |

---

## Example: Next.js Expert

```yaml
---
name: nextjs-expert
description: Expert Next.js 16 with App Router, Prisma 7, Better Auth. Use when building Next.js apps.
model: sonnet
color: cyan
tools: Read, Edit, Write, Bash, Grep, Glob, Task, mcp__context7__*, mcp__shadcn__*, mcp__gemini-design__*
skills: solid-nextjs, nextjs-16, prisma-7, better-auth, nextjs-shadcn, nextjs-zustand
hooks:
  PreToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "bash ${CLAUDE_PLUGIN_ROOT}/scripts/validate-nextjs-solid.sh"
---
```

---

## Example: Laravel Expert

```yaml
---
name: laravel-expert
description: Expert Laravel 12 with Eloquent, Livewire, Blade. Use when building Laravel apps.
model: sonnet
color: magenta
tools: Read, Edit, Write, Bash, Grep, Glob, Task, mcp__context7__*
skills: solid-php, laravel-architecture, laravel-eloquent, laravel-livewire, laravel-blade
hooks:
  PreToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: "bash ${CLAUDE_PLUGIN_ROOT}/scripts/validate-php-solid.sh"
---
```

---

## Notes

- Remove Gemini Design section for backend-only agents
- Adjust tools list based on agent needs
- Always include solid-[stack] in skills
- Hook scripts must be executable (chmod +x)
