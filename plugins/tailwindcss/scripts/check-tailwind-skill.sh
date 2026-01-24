#!/bin/bash
# check-tailwind-skill.sh - PreToolUse hook for tailwindcss
# Marks expert context + Forces documentation consultation (smart detection)

set -e

# Mark that we're in expert agent context (allows bypass of ai-pilot block)
touch /tmp/.claude-expert-active

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check for Write/Edit tools
if [[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]]; then
  exit 0
fi

# Skip non-code directories
if [[ "$FILE_PATH" =~ /(node_modules|dist|build|\.next)/ ]]; then
  exit 0
fi

# Check Tailwind config files
if [[ "$FILE_PATH" =~ tailwind\.config\.(js|ts|mjs)$ ]]; then
  PLUGINS_DIR="$HOME/.claude/plugins/marketplaces/fusengine-plugins/plugins"
  REASON="📚 TAILWIND CONFIG DETECTED. Read skills from: $PLUGINS_DIR/tailwindcss/skills/ (tailwindcss-v4, tailwindcss-core, tailwindcss-custom-styles). Then retry Write/Edit."
  jq -n --arg reason "$REASON" '{"decision": "continue", "reason": $reason}'
  exit 0
fi

# Check CSS files
if [[ "$FILE_PATH" =~ \.css$ ]]; then
  CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')

  # SMART DETECTION: Tailwind CSS
  if echo "$CONTENT" | grep -qE "(@theme|@utility|@variant|@import|@config|--tw-)" || \
     echo "$CONTENT" | grep -qE "(@tailwind|@apply|@layer|@screen)" || \
     echo "$CONTENT" | grep -qE "(theme\(|config\()"; then

    PLUGINS_DIR="$HOME/.claude/plugins/marketplaces/fusengine-plugins/plugins"
    REASON="📚 TAILWIND CSS DETECTED. Read skills from: $PLUGINS_DIR/tailwindcss/skills/ (tailwindcss-v4, tailwindcss-core, tailwindcss-layout, tailwindcss-typography). Then retry Write/Edit."
    jq -n --arg reason "$REASON" '{"decision": "continue", "reason": $reason}'
    exit 0
  fi
fi

exit 0
