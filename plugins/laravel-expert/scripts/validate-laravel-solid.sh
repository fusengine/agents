#!/bin/bash
# validate-laravel-solid.sh - SOLID validation for Laravel/PHP
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
source "$SHARED_DIR/validate-solid-common.sh"

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

[[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]] && exit 0
[[ ! "$FILE_PATH" =~ \.php$ ]] && exit 0
[[ "$FILE_PATH" =~ /vendor/ ]] && exit 0

CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')
[[ -z "$CONTENT" ]] && exit 0

LINE_COUNT=$(count_code_lines "$CONTENT")
VIOLATIONS=()

# Laravel specific rules
[[ $LINE_COUNT -gt 100 ]] && VIOLATIONS+=("File has $LINE_COUNT lines (limit: 100). Split using Services, Actions, or Traits.")

if echo "$CONTENT" | grep -qE "^interface "; then
  [[ ! "$FILE_PATH" =~ /Contracts/ ]] && \
    VIOLATIONS+=("Interface defined outside app/Contracts/. Move to app/Contracts/ directory.")
fi

if [[ "$FILE_PATH" =~ /Controllers/ ]] && [[ $LINE_COUNT -gt 80 ]]; then
  VIOLATIONS+=("Fat controller ($LINE_COUNT lines). Extract logic to Services or Actions.")
fi

[[ ${#VIOLATIONS[@]} -gt 0 ]] && { deny_solid_violation "$FILE_PATH" "${VIOLATIONS[@]}"; exit 0; }
exit 0
