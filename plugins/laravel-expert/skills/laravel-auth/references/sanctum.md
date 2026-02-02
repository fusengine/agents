---
name: sanctum
description: Laravel Sanctum - lightweight API and SPA authentication
when-to-use: Consult when implementing API tokens, SPA authentication
keywords: laravel, sanctum, api, tokens, spa, authentication, mobile
priority: high
requires: authentication.md
related: passport.md, fortify.md
---

# Laravel Sanctum

## What is Sanctum?

Sanctum is Laravel's lightweight authentication package that provides:

1. **API Tokens** - For mobile apps and third-party integrations
2. **SPA Authentication** - Cookie-based for same-domain SPAs

**Key insight**: Use Sanctum for most apps. Only use Passport when you need a full OAuth2 server for third-party authentication.

→ See [templates/sanctum-setup.md](templates/sanctum-setup.md) for setup

---

## API Tokens vs SPA Auth: Which to Use?

| Scenario | Use This |
|----------|----------|
| Mobile app (iOS/Android) | API Tokens |
| Third-party integration | API Tokens |
| React/Vue SPA on same domain | SPA Authentication |
| SPA on different domain | API Tokens |

**Why SPA auth is preferred for first-party SPAs:**
- No token to store in JavaScript (XSS-safe)
- Uses existing Laravel session
- CSRF protection built-in

---

## How API Tokens Work

1. User authenticates with credentials
2. Server generates a token (hashed in DB)
3. Client stores token securely
4. Client sends token in `Authorization: Bearer {token}` header
5. Sanctum validates and authenticates

Tokens are SHA-256 hashed before storage.

---

## Token Abilities (Scopes)

Limit what tokens can do:

```php
$token = $user->createToken('mobile', ['posts:read', 'posts:write']);

// Later, check abilities:
if ($user->tokenCan('posts:write')) {
    // Can write posts
}
```

This follows the principle of least privilege.

---

## How SPA Authentication Works

1. SPA requests CSRF cookie from `/sanctum/csrf-cookie`
2. SPA sends login request with credentials
3. Laravel authenticates and creates session
4. Subsequent requests use session cookie (not tokens)

**Requirements:**
- SPA and API on same top-level domain
- `statefulApi()` middleware enabled
- Proper CORS configuration

---

## Token Expiration

Control how long tokens are valid:

```php
// Global setting in config/sanctum.php
'expiration' => 525600,  // minutes (1 year)

// Per-token expiration
$token = $user->createToken('temp', ['*'], now()->addHour());
```

Schedule pruning of expired tokens:
```php
Schedule::command('sanctum:prune-expired --hours=24')->daily();
```

---

## When to Revoke Tokens

- User changes password
- User explicitly logs out
- Security concern detected
- Token compromised

Revoke all tokens:
```php
$user->tokens()->delete();
```

Revoke current token:
```php
$request->user()->currentAccessToken()->delete();
```

---

## Testing with Sanctum

```php
use Laravel\Sanctum\Sanctum;

Sanctum::actingAs(
    User::factory()->create(),
    ['posts:read']  // Token abilities for this test
);
```

→ Complete setup: [templates/sanctum-setup.md](templates/sanctum-setup.md)
