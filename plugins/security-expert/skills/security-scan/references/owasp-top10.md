---
name: owasp-top10
description: OWASP Top 10 2025 vulnerability categories with patterns, severity, and fixes
when-to-use: When mapping scan findings to OWASP categories or understanding vulnerability types
keywords: owasp, top10, vulnerability, mapping, categories
priority: high
related: scan-patterns.md
---

# OWASP Top 10 2025 Mapping

## A01: Broken Access Control

- **Risk**: Unauthorized access to resources
- **Patterns**: Missing auth checks, IDOR, path traversal
- **Grep**: `req.params.id` without auth, `../` in paths
- **Severity**: CRITICAL
- **Fix**: Implement RBAC, validate ownership

## A02: Cryptographic Failures

- **Risk**: Weak encryption, exposed sensitive data
- **Patterns**: MD5/SHA1, Math.random(), hardcoded keys
- **Grep**: `createHash('md5')`, `Math.random()`, `password.*=.*""`
- **Severity**: HIGH
- **Fix**: Use bcrypt/argon2, crypto.randomUUID()

## A03: Injection

- **Risk**: SQL, NoSQL, OS, LDAP injection
- **Patterns**: String concatenation in queries, eval, exec
- **Grep**: `SELECT.*\$\{`, `eval(`, `exec(`, `system(`
- **Severity**: CRITICAL
- **Fix**: Parameterized queries, input validation

## A04: Insecure Design

- **Risk**: Missing security controls by design
- **Patterns**: No rate limiting, no CSRF tokens
- **Grep**: Missing `csrf`, no rate-limit middleware
- **Severity**: MEDIUM
- **Fix**: Threat modeling, security patterns

## A05: Security Misconfiguration

- **Risk**: Default configs, verbose errors, open ports
- **Patterns**: Debug mode, stack traces in responses
- **Grep**: `DEBUG.*=.*true`, `stack.*trace`, `verbose.*error`
- **Severity**: HIGH
- **Fix**: Harden configs, disable debug in prod

## A06: Vulnerable Components

- **Risk**: Known CVEs in dependencies
- **Patterns**: Outdated packages, abandoned libraries
- **Tool**: `npm audit`, `composer audit`, `pip-audit`
- **Severity**: varies (CRITICAL to LOW)
- **Fix**: Update dependencies, remove unused

## A07: Authentication Failures

- **Risk**: Broken auth, weak passwords, session issues
- **Patterns**: Plain text passwords, no MFA, weak JWT
- **Grep**: `password.*=`, weak JWT secret, no expiry
- **Severity**: CRITICAL
- **Fix**: Strong hashing, MFA, token rotation

## A08: Data Integrity Failures

- **Risk**: Untrusted deserialization, unsigned updates
- **Patterns**: pickle.loads, unserialize, yaml.load
- **Grep**: `pickle.loads(`, `unserialize(\$_`, `yaml.load(`
- **Severity**: HIGH
- **Fix**: Signed serialization, input validation

## A09: Logging & Monitoring Failures

- **Risk**: No audit trail, undetected breaches
- **Patterns**: Missing logging, PII in logs
- **Grep**: `console.log.*password`, no error handlers
- **Severity**: MEDIUM
- **Fix**: Structured logging, PII redaction

## A10: Server-Side Request Forgery (SSRF)

- **Risk**: Server makes requests to attacker-controlled URLs
- **Patterns**: User input in fetch/axios/curl URLs
- **Grep**: `fetch(req.`, `axios.get(req.`, `curl.*\$`
- **Severity**: HIGH
- **Fix**: URL allowlisting, disable redirects
