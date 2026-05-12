---
name: breaking-changes
description: All mandatory breaking changes from L12 to L13
when-to-use: Phase 3 (apply mandatory fixes)
keywords: breaking, csrf, cache, eloquent, queue, symfony
---

# Breaking Changes (L12 → L13)

## 1. PHP 8.3 minimum

PHP 8.2 dropped. Use typed constants and `#[\Override]` attribute now available.

## 2. VerifyCsrfToken → PreventRequestForgery

Middleware renamed. Origin-aware validation added.

```php
// Before (L12) — bootstrap/app.php
->withMiddleware(function (Middleware $middleware) {
    $middleware->validateCsrfTokens(except: ['stripe/*']);
})

// After (L13)
->withMiddleware(function (Middleware $middleware) {
    $middleware->validateOrigin(except: ['stripe/*']);
})
```

Token-based CSRF still works (backward-compatible).

## 3. Cache prefixes hyphenated

```env
# L12 default
CACHE_PREFIX=laravel_cache_
REDIS_PREFIX=laravel_database_

# L13 default (hyphens replace underscores)
CACHE_PREFIX=laravel-cache-
REDIS_PREFIX=laravel-database-
```

**Action**: explicitly set `CACHE_PREFIX`, `REDIS_PREFIX`, `SESSION_COOKIE` to preserve warm caches across deploy.

## 4. `cache.serializable_classes` config

New config in `config/cache.php`:

```php
'serializable_classes' => false,  // L13 default — hardens against gadget chains
```

Set to `true` only if you need to cache complex objects (security risk).

## 5. Eloquent boot LogicException

```php
// L12 — worked silently
public function register(): void {
    $model = new User(); // ❌ L13 throws LogicException
}

// L13 — defer model instantiation
public function boot(): void {
    $model = new User(); // ✅ OK in boot()
}
```

## 6. PHPUnit 11 → 12

Some mocks removed. Check release notes: https://github.com/sebastianbergmann/phpunit/blob/12.0/ChangeLog-12.0.md

## 7. Pest 3 → 4

Architecture and pendingTests behavior changes. Migrate via:

```bash
vendor/bin/pest --init  # regenerate phpunit.xml
```

## 8. Symfony 7.4 / 8.0

Symfony 7.3 dropped. Check `vendor/symfony/console/CHANGELOG.md`.

## 9. `laravel/serializable-closure` v2 required

v1 dropped — bump via `composer require laravel/serializable-closure:^2.0`.

## 10. `pda/pheanstalk` 8.0+ required

For Beanstalkd: `composer require pda/pheanstalk:^8.0`.

## 11. `QueueBusy` event property renamed

Check listeners using this event.

## 12. `Dispatcher` contract: `dispatchAfterResponse()` added

Custom dispatcher implementations must implement this method.

## 13. `Str` factories reset between tests

Was persistent in L12, now scoped per test. Update tests relying on global Str overrides.

## Validation

```bash
php artisan about               # confirms L13.x
vendor/bin/pest                 # tests pass
php artisan migrate --pretend   # migrations valid
php artisan config:clear        # avoid stale cache
```
