#!/bin/bash
# test-cache-inject.sh - SubagentStart hook for sniper
# Injects cached test results: tells sniper which files changed vs unchanged.
# SAFE: Never crashes parent hook. All errors → graceful degradation.

INPUT=$(cat)
AGENT_TYPE=$(echo "$INPUT" | jq -r '.agent_type // empty' 2>/dev/null)
[[ -z "$AGENT_TYPE" || "$AGENT_TYPE" != *"sniper"* ]] && exit 0

hash_text() {
  if command -v sha256sum &>/dev/null; then sha256sum | cut -d' ' -f1 | cut -c1-16
  elif command -v shasum &>/dev/null; then shasum -a 256 | cut -d' ' -f1 | cut -c1-16
  else md5 | cut -c1-16; fi
}

PROJECT_PATH="${CLAUDE_PROJECT_DIR:-${PWD}}"
PROJECT_HASH=$(echo -n "$PROJECT_PATH" | hash_text)
CACHE_DIR="$HOME/.claude/fusengine-cache/tests/$PROJECT_HASH"
RESULTS="$CACHE_DIR/results.json"
TTL=172800  # 48 hours

# No cache → nothing to inject
[[ ! -f "$RESULTS" ]] && exit 0

# Parse cached files list
CACHED_FILES=$(jq -r '.files // {} | keys[]' "$RESULTS" 2>/dev/null)
[[ -z "$CACHED_FILES" ]] && exit 0

# Collect current source files (max 200, timeout 5s)
SRC_FILES=$(timeout 5 find "$PROJECT_PATH/src" \
  -maxdepth 6 -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
  2>/dev/null | head -200)
[[ -z "$SRC_FILES" ]] && exit 0

CHANGED=""
UNCHANGED=0
TOTAL=0

while IFS= read -r filepath; do
  TOTAL=$((TOTAL + 1))
  REL_PATH="${filepath#"$PROJECT_PATH"/}"
  CACHED_SUM=$(jq -r --arg f "$REL_PATH" '.files[$f].checksum // empty' "$RESULTS" 2>/dev/null)
  [[ -z "$CACHED_SUM" ]] && { CHANGED="${CHANGED}\n- ${REL_PATH}"; continue; }

  # Compute current checksum
  CURRENT_SUM=$(shasum -a 256 "$filepath" 2>/dev/null | cut -d' ' -f1 | cut -c1-16)
  if [[ "$CURRENT_SUM" == "$CACHED_SUM" ]]; then
    # Check TTL on cached entry
    CACHED_TS=$(jq -r --arg f "$REL_PATH" '.files[$f].last_tested // empty' "$RESULTS" 2>/dev/null)
    if [[ -n "$CACHED_TS" ]]; then
      if [[ "$(uname)" == "Darwin" ]]; then
        CACHED_EPOCH=$(date -j -f "%Y-%m-%dT%H:%M:%S" "${CACHED_TS%Z}" +%s 2>/dev/null || echo 0)
      else
        CACHED_EPOCH=$(date -d "$CACHED_TS" +%s 2>/dev/null || echo 0)
      fi
      AGE=$(( $(date +%s) - CACHED_EPOCH ))
      [[ "$AGE" -gt "$TTL" ]] && { CHANGED="${CHANGED}\n- ${REL_PATH}"; continue; }
    fi
    UNCHANGED=$((UNCHANGED + 1))
  else
    CHANGED="${CHANGED}\n- ${REL_PATH}"
  fi
done <<< "$SRC_FILES"

# Nothing useful to inject
[[ "$UNCHANGED" -eq 0 ]] && exit 0

CHANGED_LIST=$(echo -e "$CHANGED" | grep -v '^$')
CHANGED_COUNT=$((TOTAL - UNCHANGED))

CACHE_CTX="## TEST CACHE (${UNCHANGED}/${TOTAL} files already validated)
Only run linters on these CHANGED files:
${CHANGED_LIST}
SKIP linting on ${UNCHANGED} unchanged files - already PASS."

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
