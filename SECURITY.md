# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.36.x  | Yes       |
| < 1.36  | No        |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT open a public issue**
2. Use [GitHub Private Vulnerability Reporting](https://github.com/fusengine/agents/security/advisories/new)
3. Or email: security@fusengine.ch

### What to include

- Description of the vulnerability
- Steps to reproduce
- Affected files or hooks
- Potential impact

### Response timeline

- **Acknowledgment**: Within 48 hours
- **Initial assessment**: Within 5 business days
- **Fix release**: Within 14 business days for critical issues

## Scope

### In scope

- Hook scripts (`plugins/core-guards/scripts/`)
- Settings manipulation (`scripts/src/services/`)
- MCP server configurations
- API key handling (`env-manager.ts`)
- Shell command injection in bash scripts

### Out of scope

- Markdown content (SKILL.md, agent docs)
- Claude Code itself (report to Anthropic)
- Third-party MCP servers (report to maintainers)

## Security Measures

This project enforces security through hooks:

- **git-guard.sh** - Blocks destructive git commands (force push, reset --hard)
- **security-guard.sh** - Validates dangerous shell commands
- **install-guard.sh** - Confirms before package installations
- **Secret scanning** - Enabled on GitHub to detect leaked credentials
