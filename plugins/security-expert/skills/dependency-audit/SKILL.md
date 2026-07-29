---
name: dependency-audit
description: "Use when running ecosystem-specific vulnerability scans across project dependencies (npm/composer/pip/cargo/go/etc), with optional auto-fix."
argument-hint: "[--fix] [ecosystem]"
user-invocable: true
---

<objective>
This skill runs native package-manager audit tools across a project's full dependency tree,
detecting the package manager from lock files and running the matching command:
npm/yarn/pnpm/bun audit, composer audit, pip-audit/safety check, cargo audit, govulncheck,
pod audit, or bundle audit.

It parses each tool's output, classifies findings by severity (CRITICAL/HIGH/MEDIUM/LOW),
and suggests fix versions or alternatives. With the --fix flag it applies safe auto-fixes
where supported (npm audit fix, cargo audit fix) and gives manual guidance for ecosystems
without auto-fix.

Out of scope: researching a single named dependency's CVE history in depth belongs to
cve-research.
</objective>

# Dependency Audit Skill

## Overview

Run dependency vulnerability checks using native package manager audit tools.

## Supported Ecosystems

| Ecosystem | Tool | Auto-fix |
|-----------|------|----------|
| npm/yarn/pnpm/bun | `npm audit` / `yarn audit` | Yes |
| PHP/Composer | `composer audit` | Manual |
| Python/pip | `pip-audit` / `safety check` | Manual |
| Rust/Cargo | `cargo audit` | Yes |
| Go | `govulncheck ./...` | Manual |
| Swift/CocoaPods | `pod audit` | Manual |
| Ruby/Bundler | `bundle audit` | Manual |

## Workflow

1. **Detect** package manager from lock files
2. **Run** appropriate audit command
3. **Parse** output for vulnerabilities
4. **Classify** by severity (CRITICAL/HIGH/MEDIUM/LOW)
5. **Suggest** fix versions or alternatives

## Auto-Fix Support

When `--fix` flag is used:
- `npm audit fix` for safe updates
- `cargo audit fix` for Rust
- Manual guidance for other ecosystems

## References

- [Audit Commands](references/audit-commands.md)
- [Report Template](references/templates/audit-report.md)
