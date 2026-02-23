#!/bin/bash
# Detect project type and set SOLID rules accordingly

cd "$CLAUDE_PROJECT_DIR" 2>/dev/null || exit 0

PROJECT_TYPE="unknown"
FILE_LIMIT=100
INTERFACE_DIR=""

# Next.js / TypeScript
if [ -f "package.json" ] && grep -q '"next"' package.json 2>/dev/null; then
  PROJECT_TYPE="nextjs"
  FILE_LIMIT=150
  INTERFACE_DIR="modules/cores/interfaces"

# Laravel / PHP
elif [ -f "composer.json" ] && grep -q '"laravel' composer.json 2>/dev/null; then
  PROJECT_TYPE="laravel"
  FILE_LIMIT=100
  INTERFACE_DIR="app/Contracts"

# Swift / iOS
elif [ -f "Package.swift" ] || ls *.xcodeproj &>/dev/null || ls *.xcworkspace &>/dev/null; then
  PROJECT_TYPE="swift"
  FILE_LIMIT=150
  INTERFACE_DIR="Protocols"

# Go
elif [ -f "go.mod" ]; then
  PROJECT_TYPE="go"
  FILE_LIMIT=100
  INTERFACE_DIR="internal/interfaces"

# Rust
elif [ -f "Cargo.toml" ]; then
  PROJECT_TYPE="rust"
  FILE_LIMIT=100
  INTERFACE_DIR="src/traits"

# Python
elif [ -f "pyproject.toml" ] || [ -f "requirements.txt" ]; then
  PROJECT_TYPE="python"
  FILE_LIMIT=100
  INTERFACE_DIR="src/interfaces"
fi

# Only output if project detected
if [ "$PROJECT_TYPE" != "unknown" ]; then
  echo "🔍 SOLID: $PROJECT_TYPE project (max $FILE_LIMIT lines)"
fi

# Export to environment file
cat >> "$CLAUDE_ENV_FILE" << EOF
export SOLID_PROJECT_TYPE=$PROJECT_TYPE
export SOLID_FILE_LIMIT=$FILE_LIMIT
export SOLID_INTERFACE_DIR=$INTERFACE_DIR
EOF
