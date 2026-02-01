---
name: context
description: Laravel Context for request-scoped data sharing
when-to-use: Sharing data across request lifecycle, logging context
keywords: laravel, php, context, request, scope
priority: low
related: logging.md, errors.md
---

# Context

## Overview

Laravel Context allows sharing data throughout the request lifecycle - across services, jobs, logs, and more. It's useful for request IDs, user info, and debugging data.

## Basic Usage

```php
use Illuminate\Support\Facades\Context;

// Add data
Context::add('request_id', Str::uuid());
Context::add('user_id', auth()->id());

// Get data
$requestId = Context::get('request_id');

// Check existence
if (Context::has('user_id')) {
    // ...
}

// Get all
$all = Context::all();
```

## Adding Context

```php
// Single value
Context::add('key', 'value');

// Multiple values
Context::add([
    'request_id' => $requestId,
    'user_id' => $userId,
]);

// Only if missing
Context::addIf('key', 'value');
```

## Retrieving Context

```php
// Get single
$value = Context::get('key');

// With default
$value = Context::get('key', 'default');

// Get multiple
$data = Context::only(['request_id', 'user_id']);

// Pull (get and remove)
$value = Context::pull('key');
```

## Removing Context

```php
// Remove single
Context::forget('key');

// Remove all
Context::flush();
```

## Hidden Context

Store sensitive data that won't appear in logs:

```php
Context::addHidden('api_token', $token);
$token = Context::getHidden('api_token');
```

## Context in Logs

Context is automatically included in logs:

```php
Context::add('request_id', Str::uuid());
Log::info('Processing order'); // Includes request_id
```

## Context in Jobs

Push context to queued jobs:

```php
Context::add('user_id', auth()->id());

// Context available in job
dispatch(new ProcessOrder($order));
```

## Middleware Example

```php
class AddRequestContext
{
    public function handle(Request $request, Closure $next)
    {
        Context::add([
            'request_id' => Str::uuid(),
            'ip' => $request->ip(),
            'url' => $request->fullUrl(),
        ]);

        return $next($request);
    }
}
```

## Dehydrating/Hydrating

For custom serialization:

```php
Context::dehydrating(function (Repository $context) {
    return $context->only(['request_id']);
});

Context::hydrating(function (Repository $context, array $data) {
    $context->add($data);
});
```

## Best Practices

1. **Request ID** - Add unique ID early in request
2. **User context** - Add after authentication
3. **Hide sensitive** - Use `addHidden()` for tokens
4. **Clean up** - Context is cleared after request

## Related References

- [logging.md](logging.md) - Contextual logging
- [errors.md](errors.md) - Context in error reports
