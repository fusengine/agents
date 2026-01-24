#!/bin/bash
# check-laravel-skill.sh - PreToolUse hook for laravel-expert
# Forces documentation consultation (smart detection)

set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check for Write/Edit tools
if [[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]]; then
  exit 0
fi

# Only check PHP files
if [[ ! "$FILE_PATH" =~ \.php$ ]]; then
  exit 0
fi

# Skip non-code directories
if [[ "$FILE_PATH" =~ /(vendor|storage|bootstrap/cache)/ ]]; then
  exit 0
fi

CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')

# SMART DETECTION: Laravel code
if echo "$CONTENT" | grep -qE "(Illuminate\\\\|use App\\\\|extends Controller|extends Model)" || \
   echo "$CONTENT" | grep -qE "(Route::|Livewire|Blade::|Eloquent|HasFactory)" || \
   echo "$CONTENT" | grep -qE "(artisan|migrate|seeder|factory|middleware)" || \
   echo "$CONTENT" | grep -qE "(Request \\\$request|Validator::|FormRequest)"; then

  PLUGINS_DIR="$HOME/.claude/plugins/marketplaces/fusengine-plugins/plugins"
  REASON="📚 LARAVEL CODE DETECTED. Read skills from: $PLUGINS_DIR/laravel-expert/skills/ (laravel-eloquent, laravel-architecture, laravel-api, laravel-auth, laravel-livewire, laravel-blade, solid-php). Then retry Write/Edit."
  jq -n --arg reason "$REASON" '{"decision": "continue", "reason": $reason}'
  exit 0
fi

exit 0
