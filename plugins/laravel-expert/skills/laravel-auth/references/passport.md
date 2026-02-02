---
name: passport
description: Laravel Passport - full OAuth2 server implementation
when-to-use: Consult when implementing OAuth2, third-party API access
keywords: laravel, passport, oauth2, tokens, authorization, client
priority: medium
requires: authentication.md
related: sanctum.md
---

# Laravel Passport

## When to Use Passport vs Sanctum?

| Need | Use |
|------|-----|
| Simple API tokens | **Sanctum** |
| SPA authentication | **Sanctum** |
| Mobile app tokens | **Sanctum** |
| Third-party app access | **Passport** |
| OAuth2 server | **Passport** |
| Social login (you as provider) | **Passport** |

**Rule of thumb**: If you need to be an OAuth2 provider (like GitHub or Google), use Passport. Otherwise, use Sanctum.

→ See [templates/PassportSetup.php.md](templates/PassportSetup.php.md) for setup

---

## OAuth2 Grant Types Explained

Passport supports multiple OAuth2 flows:

| Grant Type | Use Case | Security |
|------------|----------|----------|
| **Authorization Code** | Web apps (server-side) | High |
| **Authorization Code + PKCE** | Mobile/SPA (public clients) | High |
| **Client Credentials** | Machine-to-machine | High |
| **Device Code** | TVs, game consoles | Medium |
| **Personal Access** | User-generated tokens | Medium |

**Deprecated** (avoid): Password Grant, Implicit Grant.

---

## Authorization Code Flow

This is the standard OAuth2 flow:

1. **Redirect** to `/oauth/authorize` with client_id, scopes
2. User **approves** access
3. Provider **redirects** back with authorization code
4. Your server **exchanges** code for access token
5. Use token in `Authorization: Bearer {token}`

---

## PKCE Flow (For Mobile/SPA)

Same as Authorization Code but:
- No client secret needed (public client)
- Uses `code_verifier` and `code_challenge`
- Prevents authorization code interception attacks

Always use PKCE for mobile apps and SPAs.

---

## Scopes (Token Permissions)

Define what tokens can access:

```php
Passport::tokensCan([
    'user:read' => 'Read user profile',
    'posts:write' => 'Create and edit posts',
]);
```

Check in code:
```php
if ($user->tokenCan('posts:write')) { ... }
```

---

## Token Lifetimes

Configure how long tokens are valid:

```php
Passport::tokensExpireIn(now()->addDays(15));
Passport::refreshTokensExpireIn(now()->addDays(30));
Passport::personalAccessTokensExpireIn(now()->addMonths(6));
```

Shorter lifetimes = better security, use refresh tokens.

---

## Revoking Tokens

```php
$token->revoke();
$token->refreshToken?->revoke();
```

Schedule cleanup:
```php
Schedule::command('passport:purge')->hourly();
```

---

## Testing with Passport

```php
use Laravel\Passport\Passport;

Passport::actingAs(
    User::factory()->create(),
    ['user:read', 'posts:write']
);
```

→ Full setup: [templates/PassportSetup.php.md](templates/PassportSetup.php.md)
