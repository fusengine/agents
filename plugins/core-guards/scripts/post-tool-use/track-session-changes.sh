#!/bin/bash
# Track cumulative code file changes per session
# Refactored for SOLID compliance

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/session-state-helpers.sh"

init_dirs

INPUT=$(cat)
command -v jq &>/dev/null || { log_hook "ERROR: jq not found"; exit 0; }
echo "$INPUT" | jq empty 2>/dev/null || { log_hook "ERROR: Invalid JSON"; exit 0; }

SESSION_ID=$(echo "$INPUT" | jq -r '.session_id // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

[[ -z "$SESSION_ID" ]] && SESSION_ID="unknown-$(date +%s)"
[[ -z "$FILE_PATH" ]] && exit 0

STATE_FILE=$(get_state_file "$SESSION_ID")

if is_code_file "$FILE_PATH"; then
    log_hook "Code file detected: $FILE_PATH"
    
    STATE=$(load_state "$STATE_FILE")
    COUNT=$(echo "$STATE" | jq -r '.cumulativeCodeFiles // 0')
    FILES=$(echo "$STATE" | jq -r '.modifiedFiles // []')
    
    ALREADY_EXISTS=$(echo "$FILES" | jq --arg file "$FILE_PATH" 'any(. == $file)')
    
    if [ "$ALREADY_EXISTS" = "false" ]; then
        COUNT=$((COUNT + 1))
        FILES=$(echo "$FILES" | jq --arg file "$FILE_PATH" '. + [$file]')
        log_hook "Count: $COUNT (new: $FILE_PATH)"
    fi
    
    save_state "$STATE_FILE" "$COUNT" "$FILES" "$FILE_PATH" "$SESSION_ID"
    log_hook "State saved: $COUNT file(s)"
fi

exit 0
