#!/bin/bash
# SessionStart: Inject CLAUDE.md via hookSpecificOutput

CLAUDE_MD="$HOME/.claude/CLAUDE.md"
[[ ! -f "$CLAUDE_MD" ]] && exit 0

# Read and escape content for JSON
CONTENT=$(cat "$CLAUDE_MD" | jq -Rs .)

cat << EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": $CONTENT
  }
}
EOF

exit 0
