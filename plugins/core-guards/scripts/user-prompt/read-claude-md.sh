#!/bin/bash
# Hook UserPromptSubmit: Lit CLAUDE.md + détecte si APEX requis
# Auto-trigger APEX pour tâches de développement

CLAUDE_MD="$HOME/.claude/CLAUDE.md"
LOG_DIR="$HOME/.claude/logs"
LOG_FILE="$LOG_DIR/hooks.log"

mkdir -p "$LOG_DIR"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] [UserPromptSubmit/read-claude-md] $1" >> "$LOG_FILE"
}

# Lire le prompt utilisateur depuis stdin
INPUT=$(cat)
USER_PROMPT=$(echo "$INPUT" | jq -r '.userPrompt // empty' 2>/dev/null)

if [ ! -f "$CLAUDE_MD" ]; then
  log "ERROR: CLAUDE.md not found"
  exit 0
fi

# Lire CLAUDE.md
CLAUDE_CONTENT=$(cat "$CLAUDE_MD")
echo "claude memory: CLAUDE.md loaded" >&2

# Détecter si le prompt nécessite APEX (verbes d'action dev)
APEX_INSTRUCTION=""
if echo "$USER_PROMPT" | grep -qiE "(créer|creer|implémenter|implementer|ajouter|développer|developper|construire|build|refactor|migrer|implement|create|add|develop)"; then
  # Détecter le type de projet
  PROJECT_TYPE="generic"
  if [ -f "package.json" ]; then
    if grep -q "next" package.json 2>/dev/null; then
      PROJECT_TYPE="nextjs"
    elif grep -q "react" package.json 2>/dev/null; then
      PROJECT_TYPE="react"
    fi
  elif [ -f "composer.json" ] && [ -f "artisan" ]; then
    PROJECT_TYPE="laravel"
  elif [ -f "Package.swift" ] || ls *.xcodeproj 1>/dev/null 2>&1; then
    PROJECT_TYPE="swift"
  fi

  APEX_INSTRUCTION="INSTRUCTION: This is a development task. Use APEX methodology:\n\n**TRACKING FILE**: [project]/.claude/apex/task.json (auto-created on first Write/Edit)\n\n1. **ANALYZE** (MANDATORY - 3 AGENTS IN PARALLEL):\n   - Launch explore-codebase agent (architecture)\n   - Launch research-expert agent (documentation)\n   - Launch general-purpose agent (framework expertise)\n   - Project type detected: ${PROJECT_TYPE}\n\n2. **PLAN**: Use TaskCreate to break down tasks (<100 lines per file)\n\n3. **EXECUTE**: Use ${PROJECT_TYPE}-expert, follow SOLID principles, split at 90 lines\n\n4. **EXAMINE**: Run sniper agent after ANY modification\n\nExpert agent for this project: ${PROJECT_TYPE}-expert\nFramework references: references/${PROJECT_TYPE}/\n\n**IMPORTANT**: Read .claude/apex/task.json to check documentation status before writing code."

  log "APEX auto-triggered for dev task (project: $PROJECT_TYPE)"
fi

# Construire le contexte final
FULL_CONTEXT=$(echo -e "# CLAUDE.md\n$CLAUDE_CONTENT")
if [ -n "$APEX_INSTRUCTION" ]; then
  FULL_CONTEXT=$(echo -e "$APEX_INSTRUCTION\n\n$FULL_CONTEXT")
fi

ESCAPED_CONTENT=$(echo "$FULL_CONTEXT" | jq -Rs .)

cat << EOF
{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": $ESCAPED_CONTENT
  }
}
EOF

log "CLAUDE.md injected${APEX_INSTRUCTION:+ + APEX instruction}"
exit 0
