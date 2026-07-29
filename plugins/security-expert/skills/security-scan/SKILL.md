---
name: security-scan
description: Use when scanning for XSS, SQL injection, command injection, hardcoded secrets, or any OWASP Top 10 vulnerability across a codebase.
argument-hint: "[--full] [path]"
user-invocable: true
---

<objective>
This skill orchestrates a full security scan across JavaScript/TypeScript, PHP, Python,
Swift/iOS, Go, and Rust: it detects the language from project markers, loads the matching
pattern set, runs the harness's automated scanner (OWASP patterns ported into
`@fusengine/harness`), maps findings to OWASP Top 10 categories, and generates a structured
report.

Pattern categories include XSS, SQL injection, command injection, unsafe code execution
(eval/exec), SSRF, weak cryptography, hardcoded secrets, insecure deserialization, and path
traversal/LFI/RFI, plus GraphQL-specific patterns (introspection, depth/complexity limiting,
batching, authorization) when a GraphQL endpoint is present.

After scanning, it delegates fixes to the sniper agent with file:line, vulnerability, and
fix — it does not apply fixes itself.
</objective>

# Security Scan Skill

## Overview

Orchestrates the full security scanning workflow across all supported languages.

## Supported Languages

| Language | Marker Files | Pattern Count |
|----------|-------------|---------------|
| JavaScript/TypeScript | package.json | 25+ |
| PHP | composer.json | 20+ |
| Python | requirements.txt, pyproject.toml | 18+ |
| Swift/iOS | Package.swift, *.xcodeproj | 15+ |
| Go | go.mod | 12+ |
| Rust | Cargo.toml | 10+ |

## Workflow

1. **Detect** language from project markers
2. **Load** patterns from `references/scan-patterns.md`
3. **Run** `bun ${CLAUDE_PLUGIN_ROOT}/../node_modules/@fusengine/harness/dist/cli/bin.mjs scan <dir>` for automated scanning (OWASP patterns ported into the harness)
4. **Map** findings to OWASP categories via `references/owasp-top10.md`
5. **Generate** report using `references/templates/scan-report.md`

## Pattern Categories

- XSS (Cross-Site Scripting)
- SQL Injection
- Command Injection
- Code Execution (eval, exec)
- SSRF (Server-Side Request Forgery)
- Weak Cryptography
- Hardcoded Secrets
- Insecure Deserialization
- Path Traversal / LFI / RFI

## Integration

After scanning, delegate fixes to sniper:
```
Agent(subagent_type="fuse-ai-pilot:sniper", prompt="Security fixes: [FILE:LINE] [VULN] [FIX]")
```

## References

- [OWASP Top 10 Mapping](references/owasp-top10.md)
- [Scan Patterns by Language](references/scan-patterns.md)
- [Report Template](references/templates/scan-report.md)
- [GraphQL Security Patterns](references/graphql-security.md) — Load when the target exposes a GraphQL endpoint (introspection, depth/complexity limiting, batching, authorization checks).
- [Scan Patterns - Python, Swift/iOS, Go, Rust](references/scan-patterns-extra.md) — Load when scanning Python, Swift/iOS, Go, or Rust source code (patterns not covered in `scan-patterns.md`).
