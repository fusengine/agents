#!/bin/bash
# PostToolUse Read: Track when SOLID reference files are read
# Stores in session state for PreToolUse verification

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // "unknown"')

# Only track Read tool
[[ "$TOOL_NAME" != "Read" ]] && exit 0
[[ -z "$FILE_PATH" ]] && exit 0

# Check if it's a SOLID reference file
if [[ "$FILE_PATH" =~ solid-.*/references/ ]]; then
  STATE_DIR="/tmp/claude-code-sessions"
  mkdir -p "$STATE_DIR"
  SOLID_STATE="$STATE_DIR/session-${SESSION_ID}-solid.json"

  # Detect which SOLID type was read
  SOLID_TYPE=""
  [[ "$FILE_PATH" =~ solid-nextjs ]] && SOLID_TYPE="nextjs"
  [[ "$FILE_PATH" =~ solid-react ]] && SOLID_TYPE="react"
  [[ "$FILE_PATH" =~ solid-php ]] && SOLID_TYPE="php"
  [[ "$FILE_PATH" =~ solid-swift ]] && SOLID_TYPE="swift"

  if [[ -n "$SOLID_TYPE" ]]; then
    TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)

    # Load or create state
    if [[ -f "$SOLID_STATE" ]]; then
      STATE=$(cat "$SOLID_STATE")
    else
      STATE='{"solidReads":{}}'
    fi

    # Add this read
    STATE=$(echo "$STATE" | jq --arg type "$SOLID_TYPE" --arg ts "$TIMESTAMP" \
      '.solidReads[$type] = $ts')

    echo "$STATE" > "$SOLID_STATE"
  fi
fi

exit 0
