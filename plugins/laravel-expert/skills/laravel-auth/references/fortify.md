---
name: fortify
description: Laravel Fortify - headless authentication backend
when-to-use: Consult when building custom auth UI, implementing 2FA
keywords: laravel, fortify, authentication, 2fa, registration, headless
priority: medium
requires: authentication.md
related: sanctum.md, starter-kits.md
---

# Laravel Fortify

## What is Fortify?

Fortify is a **headless** authentication backend - it provides all the logic without any UI:

- Login, registration, logout
- Password reset, email verification
- Two-factor authentication (2FA)
- Profile updates

**Key insight**: Starter Kits (Breeze, Jetstream) use Fortify internally. If you're using a starter kit, you already have Fortify.

→ See [templates/FortifySetup.php.md](templates/FortifySetup.php.md) for setup

---

## When to Use Fortify?

| Scenario | Recommendation |
|----------|---------------|
| Starting fresh | Use a Starter Kit instead |
| Custom frontend (React, Vue, etc.) | ✅ Use Fortify |
| API-only backend | ✅ Use Fortify (views disabled) |
| Need 2FA support | ✅ Use Fortify |
| Using starter kit | Already included |

---

## How Fortify Works

1. **Registers routes** for all auth actions
2. **Provides controllers** that handle the logic
3. **You provide views** (or disable for API)
4. **Customization via Actions** classes

Fortify does the heavy lifting; you handle the presentation.

---

## Features Configuration

Enable only what you need in `config/fortify.php`:

```php
'features' => [
    Features::registration(),
    Features::resetPasswords(),
    Features::emailVerification(),
    Features::twoFactorAuthentication(),
],
```

Each feature adds relevant routes and functionality.

---

## Two-Factor Authentication

Fortify provides complete 2FA support:

1. User enables 2FA → QR code generated
2. User scans with authenticator app
3. On login, 2FA challenge appears
4. User enters code from app
5. Recovery codes available as backup

**Endpoints provided:**
- Enable/disable 2FA
- Get QR code
- Get/regenerate recovery codes
- 2FA challenge page

---

## Customizing Authentication Logic

Override default behavior with custom Actions:

```
app/Actions/Fortify/
├── CreateNewUser.php         # Registration logic
├── ResetUserPassword.php     # Password reset
├── UpdateUserPassword.php    # Password change
└── UpdateUserProfileInformation.php  # Profile update
```

Modify these files to customize validation, fields, etc.

---

## SPA/API Mode

Disable views for headless API:

```php
// config/fortify.php
'views' => false,
```

Routes still work - they return JSON responses for XHR requests.

---

## View Registration

For custom frontend with views:

```php
// FortifyServiceProvider
Fortify::loginView(fn () => view('auth.login'));
Fortify::registerView(fn () => view('auth.register'));
Fortify::twoFactorChallengeView(fn () => view('auth.2fa'));
```

→ Full setup: [templates/FortifySetup.php.md](templates/FortifySetup.php.md)
