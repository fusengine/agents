#!/bin/bash
# PreToolUse: Block edits to files > 100 lines BEFORE modification
# Exit 2 = Block operation
# Allows Write with new_string < 100 lines (for refactoring/splitting)

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
NEW_STRING=$(echo "$INPUT" | jq -r '.tool_input.new_string // .tool_input.content // empty')

# Skip if no file path
[[ -z "$FILE_PATH" ]] && exit 0

# Skip non-code files
if [[ ! "$FILE_PATH" =~ \.(ts|tsx|js|jsx|py|go|rs|java|php|cpp|c|rb|swift|kt|dart|vue|svelte)$ ]]; then
  exit 0
fi

# Skip if file doesn't exist (new file creation is OK)
[[ ! -f "$FILE_PATH" ]] && exit 0

# Count current lines
CURRENT_LINES=$(wc -l < "$FILE_PATH" | tr -d ' ')
FILENAME=$(basename "$FILE_PATH")

# If file is already compliant, allow
(( CURRENT_LINES <= 100 )) && exit 0

# For Write tool: check if new content is < 100 lines (allows refactoring)
if [[ "$TOOL_NAME" == "Write" && -n "$NEW_STRING" ]]; then
  NEW_LINES=$(echo "$NEW_STRING" | wc -l | tr -d ' ')
  if (( NEW_LINES <= 100 )); then
    # Allow Write that reduces file size (refactoring)
    exit 0
  fi
fi

# Detect language and SOLID reference
get_solid_reference() {
  local ext="${1##*.}"
  case "$ext" in
    ts|tsx|js|jsx)
      if [[ -f "$(dirname "$1")/next.config.js" || -f "$(dirname "$1")/next.config.ts" ]]; then
        echo "fuse-nextjs/skills/solid-nextjs/references/"
      else
        echo "fuse-react/skills/solid-react/references/"
      fi
      ;;
    php) echo "fuse-laravel/skills/solid-php/references/" ;;
    swift) echo "fuse-swift-apple-expert/skills/solid-swift/references/" ;;
    *) echo "generic/" ;;
  esac
}

SOLID_REF=$(get_solid_reference "$FILE_PATH")

# Block with instructions
cat >&2 << EOF
BLOCKED: '$FILENAME' has $CURRENT_LINES lines (max: 100).

TO SPLIT THIS FILE:
1. Read SOLID rules: ~/.claude/plugins/marketplaces/fusengine-plugins/plugins/$SOLID_REF
2. Create new module files (<90 lines each) with extracted code
3. Use Write tool to replace '$FILENAME' with reduced version (<100 lines) that imports the new modules

Write with content <100 lines is ALLOWED for refactoring.
EOF
exit 2
