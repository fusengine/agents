---
name: solid-detection
description: "Multi-language SOLID detection rules. Project type detection, interface locations, file size limits per language. Use when: determining which language-specific SOLID skill to load, detecting project type from config files, or resolving interface directory conventions per language."
argument-hint: "[file-or-directory] [--language]"
user-invocable: false
---

# SOLID Detection Skill

## References

- [language-rules.md](references/language-rules.md) - Load when: resolving the exact interface directory, file-limit, or pattern-detection regex for a specific language (Next.js, React, Generic TS, Laravel, Swift, Java, Go, Ruby, Rust, Python), or counting lines while excluding comments/blanks

## Project Detection

Detect project type from configuration files:

```bash
# Next.js (priority over React)
[ -f "package.json" ] && grep -q '"next"' package.json

# React (no "next" in package.json)
[ -f "package.json" ] && grep -q '"react"' package.json && ! grep -q '"next"' package.json

# Generic TypeScript (no react/next, has .ts files)
[ -f "package.json" ] && ! grep -q '"react"' package.json && ! grep -q '"next"' package.json
[ -f "tsconfig.json" ] || [ -f "bun.lockb" ] || [ -f "bunfig.toml" ]

# Laravel
[ -f "composer.json" ] && grep -q '"laravel' composer.json

# Swift
[ -f "Package.swift" ] || ls *.xcodeproj

# Java
[ -f "pom.xml" ] || [ -f "build.gradle" ] || [ -f "build.gradle.kts" ]

# Go
[ -f "go.mod" ]

# Ruby
[ -f "Gemfile" ] && [ -f "Rakefile" ]

# Rust
[ -f "Cargo.toml" ]

# Python
[ -f "pyproject.toml" ] || [ -f "requirements.txt" ]
```

**Priority order:** Next.js > React > Generic TS > Laravel > Swift > Java > Go > Ruby > Rust > Python

For the full per-language rule tables (interface location, forbidden zones, pattern-detection regex) and line-counting rules, see [language-rules.md](references/language-rules.md).

## Validation Actions

| Severity | Action |
|----------|--------|
| Interface in wrong location | **BLOCK** (exit 2) |
| File over limit | **WARNING** (exit 0) |
| Missing documentation | **WARNING** |

## Skill Mapping

| Project Type | SOLID Skill | Skill Path |
|--------------|-------------|------------|
| `nextjs` | solid-nextjs | `nextjs-expert/skills/solid-nextjs/` |
| `react` | solid-react | `react-expert/skills/solid-react/` |
| `generic` | solid-generic | `solid/skills/solid-generic/` |
| `laravel` | solid-php | `laravel-expert/skills/solid-php/` |
| `swift` | solid-swift | `swift-apple-expert/skills/solid-swift/` |
| `java` | solid-java | `solid/skills/solid-java/` |
| `go` | solid-go | `solid/skills/solid-go/` |
| `ruby` | solid-ruby | `solid/skills/solid-ruby/` |
| `rust` | solid-rust | `solid/skills/solid-rust/` |
| `python` | _(no skill yet)_ | - |

## Environment Variables

Set by `detect-project.sh`:

```bash
SOLID_PROJECT_TYPE=nextjs|react|generic|laravel|swift|java|go|ruby|rust|python|unknown
SOLID_FILE_LIMIT=100|150
SOLID_INTERFACE_DIR=path/to/interfaces
SOLID_STRUCTURE=modular
```
