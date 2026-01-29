#!/bin/bash
# read-claude-md.sh - UserPromptSubmit hook
# Injects CLAUDE.md as JSON additionalContext + detects APEX triggers

CLAUDE_MD="$HOME/.claude/CLAUDE.md"
[[ ! -f "$CLAUDE_MD" ]] && exit 0

# Detect APEX triggers from user prompt
INPUT=$(cat)
USER_PROMPT=$(echo "$INPUT" | jq -r '.user_prompt // empty' 2>/dev/null)

APEX_MSG=""
APEX_KEYWORDS="(crée|créer|ajoute|ajouter|implémente|implémenter|refactor|migrate|new feature|add|create|implement|build)"
if echo "$USER_PROMPT" | grep -qiE "$APEX_KEYWORDS"; then
  APEX_MSG="APEX TRIGGERED: Use /fuse-ai-pilot:apex methodology for this task\n\n"
fi

# Read CLAUDE.md and escape for JSON
CONTENT=$(cat "$CLAUDE_MD")
FULL_CONTENT="${APEX_MSG}${CONTENT}"
ESCAPED=$(echo -e "$FULL_CONTENT" | jq -Rs .)

cat << EOF
{
  "additionalContext": $ESCAPED
}
EOF

exit 0
