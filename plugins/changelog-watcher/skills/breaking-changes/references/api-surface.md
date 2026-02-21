---
name: api-surface
description: Current Claude Code API surface used by our plugins - single source of truth for compatibility checks
when-to-use: When comparing new Claude Code versions against our current usage
keywords: api, hooks, plugins, schema, frontmatter, compatibility
priority: high
related: templates/migration-guide.md
---

# Current API Surface (Fusengine Plugins)

## Hook Types Used

| Hook Type | Plugins Using It |
|-----------|-----------------|
| `PreToolUse` | ai-pilot, security-expert |
| `PostToolUse` | ai-pilot, security-expert, changelog-watcher |
| `UserPromptSubmit` | ai-pilot |
| `SubagentStart` | ai-pilot |
| `SubagentStop` | ai-pilot |
| `SessionEnd` | ai-pilot |

## Hook Schema

```json
{
  "hooks": {
    "<HookType>": [
      {
        "matcher": "<regex>",
        "hooks": [{ "type": "command", "command": "<cmd>" }]
      }
    ]
  }
}
```

## Agent Frontmatter Fields

| Field | Required | Values |
|-------|----------|--------|
| `name` | Yes | string |
| `description` | Yes | string |
| `model` | No | sonnet, opus, haiku |
| `color` | No | red, blue, green, etc. |
| `tools` | Yes | comma-separated tool list |
| `skills` | No | comma-separated skill names |

## Plugin Manifest (plugin.json)

Required: name, version, description, author, license
Optional: homepage, repository, keywords, category, strict
Arrays: commands, agents, skills

## Skill SKILL.md Frontmatter

Required: name, description
Optional: argument-hint, user-invocable, versions, references

## Reference Frontmatter

Required: name, description
Optional: when-to-use, keywords, priority, related

## CLI Flags Used in Scripts

| Flag/Command | Scripts Using It |
|-------------|-----------------|
| `jq` | All hook scripts |
| `grep -rn` | security-scan.sh |
| `curl -sL` | fetch-changelog.sh |
| `wc -l` | check-solid-compliance.sh |

## Last Updated

Date: 2026-02-21
Claude Code Version: (set after first /watch run)
