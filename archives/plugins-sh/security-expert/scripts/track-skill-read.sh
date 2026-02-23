#!/bin/bash
# track-skill-read.sh - PostToolUse hook
# Tracks security skill reads for compliance validation
set -euo pipefail

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only track Read tool
if [[ "$TOOL_NAME" != "Read" ]]; then
  exit 0
fi

# Only track security skill files
if [[ ! "$FILE_PATH" =~ skills/(security-scan|cve-research|dependency-audit|security-headers|auth-audit)/ ]]; then
  exit 0
fi

# Update state file
STATE_DIR="$HOME/.claude/logs/00-security"
mkdir -p "$STATE_DIR"
TODAY=$(date +%Y-%m-%d)
STATE_FILE="$STATE_DIR/${TODAY}-state.json"
TIMESTAMP=$(date +%Y-%m-%dT%H:%M:%SZ)

if [[ -f "$STATE_FILE" ]] && jq -e . "$STATE_FILE" >/dev/null 2>&1; then
  STATE=$(cat "$STATE_FILE")
else
  STATE='{"skill_read":false,"reads":[]}'
fi

STATE=$(echo "$STATE" | jq --arg ts "$TIMESTAMP" --arg fp "$FILE_PATH" \
  '.skill_read = true | .reads += [{"timestamp":$ts,"file":$fp}]')

echo "$STATE" > "$STATE_FILE"
exit 0
