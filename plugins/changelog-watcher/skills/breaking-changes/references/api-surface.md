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
| `PreToolUse` | ai-pilot, security-expert, core-guards |
| `PostToolUse` | ai-pilot, security-expert, changelog-watcher, core-guards |
| `UserPromptSubmit` | ai-pilot, core-guards |
| `SubagentStart` | ai-pilot |
| `SubagentStop` | ai-pilot, core-guards |
| `SessionStart` | core-guards |
| `SessionEnd` | ai-pilot, core-guards |
| `Stop` | core-guards |
| `TeammateIdle` | core-guards |
| `TaskCompleted` | core-guards |
| `PostToolUseFailure` | core-guards |
| `PermissionRequest` | core-guards |
| `PreCompact` | core-guards |
| `InstructionsLoaded` | core-guards |
| `Notification` | core-guards |

## Hook Response Formats

### PreToolUse (new format — mandatory)

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow|deny|ask|defer",
    "permissionDecisionReason": "Reason shown to Claude",
    "updatedInput": {},
    "additionalContext": "Extra context for Claude"
  }
}
```

### PostToolUse / SubagentStop / UserPromptSubmit (top-level)

```json
{
  "decision": "block",
  "reason": "Reason shown to Claude"
}
```

### Stop (prompt/agent type)

```json
{
  "ok": false,
  "reason": "What was missed"
}
```

### Stop (command type)

```json
{
  "decision": "block",
  "reason": "Reason"
}
```

Or exit code 2 with stderr message.

## Hook Schema

```json
{
  "hooks": {
    "<HookType>": [
      {
        "matcher": "<regex>",
        "if": "<ToolName>(<pattern>)",
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
| `initialPrompt` | No | string (v2.1.83+) |
| `effort` | No | string (v2.1.80+) |

## Skill SKILL.md Frontmatter

Required: name, description
Optional: argument-hint, user-invocable, versions, references

## Plugin Manifest (plugin.json)

Required: name, version, description, author, license
Optional: homepage, repository, keywords, category, strict
Arrays: commands, agents, skills
Directories: `bin/` — executables added to PATH (v2.1.91+)

## Plugin Variables

| Variable | Description | Since |
|----------|-------------|-------|
| `${CLAUDE_PLUGIN_ROOT}` | Plugin install directory | — |
| `${CLAUDE_PLUGIN_DATA}` | Persistent data directory (survives updates) | v2.1.78 |
| `${CLAUDE_CODE_MCP_SERVER_NAME}` | MCP server name in hook context | v2.1.85 |
| `${CLAUDE_CODE_MCP_SERVER_URL}` | MCP server URL in hook context | v2.1.85 |

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

## New Hook Events (v2.1.69+)

| Event | Version | Description |
|-------|---------|-------------|
| `InstructionsLoaded` | v2.1.69 | Fired after CLAUDE.md/skills loaded |
| `Elicitation` | v2.1.76 | MCP interactive dialog started |
| `ElicitationResult` | v2.1.76 | MCP interactive dialog completed |
| `PostCompact` | v2.1.76 | After context compaction |
| `StopFailure` | v2.1.78 | API error during generation |
| `CwdChanged` | v2.1.83 | Working directory changed |
| `FileChanged` | v2.1.83 | File modification detected |
| `TaskCreated` | v2.1.84 | Background task created |
| `PermissionDenied` | v2.1.89 | User denied a permission prompt |

## Last Updated

Date: 2026-04-04
Claude Code Version: 2.1.92
