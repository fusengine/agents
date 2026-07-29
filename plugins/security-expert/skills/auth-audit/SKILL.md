---
name: auth-audit
description: "Use when auditing JWT, session, OAuth2/PKCE, password, or MFA implementations for security vulnerabilities and best-practice deviations."
argument-hint: "[--jwt] [--session] [--oauth]"
user-invocable: true
---

<objective>
This skill audits authentication and authorization implementations end to end: JWT signing
algorithm, expiration, refresh, and storage; session storage, expiry, regeneration, and
fixation; OAuth2 PKCE, state parameter, and redirect validation; password hashing algorithm,
strength rules, and reset flow; and MFA implementation, backup codes, and recovery.

It runs a fixed workflow — detect the auth implementation, scan for known anti-patterns,
verify cryptographic choices, check token/session lifecycle, and audit authorization logic
(RBAC/ABAC) — checking for vulnerabilities such as JWT signed with `none`, undersized JWT
secrets, missing/too-long token expiration, refresh tokens in localStorage, session fixation,
missing CSRF protection, and OAuth flows missing PKCE or the `state` parameter.
</objective>

# Auth Audit Skill

## Overview

Comprehensive audit of authentication and authorization implementations.

## Audit Categories

| Category | Checks |
|----------|--------|
| JWT | Signing algo, expiration, refresh, storage |
| Sessions | Storage, expiry, regeneration, fixation |
| OAuth2 | PKCE, state param, redirect validation |
| Passwords | Hashing algo, strength rules, reset flow |
| MFA | Implementation, backup codes, recovery |

## Workflow

1. **Detect** auth implementation (JWT, sessions, OAuth)
2. **Scan** for known anti-patterns
3. **Verify** cryptographic choices
4. **Check** token/session lifecycle
5. **Audit** authorization logic (RBAC, ABAC)

## Common Vulnerabilities

- JWT signed with `none` algorithm
- JWT secret too short (< 256 bits)
- No token expiration or too long
- Refresh tokens stored in localStorage
- Session fixation after login
- Missing CSRF protection
- OAuth without PKCE for public clients
- Missing `state` parameter in OAuth flow

## References

- [Auth Patterns](references/auth-patterns.md)
- [Auth Checklist](references/templates/auth-checklist.md)
