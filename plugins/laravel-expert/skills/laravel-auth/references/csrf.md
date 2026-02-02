---
name: csrf
description: Laravel CSRF Protection - preventing cross-site request forgery
when-to-use: Consult when working with forms, AJAX requests, or API security
keywords: laravel, csrf, token, forms, security, xsrf, ajax
priority: medium
related: session.md, sanctum.md
---

# CSRF Protection

## What is CSRF?

Cross-Site Request Forgery (CSRF) tricks authenticated users into performing unwanted actions. Example: A malicious site submits a hidden form to your `/user/email` endpoint, changing the victim's email.

Laravel protects against this by requiring a secret token with each state-changing request.

---

## How It Works

1. Laravel generates a **unique token** per session
2. Token stored in session and `XSRF-TOKEN` cookie
3. Your forms include the token (hidden field)
4. Laravel validates token on POST/PUT/PATCH/DELETE
5. Invalid token → 419 HTTP error

---

## Blade Forms

Use the `@csrf` directive in all forms:

```blade
<form method="POST" action="/profile">
    @csrf
    <!-- form fields -->
</form>
```

This generates a hidden `_token` input automatically.

---

## AJAX Requests

Two approaches:

**Option 1: Meta tag + JavaScript**
```blade
<meta name="csrf-token" content="{{ csrf_token() }}">
```

```javascript
// Axios (automatic)
axios.defaults.headers.common['X-CSRF-TOKEN'] =
    document.querySelector('meta[name="csrf-token"]').content;

// Fetch
fetch('/api/endpoint', {
    headers: { 'X-CSRF-TOKEN': csrfToken }
});
```

**Option 2: XSRF-TOKEN cookie (automatic)**

Axios and Angular automatically read the `XSRF-TOKEN` cookie and send it as `X-XSRF-TOKEN` header.

---

## Excluding Routes

Some routes shouldn't have CSRF protection (webhooks, external APIs):

```php
// bootstrap/app.php
->withMiddleware(function (Middleware $middleware): void {
    $middleware->validateCsrfTokens(except: [
        'stripe/*',
        'webhook/*',
    ]);
})
```

Or place routes outside the `web` middleware group.

---

## SPAs and APIs

For SPAs, use **Laravel Sanctum** instead of CSRF tokens:
- SPA auth uses session cookies (CSRF automatic)
- API tokens don't need CSRF (stateless)

See [sanctum.md](sanctum.md) for details.

---

## Token Mismatch Errors

**419 "Page Expired"** means:
- Token missing from request
- Token doesn't match session
- Session expired

**Fixes:**
- Ensure `@csrf` in forms
- Check session configuration
- Verify cookie settings
