#!/bin/bash
# SessionStart: Inject CLAUDE.md as JSON additionalContext

CLAUDE_MD="$HOME/.claude/CLAUDE.md"
[[ ! -f "$CLAUDE_MD" ]] && exit 0

# Read and escape content for JSON
CONTENT=$(cat "$CLAUDE_MD" | jq -Rs .)

cat << EOF
{
  "additionalContext": $CONTENT
}
EOF

exit 0
