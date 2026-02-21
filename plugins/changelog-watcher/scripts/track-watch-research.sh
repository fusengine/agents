#!/bin/bash
# track-watch-research.sh - PostToolUse hook for tracking research
set -euo pipefail

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')

# Only track relevant tools
case "$TOOL_NAME" in
  *exa*|WebFetch|WebSearch) ;;
  *) exit 0 ;;
esac

QUERY=$(echo "$INPUT" | jq -r '.tool_input.query // .tool_input.url // .tool_input.prompt // empty')

STATE_DIR="$HOME/.claude/logs/00-changelog"
mkdir -p "$STATE_DIR"
TODAY=$(date +%Y-%m-%d)
STATE_FILE="$STATE_DIR/${TODAY}-research.json"
TIMESTAMP=$(date +%Y-%m-%dT%H:%M:%SZ)

if [[ -f "$STATE_FILE" ]] && jq -e . "$STATE_FILE" >/dev/null 2>&1; then
  STATE=$(cat "$STATE_FILE")
else
  STATE='{"queries":[]}'
fi

STATE=$(echo "$STATE" | jq --arg ts "$TIMESTAMP" --arg tool "$TOOL_NAME" --arg q "$QUERY" \
  '.queries += [{"timestamp":$ts,"tool":$tool,"query":$q}]')

echo "$STATE" > "$STATE_FILE"
exit 0
