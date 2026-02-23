#!/bin/bash
# check-solid-from-transcript.sh - SubagentStop hook
# Checks SOLID compliance on files written/edited by subagents
# PostToolUse doesn't fire in subagents, so we validate at SubagentStop

INPUT=$(cat)
TRANSCRIPT=$(echo "$INPUT" | jq -r '.agent_transcript_path // empty' 2>/dev/null)
[[ -z "$TRANSCRIPT" || ! -f "$TRANSCRIPT" ]] && exit 0

# Extract file paths from Write/Edit tool_use in transcript
FILES=$(jq -r '.message.content[]? | select(.type=="tool_use") |
  select(.name=="Write" or .name=="Edit") |
  .input.file_path // empty' "$TRANSCRIPT" 2>/dev/null | sort -u)

[[ -z "$FILES" ]] && exit 0

VIOLATIONS=""
while IFS= read -r FILE_PATH; do
  [[ -z "$FILE_PATH" || ! -f "$FILE_PATH" ]] && continue
  # Only check code files
  [[ ! "$FILE_PATH" =~ \.(ts|tsx|js|jsx|py|php|swift|go|rs|rb|java)$ ]] && continue

  LINE_COUNT=$(grep -v '^\s*$' "$FILE_PATH" | grep -v '^\s*//' | grep -v '^\s*#' | grep -v '^\s*\*' | wc -l | tr -d ' ')

  if [[ $LINE_COUNT -gt 100 ]]; then
    VIOLATIONS="${VIOLATIONS}SOLID: ${FILE_PATH##*/} = ${LINE_COUNT} lines (max 100)\n"
  fi

  # Check interface location
  case "$FILE_PATH" in
    *components/*|*pages/*|*views/*|*app/*)
      if grep -qE "^(export )?(interface|type) [A-Z]" "$FILE_PATH" 2>/dev/null; then
        VIOLATIONS="${VIOLATIONS}SOLID: ${FILE_PATH##*/} has interfaces (move to interfaces/)\n"
      fi ;;
  esac
done <<< "$FILES"

[[ -z "$VIOLATIONS" ]] && exit 0

# Inject violations as context for the parent session
WARN="## SOLID VIOLATIONS DETECTED (subagent output)
$(echo -e "$VIOLATIONS")
Run sniper to fix these issues."

ESCAPED=$(echo "$WARN" | jq -Rs '.' 2>/dev/null || echo '""')
cat << EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SubagentStop",
    "additionalContext": $ESCAPED
  }
}
EOF
