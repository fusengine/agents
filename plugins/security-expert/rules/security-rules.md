---
description: Security audit business rules and compliance requirements
alwaysApply: true
---

# Security Rules

## OWASP Top 10 2025 Compliance

Every scan MUST check all 10 categories:
- **A01** Broken Access Control
- **A02** Cryptographic Failures
- **A03** Injection (SQLi, XSS, CMDi)
- **A04** Insecure Design
- **A05** Security Misconfiguration
- **A06** Vulnerable Components
- **A07** Authentication Failures
- **A08** Data Integrity Failures
- **A09** Logging & Monitoring Failures
- **A10** Server-Side Request Forgery

## Zero Tolerance Rules

1. **Hardcoded secrets** → CRITICAL, fix immediately
2. **SQL injection** → CRITICAL, parameterize queries
3. **Command injection** → CRITICAL, sanitize inputs
4. **eval/exec with user input** → CRITICAL, remove
5. **Unvalidated redirects** → HIGH, whitelist URLs

## Dependency Rules

- Run `npm audit` / `composer audit` / `pip-audit` on every scan
- CRITICAL/HIGH advisories must be resolved
- Pin dependency versions in production
- Check for abandoned/unmaintained packages

## Secrets Detection Patterns

- AWS keys: `AKIA[0-9A-Z]{16}`
- Generic API keys: `api[_-]?key.*=.*['\"][a-zA-Z0-9]{20,}`
- JWT tokens: `eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*`
- Private keys: `-----BEGIN (RSA|EC|DSA) PRIVATE KEY-----`
- Connection strings: `(mysql|postgres|mongodb)://[^\\s]+`

## Report Requirements

Every report MUST include:
1. Executive summary (findings count by severity)
2. Detailed findings with file:line references
3. OWASP category mapping
4. Remediation instructions per finding
5. Dependency audit results
