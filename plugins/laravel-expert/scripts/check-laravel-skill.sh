#!/bin/bash
# check-laravel-skill.sh - PreToolUse hook for laravel-expert
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

  REASON="📚 LARAVEL CODE DETECTED - Documentation required.\n\n"
  REASON+="Consult ONE of these sources FIRST:\n\n"
  REASON+="LOCAL SKILLS:\n"
  REASON+="  • skills/laravel-eloquent/SKILL.md (Models, relationships)\n"
  REASON+="  • skills/laravel-architecture/SKILL.md (structure, patterns)\n"
  REASON+="  • skills/laravel-api/SKILL.md (API resources)\n"
  REASON+="  • skills/laravel-auth/SKILL.md (authentication)\n"
  REASON+="  • skills/laravel-livewire/SKILL.md (Livewire components)\n"
  REASON+="  • skills/laravel-blade/SKILL.md (Blade templates)\n"
  REASON+="  • skills/laravel-migrations/SKILL.md (database migrations)\n"
  REASON+="  • skills/laravel-queues/SKILL.md (jobs, queues)\n"
  REASON+="  • skills/laravel-testing/SKILL.md (Pest tests)\n"
  REASON+="  • skills/solid-php/SKILL.md (SOLID principles)\n\n"
  REASON+="ONLINE DOCUMENTATION:\n"
  REASON+="  • mcp__context7__resolve-library-id + mcp__context7__query-docs\n"
  REASON+="  • mcp__exa__get_code_context_exa (code examples)\n\n"
  REASON+="After consulting documentation, retry your Write/Edit."

  cat << EOF
{
  "decision": "continue",
  "reason": "$REASON"
}
EOF
  exit 0
fi

exit 0
