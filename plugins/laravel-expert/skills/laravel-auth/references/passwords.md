---
name: passwords
description: Laravel password reset - request link, reset password, tokens
when-to-use: Consult when implementing forgot password, password reset flow
keywords: laravel, password, reset, forgot, token, email, notification
priority: medium
requires: authentication.md
related: verification.md, fortify.md
---

# Resetting Passwords

## How Password Reset Works

Laravel's password reset follows a secure flow:

1. **User requests reset** - Submits email address
2. **Token generated** - Unique, time-limited token created
3. **Email sent** - Contains link with token
4. **User clicks link** - Redirected to reset form
5. **Password updated** - Token validated, password changed

The `Password` facade orchestrates this entire flow.

→ See [templates/PasswordResetController.php.md](templates/PasswordResetController.php.md) for code

---

## Storage Drivers

Where tokens are stored:

| Driver | Storage | Use Case |
|--------|---------|----------|
| `database` | SQL table | Default, reliable |
| `cache` | Redis/Memcached | Faster, no migration |

Configure in `config/auth.php` under `passwords`.

---

## Token Lifecycle

| Setting | Default | Purpose |
|---------|---------|---------|
| `expire` | 60 min | Token validity |
| `throttle` | 60 sec | Between requests |

Short expiration = better security.

---

## Required Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/forgot-password` | GET | Show request form |
| `/forgot-password` | POST | Send reset link |
| `/reset-password/{token}` | GET | Show reset form |
| `/reset-password` | POST | Process reset |

---

## The Password Facade

Key methods:

```php
// Send reset link
Password::sendResetLink(['email' => $email]);

// Process reset
Password::reset($credentials, function ($user, $password) {
    $user->password = Hash::make($password);
    $user->save();
});
```

---

## Status Responses

The facade returns status constants:

| Constant | Meaning |
|----------|---------|
| `Password::ResetLinkSent` | Email sent |
| `Password::PasswordReset` | Success |
| `Password::InvalidUser` | User not found |
| `Password::InvalidToken` | Token expired/invalid |
| `Password::ResetThrottled` | Too many requests |

Translate with `__($status)` for user-friendly messages.

---

## Token Cleanup

Expired tokens accumulate. Clean them:

```shell
php artisan auth:clear-resets
```

Schedule it:
```php
Schedule::command('auth:clear-resets')->everyFifteenMinutes();
```

---

## Customizing the Email

Override the notification in your User model:

```php
public function sendPasswordResetNotification($token): void
{
    $this->notify(new CustomResetNotification($token));
}
```

→ Full implementation: [templates/PasswordResetController.php.md](templates/PasswordResetController.php.md)
