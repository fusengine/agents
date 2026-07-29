---
name: commit-optimization
description: Use when configuring settings.json to reduce fuse-commit-pro's context token usage.
---

<objective>
Documents the `includeGitInstructions: false` settings.json option (and its `CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS=1` env var override, which takes precedence) that removes Claude Code's built-in commit/PR workflow instructions from the system prompt — saving 2-5% context tokens — since fuse-commit-pro supplies its own comprehensive git workflow that supersedes the defaults.
</objective>

# Commit Optimization

## Optimization: Disable Built-in Git Instructions

For best results with fuse-commit-pro, add this to your `~/.claude/settings.json`:

```json
{
  "includeGitInstructions": false
}
```

This removes Claude Code's built-in commit/PR workflow instructions from the system prompt, saving 2-5% context tokens. fuse-commit-pro provides its own comprehensive git workflow that supersedes the defaults.

Note: `CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS=1` env var takes precedence over this setting.
