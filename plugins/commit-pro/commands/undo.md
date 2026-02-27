---
description: Undo last commit safely. Use for undo commit, revert, uncommit, cancel commit.
argument-hint: --soft | --mixed | (empty for soft reset)
allowed-tools: Bash(git status:*), Bash(git log:*), Bash(git reset:*), Bash(git revert:*)
disable-model-invocation: true
---

# Undo Last Commit

## Current State

!`git status`

## Last Commit

!`git log -1 --pretty=format:'%h %s'`

## Remote Status

!`git log origin/HEAD..HEAD --oneline 2>/dev/null || echo "No remote tracking"`

## Instructions

Safely undo the last commit while keeping changes.

### Security Check (MANDATORY)

IF the last commit is already pushed to remote:
- **REFUSE** to reset
- Explain: "Cannot undo pushed commits with reset."
- Suggest: `git revert HEAD` to create a reverting commit
- Ask confirmation before executing revert

IF the last commit is NOT pushed:
1. Ask confirmation: "Undo last commit? Changes will be kept."
2. Determine mode:
   - `--soft` (default): Keep changes staged
   - `--mixed`: Keep changes unstaged
3. Execute: `git reset $ARGUMENTS HEAD~1`
4. Show result with `git status`

### Options

| Flag | Effect |
|------|--------|
| `--soft` | Keep changes staged (default) |
| `--mixed` | Keep changes unstaged |
