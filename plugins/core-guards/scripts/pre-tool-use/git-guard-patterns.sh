#!/bin/bash
# Git Guard patterns - Extracted for SOLID compliance

# Safe git commands for Ralph mode
RALPH_SAFE_COMMANDS=(
    "git add"
    "git commit"
    "git checkout -b"
    "git branch --show-current"
    "git status"
    "git diff"
    "git log"
)

# BLOCKED commands (never auto-approved)
BLOCKED_GIT_PATTERNS=(
  "git push.*--force"
  "git push.*-f"
  "git reset.*--hard"
  "git clean.*-fd"
  "git branch.*-D"
  "git rebase.*--force"
)

# Commands requiring confirmation
ASK_GIT_PATTERNS=(
  "git push"
  "git checkout"
  "git reset"
  "git rebase"
  "git merge"
  "git stash"
  "git clean"
  "git rm"
  "git mv"
  "git restore"
  "git revert"
  "git cherry-pick"
  "git commit"
  "git add"
  "git branch -d"
  "git branch -D"
)
