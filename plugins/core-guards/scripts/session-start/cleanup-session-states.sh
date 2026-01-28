#!/bin/bash
# Cleanup old session state files on session start

LOG_DIR="$HOME/.claude/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/hooks.log"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] [SessionStart/cleanup] $1" >> "$LOG_FILE"
}

log "Starting session cleanup"

# Cleanup /tmp/claude-code-sessions older than 24 hours
STATE_DIR="/tmp/claude-code-sessions"
if [ -d "$STATE_DIR" ]; then
  BEFORE_COUNT=$(find "$STATE_DIR" -name "session-*.json" | wc -l | tr -d ' ')

  # Delete files older than 24 hours
  find "$STATE_DIR" -name "session-*.json" -mtime +1 -delete 2>/dev/null

  AFTER_COUNT=$(find "$STATE_DIR" -name "session-*.json" | wc -l | tr -d ' ')
  DELETED=$((BEFORE_COUNT - AFTER_COUNT))

  log "Cleaned $DELETED old session state files (${AFTER_COUNT} remaining)"
fi

# Cleanup old code change state files
if [ -f "/tmp/claude-code-changes-$USER.json" ]; then
  # Check if older than 6 hours
  if [ "$(find "/tmp/claude-code-changes-$USER.json" -mmin +360 2>/dev/null)" ]; then
    rm "/tmp/claude-code-changes-$USER.json"
    log "Removed stale code changes state file"
  fi
fi

# Log rotation (keep logs < 10MB)
if [ -f "$LOG_FILE" ]; then
  LOG_SIZE=$(stat -f%z "$LOG_FILE" 2>/dev/null || stat -c%s "$LOG_FILE" 2>/dev/null || echo 0)
  if [ "$LOG_SIZE" -gt 10485760 ]; then
    # Rotate: keep last 5000 lines
    tail -n 5000 "$LOG_FILE" > "${LOG_FILE}.tmp"
    mv "${LOG_FILE}.tmp" "$LOG_FILE"
    log "Log rotated (was ${LOG_SIZE} bytes)"
  fi
fi

log "Cleanup complete"

# Output success feedback
cat << EOF
{
  "feedback": "🧹 Nettoyage effectué : sessions, logs, états temporaires"
}
EOF

exit 0
