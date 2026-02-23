#!/bin/bash
# fetch-changelog.sh - Fetch Claude Code changelog and detect new versions
set -euo pipefail

DOCS_BASE="https://code.claude.com/docs/en"
STATE_DIR="$HOME/.claude/logs/00-changelog"
mkdir -p "$STATE_DIR"
TODAY=$(date +%Y-%m-%d)
STATE_FILE="$STATE_DIR/${TODAY}-state.json"

# Fetch changelog page via curl
CHANGELOG=$(curl -sL "${DOCS_BASE}/changelog.md" 2>/dev/null || echo "FETCH_FAILED")

if [[ "$CHANGELOG" == "FETCH_FAILED" ]]; then
  echo '{"status":"error","message":"Failed to fetch changelog"}'
  exit 1
fi

# Extract version numbers (pattern: ## X.Y.Z or ## vX.Y.Z)
VERSIONS=$(echo "$CHANGELOG" | grep -oE '## v?[0-9]+\.[0-9]+\.[0-9]+' | head -10 | sed 's/## v\?//')

# Get last known version from state
LAST_KNOWN=""
if [[ -f "$STATE_FILE" ]] && jq -e . "$STATE_FILE" >/dev/null 2>&1; then
  LAST_KNOWN=$(jq -r '.last_version // ""' "$STATE_FILE")
fi

LATEST=$(echo "$VERSIONS" | head -1)
NEW_COUNT=0
if [[ -n "$LAST_KNOWN" ]] && [[ -n "$LATEST" ]]; then
  NEW_COUNT=$(echo "$VERSIONS" | while read -r v; do
    [[ "$v" == "$LAST_KNOWN" ]] && break; echo "$v"
  done | wc -l | tr -d ' ')
fi

# Save state
jq -n --arg latest "$LATEST" --arg last "$LAST_KNOWN" \
  --argjson new "$NEW_COUNT" --arg date "$TODAY" \
  '{last_version:$latest,previous:$last,new_versions:$new,checked:$date}' > "$STATE_FILE"

# Output
jq -n --arg latest "$LATEST" --argjson new "$NEW_COUNT" \
  --arg versions "$(echo "$VERSIONS" | tr '\n' ',')" \
  '{latest:$latest,new_since_last_check:$new,recent_versions:($versions|split(",")[:-1])}'
