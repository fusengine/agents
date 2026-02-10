#!/bin/bash
# cache-doc-result.sh - PostToolUse hook
# Captures Context7/Exa doc results into local cache. No set -e: graceful degradation.
INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty' 2>/dev/null)

case "$TOOL_NAME" in
  *context7__query-docs) ;;
  *exa__get_code_context*) ;;
  *exa__web_search*) ;;
  *) exit 0 ;;
esac

# Cross-platform hash (same as explore-cache-check.sh)
hash_text() {
  if command -v sha256sum &>/dev/null; then
    sha256sum | cut -d' ' -f1 | cut -c1-16
  elif command -v shasum &>/dev/null; then
    shasum -a 256 | cut -d' ' -f1 | cut -c1-16
  else
    md5 | cut -c1-16
  fi
}

# Extract fields
LIBRARY_ID=$(echo "$INPUT" | jq -r '.tool_input.libraryId // .tool_input.query // empty' 2>/dev/null)
TOPIC=$(echo "$INPUT" | jq -r '.tool_input.topic // .tool_input.query // empty' 2>/dev/null)
DOC_CONTENT=$(echo "$INPUT" | jq -r '.tool_output // empty' 2>/dev/null)
[[ -z "$LIBRARY_ID" || -z "$DOC_CONTENT" ]] && exit 0

PROJECT_PATH="${CLAUDE_PROJECT_DIR:-${PWD}}"
PROJECT_HASH=$(echo -n "$PROJECT_PATH" | hash_text)
DOC_HASH=$(echo -n "${LIBRARY_ID}:${TOPIC}" | hash_text)

CACHE_DIR="$HOME/.claude/fusengine-cache/doc/$PROJECT_HASH"
DOCS_DIR="$CACHE_DIR/docs"
INDEX_FILE="$CACHE_DIR/index.json"
LOCK_DIR="$CACHE_DIR/.cache.lock"
mkdir -p "$DOCS_DIR"

DOC_CONTENT=$(echo "$DOC_CONTENT" | head -c 20480)  # 20KB max

# Atomic lock (same as track-doc-consultation.sh)
acquire_lock() {
  local max_wait=5 waited=0
  while ! mkdir "$LOCK_DIR" 2>/dev/null; do
    sleep 0.1
    waited=$((waited + 1))
    [[ $waited -gt $((max_wait * 10)) ]] && return 1
  done
  trap 'rmdir "$LOCK_DIR" 2>/dev/null' EXIT
  return 0
}

acquire_lock || exit 0

echo "$DOC_CONTENT" > "$DOCS_DIR/${DOC_HASH}.md"
SIZE_KB=$(( $(echo "$DOC_CONTENT" | wc -c) / 1024 ))
TIMESTAMP=$(date +%Y-%m-%dT%H:%M:%S)
if [[ -f "$INDEX_FILE" ]] && jq -e . "$INDEX_FILE" >/dev/null 2>&1; then
  INDEX=$(cat "$INDEX_FILE")
else
  INDEX=$(jq -n --arg p "$PROJECT_PATH" '{"project":$p,"docs":[]}')
fi

INDEX=$(echo "$INDEX" | jq \
  --arg h "$DOC_HASH" --arg lib "$LIBRARY_ID" \
  --arg top "$TOPIC" --arg ts "$TIMESTAMP" \
  --argjson sz "$SIZE_KB" \
  '(.docs |= map(select(.hash != $h))) |
   .docs += [{"hash":$h,"library":$lib,"topic":$top,"timestamp":$ts,"size_kb":$sz}]')

NOW=$(date +%s)  # TTL: remove docs older than 7 days
INDEX=$(echo "$INDEX" | jq --argjson now "$NOW" '
  .docs |= map(select(
    ($now - ((.timestamp + "Z") | fromdateiso8601? // $now)) < 604800
  ))')

OVERFLOW=$(echo "$INDEX" | jq '.docs | length - 15' 2>/dev/null)  # Cap at 15 docs
if [[ "$OVERFLOW" -gt 0 ]] 2>/dev/null; then
  STALE=$(echo "$INDEX" | jq -r "[.docs | sort_by(.timestamp)[:$OVERFLOW][].hash] | .[]")
  for h in $STALE; do
    rm -f "$DOCS_DIR/${h}.md"
  done
  INDEX=$(echo "$INDEX" | jq ".docs |= sort_by(.timestamp) | .docs |= .[-15:]")
fi

echo "$INDEX" | jq '.' > "$INDEX_FILE"
exit 0
