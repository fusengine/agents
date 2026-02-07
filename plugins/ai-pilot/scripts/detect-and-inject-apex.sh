#!/bin/bash
# detect-and-inject-apex.sh - UserPromptSubmit hook for ai-pilot
# Detects development tasks and injects APEX methodology instruction
# Auto-initializes APEX tracking if needed

set -e

INPUT=$(cat)
PROMPT=$(echo "$INPUT" | jq -r '.prompt // empty')
PROMPT_LOWER=$(echo "$PROMPT" | tr '[:upper:]' '[:lower:]')

# Check if /apex command is explicitly called
APEX_COMMAND=false
if echo "$PROMPT_LOWER" | grep -qE "(^|[[:space:]])/apex|/fuse-ai-pilot:apex"; then
  APEX_COMMAND=true

  # Create tracking IMMEDIATELY when /apex is called
  APEX_DIR="${PWD}/.claude/apex"
  TASK_FILE="$APEX_DIR/task.json"

  if [[ ! -f "$TASK_FILE" ]]; then
    # Call init-apex-tracking.sh to create full structure (task.json + AGENTS.md)
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    bash "$SCRIPT_DIR/init-apex-tracking.sh" "1"
  fi
fi

# Keywords that trigger APEX methodology
DEV_KEYWORDS="implement|create|build|fix|add|refactor|develop|feature|bug|update|modify|change|write|code"

# Check if prompt contains development keywords OR /apex command
if echo "$PROMPT_LOWER" | grep -qiE "($DEV_KEYWORDS)" || [[ "$APEX_COMMAND" == "true" ]]; then

  # Detect project type from current directory
  PROJECT_TYPE="generic"

  # JavaScript/TypeScript frameworks
  if [[ -f "next.config.js" ]] || [[ -f "next.config.ts" ]] || [[ -f "next.config.mjs" ]]; then
    PROJECT_TYPE="nextjs"
  elif [[ -f "nuxt.config.ts" ]] || [[ -f "nuxt.config.js" ]]; then
    PROJECT_TYPE="nuxt"
  elif [[ -f "angular.json" ]]; then
    PROJECT_TYPE="angular"
  elif [[ -f "svelte.config.js" ]] || [[ -f "svelte.config.ts" ]]; then
    PROJECT_TYPE="svelte"
  elif [[ -f "vue.config.js" ]] || [[ -f "vite.config.ts" && -f "src/App.vue" ]]; then
    PROJECT_TYPE="vue"
  elif [[ -f "vite.config.ts" ]] || [[ -f "vite.config.js" ]]; then
    PROJECT_TYPE="react"
  elif [[ -f "tailwind.config.js" ]] || [[ -f "tailwind.config.ts" ]]; then
    PROJECT_TYPE="tailwind"
  # Backend frameworks
  elif [[ -f "composer.json" ]] && [[ -f "artisan" ]]; then
    PROJECT_TYPE="laravel"
  elif [[ -f "Gemfile" ]] && [[ -f "config/routes.rb" ]]; then
    PROJECT_TYPE="rails"
  elif [[ -f "requirements.txt" ]] || [[ -f "pyproject.toml" ]] || [[ -f "setup.py" ]]; then
    if [[ -f "manage.py" ]]; then
      PROJECT_TYPE="django"
    elif [[ -f "app.py" ]] || [[ -f "main.py" ]]; then
      PROJECT_TYPE="python"
    else
      PROJECT_TYPE="python"
    fi
  # Systems languages
  elif [[ -f "go.mod" ]]; then
    PROJECT_TYPE="go"
  elif [[ -f "Cargo.toml" ]]; then
    PROJECT_TYPE="rust"
  elif [[ -f "Package.swift" ]] || ls *.xcodeproj 1>/dev/null 2>&1; then
    PROJECT_TYPE="swift"
  # JVM languages
  elif [[ -f "pom.xml" ]] || [[ -f "build.gradle" ]] || [[ -f "build.gradle.kts" ]]; then
    PROJECT_TYPE="java"
  elif [[ -f "build.sbt" ]]; then
    PROJECT_TYPE="scala"
  # Other
  elif [[ -f "mix.exs" ]]; then
    PROJECT_TYPE="elixir"
  elif [[ -f "Gemfile" ]]; then
    PROJECT_TYPE="ruby"
  fi

  # Map project type to expert agent
  case "$PROJECT_TYPE" in
    nextjs) EXPERT_AGENT="fuse-nextjs:nextjs-expert" ;;
    react) EXPERT_AGENT="fuse-react:react-expert" ;;
    laravel) EXPERT_AGENT="fuse-laravel:laravel-expert" ;;
    swift) EXPERT_AGENT="fuse-swift-apple-expert:swift-expert" ;;
    tailwind) EXPERT_AGENT="fuse-tailwindcss:tailwindcss-expert" ;;
    vue|nuxt) EXPERT_AGENT="frontend-mobile-development:frontend-developer" ;;
    angular|svelte) EXPERT_AGENT="frontend-mobile-development:frontend-developer" ;;
    go) EXPERT_AGENT="general-purpose" ;;
    rust) EXPERT_AGENT="general-purpose" ;;
    python|django) EXPERT_AGENT="general-purpose" ;;
    java|scala) EXPERT_AGENT="general-purpose" ;;
    ruby|rails) EXPERT_AGENT="general-purpose" ;;
    *) EXPERT_AGENT="general-purpose" ;;
  esac

  # Output instruction to use APEX
  # NOTE: Tracking status is shown by PreToolUse hooks when writing code
  cat << EOF
INSTRUCTION: This is a development task. Use APEX methodology:

**TRACKING FILE**: [project]/.claude/apex/task.json (auto-created on first Write/Edit)

1. **ANALYZE** (MANDATORY - 3 AGENTS IN PARALLEL):
   - Launch explore-codebase agent (architecture)
   - Launch research-expert agent (documentation)
   - Launch $EXPERT_AGENT agent (framework expertise)
   - Project type detected: $PROJECT_TYPE

2. **PLAN**: Use TaskCreate to break down tasks (<100 lines per file)

3. **EXECUTE**: Use $EXPERT_AGENT, follow SOLID principles, split at 90 lines

4. **EXAMINE**: Run sniper agent after ANY modification

Expert agent for this project: $EXPERT_AGENT
Framework references: references/$PROJECT_TYPE/

**IMPORTANT**: Read .claude/apex/task.json to check documentation status before writing code.
EOF

fi

exit 0
