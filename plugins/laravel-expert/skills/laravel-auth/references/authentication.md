---
name: authentication
description: Laravel Authentication concepts - guards, providers, login flow
when-to-use: Consult when implementing login/logout, understanding auth architecture
keywords: laravel, authentication, login, logout, guards, providers, session
priority: high
related: authorization.md, sanctum.md, fortify.md
---

# Authentication

## What is Laravel Authentication?

Laravel authentication is built around two core concepts that work together:

**Guards** determine HOW users are authenticated for each request:
- `session` guard: Uses cookies and session storage (web apps)
- `token` guard: Uses API tokens in headers (APIs)

**Providers** determine WHERE users are retrieved from:
- `eloquent` provider: Queries your User model
- `database` provider: Direct database queries

This separation allows flexible authentication strategies.

→ See [templates/LoginController.php.md](templates/LoginController.php.md) for complete implementation

---

## When to Use What?

| Scenario | Recommended Approach |
|----------|---------------------|
| Traditional web app | Session guard + Starter Kit |
| SPA on same domain | Sanctum SPA authentication |
| Mobile app | Sanctum API tokens |
| Third-party API access | Passport OAuth2 |
| Custom auth UI | Fortify backend |

---

## Authentication Flow

Understanding the flow helps debug issues:

1. **User submits credentials** (email/password)
2. **Guard validates** via `Auth::attempt()`
3. **Session regenerated** (prevents fixation attacks)
4. **CSRF token regenerated** (security)
5. **User is logged in** and redirected

On subsequent requests:
1. Session cookie sent with request
2. Guard checks session for user ID
3. Provider retrieves user from database
4. `Auth::user()` returns the authenticated user

---

## Key Methods to Know

| Method | Purpose | Returns |
|--------|---------|---------|
| `Auth::attempt($credentials)` | Validate and login | bool |
| `Auth::login($user)` | Login a user instance | void |
| `Auth::logout()` | End the session | void |
| `Auth::check()` | Is someone logged in? | bool |
| `Auth::user()` | Get current user | User\|null |
| `Auth::id()` | Get current user ID | int\|null |

---

## Protecting Routes

The `auth` middleware redirects unauthenticated users:

```php
Route::get('/dashboard', DashboardController::class)
    ->middleware('auth');
```

For APIs, specify the guard:
```php
Route::middleware('auth:sanctum')->group(function () {
    // API routes requiring authentication
});
```

---

## Remember Me Functionality

When users check "Remember me", Laravel stores a token for extended sessions:

- Token stored in `remember_token` column
- Cookie persists beyond browser close
- Check with `Auth::viaRemember()` if needed

---

## Multiple Guards

Useful when you have different user types (admin vs customer):

```php
// Define in config/auth.php, then use:
Auth::guard('admin')->attempt($credentials);
Auth::guard('admin')->user();
```

---

## Security Considerations

1. **Always regenerate session** after login (Laravel does this)
2. **Invalidate session** on logout
3. **Rate limit** login attempts
4. **Use HTTPS** in production

→ Complete code examples: [templates/LoginController.php.md](templates/LoginController.php.md)
