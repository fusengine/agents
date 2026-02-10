#!/bin/bash
# doc-cache-inject.sh - SubagentStart hook for research-expert cache
# Injects cached documentation summaries into research-expert context
# Doc saving is handled by cache-doc-from-transcript.sh (SubagentStop)

INPUT=$(cat)
AGENT_TYPE=$(echo "$INPUT" | jq -r '.agent_type // empty' 2>/dev/null)
[[ -z "$AGENT_TYPE" || "$AGENT_TYPE" != *"research-expert"* ]] && exit 0

hash_text() {
  if command -v sha256sum &>/dev/null; then
    sha256sum | cut -d' ' -f1 | cut -c1-16
  elif command -v shasum &>/dev/null; then
    shasum -a 256 | cut -d' ' -f1 | cut -c1-16
  else
    md5 | cut -c1-16
  fi
}

cache_age() {
  local ts="$1" cached_epoch
  if [[ "$(uname)" == "Darwin" ]]; then
    cached_epoch=$(date -j -f "%Y-%m-%dT%H:%M:%S" "${ts%Z}" +%s 2>/dev/null || echo 0)
  else
    cached_epoch=$(date -d "$ts" +%s 2>/dev/null || echo 0)
  fi
  echo $(( $(date +%s) - cached_epoch ))
}

PROJECT_PATH="${CLAUDE_PROJECT_DIR:-${PWD}}"
HASH=$(echo -n "$PROJECT_PATH" | hash_text)
CACHE_DIR="$HOME/.claude/fusengine-cache/doc/$HASH"
INDEX="$CACHE_DIR/index.json"
DOCS_DIR="$CACHE_DIR/docs"
TTL=604800  # 7 days
MAX_SIZE=8192  # 8KB cap

[[ ! -f "$INDEX" ]] && exit 0

CACHE_CTX=""
DOC_COUNT=0
MAX_AGE=0
ENTRIES=$(jq -c '.docs // [] | .[]' "$INDEX" 2>/dev/null) || exit 0

while IFS= read -r entry; do
  [[ -z "$entry" ]] && continue
  CACHED_TS=$(echo "$entry" | jq -r '.timestamp // empty' 2>/dev/null)
  [[ -z "$CACHED_TS" ]] && continue
  AGE=$(cache_age "$CACHED_TS")
  [[ "$AGE" -ge "$TTL" ]] && continue
  [[ "$AGE" -gt "$MAX_AGE" ]] && MAX_AGE="$AGE"
  LIBRARY=$(echo "$entry" | jq -r '.library // "unknown"' 2>/dev/null)
  TOPIC=$(echo "$entry" | jq -r '.topic // "general"' 2>/dev/null)
  DOC_HASH=$(echo "$entry" | jq -r '.hash // empty' 2>/dev/null)
  [[ -z "$DOC_HASH" ]] && continue
  DOC_FILE="$DOCS_DIR/${DOC_HASH}.md"
  [[ ! -f "$DOC_FILE" ]] && continue
  PREVIEW=$(head -30 "$DOC_FILE" 2>/dev/null)
  [[ -z "$PREVIEW" ]] && continue
  CACHE_CTX+="
### ${LIBRARY} - ${TOPIC}
${PREVIEW}

"
  DOC_COUNT=$((DOC_COUNT + 1))
done <<< "$ENTRIES"

[[ "$DOC_COUNT" -eq 0 ]] && exit 0

bash "${CLAUDE_PLUGIN_ROOT}/scripts/cache-analytics-log.sh" doc hit "{\"docs_injected\":$DOC_COUNT}" &>/dev/null &

AGE_H=$(( (MAX_AGE + 3599) / 3600 ))
HEADER="## CACHED DOCUMENTATION (${DOC_COUNT} docs, ${AGE_H}h ago)
Use this knowledge. Only query Context7 for topics NOT covered below.
"
CACHE_CTX="${HEADER}${CACHE_CTX}Full docs: ${DOCS_DIR}/"
CACHE_CTX="${CACHE_CTX:0:$MAX_SIZE}"

if ! ESCAPED=$(echo "$CACHE_CTX" | jq -Rs '.' 2>/dev/null); then
  ESCAPED='""'
fi
cat << EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SubagentStart",
    "additionalContext": $ESCAPED
  }
}
EOF
