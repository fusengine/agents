# fuse-security

Security vulnerability detection and remediation plugin.

## Overview

Comprehensive security audit plugin that detects vulnerabilities, scans dependencies, checks OWASP Top 10 patterns, researches CVEs, and delegates fixes to the sniper agent.

## Agent

| Agent | Description |
|-------|-------------|
| `security-expert` | 5-phase security audit: DETECT, RESEARCH, SCAN, REPORT, FIX |

## Skills (5)

| Skill | Description |
|-------|-------------|
| `security-scan` | OWASP Top 10 pattern scanning (JS/TS, PHP, Python, Swift) |
| `cve-research` | CVE lookup via NVD, OSV.dev, GitHub Advisory, Exa |
| `dependency-audit` | Package vulnerability audit (npm, composer, pip, cargo, go) |
| `security-headers` | HTTP headers validation (CSP, HSTS, CORS, X-Frame-Options) |
| `auth-audit` | Authentication patterns audit (JWT, sessions, OAuth2, PKCE) |

## Commands (1)

| Command | Description |
|---------|-------------|
| `/scan` | Launch comprehensive security audit |

## Workflow

```
Phase 1: DETECT     → Identify language/framework
Phase 2: RESEARCH   → CVEs via Exa + NVD/OSV.dev
Phase 3: SCAN       → Grep patterns + dependency audit
Phase 4: REPORT     → Structured report (OWASP A01-A10)
Phase 5: FIX        → Delegate to sniper agent
```

## Supported Languages

- JavaScript/TypeScript (25+ patterns)
- PHP (20+ patterns)
- Python (18+ patterns)
- Swift/iOS (15+ patterns)
- Go, Rust (via dependency audit)

## MCP Servers

- **Context7** - Documentation lookup
- **Exa** - CVE search, code context
- **Sequential Thinking** - Structured analysis

## Hooks

- **PreToolUse** (Write/Edit) - Verify security skill read
- **PostToolUse** (Read) - Track skill reads
- **PostToolUse** (MCP) - Track research consultations
