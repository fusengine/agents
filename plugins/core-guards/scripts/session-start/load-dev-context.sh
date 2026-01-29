#!/bin/bash
# SessionStart: Load development context (git, project type)

CONTEXT=""

# Git context
if [ -d .git ]; then
  BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
  STATUS=$(git status --porcelain 2>/dev/null | head -5)
  CONTEXT="Git branch: $BRANCH"
  if [ -n "$STATUS" ]; then
    CONTEXT="$CONTEXT\nModified files:\n$STATUS"
  fi
fi

# Project type detection
if [ -f "next.config.js" ] || [ -f "next.config.ts" ] || [ -f "next.config.mjs" ]; then
  CONTEXT="$CONTEXT\nProject: Next.js"
elif [ -f "package.json" ]; then
  CONTEXT="$CONTEXT\nProject: Node.js"
fi

if [ -f "composer.json" ] && [ -f "artisan" ]; then
  CONTEXT="$CONTEXT\nProject: Laravel"
fi

if [ -f "Package.swift" ]; then
  CONTEXT="$CONTEXT\nProject: Swift"
fi

# Output JSON only if we have context
if [ -n "$CONTEXT" ]; then
  ESCAPED=$(echo -e "$CONTEXT" | jq -Rs .)
  cat << EOF
{
  "additionalContext": $ESCAPED
}
EOF
fi

exit 0
