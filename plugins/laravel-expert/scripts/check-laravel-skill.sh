#!/bin/bash
# check-laravel-skill.sh - PreToolUse hook for laravel-expert
# Blocks Write/Edit on Laravel files if no skill was consulted

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

CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')

# Check for Laravel specific patterns
if echo "$CONTENT" | grep -qE "(Illuminate\\\\|use App\\\\|extends Controller|extends Model|Route::|Livewire|Blade::)"; then
  cat << 'EOF'
{
  "decision": "block",
  "reason": "⚠️ SKILL REQUIRED: Before writing Laravel code, you MUST consult a skill first.\n\nINSTRUCTION: Read one of these skills:\n- skills/laravel-eloquent/SKILL.md (Models)\n- skills/laravel-controllers/SKILL.md (Controllers)\n- skills/laravel-livewire/SKILL.md (Livewire)\n- skills/laravel-testing/SKILL.md (Pest tests)\n- skills/solid-laravel/SKILL.md (architecture)\n\nThen retry your Write/Edit operation."
}
EOF
  exit 2
fi

exit 0
