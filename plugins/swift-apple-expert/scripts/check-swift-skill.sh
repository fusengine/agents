#!/bin/bash
# check-swift-skill.sh - PreToolUse hook for swift-apple-expert
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

# Only check Swift files
if [[ ! "$FILE_PATH" =~ \.swift$ ]]; then
  exit 0
fi

# Skip build directories
if [[ "$FILE_PATH" =~ /(\.build|DerivedData|Pods)/ ]]; then
  exit 0
fi

CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')

# SMART DETECTION: Swift/SwiftUI code
if echo "$CONTENT" | grep -qE "(import SwiftUI|import UIKit|import Foundation)" || \
   echo "$CONTENT" | grep -qE "(@Observable|@State|@Binding|@Environment|@Published)" || \
   echo "$CONTENT" | grep -qE "(struct.*:.*View|class.*ViewController|actor )" || \
   echo "$CONTENT" | grep -qE "(async |await |Task \{|MainActor)" || \
   echo "$CONTENT" | grep -qE "(NavigationStack|NavigationSplitView|TabView)"; then

  REASON="📚 SWIFT CODE DETECTED - Documentation required.\n\n"
  REASON+="Consult ONE of these sources FIRST:\n\n"
  REASON+="LOCAL SKILLS:\n"
  REASON+="  • skills/swiftui-components/SKILL.md (SwiftUI views)\n"
  REASON+="  • skills/swift-concurrency/SKILL.md (async/await, actors)\n"
  REASON+="  • skills/swift-architecture/SKILL.md (MVVM, DI)\n"
  REASON+="  • skills/swiftui-data/SKILL.md (SwiftData, Core Data)\n"
  REASON+="  • skills/swiftui-navigation/SKILL.md (NavigationStack)\n"
  REASON+="  • skills/swiftui-testing/SKILL.md (XCTest, UI tests)\n"
  REASON+="  • skills/swift-performance/SKILL.md (optimization)\n"
  REASON+="  • skills/solid-swift/SKILL.md (SOLID principles)\n\n"
  REASON+="ONLINE DOCUMENTATION:\n"
  REASON+="  • mcp__apple-docs__search_apple_docs (Apple docs)\n"
  REASON+="  • mcp__apple-docs__search_wwdc_content (WWDC videos)\n"
  REASON+="  • mcp__context7__resolve-library-id + mcp__context7__query-docs\n"
  REASON+="  • mcp__exa__get_code_context_exa (Swift examples)\n\n"
  REASON+="After consulting documentation, retry your Write/Edit."

  cat << EOF
{
  "decision": "block",
  "reason": "$REASON"
}
EOF
  exit 2
fi

exit 0
