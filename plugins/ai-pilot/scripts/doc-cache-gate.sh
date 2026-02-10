#!/bin/bash
# doc-cache-gate.sh - PreToolUse hook
# BLOCKS Context7/Exa calls when doc is already cached in ~/.claude/fusengine-cache/doc/
# Graceful degradation: any error → allow call through

# No set -e: graceful degradation on any error
INPUT=$(cat)

TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty' 2>/dev/null)
[[ -z "$TOOL_NAME" ]] && exit 0

# Only gate Context7 query-docs and Exa get_code_context
case "$TOOL_NAME" in
  *context7__query-docs) ;;
  *exa__get_code_context*) ;;
  *exa__web_search*) ;;
  *) exit 0 ;;
esac

# Cross-platform hash command
hash_text() {
  if command -v sha256sum &>/dev/null; then
    sha256sum | cut -d' ' -f1 | cut -c1-16
  elif command -v shasum &>/dev/null; then
    shasum -a 256 | cut -d' ' -f1 | cut -c1-16
  else
    md5 | cut -c1-16
  fi
}

# Cross-platform age check (seconds since cached timestamp)
cache_age() {
  local ts="$1"
  local cached_epoch
  if [[ "$(uname)" == "Darwin" ]]; then
    cached_epoch=$(date -j -f "%Y-%m-%dT%H:%M:%S" "${ts%Z}" +%s 2>/dev/null || echo 0)
  else
    cached_epoch=$(date -d "$ts" +%s 2>/dev/null || echo 0)
  fi
  echo $(( $(date +%s) - cached_epoch ))
}

# Extract library and topic based on tool type
case "$TOOL_NAME" in
  *context7*)
    LIBRARY=$(echo "$INPUT" | jq -r '.tool_input.libraryId // empty' 2>/dev/null)
    TOPIC=$(echo "$INPUT" | jq -r '.tool_input.topic // empty' 2>/dev/null)
    ;;
  *exa*)
    QUERY=$(echo "$INPUT" | jq -r '.tool_input.query // empty' 2>/dev/null)
    LIBRARY="$QUERY"
    TOPIC="$QUERY"
    ;;
esac

[[ -z "$LIBRARY" || -z "$TOPIC" ]] && exit 0

# Compute hashes
PROJECT_PATH="${CLAUDE_PROJECT_DIR:-${PWD}}"
PROJECT_HASH=$(echo -n "$PROJECT_PATH" | hash_text)
DOC_HASH=$(echo -n "${LIBRARY}:${TOPIC}" | hash_text)

CACHE_DIR="$HOME/.claude/fusengine-cache/doc/$PROJECT_HASH"
DOC_FILE="$CACHE_DIR/docs/$DOC_HASH.md"
INDEX_FILE="$CACHE_DIR/index.json"

# Cache miss → allow call
[[ ! -f "$DOC_FILE" ]] && exit 0

# Check TTL from index.json (7 days = 604800 seconds)
TTL=604800
if [[ -f "$INDEX_FILE" ]]; then
  CACHED_TS=$(jq -r --arg h "$DOC_HASH" '.docs[] | select(.hash == $h) | .timestamp // empty' "$INDEX_FILE" 2>/dev/null)
  if [[ -n "$CACHED_TS" ]]; then
    AGE=$(cache_age "$CACHED_TS")
    # Expired → allow call
    [[ "$AGE" -ge "$TTL" ]] && exit 0
    AGE_H=$((AGE / 3600))
  else
    exit 0
  fi
else
  exit 0
fi

# Cache HIT → deny with reason
bash "${CLAUDE_PLUGIN_ROOT}/scripts/cache-analytics-log.sh" doc blocked "{\"library\":\"$LIBRARY\"}" &>/dev/null &
REASON="Doc already cached at $DOC_FILE (age: ${AGE_H}h). Use Read tool to access it."
jq -n --arg reason "$REASON" \
  '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":$reason}}'
exit 0
