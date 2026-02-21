#!/bin/bash
# check-security-skill.sh - PreToolUse hook
# Verifies security skill was read before code modifications
set -euo pipefail

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check for Write/Edit tools
if [[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]]; then
  exit 0
fi

# Only check code files
if [[ ! "$FILE_PATH" =~ \.(ts|tsx|js|jsx|py|php|swift|go|rs|rb|java)$ ]]; then
  exit 0
fi

# Check if security skill was recently read (state file)
STATE_DIR="$HOME/.claude/logs/00-security"
TODAY=$(date +%Y-%m-%d)
STATE_FILE="$STATE_DIR/${TODAY}-state.json"

if [[ -f "$STATE_FILE" ]]; then
  SKILL_READ=$(jq -r '.skill_read // false' "$STATE_FILE" 2>/dev/null)
  if [[ "$SKILL_READ" == "true" ]]; then
    exit 0
  fi
fi

echo "SECURITY: Read security skill references before modifying code."
echo "Use: Read skills/security-scan/references/scan-patterns.md"
exit 0
