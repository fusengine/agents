---
name: laravel-auth
description: Implement authentication with Sanctum, Passport, Socialite, Fortify, policies, and gates. Use when setting up user authentication, API tokens, social login, or authorization.
versions:
  laravel: "12.46"
  sanctum: "4.0"
  php: "8.5"
user-invocable: false
references: references/authentication.md, references/authorization.md, references/sanctum.md, references/passport.md, references/fortify.md, references/socialite.md, references/starter-kits.md, references/verification.md, references/passwords.md, references/encryption.md, references/hashing.md, references/csrf.md, references/session.md
related-skills: laravel-api, laravel-permission
---

# Laravel Authentication & Authorization

## Agent Workflow (MANDATORY)

Before ANY implementation, launch in parallel:

1. **fuse-ai-pilot:explore-codebase** - Check existing auth setup
2. **fuse-ai-pilot:research-expert** - Verify Sanctum/Passport docs via Context7
3. **mcp__context7__query-docs** - Check Laravel authorization patterns

After implementation, run **fuse-ai-pilot:sniper** for validation.

---

## Overview

Laravel provides multiple authentication options:

| Package | Use Case |
|---------|----------|
| **Sanctum** | SPA + mobile API tokens |
| **Passport** | Full OAuth2 server |
| **Fortify** | Backend authentication logic |
| **Socialite** | Social login (Google, GitHub, etc.) |

---

## Critical Rules

1. **Use policies** for model authorization - Not inline checks
2. **Hash passwords** - Use `Hash::make()` or `'hashed'` cast
3. **Verify email** for sensitive actions
4. **Token abilities** - Define specific abilities per token

---

## Reference Guide

### Concepts

| Topic | Reference | When to consult |
|-------|-----------|-----------------|
| **Authentication** | [authentication.md](references/authentication.md) | Login/logout |
| **Authorization** | [authorization.md](references/authorization.md) | Gates & policies |
| **Sanctum** | [sanctum.md](references/sanctum.md) | API tokens |
| **Passport** | [passport.md](references/passport.md) | OAuth2 |
| **Socialite** | [socialite.md](references/socialite.md) | Social login |
| **Email Verification** | [verification.md](references/verification.md) | Email confirm |
| **Password Reset** | [passwords.md](references/passwords.md) | Forgot password |

### Templates

| Template | When to use |
|----------|-------------|
| [PostPolicy.php.md](references/templates/PostPolicy.php.md) | Model policy |
| [sanctum-setup.md](references/templates/sanctum-setup.md) | API auth setup |

---

## Quick Reference

```php
// Policy
$this->authorize('update', $post);

// Gate
Gate::define('admin', fn (User $user) => $user->isAdmin());

// Sanctum token
$token = $user->createToken('api')->plainTextToken;
```
