#!/bin/bash
# explore-cache-check.sh - SubagentStart hook for explore-codebase cache
# Injects cached architecture via additionalContext or instructs agent to save
# SAFE: Never crashes parent hook. All errors → graceful degradation.

# No set -e: graceful degradation on any error
INPUT=$(cat)

AGENT_TYPE=$(echo "$INPUT" | jq -r '.agent_type // empty' 2>/dev/null)
[[ -z "$AGENT_TYPE" || "$AGENT_TYPE" != *"explore-codebase"* ]] && exit 0

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

# Generate project hash and config hash
PROJECT_PATH="${CLAUDE_PROJECT_DIR:-${PWD}}"
HASH=$(echo -n "$PROJECT_PATH" | hash_text)
CACHE_DIR="$HOME/.claude/fusengine-cache/explore/$HASH"
META="$CACHE_DIR/metadata.json"
SNAP="$CACHE_DIR/snapshot.md"
TTL=86400  # 24 hours

# Generate current config hash (config files that define architecture)
CONFIG_HASH=$(git ls-tree HEAD \
  package.json tsconfig.json composer.json go.mod Cargo.toml \
  Package.swift biome.json .eslintrc.js .eslintrc.json \
  2>/dev/null | hash_text || echo "noconfig")

CACHE_CTX=""

# Check cache
if [[ -f "$META" && -f "$SNAP" ]]; then
  CACHED_TS=$(jq -r '.timestamp // empty' "$META" 2>/dev/null)
  CACHED_HASH=$(jq -r '.config_hash // empty' "$META" 2>/dev/null)
  AGE=$(cache_age "$CACHED_TS")

  if [[ "$AGE" -lt "$TTL" && "$CONFIG_HASH" == "$CACHED_HASH" ]]; then
    CACHED_REPORT=$(cat "$SNAP" 2>/dev/null)
    AGE_MIN=$((AGE / 60))
    CACHE_CTX="## CACHED ARCHITECTURE AVAILABLE (age: ${AGE_MIN}min)
USE this cached report. Do NOT run full exploration. Return it immediately.

${CACHED_REPORT}"
    bash "${CLAUDE_PLUGIN_ROOT}/scripts/cache-analytics-log.sh" explore hit &>/dev/null &
  fi
fi

# Cache miss: instruct agent to save after exploration
if [[ -z "$CACHE_CTX" ]]; then
  bash "${CLAUDE_PLUGIN_ROOT}/scripts/cache-analytics-log.sh" explore miss &>/dev/null &
  CURRENT_TS=$(date +%Y-%m-%dT%H:%M:%S)
  CACHE_CTX="## EXPLORATION CACHE INSTRUCTIONS
After completing your exploration, save the report for future runs:
\`\`\`bash
mkdir -p $CACHE_DIR
cat > $META << 'METAEOF'
{\"timestamp\":\"${CURRENT_TS}\",\"config_hash\":\"${CONFIG_HASH}\",\"project\":\"${PROJECT_PATH}\"}
METAEOF
\`\`\`
Then write your full exploration report (markdown) to: $SNAP"
fi

# Output hook response
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
