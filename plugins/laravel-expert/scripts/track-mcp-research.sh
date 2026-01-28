#!/bin/bash
# track-mcp-research.sh - Wrapper calling shared tracking
set -euo pipefail

SHARED_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../_shared/scripts" && pwd)"
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

track_mcp_research "$SOURCE" "$TOOL_NAME" "$QUERY" "$SESSION_ID"
