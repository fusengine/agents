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

  APEX_INSTRUCTION="INSTRUCTION: This is a development task. Use APEX methodology:\n\n1. **ANALYZE** (MANDATORY FIRST):\n   - Launch explore-codebase agent to understand architecture\n   - Launch research-expert agent to verify documentation\n   - Project type detected: ${PROJECT_TYPE}\n\n2. **PLAN**: Use TodoWrite to break down tasks (<100 lines per file)\n\n3. **EXECUTE**: Follow SOLID principles, split at 90 lines\n\n4. **EXAMINE**: Run sniper agent after ANY modification\n\nLoad skill: /apex or Read skills/apex/SKILL.md\n\nFramework references: references/${PROJECT_TYPE}/"

  log "APEX auto-triggered for dev task (project: $PROJECT_TYPE)"
fi

# Construire le contexte final
FULL_CONTEXT=$(echo -e "# CLAUDE.md\n$CLAUDE_CONTENT")
if [ -n "$APEX_INSTRUCTION" ]; then
  FULL_CONTEXT=$(echo -e "$FULL_CONTEXT\n\n$APEX_INSTRUCTION")
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
