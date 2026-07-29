---
name: pr-summary
description: Summarize current pull request with diff, comments, and changed files. Use when reviewing PRs or before merging.
argument-hint: "[pr-number]"
context: fork
agent: fuse-ai-pilot:explore-codebase
disable-model-invocation: false
user-invocable: true
---

<objective>
PR Summary produces a structured overview of the current pull request from `gh pr diff`, `gh pr view --comments`, and `gh pr status`: what the PR does, the key file-level changes, potential risks (breaking changes, security concerns), and what a reviewer should check carefully. It runs in a forked context via the `explore-codebase` agent so the full diff and comment thread don't pollute the parent conversation.
</objective>

# PR Summary Skill

Summarize the current pull request.

## Pull Request Context

- **PR diff:** !`gh pr diff`
- **PR comments:** !`gh pr view --comments`
- **Changed files:** !`gh pr diff --name-only`
- **PR status:** !`gh pr status`

## Task

Analyze this pull request and provide:

1. **Overview** - What does this PR do?
2. **Key Changes** - Main files and modifications
3. **Potential Risks** - Breaking changes, security concerns
4. **Review Recommendations** - What to check carefully

## Output Format

```markdown
## PR Summary: [Title]

### Overview
[1-2 sentences]

### Key Changes
- [file]: [change description]
- ...

### Risks
- [risk if any]

### Recommendations
- [what to verify]
```

## Debug

- Session: ${CLAUDE_SESSION_ID}
- Timestamp: !`date +%Y-%m-%d_%H:%M:%S`
