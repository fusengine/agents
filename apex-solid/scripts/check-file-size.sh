#!/bin/bash
# Check file size after writing

source "$CLAUDE_ENV_FILE" 2>/dev/null || true

# Skip if unknown project
[ "$SOLID_PROJECT_TYPE" = "unknown" ] && exit 0
[ -z "$SOLID_PROJECT_TYPE" ] && exit 0

# Read file path from stdin (JSON)
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.filePath // empty' 2>/dev/null)

[ -z "$FILE_PATH" ] && exit 0
[ ! -f "$FILE_PATH" ] && exit 0

# Count lines of code (excluding comments and blank lines)
count_loc() {
  local file="$1"
  local ext="${file##*.}"

  case "$ext" in
    ts|tsx|js|jsx|go|rs|java|swift)
      grep -v '^\s*$\|^\s*//\|^\s*/\*\|^\s*\*' "$file" 2>/dev/null | wc -l
      ;;
    php)
      grep -v '^\s*$\|^\s*//\|^\s*#\|^\s*/\*\|^\s*\*' "$file" 2>/dev/null | wc -l
      ;;
    py)
      grep -v '^\s*$\|^\s*#\|^\s*"""\|^\s*'"'"''"'"''"'"'' "$file" 2>/dev/null | wc -l
      ;;
    *)
      wc -l < "$file"
      ;;
  esac
}

LOC=$(count_loc "$FILE_PATH")
LIMIT=${SOLID_FILE_LIMIT:-100}

if [ "$LOC" -gt "$LIMIT" ]; then
  FILENAME=$(basename "$FILE_PATH")
  echo "⚠️ SOLID: $FILENAME has $LOC lines (limit: $LIMIT)"
  echo "   Consider splitting into smaller modules"
fi

exit 0  # Warning only, don't block
