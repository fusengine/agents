---
name: quick-analysis-commands
description: One-liner commands for full-stack assessment, file counts, and large-file detection
---

# Quick Analysis Commands

## Full Stack Assessment

```bash
# One-liner for quick assessment
echo "=== Package Manager ===" && ls package.json pyproject.toml go.mod Cargo.toml composer.json 2>/dev/null && echo "=== Framework ===" && head -20 package.json 2>/dev/null | grep -E "next|react|vue|express" && echo "=== Structure ===" && ls -la src/ app/ lib/ 2>/dev/null
```

## File Count by Type

```bash
# Count files by extension
find . -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" 2>/dev/null | wc -l
find . -type f -name "*.py" 2>/dev/null | wc -l
find . -type f -name "*.go" 2>/dev/null | wc -l
```

## Large Files Detection

```bash
# Find files > 100 lines (potential violations)
find . -name "*.ts" -o -name "*.tsx" -o -name "*.py" 2>/dev/null | xargs wc -l 2>/dev/null | sort -rn | head -20
```
