#!/bin/bash
# Session state management helpers

STATE_DIR="/tmp/claude-code-sessions"
LOG_DIR="$HOME/.claude/logs"
LOG_FILE="$LOG_DIR/hooks.log"
CODE_EXTENSIONS="ts|tsx|js|jsx|py|go|rs|java|php|cpp|c|rb|swift|kt|vue|svelte"

init_dirs() {
    mkdir -p "$STATE_DIR" "$LOG_DIR"
}

log_hook() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [PostToolUse/track-session-changes] $1" >> "$LOG_FILE"
}

get_state_file() {
    local session_id="$1"
    echo "$STATE_DIR/session-${session_id}-changes.json"
}

load_state() {
    local state_file="$1"
    if [ -f "$state_file" ] && jq empty "$state_file" 2>/dev/null; then
        cat "$state_file"
    else
        echo '{"cumulativeCodeFiles":0,"modifiedFiles":[]}'
    fi
}

save_state() {
    local state_file="$1" count="$2" files="$3" last_file="$4" session_id="$5"
    jq -n \
        --arg count "$count" \
        --argjson files "$files" \
        --arg lastFile "$last_file" \
        --arg timestamp "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
        --arg sessionId "$session_id" \
        '{cumulativeCodeFiles:($count|tonumber),modifiedFiles:$files,lastModifiedFile:$lastFile,lastCheck:$timestamp,sessionId:$sessionId}' > "$state_file"
}

is_code_file() {
    local file_path="$1"
    [[ "$file_path" =~ \.($CODE_EXTENSIONS)$ ]]
}
