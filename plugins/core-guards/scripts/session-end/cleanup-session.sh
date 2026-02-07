#!/bin/bash
# cleanup-session.sh - Clean temp files on session end
# Hook: SessionEnd - Triggered when user closes the session

# Clean stale session tracking files
TRACKING_DIR="/tmp/claude-session"
if [ -d "$TRACKING_DIR" ]; then
  find "$TRACKING_DIR" -name "*.tmp" -mmin +60 -delete 2>/dev/null
fi

# Clean stale SOLID read tracking
find /tmp -maxdepth 1 -name "claude_solid_reads_*" -mmin +120 -delete 2>/dev/null
find /tmp -maxdepth 1 -name "claude_session_changes_*" -mmin +120 -delete 2>/dev/null

exit 0
