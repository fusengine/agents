#!/bin/bash
# track-skill-read.sh - Wrapper calling shared tracking
set -euo pipefail

# Resolve shared scripts: try marketplace first, fallback to relative path
MARKETPLACE_SHARED="$HOME/.claude/plugins/marketplaces/fusengine-plugins/plugins/_shared/scripts"
RELATIVE_SHARED="$(dirname "${BASH_SOURCE[0]}")/../../_shared/scripts"
if [[ -d "$MARKETPLACE_SHARED" ]]; then
  SHARED_DIR="$MARKETPLACE_SHARED"
elif [[ -d "$RELATIVE_SHARED" ]]; then
  SHARED_DIR="$(cd "$RELATIVE_SHARED" && pwd)"
else
  echo "Warning: _shared scripts not found" >&2
  exit 0
fi
source "$SHARED_DIR/tracking.sh"

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
[[ "$TOOL_NAME" != "Read" ]] && exit 0

FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
[[ ! "$FILE_PATH" =~ skills/.*\.(md|txt)$ ]] && exit 0

SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty')
[[ -z "$SESSION_ID" ]] && SESSION_ID="fallback-$(date +%s)-$$"

track_skill_read "laravel" "skill:Read" "$FILE_PATH" "$SESSION_ID"
