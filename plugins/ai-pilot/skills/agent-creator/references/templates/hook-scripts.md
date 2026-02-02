---
name: hook-scripts
description: Complete hook script templates for agent validation
keywords: hooks, scripts, bash, validation, solid
---

# Hook Scripts Templates

## Usage

Copy these scripts to `plugins/<plugin>/scripts/` and make executable with `chmod +x`.

---

## SOLID Validation Script (PreToolUse)

### File: scripts/validate-solid.sh

```bash
#!/bin/bash
# SOLID Validation Script for PreToolUse hooks
# Validates file size and interface location before Write/Edit

set -e

# Configuration - adjust per stack
MAX_LINES=100
INTERFACE_DIR="src/interfaces"  # Or app/Contracts for Laravel

# Get file being written/edited
FILE_PATH="${1:-}"

if [ -z "$FILE_PATH" ]; then
    exit 0  # No file specified, allow
fi

# Skip non-code files
case "$FILE_PATH" in
    *.md|*.json|*.yml|*.yaml|*.txt|*.env*)
        exit 0
        ;;
esac

# Check if file exists (for Edit)
if [ -f "$FILE_PATH" ]; then
    LINE_COUNT=$(wc -l < "$FILE_PATH" | tr -d ' ')

    if [ "$LINE_COUNT" -gt "$MAX_LINES" ]; then
        echo "ERROR: File exceeds $MAX_LINES lines ($LINE_COUNT lines)"
        echo "Split into smaller files following SOLID principles"
        exit 1
    fi
fi

# Check interface location
if [[ "$FILE_PATH" == *"/interfaces/"* ]] || [[ "$FILE_PATH" == *"/Contracts/"* ]]; then
    # Interface file - verify correct location
    if [[ "$FILE_PATH" != *"$INTERFACE_DIR"* ]]; then
        echo "ERROR: Interfaces must be in $INTERFACE_DIR"
        exit 1
    fi
fi

exit 0
```

---

## Next.js SOLID Validation

### File: scripts/validate-nextjs-solid.sh

```bash
#!/bin/bash
# Next.js SOLID Validation
# Interfaces in modules/[feature]/src/interfaces/

set -e

FILE_PATH="${1:-}"
MAX_LINES=100
INTERFACE_PATTERN="modules/*/src/interfaces/"

if [ -z "$FILE_PATH" ]; then
    exit 0
fi

# Skip non-code files
case "$FILE_PATH" in
    *.md|*.json|*.yml|*.yaml|*.txt|*.env*|*.css)
        exit 0
        ;;
esac

# Check file size
if [ -f "$FILE_PATH" ]; then
    LINE_COUNT=$(wc -l < "$FILE_PATH" | tr -d ' ')

    if [ "$LINE_COUNT" -gt "$MAX_LINES" ]; then
        echo "ERROR: File exceeds $MAX_LINES lines ($LINE_COUNT lines)"
        echo "Split: main.ts + validators.ts + types.ts + utils.ts"
        exit 1
    fi
fi

# Check interface in component
if [[ "$FILE_PATH" == *"/components/"* ]]; then
    if grep -q "^interface\|^type.*=" "$FILE_PATH" 2>/dev/null; then
        echo "ERROR: Interfaces/types in components"
        echo "Move to: $INTERFACE_PATTERN"
        exit 1
    fi
fi

exit 0
```

---

## Laravel SOLID Validation

### File: scripts/validate-php-solid.sh

```bash
#!/bin/bash
# Laravel SOLID Validation
# Interfaces in app/Contracts/

set -e

FILE_PATH="${1:-}"
MAX_LINES=100

if [ -z "$FILE_PATH" ]; then
    exit 0
fi

# Only check PHP files
case "$FILE_PATH" in
    *.php)
        ;;
    *)
        exit 0
        ;;
esac

# Check file size
if [ -f "$FILE_PATH" ]; then
    LINE_COUNT=$(wc -l < "$FILE_PATH" | tr -d ' ')

    if [ "$LINE_COUNT" -gt "$MAX_LINES" ]; then
        echo "ERROR: File exceeds $MAX_LINES lines ($LINE_COUNT lines)"
        echo "Split: Service + Repository + Action + DTO"
        exit 1
    fi
fi

# Check interface location
if grep -q "^interface " "$FILE_PATH" 2>/dev/null; then
    if [[ "$FILE_PATH" != *"app/Contracts/"* ]]; then
        echo "ERROR: Interfaces must be in app/Contracts/"
        exit 1
    fi
fi

exit 0
```

---

## Swift SOLID Validation

### File: scripts/validate-swift-solid.sh

```bash
#!/bin/bash
# Swift SOLID Validation
# Protocols in Sources/Interfaces/

set -e

FILE_PATH="${1:-}"
MAX_LINES=100

if [ -z "$FILE_PATH" ]; then
    exit 0
fi

# Only check Swift files
case "$FILE_PATH" in
    *.swift)
        ;;
    *)
        exit 0
        ;;
esac

# Check file size
if [ -f "$FILE_PATH" ]; then
    LINE_COUNT=$(wc -l < "$FILE_PATH" | tr -d ' ')

    if [ "$LINE_COUNT" -gt "$MAX_LINES" ]; then
        echo "ERROR: File exceeds $MAX_LINES lines ($LINE_COUNT lines)"
        echo "Split: ViewModel + View + Service"
        exit 1
    fi
fi

# Check protocol location
if grep -q "^protocol " "$FILE_PATH" 2>/dev/null; then
    if [[ "$FILE_PATH" != *"Sources/Interfaces/"* ]] && [[ "$FILE_PATH" != *"Protocols/"* ]]; then
        echo "ERROR: Protocols must be in Sources/Interfaces/"
        exit 1
    fi
fi

exit 0
```

---

## Skill Read Tracker (PostToolUse)

### File: scripts/track-skill-read.sh

```bash
#!/bin/bash
# Track skill usage for analytics
# PostToolUse on Read

FILE_PATH="${1:-}"
LOG_FILE="${CLAUDE_PLUGIN_ROOT:-/tmp}/skill-reads.log"

if [ -z "$FILE_PATH" ]; then
    exit 0
fi

# Only track skill reads
if [[ "$FILE_PATH" == *"/skills/"* ]]; then
    echo "$(date '+%Y-%m-%d %H:%M:%S') READ: $FILE_PATH" >> "$LOG_FILE"
fi

exit 0
```

---

## Installation

```bash
# Copy scripts to plugin
cp scripts/*.sh plugins/<plugin>/scripts/

# Make executable
chmod +x plugins/<plugin>/scripts/*.sh

# Verify
ls -la plugins/<plugin>/scripts/
```

---

## Notes

- Always `exit 0` for success
- Non-zero exit blocks the tool
- Use `$CLAUDE_PLUGIN_ROOT` for paths
- Keep scripts fast (<1s execution)
