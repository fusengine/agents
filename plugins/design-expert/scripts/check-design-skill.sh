#!/bin/bash
# check-design-skill.sh - PreToolUse hook for design-expert
# Forces documentation consultation (smart detection)

set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check for Write/Edit tools
if [[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]]; then
  exit 0
fi

# Only check .tsx/.jsx/.css files
if [[ ! "$FILE_PATH" =~ \.(tsx|jsx|css)$ ]]; then
  exit 0
fi

# Skip non-code directories
if [[ "$FILE_PATH" =~ /(node_modules|dist|build|\.next)/ ]]; then
  exit 0
fi

CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')

# SMART DETECTION: UI/Design code
if echo "$CONTENT" | grep -qE "(className=|class=|cn\(|cva\(|clsx\()" || \
   echo "$CONTENT" | grep -qE "(flex|grid|bg-|text-|p-[0-9]|m-[0-9]|w-|h-|rounded|shadow|border)" || \
   echo "$CONTENT" | grep -qE "(forwardRef|displayName|variants|motion\.|animate|framer-motion)" || \
   echo "$CONTENT" | grep -qE "(@apply|@layer|@tailwind|--tw-)" || \
   echo "$CONTENT" | grep -qE "(Button|Card|Dialog|Modal|Input|Select|Dropdown|Menu|Toast|Alert)" || \
   [[ "$FILE_PATH" =~ \.(css)$ ]]; then

  PLUGINS_DIR="$HOME/.claude/plugins/marketplaces/fusengine-plugins/plugins"
  REASON="📚 UI/DESIGN CODE DETECTED. Read skills from: $PLUGINS_DIR/design-expert/skills/ (designing-systems, generating-components, adding-animations, validating-accessibility). Then retry Write/Edit."
  jq -n --arg reason "$REASON" '{"decision": "continue", "reason": $reason}'
  exit 0
fi

exit 0
