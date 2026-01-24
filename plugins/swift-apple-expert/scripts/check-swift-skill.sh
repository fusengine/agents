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

  PLUGINS_DIR="$HOME/.claude/plugins/marketplaces/fusengine-plugins/plugins"
  REASON="📚 SWIFT CODE DETECTED. Read skills from: $PLUGINS_DIR/swift-apple-expert/skills/ (swiftui-components, swift-concurrency, swift-architecture, swiftui-data, swiftui-navigation, solid-swift). Then retry Write/Edit."
  jq -n --arg reason "$REASON" '{"decision": "continue", "reason": $reason}'
  exit 0
fi

exit 0
