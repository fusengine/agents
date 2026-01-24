---
name: solid-detection
description: Multi-language SOLID detection rules. Project type detection, interface locations, file size limits per language.
argument-hint: "[file-or-directory] [--language]"
user-invocable: false
---

# SOLID Detection Skill

## Project Detection

Detect project type from configuration files:

```bash
# Next.js
[ -f "package.json" ] && grep -q '"next"' package.json

# Laravel
[ -f "composer.json" ] && grep -q '"laravel' composer.json

# Swift
[ -f "Package.swift" ] || ls *.xcodeproj

# Go
[ -f "go.mod" ]

# Rust
[ -f "Cargo.toml" ]

# Python
[ -f "pyproject.toml" ] || [ -f "requirements.txt" ]
```

## Language Rules

### Next.js / TypeScript

| Rule | Value |
|------|-------|
| File limit | 150 lines |
| Interface location | `modules/cores/interfaces/` |
| Forbidden | Interfaces in `components/`, `app/` |

**Pattern detection**:
```regex
^(export )?(interface|type) \w+
```

### Laravel / PHP

| Rule | Value |
|------|-------|
| File limit | 100 lines |
| Interface location | `app/Contracts/` |
| Forbidden | Interfaces outside Contracts |

**Pattern detection**:
```regex
^interface \w+
```

### Swift

| Rule | Value |
|------|-------|
| File limit | 150 lines |
| Interface location | `Protocols/` |
| Forbidden | Protocols outside Protocols/ |

**Pattern detection**:
```regex
^protocol \w+
```

### Go

| Rule | Value |
|------|-------|
| File limit | 100 lines |
| Interface location | `internal/interfaces/` |
| Forbidden | Interfaces outside interfaces/ |

**Pattern detection**:
```regex
^type \w+ interface \{
```

### Python

| Rule | Value |
|------|-------|
| File limit | 100 lines |
| Interface location | `src/interfaces/` |
| Forbidden | ABC outside interfaces/ |

**Pattern detection**:
```regex
class \w+\(.*ABC.*\)
```

### Rust

| Rule | Value |
|------|-------|
| File limit | 100 lines |
| Interface location | `src/traits/` |
| Forbidden | Traits outside traits/ |

**Pattern detection**:
```regex
^pub trait \w+
```

## Line Counting

Exclude from count:
- Blank lines
- Comments (`//`, `/* */`, `#`, `"""`)
- Import statements (optional)

```bash
# TypeScript/Go/Rust/Swift
grep -v '^\s*$\|^\s*//\|^\s*/\*\|^\s*\*' file

# PHP
grep -v '^\s*$\|^\s*//\|^\s*#\|^\s*/\*\|^\s*\*' file

# Python
grep -v '^\s*$\|^\s*#\|^\s*"""' file
```

## Validation Actions

| Severity | Action |
|----------|--------|
| Interface in wrong location | **BLOCK** (exit 2) |
| File over limit | **WARNING** (exit 0) |
| Missing documentation | **WARNING** |

## Environment Variables

Set by `detect-project.sh`:

```bash
SOLID_PROJECT_TYPE=nextjs|laravel|swift|go|rust|python|unknown
SOLID_FILE_LIMIT=100|150
SOLID_INTERFACE_DIR=path/to/interfaces
```
