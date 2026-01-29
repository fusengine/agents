#!/bin/bash
# Cleanup old session state files on session start

# Cleanup /tmp/claude-code-sessions older than 24 hours
STATE_DIR="/tmp/claude-code-sessions"
if [ -d "$STATE_DIR" ]; then
  find "$STATE_DIR" -name "session-*.json" -mtime +1 -delete 2>/dev/null
fi

# Cleanup old code change state files (older than 6 hours)
if [ -f "/tmp/claude-code-changes-$USER.json" ]; then
  if [ "$(find "/tmp/claude-code-changes-$USER.json" -mmin +360 2>/dev/null)" ]; then
    rm "/tmp/claude-code-changes-$USER.json" 2>/dev/null
  fi
fi

# Log rotation (keep logs < 10MB)
LOG_FILE="$HOME/.claude/logs/hooks.log"
if [ -f "$LOG_FILE" ]; then
  LOG_SIZE=$(stat -f%z "$LOG_FILE" 2>/dev/null || stat -c%s "$LOG_FILE" 2>/dev/null || echo 0)
  if [ "$LOG_SIZE" -gt 10485760 ]; then
    tail -n 5000 "$LOG_FILE" > "${LOG_FILE}.tmp"
    mv "${LOG_FILE}.tmp" "$LOG_FILE"
  fi
fi

exit 0
