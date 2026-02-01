---
name: errors
description: Laravel error and exception handling
when-to-use: Handling exceptions, custom error pages, reporting
keywords: laravel, php, errors, exceptions, handling
priority: high
related: logging.md, configuration.md
---

# Error Handling

## Overview

Laravel's exception handler manages how exceptions are reported (logged) and rendered (shown to users).

## Configuration

In `bootstrap/app.php`:

```php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->report(function (Throwable $e) {
        // Custom reporting
    });

    $exceptions->render(function (NotFoundHttpException $e) {
        return response()->json(['message' => 'Not found'], 404);
    });
})
```

## Reporting

```php
$exceptions->report(function (PaymentException $e) {
    Sentry::captureException($e);
})->stop();  // Stop propagation

$exceptions->dontReport([InvalidOrderException::class]);
```

## Rendering

```php
$exceptions->render(function (InvalidOrderException $e, Request $request) {
    return response()->view('errors.invalid-order', [], 500);
});

// API responses
$exceptions->render(function (Throwable $e, Request $request) {
    if ($request->expectsJson()) {
        return response()->json(['message' => $e->getMessage()], 500);
    }
});
```

## HTTP Exceptions

```php
abort(404);
abort(403, 'Unauthorized.');
abort_if(!$user->isAdmin(), 403);
abort_unless($user->isAdmin(), 403);
```

## Custom Exceptions

```php
class InsufficientFundsException extends Exception
{
    public function report(): void
    {
        Log::warning('Insufficient funds');
    }

    public function render(Request $request): Response
    {
        return response()->json(['error' => 'Insufficient funds'], 402);
    }
}
```

## Error Pages

Create in `resources/views/errors/`:
- `404.blade.php`, `403.blade.php`, `500.blade.php`, `503.blade.php`

## Best Practices

1. **Custom exceptions** - For domain errors
2. **Consistent API format** - Same error structure
3. **Hide internals** - No stack traces in production
4. **Report to services** - Sentry, Bugsnag

## Related References

- [logging.md](logging.md) - Logging exceptions
