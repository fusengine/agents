#!/bin/bash
# enforce-apex-phases.sh - PreToolUse hook for ai-pilot
# Warns if APEX Analyze phase was skipped before coding

set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check for Write/Edit tools
if [[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]]; then
  exit 0
fi

# Only check code files
if [[ ! "$FILE_PATH" =~ \.(ts|tsx|js|jsx|py|php|swift|go|rs|rb|java)$ ]]; then
  exit 0
fi

# Output reminder about APEX phases
# Note: We use exit 0 to allow but with warning (not blocking)
cat << 'EOF'
⚠️ APEX REMINDER: Before writing code, ensure you have:

□ ANALYZE: Ran explore-codebase + research-expert
□ PLAN: Used TodoWrite to break down tasks
□ FILES: Each file planned for <100 lines

If you skipped Analyze phase, STOP and run:
1. Task(explore-codebase) - understand architecture
2. Task(research-expert) - verify documentation

Then continue with your Write/Edit.
EOF

exit 0
