#!/bin/bash
# check-swift-skill.sh - PreToolUse hook for swift-apple-expert
# Blocks Write/Edit on Swift files if no skill was consulted

set -e

INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only check for Write/Edit tools
if [[ "$TOOL_NAME" != "Write" && "$TOOL_NAME" != "Edit" ]]; then
  exit 0
fi

# Only check Swift files
if [[ ! "$FILE_PATH" =~ \.swift$ ]]; then
  exit 0
fi

CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')

# Check for Swift/SwiftUI patterns
if echo "$CONTENT" | grep -qE "(import SwiftUI|import UIKit|@Observable|@State|@Binding|struct.*View|actor |async |await )"; then
  cat << 'EOF'
{
  "decision": "block",
  "reason": "⚠️ SKILL REQUIRED: Before writing Swift code, you MUST consult a skill first.\n\nINSTRUCTION: Read one of these skills:\n- skills/swiftui-components/SKILL.md (SwiftUI views)\n- skills/swift-concurrency/SKILL.md (async/await, actors)\n- skills/swift-architecture/SKILL.md (MVVM, DI)\n- skills/swiftui-data/SKILL.md (SwiftData, Core Data)\n- skills/solid-swift/SKILL.md (SOLID principles)\n\nThen retry your Write/Edit operation."
}
EOF
  exit 2
fi

exit 0
