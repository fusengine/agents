#!/bin/bash

echo "🚀 Loading development context..."

if [ -d .git ]; then
  git status > /tmp/claude-git-context.txt
  echo "✅ Git context loaded"
fi

if [ -f package.json ]; then
  echo "📦 Node.js project detected"
  node --version 2>/dev/null || echo "⚠️  Node.js not found"
fi

if [ -f requirements.txt ] || [ -f pyproject.toml ]; then
  echo "🐍 Python project detected"
  python --version 2>/dev/null || python3 --version 2>/dev/null || echo "⚠️  Python not found"
fi

echo "✨ Development context ready"
exit 0
