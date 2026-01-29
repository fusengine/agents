#!/bin/bash
# read-claude-md.sh - UserPromptSubmit hook
# Injects CLAUDE.md as PLAIN TEXT (not JSON) for mandatory instructions

CLAUDE_MD="$HOME/.claude/CLAUDE.md"
[[ ! -f "$CLAUDE_MD" ]] && exit 0

# Detect APEX triggers from user prompt
INPUT=$(cat)
USER_PROMPT=$(echo "$INPUT" | jq -r '.user_prompt // empty' 2>/dev/null)

APEX_KEYWORDS="(crée|créer|ajoute|ajouter|implémente|implémenter|refactor|migrate|new feature|add|create|implement|build)"
if echo "$USER_PROMPT" | grep -qiE "$APEX_KEYWORDS"; then
  echo "⚠️ APEX TRIGGERED: Use /fuse-ai-pilot:apex methodology for this task"
  echo ""
fi

# Output CLAUDE.md as PLAIN TEXT (visible in transcript, treated as instruction)
echo "=== MANDATORY INSTRUCTIONS (from ~/.claude/CLAUDE.md) ==="
cat "$CLAUDE_MD"
echo "=== END MANDATORY INSTRUCTIONS ==="

exit 0
