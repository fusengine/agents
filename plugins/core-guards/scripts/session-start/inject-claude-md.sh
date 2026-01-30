#!/bin/bash
# SessionStart: Inject CLAUDE.md via hookSpecificOutput
# Forces Claude to read CLAUDE.md at every session start

CLAUDE_MD="$HOME/.claude/CLAUDE.md"
LOG_DIR="$HOME/.claude/logs"
LOG_FILE="$LOG_DIR/hooks.log"

# Create log directory if needed
mkdir -p "$LOG_DIR"

# Log function with timestamp
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] [SessionStart/inject-claude-md] $1" >> "$LOG_FILE"
}

# Check if CLAUDE.md exists
if [[ ! -f "$CLAUDE_MD" ]]; then
  log "ERROR: CLAUDE.md not found at $CLAUDE_MD"
  exit 0
fi

log "Injecting CLAUDE.md into session context"

# Read and escape content for JSON
CONTENT=$(cat "$CLAUDE_MD" | jq -Rs .)

# Output JSON with additionalContext
cat << EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": $CONTENT
  }
}
EOF

log "CLAUDE.md injected successfully ($(wc -l < "$CLAUDE_MD") lines)"
exit 0
