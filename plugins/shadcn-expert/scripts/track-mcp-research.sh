#!/bin/bash
# track-mcp-research.sh - Wrapper calling shared tracking
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

# Only track MCP tools
[[ ! "$TOOL_NAME" =~ ^mcp__ ]] && exit 0

QUERY=$(echo "$INPUT" | jq -r '.tool_input.query // .tool_input.topic // empty')
[[ -z "$QUERY" ]] && exit 0

SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty')
[[ -z "$SESSION_ID" ]] && SESSION_ID="fallback-$(date +%s)-$$"

SOURCE="mcp"
[[ "$TOOL_NAME" =~ context7 ]] && SOURCE="context7"
[[ "$TOOL_NAME" =~ exa ]] && SOURCE="exa"
[[ "$TOOL_NAME" =~ shadcn ]] && SOURCE="shadcn"

track_mcp_research "$SOURCE" "$TOOL_NAME" "$QUERY" "$SESSION_ID"
