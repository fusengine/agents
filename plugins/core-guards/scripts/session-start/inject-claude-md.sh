#!/bin/bash
# SessionStart: Force reading CLAUDE.md at every session start
# Injects full CLAUDE.md content into Claude's context

CLAUDE_MD="$HOME/.claude/CLAUDE.md"
LOG_DIR="$HOME/.claude/logs"
LOG_FILE="$LOG_DIR/hooks.log"

mkdir -p "$LOG_DIR"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] [SessionStart/inject-claude-md] $1" >> "$LOG_FILE"
}

if [ ! -f "$CLAUDE_MD" ]; then
  log "ERROR: CLAUDE.md not found"
  exit 0
fi

log "Injecting CLAUDE.md into session context"

# Read CLAUDE.md content and escape for JSON
CONTENT=$(cat "$CLAUDE_MD" | jq -Rs .)

# Output JSON with additionalContext (SessionStart format)
cat << EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": $CONTENT
  }
}
EOF

log "CLAUDE.md injected successfully"
exit 0
