#!/bin/bash
# validate-nextjs-solid.sh - SOLID validation for Next.js/TypeScript
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
[[ ! "$FILE_PATH" =~ \.(tsx|ts|jsx|js)$ ]] && exit 0
[[ "$FILE_PATH" =~ /(node_modules|dist|build|\.next)/ ]] && exit 0

CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')
[[ -z "$CONTENT" ]] && exit 0

LINE_COUNT=$(count_code_lines "$CONTENT")
MAX_LINES=100
[[ "$FILE_PATH" =~ (page|layout|loading|error|not-found)\.(tsx|ts)$ ]] && MAX_LINES=150

VIOLATIONS=()

# Next.js specific rules
[[ $LINE_COUNT -gt $MAX_LINES ]] && VIOLATIONS+=("File has $LINE_COUNT lines (limit: $MAX_LINES). Split to lib/, hooks/, or components/.")

if [[ "$FILE_PATH" =~ /(app|components|modules)/ ]]; then
  echo "$CONTENT" | grep -qE "^(export )?(interface|type) [A-Z]" && \
    VIOLATIONS+=("Interface/type in component. Move to modules/cores/interfaces/ or src/types/.")
fi

if echo "$CONTENT" | grep -qE "(useState|useEffect|useRef|onClick|onChange)"; then
  echo "$CONTENT" | head -5 | grep -q "'use client'" || \
    VIOLATIONS+=("Client hooks detected but 'use client' directive missing at top.")
fi

[[ ${#VIOLATIONS[@]} -gt 0 ]] && { deny_solid_violation "$FILE_PATH" "${VIOLATIONS[@]}"; exit 0; }
exit 0
