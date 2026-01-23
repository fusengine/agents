#!/bin/bash
# detect-and-inject-apex.sh - UserPromptSubmit hook for ai-pilot
# Detects development tasks and injects APEX methodology instruction

set -e

INPUT=$(cat)
PROMPT=$(echo "$INPUT" | jq -r '.prompt // empty' | tr '[:upper:]' '[:lower:]')

# Keywords that trigger APEX methodology
DEV_KEYWORDS="implement|create|build|fix|add|refactor|develop|feature|bug|update|modify|change|write|code"

# Check if prompt contains development keywords
if echo "$PROMPT" | grep -qiE "($DEV_KEYWORDS)"; then

  # Detect project type from current directory
  PROJECT_TYPE="generic"

  if [[ -f "next.config.js" ]] || [[ -f "next.config.ts" ]] || [[ -f "next.config.mjs" ]]; then
    PROJECT_TYPE="nextjs"
  elif [[ -f "composer.json" ]] && [[ -f "artisan" ]]; then
    PROJECT_TYPE="laravel"
  elif [[ -f "Package.swift" ]] || [[ -d "*.xcodeproj" ]]; then
    PROJECT_TYPE="swift"
  elif [[ -f "vite.config.ts" ]] || [[ -f "vite.config.js" ]]; then
    PROJECT_TYPE="react"
  fi

  # Output instruction to use APEX
  cat << EOF
INSTRUCTION: This is a development task. Use APEX methodology:

1. **ANALYZE** (MANDATORY FIRST):
   - Launch explore-codebase agent to understand architecture
   - Launch research-expert agent to verify documentation
   - Project type detected: $PROJECT_TYPE

2. **PLAN**: Use TodoWrite to break down tasks (<100 lines per file)

3. **EXECUTE**: Follow SOLID principles, split at 90 lines

4. **EXAMINE**: Run sniper agent after ANY modification

Load skill: /apex or Read skills/apex/SKILL.md

Framework references: references/$PROJECT_TYPE/
EOF

fi

exit 0
