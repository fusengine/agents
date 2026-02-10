#!/bin/bash
# save-doc.sh - Agent-callable script to save doc results to cache
# Usage: echo "doc content" | bash save-doc.sh "library-id" "topic"
# Called by research-expert after each Context7/Exa query

LIBRARY="$1"
TOPIC="$2"
[[ -z "$LIBRARY" || -z "$TOPIC" ]] && exit 0

DOC_CONTENT=$(cat)
[[ -z "$DOC_CONTENT" ]] && exit 0

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
PROJECT_HASH=$(echo -n "$PROJECT_PATH" | hash_text)
DOC_HASH=$(echo -n "${LIBRARY}:${TOPIC}" | hash_text)

CACHE_DIR="$HOME/.claude/fusengine-cache/doc/$PROJECT_HASH"
DOCS_DIR="$CACHE_DIR/docs"
INDEX_FILE="$CACHE_DIR/index.json"
LOCK_DIR="$CACHE_DIR/.cache.lock"
mkdir -p "$DOCS_DIR"

DOC_CONTENT=$(echo "$DOC_CONTENT" | head -c 20480)

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
  --arg h "$DOC_HASH" --arg lib "$LIBRARY" \
  --arg top "$TOPIC" --arg ts "$TIMESTAMP" \
  --argjson sz "$SIZE_KB" \
  '(.docs |= map(select(.hash != $h))) |
   .docs += [{"hash":$h,"library":$lib,"topic":$top,"timestamp":$ts,"size_kb":$sz}]')

echo "$INDEX" | jq '.' > "$INDEX_FILE"
echo "Cached: ${LIBRARY}:${TOPIC} → ${DOC_HASH}.md"
exit 0
