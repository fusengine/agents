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
| `Setup` | (available, `--init-only`) |
| `UserPromptExpansion` | (available, pre slash-command expansion) |
| `PostToolBatch` | (available, post parallel batch) |
| `ConfigChange` | (available, on settings change) |
| `WorktreeCreate` | (available) |
| `WorktreeRemove` | (available) |

## Hook Handler Types

| `type` | Purpose | Notes |
|--------|---------|-------|
| `command` | Shell command (default) | Supports `args: string[]` exec form (v2.1.139), `async`, `timeout`, `asyncRewake`, `statusMessage`, `once: true` |
| `http` | Webhook backend | POSTs hook JSON to a URL, response parsed as hook output |
| `mcp_tool` | Invoke an MCP tool as a hook | Tool result becomes the hook response |
| `prompt` | LLM-based hook (prompt template) | Default timeout 30s, max 60s |
| `agent` | LLM-based hook (full agent) | Default timeout 30s, max 60s |

### Command hook fields (v2.1.139+)

```json
{
  "type": "command",
  "command": "script.sh",
  "args": ["--flag", "value"],
  "async": true,
  "asyncRewake": true,
  "timeout": 10000,
  "statusMessage": "Running checks…",
  "once": true
}
```

- `args`: exec form, avoids shell parsing (safer than embedding in `command`).
- `async` + `asyncRewake`: non-blocking hook, wakes Claude when complete.
- `once: true`: skill/agent hooks fire only once per session.

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
  "reason": "Reason shown to Claude",
  "continueOnBlock": false
}
```

`continueOnBlock` (PostToolUse, v2.1.139): when `true`, Claude continues after a
`block` decision instead of aborting the turn.

### Universal optional fields (any hook)

| Field | Since | Purpose |
|-------|-------|---------|
| `additionalContext` | — | Extra context appended to Claude's view |
| `terminalSequence` | v2.1.141 | OSC escape sequence emitted to terminal (desktop notifications, title updates) |
| `continueOnBlock` | v2.1.139 | PostToolUse only — keep going after block |

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
        "matcher": "<matcher>",
        "if": "<ToolName>(<pattern>)",
        "hooks": [{ "type": "command", "command": "<cmd>" }]
      }
    ]
  }
}
```

### Matcher semantics (clarified v2.1.142)

Our prior baseline labelled `matcher` as "regex" — the actual resolution rules are:

| Matcher value | Behavior |
|---------------|----------|
| `"*"`, `""`, or omitted | Match all tool/event names |
| String of `[a-zA-Z0-9_|]` only | Exact match, or `|`-separated list of exact names |
| Anything containing other characters | JS regex (compiled with `new RegExp`) |

This means `"Bash|Write"` is an exact OR (not a regex), while `"Bash.*"` triggers regex mode.

## PermissionRequest Response

```json
{
  "decision": {
    "behavior": "allow",
    "updatedInput": {}
  },
  "skipAskingForever": false,
  "reason": "Why this decision"
}
```

| Field | Values / Notes |
|-------|----------------|
| `decision.behavior` | `"allow"` or `"deny"` |
| `decision.updatedInput` | Optional — modifies the tool input before execution |
| `skipAskingForever` | When `true`, persists the decision and never re-prompts |

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
| `Setup` | v2.1.95 | One-time init (`--init-only`) |
| `UserPromptExpansion` | v2.1.108 | Before slash-command expansion |
| `PostToolBatch` | v2.1.119 | After a parallel tool batch completes |
| `ConfigChange` | v2.1.127 | Settings file changed |
| `WorktreeCreate` | v2.1.133 | New worktree created |
| `WorktreeRemove` | v2.1.133 | Worktree removed |

## Last Updated

Date: 2026-05-16
Claude Code Version: 2.1.142
