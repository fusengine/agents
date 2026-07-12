---
name: think-in-code
description: Use ONE Bash script instead of N sequential Read calls when analyzing multiple files, auditing codebase, finding all matches, scanning dependencies, counting lines, or listing files matching a pattern. Replaces wasteful multi-Read loops with compact shell pipelines.
argument-hint: "[pattern] [scope]"
keywords:
  - analyze multiple files
  - audit codebase
  - find all
  - scan dependencies
  - count lines
  - list files matching
  - bulk read
user-invocable: false
---

# Think-in-Code Skill

## Principle

**1 Bash script = N Read calls avoided.**

When you'd read 10 files sequentially to extract a summary, you waste tokens loading full contents into context. Instead: 1 shell pipeline returns the compact aggregated result.

Heuristic: if your task is "for each file in set, compute/extract X, then aggregate" → write the script. Reserve Read for *targeted inspection* of a specific file you already know matters.

## 5 Runnable Patterns

### 1. File size audit (> 100 lines violations)

```bash
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.py" -o -name "*.php" \) \
  -not -path "*/node_modules/*" -not -path "*/vendor/*" \
  | xargs wc -l 2>/dev/null \
  | awk '$1 > 100 && $2 != "total" {print $1, $2}' \
  | sort -rn | head -20
```

### 2. Multi-grep symbols (compact JSON)

```bash
rg --json -g '*.ts' -g '*.tsx' 'export (function|class|const) (\w+)' src/ \
  | jq -r 'select(.type=="match") | "\(.data.path.text):\(.data.line_number) \(.data.lines.text)"' \
  | head -50
```

### 3. Dependencies with versions

```bash
# Node
jq -r '.dependencies, .devDependencies | to_entries[] | "\(.key)@\(.value)"' package.json 2>/dev/null

# PHP
jq -r '.require, ."require-dev" | to_entries[] | "\(.key)@\(.value)"' composer.json 2>/dev/null
```

### 4. Error log scan

```bash
grep -rEn 'ERROR|FATAL|Exception|panic:|stack trace' \
  --include="*.log" logs/ 2>/dev/null \
  | tail -30
```

### 5. Lines of code by extension

```bash
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.py" -o -name "*.php" \) \
  -not -path "*/node_modules/*" -not -path "*/vendor/*" -not -path "*/.git/*" \
  -exec wc -l {} + \
  | awk '{ext=$2; sub(/.*\./,"",ext); sum[ext]+=$1} END {for (e in sum) print sum[e], e}' \
  | sort -rn
```

## Anti-Pattern

**Do NOT** Read 10 files sequentially to count their lines, list their exports, or check their size. That is ~6KB context per file = ~60KB wasted for a result that fits in 1KB.

```
WRONG: Read(f1.ts) → Read(f2.ts) → ... → Read(f10.ts) → manual tally
RIGHT: Bash(find ... | xargs wc -l | awk ...) → 1 compact table
```

## Before / After

**Task:** "Find files > 100 lines in `src/`."

- Before: 10 × Read full file → ~60KB tokens consumed, then mental wc.
- After: 1 × `find src -name '*.ts' | xargs wc -l | awk '$1>100'` → ~1KB result.

**~60× reduction. Use the script.**
