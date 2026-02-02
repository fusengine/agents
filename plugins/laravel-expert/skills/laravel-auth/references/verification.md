---
name: verification
description: Laravel Email Verification - verify user emails before access
when-to-use: Consult when implementing email verification, verified middleware
keywords: laravel, email, verification, verify, MustVerifyEmail
priority: medium
requires: authentication.md
related: passwords.md, starter-kits.md
---

# Email Verification

## Why Email Verification?

Email verification ensures users:
- Own the email they registered with
- Can receive important notifications
- Are not using fake/disposable emails

Common for financial apps, marketplaces, and sensitive applications.

---

## How It Works

1. User registers with email
2. `Registered` event fires automatically
3. Laravel sends verification email
4. Email contains signed URL
5. User clicks link → email verified
6. `verified` middleware allows access

Laravel handles steps 2-5 automatically when configured.

---

## Enabling Verification

Two steps:

**1. User model implements interface:**
```php
use Illuminate\Contracts\Auth\MustVerifyEmail;

class User extends Authenticatable implements MustVerifyEmail
{
    // ...
}
```

**2. Protect routes with middleware:**
```php
Route::get('/dashboard', ...)->middleware(['auth', 'verified']);
```

---

## Required Routes

| Route | Name | Purpose |
|-------|------|---------|
| `/email/verify` | `verification.notice` | "Check your email" page |
| `/email/verify/{id}/{hash}` | `verification.verify` | Handle verification |
| `/email/verification-notification` | `verification.send` | Resend email |

Starter kits provide these. For custom implementations, define them manually.

---

## The Signed URL

Verification links contain:
- User ID
- Hash of user's email
- Expiration timestamp
- Signature (prevents tampering)

Use `signed` middleware on the verification route for security.

---

## Verification Flow

```
User registers
    ↓
Registered event fires
    ↓
SendEmailVerificationNotification listener
    ↓
Email with signed URL sent
    ↓
User clicks link
    ↓
EmailVerificationRequest validates
    ↓
markEmailAsVerified() called
    ↓
Verified event fires
```

---

## Customizing the Email

Modify the notification content:

```php
// In AppServiceProvider::boot()
VerifyEmail::toMailUsing(function ($notifiable, $url) {
    return (new MailMessage)
        ->subject('Verify Your Email')
        ->line('Click below to verify.')
        ->action('Verify', $url);
});
```

---

## Resending Verification

Allow users to request a new email:

```php
$request->user()->sendEmailVerificationNotification();
```

Rate limit this endpoint (default: 6 per minute).

---

## Events

| Event | When |
|-------|------|
| `Registered` | User registered (triggers email) |
| `Verified` | Email verified |

Listen to `Verified` for post-verification actions.
