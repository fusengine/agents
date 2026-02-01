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

Laravel's exception handler manages all exceptions thrown by your application. It controls how exceptions are reported (logged) and rendered (shown to users).

## Exception Handler

Located at `bootstrap/app.php`, configure exception handling:

```php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->report(function (Throwable $e) {
        // Custom reporting logic
    });

    $exceptions->render(function (NotFoundHttpException $e) {
        return response()->json(['message' => 'Not found'], 404);
    });
})
```

## Reporting Exceptions

### Custom Reporting

```php
$exceptions->report(function (PaymentException $e) {
    // Send to external service
    Sentry::captureException($e);
});
```

### Stop Propagation

```php
$exceptions->report(function (PaymentException $e) {
    // Handle and stop
})->stop();
```

### Don't Report

```php
$exceptions->dontReport([
    InvalidOrderException::class,
]);
```

## Rendering Exceptions

### Custom Response

```php
$exceptions->render(function (InvalidOrderException $e, Request $request) {
    return response()->view('errors.invalid-order', [], 500);
});
```

### API Responses

```php
$exceptions->render(function (Throwable $e, Request $request) {
    if ($request->expectsJson()) {
        return response()->json([
            'message' => $e->getMessage(),
        ], 500);
    }
});
```

## HTTP Exceptions

```php
abort(404);
abort(403, 'Unauthorized action.');
abort_if(!$user->isAdmin(), 403);
abort_unless($user->isAdmin(), 403);
```

## Custom Exceptions

```php
class InsufficientFundsException extends Exception
{
    public function report(): void
    {
        Log::warning('Insufficient funds', ['user' => auth()->id()]);
    }

    public function render(Request $request): Response
    {
        return response()->json([
            'error' => 'Insufficient funds',
        ], 402);
    }
}
```

## Error Pages

Create custom error views in `resources/views/errors/`:

- `404.blade.php` - Not found
- `403.blade.php` - Forbidden
- `500.blade.php` - Server error
- `503.blade.php` - Maintenance

## API Error Format

Consistent JSON error responses:

```php
$exceptions->render(function (Throwable $e, Request $request) {
    if ($request->expectsJson()) {
        return response()->json([
            'message' => $e->getMessage(),
            'code' => $e->getCode(),
        ], $this->getStatusCode($e));
    }
});
```

## Ignoring Exceptions

```php
$exceptions->dontFlash([
    'password',
    'password_confirmation',
]);
```

## Best Practices

1. **Custom exceptions** - For domain-specific errors
2. **Consistent API format** - Same error structure
3. **Don't expose internals** - Hide stack traces in production
4. **Report to services** - Sentry, Bugsnag in production
5. **User-friendly pages** - Custom error views

## Related References

- [logging.md](logging.md) - Logging exceptions
- [configuration.md](configuration.md) - Debug mode
