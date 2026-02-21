---
name: sources
description: Official Claude Code documentation URLs and fetch strategies
when-to-use: When fetching Claude Code updates from official sources
keywords: urls, docs, changelog, fetch, claude-code
priority: high
related: templates/changelog-report.md
---

# Claude Code Documentation Sources

## Primary Sources

| Page | URL | Content |
|------|-----|---------|
| Changelog | `code.claude.com/docs/en/changelog.md` | Release notes |
| Docs Index | `code.claude.com/docs/llms.txt` | All pages list |
| Hooks | `code.claude.com/docs/en/hooks.md` | Hook API reference |
| Plugins | `code.claude.com/docs/en/plugins-reference.md` | Plugin schema |
| Skills | `code.claude.com/docs/en/skills.md` | Skill format |
| Sub-agents | `code.claude.com/docs/en/sub-agents.md` | Agent config |
| Agent Teams | `code.claude.com/docs/en/agent-teams.md` | Team delegation |
| CLI Reference | `code.claude.com/docs/en/cli-reference.md` | Commands/flags |
| MCP | `code.claude.com/docs/en/mcp.md` | MCP server config |
| Settings | `code.claude.com/docs/en/settings.md` | Config scopes |

## Fetch Strategy

1. Start with `llms.txt` to detect new pages
2. Fetch `changelog.md` for version updates
3. Fetch API pages (hooks, plugins, skills) for schema changes
4. Compare page count/content with last check

## New Page Detection

If `llms.txt` has new URLs not in previous check:
- New page = likely new feature
- Tag as `[NEW]` in report
- Fetch and analyze the new page
