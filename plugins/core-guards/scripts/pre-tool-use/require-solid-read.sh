#!/bin/bash
# PreToolUse: Block Write/Edit on code files if SOLID principles not read
# Exit 2 = Block operation

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "unknown"')

# Skip if no file path
[[ -z "$FILE_PATH" ]] && exit 0

# Skip non-code files
if [[ ! "$FILE_PATH" =~ \.(ts|tsx|js|jsx|py|go|rs|java|php|cpp|c|rb|swift|kt|dart|vue|svelte)$ ]]; then
  exit 0
fi

# Detect required SOLID type based on file extension
get_required_solid() {
  local ext="${1##*.}"
  case "$ext" in
    ts|tsx|js|jsx|vue|svelte)
      # Check if Next.js project
      if [[ -f "$(dirname "$1")/next.config.js" ]] || \
         [[ -f "$(dirname "$1")/next.config.ts" ]] || \
         [[ -f "$(dirname "$1")/next.config.mjs" ]]; then
        echo "nextjs"
      else
        echo "react"
      fi
      ;;
    php) echo "php" ;;
    swift) echo "swift" ;;
    *) echo "" ;;  # No SOLID check for other languages yet
  esac
}

REQUIRED_SOLID=$(get_required_solid "$FILE_PATH")

# If no SOLID rules for this language, allow
[[ -z "$REQUIRED_SOLID" ]] && exit 0

# Check session state for SOLID reads
STATE_DIR="/tmp/claude-code-sessions"
SOLID_STATE="$STATE_DIR/session-${SESSION_ID}-solid.json"

SOLID_READ=""
if [[ -f "$SOLID_STATE" ]]; then
  SOLID_READ=$(jq -r ".solidReads.$REQUIRED_SOLID // empty" "$SOLID_STATE" 2>/dev/null)
fi

if [[ -z "$SOLID_READ" ]]; then
  FILENAME=$(basename "$FILE_PATH")
  SOLID_PATH="~/.claude/plugins/marketplaces/fusengine-plugins/plugins/fuse-${REQUIRED_SOLID}/skills/solid-${REQUIRED_SOLID}/references/"

  cat >&2 << EOF
BLOCKED: You must read SOLID principles before modifying '$FILENAME'.

REQUIRED ACTION:
Read the SOLID rules first: $SOLID_PATH

Example files to read:
- ${SOLID_PATH}01-file-size.md
- ${SOLID_PATH}02-single-responsibility.md
- ${SOLID_PATH}03-interface-segregation.md

After reading, you can modify code files.
EOF
  exit 2
fi

exit 0
