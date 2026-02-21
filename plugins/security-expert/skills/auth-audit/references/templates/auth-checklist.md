---
name: auth-checklist
description: Complete security checklist for JWT, sessions, OAuth2, and password implementations
keywords: checklist, jwt, session, oauth, password, security, audit
---

# Authentication Security Checklist

## JWT Checklist

- [ ] Algorithm is RS256/ES256 (not HS256 with weak secret)
- [ ] Access token expires in <= 15 minutes
- [ ] Refresh token expires in <= 7 days
- [ ] Tokens stored in httpOnly secure cookies
- [ ] Refresh tokens rotated on use
- [ ] Token blacklist/revocation mechanism exists
- [ ] No sensitive data in JWT payload
- [ ] JWT signature verified on every request

## Session Checklist

- [ ] Session ID is cryptographically random
- [ ] Session stored server-side (Redis/DB)
- [ ] Cookie flags: httpOnly, secure, SameSite
- [ ] Session regenerated after authentication
- [ ] Absolute timeout configured (<= 24h)
- [ ] Idle timeout configured (<= 30min)
- [ ] Session destroyed on logout
- [ ] Concurrent session limit enforced

## OAuth2 Checklist

- [ ] PKCE implemented for public clients
- [ ] State parameter generated and verified
- [ ] Redirect URIs exact-match validated
- [ ] Authorization code exchanged server-side
- [ ] Minimal scopes requested
- [ ] Token refresh handled properly
- [ ] Error responses don't leak information

## Password Checklist

- [ ] Passwords hashed with bcrypt/Argon2id
- [ ] Minimum length 8+ characters enforced
- [ ] Breached password check (HIBP API)
- [ ] Rate limiting on login attempts
- [ ] Account lockout after N failures
- [ ] Secure password reset flow (time-limited token)
- [ ] No password hints or security questions

## General Auth Checklist

- [ ] HTTPS enforced on all auth endpoints
- [ ] CSRF protection on forms
- [ ] Brute force protection (rate limiting)
- [ ] Audit logging for auth events
- [ ] MFA available and encouraged
- [ ] Account recovery flow is secure
- [ ] Error messages don't reveal user existence
