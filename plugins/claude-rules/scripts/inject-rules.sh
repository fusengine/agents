#!/bin/bash
# SessionStart: Inject all rules/*.md into session context
# Uses CLAUDE_PLUGIN_ROOT to find rules relative to plugin install path

set -euo pipefail

RULES_DIR="${CLAUDE_PLUGIN_ROOT}/rules"

if [[ ! -d "$RULES_DIR" ]]; then
  exit 0
fi

# Concatenate all rules files (sorted for consistent order)
CONTENT=""
COUNT=0
for rule in "$RULES_DIR"/*.md; do
  [[ -f "$rule" ]] || continue
  CONTENT+="$(cat "$rule")"$'\n\n'
  COUNT=$((COUNT + 1))
done

[[ $COUNT -eq 0 ]] && exit 0

# Visual feedback to user terminal
FILENAMES=$(cd "$RULES_DIR" && ls *.md 2>/dev/null | tr '\n' ', ' | sed 's/,$//')
echo "fuse rules: $COUNT rules loaded" >&2

# Escape for JSON and output
ESCAPED=$(echo "$CONTENT" | jq -Rs .)

cat << EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": $ESCAPED
  }
}
EOF
exit 0
