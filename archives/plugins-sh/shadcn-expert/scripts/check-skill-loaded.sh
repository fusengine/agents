#!/bin/bash
# check-skill-loaded.sh - PreToolUse hook for shadcn-ui-expert
set -euo pipefail

# Resolve shared scripts
MARKETPLACE_SHARED="$HOME/.claude/plugins/marketplaces/fusengine-plugins/plugins/_shared/scripts"
RELATIVE_SHARED="$(dirname "${BASH_SOURCE[0]}")/../../_shared/scripts"
if [[ -d "$MARKETPLACE_SHARED" ]]; then
  SHARED_DIR="$MARKETPLACE_SHARED"
elif [[ -d "$RELATIVE_SHARED" ]]; then
  SHARED_DIR="$(cd "$RELATIVE_SHARED" && pwd)"
else
  exit 0
fi
source "$SHARED_DIR/check-skill-common.sh"

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only Write/Edit on component files
[[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]] && exit 0
[[ ! "$FILE_PATH" =~ \.(tsx|jsx|css|scss|json)$ ]] && exit 0
[[ "$FILE_PATH" =~ /(node_modules|dist|build)/ ]] && exit 0

# Only block UI component and config files
[[ ! "$FILE_PATH" =~ (components|ui|shadcn|components\.json) ]] && exit 0

SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty')
[[ -z "$SESSION_ID" ]] && SESSION_ID="fallback-$(date +%s)-$$"
PROJECT_ROOT=$(find_project_root "$(dirname "$FILE_PATH")" "package.json" ".git")

skill_was_consulted "shadcn" "$SESSION_ID" "$PROJECT_ROOT" && exit 0

PLUGINS_DIR="$HOME/.claude/plugins/marketplaces/fusengine-plugins/plugins"
MSG="BLOCKED: shadcn skill not consulted. READ ONE: "
MSG+="1) $PLUGINS_DIR/shadcn-expert/skills/shadcn-detection/SKILL.md | "
MSG+="2) $PLUGINS_DIR/shadcn-expert/skills/shadcn-components/SKILL.md | "
MSG+="3) Use mcp__shadcn__search_items_in_registries. After reading, retry."
deny_block "$MSG"
