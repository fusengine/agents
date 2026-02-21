---
description: "Step 6/6 - Git: always /fuse-commit-pro:commit (PATCH +0.0.1). MCP: Context7, Exa, Magic, shadcn, Gemini Design. Hooks: PreToolUse blocks, PostToolUse validates. Docs in docs/ only. Skills in plugins/{agent}/skills/"
next_step: "07-state-management"
---

## Git Commits (MANDATORY)

**ALWAYS use `/fuse-commit-pro:commit`** - NEVER use `git commit` directly.

**Version Increment (PATCH only):**
- ALL commit types -> +0.0.1: 1.5.4 -> 1.5.5 -> 1.5.6 -> ...

**Commit flow:** analyze changes -> detect type -> propose message -> confirm -> commit

## MCP Servers Available

| Server | Usage | Agent |
|--------|-------|-------|
| **Context7** | Documentation lookup | `research-expert` |
| **Exa** | Web search, code context | `research-expert`, `websearch` |
| **Magic (21st.dev)** | UI component generation | `design-expert` |
| **shadcn** | Component registry | `design-expert`, `shadcn-ui-expert` |
| **Gemini Design** | AI frontend generation | `design-expert` |

## Enforcement (Hooks)

| Hook | Trigger | Action |
|------|---------|--------|
| `PreToolUse` | Edit, Write | Block interfaces in components, dangerous git |
| `PostToolUse` | Edit, Write | Block files >100 lines, auto-sniper on 2+ changes |
| `PreCompact` | Context compression | Save APEX state before compression |
| `SessionStart` | New session | Inject rules, load CLAUDE.md |
| `SessionEnd` | Session close | Cleanup temp files, save stats |
| `Setup` | First run | Validate API keys and dependencies |

## Documentation Rules

- Check/create `docs/` folder in project root
- ALL documentation in `docs/` - NEVER outside except root `README.md`
- Technical docs in English, user-facing in French

## Agent Skills Location

```
~/.claude/plugins/marketplaces/fusengine-plugins/plugins/{agent}/
|- skills/                    <- Framework skills
|- skills/solid-*/references/ <- SOLID rules for this stack
```
