---
name: http-client
description: Laravel HTTP Client for consuming external APIs
when-to-use: Making HTTP requests to external services
keywords: laravel, php, http client, guzzle, api
priority: medium
related: responses.md
---

# HTTP Client

## Overview

Laravel's HTTP Client wraps Guzzle with a clean, expressive API for making HTTP requests to external services. Use it for consuming third-party APIs, webhooks, and microservice communication.

## Why Use HTTP Client

| Benefit | Description |
|---------|-------------|
| **Fluent API** | Clean, chainable methods |
| **Retries** | Built-in retry with backoff |
| **Faking** | Easy mocking for tests |
| **Concurrency** | Parallel requests with pools |
| **Macros** | Define reusable client configurations |

## Basic Requests

| Method | Purpose |
|--------|---------|
| `Http::get($url)` | GET request |
| `Http::post($url, $data)` | POST with data |
| `Http::put($url, $data)` | PUT request |
| `Http::patch($url, $data)` | PATCH request |
| `Http::delete($url)` | DELETE request |

## Request Options

**Headers** set custom headers including Authorization.

**Timeout** defines maximum seconds to wait for response.

**Retry** automatically retries failed requests with exponential backoff.

**Base URL** sets prefix for all URLs, useful for API clients.

## Authentication

| Method | Use case |
|--------|----------|
| `->withToken($token)` | Bearer token auth |
| `->withBasicAuth($user, $pass)` | Basic auth |
| `->withDigestAuth($user, $pass)` | Digest auth |
| `->withHeaders(['X-API-Key' => $key])` | API key in header |

## Response Handling

| Method | Returns |
|--------|---------|
| `$response->json()` | Decoded JSON as array |
| `$response->json('data.user')` | Nested value with dot notation |
| `$response->body()` | Raw string body |
| `$response->status()` | HTTP status code |
| `$response->successful()` | Status 200-299 |
| `$response->failed()` | Status 400+ |
| `$response->headers()` | Response headers |

## Error Handling

By default, client doesn't throw on 4xx/5xx. Use `throw()` to throw exceptions on errors:

```php
$response = Http::timeout(10)->get($url)->throw();
```

Or check status manually with `$response->successful()` / `$response->failed()`.

## Retries

Retry failed requests with exponential backoff:

```php
Http::retry(3, 100)->get($url); // 3 attempts, 100ms between
```

Customize which exceptions trigger retry with a callback.

## Concurrent Requests

Use pools for parallel requests:

```php
$responses = Http::pool(fn (Pool $pool) => [
    $pool->get('https://api.example.com/users'),
    $pool->get('https://api.example.com/posts'),
]);
```

Each response is accessible by index.

## Testing / Faking

Fake responses in tests without hitting real APIs:

```php
Http::fake([
    'api.example.com/*' => Http::response(['data' => []], 200),
]);
```

Use `Http::assertSent()` to verify requests were made correctly.

## Macros

Define reusable client configurations:

```php
// In AppServiceProvider
Http::macro('github', fn () => Http::withToken(config('services.github.token'))
    ->baseUrl('https://api.github.com')
);

// Usage
Http::github()->get('/repos/laravel/laravel');
```

## Best Practices

1. **Use timeouts** - Always set reasonable timeout
2. **Use retries** - For unreliable external services
3. **Fake in tests** - Never hit real APIs in tests
4. **Use macros** - For repeated configurations
5. **Handle errors** - Check response status or use throw()

## Related Templates

| Template | Purpose |
|----------|---------|
| [HttpClientService.php.md](templates/HttpClientService.php.md) | Reusable API client service |

## Related References

- [responses.md](responses.md) - Handling your own API responses
