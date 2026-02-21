---
name: auth-patterns
description: Authentication security patterns for JWT, sessions, OAuth2, and password hashing
when-to-use: When auditing authentication implementations or detecting auth anti-patterns
keywords: jwt, session, oauth, pkce, bcrypt, argon2, authentication
priority: high
related: templates/auth-checklist.md
---

# Authentication Patterns Reference

## JWT (JSON Web Tokens)

### Secure Practices
- **Algorithm**: RS256 or ES256 (asymmetric) preferred
- **Secret**: Minimum 256-bit for HS256
- **Expiration**: Access token 15min, Refresh 7 days
- **Storage**: httpOnly secure cookie (NOT localStorage)
- **Refresh**: Rotate refresh tokens on use
- **Claims**: Minimal payload, no sensitive data

### Anti-Patterns (GREP)
- `algorithm.*none` → Algorithm confusion attack
- `expiresIn.*[0-9]+d` (> 1d) → Too long access token
- `localStorage.*token` → XSS-accessible storage
- `jwt\.sign.*HS256.*short_secret` → Weak secret

## Sessions

### Secure Practices
- **Storage**: Server-side (Redis, DB), not client cookies
- **ID**: Cryptographically random, 128+ bits
- **Expiry**: Absolute (24h) + idle (30min)
- **Regeneration**: New ID after login
- **Flags**: httpOnly, secure, SameSite=Lax/Strict

### Anti-Patterns (GREP)
- `session.*cookie.*httpOnly.*false` → XSS risk
- `session.*secure.*false` → MITM risk
- No `regenerate` after authentication → Fixation

## OAuth2 / OIDC

### Secure Practices
- **PKCE**: Required for all public clients (SPA, mobile)
- **State**: Random, verify on callback
- **Redirect**: Exact match, no wildcards
- **Scope**: Minimal permissions requested
- **Token**: Exchange code server-side

### Anti-Patterns (GREP)
- Missing `code_verifier` → No PKCE
- Missing `state` parameter → CSRF risk
- `redirect_uri.*\*` → Open redirect
- Token in URL fragment → Token leakage

## Password Hashing

### Secure Algorithms
- **bcrypt**: Cost factor 12+ (default)
- **Argon2id**: Memory 64MB, iterations 3
- **scrypt**: N=32768, r=8, p=1

### Anti-Patterns (GREP)
- `md5(.*password` → Broken hash
- `sha1(.*password` → Broken hash
- `sha256(.*password` → No salt/iterations
- `password.*=.*plaintext` → No hashing
