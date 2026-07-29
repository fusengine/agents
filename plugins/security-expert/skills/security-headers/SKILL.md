---
name: security-headers
description: "Use when verifying or configuring HTTP security headers (CSP, HSTS, CORS, X-Frame-Options) for a web application (Next.js, Laravel, Express, Django)."
argument-hint: "[framework]"
user-invocable: true
---

<objective>
This skill audits and configures HTTP security headers for a web application:
Content-Security-Policy and Strict-Transport-Security (HIGH severity if missing),
X-Content-Type-Options and X-Frame-Options (MEDIUM), and Referrer-Policy,
Permissions-Policy, X-XSS-Protection (LOW).

It detects the framework (Next.js next.config.js headers/middleware.ts, Laravel
SecurityHeaders middleware, Express helmet, Django SECURE_* settings), checks the current
configuration against best practice, generates a framework-specific fix, and validates the
headers are properly set.
</objective>

# Security Headers Skill

## Overview

Audit and configure HTTP security headers for web applications.

## Required Headers

| Header | Purpose | Severity if Missing |
|--------|---------|-------------------|
| Content-Security-Policy | Prevent XSS/injection | HIGH |
| Strict-Transport-Security | Force HTTPS | HIGH |
| X-Content-Type-Options | Prevent MIME sniffing | MEDIUM |
| X-Frame-Options | Prevent clickjacking | MEDIUM |
| Referrer-Policy | Control referrer info | LOW |
| Permissions-Policy | Control browser features | LOW |
| X-XSS-Protection | Legacy XSS filter | LOW |

## Workflow

1. **Detect** framework (Next.js, Laravel, Express, etc.)
2. **Check** current header configuration
3. **Compare** against security best practices
4. **Generate** framework-specific configuration
5. **Validate** headers are properly set

## Detection Points

| Framework | Config Location |
|-----------|----------------|
| Next.js | `next.config.js` headers, `middleware.ts` |
| Laravel | `SecurityHeaders` middleware |
| Express | `helmet` middleware |
| Django | `SECURE_*` settings |

## References

- [Headers Reference](references/headers-reference.md)
- [Config Templates](references/templates/headers-config.md)
