#!/bin/bash
# cache-analytics-log.sh - Shared utility for cache analytics logging
# Appends a JSONL line to sessions.jsonl for cache hit/miss tracking
# SAFE: Never crashes parent hooks. All errors suppressed.

# Usage: bash cache-analytics-log.sh <type> <action> [extra_json_fields]
# type: explore|doc|lessons|tests
# action: hit|miss|blocked
# extra_json_fields: optional JSON object fields e.g. '{"docs_injected":3}'

TYPE="${1:-unknown}"
ACTION="${2:-unknown}"
EXTRA="${3:-}"

ANALYTICS_DIR="$HOME/.claude/fusengine-cache/analytics"
SESSIONS_FILE="$ANALYTICS_DIR/sessions.jsonl"

mkdir -p "$ANALYTICS_DIR" 2>/dev/null || exit 0

# Cross-platform hash
hash_text() {
  if command -v sha256sum &>/dev/null; then
    sha256sum | cut -d' ' -f1 | cut -c1-16
  elif command -v shasum &>/dev/null; then
    shasum -a 256 | cut -d' ' -f1 | cut -c1-16
  else
    md5 | cut -c1-16
  fi
}

PROJECT_PATH="${CLAUDE_PROJECT_DIR:-${PWD}}"
PROJECT_HASH=$(echo -n "$PROJECT_PATH" | hash_text 2>/dev/null || echo "unknown")
SESSION_ID="${CLAUDE_SESSION_ID:-$(date +%s)}"
TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date +%s)

# Build JSON line
BASE_JSON=$(jq -nc \
  --arg ts "$TIMESTAMP" \
  --arg session "$SESSION_ID" \
  --arg type "$TYPE" \
  --arg action "$ACTION" \
  --arg ph "$PROJECT_HASH" \
  '{ts:$ts,session:$session,type:$type,action:$action,project_hash:$ph}' \
  2>/dev/null) || exit 0

# Merge extra fields if provided
if [[ -n "$EXTRA" ]]; then
  MERGED=$(echo "$BASE_JSON" | jq -c ". + $EXTRA" 2>/dev/null) || MERGED="$BASE_JSON"
else
  MERGED="$BASE_JSON"
fi

echo "$MERGED" >> "$SESSIONS_FILE" 2>/dev/null
exit 0
