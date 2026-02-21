#!/bin/bash
# track-mcp-research.sh - PostToolUse hook
# Tracks MCP research consultations (context7, exa)
set -euo pipefail

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')

# Only track MCP tools
case "$TOOL_NAME" in
  *context7*|*exa*) ;;
  *) exit 0 ;;
esac

QUERY=$(echo "$INPUT" | jq -r '.tool_input.query // .tool_input.libraryId // .tool_input.libraryName // empty')

# Update state file
STATE_DIR="$HOME/.claude/logs/00-security"
mkdir -p "$STATE_DIR"
TODAY=$(date +%Y-%m-%d)
STATE_FILE="$STATE_DIR/${TODAY}-state.json"
TIMESTAMP=$(date +%Y-%m-%dT%H:%M:%SZ)

if [[ -f "$STATE_FILE" ]] && jq -e . "$STATE_FILE" >/dev/null 2>&1; then
  STATE=$(cat "$STATE_FILE")
else
  STATE='{"skill_read":false,"reads":[],"research":[]}'
fi

STATE=$(echo "$STATE" | jq --arg ts "$TIMESTAMP" --arg tool "$TOOL_NAME" --arg q "$QUERY" \
  '.research += [{"timestamp":$ts,"tool":$tool,"query":$q}]')

echo "$STATE" > "$STATE_FILE"
exit 0
