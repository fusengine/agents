#!/bin/bash
# Enforce: Files must be <100 lines (ALL languages)
# Exit 2 = Block operation and force split

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Skip if no file path
[[ -z "$FILE_PATH" ]] && exit 0

# Detect language and SOLID reference
get_solid_reference() {
  local ext="${1##*.}"
  case "$ext" in
    ts|tsx|js|jsx)
      if [[ -f "next.config.js" || -f "next.config.ts" || -f "next.config.mjs" ]]; then
        echo "nextjs-expert/skills/solid-nextjs/"
      else
        echo "react-expert/skills/solid-react/"
      fi
      ;;
    php)
      echo "laravel-expert/skills/solid-php/"
      ;;
    swift)
      echo "swift-apple-expert/skills/solid-swift/"
      ;;
    py)
      echo "generic/solid-python/"
      ;;
    go)
      echo "generic/solid-go/"
      ;;
    *)
      echo "generic/"
      ;;
  esac
}

# Skip non-code files
if [[ ! "$FILE_PATH" =~ \.(ts|tsx|js|jsx|py|go|rs|java|php|cpp|c|rb|swift|kt|dart|vue|svelte)$ ]]; then
  exit 0
fi

# Skip if file doesn't exist
[[ ! -f "$FILE_PATH" ]] && exit 0

# Count lines
LINES=$(wc -l < "$FILE_PATH" | tr -d ' ')
FILENAME=$(basename "$FILE_PATH")
SOLID_REF=$(get_solid_reference "$FILE_PATH")

if (( LINES > 100 )); then
  REASON="SOLID VIOLATION: '$FILENAME' has $LINES lines (max: 100). ACTION REQUIRED: 1) Read SOLID principles: ~/.claude/plugins/marketplaces/fusengine-plugins/plugins/$SOLID_REF 2) Split this file into smaller modules (<90 lines each) 3) Follow Single Responsibility Principle. This is a hard requirement per CLAUDE.md rules."

  cat << EOF
{
  "hookSpecificOutput": {
    "hookEventName": "PostToolUse",
    "additionalContext": "$REASON"
  }
}
EOF
  exit 0
fi

exit 0
