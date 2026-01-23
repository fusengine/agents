#!/bin/bash
# enforce-apex-phases.sh - PreToolUse hook for ai-pilot
# BLOCKS direct Write/Edit on code - Forces delegation to expert agent
# APEX Phase E: "Use expert-agent" = delegate, not write directly

set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check for Write/Edit tools
if [[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]]; then
  exit 0
fi

# Only check code files
if [[ ! "$FILE_PATH" =~ \.(ts|tsx|js|jsx|py|php|swift|go|rs|rb|java|vue|svelte)$ ]]; then
  exit 0
fi

# Skip non-code directories
if [[ "$FILE_PATH" =~ /(node_modules|vendor|dist|build|\.next|DerivedData|Pods|\.build)/ ]]; then
  exit 0
fi

# Allow if running inside a subagent (expert-agent context)
# Check for marker file created by expert agents
if [[ -f "/tmp/.claude-expert-session-$$" ]] || [[ -f "/tmp/.claude-expert-active" ]]; then
  exit 0
fi

# Detect project type to suggest the right expert agent
EXPERT_AGENT="general-purpose"
if [[ "$FILE_PATH" =~ \.(tsx|jsx)$ ]]; then
  EXPERT_AGENT="fuse-react:react-expert"
elif [[ "$FILE_PATH" =~ \.swift$ ]]; then
  EXPERT_AGENT="fuse-swift-apple-expert:swift-expert"
elif [[ "$FILE_PATH" =~ \.php$ ]]; then
  EXPERT_AGENT="fuse-laravel:laravel-expert"
elif [[ "$FILE_PATH" =~ \.(ts|js)$ ]]; then
  # Could be React or Next.js - suggest React as default
  EXPERT_AGENT="fuse-react:react-expert"
fi

# BLOCK and force delegation
REASON="🚫 APEX PHASE E VIOLATION - Direct Write/Edit blocked!\n\n"
REASON+="You cannot write code directly. APEX Phase E requires delegation.\n\n"
REASON+="INSTEAD OF: Write/Edit directly\n"
REASON+="USE: Task(subagent_type='$EXPERT_AGENT', prompt='...')\n\n"
REASON+="Available expert agents:\n"
REASON+="  • fuse-react:react-expert (React, TypeScript, JavaScript)\n"
REASON+="  • fuse-nextjs:nextjs-expert (Next.js applications)\n"
REASON+="  • fuse-laravel:laravel-expert (Laravel PHP)\n"
REASON+="  • fuse-swift-apple-expert:swift-expert (Swift, SwiftUI)\n"
REASON+="  • fuse-tailwindcss:tailwindcss-expert (Tailwind CSS)\n"
REASON+="  • fuse-design:design-expert (UI/UX components)\n\n"
REASON+="The expert agent will:\n"
REASON+="  ✓ Consult documentation and skills\n"
REASON+="  ✓ Follow SOLID principles\n"
REASON+="  ✓ Keep files < 100 lines\n"
REASON+="  ✓ Write proper documentation\n\n"
REASON+="Delegate now with Task tool."

cat << EOF
{
  "decision": "block",
  "reason": "$REASON"
}
EOF
exit 2
